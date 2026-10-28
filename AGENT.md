# 🤖 AI Coding Agent Guidelines

Dokumen ini berisi standar kerja dan aturan wajib bagi AI Coding Agent di repository ini.

---

## 1. Project Context

* **Development Environment:** Komputer lokal berbasis Windows.
* **Coding Environment:** Antigravity.
* **Project Type:** React dengan Vite.
* **Database dan Backend Service:** Supabase.
* **Package Manager:** Gunakan package manager yang sudah digunakan project, seperti npm, pnpm, atau yarn.
* **Version Control:** Git dan GitHub.
* **Deployment:** Otomatis melalui GitHub Actions setelah perubahan di-push ke branch `main`.

AI Agent harus memahami bahwa proses coding dilakukan di komputer lokal Windows, bukan langsung di VPS.

Jangan menjalankan perintah Linux seperti:

```bash
sudo
apt
systemctl
service
```

Kecuali pengguna secara khusus meminta perubahan pada server atau konfigurasi deployment.

---

## 2. Token Efficiency

AI Agent wajib bekerja secara hemat token.

Aturan penggunaan token:

* Jawab secara singkat dan langsung ke inti.
* Jangan mengulang instruksi pengguna.
* Jangan memberikan penjelasan panjang jika tidak diperlukan.
* Jangan menampilkan seluruh isi file jika hanya mengubah sebagian kecil.
* Jangan membaca seluruh repository tanpa kebutuhan.
* Periksa hanya file yang relevan dengan tugas.
* Jangan melakukan pencarian berulang terhadap informasi yang sudah ditemukan.
* Jangan membuat dokumentasi tambahan kecuali diminta.
* Jangan memberikan tutorial panjang setelah perubahan selesai.
* Jangan menjelaskan setiap perintah terminal secara terpisah.
* Gabungkan pemeriksaan file yang saling berkaitan.
* Gunakan implementasi paling sederhana yang memenuhi kebutuhan.
* Hindari refactor besar jika tugas hanya membutuhkan perubahan kecil.
* Jangan menambahkan komentar kode yang berlebihan.
* Jangan membuat beberapa alternatif solusi kecuali diminta.

Laporan akhir cukup berisi:

* Perubahan utama.
* File yang diubah.
* Commit yang dibuat.
* Status push.
* Kendala penting jika ada.

---

## 3. Existing Project Preservation

Sebelum mengubah kode, AI Agent harus:

* Memahami permintaan pengguna.
* Membaca file yang berkaitan langsung dengan tugas.
* Mengikuti pola coding yang sudah digunakan.
* Mempertahankan struktur folder existing.
* Menghindari perubahan pada file yang tidak berhubungan.
* Memastikan fitur lama tidak sengaja dihapus.

AI Agent dilarang mengubah struktur folder utama tanpa instruksi spesifik.

Contoh struktur umum yang harus dipertahankan:

```text
src/
├── components/
├── pages/
├── hooks/
├── services/
├── lib/
├── assets/
└── App.jsx
```

Ikuti struktur aktual repository jika berbeda.

---

## 4. React and Vite Standards

Kode React harus:

* Menggunakan functional components.
* Menggunakan hooks secara benar.
* Memisahkan komponen besar menjadi komponen yang lebih kecil jika memang diperlukan.
* Menghindari duplikasi kode.
* Menggunakan nama component, function, dan variable yang jelas.
* Mengikuti pola JavaScript atau TypeScript yang sudah digunakan project.
* Tidak mengubah project JavaScript menjadi TypeScript tanpa instruksi.
* Tidak menambahkan library baru tanpa kebutuhan yang jelas.
* Tidak menggunakan state global untuk data yang hanya digunakan satu component.
* Tidak melakukan manipulasi DOM langsung kecuali benar-benar diperlukan.
* Tidak menyimpan data sensitif di frontend.

Gunakan environment variables Vite dengan prefix:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Akses environment variable dengan:

```javascript
import.meta.env.VITE_SUPABASE_URL
```

Jangan menggunakan:

```javascript
process.env
```

Kecuali project memang memiliki konfigurasi tambahan yang mendukungnya.

---

## 5. Supabase Standards

Gunakan Supabase client yang terpusat.

