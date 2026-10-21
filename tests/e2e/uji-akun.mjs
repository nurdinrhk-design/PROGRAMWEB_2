// Uji v1.2 (Tahap 15): Akun Orang Tua (panitia), Akun saya (orang tua), rekap per sumber
const AKAR = process.env.AKAR; // diisi jalankan.mjs (akar repo) atau dari luar (situs online)
const hasil = [];
function cek(id, nama, ok, info = '') {
  hasil.push({ ok: !!ok });
  console.log((ok ? 'LULUS ' : 'GAGAL ') + id + ' · ' + nama + (info ? ' → ' + info : ''));
}

export default async function (t) {
  await t.ukuran(1440);
  await t.buka(AKAR + 'index.html');
  await t.js(`localStorage.clear(); sessionStorage.clear(); PPDB.store.reset(); PPDB.auth.login('panitia','ppdb2026',false); true`);

  // Akun Orang Tua (panitia)
  await t.buka(AKAR + 'pages/akun.html');
  const a = await t.js(`(() => { const S = PPDB.store; const akun = S.akunSemua(); const punya = akun.filter(x => S.pendaftarAkun(x.id).length).length;
    return { kpi: [...document.querySelectorAll('.kpi__value')].map(x => x.textContent), harap: [akun.length, punya].map(n => n.toLocaleString('id-ID')),
      baris: document.querySelectorAll('[data-tbody] tr').length, nav: document.querySelector('.nav-item[aria-current=page]').dataset.page,
      bocor: document.body.textContent.includes(PPDB.seed.AKUN_DEMO.sandiHash) || document.body.textContent.includes(PPDB.seed.AKUN_DEMO.salt) }; })()`);
  cek('15.1', 'Halaman Akun Orang Tua: ringkasan dari data, 20 baris, menu aktif, hash tidak tampil', a.kpi[0] === a.harap[0] && a.kpi[1] === a.harap[1] && a.baris === 20 && a.nav === 'akun' && !a.bocor, JSON.stringify(a));
  await t.js(`const c=document.querySelector('#cari'); c.value='orangtua@ppdb'; c.dispatchEvent(new Event('input')); true`);
  await t.tunggu(400);
  const cari = await t.js(`({ n: document.querySelectorAll('[data-tbody] tr').length, anak: [...document.querySelectorAll('.account-children a')].map(x => x.getAttribute('href')), url: location.search })`);
  cek('15.1', 'Cari email akun demo → 2 anak menaut ke Data Pendaftar', cari.n === 1 && cari.anak.join() === 'data-master.html?q=PPDB-2026-0001,data-master.html?q=PPDB-2026-0003' && cari.url === '?q=orangtua%40ppdb', JSON.stringify(cari));
  await t.buka(AKAR + 'pages/akun.html?anak=perbaikan');
  const perb = await t.js(`(() => { const harap = PPDB.store.akunSemua().filter(x => PPDB.store.pendaftarAkun(x.id).some(p => p.status === 'perbaikan')).length;
    return { ring: document.querySelector('[data-ringkasan]').textContent, harap, sel: document.querySelector('#filter-anak').value }; })()`);
  cek('15.1', 'Filter "ada anak perlu perbaikan" dari URL', perb.sel === 'perbaikan' && perb.ring.includes('dari ' + perb.harap + ' akun'), JSON.stringify(perb));
  await t.js(`document.querySelector('[data-hal="1"]').disabled ? true : document.querySelector('[data-hal="1"]').click(); true`);

  // Rekap per sumber
  await t.buka(AKAR + 'pages/laporan.html');
  const rek = await t.js(`(() => { const tot = [...document.querySelector('[data-rekap-total] tr').children].map(c => c.textContent);
    const online = PPDB.store.semua().filter(p => p.sumber === 'online').length;
    return { head: [...document.querySelectorAll('.report-table thead th')].slice(0, 10).map(x => x.textContent).join(','), total: tot[2], online: tot[7], loket: tot[8], harapOnline: online.toLocaleString('id-ID') }; })()`);
  cek('15.3', 'Rekap per jalur memuat Online + Loket = pendaftar', rek.head.includes('Online,Loket,Keketatan') && rek.online === rek.harapOnline &&
    Number(rek.online.replace('.', '')) + Number(rek.loket.replace('.', '')) === Number(rek.total.replace('.', '')), JSON.stringify(rek));

  // Akun saya (orang tua)
  await t.js(`document.querySelector('.nav-drawer [data-action=logout]').click(); true`);
  await t.tunggu(800);
  await t.js(`PPDB.auth.loginPeserta('orangtua@ppdb.test','orangtua2026',false)`);
  await t.buka(AKAR + 'portal/akun.html');
  const pa = await t.js(`({ email: document.querySelector('#email').value, ro: document.querySelector('#email').readOnly, nama: document.querySelector('#nama').value,
    nav: document.querySelector('.portal-nav__item[aria-current=page]')?.dataset.page, menu: !!document.querySelector('#account-menu a[href="akun.html"]') })`);
  cek('15.2', 'Akun saya: email terkunci, nama terisi, menu Akun aktif', pa.email === 'orangtua@ppdb.test' && pa.ro && pa.nama === 'Suryani Saputra' && pa.nav === 'akun' && pa.menu, JSON.stringify(pa));
  const isi = (sel, v) => t.js(`(() => { const e=document.querySelector('${sel}'); e.value=${JSON.stringify(v)}; e.dispatchEvent(new Event('input',{bubbles:true})); return true; })()`);
  await isi('#noHp', '0812'); await t.js(`document.querySelector('[data-form-profil]').requestSubmit(); true`);
  const hpSalah = await t.js(`document.querySelector('#noHp-error').textContent`);
  await isi('#nama', 'Suryani Saputri'); await isi('#noHp', '081377778888');
  await t.js(`document.querySelector('[data-form-profil]').requestSubmit(); true`);
  const prof = await t.js(`({ a: PPDB.auth.pesertaAktif(), bar: document.querySelector('.account__name').textContent, snack: document.querySelector('.snackbar')?.textContent })`);
  cek('15.2', 'Ubah profil: HP salah ditolak, data benar tersimpan & bar ikut berubah', hpSalah.startsWith('Nomor HP') && prof.a.nama === 'Suryani Saputri' && prof.a.noHp === '081377778888' && prof.bar === 'Suryani Saputri' && prof.snack === 'Profil disimpan.', JSON.stringify({ hpSalah, prof }));

  await isi('#sandiLama', 'salah12345'); await isi('#sandiBaru', 'baruSekali1'); await isi('#sandiUlang', 'baruSekali1');
  await t.js(`document.querySelector('[data-form-sandi]').requestSubmit(); true`);
  await t.tunggu(800);
  const lamaSalah = await t.js(`document.querySelector('#sandiLama-error').textContent`);
  await isi('#sandiLama', 'orangtua2026'); await isi('#sandiBaru', 'lemah'); await isi('#sandiUlang', 'lemah');
  await t.js(`document.querySelector('[data-form-sandi]').requestSubmit(); true`);
  const lemah = await t.js(`document.querySelector('#sandiBaru-error').textContent`);
  await isi('#sandiBaru', 'baruSekali1'); await isi('#sandiUlang', 'baruSekali1');
  await t.js(`document.querySelector('[data-form-sandi]').requestSubmit(); true`);
  await t.tunggu(1200);
  const ganti = await t.js(`({ snack: document.querySelector('.snackbar')?.textContent, kosong: document.querySelector('#sandiLama').value === '' })`);
  cek('15.2', 'Ganti sandi: sandi lama salah & sandi lemah ditolak, sandi valid diganti', lamaSalah === 'Kata sandi saat ini salah.' && lemah.includes('8–64') && ganti.snack.startsWith('Kata sandi diganti') && ganti.kosong, JSON.stringify({ lamaSalah, lemah, ganti }));

  // Masuk ulang: sandi lama ditolak, sandi baru diterima
  await t.js(`document.querySelector('.portal [data-action=logout]').click(); true`);
  await t.tunggu(800);
  const masuk = await t.js(`PPDB.auth.loginPeserta('orangtua@ppdb.test','orangtua2026',false).then(r1 => PPDB.auth.loginPeserta('orangtua@ppdb.test','baruSekali1',false).then(r2 => ({ lama: r1.ok, baru: r2.ok })))`);
  cek('15.2', 'Setelah ganti sandi: sandi lama ditolak, sandi baru diterima', !masuk.lama && masuk.baru, JSON.stringify(masuk));

  await t.buka(AKAR + 'index.html');
  await t.js(`PPDB.store.reset(); sessionStorage.clear(); true`);
  const n = hasil.filter((h) => !h.ok).length;
  console.log(`\nRINGKASAN: ${hasil.length - n}/${hasil.length} lulus`);
  if (n) throw new Error(n + ' uji gagal');
}
