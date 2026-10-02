/* =====================================================================
   hasil-seleksi.js — Hasil & Peringkat (P-06, Tahap 9)
   FR-05 keterisian & keketatan · FR-13 peringkat + garis batas · FR-16 CSV
   Semua angka dihitung ulang dari PPDB.rules.peringkat (BR-09…BR-11).
   URL: ?jalur=zonasi&batas=1&q=nama
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

  var SEKITAR = 10;   // baris di atas & di bawah garis batas
  var st = { jalur: 'zonasi', batas: false, q: '', cocokKe: 0 };
  var hasil = null;   // hasil R.peringkat untuk jalur aktif

  var tabsHost = $('[data-tabs]');
  var tbody = $('[data-tbody]');
  var inputCari = $('#cari');
  var cekBatas = $('#sekitar-batas');
  var ringkasan = $('[data-ringkasan]');

  /* ---------- Format nilai sesuai dasar peringkat ---------- */
  function teksNilai(nilai) {
    return hasil.jalur.dasar === 'skor' ? U.desimal(nilai) : U.jarak(nilai);
  }

  function cocok(p, q) {
    if (/^\d+$/.test(q)) return p.nisn.indexOf(q) > -1 || p.noDaftar.indexOf(q) > -1;
    return p.nama.toLowerCase().indexOf(q) > -1 || p.noDaftar.toLowerCase().indexOf(q) > -1;
  }

  /* =================================================================
     1. Tab jalur & ringkasan (FR-05, BR-11)
     ================================================================= */
  function bangunTab() {
    R.JALUR.forEach(function (j) {
      tabsHost.appendChild(el('button', {
        className: 'tab',
        attrs: { type: 'button', role: 'tab', id: 'tab-' + j.kode, 'aria-controls': 'panel-jalur', 'data-jalur': j.kode }
      }, [j.singkat, el('span', { className: 'tab__count', text: 'kuota ' + j.kuota })]));
    });
    tabsHost.addEventListener('click', function (e) {
      var t = e.target.closest('[role="tab"]');
      if (t) pilihJalur(t.getAttribute('data-jalur'));
    });
    tabsHost.addEventListener('keydown', function (e) {
      var tab = Array.prototype.slice.call(tabsHost.querySelectorAll('[role="tab"]'));
      var i = tab.indexOf(document.activeElement);
      var ke = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tab.length - 1 }[e.key];
      if (i < 0 || ke === undefined) return;
      e.preventDefault();
      var t = tab[(ke + tab.length) % tab.length];
      pilihJalur(t.getAttribute('data-jalur'));
      t.focus();
    });
  }

  function pilihJalur(kode) {
    st.jalur = kode;
    st.cocokKe = 0;
    render(true);   // kata kunci yang aktif ikut disorot di jalur baru
  }

  function stat(label, nilai, ket) {
    return el('div', { className: 'rank-stats__item' }, [
      el('dt', { text: label }),
      el('dd', { className: 'rank-stats__value', text: nilai }),
      ket ? el('dd', { className: 'rank-stats__meta', text: ket }) : null
    ]);
  }

  function renderStatistik() {
    var host = U.kosongkan($('[data-statistik]'));
    var j = hasil.jalur;
    var sisa = Math.max(0, hasil.kuota - hasil.terverifikasi);
    host.appendChild(stat('Kuota', U.angka(hasil.kuota), j.nama));
    host.appendChild(stat('Terverifikasi', U.angka(hasil.terverifikasi), 'dari ' + U.angka(hasil.pendaftar) + ' pendaftar jalur ini'));
    host.appendChild(stat('Keketatan', U.desimal(hasil.keketatan) + '×', sisa ? 'kursi tersisa ' + U.angka(sisa) : 'terverifikasi ÷ kuota'));
    host.appendChild(stat('Batas sementara', hasil.batas === null ? 'Belum ada' : teksNilai(hasil.batas),
      hasil.batas === null ? 'kuota belum penuh' : (j.dasar === 'skor' ? 'skor terendah yang masuk' : 'jarak terjauh yang masuk')));
  }

  /* =================================================================
     2. Tabel + garis batas kuota (FR-13, BR-10)
     ================================================================= */
  function barisTampil() {
    if (!st.batas || hasil.batas === null) return hasil.daftar;
    var awal = Math.max(0, hasil.kuota - SEKITAR);
    return hasil.daftar.slice(awal, hasil.kuota + SEKITAR);
  }

  function barisGaris() {
    var label = 'Garis batas kuota (' + U.angka(hasil.kuota) + ') · ' +
      (hasil.jalur.dasar === 'skor' ? 'skor terendah ' : 'jarak terjauh ') + teksNilai(hasil.batas);
    return el('tr', { className: 'table__cutoff' }, [
      el('td', { className: 'table__cell--full', text: label, attrs: { colspan: '5' } })
    ]);
  }

  function renderTabel(q) {
    var frag = document.createDocumentFragment();
    var labelNilai = hasil.jalur.dasar === 'skor' ? 'Skor' : 'Jarak';
    barisTampil().forEach(function (b) {
      var p = b.data;
      var sekolah = R.sekolahAsal(p.sekolahAsal);
      var sorot = q && cocok(p, q);
      frag.appendChild(el('tr', { className: sorot ? 'is-highlighted' : '', attrs: { 'data-id': p.id } }, [
        el('td', { className: 'table__num rank-table__rank', text: U.angka(b.peringkat), attrs: { 'data-label': 'Peringkat' } }),
        el('td', { className: 'table__cell--full rank-table__nama' }, [
          el('a', { className: 'table__primary', text: p.nama, attrs: { href: 'bukti.html?id=' + encodeURIComponent(p.id), title: 'Buka bukti pendaftaran' } }),
          el('span', { className: 'table__secondary', text: p.noDaftar + ' · NISN ' + p.nisn })
        ]),
        el('td', { className: 'rank-table__sekolah', text: sekolah ? sekolah.nama : '–', attrs: { 'data-label': 'Asal sekolah' } }),
        el('td', { className: 'table__num', text: teksNilai(b.nilai), attrs: { 'data-label': labelNilai } }),
        el('td', { attrs: { 'data-label': 'Status seleksi' } }, [U.badgeSeleksi(b.status)])
      ]));
      if (b.peringkat === hasil.kuota && hasil.daftar.length > hasil.kuota) frag.appendChild(barisGaris());
    });
    U.kosongkan(tbody).appendChild(frag);
    $('[data-kolom-nilai]').textContent = labelNilai;
    $('[data-caption]').textContent = 'Peringkat sementara jalur ' + hasil.jalur.nama;
  }

  /* =================================================================
     3. Cari & sorot (TC-18)
     ================================================================= */
  // Pendaftar yang dicari tidak ada di peringkat jalur ini → jelaskan alasannya
  function jelaskanTidakAda(q) {
    var p = S.semua().filter(function (x) { return cocok(x, q); })[0];
    if (!p) return { teks: 'Tidak ada pendaftar yang cocok dengan "' + st.q.trim() + '".' };
    if (p.status !== 'terverifikasi') {
      return { teks: p.nama + ' berstatus ' + R.STATUS_VERIFIKASI[p.status].label + ', belum ikut peringkat.' };
    }
    var s = R.statusSeleksi(S.semua(), p.id);
    return {
      teks: p.nama + ' ada di jalur ' + R.jalur(p.jalur).nama + ' (peringkat ' + s.peringkat + ').',
      jalur: p.jalur
    };
  }

  function renderRingkasan(q) {
    U.kosongkan(ringkasan);
    if (!q) {
      var tampil = barisTampil().length;
      ringkasan.textContent = tampil === hasil.daftar.length
        ? U.angka(tampil) + ' pendaftar terverifikasi diperingkat.'
        : 'Menampilkan peringkat ' + U.angka(barisTampil()[0].peringkat) + '–' + U.angka(barisTampil()[tampil - 1].peringkat) + ' di sekitar garis batas.';
      return;
    }
    var cocokan = hasil.daftar.filter(function (b) { return cocok(b.data, q); });
    if (cocokan.length) {
      var b = cocokan[st.cocokKe % cocokan.length];
      ringkasan.textContent = (cocokan.length > 1 ? (st.cocokKe % cocokan.length + 1) + ' dari ' + cocokan.length + ' cocok (Enter untuk berikutnya). ' : '') +
        b.data.nama + ': peringkat ' + b.peringkat + ', ' + R.STATUS_SELEKSI[b.status].label.toLowerCase() + '.';
      return;
    }
    var info = jelaskanTidakAda(q);
    ringkasan.appendChild(document.createTextNode(info.jalur ? info.teks + ' ' : info.teks));
    if (info.jalur) {
      ringkasan.appendChild(el('button', {
        className: 'btn btn--text btn--sm',
        text: 'Buka jalur ' + R.jalur(info.jalur).singkat,
        attrs: { type: 'button' },
        on: { click: function () { pilihJalur(info.jalur); } }
      }));
    }
  }

  function gulirKeCocokan(q) {
    var cocokan = hasil.daftar.filter(function (b) { return cocok(b.data, q); });
    if (!cocokan.length) return;
    var id = cocokan[st.cocokKe % cocokan.length].data.id;
    // Baris di luar jendela "sekitar garis batas" → tampilkan semua dulu
    if (!tbody.querySelector('[data-id="' + id + '"]')) {
      st.batas = false;
      cekBatas.checked = false;
      renderTabel(q);
    }
    var tr = tbody.querySelector('[data-id="' + id + '"]');
    tbody.querySelectorAll('.is-current').forEach(function (x) { x.classList.remove('is-current'); });
    tr.classList.add('is-current');
    tr.scrollIntoView({ block: 'center' });
  }

  /* =================================================================
     4. Render & URL
     ================================================================= */
  function tulisUrl() {
    var p = new URLSearchParams();
    if (st.jalur !== 'zonasi') p.set('jalur', st.jalur);
    if (st.batas) p.set('batas', '1');
    if (st.q.trim()) p.set('q', st.q.trim());
    var qs = p.toString();
    window.history.replaceState(null, '', window.location.pathname + (qs ? '?' + qs : ''));
  }

  function render(gulir) {
    hasil = R.peringkat(S.semua(), st.jalur);
    var q = st.q.trim().toLowerCase();
    tabsHost.querySelectorAll('[role="tab"]').forEach(function (t) {
      var aktif = t.getAttribute('data-jalur') === st.jalur;
      t.setAttribute('aria-selected', String(aktif));
      t.tabIndex = aktif ? 0 : -1;
      if (aktif) $('[data-panel]').setAttribute('aria-labelledby', t.id);
    });
    cekBatas.disabled = hasil.batas === null;
    if (cekBatas.disabled) { cekBatas.checked = false; st.batas = false; }

    renderStatistik();
    var ada = hasil.daftar.length > 0;
    $('[data-tabel-wrap]').hidden = !ada;
    $('[data-kosong]').hidden = ada;
    if (ada) renderTabel(q);
    renderRingkasan(q);
    if (ada && q && gulir) gulirKeCocokan(q);
    $('[data-dasar]').textContent = 'Dasar peringkat (BR-10): ' + (hasil.jalur.dasar === 'skor'
      ? 'skor tertinggi (rata-rata rapor + bonus prestasi)'
      : 'jarak rumah ke sekolah terdekat') + ' → usia lebih tua → waktu daftar lebih awal.';
    tulisUrl();
  }

  /* =================================================================
     5. Ekspor CSV (FR-16)
     ================================================================= */
  function eksporCsv() {
    if (!hasil.daftar.length) { U.snackbar('Belum ada peringkat untuk diekspor.'); return; }
    var skor = hasil.jalur.dasar === 'skor';
    var baris = [['Peringkat', 'No. Pendaftaran', 'Nama', 'NISN', 'Asal Sekolah', skor ? 'Skor' : 'Jarak (m)', 'Status Seleksi']];
    hasil.daftar.forEach(function (b) {
      var sekolah = R.sekolahAsal(b.data.sekolahAsal);
      baris.push([b.peringkat, b.data.noDaftar, b.data.nama, b.data.nisn, sekolah ? sekolah.nama : '',
        skor ? U.desimal(b.nilai) : b.nilai, R.STATUS_SELEKSI[b.status].label]);
    });
    U.unduhCsv('peringkat-' + st.jalur + '-' + R.TANGGAL_SIMULASI + '.csv', baris);
    S.catatLog('ekspor', 'Ekspor CSV peringkat jalur ' + hasil.jalur.nama + ' (' + hasil.daftar.length + ' baris)');
    U.snackbar('Peringkat jalur ' + hasil.jalur.nama + ' diekspor (' + U.angka(hasil.daftar.length) + ' baris).');
  }

  /* ---------- Event ---------- */
  inputCari.addEventListener('input', U.debounce(function () {
    st.q = inputCari.value.slice(0, 60);
    st.cocokKe = 0;
    render(true);
  }, 250));
  inputCari.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    if (st.q === inputCari.value.slice(0, 60)) st.cocokKe += 1; else { st.q = inputCari.value.slice(0, 60); st.cocokKe = 0; }
    render(true);
  });
  cekBatas.addEventListener('change', function () { st.batas = cekBatas.checked; render(false); });
  $('[data-aksi="ekspor-csv"]').addEventListener('click', eksporCsv);
  window.addEventListener('ppdb:change', function () { render(false); });

  /* ---------- Mulai ---------- */
  var tutup = R.JADWAL.filter(function (j) { return j.kode === 'verifikasi'; })[0];
  $('[data-catatan-sementara]').textContent = 'Peringkat sementara, berubah sampai verifikasi ditutup ' + U.tanggalPanjang(tutup.selesai) +
    '. Hanya pendaftar terverifikasi yang ikut peringkat.';

  var p = new URLSearchParams(window.location.search);
  if (R.jalur(p.get('jalur'))) st.jalur = p.get('jalur');
  st.batas = p.get('batas') === '1';
  st.q = (p.get('q') || '').slice(0, 60);
  inputCari.value = st.q;
  cekBatas.checked = st.batas;
  bangunTab();
  render(true);
})(window, document);
