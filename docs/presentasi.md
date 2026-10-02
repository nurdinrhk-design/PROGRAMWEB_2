# Naskah Demo & Tanya-Jawab — Admin Panel PPDB Online

> Bahan presentasi Milestone 3 (Tahap 13.5). Durasi demo **5–7 menit**. Semua data adalah **simulasi** (sekolah, siswa, dan angka fiktif).
> Situs: <https://nurdinrhk-design.github.io/PROGRAMWEB_2/> · Akun demo: `panitia` / `ppdb2026`

## Persiapan (sebelum presentasi)

1. Buka situs di Chrome/Edge, **login sekali**, lalu buka *Data Pendaftar → menu ⋮ → Kembalikan data awal simulasi* agar angka sama dengan naskah ini.
2. Siapkan dua tab: **Dashboard** dan **Verifikasi Berkas**.
3. Perbesar tampilan browser ke 110–125% agar terbaca di proyektor.

## Naskah demo

| Waktu | Bagian | Yang ditunjukkan | Yang diucapkan (inti) |
|---|---|---|---|
| 0:00–0:45 | **Pembuka** | Halaman login | "Ini admin panel PPDB untuk panitia sekolah. Pertanyaan utamanya: *berkas siapa yang harus diperiksa dulu, dan siapa yang masuk kuota?* Semua data fiktif dan disimpan di browser (localStorage)." |
| 0:45–1:15 | **Login** | Isi salah sekali → pesan error di kolom; lalu login benar | "Validasi per kolom, dan setelah 5 kali salah login dikunci 30 detik." |
| 1:15–2:15 | **Dashboard** | 4 angka utama, grafik per hari, tabel keketatan, antrean, jadwal | "Semua angka dihitung dari data, tidak ada angka hiasan. Klik *Lihat pendaftar menunggu* di kartu angka → langsung ke Data Pendaftar yang sudah tersaring. Grafik memakai Chart.js; kalau CDN gagal, datanya tetap tampil sebagai tabel." |
| 2:15–3:15 | **Data Pendaftar** | Tab status, cari NISN, filter jalur, klik nama → detail, hapus → *Urungkan* | "900 data dengan paginasi. Hapus selalu lewat konfirmasi dan bisa diurungkan. Di HP tabel berubah jadi kartu." |
| 3:15–4:15 | **Tambah Pendaftar** | Form 4 langkah: pilih *Zonasi* + tanggal KK 2026 → error; ganti *Afirmasi* → berkas KIP jadi wajib | "Aturan PPDB dicek langsung: NISN unik, usia maksimal 21 tahun, KK zonasi minimal 1 tahun, berkas mengikuti jalur." |
| 4:15–5:15 | **Verifikasi Berkas** | Antrean terlama, cek berkas *Sesuai*, klik *Terverifikasi* | "Tombol Terverifikasi baru aktif kalau semua berkas sesuai. Perbaikan dan Tolak wajib catatan. Setelah memutuskan, langsung lanjut ke pendaftar berikutnya." |
| 5:15–6:00 | **Hasil & Peringkat** | Tab Zonasi, garis batas kuota, cari nama yang tadi diverifikasi | "Peringkat dihitung ulang otomatis: jarak terdekat, lalu usia, lalu waktu daftar. Baris garis batas kuota memisahkan yang masuk kuota dan yang tergeser." |
| 6:00–6:40 | **Rekap & Cetak** | Ubah rentang tanggal, *Cetak rekap* (pratinjau), buka bukti pendaftaran | "Rekap siap dibawa ke rapat panitia. Kop sekolah fiktif tanpa lambang, kolom tanda tangan kosong." |
| 6:40–7:00 | **Penutup** | Kembali ke Dashboard | "Dibuat dengan HTML, CSS, dan JavaScript murni bertema Material Design 3, diuji otomatis 150+ kasus, Lighthouse aksesibilitas 100." |

## Tanya-jawab yang mungkin muncul

