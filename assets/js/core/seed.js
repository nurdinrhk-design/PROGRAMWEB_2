/* =====================================================================
   seed.js — Generator data simulasi (perencanaan §7.6)
   Namespace: PPDB.seed
   - Deterministik: seed tetap → isi data selalu sama (D-03)
   - Semua identitas fiktif: NISN berawalan "9", no. HP berawalan "08000"
   - Proporsi dibuat agar setiap jalur melebihi kuota setelah verifikasi
   ===================================================================== */
(function (window) {
  'use strict';

  var PPDB = window.PPDB = window.PPDB || {};
  var R = PPDB.rules;

  var SEED = 20260618;
  var JUMLAH = { zonasi: 460, afirmasi: 130, perpindahan: 45, prestasi: 265 }; // total 900
  var HARI_MULAI = 8;   // 8 Juni 2026
  var HARI_AKHIR = 18;  // "hari ini" simulasi
  var BOBOT_HARI = [16, 13, 11, 10, 9, 8, 8, 7, 7, 6, 3]; // pendaftar menumpuk di hari awal

  var NAMA_L = ['Adi', 'Agus', 'Ahmad', 'Akbar', 'Alif', 'Andi', 'Arif', 'Bagas', 'Bayu', 'Bima', 'Dafa', 'Dimas',
    'Dion', 'Fadil', 'Fajar', 'Farhan', 'Galang', 'Gilang', 'Hafiz', 'Ilham', 'Irfan', 'Kevin', 'Lutfi', 'Naufal',
    'Raka', 'Rama', 'Rafi', 'Rizki', 'Satria', 'Taufik', 'Wahyu', 'Yoga', 'Yusuf', 'Zaki'];
  var NAMA_P = ['Adinda', 'Alya', 'Anisa', 'Aulia', 'Ayu', 'Bunga', 'Citra', 'Dewi', 'Dina', 'Fitri', 'Hana', 'Indah',
    'Intan', 'Kirana', 'Laila', 'Maya', 'Nabila', 'Nadia', 'Nayla', 'Putri', 'Rahma', 'Ratna', 'Salsa', 'Salma',
    'Sari', 'Shinta', 'Tiara', 'Vina', 'Wulan', 'Yasmin', 'Zahra'];
  var NAMA_BELAKANG = ['Pratama', 'Saputra', 'Wijaya', 'Kusuma', 'Hidayat', 'Nugroho', 'Santoso', 'Permata',
    'Ramadhan', 'Maulana', 'Firmansyah', 'Setiawan', 'Rahayu', 'Anggraini', 'Utami', 'Purnama', 'Syahputra',
    'Hakim', 'Siregar', 'Nasution', 'Tanjung', 'Harahap', 'Sinaga', 'Wibowo', 'Kurniawan', 'Susanto', 'Prasetyo'];
  var NAMA_ORTU = ['Hendra', 'Budi', 'Slamet', 'Sri', 'Siti', 'Eko', 'Dedi', 'Yuni', 'Rina', 'Heru', 'Nur',
    'Wati', 'Bambang', 'Endang', 'Suryani', 'Hadi', 'Lina', 'Rudi'];
  var KOTA_LAHIR = ['Kota Nusantara', 'Kota Nusantara', 'Kota Nusantara', 'Bandung', 'Surabaya', 'Medan',
    'Semarang', 'Makassar', 'Palembang', 'Yogyakarta', 'Padang', 'Balikpapan'];
  var JALAN = ['Melati', 'Mawar', 'Kenanga', 'Cempaka', 'Flamboyan', 'Anggrek', 'Teratai', 'Kamboja', 'Dahlia',
    'Seroja', 'Merpati', 'Rajawali', 'Cendrawasih', 'Nusa Indah', 'Pahlawan', 'Merdeka', 'Pendidikan'];
  var WILAYAH = [
    { kecamatan: 'Harapan Jaya', kelurahan: ['Harapan Baru', 'Harapan Indah', 'Jaya Makmur'] },
    { kecamatan: 'Mekar Sari', kelurahan: ['Mekar Jaya', 'Sari Asih', 'Taman Sari'] },
    { kecamatan: 'Bumi Asri', kelurahan: ['Asri Mulya', 'Bumi Raya', 'Griya Asri'] },
    { kecamatan: 'Tanjung Permai', kelurahan: ['Permai Utara', 'Permai Selatan', 'Tanjung Baru'] },
    { kecamatan: 'Sinar Baru', kelurahan: ['Sinar Harapan', 'Baru Sentosa', 'Cahaya Timur'] }
  ];
  var PRESTASI_NAMA = ['Juara 1 Olimpiade Matematika', 'Juara 2 Lomba Karya Tulis Ilmiah', 'Juara 1 Pencak Silat',
    'Juara 3 Olimpiade Sains', 'Juara 2 Debat Bahasa Inggris', 'Juara 1 Tilawah Al-Qur\'an', 'Juara 2 Futsal',
    'Juara 1 Lomba Pidato', 'Juara 3 Paduan Suara', 'Juara 2 Olimpiade Informatika'];
  var CATATAN = {
    perbaikan: {
      kk: 'Scan KK buram, bagian NIK tidak terbaca. Mohon unggah ulang.',
      akta: 'Ejaan nama di akta berbeda dengan isian formulir. Mohon konfirmasi.',
      rapor: 'Rapor semester 3 belum dilampirkan di berkas rapor.',
      kip: 'Kartu KIP yang diunggah sudah kedaluwarsa. Lampirkan kartu yang berlaku.',
      surat_tugas: 'Surat penugasan belum ditandatangani pejabat berwenang.',
      sertifikat: 'Sertifikat terpotong, nama penyelenggara tidak terlihat.'
    },
    ditolak: {
      kk: 'KK terbit kurang dari 1 tahun sebelum pendaftaran dibuka (syarat jalur zonasi).',
      akta: 'Data akta kelahiran tidak cocok dengan identitas pendaftar.',
      rapor: 'Rapor yang diunggah milik siswa lain.',
      kip: 'Nomor kartu KIP tidak terdaftar sebagai penerima bantuan.',
      surat_tugas: 'Surat penugasan bukan dari instansi yang sah.',
      sertifikat: 'Sertifikat prestasi tidak dapat diverifikasi ke penyelenggara.'
    }
  };

  /* ---------- Pembangkit acak ber-seed (mulberry32) ---------- */
  function mulberry32(a) {
    return function () {
      a |= 0;
      a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function pad(n, len) {
    return String(n).padStart(len, '0');
  }

  function isoWaktu(date) {
    return R.isoTanggal(date) + 'T' + pad(date.getHours(), 2) + ':' + pad(date.getMinutes(), 2) + ':00';
  }

  /**
   * Membangun data simulasi.
   * @returns {{pendaftar: Array, verifikasi: Array, log: Array}}
   */
  function generate() {
    var rnd = mulberry32(SEED);
    var pick = function (arr) { return arr[Math.floor(rnd() * arr.length)]; };
    var int = function (min, max) { return min + Math.floor(rnd() * (max - min + 1)); };
    var chance = function (p) { return rnd() < p; };
    var weighted = function (pairs) {
      var total = pairs.reduce(function (s, p) { return s + p[1]; }, 0);
      var r = rnd() * total;
      for (var i = 0; i < pairs.length; i++) {
        r -= pairs[i][1];
        if (r < 0) return pairs[i][0];
      }
      return pairs[pairs.length - 1][0];
    };

    // Urutan jalur diacak agar tersebar merata di semua hari
    var slot = [];
    Object.keys(JUMLAH).forEach(function (k) {
      for (var i = 0; i < JUMLAH[k]; i++) slot.push(k);
    });
    for (var i = slot.length - 1; i > 0; i--) {
      var j = Math.floor(rnd() * (i + 1));
      var tmp = slot[i]; slot[i] = slot[j]; slot[j] = tmp;
    }

    var nisnDipakai = {};
    var hariBobot = BOBOT_HARI.map(function (b, idx) { return [HARI_MULAI + idx, b]; });
    var sekolahBobot = R.SEKOLAH_ASAL.map(function (s) { return [s.kode, s.status === 'negeri' ? 3 : 1]; });
    var batasKk = R.parseTanggal(R.BATAS_KK_ZONASI);

    var pendaftar = slot.map(function (jalurKode) {
      var jk = chance(0.5) ? 'L' : 'P';
      var nama = pick(jk === 'L' ? NAMA_L : NAMA_P) + ' ' + pick(NAMA_BELAKANG);
      if (chance(0.25)) nama = pick(jk === 'L' ? NAMA_L : NAMA_P) + ' ' + nama;

      var nisn;
      do { nisn = '9' + pad(int(0, 999999999), 9); } while (nisnDipakai[nisn]);
      nisnDipakai[nisn] = true;

      var tahunLahir = weighted([[2010, 60], [2011, 35], [2009, 5]]);
      var tglLahir = R.isoTanggal(new Date(tahunLahir, int(0, 11), int(1, 28)));

      var wilayah = pick(WILAYAH);
      var tglTerbitKk = R.isoTanggal(new Date(int(2012, 2024), int(0, 11), int(1, 28)));

      var jarak;
      if (jalurKode === 'zonasi') jarak = 200 + Math.round(Math.pow(rnd(), 1.4) * 5800);
      else if (jalurKode === 'afirmasi') jarak = 300 + Math.round(Math.pow(rnd(), 1.2) * 8700);
      else if (jalurKode === 'perpindahan') jarak = 500 + Math.round(rnd() * 14500);
      else jarak = 300 + Math.round(rnd() * 19700);

      var nilai = jalurKode === 'prestasi' ? 84 + rnd() * 14 : 76 + rnd() * 20;
      var tingkat = '';
      if ((jalurKode === 'prestasi' && chance(0.6)) || (jalurKode !== 'prestasi' && chance(0.08))) {
        tingkat = weighted([['kota', 50], ['provinsi', 35], ['nasional', 15]]);
      }

      var hari = weighted(hariBobot);
      var jamMaks = hari === HARI_AKHIR ? 9 : 21;
      var tglDaftar = new Date(2026, 5, hari, int(hari === HARI_AKHIR ? 6 : 7, jamMaks), int(0, 59));

      var umurHari = HARI_AKHIR - hari;
      var status = umurHari >= 4
        ? weighted([['terverifikasi', 74], ['perbaikan', 8], ['ditolak', 6], ['menunggu', 12]])
        : umurHari >= 2
          ? weighted([['terverifikasi', 45], ['perbaikan', 8], ['ditolak', 4], ['menunggu', 43]])
          : weighted([['menunggu', 80], ['terverifikasi', 15], ['perbaikan', 5]]);

      return {
        jalur: jalurKode,
        jk: jk,
        nama: nama,
        nisn: nisn,
        tempatLahir: pick(KOTA_LAHIR),
        tglLahir: tglLahir,
        alamat: 'Jl. ' + pick(JALAN) + ' No. ' + int(1, 120) + ', RT ' + pad(int(1, 12), 2) + '/RW ' + pad(int(1, 8), 2),
        kelurahan: pick(wilayah.kelurahan),
        kecamatan: wilayah.kecamatan,
        tglTerbitKk: tglTerbitKk,
        jarakMeter: jarak,
        sekolahAsal: weighted(sekolahBobot),
        tahunLulus: chance(0.95) ? '2026' : '2025',
        nilaiRapor: Math.round(nilai * 100) / 100,
        prestasiTingkat: tingkat,
        prestasiNama: tingkat ? pick(PRESTASI_NAMA) : '',
        namaOrtu: pick(NAMA_ORTU) + ' ' + pick(NAMA_BELAKANG),
        noHp: '08000' + pad(int(0, 9999999), 7),
        status: status,
        _tgl: tglDaftar
      };
    });

    // Nomor pendaftaran mengikuti urutan waktu daftar (BR-07)
    pendaftar.sort(function (a, b) { return a._tgl - b._tgl; });

    var verifikasi = [];
    var akhirVerifikasi = new Date(2026, 5, HARI_AKHIR, 9, 0);

    pendaftar.forEach(function (p, idx) {
      var no = pad(idx + 1, 4);
      p.id = 'pd-' + no;
      p.noDaftar = 'PPDB-2026-' + no;
      p.tglDaftar = isoWaktu(p._tgl);

      var wajib = R.berkasWajib(p.jalur, p.prestasiTingkat);
      var bermasalah = (p.status === 'perbaikan' || p.status === 'ditolak') ? pick(wajib) : null;

      // Ditolak di jalur zonasi: realistisnya karena KK terlalu baru (BR-03)
      if (p.status === 'ditolak' && p.jalur === 'zonasi' && chance(0.6)) {
        bermasalah = 'kk';
        p.tglTerbitKk = R.isoTanggal(new Date(batasKk.getTime() + int(10, 300) * 86400000));
      }

      p.berkas = wajib.map(function (jenis) {
        var hasil = p.status === 'menunggu' ? 'belum' : (jenis === bermasalah ? 'tidak_sesuai' : 'sesuai');
        return {
          jenis: jenis,
          namaFile: jenis + '_' + p.noDaftar.toLowerCase() + (chance(0.8) ? '.pdf' : '.jpg'),
          ukuranKb: int(120, 1900),
          hasilCek: hasil
        };
      });

      p.updatedAt = p.tglDaftar;
      if (p.status !== 'menunggu') {
        var waktu = new Date(Math.min(p._tgl.getTime() + int(4, 60) * 3600000, akhirVerifikasi.getTime()));
        var catatan = bermasalah ? CATATAN[p.status][bermasalah] : '';
        verifikasi.push({
          id: 'vf-' + no,
          pendaftarId: p.id,
          panitiaId: R.PANITIA[0].id,
          keputusan: p.status,
          catatan: catatan,
          waktu: isoWaktu(waktu)
        });
        p.updatedAt = isoWaktu(waktu);
      }
      delete p._tgl;
    });

    // Log awal: 12 aktivitas verifikasi terakhir
    var log = verifikasi.slice().sort(function (a, b) { return a.waktu < b.waktu ? 1 : -1; }).slice(0, 12)
      .map(function (v, i) {
        var p = pendaftar[Number(v.pendaftarId.slice(3)) - 1];
        return {
          id: 'lg-seed-' + pad(i + 1, 2),
          waktu: v.waktu,
          tipe: 'verifikasi',
          pesan: R.STATUS_VERIFIKASI[v.keputusan].labelPanjang + ': ' + p.nama + ' (' + p.noDaftar + ')'
        };
      });

    return { pendaftar: pendaftar, verifikasi: verifikasi, log: log };
  }

  PPDB.seed = {
    SEED: SEED,
    JUMLAH: JUMLAH,
    generate: generate
  };
})(window);
