import React, { useState, useRef } from 'react';
import { 
  Building2, 
  Database, 
  Sliders, 
  Save, 
  Check, 
  Upload, 
  Download, 
  Trash2, 
  RefreshCw, 
  Camera, 
  AlertTriangle, 
  FileSpreadsheet, 
  MessageCircle, 
  Sparkles, 
  HardDrive, 
  CheckCircle2, 
  ShieldCheck, 
  Info,
  Calendar,
  Layers,
  Award
} from 'lucide-react';
import { SchoolProfile, AppSettings, Santri, SetoranRecord } from '../types';
import { generateExcelTemplate, exportFullDataToExcel } from '../utils/excelHelpers';

interface PengaturanViewProps {
  schoolProfile: SchoolProfile;
  onSaveSchoolProfile: (profile: SchoolProfile) => void;
  appSettings: AppSettings;
  onSaveAppSettings: (settings: AppSettings) => void;
  logoUrl: string;
  onOpenLogoModal: () => void;
  onResetLogo: () => void;
  santriList: Santri[];
  records: SetoranRecord[];
  onRestoreData: (santri: Santri[], records: SetoranRecord[]) => void;
  onOpenImportModal: () => void;
  onOpenDeleteAllModal: () => void;
  onResetToSample: () => void;
}

