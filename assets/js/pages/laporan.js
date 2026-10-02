/* =====================================================================
   laporan.js — Rekap & Cetak (P-07, Tahap 11)
   FR-14 rekap per jalur, asal sekolah, per hari, log · FR-15 cetak
   FR-16 ekspor CSV. Filter: rentang tanggal daftar + jalur (TC-19).
   URL: ?dari=2026-06-08&sampai=2026-06-18&jalur=zonasi
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

  var AWAL = R.JADWAL[0].mulai;          // pendaftaran dibuka
  var AKHIR = R.TANGGAL_SIMULASI;        // "hari ini" simulasi
  var JENIS_LOG = { login: 'Masuk', logout: 'Keluar', tambah: 'Tambah', ubah: 'Ubah', hapus: 'Hapus', verifikasi: 'Verifikasi', reset: 'Reset', impor: 'Impor', ekspor: 'Ekspor' };

  var inputDari = $('#dari');
  var inputSampai = $('#sampai');
  var selJalur = $('#filter-jalur');
  var st = { dari: AWAL, sampai: AKHIR, jalur: '' };
  var data = null;   // hasil hitung terakhir (dipakai CSV)

  /* =================================================================
     1. Filter + validasi rentang (TC-19)
     ================================================================= */
  function tampilkanError(nama, pesan) {
    var w = $('[data-field="' + nama + '"]');
    w.classList.toggle('field--error', !!pesan);
    $('#' + nama + '-error').textContent = pesan || '';
    $('#' + nama).setAttribute('aria-invalid', String(!!pesan));
  }

  function validasi() {
    var dari = inputDari.value;
    var sampai = inputSampai.value;
    var errDari = !R.parseTanggal(dari) ? 'Isi tanggal awal.' : (dari < AWAL || dari > AKHIR ? 'Pilih tanggal ' + U.tanggal(AWAL) + ' – ' + U.tanggal(AKHIR) + '.' : '');
    var errSampai = !R.parseTanggal(sampai) ? 'Isi tanggal akhir.' : (sampai < AWAL || sampai > AKHIR ? 'Pilih tanggal ' + U.tanggal(AWAL) + ' – ' + U.tanggal(AKHIR) + '.' : '');
    if (!errDari && !errSampai && dari > sampai) errSampai = 'Tanggal akhir tidak boleh sebelum tanggal awal.';
    tampilkanError('dari', errDari);
    tampilkanError('sampai', errSampai);
    return !errDari && !errSampai;
  }

  function terapkan() {
    if (!validasi()) return;   // rekap lama tetap tampil sampai rentang benar
    st.dari = inputDari.value;
    st.sampai = inputSampai.value;
    st.jalur = selJalur.value;
    render();
  }

  /* =================================================================
     2. Hitung rekap
     ================================================================= */
  function hitung() {
    var semua = S.semua().filter(function (p) {
      var t = p.tglDaftar.slice(0, 10);
      return t >= st.dari && t <= st.sampai && (!st.jalur || p.jalur === st.jalur);
    });

    var jalur = R.JALUR.filter(function (j) { return !st.jalur || j.kode === st.jalur; }).map(function (j) {
      var r = { jalur: j, kuota: j.kuota, pendaftar: 0, menunggu: 0, perbaikan: 0, terverifikasi: 0, ditolak: 0 };
      semua.forEach(function (p) { if (p.jalur === j.kode) { r.pendaftar += 1; r[p.status] += 1; } });
      return r;
    });
    var total = jalur.reduce(function (t, r) {
      ['kuota', 'pendaftar', 'menunggu', 'perbaikan', 'terverifikasi', 'ditolak'].forEach(function (k) { t[k] += r[k]; });
      return t;
    }, { kuota: 0, pendaftar: 0, menunggu: 0, perbaikan: 0, terverifikasi: 0, ditolak: 0 });

    var perSekolah = {};
    semua.forEach(function (p) {
      var s = perSekolah[p.sekolahAsal] || (perSekolah[p.sekolahAsal] = { kode: p.sekolahAsal, pendaftar: 0, terverifikasi: 0 });
      s.pendaftar += 1;
      if (p.status === 'terverifikasi') s.terverifikasi += 1;
    });
    var sekolah = Object.keys(perSekolah).map(function (k) { return perSekolah[k]; })
      .sort(function (a, b) { return b.pendaftar - a.pendaftar || b.terverifikasi - a.terverifikasi || (a.kode < b.kode ? -1 : 1); })
      .slice(0, 10);

    var harian = [];
    var kumulatif = 0;
    for (var d = R.parseTanggal(st.dari); d <= R.parseTanggal(st.sampai); d.setDate(d.getDate() + 1)) {
      var iso = R.isoTanggal(d);
      var n = semua.filter(function (p) { return p.tglDaftar.slice(0, 10) === iso; }).length;
      kumulatif += n;
      harian.push({ tanggal: iso, n: n, kumulatif: kumulatif });
    }

    var log = S.log().filter(function (l) {
      var t = l.waktu.slice(0, 10);
      return t >= st.dari && t <= st.sampai;
    });
    return { jalur: jalur, total: total, sekolah: sekolah, harian: harian, log: log };
  }

  /* =================================================================
     3. Render
     ================================================================= */
  function sel(teks, num, label) {
    return el('td', { className: num ? 'table__num' : '', text: teks, attrs: label ? { 'data-label': label } : null });
  }

  function barisJalur(r, total) {
    var ketat = r.kuota ? U.desimal(r.terverifikasi / r.kuota) + '×' : '–';
    var nama = total ? 'Total' : r.jalur.nama;
    return el('tr', { className: total ? 'report-table__total' : '' }, [
      total ? el('th', { className: 'table__cell--full', text: nama, attrs: { scope: 'row' } }) : el('td', { className: 'table__cell--full' }, [el('span', { className: 'table__primary', text: nama })]),
      sel(U.angka(r.kuota), true, 'Kuota'),
      sel(U.angka(r.pendaftar), true, 'Pendaftar'),
      sel(U.angka(r.menunggu), true, 'Menunggu'),
      sel(U.angka(r.perbaikan), true, 'Perlu perbaikan'),
      sel(U.angka(r.terverifikasi), true, 'Terverifikasi'),
      sel(U.angka(r.ditolak), true, 'Ditolak'),
      sel(total ? '–' : ketat, true, 'Keketatan')
    ]);
  }

  function isiTabel(host, baris, kosong, kolom) {
    U.kosongkan(host);
    if (!baris.length) {
      host.appendChild(el('tr', null, [el('td', { className: 'report-table__empty', text: kosong, attrs: { colspan: String(kolom) } })]));
      return;
    }
    baris.forEach(function (b) { host.appendChild(b); });
  }

  function render() {
    data = hitung();
    var j = R.jalur(st.jalur);
    $('[data-periode-teks]').textContent = 'Periode daftar ' + U.tanggal(st.dari) + ' – ' + U.tanggal(st.sampai) +
      ' · ' + (j ? 'jalur ' + j.nama : 'semua jalur') + ' · ' + U.angka(data.total.pendaftar) + ' pendaftar.';

    isiTabel($('[data-rekap-jalur]'), data.jalur.map(function (r) { return barisJalur(r, false); }), '', 8);
    U.kosongkan($('[data-rekap-total]'));
    if (data.jalur.length > 1) $('[data-rekap-total]').appendChild(barisJalur(data.total, true));

    isiTabel($('[data-rekap-sekolah]'), data.sekolah.map(function (s, i) {
      var sk = R.sekolahAsal(s.kode);
      return el('tr', null, [sel(String(i + 1), true), sel(sk ? sk.nama : s.kode), sel(U.angka(s.pendaftar), true), sel(U.angka(s.terverifikasi), true)]);
    }), 'Tidak ada pendaftar pada periode ini.', 4);

    isiTabel($('[data-rekap-harian]'), data.harian.map(function (h) {
      return el('tr', null, [sel(U.tanggal(h.tanggal)), sel(U.angka(h.n), true), sel(U.angka(h.kumulatif), true)]);
    }), '', 3);

    $('[data-log-info]').textContent = U.angka(data.log.length) + ' entri pada periode ini (aplikasi menyimpan 100 entri terbaru).';
    isiTabel($('[data-log]'), data.log.map(function (l) {
      return el('tr', null, [sel(U.tanggalWaktu(l.waktu)), sel(JENIS_LOG[l.tipe] || l.tipe), sel(l.pesan)]);
    }), 'Tidak ada aktivitas pada periode ini.', 3);

    var p = new URLSearchParams();
    if (st.dari !== AWAL) p.set('dari', st.dari);
    if (st.sampai !== AKHIR) p.set('sampai', st.sampai);
    if (st.jalur) p.set('jalur', st.jalur);
    var qs = p.toString();
    window.history.replaceState(null, '', window.location.pathname + (qs ? '?' + qs : ''));
  }

  /* =================================================================
     4. Ekspor CSV & cetak (FR-15, FR-16)
     ================================================================= */
  function eksporCsv() {
    var b = [['Rekap PPDB ' + R.SEKOLAH.nama + ' (fiktif)'], ['Periode daftar', st.dari, st.sampai], ['Jalur', st.jalur ? R.jalur(st.jalur).nama : 'Semua jalur'], [],
      ['Rekap per jalur'], ['Jalur', 'Kuota', 'Pendaftar', 'Menunggu', 'Perlu perbaikan', 'Terverifikasi', 'Ditolak', 'Keketatan']];
    data.jalur.forEach(function (r) {
      b.push([r.jalur.nama, r.kuota, r.pendaftar, r.menunggu, r.perbaikan, r.terverifikasi, r.ditolak, U.desimal(r.terverifikasi / r.kuota)]);
    });
    if (data.jalur.length > 1) {
      var t = data.total;
      b.push(['Total', t.kuota, t.pendaftar, t.menunggu, t.perbaikan, t.terverifikasi, t.ditolak, '']);
    }
    b.push([], ['10 asal sekolah terbanyak'], ['No.', 'Asal sekolah', 'Pendaftar', 'Terverifikasi']);
    data.sekolah.forEach(function (s, i) { var sk = R.sekolahAsal(s.kode); b.push([i + 1, sk ? sk.nama : s.kode, s.pendaftar, s.terverifikasi]); });
    b.push([], ['Pendaftar per hari'], ['Tanggal', 'Pendaftar', 'Kumulatif']);
    data.harian.forEach(function (h) { b.push([h.tanggal, h.n, h.kumulatif]); });
    U.unduhCsv('rekap-ppdb-' + st.dari + '-sd-' + st.sampai + '.csv', b);
    S.catatLog('ekspor', 'Ekspor CSV rekap ' + st.dari + ' s.d. ' + st.sampai);
    U.snackbar('Rekap diekspor ke CSV.');
  }

  function cetak() {
    var akun = PPDB.auth.panitiaAktif();
    $('[data-tgl-cetak]').textContent = 'Kota Nusantara, ' + U.tanggalPanjang(R.TANGGAL_SIMULASI).replace(/^[^,]+, /, '');
    $('[data-petugas]').textContent = '(' + (akun ? akun.nama : '..............................') + ')';
    window.print();
  }

  /* ---------- Event & mulai ---------- */
  R.JALUR.forEach(function (j) { selJalur.appendChild(el('option', { text: j.nama, attrs: { value: j.kode } })); });
  [inputDari, inputSampai].forEach(function (i) { i.min = AWAL; i.max = AKHIR; });
  $('[data-kop-sekolah]').textContent = R.SEKOLAH.nama + ' (fiktif)';
  $('[data-kop-sub]').textContent = 'Panitia PPDB · Tahun Ajaran ' + R.SEKOLAH.tahunAjaran + ' · ' + R.SEKOLAH.alamat;

  $('[data-filter]').addEventListener('change', terapkan);
  $('[data-filter]').addEventListener('submit', function (e) { e.preventDefault(); terapkan(); });
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-aksi]');
    if (!a) return;
    var aksi = a.getAttribute('data-aksi');
    if (aksi === 'ekspor-csv') eksporCsv();
    if (aksi === 'cetak') cetak();
    if (aksi === 'reset-filter') { inputDari.value = AWAL; inputSampai.value = AKHIR; selJalur.value = ''; terapkan(); }
  });
  window.addEventListener('ppdb:change', render);

  var q = new URLSearchParams(window.location.search);
  inputDari.value = R.parseTanggal(q.get('dari')) ? q.get('dari') : AWAL;
  inputSampai.value = R.parseTanggal(q.get('sampai')) ? q.get('sampai') : AKHIR;
  selJalur.value = R.jalur(q.get('jalur')) ? q.get('jalur') : '';
  if (validasi()) { st.dari = inputDari.value; st.sampai = inputSampai.value; st.jalur = selJalur.value; }
  else { inputDari.value = AWAL; inputSampai.value = AKHIR; validasi(); }
  render();
})(window, document);
