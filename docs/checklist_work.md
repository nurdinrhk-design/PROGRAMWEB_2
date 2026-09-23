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

---

## Posisi Saat Ini

| | |
|---|---|
| **Tahap aktif** | **T0 — penutupan tertahan** (push ditolak, lihat B-03). T1 siap dimulai |
| **Tahap terakhir selesai** | – (T0: disetujui, diaudit, di-commit lokal. Push gagal) |
| **Menunggu dari pengembang** | Hak tulis ke repo `nurdinrhk-design/PROGRAMWEB_2` untuk akun `fahrizal-tech` (B-03) |

## Ringkasan Progres

| Tahap | Nama | Milestone | Total | ✅ | ⬜/🔄/⛔ | Progres |
|---|---|---|---|---|---|---|
| [T0](#t0--persiapan--revisi-rencana) | Persiapan & revisi rencana | M1 | 17 | 15 | 2 | 88% |
| [T1](#t1--dokumen-perancangan) | Dokumen perancangan | M1 | 22 | 0 | 22 | 0% |
| [T2](#t2--design-system--css-fondasi--komponen) | Design system → CSS | M2 | 15 | 0 | 15 | 0% |
| [T3](#t3--layout-master-app-shell) | Layout master | M2 | 12 | 0 | 12 | 0% |
| [T4](#t4--lapisan-data--modul-inti) | Data & modul inti | M3 | 15 | 0 | 15 | 0% |
| [T5](#t5--halaman-login) | Login | M3 | 10 | 0 | 10 | 0% |
| [T6](#t6--dashboard) | Dashboard | M3 | 12 | 0 | 12 | 0% |
| [T7](#t7--data-pendaftar) | Data Pendaftar | M3 | 16 | 0 | 16 | 0% |
| [T8](#t8--form-tambahedit-stepper) | Form Tambah/Edit | M3 | 15 | 0 | 15 | 0% |
| [T9](#t9--verifikasi-berkas) | Verifikasi Berkas | M3 | 11 | 0 | 11 | 0% |
| [T10](#t10--hasil--peringkat) | Hasil & Peringkat | M3 | 11 | 0 | 11 | 0% |
| [T11](#t11--laporan--bukti-pendaftaran) | Laporan & Bukti | M3 | 11 | 0 | 11 | 0% |
| [T12](#t12--qa-menyeluruh) | QA menyeluruh | M3 | 15 | 0 | 15 | 0% |
| [T13](#t13--readme-deploy--presentasi) | README, deploy & presentasi | M3 | 12 | 0 | 12 | 0% |
| | **Total** | | **194** | **15** | **179** | **8%** |

**Milestone:** M1 (pekan 3) 🔄 T0 tertahan di push · M2 (pekan 5) ⬜ · M3 (pekan 7) ⬜

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
| T0-06 | Buat repository di GitHub & hubungkan `origin` | D-09 | ✅ | 👤 `origin` = `nurdinrhk-design/PROGRAMWEB_2` (publik, kosong). Hak tulis bermasalah: B-03 |
| T0-07 | Commit pertama (lingkungan bersih + dokumen v0.2.1) & push | §10.3 | 🟡 | Commit lokal ✅ (di-amend dengan koreksi F-22). **Push ditolak 403** (B-03) |
| T0-08 | Tetapkan keputusan D-01…D-17 | §3 | ✅ | Mengikuti rekomendasi, disetujui pengembang 23 Sep 2026 |
| T0-09 | Hapus 11 file kode draf bertema kaca | D-10 | ✅ | F-01…F-12 |
| T0-10 | Salin 8 screenshot referensi Stitch ke `docs/img/referensi-stitch/` | §4.2 | ✅ | F-14 |
| T0-11 | Revisi perencanaan ke v0.2 (M3, anti-slop, menu & halaman baru, T0–T13) | §16 | ✅ | F-17 |
| T0-12 | Susun ulang checklist ke v0.2 | §15 | ✅ | F-18 |
| T0-13 | Audit keamanan sebelum push (S-01…S-07) + perkuat `.gitignore` | D-18, §15.1 | ✅ | Temuan: email pribadi di identitas commit. Diganti noreply. F-19 |
| T0-14 | Atur email commit ke noreply GitHub (lokal repo, bukan global) | D-18 | ✅ | `237171232+nurdinrhk-design@users.noreply.github.com` |
| T0-R1 | Uji tahap: konsistensi ID antara kedua dokumen | §14 | ✅ | Dicek dengan skrip: semua tahap & ID rujukan ditemukan |
| T0-R2 | Catat log & ringkasan progres | §15 | ✅ | |
| T0-R3 | Review pengembang → audit → commit & push | D-16, §15.1 | 🟡 | Disetujui & diaudit ✅. Push tertahan (B-03) |

---

## T1 — Dokumen Perancangan
Ref: [perencanaan §4](perencanaan.md#4-prinsip-desain-anti-ai-slop)–[§9](perencanaan.md#9-design-system-material-design-3) · **Output:** `docs/perancangan.md` (deliverable M1), `docs/img/figma/*`

| ID | Tugas | Ref | Status | Catatan |
|---|---|---|---|---|
| T1-01 | Kerangka `docs/perancangan.md` (identitas, daftar isi) | §2.1 | ⬜ | Nama file sesuai panduan tugas |
| T1-02 | Deskripsi sistem, aktor, skenario penggunaan | §1, §5.1 | ⬜ | |
| T1-03 | Tema terpilih (M3) + alasan + ringkasan prinsip anti-slop | D-01, §4.1 | ⬜ | |
| T1-04 | Hierarki menu & top app bar | §6.1, §6.2 | ⬜ | |
| T1-05 | Sitemap (Mermaid) | §6.3 | ⬜ | |
| T1-06 | User flow verifikasi & input offline (Mermaid) | §6.4, §6.5 | ⬜ | |
| T1-07 | ERD (Mermaid) + kamus data ringkas | §7.1 | ⬜ | |
| T1-08 | Jalur, kuota, jadwal, status | §7.2–§7.4 | ⬜ | |
| T1-09 | Wireframe low-fi tiap halaman (P-01…P-08) | §8 | ⬜ | Diagram teks/Mermaid di markdown |
| T1-10 | Design system: warna, tipografi, bentuk, elevasi, komponen | §9 | ⬜ | |
| T1-11 | Embed screenshot referensi Stitch + tabel keputusan (dipertahankan/diperbaiki/dibuang) | §4.2 | ⬜ | Bukti proses Stitch untuk penilaian M1 |
| T1-12 | Figma: variables/styles warna & tipografi sesuai §9 | §9.1, §9.2 | ⬜ | 👤 Claude bisa membantu lewat Figma jika diminta |
| T1-13 | Figma: komponen (button, field, chip, badge, card, baris tabel, dialog) | §9.7 | ⬜ | 👤 |
| T1-14 | Figma: hi-fi Dashboard | P-02 | ⬜ | 👤 Wajib |
| T1-15 | Figma: hi-fi Data Pendaftar | P-03 | ⬜ | 👤 Wajib |
| T1-16 | Figma: Login, Form, dan versi mobile | P-01, P-04 | ⬜ | 👤 ➖ Nilai tambah |
| T1-17 | Link publik Figma + screenshot di `docs/img/figma/` & di `perancangan.md` | §2.1 | ⬜ | 👤 + Claude |
| T1-18 | Cek semua diagram Mermaid tampil benar | – | ⬜ | Pratinjau GitHub/VS Code |
| T1-19 | Kirim link repo M1 ke LMS Mentari | §2.1 | ⬜ | 👤 Tenggat pekan ke-3 |
| T1-R1 | Uji tahap | §14 | ⬜ | |
| T1-R2 | Catat log & ringkasan | §15 | ⬜ | |
| T1-R3 | Review pengembang → commit | D-16 | ⬜ | |

---

## T2 — Design System → CSS Fondasi & Komponen
Ref: [perencanaan §9](perencanaan.md#9-design-system-material-design-3), [§10.1](perencanaan.md#101-struktur-folder-target) · **Output:** `assets/css/*.css`, `docs/styleguide.html`, `assets/img/logo.svg`

| ID | Tugas | Ref | Status | Catatan |
|---|---|---|---|---|
| T2-01 | `tokens.css`: warna peran M3 & status | §9.1, NFR-05 | ⬜ | |
| T2-02 | `tokens.css`: tipografi, spasi, radius, elevasi, durasi | §9.2–§9.6 | ⬜ | |
| T2-03 | Uji kontras semua pasangan teks/latar (≥ 4.5:1), catat penyesuaian | NFR-04 | ⬜ | Perubahan token dicatat di perencanaan §16 |
| T2-04 | `main.css` (urutan `@import`) + `base.css` (reset, tipografi, fokus) | §10.1 | ⬜ | |
| T2-05 | Komponen: button (filled/tonal/outlined/text/danger/icon) + state layer | §9.4, §9.7 | ⬜ | |
| T2-06 | Komponen: text field, select, textarea, checkbox, radio, radio-card | §9.7 | ⬜ | |
| T2-07 | Komponen: chip, badge status (6), card, KPI card | §9.7, §7.4 | ⬜ | |
| T2-08 | Komponen: data table (sort, baris garis batas, mode kartu), pagination, tabs | §9.7 | ⬜ | |
| T2-09 | Komponen: dialog, snackbar, menu, stepper, linear progress, empty state, skeleton | §9.7 | ⬜ | |
| T2-10 | `logo.svg` sederhana & fiktif + favicon | D-17 | ⬜ | Tanpa lambang pemerintah |
| T2-11 | `docs/styleguide.html`: etalase semua token & komponen | §11.1 | ⬜ | Bukti "Figma-to-code" untuk M2 |
| T2-12 | Validasi W3C CSS | NFR-03 | ⬜ | |
| T2-R1 | Uji tahap | §14 | ⬜ | |
| T2-R2 | Catat log & ringkasan | §15 | ⬜ | |
| T2-R3 | Review pengembang → commit | D-16 | ⬜ | |

---

## T3 — Layout Master (App Shell)
Ref: [perencanaan P-00](perencanaan.md#p-00--layouthtml--template-master-m2-tahap-t3), [§6.1–6.2](perencanaan.md#61-menu-navigation-drawer), [§9.5](perencanaan.md#95-spasi-layout-breakpoint) · **Output:** `layout.html`, `assets/js/core/shell.js` (bagian layout)

| ID | Tugas | Ref | Status | Catatan |
|---|---|---|---|---|
| T3-01 | `layout.html`: kerangka semantik (`aside`, `header`, `main`, `footer`) | P-00, NFR-02 | ⬜ | |
| T3-02 | Navigation drawer: brand, 3 grup menu, badge, "Data simulasi", Keluar | §6.1 | ⬜ | |
| T3-03 | Top app bar 4 elemen + menu akun | §6.2 | ⬜ | |
| T3-04 | Page header, area konten, grid helper | P-00 | ⬜ | |
| T3-05 | Footer ringkas | P-00 | ⬜ | |
| T3-06 | Responsif: drawer permanen / rail / drawer modal + scrim | §9.5, NFR-01 | ⬜ | |
| T3-07 | `shell.js`: toggle, `Esc`, simpan preferensi, fokus kembali, `aria-expanded` | P-00 | ⬜ | |
| T3-08 | `shell.js`: menu aktif (`aria-current`) | NFR-04 | ⬜ | |
| T3-09 | Uji 5 breakpoint & navigasi keyboard | NFR-01, TC-04 | ⬜ | |
| T3-R1 | Uji tahap | §14 | ⬜ | |
| T3-R2 | Catat log & ringkasan | §15 | ⬜ | |
| T3-R3 | Review pengembang → commit (+ kirim M2 👤) | D-16 | ⬜ | Tenggat M2 pekan ke-5 |

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
| TC-04 | Drawer/rail/modal per lebar layar | T3 | – | ⬜ |
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
| T13-R1 | Uji tahap | §14 | ⬜ | |
| T13-R2 | Catat log & ringkasan | §15 | ⬜ | |
| T13-R3 | Review pengembang → commit final | D-16 | ⬜ | |

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

**Isi proyek saat ini (di luar `.git` dan bahan Stitch):**
```
PROGRAMWEB_2/
├── .gitignore
├── assets/
│   ├── css/.gitkeep
│   ├── js/.gitkeep
│   └── img/.gitkeep
├── docs/
│   ├── perencanaan.md          (v0.2)
│   ├── checklist_work.md       (v0.2)
│   └── img/referensi-stitch/   (8 screenshot)
└── pages/.gitkeep
```

---

## Blocker & Pertanyaan Terbuka

| ID | Deskripsi | Memblokir | Status | Penyelesaian |
|---|---|---|---|---|
| B-01 | Desain dari pengembang | T1–T3 | 🟡 Sebagian | Referensi Stitch diterima 23 Sep 2026. Figma belum ada: dijadwalkan di T1-12…T1-17 (👤) |
| B-02 | Tema visual belum ditentukan | T2 | ✅ Selesai | D-01: Material Design 3 |
| B-03 | **Push ditolak (403).** Kredensial Git di komputer ini adalah akun `fahrizal-tech`, yang tidak punya hak tulis ke `nurdinrhk-design/PROGRAMWEB_2` | T0-07, T0-R3, semua push berikutnya | ⛔ Terbuka | Diputuskan: tetap `nurdinrhk-design`. Menunggu pengembang memberi hak tulis ke `fahrizal-tech` (collaborator) atau login Git dengan akun `nurdinrhk-design` |
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
