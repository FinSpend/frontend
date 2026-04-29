'use client'
import { useState, useEffect } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';
import { formatIDR } from '@/app/lib/format';
import { Card } from '@/app/Components/ui/Card';
import { upsertProfile, fetchProfile } from '@/app/services/userService';

const steps = [
  { id: 1, title: 'Profil Keuangan' },
  { id: 2, title: 'Tujuan Finansial' },
  { id: 3, title: 'Informasi Pekerjaan' },
];

const financialGoals = [
  { id: 'emergency', title: 'Dana Darurat', icon: '🛡️', description: 'Bangun dana darurat 6 bulan' },
  { id: 'house', title: 'Beli Rumah', icon: '🏠', description: 'Nabung untuk DP rumah' },
  { id: 'vacation', title: 'Liburan', icon: '✈️', description: 'Rencanakan liburan impian' },
  { id: 'investment', title: 'Investasi', icon: '📈', description: 'Mulai investasi jangka panjang' },
  { id: 'retirement', title: 'Pensiun', icon: '🌴', description: 'Persiapan dana pensiun' },
  { id: 'debt', title: 'Lunasi Hutang', icon: '💳', description: 'Bebas dari hutang' },
];

const professions = [
  'Karyawan Swasta',
  'Pegawai Negeri',
  'Wiraswasta',
  'Freelancer',
  'Mahasiswa',
  'Ibu Rumah Tangga',
  'Lainnya',
];

const inputClass = 'w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 text-sm transition-all';
const prefixInputClass = 'w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 text-sm transition-all';
const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2';

interface OnboardingProps {
  onFinish?: () => void;
}