Contoh:

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
```

Jangan membuat instance Supabase baru di setiap component.

Gunakan satu file client, misalnya:

```text
src/lib/supabase.js
```

atau ikuti lokasi yang sudah digunakan project.

AI Agent wajib:

* Menangani error dari request Supabase.
* Menangani kondisi loading.
* Menghindari query yang tidak diperlukan.
* Memilih kolom yang dibutuhkan jika memungkinkan.
* Menggunakan filter query secara tepat.
* Menghindari pengambilan seluruh data jika hanya membutuhkan sebagian.
* Menggunakan pagination untuk data dalam jumlah besar.
* Membersihkan realtime subscription ketika component di-unmount.

Contoh cleanup subscription:

```javascript
useEffect(() => {
  const channel = supabase
    .channel('example-channel')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'example_table',
      },
      handleChange
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);
```

---

## 6. Supabase Security

Frontend tidak boleh dianggap sebagai lapisan keamanan.

AI Agent harus memastikan:

* Row Level Security atau RLS digunakan pada tabel yang diakses frontend.
* Authorization tidak hanya dilakukan dengan menyembunyikan tombol.
* User tidak dapat membaca atau mengubah data milik user lain tanpa izin.
* Service Role Key tidak pernah digunakan di frontend.
* Database password tidak pernah disimpan di source code.
* Secret API key tidak dimasukkan ke environment variable frontend.
* Input pengguna tetap divalidasi sebelum dikirim.
* Query mengikuti hak akses user yang sedang login.

Dilarang menyimpan berikut ini di frontend:

```env
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_PASSWORD=
PRIVATE_API_KEY=
SERVER_SECRET=
```

`VITE_SUPABASE_ANON_KEY` boleh digunakan di frontend selama RLS telah dikonfigurasi dengan benar.

---

## 7. Environment Variables

Gunakan file `.env` untuk konfigurasi lokal.

Contoh:

```env
VITE_SUPABASE_URL=https://example.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Pastikan file berikut masuk `.gitignore`:

```text
.env
.env.local
.env.production
```

Gunakan `.env.example` tanpa nilai rahasia:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

AI Agent dilarang:

* Menampilkan isi credential dalam laporan.
* Menyimpan credential di source code.
* Memasukkan `.env` ke commit.
* Mengubah credential production tanpa instruksi.
* Menggunakan Service Role Key di React atau Vite.

---

## 8. Code Quality

Kode harus:

* Sederhana dan mudah dipahami.
* Mengikuti style existing project.
* Tidak memiliki kode duplikat yang tidak diperlukan.
* Tidak memiliki import yang tidak digunakan.
* Tidak meninggalkan variable yang tidak digunakan.
* Tidak meninggalkan debugging sementara.
* Tidak menggunakan hardcoded data sensitif.
* Tidak membuat abstraction berlebihan untuk fitur kecil.

Hapus debugging seperti:

```javascript
console.log()
console.table()
debugger
alert()
```

Kecuali memang diperlukan atau diminta oleh pengguna.

Jangan mengubah format seluruh file jika hanya memperbaiki beberapa baris.

---

## 9. UI and Styling

AI Agent harus mengikuti sistem styling yang sudah digunakan project.

Contoh:

* CSS biasa.
* CSS Modules.
* Tailwind CSS.
* Styled Components.
* Component library tertentu.

Jangan menambahkan framework styling baru jika project sudah memiliki sistem styling.

Perubahan UI harus:

* Responsif.
* Konsisten dengan halaman existing.
* Tidak merusak tampilan mobile.
* Tidak mengubah branding tanpa instruksi.
* Tidak menambahkan wording baru tanpa permintaan.
* Tidak mengganti warna, font, atau layout global tanpa kebutuhan.

---

## 10. Dependency Rules

Sebelum menambahkan package baru:

* Periksa apakah fungsi tersebut dapat dibuat dengan dependency existing.
* Pastikan package kompatibel dengan React dan Vite yang digunakan.
* Hindari package besar untuk kebutuhan sederhana.
* Jangan memperbarui seluruh dependency tanpa instruksi.
* Jangan menghapus package tanpa memastikan package tersebut tidak digunakan.

Gunakan package manager yang sudah digunakan repository.

