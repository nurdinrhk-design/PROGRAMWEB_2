// =====================================================================
// jalankan.mjs — Penguji end-to-end lewat Chrome/Edge headless (DevTools
// Protocol), tanpa dependensi. Butuh Node 22+ dan Chrome atau Edge.
//
//   node tests/e2e/jalankan.mjs                       → semua uji-*.mjs (kecuali Lighthouse)
//   node tests/e2e/jalankan.mjs tests/e2e/uji-peserta.mjs
//   BROWSER="C:/.../msedge.exe" node tests/e2e/jalankan.mjs
//   AKAR="https://nurdinrhk-design.github.io/PROGRAMWEB_2/" node tests/e2e/jalankan.mjs   (uji situs online)
//
// Profil browser & tangkapan layar disimpan di folder Temp sistem lalu
// dihapus, sehingga folder proyek & laptop tetap bersih. SIMPAN_FOTO=1
// mempertahankan tangkapan layar (folder ppdb-uji-foto di Temp) untuk diperiksa.
// =====================================================================
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync, rmSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname, resolve, basename } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';

const DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(DIR, '..', '..');
process.env.AKAR = process.env.AKAR || pathToFileURL(ROOT).href + '/';
const PROFIL = join(tmpdir(), 'ppdb-uji-profil-' + process.pid);
const FOTO = join(tmpdir(), 'ppdb-uji-foto');
const PORT = 9333;

function cariBrowser() {
  if (process.env.BROWSER) return process.env.BROWSER;
  const kandidat = [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  ];
  const ada = kandidat.find((k) => existsSync(k));
  if (!ada) throw new Error('Chrome/Edge tidak ditemukan. Atur variabel BROWSER.');
  return ada;
}

const tunggu = (ms) => new Promise((r) => setTimeout(r, ms));

async function bukaBrowser() {
  mkdirSync(PROFIL, { recursive: true });
  const args = ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${PROFIL}`,
    '--no-first-run', '--no-default-browser-check', '--disable-extensions', '--hide-scrollbars', '--window-size=1440,900'];
  if (process.platform === 'linux') args.push('--no-sandbox', '--disable-dev-shm-usage');
  const proc = spawn(cariBrowser(), [...args, 'about:blank'], { stdio: 'ignore' });
  let info;
  for (let i = 0; i < 75; i++) {
    try { info = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); break; } catch { await tunggu(200); }
  }
  if (!info) throw new Error('Browser tidak merespons di port ' + PORT);
  const ws = new WebSocket(info.find((x) => x.type === 'page').webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener('open', r, { once: true }));
  return { proc, ws };
}

function buatAlat(ws) {
  let id = 0;
  const antre = new Map();
  const pendengar = [];
  const konsol = [];
  ws.addEventListener('message', (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && antre.has(m.id)) {
      const { resolve: ok, reject } = antre.get(m.id);
      antre.delete(m.id);
      m.error ? reject(new Error(m.error.message)) : ok(m.result);
      return;
    }
    if (m.method === 'Runtime.consoleAPICalled' && ['error', 'warning', 'assert'].includes(m.params.type)) {
      konsol.push(`[console.${m.params.type}] ` + m.params.args.map((a) => a.value ?? a.description).join(' '));
    }
    if (m.method === 'Runtime.exceptionThrown') konsol.push('[exception] ' + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text));
    if (m.method === 'Log.entryAdded' && ['error', 'warning'].includes(m.params.entry.level)) konsol.push(`[log.${m.params.entry.level}] ${m.params.entry.text} ${m.params.entry.url || ''}`);
    [...pendengar].forEach((f) => f(m));
  });

  const kirim = (method, params = {}) => new Promise((ok, reject) => {
    const n = ++id;
    const batas = setTimeout(() => { antre.delete(n); reject(new Error('CDP macet 30 dtk: ' + method)); }, 30000);
    antre.set(n, { resolve: (v) => { clearTimeout(batas); ok(v); }, reject: (e) => { clearTimeout(batas); reject(e); } });
    ws.send(JSON.stringify({ id: n, method, params }));
  });

  return {
    kirim, tunggu, konsol,
    dengar(fn) { pendengar.push(fn); },
    async buka(url) {
      const selesai = new Promise((r) => {
        const f = (m) => { if (m.method === 'Page.loadEventFired') { pendengar.splice(pendengar.indexOf(f), 1); r(); } };
        pendengar.push(f);
      });
      await kirim('Page.navigate', { url });
      await selesai;
      await tunggu(300);
    },
    async js(expr) {
      const r = await kirim('Runtime.evaluate', { expression: '{\n' + expr + '\n}', awaitPromise: true, returnByValue: true, userGesture: true });
      if (r.exceptionDetails) throw new Error('JS: ' + (r.exceptionDetails.exception?.description || r.exceptionDetails.text));
      return r.result.value;
    },
    async ukuran(lebar, tinggi = 900) {
      await kirim('Emulation.setDeviceMetricsOverride', { width: lebar, height: tinggi, deviceScaleFactor: 1, mobile: lebar < 600 });
      await tunggu(250);
    },
    async foto(nama, penuh = false) {
      const r = await kirim('Page.captureScreenshot', { format: 'png', captureBeyondViewport: penuh });
      mkdirSync(FOTO, { recursive: true });
      const p = join(FOTO, nama + '.png');
      writeFileSync(p, Buffer.from(r.data, 'base64'));
      return p;
    },
    async tekan(key, code = key, keyCode = 0) {
      for (const type of ['keyDown', 'keyUp']) await kirim('Input.dispatchKeyEvent', { type, key, code, windowsVirtualKeyCode: keyCode });
    },
    async ketik(teks) { await kirim('Input.insertText', { text: teks }); }
  };
}

// Daftar uji: argumen, atau semua uji-*.mjs kecuali Lighthouse (butuh internet & npx)
const daftar = process.argv.slice(2).length
  ? process.argv.slice(2).map((f) => resolve(f))
  : readdirSync(DIR).filter((f) => /^uji-.*\.mjs$/.test(f) && f !== 'uji-lighthouse.mjs' && f !== 'uji-visual.mjs').sort().map((f) => join(DIR, f));

let gagal = 0;
for (const berkas of daftar) {
  console.log('\n===== ' + basename(berkas) + ' =====');
  const { proc, ws } = await bukaBrowser();
  const t = buatAlat(ws);
  await t.kirim('Page.enable');
  await t.kirim('Runtime.enable');
  await t.kirim('Log.enable');
  await t.kirim('Emulation.setFocusEmulationEnabled', { enabled: true });
  try {
    const uji = await import(pathToFileURL(berkas).href);
    await uji.default(t);
  } catch (e) {
    console.error('GAGAL:', e.message);
    gagal += 1;
  } finally {
    console.log('--- konsol browser (' + t.konsol.length + ' entri) ---');
    t.konsol.forEach((k) => console.log(k));
    if (t.konsol.length) gagal += 1;
    ws.close();
    proc.kill();
    await tunggu(1000);
    try { rmSync(PROFIL, { recursive: true, force: true, maxRetries: 10, retryDelay: 300 }); } catch { /* dibersihkan sistem */ }
  }
}
if (process.env.SIMPAN_FOTO !== '1') rmSync(FOTO, { recursive: true, force: true });
else if (existsSync(FOTO)) console.log('Tangkapan layar: ' + FOTO);
console.log(`\n${daftar.length - gagal}/${daftar.length} berkas uji lulus`);
process.exit(gagal ? 1 : 0);