export function Onboarding({ onFinish }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    monthlyIncome: '',
    monthlyExpense: '',
    currentSavings: '',
    selectedGoals: [] as string[],
    profession: '',
    dependents: '0',
  });

  useEffect(() => {
    fetchProfile().then((res) => {
      const p = res.data.data;
      if (!p) return;
      setFormData(prev => ({
        ...prev,
        monthlyIncome: p.monthlyIncome ? String(p.monthlyIncome) : '',
        monthlyExpense: p.monthlyExpense ? String(p.monthlyExpense) : '',
        currentSavings: p.currentSavings ? String(p.currentSavings) : '',
        selectedGoals: Array.isArray(p.financialGoals) ? p.financialGoals : [],
        profession: p.occupation || '',
      }));
    }).catch(() => {});
  }, []);

  const handleGoalToggle = (goalId: string) => {
    setFormData({
      ...formData,
      selectedGoals: formData.selectedGoals.includes(goalId)
        ? formData.selectedGoals.filter((g) => g !== goalId)
        : [...formData.selectedGoals, goalId],
    });
  };

  const handleNext = async () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      await upsertProfile({
        monthlyIncome: Number(formData.monthlyIncome) || 0,
        monthlyExpense: Number(formData.monthlyExpense) || 0,
        currentSavings: Number(formData.currentSavings) || 0,
        incomeCurrency: 'IDR',
        occupation: formData.profession,
        financialGoals: formData.selectedGoals,
      });
      onFinish?.();
    } catch {
      setError('Gagal menyimpan profil, coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-semibold mb-2 dark:text-white">Selamat Datang! 👋</h2>
        <p className="text-gray-500 dark:text-gray-400">Mari atur profil keuangan Anda untuk pengalaman yang lebih personal</p>
      </div>

      {/* Step Indicator */}
      <Card>
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    currentStep >= step.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                  }`}
                  aria-label={`Langkah ${step.id}: ${step.title}${currentStep > step.id ? ' (selesai)' : currentStep === step.id ? ' (aktif)' : ''}`}
                >
                  {currentStep > step.id ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="text-sm">{step.id}</span>
                  )}
                </div>
                <span className={`text-xs font-medium mt-2 ${currentStep >= step.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}>
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-4 rounded-full transition-colors ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Financial Profile */}
        {currentStep === 1 && (
          <div className="space-y-5">
            <h3 className="text-xl font-semibold mb-4 dark:text-white">Profil Keuangan Anda</h3>

            <div>
              <label htmlFor="monthlyIncome" className={labelClass}>
                Pemasukan Bulanan
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm font-medium">Rp</span>
                <input
                  type="number"
                  id="monthlyIncome"
                  value={formData.monthlyIncome}
                  onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
                  className={prefixInputClass}
                  placeholder="5000000"
                />
              </div>
            </div>

            <div>
              <label htmlFor="monthlyExpense" className={labelClass}>
                Pengeluaran Bulanan (Estimasi)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm font-medium">Rp</span>
                <input
                  type="number"
                  id="monthlyExpense"
                  value={formData.monthlyExpense}
                  onChange={(e) => setFormData({ ...formData, monthlyExpense: e.target.value })}
                  className={prefixInputClass}
                  placeholder="3000000"
                />
              </div>
            </div>

            <div>
              <label htmlFor="currentSavings" className={labelClass}>
                Tabungan Saat Ini
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm font-medium">Rp</span>
                <input
                  type="number"
                  id="currentSavings"
                  value={formData.currentSavings}
                  onChange={(e) => setFormData({ ...formData, currentSavings: e.target.value })}
                  className={prefixInputClass}
                  placeholder="10000000"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Financial Goals */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-xl font-semibold mb-1 dark:text-white">Pilih Tujuan Finansial Anda</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pilih satu atau lebih tujuan yang ingin Anda capai</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {financialGoals.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => handleGoalToggle(goal.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    formData.selectedGoals.includes(goal.id)
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500 dark:bg-gray-800/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{goal.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold mb-0.5 dark:text-white">{goal.title}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{goal.description}</p>
                    </div>
                    {formData.selectedGoals.includes(goal.id) && (
                      <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Profession */}
        {currentStep === 3 && (
          <div className="space-y-5">
            <h3 className="text-xl font-semibold mb-4 dark:text-white">Informasi Pekerjaan</h3>

            <div>
              <label htmlFor="profession" className={labelClass}>
                Profesi
              </label>
              <select
                id="profession"
                value={formData.profession}
                onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                className={inputClass}
              >
                <option value="">Pilih profesi</option>
                {professions.map((prof) => (
                  <option key={prof} value={prof}>
                    {prof}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="dependents" className={labelClass}>
                Jumlah Tanggungan
              </label>
              <input
                type="number"
                id="dependents"
                value={formData.dependents}
                onChange={(e) => setFormData({ ...formData, dependents: e.target.value })}
                className={inputClass}
                min="0"
              />
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">
                Termasuk pasangan, anak, atau orang tua yang Anda tanggung
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800">
              <h4 className="text-sm font-semibold mb-2 dark:text-blue-200">Ringkasan Profil Anda</h4>
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <p>• Pemasukan: <span className="font-medium text-green-600 dark:text-green-400">{formatIDR(Number(formData.monthlyIncome || 0))}</span></p>
                <p>• Pengeluaran: <span className="font-medium text-red-500 dark:text-red-400">{formatIDR(Number(formData.monthlyExpense || 0))}</span></p>
                <p>• Tabungan: <span className="font-medium text-blue-600 dark:text-blue-400">{formatIDR(Number(formData.currentSavings || 0))}</span></p>
                <p>• Tujuan: <span className="font-medium">{formData.selectedGoals.length} tujuan dipilih</span></p>
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="mt-4 text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 gap-3">
          <button
            onClick={handleBack}
            disabled={currentStep === 1 || isLoading}
            className={`px-6 py-3 rounded-xl transition-colors font-medium text-sm ${
              currentStep === 1 || isLoading
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Kembali
          </button>
          <button
            onClick={handleNext}
            disabled={isLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 font-medium text-sm"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {currentStep === 3 ? (isLoading ? 'Menyimpan...' : 'Selesai') : 'Lanjut'}
          </button>
        </div>
      </Card>
    </div>
  );
}
