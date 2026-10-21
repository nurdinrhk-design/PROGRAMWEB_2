/* =====================================================================
   login.js — Halaman masuk dua peran: orang tua & panitia (P-01, FR-01, Tahap 14)
   ===================================================================== */
(function (window, document) {
  'use strict';

  var PPDB = window.PPDB;
  // Jika sesi masih aktif, shell.js sudah mengalihkan halaman
  if (!PPDB || !PPDB.auth) return;

  var R = PPDB.rules;
  var ui = PPDB.ui;
  var form = document.querySelector('[data-login-form]');
  var fmtBulan = new Intl.DateTimeFormat('id-ID', { month: 'short' });
  var peran = 'peserta';

  // Teks & atribut kolom yang berubah menurut peran
  var PERAN = {
    peserta: {
      judul: 'Masuk orang tua / wali', desk: 'Daftarkan anak Anda dan pantau status pendaftarannya.',
      label: 'Email', ikon: 'mail', tipe: 'email', maks: '80', kosong: 'Email wajib diisi.',
      demo: ['Email ', 'orangtua@ppdb.test', ' · kata sandi ', 'orangtua2026']
    },
    panitia: {
      judul: 'Masuk panitia', desk: 'Gunakan akun panitia yang diberikan sekolah.',
      label: 'Username', ikon: 'person', tipe: 'text', maks: '40', kosong: 'Username wajib diisi.',
      demo: ['Username ', 'panitia', ' · kata sandi ', 'ppdb2026']
    }
  };

  /* ---------- Panel informasi dari data (AS-02) ---------- */
  function rentang(j) {
    var a = R.parseTanggal(j.mulai);
    var b = R.parseTanggal(j.selesai);
    if (j.mulai === j.selesai) return a.getDate() + ' ' + fmtBulan.format(a);
    if (a.getMonth() === b.getMonth()) return a.getDate() + '–' + b.getDate() + ' ' + fmtBulan.format(b);
    return a.getDate() + ' ' + fmtBulan.format(a) + ' – ' + b.getDate() + ' ' + fmtBulan.format(b);
  }

  function isiPanel() {
    var hariIni = R.today();
    var tahap = R.tahapAktif();
    document.querySelector('[data-sekolah]').textContent = R.SEKOLAH.nama;
    document.querySelector('[data-tahap]').textContent = 'Tahun Ajaran ' + R.SEKOLAH.tahunAjaran +
      (tahap ? ' · ' + tahap.nama.split(' & ')[0] + ' hari ke-' + tahap.hariKe + ' dari ' + tahap.totalHari : '');

    var daftar = document.querySelector('[data-jadwal]');
    R.JADWAL.forEach(function (j) {
      var aktif = R.parseTanggal(j.mulai) <= hariIni && hariIni <= R.parseTanggal(j.selesai);
      daftar.appendChild(ui.el('li', {
        className: 'schedule__item' + (aktif ? ' is-active' : ''),
        attrs: aktif ? { 'aria-current': 'step' } : null
      }, [
        ui.el('span', { text: j.nama + (aktif ? ' (berjalan)' : '') }),
        ui.el('span', { className: 'schedule__date', text: rentang(j) })
      ]));
    });
  }

  /* ---------- Pesan ---------- */
  function tampilkan(selector, pesan) {
    var box = document.querySelector(selector);
    box.querySelector('.alert__body').textContent = pesan;
    box.hidden = !pesan;
  }

  function aturError(nama, pesan) {
    var grup = form.querySelector('[data-field="' + nama + '"]');
    var input = grup.querySelector('.field__control');
    grup.classList.toggle('field--error', Boolean(pesan));
    grup.querySelector('.field__error').textContent = pesan;
    input.setAttribute('aria-invalid', pesan ? 'true' : 'false');
  }

  function pesanDariUrl() {
    var q = new URLSearchParams(window.location.search);
    if (q.get('keluar') === '1') tampilkan('[data-info]', 'Anda sudah keluar. Sampai jumpa.');
    else if (q.get('kembali')) tampilkan('[data-info]', 'Silakan masuk untuk membuka halaman tersebut.');
  }

  /* ---------- Pilihan peran ---------- */
  function pilihPeran(p, fokus) {
    peran = p;
    var c = PERAN[p];
    document.querySelectorAll('[data-peran]').forEach(function (t) {
      var aktif = t.getAttribute('data-peran') === p;
      t.setAttribute('aria-selected', String(aktif));
      t.tabIndex = aktif ? 0 : -1;
      if (aktif) document.getElementById('panel-masuk').setAttribute('aria-labelledby', t.id);
    });
    document.querySelector('[data-judul-masuk]').textContent = c.judul;
    document.querySelector('[data-desk-masuk]').textContent = c.desk;
    document.querySelector('[data-label-id]').textContent = c.label;
    document.querySelector('[data-ikon-id]').textContent = c.ikon;
    form.username.type = c.tipe;
    form.username.maxLength = Number(c.maks);
    form.username.setAttribute('inputmode', p === 'peserta' ? 'email' : 'text');
    document.querySelector('[data-tautan-daftar]').hidden = p !== 'peserta';
    var demo = ui.kosongkan(document.querySelector('[data-demo-teks]'));
    demo.appendChild(document.createTextNode(c.demo[0]));
    demo.appendChild(ui.el('strong', { text: c.demo[1] }));
    demo.appendChild(document.createTextNode(c.demo[2]));
    demo.appendChild(ui.el('strong', { text: c.demo[3] }));
    aturError('username', '');
    aturError('sandi', '');
    tampilkan('[data-error]', '');
    if (fokus) form.username.focus();
  }

  var tabPeran = document.querySelector('[data-peran-tabs]');
  tabPeran.addEventListener('click', function (e) {
    var t = e.target.closest('[data-peran]');
    if (t) pilihPeran(t.getAttribute('data-peran'), false);
  });
  tabPeran.addEventListener('keydown', function (e) {
    if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].indexOf(e.key) < 0) return;
    e.preventDefault();
    var lain = peran === 'peserta' ? 'panitia' : 'peserta';
    var ke = e.key === 'Home' ? 'peserta' : e.key === 'End' ? 'panitia' : lain;
    pilihPeran(ke, false);
    document.querySelector('[data-peran="' + ke + '"]').focus();
  });

  /* ---------- Kirim form ---------- */
  var tombolMasuk = form.querySelector('[data-tombol-masuk]');

  function selesai(hasil) {
    tombolMasuk.disabled = false;
    if (!hasil.ok) {
      tampilkan('[data-error]', hasil.error);
      if (hasil.kolom) aturError(hasil.kolom, ' ');
      form.sandi.select();
      form.sandi.focus();
      return;
    }
    window.location.replace(PPDB.auth.tujuanSetelahLogin(peran));
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    tampilkan('[data-error]', '');
    var id = form.username.value.trim();
    var sandi = form.sandi.value;

    aturError('username', id ? '' : PERAN[peran].kosong);
    aturError('sandi', sandi ? '' : 'Kata sandi wajib diisi.');
    if (!id) { form.username.focus(); return; }
    if (!sandi) { form.sandi.focus(); return; }

    if (peran === 'panitia') { selesai(PPDB.auth.login(id, sandi, form.ingat.checked)); return; }
    tombolMasuk.disabled = true;   // hash kata sandi butuh sesaat
    PPDB.auth.loginPeserta(id, sandi, form.ingat.checked).then(selesai, function () {
      selesai({ ok: false, error: 'Browser ini tidak mendukung pemeriksaan kata sandi. Gunakan Chrome, Edge, atau Firefox terbaru.' });
    });
  });

  // Hapus tanda error begitu pengguna mulai mengetik ulang
  ['username', 'sandi'].forEach(function (nama) {
    form[nama].addEventListener('input', function () {
      if (form[nama].getAttribute('aria-invalid') === 'true') aturError(nama, '');
    });
  });

  /* ---------- Tampilkan / sembunyikan sandi ---------- */
  var tombolSandi = document.querySelector('[data-toggle-sandi]');
  tombolSandi.addEventListener('click', function () {
    var tampak = form.sandi.type === 'password';
    form.sandi.type = tampak ? 'text' : 'password';
    tombolSandi.setAttribute('aria-pressed', String(tampak));
    tombolSandi.setAttribute('aria-label', tampak ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi');
    tombolSandi.querySelector('.icon').textContent = tampak ? 'visibility_off' : 'visibility';
  });

  /* ---------- Isi otomatis akun demo ---------- */
  document.querySelector('[data-isi-demo]').addEventListener('click', function () {
    var demo = PERAN[peran].demo;
    form.username.value = demo[1];
    form.sandi.value = demo[3];
    aturError('username', '');
    aturError('sandi', '');
    form.querySelector('[type="submit"]').focus();
  });

  isiPanel();
  // Peran awal: dari ?peran= atau dari halaman yang diminta (?kembali=pages/… → panitia)
  var q = new URLSearchParams(window.location.search);
  var kembali = q.get('kembali') || '';
  pilihPeran(q.get('peran') === 'panitia' || kembali.indexOf('pages/') === 0 ? 'panitia' : 'peserta', false);
  pesanDariUrl();
})(window, document);
