/* =====================================================================
   portal-akun.js — Akun saya (orang tua) (Tahap 15, v1.2)
   Ubah nama & no. HP, ganti kata sandi (sandi lama wajib benar,
   sandi baru di-hash ulang dengan salt baru).
   ===================================================================== */
(function (window, document) {
  'use strict';

  var PPDB = window.PPDB;
  if (!PPDB || !document.body.classList.contains('is-authed')) return; // dialihkan oleh shell.js

  var R = PPDB.rules;
  var S = PPDB.store;
  var U = PPDB.ui;
  var $ = function (sel) { return document.querySelector(sel); };
  var akun = PPDB.auth.pesertaAktif();

  function aturError(form, nama, pesan) {
    var grup = form.querySelector('[data-field="' + nama + '"]');
    grup.classList.toggle('field--error', Boolean(pesan));
    grup.querySelector('.field__error').textContent = pesan;
    form[nama].setAttribute('aria-invalid', pesan ? 'true' : 'false');
  }

  /* ---------- Profil ---------- */
  var fp = $('[data-form-profil]');
  var CEK_PROFIL = {
    nama: function (v) { return R.validasi.nama(v, 'Nama orang tua/wali'); },
    noHp: function (v) { return R.validasi.noHp(v); }
  };

  function isiProfil() {
    akun = PPDB.auth.pesertaAktif();
    $('#email').value = akun.email;
    fp.nama.value = akun.nama;
    fp.noHp.value = akun.noHp;
  }

  fp.addEventListener('submit', function (e) {
    e.preventDefault();
    var salah = Object.keys(CEK_PROFIL).filter(function (k) {
      var pesan = CEK_PROFIL[k](fp[k].value.trim());
      aturError(fp, k, pesan);
      return pesan;
    });
    if (salah.length) { fp[salah[0]].focus(); return; }
    var hasil = S.ubahAkun(akun.id, { nama: fp.nama.value.trim(), noHp: fp.noHp.value.trim() });
    if (!hasil.ok) { U.snackbar(hasil.error); return; }
    // Nama di bar atas ikut diperbarui
    document.querySelectorAll('[data-user-name]').forEach(function (n) { n.textContent = hasil.data.nama; });
    document.querySelectorAll('[data-user-initials]').forEach(function (n) { n.textContent = U.inisial(hasil.data.nama); });
    U.snackbar('Profil disimpan.');
  });

  /* ---------- Kata sandi ---------- */
  var fs = $('[data-form-sandi]');
  var tombol = $('[data-tombol-sandi]');

  fs.addEventListener('submit', function (e) {
    e.preventDefault();
    var lama = fs.sandiLama.value;
    var baru = fs.sandiBaru.value;
    var ulang = fs.sandiUlang.value;
    aturError(fs, 'sandiLama', lama ? '' : 'Kata sandi saat ini wajib diisi.');
    aturError(fs, 'sandiBaru', R.validasi.sandiBaru(baru));
    aturError(fs, 'sandiUlang', !ulang ? 'Ulangi kata sandi baru.' : (ulang === baru ? '' : 'Kata sandi tidak sama.'));
    var pertama = ['sandiLama', 'sandiBaru', 'sandiUlang'].filter(function (k) { return fs[k].getAttribute('aria-invalid') === 'true'; })[0];
    if (pertama) { fs[pertama].focus(); return; }

    tombol.disabled = true;
    PPDB.auth.gantiSandi(lama, baru).then(function (hasil) {
      tombol.disabled = false;
      if (!hasil.ok) {
        aturError(fs, hasil.kolom || 'sandiBaru', hasil.error);
        fs[hasil.kolom || 'sandiBaru'].focus();
        return;
      }
      fs.reset();
      U.snackbar('Kata sandi diganti. Gunakan kata sandi baru saat masuk berikutnya.');
    }, function () {
      tombol.disabled = false;
      U.snackbar('Browser ini tidak mendukung pengamanan kata sandi.');
    });
  });

  ['sandiLama', 'sandiBaru', 'sandiUlang'].forEach(function (k) {
    fs[k].addEventListener('input', function () { if (fs[k].getAttribute('aria-invalid') === 'true') aturError(fs, k, ''); });
  });
  ['nama', 'noHp'].forEach(function (k) {
    fp[k].addEventListener('input', function () { if (fp[k].getAttribute('aria-invalid') === 'true') aturError(fp, k, CEK_PROFIL[k](fp[k].value.trim())); });
  });

  // Akun hasil data simulasi tidak punya kata sandi
  if (!akun.sandiHash) {
    fs.hidden = true;
    $('[data-info-simulasi]').hidden = false;
  }
  isiProfil();
})(window, document);
