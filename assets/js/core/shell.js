/* =====================================================================
   shell.js — App shell: autentikasi simulasi + navigasi adaptif
   Namespace: PPDB.auth, PPDB.shell
   Bagian 1 — Autentikasi & widget data (Tahap 4, FR-01, FR-02)
   Bagian 2 — Navigasi adaptif, menu akun, menu aktif (Tahap 3)
   ===================================================================== */

/* ---------------------------------------------------------------------
   BAGIAN 1 — Autentikasi simulasi & widget data
   <body data-auth="required"> : halaman admin (wajib login)
   <body data-auth="guest">    : halaman login (sudah login → dasbor)
   <body data-root="../">      : jalur ke akar situs dari halaman ini
   --------------------------------------------------------------------- */
(function (window, document) {
  'use strict';

  var PPDB = window.PPDB = window.PPDB || {};
  var R = PPDB.rules;

  var SESSION_KEY = 'ppdb.v2.session';
  var GAGAL_KEY = 'ppdb.v2.login-gagal';
  var SESI_BIASA_MS = 8 * 3600 * 1000;       // 8 jam
  var SESI_INGAT_MS = 30 * 24 * 3600 * 1000; // 30 hari ("Ingat saya")
  var MAKS_GAGAL = 5;
  var KUNCI_MS = 30 * 1000;
  // Hanya halaman internal yang boleh menjadi tujuan setelah login (anti open-redirect)
  var POLA_KEMBALI = /^pages\/[a-z-]+\.html(\?[A-Za-z0-9=&%_-]{0,120})?$/;

  var body = document.body;
  var root = body.getAttribute('data-root') || '';

  function simpanan(ingat) {
    try { return ingat ? window.localStorage : window.sessionStorage; } catch (e) { return null; }
  }

  function bacaSesi() {
    var sumber = [simpanan(false), simpanan(true)];
    for (var i = 0; i < sumber.length; i++) {
      if (!sumber[i]) continue;
      try {
        var s = JSON.parse(sumber[i].getItem(SESSION_KEY));
        if (s && s.kedaluwarsa > Date.now()) return s;
        if (s) sumber[i].removeItem(SESSION_KEY); // sesi kedaluwarsa dibersihkan
      } catch (e) { /* abaikan data rusak */ }
    }
    return null;
  }

  function panitiaAktif() {
    var s = bacaSesi();
    if (!s || !R) return null;
    return R.PANITIA.filter(function (p) { return p.id === s.panitiaId; })[0] || null;
  }

  function statusKunci() {
    try {
      var g = JSON.parse(window.sessionStorage.getItem(GAGAL_KEY)) || { jumlah: 0, sampai: 0 };
      return g;
    } catch (e) { return { jumlah: 0, sampai: 0 }; }
  }

  function catatGagal() {
    var g = statusKunci();
    g.jumlah += 1;
    if (g.jumlah >= MAKS_GAGAL) { g.sampai = Date.now() + KUNCI_MS; g.jumlah = 0; }
    try { window.sessionStorage.setItem(GAGAL_KEY, JSON.stringify(g)); } catch (e) { /* abaikan */ }
  }

  /**
   * @returns {{ok: boolean, error?: string, kolom?: 'username'|'sandi'}}
   */
  function login(username, sandi, ingat) {
    var kunci = statusKunci();
    if (kunci.sampai > Date.now()) {
      var detik = Math.ceil((kunci.sampai - Date.now()) / 1000);
      return { ok: false, error: 'Terlalu banyak percobaan. Coba lagi dalam ' + detik + ' detik.' };
    }
    var u = String(username || '').trim().toLowerCase();
    var akun = R.PANITIA.filter(function (p) { return p.username === u; })[0];
    if (!akun || akun.sandi !== String(sandi || '')) {
      catatGagal();
      return { ok: false, error: 'Username atau kata sandi salah.', kolom: 'sandi' };
    }
    try { window.sessionStorage.removeItem(GAGAL_KEY); } catch (e) { /* abaikan */ }
    var tempat = simpanan(ingat);
    if (!tempat) return { ok: false, error: 'Browser memblokir penyimpanan sesi. Izinkan penyimpanan situs lalu coba lagi.' };
    tempat.setItem(SESSION_KEY, JSON.stringify({
      panitiaId: akun.id,
      masuk: new Date().toISOString(),
      kedaluwarsa: Date.now() + (ingat ? SESI_INGAT_MS : SESI_BIASA_MS)
    }));
    if (PPDB.store) PPDB.store.catatLog('login', akun.nama + ' masuk ke sistem');
    return { ok: true };
  }

  function logout() {
    var akun = panitiaAktif();
    if (akun && PPDB.store) PPDB.store.catatLog('logout', akun.nama + ' keluar dari sistem');
    [simpanan(false), simpanan(true)].forEach(function (s) {
      try { if (s) s.removeItem(SESSION_KEY); } catch (e) { /* abaikan */ }
    });
    window.location.replace(root + 'index.html?keluar=1');
  }

  function tujuanSetelahLogin() {
    var kembali = new URLSearchParams(window.location.search).get('kembali');
    return kembali && POLA_KEMBALI.test(kembali) ? kembali : 'pages/dashboard.html';
  }

  /* ---------- Penjaga halaman ---------- */
  var mode = body.getAttribute('data-auth');
  if (mode === 'required' && !panitiaAktif()) {
    var jalurIni = window.location.pathname.split('/').slice(-2).join('/') + window.location.search;
    var q = POLA_KEMBALI.test(jalurIni) ? '?kembali=' + encodeURIComponent(jalurIni) : '';
    window.location.replace(root + 'index.html' + q);
    return;
  }
  if (mode === 'guest' && panitiaAktif()) {
    window.location.replace(root + tujuanSetelahLogin());
    return;
  }
  body.classList.add('is-authed');

  /* ---------- Widget data di app shell ---------- */
  function isiIdentitas() {
    var akun = panitiaAktif();
    if (!akun) return;
    document.querySelectorAll('[data-user-name]').forEach(function (n) { n.textContent = akun.nama; });
    document.querySelectorAll('[data-user-role]').forEach(function (n) { n.textContent = akun.peran; });
    document.querySelectorAll('[data-user-initials]').forEach(function (n) { n.textContent = akun.inisial; });
  }

  function isiTahap() {
    if (!R) return;
    var t = R.tahapAktif();
    document.querySelectorAll('[data-phase-text]').forEach(function (n) {
      n.textContent = t ? t.nama.split(' & ')[0] + ' · hari ke-' + t.hariKe + ' dari ' + t.totalHari : 'Di luar jadwal PPDB';
    });
  }

  function isiBadge() {
    if (!PPDB.store) return;
    var jumlah = PPDB.store.hitungStatus().menunggu;
    document.querySelectorAll('[data-badge="verifikasi"]').forEach(function (n) {
      n.textContent = jumlah > 99 ? '99+' : String(jumlah);
      n.hidden = jumlah === 0;
      n.setAttribute('aria-label', jumlah + ' berkas menunggu verifikasi');
    });
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-action="logout"]')) logout();
  });
  window.addEventListener('ppdb:change', isiBadge);

  isiIdentitas();
  isiTahap();
  isiBadge();

  PPDB.auth = {
    login: login,
    logout: logout,
    panitiaAktif: panitiaAktif,
    tujuanSetelahLogin: tujuanSetelahLogin
  };
})(window, document);

