import React, { useRef, useState } from 'react';
import { 
  X, 
  Download, 
  Upload, 
  RefreshCw, 
  FileText, 
  Database, 
  Check, 
  FileSpreadsheet, 
  Trash2, 
  Sparkles, 
  FileDown 
} from 'lucide-react';
import { Santri, SetoranRecord } from '../types';
import { exportToCSV } from '../utils/tahfidzHelpers';
import { exportFullDataToExcel, generateExcelTemplate } from '../utils/excelHelpers';
import { INITIAL_SANTRI, INITIAL_SETORAN } from '../data/initialData';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  santriList: Santri[];
  records: SetoranRecord[];
  onRestoreData: (newSantri: Santri[], newRecords: SetoranRecord[]) => void;
  onOpenImportModal?: () => void;
  onOpenDeleteAllModal?: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  santriList,
  records,
  onRestoreData,
  onOpenImportModal,
  onOpenDeleteAllModal,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownloadExcel = () => {
    exportFullDataToExcel(records, santriList);
    showNotice('Laporan lengkap Excel (.xlsx) berhasil diunduh!');
  };

  const handleDownloadTemplate = () => {
    generateExcelTemplate();
    showNotice('Template Excel (.xlsx) rapi berhasil diunduh!');
  };

  const handleDownloadJSON = () => {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      institution: 'MTs Sirojut Tholibin',
      santriList,
      records,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_tahfidz_quran_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotice('Cadangan data JSON berhasil diunduh!');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed.santriList) && Array.isArray(parsed.records)) {
          onRestoreData(parsed.santriList, parsed.records);
          showNotice('Data berhasil dipulihkan dari cadangan JSON!');
          setTimeout(() => onClose(), 1200);
        } else {
          alert('Format berkas cadangan tidak valid.');
        }
      } catch (err) {
        alert('Gagal membaca berkas cadangan JSON.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetDefault = () => {
    if (confirm('Kembalikan data ke data awal contoh MTs Sirojut Tholibin? Data setoran yang belum dicadangkan akan ditimpa.')) {
      onRestoreData(INITIAL_SANTRI, INITIAL_SETORAN);
      showNotice('Data berhasil dikembalikan ke contoh awal.');
      setTimeout(() => onClose(), 1000);
    }
  };

  const showNotice = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white px-6 py-4.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-800/80 flex items-center justify-center text-emerald-300">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base">Pusat Kelola & Ekspor Data</h3>
              <p className="text-xs text-emerald-300/80">Impor, ekspor Excel/CSV, unduh template, dan kelola data</p>
            </div>
          </div>
          <button onClick={onClose} className="text-emerald-300 hover:text-white p-1 rounded-lg hover:bg-emerald-800/60 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 rounded-xl text-xs flex items-center gap-2 font-semibold animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Quick Action: Impor Data & Template Excel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {onOpenImportModal && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenImportModal();
                }}
                className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold p-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
              >
                <Upload className="w-4 h-4 text-amber-300" />
                <span>Impor dari Excel / CSV</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold p-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
            >
              <FileSpreadsheet className="w-4 h-4 text-slate-950" />
              <span>Unduh Template Excel</span>
            </button>
          </div>

          {/* Export Full Excel (.xlsx) */}
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 hover:border-emerald-400 transition-colors">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-emerald-950 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                Laporan Lengkap Microsoft Excel (.xlsx)
              </span>
              <span className="text-[10px] bg-emerald-200/70 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                Multi-Sheet
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
              Buku kerja Excel rapi berisikan sheet Ringkasan Statistik, Data Master Santri, dan Riwayat Lengkap Setoran beserta nomor surat.
            </p>
            <button
              onClick={handleDownloadExcel}
              className="w-full bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>Unduh Rekap Excel Lengkap (.xlsx)</span>
            </button>
          </div>

          {/* Export CSV */}
          <div className="p-4 rounded-xl border border-slate-200 hover:border-emerald-300 bg-slate-50 transition-colors">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-700" />
                Rekap Tabel Spreadsheet (CSV)
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Format tabel standar CSV yang kompatibel dengan Google Sheets, Excel, atau software database madrasah.
            </p>
            <button
              onClick={() => {
                exportToCSV(records, santriList);
                showNotice('Berkas CSV berhasil diunduh!');
              }}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2 px-3 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Rekap CSV</span>
            </button>
          </div>

          {/* Backup JSON */}
          <div className="p-4 rounded-xl border border-slate-200 hover:border-emerald-300 bg-slate-50 transition-colors">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <Database className="w-4 h-4 text-teal-700" />
                Cadangan Lengkap Sistem (JSON)
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Simpan seluruh database lokal (santri dan seluruh catatan mutaba'ah) sebagai berkas backup aman.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleDownloadJSON}
                className="flex-1 bg-teal-800 hover:bg-teal-700 text-white font-semibold py-2 px-3 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Unduh JSON</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold py-2 px-3 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Upload className="w-4 h-4" />
                <span>Pulihkan JSON</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Danger zone: Delete all data button */}
          <div className="pt-2 border-t border-slate-200">
            <div className="bg-rose-50/70 border border-rose-200/80 rounded-xl p-3.5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-rose-900 block">Zona Pembersihan Data</span>
                <span className="text-[11px] text-rose-700">Hapus semua data atau bersihkan riwayat</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenDeleteAllModal) {
                    onOpenDeleteAllModal();
                  } else {
                    handleResetDefault();
                  }
                }}
                className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xs transition-all active:scale-95"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Semua Data</span>
              </button>
            </div>
          </div>

          {/* Reset to initial and Close */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={handleResetDefault}
              className="text-xs text-slate-500 hover:text-emerald-700 font-medium flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset ke Contoh Bawaan</span>
            </button>
            <button
              onClick={onClose}
              className="text-xs font-semibold px-4 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
