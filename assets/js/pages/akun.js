/* =====================================================================
   akun.js — Akun Orang Tua untuk panitia (Tahap 15, v1.2)
   Daftar akun, anak yang didaftarkan beserta statusnya, cari & filter.
   Hanya baca: data sandi (salt & hash) tidak pernah ditampilkan.
   URL: ?q=&anak=ada|belum|perbaikan&hal=
   ===================================================================== */
(function (window, document) {
  'use strict';

  var PPDB = window.PPDB;
  if (!PPDB || !document.body.classList.contains('is-authed')) return; // dialihkan oleh shell.js

  var R = PPDB.rules;
  var S = PPDB.store;
  var U = PPDB.ui;
  var el = U.el;
  var $ = function (sel) { return document.querySelector(sel); };
  var PER_HALAMAN = 20;
  var FILTER = ['ada', 'belum', 'perbaikan'];

  var st = { q: '', anak: '', hal: 1 };
  var inputCari = $('#cari');
  var selAnak = $('#filter-anak');

  // Kelompokkan pendaftar per akun sekali saja per render
  function anakPerAkun() {
    var peta = {};
    S.semua().forEach(function (p) {
      if (p.akunId) (peta[p.akunId] = peta[p.akunId] || []).push(p);
    });
    return peta;
  }

  function cocok(a, q) {
    if (!q) return true;
    return a.nama.toLowerCase().indexOf(q) > -1 || a.email.indexOf(q) > -1 || a.noHp.indexOf(q.replace(/\D/g, '') || '§') > -1;
  }

  function renderRingkasan(akun, peta) {
    var punya = akun.filter(function (a) { return (peta[a.id] || []).length; }).length;
    var anakOnline = Object.keys(peta).reduce(function (n, k) { return n + peta[k].length; }, 0);
    var perbaikan = akun.filter(function (a) { return (peta[a.id] || []).some(function (p) { return p.status === 'perbaikan'; }); }).length;
    var host = U.kosongkan($('[data-ringkasan-akun]'));
    [
      ['supervisor_account', 'Akun orang tua', akun.length, 'terdaftar di portal'],
      ['family_restroom', 'Sudah mendaftarkan anak', punya, U.angka(akun.length - punya) + ' akun belum mendaftarkan'],
      ['school', 'Anak didaftarkan online', anakOnline, 'rata-rata ' + U.desimal(punya ? anakOnline / punya : 0) + ' anak per akun'],
      ['edit_note', 'Perlu tindakan orang tua', perbaikan, 'akun dengan anak berstatus perlu perbaikan']
    ].forEach(function (k) {
      host.appendChild(el('article', { className: 'card kpi' }, [
        el('h2', { className: 'kpi__label' }, [U.icon(k[0]), k[1]]),
        el('p', { className: 'kpi__value', text: U.angka(k[2]) }),
        el('p', { className: 'kpi__meta', text: k[3] })
      ]));
    });
  }

  function selAnakAkun(daftar) {
    if (!daftar.length) return el('span', { className: 'text-variant', text: 'Belum ada' });
    return el('ul', { className: 'account-children' }, daftar.map(function (p) {
      return el('li', null, [
        el('a', { text: p.nama, attrs: { href: 'data-master.html?q=' + encodeURIComponent(p.noDaftar) } }),
        el('span', { className: 'cluster' }, [U.badgeStatus(p.status), U.chipJalur(p.jalur)])
      ]);
    }));
  }

  function render() {
    var peta = anakPerAkun();
    var semua = S.akunSemua();
    renderRingkasan(semua, peta);

    var q = st.q.trim().toLowerCase();
    var list = semua.filter(function (a) {
      var anak = peta[a.id] || [];
      return cocok(a, q) &&
        (!st.anak || (st.anak === 'ada' && anak.length) || (st.anak === 'belum' && !anak.length) ||
          (st.anak === 'perbaikan' && anak.some(function (p) { return p.status === 'perbaikan'; })));
    }).sort(function (a, b) { return a.dibuat < b.dibuat ? 1 : a.dibuat > b.dibuat ? -1 : 0; }); // terbaru dulu

    var jumlahHal = Math.max(1, Math.ceil(list.length / PER_HALAMAN));
    st.hal = Math.min(Math.max(1, st.hal), jumlahHal);
    var awal = (st.hal - 1) * PER_HALAMAN;
    var halaman = list.slice(awal, awal + PER_HALAMAN);

    var frag = document.createDocumentFragment();
    halaman.forEach(function (a) {
      frag.appendChild(el('tr', null, [
        el('td', { className: 'table__cell--full' }, [
          el('span', { className: 'table__primary', text: a.nama }),
          el('span', { className: 'table__secondary', text: a.email + (a.sandiHash ? '' : ' · akun simulasi') })
        ]),
        el('td', { className: 'num', text: a.noHp, attrs: { 'data-label': 'No. HP' } }),
        el('td', { attrs: { 'data-label': 'Anak' } }, [selAnakAkun(peta[a.id] || [])]),
        el('td', { text: U.tanggal(a.dibuat), attrs: { 'data-label': 'Akun dibuat' } })
      ]));
    });
    U.kosongkan($('[data-tbody]')).appendChild(frag);

    $('[data-ringkasan]').textContent = list.length
      ? 'Menampilkan ' + U.angka(awal + 1) + '–' + U.angka(awal + halaman.length) + ' dari ' + U.angka(list.length) + ' akun, terbaru di atas'
      : 'Tidak ada akun yang cocok.';
    $('[data-tabel-wrap]').hidden = !list.length;
    $('[data-paginasi]').hidden = !list.length;
    $('[data-kosong]').hidden = list.length > 0;
    $('[data-posisi-hal]').textContent = 'Halaman ' + st.hal + ' dari ' + jumlahHal;
    $('[data-hal="-1"]').disabled = st.hal <= 1;
    $('[data-hal="1"]').disabled = st.hal >= jumlahHal;

    var p = new URLSearchParams();
    if (st.q.trim()) p.set('q', st.q.trim());
    if (st.anak) p.set('anak', st.anak);
    if (st.hal > 1) p.set('hal', String(st.hal));
    var qs = p.toString();
    window.history.replaceState(null, '', window.location.pathname + (qs ? '?' + qs : ''));
  }

  inputCari.addEventListener('input', U.debounce(function () { st.q = inputCari.value.slice(0, 60); st.hal = 1; render(); }, 250));
  selAnak.addEventListener('change', function () { st.anak = selAnak.value; st.hal = 1; render(); });
  $('[data-paginasi]').addEventListener('click', function (e) {
    var b = e.target.closest('[data-hal]');
    if (!b || b.disabled) return;
    st.hal += Number(b.getAttribute('data-hal'));
    render();
    $('[data-ringkasan]').focus({ preventScroll: true });
  });
  window.addEventListener('ppdb:change', render);

  var q = new URLSearchParams(window.location.search);
  st.q = (q.get('q') || '').slice(0, 60);
  st.anak = FILTER.indexOf(q.get('anak')) > -1 ? q.get('anak') : '';
  st.hal = Math.max(1, Math.floor(Number(q.get('hal'))) || 1);
  inputCari.value = st.q;
  selAnak.value = st.anak;
  render();
})(window, document);
