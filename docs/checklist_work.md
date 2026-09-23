# ✅ Checklist Pekerjaan — Admin Panel PPDB Online

> **Dokumen pelacakan (tracker)**, pasangan dari **[perencanaan.md](perencanaan.md)** (v0.2).
> - Setiap tugas punya **ID** `T{tahap}-{nomor}`. Tugas penutup tahap berkode `R1`–`R3` (lihat [perencanaan §11.3](perencanaan.md#113-rutinitas-penutupan-setiap-tahap)).
> - Kolom **Ref** menunjuk ke ID di perencanaan.md: `FR` kebutuhan · `NFR` non-fungsional · `BR` aturan bisnis · `AS` anti-slop · `P` halaman · `D` keputusan · `TC` kasus uji · `§` bagian.
> - Aturan pencatatan: [perencanaan §15](perencanaan.md#15-alur-kerja--aturan-pencatatan). Definition of Done: [§14](perencanaan.md#14-definition-of-done).

**Versi checklist:** 0.2 (disusun ulang mengikuti perencanaan v0.2) · **Terakhir diperbarui:** 23 September 2026

---

## Legenda Status

| Simbol | Arti |
|---|---|
| ⬜ | Belum dikerjakan |
| 🔄 | Sedang dikerjakan |
| 🟡 | Sebagian / draf, belum memenuhi Definition of Done |
| ✅ | Selesai |
| ⛔ | Terblokir (lihat [Blocker](#blocker--pertanyaan-terbuka)) |
| 👤 | Dikerjakan pengembang sendiri (akun Figma/GitHub/Vercel/LMS) |
| ➖ | Opsional |
| 🚫 | Dibatalkan berdasarkan keputusan (tidak dihitung dalam total) |

---

## Posisi Saat Ini

| | |
|---|---|
| **Tahap aktif** | – (T4 belum dimulai, menunggu aba-aba pengembang) |
| **Tahap terakhir selesai** | T3 — disetujui & di-push 23 Sep 2026 |
| **Menunggu dari pengembang** | Aba-aba mulai T4 · kirim M1 & M2 ke LMS 👤 |

## Ringkasan Progres

> Kolom **Total** tidak menghitung tugas 🚫 (dibatalkan).

| Tahap | Nama | Milestone | Total | ✅ | ⬜/🔄/⛔ | Progres |
|---|---|---|---|---|---|---|
| [T0](#t0--persiapan--revisi-rencana) | Persiapan & revisi rencana | M1 | 17 | 17 | 0 | 100% |
| [T1](#t1--dokumen-perancangan) | Dokumen perancangan | M1 | 17 | 16 | 1 | 94% |
| [T2](#t2--design-system--css-fondasi--komponen) | Design system → CSS | M2 | 15 | 15 | 0 | 100% |
| [T3](#t3--layout-master-app-shell) | Layout master | M2 | 12 | 12 | 0 | 100% |
| [T4](#t4--lapisan-data--modul-inti) | Data & modul inti | M3 | 17 | 0 | 17 | 0% |
| [T5](#t5--halaman-login) | Login | M3 | 10 | 0 | 10 | 0% |
| [T6](#t6--dashboard) | Dashboard | M3 | 12 | 0 | 12 | 0% |
| [T7](#t7--data-pendaftar) | Data Pendaftar | M3 | 16 | 0 | 16 | 0% |
| [T8](#t8--form-tambahedit-stepper) | Form Tambah/Edit | M3 | 15 | 0 | 15 | 0% |
| [T9](#t9--verifikasi-berkas) | Verifikasi Berkas | M3 | 11 | 0 | 11 | 0% |
| [T10](#t10--hasil--peringkat) | Hasil & Peringkat | M3 | 11 | 0 | 11 | 0% |
| [T11](#t11--laporan--bukti-pendaftaran) | Laporan & Bukti | M3 | 11 | 0 | 11 | 0% |
| [T12](#t12--qa-menyeluruh) | QA menyeluruh | M3 | 15 | 0 | 15 | 0% |
| [T13](#t13--readme-deploy--presentasi) | README, deploy & presentasi | M3 | 13 | 0 | 13 | 0% |
| [T14](#t14--database--hosting-produksi-fase-2) | Database & hosting produksi | Fase 2 | 16 | 0 | 16 | 0% |
| | **Total** | | **208** | **60** | **148** | **29%** |

**Milestone:** M1 (pekan 3) 🔄 dokumen lengkap, tinggal kirim LMS 👤 · M2 (pekan 5) ✅ kode selesai, tinggal kirim LMS 👤 · M3 (pekan 7) ⬜ · Fase 2 (setelah tugas) ⬜

---

## T0 — Persiapan & Revisi Rencana
Ref: [perencanaan §3](perencanaan.md#3-keputusan--asumsi), [§10](perencanaan.md#10-arsitektur-teknis) · **Output:** repo bersih, perencanaan v0.2, checklist v0.2

| ID | Tugas | Ref | Status | Catatan |
|---|---|---|---|---|
| T0-01 | Inisialisasi repository Git (branch `main`) | §10.3 | ✅ | Belum ada commit |
| T0-02 | Buat struktur folder `docs/`, `assets/{css,js,img}`, `pages/` | §10.1 | ✅ | |
| T0-03 | Buat `docs/perencanaan.md` | – | ✅ | v0.1 → v0.2 |
| T0-04 | Buat `docs/checklist_work.md` | – | ✅ | v0.1 → v0.2 |
| T0-05 | Buat `.gitignore` | §10.3 | ✅ | Bahan Stitch mentah tidak ikut di-commit |
| T0-06 | Buat repository di GitHub & hubungkan `origin` | D-09 | ✅ | 👤 `origin` = `nurdinrhk-design/PROGRAMWEB_2` (publik, kosong). Akun `fahrizal-tech` ditambahkan sebagai collaborator (B-03 selesai) |
| T0-07 | Commit pertama (lingkungan bersih + dokumen v0.2.1) & push | §10.3 | ✅ | `1a0d182` di `origin/main` (sebelumnya `dd57340`, ditulis ulang untuk ganti identitas, F-24) |
| T0-08 | Tetapkan keputusan D-01…D-17 | §3 | ✅ | Mengikuti rekomendasi, disetujui pengembang 23 Sep 2026 |
| T0-09 | Hapus 11 file kode draf bertema kaca | D-10 | ✅ | F-01…F-12 |
| T0-10 | Salin 8 screenshot referensi Stitch ke `docs/img/referensi-stitch/` | §4.2 | ✅ | F-14 |
| T0-11 | Revisi perencanaan ke v0.2 (M3, anti-slop, menu & halaman baru, T0–T13) | §16 | ✅ | F-17 |
| T0-12 | Susun ulang checklist ke v0.2 | §15 | ✅ | F-18 |
| T0-13 | Audit keamanan sebelum push (S-01…S-07) + perkuat `.gitignore` | D-18, §15.1 | ✅ | Temuan: email pribadi di identitas commit. Diganti noreply. F-19 |
| T0-14 | Atur identitas commit: noreply GitHub (lokal repo, bukan global) | D-18 | ✅ | Final: `nurdinrhk-design <237171232+nurdinrhk-design@users.noreply.github.com>`. Push tetap memakai login `fahrizal-tech` (collaborator) |
| T0-R1 | Uji tahap: konsistensi ID antara kedua dokumen | §14 | ✅ | Dicek dengan skrip: semua tahap & ID rujukan ditemukan |
| T0-R2 | Catat log & ringkasan progres | §15 | ✅ | |
| T0-R3 | Review pengembang → audit → commit & push | D-16, §15.1 | ✅ | Disetujui, diaudit, di-push 23 Sep 2026 |

---

## T1 — Dokumen Perancangan
Ref: [perencanaan §4](perencanaan.md#4-prinsip-desain-anti-ai-slop)–[§9](perencanaan.md#9-design-system-material-design-3) · **Output:** `docs/perancangan.md` (deliverable M1)

| ID | Tugas | Ref | Status | Catatan |
|---|---|---|---|---|
| T1-01 | Kerangka `docs/perancangan.md` (identitas, daftar isi) | §2.1 | ✅ | Nama file sesuai panduan tugas |
| T1-02 | Deskripsi sistem, aktor, skenario penggunaan | §1, §5.1 | ✅ | |
| T1-03 | Tema terpilih (M3) + alasan + ringkasan prinsip anti-slop | D-01, §4.1 | ✅ | |
| T1-04 | Hierarki menu & top app bar | §6.1, §6.2 | ✅ | |
| T1-05 | Sitemap (Mermaid) | §6.3 | ✅ | |
| T1-06 | User flow verifikasi & input offline (Mermaid) | §6.4, §6.5 | ✅ | |
| T1-07 | ERD (Mermaid) + kamus data ringkas | §7.1 | ✅ | |
| T1-08 | Jalur, kuota, jadwal, status | §7.2–§7.4 | ✅ | |
| T1-09 | Wireframe low-fi tiap halaman (P-01…P-08) | §8 | ✅ | Wireframe teks + kerangka desktop/tablet/mobile. Kelurusan kolom dicek skrip |
| T1-10 | Design system: warna, tipografi, bentuk, elevasi, komponen | §9 | ✅ | |
| T1-11 | Embed screenshot referensi Stitch + tabel keputusan (dipertahankan/diperbaiki/dibuang) | §4.2 | ✅ | 8 gambar, 13 keputusan |
| T1-12 | Figma: variables/styles warna & tipografi sesuai §9 | D-20 | 🚫 | Dibatalkan: tanpa Figma |
| T1-13 | Figma: komponen (button, field, chip, badge, card, baris tabel, dialog) | D-20 | 🚫 | Dibatalkan: diganti `styleguide.html` (T2-11) |
| T1-14 | Figma: hi-fi Dashboard | D-20, P-02 | 🚫 | Dibatalkan: tanpa Figma |
| T1-15 | Figma: hi-fi Data Pendaftar | D-20, P-03 | 🚫 | Dibatalkan: tanpa Figma |
| T1-16 | Figma: Login, Form, dan versi mobile | D-20, P-01, P-04 | 🚫 | Dibatalkan: tanpa Figma |
| T1-17 | Tempel link publik proyek Google Stitch di `perancangan.md` §8.2 | D-20, §2.1 | ✅ | Link dari pengembang ditempel di tabel identitas & §8.2 (F-35) |
| T1-18 | Cek semua diagram Mermaid tampil benar | – | ✅ | 6 diagram lolos validator Mermaid Chart (flowchart ×4, stateDiagram, erDiagram) |
| T1-19 | Kirim link repo M1 ke LMS Mentari | §2.1 | ⬜ | 👤 Tenggat pekan ke-3 |
| T1-R1 | Uji tahap | §14 | ✅ | Mermaid valid, 8 gambar ada, 10 anchor valid, wireframe lurus, isi konsisten dengan perencanaan v0.2.2 |
| T1-R2 | Catat log & ringkasan | §15 | ✅ | F-27, F-28 |
| T1-R3 | Review pengembang → audit → commit & push | D-16, §15.1 | ✅ | Disetujui 23 Sep 2026 (perancangan, teknologi D-04…D-06, database D-21) |

---

## T2 — Design System → CSS Fondasi & Komponen
Ref: [perencanaan §9](perencanaan.md#9-design-system-material-design-3), [§10.1](perencanaan.md#101-struktur-folder-target) · **Output:** `assets/css/*.css`, `docs/styleguide.html`, `assets/img/logo.svg`

| ID | Tugas | Ref | Status | Catatan |
|---|---|---|---|---|
| T2-01 | `tokens.css`: warna peran M3 & status | §9.1, NFR-05 | ✅ | 20 peran warna M3 + 5 kelompok status + 5 warna grafik (F-36) |
| T2-02 | `tokens.css`: tipografi, spasi, radius, elevasi, durasi | §9.2–§9.6 | ✅ | Tipografi 8 gaya, jarak 7 langkah, radius 4, elevasi 3, state layer, durasi, ukuran layout |
| T2-03 | Uji kontras semua pasangan teks/latar (≥ 4.5:1), catat penyesuaian | NFR-04 | ✅ | 27 pasangan diuji (skrip). 3 gagal → diperbaiki: outline #8391A7, placeholder #64748B, secondary bukan latar teks. Di styleguide: 17/17 lolos |
| T2-04 | `main.css` (urutan `@import`) + `base.css` (reset, tipografi, fokus) | §10.1 | ✅ | main.css memuat token, base, komponen (layout/halaman/print ditambah di tahapnya). base: reset, tipografi, fokus, ikon, utilitas |
| T2-05 | Komponen: button (filled/tonal/outlined/text/danger/icon) + state layer | §9.4, §9.7 | ✅ | filled, tonal, outlined, text, danger, danger-outlined, sm, block, disabled + icon-btn, state layer ::before |
| T2-06 | Komponen: text field, select, textarea, checkbox, radio, radio-card | §9.7 | ✅ | Outlined field + ikon + aksi + hint + error + disabled, select (panah CSS), textarea, checkbox/radio (accent-color), choice-card (:has) |
| T2-07 | Komponen: chip, badge status (6), card, KPI card | §9.7, §7.4 | ✅ | Chip filter/input/jalur, 6 badge (teks + titik, tidak hanya warna), count, card, KPI |
| T2-08 | Komponen: data table (sort, baris garis batas, mode kartu), pagination, tabs | §9.7 | ✅ | Tabel sortable (aria-sort), baris garis batas, mode kartu < 600px, pagination, tabs + count |
| T2-09 | Komponen: dialog, snackbar, menu, stepper, linear progress, empty state, skeleton | §9.7 | ✅ | Dialog (<dialog>), snackbar + Urungkan, menu, stepper, <progress> 3 varian, empty, skeleton (hormati reduced-motion) |
| T2-10 | `logo.svg` sederhana & fiktif + favicon | D-17 | ✅ | Logo topi wisuda sederhana, fiktif, tanpa lambang pemerintah. Dipakai juga sebagai favicon |
| T2-11 | `docs/styleguide.html`: etalase semua token & komponen | §11.1 | ✅ | 12 bagian. Swatch & uji kontras dibaca dari token secara langsung. Dicek Chrome headless 1280px & 390px (iframe) |
| T2-12 | Validasi W3C CSS | NFR-03 | ✅ | 4 file CSS valid, 0 error (awalnya 3 error var() di calc → diganti nilai tetap; clip → clip-path). HTML styleguide: 0 error, 0 peringatan (W3C Nu) |
| T2-R1 | Uji tahap | §14 | ✅ | W3C CSS & HTML bersih, console 0 error, 22 swatch & 17 kontras tampil, NFR-05: 0 warna di luar tokens.css, tampilan 1280px & 390px rapi |
| T2-R2 | Catat log & ringkasan | §15 | ✅ | F-35…F-47 |
| T2-R3 | Review pengembang → audit → commit & push | D-16, §15.1 | ✅ | Disetujui 23 Sep 2026 |

---

## T3 — Layout Master (App Shell)
Ref: [perencanaan P-00](perencanaan.md#p-00--layouthtml--template-master-m2-tahap-t3), [§6.1–6.2](perencanaan.md#61-menu-navigation-drawer), [§9.5](perencanaan.md#95-spasi-layout-breakpoint) · **Output:** `layout.html`, `assets/js/core/shell.js` (bagian layout)

| ID | Tugas | Ref | Status | Catatan |
|---|---|---|---|---|
| T3-01 | `layout.html`: kerangka semantik (`aside`, `header`, `main`, `footer`) | P-00, NFR-02 | ✅ | `layout.html` di root: skip link, aside, header, main, footer + `@import layout.css` di main.css. Komentar cara memakai template |
| T3-02 | Navigation drawer: brand, 3 grup menu, badge, "Data simulasi", Keluar | §6.1 | ✅ | Brand, 4 kelompok menu (7 item), badge `data-badge` (diisi T4), catatan Data simulasi, Keluar (logika di T4). Label pendek untuk rail |
| T3-03 | Top app bar 4 elemen + menu akun | §6.2 | ✅ | Tombol menu, breadcrumb + judul, chip tahap (teks dihitung di T4), menu akun pola disclosure |
| T3-04 | Page header, area konten, grid helper | P-00 | ✅ | `.page-header`, `.content` (maks. 1440px), grid `--kpi` (1→2→4), `--main-side` (1→2/3+1/3), `--halves` |
| T3-05 | Footer ringkas | P-00 | ✅ | Footer ringkas + label data simulasi |
| T3-06 | Responsif: drawer permanen / rail / drawer modal + scrim | §9.5, NFR-01 | ✅ | Compact: drawer modal + scrim · medium: rail (tombol membuka overlay) · large: drawer permanen, bisa diciutkan. Tampilan dasar murni CSS media query |
| T3-07 | `shell.js`: toggle, `Esc`, simpan preferensi, fokus kembali, `aria-expanded` | P-00 | ✅ | Toggle, Esc, klik scrim, preferensi disimpan (try/catch), fokus masuk ke drawer & kembali ke tombol, `inert` pada konten, `aria-expanded` sinkron |
| T3-08 | `shell.js`: menu aktif (`aria-current`) | NFR-04 | ✅ | Dari `<body data-page>` → `aria-current=page` + ikon terisi (terverifikasi di DOM) |
| T3-09 | Uji 5 breakpoint & navigasi keyboard | NFR-01, TC-04 | ✅ | Screenshot 360/600/840/1200/1440 + 4 status interaksi (Chrome headless). Fokus & Esc diuji lewat skrip. Temuan: label rail terpotong → label pendek; fokus drawer → diperbaiki |
| T3-R1 | Uji tahap | §14 | ✅ | W3C HTML 0 error/0 peringatan, CSS 0 error, console 0 error, 0 warna mentah, 5 breakpoint rapi |
| T3-R2 | Catat log & ringkasan | §15 | ✅ | F-49…F-56 |
| T3-R3 | Review pengembang → audit → commit & push (+ kirim M2 👤) | D-16, §15.1 | ✅ | Disetujui 23 Sep 2026. Kirim M2 ke LMS 👤 (tenggat pekan ke-5) |

---

## T4 — Lapisan Data & Modul Inti
Ref: [perencanaan §7](perencanaan.md#7-model-data--aturan-bisnis), [§10.2–10.4](perencanaan.md#102-urutan-pemuatan-script) · **Output:** `assets/js/core/{rules,seed,store,ui,shell}.js`

| ID | Tugas | Ref | Status | Catatan |
|---|---|---|---|---|
| T4-01 | `rules.js`: konstanta sekolah, jalur, kuota, jadwal, status, berkas wajib, `PPDB.now()` | §7.2–§7.4, D-12 | ⬜ | |
| T4-02 | `rules.js`: validator murni BR-01…BR-06 | BR-01…BR-06 | ⬜ | |
| T4-03 | `rules.js`: skor prestasi, peringkat per jalur, keketatan, batas sementara | BR-04, BR-09…BR-11 | ⬜ | |
| T4-04 | `seed.js`: generator deterministik ±900 pendaftar | §7.6 | ⬜ | |
| T4-05 | Cek proporsi seed: setiap jalur melebihi kuota setelah verifikasi | §7.6 | ⬜ | |
| T4-06 | `store.js`: baca/tulis aman + fallback memori | R-04 | ⬜ | |
| T4-07 | `store.js`: CRUD pendaftar, no. daftar otomatis, riwayat verifikasi | BR-07, FR-12 | ⬜ | |
| T4-08 | `store.js`: log aktivitas (≤ 100) & reset | BR-12, FR-17, FR-18 | ⬜ | |
| T4-09 | `ui.js`: escape, format tanggal/angka/jarak, snackbar (+Urungkan), dialog konfirmasi | §9.7 | ⬜ | |
| T4-10 | `shell.js`: auth guard, login/logout, sesi (ingat saya), nama panitia | FR-01, FR-02 | ⬜ | |
| T4-11 | `shell.js`: badge menu "Verifikasi" dari data | §6.1, AS-02 | ⬜ | |
| T4-12 | Uji modul lewat console, termasuk skenario TC-17 di level data | TC-17 | ⬜ | |
| T4-13 | `store.js` sebagai antarmuka + adapter `adapters/local.js` (halaman tidak mengakses `localStorage` langsung) | D-21 | ⬜ | Persiapan migrasi Fase 2 |
| T4-14 | Ekspor & impor cadangan data (JSON), dengan validasi struktur saat impor | D-21 | ⬜ | Memindahkan data antar-browser/laptop demo |
| T4-R1 | Uji tahap | §14 | ⬜ | |
| T4-R2 | Catat log & ringkasan | §15 | ⬜ | |
| T4-R3 | Review pengembang → commit | D-16 | ⬜ | |

---

## T5 — Halaman Login
Ref: [perencanaan P-01](perencanaan.md#p-01--indexhtml--login-t5) · **Output:** `index.html`, `assets/js/pages/login.js`

| ID | Tugas | Ref | Status | Catatan |
|---|---|---|---|---|
| T5-01 | Struktur semantik `index.html` | P-01, NFR-02 | ⬜ | |
| T5-02 | Panel info: identitas + jadwal (tahap aktif) dari `rules.js` | P-01, AS-02 | ⬜ | |
| T5-03 | Form: username, password, tampilkan password, "Ingat saya" | P-01 | ⬜ | |
| T5-04 | Validasi & pesan error per kolom | FR-01, TC-02 | ⬜ | |
| T5-05 | Proses login, redirect, lewati login jika sesi ada | FR-01, TC-01 | ⬜ | |
| T5-06 | Kotak akun demo + label "Data simulasi" | AS-06 | ⬜ | |
| T5-07 | Responsif (panel info diringkas di compact) | NFR-01 | ⬜ | |
| T5-R1 | Uji tahap + Uji Anti-Slop | §14, §4.3 | ⬜ | |
| T5-R2 | Catat log & ringkasan | §15 | ⬜ | |
| T5-R3 | Review pengembang → commit | D-16 | ⬜ | |

---

## T6 — Dashboard
Ref: [perencanaan P-02](perencanaan.md#p-02--pagesdashboardhtml--dashboard-t6) · **Output:** `pages/dashboard.html`, `assets/js/pages/dashboard.js`

| ID | Tugas | Ref | Status | Catatan |
|---|---|---|---|---|
| T6-01 | Struktur halaman dari `layout.html` | P-02 | ⬜ | |
| T6-02 | Page header + chip tanggal simulasi + aksi utama "Mulai verifikasi (n)" | P-02, AS-04 | ⬜ | |
| T6-03 | 4 KPI dari data | FR-03, AS-02, TC-05 | ⬜ | |
| T6-04 | Grafik batang pendaftar per hari (Chart.js, warna token) | FR-04 | ⬜ | |
| T6-05 | Tabel jalur: kuota, terverifikasi, keketatan, batas sementara, bar | FR-05, BR-11 | ⬜ | |
| T6-06 | Antrean 5 terlama menunggu + tautan ke verifikasi | FR-06 | ⬜ | |
| T6-07 | Jadwal PPDB dengan tahap aktif | FR-06 | ⬜ | |
| T6-08 | Fallback grafik (CDN gagal) + skeleton | R-03 | ⬜ | |
| T6-09 | Responsif | NFR-01 | ⬜ | |
| T6-R1 | Uji tahap + Uji Anti-Slop | §14, §4.3 | ⬜ | |
| T6-R2 | Catat log & ringkasan | §15 | ⬜ | |
| T6-R3 | Review pengembang → commit | D-16 | ⬜ | |

---

## T7 — Data Pendaftar
Ref: [perencanaan P-03](perencanaan.md#p-03--pagesdata-masterhtml--data-pendaftar-t7) · **Output:** `pages/data-master.html`, `assets/js/pages/data-master.js`

| ID | Tugas | Ref | Status | Catatan |
|---|---|---|---|---|
| T7-01 | Struktur halaman + aksi header (satu tombol filled) | P-03, AS-04 | ⬜ | |
| T7-02 | Tab status + jumlah | FR-07 | ⬜ | |
| T7-03 | Toolbar: cari (debounce), filter jalur & sekolah, chip filter aktif | FR-07, TC-06, TC-07 | ⬜ | |
| T7-04 | Tabel + kolom jarak/skor sesuai jalur | FR-07 | ⬜ | |
| T7-05 | Sort kolom + `aria-sort` | FR-07 | ⬜ | |
| T7-06 | Paginasi + info jumlah | FR-07, R-06 | ⬜ | |
| T7-07 | Dialog detail + tautan ke Verifikasi & Bukti | FR-08 | ⬜ | |
| T7-08 | Hapus + dialog konfirmasi + snackbar "Urungkan" | FR-09, TC-08 | ⬜ | |
| T7-09 | Ekspor CSV sesuai filter | FR-16, TC-21 | ⬜ | |
| T7-10 | Reset data simulasi | FR-17, TC-22 | ⬜ | |
| T7-11 | Filter lewat parameter URL | P-03 | ⬜ | |
| T7-12 | Tampilan kartu di compact | NFR-01, R-05 | ⬜ | |
| T7-13 | Empty state | §9.7 | ⬜ | |
| T7-R1 | Uji tahap + Uji Anti-Slop | §14, §4.3 | ⬜ | |
| T7-R2 | Catat log & ringkasan | §15 | ⬜ | |
| T7-R3 | Review pengembang → commit | D-16 | ⬜ | |

---

## T8 — Form Tambah/Edit (Stepper)
Ref: [perencanaan P-04](perencanaan.md#p-04--pagesformhtml--tambahedit-pendaftar-t8), [§7.5](perencanaan.md#75-aturan-bisnis-br) · **Output:** `pages/form.html`, `assets/js/pages/form.js`

| ID | Tugas | Ref | Status | Catatan |
|---|---|---|---|---|
| T8-01 | Struktur + stepper 4 langkah | P-04 | ⬜ | |
| T8-02 | Langkah 1: Identitas | P-04 | ⬜ | |
| T8-03 | Langkah 2: Domisili & jalur (radio-card berisi kuota & syarat) | P-04 | ⬜ | |
| T8-04 | Langkah 3: Akademik, rata-rata rapor otomatis, prestasi | P-04, BR-04 | ⬜ | |
| T8-05 | Langkah 4: Berkas (mengikuti jalur) + ringkasan isian | BR-05, TC-12 | ⬜ | |
| T8-06 | Validasi saat blur & per langkah | BR-01, BR-02, BR-06, TC-09, TC-10 | ⬜ | |
| T8-07 | Validasi lintas kolom (zonasi–KK, prestasi) | BR-03, BR-04, TC-11 | ⬜ | |
| T8-08 | Validasi berkas (jenis & ukuran) | BR-05, TC-13 | ⬜ | |
| T8-09 | Aksesibilitas error: `aria-invalid`, `aria-describedby`, fokus ke error pertama | NFR-04 | ⬜ | |
| T8-10 | Simpan: no. daftar, log, snackbar, redirect | FR-10, TC-14 | ⬜ | |
| T8-11 | Mode edit via `?id=` | FR-11 | ⬜ | |
| T8-12 | Peringatan meninggalkan halaman yang belum disimpan | P-04 | ⬜ | |
| T8-R1 | Uji tahap + Uji Anti-Slop | §14, §4.3 | ⬜ | |
| T8-R2 | Catat log & ringkasan | §15 | ⬜ | |
| T8-R3 | Review pengembang → commit | D-16 | ⬜ | |

---

## T9 — Verifikasi Berkas
Ref: [perencanaan P-05](perencanaan.md#p-05--pagesverifikasihtml--verifikasi-berkas-t9), [§6.4](perencanaan.md#64-alur-kerja-utama-verifikasi-berkas) · **Output:** `pages/verifikasi.html`, `assets/js/pages/verifikasi.js`

| ID | Tugas | Ref | Status | Catatan |
|---|---|---|---|---|
| T9-01 | Struktur 3 panel + responsif (bertumpuk di compact) | P-05, NFR-01 | ⬜ | |
| T9-02 | Antrean terlama dulu + cari | FR-12 | ⬜ | |
| T9-03 | Tab berkas + panel pratinjau jujur | AS-01, AS-06 | ⬜ | |
| T9-04 | Panel data isian pendaftar untuk pembanding | FR-12 | ⬜ | |
| T9-05 | Checklist per berkas; "Terverifikasi" aktif hanya jika semua berkas wajib sesuai | FR-12, TC-15 | ⬜ | |
| T9-06 | Catatan wajib untuk perbaikan/tolak + dialog konfirmasi tolak | BR-08, TC-16 | ⬜ | |
| T9-07 | Simpan keputusan: riwayat, log, snackbar, lanjut antrean, badge menu | FR-12, FR-18 | ⬜ | |
| T9-08 | `?id=` untuk pendaftar tertentu + empty state antrean habis | P-05 | ⬜ | |
| T9-R1 | Uji tahap + Uji Anti-Slop | §14, §4.3 | ⬜ | |
| T9-R2 | Catat log & ringkasan | §15 | ⬜ | |
| T9-R3 | Review pengembang → commit | D-16 | ⬜ | |

---

## T10 — Hasil & Peringkat
Ref: [perencanaan P-06](perencanaan.md#p-06--pageshasil-seleksihtml--hasil--peringkat-t10), BR-09…BR-11 · **Output:** `pages/hasil-seleksi.html`, `assets/js/pages/hasil-seleksi.js`

| ID | Tugas | Ref | Status | Catatan |
|---|---|---|---|---|
| T10-01 | Struktur + tab jalur | P-06 | ⬜ | |
| T10-02 | Ringkasan: kuota, terverifikasi, keketatan, batas sementara | FR-05, BR-11 | ⬜ | |
| T10-03 | Tabel peringkat + baris garis batas + status masuk/tergeser | FR-13, BR-10 | ⬜ | |
| T10-04 | Cari nama → gulir & sorot baris | TC-18 | ⬜ | |
| T10-05 | Filter "sekitar garis batas" | P-06 | ⬜ | |
| T10-06 | Ekspor CSV peringkat | FR-16 | ⬜ | |
| T10-07 | Label "sementara" + keterangan dasar peringkat | AS-06, BR-10 | ⬜ | |
| T10-08 | Uji TC-17 end-to-end (verifikasi → peringkat berubah) | TC-17 | ⬜ | |
| T10-R1 | Uji tahap + Uji Anti-Slop | §14, §4.3 | ⬜ | |
| T10-R2 | Catat log & ringkasan | §15 | ⬜ | |
| T10-R3 | Review pengembang → commit | D-16 | ⬜ | |

---

## T11 — Laporan & Bukti Pendaftaran
Ref: [perencanaan P-07](perencanaan.md#p-07--pageslaporanhtml--rekap--cetak-t11), [P-08](perencanaan.md#p-08--pagesbuktihtmlid--bukti-pendaftaran-t11) · **Output:** `pages/laporan.html`, `pages/bukti.html`, JS masing-masing, `assets/css/print.css`

| ID | Tugas | Ref | Status | Catatan |
|---|---|---|---|---|
| T11-01 | `laporan.html`: struktur, filter, validasi rentang tanggal | P-07, TC-19 | ⬜ | |
| T11-02 | Rekap per jalur | FR-14 | ⬜ | |
| T11-03 | 10 asal sekolah terbanyak & rekap per hari | FR-14 | ⬜ | |
| T11-04 | Log aktivitas | FR-14, BR-12 | ⬜ | |
| T11-05 | Ekspor CSV rekap | FR-16 | ⬜ | |
| T11-06 | `print.css`: kop fiktif, tanda tangan kosong, A4 | FR-15, D-17, TC-20 | ⬜ | |
| T11-07 | `bukti.html`: identitas, jalur, berkas, jadwal, catatan simulasi | P-08, AS-06 | ⬜ | |
| T11-08 | Bukti: cetak + pesan jika `id` tidak ditemukan | FR-15 | ⬜ | |
| T11-R1 | Uji tahap + Uji Anti-Slop | §14, §4.3 | ⬜ | |
| T11-R2 | Catat log & ringkasan | §15 | ⬜ | |
| T11-R3 | Review pengembang → commit | D-16 | ⬜ | |

---

## T12 — QA Menyeluruh
Ref: [perencanaan §12](perencanaan.md#12-strategi-pengujian), [§5.3 NFR](perencanaan.md#53-kebutuhan-non-fungsional-nfr)

| ID | Tugas | Ref | Status | Catatan |
|---|---|---|---|---|
| T12-01 | Responsif 5 breakpoint di semua halaman | NFR-01 | ⬜ | |
| T12-02 | Chrome, Edge, Firefox | A-03 | ⬜ | |
| T12-03 | W3C HTML semua file | NFR-03 | ⬜ | |
| T12-04 | W3C CSS | NFR-03 | ⬜ | |
| T12-05 | Console bersih di semua halaman | NFR-06 | ⬜ | |
| T12-06 | Audit tag semantik | NFR-02 | ⬜ | |
| T12-07 | Keyboard & indikator fokus | NFR-04 | ⬜ | |
| T12-08 | Kontras + Lighthouse Accessibility ≥ 90 | NFR-04 | ⬜ | |
| T12-09 | Tidak ada nilai HEX di luar `tokens.css` (grep) | NFR-05 | ⬜ | |
| T12-10 | Uji Anti-Slop ulang semua halaman | NFR-08, §4.3 | ⬜ | |
| T12-11 | Jalankan TC-01…TC-23 (hasil di tabel bawah) | §12.2 | ⬜ | |
| T12-12 | Rapikan kode & hapus kode mati | NFR-07 | ⬜ | |
| T12-R1 | Uji tahap | §14 | ⬜ | |
| T12-R2 | Catat log & ringkasan | §15 | ⬜ | |
| T12-R3 | Review pengembang → commit | D-16 | ⬜ | |

**Hasil kasus uji** (diisi di T12-11. Kolom "Pertama diuji" boleh diisi lebih awal di tahap terkait):

| TC | Skenario ringkas | Tahap terkait | Pertama diuji | Hasil T12 |
|---|---|---|---|---|
| TC-01 | Login benar | T5 | – | ⬜ |
| TC-02 | Login kosong/salah | T5 | – | ⬜ |
| TC-03 | Halaman admin tanpa sesi | T4 | – | ⬜ |
| TC-04 | Drawer/rail/modal per lebar layar | T3 | ✅ T3 (23 Sep) | ⬜ |
| TC-05 | KPI = jumlah di Data Pendaftar | T6 | – | ⬜ |
| TC-06 | Cari NISN | T7 | – | ⬜ |
| TC-07 | Filter berlapis + chip | T7 | – | ⬜ |
| TC-08 | Hapus lalu Urungkan | T7 | – | ⬜ |
| TC-09 | Lanjut langkah dengan kolom kosong | T8 | – | ⬜ |
| TC-10 | NISN duplikat | T8 | – | ⬜ |
| TC-11 | Zonasi dengan KK < 1 tahun | T8 | – | ⬜ |
| TC-12 | Ganti jalur ke afirmasi → KIP wajib | T8 | – | ⬜ |
| TC-13 | Berkas salah jenis/terlalu besar | T8 | – | ⬜ |
| TC-14 | Simpan pendaftar baru | T8 | – | ⬜ |
| TC-15 | Tombol terverifikasi nonaktif jika berkas belum dicentang | T9 | – | ⬜ |
| TC-16 | Perbaikan/tolak tanpa catatan | T9 | – | ⬜ |
| TC-17 | Verifikasi mengubah peringkat | T4, T10 | – | ⬜ |
| TC-18 | Cari nama di peringkat | T10 | – | ⬜ |
| TC-19 | Rentang tanggal laporan terbalik | T11 | – | ⬜ |
| TC-20 | Cetak laporan & bukti | T11 | – | ⬜ |
| TC-21 | Ekspor CSV | T7, T10, T11 | – | ⬜ |
| TC-22 | Reset data simulasi | T7 | – | ⬜ |
| TC-23 | Logout | T4 | – | ⬜ |

---

## T13 — README, Deploy & Presentasi
Ref: [perencanaan §2](perencanaan.md#2-ketentuan-tugas--pemetaan-penilaian), G-06

| ID | Tugas | Ref | Status | Catatan |
|---|---|---|---|---|
| T13-01 | `README.md`: deskripsi, fitur, teknologi, struktur, cara menjalankan, akun demo | G-06 | ⬜ | |
| T13-02 | Screenshot akhir desktop & mobile ke `docs/img/hasil/` | – | ⬜ | |
| T13-03 | Tautkan GitHub & Vercel di README dan `perancangan.md` | – | ⬜ | |
| T13-04 | Push ke GitHub | D-09 | ⬜ | 👤 Butuh T0-06 |
| T13-05 | Deploy Vercel (statis, tanpa build) | D-09 | ⬜ | 👤 |
| T13-06 | Uji semua halaman di URL Vercel | – | ⬜ | |
| T13-07 | Naskah demo 5–7 menit | §2.2 | ⬜ | |
| T13-08 | Siapkan jawaban tanya-jawab (tema, anti-slop, data, validasi) | §2.2 | ⬜ | |
| T13-09 | Kirim link final ke LMS Mentari | §2.1 | ⬜ | 👤 Tenggat pekan ke-7 |
| T13-10 | Domain kustom di Vercel (DNS + HTTPS otomatis) | D-19 | 🚫 | Dipindah ke T14-11 (setelah database) |
| T13-11 | `vercel.json`: header keamanan | D-19, D-18 | 🚫 | Dipindah ke T14-12 |
| T13-12 | Audit produksi | D-19, AS-06 | 🚫 | Dipindah ke T14-13 |
| T13-13 | Tandai rilis `v1.0-tugas` (git tag): versi yang dikumpulkan, murni client-side | D-21 | ⬜ | Sebelum mulai T14 |
| T13-R1 | Uji tahap | §14 | ⬜ | |
| T13-R2 | Catat log & ringkasan | §15 | ⬜ | |
| T13-R3 | Review pengembang → commit final | D-16 | ⬜ | |

---

## T14 — Database & Hosting Produksi (Fase 2)
Ref: [perencanaan D-21](perencanaan.md#3-keputusan--asumsi), D-19, R-08 · **Dikerjakan setelah tugas dikumpulkan (T13-13).** **Output:** skema SQL, `assets/js/core/adapters/supabase.js`, domain produksi

| ID | Tugas | Ref | Status | Catatan |
|---|---|---|---|---|
| T14-01 | Buat proyek Supabase (region Singapura) | D-21 | ⬜ | 👤 Akun milik pengembang |
| T14-02 | Skema tabel dari ERD + file migrasi SQL di repo | D-21, §7.1 | ⬜ | Tanpa data rahasia di file |
| T14-03 | Row Level Security: hanya panitia yang login bisa membaca & menulis | D-21, R-08 | ⬜ | |
| T14-04 | Supabase Auth untuk akun panitia (menggantikan login simulasi) | D-21, FR-01 | ⬜ | |
| T14-05 | Adapter `adapters/supabase.js` dengan antarmuka yang sama seperti `local.js` | D-21 | ⬜ | Halaman tidak perlu diubah |
| T14-06 | Isi database dengan data simulasi (seed) | D-21, §7.6 | ⬜ | Tetap fiktif |
| T14-07 | Storage berkas: bucket privat, maks. 2 MB, PDF/JPG/PNG | D-21, BR-05 | ⬜ | Upload berkas sungguhan |
| T14-08 | UI untuk memuat, error, dan offline (skeleton, snackbar, coba lagi) | D-21, NFR-06 | ⬜ | |
| T14-09 | Audit rahasia: hanya URL + kunci publik di klien. `service_role` tidak pernah di repo/klien | R-08, D-18 | ⬜ | |
| T14-10 | Uji ulang TC-01…TC-23 memakai database | §12.2 | ⬜ | |
| T14-11 | Domain kustom di Vercel (DNS + HTTPS otomatis) | D-19 | ⬜ | 👤 Domain milik pengembang. Pindahan dari T13-10 |
| T14-12 | `vercel.json`: header keamanan (CSP mengizinkan domain Supabase, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`) | D-19, D-18 | ⬜ | Uji di securityheaders.com. Pindahan dari T13-11 |
| T14-13 | Audit produksi: HTTPS aktif, label "Data simulasi" tampil, RLS teruji dari akun anonim | D-19, AS-06 | ⬜ | Pindahan dari T13-12 |
| T14-R1 | Uji tahap | §14 | ⬜ | |
| T14-R2 | Catat log & ringkasan | §15 | ⬜ | |
| T14-R3 | Review pengembang → audit → commit & push | D-16, §15.1 | ⬜ | |

---

## Log Perubahan File

Setiap file yang **dibuat, diubah, dihapus, dipindah, atau disalin** dicatat di sini, satu baris per file.
Jenis: `CREATE` · `UPDATE` · `DELETE` · `RENAME` · `COPY`. Nomor `F-xx` terus bertambah dan tidak pernah dipakai ulang.
> Catatan: ID tugas pada F-01…F-16 memakai penomoran checklist v0.1.

| No | Tanggal | Jenis | File | ID tugas | Alasan |
|---|---|---|---|---|---|
| F-01 | 23 Sep 2026 | DELETE | `assets/css/style.css` | T0-09 | Draf tema kaca dibuat sebelum perencanaan. Tema diganti ke M3 |
| F-02 | 23 Sep 2026 | DELETE | `assets/img/logo.svg` | T0-09 | Logo sementara, akan dibuat ulang sesuai identitas baru |
| F-03 | 23 Sep 2026 | DELETE | `assets/js/app.js` | T0-09 | Draf. Ditulis ulang sesuai rencana v0.2 |
| F-04 | 23 Sep 2026 | DELETE | `assets/js/data.js` | T0-09 | Draf. Kuota & struktur data berubah |
| F-05 | 23 Sep 2026 | DELETE | `assets/js/dashboard.js` | T0-09 | Draf. Ditulis ulang |
| F-06 | 23 Sep 2026 | DELETE | `assets/js/master.js` | T0-09 | Draf. Ditulis ulang |
| F-07 | 23 Sep 2026 | DELETE | `assets/js/form.js` | T0-09 | Draf. Form berubah menjadi stepper |
| F-08 | 23 Sep 2026 | DELETE | `pages/dashboard.html` | T0-09 | Draf tema kaca |
| F-09 | 23 Sep 2026 | DELETE | `pages/data-master.html` | T0-09 | Draf tema kaca |
| F-10 | 23 Sep 2026 | DELETE | `pages/form.html` | T0-09 | Draf tema kaca |
| F-11 | 23 Sep 2026 | DELETE | `pages/laporan.html` | T0-09 | Draf tema kaca (script `laporan.js` tidak pernah dibuat) |
| F-12 | 23 Sep 2026 | CREATE | `assets/css/.gitkeep`, `assets/js/.gitkeep`, `assets/img/.gitkeep`, `pages/.gitkeep` | T0-09 | Agar folder kosong tetap terlacak Git |
| F-13 | 23 Sep 2026 | CREATE | `.gitignore` | T0-05 | Mengecualikan bahan Stitch mentah, file editor/OS, build, dan deploy |
| F-14 | 23 Sep 2026 | COPY | `docs/img/referensi-stitch/01-login.png` … `08-logo.png` (8 file) | T0-10 | Screenshot referensi desain untuk dokumentasi M1 |
| F-15 | 23 Sep 2026 | UPDATE | `docs/checklist_work.md` | T0-09, T0-11 | Status draf direset, T0-09…T0-11 ditambah, bagian ini dibuat |
| F-16 | 23 Sep 2026 | UPDATE | `docs/perencanaan.md` | T0-09 | D-10 & Riwayat Perubahan (v0.1.1) |
| F-17 | 23 Sep 2026 | UPDATE | `docs/perencanaan.md` | T0-11 | **Ditulis ulang ke v0.2:** M3, anti-slop (§4), menu 7 item, halaman P-00…P-08, BR baru, design system M3, tahap T0–T13 |
| F-18 | 23 Sep 2026 | UPDATE | `docs/checklist_work.md` | T0-12 | **Disusun ulang ke v0.2:** tugas T1–T13 baru (192 tugas), rutinitas R1–R3, tabel hasil TC, posisi saat ini. Log lama dipertahankan |
| F-19 | 23 Sep 2026 | UPDATE | `.gitignore` | T0-13 | Tambah pola rahasia (`.env`, `*.pem`, `*.key`, `credentials*.json`, `secrets/`) & ekspor data (`*.zip`, `*.csv`, `*.xlsx`) |
| F-20 | 23 Sep 2026 | UPDATE | `docs/perencanaan.md` | T0-13 | v0.2.1: D-18 keamanan repo publik, §15.1 audit S-01…S-07, R3 mencakup audit & push, status "disetujui" |
| F-21 | 23 Sep 2026 | UPDATE | `docs/checklist_work.md` | T0-R3 | T0 ditutup (17/17), T0-13 & T0-14 ditambah, posisi saat ini → T1 |
| F-22 | 23 Sep 2026 | UPDATE | `docs/checklist_work.md` | T0-07, T0-R3 | Koreksi setelah push gagal: T0 15/17, B-03 ditambah, posisi saat ini dikembalikan ke T0 |
| F-23 | 23 Sep 2026 | UPDATE | `docs/checklist_work.md` | T0-R3 | T0 ditutup (17/17) setelah push berhasil, B-03 selesai, email commit final dicatat, posisi saat ini → T1 |
| F-24 | 23 Sep 2026 | UPDATE | `docs/checklist_work.md` | T0-14 | Identitas commit diganti ke `nurdinrhk-design`. Hash commit T0 diperbarui (`dd57340` → `1a0d182`, `0188e14` → `fb8bf8e`) |
| F-25 | 23 Sep 2026 | UPDATE | `docs/perencanaan.md` | – | v0.2.2: nama pengembang → Nurdin (5 tempat). Tambah D-19 hosting lanjutan (domain & header keamanan) |
| F-26 | 23 Sep 2026 | UPDATE | `docs/checklist_work.md` | T13-10…T13-12 | Tambah 3 tugas opsional hosting/domain. Total tugas 194 → 197 |
| F-27 | 23 Sep 2026 | CREATE | `docs/perancangan.md` | T1-01…T1-11, T1-18 | Deliverable M1: ringkasan sistem, alasan tema M3, menu & sitemap, 4 user flow, ERD + kamus data, jalur/kuota/jadwal, 10 wireframe, design system, galeri & review Stitch, placeholder Figma |
| F-28 | 23 Sep 2026 | UPDATE | `docs/checklist_work.md` | T1-R2 | Status T1 (14/22), posisi saat ini, log F-27/F-28 |
| F-29 | 23 Sep 2026 | UPDATE | `docs/perencanaan.md` | T1-12…T1-17 | v0.2.3: D-20 tanpa Figma (link Stitch sebagai gantinya). Rujukan Figma di §2, §8, §9, §10.1, §11, R-01 disesuaikan |
| F-30 | 23 Sep 2026 | UPDATE | `docs/perancangan.md` | T1-17 | §8 menjadi "Proses Desain", §8.2 "Dari desain ke kode" + tempat link Stitch. Rujukan Figma dihapus |
| F-31 | 23 Sep 2026 | UPDATE | `docs/checklist_work.md` | T1-12…T1-17 | Status 🚫 ditambahkan. T1-12…T1-16 dibatalkan, T1-17 menjadi link Stitch. Total 197 → 192 (tanpa 🚫). B-01 selesai |
| F-32 | 23 Sep 2026 | UPDATE | `docs/perencanaan.md` | T4-13, T4-14, T14 | v0.2.4: D-21 database dua fase, tahap T14, R-08, pola rahasia Supabase di S-02, `adapters/` di §10.1 |
| F-33 | 23 Sep 2026 | UPDATE | `docs/checklist_work.md` | T4-13, T4-14, T13-13, T14 | Tambah T4-13/14 (adapter, cadangan JSON), T13-13 (tag `v1.0-tugas`), tahap T14 (16 tugas). T13-10…12 dipindah ke T14 (🚫). Total 192 → 208 |
| F-34 | 23 Sep 2026 | UPDATE | `docs/checklist_work.md` | T1-R3 | T1 ditutup (15/17, sisa 2 tugas 👤), posisi saat ini → T2 |
| F-35 | 23 Sep 2026 | UPDATE | `docs/perancangan.md` | T1-17 | Link publik proyek Google Stitch ditempel di tabel identitas & §8.2 |
| F-36 | 23 Sep 2026 | CREATE | `assets/css/tokens.css` | T2-01…T2-03 | Semua design token M3 (warna, status, grafik, tipografi, jarak, bentuk, elevasi, gerak, layout). Satu-satunya file berisi nilai warna |
| F-37 | 23 Sep 2026 | CREATE | `assets/css/main.css` | T2-04 | Titik masuk CSS: `@import` token → base → komponen |
| F-38 | 23 Sep 2026 | CREATE | `assets/css/base.css` | T2-04 | Reset, tipografi dasar, fokus keyboard, ikon Material Symbols, utilitas, reduced-motion |
| F-39 | 23 Sep 2026 | CREATE | `assets/css/components.css` | T2-05…T2-09 | 14 kelompok komponen M3 (BEM) |
| F-40 | 23 Sep 2026 | CREATE | `assets/img/logo.svg` | T2-10 | Logo fiktif + favicon |
| F-41 | 23 Sep 2026 | CREATE | `docs/styleguide.html` | T2-11 | Etalase design system (pengganti Figma, D-20) |
| F-42 | 23 Sep 2026 | CREATE | `docs/styleguide.css` | T2-11 | Tata letak khusus halaman styleguide (hanya token) |
| F-43 | 23 Sep 2026 | CREATE | `docs/styleguide.js` | T2-11 | Swatch & uji kontras langsung dari token, demo chip/tabs/sort/dialog/snackbar |
| F-44 | 23 Sep 2026 | DELETE | `assets/css/.gitkeep`, `assets/img/.gitkeep` | T2-R1 | Folder sudah berisi file, penanda tidak diperlukan |
| F-45 | 23 Sep 2026 | UPDATE | `docs/perencanaan.md` | T2-03 | v0.2.5: nilai token hasil uji kontras (§9.1) |
| F-46 | 23 Sep 2026 | UPDATE | `docs/perancangan.md` | T2-03 | §7.1: outline #8391A7, on-surface-muted, catatan uji kontras |
| F-47 | 23 Sep 2026 | UPDATE | `docs/checklist_work.md` | T2-R2 | T1-17 & T2 (14/15) ditandai, posisi saat ini, log |
| F-48 | 23 Sep 2026 | UPDATE | `docs/checklist_work.md` | T2-R3 | T2 ditutup (15/15), posisi → T3 |
| F-49 | 23 Sep 2026 | CREATE | `assets/css/layout.css` | T3-02…T3-06 | App shell: drawer/rail/modal, top app bar, konten, page header, grid, footer |
| F-50 | 23 Sep 2026 | UPDATE | `assets/css/main.css` | T3-01 | Tambah `@import layout.css` (urutan token → base → layout → komponen) |
| F-51 | 23 Sep 2026 | CREATE | `assets/js/core/shell.js` | T3-07, T3-08 | Navigasi adaptif, menu akun, menu aktif (`PPDB.shell`) |
| F-52 | 23 Sep 2026 | CREATE | `layout.html` | T3-01…T3-05 | Template master Milestone 2 |
| F-53 | 23 Sep 2026 | DELETE | `assets/js/.gitkeep` | T3-R1 | Folder `js/` sudah berisi file |
| F-54 | 23 Sep 2026 | UPDATE | `docs/perencanaan.md` | T3-09 | v0.2.6: label pendek mode rail (§6.1) |
| F-55 | 23 Sep 2026 | UPDATE | `docs/perancangan.md` | T3-09 | §3.1: catatan label pendek mode rail |
| F-56 | 23 Sep 2026 | UPDATE | `docs/checklist_work.md` | T3-R2 | T3 (11/12), TC-04, posisi, log |
| F-57 | 23 Sep 2026 | UPDATE | `docs/checklist_work.md` | T3-R3 | T3 ditutup (12/12), posisi → menunggu aba-aba T4 |

**Isi proyek saat ini (di luar `.git` dan bahan Stitch):**
```
PROGRAMWEB_2/
├── .gitignore
├── layout.html                  (template master, M2)
├── assets/
│   ├── css/  main.css · tokens.css · base.css · layout.css · components.css
│   ├── js/core/shell.js
│   └── img/  logo.svg
├── docs/
│   ├── perencanaan.md          (v0.2.6)
│   ├── checklist_work.md       (v0.2)
│   ├── perancangan.md          (M1)
│   ├── styleguide.html / .css / .js   (etalase design system, M2)
│   └── img/referensi-stitch/   (8 screenshot)
└── pages/.gitkeep
```

---

## Blocker & Pertanyaan Terbuka

| ID | Deskripsi | Memblokir | Status | Penyelesaian |
|---|---|---|---|---|
| B-01 | Desain dari pengembang | T1–T3 | ✅ Selesai | Referensi Stitch diterima 23 Sep 2026. Figma dibatalkan (D-20). Tinggal link publik Stitch (T1-17) |
| B-02 | Tema visual belum ditentukan | T2 | ✅ Selesai | D-01: Material Design 3 |
| B-03 | **Push ditolak (403).** Kredensial Git di komputer ini adalah akun `fahrizal-tech`, yang tidak punya hak tulis ke `nurdinrhk-design/PROGRAMWEB_2` | T0-07, T0-R3, semua push berikutnya | ✅ Selesai | Kedua akun milik pengembang. `fahrizal-tech` ditambahkan sebagai collaborator. Push berhasil |
| Q-01 | `localStorage` atau Google Spreadsheet? | T4 | ✅ Selesai | D-03: `localStorage` |
| Q-02 | CSS murni atau Tailwind? | T2 | ✅ Selesai | D-04: CSS murni modular |
| Q-03 | Nama sekolah? | T1 | ✅ Selesai | D-02: SMA Negeri 1 Harapan Bangsa (fiktif) |
| Q-04 | Istilah PPDB atau SPMB? | T1, T4 | ✅ Selesai | D-11: PPDB + 4 jalur |
| Q-05 | Periode tetap atau tanggal relatif? | T4 | ✅ Selesai | D-12: tanggal simulasi 18 Juni 2026 |
| Q-06 | Berhenti untuk review di tiap tahap? | Semua | ✅ Selesai | D-16: ya |

---

## Log Kerja

Satu baris per sesi kerja.
> Catatan: ID tugas pada baris sebelum revisi v0.2 memakai penomoran checklist v0.1.

| Tanggal | ID tugas | Aktivitas | Hasil / status |
|---|---|---|---|
| 23 Sep 2026 | T0-02 | Membuat struktur folder proyek | ✅ |
| 23 Sep 2026 | (v0.1) T3, T4, T5 | Membuat kode draf (CSS, JS, 4 halaman) sebelum sesi perencanaan | Kemudian dihapus (T0-09) |
| 23 Sep 2026 | – | Diskusi perencanaan. Disepakati membuat dokumen perencanaan & checklist lebih dulu | – |
| 23 Sep 2026 | T0-03, T0-04 | Membuat `perencanaan.md` & `checklist_work.md` yang saling terhubung | ✅ |
| 23 Sep 2026 | (v0.1) T2-08 | Review desain Stitch. Ditemukan: 2 `DESIGN.md` bertentangan (SIAKAD vs PPDB), identitas & angka tidak konsisten, metrik/integrasi palsu, teks terpotong, tabel meluber, hanya versi desktop | Keputusan: desain dijadikan acuan dan boleh diimprovisasi |
| 23 Sep 2026 | T0-05, T0-09, T0-10 | **Bersih-bersih lingkungan kerja:** hapus 11 file draf, tambah `.gitkeep`, buat `.gitignore`, salin screenshot referensi | ✅ Lingkungan steril (F-01…F-16) |
| 23 Sep 2026 | T0-08, T0-11, T0-12, T0-R1, T0-R2 | **Revisi rencana v0.2** sesuai rekomendasi yang disetujui: tema M3, prinsip anti-slop, identitas & kuota, tanggal simulasi, 9 halaman (P-00…P-08), 14 tahap (T0–T13). Checklist disusun ulang | ✅ Menunggu review (T0-R3) (F-17, F-18) |
| 23 Sep 2026 | T0-13, T0-14, T0-R3 | Pengembang menyetujui v0.2. **Audit keamanan** 15 file: tanpa kunci/token/kata sandi nyata, tanpa email/no. HP/path lokal di file, PNG tanpa metadata, kredensial demo sengaja publik. **Temuan:** email pribadi akan tercatat di commit publik → diganti email noreply (config lokal repo; bukan file, jadi tidak ada nomor F). Commit pertama lokal | ✅ (F-19…F-21) |
| 23 Sep 2026 | T0-07, T0-R3 | `git push -u origin main` **ditolak 403**: "Permission denied to fahrizal-tech". Tidak ada data yang terkirim ke GitHub. Checklist dikoreksi (T0-07 & T0-R3 → 🟡), blocker B-03 dibuat | ⛔ Diputuskan tetap repo `nurdinrhk-design`. Menunggu hak akses (F-22) |
| 23 Sep 2026 | T0-14, T0-07, T0-R3 | Pengembang mengonfirmasi `nurdinrhk-design` & `fahrizal-tech` sama-sama akunnya, dan `fahrizal-tech` sudah jadi collaborator. Identitas commit diganti ke noreply `fahrizal-tech` (commit lokal di-amend `--reset-author` sebelum push). Audit ulang S-01/S-04/S-07: bersih. **Push berhasil** `dd57340` → `origin/main` | ✅ T0 selesai (F-23) |
| 23 Sep 2026 | T0-14 | Atas permintaan pengembang, identitas commit diganti ke akun kedua miliknya, `nurdinrhk-design` (noreply). 2 commit yang sudah di-push ditulis ulang (`rebase --root --reset-author`), lalu `push --force-with-lease`. Aman karena repo baru dan hanya dipakai pengembang | ✅ (F-24) |
| 23 Sep 2026 | – | Nama pengembang di dokumen diganti menjadi **Nurdin**. Penyebutan akun login `fahrizal-tech` di log teknis sengaja dipertahankan karena push memang dilakukan lewat akun itu. Rencana domain kustom & header keamanan dicatat (D-19, T13-10…T13-12) | ✅ (F-25, F-26) |
| 23 Sep 2026 | T1-01…T1-11, T1-18, T1-R1, T1-R2 | **Membuat `docs/perancangan.md`** dari perencanaan v0.2.2, untuk pembaca dosen. Uji: 6 diagram Mermaid valid (validator Mermaid Chart), 8 gambar ada, 10 anchor valid. Kelurusan wireframe dicek skrip, 5 baris diperbaiki (lebar/kolom) & kolom Status tabel dilebarkan. Bagian Figma masih placeholder | ✅ Menunggu review & Figma 👤 (F-27, F-28) |
| 23 Sep 2026 | T1-12…T1-17 | Pengembang memutuskan **tidak memakai Figma**. Link publik Google Stitch akan ditempel di `perancangan.md`. Risiko nilai M1 dicatat (R-01), mitigasi lewat §7 + `styleguide.html` | ✅ Keputusan D-20 (F-29…F-31) |
| 23 Sep 2026 | T4-13, T4-14, T13-13, T14 | Diskusi database. Keputusan D-21: **Fase 1** `localStorage` + adapter + cadangan JSON (versi tugas, ditandai `v1.0-tugas`). **Fase 2** Supabase sebelum hosting ke domain, tetap data simulasi. Tahap T14 dibuat, tugas domain dipindah dari T13 | ✅ (F-32, F-33) |
| 23 Sep 2026 | T1-R3 | Pengembang menyetujui `perancangan.md`, teknologi (D-04…D-06), dan database dua fase (D-21). Audit keamanan S-01…S-07, lalu commit & push T1 | ✅ (F-34) |
| 23 Sep 2026 | T1-17, T2-01…T2-12, T2-R1, T2-R2 | Link Stitch ditempel. **T2: design system → CSS.** Uji kontras menemukan 3 nilai Stitch gagal WCAG → diperbaiki. `tokens.css`, `base.css`, `components.css` (14 kelompok), `main.css`, logo, `styleguide.html/.css/.js`. Validasi W3C: CSS 0 error (3 error `var()` dalam `calc()` diperbaiki), HTML 0 error (tabpanel & judul KPI ditambah). Dicek di Chrome headless 1280px & 390px, console 0 error | ✅ Menunggu review (F-35…F-47) |
| 23 Sep 2026 | T2-R3 | Pengembang menyetujui tampilan styleguide. Audit keamanan, commit & push T2 | ✅ (F-48) |
| 23 Sep 2026 | T3-01…T3-09, T3-R1, T3-R2 | **T3: layout master.** `layout.html`, `layout.css`, `shell.js`. Navigasi adaptif 3 mode (modal · rail · drawer) diuji di 5 lebar layar + 4 status interaksi. Temuan & perbaikan: label rail terpotong → label pendek (AS-08). Fokus drawer tidak pindah → `focus()` langsung + kembali ke tombol menu. W3C HTML & CSS 0 error, console bersih | ✅ Menunggu review (F-49…F-56) |
| 23 Sep 2026 | T3-R3 | Pengembang menyetujui layout. Audit keamanan, commit & push T3. T4 ditahan sesuai permintaan | ✅ (F-57) |