Contoh:

```bash
npm install package-name
```

Jangan mengganti npm ke yarn atau pnpm tanpa instruksi.

---

## 11. Testing and Verification

AI Agent tidak diwajibkan menjalankan:

```bash
npm test
npm run test
npm run build
npm run lint
```

AI Agent juga tidak perlu membuat unit test atau integration test kecuali diminta secara khusus.

Sebelum commit, AI Agent cukup:

* Meninjau perubahan yang dibuat.
* Memastikan tidak ada kesalahan kode yang terlihat jelas.
* Memastikan import dan nama variable sesuai.
* Memastikan file yang diubah sesuai dengan permintaan.
* Memeriksa `git diff`.
* Memeriksa `git status`.

Perintah minimum:

```bash
git diff
git status
```

AI Agent tidak boleh menghabiskan token untuk verifikasi atau testing yang tidak diminta.

Jika pengguna secara khusus meminta testing, build, atau lint, barulah perintah terkait dijalankan.

---

## 12. Git Workflow

### 12.1 Check Changes

Sebelum commit:

```bash
git status
git diff
```

Pastikan hanya file yang berkaitan dengan tugas yang dimasukkan ke commit.

### 12.2 Granular Commit

Setiap satu tugas atau fitur kecil harus memiliki commit tersendiri.

Gunakan Conventional Commits:

```text
feat: add user profile page
fix: correct Supabase authentication flow
style: improve dashboard layout
refactor: simplify asset query
docs: update project guidelines
chore: update project configuration
```

Hindari commit message seperti:

```text
update
revisi
fix
perubahan
```

### 12.3 Stage Files

Utamakan menambahkan file secara spesifik:

```bash
git add src/pages/Dashboard.jsx
git add src/components/UserCard.jsx
```

Hindari:

```bash
git add .
```

Jika terdapat file lain yang tidak berhubungan dengan tugas.

### 12.4 Commit

Contoh:

```bash
git commit -m "feat: add Supabase user profile"
```

---

## 13. Mandatory Push and CI/CD Trigger

Setelah perubahan selesai dan commit berhasil, AI Agent wajib menjalankan:

```bash
git push origin main
```

Push ke branch `main` menjadi trigger GitHub Actions untuk deployment otomatis.

Sebelum push, periksa branch:

```bash
git branch --show-current
```

Push hanya boleh dilakukan jika branch aktif adalah:

```text
main
```

Jika branch aktif bukan `main`, jangan berpindah branch, merge, atau push secara otomatis tanpa instruksi pengguna.

AI Agent dilarang menjalankan:

```bash
git push --force
git push -f
```

AI Agent tidak perlu menunggu atau memverifikasi pipeline CI/CD setelah push, kecuali pengguna meminta pengecekan pipeline.

Push berhasil tidak selalu berarti deployment berhasil. Namun AI Agent cukup melaporkan status push yang tersedia dari terminal.

---

## 14. Git Restrictions

AI Agent dilarang menjalankan perintah berikut tanpa persetujuan:

```bash
git reset --hard
git clean -fd
git checkout -- .
git restore .
git rebase
git push --force
git branch -D
```

AI Agent tidak boleh:

* Menghapus perubahan lokal milik pengguna.
* Menimpa file yang belum di-commit.
* Mengubah commit lama.
* Menghapus branch.
* Melakukan force push.
* Melakukan merge besar tanpa instruksi.
* Memasukkan `.env` ke Git.

Jika terdapat perubahan lokal yang bukan hasil kerja AI Agent, biarkan perubahan tersebut tetap ada.

---

## 15. Destructive Command Restrictions

Dilarang menjalankan perintah destruktif tanpa persetujuan eksplisit.

Contoh perintah Windows:

```powershell
Remove-Item -Recurse -Force
del /s /q
rmdir /s /q
```

Contoh perintah database:

```sql
DROP DATABASE
DROP TABLE
TRUNCATE TABLE
DELETE FROM table_name
```

AI Agent juga dilarang:

* Menghapus project.
* Menghapus folder `src`.
* Menghapus tabel Supabase.
* Menghapus bucket Supabase Storage.
* Menghapus user Supabase Auth.
* Menghapus data dalam jumlah besar.
* Menjalankan migration destruktif.

