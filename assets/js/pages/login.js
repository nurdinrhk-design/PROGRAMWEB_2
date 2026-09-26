/* =====================================================================
   login.js — Halaman masuk panitia (P-01, FR-01)
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

  /* ---------- Kirim form ---------- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    tampilkan('[data-error]', '');
    var username = form.username.value.trim();
    var sandi = form.sandi.value;

    aturError('username', username ? '' : 'Username wajib diisi.');
    aturError('sandi', sandi ? '' : 'Kata sandi wajib diisi.');
    if (!username) { form.username.focus(); return; }
    if (!sandi) { form.sandi.focus(); return; }

    var hasil = PPDB.auth.login(username, sandi, form.ingat.checked);
    if (!hasil.ok) {
      tampilkan('[data-error]', hasil.error);
      if (hasil.kolom) aturError(hasil.kolom, ' ');
      form.sandi.select();
      form.sandi.focus();
      return;
    }
    window.location.replace(PPDB.auth.tujuanSetelahLogin());
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
    var demo = R.PANITIA[0];
    form.username.value = demo.username;
    form.sandi.value = demo.sandi;
    aturError('username', '');
    aturError('sandi', '');
    form.querySelector('[type="submit"]').focus();
  });

  isiPanel();
  pesanDariUrl();
})(window, document);
