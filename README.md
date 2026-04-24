# FinSpend

Aplikasi manajemen keuangan pribadi berbasis web. Fitur: dashboard ringkasan keuangan, daftar transaksi, budgeting per kategori, saran AI, dan laporan keuangan.

---

## Tech Stack

| Layer | Teknologi | Versi |
|---|---|---|
| Framework | Next.js (App Router) | 16.x |
| UI Library | React | 19.x |
| Bahasa | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| Icons | lucide-react | — |
| Charts | Recharts | — |

---

## Struktur Proyek

```
frontend/
├── app/
│   ├── Components/
│   │   ├── ai/           # Halaman Saran AI
│   │   ├── budgeting/    # Halaman Budgeting
│   │   ├── dashboard/    # Halaman Dashboard
│   │   ├── onboarding/   # Alur Onboarding
│   │   ├── reports/      # Halaman Laporan
│   │   ├── transactions/ # Daftar & Form Transaksi
│   │   └── ui/           # Komponen reusable (Card, Toast, PremiumBanner)
│   ├── lib/
│   │   ├── format.ts     # Utility: formatIDR, formatIDRSigned
│   │   └── toast.ts      # Hook: useToast
│   ├── types/
│   │   └── index.ts      # Shared types: Transaction, Budget, dll
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx          # Root — navigasi antar halaman
└── package.json
```

---

## Cara Menjalankan

**Prasyarat:** Node.js 18+

```bash
# Masuk ke direktori frontend
cd frontend

# Install dependensi
npm install

# Jalankan development server
npm run dev
```

Buka browser di `http://localhost:3000`.

### Script yang tersedia

| Script | Deskripsi |
|---|---|
| `npm run dev` | Development server dengan hot-reload |
| `npm run build` | Build produksi |
| `npm start` | Jalankan build produksi |
| `npm run lint` | Cek linting dengan ESLint |
| `npm test` | Jalankan test suite (vitest) |

---

## Status

Aplikasi masih dalam tahap **prototipe** — semua data bersifat dummy/statis. Belum ada backend, database, atau autentikasi.

---

## Fitur yang Tersedia

- **Dashboard** — ringkasan saldo, pemasukan, pengeluaran, grafik tren, dan status budget
- **Transaksi** — daftar transaksi dengan filter kategori, form tambah transaksi
- **Budgeting** — kartu budget per kategori dengan progress bar dan status
- **Saran AI** — saran penghematan dan skor keuangan (demo)
- **Laporan** — daftar laporan keuangan (export terkunci di paket Premium)
- **Onboarding** — wizard 3 langkah untuk setup profil keuangan awal
