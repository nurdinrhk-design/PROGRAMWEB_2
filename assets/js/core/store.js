/* =====================================================================
   store.js — Satu-satunya pintu baca/tulis data (D-03, D-21)
   Namespace: PPDB.store
   - Data di localStorage; jika diblokir, jatuh ke memori (R-04)
   - Semua data yang masuk disaring (whitelist kolom, tipe, panjang)
   - Setiap perubahan memicu event window 'ppdb:change' dan tercatat di log
   ===================================================================== */
(function (window) {
  'use strict';

  var PPDB = window.PPDB = window.PPDB || {};
  var R = PPDB.rules;

  var KEY = {
    meta: 'ppdb.v2.meta',
    pendaftar: 'ppdb.v2.pendaftar',
    verifikasi: 'ppdb.v2.verifikasi',
    log: 'ppdb.v2.log',
    akun: 'ppdb.v2.akun'
  };
  var VERSI = 3;                      // 3: akun orang tua + sumber pendaftaran (Tahap 14)
  var LOG_MAKS = 100;                 // BR-12
  var IMPOR_MAKS_BYTE = 5 * 1024 * 1024;
  var IMPOR_MAKS_DATA = 5000;
  var FORMAT_CADANGAN = 'ppdb-admin-cadangan';

  // Kolom yang memengaruhi kelayakan/peringkat. Jika berubah pada data yang
  // sudah diperiksa, status kembali "menunggu" untuk diverifikasi ulang.
  var KOLOM_SELEKSI = ['jalur', 'jarakMeter', 'nilaiRapor', 'prestasiTingkat', 'tglTerbitKk', 'tglLahir'];

  var state = null;
  var persistent = true;
  var memori = {};
  var urut = 0;

  /* ---------- Penyimpanan aman ---------- */
  function baca(key) {
    try {
      var raw = window.localStorage.getItem(key);
      return raw === null ? null : JSON.parse(raw);
    } catch (e) {
      persistent = false;
      return memori.hasOwnProperty(key) ? memori[key] : null;
    }
  }

  function tulis(key, nilai) {
    memori[key] = nilai;
    try {
      window.localStorage.setItem(key, JSON.stringify(nilai));
    } catch (e) {
      persistent = false;
    }
  }

  function simpan(bagian) {
    (bagian || ['pendaftar', 'verifikasi', 'log', 'akun']).forEach(function (k) { tulis(KEY[k], state[k]); });
  }

  function beritahu(tipe) {
    window.dispatchEvent(new CustomEvent('ppdb:change', { detail: { tipe: tipe } }));
  }

  function pad(n, len) {
    return String(n).padStart(len, '0');
  }

  function isoWaktu(date) {
    return R.isoTanggal(date) + 'T' + pad(date.getHours(), 2) + ':' + pad(date.getMinutes(), 2) + ':' + pad(date.getSeconds(), 2);
  }

  function idUnik(awalan) {
    urut += 1;
    return awalan + Date.now().toString(36) + pad(urut, 3);
  }

  /* ---------- Penyaring data ---------- */
  function teks(v, maks) {
    return String(v === undefined || v === null ? '' : v).replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, maks);
  }

  function angka(v, min, max, desimal) {
    var n = Number(String(v).replace(',', '.'));
    if (!isFinite(n)) return null;
    n = Math.min(Math.max(n, min), max);
    var f = Math.pow(10, desimal || 0);
    return Math.round(n * f) / f;
  }

  function saringBerkas(daftar, jalurKode, tingkat, sebelumnya) {
    var lama = {};
    (sebelumnya || []).forEach(function (b) { lama[b.jenis] = b; });
    var masuk = {};
    (Array.isArray(daftar) ? daftar : []).forEach(function (b) {
      if (b && R.BERKAS.hasOwnProperty(b.jenis)) masuk[b.jenis] = b;
    });
    return R.berkasWajib(jalurKode, tingkat).map(function (jenis) {
      var b = masuk[jenis] || lama[jenis] || {};
      return {
        jenis: jenis,
        namaFile: teks(b.namaFile, 120),
        ukuranKb: angka(b.ukuranKb, 0, R.BERKAS_MAKS_KB, 0) || 0,
        hasilCek: ['belum', 'sesuai', 'tidak_sesuai'].indexOf(b.hasilCek) > -1 ? b.hasilCek : 'belum'
      };
    });
  }

  // Nilai rapor semester 1–5: tepat 5 angka 0–100, selain itu dianggap tidak tercatat
  function saringSemester(daftar) {
    if (!Array.isArray(daftar) || daftar.length !== R.JUMLAH_SEMESTER) return [];
    var hasil = daftar.map(function (v) { return angka(v, 0, 100, 2); });
    return hasil.every(function (n) { return n !== null; }) ? hasil : [];
  }

  // Menyaring isian formulir menjadi objek pendaftar yang bersih
  function saringIsian(d, sebelumnya) {
    var jalurKode = R.jalur(d.jalur) ? d.jalur : (sebelumnya ? sebelumnya.jalur : 'zonasi');
    var tingkat = R.PRESTASI_BONUS.hasOwnProperty(d.prestasiTingkat) ? d.prestasiTingkat : '';
    var semester = saringSemester(d.nilaiSemester);
    return {
      nama: teks(d.nama, 80),
      nisn: teks(d.nisn, 10),
      jk: d.jk === 'P' ? 'P' : 'L',
      tempatLahir: teks(d.tempatLahir, 60),
      tglLahir: R.parseTanggal(d.tglLahir) ? d.tglLahir : '',
      alamat: teks(d.alamat, 160),
      kelurahan: teks(d.kelurahan, 60),
      kecamatan: teks(d.kecamatan, 60),
      tglTerbitKk: R.parseTanggal(d.tglTerbitKk) ? d.tglTerbitKk : '',
      jarakMeter: angka(d.jarakMeter, 1, 50000, 0) || 1,
      jalur: jalurKode,
      sekolahAsal: R.sekolahAsal(d.sekolahAsal) ? d.sekolahAsal : '',
      tahunLulus: /^\d{4}$/.test(String(d.tahunLulus)) ? String(d.tahunLulus) : '',
      // Rata-rata dihitung dari nilai semester bila tercatat (BR-04)
      nilaiSemester: semester,
      nilaiRapor: semester.length ? R.rataRapor(semester) : (angka(d.nilaiRapor, 0, 100, 2) || 0),
      prestasiTingkat: tingkat,
      prestasiNama: tingkat ? teks(d.prestasiNama, 100) : '',
      namaOrtu: teks(d.namaOrtu, 80),
      noHp: String(d.noHp || '').replace(/\D/g, '').slice(0, 13),
      berkas: saringBerkas(d.berkas, jalurKode, tingkat, sebelumnya && sebelumnya.berkas)
    };
  }

  /* ---------- Inisialisasi ---------- */
  function init() {
    if (state) return state;
    var meta = baca(KEY.meta);
    var pendaftar = baca(KEY.pendaftar);
    if (!meta || meta.versi !== VERSI || !Array.isArray(pendaftar)) {
      isiUlang();
    } else {
      state = {
        pendaftar: pendaftar,
        verifikasi: baca(KEY.verifikasi) || [],
        log: baca(KEY.log) || [],
        akun: baca(KEY.akun) || []
      };
    }
    return state;
  }

  function isiUlang() {
    var data = PPDB.seed.generate();
    state = { pendaftar: data.pendaftar, verifikasi: data.verifikasi, log: data.log, akun: data.akun };
    tulis(KEY.meta, { versi: VERSI, seed: PPDB.seed.SEED, dibuat: isoWaktu(new Date()) });
    simpan();
  }

  // Sinkron dengan tab lain yang membuka aplikasi yang sama
  window.addEventListener('storage', function (e) {
    if (!e.key || e.key.indexOf('ppdb.v2.') !== 0 || e.key === 'ppdb.v2.session' || e.key === 'ppdb.v2.pref') return;
    state = null;
    init();
    beritahu('sinkron');
  });

  /* ---------- Baca ---------- */
  function semua() {
    return init().pendaftar;
  }

  function ambil(id) {
    var list = semua();
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  function nisnDipakai(nisn, kecualiId) {
    return semua().some(function (p) { return p.nisn === nisn && p.id !== kecualiId; });
  }

  function hitungStatus() {
    var hasil = { menunggu: 0, perbaikan: 0, terverifikasi: 0, ditolak: 0, total: 0 };
    semua().forEach(function (p) { hasil[p.status] += 1; hasil.total += 1; });
    return hasil;
  }

  /* ---------- Akun orang tua (Tahap 14) ---------- */
  function akunSemua() {
    return init().akun;
  }

  function akunAmbil(id) {
    return akunSemua().filter(function (a) { return a.id === id; })[0] || null;
  }

  function akunEmail(email) {
    var e = String(email || '').trim().toLowerCase();
    return akunSemua().filter(function (a) { return a.email === e; })[0] || null;
  }

  function pendaftarAkun(akunId) {
    return semua().filter(function (p) { return akunId && p.akunId === akunId; });
  }

  /**
   * Menyimpan akun baru. Hash & salt kata sandi dibuat pemanggil (Web Crypto).
   * @returns {{ok: boolean, error?: string, data?: Object}}
   */
  function tambahAkun(d) {
    var nama = teks(d.nama, 80);
    var email = teks(d.email, 80).toLowerCase();
    var err = R.validasi.nama(nama, 'Nama orang tua/wali') || R.validasi.email(email, function (e) { return !!akunEmail(e); }) ||
      R.validasi.noHp(d.noHp);
    if (err) return { ok: false, error: err };
    if (!/^[A-Za-z0-9+/=]{16,100}$/.test(d.salt || '') || !/^[A-Za-z0-9+/=]{40,100}$/.test(d.sandiHash || '')) {
      return { ok: false, error: 'Data kata sandi tidak valid.' };
    }
    var maks = akunSemua().reduce(function (m, a) { var n = Number(a.id.slice(3)); return n > m ? n : m; }, 0);
    var a = {
      id: 'ak-' + pad(maks + 1, 4), nama: nama, email: email,
      noHp: String(d.noHp).replace(/\D/g, '').slice(0, 13),
      salt: d.salt, sandiHash: d.sandiHash, dibuat: isoWaktu(R.now())
    };
    akunSemua().push(a);
    simpan(['akun']);
    catatLog('akun', 'Akun orang tua baru: ' + a.nama);
    beritahu('akun');
    return { ok: true, data: a };
  }

  function riwayat(pendaftarId) {
    return init().verifikasi.filter(function (v) { return v.pendaftarId === pendaftarId; })
      .sort(function (a, b) { return a.waktu < b.waktu ? 1 : -1; });
  }

  function daftarLog(batas) {
    return init().log.slice(0, batas || LOG_MAKS);
  }

  /* ---------- Log (BR-12) ---------- */
  function catatLog(tipe, pesan) {
    init().log.unshift({ id: idUnik('lg-'), waktu: isoWaktu(R.now()), tipe: tipe, pesan: teks(pesan, 200) });
    state.log = state.log.slice(0, LOG_MAKS);
    simpan(['log']);
  }

  /* ---------- Tulis ---------- */
  function nomorBerikutnya() {
    var maks = semua().reduce(function (m, p) {
      var n = Number(p.id.slice(3));
      return n > m ? n : m;
    }, 0);
    return pad(maks + 1, 4);
  }

  /**
   * @param {Object} isian
   * @param {{akunId?: string}} [opsi] akunId diisi bila didaftarkan orang tua (online)
   */
  function tambah(isian, opsi) {
    var akunId = opsi && akunAmbil(opsi.akunId) ? opsi.akunId : '';
    if (akunId && pendaftarAkun(akunId).length >= R.MAKS_ANAK) return null;
    var no = nomorBerikutnya();
    var data = saringIsian(isian, null);
    var waktu = isoWaktu(R.now());
    data.id = 'pd-' + no;
    data.noDaftar = 'PPDB-2026-' + no;
    data.status = 'menunggu';
    data.tglDaftar = waktu;
    data.updatedAt = waktu;
    data.akunId = akunId;
    data.sumber = akunId ? 'online' : 'loket';
    semua().push(data);
    simpan(['pendaftar']);
    catatLog('tambah', 'Pendaftar baru (' + R.SUMBER[data.sumber].label.toLowerCase() + '): ' + data.nama + ' (' + data.noDaftar + ')');
    beritahu('tambah');
    return data;
  }

  /**
   * @param {{kirimUlang?: boolean}} [opsi] kirimUlang: orang tua memperbaiki data
   *   berstatus "perlu perbaikan" → status kembali "menunggu" (Tahap 14)
   */
  function ubah(id, isian, opsi) {
    var p = ambil(id);
    if (!p) return null;
    var baru = saringIsian(isian, p);
    var kirimUlang = !!(opsi && opsi.kirimUlang) && p.status === 'perbaikan';
    var perluUlang = p.status !== 'menunggu' && KOLOM_SELEKSI.some(function (k) { return String(p[k]) !== String(baru[k]); });
    Object.keys(baru).forEach(function (k) { p[k] = baru[k]; });
    if (perluUlang) {
      p.status = 'menunggu';
      p.berkas.forEach(function (b) { b.hasilCek = 'belum'; });
    } else if (kirimUlang) {
      p.status = 'menunggu';
    }
    p.updatedAt = isoWaktu(R.now());
    simpan(['pendaftar']);
    catatLog('ubah', (kirimUlang ? 'Perbaikan dikirim ulang: ' : 'Data diubah: ') + p.nama + ' (' + p.noDaftar + ')' +
      (perluUlang ? ' — perlu verifikasi ulang' : ''));
    beritahu('ubah');
    return { data: p, perluVerifikasiUlang: perluUlang || kirimUlang };
  }

  // Mengembalikan "snapshot" agar bisa diurungkan (FR-09, TC-08)
  function hapus(id) {
    var list = semua();
    var index = -1;
    for (var i = 0; i < list.length; i++) if (list[i].id === id) { index = i; break; }
    if (index < 0) return null;
    var snapshot = {
      pendaftar: list[index],
      index: index,
      verifikasi: state.verifikasi.filter(function (v) { return v.pendaftarId === id; })
    };
    list.splice(index, 1);
    state.verifikasi = state.verifikasi.filter(function (v) { return v.pendaftarId !== id; });
    simpan(['pendaftar', 'verifikasi']);
    catatLog('hapus', 'Data dihapus: ' + snapshot.pendaftar.nama + ' (' + snapshot.pendaftar.noDaftar + ')');
    beritahu('hapus');
    return snapshot;
  }

  function pulihkan(snapshot) {
    if (!snapshot || !snapshot.pendaftar || ambil(snapshot.pendaftar.id)) return false;
    semua().splice(Math.min(snapshot.index, semua().length), 0, snapshot.pendaftar);
    state.verifikasi = state.verifikasi.concat(snapshot.verifikasi || []);
    simpan(['pendaftar', 'verifikasi']);
    catatLog('ubah', 'Penghapusan diurungkan: ' + snapshot.pendaftar.nama + ' (' + snapshot.pendaftar.noDaftar + ')');
    beritahu('pulihkan');
    return true;
  }

  /**
   * Simpan keputusan verifikasi (FR-12, BR-08).
   * @param {string} id
   * @param {{keputusan: string, catatan: string, hasilCek: Object<string,string>, panitiaId: string}} input
   * @returns {{ok: boolean, error?: string, data?: Object}}
   */
  function verifikasi(id, input) {
    var p = ambil(id);
    if (!p) return { ok: false, error: 'Pendaftar tidak ditemukan.' };
    var keputusan = input.keputusan;
    if (['terverifikasi', 'perbaikan', 'ditolak'].indexOf(keputusan) === -1) {
      return { ok: false, error: 'Keputusan tidak dikenal.' };
    }
    var errCatatan = R.validasi.catatanKeputusan(keputusan, input.catatan);
    if (errCatatan) return { ok: false, error: errCatatan };

    var calon = p.berkas.map(function (b) {
      var h = input.hasilCek && input.hasilCek[b.jenis];
      return { jenis: b.jenis, namaFile: b.namaFile, ukuranKb: b.ukuranKb,
        hasilCek: h === 'sesuai' || h === 'tidak_sesuai' ? h : b.hasilCek };
    });
    if (keputusan === 'terverifikasi' && !R.bolehTerverifikasi({ jalur: p.jalur, prestasiTingkat: p.prestasiTingkat, berkas: calon })) {
      return { ok: false, error: 'Semua berkas wajib harus bertanda "sesuai" sebelum terverifikasi.' };
    }

    var waktu = isoWaktu(R.now());
    p.berkas = calon;
    p.status = keputusan;
    p.updatedAt = waktu;
    state.verifikasi.push({
      id: idUnik('vf-'),
      pendaftarId: p.id,
      panitiaId: teks(input.panitiaId || R.PANITIA[0].id, 20),
      keputusan: keputusan,
      catatan: teks(input.catatan, 500),
      waktu: waktu
    });
    simpan(['pendaftar', 'verifikasi']);
    catatLog('verifikasi', R.STATUS_VERIFIKASI[keputusan].labelPanjang + ': ' + p.nama + ' (' + p.noDaftar + ')');
    beritahu('verifikasi');
    return { ok: true, data: p };
  }

  function reset() {
    isiUlang();
    catatLog('reset', 'Data dikembalikan ke kondisi awal simulasi');
    beritahu('reset');
  }

  /* ---------- Cadangan JSON ---------- */
  function ekspor() {
    init();
    return JSON.stringify({
      format: FORMAT_CADANGAN,
      versi: VERSI,
      diekspor: isoWaktu(new Date()),
      pendaftar: state.pendaftar,
      verifikasi: state.verifikasi,
      log: state.log,
      akun: state.akun
    }, null, 2);
  }

  var POLA = {
    id: /^pd-\d{4,6}$/,
    noDaftar: /^PPDB-2026-\d{4,6}$/,
    nisn: /^\d{10}$/,
    waktu: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/,
    vfId: /^vf-[a-z0-9-]{2,30}$/,
    lgId: /^lg-[a-z0-9-]{2,30}$/,
    akId: /^ak-\d{4,6}$/,
    b64: /^[A-Za-z0-9+/=]{0,100}$/
  };

  function periksaPendaftar(p, i) {
    var tempat = 'pendaftar ke-' + (i + 1);
    if (!p || typeof p !== 'object') return tempat + ' bukan objek.';
    if (!POLA.id.test(p.id)) return tempat + ': id tidak valid.';
    if (!POLA.noDaftar.test(p.noDaftar)) return tempat + ': nomor pendaftaran tidak valid.';
    if (!POLA.nisn.test(p.nisn)) return tempat + ': NISN tidak valid.';
    if (!R.jalur(p.jalur)) return tempat + ': jalur tidak dikenal.';
    if (!R.STATUS_VERIFIKASI.hasOwnProperty(p.status)) return tempat + ': status tidak dikenal.';
    if (!POLA.waktu.test(p.tglDaftar) || !POLA.waktu.test(p.updatedAt)) return tempat + ': format waktu tidak valid.';
    if (R.validasi.nama(p.nama)) return tempat + ': nama tidak valid.';
    return '';
  }

  /**
   * Memulihkan data dari teks cadangan. Seluruh isi ditolak jika ada satu kesalahan.
   * @returns {{ok: boolean, error?: string, jumlah?: number}}
   */
  function impor(teksJson) {
    if (typeof teksJson !== 'string' || teksJson.length > IMPOR_MAKS_BYTE) {
      return { ok: false, error: 'Berkas kosong atau lebih dari 5 MB.' };
    }
    var d;
    try { d = JSON.parse(teksJson); } catch (e) { return { ok: false, error: 'Berkas bukan JSON yang valid.' }; }
    // Versi 2 (sebelum Tahap 14) tetap diterima: semua pendaftar dianggap dari loket
    if (!d || d.format !== FORMAT_CADANGAN || (d.versi !== VERSI && d.versi !== 2)) return { ok: false, error: 'Berkas bukan cadangan PPDB Online versi ini.' };
    if (d.versi === 2) d.akun = [];
    if (!Array.isArray(d.pendaftar) || !Array.isArray(d.verifikasi) || !Array.isArray(d.log) || !Array.isArray(d.akun)) return { ok: false, error: 'Struktur cadangan tidak lengkap.' };
    if (d.akun.length > IMPOR_MAKS_DATA) return { ok: false, error: 'Jumlah akun di cadangan tidak wajar.' };

    var akunIds = {}, emails = {};
    var akun = [];
    for (var k = 0; k < d.akun.length; k++) {
      var x = d.akun[k];
      var em = x && typeof x.email === 'string' ? x.email.trim().toLowerCase() : '';
      if (!x || !POLA.akId.test(x.id) || akunIds[x.id] || emails[em] || R.validasi.email(em) ||
          !POLA.b64.test(x.salt || '') || !POLA.b64.test(x.sandiHash || '')) {
        return { ok: false, error: 'akun ke-' + (k + 1) + ' tidak valid.' };
      }
      akunIds[x.id] = emails[em] = true;
      akun.push({ id: x.id, nama: teks(x.nama, 80), email: em, noHp: String(x.noHp || '').replace(/\D/g, '').slice(0, 13),
        salt: x.salt || '', sandiHash: x.sandiHash || '', dibuat: POLA.waktu.test(x.dibuat) ? x.dibuat : isoWaktu(new Date()) });
    }
    if (d.pendaftar.length === 0 || d.pendaftar.length > IMPOR_MAKS_DATA) return { ok: false, error: 'Jumlah pendaftar di cadangan tidak wajar.' };

    var ids = {}, nisns = {};
    var pendaftar = [];
    for (var i = 0; i < d.pendaftar.length; i++) {
      var asli = d.pendaftar[i];
      var err = periksaPendaftar(asli, i);
      if (err) return { ok: false, error: err };
      if (ids[asli.id] || nisns[asli.nisn]) return { ok: false, error: 'pendaftar ke-' + (i + 1) + ': id atau NISN ganda.' };
      ids[asli.id] = nisns[asli.nisn] = true;
      var bersih = saringIsian(asli, null);
      bersih.id = asli.id;
      bersih.noDaftar = asli.noDaftar;
      bersih.status = asli.status;
      bersih.tglDaftar = asli.tglDaftar;
      bersih.updatedAt = asli.updatedAt;
      bersih.akunId = akunIds[asli.akunId] ? asli.akunId : '';
      bersih.sumber = bersih.akunId ? 'online' : 'loket';
      pendaftar.push(bersih);
    }

    var verif = d.verifikasi.filter(function (v) {
      return v && POLA.vfId.test(v.id) && ids[v.pendaftarId] && POLA.waktu.test(v.waktu) &&
        ['terverifikasi', 'perbaikan', 'ditolak'].indexOf(v.keputusan) > -1;
    }).map(function (v) {
      return { id: v.id, pendaftarId: v.pendaftarId, panitiaId: teks(v.panitiaId, 20), keputusan: v.keputusan, catatan: teks(v.catatan, 500), waktu: v.waktu };
    });

    var log = d.log.filter(function (l) {
      return l && POLA.lgId.test(l.id) && POLA.waktu.test(l.waktu) && typeof l.pesan === 'string';
    }).slice(0, LOG_MAKS).map(function (l) {
      return { id: l.id, waktu: l.waktu, tipe: teks(l.tipe, 20), pesan: teks(l.pesan, 200) };
    });

    state = { pendaftar: pendaftar, verifikasi: verif, log: log, akun: akun };
    tulis(KEY.meta, { versi: VERSI, seed: 'impor', dibuat: isoWaktu(new Date()) });
    simpan();
    catatLog('impor', 'Data dipulihkan dari cadangan (' + pendaftar.length + ' pendaftar)');
    beritahu('impor');
    return { ok: true, jumlah: pendaftar.length };
  }

  PPDB.store = {
    init: init,
    isPersistent: function () { init(); return persistent; },
    semua: semua,
    ambil: ambil,
    nisnDipakai: nisnDipakai,
    hitungStatus: hitungStatus,
    akunSemua: akunSemua,
    akunAmbil: akunAmbil,
    akunEmail: akunEmail,
    pendaftarAkun: pendaftarAkun,
    tambahAkun: tambahAkun,
    riwayat: riwayat,
    log: daftarLog,
    catatLog: catatLog,
    tambah: tambah,
    ubah: ubah,
    hapus: hapus,
    pulihkan: pulihkan,
    verifikasi: verifikasi,
    reset: reset,
    ekspor: ekspor,
    impor: impor
  };
})(window);
