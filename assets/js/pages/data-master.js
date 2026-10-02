/* =====================================================================
   data-master.js — Halaman Data Pendaftar (P-03, Tahap 6)
   FR-07 cari/filter/urut/paginasi · FR-08 detail · FR-09 hapus + urungkan
   FR-16 ekspor CSV · FR-17 reset · cadangan JSON
   Status tampilan disimpan di URL (?status=&q=&jalur=&sekolah=&urut=&arah=&hal=&per=)
   agar halaman bisa dibuka langsung dari dashboard dengan filter tertentu.
   ===================================================================== */
(function (window, document) {
  'use strict';

  var PPDB = window.PPDB;
  if (!PPDB || !document.body.classList.contains('is-authed')) return; // dialihkan ke login oleh shell.js

  var R = PPDB.rules;
  var S = PPDB.store;
  var U = PPDB.ui;
  var el = U.el;

  var TAB = [
    { kode: '', label: 'Semua' },
    { kode: 'menunggu', label: 'Menunggu' },
    { kode: 'perbaikan', label: 'Perlu perbaikan' },
    { kode: 'terverifikasi', label: 'Terverifikasi' },
    { kode: 'ditolak', label: 'Ditolak' }
  ];
  var PER_HALAMAN = [10, 20, 50];
  var ARAH_AWAL = { daftar: 'desc', nama: 'asc' };
  var urutNama = new Intl.Collator('id', { sensitivity: 'base' });

  var st = {
    status: '', q: '', jalur: '', sekolah: '',
    urut: 'daftar', arah: 'desc', hal: 1, per: 20
  };

  /* ---------- Elemen ---------- */
  var $ = function (sel) { return document.querySelector(sel); };
  var tabsHost = $('[data-tabs]');
  var panel = $('[data-panel]');
  var inputCari = $('#cari');
  var selJalur = $('#filter-jalur');
  var selSekolah = $('#filter-sekolah');
  var selPer = $('#per-halaman');
  var chipsHost = $('[data-chips]');
  var ringkasan = $('[data-ringkasan]');
  var tabelWrap = $('[data-tabel-wrap]');
  var tbody = $('[data-tbody]');
  var kosong = $('[data-kosong]');
  var paginasi = $('[data-paginasi]');
  var halamanHost = $('[data-halaman]');
  var thNilai = $('th[data-kolom="nilai"]');
  var inputCadangan = $('#berkas-cadangan');

  /* =================================================================
     1. Status ↔ URL (nilai dari URL selalu divalidasi)
     ================================================================= */
  function bacaUrl() {
    var p = new URLSearchParams(window.location.search);
    var status = p.get('status');
    st.status = R.STATUS_VERIFIKASI.hasOwnProperty(status) ? status : '';
    st.q = (p.get('q') || '').slice(0, 60);
    st.jalur = R.jalur(p.get('jalur')) ? p.get('jalur') : '';
    st.sekolah = R.sekolahAsal(p.get('sekolah')) ? p.get('sekolah') : '';
    var urut = p.get('urut');
    st.urut = urut === 'nama' || (urut === 'nilai' && st.jalur) ? urut : 'daftar';
    var arah = p.get('arah');
    st.arah = arah === 'asc' || arah === 'desc' ? arah : arahAwal(st.urut);
    var per = Number(p.get('per'));
    st.per = PER_HALAMAN.indexOf(per) > -1 ? per : 20;
    st.hal = Math.max(1, Math.floor(Number(p.get('hal'))) || 1);
  }

  function tulisUrl() {
    var p = new URLSearchParams();
    if (st.status) p.set('status', st.status);
    if (st.q) p.set('q', st.q);
    if (st.jalur) p.set('jalur', st.jalur);
    if (st.sekolah) p.set('sekolah', st.sekolah);
    if (st.urut !== 'daftar' || st.arah !== 'desc') { p.set('urut', st.urut); p.set('arah', st.arah); }
    if (st.per !== 20) p.set('per', String(st.per));
    if (st.hal > 1) p.set('hal', String(st.hal));
    var qs = p.toString();
    window.history.replaceState(null, '', window.location.pathname + (qs ? '?' + qs : ''));
  }

  function arahAwal(kolom) {
    if (kolom === 'nilai') return dasarJalur() === 'skor' ? 'desc' : 'asc'; // terbaik lebih dulu (BR-10)
    return ARAH_AWAL[kolom] || 'asc';
  }

  function dasarJalur() {
    var j = R.jalur(st.jalur);
    return j ? j.dasar : '';
  }

  /* =================================================================
     2. Saring & urutkan
     ================================================================= */
  function cocokKataKunci(p, q) {
    if (!q) return true;
    if (/^\d+$/.test(q)) return p.nisn.indexOf(q) > -1 || p.noDaftar.indexOf(q) > -1;
    return p.nama.toLowerCase().indexOf(q) > -1 || p.noDaftar.toLowerCase().indexOf(q) > -1;
  }

  // Semua filter kecuali status → dipakai juga untuk jumlah di tab
  function saringDasar() {
    var q = st.q.trim().toLowerCase();
    return S.semua().filter(function (p) {
      return (!st.jalur || p.jalur === st.jalur) &&
        (!st.sekolah || p.sekolahAsal === st.sekolah) &&
        cocokKataKunci(p, q);
    });
  }

  function nilaiUrut(p) {
    return R.jalur(p.jalur).dasar === 'skor' ? R.skorPrestasi(p) : p.jarakMeter;
  }

  function urutkan(list) {
    var faktor = st.arah === 'asc' ? 1 : -1;
    var banding;
    if (st.urut === 'nama') {
      banding = function (a, b) { return urutNama.compare(a.nama, b.nama) || (a.noDaftar < b.noDaftar ? -1 : 1); };
    } else if (st.urut === 'nilai') {
      banding = function (a, b) { return (nilaiUrut(a) - nilaiUrut(b)) || (a.noDaftar < b.noDaftar ? -1 : 1); };
    } else {
      banding = function (a, b) {
        if (a.tglDaftar !== b.tglDaftar) return a.tglDaftar < b.tglDaftar ? -1 : 1;
        return a.noDaftar < b.noDaftar ? -1 : 1;
      };
    }
    return list.slice().sort(function (a, b) { return faktor * banding(a, b); });
  }

  function hasilSaring() {
    var dasar = saringDasar();
    var jumlah = { '': dasar.length, menunggu: 0, perbaikan: 0, terverifikasi: 0, ditolak: 0 };
    dasar.forEach(function (p) { jumlah[p.status] += 1; });
    var list = st.status ? dasar.filter(function (p) { return p.status === st.status; }) : dasar;
    return { list: urutkan(list), jumlah: jumlah };
  }

  /* =================================================================
     3. Render
     ================================================================= */
  function render() {
    var h = hasilSaring();
    var total = h.list.length;
    var jumlahHal = Math.max(1, Math.ceil(total / st.per));
    st.hal = Math.min(st.hal, jumlahHal);
    var awal = (st.hal - 1) * st.per;
    var halaman = h.list.slice(awal, awal + st.per);

    renderTab(h.jumlah);
    renderChips();
    renderHeader();
    renderBaris(halaman);
    renderPaginasi(jumlahHal);

    ringkasan.textContent = total === 0
      ? 'Tidak ada pendaftar yang cocok.'
      : 'Menampilkan ' + U.angka(awal + 1) + '–' + U.angka(awal + halaman.length) + ' dari ' + U.angka(total) + ' pendaftar';
    tabelWrap.hidden = total === 0;
    paginasi.hidden = total === 0;
    kosong.hidden = total !== 0;
    tulisUrl();
  }

  /* ---------- Tab status ---------- */
  function bangunTab() {
    TAB.forEach(function (t) {
      tabsHost.appendChild(el('button', {
        className: 'tab',
        attrs: { type: 'button', role: 'tab', id: 'tab-' + (t.kode || 'semua'), 'aria-controls': 'panel-data', 'data-status': t.kode },
        on: { click: function () { pilihTab(t.kode); } }
      }, [t.label, el('span', { className: 'tab__count' })]));
    });

    // Panah kiri/kanan, Home, End (pola tab ARIA, aktivasi otomatis)
    tabsHost.addEventListener('keydown', function (e) {
      var tombol = Array.prototype.slice.call(tabsHost.querySelectorAll('[role="tab"]'));
      var i = tombol.indexOf(document.activeElement);
      if (i < 0) return;
      var ke = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tombol.length - 1 }[e.key];
      if (ke === undefined) return;
      e.preventDefault();
      var target = tombol[(ke + tombol.length) % tombol.length];
      pilihTab(target.getAttribute('data-status'));
      target.focus();
    });
  }

  function pilihTab(kode) {
    st.status = kode;
    st.hal = 1;
    render();
  }

  function renderTab(jumlah) {
    tabsHost.querySelectorAll('[role="tab"]').forEach(function (tab) {
      var kode = tab.getAttribute('data-status');
      var aktif = kode === st.status;
      tab.setAttribute('aria-selected', String(aktif));
      tab.tabIndex = aktif ? 0 : -1;
      tab.querySelector('.tab__count').textContent = U.angka(jumlah[kode]);
      if (aktif) panel.setAttribute('aria-labelledby', tab.id);
    });
  }

  /* ---------- Chip filter aktif ---------- */
  function renderChips() {
    U.kosongkan(chipsHost);
    var chip = [];
    if (st.q.trim()) chip.push({ label: 'Kata kunci: “' + st.q.trim() + '”', hapus: function () { st.q = ''; inputCari.value = ''; } });
    if (st.jalur) chip.push({ label: 'Jalur: ' + R.jalur(st.jalur).singkat, hapus: function () { st.jalur = ''; selJalur.value = ''; } });
    if (st.sekolah) chip.push({ label: 'Sekolah: ' + R.sekolahAsal(st.sekolah).nama, hapus: function () { st.sekolah = ''; selSekolah.value = ''; } });

    chip.forEach(function (c) {
      chipsHost.appendChild(el('span', { className: 'chip chip--input' }, [
        el('span', { className: 'chip__text', text: c.label }),
        el('button', {
          className: 'chip__remove',
          attrs: { type: 'button', 'aria-label': 'Hapus filter ' + c.label },
          on: { click: function () { c.hapus(); st.hal = 1; render(); inputCari.focus(); } }
        }, [U.icon('close', 'icon--sm')])
      ]));
    });
    if (chip.length > 1) {
      chipsHost.appendChild(el('button', {
        className: 'btn btn--text btn--sm',
        text: 'Hapus semua filter',
        attrs: { type: 'button', 'data-aksi': 'hapus-filter' }
      }));
    }
    chipsHost.hidden = chip.length === 0;
  }

  function hapusSemuaFilter() {
    st.q = ''; st.jalur = ''; st.sekolah = ''; st.hal = 1;
    inputCari.value = ''; selJalur.value = ''; selSekolah.value = '';
    if (st.urut === 'nilai') { st.urut = 'daftar'; st.arah = 'desc'; }
    render();
    inputCari.focus();
  }

  /* ---------- Kepala tabel (aria-sort) ---------- */
  function renderHeader() {
    var dasar = dasarJalur();
    var tombolNilai = thNilai.querySelector('.table__sort');
    tombolNilai.firstChild.nodeValue = dasar === 'skor' ? 'Skor' : (dasar === 'jarak' ? 'Jarak' : 'Jarak / Skor');
    tombolNilai.disabled = !dasar;
    tombolNilai.title = dasar ? '' : 'Pilih satu jalur untuk mengurutkan jarak atau skor';

    document.querySelectorAll('th[data-kolom]').forEach(function (th) {
      if (th.getAttribute('data-kolom') === st.urut) {
        th.setAttribute('aria-sort', st.arah === 'asc' ? 'ascending' : 'descending');
        th.querySelector('.table__sort .icon').textContent = st.arah === 'asc' ? 'arrow_upward' : 'arrow_downward';
      } else {
        th.removeAttribute('aria-sort');
        th.querySelector('.table__sort .icon').textContent = 'swap_vert';
      }
    });
  }

  function ubahUrut(kolom) {
    if (kolom === 'nilai' && !dasarJalur()) return;
    if (st.urut === kolom) {
      st.arah = st.arah === 'asc' ? 'desc' : 'asc';
    } else {
      st.urut = kolom;
      st.arah = arahAwal(kolom);
    }
    st.hal = 1;
    render();
  }

  /* ---------- Baris tabel / kartu ---------- */
  // Sel berisi dua baris dibungkus satu <div> agar di mode kartu tetap
  // menjadi satu nilai di sisi kanan label
  function selNilai(p) {
    var j = R.jalur(p.jalur);
    if (j.dasar === 'skor') {
      var bonus = R.PRESTASI_BONUS[p.prestasiTingkat] || 0;
      return [
        el('span', { className: 'table__primary', text: U.desimal(R.skorPrestasi(p)) }),
        el('span', { className: 'table__secondary', text: bonus ? 'rapor ' + U.desimal(p.nilaiRapor) + ' + ' + bonus : 'skor' })
      ];
    }
    return [el('span', { className: 'table__primary', text: U.jarak(p.jarakMeter) })];
  }

  function renderBaris(halaman) {
    var frag = document.createDocumentFragment();
    var labelNilai = thNilai.querySelector('.table__sort').firstChild.nodeValue;
    halaman.forEach(function (p) {
      var sekolah = R.sekolahAsal(p.sekolahAsal);
      frag.appendChild(el('tr', { attrs: { 'data-id': p.id } }, [
        el('td', { className: 'data-table__nomor', attrs: { 'data-label': 'No. daftar' } }, [
          el('div', null, [
            el('span', { className: 'table__primary num', text: p.noDaftar }),
            el('span', { className: 'table__secondary', text: U.tanggalWaktu(p.tglDaftar) })
          ])
        ]),
        el('td', { className: 'table__cell--full data-table__nama' }, [
          el('button', {
            className: 'link-btn table__primary',
            text: p.nama,
            attrs: { type: 'button', 'data-detail': p.id, 'aria-haspopup': 'dialog' }
          }),
          el('span', { className: 'table__secondary', text: 'NISN ' + p.nisn })
        ]),
        el('td', { className: 'data-table__sekolah', text: sekolah ? sekolah.nama : '–', attrs: { 'data-label': 'Asal sekolah' } }),
        el('td', { attrs: { 'data-label': 'Jalur' } }, [U.chipJalur(p.jalur)]),
        el('td', { className: 'table__num', attrs: { 'data-label': labelNilai } }, [el('div', null, selNilai(p))]),
        el('td', { attrs: { 'data-label': 'Status' } }, [U.badgeStatus(p.status)]),
        el('td', { attrs: { 'data-label': 'Aksi' } }, [
          el('div', { className: 'table__actions' }, [
            el('a', {
              className: 'icon-btn icon-btn--sm',
              attrs: { href: 'form.html?id=' + encodeURIComponent(p.id), 'aria-label': 'Ubah data ' + p.nama, title: 'Ubah data' }
            }, [U.icon('edit')]),
            el('button', {
              className: 'icon-btn icon-btn--sm icon-btn--danger',
              attrs: { type: 'button', 'data-hapus': p.id, 'aria-label': 'Hapus data ' + p.nama, title: 'Hapus' }
            }, [U.icon('delete')])
          ])
        ])
      ]));
    });
    U.kosongkan(tbody).appendChild(frag);
  }

  /* ---------- Paginasi ---------- */
  // Nomor halaman yang ditampilkan: 1 … (hal-1) hal (hal+1) … akhir
  function daftarNomor(jumlahHal) {
    var nomor = [];
    for (var n = 1; n <= jumlahHal; n++) {
      if (n === 1 || n === jumlahHal || Math.abs(n - st.hal) <= 1) {
        nomor.push(n);
      } else if (nomor[nomor.length - 1] !== '…') {
        nomor.push('…');
      }
    }
    return nomor;
  }

  function tombolHalaman(hal, isi, label, nonaktif) {
    return el('button', {
      className: 'pagination__page',
      attrs: {
        type: 'button',
        'data-hal': hal,
        'aria-label': label,
        'aria-current': hal === st.hal && typeof isi === 'number' ? 'page' : false,
        disabled: nonaktif
      }
    }, [typeof isi === 'number' ? String(isi) : U.icon(isi, 'icon--sm')]);
  }

  function renderPaginasi(jumlahHal) {
    U.kosongkan(halamanHost);
    halamanHost.appendChild(tombolHalaman(st.hal - 1, 'chevron_left', 'Halaman sebelumnya', st.hal <= 1));
    daftarNomor(jumlahHal).forEach(function (n) {
      halamanHost.appendChild(n === '…'
        ? el('span', { className: 'pagination__gap', text: '…', attrs: { 'aria-hidden': 'true' } })
        : tombolHalaman(n, n, 'Halaman ' + n, false));
    });
    halamanHost.appendChild(tombolHalaman(st.hal + 1, 'chevron_right', 'Halaman berikutnya', st.hal >= jumlahHal));
  }

  function keHalaman(hal) {
    st.hal = hal;
    render();
    ringkasan.focus({ preventScroll: true });
    var kartu = $('.data-list');
    if (kartu.getBoundingClientRect().top < 0) kartu.scrollIntoView({ block: 'start' });
  }

  /* =================================================================
     4. Dialog detail (FR-08)
     ================================================================= */
  function info(label, nilai) {
    return [el('dt', { text: label }), el('dd', { text: nilai || '–' })];
  }

  function bagian(judul, isi) {
    return el('section', { className: 'detail__section' }, [el('h3', { className: 'detail__heading', text: judul })].concat(isi));
  }

  function daftarInfo(baris) {
    return el('dl', { className: 'info-list' }, [].concat.apply([], baris));
  }

  var HASIL_CEK = {
    sesuai: { ikon: 'check_circle', label: 'Sesuai' },
    tidak_sesuai: { ikon: 'cancel', label: 'Tidak sesuai' },
    belum: { ikon: 'pending', label: 'Belum dicek' }
  };

  function bagianBerkas(p) {
    return bagian('Berkas', [el('ul', { className: 'file-list' }, p.berkas.map(function (b) {
      var h = HASIL_CEK[b.hasilCek] || HASIL_CEK.belum;
      return el('li', { className: 'file-list__item file-list__item--' + b.hasilCek }, [
        U.icon(h.ikon, 'file-list__icon'),
        el('span', { className: 'file-list__body' }, [
          el('span', { className: 'file-list__name', text: R.BERKAS[b.jenis] }),
          el('span', { className: 'file-list__meta', text: (b.namaFile || 'belum diunggah') + (b.ukuranKb ? ' · ' + U.angka(b.ukuranKb) + ' KB' : '') })
        ]),
        el('span', { className: 'file-list__status', text: h.label })
      ]);
    }))]);
  }

  function bagianRiwayat(p) {
    var riwayat = S.riwayat(p.id);
    if (!riwayat.length) return bagian('Riwayat verifikasi', [el('p', { className: 'text-variant', text: 'Belum pernah diperiksa panitia.' })]);
    return bagian('Riwayat verifikasi', [el('ol', { className: 'timeline' }, riwayat.map(function (v) {
      var panitia = R.PANITIA.filter(function (x) { return x.id === v.panitiaId; })[0];
      return el('li', { className: 'timeline__item' }, [
        el('div', { className: 'cluster' }, [
          U.badgeStatus(v.keputusan),
          el('span', { className: 'text-body-sm text-variant', text: U.tanggalWaktu(v.waktu) + (panitia ? ' · ' + panitia.nama : '') })
        ]),
        v.catatan ? el('p', { className: 'timeline__note', text: v.catatan }) : null
      ]);
    }))]);
  }

  function ringkasSeleksi(p) {
    if (p.status !== 'terverifikasi') return null;
    var s = R.statusSeleksi(S.semua(), p.id);
    if (!s) return null;
    return el('span', { className: 'cluster' }, [
      U.badgeSeleksi(s.status),
      el('span', { className: 'text-body-sm text-variant', text: 'Peringkat sementara ' + U.angka(s.peringkat) + ' (kuota ' + U.angka(s.kuota) + ')' })
    ]);
  }

  function bukaDetail(id, pemicu) {
    var p = S.ambil(id);
    if (!p) { U.snackbar('Data pendaftar tidak ditemukan. Mungkin sudah dihapus.'); return; }
    var j = R.jalur(p.jalur);
    var sekolah = R.sekolahAsal(p.sekolahAsal);
    var usia = R.usiaPada(p.tglLahir);
    var idJudul = 'detail-' + p.id;

    var dataSekolah = [
      info('Sekolah', sekolah ? sekolah.nama + ' (' + sekolah.status + ')' : ''),
      info('Tahun lulus', p.tahunLulus),
      info('Nilai rapor', U.desimal(p.nilaiRapor))
    ];
    if (p.prestasiTingkat) {
      dataSekolah.push(info('Prestasi', p.prestasiNama + ' · ' + R.PRESTASI_LABEL[p.prestasiTingkat] + ' (+' + R.PRESTASI_BONUS[p.prestasiTingkat] + ')'));
    }
    if (j.dasar === 'skor') dataSekolah.push(info('Skor seleksi', U.desimal(R.skorPrestasi(p))));

    var dialog = el('dialog', { className: 'dialog dialog--lg', attrs: { 'aria-labelledby': idJudul } }, [
      el('div', { className: 'dialog__container' }, [
        el('div', { className: 'detail__head' }, [
          el('div', null, [
            el('h2', { className: 'dialog__title', text: p.nama, attrs: { id: idJudul } }),
            el('p', { className: 'text-variant num', text: p.noDaftar + ' · didaftarkan ' + U.tanggalWaktu(p.tglDaftar) })
          ]),
          el('button', { className: 'icon-btn', attrs: { type: 'button', 'aria-label': 'Tutup detail', 'data-tutup': '' } }, [U.icon('close')])
        ]),
        el('div', { className: 'cluster' }, [U.badgeStatus(p.status), U.chipJalur(p.jalur), ringkasSeleksi(p)]),
        el('div', { className: 'detail__grid' }, [
          bagian('Data diri', [daftarInfo([
            info('NISN', p.nisn),
            info('Jenis kelamin', p.jk === 'P' ? 'Perempuan' : 'Laki-laki'),
            info('Tempat, tgl lahir', p.tempatLahir + ', ' + U.tanggal(p.tglLahir)),
            info('Usia per 1 Jul 2026', usia === null ? '' : usia + ' tahun')
          ])]),
          bagian('Domisili', [daftarInfo([
            info('Alamat', p.alamat),
            info('Kelurahan', p.kelurahan + ', Kec. ' + p.kecamatan),
            info('Jarak ke sekolah', U.jarak(p.jarakMeter)),
            info('Terbit KK', U.tanggal(p.tglTerbitKk))
          ])]),
          bagian('Sekolah asal', [daftarInfo(dataSekolah)]),
          bagian('Orang tua / wali', [daftarInfo([
            info('Nama', p.namaOrtu),
            info('No. HP', p.noHp)
          ])]),
          bagianBerkas(p),
          bagianRiwayat(p)
        ]),
        el('p', { className: 'text-body-sm text-muted', text: 'Terakhir diubah ' + U.tanggalWaktu(p.updatedAt) }),
        el('div', { className: 'dialog__actions' }, [
          el('a', { className: 'btn btn--text', attrs: { href: 'form.html?id=' + encodeURIComponent(p.id) } }, [U.icon('edit'), 'Ubah data']),
          el('a', { className: 'btn btn--outlined', attrs: { href: 'bukti.html?id=' + encodeURIComponent(p.id) } }, [U.icon('receipt_long'), 'Bukti pendaftaran']),
          el('a', { className: 'btn btn--tonal', attrs: { href: 'verifikasi.html?id=' + encodeURIComponent(p.id) } }, [U.icon('fact_check'), 'Verifikasi berkas'])
        ])
      ])
    ]);

    dialog.addEventListener('click', function (e) {
      if (e.target === dialog || e.target.closest('[data-tutup]')) dialog.close();
    });
    dialog.addEventListener('close', function () {
      dialog.remove();
      if (pemicu && document.contains(pemicu)) pemicu.focus();
    });
    document.body.appendChild(dialog);
    dialog.showModal();
    dialog.querySelector('[data-tutup]').focus();
  }

  /* =================================================================
     5. Hapus + urungkan (FR-09, TC-08)
     ================================================================= */
  function hapus(id) {
    var p = S.ambil(id);
    if (!p) return;
    U.konfirmasi({
      judul: 'Hapus data pendaftar?',
      isi: p.nama + ' (' + p.noDaftar + ') beserta riwayat verifikasinya akan dihapus. Anda masih bisa mengurungkannya sesaat setelah dihapus.',
      labelYa: 'Hapus',
      bahaya: true,
      ikon: 'delete'
    }).then(function (ya) {
      if (!ya) return;
      var snapshot = S.hapus(id);   // memicu ppdb:change → tabel dirender ulang
      if (!snapshot) return;
      ringkasan.focus({ preventScroll: true });
      U.snackbar('Data ' + p.nama + ' dihapus.', {
        aksi: 'Urungkan',
        onAksi: function () {
          U.snackbar(S.pulihkan(snapshot) ? 'Data ' + p.nama + ' dikembalikan.' : 'Data tidak bisa dikembalikan.');
        }
      });
    });
  }

  /* =================================================================
     6. Ekspor CSV, cadangan, reset (FR-16, FR-17)
     ================================================================= */
  function eksporCsv() {
    var list = hasilSaring().list;
    if (!list.length) { U.snackbar('Tidak ada data untuk diekspor.'); return; }
    var baris = [[
      'No. Pendaftaran', 'Tanggal Daftar', 'Nama', 'NISN', 'Jenis Kelamin', 'Tanggal Lahir',
      'Asal Sekolah', 'Jalur', 'Jarak (m)', 'Nilai Rapor', 'Prestasi', 'Skor Prestasi', 'Status Verifikasi'
    ]];
    list.forEach(function (p) {
      var sekolah = R.sekolahAsal(p.sekolahAsal);
      baris.push([
        p.noDaftar, p.tglDaftar.replace('T', ' '), p.nama, p.nisn, p.jk, p.tglLahir,
        sekolah ? sekolah.nama : '', R.jalur(p.jalur).nama, p.jarakMeter,
        U.desimal(p.nilaiRapor), p.prestasiTingkat ? R.PRESTASI_LABEL[p.prestasiTingkat] : '',
        p.jalur === 'prestasi' ? U.desimal(R.skorPrestasi(p)) : '', R.STATUS_VERIFIKASI[p.status].label
      ]);
    });
    U.unduhCsv('pendaftar-ppdb-' + R.TANGGAL_SIMULASI + '.csv', baris);
    S.catatLog('ekspor', 'Ekspor CSV data pendaftar (' + list.length + ' baris)');
    U.snackbar(U.angka(list.length) + ' baris diekspor ke CSV.');
  }

  function unduhCadangan() {
    U.unduh('cadangan-ppdb-' + R.isoTanggal(new Date()) + '.json', S.ekspor(), 'application/json;charset=utf-8');
    S.catatLog('ekspor', 'Cadangan data (JSON) diunduh');
    U.snackbar('Cadangan diunduh. Simpan berkasnya untuk memulihkan data nanti.');
  }

  function pulihkanCadangan(berkas) {
    if (!berkas) return;
    if (berkas.size > 5 * 1024 * 1024) { U.snackbar('Berkas lebih dari 5 MB, bukan cadangan PPDB.'); return; }
    U.konfirmasi({
      judul: 'Pulihkan data dari cadangan?',
      isi: 'Semua data saat ini (' + U.angka(S.semua().length) + ' pendaftar) akan diganti isi berkas "' + berkas.name + '". Tindakan ini tidak bisa diurungkan.',
      labelYa: 'Pulihkan',
      bahaya: true,
      ikon: 'upload_file'
    }).then(function (ya) {
      if (!ya) return null;
      return berkas.text().then(function (teks) {
        var hasil = S.impor(teks);
        U.snackbar(hasil.ok ? U.angka(hasil.jumlah) + ' pendaftar dipulihkan dari cadangan.' : 'Gagal memulihkan: ' + hasil.error, { durasi: hasil.ok ? 5000 : 10000 });
      });
    }).catch(function () {
      U.snackbar('Berkas tidak bisa dibaca.');
    });
  }

  function resetData() {
    U.konfirmasi({
      judul: 'Kembalikan data awal simulasi?',
      isi: 'Semua perubahan (tambah, ubah, hapus, dan verifikasi) akan hilang, lalu data awal simulasi dibuat ulang. Unduh cadangan dulu jika ingin menyimpannya.',
      labelYa: 'Kembalikan',
      bahaya: true,
      ikon: 'restart_alt'
    }).then(function (ya) {
      if (!ya) return;
      S.reset();
      U.snackbar('Data dikembalikan ke kondisi awal simulasi (' + U.angka(S.semua().length) + ' pendaftar).');
    });
  }

  /* =================================================================
     7. Inisialisasi & event
     ================================================================= */
  function isiPilihan() {
    R.JALUR.forEach(function (j) { selJalur.appendChild(el('option', { text: j.nama, attrs: { value: j.kode } })); });
    R.SEKOLAH_ASAL.forEach(function (s) { selSekolah.appendChild(el('option', { text: s.nama, attrs: { value: s.kode } })); });
  }

  function sinkronKontrol() {
    inputCari.value = st.q;
    selJalur.value = st.jalur;
    selSekolah.value = st.sekolah;
    selPer.value = String(st.per);
  }

  var cariTunda = U.debounce(function () {
    st.q = inputCari.value.slice(0, 60);
    st.hal = 1;
    render();
  }, 250);

  inputCari.addEventListener('input', cariTunda);
  inputCari.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); st.q = inputCari.value.slice(0, 60); st.hal = 1; render(); }
  });
  selJalur.addEventListener('change', function () {
    st.jalur = selJalur.value;
    if (st.urut === 'nilai') { st.urut = st.jalur ? 'nilai' : 'daftar'; st.arah = arahAwal(st.urut); }
    st.hal = 1;
    render();
  });
  selSekolah.addEventListener('change', function () { st.sekolah = selSekolah.value; st.hal = 1; render(); });
  selPer.addEventListener('change', function () { st.per = Number(selPer.value); st.hal = 1; render(); });

  document.querySelectorAll('th[data-kolom] .table__sort').forEach(function (b) {
    b.addEventListener('click', function () { ubahUrut(b.closest('th').getAttribute('data-kolom')); });
  });

  tbody.addEventListener('click', function (e) {
    var detail = e.target.closest('[data-detail]');
    if (detail) { bukaDetail(detail.getAttribute('data-detail'), detail); return; }
    var tombolHapus = e.target.closest('[data-hapus]');
    if (tombolHapus) hapus(tombolHapus.getAttribute('data-hapus'));
  });

  halamanHost.addEventListener('click', function (e) {
    var b = e.target.closest('[data-hal]');
    if (b && !b.disabled) keHalaman(Number(b.getAttribute('data-hal')));
  });

  document.addEventListener('click', function (e) {
    var aksi = e.target.closest('[data-aksi]');
    if (!aksi) return;
    switch (aksi.getAttribute('data-aksi')) {
      case 'hapus-filter': hapusSemuaFilter(); break;
      case 'ekspor-csv': eksporCsv(); break;
      case 'unduh-cadangan': unduhCadangan(); break;
      case 'pulihkan-cadangan': inputCadangan.click(); break;
      case 'reset': resetData(); break;
    }
  });

  inputCadangan.addEventListener('change', function () {
    pulihkanCadangan(inputCadangan.files[0]);
    inputCadangan.value = '';
  });

  // Data berubah (hapus, urungkan, reset, impor, tab lain) → tampilkan ulang
  window.addEventListener('ppdb:change', render);

  document.querySelectorAll('[data-menu-toggle]').forEach(U.pasangMenu);

  if (!S.isPersistent()) {
    U.snackbar('Penyimpanan browser diblokir: perubahan hanya bertahan sampai halaman ditutup.', { durasi: 10000 });
  }

  isiPilihan();
  bacaUrl();
  sinkronKontrol();
  bangunTab();
  render();
})(window, document);
