# FinSpend 💰

Aplikasi manajemen keuangan pribadi berbasis web yang membantu pengguna memantau pemasukan, pengeluaran, budgeting, dan mendapatkan saran keuangan berbasis AI.

---

## 🚀 Cara Menjalankan

### Prasyarat
- Node.js versi 14 ke atas
- npm versi 6 ke atas

### Instalasi & Menjalankan

```bash
# 1. Extract file ZIP
unzip finspend.zip

# 2. Install dependensi
npm install

# 3. Jalankan aplikasi
npm start
```

Aplikasi akan terbuka otomatis di browser pada alamat:
```
http://localhost:3000
```

---

## 📁 Struktur Proyek

```
moneywise/
├── public/
│   └── index.html
├── src/
│   ├── App.js                  # Root component & router
│   ├── App.css                 # Layout utama & hamburger menu
│   ├── index.js                # Entry point React
│   ├── index.css               # CSS variables (:root) & global reset
│   └── components/
│       ├── Sidebar/
│       │   ├── Sidebar.js      # Navigasi sidebar
│       │   └── Sidebar.css
│       ├── Dashboard/
│       │   ├── Dashboard.js    # Halaman utama & ringkasan keuangan
│       │   └── Dashboard.css
│       ├── Transaksi/
│       │   ├── Transaksi.js    # Daftar & filter transaksi
│       │   └── Transaksi.css
│       ├── Budgeting/
│       │   ├── Budgeting.js    # Manajemen budget per kategori
│       │   └── Budgeting.css
│       ├── SaranAI/
│       │   ├── SaranAI.js      # Saran keuangan berbasis AI
│       │   └── SaranAI.css
│       ├── Laporan/
│       │   ├── Laporan.js      # Laporan keuangan bulanan/tahunan
│       │   └── Laporan.css
│       └── Onboarding/
│           ├── Onboarding.js   # Wizard setup profil (3 langkah)
│           └── Onboarding.css
├── package.json
└── README.md
```

---

## 🖥️ Halaman & Fitur

| Halaman | Deskripsi |
|---|---|
| **Dashboard** | Ringkasan saldo, pemasukan, pengeluaran, grafik tren keuangan, dan status budget |
| **Transaksi** | Daftar transaksi dikelompokkan per tanggal dengan filter kategori |
| **Budgeting** | Manajemen budget per kategori dengan indikator persentase penggunaan |
| **Saran AI** | Skor keuangan dan rekomendasi penghematan berbasis AI |
| **Laporan** | Laporan keuangan bulanan, kuartalan, dan tahunan |
| **Onboarding** | Wizard 3 langkah untuk setup profil keuangan pengguna baru |

---

## 🛠️ Teknologi

- **React 18** — Functional Components + Hooks
- **Pure CSS** — Tanpa framework eksternal (tidak ada Tailwind/Bootstrap)
- **CSS Variables** — Design tokens di `:root` untuk konsistensi tema
- **BEM Methodology** — Penamaan class CSS yang terstruktur
- **Recharts** — Library grafik untuk visualisasi data keuangan

---

## 📱 Responsivitas

| Breakpoint | Perilaku |
|---|---|
| Desktop (> 1024px) | Sidebar tampil permanen di kiri |
| Tablet (≤ 1024px) | Sidebar tersembunyi, muncul hamburger menu |
| Mobile (≤ 768px) | Layout single-column, konten disederhanakan |

---

## 🎨 Design Tokens (CSS Variables)

Semua nilai desain didefinisikan di `src/index.css` dalam blok `:root`:

```css
--color-primary: #2563eb;
--color-success: #16a34a;
--color-danger:  #dc2626;
--font-size-base: 14px;
--spacing-4: 16px;
/* ... dan lainnya */
```

---

## 📦 Dependensi

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-scripts": "5.0.1",
  "recharts": "^2.12.0"
}
```

---

## 📝 Catatan

- Data yang ditampilkan saat ini bersifat **statis (dummy data)** — belum terhubung ke backend atau API.
- Untuk menghubungkan ke backend, ganti data dummy di masing-masing komponen dengan pemanggilan API menggunakan `fetch` atau `axios`.

---

> Dibuat berdasarkan desain mockup Figma · FinSpend v1.0