/* ---------------------------------------------------------------------
   BAGIAN 2 — Navigasi adaptif
   Mode navigasi (CSS di layout.css menentukan tampilan dasarnya):
     compact  < 600px    : tombol menu membuka drawer modal (.is-nav-open)
     medium   600–1199px : tombol menu membuka drawer overlay (.is-nav-open)
     large    ≥ 1200px   : tombol menu menciutkan drawer menjadi rail
                           (.is-nav-collapsed, pilihan disimpan)
   ===================================================================== */
(function (window, document) {
  'use strict';

  var PPDB = window.PPDB = window.PPDB || {};

  var PREF_KEY = 'ppdb.v2.pref';
  var largeQuery = window.matchMedia('(min-width: 1200px)');

  var app = document.querySelector('.app');
  if (!app) return;

  var drawer = document.getElementById('nav-drawer');
  var main = app.querySelector('.app__main');
  var toggles = document.querySelectorAll('[data-nav-toggle]');
  var scrim = null;
  var lastFocus = null;

  /* ---------- Preferensi (localStorage bisa diblokir → try/catch) ---------- */
  function readPref() {
    try {
      return JSON.parse(window.localStorage.getItem(PREF_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function writePref(changes) {
    try {
      var pref = readPref();
      Object.keys(changes).forEach(function (k) { pref[k] = changes[k]; });
      window.localStorage.setItem(PREF_KEY, JSON.stringify(pref));
    } catch (e) {
      /* Preferensi hanya kenyamanan; abaikan jika penyimpanan diblokir. */
    }
  }

  /* ---------- Status tombol menu ---------- */
  function isLarge() {
    return largeQuery.matches;
  }

  function isNavVisible() {
    return isLarge()
      ? !app.classList.contains('is-nav-collapsed')
      : app.classList.contains('is-nav-open');
  }

  function syncToggles() {
    var expanded = String(isNavVisible());
    toggles.forEach(function (btn) {
      btn.setAttribute('aria-expanded', expanded);
    });
  }

  /* ---------- Drawer modal / overlay (compact & medium) ---------- */
  function openNav() {
    if (isLarge() || app.classList.contains('is-nav-open')) return;
    lastFocus = document.activeElement;
    app.classList.add('is-nav-open');
    document.documentElement.classList.add('is-scroll-locked');

    scrim = document.createElement('div');
    scrim.className = 'scrim';
    scrim.setAttribute('aria-hidden', 'true');
    scrim.addEventListener('click', closeNav);
    app.appendChild(scrim);

    if (main) main.inert = true;   // konten di belakang tidak bisa difokus
    syncToggles();

    // Fokus ke item pertama drawer (visibility sudah "visible" begitu kelas ditambahkan)
    var first = drawer.querySelector('a, button');
    if (first) first.focus();
  }

  function closeNav() {
    if (!app.classList.contains('is-nav-open')) return;
    app.classList.remove('is-nav-open');
    document.documentElement.classList.remove('is-scroll-locked');
    if (scrim) {
      scrim.remove();
      scrim = null;
    }
    if (main) main.inert = false;
    syncToggles();

    // Kembalikan fokus; jika tidak ada asal yang jelas, fokus ke tombol menu
    var target = (lastFocus && lastFocus !== document.body && typeof lastFocus.focus === 'function')
      ? lastFocus
      : toggles[0];
    if (target) target.focus();
  }

  /* ---------- Drawer ↔ rail (large) ---------- */
  function setCollapsed(collapsed) {
    app.classList.toggle('is-nav-collapsed', collapsed);
    writePref({ navCollapsed: collapsed });
    syncToggles();
  }

  function onToggle() {
    if (isLarge()) {
      setCollapsed(!app.classList.contains('is-nav-collapsed'));
    } else if (app.classList.contains('is-nav-open')) {
      closeNav();
    } else {
      openNav();
    }
  }

  /* ---------- Menu akun (disclosure) ---------- */
  function initAccountMenu() {
    var button = document.querySelector('[data-account-toggle]');
    if (!button) return;
    var menu = document.getElementById(button.getAttribute('aria-controls'));
    if (!menu) return;

    function setOpen(open) {
      menu.hidden = !open;
      button.setAttribute('aria-expanded', String(open));
    }

    button.addEventListener('click', function () {
      setOpen(menu.hidden);
      if (!menu.hidden) {
        var first = menu.querySelector('a, button');
        if (first) first.focus();
      }
    });

    document.addEventListener('click', function (e) {
      if (!menu.hidden && !menu.contains(e.target) && !button.contains(e.target)) setOpen(false);
    });

    menu.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        setOpen(false);
        button.focus();
      }
    });
  }

  /* ---------- Menu aktif sesuai halaman ---------- */
  function markActivePage() {
    var page = document.body.getAttribute('data-page');
    if (!page) return;
    document.querySelectorAll('.nav-item[data-page]').forEach(function (item) {
      if (item.getAttribute('data-page') === page) {
        item.setAttribute('aria-current', 'page');
      } else {
        item.removeAttribute('aria-current');
      }
    });
  }

  /* ---------- Inisialisasi ---------- */
  if (readPref().navCollapsed) app.classList.add('is-nav-collapsed');

  toggles.forEach(function (btn) {
    btn.addEventListener('click', onToggle);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && app.classList.contains('is-nav-open')) closeNav();
  });

  // Saat lebar layar berubah melewati 1200px, tutup drawer modal agar status tidak nyangkut
  function onBreakpointChange() {
    closeNav();
    syncToggles();
  }
  if (typeof largeQuery.addEventListener === 'function') {
    largeQuery.addEventListener('change', onBreakpointChange);
  } else {
    largeQuery.addListener(onBreakpointChange);
  }

  // Menutup drawer modal setelah memilih menu
  drawer.addEventListener('click', function (e) {
    if (e.target.closest('a.nav-item') && !isLarge()) closeNav();
  });

  initAccountMenu();
  markActivePage();
  syncToggles();

  PPDB.shell = {
    openNav: openNav,
    closeNav: closeNav,
    setCollapsed: setCollapsed
  };
})(window, document);
