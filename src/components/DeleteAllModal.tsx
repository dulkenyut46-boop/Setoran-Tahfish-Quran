import React, { useState } from 'react';
import { X, Trash2, AlertTriangle, ShieldAlert, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Santri, SetoranRecord } from '../types';

interface DeleteAllModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalSantri: number;
  totalRecords: number;
  onConfirmDelete: (scope: 'all' | 'records_only') => void;
  onResetToSample: () => void;
}

export const DeleteAllModal: React.FC<DeleteAllModalProps> = ({
  isOpen,
  onClose,
  totalSantri,
  totalRecords,
  onConfirmDelete,
  onResetToSample,
}) => {
  const [deleteScope, setDeleteScope] = useState<'all' | 'records_only'>('all');
  const [confirmKeyword, setConfirmKeyword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExecute = () => {
    if (confirmKeyword.trim().toUpperCase() !== 'HAPUS') {
      setErrorMessage('Harap ketik kata "HAPUS" untuk mengonfirmasi tindakan.');
      return;
    }

    onConfirmDelete(deleteScope);
    setConfirmKeyword('');
    setErrorMessage(null);
    onClose();
  };

  const handleResetSample = () => {
    onResetToSample();
    setConfirmKeyword('');
    setErrorMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-rose-200 animate-in fade-in zoom-in-95 duration-150"
        id="modal-delete-all"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-950 via-rose-900 to-red-950 text-white px-5 py-4 flex items-center justify-between border-b border-rose-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-800 flex items-center justify-center text-rose-200">
              <Trash2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Hapus Semua Data</h3>
              <p className="text-xs text-rose-200/80">Penghapusan data santri & riwayat setoran</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-rose-300 hover:text-white p-1 rounded-lg hover:bg-rose-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-4.5 text-slate-800">
          {/* Warning banner */}
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 flex items-start gap-2.5">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-900">
              <p className="font-bold">Tindakan ini tidak dapat dibatalkan!</p>
              <p className="mt-0.5 text-rose-800/90 leading-relaxed">
                Data yang terhapus dari memori browser tidak dapat dikembalikan kecuali Anda memiliki berkas cadangan (backup JSON atau Excel).
              </p>
            </div>
          </div>

          {/* Current Data Overview */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
            <span className="font-bold text-slate-700 block mb-1">Data Tersimpan Saat Ini:</span>
            <div className="flex justify-between text-slate-600">
              <span>Total Santri:</span>
              <strong className="text-slate-900">{totalSantri} Santri</strong>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Total Riwayat Setoran:</span>
              <strong className="text-slate-900">{totalRecords} Riwayat</strong>
            </div>
          </div>

          {/* Scope selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">Pilih Lingkup Penghapusan:</label>
            <div className="space-y-2">
              <label
                onClick={() => setDeleteScope('all')}
                className={`p-3 rounded-xl border cursor-pointer flex items-start gap-2.5 transition-all ${
                  deleteScope === 'all'
                    ? 'border-rose-500 bg-rose-50/60 ring-2 ring-rose-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="deleteScope"
                  checked={deleteScope === 'all'}
                  onChange={() => setDeleteScope('all')}
                  className="mt-0.5 text-rose-600 focus:ring-rose-500"
                />
                <div>
                  <span className="text-xs font-bold text-rose-900 block">
                    Hapus Semua Data (Santri & Setoran)
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    Mengosongkan seluruh master data santri dan semua riwayat setoran menjadi 0.
                  </span>
                </div>
              </label>

              <label
                onClick={() => setDeleteScope('records_only')}
                className={`p-3 rounded-xl border cursor-pointer flex items-start gap-2.5 transition-all ${
                  deleteScope === 'records_only'
                    ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="deleteScope"
                  checked={deleteScope === 'records_only'}
                  onChange={() => setDeleteScope('records_only')}
                  className="mt-0.5 text-amber-600 focus:ring-amber-500"
                />
                <div>
                  <span className="text-xs font-bold text-amber-900 block">
                    Hapus Riwayat Setoran Saja
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    Data santri ({totalSantri} orang) tetap dipertahankan, hanya seluruh riwayat setoran yang dibersihkan.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Keyword confirmation */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-semibold text-slate-700 block">
              Ketik kata <span className="font-bold text-rose-600">HAPUS</span> di bawah ini untuk konfirmasi:
            </label>
            <input
              type="text"
              value={confirmKeyword}
              onChange={e => {
                setConfirmKeyword(e.target.value);
                setErrorMessage(null);
              }}
              placeholder="Ketik HAPUS di sini"
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 uppercase tracking-wider font-bold"
            />
            {errorMessage && (
              <p className="text-[11px] text-rose-600 font-semibold">{errorMessage}</p>
            )}
          </div>

          {/* Quick reset to sample option */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Ingin kembali ke contoh awal?</span>
            <button
              type="button"
              onClick={handleResetSample}
              className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-semibold hover:underline"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Contoh Bawaan</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-5 py-3.5 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-600 hover:text-slate-900 font-medium px-4 py-2 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleExecute}
            disabled={confirmKeyword.trim().toUpperCase() !== 'HAPUS'}
            className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition-all active:scale-95"
          >
            <Trash2 className="w-4 h-4" />
            <span>
              {deleteScope === 'all' ? 'Hapus Semua Data Permanen' : 'Hapus Semua Riwayat Setoran'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
