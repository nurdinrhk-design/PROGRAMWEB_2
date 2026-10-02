/* =====================================================================
   dashboard.js — Dashboard (P-02, Tahap 10)
   FR-03 KPI · FR-04 grafik pendaftar per hari · FR-05 keketatan jalur
   FR-06 antrean terlama & jadwal. Semua angka dari data (AS-02).
   Chart.js dimuat dari CDN dengan SRI; jika gagal, data tetap tersedia
   sebagai tabel (R-03).
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

  var grafik = null;

  function hari(iso) { return iso.slice(0, 10); }

  function menungguTerlama() {
    return S.semua().filter(function (p) { return p.status === 'menunggu'; })
      .sort(function (a, b) { return a.tglDaftar < b.tglDaftar ? -1 : a.tglDaftar > b.tglDaftar ? 1 : 0; });
  }

  /* =================================================================
     1. KPI (FR-03, TC-05: sama dengan jumlah tab di Data Pendaftar)
     ================================================================= */
  function kartu(o) {
    return el('article', { className: 'card kpi kpi--link' }, [
      el('h2', { className: 'kpi__label' }, [U.icon(o.ikon), o.label]),
      el('p', { className: 'kpi__value', text: U.angka(o.nilai) }),
      el('p', { className: 'kpi__meta', text: o.meta }),
      el('a', { className: 'kpi__link', attrs: { href: o.href }, text: o.tautan })
    ]);
  }

  function renderKpi() {
    var h = S.hitungStatus();
    var hariIni = R.TANGGAL_SIMULASI;
    var baru = S.semua().filter(function (p) { return hari(p.tglDaftar) === hariIni; }).length;
    var antre = menungguTerlama();
    var masuk = R.JALUR.reduce(function (n, j) {
      return n + R.peringkat(S.semua(), j.kode).daftar.filter(function (b) { return b.status === 'masuk'; }).length;
    }, 0);
    var persen = h.total ? Math.round(h.terverifikasi / h.total * 100) : 0;

    var host = U.kosongkan($('[data-kpi]'));
    [
      { ikon: 'groups', label: 'Total pendaftar', nilai: h.total, meta: '+' + U.angka(baru) + ' hari ini', href: 'data-master.html', tautan: 'Lihat semua pendaftar' },
      { ikon: 'hourglass_top', label: 'Menunggu verifikasi', nilai: h.menunggu,
        meta: antre.length ? 'Terlama menunggu ' + U.lamaMenunggu(antre[0].tglDaftar) : 'Antrean kosong', href: 'data-master.html?status=menunggu', tautan: 'Lihat pendaftar menunggu' },
      { ikon: 'edit_note', label: 'Perlu perbaikan', nilai: h.perbaikan, meta: 'Menunggu unggah ulang dari pendaftar', href: 'data-master.html?status=perbaikan', tautan: 'Lihat pendaftar perlu perbaikan' },
      { ikon: 'verified', label: 'Terverifikasi', nilai: h.terverifikasi,
        meta: persen + '% dari total · ' + U.angka(masuk) + ' masuk kuota', href: 'data-master.html?status=terverifikasi', tautan: 'Lihat pendaftar terverifikasi' }
    ].forEach(function (o) { host.appendChild(kartu(o)); });

    var tombol = $('[data-mulai-verifikasi]');
    tombol.lastChild.nodeValue = 'Mulai verifikasi (' + U.angka(h.menunggu) + ')';
  }

  /* =================================================================
     2. Grafik pendaftar per hari (FR-04)
     ================================================================= */
  function dataHarian() {
    var mulai = R.parseTanggal(R.JADWAL[0].mulai);
    var akhir = R.today();
    var tanggal = [];
    for (var d = new Date(mulai); d <= akhir; d.setDate(d.getDate() + 1)) tanggal.push(R.isoTanggal(d));
    var indeks = {};
    tanggal.forEach(function (t, i) { indeks[t] = i; });
    var seri = {};
    R.JALUR.forEach(function (j) { seri[j.kode] = tanggal.map(function () { return 0; }); });
    S.semua().forEach(function (p) {
      var i = indeks[hari(p.tglDaftar)];
      if (i !== undefined) seri[p.jalur][i] += 1;
    });
    return { tanggal: tanggal, seri: seri };
  }

  function labelTanggal(iso) {
    var d = R.parseTanggal(iso);
    return d.getDate() + ' ' + U.tanggal(iso).split(' ')[1];
  }

  function renderTabelGrafik(data) {
    var thead = U.kosongkan($('[data-thead-grafik]'));
    thead.appendChild(el('tr', null, [el('th', { text: 'Tanggal', attrs: { scope: 'col' } })]
      .concat(R.JALUR.map(function (j) { return el('th', { className: 'table__num', text: j.singkat, attrs: { scope: 'col' } }); }))
      .concat([el('th', { className: 'table__num', text: 'Total', attrs: { scope: 'col' } })])));
    var tbody = U.kosongkan($('[data-tbody-grafik]'));
    data.tanggal.forEach(function (t, i) {
      var total = 0;
      tbody.appendChild(el('tr', null, [el('th', { text: U.tanggal(t), attrs: { scope: 'row' } })]
        .concat(R.JALUR.map(function (j) { total += data.seri[j.kode][i]; return el('td', { className: 'table__num', text: U.angka(data.seri[j.kode][i]) }); }))
        .concat([el('td', { className: 'table__num', text: U.angka(total) })])));
    });
  }

  function warnaToken(nama) {
    return window.getComputedStyle(document.documentElement).getPropertyValue(nama).trim();
  }

  function renderGrafik() {
    var data = dataHarian();
    var total = data.tanggal.length;
    $('[data-subjudul-grafik]').textContent = U.tanggal(data.tanggal[0]) + ' – ' + U.tanggal(data.tanggal[total - 1]) +
      ' · hari ke-' + total + ' pendaftaran, menurut jalur';
    renderTabelGrafik(data);

    if (typeof window.Chart !== 'function') {
      // CDN gagal / diblokir: tampilkan tabel sebagai pengganti grafik
      $('[data-wadah-grafik]').hidden = true;
      $('[data-grafik-gagal]').hidden = false;
      $('[data-detail-tabel]').open = true;
      return;
    }

    var datasets = R.JALUR.map(function (j) {
      return { label: j.singkat, data: data.seri[j.kode], backgroundColor: warnaToken('--chart-' + j.kode), borderRadius: 2, maxBarThickness: 36 };
    });
    if (grafik) {
      grafik.data.labels = data.tanggal.map(labelTanggal);
      grafik.data.datasets.forEach(function (ds, i) { ds.data = datasets[i].data; });
      grafik.update();
      return;
    }
    var Chart = window.Chart;
    Chart.defaults.font.family = warnaToken('--font-sans') || 'sans-serif';
    Chart.defaults.color = warnaToken('--md-on-surface-variant');
    var kurangiGerak = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    grafik = new Chart(document.getElementById('grafik-harian'), {
      type: 'bar',
      data: { labels: data.tanggal.map(labelTanggal), datasets: datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: kurangiGerak ? false : { duration: 400 },
        interaction: { mode: 'index', intersect: false },
        scales: {
          x: { stacked: true, grid: { display: false } },
          y: { stacked: true, beginAtZero: true, grid: { color: warnaToken('--chart-grid') }, ticks: { precision: 0 } }
        },
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 12, boxHeight: 12 } },
          tooltip: {
            callbacks: {
              footer: function (items) {
                var n = items.reduce(function (a, it) { return a + it.parsed.y; }, 0);
                return 'Total ' + U.angka(n) + ' pendaftar';
              }
            }
          }
        }
      }
    });
  }

  /* =================================================================
     3. Antrean terlama, keketatan jalur, jadwal (FR-05, FR-06)
     ================================================================= */
  function renderAntrean() {
    var antre = menungguTerlama();
    var host = U.kosongkan($('[data-antrean]'));
    antre.slice(0, 5).forEach(function (p) {
      host.appendChild(el('li', null, [
        el('a', { className: 'mini-queue__item', attrs: { href: 'verifikasi.html?id=' + encodeURIComponent(p.id) } }, [
          el('span', { className: 'mini-queue__name', text: p.nama }),
          el('span', { className: 'mini-queue__meta' }, [U.chipJalur(p.jalur), el('span', { className: 'num', text: p.noDaftar })]),
          el('span', { className: 'mini-queue__age', text: U.lamaMenunggu(p.tglDaftar) })
        ])
      ]));
    });
    if (!antre.length) host.appendChild(el('li', { className: 'text-variant', text: 'Antrean kosong. Semua berkas sudah diperiksa.' }));
    $('[data-lihat-antrean]').textContent = 'Lihat semua antrean (' + U.angka(antre.length) + ')';
  }

  function renderJalur() {
    var host = U.kosongkan($('[data-jalur]'));
    R.JALUR.forEach(function (j) {
      var h = R.peringkat(S.semua(), j.kode);
      var isi = Math.min(h.terverifikasi, h.kuota);
      var persen = Math.round(isi / h.kuota * 100);
      host.appendChild(el('tr', null, [
        el('td', { className: 'table__cell--full' }, [el('a', { className: 'table__primary', text: j.nama, attrs: { href: 'hasil-seleksi.html?jalur=' + j.kode } })]),
        el('td', { className: 'table__num', text: U.angka(h.kuota), attrs: { 'data-label': 'Kuota' } }),
        el('td', { className: 'table__num', text: U.angka(h.terverifikasi), attrs: { 'data-label': 'Terverifikasi' } }),
        el('td', { className: 'table__num', text: U.desimal(h.keketatan) + '×', attrs: { 'data-label': 'Keketatan' } }),
        el('td', { className: 'table__num', text: h.batas === null ? 'Belum ada' : (j.dasar === 'skor' ? U.desimal(h.batas) : U.jarak(h.batas)), attrs: { 'data-label': 'Batas sementara' } }),
        el('td', { attrs: { 'data-label': 'Keterisian' } }, [
          el('div', { className: 'lane-table__fill' }, [
            el('progress', { className: 'progress', attrs: { max: String(h.kuota), value: String(isi), 'aria-label': 'Keterisian ' + j.nama + ' ' + persen + ' persen' } }),
            el('span', { className: 'num', text: persen + '%' })
          ])
        ])
      ]));
    });
  }

  function rentang(j) {
    if (j.mulai === j.selesai) return U.tanggal(j.mulai);
    var a = U.tanggal(j.mulai).split(' ');
    var b = U.tanggal(j.selesai).split(' ');
    return a[1] === b[1] ? a[0] + '–' + U.tanggal(j.selesai) : U.tanggal(j.mulai).replace(' ' + a[2], '') + ' – ' + U.tanggal(j.selesai);
  }

  function renderJadwal() {
    var hariIni = R.today();
    var host = U.kosongkan($('[data-jadwal]'));
    R.JADWAL.forEach(function (j) {
      var mulai = R.parseTanggal(j.mulai);
      var selesai = R.parseTanggal(j.selesai);
      var keadaan = hariIni > selesai ? 'selesai' : hariIni < mulai ? 'nanti' : 'aktif';
      var ket = keadaan === 'aktif'
        ? 'Berlangsung · hari ke-' + (R.selisihHari(mulai, hariIni) + 1) + ' dari ' + (R.selisihHari(mulai, selesai) + 1)
        : keadaan === 'nanti' ? R.selisihHari(hariIni, mulai) + ' hari lagi' : 'Selesai';
      host.appendChild(el('li', { className: 'agenda__item agenda__item--' + keadaan }, [
        el('span', { className: 'agenda__name', text: j.nama }),
        el('span', { className: 'agenda__date num', text: rentang(j) }),
        el('span', { className: 'agenda__state', text: ket })
      ]));
    });
  }

  function render() {
    renderKpi();
    renderGrafik();
    renderAntrean();
    renderJalur();
    renderJadwal();
  }

  $('[data-hari-ini]').textContent = U.tanggalPanjang(R.TANGGAL_SIMULASI);
  window.addEventListener('ppdb:change', render);
  render();
})(window, document);
