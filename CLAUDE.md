# Finspend Frontend — CLAUDE.md

Instruksi untuk Claude Code agar memahami konteks proyek Frontend Finspend.

---

## Deskripsi

Frontend aplikasi web money management Finspend. Dibangun dengan Next.js 15, menampilkan dashboard interaktif, tracking transaksi, budgeting dengan saran AI, dan laporan keuangan yang bisa didownload.

---

## Struktur folder

```
Frontend/
├── .env.local                  # NEXT_PUBLIC_API_URL, NEXTAUTH_SECRET, dll
├── next.config.ts
├── tailwind.config.ts
├── package.json
├── public/
└── src/
    ├── app/                    # Next.js App Router
    │   ├── layout.tsx          # Root layout
    │   ├── page.tsx            # Landing page / redirect
    │   ├── (auth)/             # Route group — tidak masuk URL
    │   │   ├── login/
    │   │   └── register/
    │   ├── (app)/              # Route group — halaman utama setelah login
    │   │   ├── layout.tsx      # Layout dengan sidebar/topbar
    │   │   ├── dashboard/
    │   │   ├── transactions/
    │   │   ├── budgeting/
    │   │   ├── ai/
    │   │   └── reports/
    │   └── api/
    │       └── auth/
    │           └── [...nextauth]/route.ts
    ├── components/
    │   ├── ui/                 # shadcn/ui components (jangan edit manual)
    │   ├── layout/             # Topbar, Sidebar, PageHeader
    │   ├── dashboard/          # MetricCard, TrendChart, DonutChart, BudgetStatus
    │   ├── transactions/       # TransactionList, TransactionItem, TransactionForm
    │   ├── budgeting/          # BudgetCard, BudgetProgress, BudgetForm
    │   ├── ai/                 # AISuggestionCard, ScoreCard
    │   └── reports/            # ReportCard, ReportDownload
    ├── lib/
    │   ├── api.ts              # Axios instance, base URL, interceptors
    │   ├── auth.ts             # NextAuth config
    │   └── utils.ts            # cn(), formatRupiah(), formatDate()
    ├── hooks/
    │   ├── useTransactions.ts
    │   ├── useBudgets.ts
    │   └── useAISuggestion.ts
    ├── stores/                 # Zustand global state (jika dipakai)
    └── types/
        └── index.ts            # TypeScript types global
```

---

## Tech stack

| Layer | Pilihan | Versi |
|---|---|---|
| Framework | Next.js | 15 |
| Language | TypeScript | latest |
| Styling | Tailwind CSS | v4 |
| UI components | shadcn/ui | latest |
| Charts | Recharts | latest |
| Drag & drop | dnd-kit | latest |
| Auth | NextAuth.js | v5 |
| Data fetching | TanStack Query (React Query) | v5 |
| HTTP client | Axios | latest |
| Form | React Hook Form + Zod | latest |
| State management | Zustand | latest (jika perlu global state) |
| AI streaming | Vercel AI SDK | latest |
| Export PDF | jsPDF | latest |
| Export Excel | SheetJS | latest |

---

## Environment variables

File `.env.local` di root folder `Frontend/`:

```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="..."
```

Jangan pernah commit `.env.local`. Prefix `NEXT_PUBLIC_` wajib untuk variable yang diakses di browser.

---

## Konvensi kode

### Bahasa
Seluruh project pakai TypeScript. Jangan buat file `.js` atau `.jsx` — selalu `.ts` dan `.tsx`.

### Komponen
Pakai function component dengan arrow function:

```tsx
// ✅ Benar
const MetricCard = ({ label, value }: MetricCardProps) => {
  return (
    <div>...</div>
  )
}

export default MetricCard

// ❌ Salah
export default function MetricCard() {}
```

### Import order
```tsx
// 1. React & Next.js
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

// 2. Third-party
import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"

// 3. Internal — components
import { MetricCard } from "@/components/dashboard/MetricCard"

// 4. Internal — lib, hooks, types
import { formatRupiah } from "@/lib/utils"
import { useTransactions } from "@/hooks/useTransactions"
import type { Transaction } from "@/types"
```

### Formatting angka
Selalu gunakan helper `formatRupiah()` untuk tampilkan uang:

