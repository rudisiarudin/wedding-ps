# Design.md — Template Undangan Digital (Re-skin dari ayurudi.web.id)

Dokumen desain untuk memakai ulang template undangan pernikahan digital
**ayurudi.web.id** ("The Wedding of Ayu & Rudi") untuk acara berikutnya.

Prinsipnya: **struktur, urutan seksi, tipografi, dan komponen dipertahankan
persis seperti template asli — yang diganti total hanya palet warnanya**,
dari tema lama *earthy olive–sage–gold* menjadi tema baru
**Moss · Olive · Mahogany · Egg Shell · Linen** (palet tanah yang hangat:
hijau lumut, cokelat mahoni, krem telur & linen).

> Riwayat palet: palet Navy/Teal/Sky/Beige dan revisi latar cat air biru
> yang sempat dipakai di versi sebelumnya **digantikan** palet ini atas
> persetujuan pemesan (26 Oktober 2026 malam). Rujukan visual: kartu
> undangan hijau olive berornamen botanikal garis putih ("Maria & Jonas")
> dan daun calla putih–hijau — lihat Bagian 11.

---

## 1. Palet Warna Baru

| Nama      | Hex       | Peran utama                                                          |
|-----------|-----------|---------------------------------------------------------------------|
| Moss      | `#6A6A53` | Warna utama: latar seksi gelap, judul di latar terang, tombol       |
| Olive     | `#9B9879` | Warna sekunder: ornamen garis, pembatas, aksen besar                |
| Mahogany  | `#4D342D` | Aksen gelap hangat: teks isi, tombol primer, detail penting         |
| Egg Shell | `#EDE7DB` | Latar terang utama, teks di atas Moss/Mahogany                       |
| Linen     | `#DDCCB7` | Latar kartu lembut, chip dresscode, aksen terang di latar gelap     |
| White     | `#FFFFFF` | Permukaan kartu & form (pendamping, bukan warna tema)               |

Karakter tema: warna alam yang membumi — hijau lumut dan daun zaitun,
diimbangi cokelat mahoni yang dalam, di atas krem telur dan linen yang
lembut. Hangat, dewasa, dan nyambung dengan foto outdoor/petualangan.

---

## 2. Pemetaan Warna Lama → Baru

Template asli memakai variabel warna berikut. Cukup ganti nilainya:

| Token                    | Lama (earthy)   | Baru            | Dipakai di                                   |
|--------------------------|-----------------|-----------------|----------------------------------------------|
| `--color-primary`        | `#50593F` olive | `#6A6A53` Moss  | Judul, seksi gelap, tombol, footer           |
| `--color-secondary`      | `#94A27C` sage  | `#9B9879` Olive | Ornamen, ikon, garis, aksen besar            |
| `--color-tertiary`       | `#C6B793` sand  | `#DDCCB7` Linen | Latar chip, kartu, highlight lembut          |
| `--color-gold`           | `#B89E6A` gold  | `#4D342D` Mahogany *(lihat catatan)* | Aksen gelap: teks penting, tombol primer |
| `--color-neutral`        | `#F7F1E6` cream | `#EDE7DB` Egg Shell | Latar seksi terang bergantian            |
| `--color-white`          | `#FFFFFF`       | `#FFFFFF`       | Kartu, form                                  |

Warna turunan di template lama ikut diganti:

| Warna lama        | Asal               | Ganti menjadi                                   |
|-------------------|--------------------|-------------------------------------------------|
| `#3D4238`         | teks gelap olive   | `#4D342D` (Mahogany) untuk teks; `#54543E` (Moss pekat) untuk judul |
| `#7C6A50`, `#5B4636` | cokelat teks/aksen | `#4D342D` (Mahogany)                          |
| `#F5ECE0`, `#FAF5EB`, `#F3EAD8` | varian krem latar | `#EDE7DB` (Egg Shell) / `#DDCCB7` (Linen) |
| `#F9F8F4`         | putih hangat       | `#EDE7DB` (Egg Shell)                           |
| Tint sage transparan | latar kartu      | Linen `#DDCCB7` dengan opacity 35–50%           |

> Catatan `--color-gold`: peran "aksen pekat" pada tema baru diambil alih
> Mahogany — cokelat gelap hangat yang menggantikan fungsi emas lama
> (garis ornamen penting, tombol, teks penekanan) tanpa kesan metalik.

### Token CSS siap tempel

