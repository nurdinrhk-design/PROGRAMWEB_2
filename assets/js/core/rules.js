/* =====================================================================
   rules.js — Aturan PPDB, validator, dan mesin peringkat
   Namespace: PPDB.rules  (tanpa efek samping: tidak menyentuh DOM/storage)
   Sumber aturan: docs/perencanaan.md §7 (BR-01…BR-12), D-11, D-12, D-15
   ===================================================================== */
(function (window) {
  'use strict';

  var PPDB = window.PPDB = window.PPDB || {};

  /* ---------------------------------------------------------------
     1. Identitas & master data (fiktif, D-02)
     --------------------------------------------------------------- */
  var SEKOLAH = {
    nama: 'SMA Negeri 1 Harapan Bangsa',
    singkat: 'SMAN 1 Harapan Bangsa',
    alamat: 'Jl. Pendidikan No. 1, Kota Nusantara',
    tahunAjaran: '2026/2027',
    rombel: 12,
    kapasitasRombel: 36
  };

  // Akun simulasi. Kredensial ini SENGAJA publik (ditampilkan di halaman login, S-06).
  var PANITIA = [
    { id: 'pnt-01', username: 'panitia', sandi: 'ppdb2026', nama: 'Rina Kartika', peran: 'Panitia PPDB · Verifikator', inisial: 'RK' }
  ];

  var JALUR = [
    { kode: 'zonasi', nama: 'Zonasi', singkat: 'Zonasi', kuota: 216, dasar: 'jarak', berkasTambahan: [],
      syarat: 'KK terbit paling lambat 8 Juni 2025' },
    { kode: 'afirmasi', nama: 'Afirmasi', singkat: 'Afirmasi', kuota: 65, dasar: 'jarak', berkasTambahan: ['kip'],
      syarat: 'Pemegang kartu KIP/PKH/KKS' },
    { kode: 'perpindahan', nama: 'Perpindahan Tugas Orang Tua', singkat: 'Perpindahan', kuota: 21, dasar: 'jarak', berkasTambahan: ['surat_tugas'],
      syarat: 'Surat penugasan orang tua' },
    { kode: 'prestasi', nama: 'Prestasi', singkat: 'Prestasi', kuota: 130, dasar: 'skor', berkasTambahan: [],
      syarat: 'Nilai rapor + bonus prestasi' }
  ];

  // Sekolah asal fiktif. Kode bukan NPSN sungguhan (awalan "SA-").
  var SEKOLAH_ASAL = [
    { kode: 'SA-01', nama: 'SMP Negeri 1 Nusantara', status: 'negeri' },
    { kode: 'SA-02', nama: 'SMP Negeri 2 Nusantara', status: 'negeri' },
    { kode: 'SA-03', nama: 'SMP Negeri 3 Nusantara', status: 'negeri' },
    { kode: 'SA-04', nama: 'SMP Negeri 4 Nusantara', status: 'negeri' },
    { kode: 'SA-05', nama: 'SMP Negeri 5 Nusantara', status: 'negeri' },
    { kode: 'SA-06', nama: 'SMP Negeri 7 Nusantara', status: 'negeri' },
    { kode: 'SA-07', nama: 'SMP Negeri 9 Nusantara', status: 'negeri' },
    { kode: 'SA-08', nama: 'MTs Negeri 1 Nusantara', status: 'negeri' },
    { kode: 'SA-09', nama: 'MTs Negeri 2 Nusantara', status: 'negeri' },
    { kode: 'SA-10', nama: 'SMP Harapan Bangsa', status: 'swasta' },
    { kode: 'SA-11', nama: 'SMP Tunas Cendekia', status: 'swasta' },
    { kode: 'SA-12', nama: 'SMP Taman Siswa Nusantara', status: 'swasta' },
    { kode: 'SA-13', nama: 'SMP Bina Insani', status: 'swasta' },
    { kode: 'SA-14', nama: 'SMP Kristen Kasih Bangsa', status: 'swasta' },
    { kode: 'SA-15', nama: 'SMP Katolik Santo Yosef', status: 'swasta' },
    { kode: 'SA-16', nama: 'SMP IT Al-Ikhlas', status: 'swasta' },
    { kode: 'SA-17', nama: 'MTs Al-Hidayah', status: 'swasta' },
    { kode: 'SA-18', nama: 'SMP Pelita Nusantara', status: 'swasta' }
  ];

  var BERKAS = {
    kk: 'Kartu Keluarga',
    akta: 'Akta Kelahiran',
    rapor: 'Rapor semester 1–5',
    kip: 'Kartu KIP/PKH/KKS',
    surat_tugas: 'Surat penugasan orang tua',
    sertifikat: 'Sertifikat prestasi'
  };
  var BERKAS_UMUM = ['kk', 'akta', 'rapor'];
  var BERKAS_FORMAT = ['pdf', 'jpg', 'jpeg', 'png'];
  var BERKAS_MAKS_KB = 2048; // 2 MB (BR-05)

  var STATUS_VERIFIKASI = {
    menunggu: { label: 'Menunggu', labelPanjang: 'Menunggu verifikasi', badge: 'badge--menunggu' },
    perbaikan: { label: 'Perlu perbaikan', labelPanjang: 'Perlu perbaikan', badge: 'badge--perbaikan' },
    terverifikasi: { label: 'Terverifikasi', labelPanjang: 'Terverifikasi', badge: 'badge--terverifikasi' },
    ditolak: { label: 'Ditolak', labelPanjang: 'Ditolak', badge: 'badge--ditolak' }
  };

  var STATUS_SELEKSI = {
    masuk: { label: 'Masuk kuota', badge: 'badge--masuk' },
    tergeser: { label: 'Tergeser', badge: 'badge--tergeser' }
  };

  var PRESTASI_BONUS = { kota: 2, provinsi: 3, nasional: 5 };
  var PRESTASI_LABEL = { kota: 'Kota/Kabupaten', provinsi: 'Provinsi', nasional: 'Nasional' };

  // Jadwal (D-12). Tanggal dalam format ISO lokal.
  var JADWAL = [
    { kode: 'pendaftaran', nama: 'Pendaftaran & unggah berkas', mulai: '2026-06-08', selesai: '2026-06-19' },
    { kode: 'verifikasi', nama: 'Verifikasi berkas', mulai: '2026-06-08', selesai: '2026-06-22' },
    { kode: 'pengumuman', nama: 'Pengumuman hasil', mulai: '2026-06-26', selesai: '2026-06-26' },
    { kode: 'daftar_ulang', nama: 'Daftar ulang', mulai: '2026-06-29', selesai: '2026-07-01' }
  ];

  var TANGGAL_SIMULASI = '2026-06-18';      // "hari ini" dalam simulasi (Kamis)
  var BATAS_KK_ZONASI = '2025-06-08';       // 1 tahun sebelum pendaftaran dibuka (BR-03)
  var ACUAN_USIA = '2026-07-01';            // usia dihitung per 1 Juli (BR-02)
  var USIA_MAKS = 21;
  var TAHUN_LULUS = ['2026', '2025', '2024'];    // lulusan maksimal 2 tahun sebelumnya
  var JUMLAH_SEMESTER = 5;                       // rapor semester 1–5

  /* ---------------------------------------------------------------
     2. Tanggal
     --------------------------------------------------------------- */
  // Mengubah 'YYYY-MM-DD' menjadi Date lokal tengah malam (tanpa pergeseran zona waktu)
  function parseTanggal(iso) {
    if (typeof iso !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
    var p = iso.split('-').map(Number);
    var d = new Date(p[0], p[1] - 1, p[2]);
    return (d.getFullYear() === p[0] && d.getMonth() === p[1] - 1 && d.getDate() === p[2]) ? d : null;
  }

  function isoTanggal(date) {
    var m = String(date.getMonth() + 1).padStart(2, '0');
    var d = String(date.getDate()).padStart(2, '0');
    return date.getFullYear() + '-' + m + '-' + d;
  }

  // Tanggal simulasi + jam asli perangkat (D-12)
  function now() {
    var real = new Date();
    var sim = parseTanggal(TANGGAL_SIMULASI);
    sim.setHours(real.getHours(), real.getMinutes(), real.getSeconds(), 0);
    return sim;
  }

  function today() {
    return parseTanggal(TANGGAL_SIMULASI);
  }

  function selisihHari(dari, ke) {
    var a = new Date(dari.getFullYear(), dari.getMonth(), dari.getDate());
    var b = new Date(ke.getFullYear(), ke.getMonth(), ke.getDate());
    return Math.round((b - a) / 86400000);
  }

  // Tahap jadwal yang sedang berjalan, diutamakan tahap pendaftaran
  function tahapAktif(tanggal) {
    var d = tanggal || today();
    var aktif = JADWAL.filter(function (j) {
      return parseTanggal(j.mulai) <= d && d <= parseTanggal(j.selesai);
    });
    var utama = aktif[0];
    if (!utama) return null;
    var mulai = parseTanggal(utama.mulai);
    var selesai = parseTanggal(utama.selesai);
    return {
      kode: utama.kode,
      nama: utama.nama,
      hariKe: selisihHari(mulai, d) + 1,
      totalHari: selisihHari(mulai, selesai) + 1
    };
  }

  function usiaPada(tglLahirIso, acuanIso) {
    var lahir = parseTanggal(tglLahirIso);
    var acuan = parseTanggal(acuanIso || ACUAN_USIA);
    if (!lahir || !acuan) return null;
    var usia = acuan.getFullYear() - lahir.getFullYear();
    var belumUltah = acuan.getMonth() < lahir.getMonth() ||
      (acuan.getMonth() === lahir.getMonth() && acuan.getDate() < lahir.getDate());
    return belumUltah ? usia - 1 : usia;
  }

  /* ---------------------------------------------------------------
     3. Helper master data
     --------------------------------------------------------------- */
  function jalur(kode) {
    for (var i = 0; i < JALUR.length; i++) if (JALUR[i].kode === kode) return JALUR[i];
    return null;
  }

  function sekolahAsal(kode) {
    for (var i = 0; i < SEKOLAH_ASAL.length; i++) if (SEKOLAH_ASAL[i].kode === kode) return SEKOLAH_ASAL[i];
    return null;
  }

  function totalKuota() {
    return JALUR.reduce(function (n, j) { return n + j.kuota; }, 0);
  }

  // Berkas wajib mengikuti jalur (BR-05). Sertifikat wajib bila mengklaim prestasi.
  function berkasWajib(jalurKode, prestasiTingkat) {
    var j = jalur(jalurKode);
    var daftar = BERKAS_UMUM.concat(j ? j.berkasTambahan : []);
    if (prestasiTingkat && daftar.indexOf('sertifikat') === -1) daftar.push('sertifikat');
    return daftar;
  }

  // Rata-rata nilai rapor semester 1–5, dibulatkan 2 desimal (BR-04)
  function rataRapor(nilaiSemester) {
    if (!Array.isArray(nilaiSemester) || nilaiSemester.length !== JUMLAH_SEMESTER) return null;
    var total = 0;
    for (var i = 0; i < nilaiSemester.length; i++) {
      var n = Number(nilaiSemester[i]);
      if (!isFinite(n)) return null;
      total += n;
    }
    return Math.round(total / JUMLAH_SEMESTER * 100) / 100;
  }

  function skorPrestasi(p) {
    var nilai = Number(p.nilaiRapor) || 0;
    var bonus = PRESTASI_BONUS[p.prestasiTingkat] || 0;
    return Math.round((nilai + bonus) * 100) / 100;
  }

  /* ---------------------------------------------------------------
     4. Validator (BR-01…BR-06, BR-08)
     Setiap validator mengembalikan '' bila valid, atau pesan error.
     --------------------------------------------------------------- */
  var validasi = {
    wajib: function (v, label) {
      return (v === undefined || v === null || String(v).trim() === '') ? label + ' wajib diisi.' : '';
    },

    // label opsional, mis. 'Nama orang tua/wali' (bawaan: 'Nama lengkap')
    nama: function (v, label) {
      var s = String(v || '').trim();
      var l = label || 'Nama lengkap';
      if (!s) return l + ' wajib diisi.';
      if (s.length < 3 || s.length > 80) return l + ' harus 3–80 karakter.';
      if (!/^[A-Za-zÀ-ɏ' .-]+$/.test(s)) return 'Nama hanya boleh berisi huruf, spasi, titik, tanda hubung, atau apostrof.';
      return '';
    },

    // BR-01: 10 digit dan unik. `sudahDipakai(nisn)` disediakan pemanggil.
    nisn: function (v, sudahDipakai) {
      var s = String(v || '').trim();
      if (!s) return 'NISN wajib diisi.';
      if (!/^\d{10}$/.test(s)) return 'NISN harus 10 digit angka.';
      if (typeof sudahDipakai === 'function' && sudahDipakai(s)) return 'NISN sudah terdaftar pada pendaftar lain.';
      return '';
    },

    // BR-02: usia maksimal 21 tahun per 1 Juli
    tglLahir: function (v) {
      var d = parseTanggal(v);
      if (!d) return 'Tanggal lahir wajib diisi dengan format yang benar.';
      if (d > today()) return 'Tanggal lahir tidak boleh di masa depan.';
      var usia = usiaPada(v);
      if (usia > USIA_MAKS) return 'Usia per 1 Juli 2026 melebihi ' + USIA_MAKS + ' tahun (' + usia + ' tahun).';
      if (usia < 10) return 'Tanggal lahir tidak wajar untuk jenjang SMA.';
      return '';
    },

    // BR-03: jalur zonasi mensyaratkan KK terbit paling lambat 8 Juni 2025
    tglTerbitKk: function (v, jalurKode) {
      var d = parseTanggal(v);
      if (!d) return 'Tanggal terbit KK wajib diisi dengan format yang benar.';
      if (d > today()) return 'Tanggal terbit KK tidak boleh di masa depan.';
      if (jalurKode === 'zonasi' && d > parseTanggal(BATAS_KK_ZONASI)) {
        return 'Jalur zonasi mensyaratkan KK terbit paling lambat 8 Juni 2025.';
      }
      return '';
    },

    // BR-06: jarak dalam meter, bilangan bulat 1–50.000
    jarakMeter: function (v) {
      var s = String(v === undefined || v === null ? '' : v).trim();
      if (!s) return 'Jarak wajib diisi.';
      if (!/^\d+$/.test(s)) return 'Jarak harus bilangan bulat dalam meter.';
      var n = Number(s);
      if (n < 1 || n > 50000) return 'Jarak harus antara 1 dan 50.000 meter.';
      return '';
    },

    // BR-04: nilai rapor 0–100, maksimal 2 desimal
    nilaiRapor: function (v) {
      var s = String(v === undefined || v === null ? '' : v).trim().replace(',', '.');
      if (!s) return 'Nilai rapor wajib diisi.';
      if (!/^\d{1,3}(\.\d{1,2})?$/.test(s)) return 'Nilai rapor berupa angka dengan maksimal 2 desimal.';
      var n = Number(s);
      if (n < 0 || n > 100) return 'Nilai rapor harus antara 0 dan 100.';
      return '';
    },

    prestasiTingkat: function (v) {
      if (!v) return '';
      return PRESTASI_BONUS.hasOwnProperty(v) ? '' : 'Tingkat prestasi tidak dikenal.';
    },

    // Nama prestasi wajib bila tingkat prestasi dipilih (BR-04)
    prestasiNama: function (v, tingkat) {
      var s = String(v || '').trim();
      if (!tingkat) return '';
      if (s.length < 5) return 'Nama prestasi wajib diisi (minimal 5 karakter), mis. "Juara 1 Olimpiade Matematika".';
      if (s.length > 100) return 'Nama prestasi maksimal 100 karakter.';
      return '';
    },

    tahunLulus: function (v) {
      if (!v) return 'Tahun lulus wajib dipilih.';
      return TAHUN_LULUS.indexOf(String(v)) > -1 ? '' : 'Tahun lulus harus ' + TAHUN_LULUS.join(', ') + '.';
    },

    // BR-06: nomor HP 08…, total 10–13 digit
    noHp: function (v) {
      var s = String(v || '').replace(/[\s-]/g, '');
      if (!s) return 'Nomor HP wajib diisi.';
      if (!/^08\d{8,11}$/.test(s)) return 'Nomor HP diawali 08 dan terdiri dari 10–13 digit.';
      return '';
    },

    // BR-05: format & ukuran berkas
    berkas: function (namaFile, ukuranKb) {
      var nama = String(namaFile || '');
      var ext = nama.indexOf('.') > -1 ? nama.split('.').pop().toLowerCase() : '';
      if (!nama) return 'Berkas wajib diunggah.';
      if (BERKAS_FORMAT.indexOf(ext) === -1) return 'Format berkas harus PDF, JPG, atau PNG.';
      if (!(ukuranKb > 0) || ukuranKb > BERKAS_MAKS_KB) return 'Ukuran berkas maksimal 2 MB.';
      return '';
    },

    // BR-08: keputusan perbaikan/tolak wajib disertai catatan
    catatanKeputusan: function (keputusan, catatan) {
      var perlu = keputusan === 'perbaikan' || keputusan === 'ditolak';
      var s = String(catatan || '').trim();
      if (perlu && s.length < 10) return 'Catatan wajib diisi (minimal 10 karakter) untuk keputusan ini.';
      if (s.length > 500) return 'Catatan maksimal 500 karakter.';
      return '';
    }
  };

  // Keputusan "terverifikasi" hanya boleh bila semua berkas wajib sesuai (FR-12)
  function bolehTerverifikasi(p) {
    var wajib = berkasWajib(p.jalur, p.prestasiTingkat);
    return wajib.every(function (jenis) {
      var b = (p.berkas || []).filter(function (x) { return x.jenis === jenis; })[0];
      return b && b.hasilCek === 'sesuai';
    });
  }

  /* ---------------------------------------------------------------
     5. Mesin peringkat (BR-09…BR-11)
     --------------------------------------------------------------- */
  // Urutan: jarak terdekat / skor tertinggi → usia lebih tua → waktu daftar lebih awal
  function pembanding(dasar) {
    return function (a, b) {
      var utama = dasar === 'skor'
        ? skorPrestasi(b) - skorPrestasi(a)
        : a.jarakMeter - b.jarakMeter;
      if (utama !== 0) return utama;
      if (a.tglLahir !== b.tglLahir) return a.tglLahir < b.tglLahir ? -1 : 1;
      return a.tglDaftar < b.tglDaftar ? -1 : (a.tglDaftar > b.tglDaftar ? 1 : 0);
    };
  }

  /**
   * Hitung peringkat satu jalur.
   * @returns {{jalur, kuota, pendaftar, terverifikasi, keketatan, batas, daftar}}
   *   daftar: [{peringkat, status: 'masuk'|'tergeser', nilai, data}]
   */
  function peringkat(semuaPendaftar, jalurKode) {
    var j = jalur(jalurKode);
    if (!j) return null;
    var diJalur = semuaPendaftar.filter(function (p) { return p.jalur === jalurKode; });
    var terverifikasi = diJalur.filter(function (p) { return p.status === 'terverifikasi'; });
    terverifikasi.sort(pembanding(j.dasar));

    var daftar = terverifikasi.map(function (p, i) {
      return {
        peringkat: i + 1,
        status: i < j.kuota ? 'masuk' : 'tergeser',
        nilai: j.dasar === 'skor' ? skorPrestasi(p) : p.jarakMeter,
        data: p
      };
    });

    var terakhirMasuk = daftar[Math.min(j.kuota, daftar.length) - 1];
    return {
      jalur: j,
      kuota: j.kuota,
      pendaftar: diJalur.length,
      terverifikasi: terverifikasi.length,
      keketatan: Math.round((terverifikasi.length / j.kuota) * 100) / 100,
      // Batas sementara hanya berarti bila kuota sudah penuh (BR-11)
      batas: daftar.length >= j.kuota && terakhirMasuk ? terakhirMasuk.nilai : null,
      daftar: daftar
    };
  }

  function statusSeleksi(semuaPendaftar, id) {
    var p = semuaPendaftar.filter(function (x) { return x.id === id; })[0];
    if (!p || p.status !== 'terverifikasi') return null;
    var hasil = peringkat(semuaPendaftar, p.jalur);
    var baris = hasil.daftar.filter(function (x) { return x.data.id === id; })[0];
    return baris ? { peringkat: baris.peringkat, status: baris.status, kuota: hasil.kuota } : null;
  }

  PPDB.rules = {
    SEKOLAH: SEKOLAH,
    PANITIA: PANITIA,
    JALUR: JALUR,
    SEKOLAH_ASAL: SEKOLAH_ASAL,
    BERKAS: BERKAS,
    BERKAS_UMUM: BERKAS_UMUM,
    BERKAS_MAKS_KB: BERKAS_MAKS_KB,
    BERKAS_FORMAT: BERKAS_FORMAT,
    TAHUN_LULUS: TAHUN_LULUS,
    JUMLAH_SEMESTER: JUMLAH_SEMESTER,
    STATUS_VERIFIKASI: STATUS_VERIFIKASI,
    STATUS_SELEKSI: STATUS_SELEKSI,
    PRESTASI_BONUS: PRESTASI_BONUS,
    PRESTASI_LABEL: PRESTASI_LABEL,
    JADWAL: JADWAL,
    TANGGAL_SIMULASI: TANGGAL_SIMULASI,
    BATAS_KK_ZONASI: BATAS_KK_ZONASI,
    USIA_MAKS: USIA_MAKS,
    parseTanggal: parseTanggal,
    isoTanggal: isoTanggal,
    now: now,
    today: today,
    selisihHari: selisihHari,
    tahapAktif: tahapAktif,
    usiaPada: usiaPada,
    jalur: jalur,
    sekolahAsal: sekolahAsal,
    totalKuota: totalKuota,
    berkasWajib: berkasWajib,
    rataRapor: rataRapor,
    skorPrestasi: skorPrestasi,
    validasi: validasi,
    bolehTerverifikasi: bolehTerverifikasi,
    peringkat: peringkat,
    statusSeleksi: statusSeleksi
  };
})(window);