Untuk tindakan yang berisiko kehilangan data, AI Agent harus meminta persetujuan pengguna terlebih dahulu.

---

## 16. Supabase Database Changes

Jangan mengubah struktur database tanpa instruksi yang jelas.

Jika perubahan database diperlukan:

* Buat SQL yang spesifik.
* Jangan langsung menjalankan query destruktif.
* Jangan menghapus kolom existing.
* Jangan mengubah tipe data kolom tanpa analisis dampak.
* Jangan menonaktifkan RLS hanya untuk membuat fitur berfungsi.
* Jangan membuat policy yang terlalu terbuka.
* Jangan menggunakan policy `true` untuk semua operasi tanpa alasan yang jelas.

Contoh policy yang harus dihindari:

```sql
USING (true)
WITH CHECK (true)
```

Gunakan policy berdasarkan user yang sedang login jika data bersifat pribadi:

```sql
auth.uid() = user_id
```

AI Agent tidak boleh mengubah project Supabase production tanpa persetujuan pengguna.

---

## 17. Scope Control

AI Agent hanya boleh mengerjakan ruang lingkup yang diminta.

Contoh:

* Jika diminta memperbaiki form, jangan sekaligus redesign seluruh halaman.
* Jika diminta memperbaiki satu component, jangan refactor seluruh project.
* Jika diminta mengubah wording, jangan mengubah layout.
* Jika diminta memperbaiki query, jangan mengubah schema database.
* Jika diminta memperbaiki tampilan desktop, tetap pastikan mobile tidak rusak tetapi jangan redesign mobile tanpa kebutuhan.

Jika ditemukan masalah lain di luar ruang lingkup, cukup laporkan secara singkat tanpa langsung mengubahnya.

---

## 18. Communication Rules

AI Agent harus berkomunikasi secara ringkas.

Jangan memberikan:

* Penjelasan berulang.
* Tutorial panjang.
* Analisis setiap baris kode.
* Isi lengkap file yang sudah diubah.
* Daftar langkah yang terlalu panjang.
* Saran tambahan yang tidak berkaitan.
* Klaim bahwa testing berhasil jika testing tidak dijalankan.

Jangan mengatakan:

```text
All tests passed
Build successful
Lint passed
```

Jika perintah tersebut tidak dijalankan.

Gunakan laporan seperti:

```text
Perubahan selesai.

File:
- src/pages/Profile.jsx
- src/lib/supabase.js

Git:
- Commit: feat: add user profile
- Push: origin/main berhasil

Testing tidak dijalankan sesuai aturan project.
```

---

## 19. Task Completion Report

Setelah tugas selesai, laporan cukup menggunakan format berikut:

```text
Selesai.

Perubahan:
- Menambahkan halaman profil pengguna.
- Menghubungkan data profil dengan Supabase.

File:
- src/pages/Profile.jsx
- src/services/profileService.js

Git:
- Commit: feat: add user profile
- Push: origin/main berhasil

Catatan:
- Testing dan build tidak dijalankan sesuai aturan project.
```

Jangan membuat laporan panjang kecuali pengguna memintanya.

---

## 20. Definition of Done

Tugas dianggap selesai jika:

* Permintaan pengguna sudah diterapkan.
* Perubahan hanya mencakup ruang lingkup yang diminta.
* Struktur existing project tetap dipertahankan.
* Tidak ada credential yang dimasukkan ke source code.
* Perubahan sudah ditinjau melalui `git diff`.
* File terkait sudah di-commit.
* Commit menggunakan Conventional Commits.
* Commit sudah di-push ke `origin/main`.
* Status akhir sudah dilaporkan secara singkat.

Testing, lint, dan build bukan syarat Definition of Done kecuali diminta pengguna.

---

## 21. Mandatory Workflow

Urutan kerja AI Agent:

```text
Understand request
→ Inspect relevant files only
→ Implement minimal changes
→ Review git diff
→ Commit
→ Push origin main
→ Report briefly
```

Prinsip utama:

> Kerjakan hanya yang diminta, gunakan token secara efisien, hindari perubahan berlebihan, dan jangan menjalankan testing atau build kecuali diminta.
