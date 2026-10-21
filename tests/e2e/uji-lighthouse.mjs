// Opsional, butuh internet: node tests/e2e/jalankan.mjs tests/e2e/uji-lighthouse.mjs
// Lighthouse (aksesibilitas & praktik terbaik) halaman baru Tahap 14, lewat server statis lokal.
// npm memakai cache sementara di scratchpad (cache npm pengguna tidak tersentuh).
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { readFileSync, rmSync, existsSync, statSync, mkdirSync } from 'node:fs';
import { join, dirname, extname, normalize, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
const DIR = join(tmpdir(), 'ppdb-uji-lighthouse');
const PROYEK = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const PORT = 8123;
const AKAR = `http://127.0.0.1:${PORT}/`;
const HALAMAN = [['index.html', ''], ['daftar.html', ''], ['portal/beranda.html', 'peserta'], ['portal/form.html', 'peserta'], ['pages/data-master.html', 'panitia'], ['pages/akun.html', 'panitia'], ['portal/akun.html', 'peserta']];
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png' };

function server() {
  return createServer((req, res) => {
    const jalur = normalize(decodeURIComponent(req.url.split('?')[0])).replace(/^([/\\])+/, '');
    const f = join(PROYEK, jalur || 'index.html');
    if (!f.startsWith(normalize(PROYEK)) || !existsSync(f) || statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type': MIME[extname(f)] || 'application/octet-stream' });
    res.end(readFileSync(f));
  }).listen(PORT, '127.0.0.1');
}

function lighthouse(url, out) {
  const env = { ...process.env, npm_config_cache: join(DIR, 'npm-cache'), npm_config_update_notifier: 'false' };
  const args = ['-y', 'lighthouse@12', url, '--port=9333', '--only-categories=accessibility,best-practices', '--disable-storage-reset',
    '--output=json', '--output-path=' + out, '--quiet', '--screenEmulation.disabled', '--form-factor=desktop'];
  return new Promise((resolve, reject) => {
    const p = spawn('npx.cmd', args.map((a) => '"' + a + '"'), { env, shell: true, stdio: ['ignore', 'ignore', 'inherit'] });
    p.on('exit', (k) => (k === 0 ? resolve() : reject(new Error('lighthouse keluar ' + k))));
  });
}

export default async function (t) {
  mkdirSync(DIR, { recursive: true });
  const srv = server();
  await new Promise((r) => srv.once('listening', r));
  await t.buka(AKAR + 'index.html');
  try {
    let gagal = 0;
    for (const [h, peran] of HALAMAN) {
      await t.buka(AKAR + 'index.html');
      await t.js(`localStorage.removeItem('ppdb.v2.session'); sessionStorage.clear(); true`);
      if (peran === 'peserta') await t.js(`PPDB.auth.loginPeserta('orangtua@ppdb.test','orangtua2026',true)`);
      if (peran === 'panitia') await t.js(`PPDB.auth.login('panitia','ppdb2026',true); true`);
      const out = join(DIR, 'lh.json');
      await lighthouse(AKAR + h, out);
      const r = JSON.parse(readFileSync(out, 'utf8'));
      const a11y = Math.round(r.categories.accessibility.score * 100);
      const bp = Math.round(r.categories['best-practices'].score * 100);
      const belum = Object.values(r.audits).filter((x) => x.score !== null && x.score < 1 && x.scoreDisplayMode === 'binary').map((x) => x.id);
      console.log(`${a11y >= 90 ? 'LULUS' : 'GAGAL'} ${h}: aksesibilitas ${a11y}, praktik terbaik ${bp}` + (belum.length ? ' · belum lolos: ' + belum.join(', ') : '') + ' · url akhir ' + r.finalDisplayedUrl.replace(AKAR, ''));
      if (a11y < 90) gagal++;
      rmSync(out, { force: true });
    }
    if (gagal) throw new Error(gagal + ' halaman di bawah 90');
  } finally {
    srv.close();
    rmSync(DIR, { recursive: true, force: true }); // cache npm & laporan sementara
  }
}
