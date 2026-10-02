# ✅ Checklist Pekerjaan — Admin Panel PPDB Online

> **Dokumen pelacakan (tracker)**, pasangan dari **[perencanaan.md](perencanaan.md)** (v0.3).
> - **Penomoran (D-22):** tahap **1–13**, langkah **x.y**. Langkah terakhir setiap tahap adalah **Penutupan**: uji → catat → review → simpan ([perencanaan §11.3](perencanaan.md#113-langkah-penutupan-setiap-tahap)).
> - Kolom **Ref** menunjuk ke ID di perencanaan.md: `FR` kebutuhan · `NFR` non-fungsional · `BR` aturan bisnis · `AS` anti-slop · `P` halaman · `D` keputusan · `TC` kasus uji · `R` risiko · `§` bagian.
> - Aturan pencatatan: [perencanaan §15](perencanaan.md#15-alur-kerja--aturan-pencatatan). Definition of Done: [§14](perencanaan.md#14-definition-of-done).
> - ID lama (`T0-01`…`T14-R3`) dipakai sampai v0.2. Padanannya ada di [Padanan ID Lama](#padanan-id-lama--baru).

**Versi checklist:** 0.3 · **Terakhir diperbarui:** 2 Oktober 2026

---

## Legenda Status

| Simbol | Arti |
|---|---|
| ⬜ | Belum dikerjakan |
| 🔄 | Sedang dikerjakan |
| 🟡 | Sebagian / draf, belum memenuhi Definition of Done |
| ✅ | Selesai |
| ⛔ | Terblokir (lihat [Blocker](#blocker--pertanyaan-terbuka)) |
| 👤 | Dikerjakan pengembang sendiri (akun GitHub / LMS / domain) |

---

## Posisi Saat Ini

| | |
|---|---|
| **Tahap aktif** | **Tahap 8 — Verifikasi Berkas** (berikutnya) |
| **Tahap terakhir selesai** | Tahap 7 — Form Pendaftar (2 Okt 2026) |
| **Menunggu dari pengembang** | Kirim tautan M1 & M2 ke LMS (2.8, 3.8) |

## Ringkasan Progres

| Tahap | Nama | Milestone | Langkah | ✅ | Sisa | Progres |
|---|---|---|---|---|---|---|
| [1](#tahap-1--persiapan--perencanaan) | Persiapan & perencanaan | M1 | 8 | 8 | 0 | 100% |
| [2](#tahap-2--perancangan) | Perancangan | M1 | 9 | 8 | 1 | 89% |
| [3](#tahap-3--design-system--layout) | Design system & layout | M2 | 9 | 8 | 1 | 89% |
| [4](#tahap-4--fondasi-data--modul-inti) | Fondasi data & modul inti | M3 | 9 | 9 | 0 | 100% |
| [5](#tahap-5--login) | Login | M3 | 5 | 5 | 0 | 100% |
| [6](#tahap-6--data-pendaftar) | Data Pendaftar | M3 | 7 | 7 | 0 | 100% |
| [7](#tahap-7--form-pendaftar-stepper) | Form Pendaftar | M3 | 6 | 6 | 0 | 100% |
| [8](#tahap-8--verifikasi-berkas) | Verifikasi Berkas | M3 | 5 | 0 | 5 | 0% |
| [9](#tahap-9--hasil--peringkat) | Hasil & Peringkat | M3 | 5 | 0 | 5 | 0% |
| [10](#tahap-10--dashboard) | Dashboard | M3 | 4 | 0 | 4 | 0% |
| [11](#tahap-11--laporan--bukti-pendaftaran) | Laporan & Bukti | M3 | 5 | 0 | 5 | 0% |
| [12](#tahap-12--qa-menyeluruh) | QA menyeluruh | M3 | 7 | 0 | 7 | 0% |
| [13](#tahap-13--rilis--online) | Rilis & online | M3 | 7 | 1 | 6 | 14% |
| | **Total** | | **86** | **52** | **34** | **60%** |

**Milestone:** M1 ✅ dokumen lengkap (kirim LMS 👤) · M2 ✅ kode lengkap (kirim LMS 👤) · M3 🔄 Tahap 4–5 selesai

---

## Tahap 1 — Persiapan & Perencanaan
Ref: [perencanaan §3](perencanaan.md#3-keputusan--asumsi), [§15](perencanaan.md#15-alur-kerja--aturan-pencatatan) · **Output:** repo bersih, `perencanaan.md`, `checklist_work.md`, `.gitignore`, README awal

| No | Langkah | Ref | Status | Catatan |
|---|---|---|---|---|
| 1.1 | Repository Git + struktur folder | §10.1 | ✅ | ID lama T0-01, T0-02 |
| 1.2 | Dokumen perencanaan & checklist (hingga v0.3) | §16 | ✅ | T0-03, T0-04, T0-11, T0-12 |
| 1.3 | Keputusan desain, teknologi, data, hosting (D-01…D-24) | §3 | ✅ | T0-08. Revisi terakhir 25 Sep 2026 |
| 1.4 | Bersih-bersih: hapus 11 file draf, `.gitignore`, salin 8 screenshot referensi | D-10 | ✅ | T0-05, T0-09, T0-10 |
| 1.5 | Keamanan repo: audit S-01…S-07, email noreply, identitas commit Nurdin | D-18 | ✅ | T0-13, T0-14 |
| 1.6 | Remote GitHub + push pertama | D-09 | ✅ | T0-06, T0-07 |
| 1.7 | README versi awal (identitas Nurdin) | G-06 | ✅ | Dahulu T13-01 🟡. Versi final di 13.4 |
| 1.8 | Penutupan | §11.3 | ✅ | T0-R1…R3 |

---

## Tahap 2 — Perancangan
Ref: [perencanaan §4](perencanaan.md#4-prinsip-desain-anti-ai-slop)–[§9](perencanaan.md#9-design-system-material-design-3) · **Output:** [`perancangan.md`](perancangan.md) (deliverable M1)

| No | Langkah | Ref | Status | Catatan |
|---|---|---|---|---|
| 2.1 | Kerangka, deskripsi sistem, alasan tema M3, prinsip anti-slop | D-01, §4 | ✅ | T1-01…T1-03 |
| 2.2 | Hierarki menu, sitemap, 4 user flow (Mermaid) | §6 | ✅ | T1-04…T1-06 |
| 2.3 | ERD + kamus data, jalur, kuota, jadwal, status | §7 | ✅ | T1-07, T1-08 |
| 2.4 | 10 wireframe (kerangka + P-01…P-08) | §8 | ✅ | T1-09 |
| 2.5 | Design system (warna, tipografi, bentuk, komponen) | §9 | ✅ | T1-10 |
| 2.6 | Galeri & review Stitch + link publik proyek Stitch | §4.2, D-20 | ✅ | T1-11, T1-17 |
| 2.7 | Validasi 6 diagram Mermaid | – | ✅ | T1-18 |
| 2.8 | Kirim link repo M1 ke LMS Mentari | §2.1 | ⬜ | 👤 Tenggat pekan ke-3 |
| 2.9 | Penutupan | §11.3 | ✅ | T1-R1…R3 |

---

## Tahap 3 — Design System & Layout
Ref: [perencanaan §9](perencanaan.md#9-design-system-material-design-3), [P-00](perencanaan.md#p-00--layouthtml--template-master-m2-tahap-3) · **Output:** `assets/css/*`, [`styleguide.html`](styleguide.html), `logo.svg`, `layout.html`, `shell.js`

| No | Langkah | Ref | Status | Catatan |
|---|---|---|---|---|
| 3.1 | Design token + uji kontras (3 nilai Stitch diperbaiki) | §9.1, NFR-04 | ✅ | T2-01…T2-03 |
| 3.2 | `main.css` + `base.css` | §10.1 | ✅ | T2-04 |
| 3.3 | 14 kelompok komponen (`components.css`) | §9.7 | ✅ | T2-05…T2-09 |
| 3.4 | Logo fiktif + `styleguide.html` | D-17, D-20 | ✅ | T2-10, T2-11 |
| 3.5 | `layout.html` + `layout.css` (drawer · rail · modal) | P-00, §9.5 | ✅ | T3-01…T3-06 |
| 3.6 | `shell.js`: navigasi adaptif, menu akun, menu aktif | P-00, NFR-04 | ✅ | T3-07, T3-08 |
| 3.7 | Uji: W3C HTML & CSS, 5 breakpoint, keyboard, console | NFR-01, NFR-03, TC-04 | ✅ | T2-12, T3-09 |
| 3.8 | Kirim link repo M2 ke LMS Mentari | §2.1 | ⬜ | 👤 Tenggat pekan ke-5 |
| 3.9 | Penutupan | §11.3 | ✅ | T2-R1…R3, T3-R1…R3 |

---

## Tahap 4 — Fondasi Data & Modul Inti
Ref: [perencanaan §7](perencanaan.md#7-model-data--aturan-bisnis), [§10.2–10.4](perencanaan.md#102-urutan-pemuatan-script) · **Output:** `assets/js/core/rules.js`, `seed.js`, `store.js`, `ui.js`, login di `shell.js`

| No | Langkah | Ref | Status | Catatan |
|---|---|---|---|---|
| 4.1 | Aturan PPDB: identitas sekolah, jalur & kuota, jadwal, status, berkas wajib, tanggal simulasi | §7.2–§7.4, D-12 | ✅ | `rules.js`: sekolah, 18 sekolah asal fiktif, 4 jalur (432 kursi), jadwal, status, berkas wajib, tanggal simulasi |
| 4.2 | Validator: NISN, usia, KK zonasi, skor prestasi, berkas, no. HP | BR-01…BR-06 | ✅ | 11 validator murni (BR-01…BR-06, BR-08), semuanya diuji |
| 4.3 | Mesin peringkat: urutan per jalur, keketatan, batas sementara | BR-09…BR-11 | ✅ | `peringkat()` & `statusSeleksi()`: urut jarak/skor → usia → waktu daftar, batas sementara saat kuota penuh |
| 4.4 | Generator ±900 pendaftar bohongan + cek setiap jalur melebihi kuota | §7.6 | ✅ | 900 pendaftar deterministik. Keketatan 1,22–1,48× per jalur, 195 menunggu, 864 KB |
| 4.5 | Penyimpanan: CRUD, nomor otomatis, riwayat verifikasi, log, reset, ekspor/impor JSON | BR-07, BR-12, FR-17, FR-18, D-21 | ✅ | `store.js`: penyaring data, fallback memori, BR-13 verifikasi ulang, hapus+urungkan, impor ketat |
| 4.6 | Utilitas UI: anti-XSS, format tanggal/angka/jarak, snackbar + Urungkan, dialog | §9.7, §10.3 | ✅ | `ui.js`: pembuat elemen tanpa innerHTML, format id-ID, snackbar, dialog, CSV anti formula-injection |
| 4.7 | Login/logout simulasi, penjaga halaman, badge antrean, chip tahap dari data | FR-01, FR-02, AS-02 | ✅ | Login + kunci 30 dtk setelah 5× gagal, sesi 8 jam/30 hari, anti open-redirect, badge 99+, chip hari ke-11 dari 12 |
| 4.8 | Uji modul: verifikasi 1 pendaftar → peringkat jalur berubah | TC-17 | ✅ | `tests/index.html`: **32/32 lulus** (Chrome headless). Data kerja dicadangkan & dipulihkan otomatis |
| 4.9 | Penutupan | §11.3 | ✅ | W3C HTML & CSS 0 error, console bersih, dokumen diperbarui (v0.3.1), commit lokal |

---

## Tahap 5 — Login
Ref: [perencanaan P-01](perencanaan.md#p-01--indexhtml--login-tahap-5) · **Output:** `index.html`, `assets/js/pages/login.js`

| No | Langkah | Ref | Status | Catatan |
|---|---|---|---|---|
| 5.1 | `index.html` + panel identitas & jadwal (dari data) | P-01, AS-02 | ✅ | Panel identitas, tahun ajaran, tahap berjalan & 4 jadwal (tahap aktif ditandai) — semua dari `rules.js` |
| 5.2 | Form: username, sandi, tampilkan sandi, "Ingat saya", kotak akun demo | P-01, AS-06 | ✅ | Ikon field, tombol tampilkan sandi (aria-pressed), Ingat saya, kotak akun demo + Isi otomatis |
| 5.3 | Validasi & pesan error per kolom | FR-01, TC-02 | ✅ | Error per kolom + alert role=alert, fokus ke kolom pertama yang salah, error hilang saat mengetik ulang |
| 5.4 | Sesi, redirect, lewati login jika sesi ada, logout di semua halaman | FR-01, FR-02, TC-01, TC-03, TC-23 | ✅ | Sesi tersimpan & tercatat di log, pesan "sudah keluar"/"silakan masuk" dari URL. Penjaga halaman & logout diuji di Tahap 6 (butuh halaman admin) |
| 5.5 | Penutupan | §11.3 | ✅ | Uji skenario otomatis 6/6, tampilan 1280 & 360 px, W3C HTML & CSS 0 error, 32/32 uji modul tetap lulus |

---

## Tahap 6 — Data Pendaftar
Ref: [perencanaan P-03](perencanaan.md#p-03--pagesdata-masterhtml--data-pendaftar-tahap-6) · **Output:** `pages/data-master.html`, `assets/js/pages/data-master.js`

| No | Langkah | Ref | Status | Catatan |
|---|---|---|---|---|
| 6.1 | Halaman dari template + aksi header + tab status dengan jumlah | P-03, FR-07, AS-04 | ✅ | Tab status (pola tab ARIA, panah/Home/End) dengan jumlah dari data sesuai filter lain. Satu tombol *filled* (Tambah), Ekspor CSV *outlined*, menu ⋮ untuk cadangan & reset |
| 6.2 | Cari (debounce), filter jalur & sekolah, chip filter aktif, filter lewat URL | FR-07, TC-06, TC-07 | ✅ | Debounce 250 ms (Enter langsung). Cari nama tanpa peka huruf, NISN & no. daftar. Chip per filter + "Hapus semua filter". Semua status tampilan di URL (`?status=&q=&jalur=&sekolah=&urut=&arah=&hal=&per=`), nilai URL divalidasi (TC-06, TC-07 ✅) |
| 6.3 | Tabel: urutkan, paginasi, mode kartu di HP, tampilan kosong | FR-07, NFR-01, R-05, R-06 | ✅ | Urut no. daftar/nama/jarak-skor (`aria-sort`; jarak/skor aktif setelah memilih jalur, terbaik dulu sesuai BR-10). Paginasi 10/20/50 dengan elipsis. **Kartu < 840 px** (2 kolom di 600–839), kolom sekolah disembunyikan di 840–1279. Tampilan kosong + hapus filter |
| 6.4 | Dialog detail (tautan ke Verifikasi & Bukti) | FR-08 | ✅ | Dialog `<dialog>`: data diri, domisili, sekolah & prestasi, orang tua, berkas + hasil cek, riwayat verifikasi, status seleksi sementara (terverifikasi). Tautan Ubah, Bukti, Verifikasi. Esc/klik luar menutup, fokus kembali ke nama |
| 6.5 | Hapus + dialog konfirmasi + snackbar "Urungkan" | FR-09, TC-08 | ✅ | Konfirmasi (fokus awal di Batal) → hapus → snackbar "Urungkan" 8 detik → data, riwayat & posisi kembali utuh (TC-08 ✅) |
| 6.6 | Ekspor CSV, reset data, ekspor/impor cadangan | FR-16, FR-17, TC-21, TC-22 | ✅ | CSV sesuai filter aktif (BOM, pemisah `;`, anti formula) (TC-21 ✅). Cadangan JSON unduh/pulihkan (konfirmasi, validasi ketat, berkas rusak ditolak). Reset ke data awal (TC-22 ✅). Semua tercatat di log |
| 6.7 | Penutupan | §11.3 | ✅ | Uji otomatis 36/36 + uji inti 32/32, konsol bersih. 7 lebar layar (360–1440) tanpa scroll horizontal & teks terpotong. W3C HTML 0 pesan, CSS 0 error. Uji Anti-Slop 7/7. Audit S-01…S-07 lulus |

---

## Tahap 7 — Form Pendaftar (Stepper)
Ref: [perencanaan P-04](perencanaan.md#p-04--pagesformhtml--tambahedit-pendaftar-tahap-7), [§7.5](perencanaan.md#75-aturan-bisnis-br) · **Output:** `pages/form.html`, `assets/js/pages/form.js`

| No | Langkah | Ref | Status | Catatan |
|---|---|---|---|---|
| 7.1 | Struktur stepper 4 langkah | P-04 | ✅ | Stepper 4 langkah (`aria-current="step"`, tanda selesai). Maju lewat stepper hanya bila langkah sebelumnya valid; mundur bebas. Satu tombol *filled* (Lanjut → Simpan). Panel "Aturan di langkah ini" dari konstanta aturan |
| 7.2 | Langkah 1–3: identitas, domisili & jalur, akademik (rata-rata rapor otomatis) | P-04, BR-02, BR-03, BR-04 | ✅ | Petunjuk usia per 1 Juli & jarak km otomatis. Jalur berupa kartu radio (kuota, dasar peringkat, syarat). Asal sekolah `<select>` dengan grup negeri/swasta (pengganti datalist: kode sekolah harus dari daftar). Nilai semester 1–5 → rata-rata & skor prestasi langsung dihitung |
| 7.3 | Langkah 4: berkas mengikuti jalur + ringkasan isian | BR-05, TC-12 | ✅ | Daftar berkas berubah mengikuti jalur & prestasi (TC-12 ✅). Berkas disimulasikan: hanya nama & ukuran dicatat, hasil cek di-reset ke "belum". Ringkasan 3 bagian dengan tombol Ubah per bagian |
| 7.4 | Validasi per kolom, per langkah, lintas kolom + aksesibilitas error | BR-01…BR-06, TC-09…TC-13, NFR-04 | ✅ | Validasi saat blur, saat mengetik ulang (error hilang), saat Lanjut/Simpan. Lintas kolom: jalur ↔ KK zonasi, prestasi ↔ nama prestasi & sertifikat. `aria-invalid`, pesan terhubung `aria-describedby`, ringkasan error `role="alert"`, fokus ke kolom pertama yang salah (TC-09…TC-13 ✅) |
| 7.5 | Simpan, mode edit (`?id=`), peringatan data belum disimpan | FR-10, FR-11, TC-14 | ✅ | Simpan → Data Pendaftar terfilter nomor baru + snackbar (pesan titipan). Mode ubah `?id=` (peringatan BR-13, menu Data Pendaftar aktif, data lama tanpa nilai semester tetap bisa disimpan), id tidak ada → pesan jelas. Peringatan `beforeunload` bila belum disimpan (TC-14 ✅) |
| 7.6 | Penutupan | §11.3 | ✅ | Uji form 26/26, Data Pendaftar 36/36 (regresi), inti 34/34, konsol bersih. 5 lebar layar tanpa scroll horizontal. W3C HTML 0 pesan, CSS 0 error. Uji Anti-Slop 7/7. Audit S-01…S-07 lulus |

---

## Tahap 8 — Verifikasi Berkas
Ref: [perencanaan P-05](perencanaan.md#p-05--pagesverifikasihtml--verifikasi-berkas-tahap-8), [§6.4](perencanaan.md#64-alur-kerja-utama-verifikasi-berkas) · **Output:** `pages/verifikasi.html`, `assets/js/pages/verifikasi.js`

| No | Langkah | Ref | Status | Catatan |
|---|---|---|---|---|
| 8.1 | Tata letak 3 panel + antrean terlama + cari | P-05, FR-12, NFR-01 | ⬜ | |
| 8.2 | Panel berkas (pratinjau jujur) + data isian pembanding | AS-01, AS-06 | ⬜ | |
| 8.3 | Checklist per berkas, aturan keputusan, catatan wajib, konfirmasi tolak | BR-08, TC-15, TC-16 | ⬜ | |
| 8.4 | Simpan keputusan → antrean berikutnya, badge menu, log | FR-12, FR-18 | ⬜ | |
| 8.5 | Penutupan | §11.3 | ⬜ | |

---

## Tahap 9 — Hasil & Peringkat
Ref: [perencanaan P-06](perencanaan.md#p-06--pageshasil-seleksihtml--hasil--peringkat-tahap-9) · **Output:** `pages/hasil-seleksi.html`, `assets/js/pages/hasil-seleksi.js`

| No | Langkah | Ref | Status | Catatan |
|---|---|---|---|---|
| 9.1 | Tab jalur + ringkasan: kuota, terverifikasi, keketatan, batas sementara | P-06, FR-05, BR-11 | ⬜ | |
| 9.2 | Tabel peringkat + baris garis batas kuota + status masuk/tergeser | FR-13, BR-10 | ⬜ | |
| 9.3 | Cari & sorot baris, filter "sekitar garis batas", ekspor CSV | FR-16, TC-18 | ⬜ | |
| 9.4 | Uji alur: verifikasi → peringkat berubah | TC-17 | ⬜ | |
| 9.5 | Penutupan | §11.3 | ⬜ | |

---

## Tahap 10 — Dashboard
Ref: [perencanaan P-02](perencanaan.md#p-02--pagesdashboardhtml--dashboard-tahap-10) · **Output:** `pages/dashboard.html`, `assets/js/pages/dashboard.js`

| No | Langkah | Ref | Status | Catatan |
|---|---|---|---|---|
| 10.1 | Page header + 4 KPI dari data | FR-03, AS-02, AS-04, TC-05 | ⬜ | |
| 10.2 | Grafik pendaftar per hari (Chart.js + SRI) + fallback jika CDN gagal | FR-04, D-06, D-19, R-03 | ⬜ | |
| 10.3 | Tabel keketatan jalur, antrean terlama, jadwal PPDB | FR-05, FR-06 | ⬜ | |
| 10.4 | Penutupan | §11.3 | ⬜ | |

---

## Tahap 11 — Laporan & Bukti Pendaftaran
Ref: [perencanaan P-07](perencanaan.md#p-07--pageslaporanhtml--rekap--cetak-tahap-11), [P-08](perencanaan.md#p-08--pagesbuktihtmlid--bukti-pendaftaran-tahap-11) · **Output:** `pages/laporan.html`, `pages/bukti.html`, JS masing-masing, `assets/css/print.css`

| No | Langkah | Ref | Status | Catatan |
|---|---|---|---|---|
| 11.1 | Laporan: filter periode & jalur + validasi rentang tanggal | P-07, FR-14, TC-19 | ⬜ | |
| 11.2 | Rekap per jalur, 10 sekolah asal terbanyak, rekap harian, log aktivitas | FR-14, BR-12 | ⬜ | |
| 11.3 | Tata letak cetak A4 (kop fiktif, tanda tangan kosong) + ekspor CSV | FR-15, FR-16, D-17, TC-20 | ⬜ | |
| 11.4 | Bukti pendaftaran + cetak + pesan jika `id` tidak ditemukan | P-08, FR-15, AS-06 | ⬜ | |
| 11.5 | Penutupan | §11.3 | ⬜ | |

---

## Tahap 12 — QA Menyeluruh
Ref: [perencanaan §12](perencanaan.md#12-strategi-pengujian), [§5.3 NFR](perencanaan.md#53-kebutuhan-non-fungsional-nfr)

| No | Langkah | Ref | Status | Catatan |
|---|---|---|---|---|
| 12.1 | Responsif 5 lebar layar + Chrome, Edge, Firefox | NFR-01, A-03 | ⬜ | |
| 12.2 | W3C HTML & CSS semua halaman + console bersih + audit semantik | NFR-02, NFR-03, NFR-06 | ⬜ | |
| 12.3 | Aksesibilitas: keyboard, fokus, kontras, Lighthouse ≥ 90 | NFR-04 | ⬜ | |
| 12.4 | Keamanan front-end: uji input berbahaya (XSS), CSP | D-18, D-19 | ⬜ | |
| 12.5 | 23 kasus uji fungsional (tabel di bawah) | §12.2 | ⬜ | |
| 12.6 | Uji Anti-Slop ulang, 0 warna di luar token, rapikan & hapus kode mati | NFR-05, NFR-07, NFR-08 | ⬜ | |
| 12.7 | Penutupan | §11.3 | ⬜ | |

**Hasil kasus uji** (kolom "Pertama diuji" diisi di tahap terkait, "Hasil QA" di langkah 12.5):

| TC | Skenario ringkas | Tahap terkait | Pertama diuji | Hasil QA |
|---|---|---|---|---|
| TC-01 | Login benar | 5 | ✅ Tahap 5 (26 Sep) | ⬜ |
| TC-02 | Login kosong/salah | 5 | ✅ Tahap 5 (26 Sep) | ⬜ |
| TC-03 | Halaman admin tanpa sesi | 4, 5 | ✅ Tahap 6 (2 Okt) | ⬜ |
| TC-04 | Drawer/rail/modal per lebar layar | 3 | ✅ Tahap 3 (23 Sep) | ⬜ |
| TC-05 | KPI = jumlah di Data Pendaftar | 10 | – | ⬜ |
| TC-06 | Cari NISN | 6 | ✅ Tahap 6 (2 Okt) | ⬜ |
| TC-07 | Filter berlapis + chip | 6 | ✅ Tahap 6 (2 Okt) | ⬜ |
| TC-08 | Hapus lalu Urungkan | 6 | ✅ Tahap 6 (2 Okt) | ⬜ |
| TC-09 | Lanjut langkah dengan kolom kosong | 7 | ✅ Tahap 7 (2 Okt) | ⬜ |
| TC-10 | NISN duplikat | 7 | ✅ Tahap 7 (2 Okt) | ⬜ |
| TC-11 | Zonasi dengan KK < 1 tahun | 7 | ✅ Tahap 7 (2 Okt) | ⬜ |
| TC-12 | Ganti jalur ke afirmasi → KIP wajib | 7 | ✅ Tahap 7 (2 Okt) | ⬜ |
| TC-13 | Berkas salah jenis/terlalu besar | 7 | ✅ Tahap 7 (2 Okt) | ⬜ |
| TC-14 | Simpan pendaftar baru | 7 | ✅ Tahap 7 (2 Okt) | ⬜ |
| TC-15 | Tombol terverifikasi nonaktif jika berkas belum dicentang | 8 | – | ⬜ |
| TC-16 | Perbaikan/tolak tanpa catatan | 8 | – | ⬜ |
| TC-17 | Verifikasi mengubah peringkat | 4, 9 | ✅ Tahap 4 (26 Sep, uji otomatis) | ⬜ |
| TC-18 | Cari nama di peringkat | 9 | – | ⬜ |
| TC-19 | Rentang tanggal laporan terbalik | 11 | – | ⬜ |
| TC-20 | Cetak laporan & bukti | 11 | – | ⬜ |
| TC-21 | Ekspor CSV | 6, 9, 11 | ✅ Tahap 6 (2 Okt, data pendaftar) | ⬜ |
| TC-22 | Reset data simulasi | 6 | ✅ Tahap 6 (2 Okt) | ⬜ |
| TC-23 | Logout | 5 | ✅ Tahap 6 (2 Okt) | ⬜ |

---

## Tahap 13 — Rilis & Online
Ref: [perencanaan D-09, D-18, D-19, D-24](perencanaan.md#3-keputusan--asumsi) · **Output:** repo publik rapi, CI, situs GitHub Pages, README final, rilis `v1.0`, panduan domain

| No | Langkah | Ref | Status | Catatan |
|---|---|---|---|---|
| 13.1 | Operasi repo dari akun Nurdin + pembersihan jejak akun lain (lihat B-04) | D-24, D-18 | ✅ | 26 Sep: login `gh` Nurdin, riwayat lokal disamarkan, kredit README. 2 Okt: izin token `delete_repo`+`workflow`, audit S-01…S-07 lulus, repo dihapus & dibuat ulang (publik, wiki nonaktif), 12 commit bersih di-push, collaborator & kontributor hanya Nurdin, `refs/original` dihapus + `git gc` |
| 13.2 | CI GitHub Actions (W3C Nu Validator + pemindaian rahasia) + perlindungan branch `main` | D-18, R-08 | ⬜ | |
| 13.3 | GitHub Pages + CSP `<meta>` + `noindex` + halaman 404 | D-09, D-19 | ⬜ | |
| 13.4 | README final (fitur, screenshot, link situs) + rilis `v1.0` | G-06 | ⬜ | Melanjutkan 1.7 |
| 13.5 | Naskah demo 5–7 menit + jawaban tanya-jawab + kirim link M3 ke LMS | §2.2 | ⬜ | 👤 kirim LMS |
| 13.6 | Panduan pemasangan domain (DNS + `CNAME` + HTTPS) → serah terima | D-09, D-19 | ⬜ | 👤 domain milik pengembang |
| 13.7 | Penutupan | §11.3 | ⬜ | |

---

## Padanan ID Lama → Baru

| ID lama (s.d. v0.2) | Menjadi | Keterangan |
|---|---|---|
| T0-01…T0-14, T0-R1…R3 | 1.1–1.6, 1.8 | Selesai |
| T13-01 (README awal) | 1.7 | Selesai. Versi final di 13.4 |
| T1-01…T1-11, T1-17, T1-18, T1-R1…R3 | 2.1–2.7, 2.9 | Selesai |
| T1-19 (kirim M1) | 2.8 | 👤 |
| T1-12…T1-16 (Figma) | – | Dibatalkan (D-20) |
| T2-01…T2-12, T3-01…T3-09, R1…R3 | 3.1–3.7, 3.9 | Selesai. Tahap lama 2 & 3 digabung |
| T3-R3 (kirim M2) | 3.8 | 👤 |
| T4-01…T4-12, T4-14 | 4.1–4.8 | T4-14 (ekspor/impor JSON) masuk 4.5 |
| T4-13 (adapter) | – | Dibatalkan (D-21) |
| T5-xx | 5.x | Login |
| T7-xx | 6.x | Data Pendaftar |
| T8-xx | 7.x | Form |
| T9-xx | 8.x | Verifikasi |
| T10-xx | 9.x | Hasil & Peringkat |
| T6-xx | 10.x | Dashboard (dipindah ke belakang, D-23) |
| T11-xx | 11.x | Laporan & Bukti |
| T12-xx | 12.x | QA (dirangkum dari 15 menjadi 7 langkah) |
| T13-02…T13-09, T13-13 | 13.2–13.6 | Rilis. Tag `v1.0-tugas` → rilis `v1.0` |
| T14 (Supabase, adapter, migrasi) | – | Dibatalkan (D-21). Domain & keamanan produksi → 13.3, 13.6 |

---

## Log Perubahan File

Setiap file yang **dibuat, diubah, dihapus, dipindah, atau disalin** dicatat di sini, satu baris per file.
Jenis: `CREATE` · `UPDATE` · `DELETE` · `RENAME` · `COPY`. Nomor `F-xx` terus bertambah dan tidak pernah dipakai ulang.
> Catatan: kolom "ID tugas" memakai penomoran yang berlaku saat itu (v0.1 untuk F-01…F-16, v0.2 untuk F-17…F-59, v0.3 mulai F-60). Lihat [Padanan ID Lama](#padanan-id-lama--baru).

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
| F-58 | 23 Sep 2026 | CREATE | `README.md` | T13-01 | Catatan tugas versi awal: identitas Nurdin, status milestone, fitur, teknologi, cara menjalankan, struktur, dokumentasi |
| F-59 | 23 Sep 2026 | UPDATE | `docs/checklist_work.md` | T13-01 | T13-01 → 🟡, log F-58/F-59 |
| F-60 | 25 Sep 2026 | UPDATE | `docs/perencanaan.md` | 1.2 | v0.3: penomoran tahap 1–13 & langkah x.y (D-22), urutan halaman (D-23), database lokal saja (D-21), GitHub Pages (D-09, D-19), push ditunda (D-24), §11 ditulis ulang |
| F-61 | 25 Sep 2026 | UPDATE | `docs/checklist_work.md` | 1.2 | v0.3: ditulis ulang ke tahap 1–13 (86 langkah), tahap 1–3 diringkas dengan padanan ID lama, tabel Padanan ID Lama → Baru. Log & blocker lama dipertahankan |
| F-62 | 26 Sep 2026 | UPDATE | riwayat Git lokal (9 commit) | 13.1 | Penyebutan akun kedua pengembang & ID-nya disamarkan di semua versi file & pesan commit (`git filter-branch`). Diverifikasi: hanya 4 baris berubah di versi terakhir, file biner tidak berubah, 0 jejak tersisa |
| F-63 | 26 Sep 2026 | UPDATE | `README.md` | 13.1 | Kredit: "Dibangun oleh Nurdin bersama Claude (AI dari Anthropic)" |
| F-64 | 26 Sep 2026 | UPDATE | `docs/checklist_work.md` | 13.1 | 13.1 → 🔄, B-04 diperbarui, posisi saat ini |
| F-65 | 26 Sep 2026 | CREATE | `assets/js/core/rules.js` | 4.1–4.3 | Aturan PPDB, master data fiktif, 11 validator, mesin peringkat |
| F-66 | 26 Sep 2026 | CREATE | `assets/js/core/seed.js` | 4.4 | Generator 900 pendaftar deterministik (NISN awalan 9, HP awalan 08000) |
| F-67 | 26 Sep 2026 | CREATE | `assets/js/core/store.js` | 4.5 | Penyimpanan localStorage + fallback memori, penyaring data, verifikasi, hapus/urungkan, cadangan JSON |
| F-68 | 26 Sep 2026 | CREATE | `assets/js/core/ui.js` | 4.6 | Pembuat elemen aman, format id-ID, snackbar, dialog, CSV |
| F-69 | 26 Sep 2026 | UPDATE | `assets/js/core/shell.js` | 4.7 | Bagian 1: login simulasi, sesi, penjaga halaman, badge, chip tahap (navigasi Tahap 3 tidak diubah) |
| F-70 | 26 Sep 2026 | UPDATE | `assets/css/layout.css` | 4.7 | Sembunyikan halaman admin sampai sesi terverifikasi + gaya pesan `noscript` |
| F-71 | 26 Sep 2026 | UPDATE | `layout.html` | 4.7 | Penanda `data-user-*`, memuat modul inti sesuai urutan §10.2 |
| F-72 | 26 Sep 2026 | CREATE | `tests/index.html`, `tests/setup.js`, `tests/core.test.js` | 4.8 | 32 uji otomatis modul inti, data kerja dicadangkan & dipulihkan |
| F-73 | 26 Sep 2026 | UPDATE | `docs/perencanaan.md` | 4.9 | v0.3.1: chip "hari ke-11", BR-13, folder `tests/`, konvensi `ui.el`, kunci penyimpanan |
| F-74 | 26 Sep 2026 | UPDATE | `docs/perancangan.md` | 4.9 | Teks chip tahap "hari ke-11 dari 12" (§3.2 & wireframe) |
| F-75 | 26 Sep 2026 | UPDATE | `docs/checklist_work.md` | 4.9 | Tahap 4 selesai (9/9), TC-17, log |
| F-76 | 26 Sep 2026 | CREATE | `index.html` | 5.1–5.4 | Halaman masuk panitia (P-01) |
| F-77 | 26 Sep 2026 | CREATE | `assets/js/pages/login.js` | 5.1–5.4 | Panel jadwal dari data, validasi, toggle sandi, isi akun demo |
| F-78 | 26 Sep 2026 | CREATE | `assets/css/pages.css` | 5.1 | Gaya khusus halaman login |
| F-79 | 26 Sep 2026 | UPDATE | `assets/css/main.css` | 5.1 | `@import pages.css` |
| F-80 | 26 Sep 2026 | UPDATE | `assets/css/components.css` | 5.3 | Komponen 'alert' (info, error, warning, sukses) |
| F-81 | 26 Sep 2026 | UPDATE | `assets/js/core/shell.js` | 5.4 | Logout ke `index.html?keluar=1` |
| F-82 | 26 Sep 2026 | UPDATE | `docs/checklist_work.md` | 5.5 | Tahap 5 selesai, TC-01 & TC-02 |
| F-83 | 2 Okt 2026 | DELETE + CREATE | GitHub `nurdinrhk-design/PROGRAMWEB_2` | 13.1 | Repo lama (riwayat berjejak + collaborator akun lain) dihapus, dibuat ulang publik, riwayat bersih di-push |
| F-84 | 2 Okt 2026 | UPDATE | `docs/checklist_work.md` | 13.1 | 13.1 ✅, B-04 selesai, progres 39/86, posisi saat ini |
| F-85 | 2 Okt 2026 | CREATE | `pages/data-master.html` | 6.1 | Halaman Data Pendaftar dari template master (penjaga sesi, tab, toolbar cari, tabel, paginasi, menu cadangan) |
| F-86 | 2 Okt 2026 | CREATE | `assets/js/pages/data-master.js` | 6.1–6.6 | Logika halaman: status di URL, saring/urut/paginasi, dialog detail, hapus + urungkan, ekspor CSV, cadangan, reset |
| F-87 | 2 Okt 2026 | UPDATE | `assets/js/core/ui.js` | 6.6 | `pasangMenu()`: menu tarik-turun (klik luar, Esc, panah atas/bawah) |
| F-88 | 2 Okt 2026 | UPDATE | `assets/css/components.css` | 6.3, 6.4 | `.link-btn`, kolom urut nonaktif, `.menu--anchored`, paginasi (elipsis, ukuran), kartu tabel < 840 px (2 kolom di 600–839), komponen 16: `.info-list`, `.file-list`, `.timeline`. `.icon-btn` tanpa garis bawah saat berupa tautan |
| F-89 | 2 Okt 2026 | UPDATE | `assets/css/pages.css` | 6.3, 6.4 | Blok Data Pendaftar: toolbar, chip, ringkasan, kartu, kolom responsif, dialog detail |
| F-90 | 2 Okt 2026 | UPDATE | `assets/css/layout.css` | 6.7 | Compact: tombol *filled* di page header satu baris penuh (label tidak terpotong di 360 px) |
| F-91 | 2 Okt 2026 | UPDATE | `assets/css/base.css` | 6.7 | Reset daftar memakai `:where()` (spesifisitas 0) agar padding komponen daftar tidak tertimpa |
| F-92 | 2 Okt 2026 | DELETE | `pages/.gitkeep` | 6.1 | Tidak diperlukan lagi, folder sudah berisi halaman |
| F-93 | 2 Okt 2026 | UPDATE | `docs/perencanaan.md` | 6.7 | v0.3.2: kartu < 840 px (R-05), komponen 16, `ui.pasangMenu` |
| F-94 | 2 Okt 2026 | UPDATE | `docs/checklist_work.md` | 6.7 | Tahap 6 selesai (7/7), TC-03/06/07/08/21/22/23, progres 46/86 |
| F-95 | 2 Okt 2026 | UPDATE | `README.md` | 6.7 | Fitur login & data pendaftar pindah ke "Sudah tersedia", hosting GitHub Pages, halaman yang bisa dicoba, akun demo |
| F-96 | 2 Okt 2026 | CREATE | `pages/form.html` | 7.1–7.4 | Form 4 langkah: stepper, kolom berlabel + hint + error, kartu jalur, nilai semester, daftar berkas, ringkasan, panel aturan |
| F-97 | 2 Okt 2026 | CREATE | `assets/js/pages/form.js` | 7.1–7.5 | Logika form: validasi blur/langkah/lintas kolom, stepper, unggah berkas simulasi, ringkasan, simpan, mode ubah, `beforeunload` |
| F-98 | 2 Okt 2026 | UPDATE | `assets/js/core/rules.js` | 7.2 | `rataRapor()`, `validasi.prestasiNama`, `validasi.tahunLulus`, label opsional di `validasi.nama`; ekspor `TAHUN_LULUS`, `JUMLAH_SEMESTER`, `BERKAS_FORMAT`, `USIA_MAKS` |
| F-99 | 2 Okt 2026 | UPDATE | `assets/js/core/store.js` | 7.2 | Kolom `nilaiSemester` (5 angka 0–100); rata-rata rapor dihitung ulang dari semester bila tercatat |
| F-100 | 2 Okt 2026 | UPDATE | `assets/js/core/seed.js` | 7.2 | Nilai semester 1–5 untuk data simulasi, rata-ratanya tepat sama dengan nilai rapor (tanpa angka acak, sebaran data tidak berubah). Ukuran data 864 → 906 KB |
| F-101 | 2 Okt 2026 | UPDATE | `assets/js/core/ui.js`, `shell.js` | 7.5 | `titipPesan()` / `tampilkanTitipan()`: snackbar setelah pindah halaman |
| F-102 | 2 Okt 2026 | UPDATE | `assets/css/components.css` | 7.6 | Stepper: tombol nonaktif, label aktif boleh terlipat di HP; jarak legend pada fieldset |
| F-103 | 2 Okt 2026 | UPDATE | `assets/css/pages.css` | 7.1–7.6 | Blok Form Pendaftar: grid kolom, kartu jalur, semester, unggah berkas, ringkasan, tombol bawah, panel aturan |
| F-104 | 2 Okt 2026 | UPDATE | `tests/core.test.js` | 7.6 | +2 uji: rata-rata rapor & validator baru, nilai semester di store (34 uji) |
| F-105 | 2 Okt 2026 | UPDATE | `docs/perencanaan.md`, `docs/perancangan.md`, `README.md` | 7.6 | README: fitur form & halaman yang bisa dicoba. v0.3.3: ERD `nilai_semester`, P-04 (select sekolah, data lama), aturan tahun lulus |
| F-106 | 2 Okt 2026 | UPDATE | `docs/checklist_work.md` | 7.6 | Tahap 7 selesai (6/6), TC-09…TC-14, progres 52/86 |

**Isi proyek saat ini (di luar `.git` dan bahan Stitch):**
```
PROGRAMWEB_2/
├── .gitignore
├── layout.html                  (template master, M2)
├── README.md                    (catatan tugas, versi awal)
├── index.html                   (halaman masuk)
├── tests/                       (uji otomatis modul inti)
├── assets/
│   ├── css/  main.css · tokens.css · base.css · layout.css · components.css · pages.css
│   ├── js/core/  rules.js · seed.js · store.js · ui.js · shell.js
│   ├── js/pages/ login.js · data-master.js · form.js
│   └── img/  logo.svg
├── docs/
│   ├── perencanaan.md          (v0.3.3)
│   ├── checklist_work.md       (v0.3)
│   ├── perancangan.md          (M1)
│   ├── styleguide.html / .css / .js   (etalase design system, M2)
│   └── img/referensi-stitch/   (8 screenshot)
└── pages/  data-master.html · form.html
```

---

## Blocker & Pertanyaan Terbuka

| ID | Deskripsi | Memblokir | Status | Penyelesaian |
|---|---|---|---|---|
| B-01 | Desain dari pengembang | T1–T3 | ✅ Selesai | Referensi Stitch diterima 23 Sep 2026. Figma dibatalkan (D-20). Tinggal link publik Stitch (T1-17) |
| B-02 | Tema visual belum ditentukan | T2 | ✅ Selesai | D-01: Material Design 3 |
| B-03 | **Push ditolak (403).** Kredensial Git di komputer ini adalah akun login kedua pengembang (disamarkan), yang tidak punya hak tulis ke `nurdinrhk-design/PROGRAMWEB_2` | T0-07, T0-R3, semua push berikutnya | ✅ Selesai | Kedua akun milik pengembang. akun kedua pengembang (disamarkan) ditambahkan sebagai collaborator. Push berhasil |
| B-04 | Operasi GitHub (push, PR, CI, Pages) belum bisa dijalankan dari akun Nurdin | Push & deploy (D-24), 13.1–13.3 | ✅ Selesai | 2 Okt 2026: token Nurdin punya izin `repo, workflow, delete_repo`; push dari akun Nurdin berhasil. Akun aktif `gh` tetap akun utama pengembang |
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
| 23 Sep 2026 | T0-07, T0-R3 | `git push -u origin main` **ditolak 403**: "Permission denied to (akun kedua, disamarkan)". Tidak ada data yang terkirim ke GitHub. Checklist dikoreksi (T0-07 & T0-R3 → 🟡), blocker B-03 dibuat | ⛔ Diputuskan tetap repo `nurdinrhk-design`. Menunggu hak akses (F-22) |
| 23 Sep 2026 | T0-14, T0-07, T0-R3 | Pengembang mengonfirmasi `nurdinrhk-design` & akun kedua sama-sama milik pengembang, dan akun kedua sudah jadi collaborator. Identitas commit diganti ke noreply akun kedua (disamarkan) (commit lokal di-amend `--reset-author` sebelum push). Audit ulang S-01/S-04/S-07: bersih. **Push berhasil** `dd57340` → `origin/main` | ✅ T0 selesai (F-23) |
| 23 Sep 2026 | T0-14 | Atas permintaan pengembang, identitas commit diganti ke akun kedua miliknya, `nurdinrhk-design` (noreply). 2 commit yang sudah di-push ditulis ulang (`rebase --root --reset-author`), lalu `push --force-with-lease`. Aman karena repo baru dan hanya dipakai pengembang | ✅ (F-24) |
| 23 Sep 2026 | – | Nama pengembang di dokumen diganti menjadi **Nurdin**. Penyebutan akun login kedua (disamarkan) di log teknis sengaja dipertahankan karena push memang dilakukan lewat akun itu. Rencana domain kustom & header keamanan dicatat (D-19, T13-10…T13-12) | ✅ (F-25, F-26) |
| 23 Sep 2026 | T1-01…T1-11, T1-18, T1-R1, T1-R2 | **Membuat `docs/perancangan.md`** dari perencanaan v0.2.2, untuk pembaca dosen. Uji: 6 diagram Mermaid valid (validator Mermaid Chart), 8 gambar ada, 10 anchor valid. Kelurusan wireframe dicek skrip, 5 baris diperbaiki (lebar/kolom) & kolom Status tabel dilebarkan. Bagian Figma masih placeholder | ✅ Menunggu review & Figma 👤 (F-27, F-28) |
| 23 Sep 2026 | T1-12…T1-17 | Pengembang memutuskan **tidak memakai Figma**. Link publik Google Stitch akan ditempel di `perancangan.md`. Risiko nilai M1 dicatat (R-01), mitigasi lewat §7 + `styleguide.html` | ✅ Keputusan D-20 (F-29…F-31) |
| 23 Sep 2026 | T4-13, T4-14, T13-13, T14 | Diskusi database. Keputusan D-21: **Fase 1** `localStorage` + adapter + cadangan JSON (versi tugas, ditandai `v1.0-tugas`). **Fase 2** Supabase sebelum hosting ke domain, tetap data simulasi. Tahap T14 dibuat, tugas domain dipindah dari T13 | ✅ (F-32, F-33) |
| 23 Sep 2026 | T1-R3 | Pengembang menyetujui `perancangan.md`, teknologi (D-04…D-06), dan database dua fase (D-21). Audit keamanan S-01…S-07, lalu commit & push T1 | ✅ (F-34) |
| 23 Sep 2026 | T1-17, T2-01…T2-12, T2-R1, T2-R2 | Link Stitch ditempel. **T2: design system → CSS.** Uji kontras menemukan 3 nilai Stitch gagal WCAG → diperbaiki. `tokens.css`, `base.css`, `components.css` (14 kelompok), `main.css`, logo, `styleguide.html/.css/.js`. Validasi W3C: CSS 0 error (3 error `var()` dalam `calc()` diperbaiki), HTML 0 error (tabpanel & judul KPI ditambah). Dicek di Chrome headless 1280px & 390px, console 0 error | ✅ Menunggu review (F-35…F-47) |
| 23 Sep 2026 | T2-R3 | Pengembang menyetujui tampilan styleguide. Audit keamanan, commit & push T2 | ✅ (F-48) |
| 23 Sep 2026 | T3-01…T3-09, T3-R1, T3-R2 | **T3: layout master.** `layout.html`, `layout.css`, `shell.js`. Navigasi adaptif 3 mode (modal · rail · drawer) diuji di 5 lebar layar + 4 status interaksi. Temuan & perbaikan: label rail terpotong → label pendek (AS-08). Fokus drawer tidak pindah → `focus()` langsung + kembali ke tombol menu. W3C HTML & CSS 0 error, console bersih | ✅ Menunggu review (F-49…F-56) |
| 23 Sep 2026 | T3-R3 | Pengembang menyetujui layout. Audit keamanan, commit & push T3. T4 ditahan sesuai permintaan | ✅ (F-57) |
| 23 Sep 2026 | T13-01 | Atas permintaan pengembang: membuat `README.md` versi awal dengan identitas Nurdin. Semua tautan lokal dicek ada | ✅ Disetujui, diaudit, di-commit & di-push (F-58, F-59) |
| 25 Sep 2026 | 1.2, 1.3 | **Revisi rencana v0.3** atas arahan pengembang: penomoran tahap 1–13 & langkah x.y, urutan halaman baru (Dashboard setelah Hasil), database lokal saja, GitHub Pages, push ditunda sampai akun Nurdin siap (B-04). Hanya dokumen yang diubah, belum ada langkah Tahap 4 yang dieksekusi | ✅ (F-60, F-61) |
| 26 Sep 2026 | 13.1 | Pengembang menyetujui 13.1 dikerjakan lebih awal. Rencana v0.3 di-commit lokal. `gh` akun Nurdin terverifikasi (ADMIN, 0 fork, 0 star), akun aktif `gh` dikembalikan ke akun utama pengembang. Riwayat lokal disamarkan & diverifikasi. Langkah kredensial push **ditolak pengaman otomatis Claude Code** → menunggu keputusan pengembang | 🔄 (F-62…F-64) |
| 26 Sep 2026 | 4.1–4.9 | **Tahap 4: fondasi data & modul inti.** `rules.js`, `seed.js`, `store.js`, `ui.js`, login di `shell.js`, 32 uji otomatis (lulus semua, percobaan pertama). Temuan: teks chip di dokumen ("hari ke-9") ternyata salah hitung, diganti hasil perhitungan (hari ke-11). Pengamanan: tanpa innerHTML, CSV anti formula, impor ketat, anti open-redirect, batas percobaan login | ✅ (F-65…F-75) |
| 26 Sep 2026 | 5.1–5.5 | **Tahap 5: Login.** `index.html` + `login.js` + `pages.css` + komponen alert. Uji skenario otomatis: kosong, salah, toggle sandi, isi demo, login benar → sesi & log. Perbaikan tampilan: kotak akun demo di 360 px | ✅ (F-76…F-82) |
| 29 Sep 2026 | 13.1 | Atas permintaan pengembang, akun aktif `gh` dikembalikan ke akun utama pengembang. Penambahan izin token akun Nurdin (`delete_repo`, `workflow`) **belum selesai** dan izinnya tetap seperti semula. Sisa pekerjaan 13.1 ditunda sampai pengembang siap mengurus akun Nurdin. Berkas log sementara di scratchpad sudah dihapus | ⏸️ Ditunda |
| 2 Okt 2026 | 13.1 | Pengembang menyetujui izin token akun Nurdin (`delete_repo`, `workflow`) lewat device login; `gh` otomatis kembali ke akun utama. Isi repo lama dicocokkan dengan riwayat lokal (selisih hanya 6 baris yang disamarkan). Audit keamanan lulus: 0 jejak akun lain, 0 pola rahasia, 0 file terlarang, 12/12 commit beridentitas Nurdin. **Atas konfirmasi pengembang**, repo dihapus & dibuat ulang, lalu di-push. Verifikasi remote: 12 commit, kontributor & collaborator hanya Nurdin. Cadangan `refs/original` dihapus + `git gc`; log sementara di scratchpad dihapus | ✅ (F-83, F-84) |
| 2 Okt 2026 | 6.1–6.7 | **Tahap 6: Data Pendaftar.** Halaman + skrip halaman + `ui.pasangMenu` + komponen 16. Uji otomatis lewat Chrome headless (DevTools Protocol, profil sementara di scratchpad lalu dihapus): 36/36 lulus setelah 3 perbaikan pada skrip uji (bukan halaman). Uji tampilan 7 lebar: temuan & perbaikan — tombol Tambah terpotong di 360 px, nomor & tanggal di kartu berantakan, tabel 600–840 px berdesakan + scroll halaman di 600 px, garis bawah ikon edit, padding riwayat tertimpa reset daftar. Semua diperbaiki dan diuji ulang. W3C HTML 0 pesan, CSS 0 error. Audit keamanan lulus | ✅ (F-85…F-95) |
| 2 Okt 2026 | 7.1–7.6 | **Tahap 7: Form Pendaftar.** Form 4 langkah + nilai semester di model data + pesan titipan antarhalaman. Temuan saat uji: (1) event `blur` tidak terpicu di Chrome headless → harness memakai emulasi fokus, validasi blur kini benar-benar teruji; (2) label langkah aktif & tombol Simpan terpotong di 360 px; (3) legend terlalu rapat. Semua diperbaiki & diuji ulang. Uji XSS: nama berisi tag tampil sebagai teks. Audit keamanan lulus | ✅ (F-96…F-106) |
