# 📱 Panduan Upload ke GitHub → Download APK
## Gratis, Tanpa Install Apapun di Laptop!

---

## LANGKAH 1 — Buat Akun GitHub (jika belum punya)

1. Buka **github.com**
2. Klik **Sign Up**
3. Isi email, password, username
4. Verifikasi email
5. ✅ Akun siap

---

## LANGKAH 2 — Buat Repository Baru

1. Setelah login, klik tombol **"+"** di pojok kanan atas
2. Pilih **"New repository"**
3. Isi:
   - **Repository name:** `gudang-bongkar-muat`
   - Pilih **Public** (gratis)
   - ❌ Jangan centang "Add a README file"
4. Klik **"Create repository"**

---

## LANGKAH 3 — Upload File Project

1. Di halaman repository yang baru dibuat, klik **"uploading an existing file"**
2. **Drag & drop** semua file dari folder `gudang-app` yang sudah didownload
3. ⚠️ **PENTING:** Pastikan struktur folder seperti ini:
   ```
   gudang-bongkar-muat/
   ├── .github/
   │   └── workflows/
   │       └── build-apk.yml     ← FILE INI WAJIB ADA!
   ├── src/
   │   ├── App.jsx
   │   └── main.jsx
   ├── index.html
   ├── package.json
   ├── vite.config.js
   └── capacitor.config.js
   ```
4. Scroll ke bawah, klik **"Commit changes"**

---

## LANGKAH 4 — Cek Build Berjalan Otomatis

1. Klik tab **"Actions"** di repository Anda
2. Akan muncul workflow **"Build Android APK"** yang sedang berjalan
3. Tunggu sekitar **5–10 menit** (ada loading spinner kuning)
4. Kalau berhasil: muncul ✅ hijau
5. Kalau gagal: muncul ❌ merah (lihat bagian Troubleshooting di bawah)

---

## LANGKAH 5 — Download APK

1. Klik workflow yang sudah selesai (✅ hijau)
2. Scroll ke bawah ke bagian **"Artifacts"**
3. Klik **"gudang-bongkar-muat-apk"** untuk download
4. File `.zip` akan terdownload → extract → dapatkan file **`app-debug.apk`**

---

## LANGKAH 6 — Install APK ke HP Android Staf

### Kirim via WhatsApp:
1. Kirim file `app-debug.apk` ke HP staf via WhatsApp
2. Di HP staf, tap file APK yang diterima
3. Muncul pesan **"Diblokir oleh Play Protect"** → tap **"Install tetap"**
4. Muncul **"Sumber tidak dikenal"** → tap **Pengaturan** → aktifkan → kembali → **Install**
5. ✅ App terinstall! Buka dari homescreen

### Atau kirim via kabel USB / Google Drive / email

---

## 🔄 Update App di Masa Depan

Kalau ada perubahan (misalnya tambah fitur):
1. Edit file di GitHub langsung (klik file → klik ikon pensil)
2. Simpan perubahan (Commit)
3. GitHub Actions otomatis build APK baru
4. Download APK baru → kirim ke HP staf

---

## ❓ Troubleshooting

### Build gagal (❌ merah di Actions)?
1. Klik workflow yang gagal
2. Klik step yang merah untuk lihat error
3. Screenshot error dan hubungi developer

### APK tidak bisa diinstall?
- Pastikan aktifkan **"Install dari sumber tidak dikenal"** di Pengaturan HP
- Coba lewat: Pengaturan → Aplikasi → Menu ⋮ → Akses khusus → Install aplikasi tidak dikenal

### Kamera tidak bisa dibuka di app?
- Pengaturan HP → Aplikasi → Gudang Bongkar Muat → Izin → Kamera → Izinkan

---

## ✅ Ringkasan Biaya

| Item | Biaya |
|------|-------|
| GitHub | **GRATIS** |
| GitHub Actions (2000 menit/bulan) | **GRATIS** |
| Build APK | **GRATIS** |
| Distribusi via WhatsApp | **GRATIS** |
| **TOTAL** | **Rp 0** |

---

*Untuk versi production / Play Store, diperlukan Google Developer Account ($25 sekali bayar)*
