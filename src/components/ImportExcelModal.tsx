import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  FileSpreadsheet, 
  Download, 
  Check, 
  AlertTriangle, 
  AlertCircle, 
  FileCheck2, 
  Users, 
  BookOpen, 
  Layers, 
  HelpCircle,
  ArrowRight,
  Info
} from 'lucide-react';
import { Santri, SetoranRecord } from '../types';
import { generateExcelTemplate, parseUploadedExcel, ParseImportResult } from '../utils/excelHelpers';

interface ImportExcelModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingSantri: Santri[];
  existingRecords: SetoranRecord[];
  onImportSuccess: (
    importedSantri: Santri[], 
    importedRecords: SetoranRecord[], 
    mode: 'merge' | 'overwrite'
  ) => void;
}

export const ImportExcelModal: React.FC<ImportExcelModalProps> = ({
  isOpen,
  onClose,
  existingSantri,
  existingRecords,
  onImportSuccess,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [parseResult, setParseResult] = useState<ParseImportResult | null>(null);
  const [importMode, setImportMode] = useState<'merge' | 'overwrite'>('merge');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleReset = () => {
    setSelectedFile(null);
    setParseResult(null);
    setErrorMsg(null);
    setIsLoading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const processFile = async (file: File) => {
    setSelectedFile(file);
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const result = await parseUploadedExcel(file, existingSantri);
      setParseResult(result);
      if (result.errors.length > 0) {
        setErrorMsg(result.errors.join('\n'));
      }
    } catch (err: any) {
      console.error('Error parsing excel:', err);
      setErrorMsg('Gagal membaca berkas Excel. Pastikan berkas tidak rusak dan berformat .xlsx, .xls, atau .csv.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleConfirmImport = () => {
    if (!parseResult) return;
    onImportSuccess(parseResult.santri, parseResult.records, importMode);
    handleReset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-emerald-100 animate-in fade-in zoom-in-95 duration-150"
        id="modal-import-excel"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white px-6 py-4.5 flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-800/80 flex items-center justify-center text-amber-300 shadow-inner">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Impor Data dari Excel</h3>
              <p className="text-xs text-emerald-300/80">Masukkan data santri dan setoran sekaligus menggunakan berkas spreadsheet</p>
            </div>
          </div>
          <button
            onClick={() => {
              handleReset();
              onClose();
            }}
            className="text-emerald-300 hover:text-white p-1 rounded-lg hover:bg-emerald-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-slate-800 max-h-[80vh] overflow-y-auto">
          {/* Step 1: Download Template Notice Banner */}
          <div className="bg-gradient-to-r from-amber-50 to-emerald-50 border border-amber-200/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Belum punya format yang sesuai?</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Unduh template Excel resmi yang sudah dilengkapi kolom NISN, data santri, setoran, serta daftar 114 surat.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => generateExcelTemplate()}
              className="inline-flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-sm transition-all shrink-0 w-full sm:w-auto justify-center"
            >
              <FileSpreadsheet className="w-4 h-4 text-amber-300" />
              <span>Unduh Template Excel (.xlsx)</span>
            </button>
          </div>

          {/* Upload Drop Zone */}
          {!parseResult ? (
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Pilih Berkas Excel atau CSV
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls, .csv"
                className="hidden"
                onChange={handleFileChange}
              />
              <div
                onDragOver={e => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                  isDragging
                    ? 'border-emerald-500 bg-emerald-50/70'
                    : 'border-slate-300 hover:border-emerald-500 hover:bg-slate-50/80 bg-white'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-800">
                    Klik untuk memilih berkas Excel atau tarik berkas ke sini
                  </p>
                  <p className="text-xs text-slate-500">
                    Mendukung format <strong>.xlsx</strong>, <strong>.xls</strong>, atau <strong>.csv</strong>
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-[11px] font-medium mt-1">
                  Contoh: Template_Impor_Tahfidz_MTs_Sirojut_Tholibin.xlsx
                </span>
              </div>
            </div>
          ) : (
            /* Parsed Preview Section */
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* File Info Bar */}
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileCheck2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-800 truncate">{selectedFile?.name}</p>
                    <p className="text-[11px] text-slate-500">
                      {((selectedFile?.size || 0) / 1024).toFixed(1)} KB • Berhasil diuraikan
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  className="text-xs text-rose-600 hover:text-rose-700 hover:underline font-semibold shrink-0 ml-2"
                >
                  Ganti Berkas
                </button>
              </div>

              {/* Stats of parsed rows */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xl font-extrabold text-emerald-900 block leading-none">
                      {parseResult.santri.length}
                    </span>
                    <span className="text-xs text-emerald-700 font-medium">Data Santri Siap Diimpor</span>
                  </div>
                </div>

                <div className="bg-teal-50 border border-teal-200 rounded-xl p-3.5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xl font-extrabold text-teal-900 block leading-none">
                      {parseResult.records.length}
                    </span>
                    <span className="text-xs text-teal-700 font-medium">Riwayat Setoran Siap Diimpor</span>
                  </div>
                </div>
              </div>

              {/* Warnings / Errors if any */}
              {parseResult.warnings.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 space-y-1 max-h-28 overflow-y-auto">
                  <div className="font-bold flex items-center gap-1.5 text-amber-800">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                    <span>Catatan Penyesuaian ({parseResult.warnings.length}):</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-amber-800/90 pl-1 text-[11px]">
                    {parseResult.warnings.slice(0, 5).map((w, idx) => (
                      <li key={idx}>{w}</li>
                    ))}
                    {parseResult.warnings.length > 5 && (
                      <li>... dan {parseResult.warnings.length - 5} catatan lainnya</li>
                    )}
                  </ul>
                </div>
              )}

              {/* Import Mode Options: Merge vs Overwrite */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700 block">
                  Metode Penggabungan Data:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <label
                    onClick={() => setImportMode('merge')}
                    className={`p-3 rounded-xl border cursor-pointer flex items-start gap-2.5 transition-all ${
                      importMode === 'merge'
                        ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === 'merge'}
                      onChange={() => setImportMode('merge')}
                      className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        Gabungkan (Tambah Data)
                      </span>
                      <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
                        Menambahkan data baru tanpa menghapus data santri & riwayat yang sudah ada di aplikasi.
                      </span>
                    </div>
                  </label>

                  <label
                    onClick={() => setImportMode('overwrite')}
                    className={`p-3 rounded-xl border cursor-pointer flex items-start gap-2.5 transition-all ${
                      importMode === 'overwrite'
                        ? 'border-rose-500 bg-rose-50/40 ring-2 ring-rose-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === 'overwrite'}
                      onChange={() => setImportMode('overwrite')}
                      className="mt-0.5 text-rose-600 focus:ring-rose-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-rose-900 block">
                        Gantikan Data Lama (Overwrite)
                      </span>
                      <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
                        Menghapus data saat ini dan menggantinya sepenuhnya dengan isi berkas Excel ini.
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 text-xs text-rose-700 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Terjadi Kesalahan</p>
                <p className="mt-0.5 leading-relaxed">{errorMsg}</p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              handleReset();
              onClose();
            }}
            className="text-xs text-slate-600 hover:text-slate-900 font-medium px-4 py-2 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            Batal
          </button>

          <div className="flex items-center gap-2">
            {parseResult && (
              <button
                type="button"
                onClick={handleConfirmImport}
                disabled={parseResult.santri.length === 0 && parseResult.records.length === 0}
                className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm transition-all active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>
                  Konfirmasi & Impor Data ({parseResult.santri.length + parseResult.records.length} Baris)
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
