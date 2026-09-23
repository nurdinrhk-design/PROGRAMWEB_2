# Admin Panel PPDB Online

Admin Panel (back-office) **Penerimaan Peserta Didik Baru** untuk panitia sekolah. Panel ini dipakai untuk memantau pendaftar, memverifikasi berkas, melihat peringkat per jalur, dan mencetak rekap. Proyek ini murni *client-side* (HTML, CSS, JavaScript) dengan tema **Material Design 3**.

> ⚠️ **Data simulasi.** Sekolah "SMA Negeri 1 Harapan Bangsa", nama siswa, dan semua angka di aplikasi ini **fiktif**. Aplikasi tidak memakai data siswa asli.

## Identitas Tugas

| | |
|---|---|
| **Nama** | Nurdin |
| **GitHub** | [@nurdinrhk-design](https://github.com/nurdinrhk-design) |
| **Mata kuliah** | Pemrograman Web 2 (Client-Side Programming) |
| **Tugas** | Tugas 1 · Project-Based Learning |
| **Topik** | Sistem Penerimaan Peserta Didik Baru (PPDB Online) |
| **Tema visual** | Material Design 3 |
| **Desain** | [Proyek Google Stitch](https://stitch.withgoogle.com/projects/7419386921328695791) |

## Status Milestone

| Milestone | Isi | Status | Tautan |
|---|---|---|---|
| **M1** · Perencanaan & wireframe | Menu, ERD, user flow, wireframe, design system | ✅ Selesai | [docs/perancangan.md](docs/perancangan.md) |
| **M2** · Slicing & layouting | Design token, komponen CSS, template dasar | ✅ Selesai | [layout.html](layout.html) · [docs/styleguide.html](docs/styleguide.html) |
| **M3** · Komponen & interaktivitas | Halaman admin + JavaScript + deploy | 🔄 Dikerjakan | [docs/checklist_work.md](docs/checklist_work.md) |

Rincian progres setiap tugas ada di [docs/checklist_work.md](docs/checklist_work.md).

## Fitur

**Sudah tersedia**
- Design system Material Design 3: warna, tipografi, bentuk, elevasi, dan 14 kelompok komponen ([styleguide](docs/styleguide.html)).
- Semua pasangan warna lolos uji kontras WCAG 2.1. Hasil ujinya tampil langsung di styleguide.
- Template layout dengan navigasi yang menyesuaikan lebar layar:
  - drawer modal di HP,
  - rail ikon di tablet,
  - drawer permanen yang bisa diciutkan di layar besar.
- Bisa dipakai dengan keyboard: tautan lewati-ke-konten, fokus yang jelas, dan tombol `Esc` untuk menutup menu.

**Direncanakan (Milestone 3)**
- Login panitia (simulasi).
- Dashboard: ringkasan kerja harian, grafik pendaftar per hari, dan keketatan tiap jalur.
- Data pendaftar: cari, filter, urutkan, detail, hapus dengan pilihan "Urungkan", dan ekspor CSV.
- Form tambah/edit pendaftar 4 langkah dengan validasi aturan PPDB.
- Verifikasi berkas dengan checklist per dokumen.
- Hasil & peringkat otomatis per jalur, lengkap dengan garis batas kuota.
- Rekap siap cetak dan bukti pendaftaran.

## Teknologi

| Bagian | Teknologi |
|---|---|
| Struktur | HTML5 semantik |
| Tampilan | CSS3 murni, modular, berbasis design token (tanpa framework) |
| Interaksi | JavaScript murni (tanpa framework, tanpa proses build) |
| Grafik | Chart.js 4 (mulai M3) |
| Font & ikon | Plus Jakarta Sans · Material Symbols Outlined |
| Data | `localStorage` + data simulasi (mulai M3) |
| Hosting | GitHub + Vercel |

## Cara Menjalankan

Proyek ini tidak memerlukan instalasi atau proses build.

1. Clone repositori:
   ```bash
   git clone https://github.com/nurdinrhk-design/PROGRAMWEB_2.git
   ```
2. Buka folder di VS Code, lalu jalankan ekstensi **Live Server**. Bisa juga dengan membuka file HTML langsung di browser.
3. Halaman yang bisa dicoba saat ini:
   - `layout.html`: template dasar Admin Panel. Coba ubah lebar jendela browser.
   - `docs/styleguide.html`: etalase design system dan hasil uji kontras.

Diperlukan koneksi internet untuk memuat font dan ikon dari Google Fonts.

**Akun demo** (tersedia setelah halaman login dibuat): username `panitia`, kata sandi `ppdb2026`. Akun ini hanya simulasi dan sengaja dipublikasikan.

## Struktur Folder

```
PROGRAMWEB_2/
├── index.html              # Login (M3)
├── layout.html             # Template master (M2)
├── assets/
│   ├── css/                # main.css → tokens, base, layout, components
│   ├── js/core/            # shell.js (navigasi); modul data menyusul di M3
│   └── img/                # logo.svg
├── pages/                  # Halaman admin (M3)
└── docs/
    ├── perancangan.md      # Dokumen perancangan (M1)
    ├── perencanaan.md      # Rencana pengembangan lengkap
    ├── checklist_work.md   # Pelacakan tugas & log perubahan
    ├── styleguide.html     # Etalase design system (M2)
    └── img/                # Screenshot referensi desain
```

## Dokumentasi

- [Perancangan (M1)](docs/perancangan.md): menu, sitemap, user flow, ERD, wireframe, dan design system.
- [Perencanaan](docs/perencanaan.md): keputusan, kebutuhan, aturan bisnis, tahapan, dan strategi pengujian.
- [Checklist pekerjaan](docs/checklist_work.md): status setiap tugas dan log perubahan file.

## Catatan

- Seluruh isi aplikasi adalah data simulasi untuk keperluan tugas kuliah. Tidak ada lambang instansi pemerintah maupun dokumen resmi.
- Commit memakai email *noreply* GitHub. Setiap push didahului audit keamanan (lihat [perencanaan §15.1](docs/perencanaan.md#151-audit-keamanan-sebelum-push-wajib-d-18)).

---

© 2026 Nurdin · Dibuat untuk tugas mata kuliah Pemrograman Web 2.
