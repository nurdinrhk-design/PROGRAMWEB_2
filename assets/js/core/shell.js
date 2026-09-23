/* =====================================================================
   shell.js — Perilaku app shell (navigasi adaptif, menu akun, menu aktif)
   Namespace: PPDB.shell
   Bagian autentikasi & badge data ditambahkan di tahap T4.

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
