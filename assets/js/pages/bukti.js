/* =====================================================================
   bukti.js — Bukti Pendaftaran (P-08, Tahap 11)
   FR-15 cetak · AS-06/D-17: identitas fiktif, tanpa lambang, stempel,
   tanda tangan, QR, atau barcode. ?id=pd-0001
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

  var HASIL_CEK = { sesuai: 'Sesuai', tidak_sesuai: 'Tidak sesuai', belum: 'Belum dicek' };

  function info(label, nilai) {
    return [el('dt', { text: label }), el('dd', { text: nilai || '–' })];
  }

  function isiDl(host, baris) {
    U.kosongkan(host);
    [].concat.apply([], baris).forEach(function (n) { host.appendChild(n); });
  }

  function rentang(j) {
    return j.mulai === j.selesai ? U.tanggalPanjang(j.mulai) : U.tanggal(j.mulai) + ' – ' + U.tanggal(j.selesai);
  }

  function render(p) {
    var j = R.jalur(p.jalur);
    var sekolah = R.sekolahAsal(p.sekolahAsal);
    var seleksi = R.statusSeleksi(S.semua(), p.id);

    document.title = 'Bukti ' + p.noDaftar + ' · PPDB Online';
    $('[data-kop-sekolah]').textContent = R.SEKOLAH.nama + ' (fiktif)';
    $('[data-kop-sub]').textContent = 'Panitia PPDB · Tahun Ajaran ' + R.SEKOLAH.tahunAjaran + ' · ' + R.SEKOLAH.alamat;
    $('[data-no-daftar]').textContent = 'No. ' + p.noDaftar;

    isiDl($('[data-identitas]'), [
      info('Nama', p.nama),
      info('NISN', p.nisn),
      info('Tempat, tgl lahir', p.tempatLahir + ', ' + U.tanggal(p.tglLahir)),
      info('Asal sekolah', sekolah ? sekolah.nama : ''),
      info('Orang tua/wali', p.namaOrtu)
    ]);
    isiDl($('[data-seleksi]'), [
      info('Jalur', j.nama),
      j.dasar === 'skor' ? info('Skor', U.desimal(R.skorPrestasi(p))) : info('Jarak', U.jarak(p.jarakMeter)),
      info('Tanggal daftar', U.tanggalWaktu(p.tglDaftar)),
      info('Status verifikasi', R.STATUS_VERIFIKASI[p.status].labelPanjang),
      info('Peringkat sementara', seleksi ? seleksi.peringkat + ' dari kuota ' + seleksi.kuota + ' (' + R.STATUS_SELEKSI[seleksi.status].label.toLowerCase() + ')' : 'Belum ikut peringkat')
    ]);

    var berkas = U.kosongkan($('[data-berkas]'));
    p.berkas.forEach(function (b) {
      berkas.appendChild(el('tr', null, [
        el('td', { text: R.BERKAS[b.jenis] }),
        el('td', { text: b.namaFile || 'Belum diunggah' }),
        el('td', { text: HASIL_CEK[b.hasilCek] || b.hasilCek })
      ]));
    });

    var jadwal = U.kosongkan($('[data-jadwal]'));
    R.JADWAL.filter(function (x) { return x.kode === 'pengumuman' || x.kode === 'daftar_ulang'; }).forEach(function (x) {
      jadwal.appendChild(el('li', null, [el('strong', { text: x.nama + ': ' }), rentang(x)]));
    });
    if (p.status === 'perbaikan') {
      var catatan = S.riwayat(p.id)[0];
      jadwal.appendChild(el('li', null, [el('strong', { text: 'Perlu perbaikan: ' }),
        (catatan && catatan.catatan ? catatan.catatan + ' ' : '') + 'Unggah ulang paling lambat ' + U.tanggal(R.JADWAL[0].selesai) + '.']));
    }

    $('[data-tgl-cetak]').textContent = 'Kota Nusantara, ' + U.tanggalPanjang(R.TANGGAL_SIMULASI).replace(/^[^,]+, /, '');
    $('[data-lembar]').hidden = false;
  }

  var id = new URLSearchParams(window.location.search).get('id');
  var p = /^pd-\d{4,6}$/.test(id || '') ? S.ambil(id) : null;
  if (!p) {
    $('[data-tidak-ditemukan]').hidden = false;
    $('[data-aksi="cetak"]').hidden = true;
    document.title = 'Bukti tidak ditemukan · PPDB Online';
    return;
  }
  render(p);
  $('[data-aksi="cetak"]').addEventListener('click', function () { window.print(); });
})(window, document);