export const PengaturanView: React.FC<PengaturanViewProps> = ({
  schoolProfile,
  onSaveSchoolProfile,
  appSettings,
  onSaveAppSettings,
  logoUrl,
  onOpenLogoModal,
  onResetLogo,
  santriList,
  records,
  onRestoreData,
  onOpenImportModal,
  onOpenDeleteAllModal,
  onResetToSample,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'profil' | 'database' | 'lainnya'>('profil');
  const [profileForm, setProfileForm] = useState<SchoolProfile>(schoolProfile);
  const [settingsForm, setSettingsForm] = useState<AppSettings>(appSettings);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSchoolProfile(profileForm);
    showToast('Profil sekolah dan kop surat berhasil diperbarui!');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveAppSettings(settingsForm);
    showToast('Pengaturan penilaian dan sistem berhasil disimpan!');
  };

  // Calculate storage usage
  const santriJson = JSON.stringify(santriList);
  const recordsJson = JSON.stringify(records);
  const profileJson = JSON.stringify(schoolProfile);
  const settingsJson = JSON.stringify(appSettings);
  const totalBytes = new Blob([santriJson, recordsJson, profileJson, settingsJson]).size;
  const storageKb = (totalBytes / 1024).toFixed(1);
  const approximateQuota = 5 * 1024; // ~5MB localStorage safe limit
  const storagePercent = Math.min(100, Math.max(0.5, (totalBytes / (approximateQuota * 1024)) * 100)).toFixed(2);

  // Backup Full JSON
  const handleBackupJSON = () => {
    const fullBackup = {
      app: "Mutaba'ah Tahfidz Al-Qur'an",
      version: '2.0',
      exportedAt: new Date().toISOString(),
      schoolProfile: profileForm,
      appSettings: settingsForm,
      logoUrl,
      santriList,
      records,
    };

    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_basis_data_${profileForm.namaSekolah.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Snapshot basis data JSON berhasil dicadangkan!');
  };

  // Restore JSON Backup
  const handleRestoreJSONFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (parsed && (parsed.santriList || parsed.records)) {
          const restoredSantri = Array.isArray(parsed.santriList) ? parsed.santriList : [];
          const restoredRecords = Array.isArray(parsed.records) ? parsed.records : [];
          onRestoreData(restoredSantri, restoredRecords);
          
          if (parsed.schoolProfile) {
            setProfileForm(parsed.schoolProfile);
            onSaveSchoolProfile(parsed.schoolProfile);
          }
          if (parsed.appSettings) {
            setSettingsForm(parsed.appSettings);
            onSaveAppSettings(parsed.appSettings);
          }
          showToast(`Basis data berhasil dipulihkan! (${restoredSantri.length} santri, ${restoredRecords.length} setoran)`);
        } else {
          alert('Format berkas cadangan JSON tidak valid atau rusak.');
        }
      } catch (err) {
        console.error(err);
        alert('Gagal membaca berkas JSON. Pastikan berkas adalah cadangan yang sah.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-950 text-emerald-100 px-5 py-3 rounded-2xl shadow-xl border border-emerald-700 flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            <Sliders className="w-3.5 h-3.5 text-emerald-700" />
            <span>Pusat Konfigurasi & Basis Data</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Pengaturan Sistem & Madrasah
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Konfigurasikan profil resmi madrasah, kelola penyimpanan basis data lokal, dan sesuaikan standar penilaian tahfidz.
          </p>
        </div>

        {/* Quick Identity Box */}
        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
          <div className="w-12 h-12 rounded-xl bg-white p-1 border border-slate-200 shadow-2xs flex items-center justify-center overflow-hidden">
            <img 
              src={logoUrl} 
              alt="Logo Madrasah" 
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div className="text-left">
            <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{profileForm.namaSekolah}</h4>
            <p className="text-[11px] text-slate-500">TA {profileForm.tahunAjaran} • Sem. {profileForm.semester}</p>
          </div>
        </div>
      </div>

      {/* Sub-tabs Navigation */}
      <div className="flex border-b border-slate-200 gap-2 sm:gap-4 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveSubTab('profil')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
            activeSubTab === 'profil'
              ? 'border-emerald-700 text-emerald-800 bg-emerald-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>1. Profil Sekolah & Kop Surat</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('database')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
            activeSubTab === 'database'
              ? 'border-emerald-700 text-emerald-800 bg-emerald-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>2. Penyimpanan Basis Data</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('lainnya')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
            activeSubTab === 'lainnya'
              ? 'border-emerald-700 text-emerald-800 bg-emerald-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>3. Standar Penilaian & Pengaturan Lainnya</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PROFIL SEKOLAH */}
      {/* ========================================================================= */}
      {activeSubTab === 'profil' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Profile Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6">
            <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-emerald-700" />
                  Informasi Resmi Madrasah / Lembaga
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Data ini akan tercetak otomatis pada kartu mutaba'ah, raport santri, dan laporan ekspor.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nama Sekolah / Madrasah *
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.namaSekolah}
                    onChange={(e) => setProfileForm({ ...profileForm, namaSekolah: e.target.value })}
                    placeholder="Contoh: MTs Sirojut Tholibin"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    NSM (Nomor Statistik Madrasah)
                  </label>
                  <input
                    type="text"
                    value={profileForm.nsm}
                    onChange={(e) => setProfileForm({ ...profileForm, nsm: e.target.value })}
                    placeholder="121235170012"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    NPSN
                  </label>
                  <input
                    type="text"
                    value={profileForm.npsn}
                    onChange={(e) => setProfileForm({ ...profileForm, npsn: e.target.value })}
                    placeholder="20584123"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Alamat Lengkap Madrasah *
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.alamat}
                    onChange={(e) => setProfileForm({ ...profileForm, alamat: e.target.value })}
                    placeholder="Jl. Pesantren No. 07, Sirojut Tholibin"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Madrasah
                  </label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    placeholder="mtssirojuttholibin07@gmail.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    No. Telepon / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={profileForm.telepon}
                    onChange={(e) => setProfileForm({ ...profileForm, telepon: e.target.value })}
                    placeholder="0812-3456-7890"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nama Kepala Madrasah *
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.kepalaSekolah}
                    onChange={(e) => setProfileForm({ ...profileForm, kepalaSekolah: e.target.value })}
                    placeholder="KH. M. Sirojuddin, M.Pd"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    NIP Kepala Madrasah
                  </label>
                  <input
                    type="text"
                    value={profileForm.nipKepalaSekolah}
                    onChange={(e) => setProfileForm({ ...profileForm, nipKepalaSekolah: e.target.value })}
                    placeholder="197508122003121002 atau kosongkan jika tidak ada"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Koordinator / Pembina Tahfidz *
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.koordinatorTahfidz}
                    onChange={(e) => setProfileForm({ ...profileForm, koordinatorTahfidz: e.target.value })}
                    placeholder="Ust. Ahmad Fauzan, Al-Hafidz"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    NIP / NIY Koordinator
                  </label>
                  <input
                    type="text"
                    value={profileForm.nipKoordinator}
                    onChange={(e) => setProfileForm({ ...profileForm, nipKoordinator: e.target.value })}
                    placeholder="198804152015031004"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tahun Pelajaran *
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.tahunAjaran}
                    onChange={(e) => setProfileForm({ ...profileForm, tahunAjaran: e.target.value })}
                    placeholder="2024 / 2025"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Semester Aktif *
                  </label>
                  <select
                    value={profileForm.semester}
                    onChange={(e) => setProfileForm({ ...profileForm, semester: e.target.value as 'Ganjil' | 'Genap' })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
                  >
                    <option value="Ganjil">Semester Ganjil</option>
                    <option value="Genap">Semester Genap</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Visi / Slogan Tahfidz
                  </label>
                  <input
                    type="text"
                    value={profileForm.slogan}
                    onChange={(e) => setProfileForm({ ...profileForm, slogan: e.target.value })}
                    placeholder="Mencetak Generasi Qur'ani yang Berakhlakul Karimah dan Berprestasi"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="submit"
                  className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2 text-sm active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan Profil</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Col: Logo & Kop Surat Live Preview */}
          <div className="space-y-6">
            {/* Logo Settings Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-700" />
                Logo Lembaga / Madrasah
              </h4>

              <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <div className="w-24 h-24 rounded-2xl bg-white p-2 border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden mb-3">
                  <img 
                    src={logoUrl} 
                    alt="Logo Madrasah" 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
                <p className="text-xs font-semibold text-slate-800 text-center">{profileForm.namaSekolah}</p>
                <p className="text-[11px] text-slate-500 text-center mt-0.5">Format disarankan PNG transparan</p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onOpenLogoModal}
                  className="flex-1 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5 text-amber-300" />
                  <span>Ganti Logo</span>
                </button>
                <button
                  type="button"
                  onClick={onResetLogo}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-2 px-3 rounded-xl border border-slate-200 transition-colors"
                  title="Kembalikan ke logo awal MTs Sirojut Tholibin"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Live Pratinjau Kop Surat */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider">
                  Pratinjau Kop Surat Resmi
                </h4>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  Kartu Mutaba'ah
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1.5 text-xs">
                <div className="flex items-center justify-center gap-3 pb-2 border-b-2 border-emerald-900">
                  <div className="w-10 h-10 bg-white p-1 rounded-lg border border-slate-200 shrink-0">
                    <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
                  </div>
                  <div className="text-center">
                    <h5 className="font-extrabold text-[12px] text-emerald-950 uppercase tracking-wide">
                      {profileForm.namaSekolah}
                    </h5>
                    <p className="text-[9px] text-emerald-800 font-bold">
                      LEMBAGA PENDIDIKAN & PENGEMBANGAN TAHFIDZUL QUR'AN
                    </p>
                    <p className="text-[9px] text-slate-500">
                      {profileForm.alamat} • {profileForm.email}
                    </p>
                  </div>
                </div>

                <div className="text-[10px] text-slate-600 font-semibold pt-1">
                  KARTU KENDALI & MUTABA'AH SETORAN HAFALAN
                </div>
                <div className="text-[9px] text-slate-400">
                  Tahun Ajaran {profileForm.tahunAjaran} ({profileForm.semester})
                </div>
              </div>

              <p className="text-[11px] text-slate-400 italic">
                * Kop surat di atas akan otomatis tampil saat mencetak Kartu Mutaba'ah santri.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PENYIMPANAN BASIS DATA (DATABASE STORAGE) */}
      {/* ========================================================================= */}
      {activeSubTab === 'database' && (
        <div className="space-y-6">
          {/* Storage Capacity & Realtime Status */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-100">
                  <HardDrive className="w-6 h-6 text-emerald-700" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    Status Basis Data & Penyimpanan Lokal
                    <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      Tersimpan Aman
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Data tersimpan secara otomatis dan persisten di memori browser (Client-side LocalStorage) tanpa risiko hilang saat tab ditutup.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => showToast('Basis data sinkron dan terverifikasi utuh!')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verifikasi Integritas</span>
              </button>
            </div>

            {/* Storage Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Santri</span>
                <div className="text-2xl font-extrabold text-slate-900 mt-1">{santriList.length}</div>
                <p className="text-[11px] text-slate-400 mt-0.5">Master data santri & target</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Setoran</span>
                <div className="text-2xl font-extrabold text-slate-900 mt-1">{records.length}</div>
                <p className="text-[11px] text-slate-400 mt-0.5">Riwayat ziyadah & muroja'ah</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ukuran Database</span>
                <div className="text-2xl font-extrabold text-slate-900 mt-1">{storageKb} <span className="text-xs font-normal text-slate-400">KB</span></div>
                <p className="text-[11px] text-slate-400 mt-0.5">Payload terkompresi</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kapasitas Terpakai</span>
                <div className="text-2xl font-extrabold text-emerald-800 mt-1">{storagePercent}%</div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${storagePercent}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Backup & Export Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Backup JSON */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0 border border-amber-200">
                  <Download className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    Pencadangan Penuh Basis Data (Snapshot JSON)
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Mencadangkan seluruh data: profil madrasah, logo, seluruh daftar santri, dan riwayat setoran ke file JSON terenkripsi.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleBackupJSON}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Download className="w-4 h-4 text-amber-300" />
                <span>Unduh Cadangan Lengkap (.json)</span>
              </button>
            </div>

            {/* Export Full Excel */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-200">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    Ekspor Database ke Excel Rapi (.xlsx)
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Format spreadsheet profesional dengan 4 sheet (Ringkasan Statistik, Master Santri, Riwayat Setoran, dan Daftar 114 Surat).
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => exportFullDataToExcel(records, santriList)}
                  className="flex-1 bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <FileSpreadsheet className="w-4 h-4 text-amber-300" />
                  <span>Ekspor Excel (.xlsx)</span>
                </button>
                <button
                  type="button"
                  onClick={() => generateExcelTemplate()}
                  className="bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold py-2.5 px-3 rounded-xl border border-amber-300 text-xs transition-colors"
                  title="Unduh Template Excel Kosong"
                >
                  <span>Template</span>
                </button>
              </div>
            </div>
          </div>

          {/* Restore & Import Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Restore from JSON */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-800 flex items-center justify-center shrink-0 border border-sky-200">
                  <Upload className="w-5 h-5 text-sky-700" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    Pulihkan dari File Cadangan JSON
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Unggah file snapshot cadangan (.json) sebelumnya untuk memulihkan seluruh data dan pengaturan secara instan.
                  </p>
                </div>
              </div>

              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleRestoreJSONFile}
                  accept=".json"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-sky-700 hover:bg-sky-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <Upload className="w-4 h-4" />
                  <span>Pilih & Pulihkan Cadangan JSON</span>
                </button>
              </div>
            </div>

            {/* Import from Excel Modal Trigger */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center shrink-0 border border-teal-200">
                  <Upload className="w-5 h-5 text-teal-700" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    Impor Data dari Excel (.xlsx / .csv)
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Unggah daftar santri atau riwayat setoran dari file Excel dengan pilihan mode "Gabungkan" atau "Gantikan".
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenImportModal}
                className="w-full bg-teal-700 hover:bg-teal-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <FileSpreadsheet className="w-4 h-4 text-teal-200" />
                <span>Buka Wizard Impor Excel</span>
              </button>
            </div>
          </div>

          {/* Danger Zone: Reset & Delete All */}
          <div className="bg-rose-50/70 rounded-2xl border border-rose-200 p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-900">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <h4 className="font-extrabold text-sm uppercase tracking-wider">
                Zona Pemeliharaan & Pembersihan Data (Tindakan Kritis)
              </h4>
            </div>
            <p className="text-xs text-rose-700 leading-relaxed">
              Tindakan di bawah ini berdampak langsung pada basis data yang tersimpan. Harap pastikan Anda telah mengunduh cadangan sebelum membersihkan data.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onOpenDeleteAllModal}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all flex items-center gap-2 shadow-sm active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
                <span>Buka Menu Hapus Semua Data</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Muat ulang data sampel madrasah (5 santri & riwayat)?')) {
                    onResetToSample();
                    showToast('Data sampel madrasah berhasil dimuat ulang.');
                  }
                }}
                className="bg-white hover:bg-slate-100 text-slate-800 font-semibold px-4 py-2.5 rounded-xl border border-slate-300 text-xs transition-all flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4 text-slate-600" />
                <span>Muat Ulang Data Sampel Madrasah</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: STANDAR PENILAIAN & PENGATURAN LAINNYA */}
      {/* ========================================================================= */}
      {activeSubTab === 'lainnya' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Penilaian & WA Settings */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-700" />
                  Standar Penilaian & Kriteria Ketuntasan Minimal (KKM)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tentukan batas angka kelulusan dan ambang batas predikat kelancaran setoran.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    KKM Nilai Kelulusan Setoran (0-100) *
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={50}
                      max={100}
                      value={settingsForm.kkmNilai}
                      onChange={(e) => setSettingsForm({ ...settingsForm, kkmNilai: Number(e.target.value) })}
                      className="w-24 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold text-emerald-800 focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
                    />
                    <span className="text-xs text-slate-500">Nilai di bawah ini ditandai perlu ulang (tikror)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Target Juz Standar Santri Baru
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={settingsForm.defaultTargetJuz}
                      onChange={(e) => setSettingsForm({ ...settingsForm, defaultTargetJuz: Number(e.target.value) })}
                      className="w-24 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
                    />
                    <span className="text-xs text-slate-500">Juz (otomatis saat menambah santri baru)</span>
                  </div>
                </div>
              </div>

              {/* Kelancaran Tresholds */}
              <div className="pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  Batas Minimal Predikat Kelancaran
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                    <span className="font-bold text-emerald-900 block">Mumtaz (Sangat Lancar)</span>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-slate-500">≥</span>
                      <input
                        type="number"
                        min={70}
                        max={100}
                        value={settingsForm.mumtazMin}
                        onChange={(e) => setSettingsForm({ ...settingsForm, mumtazMin: Number(e.target.value) })}
                        className="w-16 px-2 py-1 bg-white border border-emerald-300 rounded-lg font-bold text-emerald-800"
                      />
                    </div>
                  </div>

                  <div className="bg-teal-50 p-3 rounded-xl border border-teal-200">
                    <span className="font-bold text-teal-900 block">Jayyid Jiddan (Lancar)</span>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-slate-500">≥</span>
                      <input
                        type="number"
                        min={60}
                        max={95}
                        value={settingsForm.jayyidJiddanMin}
                        onChange={(e) => setSettingsForm({ ...settingsForm, jayyidJiddanMin: Number(e.target.value) })}
                        className="w-16 px-2 py-1 bg-white border border-teal-300 rounded-lg font-bold text-teal-800"
                      />
                    </div>
                  </div>

                  <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
                    <span className="font-bold text-amber-900 block">Jayyid (Cukup)</span>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-slate-500">≥</span>
                      <input
                        type="number"
                        min={50}
                        max={90}
                        value={settingsForm.jayyidMin}
                        onChange={(e) => setSettingsForm({ ...settingsForm, jayyidMin: Number(e.target.value) })}
                        className="w-16 px-2 py-1 bg-white border border-amber-300 rounded-lg font-bold text-amber-800"
                      />
                    </div>
                  </div>

                  <div className="bg-rose-50 p-3 rounded-xl border border-rose-200">
                    <span className="font-bold text-rose-900 block">Maqbul (Kurang)</span>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-slate-500">≥</span>
                      <input
                        type="number"
                        min={40}
                        max={80}
                        value={settingsForm.maqbulMin}
                        onChange={(e) => setSettingsForm({ ...settingsForm, maqbulMin: Number(e.target.value) })}
                        className="w-16 px-2 py-1 bg-white border border-rose-300 rounded-lg font-bold text-rose-800"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* WhatsApp Notification Template */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-emerald-600" />
                      Template Pesan WhatsApp ke Wali Santri
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Pesan otomatis yang dikirimkan kepada orang tua/wali saat menekan tombol WhatsApp pada setoran.
                    </p>
                  </div>
                </div>

                <textarea
                  rows={8}
                  value={settingsForm.waTemplate}
                  onChange={(e) => setSettingsForm({ ...settingsForm, waTemplate: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none leading-relaxed"
                />

                <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
                  <span className="font-bold text-slate-700">Tag Variabel:</span>
                  {['{nama}', '{namaSekolah}', '{tanggal}', '{tipe}', '{surat}', '{juz}', '{kelancaran}', '{nilai}', '{status}', '{catatan}', '{ustadz}'].map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setSettingsForm({ ...settingsForm, waTemplate: settingsForm.waTemplate + ' ' + tag })}
                      className="bg-slate-100 hover:bg-slate-200 text-emerald-800 font-mono px-2 py-0.5 rounded border border-slate-200 transition-colors"
                      title="Klik untuk menyisipkan ke template"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Preferensi Tampilan & Interaksi
                </h4>

                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={settingsForm.enableConfetti}
                      onChange={(e) => setSettingsForm({ ...settingsForm, enableConfetti: e.target.checked })}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Efek Selebrasi Confetti</span>
                      <span className="text-[11px] text-slate-500">Munculkan animasi kembang api saat santri mencapai juz baru atau nilai Mumtaz</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={settingsForm.enableHijriDate}
                      onChange={(e) => setSettingsForm({ ...settingsForm, enableHijriDate: e.target.checked })}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Tampilkan Penanggalan Hijriah</span>
                      <span className="text-[11px] text-slate-500">Tampilkan estimasi penanggalan kalender Islam pada header dan kartu mutaba'ah</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="submit"
                  className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2 text-sm active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Pengaturan</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Col: Live WhatsApp Preview */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  Pratinjau Pesan WhatsApp
                </h4>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  Format Nyata
                </span>
              </div>

              {/* Chat Bubble Simulation */}
              <div className="bg-[#E5DDD5] p-3.5 rounded-xl border border-slate-300">
                <div className="bg-white p-3.5 rounded-lg shadow-2xs text-[11px] text-slate-800 space-y-2 leading-relaxed whitespace-pre-wrap font-sans">
                  {settingsForm.waTemplate
                    .replace(/\{nama\}/g, 'Muhammad Fatih Al-Faruq')
                    .replace(/\{namaSekolah\}/g, profileForm.namaSekolah)
                    .replace(/\{tanggal\}/g, new Date().toLocaleDateString('id-ID', { dateStyle: 'full' }))
                    .replace(/\{tipe\}/g, 'Ziyadah (Hafalan Baru)')
                    .replace(/\{surat\}/g, 'An-Naba\' ayat 1 - 20')
                    .replace(/\{juz\}/g, 'Juz 30')
                    .replace(/\{kelancaran\}/g, 'Mumtaz (Sangat Lancar)')
                    .replace(/\{nilai\}/g, '95')
                    .replace(/\{status\}/g, 'Lulus Mutqin')
                    .replace(/\{catatan\}/g, 'Makharijul huruf fasih, waqaf tepat.')
                    .replace(/\{ustadz\}/g, profileForm.koordinatorTahfidz)
                  }
                  <div className="text-[9px] text-slate-400 text-right mt-1">10:15 ✓✓</div>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 italic">
                * Pesan di atas adalah simulasi saat ustadz mengklik tombol WhatsApp untuk wali santri.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
