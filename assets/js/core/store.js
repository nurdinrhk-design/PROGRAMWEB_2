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
    log: 'ppdb.v2.log'
  };
  var VERSI = 2;
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
    (bagian || ['pendaftar', 'verifikasi', 'log']).forEach(function (k) { tulis(KEY[k], state[k]); });
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
        log: baca(KEY.log) || []
      };
    }
    return state;
  }

  function isiUlang() {
    var data = PPDB.seed.generate();
    state = { pendaftar: data.pendaftar, verifikasi: data.verifikasi, log: data.log };
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

  function tambah(isian) {
    var no = nomorBerikutnya();
    var data = saringIsian(isian, null);
    var waktu = isoWaktu(R.now());
    data.id = 'pd-' + no;
    data.noDaftar = 'PPDB-2026-' + no;
    data.status = 'menunggu';
    data.tglDaftar = waktu;
    data.updatedAt = waktu;
    semua().push(data);
    simpan(['pendaftar']);
    catatLog('tambah', 'Pendaftar baru: ' + data.nama + ' (' + data.noDaftar + ')');
    beritahu('tambah');
    return data;
  }

  function ubah(id, isian) {
    var p = ambil(id);
    if (!p) return null;
    var baru = saringIsian(isian, p);
    var perluUlang = p.status !== 'menunggu' && KOLOM_SELEKSI.some(function (k) { return String(p[k]) !== String(baru[k]); });
    Object.keys(baru).forEach(function (k) { p[k] = baru[k]; });
    if (perluUlang) {
      p.status = 'menunggu';
      p.berkas.forEach(function (b) { b.hasilCek = 'belum'; });
    }
    p.updatedAt = isoWaktu(R.now());
    simpan(['pendaftar']);
    catatLog('ubah', 'Data diubah: ' + p.nama + ' (' + p.noDaftar + ')' + (perluUlang ? ' — perlu verifikasi ulang' : ''));
    beritahu('ubah');
    return { data: p, perluVerifikasiUlang: perluUlang };
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
      log: state.log
    }, null, 2);
  }

  var POLA = {
    id: /^pd-\d{4,6}$/,
    noDaftar: /^PPDB-2026-\d{4,6}$/,
    nisn: /^\d{10}$/,
    waktu: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/,
    vfId: /^vf-[a-z0-9-]{2,30}$/,
    lgId: /^lg-[a-z0-9-]{2,30}$/
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
    if (!d || d.format !== FORMAT_CADANGAN || d.versi !== VERSI) return { ok: false, error: 'Berkas bukan cadangan PPDB Online versi ini.' };
    if (!Array.isArray(d.pendaftar) || !Array.isArray(d.verifikasi) || !Array.isArray(d.log)) return { ok: false, error: 'Struktur cadangan tidak lengkap.' };
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

    state = { pendaftar: pendaftar, verifikasi: verif, log: log };
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