**1. Kenapa tidak memakai framework (React, Bootstrap, Tailwind)?**
Tugasnya *client-side programming*, jadi saya ingin menunjukkan dasar HTML/CSS/JS. Tanpa framework, tanpa proses build, dan semua komponen dibuat sendiri dari *design token* (warna, jarak, tipografi di satu berkas `tokens.css`).

**2. Datanya disimpan di mana? Kalau browser ditutup hilang?**
Di `localStorage` browser, jadi tetap ada setelah browser ditutup, tapi hanya di browser itu. Ada fitur unduh/pulihkan cadangan (JSON) dan kembalikan data awal. Untuk sistem sungguhan perlu database server; itu di luar cakupan tugas client-side.

**3. Dari mana 900 data pendaftar?**
Dibuat otomatis oleh generator dengan *seed* tetap (mulberry32), jadi hasilnya selalu sama setiap reset. Nama, NISN (diawali 9), dan nomor HP (diawali 08000) sengaja fiktif.

**4. Bagaimana peringkat dihitung?**
Hanya pendaftar **terverifikasi** yang ikut. Jalur zonasi, afirmasi, dan perpindahan: jarak terdekat → usia lebih tua → waktu daftar lebih awal. Jalur prestasi: skor (rata-rata rapor + bonus prestasi kota +2, provinsi +3, nasional +5) tertinggi. Pendaftar di urutan ≤ kuota berstatus *masuk kuota*.

**5. Apa itu keketatan?**
Terverifikasi dibagi kuota. Contoh zonasi 312 ÷ 216 = 1,44×, artinya ada 1,44 pendaftar terverifikasi untuk setiap kursi.

**6. Kenapa aplikasinya aman padahal semua di browser?**
- Teks dari pengguna selalu ditampilkan dengan `textContent`, tidak pernah `innerHTML`, sehingga isian berbahaya tidak tereksekusi (sudah diuji).
- *Content Security Policy* hanya mengizinkan skrip dari situs sendiri dan Chart.js; Chart.js dikunci versi + *Subresource Integrity*.
- Ekspor CSV diberi pengaman *formula injection*; impor cadangan divalidasi ketat.
- Login dibatasi 5 percobaan; alamat tujuan setelah login dibatasi ke halaman internal.
- Catatan jujur: login ini **simulasi** (akun tertulis di kode). Untuk sistem nyata, autentikasi harus di server.

**7. Bagaimana memastikan tidak ada error?**
150+ uji otomatis di Chrome dan Edge (tiap halaman, tiap aturan bisnis), 23 kasus uji fungsional, validator W3C 0 error, Lighthouse aksesibilitas & praktik terbaik 100 di semua halaman, dan CI GitHub Actions yang memvalidasi HTML/CSS serta memindai rahasia setiap kali push.

**8. Apakah bisa dipakai di HP?**
Ya. Navigasi berubah: drawer modal di HP, rail ikon di tablet, drawer penuh di layar besar. Tabel menjadi kartu di bawah 840px. Diuji di 5 lebar layar (360–1440px).

**9. Kenapa desain Google Stitch tidak dipakai mentah-mentah?**
Desain awal banyak "hiasan" yang tidak jujur (status integrasi Dapodik, akurasi OCR, peta GPS, aksi massal). Semua itu dibuang karena tidak ada fungsinya. Yang dipertahankan hanya yang membantu kerja panitia, misalnya garis batas kuota.

**10. Apa yang bisa dikembangkan selanjutnya?**
Database & autentikasi server, unggah berkas sungguhan, notifikasi ke pendaftar, dan peran pengguna (verifikator, ketua panitia).

## Tautan untuk dikirim ke LMS (Milestone 3)

- Situs: <https://nurdinrhk-design.github.io/PROGRAMWEB_2/>
- Repositori: <https://github.com/nurdinrhk-design/PROGRAMWEB_2>
- Rilis: <https://github.com/nurdinrhk-design/PROGRAMWEB_2/releases/tag/v1.0>
