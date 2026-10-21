// Uji tampilan (tidak ikut dijalankan otomatis): HALAMAN=a,b LEBAR=360,600 FOTO=360 PERAN=peserta|panitia node tests/e2e/jalankan.mjs tests/e2e/uji-visual.mjs
const AKAR = process.env.AKAR; // diisi jalankan.mjs (akar repo) atau dari luar (situs online)
export default async function (t) {
  await t.buka(AKAR + 'index.html');
  await t.js(`localStorage.clear(); sessionStorage.clear(); PPDB.store.reset(); true`);
  if (process.env.PERAN === 'peserta') { await t.js(`PPDB.auth.loginPeserta('orangtua@ppdb.test','orangtua2026',false)`); }
  if (process.env.PERAN === 'panitia') { await t.js(`PPDB.auth.login('panitia','ppdb2026',false); true`); }
  const foto = (process.env.FOTO || '').split(',');
  for (const h of process.env.HALAMAN.split(',')) {
    for (const w of (process.env.LEBAR || '360,600,840,1200,1440').split(',')) {
      await t.ukuran(Number(w), 900);
      await t.buka(AKAR + h);
      await t.tunggu(600);
      const r = await t.js(`(() => { const lewat=[...document.querySelectorAll('body *')].filter(e => e.getBoundingClientRect().right > innerWidth + 1 && !e.closest('.tabs, .table-wrap')).slice(0,4).map(e=>e.tagName+'.'+e.className);
        const potong=[...document.querySelectorAll('.btn, .tab, .badge, .chip, .card__title, .field__label, h1, h3, .portal-nav__item, .segmented__item')].filter(e=>e.offsetParent && e.scrollWidth>e.clientWidth+1 && !e.closest('.tabs')).map(e=>e.textContent.trim().slice(0,20));
        return JSON.stringify({ w: innerWidth, scrollH: document.documentElement.scrollWidth > innerWidth, lewat, potong }); })()`);
      console.log(h, r);
      if (foto.includes(w)) await t.foto(h.replace(/[^a-z]/g, '-') + w, Number(w) < 600);
    }
  }
}
