'use client'
import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, ArrowLeftRight, RefreshCw, X, Wallet as WalletIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { formatIDR } from '@/app/lib/format';
import { Card } from '@/app/Components/ui/Card';
import { SkeletonCard } from '@/app/Components/ui/Skeleton';
import { ConfirmModal } from '@/app/Components/ui/ConfirmModal';
import { useToast } from '@/app/Components/ui/ToastProvider';
import { useData } from '@/app/lib/data-context';
import {
  createWallet, updateWallet, deleteWallet,
  createTransfer, getTransfers,
} from '@/app/services/userService';
import type { Wallet, Transfer } from '@/app/types';

const BANK_PRESETS: { code: string; label: string; color: string; icon: string }[] = [
  { code: 'bca',      label: 'BCA',       color: '#005BBB', icon: '🏦' },
  { code: 'mandiri',  label: 'Mandiri',   color: '#003D7C', icon: '🏦' },
  { code: 'bni',      label: 'BNI',       color: '#F58220', icon: '🏦' },
  { code: 'bri',      label: 'BRI',       color: '#00529B', icon: '🏦' },
  { code: 'gopay',    label: 'GoPay',     color: '#00AED6', icon: '📱' },
  { code: 'ovo',      label: 'OVO',       color: '#4C3494', icon: '📱' },
  { code: 'dana',     label: 'DANA',      color: '#118EEA', icon: '📱' },
  { code: 'shopeepay',label: 'ShopeePay', color: '#EE4D2D', icon: '📱' },
  { code: 'cash',     label: 'Tunai',     color: '#10b981', icon: '💵' },
  { code: 'custom',   label: 'Lainnya',   color: '#8b5cf6', icon: '💳' },
];

const DEFAULT_COLORS = ['#005BBB','#003D7C','#F58220','#00529B','#00AED6','#4C3494','#118EEA','#EE4D2D','#10b981','#8b5cf6','#f59e0b','#ef4444'];

type WalletForm = {
  name: string;
  bankCode: string;
  color: string;
  icon: string;
  initialBalance: string;
  isDefault: boolean;
};

const emptyForm = (): WalletForm => ({
  name: '',
  bankCode: 'custom',
  color: '#8b5cf6',
  icon: '💳',
  initialBalance: '',
  isDefault: false,
});