```tsx
// ✅ Benar
formatRupiah(32000)  // → "Rp 32.000"

// ❌ Salah
`Rp ${amount}`
```

### Path alias
Gunakan `@/` untuk import dari `src/`:

```tsx
// ✅ Benar
import { Button } from "@/components/ui/button"

// ❌ Salah
import { Button } from "../../components/ui/button"
```

### Server vs Client component
Default di Next.js App Router adalah Server Component. Tambahkan `"use client"` hanya kalau butuh:
- `useState`, `useEffect`, hooks React
- Event handler (onClick, onChange)
- Browser API
- Library yang tidak support SSR

```tsx
// Kalau perlu interaktivitas
"use client"

import { useState } from "react"
```

---

## Halaman & fitur

### Dashboard `/dashboard`
- Metric cards: pendapatan, pengeluaran, saldo, target tabungan
- Tren 6 bulan — bar chart (Recharts)
- Pengeluaran per kategori — donut chart (Recharts)
- Transaksi terbaru — 4 item terakhir
- Status budget — progress bar per kategori

### Transaksi `/transactions`
- List transaksi dikelompokkan per hari
- Filter berdasarkan tipe (income/expense) dan kategori
- Form tambah transaksi (amount, deskripsi, kategori, tanggal)
- Toggle pemasukan / pengeluaran

### Budgeting `/budgeting`
- Progress bar per kategori dengan status (normal / melewati batas)
- Saran AI di bagian atas halaman
- Form buat anggaran baru

### Saran AI `/ai`
- Skor keuangan
- Kartu saran prioritas dengan tombol terapkan / abaikan
- Riwayat saran yang sudah diterapkan
- Fitur premium: saran AI lebih personal (dikunci untuk free user)

### Laporan `/reports`
- Summary metrik kuartalan
- List laporan tersimpan
- Tombol download PDF & Excel → dikunci untuk free user (tampilkan badge Premium)

### Onboarding (modal/flow saat pertama login)
- Step 1: nama & email (dari register)
- Step 2: penghasilan bulanan & profesi
- Step 3: tujuan finansial (multi-select pills)
- Step 4: target dana darurat
- Step 5: pengeluaran rutin bulanan

---

## Koneksi ke Backend

Base URL diambil dari env:

```ts
// src/lib/api.ts
import axios from "axios"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
})

export default api
```

### Endpoint Backend yang dipakai

```
POST   /auth/register
POST   /auth/login
POST   /auth/logout

GET    /api/transactions
POST   /api/transactions
PUT    /api/transactions/:id
DELETE /api/transactions/:id

GET    /api/budgets
POST   /api/budgets
PUT    /api/budgets/:id

GET    /api/categories

POST   /api/ai/suggest

GET    /api/reports
POST   /api/reports
```

---

## Fitur premium — cara menandai

Komponen yang hanya untuk user premium diberi wrapper `PremiumGate`:

```tsx
<PremiumGate>
  <DownloadButton format="pdf" />
</PremiumGate>
```

`PremiumGate` akan cek `user.plan === "premium"` — kalau free, tampilkan overlay dengan badge dan tombol upgrade.

Tandai juga di kode dengan komentar `// [PREMIUM]`.

---

## shadcn/ui — cara install komponen

Jangan copy-paste manual. Gunakan CLI:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add input
npx shadcn@latest add select
```

Komponen akan masuk ke `src/components/ui/`. Jangan edit file di sana langsung.

---

## Perintah yang sering dipakai

```bash
# Jalankan dev server
npm run dev

# Build production
npm run build

# Type check
npx tsc --noEmit

# Install shadcn component
npx shadcn@latest add <component>

# Lint
npm run lint
```

---

## Hal penting yang perlu diingat

- Seluruh teks label, kategori, dan notifikasi dalam Bahasa Indonesia
- Format mata uang selalu Rupiah (Rp) dengan titik sebagai pemisah ribuan
- Format tanggal: "24 April 2025" atau "Hari ini", "Kemarin" untuk tanggal relatif
- Warna utama brand: purple `#534AB7` — gunakan sebagai primary color di Tailwind config
- Fitur export PDF/Excel hanya aktif untuk user plan `premium`
- Saran AI dasar tersedia untuk semua user, saran personal hanya untuk premium