/* =====================================================================
   portal.js — Beranda portal orang tua (Tahap 14)
   Daftar anak milik akun yang sedang masuk + status, catatan panitia,
   posisi antrean / peringkat sementara, berkas, dan tindakan.
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
  var ortu = PPDB.auth.pesertaAktif();

  var HASIL_CEK = {
    sesuai: { ikon: 'check_circle', label: 'Sesuai' },
    tidak_sesuai: { ikon: 'cancel', label: 'Tidak sesuai' },
    belum: { ikon: 'pending', label: 'Belum dicek' }
  };

  function jadwal(kode) {
    return R.JADWAL.filter(function (j) { return j.kode === kode; })[0];
  }

  // Masa pendaftaran masih dibuka? (berdasarkan tanggal simulasi)
  function pendaftaranBuka() {
    var j = jadwal('pendaftaran');
    var d = R.today();
    return R.parseTanggal(j.mulai) <= d && d <= R.parseTanggal(j.selesai);
  }

  // Posisi dalam antrean verifikasi (terlama dulu), sama dengan urutan di halaman panitia
  function posisiAntrean(p) {
    var antre = S.semua().filter(function (x) { return x.status === 'menunggu'; })
      .sort(function (a, b) { return a.tglDaftar < b.tglDaftar ? -1 : a.tglDaftar > b.tglDaftar ? 1 : (a.noDaftar < b.noDaftar ? -1 : 1); });
    return antre.map(function (x) { return x.id; }).indexOf(p.id) + 1;
  }

  /* ---------- Hasil akhir setelah diumumkan (Tahap 16) ---------- */
  function pesanHasil(p, h) {
    var du = jadwal('daftar_ulang');
    if (h.status === 'diterima') {
      return el('div', { className: 'alert alert--success' }, [U.icon('celebration'), el('div', { className: 'alert__body' }, [
        el('p', { className: 'alert__title', text: 'Selamat, ' + p.nama + ' diterima di jalur ' + R.jalur(p.jalur).nama }),
        el('p', { text: h.daftarUlang
          ? 'Daftar ulang sudah dikonfirmasi pada ' + U.tanggalWaktu(h.daftarUlang) + '. Bawa berkas asli ke sekolah pada ' + U.tanggal(du.mulai) + ' – ' + U.tanggal(du.selesai) + '.'
          : 'Peringkat ' + U.angka(h.peringkat) + ' dari kuota ' + U.angka(h.kuota) + '. Konfirmasi daftar ulang paling lambat ' + U.tanggalPanjang(du.selesai) + ', lalu bawa berkas asli ke sekolah.' })
      ])]);
    }
    return el('div', { className: 'alert alert--info' }, [U.icon('info'), el('div', { className: 'alert__body' }, [
      el('p', { className: 'alert__title', text: 'Tidak diterima' }),
      el('p', { text: R.ALASAN_TIDAK[h.alasan] + (h.peringkat ? ' (peringkat ' + U.angka(h.peringkat) + ', kuota ' + U.angka(h.kuota) + ')' : '') +
        '. Terima kasih telah mendaftar. Hubungi panitia di sekolah bila ada pertanyaan.' })
    ])]);
  }

  function konfirmasiDaftarUlang(p) {
    U.konfirmasi({
      judul: 'Konfirmasi daftar ulang ' + p.nama + '?',
      isi: 'Dengan konfirmasi ini, ' + p.nama + ' menyatakan akan bersekolah di ' + R.SEKOLAH.nama + '. Berkas asli tetap dibawa ke sekolah saat jadwal daftar ulang.',
      labelYa: 'Konfirmasi',
      ikon: 'how_to_reg'
    }).then(function (ya) {
      if (!ya) return;
      var r = S.konfirmasiDaftarUlang(p.id, ortu.id);
      U.snackbar(r.ok ? 'Daftar ulang ' + p.nama + ' dikonfirmasi.' : r.error);
    });
  }

  /* ---------- Pesan status (bahasa untuk orang tua) ---------- */
  function pesanStatus(p) {
    var v = S.riwayat(p.id)[0];
    if (p.status === 'menunggu') {
      return el('div', { className: 'alert alert--info' }, [U.icon('hourglass_top'), el('div', { className: 'alert__body' }, [
        el('p', { className: 'alert__title', text: 'Menunggu diperiksa panitia' }),
        el('p', { text: 'Urutan ke-' + U.angka(posisiAntrean(p)) + ' dalam antrean verifikasi. Panitia memeriksa dari pendaftaran yang paling lama.' })
      ])]);
    }
    if (p.status === 'perbaikan') {
      return el('div', { className: 'alert alert--warning' }, [U.icon('edit_note'), el('div', { className: 'alert__body' }, [
        el('p', { className: 'alert__title', text: 'Perlu perbaikan' }),
        el('p', { text: (v && v.catatan ? v.catatan + ' ' : '') + 'Perbaiki paling lambat ' + U.tanggal(jadwal('pendaftaran').selesai) + '.' })
      ])]);
    }
    if (p.status === 'ditolak') {
      return el('div', { className: 'alert alert--error' }, [U.icon('block'), el('div', { className: 'alert__body' }, [
        el('p', { className: 'alert__title', text: 'Pendaftaran ditolak' }),
        el('p', { text: (v && v.catatan ? v.catatan + ' ' : '') + 'Hubungi panitia di sekolah bila ada pertanyaan.' })
      ])]);
    }
    var s = R.statusSeleksi(S.semua(), p.id);
    var masuk = s && s.status === 'masuk';
    return el('div', { className: 'alert ' + (masuk ? 'alert--success' : 'alert--info') }, [U.icon(masuk ? 'verified' : 'info'), el('div', { className: 'alert__body' }, [
      el('p', { className: 'alert__title', text: 'Berkas terverifikasi' + (s ? ' · peringkat sementara ' + U.angka(s.peringkat) + ' dari kuota ' + U.angka(s.kuota) : '') }),
      el('p', { text: (masuk ? 'Saat ini masuk kuota jalur ' : 'Saat ini di luar kuota jalur ') + R.jalur(p.jalur).nama +
        '. Peringkat bisa berubah sampai pengumuman ' + U.tanggalPanjang(jadwal('pengumuman').mulai) + '.' })
    ])]);
  }

  function kartuAnak(p) {
    var j = R.jalur(p.jalur);
    var h = S.hasilPendaftar(p.id);
    var bisaUbah = !h && (p.status === 'menunggu' || p.status === 'perbaikan');
    var aksi = [
      el('a', { className: 'btn btn--outlined', attrs: { href: 'bukti.html?id=' + encodeURIComponent(p.id) } }, [U.icon('receipt_long'), 'Bukti pendaftaran'])
    ];
    if (h && h.status === 'diterima' && !h.daftarUlang) {
      aksi.unshift(el('button', { className: 'btn btn--tonal', attrs: { type: 'button' }, on: { click: function () { konfirmasiDaftarUlang(p); } } },
        [U.icon('how_to_reg'), 'Konfirmasi daftar ulang']));
    } else if (!bisaUbah) {
      // Sudah diputuskan / diumumkan: hanya bukti
    } else if (p.status === 'perbaikan') {
      aksi.unshift(el('a', { className: 'btn btn--tonal', attrs: { href: 'form.html?id=' + encodeURIComponent(p.id) } }, [U.icon('edit_note'), 'Perbaiki pendaftaran']));
    } else if (bisaUbah) {
      aksi.push(el('a', { className: 'btn btn--text', attrs: { href: 'form.html?id=' + encodeURIComponent(p.id) } }, [U.icon('edit'), 'Ubah data']));
    }

    return el('article', { className: 'card child', attrs: { 'aria-labelledby': 'anak-' + p.id, 'data-id': p.id } }, [
      el('div', { className: 'child__head' }, [
        el('div', null, [
          el('h3', { className: 'child__name', text: p.nama, attrs: { id: 'anak-' + p.id } }),
          el('p', { className: 'text-body-sm text-variant num', text: p.noDaftar + ' · didaftarkan ' + U.tanggalWaktu(p.tglDaftar) })
        ]),
        el('div', { className: 'cluster' }, [h ? U.badgePengumuman(h.status) : U.badgeStatus(p.status), U.chipJalur(p.jalur)])
      ]),
      h ? pesanHasil(p, h) : pesanStatus(p),
      el('dl', { className: 'info-list' }, [
        el('dt', { text: 'Jalur' }), el('dd', { text: j.nama }),
        el('dt', { text: j.dasar === 'skor' ? 'Skor' : 'Jarak' }), el('dd', { text: j.dasar === 'skor' ? U.desimal(R.skorPrestasi(p)) : U.jarak(p.jarakMeter) }),
        el('dt', { text: 'Asal sekolah' }), el('dd', { text: (R.sekolahAsal(p.sekolahAsal) || {}).nama || '–' })
      ]),
      el('details', { className: 'child__files' }, [
        el('summary', { text: 'Berkas (' + p.berkas.filter(function (b) { return b.hasilCek === 'sesuai'; }).length + ' dari ' + p.berkas.length + ' sesuai)' }),
        el('ul', { className: 'file-list' }, p.berkas.map(function (b) {
          var h = HASIL_CEK[b.hasilCek] || HASIL_CEK.belum;
          return el('li', { className: 'file-list__item file-list__item--' + b.hasilCek }, [
            U.icon(h.ikon, 'file-list__icon'),
            el('span', { className: 'file-list__body' }, [
              el('span', { className: 'file-list__name', text: R.BERKAS[b.jenis] }),
              el('span', { className: 'file-list__meta', text: b.namaFile || 'belum diunggah' })
            ]),
            el('span', { className: 'file-list__status', text: h.label })
          ]);
        }))
      ]),
      el('div', { className: 'child__actions' }, aksi)
    ]);
  }

  function render() {
    ortu = PPDB.auth.pesertaAktif();
    if (!ortu) return;
    var anak = S.pendaftarAkun(ortu.id);
    var diumumkan = !!S.pengumuman();
    var buka = pendaftaranBuka() && !diumumkan;
    var penuh = anak.length >= R.MAKS_ANAK;

    $('[data-sapaan]').textContent = 'Halo, ' + ortu.nama;
    $('[data-judul-anak]').textContent = 'Anak yang didaftarkan (' + anak.length + ' dari ' + R.MAKS_ANAK + ')';

    // Tombol daftarkan anak hanya bila masih bisa
    document.querySelectorAll('a[href="form.html"]').forEach(function (a) {
      a.hidden = !buka || penuh;
    });

    var tutup = jadwal('pendaftaran').selesai;
    var du = jadwal('daftar_ulang');
    $('[data-info-jadwal-teks]').textContent = diumumkan
      ? 'Hasil seleksi sudah diumumkan. Daftar ulang: ' + U.tanggal(du.mulai) + ' – ' + U.tanggal(du.selesai) + '.'
      : (buka ? 'Pendaftaran dibuka sampai ' + U.tanggalPanjang(tutup) + '. ' : 'Masa pendaftaran sudah ditutup. ') +
        'Pengumuman hasil: ' + U.tanggalPanjang(jadwal('pengumuman').mulai) + '.' +
        (penuh ? ' Akun ini sudah mendaftarkan ' + R.MAKS_ANAK + ' anak (batas maksimal).' : '');

    var host = U.kosongkan($('[data-daftar-anak]'));
    anak.forEach(function (p) { host.appendChild(kartuAnak(p)); });
    $('[data-kosong]').hidden = anak.length > 0;

    var agenda = U.kosongkan($('[data-jadwal]'));
    var hariIni = R.today();
    R.JADWAL.forEach(function (j) {
      var mulai = R.parseTanggal(j.mulai);
      var selesai = R.parseTanggal(j.selesai);
      var keadaan = hariIni > selesai ? 'selesai' : hariIni < mulai ? 'nanti' : 'aktif';
      agenda.appendChild(el('li', { className: 'agenda__item agenda__item--' + keadaan }, [
        el('span', { className: 'agenda__name', text: j.nama }),
        el('span', { className: 'agenda__date num', text: j.mulai === j.selesai ? U.tanggal(j.mulai) : U.tanggal(j.mulai) + ' – ' + U.tanggal(j.selesai) }),
        el('span', { className: 'agenda__state', text: keadaan === 'aktif' ? 'Sedang berlangsung' : keadaan === 'nanti' ? R.selisihHari(hariIni, mulai) + ' hari lagi' : 'Selesai' })
      ]));
    });
  }

  // Perubahan dari tab lain (mis. panitia memverifikasi) langsung terlihat
  window.addEventListener('ppdb:change', render);
  render();
})(window, document);
