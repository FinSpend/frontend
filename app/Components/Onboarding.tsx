import { useState } from 'react';
import { CheckCircle, Circle } from 'lucide-react';

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

export function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    monthlyIncome: '',
    monthlyExpense: '',
    currentSavings: '',
    selectedGoals: [] as string[],
    profession: '',
    dependents: '0',
  });

  const handleGoalToggle = (goalId: string) => {
    setFormData({
      ...formData,
      selectedGoals: formData.selectedGoals.includes(goalId)
        ? formData.selectedGoals.filter((g) => g !== goalId)
        : [...formData.selectedGoals, goalId],
    });
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      alert('Onboarding selesai! Welcome to the app.');
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
        <h2 className="text-3xl mb-2">Selamat Datang! 👋</h2>
        <p className="text-gray-600">Mari atur profil keuangan Anda untuk pengalaman yang lebih personal</p>
      </div>

      {/* Step Indicator */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep >= step.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {currentStep > step.id ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <span>{step.id}</span>
                  )}
                </div>
                <span className={`text-sm mt-2 ${currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'}`}>
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-4 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Financial Profile */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h3 className="text-xl mb-4">Profil Keuangan Anda</h3>

            <div>
              <label htmlFor="monthlyIncome" className="block text-sm mb-2">
                Pemasukan Bulanan
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
                <input
                  type="number"
                  id="monthlyIncome"
                  value={formData.monthlyIncome}
                  onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="5000000"
                />
              </div>
            </div>

            <div>
              <label htmlFor="monthlyExpense" className="block text-sm mb-2">
                Pengeluaran Bulanan (Estimasi)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
                <input
                  type="number"
                  id="monthlyExpense"
                  value={formData.monthlyExpense}
                  onChange={(e) => setFormData({ ...formData, monthlyExpense: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="3000000"
                />
              </div>
            </div>

            <div>
              <label htmlFor="currentSavings" className="block text-sm mb-2">
                Tabungan Saat Ini
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
                <input
                  type="number"
                  id="currentSavings"
                  value={formData.currentSavings}
                  onChange={(e) => setFormData({ ...formData, currentSavings: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="10000000"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Financial Goals */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-xl mb-4">Pilih Tujuan Finansial Anda</h3>
            <p className="text-sm text-gray-600 mb-4">Pilih satu atau lebih tujuan yang ingin Anda capai</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {financialGoals.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => handleGoalToggle(goal.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    formData.selectedGoals.includes(goal.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{goal.icon}</span>
                    <div className="flex-1">
                      <h4 className="mb-1">{goal.title}</h4>
                      <p className="text-sm text-gray-600">{goal.description}</p>
                    </div>
                    {formData.selectedGoals.includes(goal.id) && (
                      <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Profession */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-xl mb-4">Informasi Pekerjaan</h3>

            <div>
              <label htmlFor="profession" className="block text-sm mb-2">
                Profesi
              </label>
              <select
                id="profession"
                value={formData.profession}
                onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <label htmlFor="dependents" className="block text-sm mb-2">
                Jumlah Tanggungan
              </label>
              <input
                type="number"
                id="dependents"
                value={formData.dependents}
                onChange={(e) => setFormData({ ...formData, dependents: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
              <p className="text-xs text-gray-500 mt-1">
                Termasuk pasangan, anak, atau orang tua yang Anda tanggung
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="mb-2">Ringkasan Profil Anda</h4>
              <div className="space-y-1 text-sm text-gray-700">
                <p>• Pemasukan: Rp {Number(formData.monthlyIncome || 0).toLocaleString('id-ID')}</p>
                <p>• Pengeluaran: Rp {Number(formData.monthlyExpense || 0).toLocaleString('id-ID')}</p>
                <p>• Tabungan: Rp {Number(formData.currentSavings || 0).toLocaleString('id-ID')}</p>
                <p>• Tujuan: {formData.selectedGoals.length} tujuan dipilih</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`px-6 py-3 rounded-lg transition-colors ${
              currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Kembali
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {currentStep === 3 ? 'Selesai' : 'Lanjut'}
          </button>
        </div>
      </div>
    </div>
  );
}
