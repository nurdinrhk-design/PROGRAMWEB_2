// Uji Tahap 16: pengumuman hasil & daftar ulang
const AKAR = process.env.AKAR; // diisi jalankan.mjs (akar repo) atau dari luar (situs online)
const hasil = [];
function cek(id, nama, ok, info = '') {
  hasil.push({ ok: !!ok });
  console.log((ok ? 'LULUS ' : 'GAGAL ') + id + ' · ' + nama + (info ? ' → ' + info : ''));
}

export default async function (t) {
  await t.ukuran(1440);
  await t.buka(AKAR + 'index.html');
  await t.js(`localStorage.clear(); sessionStorage.clear(); PPDB.store.reset(); true`);

  // Sebelum diumumkan: orang tua melihat status biasa
  await t.js(`PPDB.auth.loginPeserta('orangtua@ppdb.test','orangtua2026',false)`);
  await t.buka(AKAR + 'portal/beranda.html');
  const sebelum = await t.js(`({ badge: [...document.querySelectorAll('.child .badge')].map(b => b.textContent), info: document.querySelector('[data-info-jadwal-teks]').textContent })`);
  cek('16.3', 'Sebelum pengumuman: status verifikasi biasa, info jadwal pengumuman', sebelum.badge.join() === 'Perlu perbaikan,Terverifikasi' && sebelum.info.includes('Pengumuman hasil'), JSON.stringify(sebelum));

  // Panitia mengumumkan
  await t.js(`localStorage.removeItem('ppdb.v2.session'); sessionStorage.clear(); PPDB.auth.login('panitia','ppdb2026',false); true`);
  await t.buka(AKAR + 'pages/hasil-seleksi.html');
  const harap = await t.js(`PPDB.rules.JALUR.reduce((n, j) => n + PPDB.rules.peringkat(PPDB.store.semua(), j.kode).daftar.filter(b => b.status === 'masuk').length, 0)`);
  const awal = await t.js(`({ umum: !document.querySelector('[data-aksi=umumkan]').hidden, batal: document.querySelector('[data-aksi=batalkan]').hidden, filled: document.querySelectorAll('.btn--filled:not([hidden])').length })`);
  await t.js(`document.querySelector('[data-aksi=umumkan]').click(); true`); await t.tunggu(200);
  const dlg = await t.js(`document.querySelector('dialog[open] .dialog__body').textContent`);
  await t.js(`[...document.querySelectorAll('dialog[open] button')].find(b => b.textContent === 'Umumkan').click(); true`); await t.tunggu(300);
  const sesudah = await t.js(`(() => { const u = PPDB.store.pengumuman(); const h = Object.values(u.hasil);
    return { diterima: h.filter(x => x.status === 'diterima').length, total: h.length, catatan: document.querySelector('[data-catatan-sementara]').textContent,
      umum: document.querySelector('[data-aksi=umumkan]').hidden, batal: !document.querySelector('[data-aksi=batalkan]').hidden, log: PPDB.store.log(1)[0].pesan,
      alasan: [...new Set(h.filter(x => x.status === 'tidak').map(x => x.alasan))].sort().join() }; })()`);
  cek('16.1', 'Umumkan: konfirmasi menyebut jumlah, hasil = peringkat masuk kuota, semua pendaftar dapat hasil', awal.umum && awal.batal && awal.filled === 1 && dlg.includes(harap + ' pendaftar diterima') &&
    sesudah.diterima === harap && sesudah.total === 900 && sesudah.umum && sesudah.batal && sesudah.catatan.startsWith('Hasil diumumkan') && sesudah.log.startsWith('Hasil seleksi diumumkan') && sesudah.alasan === 'belum,ditolak,kuota', JSON.stringify({ harap, sesudah }));

  // Verifikasi dikunci
  await t.buka(AKAR + 'pages/verifikasi.html');
  const kunci = await t.js(`({ t: document.querySelector('[data-keputusan=terverifikasi]').disabled, p: document.querySelector('[data-keputusan=perbaikan]').disabled, d: document.querySelector('[data-keputusan=ditolak]').disabled,
    teks: document.querySelector('[data-syarat-verif]').textContent, store: PPDB.store.verifikasi(PPDB.store.semua().find(p => p.status === 'menunggu').id, { keputusan: 'perbaikan', catatan: 'Uji kunci pengumuman' }).ok })`);
  cek('16.2', 'Setelah diumumkan: tombol keputusan & store menolak verifikasi', kunci.t && kunci.p && kunci.d && kunci.teks.startsWith('Hasil seleksi sudah diumumkan') && kunci.store === false, JSON.stringify(kunci));

  // Dashboard
  await t.buka(AKAR + 'pages/dashboard.html');
  const dash = await t.js(`document.querySelectorAll('.kpi__meta')[3].textContent`);
  cek('16.4', 'Dashboard menampilkan jumlah diterima & daftar ulang', dash.includes(harap.toLocaleString('id-ID') + ' diterima · 0 daftar ulang'), dash);

  // Orang tua melihat hasil
  await t.js(`localStorage.removeItem('ppdb.v2.session'); sessionStorage.clear(); true`);
  await t.js(`PPDB.auth.loginPeserta('orangtua@ppdb.test','orangtua2026',false)`);
  await t.buka(AKAR + 'portal/beranda.html');
  const ortu = await t.js(`(() => { const k = id => document.querySelector('[data-id="' + id + '"]');
    return { b1: k('pd-0001').querySelector('.badge').textContent, t1: k('pd-0001').querySelector('.alert').textContent, ubah1: !!k('pd-0001').querySelector('a[href^="form.html"]'),
      b3: k('pd-0003').querySelector('.badge').textContent, t3: k('pd-0003').querySelector('.alert').textContent, tombol: !!k('pd-0003').querySelector('button'),
      daftar: [...document.querySelectorAll('a[href="form.html"]')].every(a => a.hidden), info: document.querySelector('[data-info-jadwal-teks]').textContent }; })()`);
  cek('16.3', 'Orang tua: anak perbaikan → tidak diterima (belum terverifikasi); anak masuk kuota → diterima + tombol daftar ulang; tidak bisa ubah/daftar', ortu.b1 === 'Tidak diterima' && ortu.t1.includes('Berkas belum terverifikasi') && !ortu.ubah1 &&
    ortu.b3 === 'Diterima' && ortu.t3.includes('Selamat') && ortu.tombol && ortu.daftar && ortu.info.startsWith('Hasil seleksi sudah diumumkan'), JSON.stringify(ortu));
  await t.buka(AKAR + 'portal/form.html?id=pd-0001');
  const formTutup = await t.js(`document.querySelector('[data-tidak-judul]').textContent`);
  cek('16.2', 'Form orang tua tertutup setelah pengumuman', formTutup === 'Hasil seleksi sudah diumumkan', formTutup);

  // Konfirmasi daftar ulang
  await t.buka(AKAR + 'portal/beranda.html');
  await t.js(`document.querySelector('[data-id="pd-0003"] button').click(); true`); await t.tunggu(200);
  await t.js(`[...document.querySelectorAll('dialog[open] button')].find(b => b.textContent === 'Konfirmasi').click(); true`); await t.tunggu(300);
  const du = await t.js(`({ h: PPDB.store.hasilPendaftar('pd-0003').daftarUlang, teks: document.querySelector('[data-id="pd-0003"] .alert').textContent, tombol: !!document.querySelector('[data-id="pd-0003"] button'),
    lain: PPDB.store.konfirmasiDaftarUlang('pd-0002', PPDB.auth.pesertaAktif().id).ok, tidakDiterima: PPDB.store.konfirmasiDaftarUlang('pd-0001', PPDB.auth.pesertaAktif().id).ok })`);
  cek('16.3', 'Daftar ulang tercatat; anak lain & anak tidak diterima ditolak', !!du.h && du.teks.includes('Daftar ulang sudah dikonfirmasi') && !du.tombol && !du.lain && !du.tidakDiterima, JSON.stringify(du));
  await t.buka(AKAR + 'portal/bukti.html?id=pd-0003');
  const bukti = await t.js(`[...document.querySelectorAll('[data-seleksi] dt')].map(dt => dt.textContent + ': ' + dt.nextElementSibling.textContent).find(x => x.startsWith('Hasil seleksi'))`);
  cek('16.3', 'Bukti pendaftaran memuat hasil & daftar ulang', /Hasil seleksi: Diterima · peringkat \d+ dari kuota 130 · daftar ulang/.test(bukti || ''), bukti);

  // Panitia membatalkan → kembali normal
  await t.js(`localStorage.removeItem('ppdb.v2.session'); sessionStorage.clear(); PPDB.auth.login('panitia','ppdb2026',false); true`);
  await t.buka(AKAR + 'pages/hasil-seleksi.html');
  const ringkas = await t.js(`document.querySelector('[data-catatan-sementara]').textContent`);
  await t.js(`document.querySelector('[data-aksi=batalkan]').click(); true`); await t.tunggu(200);
  await t.js(`[...document.querySelectorAll('dialog[open] button')].find(b => b.textContent === 'Batalkan pengumuman').click(); true`); await t.tunggu(300);
  const batal = await t.js(`({ u: PPDB.store.pengumuman(), umum: !document.querySelector('[data-aksi=umumkan]').hidden, ok: PPDB.store.verifikasi(PPDB.store.semua().find(p => p.status === 'menunggu').id, { keputusan: 'perbaikan', catatan: 'Uji setelah batal' }).ok })`);
  cek('16.1', 'Ringkasan memuat jumlah daftar ulang; batalkan → verifikasi dibuka lagi', ringkas.includes('1 sudah daftar ulang') && batal.u === null && batal.umum && batal.ok, JSON.stringify({ ringkas, batal }));

  await t.js(`PPDB.store.reset(); sessionStorage.clear(); true`);
  const n = hasil.filter((h) => !h.ok).length;
  console.log(`\nRINGKASAN: ${hasil.length - n}/${hasil.length} lulus`);
  if (n) throw new Error(n + ' uji gagal');
}