```css
:root {
  /* Palet baru */
  --color-primary:   #6A6A53;  /* Moss */
  --color-secondary: #9B9879;  /* Olive */
  --color-tertiary:  #DDCCB7;  /* Linen */
  --color-gold:      #4D342D;  /* aksen kini Mahogany */
  --color-neutral:   #EDE7DB;  /* Egg Shell */
  --color-white:     #FFFFFF;

  /* Turunan yang disarankan */
  --color-primary-deep: #54543E; /* Moss pekat — judul & teks di latar terang */
  --color-ink:       #4D342D;  /* teks isi utama (Mahogany) */
  --color-muted:     #6F6C50;  /* teks sekunder di latar terang */
  --color-line:      #DDCCB7;  /* garis & border lembut */
  --color-linen-tint: rgb(221 204 183 / 0.45); /* latar kartu lembut */
}
```

---

## 3. Tipografi (Tidak Berubah dari Template)

| Peran            | Font                          | Pemakaian                                        |
|------------------|-------------------------------|--------------------------------------------------|
| Display          | Playfair Display              | Judul seksi ("Time & Location", "Love Story")    |
| Script           | Charlotte Southern            | Nama mempelai di cover & seksi mempelai          |
| Serif            | Lora (termasuk italic)        | Kutipan ayat, teks narasi, tanggal               |
| Sans / Body      | Inter                         | Isi teks, form, tombol, keterangan               |
| Label / Angka    | Outfit                        | Label kecil huruf kapital, angka countdown       |
| Arab             | Amiri (cadangan: Lateef)      | Bismillah, ayat, doa pengantin                   |
| Display cadangan | Cinzel / Italiana             | Huruf kapital berjarak lebar ("THE WEDDING OF")  |

Aturan pakai:
- Nama mempelai selalu font script, ukuran paling besar di halaman.
- Label seksi (mis. "SAVE THE DATE", "OUR JOURNEY") memakai Outfit/Inter
  huruf kapital dengan letter-spacing lebar, warna Mahogany di latar
  terang / Linen di latar gelap.
- Judul seksi memakai Playfair Display warna Moss pekat `#54543E`
  (di latar gelap: Egg Shell).
- Teks isi memakai Inter/Lora warna Mahogany; Olive hanya untuk teks
  besar/dekoratif — kontrasnya tidak cukup untuk paragraf (lihat §7).

---

## 4. Inventaris Seksi (Urutan Sesuai Template Asli)

1. **Cover / Hero** — latar Moss penuh dengan ornamen botanikal garis
   Egg Shell di sudut (pakis/daun, gaya referensi), "THE WEDDING OF",
   nama mempelai (script, Egg Shell), countdown, kutipan QS.
   Adz-Zariyat 49, tanggal acara. Tombol "Buka Undangan" pill Egg Shell
   teks Mahogany.
2. **Ayat Suci** — foto latar mempelai, kutipan QS. Ar-Rum 21.
   Overlay Moss pekat transparan ±55% agar teks Egg Shell terbaca.
3. **Pembuka** — kaligrafi Bismillah (tint Mahogany), salam, teks
   undangan. Latar Egg Shell.
4. **Mempelai** — foto pasangan, ornamen cincin, nama + nama orang tua
   kedua mempelai, ornamen daun kiri–kanan (tint Olive/Moss).
   Latar White/Egg Shell.
5. **Save The Date — Time & Location** — dua kartu: **Akad Nikah** dan
   **Resepsi** (bulan, nama hari, angka tanggal besar, tahun, jam, venue,
   alamat, tombol lokasi/Maps). Kartu White di atas latar Linen tint,
   angka tanggal Playfair warna Mahogany, tombol Moss.
6. **Dresscode** — chip palet warna anjuran untuk tamu + kutipan penutup.
   Chip diisi kelima warna palet baru: Moss, Olive, Mahogany,
   Egg Shell, Linen.
7. **Love Story (Our Journey)** — linimasa cerita pasangan. Latar
   Egg Shell, garis linimasa Olive, titik linimasa Mahogany.
8. **Gallery (Our Moments)** — grid foto. Bingkai White, bayangan lembut.
9. **Wedding Gift (Share The Joy)** — amplop digital: kartu rekening /
   e-wallet + tombol salin nomor. Kartu Linen tint, tombol salin Moss.
10. **Wedding Wishes (Guest Book)** — form ucapan + daftar pesan tamu,
    ditutup doa untuk pengantin (Arab + terjemahan).
    Latar Egg Shell/White.
11. **Penutup** — teks terima kasih, salam penutup, "Kami Yang
    Berbahagia", foto/tanda tangan mempelai. Latar Moss pekat, teks
    Egg Shell/Linen (seksi gelap penuh — penutup yang tegas).

---

## 5. Komponen

- **Tombol primer** — latar Mahogany `#4D342D`, teks Egg Shell, sudut
  membulat penuh (pill). Hover: Moss `#6A6A53`.
- **Tombol sekunder** — latar transparan, border 1px Moss, teks Mahogany.
  Hover: latar Linen tint.
