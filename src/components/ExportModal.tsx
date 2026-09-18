import React, { useRef, useState } from 'react';
import { X, Download, Upload, RefreshCw, FileText, Database, Check } from 'lucide-react';
import { Santri, SetoranRecord } from '../types';
import { exportToCSV } from '../utils/tahfidzHelpers';
import { INITIAL_SANTRI, INITIAL_SETORAN } from '../data/initialData';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  santriList: Santri[];
  records: SetoranRecord[];
  onRestoreData: (newSantri: Santri[], newRecords: SetoranRecord[]) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  santriList,
  records,
  onRestoreData,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

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
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        <div className="bg-emerald-950 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base">Ekspor & Cadangkan Data</h3>
          </div>
          <button onClick={onClose} className="text-emerald-300 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 rounded-xl text-xs flex items-center gap-2 font-medium">
              <Check className="w-4 h-4 text-emerald-600" />
              {successMsg}
            </div>
          )}

          {/* Export CSV */}
          <div className="p-4 rounded-xl border border-slate-200 hover:border-emerald-300 bg-slate-50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-700" />
                Unduh Rekap Spreadsheet (CSV)
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Format tabel CSV yang dapat langsung dibuka di Microsoft Excel atau Google Sheets untuk laporan madrasah.
            </p>
            <button
              onClick={() => {
                exportToCSV(records, santriList);
                showNotice('Berkas CSV berhasil diunduh!');
              }}
              className="w-full bg-emerald-800 hover:bg-emerald-700 text-white font-semibold py-2 px-3 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Unduh CSV Rekap Setoran</span>
            </button>
          </div>

          {/* Backup JSON */}
          <div className="p-4 rounded-xl border border-slate-200 hover:border-emerald-300 bg-slate-50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <Database className="w-4 h-4 text-teal-700" />
                Cadangan Lengkap (JSON)
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Simpan semua data santri dan riwayat setoran sebagai berkas backup aman.
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
                <span>Pulihkan (Restore)</span>
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

          {/* Reset to initial */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
            <button
              onClick={handleResetDefault}
              className="text-xs text-slate-500 hover:text-rose-600 font-medium flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset ke Contoh Data Awal</span>
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
