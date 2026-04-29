'use client'
import { useState, useEffect } from 'react';
import { Loader2, Save, CheckCircle } from 'lucide-react';
import { Card } from '@/app/Components/ui/Card';
import { useToast } from '@/app/Components/ui/ToastProvider';
import { useData } from '@/app/lib/data-context';
import { fetchProfile, upsertProfile } from '@/app/services/userService';

const FINANCIAL_GOALS = [
  { id: 'emergency',  label: 'Dana Darurat',  icon: '🛡️', desc: 'Bangun dana darurat 6 bulan' },
  { id: 'house',      label: 'Beli Rumah',    icon: '🏠', desc: 'Nabung untuk DP rumah' },
  { id: 'vacation',   label: 'Liburan',       icon: '✈️', desc: 'Rencanakan liburan impian' },
  { id: 'investment', label: 'Investasi',     icon: '📈', desc: 'Mulai investasi jangka panjang' },
  { id: 'retirement', label: 'Pensiun',       icon: '🌴', desc: 'Persiapan dana pensiun' },
  { id: 'debt',       label: 'Lunasi Hutang', icon: '💳', desc: 'Bebas dari hutang' },
];

const PROFESSIONS = [
  'Karyawan Swasta', 'Pegawai Negeri', 'Wiraswasta',
  'Freelancer', 'Mahasiswa', 'Ibu Rumah Tangga', 'Lainnya',
];

const RISK_PROFILES = [
  { id: 'conservative', label: 'Konservatif', desc: 'Saya lebih suka aman, hindari risiko' },
  { id: 'moderate',     label: 'Moderat',     desc: 'Seimbang antara aman dan untung' },
  { id: 'aggressive',   label: 'Agresif',     desc: 'Saya siap ambil risiko untuk imbal hasil tinggi' },
];

interface FormData {
  monthlyIncome: string;
  monthlyExpense: string;
  currentSavings: string;
  occupation: string;
  selectedGoals: string[];
  riskProfile: string;
}

const inputClass = 'w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm';

export function SettingsPage() {
  const { showToast } = useToast();
  const { refetch } = useData();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<FormData>({
    monthlyIncome: '',
    monthlyExpense: '',
    currentSavings: '',
    occupation: '',
    selectedGoals: [],
    riskProfile: '',
  });

  useEffect(() => {
    fetchProfile()
      .then(res => {
        const p = res.data.data;
        if (!p) return;
        setForm({
          monthlyIncome: p.monthlyIncome ? String(p.monthlyIncome) : '',
          monthlyExpense: p.monthlyExpense ? String(p.monthlyExpense) : '',
          currentSavings: p.currentSavings ? String(p.currentSavings) : '',
          occupation: p.occupation || '',
          selectedGoals: Array.isArray(p.financialGoals) ? p.financialGoals : [],
          riskProfile: p.riskProfile || '',
        });
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const set = (key: keyof FormData, value: string) =>
    setForm(f => ({ ...f, [key]: value }));

  const toggleGoal = (id: string) =>
    setForm(f => ({
      ...f,
      selectedGoals: f.selectedGoals.includes(id)
        ? f.selectedGoals.filter(g => g !== id)
        : [...f.selectedGoals, id],
    }));

  const handleSave = async () => {
    if (!form.monthlyIncome || !form.monthlyExpense || !form.currentSavings) {
      showToast('Lengkapi data keuangan terlebih dahulu', 'error');
      return;
    }
    setIsSaving(true);
    try {
      await upsertProfile({
        monthlyIncome: Number(form.monthlyIncome),
        monthlyExpense: Number(form.monthlyExpense),
        currentSavings: Number(form.currentSavings),
        incomeCurrency: 'IDR',
        occupation: form.occupation,
        financialGoals: form.selectedGoals,
      });
      refetch();
      showToast('Profil berhasil disimpan');
    } catch {
      showToast('Gagal menyimpan profil', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Section: Informasi Keuangan */}
      <Card>
        <div className="mb-6">
          <h3 className="text-lg dark:text-white">Informasi Keuangan</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Data ini digunakan untuk menghitung skor dan saran keuangan Anda
          </p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1.5">
              Penghasilan Bulanan (Rp)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Rp</span>
              <input
                type="number"
                value={form.monthlyIncome}
                onChange={e => set('monthlyIncome', e.target.value)}
                className={`${inputClass} pl-10`}
                placeholder="5.000.000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1.5">
              Estimasi Pengeluaran Bulanan (Rp)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Rp</span>
              <input
                type="number"
                value={form.monthlyExpense}
                onChange={e => set('monthlyExpense', e.target.value)}
                className={`${inputClass} pl-10`}
                placeholder="3.000.000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1.5">
              Tabungan Saat Ini (Rp)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Rp</span>
              <input
                type="number"
                value={form.currentSavings}
                onChange={e => set('currentSavings', e.target.value)}
                className={`${inputClass} pl-10`}
                placeholder="10.000.000"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Section: Informasi Pekerjaan */}
      <Card>
        <div className="mb-6">
          <h3 className="text-lg dark:text-white">Informasi Pekerjaan</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Profesi Anda membantu kami memberikan saran yang lebih relevan</p>
        </div>
        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-300 mb-3">Profesi</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PROFESSIONS.map(p => (
              <button
                key={p}
                type="button"
                onClick={() => set('occupation', p)}
                className={`px-3 py-2.5 rounded-xl text-sm border transition-all ${
                  form.occupation === p
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Section: Tujuan Finansial */}
      <Card>
        <div className="mb-6">
          <h3 className="text-lg dark:text-white">Tujuan Finansial</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Pilih semua yang sesuai dengan rencana Anda</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FINANCIAL_GOALS.map(goal => {
            const selected = form.selectedGoals.includes(goal.id);
            return (
              <button
                key={goal.id}
                type="button"
                onClick={() => toggleGoal(goal.id)}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                  selected
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <span className="text-2xl">{goal.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${selected ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}`}>
                    {goal.label}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{goal.desc}</p>
                </div>
                {selected && <CheckCircle className="w-4 h-4 text-blue-500 shrink-0" />}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Section: Profil Risiko */}
      <Card>
        <div className="mb-6">
          <h3 className="text-lg dark:text-white">Profil Risiko Investasi</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Seberapa nyaman Anda dengan risiko investasi?</p>
        </div>
        <div className="space-y-3">
          {RISK_PROFILES.map(r => {
            const selected = form.riskProfile === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => set('riskProfile', r.id)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all ${
                  selected
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <div>
                  <p className={`text-sm ${selected ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}`}>
                    {r.label}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{r.desc}</p>
                </div>
                {selected && <CheckCircle className="w-5 h-5 text-blue-500 shrink-0" />}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end pb-4">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-60 transition-colors"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>
    </div>
  );
}
