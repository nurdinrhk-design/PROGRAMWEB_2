// Uji Tahap 14 — dua peran: orang tua (portal) & panitia
const AKAR = process.env.AKAR; // diisi jalankan.mjs (akar repo) atau dari luar (situs online)
const hasil = [];
function cek(id, nama, ok, info = '') {
  hasil.push({ ok: !!ok });
  console.log((ok ? 'LULUS ' : 'GAGAL ') + id + ' · ' + nama + (info ? ' → ' + info : ''));
}

export default async function (t) {
  await t.ukuran(1280);
  await t.buka(AKAR + 'index.html');
  await t.js(`localStorage.clear(); sessionStorage.clear(); PPDB.store.reset(); true`);
  await t.buka(AKAR + 'index.html');

  // Login: peran default orang tua
  const awal = await t.js(`({ peran: document.querySelector('[aria-selected=true][data-peran]').dataset.peran, label: document.querySelector('[data-label-id]').textContent,
    tipe: document.querySelector('#username').type, daftar: !document.querySelector('[data-tautan-daftar]').hidden })`);
  cek('14.1', 'Halaman masuk: default orang tua, kolom email, tautan buat akun', awal.peran === 'peserta' && awal.label === 'Email' && awal.tipe === 'email' && awal.daftar, JSON.stringify(awal));

  // Akun demo orang tua
  await t.js(`document.querySelector('[data-isi-demo]').click(); document.querySelector('form').requestSubmit(); true`);
  await t.tunggu(1500);
  const demo = await t.js(`({ url: location.pathname.split('/').slice(-2).join('/'), sapa: document.querySelector('[data-sapaan]')?.textContent,
    anak: [...document.querySelectorAll('.child')].map(c => c.dataset.id + ':' + c.querySelector('.badge').textContent),
    judul: document.querySelector('[data-judul-anak]')?.textContent, nav: document.querySelector('.portal-nav__item[aria-current=page]')?.dataset.page,
    akun: document.querySelector('.account__name').textContent, perbaiki: !!document.querySelector('a[href="form.html?id=pd-0001"]'),
    catatan: document.querySelector('.child .alert--warning')?.textContent })`);
  cek('14.3', 'Login orang tua → beranda portal dengan 2 anak miliknya', demo.url === 'portal/beranda.html' && demo.anak.join() === 'pd-0001:Perlu perbaikan,pd-0003:Terverifikasi' && demo.judul === 'Anak yang didaftarkan (2 dari 3)' && demo.nav === 'beranda' && demo.perbaiki, JSON.stringify(demo));
  cek('14.3', 'Catatan perbaikan dari panitia tampil', /Perlu perbaikan/.test(demo.catatan || ''), demo.catatan);

  // Pembatasan akses: orang tua tidak bisa membuka halaman panitia & data anak lain
  await t.buka(AKAR + 'pages/data-master.html');
  const tolakAdmin = await t.js(`location.pathname.split('/').slice(-2).join('/')`);
  await t.buka(AKAR + 'portal/bukti.html?id=pd-0002');
  const buktiLain = await t.js(`({ kosong: !document.querySelector('[data-tidak-ditemukan]').hidden, lembar: document.querySelector('[data-lembar]').hidden })`);
  await t.buka(AKAR + 'portal/form.html?id=pd-0002');
  const formLain = await t.js(`!document.querySelector('[data-tidak-ditemukan]').hidden`);
  await t.buka(AKAR + 'portal/form.html?id=pd-0003');
  const terkunci = await t.js(`document.querySelector('[data-tidak-judul]').textContent`);
  cek('14.6', 'Orang tua tidak bisa membuka halaman panitia, bukti/form anak lain, atau mengubah data terverifikasi',
    tolakAdmin === 'portal/beranda.html' && buktiLain.kosong && buktiLain.lembar && formLain && terkunci === 'Data pendaftaran sudah diputuskan panitia', JSON.stringify({ tolakAdmin, buktiLain, formLain, terkunci }));
  await t.buka(AKAR + 'portal/bukti.html?id=pd-0003');
  const buktiSendiri = await t.js(`document.querySelector('[data-no-daftar]').textContent`);
  cek('14.3', 'Bukti pendaftaran anak sendiri bisa dibuka', buktiSendiri === 'No. PPDB-2026-0003', buktiSendiri);

  // Perbaikan: berkas "tidak sesuai" wajib diganti, lalu kirim ulang → Menunggu
  await t.buka(AKAR + 'portal/form.html?id=pd-0001');
  const pf = await t.js(`({ judul: document.querySelector('h1').textContent, catatan: document.querySelector('[data-peringatan-judul]').textContent })`);
  await t.js(`document.querySelector('[data-ke="3"]').click(); true`);
  const jenis = await t.js(`PPDB.store.ambil('pd-0001').berkas.filter(b => b.hasilCek === 'tidak_sesuai').map(b => b.jenis)`);
  const tanda = await t.js(`document.querySelector('.upload__check--tidak_sesuai')?.textContent`);
  await t.js(`document.querySelector('[data-aksi=lanjut]').click(); true`);
  const blokir = await t.js(`({ label: document.querySelector('[data-label-lanjut]').textContent, err: document.querySelector('#f-berkas-${jenis[0]}-error').textContent, status: PPDB.store.ambil('pd-0001').status })`);
  cek('14.4', 'Kirim perbaikan tanpa mengganti berkas tidak sesuai → ditolak', pf.judul === 'Perbaiki Pendaftaran' && pf.catatan.startsWith('Catatan panitia:') && tanda && blokir.label === 'Kirim perbaikan' && blokir.err.includes('tidak sesuai') && blokir.status === 'perbaikan', JSON.stringify({ pf, jenis, tanda, blokir }));
  await t.js(`(() => { const f=new File([new Uint8Array(200*1024)], 'perbaikan.pdf'); const dt=new DataTransfer(); dt.items.add(f);
    const i=document.getElementById('f-berkas-${jenis[0]}'); i.files=dt.files; i.dispatchEvent(new Event('change',{bubbles:true})); return true; })()`);
  await t.js(`document.querySelector('[data-aksi=lanjut]').click(); true`);
  await t.tunggu(1200);
  const kirim = await t.js(`({ url: location.pathname.split('/').pop(), status: PPDB.store.ambil('pd-0001').status, snack: document.querySelector('.snackbar')?.textContent,
    badge: document.querySelector('[data-id="pd-0001"] .badge').textContent, antre: document.querySelector('[data-id="pd-0001"] .alert--info')?.textContent,
    lainSesuai: PPDB.store.ambil('pd-0001').berkas.filter(b => b.jenis !== '${jenis[0]}').every(b => b.hasilCek === 'sesuai'), log: PPDB.store.log(1)[0].pesan })`);
  cek('14.4', 'Perbaikan terkirim → status Menunggu, berkas lain tetap "sesuai", posisi antrean tampil, log', kirim.url === 'beranda.html' && kirim.status === 'menunggu' && kirim.badge === 'Menunggu' && /Urutan ke-\d+/.test(kirim.antre) && kirim.lainSesuai && kirim.log.startsWith('Perbaikan dikirim ulang'), JSON.stringify(kirim));
  await t.js(`document.querySelector('[data-action=logout]').click(); true`);
  await t.tunggu(800);
  const keluar = await t.js(`({ url: location.href.split('/').pop(), peran: document.querySelector('[aria-selected=true][data-peran]').dataset.peran })`);
  cek('14.1', 'Keluar → halaman masuk dengan tab orang tua', keluar.url === 'index.html?keluar=1&peran=peserta' && keluar.peran === 'peserta', JSON.stringify(keluar));

  // Buat akun baru
  await t.buka(AKAR + 'daftar.html');
  await t.js(`document.querySelector('form').requestSubmit(); true`);
  const kosong = await t.js(`[...document.querySelectorAll('.field--error')].length`);
  const isi = (id, v) => t.js(`(() => { const e=document.getElementById('${id}'); e.value=${JSON.stringify(v)}; e.dispatchEvent(new Event('input',{bubbles:true})); return true; })()`);
  await isi('nama', 'Bambang Sutrisno'); await isi('email', 'orangtua@ppdb.test'); await isi('noHp', '081298765432'); await isi('sandi', 'abcdefgh'); await isi('sandi2', 'beda1234');
  await t.js(`document.querySelector('form').requestSubmit(); true`);
  const salah = await t.js(`({ email: document.querySelector('#email-error').textContent, sandi: document.querySelector('#sandi-error').textContent, sandi2: document.querySelector('#sandi2-error').textContent })`);
  cek('14.2', 'Validasi buat akun: wajib, email dipakai, sandi lemah, sandi tidak sama', kosong === 5 && salah.email.includes('sudah terdaftar') && salah.sandi.includes('huruf dan angka') && salah.sandi2 === 'Kata sandi tidak sama.', JSON.stringify({ kosong, salah }));
  await isi('email', 'Bambang.Baru@Contoh.test'); await isi('sandi', 'rahasia123'); await isi('sandi2', 'rahasia123');
  await t.js(`document.querySelector('form').requestSubmit(); true`);
  await t.tunggu(1500);
  const baru = await t.js(`(() => { const a = PPDB.store.akunEmail('bambang.baru@contoh.test');
    return { url: location.pathname.split('/').slice(-2).join('/'), snack: document.querySelector('.snackbar')?.textContent, kosong: !document.querySelector('[data-kosong]').hidden,
      tersimpanPolos: JSON.stringify(a).includes('rahasia123'), hash: a && a.sandiHash.length, email: a && a.email }; })()`);
  cek('14.2', 'Akun dibuat (email huruf kecil), sandi hanya disimpan sebagai hash, langsung masuk portal kosong', baru.url === 'portal/beranda.html' && baru.kosong && !baru.tersimpanPolos && baru.hash === 44 && baru.email === 'bambang.baru@contoh.test' && /Akun berhasil dibuat/.test(baru.snack || ''), JSON.stringify(baru));

  // Daftarkan anak dari portal (data orang tua terisi dari akun)
  await t.buka(AKAR + 'portal/form.html');
  const pre = await t.js(`({ ortu: document.getElementById('f-namaOrtu').value, hp: document.getElementById('f-noHp').value, judul: document.querySelector('h1').textContent })`);
  const f = async (id, v) => t.js(`(() => { const e=document.getElementById('${id}'); e.value=${JSON.stringify(v)}; e.dispatchEvent(new Event('input',{bubbles:true})); e.dispatchEvent(new Event('change',{bubbles:true})); return true; })()`);
  await f('f-nama', 'Galih Sutrisno'); await f('f-nisn', '9555000111'); await t.js(`document.querySelector('input[name=jk][value=L]').click(); true`);
  await f('f-tempatLahir', 'Bandung'); await f('f-tglLahir', '2010-08-17');
  await t.js(`document.querySelector('[data-aksi=lanjut]').click(); true`);
  await f('f-alamat', 'Jl. Kenari No. 7, RT 02/RW 03'); await f('f-kelurahan', 'Harapan Indah'); await f('f-kecamatan', 'Harapan Jaya');
  await f('f-tglTerbitKk', '2018-02-01'); await f('f-jarakMeter', '650'); await t.js(`document.querySelector('input[name=jalur][value=zonasi]').click(); true`);
  await t.js(`document.querySelector('[data-aksi=lanjut]').click(); true`);
  await f('f-sekolahAsal', 'SA-02'); await f('f-tahunLulus', '2026');
  for (const [i, v] of [[1, '85'], [2, '86'], [3, '87'], [4, '88'], [5, '89']]) await f('f-smt-' + i, v);
  await t.js(`document.querySelector('[data-aksi=lanjut]').click(); true`);
  for (const j of ['kk', 'akta', 'rapor']) {
    await t.js(`(() => { const f=new File([new Uint8Array(150*1024)], '${j}.pdf'); const dt=new DataTransfer(); dt.items.add(f);
      const i=document.getElementById('f-berkas-${j}'); i.files=dt.files; i.dispatchEvent(new Event('change',{bubbles:true})); return true; })()`);
  }
  const label = await t.js(`document.querySelector('[data-label-lanjut]').textContent`);
  await t.js(`document.querySelector('[data-aksi=lanjut]').click(); true`);
  await t.tunggu(1200);
  const daftar = await t.js(`(() => { const p = PPDB.store.semua().find(x => x.nisn === '9555000111'); const a = PPDB.store.akunEmail('bambang.baru@contoh.test');
    return { url: location.pathname.split('/').pop(), sumber: p.sumber, milik: p.akunId === a.id, status: p.status, ortu: p.namaOrtu, kartu: document.querySelectorAll('.child').length,
      no: p.noDaftar, snack: document.querySelector('.snackbar')?.textContent }; })()`);
  cek('14.3', 'Orang tua mendaftarkan anak → sumber online, milik akun, masuk antrean', pre.ortu === 'Bambang Sutrisno' && pre.hp === '081298765432' && pre.judul === 'Daftarkan Anak' && label === 'Kirim pendaftaran' &&
    daftar.url === 'beranda.html' && daftar.sumber === 'online' && daftar.milik && daftar.status === 'menunggu' && daftar.kartu === 1 && daftar.no === 'PPDB-2026-0901', JSON.stringify({ pre, label, daftar }));

  // Batas 3 anak per akun
  await t.js(`(() => { const a = PPDB.store.akunEmail('bambang.baru@contoh.test');
    PPDB.store.tambah({ nama: 'Anak Kedua', nisn: '9555000112', jalur: 'zonasi' }, { akunId: a.id });
    PPDB.store.tambah({ nama: 'Anak Ketiga', nisn: '9555000113', jalur: 'zonasi' }, { akunId: a.id });
    window.__keempat = PPDB.store.tambah({ nama: 'Anak Keempat', nisn: '9555000114', jalur: 'zonasi' }, { akunId: a.id }); return true; })()`);
  await t.buka(AKAR + 'portal/beranda.html');
  const penuh = await t.js(`({ keempat: window.__keempat, tombol: [...document.querySelectorAll('a[href="form.html"]')].every(a => a.hidden), info: document.querySelector('[data-info-jadwal-teks]').textContent })`);
  await t.buka(AKAR + 'portal/form.html');
  const formPenuh = await t.js(`document.querySelector('[data-tidak-judul]').textContent`);
  cek('14.3', 'Batas 3 anak: tombol disembunyikan, form & store menolak anak ke-4', penuh.tombol && penuh.info.includes('batas maksimal') && formPenuh.startsWith('Batas 3 anak') && penuh.keempat === undefined, JSON.stringify({ penuh, formPenuh }));
  await t.js(`document.querySelector('[data-action=logout]').click(); true`);
  await t.tunggu(800);

  // Login orang tua: sandi salah
  await t.js(`document.querySelector('#username').value='bambang.baru@contoh.test'; document.querySelector('#sandi').value='salah1234'; document.querySelector('form').requestSubmit(); true`);
  await t.tunggu(800);
  const salahLogin = await t.js(`({ alert: document.querySelector('[data-error-text]').textContent, url: location.pathname.split('/').pop() })`);
  cek('14.1', 'Sandi salah → ditolak', salahLogin.alert === 'Email atau kata sandi salah.' && salahLogin.url === 'index.html', JSON.stringify(salahLogin));

  // Panitia melihat sumber & memverifikasi; orang tua melihat perubahannya
  await t.js(`sessionStorage.removeItem('ppdb.v2.login-gagal'); document.querySelector('#peran-panitia').click();
    document.querySelector('#username').value='panitia'; document.querySelector('#sandi').value='ppdb2026'; document.querySelector('form').requestSubmit(); true`);
  await t.tunggu(1500);
  await t.buka(AKAR + 'pages/data-master.html?sumber=online&q=9555000111');
  const adm = await t.js(`({ baris: document.querySelectorAll('[data-tbody] tr').length, sek: document.querySelector('[data-tbody] .table__secondary:not(.num)')?.textContent,
    chip: [...document.querySelectorAll('.chip__text')].map(c => c.textContent), tab: document.querySelector('#tab-semua .tab__count').textContent })`);
  await t.js(`document.querySelector('[data-detail]').click(); true`);
  await t.tunggu(200);
  const det = await t.js(`[...document.querySelectorAll('dialog[open] p')].map(p => p.textContent).find(x => x.startsWith('Didaftarkan'))`);
  cek('14.5', 'Data Pendaftar: filter & label sumber, detail menyebut akun orang tua', adm.baris === 1 && adm.chip.includes('Sumber: Online') && det.includes('akun Bambang Sutrisno (bambang.baru@contoh.test)'), JSON.stringify({ adm, det }));
  await t.buka(AKAR + 'pages/data-master.html?sumber=loket');
  const loket = await t.js(`({ n: document.querySelector('#tab-semua .tab__count').textContent, harap: PPDB.store.semua().filter(p => p.sumber === 'loket').length.toLocaleString('id-ID') })`);
  await t.buka(AKAR + 'pages/dashboard.html');
  const dash = await t.js(`document.querySelector('.kpi__meta').textContent`);
  cek('14.5', 'Filter loket & dashboard menampilkan porsi online', loket.n === loket.harap && /% daftar online$/.test(dash), JSON.stringify({ loket, dash }));

  // Admin mendaftarkan di loket → sumber loket, tanpa akun
  const idLoket = await t.js(`PPDB.store.tambah({ nama: 'Siti Loket', nisn: '9555000199', jalur: 'zonasi' }).id`);
  const lk = await t.js(`({ s: PPDB.store.ambil('${idLoket}').sumber, a: PPDB.store.ambil('${idLoket}').akunId })`);
  cek('14.5', 'Pendaftaran oleh panitia tercatat sebagai loket', lk.s === 'loket' && lk.a === '', JSON.stringify(lk));

  // Panitia tidak bisa membuka portal orang tua
  await t.buka(AKAR + 'portal/beranda.html');
  const tolakPortal = await t.js(`location.pathname.split('/').slice(-2).join('/')`);
  cek('14.6', 'Panitia membuka portal → diarahkan ke dashboard panitia', tolakPortal === 'pages/dashboard.html', tolakPortal);

  // Cadangan memuat akun & tetap bisa dipulihkan
  const cad = await t.js(`(() => { const j = PPDB.store.ekspor(); const d = JSON.parse(j); const r = PPDB.store.impor(j);
    return { versi: d.versi, akun: d.akun.length, ok: r.ok, akunSetelah: PPDB.store.akunSemua().length, online: PPDB.store.semua().filter(p => p.sumber === 'online').length }; })()`);
  cek('14.5', 'Cadangan JSON v3 memuat akun & pulih utuh', cad.versi === 3 && cad.ok && cad.akun === cad.akunSetelah && cad.akun > 400, JSON.stringify(cad));

  await t.js(`PPDB.store.reset(); true`);
  const n = hasil.filter((h) => !h.ok).length;
  console.log(`\nRINGKASAN: ${hasil.length - n}/${hasil.length} lulus`);
  if (n) throw new Error(n + ' uji gagal');
}
