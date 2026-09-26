/* =====================================================================
   core.test.js — Uji otomatis modul inti (rules, seed, store, ui, auth)
   Dijalankan oleh tests/index.html. Tanpa dependensi.
   Data aplikasi di browser DICADANGKAN sebelum uji dan DIPULIHKAN sesudahnya.
   ===================================================================== */
(function (window, document) {
  'use strict';

  var PPDB = window.PPDB;
  var R = PPDB.rules;
  var hasil = [];

  function uji(nama, fn) {
    try {
      fn();
      hasil.push({ nama: nama, ok: true });
    } catch (e) {
      hasil.push({ nama: nama, ok: false, pesan: e.message });
    }
  }

  function pastikan(kondisi, pesan) {
    if (!kondisi) throw new Error(pesan || 'Kondisi tidak terpenuhi');
  }

  function sama(a, b, pesan) {
    if (a !== b) throw new Error((pesan || 'Nilai berbeda') + ': diharapkan ' + JSON.stringify(b) + ', didapat ' + JSON.stringify(a));
  }

  /* ---------- Pulihkan data aplikasi yang dicadangkan setup.js ---------- */
  var cadangan = window.PPDB_UJI_CADANGAN || { local: {}, session: {} };
  function pulihkanSemua() {
    [[window.localStorage, cadangan.local], [window.sessionStorage, cadangan.session]].forEach(function (pair) {
      for (var i = pair[0].length - 1; i >= 0; i--) {
        var k = pair[0].key(i);
        if (k && k.indexOf('ppdb.v2.') === 0) pair[0].removeItem(k);
      }
      Object.keys(pair[1]).forEach(function (k) { pair[0].setItem(k, pair[1][k]); });
    });
    delete window.PPDB_UJI_CADANGAN;
  }

  try {
    /* ================= RULES ================= */
    uji('Tahap aktif: pendaftaran hari ke-11 dari 12 (18 Juni 2026)', function () {
      var t = R.tahapAktif();
      sama(t.kode, 'pendaftaran'); sama(t.hariKe, 11); sama(t.totalHari, 12);
    });

    uji('Kuota total 432 kursi (D-15)', function () { sama(R.totalKuota(), 432); });

    uji('Usia per 1 Juli dihitung benar', function () {
      sama(R.usiaPada('2010-07-01'), 16);
      sama(R.usiaPada('2010-07-02'), 15);
    });

    uji('BR-01 NISN: 10 digit & unik', function () {
      pastikan(R.validasi.nisn('123') !== '', 'NISN pendek harus ditolak');
      pastikan(R.validasi.nisn('12345678ab') !== '', 'NISN huruf harus ditolak');
      pastikan(R.validasi.nisn('1234567890', function () { return true; }) !== '', 'NISN ganda harus ditolak');
      sama(R.validasi.nisn('1234567890', function () { return false; }), '');
    });

    uji('BR-02 usia maksimal 21 tahun per 1 Juli', function () {
      pastikan(R.validasi.tglLahir('2004-06-30') !== '', 'usia 22 harus ditolak');
      sama(R.validasi.tglLahir('2010-05-12'), '');
    });

    uji('BR-03 zonasi: KK terbit paling lambat 8 Juni 2025', function () {
      pastikan(R.validasi.tglTerbitKk('2025-06-09', 'zonasi') !== '', 'KK terlalu baru harus ditolak');
      sama(R.validasi.tglTerbitKk('2025-06-08', 'zonasi'), '');
      sama(R.validasi.tglTerbitKk('2025-12-01', 'afirmasi'), '');
    });

    uji('BR-04 skor prestasi = nilai + bonus', function () {
      sama(R.skorPrestasi({ nilaiRapor: 90.5, prestasiTingkat: 'provinsi' }), 93.5);
      sama(R.skorPrestasi({ nilaiRapor: 88, prestasiTingkat: '' }), 88);
    });

    uji('BR-05 berkas wajib mengikuti jalur & format/ukuran', function () {
      sama(R.berkasWajib('afirmasi', '').join(','), 'kk,akta,rapor,kip');
      sama(R.berkasWajib('prestasi', 'kota').join(','), 'kk,akta,rapor,sertifikat');
      pastikan(R.validasi.berkas('scan.exe', 100) !== '', '.exe harus ditolak');
      pastikan(R.validasi.berkas('kk.pdf', 5000) !== '', '5 MB harus ditolak');
      sama(R.validasi.berkas('kk.pdf', 800), '');
    });

    uji('BR-06 nomor HP & jarak', function () {
      sama(R.validasi.noHp('0800-0012-3456'), '');
      pastikan(R.validasi.noHp('+62812') !== '', 'format +62 ditolak');
      pastikan(R.validasi.jarakMeter('12.5') !== '', 'jarak desimal ditolak');
      sama(R.validasi.jarakMeter('1240'), '');
    });

    uji('BR-08 catatan wajib untuk perbaikan/tolak', function () {
      pastikan(R.validasi.catatanKeputusan('perbaikan', '') !== '', 'catatan kosong harus ditolak');
      sama(R.validasi.catatanKeputusan('terverifikasi', ''), '');
    });

    /* ================= SEED ================= */
    var dataA = PPDB.seed.generate();
    var dataB = PPDB.seed.generate();

    uji('Seed deterministik: dua kali generate hasilnya sama', function () {
      sama(JSON.stringify(dataA), JSON.stringify(dataB));
    });

    uji('Seed: 900 pendaftar dengan komposisi jalur sesuai rencana', function () {
      sama(dataA.pendaftar.length, 900);
      Object.keys(PPDB.seed.JUMLAH).forEach(function (k) {
        sama(dataA.pendaftar.filter(function (p) { return p.jalur === k; }).length, PPDB.seed.JUMLAH[k], 'jumlah ' + k);
      });
    });

    uji('Seed: id, NISN unik; NISN berawalan 9; no. HP berawalan 08000 & valid', function () {
      var ids = {}, nisns = {};
      dataA.pendaftar.forEach(function (p) {
        pastikan(!ids[p.id] && !nisns[p.nisn], 'duplikat ' + p.id);
        ids[p.id] = nisns[p.nisn] = true;
        pastikan(p.nisn.charAt(0) === '9', 'NISN ' + p.nisn);
        pastikan(p.noHp.indexOf('08000') === 0 && R.validasi.noHp(p.noHp) === '', 'HP ' + p.noHp);
        pastikan(R.validasi.nama(p.nama) === '', 'nama ' + p.nama);
      });
    });

    uji('Seed: setiap jalur melebihi kuota setelah verifikasi (§7.6)', function () {
      R.JALUR.forEach(function (j) {
        var h = R.peringkat(dataA.pendaftar, j.kode);
        pastikan(h.terverifikasi > j.kuota, j.kode + ': ' + h.terverifikasi + ' ≤ ' + j.kuota);
      });
    });

    uji('Seed: tidak ada waktu daftar setelah "hari ini"', function () {
      dataA.pendaftar.forEach(function (p) { pastikan(p.tglDaftar.slice(0, 10) <= R.TANGGAL_SIMULASI, p.id); });
    });

    /* ================= PERINGKAT ================= */
    uji('BR-10 peringkat zonasi urut jarak; tepat 216 masuk kuota', function () {
      var h = R.peringkat(dataA.pendaftar, 'zonasi');
      for (var i = 1; i < h.daftar.length; i++) pastikan(h.daftar[i - 1].nilai <= h.daftar[i].nilai, 'urutan jarak');
      sama(h.daftar.filter(function (x) { return x.status === 'masuk'; }).length, 216);
      sama(h.batas, h.daftar[215].nilai, 'batas = jarak peringkat ke-216');
    });

    uji('BR-10 peringkat prestasi urut skor tertinggi', function () {
      var h = R.peringkat(dataA.pendaftar, 'prestasi');
      for (var i = 1; i < h.daftar.length; i++) pastikan(h.daftar[i - 1].nilai >= h.daftar[i].nilai, 'urutan skor');
    });

    /* ================= STORE ================= */
    var S = PPDB.store;

    uji('Store: init mengisi 900 data simulasi & tersimpan', function () {
      sama(S.semua().length, 900);
      pastikan(S.isPersistent(), 'localStorage harus tersedia di browser uji');
    });

    uji('BR-07 tambah: nomor otomatis, status menunggu, berkas sesuai jalur', function () {
      var p = S.tambah({ nama: 'Uji Coba Satu', nisn: '9000000001', jk: 'P', tglLahir: '2010-03-04', jalur: 'afirmasi',
        tglTerbitKk: '2020-01-01', jarakMeter: 900, nilaiRapor: 85, noHp: '080001234567', sekolahAsal: 'SA-01' });
      sama(p.id, 'pd-0901'); sama(p.noDaftar, 'PPDB-2026-0901'); sama(p.status, 'menunggu');
      sama(p.berkas.map(function (b) { return b.jenis; }).join(','), 'kk,akta,rapor,kip');
      pastikan(S.nisnDipakai('9000000001'), 'NISN baru terdeteksi dipakai');
    });

    uji('FR-12 verifikasi ditolak bila berkas belum sesuai / catatan kosong', function () {
      var r1 = S.verifikasi('pd-0901', { keputusan: 'terverifikasi', hasilCek: { kk: 'sesuai' } });
      pastikan(!r1.ok, 'terverifikasi tanpa semua berkas sesuai harus gagal');
      var r2 = S.verifikasi('pd-0901', { keputusan: 'perbaikan', catatan: '' });
      pastikan(!r2.ok, 'perbaikan tanpa catatan harus gagal');
    });

    uji('TC-17 verifikasi pendaftar zonasi terdekat mengubah peringkat', function () {
      var sebelum = R.peringkat(S.semua(), 'zonasi');
      var batasLama = sebelum.daftar[215].data.id;
      var calon = S.semua().filter(function (p) { return p.jalur === 'zonasi' && p.status === 'menunggu'; })
        .sort(function (a, b) { return a.jarakMeter - b.jarakMeter; })[0];
      pastikan(calon && calon.jarakMeter < sebelum.batas, 'ada calon lebih dekat dari batas');
      var cek = {};
      calon.berkas.forEach(function (b) { cek[b.jenis] = 'sesuai'; });
      var r = S.verifikasi(calon.id, { keputusan: 'terverifikasi', catatan: '', hasilCek: cek });
      pastikan(r.ok, r.error);
      sama(R.statusSeleksi(S.semua(), calon.id).status, 'masuk');
      sama(R.statusSeleksi(S.semua(), batasLama).status, 'tergeser', 'peringkat 216 lama tergeser');
    });

    uji('Ubah data terverifikasi → kembali menunggu (verifikasi ulang)', function () {
      var p = S.semua().filter(function (x) { return x.status === 'terverifikasi'; })[0];
      var isian = JSON.parse(JSON.stringify(p));
      isian.jarakMeter = p.jarakMeter + 100;
      var r = S.ubah(p.id, isian);
      pastikan(r.perluVerifikasiUlang, 'harus perlu verifikasi ulang');
      sama(S.ambil(p.id).status, 'menunggu');
    });

    uji('FR-09 hapus lalu urungkan (TC-08)', function () {
      var snap = S.hapus('pd-0901');
      pastikan(snap && !S.ambil('pd-0901'), 'data terhapus');
      pastikan(S.pulihkan(snap) && S.ambil('pd-0901'), 'data kembali');
    });

    uji('BR-12 log aktivitas tercatat & maksimal 100', function () {
      pastikan(S.log(5)[0].pesan.length > 0, 'log terbaru ada');
      pastikan(S.log().length <= 100, 'log ≤ 100');
    });

    uji('Cadangan: ekspor → impor menghasilkan data yang sama', function () {
      var teks = S.ekspor();
      var jumlah = S.semua().length;
      var r = S.impor(teks);
      pastikan(r.ok, r.error);
      sama(S.semua().length, jumlah);
    });

    uji('Keamanan: impor menolak JSON rusak, format asing, & nama berisi kode', function () {
      pastikan(!S.impor('{bukan json').ok, 'JSON rusak');
      pastikan(!S.impor(JSON.stringify({ format: 'lain' })).ok, 'format asing');
      var d = JSON.parse(S.ekspor());
      d.pendaftar[0].nama = '<img src=x onerror=alert(1)>';
      pastikan(!S.impor(JSON.stringify(d)).ok, 'nama berisi kode harus ditolak');
    });

    uji('FR-17 reset mengembalikan 900 data awal', function () {
      S.reset();
      sama(S.semua().length, 900);
    });

    /* ================= UI ================= */
    uji('Keamanan: ui.el memakai textContent (tidak mengeksekusi HTML)', function () {
      var n = PPDB.ui.el('div', { text: '<img src=x onerror=alert(1)>' });
      sama(n.children.length, 0, 'tidak boleh ada elemen anak');
      pastikan(n.innerHTML.indexOf('&lt;img') === 0, 'teks ter-escape');
    });

    uji('Keamanan: CSV menetralkan formula (= + - @)', function () {
      var isi = PPDB.ui.csv([['=HYPERLINK("x")', 'aman']]);
      pastikan(isi.indexOf("'=HYPERLINK") > -1, 'formula diberi apostrof');
    });

    uji('Format: tanggal & angka Indonesia', function () {
      sama(PPDB.ui.tanggal('2026-06-18'), '18 Jun 2026');
      sama(PPDB.ui.jarak(1240), '1.240 m');
      sama(PPDB.ui.desimal(91.5), '91,50');
    });

    /* ================= AUTH ================= */
    uji('FR-01 login: salah ditolak, benar diterima, sesi tersimpan', function () {
      var salah = PPDB.auth.login('panitia', 'keliru', false);
      pastikan(!salah.ok, 'sandi salah ditolak');
      var benar = PPDB.auth.login('panitia', 'ppdb2026', false);
      pastikan(benar.ok, benar.error);
      sama(PPDB.auth.panitiaAktif().nama, 'Rina Kartika');
    });

    uji('Keamanan: tujuan setelah login hanya halaman internal', function () {
      sama(PPDB.auth.tujuanSetelahLogin(), 'pages/dashboard.html');
    });
  } finally {
    pulihkanSemua();
  }

  /* ---------- Tampilkan hasil ---------- */
  var lulus = hasil.filter(function (h) { return h.ok; }).length;
  var ringkas = document.querySelector('[data-ringkasan]');
  var daftar = document.querySelector('[data-hasil]');
  ringkas.textContent = lulus + ' / ' + hasil.length + ' uji lulus';
  ringkas.className = 'badge ' + (lulus === hasil.length ? 'badge--terverifikasi' : 'badge--ditolak');
  document.body.setAttribute('data-status-uji', lulus === hasil.length ? 'lulus' : 'gagal');
  hasil.forEach(function (h) {
    var li = PPDB.ui.el('li', { className: 'cluster' }, [
      PPDB.ui.el('span', { className: 'badge ' + (h.ok ? 'badge--terverifikasi' : 'badge--ditolak'), text: h.ok ? 'Lulus' : 'Gagal' }),
      PPDB.ui.el('span', { text: h.nama + (h.pesan ? ' — ' + h.pesan : '') })
    ]);
    daftar.appendChild(li);
  });
})(window, document);
