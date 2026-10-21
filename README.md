# Admin Panel PPDB Online

[![CI](https://github.com/nurdinrhk-design/PROGRAMWEB_2/actions/workflows/ci.yml/badge.svg)](https://github.com/nurdinrhk-design/PROGRAMWEB_2/actions/workflows/ci.yml)

Sistem **Penerimaan Peserta Didik Baru** dengan dua peran: **orang tua/calon peserta** membuat akun dan mendaftarkan anaknya secara online, sedangkan **panitia sekolah** memverifikasi berkas, mendaftarkan calon peserta yang datang langsung ke sekolah, melihat peringkat per jalur, dan mencetak rekap. Murni *client-side* (HTML, CSS, JavaScript) dengan tema **Material Design 3**.

**🌐 Coba langsung:** <https://nurdinrhk-design.github.io/PROGRAMWEB_2/>

| Peran | Akun demo |
|---|---|
| Orang tua / calon peserta | `orangtua@ppdb.test` / `orangtua2026` (atau buat akun baru) |
| Panitia sekolah | `panitia` / `ppdb2026` |

> ⚠️ **Data simulasi.** Sekolah "SMA Negeri 1 Harapan Bangsa", nama siswa, dan semua angka di aplikasi ini **fiktif**. Aplikasi tidak memakai data siswa asli dan tidak diindeks mesin pencari.

![Dashboard](docs/img/tangkapan/02-dashboard.png)

## Identitas Tugas

| | |
|---|---|
| **Nama** | Nurdin |
| **GitHub** | [@nurdinrhk-design](https://github.com/nurdinrhk-design) |
| **Mata kuliah** | Pemrograman Web 2 (Client-Side Programming) |
| **Tugas** | Tugas 1 · Project-Based Learning |
| **Topik** | Sistem Penerimaan Peserta Didik Baru (PPDB Online) |
| **Tema visual** | Material Design 3 |
| **Desain** | [Proyek Google Stitch](https://stitch.withgoogle.com/projects/7419386921328695791) (referensi, lalu diperbaiki) |

## Status Milestone

| Milestone | Isi | Status | Tautan |
|---|---|---|---|
| **M1** · Perencanaan & wireframe | Menu, ERD, user flow, wireframe, design system | ✅ Selesai | [docs/perancangan.md](docs/perancangan.md) |
| **M2** · Slicing & layouting | Design token, komponen CSS, template dasar | ✅ Selesai | [layout.html](layout.html) · [docs/styleguide.html](docs/styleguide.html) |
| **M3** · Komponen & interaktivitas | 8 halaman panitia + 5 halaman orang tua + login + JavaScript + deploy | ✅ Selesai ([v1.2](https://github.com/nurdinrhk-design/PROGRAMWEB_2/releases/tag/v1.2), termasuk revisi dosen: dua peran) | [Situs](https://nurdinrhk-design.github.io/PROGRAMWEB_2/) · [docs/checklist_work.md](docs/checklist_work.md) |

## Fitur

| Halaman | Isi |
|---|---|
| **Login** | Pilihan peran (orang tua / panitia), validasi per kolom, batas 5 percobaan, "Ingat saya", setiap halaman hanya bisa dibuka peran yang benar |
| **Buat akun orang tua** | Nama, email unik, no. HP, kata sandi kuat; kata sandi disimpan sebagai hash PBKDF2 (Web Crypto) |
| **Akun saya (orang tua)** | Ubah nama & no. HP, ganti kata sandi (sandi lama wajib benar) |
| **Portal orang tua** | Daftarkan hingga 3 anak (form 4 langkah yang sama), pantau status & posisi antrean, baca catatan panitia, perbaiki berkas lalu kirim ulang, lihat peringkat sementara, cetak bukti. Ramah HP (menu di bawah layar) |
| **Dashboard** | 4 angka utama yang menaut ke data, grafik pendaftar per hari per jalur (+ tabel data), keketatan jalur, 5 antrean terlama, jadwal PPDB |
| **Data Pendaftar** | Tab status, cari, filter berlapis (termasuk sumber **online/loket**), urutkan, paginasi, kartu di HP, detail, hapus + "Urungkan", ekspor CSV, cadangan & pemulihan JSON, kembalikan data awal |
| **Tambah/Ubah Pendaftar** | Pendaftaran loket oleh panitia untuk calon peserta yang datang ke sekolah. Form 4 langkah dengan validasi aturan PPDB (NISN unik, usia ≤ 21 tahun, KK zonasi ≥ 1 tahun, nilai, berkas), berkas wajib mengikuti jalur, rata-rata rapor otomatis, ringkasan, peringatan sebelum keluar |
| **Verifikasi Berkas** | Antrean terlama dulu, cek per berkas dengan data pembanding, Terverifikasi hanya bila semua sesuai, catatan wajib untuk Perbaikan/Tolak, lanjut otomatis ke pendaftar berikutnya |
| **Hasil & Peringkat** | Per jalur: kuota, keketatan, batas sementara, garis batas kuota, cari nama yang langsung disorot, ekspor CSV |
| **Akun Orang Tua (panitia)** | Daftar akun beserta anak yang didaftarkan dan statusnya, cari, filter (belum mendaftarkan / ada perbaikan); data sandi tidak pernah ditampilkan |
| **Rekap & Cetak** | Filter periode & jalur, rekap per jalur (termasuk jumlah online/loket), 10 asal sekolah terbanyak, rekap harian, log aktivitas, ekspor CSV, cetak A4 |
| **Bukti Pendaftaran** | Siap cetak A4, tanpa lambang, stempel, QR, atau tanda tangan palsu |

| Data Pendaftar | Verifikasi Berkas |
|---|---|
| ![Data Pendaftar](docs/img/tangkapan/03-data-pendaftar.png) | ![Verifikasi Berkas](docs/img/tangkapan/04-verifikasi.png) |
| **Hasil & Peringkat** | **Tampilan HP** |
| ![Hasil & Peringkat](docs/img/tangkapan/05-hasil-peringkat.png) | <img src="docs/img/tangkapan/06-hp-dashboard.png" alt="Dashboard di layar HP" width="220"> |

## Aturan PPDB yang diterapkan

- **4 jalur, kuota 432:** Zonasi 216 · Afirmasi 65 · Perpindahan Tugas Orang Tua 21 · Prestasi 130.
- **Peringkat:** hanya pendaftar terverifikasi. Jalur jarak: terdekat → usia lebih tua → daftar lebih awal. Jalur prestasi: skor (rata-rata rapor semester 1–5 + bonus kota/provinsi/nasional +2/+3/+5) tertinggi.
- **Keketatan** = terverifikasi ÷ kuota. **Batas sementara** = jarak/skor peringkat terakhir yang masuk kuota.
- Perubahan data yang memengaruhi seleksi pada pendaftar yang sudah diperiksa → status kembali **Menunggu** untuk verifikasi ulang.

Rincian aturan BR-01…BR-13 ada di [perencanaan §7](docs/perencanaan.md#7-model-data--aturan-bisnis).

## Teknologi

| Bagian | Teknologi |
|---|---|
| Struktur | HTML5 semantik |
| Tampilan | CSS3 murni, modular, berbasis design token (tanpa framework) |
| Interaksi | JavaScript murni (tanpa framework, tanpa proses build) |
| Grafik | Chart.js 4.5.1 dari jsDelivr, versi dikunci + Subresource Integrity, dimuat asinkron |
| Font & ikon | Plus Jakarta Sans · Material Symbols Outlined (Google Fonts) |
| Data | `localStorage` + 900 data simulasi dari generator ber-*seed* |
| Hosting & CI | GitHub Pages · GitHub Actions (W3C Nu Validator, uji end-to-end Chrome headless, Gitleaks) |

## Kualitas & Keamanan

| Pemeriksaan | Hasil |
|---|---|
| Uji otomatis | `node tests/e2e/jalankan.mjs`: 40 uji modul inti, 18 uji alur orang tua, 8 uji akun, 21 uji regresi panitia; lulus di Chrome & Edge dan **dijalankan otomatis di CI** setiap push |
| Kasus uji fungsional | 23/23 lulus ([daftar TC](docs/checklist_work.md)) |
| Lighthouse | Aksesibilitas **100** · Praktik terbaik **100** di semua halaman yang diuji (termasuk portal orang tua) |
| Validator W3C | 0 error HTML & CSS (juga dicek CI di setiap push) |
| Responsif | 360 · 600 · 840 · 1200 · 1440 px tanpa scroll horizontal |
| Keamanan front-end | Tanpa `innerHTML` untuk data (anti-XSS), Content-Security-Policy, SRI, pengaman *formula injection* CSV, validasi impor ketat, anti *open-redirect*, batas percobaan login |
| Repo publik | Audit rahasia sebelum setiap push + Gitleaks di CI; commit memakai email *noreply* |

Login di aplikasi ini **simulasi** (akun sengaja dipublikasikan). Untuk PPDB sungguhan, autentikasi dan data harus berada di server.

## Cara Menjalankan

**Online:** buka <https://nurdinrhk-design.github.io/PROGRAMWEB_2/>.

**Di laptop** (tanpa instalasi atau proses build):
1. Clone repositori:
   ```bash
   git clone https://github.com/nurdinrhk-design/PROGRAMWEB_2.git
   ```
2. Buka `index.html` di browser (klik dua kali), atau jalankan **Live Server** di VS Code.
3. Masuk sebagai orang tua (`orangtua@ppdb.test` / `orangtua2026`) atau panitia (`panitia` / `ppdb2026`).

Butuh internet untuk font, ikon, dan grafik. Tanpa internet aplikasi tetap berjalan; grafik diganti tabel. Data tersimpan di browser masing-masing; kembalikan ke awal lewat *Data Pendaftar → menu ⋮ → Kembalikan data awal simulasi*. Uji modul inti bisa dibuka di `tests/index.html`.

**Uji otomatis** (butuh Node 22+ dan Chrome atau Edge, tanpa instalasi paket):
```bash
node tests/e2e/jalankan.mjs                                   # semua uji
node tests/e2e/jalankan.mjs tests/e2e/uji-lighthouse.mjs      # Lighthouse (opsional, butuh internet)
```

## Struktur Folder

```
PROGRAMWEB_2/
├── index.html              # Login (pilih peran)
├── daftar.html             # Buat akun orang tua
├── 404.html                # Halaman tidak ditemukan (GitHub Pages)
├── layout.html             # Template master (M2)
├── assets/
│   ├── css/                # main.css → tokens, base, layout, components, pages, print
│   ├── js/core/            # rules (aturan PPDB), seed (data simulasi), store (data & akun), ui, shell (login dua peran & navigasi)
│   ├── js/pages/           # satu skrip per halaman
│   └── img/                # logo.svg
├── pages/                  # panitia: dashboard, data-master, form, verifikasi, hasil-seleksi, laporan, bukti, akun
├── portal/                 # orang tua: beranda, form (daftarkan/perbaiki anak), bukti, akun
├── tests/                  # index.html: uji modul inti di browser · e2e/: uji end-to-end (node tests/e2e/jalankan.mjs)
├── docs/                   # perancangan (M1), perencanaan, checklist, styleguide (M2), presentasi, panduan domain
└── .github/workflows/      # CI: validasi W3C + pemindaian rahasia
```

## Dokumentasi

- [Perancangan (M1)](docs/perancangan.md): menu, sitemap, user flow, ERD, wireframe, design system.
- [Perencanaan](docs/perencanaan.md): keputusan, kebutuhan, aturan bisnis, tahapan, strategi pengujian.
- [Checklist pekerjaan](docs/checklist_work.md): status setiap langkah, hasil uji, log perubahan file.
- [Naskah demo & tanya-jawab](docs/presentasi.md): bahan presentasi 8–9 menit (dua peran).
- [Panduan domain](docs/panduan-domain.md): memasang domain sendiri (DNS, HTTPS).

---

© 2026 Nurdin · Dibangun oleh Nurdin bersama Claude (AI dari Anthropic) untuk tugas mata kuliah Pemrograman Web 2.
