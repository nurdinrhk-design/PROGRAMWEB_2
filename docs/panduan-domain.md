# Panduan Memasang Domain Sendiri — Admin Panel PPDB Online

> Tahap 13.6 · Untuk pengembang (pemilik domain). Situs saat ini: <https://nurdinrhk-design.github.io/PROGRAMWEB_2/>
> Contoh di bawah memakai `ppdb.contoh.id`. Ganti dengan domain/subdomain milik Anda.

## Ringkasan

| Langkah | Di mana | Waktu |
|---|---|---|
| 1. Verifikasi domain di akun GitHub | GitHub → Settings akun | 5 menit + propagasi DNS |
| 2. Tambah record DNS | Panel DNS penyedia domain | 5 menit + propagasi (hingga 24 jam) |
| 3. Isi *Custom domain* di GitHub Pages | Repo → Settings → Pages | 1 menit |
| 4. Aktifkan *Enforce HTTPS* | Repo → Settings → Pages | menunggu sertifikat (± 15 menit – 24 jam) |
| 5. Uji | Browser | 5 menit |

**Disarankan memakai subdomain** (mis. `ppdb.contoh.id`) karena cukup satu record CNAME dan tidak mengganggu situs utama domain.

## 1. Verifikasi domain (mencegah domain dibajak)

1. Login GitHub sebagai **nurdinrhk-design** → foto profil → **Settings** → **Pages** (menu kiri, bagian *Code, planning, and automation*).
2. **Add a domain** → isi `contoh.id` (domain induk) → GitHub menampilkan record **TXT**.
3. Tambahkan record TXT itu di panel DNS (langkah 2), lalu kembali dan klik **Verify**.

Tanpa verifikasi, orang lain bisa memakai domain Anda untuk repo mereka bila konfigurasi Pages Anda sempat terlepas.

## 2. Record DNS

**Pilihan A — subdomain (disarankan):**

| Tipe | Nama/Host | Nilai |
|---|---|---|
| CNAME | `ppdb` | `nurdinrhk-design.github.io` |

**Pilihan B — domain utama (`contoh.id`):**

| Tipe | Nama/Host | Nilai |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| AAAA | `@` | `2606:50c0:8000::153` |
| AAAA | `@` | `2606:50c0:8001::153` |
| AAAA | `@` | `2606:50c0:8002::153` |
| AAAA | `@` | `2606:50c0:8003::153` |
| CNAME | `www` | `nurdinrhk-design.github.io` |

Catatan:
- Hapus record lama yang bentrok (A/CNAME lain untuk nama yang sama).
- **Jangan** memakai record wildcard (`*.contoh.id`) yang mengarah ke GitHub.
- Alamat IP di atas sesuai dokumentasi resmi GitHub Pages; periksa ulang di <https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site> sebelum memasang.

## 3. Isi *Custom domain* di repo

1. Buka <https://github.com/nurdinrhk-design/PROGRAMWEB_2/settings/pages>.
2. Bagian **Custom domain** → isi `ppdb.contoh.id` → **Save**.
3. GitHub otomatis membuat berkas `CNAME` di akar repo (berisi nama domain). Biarkan berkas itu; jangan dihapus.
4. Setelah itu, tarik perubahan ke laptop: `git pull` (agar berkas `CNAME` juga ada di salinan lokal).

## 4. HTTPS

1. Tunggu sampai muncul tanda centang *DNS check successful*.
2. Centang **Enforce HTTPS**. Bila belum bisa dicentang, sertifikat masih dibuat (tunggu, lalu muat ulang halaman Settings).

## 5. Uji setelah domain aktif

- [ ] `https://ppdb.contoh.id/` membuka halaman login (bukan halaman 404).
- [ ] Login → Dashboard tampil dengan grafik.
- [ ] `https://ppdb.contoh.id/halaman-asal` menampilkan halaman 404 proyek, dan tautan *Kembali ke halaman masuk* menuju `https://ppdb.contoh.id/index.html` (sudah otomatis menyesuaikan domain).
- [ ] `http://` otomatis dialihkan ke `https://`.
- [ ] Data lama di alamat `github.io` **tidak ikut pindah** (localStorage terikat ke alamat situs). Login ulang di alamat baru.

## Yang sudah disiapkan di proyek

| Hal | Keterangan |
|---|---|
| Tautan relatif | Semua tautan & aset memakai alamat relatif, jadi tetap jalan di `github.io/PROGRAMWEB_2/` maupun di akar domain |
| Halaman 404 | Menyesuaikan sendiri: `/PROGRAMWEB_2/` saat di github.io, `/` saat di domain sendiri |
| Keamanan | CSP `<meta>`, Chart.js dikunci versi + SRI, `noindex`, `robots.txt`, referrer `no-referrer` |
| `noindex` | Situs tidak diindeks mesin pencari selama memakai data simulasi. Hapus `<meta name="robots">` dan `robots.txt` bila kelak dipakai sungguhan |

## Batasan GitHub Pages yang perlu diketahui

- Tidak bisa menambah *header* HTTP sendiri (mis. `Content-Security-Policy` versi header, `X-Frame-Options`). Karena itu CSP dipasang lewat `<meta>`; perlindungan *clickjacking* (`frame-ancestors`) hanya bisa lewat header, jadi belum tersedia. Bila dibutuhkan, pindahkan ke hosting yang mendukung header (Netlify, Cloudflare Pages) atau pasang Cloudflare di depan domain.
- Aplikasi tetap **simulasi**: data hanya di browser masing-masing. Untuk PPDB sungguhan diperlukan server, database, dan autentikasi asli.
