const AKAR = process.env.AKAR; // diisi jalankan.mjs (akar repo) atau dari luar (situs online)
export default async function (t) {
  await t.buka(AKAR + 'tests/index.html');
  await t.tunggu(2500);
  console.log(await t.js(`document.querySelector('[data-ringkasan]').textContent`));
  const gagal = await t.js(`[...document.querySelectorAll('[data-hasil] li')].filter(li => /gagal|✗|FAIL/i.test(li.textContent)).map(li => li.textContent)`);
  if (gagal.length) { console.log(gagal.join('\n')); throw new Error('uji inti gagal'); }
}
