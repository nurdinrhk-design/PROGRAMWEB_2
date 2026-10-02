/* =====================================================================
   form.js — Tambah / Ubah Pendaftar (P-04, Tahap 7)
   FR-10 tambah · FR-11 ubah (?id=pd-0001) · BR-01…BR-06, BR-13
   Stepper 4 langkah. Validasi saat kolom ditinggalkan (blur), saat
   pindah langkah, dan lintas kolom (jalur ↔ tanggal KK, prestasi ↔ berkas).
   ===================================================================== */
(function (window, document) {
  'use strict';

  var PPDB = window.PPDB;
  if (!PPDB || !document.body.classList.contains('is-authed')) return; // dialihkan ke login oleh shell.js

  var R = PPDB.rules;
  var S = PPDB.store;
  var U = PPDB.ui;
  var el = U.el;
  var $ = function (sel) { return document.querySelector(sel); };

  // Kolom setiap langkah (urutan = urutan fokus saat ada error)
  var LANGKAH = [
    ['nama', 'nisn', 'jk', 'tempatLahir', 'tglLahir', 'namaOrtu', 'noHp'],
    ['alamat', 'kelurahan', 'kecamatan', 'tglTerbitKk', 'jarakMeter', 'jalur'],
    ['sekolahAsal', 'tahunLulus', 'smt', 'prestasiTingkat', 'prestasiNama'],
    ['berkas']
  ];
  var TERAKHIR = LANGKAH.length - 1;

  /* ---------- Mode tambah / ubah ---------- */
  var idParam = new URLSearchParams(window.location.search).get('id');
  var editId = /^pd-\d{4,6}$/.test(idParam || '') ? idParam : null;
  var asli = editId ? S.ambil(editId) : null;
  var modeUbah = !!asli;
  // Data lama (sebelum nilai per semester dicatat) hanya punya rata-rata
  var semesterLama = modeUbah && !(Array.isArray(asli.nilaiSemester) && asli.nilaiSemester.length === R.JUMLAH_SEMESTER);

  var form = $('#form-pendaftar');
  var tombolSebelumnya = form.querySelector('[data-aksi="sebelumnya"]');
  var tombolLanjut = form.querySelector('[data-aksi="lanjut"]');
  var ringkasanError = $('[data-ringkasan-error]');

  var langkah = 0;
  var tercapai = 0;                         // langkah terjauh yang boleh dibuka dari stepper
  var selesai = [false, false, false, false];
  var berkas = {};                          // jenis → { jenis, namaFile, ukuranKb, hasilCek }
  var kotor = false;
  var tersimpan = false;

  /* =================================================================
     1. Membaca nilai & validator
     ================================================================= */
  function nilai(nama) {
    if (nama === 'jk' || nama === 'jalur') {
      var pilih = form.querySelector('input[name="' + nama + '"]:checked');
      return pilih ? pilih.value : '';
    }
    if (nama === 'smt') return inputSemester().map(function (i) { return i.value.trim(); });
    var c = form.elements[nama];
    return c ? c.value.trim() : '';
  }

  function inputSemester() {
    return Array.prototype.slice.call(form.querySelectorAll('[data-semester] input'));
  }

  function teksWajib(label, min, maks) {
    return function (v) {
      if (!v) return label + ' wajib diisi.';
      if (v.length < min) return label + ' minimal ' + min + ' karakter.';
      if (v.length > maks) return label + ' maksimal ' + maks + ' karakter.';
      return '';
    };
  }

  // Nilai semester: kelimanya wajib (kecuali data lama yang dibiarkan kosong)
  function cekSemester(daftar) {
    var input = inputSemester();
    var kosongSemua = daftar.every(function (v) { return v === ''; });
    var pesan = '';
    daftar.forEach(function (v, i) {
      var err = semesterLama && kosongSemua ? '' : R.validasi.nilaiRapor(v);
      input[i].setAttribute('aria-invalid', String(!!err));
      if (err && !pesan) pesan = 'Semester ' + (i + 1) + ': ' + err.charAt(0).toLowerCase() + err.slice(1);
    });
    return pesan;
  }

  var CEK = {
    nama: function (v) { return R.validasi.nama(v); },
    nisn: function (v) { return R.validasi.nisn(v, function (n) { return S.nisnDipakai(n, editId); }); },
    jk: function (v) { return v ? '' : 'Jenis kelamin wajib dipilih.'; },
    tempatLahir: teksWajib('Tempat lahir', 3, 60),
    tglLahir: function (v) { return R.validasi.tglLahir(v); },
    namaOrtu: function (v) { return R.validasi.nama(v, 'Nama orang tua/wali'); },
    noHp: function (v) { return R.validasi.noHp(v); },
    alamat: teksWajib('Alamat', 10, 160),
    kelurahan: teksWajib('Kelurahan', 3, 60),
    kecamatan: teksWajib('Kecamatan', 3, 60),
    tglTerbitKk: function (v) { return R.validasi.tglTerbitKk(v, nilai('jalur')); },       // BR-03 lintas kolom
    jarakMeter: function (v) { return R.validasi.jarakMeter(v); },
    jalur: function (v) { return R.jalur(v) ? '' : 'Jalur pendaftaran wajib dipilih.'; },
    sekolahAsal: function (v) { return R.sekolahAsal(v) ? '' : 'Asal sekolah wajib dipilih.'; },
    tahunLulus: function (v) { return R.validasi.tahunLulus(v); },
    smt: cekSemester,
    prestasiTingkat: function (v) { return R.validasi.prestasiTingkat(v); },
    prestasiNama: function (v) { return R.validasi.prestasiNama(v, nilai('prestasiTingkat')); }
  };

  /* =================================================================
     2. Menampilkan error (aria-invalid + pesan di bawah kolom)
     ================================================================= */
  function wadah(nama) {
    return form.querySelector('[data-field="' + nama + '"]');
  }

  function tampilkanError(nama, pesan) {
    var w = wadah(nama);
    if (!w) return;
    w.classList.toggle('field--error', !!pesan);
    var p = w.querySelector('.field__error');
    if (p) p.textContent = pesan || '';
    if (nama !== 'smt') {
      w.querySelectorAll('input, select').forEach(function (c) { c.setAttribute('aria-invalid', String(!!pesan)); });
    }
  }

  function targetFokus(nama) {
    if (nama === 'smt') return form.querySelector('[data-semester] [aria-invalid="true"]') || inputSemester()[0];
    if (nama === 'jk' || nama === 'jalur') return form.querySelector('input[name="' + nama + '"]:checked') || form.querySelector('input[name="' + nama + '"]');
    if (nama.indexOf('berkas-') === 0) return document.getElementById('f-' + nama);
    return form.elements[nama];
  }

  function validasiKolom(nama, tampil) {
    var w = wadah(nama);
    var pesan = w && !w.hidden && CEK[nama] ? CEK[nama](nilai(nama)) : '';
    if (tampil) tampilkanError(nama, pesan);
    return pesan;
  }

  // Berkas wajib mengikuti jalur & prestasi (BR-05, TC-12)
  function berkasWajib() {
    return R.berkasWajib(nilai('jalur') || 'zonasi', nilai('prestasiTingkat'));
  }

  function validasiBerkas(tampil) {
    return berkasWajib().map(function (jenis) {
      var b = berkas[jenis];
      var pesan = b ? R.validasi.berkas(b.namaFile, b.ukuranKb) : R.BERKAS[jenis] + ' wajib diunggah.';
      if (tampil) tampilkanError('berkas-' + jenis, pesan);
      return { nama: 'berkas-' + jenis, pesan: pesan };
    }).filter(function (x) { return x.pesan; });
  }

  function validasiLangkah(i, tampil) {
    if (i === TERAKHIR) return validasiBerkas(tampil);
    return LANGKAH[i].map(function (nama) {
      return { nama: nama, pesan: validasiKolom(nama, tampil) };
    }).filter(function (x) { return x.pesan; });
  }

  function tampilkanRingkasanError(daftar) {
    if (!daftar.length) { ringkasanError.hidden = true; return; }
    $('[data-ringkasan-error-teks]').textContent = daftar.length === 1
      ? 'Ada 1 isian yang perlu diperbaiki: ' + daftar[0].pesan
      : 'Ada ' + daftar.length + ' isian yang perlu diperbaiki di langkah ini. Periksa kolom yang ditandai merah.';
    ringkasanError.hidden = false;
    var t = targetFokus(daftar[0].nama);
    if (t) t.focus();
  }

  /* =================================================================
     3. Stepper
     ================================================================= */
  var JUDUL_LANJUT = ['Lanjut', 'Lanjut', 'Lanjut', modeUbah ? 'Simpan perubahan' : 'Simpan pendaftar'];

  function renderStepper() {
    document.querySelectorAll('.stepper__item').forEach(function (li, i) {
      var aktif = i === langkah;
      li.classList.toggle('is-active', aktif);
      li.classList.toggle('is-done', !aktif && selesai[i]);
      if (aktif) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
      var b = li.querySelector('.stepper__button');
      b.disabled = i > tercapai;
      b.setAttribute('aria-label', 'Langkah ' + (i + 1) + ': ' + li.textContent.trim() +
        (aktif ? ' (sedang diisi)' : selesai[i] ? ' (sudah lengkap)' : ''));
    });
  }

  function keLangkah(i, fokusJudul) {
    langkah = i;
    tercapai = Math.max(tercapai, i);
    form.querySelectorAll('.form-step').forEach(function (s) {
      s.hidden = Number(s.getAttribute('data-langkah')) !== i;
    });
    ringkasanError.hidden = true;
    tombolSebelumnya.hidden = i === 0;
    $('[data-label-lanjut]').textContent = JUDUL_LANJUT[i];
    $('[data-ikon-lanjut]').textContent = i === TERAKHIR ? 'save' : 'arrow_forward';
    $('[data-posisi]').textContent = 'Langkah ' + (i + 1) + ' dari ' + LANGKAH.length;
    if (i === TERAKHIR) { renderBerkas(); renderRingkasan(); }
    renderAturan();
    renderStepper();
    if (fokusJudul) {
      var judul = form.querySelector('.form-step[data-langkah="' + i + '"] .form-step__title');
      judul.focus({ preventScroll: true });
      var kartu = $('.form-card');
      if (kartu.getBoundingClientRect().top < 0) kartu.scrollIntoView({ block: 'start' });
    }
  }

  // Pindah lewat stepper: maju hanya bila langkah-langkah sebelumnya valid
  function lompatKe(target) {
    if (target <= langkah) { keLangkah(target, true); return; }
    for (var i = langkah; i < target; i++) {
      var err = validasiLangkah(i, true);
      if (err.length) {
        if (i !== langkah) keLangkah(i, false);
        tampilkanRingkasanError(err);
        return;
      }
      selesai[i] = true;
    }
    keLangkah(target, true);
  }

  /* =================================================================
     4. Isi dinamis: pilihan, nilai semester, berkas, ringkasan, aturan
     ================================================================= */
  function isiPilihan() {
    var hostJalur = $('[data-pilihan-jalur]');
    R.JALUR.forEach(function (j) {
      hostJalur.appendChild(el('label', { className: 'choice-card' }, [
        el('input', { attrs: { type: 'radio', name: 'jalur', value: j.kode, required: true } }),
        el('span', null, [
          el('span', { className: 'choice-card__title', text: j.nama }),
          el('span', { className: 'choice-card__meta', text: 'Kuota ' + U.angka(j.kuota) + ' · ' + (j.dasar === 'skor' ? 'skor tertinggi' : 'jarak terdekat') }),
          el('span', { className: 'choice-card__meta', text: j.syarat })
        ])
      ]));
    });

    var sekolah = $('#f-sekolahAsal');
    [['negeri', 'Negeri'], ['swasta', 'Swasta']].forEach(function (g) {
      var grup = el('optgroup', { attrs: { label: g[1] } });
      R.SEKOLAH_ASAL.filter(function (s) { return s.status === g[0]; }).forEach(function (s) {
        grup.appendChild(el('option', { text: s.nama, attrs: { value: s.kode } }));
      });
      sekolah.appendChild(grup);
    });

    R.TAHUN_LULUS.forEach(function (t) { $('#f-tahunLulus').appendChild(el('option', { text: t, attrs: { value: t } })); });

    Object.keys(R.PRESTASI_LABEL).forEach(function (k) {
      $('#f-prestasiTingkat').appendChild(el('option', { text: R.PRESTASI_LABEL[k] + ' (bonus +' + R.PRESTASI_BONUS[k] + ')', attrs: { value: k } }));
    });

    var hostSmt = $('[data-semester]');
    for (var i = 1; i <= R.JUMLAH_SEMESTER; i++) {
      hostSmt.appendChild(el('div', { className: 'semester' }, [
        el('label', { className: 'semester__label', text: 'Semester ' + i, attrs: { for: 'f-smt-' + i } }),
        el('input', { className: 'field__control num', attrs: {
          id: 'f-smt-' + i, inputmode: 'decimal', maxlength: '6', autocomplete: 'off',
          required: !semesterLama, 'aria-describedby': 'f-smt-hint f-smt-error'
        } })
      ]));
    }

    var hariIni = R.TANGGAL_SIMULASI;
    $('#f-tglLahir').setAttribute('max', hariIni);
    $('#f-tglLahir').setAttribute('min', '1995-01-01');
    $('#f-tglTerbitKk').setAttribute('max', hariIni);
    $('#f-tglTerbitKk').setAttribute('min', '1990-01-01');
  }

  function angkaDesimal(v) {
    return R.validasi.nilaiRapor(v) ? null : Number(String(v).replace(',', '.'));
  }

  function perbaruiNilai() {
    var daftar = nilai('smt').map(angkaDesimal);
    var rata = daftar.every(function (n) { return n !== null; }) ? R.rataRapor(daftar) : null;
    if (rata === null && semesterLama && nilai('smt').every(function (v) { return v === ''; })) rata = asli.nilaiRapor;
    var out = $('[data-output-nilai]');
    U.kosongkan(out);
    if (rata === null) { out.textContent = 'Rata-rata dihitung otomatis setelah kelima nilai terisi.'; return; }
    out.appendChild(document.createTextNode('Rata-rata rapor: '));
    out.appendChild(el('strong', { text: U.desimal(rata) }));
    if (nilai('jalur') === 'prestasi') {
      var tingkat = nilai('prestasiTingkat');
      var skor = R.skorPrestasi({ nilaiRapor: rata, prestasiTingkat: tingkat });
      out.appendChild(document.createTextNode(' · Skor jalur prestasi: '));
      out.appendChild(el('strong', { text: U.desimal(skor) }));
      out.appendChild(document.createTextNode(tingkat ? ' (bonus +' + R.PRESTASI_BONUS[tingkat] + ')' : ' (tanpa bonus)'));
    }
  }

  function perbaruiHint() {
    var tgl = nilai('tglLahir');
    $('[data-hint-usia]').textContent = R.validasi.tglLahir(tgl)
      ? 'Usia dihitung per 1 Juli 2026.'
      : 'Usia per 1 Juli 2026: ' + R.usiaPada(tgl) + ' tahun.';
    var jarak = nilai('jarakMeter');
    $('[data-hint-jarak]').textContent = R.validasi.jarakMeter(jarak)
      ? 'Bilangan bulat, 1–50.000 meter.'
      : U.jarak(Number(jarak)) + ' ≈ ' + U.desimal(Number(jarak) / 1000).replace(/0$/, '') + ' km.';
  }

  function aturPrestasi() {
    var ada = !!nilai('prestasiTingkat');
    var w = wadah('prestasiNama');
    w.hidden = !ada;
    form.elements.prestasiNama.required = ada;
    if (!ada) tampilkanError('prestasiNama', '');
  }

  function renderBerkas() {
    var host = $('[data-daftar-berkas]');
    U.kosongkan(host);
    berkasWajib().forEach(function (jenis) {
      var b = berkas[jenis];
      var id = 'f-berkas-' + jenis;
      host.appendChild(el('div', { className: 'field upload', attrs: { 'data-field': 'berkas-' + jenis } }, [
        el('div', { className: 'upload__row' }, [
          U.icon(b ? 'task' : 'upload_file', 'upload__icon'),
          el('div', { className: 'upload__body' }, [
            el('p', { className: 'upload__title' }, [R.BERKAS[jenis], el('span', { className: 'field__required', text: ' *', attrs: { 'aria-hidden': 'true' } })]),
            el('p', { className: 'upload__meta', text: b ? b.namaFile + ' · ' + U.angka(b.ukuranKb) + ' KB' : 'Belum ada berkas', attrs: { id: id + '-meta' } })
          ]),
          el('input', { className: 'upload__input sr-only', attrs: {
            type: 'file', id: id, 'data-jenis': jenis,
            accept: R.BERKAS_FORMAT.map(function (f) { return '.' + f; }).join(','),
            'aria-describedby': id + '-meta ' + id + '-error'
          } }),
          el('label', { className: 'btn btn--outlined btn--sm upload__button', attrs: { for: id } }, [
            U.icon(b ? 'swap_horiz' : 'upload'), b ? 'Ganti' : 'Pilih berkas',
            el('span', { className: 'sr-only', text: ' ' + R.BERKAS[jenis] })
          ])
        ]),
        el('p', { className: 'field__error', attrs: { id: id + '-error' } })
      ]));
    });
  }

  function pilihBerkas(input) {
    var jenis = input.getAttribute('data-jenis');
    var f = input.files[0];
    input.value = '';
    if (!f) return;
    var kb = Math.max(1, Math.ceil(f.size / 1024));
    var pesan = R.validasi.berkas(f.name, kb);
    if (pesan) {
      tampilkanError('berkas-' + jenis, pesan + ' (' + f.name + ')');
      document.getElementById('f-berkas-' + jenis).focus();
      return;
    }
    // Berkas baru selalu perlu dicek ulang oleh panitia
    berkas[jenis] = { jenis: jenis, namaFile: f.name.slice(0, 120), ukuranKb: kb, hasilCek: 'belum' };
    kotor = true;
    renderBerkas();
    renderRingkasan();
    document.getElementById('f-berkas-' + jenis).focus();
  }

  function info(label, isi) {
    return [el('dt', { text: label }), el('dd', { text: isi || '–' })];
  }

  function renderRingkasan() {
    var j = R.jalur(nilai('jalur'));
    var sekolah = R.sekolahAsal(nilai('sekolahAsal'));
    var tingkat = nilai('prestasiTingkat');
    var smt = nilai('smt');
    var angkaSmt = smt.map(angkaDesimal);
    var rata = angkaSmt.every(function (n) { return n !== null; }) ? R.rataRapor(angkaSmt) : (semesterLama ? asli.nilaiRapor : null);

    var bagian = [
      ['Identitas', 0, [
        info('Nama', nilai('nama')),
        info('NISN', nilai('nisn')),
        info('Jenis kelamin', { L: 'Laki-laki', P: 'Perempuan' }[nilai('jk')]),
        info('Tempat, tgl lahir', nilai('tempatLahir') + ', ' + U.tanggal(nilai('tglLahir'))),
        info('Orang tua/wali', nilai('namaOrtu')),
        info('No. HP', nilai('noHp'))
      ]],
      ['Domisili & jalur', 1, [
        info('Alamat', nilai('alamat') + ', Kel. ' + nilai('kelurahan') + ', Kec. ' + nilai('kecamatan')),
        info('Terbit KK', U.tanggal(nilai('tglTerbitKk'))),
        info('Jarak', R.validasi.jarakMeter(nilai('jarakMeter')) ? '' : U.jarak(Number(nilai('jarakMeter')))),
        info('Jalur', j ? j.nama : '')
      ]],
      ['Akademik', 2, [
        info('Asal sekolah', sekolah ? sekolah.nama : ''),
        info('Tahun lulus', nilai('tahunLulus')),
        info('Nilai semester', smt.every(function (v) { return v === ''; }) ? 'belum tercatat' : smt.join(' · ')),
        info('Rata-rata rapor', rata === null ? '' : U.desimal(rata)),
        info('Prestasi', tingkat ? nilai('prestasiNama') + ' (' + R.PRESTASI_LABEL[tingkat] + ')' : 'Tidak ada')
      ].concat(j && j.dasar === 'skor' && rata !== null
        ? [info('Skor seleksi', U.desimal(R.skorPrestasi({ nilaiRapor: rata, prestasiTingkat: tingkat })))]
        : [])]
    ];

    var host = $('[data-ringkasan-isian]');
    U.kosongkan(host);
    bagian.forEach(function (b) {
      host.appendChild(el('section', { className: 'summary__section' }, [
        el('div', { className: 'summary__head' }, [
          el('h4', { className: 'summary__title', text: b[0] }),
          el('button', { className: 'btn btn--text btn--sm', attrs: { type: 'button', 'data-ke': b[1] } }, [
            U.icon('edit'), 'Ubah', el('span', { className: 'sr-only', text: ' ' + b[0].toLowerCase() })
          ])
        ]),
        el('dl', { className: 'info-list' }, [].concat.apply([], b[2]))
      ]));
    });
  }

  function renderAturan() {
    var bonus = Object.keys(R.PRESTASI_BONUS).map(function (k) { return R.PRESTASI_LABEL[k].toLowerCase() + ' +' + R.PRESTASI_BONUS[k]; }).join(', ');
    var ATURAN = [
      ['NISN 10 digit dan belum dipakai pendaftar lain.',
        'Usia paling tinggi ' + R.USIA_MAKS + ' tahun per 1 Juli 2026.',
        'Nomor HP diawali 08, 10–13 digit.'],
      ['Jalur zonasi: KK terbit paling lambat ' + U.tanggal(R.BATAS_KK_ZONASI) + '.',
        'Jarak dalam meter, bilangan bulat 1–50.000.',
        'Zonasi, afirmasi, dan perpindahan diperingkat dari jarak terdekat; prestasi dari skor tertinggi.'],
      ['Nilai tiap semester 0–100, maksimal 2 desimal. Rata-rata dihitung otomatis.',
        'Skor jalur prestasi = rata-rata rapor + bonus prestasi (' + bonus + ').',
        'Prestasi yang diisi wajib dilengkapi sertifikat.'],
      ['Format ' + R.BERKAS_FORMAT.filter(function (f) { return f !== 'jpeg'; }).join(', ').toUpperCase() + ', maksimal ' + (R.BERKAS_MAKS_KB / 1024) + ' MB per berkas.',
        'Berkas wajib: KK, akta kelahiran, rapor, ditambah berkas khusus jalur.',
        modeUbah ? 'Berkas yang diganti akan dicek ulang oleh verifikator.' : 'Pendaftar baru berstatus Menunggu dan masuk antrean verifikasi.']
    ];
    var host = $('[data-aturan]');
    U.kosongkan(host);
    ATURAN[langkah].forEach(function (t) {
      host.appendChild(el('li', { className: 'rule-list__item' }, [U.icon('rule', 'rule-list__icon'), el('span', { text: t })]));
    });
  }

  /* =================================================================
     5. Mode ubah: isi formulir dari data tersimpan
     ================================================================= */
  function isiDariData(p) {
    ['nama', 'nisn', 'tempatLahir', 'tglLahir', 'namaOrtu', 'noHp', 'alamat', 'kelurahan', 'kecamatan',
      'tglTerbitKk', 'jarakMeter', 'sekolahAsal', 'tahunLulus', 'prestasiTingkat', 'prestasiNama'].forEach(function (k) {
      form.elements[k].value = p[k] === undefined || p[k] === null ? '' : String(p[k]);
    });
    var jk = form.querySelector('input[name="jk"][value="' + p.jk + '"]');
    if (jk) jk.checked = true;
    var jalur = form.querySelector('input[name="jalur"][value="' + p.jalur + '"]');
    if (jalur) jalur.checked = true;
    if (!semesterLama) {
      inputSemester().forEach(function (input, i) { input.value = String(p.nilaiSemester[i]).replace('.', ','); });
    } else {
      $('[data-hint-semester]').textContent = 'Nilai per semester belum tercatat untuk data ini. Kosongkan kelimanya untuk mempertahankan rata-rata ' +
        U.desimal(p.nilaiRapor) + ', atau isi kelimanya untuk menghitung ulang.';
    }
    (p.berkas || []).forEach(function (b) { berkas[b.jenis] = { jenis: b.jenis, namaFile: b.namaFile, ukuranKb: b.ukuranKb, hasilCek: b.hasilCek }; });
  }

  function siapkanModeUbah(p) {
    var judul = 'Ubah Data Pendaftar';
    document.title = judul + ' · PPDB Online';
    $('[data-judul]').textContent = judul;
    $('[data-judul-bar]').textContent = judul;
    $('[data-crumb]').textContent = 'Ubah';
    $('[data-deskripsi]').textContent = p.noDaftar + ' · ' + p.nama + '. Perubahan dicatat di log aktivitas.';
    // Halaman ubah dibuka dari Data Pendaftar → menu itu yang ditandai aktif
    document.querySelectorAll('.nav-item[data-page]').forEach(function (a) {
      if (a.getAttribute('data-page') === 'data-master') a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    if (p.status !== 'menunggu') {
      $('[data-peringatan-judul]').textContent = 'Pendaftar ini berstatus ' + R.STATUS_VERIFIKASI[p.status].label;
      $('[data-peringatan-ulang]').hidden = false;
    }
    isiDariData(p);
    selesai = [true, true, true, true];
    tercapai = TERAKHIR;
  }

  /* =================================================================
     6. Simpan (FR-10, FR-11, TC-14)
     ================================================================= */
  function kumpulkanIsian() {
    var isian = {};
    ['nama', 'nisn', 'jk', 'tempatLahir', 'tglLahir', 'namaOrtu', 'noHp', 'alamat', 'kelurahan', 'kecamatan',
      'tglTerbitKk', 'jarakMeter', 'jalur', 'sekolahAsal', 'tahunLulus', 'prestasiTingkat', 'prestasiNama'].forEach(function (k) {
      isian[k] = nilai(k);
    });
    var smt = nilai('smt');
    if (semesterLama && smt.every(function (v) { return v === ''; })) {
      isian.nilaiRapor = asli.nilaiRapor;
    } else {
      isian.nilaiSemester = smt.map(angkaDesimal);
    }
    isian.berkas = berkasWajib().map(function (jenis) { return berkas[jenis]; });
    return isian;
  }

  function simpan() {
    for (var i = 0; i <= TERAKHIR; i++) {
      var err = validasiLangkah(i, true);
      if (err.length) {
        if (i !== langkah) keLangkah(i, false);
        tampilkanRingkasanError(err);
        return;
      }
    }
    tombolLanjut.disabled = true;
    var isian = kumpulkanIsian();
    var pesan, noDaftar;
    if (modeUbah) {
      var hasil = S.ubah(editId, isian);
      if (!hasil) { tombolLanjut.disabled = false; U.snackbar('Data tidak ditemukan. Mungkin sudah dihapus di tab lain.'); return; }
      noDaftar = hasil.data.noDaftar;
      pesan = 'Perubahan data ' + hasil.data.nama + ' disimpan.' +
        (hasil.perluVerifikasiUlang ? ' Status kembali Menunggu untuk verifikasi ulang.' : '');
    } else {
      var baru = S.tambah(isian);
      noDaftar = baru.noDaftar;
      pesan = 'Pendaftar ' + baru.nama + ' tersimpan dengan nomor ' + baru.noDaftar + ' dan masuk antrean verifikasi.';
    }
    tersimpan = true;
    U.titipPesan(pesan);
    window.location.href = 'data-master.html?q=' + encodeURIComponent(noDaftar);
  }

  /* =================================================================
     7. Event
     ================================================================= */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var err = validasiLangkah(langkah, true);
    if (err.length) { tampilkanRingkasanError(err); return; }
    selesai[langkah] = true;
    if (langkah < TERAKHIR) keLangkah(langkah + 1, true); else simpan();
  });

  tombolSebelumnya.addEventListener('click', function () { keLangkah(Math.max(0, langkah - 1), true); });

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-ke]');
    if (b && !b.disabled) lompatKe(Number(b.getAttribute('data-ke')));
  });

  function namaKolom(target) {
    if (target.closest('[data-semester]')) return 'smt';
    return target.name || '';
  }

  // Kolom yang ditinggalkan langsung dicek
  form.addEventListener('focusout', function (e) {
    var nama = namaKolom(e.target);
    if (!CEK[nama] || e.target.type === 'radio') return;
    if (nama === 'smt' && e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('[data-semester]')) return;
    if (nama === 'smt' && nilai('smt').every(function (v) { return v === ''; }) && !wadah('smt').classList.contains('field--error')) return;
    validasiKolom(nama, true);
  });

  // Saat mengetik: error yang sudah tampil hilang begitu isian benar
  form.addEventListener('input', function (e) {
    kotor = true;
    var nama = namaKolom(e.target);
    var w = wadah(nama);
    if (w && w.classList.contains('field--error')) validasiKolom(nama, true);
    if (nama === 'smt') perbaruiNilai();
    if (nama === 'tglLahir' || nama === 'jarakMeter') perbaruiHint();
  });

  form.addEventListener('change', function (e) {
    kotor = true;
    var t = e.target;
    if (t.type === 'file') { pilihBerkas(t); return; }
    var nama = namaKolom(t);
    if (t.type === 'radio' || t.tagName === 'SELECT') validasiKolom(nama, true);
    if (nama === 'jalur') {
      // BR-03: syarat KK bergantung jalur → cek ulang bila tanggal KK sudah diisi
      if (nilai('tglTerbitKk')) validasiKolom('tglTerbitKk', true);
      perbaruiNilai();
    }
    if (nama === 'prestasiTingkat') { aturPrestasi(); perbaruiNilai(); }
    if (nama === 'tglLahir' || nama === 'tglTerbitKk') { validasiKolom(nama, true); perbaruiHint(); }
  });

  // Peringatan bila meninggalkan halaman dengan isian yang belum disimpan
  window.addEventListener('beforeunload', function (e) {
    if (!kotor || tersimpan) return;
    e.preventDefault();
    e.returnValue = '';
  });

  /* ---------- Mulai ---------- */
  isiPilihan();
  if (editId && !asli) {
    $('[data-area-form]').hidden = true;
    $('[data-tidak-ditemukan]').hidden = false;
    document.title = 'Data tidak ditemukan · PPDB Online';
    return;
  }
  if (modeUbah) siapkanModeUbah(asli);
  aturPrestasi();
  perbaruiNilai();
  perbaruiHint();
  keLangkah(0, false);
})(window, document);
