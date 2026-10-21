/* =====================================================================
   daftar.js — Buat akun orang tua / wali (Tahap 14)
   Validasi per kolom, kata sandi di-hash (PBKDF2) sebelum disimpan,
   lalu langsung masuk ke portal.
   ===================================================================== */
(function (window, document) {
  'use strict';

  var PPDB = window.PPDB;
  // Jika sudah masuk, shell.js sudah mengalihkan halaman
  if (!PPDB || !PPDB.auth || !document.body.classList.contains('is-authed')) return;

  var R = PPDB.rules;
  var S = PPDB.store;
  var ui = PPDB.ui;
  var form = document.querySelector('[data-daftar-form]');
  var tombol = form.querySelector('[data-tombol-daftar]');
  var KOLOM = ['nama', 'email', 'noHp', 'sandi', 'sandi2'];

  var CEK = {
    nama: function (v) { return R.validasi.nama(v, 'Nama orang tua/wali'); },
    email: function (v) { return R.validasi.email(v, function (e) { return !!S.akunEmail(e); }); },
    noHp: function (v) { return R.validasi.noHp(v); },
    sandi: function (v) { return R.validasi.sandiBaru(v); },
    sandi2: function (v) {
      if (!v) return 'Ulangi kata sandi.';
      return v === form.sandi.value ? '' : 'Kata sandi tidak sama.';
    }
  };

  function aturError(nama, pesan) {
    var grup = form.querySelector('[data-field="' + nama + '"]');
    grup.classList.toggle('field--error', Boolean(pesan));
    grup.querySelector('.field__error').textContent = pesan;
    form[nama].setAttribute('aria-invalid', pesan ? 'true' : 'false');
  }

  function nilai(nama) {
    return nama === 'sandi' || nama === 'sandi2' ? form[nama].value : form[nama].value.trim();
  }

  function cek(nama) {
    var pesan = CEK[nama](nilai(nama));
    aturError(nama, pesan);
    return pesan;
  }

  function tampilkanError(pesan) {
    var box = document.querySelector('[data-error]');
    document.querySelector('[data-error-text]').textContent = pesan;
    box.hidden = !pesan;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    tampilkanError('');
    var salah = KOLOM.filter(function (k) { return cek(k); });
    if (salah.length) { form[salah[0]].focus(); return; }

    tombol.disabled = true;
    PPDB.auth.daftarAkun({ nama: nilai('nama'), email: nilai('email'), noHp: nilai('noHp'), sandi: form.sandi.value })
      .then(function (hasil) {
        if (!hasil.ok) {
          tombol.disabled = false;
          tampilkanError(hasil.error);
          return;
        }
        ui.titipPesan('Akun berhasil dibuat. Selamat datang! Silakan daftarkan anak Anda.');
        window.location.replace('portal/beranda.html');
      }, function () {
        tombol.disabled = false;
        tampilkanError('Browser ini tidak mendukung pengamanan kata sandi. Gunakan Chrome, Edge, atau Firefox terbaru.');
      });
  });

  // Kolom dicek saat ditinggalkan; error hilang begitu isian benar
  KOLOM.forEach(function (k) {
    form[k].addEventListener('blur', function () { if (nilai(k)) cek(k); });
    form[k].addEventListener('input', function () {
      if (form[k].getAttribute('aria-invalid') === 'true') cek(k);
      if (k === 'sandi' && nilai('sandi2')) cek('sandi2');
    });
  });

  var tombolSandi = document.querySelector('[data-toggle-sandi]');
  tombolSandi.addEventListener('click', function () {
    var tampak = form.sandi.type === 'password';
    form.sandi.type = form.sandi2.type = tampak ? 'text' : 'password';
    tombolSandi.setAttribute('aria-pressed', String(tampak));
    tombolSandi.setAttribute('aria-label', tampak ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi');
    tombolSandi.querySelector('.icon').textContent = tampak ? 'visibility_off' : 'visibility';
  });

  document.querySelector('[data-maks-anak]').textContent = String(R.MAKS_ANAK);
  document.querySelector('[data-sekolah]').textContent = R.SEKOLAH.nama;
})(window, document);