export function Wallets() {
  const { wallets, isLoading, refetch } = useData();
  const { showToast } = useToast();

  const [showCreate, setShowCreate]     = useState(false);
  const [editTarget, setEditTarget]     = useState<Wallet | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Wallet | null>(null);
  const [form, setForm]                 = useState<WalletForm>(emptyForm());
  const [submitting, setSubmitting]     = useState(false);
  const [formError, setFormError]       = useState('');

  const [showTransfer, setShowTransfer] = useState(false);
  const [transfers, setTransfers]       = useState<Transfer[]>([]);
  const [txLoading, setTxLoading]       = useState(false);
  const [transferForm, setTransferForm] = useState({
    fromWalletId: '',
    toWalletId: '',
    amount: '',
    note: '',
    transferDate: new Date().toISOString().split('T')[0],
  });
  const [transferError, setTransferError] = useState('');
  const [transferring, setTransferring]   = useState(false);

  const totalBalance = wallets.reduce((s, w) => s + w.balance, 0);

  const loadTransfers = async () => {
    setTxLoading(true);
    try {
      const res = await getTransfers();
      setTransfers((res.data.data as Transfer[]) || []);
    } catch {
      showToast('Gagal memuat riwayat transfer', 'error');
    } finally {
      setTxLoading(false);
    }
  };

  useEffect(() => {
    loadTransfers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyPreset = (code: string) => {
    const preset = BANK_PRESETS.find(p => p.code === code);
    if (!preset) return;
    setForm(f => ({
      ...f,
      bankCode: code,
      color: preset.color,
      icon: preset.icon,
      name: f.name || preset.label,
    }));
  };

  const openCreate = () => {
    setForm(emptyForm());
    setFormError('');
    setShowCreate(true);
  };

  const openEdit = (w: Wallet) => {
    setForm({
      name: w.name,
      bankCode: w.bankCode || 'custom',
      color: w.color || '#8b5cf6',
      icon: w.icon || '💳',
      initialBalance: String(w.initialBalance),
      isDefault: w.isDefault,
    });
    setFormError('');
    setEditTarget(w);
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) { setFormError('Nama wallet wajib diisi'); return; }
    setSubmitting(true);
    setFormError('');
    try {
      const payload = {
        name: form.name.trim(),
        bankCode: form.bankCode !== 'custom' ? form.bankCode : undefined,
        color: form.color,
        icon: form.icon,
        type: form.bankCode === 'cash' ? 'cash' : form.bankCode === 'gopay' || form.bankCode === 'ovo' || form.bankCode === 'dana' || form.bankCode === 'shopeepay' ? 'ewallet' : 'bank',
        initialBalance: Number(form.initialBalance) || 0,
        isDefault: form.isDefault,
      };
      if (editTarget) {
        await updateWallet(editTarget.id, payload);
        showToast('Wallet berhasil diperbarui');
        setEditTarget(null);
      } else {
        await createWallet(payload);
        showToast('Wallet berhasil ditambahkan');
        setShowCreate(false);
      }
      refetch();
    } catch {
      setFormError('Gagal menyimpan wallet');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteWallet(deleteTarget.id);
      showToast('Wallet berhasil dihapus');
      refetch();
    } catch {
      showToast('Gagal menghapus wallet', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleTransfer = async () => {
    if (!transferForm.fromWalletId || !transferForm.toWalletId) { setTransferError('Pilih wallet sumber dan tujuan'); return; }
    if (transferForm.fromWalletId === transferForm.toWalletId) { setTransferError('Wallet sumber dan tujuan tidak boleh sama'); return; }
    if (!transferForm.amount || Number(transferForm.amount) <= 0) { setTransferError('Jumlah transfer harus lebih dari 0'); return; }
    setTransferring(true);
    setTransferError('');
    try {
      await createTransfer({
        fromWalletId: transferForm.fromWalletId,
        toWalletId: transferForm.toWalletId,
        amount: Number(transferForm.amount),
        note: transferForm.note || undefined,
        transferDate: transferForm.transferDate,
      });
      showToast('Transfer berhasil');
      setShowTransfer(false);
      setTransferForm({ fromWalletId: '', toWalletId: '', amount: '', note: '', transferDate: new Date().toISOString().split('T')[0] });
      refetch();
      loadTransfers();
    } catch {
      setTransferError('Gagal melakukan transfer');
    } finally {
      setTransferring(false);
    }
  };

  const inputClass = 'w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white';

  const WalletFormModal = ({ title, onClose }: { title: string; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
          <h3 className="text-lg font-semibold dark:text-white">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          {/* Bank preset chips */}
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tipe Akun</p>
            <div className="flex flex-wrap gap-2">
              {BANK_PRESETS.map(p => (
                <button
                  key={p.code}
                  type="button"
                  onClick={() => applyPreset(p.code)}
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-all ${
                    form.bankCode === p.code
                      ? 'text-white border-transparent'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  style={form.bankCode === p.code ? { backgroundColor: p.color } : {}}
                >
                  {p.icon} {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nama Wallet</label>
            <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputClass} placeholder="Contoh: BCA Utama" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Saldo Awal</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Rp</span>
              <input type="number" value={form.initialBalance} onChange={e => setForm(f => ({ ...f, initialBalance: e.target.value }))} className={`${inputClass} pl-10`} placeholder="0" min={0} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Warna</label>
            <div className="flex flex-wrap gap-2">
              {DEFAULT_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, color: c }))}
                  className={`w-7 h-7 rounded-full transition-transform ${form.color === c ? 'scale-125 ring-2 ring-offset-1 ring-gray-400' : 'hover:scale-110'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <div
              className={`relative w-10 h-5 rounded-full transition-colors ${form.isDefault ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}
              onClick={() => setForm(f => ({ ...f, isDefault: !f.isDefault }))}
            >
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.isDefault ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300">Jadikan wallet utama</span>
          </label>

          {formError && <p className="text-red-600 dark:text-red-400 text-sm">{formError}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium">Batal</button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              {submitting && <RefreshCw className="w-4 h-4 animate-spin" />}
              {submitting ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold dark:text-white">Dompet & Rekening</h2>
        <div className="flex gap-2">
          <button
            onClick={() => { setShowTransfer(true); setTransferError(''); }}
            className="border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-sm"
          >
            <ArrowLeftRight className="w-4 h-4" />
            Transfer
          </button>
          <button
            onClick={openCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            Tambah Wallet
          </button>
        </div>
      </div>

      {/* Total Balance */}
      <Card>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
            <WalletIcon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Saldo Semua Wallet</p>
            <p className="text-3xl font-bold dark:text-white mt-0.5">{formatIDR(totalBalance)}</p>
          </div>
        </div>
      </Card>

      {/* Wallet List */}
      {isLoading ? (
        <div className="space-y-4">{[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : wallets.length === 0 ? (
        <Card>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <WalletIcon className="w-12 h-12 text-gray-200 dark:text-gray-600 mb-4" />
            <p className="text-gray-700 dark:text-gray-300 font-medium mb-1">Belum ada wallet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mb-5">Tambahkan rekening bank atau e-wallet Anda</p>
            <button onClick={openCreate} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-colors font-medium text-sm">
              Tambah Wallet Pertama
            </button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wallets.map((wallet) => {
            const preset = BANK_PRESETS.find(p => p.code === wallet.bankCode);
            const icon  = wallet.icon  || preset?.icon  || '💳';
            const color = wallet.color || preset?.color || '#8b5cf6';
            return (
              <Card key={wallet.id}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0" style={{ backgroundColor: color + '25' }}>
                      {icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold dark:text-white">{wallet.name}</p>
                        {wallet.isDefault && (
                          <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full font-medium">Utama</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 capitalize">
                        {wallet.type === 'ewallet' ? 'E-Wallet' : wallet.type === 'cash' ? 'Tunai' : 'Rekening Bank'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <button onClick={() => openEdit(wallet)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeleteTarget(wallet)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Saldo</p>
                  <p className={`text-xl font-bold ${wallet.balance >= 0 ? 'dark:text-white' : 'text-red-600 dark:text-red-400'}`} style={wallet.balance >= 0 ? { color } : {}}>
                    {formatIDR(wallet.balance)}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Saldo awal: {formatIDR(wallet.initialBalance)}</p>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Transfer History */}
      <Card>
        <h3 className="font-semibold dark:text-white mb-4">Riwayat Transfer</h3>
        {txLoading ? (
          <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-12 bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse" />)}</div>
        ) : transfers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <ArrowLeftRight className="w-10 h-10 text-gray-200 dark:text-gray-600 mb-3" />
            <p className="text-sm text-gray-400 dark:text-gray-500">Belum ada riwayat transfer</p>
          </div>
        ) : (
          <div className="space-y-1">
            {transfers.map((t) => (
              <div key={t.id} className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-700/50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center shrink-0">
                    <ArrowLeftRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium dark:text-gray-200">
                      {t.fromWallet.name} <span className="text-gray-400">→</span> {t.toWallet.name}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {new Date(t.transferDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {t.note && ` · ${t.note}`}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 shrink-0">{formatIDR(Number(t.amount))}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Create Modal */}
      {showCreate && <WalletFormModal title="Tambah Wallet" onClose={() => setShowCreate(false)} />}

      {/* Edit Modal */}
      {editTarget && <WalletFormModal title="Edit Wallet" onClose={() => setEditTarget(null)} />}

      {/* Transfer Modal */}
      {showTransfer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold dark:text-white">Transfer Antar Wallet</h3>
              <button onClick={() => setShowTransfer(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Dari Wallet</label>
                <select value={transferForm.fromWalletId} onChange={e => setTransferForm(f => ({ ...f, fromWalletId: e.target.value }))} className={inputClass}>
                  <option value="">Pilih wallet sumber</option>
                  {wallets.map(w => <option key={w.id} value={w.id}>{w.name} ({formatIDR(w.balance)})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Ke Wallet</label>
                <select value={transferForm.toWalletId} onChange={e => setTransferForm(f => ({ ...f, toWalletId: e.target.value }))} className={inputClass}>
                  <option value="">Pilih wallet tujuan</option>
                  {wallets.filter(w => w.id !== transferForm.fromWalletId).map(w => <option key={w.id} value={w.id}>{w.name} ({formatIDR(w.balance)})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Jumlah</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Rp</span>
                  <input type="number" value={transferForm.amount} onChange={e => setTransferForm(f => ({ ...f, amount: e.target.value }))} className={`${inputClass} pl-10`} placeholder="0" min={1} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Tanggal Transfer</label>
                <input type="date" value={transferForm.transferDate} onChange={e => setTransferForm(f => ({ ...f, transferDate: e.target.value }))} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Catatan (opsional)</label>
                <input type="text" value={transferForm.note} onChange={e => setTransferForm(f => ({ ...f, note: e.target.value }))} className={inputClass} placeholder="Contoh: Top up rekening" />
              </div>
              {transferError && <p className="text-red-600 dark:text-red-400 text-sm">{transferError}</p>}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowTransfer(false)} className="flex-1 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium">Batal</button>
                <button
                  type="button"
                  onClick={handleTransfer}
                  disabled={transferring}
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  {transferring && <RefreshCw className="w-4 h-4 animate-spin" />}
                  {transferring ? 'Memproses...' : 'Transfer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <ConfirmModal
          title="Hapus Wallet"
          description={`Hapus wallet "${deleteTarget.name}"? Semua transaksi terkait akan tetap ada namun tidak terhubung ke wallet.`}
          confirmLabel="Hapus"
          isDestructive
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