- **Tombol di latar gelap** — latar Egg Shell, teks Mahogany
  (seperti tombol cover).
- **Countdown** — empat kotak Egg Shell/White dengan border Linen,
  angka Outfit/Playfair warna Mahogany, label kecil Olive huruf kapital
  (di cover gelap: kotak transparan border Linen, angka Egg Shell).
- **Kartu acara** — White, radius besar (±24px), bayangan lembut,
  aksen garis atas Olive.
- **Chip dresscode** — lingkaran warna sesuai palet + nama warna
  di bawahnya (Moss, Olive, Mahogany, Egg Shell, Linen).
- **Kartu amplop digital** — latar Linen tint, logo bank/e-wallet asli
  (jangan diwarnai ulang), tombol "Salin Nomor" Moss.
- **Form buku tamu** — input White border Linen, fokus border Moss,
  tombol kirim Mahogany.
- **Ornamen botanikal** — garis pakis/daun warna Egg Shell di atas
  latar Moss (seksi gelap) dan tint Olive/Moss di atas latar terang,
  mengikuti rujukan Bagian 11. Aset floral vintage template lama
  (mawar dsb.) dilepas. **Foto tidak diubah warnanya** (boleh
  dihangatkan sangat tipis agar menyatu ke palet).

---

## 6. Layout

- Mobile-first: kolom undangan di tengah layar, lebar maksimum
  mengikuti container template (hingga 36rem / ±576px) — di desktop,
  sisi kiri–kanan kolom diisi latar Egg Shell atau Linen tint.
- Setiap seksi full-width dengan latar bergantian Egg Shell ↔ White,
  ritme vertikal longgar (padding atas–bawah besar), teks rata tengah
  kecuali daftar ucapan tamu.
- Seksi gelap: Cover dan Penutup (Moss/Moss pekat). Panel Save The Date
  boleh dibuat Moss bila ingin meniru panel gelap template asli.

---

## 7. Kontras & Aksesibilitas

- **Sangat aman:** Mahogany di atas Egg Shell (±9,3:1 — teks isi utama);
  Egg Shell/White di atas Mahogany (±9–11:1); Moss pekat `#54543E`
  di atas Egg Shell (±6:1).
- **Aman untuk judul & teks besar:** Moss di atas Egg Shell (±4,4:1);
  Egg Shell di atas Moss (±4,4:1); Linen di atas Moss hanya untuk
  label/aksen besar (±3,5:1).
- **Hati-hati:** Olive `#9B9879` di atas Egg Shell hanya ±2,4:1 —
  khusus ornamen dan teks dekoratif besar, **jangan** untuk paragraf.
  Paragraf selalu Mahogany (di latar terang) atau Egg Shell
  (di latar gelap).
- **Jangan:** teks Linen/Egg Shell di atas White; keduanya hanya untuk
  latar & dekorasi.
- Teks di atas foto (seksi Ayat Suci) selalu diberi overlay Moss pekat.

---

## 8. Checklist Ganti Konten — Status untuk Acara Ini

Sudah terisi dari data mempelai (rincian lengkap di Bagian 10):

- [x] Nama kedua mempelai + nama ayah/ibu masing-masing
- [x] Tanggal & jam Akad dan Resepsi + target countdown (22 Nov 2026, 08.30 WIB)
- [x] Nama venue + alamat lengkap + tautan Google Maps
- [x] Ayat/kutipan pembuka (tetap dari template: QS. Adz-Zariyat 49 & Ar-Rum 21)
- [x] Dresscode (palet baru: Moss, Olive, Mahogany, Egg Shell, Linen)
- [x] Isi Love Story (3 bab, teks lengkap di Bagian 10)
- [x] Nomor rekening Wedding Gift (2 rekening BCA)
- [x] Judul halaman: "The Wedding of Putri & Syarif"
- [x] Foto galeri & mempelai — tersedia: set foto outdoor/Jeep mempelai
- [ ] Musik latar — belum ditentukan

---

## 9. Catatan Implementasi

- Re-skin cukup dilakukan dari variabel `:root` di atas + penyesuaian
  warna ornamen; tidak ada perubahan struktur HTML/komponen.
- Font tidak berubah — semua sudah dimuat template dari Google Fonts
  (Inter, Lora, Playfair Display, Great Vibes, Amiri, Lateef, Outfit)
  ditambah Charlotte Southern, Cinzel, Italiana dari aset tema.
- Uji akhir: cek countdown, tombol salin rekening, form ucapan, dan
  tampilan di layar kecil setelah warna diganti.

## 10. Data & Konten Acara — Putri & Syarif (Lengkap)

Seluruh data di bawah ini adalah isi final undangan; gunakan apa adanya.

