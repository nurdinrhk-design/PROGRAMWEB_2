// Regresi ringkas sisi panitia setelah Tahap 14
const AKAR = process.env.AKAR; // diisi jalankan.mjs (akar repo) atau dari luar (situs online)
const hasil = [];
function cek(id, nama, ok, info = '') {
  hasil.push({ ok: !!ok });
  console.log((ok ? 'LULUS ' : 'GAGAL ') + id + ' · ' + nama + (info ? ' → ' + info : ''));
}

export default async function (t) {
  await t.kirim('Page.addScriptToEvaluateOnNewDocument', { source:
    'window.__csp=[];document.addEventListener("securitypolicyviolation",e=>window.__csp.push(e.violatedDirective+" "+e.blockedURI));' });
  await t.ukuran(1440);
  await t.buka(AKAR + 'index.html');
  await t.js(`localStorage.clear(); sessionStorage.clear(); PPDB.store.reset(); true`);

  // TC-03: halaman panitia tanpa sesi → login, tab panitia otomatis
  await t.buka(AKAR + 'pages/data-master.html');
  const tc3 = await t.js(`({ url: location.href.split('/').pop(), peran: document.querySelector('[aria-selected=true][data-peran]').dataset.peran })`);
  cek('TC-03', 'Tanpa sesi → login, tab panitia terpilih', tc3.url.startsWith('index.html?kembali=pages%2Fdata-master.html') && tc3.peran === 'panitia', JSON.stringify(tc3));
  await t.js(`document.querySelector('#username').value='panitia'; document.querySelector('#sandi').value='ppdb2026'; document.querySelector('form').requestSubmit(); true`);
  await t.tunggu(1200);
  cek('TC-01', 'Login panitia → kembali ke halaman asal', (await t.js('location.pathname')).endsWith('pages/data-master.html'));

  // Semua halaman panitia: konsol bersih, tanpa pelanggaran CSP
  for (const h of ['pages/dashboard.html', 'pages/data-master.html', 'pages/form.html', 'pages/verifikasi.html', 'pages/hasil-seleksi.html', 'pages/laporan.html', 'pages/bukti.html?id=pd-0001', 'pages/akun.html']) {
    t.konsol.length = 0;
    await t.buka(AKAR + h);
    await t.tunggu(h.includes('dashboard') ? 2500 : 600);
    const r = await t.js(`({ csp: window.__csp, h1: document.querySelector('h1').textContent })`);
    cek('12.2', 'Halaman panitia bersih: ' + h, r.csp.length === 0 && t.konsol.length === 0, JSON.stringify({ ...r, konsol: t.konsol }));
  }

  // Data Pendaftar: jumlah tab, cari NISN, hapus + urungkan
  await t.buka(AKAR + 'pages/data-master.html');
  const tab = await t.js(`[...document.querySelectorAll('.tab__count')].map(x => x.textContent).join(',')`);
  cek('6.1', 'Jumlah tab status tidak berubah', tab === '900,195,62,595,48', tab);
  const nisn = await t.js(`PPDB.store.semua()[123].nisn`);
  await t.js(`const c=document.querySelector('#cari'); c.value='${nisn}'; c.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter'})); true`);
  cek('TC-06', 'Cari NISN', (await t.js(`document.querySelectorAll('[data-tbody] tr').length`)) === 1);
  const id = await t.js(`document.querySelector('[data-hapus]').dataset.hapus`);
  await t.js(`document.querySelector('[data-hapus]').click(); true`); await t.tunggu(200);
  await t.js(`[...document.querySelectorAll('dialog[open] button')].find(b=>b.textContent==='Hapus').click(); true`); await t.tunggu(200);
  await t.js(`document.querySelector('.snackbar__action').click(); true`);
  const pulih = await t.js(`({ ada: !!PPDB.store.ambil('${id}'), sumber: PPDB.store.ambil('${id}').sumber })`);
  cek('TC-08', 'Hapus lalu urungkan: data & sumber utuh', pulih.ada && !!pulih.sumber, JSON.stringify(pulih));

  // Verifikasi: keputusan terverifikasi lewat halaman
  await t.buka(AKAR + 'pages/verifikasi.html');
  const vid = await t.js(`new URLSearchParams(location.search).get('id')`);
  const jenis = await t.js(`PPDB.store.ambil('${vid}').berkas.map(b => b.jenis)`);
  for (const j of jenis) await t.js(`document.querySelector('input[name=cek-${j}][value=sesuai]').click(); true`);
  await t.js(`document.querySelector('[data-keputusan=terverifikasi]').click(); true`); await t.tunggu(300);
  cek('8.4', 'Verifikasi terverifikasi tersimpan', (await t.js(`PPDB.store.ambil('${vid}').status`)) === 'terverifikasi');

  // Hasil: garis batas
  await t.buka(AKAR + 'pages/hasil-seleksi.html');
  cek('9.2', 'Garis batas kuota tampil', (await t.js(`document.querySelector('.table__cutoff')?.textContent || ''`)).startsWith('Garis batas kuota (216)'));

  // Form loket: simpan pendaftar dari halaman panitia
  await t.buka(AKAR + 'pages/form.html');
  const f = async (i, v) => t.js(`(() => { const e=document.getElementById('${i}'); e.value=${JSON.stringify(v)}; e.dispatchEvent(new Event('input',{bubbles:true})); e.dispatchEvent(new Event('change',{bubbles:true})); return true; })()`);
  await f('f-nama', 'Pendaftar Loket'); await f('f-nisn', '9555000300'); await t.js(`document.querySelector('input[name=jk][value=P]').click(); true`);
  await f('f-tempatLahir', 'Bogor'); await f('f-tglLahir', '2010-03-03'); await f('f-namaOrtu', 'Ibu Loket'); await f('f-noHp', '081211112222');
  await t.js(`document.querySelector('[data-aksi=lanjut]').click(); true`);
  await f('f-alamat', 'Jl. Mawar No. 1, RT 01/RW 01'); await f('f-kelurahan', 'Harapan Indah'); await f('f-kecamatan', 'Harapan Jaya');
  await f('f-tglTerbitKk', '2015-01-01'); await f('f-jarakMeter', '900'); await t.js(`document.querySelector('input[name=jalur][value=zonasi]').click(); true`);
  await t.js(`document.querySelector('[data-aksi=lanjut]').click(); true`);
  await f('f-sekolahAsal', 'SA-01'); await f('f-tahunLulus', '2026');
  for (const i of [1, 2, 3, 4, 5]) await f('f-smt-' + i, '80');
  await t.js(`document.querySelector('[data-aksi=lanjut]').click(); true`);
  for (const j of ['kk', 'akta', 'rapor']) {
    await t.js(`(() => { const f=new File([new Uint8Array(100*1024)], '${j}.pdf'); const dt=new DataTransfer(); dt.items.add(f);
      const i=document.getElementById('f-berkas-${j}'); i.files=dt.files; i.dispatchEvent(new Event('change',{bubbles:true})); return true; })()`);
  }
  const label = await t.js(`document.querySelector('[data-label-lanjut]').textContent`);
  await t.js(`document.querySelector('[data-aksi=lanjut]').click(); true`); await t.tunggu(1200);
  const lk = await t.js(`(() => { const p = PPDB.store.semua().find(x => x.nisn === '9555000300'); return { url: location.pathname.split('/').pop(), sumber: p && p.sumber, sek: document.querySelector('[data-tbody] .data-table__nama .table__secondary')?.textContent }; })()`);
  cek('TC-14', 'Panitia mendaftarkan di loket → sumber Loket', label === 'Simpan pendaftar' && lk.url === 'data-master.html' && lk.sumber === 'loket' && lk.sek.endsWith('Loket'), JSON.stringify({ label, lk }));

  // Laporan & CSV data pendaftar memuat kolom Sumber
  await t.js(`window.__u=[]; const a=URL.createObjectURL.bind(URL); URL.createObjectURL=b=>{window.__u.push(b); return a(b);}; HTMLAnchorElement.prototype.click=function(){}; true`);
  await t.js(`document.querySelector('[data-aksi=ekspor-csv]').click(); true`);
  const csv = await t.js(`window.__u[0].text().then(s => s.replace(/^\\uFEFF/, '').split('\\r\\n')[0])`);
  cek('TC-21', 'CSV memuat kolom Sumber', csv.endsWith(';Status Verifikasi;Sumber'), csv);

  // Logout panitia
  await t.js(`document.querySelector('.nav-drawer [data-action=logout]').click(); true`); await t.tunggu(800);
  const keluar = await t.js(`({ url: location.href.split('/').pop(), sesi: sessionStorage.getItem('ppdb.v2.session') })`);
  cek('TC-23', 'Logout panitia', keluar.url === 'index.html?keluar=1' && !keluar.sesi, JSON.stringify(keluar));

  // Halaman publik: login & buat akun bersih
  for (const h of ['index.html', 'daftar.html', '404.html']) {
    t.konsol.length = 0;
    await t.buka(AKAR + h); await t.tunggu(500);
    const r = await t.js(`window.__csp`);
    cek('12.2', 'Halaman publik bersih: ' + h, r.length === 0 && t.konsol.length === 0, JSON.stringify({ r, k: t.konsol }));
  }
  await t.buka(AKAR + 'index.html'); await t.js(`PPDB.store.reset(); true`);

  const n = hasil.filter((h) => !h.ok).length;
  console.log(`\nRINGKASAN: ${hasil.length - n}/${hasil.length} lulus`);
  if (n) throw new Error(n + ' uji gagal');
}
