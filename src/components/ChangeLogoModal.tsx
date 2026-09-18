import React, { useState, useRef } from 'react';
import { X, Upload, RotateCcw, Check, Image as ImageIcon, Sparkles, AlertCircle } from 'lucide-react';

interface ChangeLogoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLogo: string;
  onSaveLogo: (newLogoUrl: string) => void;
  onResetLogo: () => void;
}

export const ChangeLogoModal: React.FC<ChangeLogoModalProps> = ({
  isOpen,
  onClose,
  currentLogo,
  onSaveLogo,
  onResetLogo,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>(currentLogo);
  const [urlInput, setUrlInput] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync with currentLogo when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setPreviewUrl(currentLogo);
      setUrlInput('');
      setErrorMessage(null);
    }
  }, [isOpen, currentLogo]);

  if (!isOpen) return null;

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Harap pilih berkas gambar (PNG, JPG, JPEG, SVG, atau WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Ukuran berkas maksimal 5 MB.');
      return;
    }

    setErrorMessage(null);
    const reader = new FileReader();
    reader.onload = e => {
      const result = e.target?.result as string;
      if (result) {
        setPreviewUrl(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    setPreviewUrl(urlInput.trim());
    setErrorMessage(null);
  };

  const handleSave = () => {
    onSaveLogo(previewUrl);
    onClose();
  };

  const handleResetToDefault = () => {
    onResetLogo();
    setPreviewUrl('/logo.png');
    setUrlInput('');
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-emerald-100 animate-in fade-in zoom-in-95 duration-150"
        id="modal-change-logo"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white px-5 py-4 flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-700/60 flex items-center justify-center text-amber-300">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Ubah Logo Lembaga</h3>
              <p className="text-xs text-emerald-300/80">Sesuaikan logo dashboard, navbar, dan kartu raport</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-300 hover:text-white p-1 rounded-lg hover:bg-emerald-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5 text-slate-800">
          {/* Error notice */}
          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Current / New Logo Live Preview */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Pratinjau Logo
            </span>
            <div className="grid grid-cols-2 gap-3">
              {/* Dark preview (Navbar / Dashboard mode) */}
              <div className="bg-emerald-950 p-3 rounded-lg border border-emerald-800 flex flex-col items-center justify-center min-h-[100px]">
                <img
                  src={previewUrl}
                  alt="Pratinjau Logo Tema Gelap"
                  className="w-16 h-16 object-contain drop-shadow-md"
                  onError={() => setErrorMessage('Gambar gagal dimuat. Pastikan berkas atau URL valid.')}
                />
                <span className="text-[10px] text-emerald-300/80 mt-1.5 font-medium">
                  Tampilan Navbar & Dashboard
                </span>
              </div>

              {/* Light preview (Kop Cetak Raport mode) */}
              <div className="bg-white p-3 rounded-lg border border-slate-300 flex flex-col items-center justify-center min-h-[100px] shadow-2xs">
                <img
                  src={previewUrl}
                  alt="Pratinjau Logo Tema Terang"
                  className="w-16 h-16 object-contain"
                />
                <span className="text-[10px] text-slate-500 mt-1.5 font-medium">
                  Tampilan Kop Raport Cetak
                </span>
              </div>
            </div>
          </div>

          {/* Upload Area */}
          <div>
            <span className="text-xs font-semibold text-slate-700 block mb-1.5">
              1. Unggah Gambar dari Perangkat
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                isDragging
                  ? 'border-emerald-500 bg-emerald-50/70 text-emerald-900'
                  : 'border-slate-300 hover:border-emerald-500 hover:bg-slate-50 text-slate-600'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Klik untuk memilih gambar atau tarik gambar ke sini
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Mendukung PNG, JPG, WEBP, atau SVG (Maks. 5 MB)
                </p>
              </div>
            </div>
          </div>

          {/* Or Paste URL */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-700 block">
              2. Atau Masukkan Tautan / URL Gambar
            </span>
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                placeholder="https://contoh.com/logo.png"
                className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={handleApplyUrl}
                disabled={!urlInput.trim()}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Gunakan URL
              </button>
            </div>
          </div>

          {/* Quick preset badge */}
          <div className="pt-1 flex items-center justify-between border-t border-slate-100 text-xs">
            <span className="text-slate-500">Logo Resmi Madrasah:</span>
            <button
              type="button"
              onClick={handleResetToDefault}
              className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-semibold hover:underline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Gunakan Logo MTs Sirojut Tholibin</span>
            </button>
          </div>
        </div>

        {/* Footer actions */}
        <div className="bg-slate-50 px-5 py-3.5 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="text-xs text-slate-600 hover:text-slate-900 font-medium px-3 py-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            Reset Default
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-slate-600 hover:text-slate-900 font-medium px-4 py-2 rounded-lg hover:bg-slate-200/60 transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition-all active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Logo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