### Identitas acara
- **Judul:** The Wedding of Putri & Syarif
- **Hari/Tanggal:** Minggu, 22 November 2026
- **Target countdown:** 22 November 2026 pukul 08.30 WIB
  (`2026-11-22T08:30:00+07:00`)

### Mempelai
- **Mempelai pria:** Moch Syarif Hidayat — putra keenam dari
  Bapak Nindin & Ibu Yayah
- **Mempelai wanita:** Putri Andiani — putri pertama dari
  Bapak Andrian & Ibu Ai Mimah

### Jadwal & tempat
- **Akad Nikah:** Minggu, 22 November 2026 — pukul 08.30–10.00 WIB
- **Resepsi:** Minggu, 22 November 2026 — pukul 11.00 WIB – selesai
- **Venue:** MI Mihadunal Ula
- **Alamat:** Sukatani, Kec. Pacet, Kab. Cianjur, Jawa Barat 43253
- **Google Maps:** https://maps.app.goo.gl/3FLRtUZzo5dF4da48

### Love Story

**Chapter I: Titik Awal (Akhir Desember 2016)**
> Semua bermula dari sebuah perkenalan sederhana di penghujung tahun 2016.
> Berkat perantara seorang teman, jalan takdir mempertemukan kami untuk
> pertama kalinya. Siapa sangka, sapaan di akhir Desember itu menjadi awal
> dari lembaran baru yang mengubah arah hidup kami selamanya. Dari obrolan
> ringan, perlahan tumbuh rasa nyaman yang membawa kami pada perjalanan
> panjang ini.

**Chapter II: Mengikat Janji (14 Juni 2026)**
> Waktu telah menguji, dan keyakinan telah berbicara. Setelah
> bertahun-tahun membersamai dalam suka dan duka, kami memutuskan untuk
> melangkah ke jenjang yang lebih serius. Tepat pada tanggal 14 Juni 2026,
> di hadapan keluarga tercinta, kami mengikat janji suci dalam sebuah
> pertunangan — menandakan bahwa hati kami telah mantap untuk bersatu.

**Chapter III: Menuju Selamanya (22 November 2026)**
> Kini, penantian panjang itu sampai pada puncaknya. Dengan izin dan
> ridha-Nya, babak terindah dalam hidup kami akan segera dimulai. Pada
> tanggal 22 November 2026, kami akan mengikrarkan janji sehidup semati.
> Kehadiran dan doa restu dari Bapak/Ibu/Saudara/i sekalian akan menjadi
> kado terindah di hari penyatuan cinta kami.

### Wedding Gift (amplop digital)
- BCA — **1970822875** a.n. Putri Andiani
- BCA — **2832453324** a.n. Moch Syarif Hidayat

### Wedding Wishes
- Seksi buku tamu aktif: form nama + ucapan/doa, daftar pesan tamu,
  ditutup blok "Do'a Untuk Pengantin" dari template (Arab + terjemahan).

### Belum tersedia
- Musik latar — belum ditentukan.

---

## 11. Revisi Palet Final (26 Oktober 2026 malam — persetujuan pemesan)

Pemesan menyetujui **ganti palet warna** dari Navy/Teal/Sky/Beige
(dan latar cat air biru) menjadi palet tanah berikut, mengikuti papan
palet + dua gambar referensi yang dikirim:

- **Palet:** Moss `#6A6A53` · Olive `#9B9879` · Mahogany `#4D342D` ·
  Egg Shell `#EDE7DB` · Linen `#DDCCB7`.
- **Referensi 1 — kartu undangan hijau olive** ("Save The Date —
  Maria & Jonas"): latar hijau polos, ornamen **botanikal garis putih**
  (pakis, daun, bunga liar) membingkai sudut, tipografi serif elegan.
  Inilah arah ornamen utama tema ini.
- **Referensi 2 — daun calla putih–hijau** di atas putih: suasana
  botanikal lembut untuk seksi terang (ornamen tint Moss/Olive,
  bukan biru).
- Konsekuensi: latar cat air biru & ornamen mawar vintage dilepas;
  seksi gelap kini Moss (bukan Navy); aksen pekat kini Mahogany
  (bukan Teal/emas).
- Dua contoh cover dengan palet ini sudah dibuat sebagai mockup gambar:
  gaya teknis "Eiger" (huruf condensed, kontur topografi, badge
  stempel) dan gaya "Botanical Olive" (serif + pakis garis putih,
  paling dekat ke referensi). Keduanya memakai palet Bagian 1;
  pilihan gaya final mengikuti pemesan.

---

*Sumber template: https://www.ayurudi.web.id — dokumen ini adalah versi
baru dari design.md (palet Moss), disusun 26 Oktober 2026 malam.*
