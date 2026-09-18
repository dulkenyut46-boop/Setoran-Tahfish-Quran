import React from 'react';
import { BookOpen, PlusCircle, Users, History, Layers, BarChart3, Download, Camera, Upload, Trash2 } from 'lucide-react';

interface NavbarProps {
  activeTab: 'dashboard' | 'santri' | 'riwayat' | 'petaJuz';
  setActiveTab: (tab: 'dashboard' | 'santri' | 'riwayat' | 'petaJuz') => void;
  onOpenNewSetoran: () => void;
  onOpenExportModal: () => void;
  onOpenImportModal?: () => void;
  onOpenDeleteAllModal?: () => void;
  onOpenLogoModal?: () => void;
  santriCount: number;
  totalSetoranCount: number;
  logoUrl?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewSetoran,
  onOpenExportModal,
  onOpenImportModal,
  onOpenDeleteAllModal,
  onOpenLogoModal,
  santriCount,
  totalSetoranCount,
  logoUrl = '/logo.png',
}) => {
  return (
    <header className="no-print sticky top-0 z-30 bg-emerald-900 text-white shadow-md border-b border-emerald-800">
      {/* Top micro bar for school identity */}
      <div className="bg-emerald-950/80 px-4 py-1 text-xs text-emerald-200/90 border-b border-emerald-800/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Program Tahfidzul Qur'an • MTs Sirojut Tholibin</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-emerald-300/80">
            <span>{santriCount} Santri Terdaftar</span>
            <span>•</span>
            <span>{totalSetoranCount} Total Setoran</span>
          </div>
        </div>
      </div>

      {/* Main navigation container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div 
            className="flex items-center gap-3 group"
            id="brand-logo"
          >
            <div 
              className="relative cursor-pointer"
              onClick={onOpenLogoModal || (() => setActiveTab('dashboard'))}
              title="Klik untuk melihat atau mengubah logo"
            >
              <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-md ring-2 ring-emerald-500/40 group-hover:ring-amber-400 transition-all overflow-hidden">
                <img 
                  src={logoUrl} 
                  alt="Logo MTs Sirojut Tholibin" 
                  className="w-full h-full object-contain transition-transform group-hover:scale-105"
                  onError={(e) => {
                    // Fallback to generic icon if image fails
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              {onOpenLogoModal && (
                <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-xs">
                  <Camera className="w-2.5 h-2.5" />
                </div>
              )}
            </div>
            <div 
              className="cursor-pointer"
              onClick={() => setActiveTab('dashboard')}
            >
              <div className="flex items-center gap-1.5">
                <h1 className="font-bold text-lg text-white tracking-tight">Tahfidz Qur'an</h1>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-emerald-800 text-emerald-200 border border-emerald-700/60">
                  Mutaba'ah
                </span>
              </div>
              <p className="text-xs text-emerald-300/80 font-quran tracking-wide">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
            </div>
          </div>

          {/* Nav Tabs - Desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              id="nav-tab-dashboard"
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-800/90 text-white shadow-sm'
                  : 'text-emerald-100/80 hover:bg-emerald-800/40 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              id="nav-tab-santri"
              onClick={() => setActiveTab('santri')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'santri'
                  ? 'bg-emerald-800/90 text-white shadow-sm'
                  : 'text-emerald-100/80 hover:bg-emerald-800/40 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Data Santri</span>
            </button>

            <button
              id="nav-tab-riwayat"
              onClick={() => setActiveTab('riwayat')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'riwayat'
                  ? 'bg-emerald-800/90 text-white shadow-sm'
                  : 'text-emerald-100/80 hover:bg-emerald-800/40 hover:text-white'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Riwayat Setoran</span>
            </button>

            <button
              id="nav-tab-petajuz"
              onClick={() => setActiveTab('petaJuz')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'petaJuz'
                  ? 'bg-emerald-800/90 text-white shadow-sm'
                  : 'text-emerald-100/80 hover:bg-emerald-800/40 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Peta 30 Juz</span>
            </button>
          </nav>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Import Excel Button */}
            {onOpenImportModal && (
              <button
                id="btn-nav-import"
                onClick={onOpenImportModal}
                title="Impor Data dari Excel (.xlsx) atau CSV"
                className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs font-semibold bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 hover:text-white rounded-lg transition-colors border border-emerald-700/60 shadow-xs"
              >
                <Upload className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">Impor Data</span>
              </button>
            )}

            {/* Export & Data Center Button */}
            <button
              id="btn-export-backup"
              onClick={onOpenExportModal}
              title="Pusat Ekspor Excel/CSV, Unduh Template & Cadangan"
              className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs font-semibold bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 hover:text-white rounded-lg transition-colors border border-emerald-700/60 shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-emerald-300" />
              <span className="hidden sm:inline">Kelola / Ekspor</span>
            </button>

            {/* Delete All Button */}
            {onOpenDeleteAllModal && (
              <button
                id="btn-delete-all-nav"
                onClick={onOpenDeleteAllModal}
                title="Hapus Semua Data Santri & Setoran"
                className="p-1.5 sm:p-2 text-emerald-300 hover:text-rose-200 hover:bg-rose-950/60 rounded-lg transition-colors border border-transparent hover:border-rose-700/50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            {/* New Setoran Primary Button */}
            <button
              id="btn-quick-new-setoran"
              onClick={onOpenNewSetoran}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg shadow-sm hover:shadow transition-all active:scale-95 text-xs sm:text-sm"
            >
              <PlusCircle className="w-4 h-4 text-slate-950" />
              <span className="hidden sm:inline">Setoran Baru</span>
              <span className="sm:hidden">Setor</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile bottom-friendly bar */}
      <div className="md:hidden flex border-t border-emerald-800/80 bg-emerald-950/60 px-2 py-1 justify-around text-xs">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center py-1.5 px-3 rounded-md ${
            activeTab === 'dashboard' ? 'text-amber-400 font-semibold' : 'text-emerald-200/70'
          }`}
        >
          <BarChart3 className="w-4 h-4 mb-0.5" />
          <span>Dashboard</span>
        </button>
        <button
          onClick={() => setActiveTab('santri')}
          className={`flex flex-col items-center py-1.5 px-3 rounded-md ${
            activeTab === 'santri' ? 'text-amber-400 font-semibold' : 'text-emerald-200/70'
          }`}
        >
          <Users className="w-4 h-4 mb-0.5" />
          <span>Santri</span>
        </button>
        <button
          onClick={() => setActiveTab('riwayat')}
          className={`flex flex-col items-center py-1.5 px-3 rounded-md ${
            activeTab === 'riwayat' ? 'text-amber-400 font-semibold' : 'text-emerald-200/70'
          }`}
        >
          <History className="w-4 h-4 mb-0.5" />
          <span>Riwayat</span>
        </button>
        <button
          onClick={() => setActiveTab('petaJuz')}
          className={`flex flex-col items-center py-1.5 px-3 rounded-md ${
            activeTab === 'petaJuz' ? 'text-amber-400 font-semibold' : 'text-emerald-200/70'
          }`}
        >
          <Layers className="w-4 h-4 mb-0.5" />
          <span>Peta Juz</span>
        </button>
      </div>
    </header>
  );
};
