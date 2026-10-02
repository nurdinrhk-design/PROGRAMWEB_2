/* =====================================================================
   verifikasi.js — Verifikasi Berkas (P-05, Tahap 8)
   FR-12 cek per berkas + keputusan · BR-08 catatan wajib & konfirmasi tolak
   Antrean: status menunggu (terlama dulu) atau perlu perbaikan.
   ?id=pd-0001 membuka pendaftar tertentu (dari Data Pendaftar).
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

  // Yang perlu dicocokkan petugas pada setiap jenis berkas
  var PANDUAN = {
    kk: 'Nama calon siswa tercantum, alamat dan tanggal terbit sama dengan isian.',
    akta: 'Nama, tempat, dan tanggal lahir sama dengan isian.',
    rapor: 'Nilai semester 1–5 sama dengan isian dan atas nama calon siswa.',
    kip: 'Kartu atas nama calon siswa atau orang tua dan masih berlaku.',
    surat_tugas: 'Diterbitkan instansi tempat orang tua bekerja dan ditandatangani pejabat berwenang.',
    sertifikat: 'Tingkat dan nama prestasi sama dengan isian.'
  };

  var st = {
    antrean: 'menunggu',   // menunggu | perbaikan
    q: '',
    id: null,              // pendaftar yang sedang dibuka
    berkas: null           // jenis berkas pada tab aktif
  };
  var draf = {};           // id → { cek: {jenis: hasil}, catatan } agar isian tidak hilang saat berpindah

  var listAntrean = $('[data-antrean-list]');
  var inputCari = $('#cari-antrean');
  var panelBerkas = $('[data-panel-berkas]');
  var panelKeputusan = $('[data-panel-keputusan]');
  var panelKosong = $('[data-kosong]');
  var tabBerkas = $('[data-tab-berkas]');
  var isiBerkas = $('[data-isi-berkas]');
  var formKeputusan = $('[data-form-keputusan]');
  var inputCatatan = $('#catatan');
  var errorKeputusan = $('[data-error-keputusan]');

  /* =================================================================
     1. Antrean
     ================================================================= */
  function cocok(p, q) {
    if (!q) return true;
    if (/^\d+$/.test(q)) return p.nisn.indexOf(q) > -1 || p.noDaftar.indexOf(q) > -1;
    return p.nama.toLowerCase().indexOf(q) > -1 || p.noDaftar.toLowerCase().indexOf(q) > -1;
  }

  // Terlama dulu: menunggu dihitung dari waktu daftar/perubahan terakhir,
  // perlu perbaikan dari waktu keputusan terakhir
  function antrean() {
    var q = st.q.trim().toLowerCase();
    return S.semua().filter(function (p) { return p.status === st.antrean && cocok(p, q); })
      .sort(function (a, b) {
        var ka = st.antrean === 'menunggu' ? a.tglDaftar : a.updatedAt;
        var kb = st.antrean === 'menunggu' ? b.tglDaftar : b.updatedAt;
        return ka < kb ? -1 : ka > kb ? 1 : (a.noDaftar < b.noDaftar ? -1 : 1);
      });
  }

  function renderAntrean() {
    var hitung = S.hitungStatus();
    $('[data-jumlah="menunggu"]').textContent = U.angka(hitung.menunggu);
    $('[data-jumlah="perbaikan"]').textContent = U.angka(hitung.perbaikan);
    document.querySelectorAll('[data-antrean]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-antrean') === st.antrean));
    });

    var list = antrean();
    $('[data-info-antrean]').textContent = st.q.trim()
      ? U.angka(list.length) + ' cocok dengan "' + st.q.trim() + '"'
      : U.angka(list.length) + ' pendaftar, terlama di atas';

    var frag = document.createDocumentFragment();
    list.forEach(function (p) {
      var sejak = st.antrean === 'menunggu' ? p.tglDaftar : p.updatedAt;
      frag.appendChild(el('li', null, [
        el('button', {
          className: 'queue__item',
          attrs: { type: 'button', 'data-buka': p.id, 'aria-current': p.id === st.id ? 'true' : false }
        }, [
          el('span', { className: 'queue__name', text: p.nama }),
          el('span', { className: 'queue__meta' }, [
            U.chipJalur(p.jalur),
            el('span', { className: 'num', text: p.noDaftar }),
            el('span', { className: 'queue__age', text: U.lamaMenunggu(sejak) })
          ])
        ])
      ]));
    });
    U.kosongkan(listAntrean).appendChild(frag);
    if (!list.length) {
      listAntrean.appendChild(el('li', { className: 'queue__empty', text: st.q.trim() ? 'Tidak ada yang cocok.' : 'Antrean kosong.' }));
    }
  }

  /* =================================================================
     2. Panel berkas & data pembanding
     ================================================================= */
  function info(label, nilai) {
    return [el('dt', { text: label }), el('dd', { text: nilai || '–' })];
  }

  function dl(baris) {
    return el('dl', { className: 'info-list' }, [].concat.apply([], baris));
  }

  // Isian yang relevan untuk dicocokkan dengan setiap jenis berkas
  function pembanding(p, jenis) {
    var sekolah = R.sekolahAsal(p.sekolahAsal);
    var ttl = p.tempatLahir + ', ' + U.tanggal(p.tglLahir);
    switch (jenis) {
      case 'kk': return [info('Nama', p.nama), info('Alamat', p.alamat + ', Kel. ' + p.kelurahan + ', Kec. ' + p.kecamatan), info('Terbit KK', U.tanggal(p.tglTerbitKk))];
      case 'akta': return [info('Nama', p.nama), info('Tempat, tgl lahir', ttl), info('Jenis kelamin', p.jk === 'P' ? 'Perempuan' : 'Laki-laki')];
      case 'rapor': return [info('Nama', p.nama), info('Asal sekolah', sekolah ? sekolah.nama : ''),
        info('Nilai semester', (p.nilaiSemester || []).length ? p.nilaiSemester.map(U.desimal).join(' · ') : 'belum tercatat'),
        info('Rata-rata', U.desimal(p.nilaiRapor))];
      case 'kip': return [info('Nama', p.nama), info('Orang tua/wali', p.namaOrtu)];
      case 'surat_tugas': return [info('Orang tua/wali', p.namaOrtu), info('Alamat', p.alamat)];
      case 'sertifikat': return [info('Nama', p.nama), info('Prestasi', p.prestasiNama), info('Tingkat', R.PRESTASI_LABEL[p.prestasiTingkat] || '')];
      default: return [];
    }
  }

  // Pemeriksaan otomatis dari isian (bukan dari berkas): BR-02, BR-03, BR-05
  function cekOtomatis(p) {
    var hasil = [];
    var usia = R.usiaPada(p.tglLahir);
    var errUsia = R.validasi.tglLahir(p.tglLahir);
    hasil.push({ ok: !errUsia, teks: errUsia || 'Usia ' + usia + ' tahun per 1 Juli 2026 (maks. ' + R.USIA_MAKS + ')' });
    if (p.jalur === 'zonasi') {
      var errKk = R.validasi.tglTerbitKk(p.tglTerbitKk, 'zonasi');
      hasil.push({ ok: !errKk, teks: errKk ? 'KK terbit ' + U.tanggal(p.tglTerbitKk) + ', melewati batas zonasi ' + U.tanggal(R.BATAS_KK_ZONASI) : 'KK terbit ' + U.tanggal(p.tglTerbitKk) + ', memenuhi syarat zonasi' });
    }
    var kurang = p.berkas.filter(function (b) { return !b.namaFile; }).length;
    hasil.push({ ok: !kurang, teks: kurang ? kurang + ' berkas wajib belum diunggah' : 'Semua ' + p.berkas.length + ' berkas wajib sudah diunggah' });
    return hasil;
  }

  var IKON_CEK = { sesuai: 'check_circle', tidak_sesuai: 'cancel', belum: 'radio_button_unchecked' };
  var LABEL_CEK = { sesuai: 'Sesuai', tidak_sesuai: 'Tidak sesuai', belum: 'Belum dicek' };

  function hasilCek(jenis) {
    return (draf[st.id] && draf[st.id].cek[jenis]) || 'belum';
  }

  function renderTabBerkas(p) {
    U.kosongkan(tabBerkas);
    p.berkas.forEach(function (b) {
      var aktif = b.jenis === st.berkas;
      var h = hasilCek(b.jenis);
      tabBerkas.appendChild(el('button', {
        className: 'tab tab--doc tab--' + h,
        attrs: { type: 'button', role: 'tab', id: 'tab-' + b.jenis, 'aria-selected': String(aktif), 'aria-controls': 'panel-berkas', tabindex: aktif ? '0' : '-1', 'data-jenis': b.jenis }
      }, [U.icon(IKON_CEK[h], 'icon--sm'), R.BERKAS[b.jenis], el('span', { className: 'sr-only', text: ' (' + LABEL_CEK[h] + ')' })]));
    });
    isiBerkas.setAttribute('aria-labelledby', 'tab-' + st.berkas);
  }

  function renderIsiBerkas(p) {
    var b = p.berkas.filter(function (x) { return x.jenis === st.berkas; })[0];
    U.kosongkan(isiBerkas);
    if (!b) return;
    isiBerkas.appendChild(el('div', { className: 'doc__preview' }, [
      U.icon(b.namaFile ? 'description' : 'draft', 'doc__icon'),
      el('p', { className: 'doc__file', text: b.namaFile || 'Berkas belum diunggah' }),
      b.namaFile ? el('p', { className: 'doc__size num', text: U.angka(b.ukuranKb) + ' KB' }) : null,
      el('p', { className: 'doc__note', text: 'Pratinjau tidak tersedia di versi simulasi. Berkas asli tidak disimpan, hanya nama dan ukurannya.' })
    ]));
    isiBerkas.appendChild(el('div', { className: 'doc__compare' }, [
      el('h3', { className: 'detail__heading', text: 'Yang dicocokkan' }),
      el('p', { className: 'text-body-sm', text: PANDUAN[b.jenis] }),
      dl(pembanding(p, b.jenis))
    ]));
  }

  function renderPendaftar() {
    var p = st.id ? S.ambil(st.id) : null;
    var ada = !!p;
    panelBerkas.hidden = !ada;
    panelKeputusan.hidden = !ada;
    panelKosong.hidden = ada;
    if (!ada) {
      var kosongTotal = !antrean().length;
      $('[data-kosong-judul]').textContent = kosongTotal ? 'Antrean kosong' : 'Pilih pendaftar dari antrean';
      $('[data-kosong-teks]').textContent = kosongTotal
        ? (st.q.trim() ? 'Tidak ada pendaftar yang cocok dengan pencarian.' : 'Semua berkas di antrean ini sudah diperiksa.')
        : 'Berkas dan formulir keputusan tampil di sini.';
      return;
    }
    if (!draf[p.id]) {
      var cek = {};
      p.berkas.forEach(function (b) { if (b.hasilCek !== 'belum') cek[b.jenis] = b.hasilCek; });
      draf[p.id] = { cek: cek, catatan: '' };
    }
    if (!st.berkas || !p.berkas.some(function (b) { return b.jenis === st.berkas; })) st.berkas = p.berkas[0] && p.berkas[0].jenis;

    var j = R.jalur(p.jalur);
    $('[data-nama]').textContent = p.nama;
    $('[data-meta]').textContent = p.noDaftar + ' · NISN ' + p.nisn + ' · daftar ' + U.tanggalWaktu(p.tglDaftar) +
      (j.dasar === 'skor' ? ' · skor ' + U.desimal(R.skorPrestasi(p)) : ' · ' + U.jarak(p.jarakMeter));
    var label = U.kosongkan($('[data-label-status]'));
    label.appendChild(U.badgeStatus(p.status));
    label.appendChild(U.chipJalur(p.jalur));

    var infoStatus = $('[data-info-status]');
    if (p.status === 'menunggu') {
      infoStatus.hidden = true;
    } else {
      var terakhir = S.riwayat(p.id)[0];
      $('[data-info-status-teks]').textContent = 'Pendaftar ini berstatus ' + R.STATUS_VERIFIKASI[p.status].label +
        (terakhir ? ' sejak ' + U.tanggalWaktu(terakhir.waktu) : '') + '. Keputusan baru akan menggantikan status ini.';
      infoStatus.hidden = false;
    }

    var otomatis = U.kosongkan($('[data-cek-otomatis]'));
    cekOtomatis(p).forEach(function (c) {
      otomatis.appendChild(el('li', { className: 'auto-check__item' + (c.ok ? '' : ' auto-check__item--warn') }, [
        U.icon(c.ok ? 'check' : 'warning', 'icon--sm'), el('span', { text: c.teks })
      ]));
    });

    renderTabBerkas(p);
    renderIsiBerkas(p);
    renderKeputusan(p);
  }

  /* =================================================================
     3. Panel keputusan
     ================================================================= */
  function renderKeputusan(p) {
    var host = U.kosongkan($('[data-cek-berkas]'));
    p.berkas.forEach(function (b) {
      var nama = 'cek-' + b.jenis;
      var h = hasilCek(b.jenis);
      host.appendChild(el('div', { className: 'check-row', attrs: { role: 'radiogroup', 'aria-labelledby': nama + '-label' } }, [
        el('span', { className: 'check-row__label', text: R.BERKAS[b.jenis], attrs: { id: nama + '-label' } }),
        el('label', { className: 'check' }, [
          el('input', { attrs: { type: 'radio', name: nama, value: 'sesuai', 'data-cek': b.jenis, checked: h === 'sesuai', disabled: !b.namaFile } }),
          el('span', { text: 'Sesuai' })
        ]),
        el('label', { className: 'check' }, [
          el('input', { attrs: { type: 'radio', name: nama, value: 'tidak_sesuai', 'data-cek': b.jenis, checked: h === 'tidak_sesuai' } }),
          el('span', { text: 'Tidak sesuai' })
        ])
      ]));
    });
    inputCatatan.value = draf[p.id].catatan;
    tampilkanErrorCatatan('');
    errorKeputusan.hidden = true;
    perbaruiTombol(p);
    renderRiwayat(p);
  }

  // Terverifikasi hanya aktif bila semua berkas wajib bertanda sesuai (FR-12, TC-15)
  function perbaruiTombol(p) {
    var total = p.berkas.length;
    var sesuai = p.berkas.filter(function (b) { return hasilCek(b.jenis) === 'sesuai'; }).length;
    var boleh = sesuai === total;
    $('[data-keputusan="terverifikasi"]').disabled = !boleh;
    $('[data-syarat-verif]').textContent = boleh
      ? 'Semua ' + total + ' berkas sesuai.'
      : 'Aktif setelah semua berkas bertanda Sesuai (' + sesuai + ' dari ' + total + ').';
    $('[data-hitung-catatan]').textContent = inputCatatan.value.length + '/500';
  }

  function renderRiwayat(p) {
    var host = U.kosongkan($('[data-riwayat]'));
    var riwayat = S.riwayat(p.id);
    if (!riwayat.length) { host.appendChild(el('p', { className: 'text-body-sm text-variant', text: 'Belum pernah diperiksa.' })); return; }
    host.appendChild(el('ol', { className: 'timeline' }, riwayat.slice(0, 5).map(function (v) {
      return el('li', { className: 'timeline__item' }, [
        el('div', { className: 'cluster' }, [U.badgeStatus(v.keputusan), el('span', { className: 'text-body-sm text-variant', text: U.tanggalWaktu(v.waktu) })]),
        v.catatan ? el('p', { className: 'timeline__note', text: v.catatan }) : null
      ]);
    })));
  }

  function tampilkanErrorCatatan(pesan) {
    var w = $('[data-field="catatan"]');
    w.classList.toggle('field--error', !!pesan);
    $('#catatan-error').textContent = pesan;
    inputCatatan.setAttribute('aria-invalid', String(!!pesan));
  }

  /* =================================================================
     4. Simpan keputusan (FR-12, BR-08, FR-18)
     ================================================================= */
  function putuskan(keputusan) {
    var p = S.ambil(st.id);
    if (!p) return;
    var catatan = inputCatatan.value.trim();
    var errCatatan = R.validasi.catatanKeputusan(keputusan, catatan);
    if (errCatatan) {
      tampilkanErrorCatatan(errCatatan);
      inputCatatan.focus();
      return;
    }
    tampilkanErrorCatatan('');
    var lanjut = keputusan === 'ditolak'
      ? U.konfirmasi({
        judul: 'Tolak pendaftaran ' + p.nama + '?',
        isi: 'Pendaftar tidak akan ikut peringkat. Alasan yang dicatat: "' + catatan + '"',
        labelYa: 'Tolak pendaftaran',
        bahaya: true,
        ikon: 'block'
      })
      : Promise.resolve(true);

    lanjut.then(function (ya) {
      if (!ya) return;
      var daftarSebelum = antrean().map(function (x) { return x.id; });
      var posisi = daftarSebelum.indexOf(p.id);
      var akun = PPDB.auth.panitiaAktif();
      var hasil = S.verifikasi(p.id, { keputusan: keputusan, catatan: catatan, hasilCek: draf[p.id].cek, panitiaId: akun ? akun.id : '' });
      if (!hasil.ok) {
        $('[data-error-keputusan-teks]').textContent = hasil.error;
        errorKeputusan.hidden = false;
        return;
      }
      delete draf[p.id];

      var pesan = p.nama + ': ' + R.STATUS_VERIFIKASI[keputusan].labelPanjang + '.';
      if (keputusan === 'terverifikasi') {
        var sel = R.statusSeleksi(S.semua(), p.id);
        if (sel) pesan += ' Peringkat sementara ' + sel.peringkat + ' di jalur ' + R.jalur(p.jalur).singkat + ' (' + R.STATUS_SELEKSI[sel.status].label.toLowerCase() + ').';
      }

      // Lanjut ke pendaftar berikutnya di antrean yang sama
      var sisa = antrean().map(function (x) { return x.id; });
      var berikut = null;
      for (var i = posisi + 1; i < daftarSebelum.length && posisi > -1; i++) {
        if (sisa.indexOf(daftarSebelum[i]) > -1) { berikut = daftarSebelum[i]; break; }
      }
      if (!berikut && sisa.length) berikut = sisa[0];
      U.snackbar(pesan + (berikut ? ' Lanjut ke pendaftar berikutnya.' : ''));
      buka(berikut, true);
    });
  }

  /* =================================================================
     5. Navigasi
     ================================================================= */
  function tulisUrl() {
    var qs = st.id ? '?id=' + encodeURIComponent(st.id) : '';
    window.history.replaceState(null, '', window.location.pathname + qs);
  }

  function buka(id, fokus) {
    if (st.id !== id) st.berkas = null;
    st.id = id || null;
    renderAntrean();
    renderPendaftar();
    tulisUrl();
    if (fokus && st.id) {
      var judul = $('[data-nama]');
      judul.focus({ preventScroll: true });
      if (panelBerkas.getBoundingClientRect().top < 0 || window.innerWidth < 840) panelBerkas.scrollIntoView({ block: 'start' });
    }
    var aktif = listAntrean.querySelector('[aria-current="true"]');
    if (aktif) aktif.scrollIntoView({ block: 'nearest' });
  }

  function pilihTab(jenis, fokus) {
    st.berkas = jenis;
    var p = S.ambil(st.id);
    renderTabBerkas(p);
    renderIsiBerkas(p);
    if (fokus) document.getElementById('tab-' + jenis).focus();
  }

  /* ---------- Event ---------- */
  listAntrean.addEventListener('click', function (e) {
    var b = e.target.closest('[data-buka]');
    if (b) buka(b.getAttribute('data-buka'), true);
  });

  document.querySelectorAll('[data-antrean]').forEach(function (b) {
    b.addEventListener('click', function () {
      st.antrean = b.getAttribute('data-antrean');
      var list = antrean();
      var masih = list.some(function (p) { return p.id === st.id; });
      buka(masih ? st.id : (list[0] ? list[0].id : null), false);
    });
  });

  inputCari.addEventListener('input', U.debounce(function () {
    st.q = inputCari.value.slice(0, 60);
    renderAntrean();
    if (!st.id) renderPendaftar();
  }, 250));

  tabBerkas.addEventListener('click', function (e) {
    var t = e.target.closest('[role="tab"]');
    if (t) pilihTab(t.getAttribute('data-jenis'), false);
  });

  tabBerkas.addEventListener('keydown', function (e) {
    var tab = Array.prototype.slice.call(tabBerkas.querySelectorAll('[role="tab"]'));
    var i = tab.indexOf(document.activeElement);
    if (i < 0) return;
    var ke = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tab.length - 1 }[e.key];
    if (ke === undefined) return;
    e.preventDefault();
    pilihTab(tab[(ke + tab.length) % tab.length].getAttribute('data-jenis'), true);
  });

  formKeputusan.addEventListener('change', function (e) {
    var jenis = e.target.getAttribute('data-cek');
    if (!jenis) return;
    draf[st.id].cek[jenis] = e.target.value;
    errorKeputusan.hidden = true;
    var p = S.ambil(st.id);
    perbaruiTombol(p);
    renderTabBerkas(p);
    // Saat memeriksa berkas di panel kanan, tab berkas yang sama ikut terbuka
    if (st.berkas !== jenis) pilihTab(jenis, false);
  });

  inputCatatan.addEventListener('input', function () {
    draf[st.id].catatan = inputCatatan.value;
    $('[data-hitung-catatan]').textContent = inputCatatan.value.length + '/500';
    if ($('[data-field="catatan"]').classList.contains('field--error') && inputCatatan.value.trim().length >= 10) tampilkanErrorCatatan('');
  });

  formKeputusan.addEventListener('submit', function (e) { e.preventDefault(); });
  formKeputusan.addEventListener('click', function (e) {
    var b = e.target.closest('[data-keputusan]');
    if (b && !b.disabled) putuskan(b.getAttribute('data-keputusan'));
  });

  // Data berubah di tab lain → segarkan antrean & panel
  window.addEventListener('ppdb:change', function (e) {
    if (e.detail && e.detail.tipe === 'sinkron') { renderAntrean(); renderPendaftar(); }
  });

  /* ---------- Mulai ---------- */
  var idUrl = new URLSearchParams(window.location.search).get('id');
  var awal = /^pd-\d{4,6}$/.test(idUrl || '') ? S.ambil(idUrl) : null;
  if (awal) {
    if (awal.status === 'perbaikan') st.antrean = 'perbaikan';
    buka(awal.id, false);
  } else {
    if (idUrl) U.snackbar('Pendaftar tidak ditemukan. Menampilkan antrean terlama.');
    var pertama = antrean()[0];
    buka(pertama ? pertama.id : null, false);
  }
})(window, document);
