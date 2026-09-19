import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { SantriListView } from './components/SantriListView';
import { RiwayatView } from './components/RiwayatView';
import { PetaJuzView } from './components/PetaJuzView';
import { PengaturanView } from './components/PengaturanView';
import { FormSetoranModal } from './components/FormSetoranModal';
import { KartuMutabaahModal } from './components/KartuMutabaahModal';
import { ExportModal } from './components/ExportModal';
import { ImportExcelModal } from './components/ImportExcelModal';
import { DeleteAllModal } from './components/DeleteAllModal';
import { ChangeLogoModal } from './components/ChangeLogoModal';
import { Santri, SetoranRecord, SchoolProfile, AppSettings } from './types';
import { INITIAL_SANTRI, INITIAL_SETORAN, DEFAULT_SCHOOL_PROFILE, DEFAULT_APP_SETTINGS } from './data/initialData';

export default function App() {
  // Load state from localStorage with fallbacks
  const [santriList, setSantriList] = useState<Santri[]>(() => {
    try {
      const saved = localStorage.getItem('tahfidz_santri_v1');
      return saved ? JSON.parse(saved) : INITIAL_SANTRI;
    } catch {
      return INITIAL_SANTRI;
    }
  });

  const [records, setRecords] = useState<SetoranRecord[]>(() => {
    try {
      const saved = localStorage.getItem('tahfidz_records_v1');
      return saved ? JSON.parse(saved) : INITIAL_SETORAN;
    } catch {
      return INITIAL_SETORAN;
    }
  });

  // Custom logo state with MTs Sirojut Tholibin default
  const [logoUrl, setLogoUrl] = useState<string>(() => {
    try {
      return localStorage.getItem('tahfidz_custom_logo_v1') || '/logo.png';
    } catch {
      return '/logo.png';
    }
  });

  // School Profile & Settings State
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile>(() => {
    try {
      const saved = localStorage.getItem('tahfidz_school_profile_v1');
      return saved ? JSON.parse(saved) : DEFAULT_SCHOOL_PROFILE;
    } catch {
      return DEFAULT_SCHOOL_PROFILE;
    }
  });

  const [appSettings, setAppSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('tahfidz_app_settings_v1');
      return saved ? JSON.parse(saved) : DEFAULT_APP_SETTINGS;
    } catch {
      return DEFAULT_APP_SETTINGS;
    }
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tahfidz_santri_v1', JSON.stringify(santriList));
    } catch (err) {
      console.error('Failed to save santri to localStorage', err);
    }
  }, [santriList]);

  useEffect(() => {
    try {
      localStorage.setItem('tahfidz_records_v1', JSON.stringify(records));
    } catch (err) {
      console.error('Failed to save records to localStorage', err);
    }
  }, [records]);

  useEffect(() => {
    try {
      localStorage.setItem('tahfidz_school_profile_v1', JSON.stringify(schoolProfile));
    } catch (err) {
      console.error('Failed to save school profile to localStorage', err);
    }
  }, [schoolProfile]);

  useEffect(() => {
    try {
      localStorage.setItem('tahfidz_app_settings_v1', JSON.stringify(appSettings));
    } catch (err) {
      console.error('Failed to save app settings to localStorage', err);
    }
  }, [appSettings]);

  // Tab navigation
  const [activeTab, setActiveTab] = useState<'dashboard' | 'santri' | 'riwayat' | 'petaJuz' | 'pengaturan'>('dashboard');

  // Modals state
  const [isFormSetoranOpen, setIsFormSetoranOpen] = useState(false);
  const [initialSantriIdForSetoran, setInitialSantriIdForSetoran] = useState<string | undefined>(undefined);
  const [selectedSantriForCard, setSelectedSantriForCard] = useState<Santri | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
  const [isChangeLogoModalOpen, setIsChangeLogoModalOpen] = useState(false);

  // Handlers
  const handleOpenNewSetoran = (santriId?: string) => {
    setInitialSantriIdForSetoran(santriId);
    setIsFormSetoranOpen(true);
  };

  const handleSaveSetoran = (recordData: Omit<SetoranRecord, 'id' | 'createdAt'>) => {
    const newRecord: SetoranRecord = {
      ...recordData,
      id: 'rec-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      createdAt: new Date().toISOString(),
    };
    setRecords(prev => [newRecord, ...prev]);
  };

  const handleDeleteRecord = (id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id));
  };

  const handleAddSantri = (santriData: Omit<Santri, 'id' | 'createdAt'>) => {
    const newSantri: Santri = {
      ...santriData,
      id: 's-' + Date.now(),
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setSantriList(prev => [...prev, newSantri]);
  };

  const handleUpdateSantri = (updatedSantri: Santri) => {
    setSantriList(prev => prev.map(s => (s.id === updatedSantri.id ? updatedSantri : s)));
    if (selectedSantriForCard?.id === updatedSantri.id) {
      setSelectedSantriForCard(updatedSantri);
    }
  };

  const handleDeleteSantri = (id: string) => {
    setSantriList(prev => prev.filter(s => s.id !== id));
    setRecords(prev => prev.filter(r => r.santriId !== id));
    if (selectedSantriForCard?.id === id) {
      setSelectedSantriForCard(null);
    }
  };

  const handleRestoreData = (newSantri: Santri[], newRecords: SetoranRecord[]) => {
    setSantriList(newSantri);
    setRecords(newRecords);
  };

  const handleImportSuccess = (
    importedSantri: Santri[], 
    importedRecords: SetoranRecord[], 
    mode: 'merge' | 'overwrite'
  ) => {
    if (mode === 'overwrite') {
      setSantriList(importedSantri);
      setRecords(importedRecords);
    } else {
      // Merge mode: Add unique santri, avoid duplicate NISN/Names
      const existingNisns = new Set(santriList.map(s => s.nisn).filter(Boolean));
      const existingNames = new Set(santriList.map(s => s.nama.trim().toLowerCase()));
      const newSantriToAdd: Santri[] = [];

      importedSantri.forEach(s => {
        const hasNisn = s.nisn && existingNisns.has(s.nisn);
        const hasName = existingNames.has(s.nama.trim().toLowerCase());
        if (!hasNisn && !hasName) {
          newSantriToAdd.push(s);
        }
      });

      const existingRecordIds = new Set(records.map(r => r.id));
      const newRecordsToAdd = importedRecords.filter(r => !existingRecordIds.has(r.id));

      setSantriList(prev => [...prev, ...newSantriToAdd]);
      setRecords(prev => [...newRecordsToAdd, ...prev]);
    }
  };

  const handleDeleteAll = (scope: 'all' | 'records_only') => {
    if (scope === 'all') {
      setSantriList([]);
      setRecords([]);
      setSelectedSantriForCard(null);
    } else {
      setRecords([]);
    }
  };

  const handleResetToSample = () => {
    setSantriList(INITIAL_SANTRI);
    setRecords(INITIAL_SETORAN);
    setSelectedSantriForCard(null);
  };

  const handleSaveLogo = (newLogoUrl: string) => {
    setLogoUrl(newLogoUrl);
    setSchoolProfile(prev => ({ ...prev, logoUrl: newLogoUrl }));
    try {
      localStorage.setItem('tahfidz_custom_logo_v1', newLogoUrl);
    } catch (e) {
      console.error('Failed to save logo to localStorage', e);
    }
  };

  const handleResetLogo = () => {
    setLogoUrl('/logo.png');
    setSchoolProfile(prev => ({ ...prev, logoUrl: '/logo.png' }));
    try {
      localStorage.removeItem('tahfidz_custom_logo_v1');
    } catch (e) {
      console.error('Failed to reset logo', e);
    }
  };

  const handleUpdateSchoolProfile = (newProfile: SchoolProfile) => {
    setSchoolProfile(newProfile);
    if (newProfile.logoUrl && newProfile.logoUrl !== logoUrl) {
      setLogoUrl(newProfile.logoUrl);
      try {
        localStorage.setItem('tahfidz_custom_logo_v1', newProfile.logoUrl);
      } catch (e) {
        console.error('Failed to save logo to localStorage', e);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/60 text-slate-900 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-900">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewSetoran={() => handleOpenNewSetoran()}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenImportModal={() => setIsImportModalOpen(true)}
        onOpenDeleteAllModal={() => setIsDeleteAllModalOpen(true)}
        onOpenLogoModal={() => setIsChangeLogoModalOpen(true)}
        santriCount={santriList.length}
        totalSetoranCount={records.length}
        logoUrl={logoUrl}
        schoolName={schoolProfile.namaSekolah}
      />

      {/* Main Page Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            santriList={santriList}
            records={records}
            onOpenNewSetoran={handleOpenNewSetoran}
            onViewSantriCard={santri => setSelectedSantriForCard(santri)}
            onNavigateTab={tab => setActiveTab(tab)}
            logoUrl={logoUrl}
            schoolProfile={schoolProfile}
            onOpenLogoModal={() => setIsChangeLogoModalOpen(true)}
            onOpenImportModal={() => setIsImportModalOpen(true)}
            onOpenExportModal={() => setIsExportModalOpen(true)}
            onOpenDeleteAllModal={() => setIsDeleteAllModalOpen(true)}
          />
        )}

        {activeTab === 'santri' && (
          <SantriListView
            santriList={santriList}
            records={records}
            onAddSantri={handleAddSantri}
            onUpdateSantri={handleUpdateSantri}
            onDeleteSantri={handleDeleteSantri}
            onOpenNewSetoran={santriId => handleOpenNewSetoran(santriId)}
            onViewSantriCard={santri => setSelectedSantriForCard(santri)}
            onOpenImportModal={() => setIsImportModalOpen(true)}
            onOpenDeleteAllModal={() => setIsDeleteAllModalOpen(true)}
            onOpenExportModal={() => setIsExportModalOpen(true)}
          />
        )}

        {activeTab === 'riwayat' && (
          <RiwayatView
            records={records}
            santriList={santriList}
            onDeleteRecord={handleDeleteRecord}
            onViewSantriCard={santri => setSelectedSantriForCard(santri)}
            onOpenNewSetoran={() => handleOpenNewSetoran()}
            onOpenImportModal={() => setIsImportModalOpen(true)}
            onOpenDeleteAllModal={() => setIsDeleteAllModalOpen(true)}
          />
        )}

        {activeTab === 'petaJuz' && (
          <PetaJuzView
            records={records}
            santriList={santriList}
            onOpenNewSetoran={() => handleOpenNewSetoran()}
            onViewSantriCard={santri => setSelectedSantriForCard(santri)}
          />
        )}

        {activeTab === 'pengaturan' && (
          <PengaturanView
            schoolProfile={schoolProfile}
            onSaveSchoolProfile={handleUpdateSchoolProfile}
            appSettings={appSettings}
            onSaveAppSettings={setAppSettings}
            santriList={santriList}
            records={records}
            onRestoreData={handleRestoreData}
            onOpenDeleteAllModal={() => setIsDeleteAllModalOpen(true)}
            onResetToSample={handleResetToSample}
            onOpenImportModal={() => setIsImportModalOpen(true)}
            onOpenLogoModal={() => setIsChangeLogoModalOpen(true)}
            onResetLogo={handleResetLogo}
            logoUrl={logoUrl}
          />
        )}
      </main>

      {/* Modals */}
      <FormSetoranModal
        isOpen={isFormSetoranOpen}
        onClose={() => {
          setIsFormSetoranOpen(false);
          setInitialSantriIdForSetoran(undefined);
        }}
        onSave={handleSaveSetoran}
        santriList={santriList}
        records={records}
        initialSantriId={initialSantriIdForSetoran}
      />

      <KartuMutabaahModal
        isOpen={!!selectedSantriForCard}
        onClose={() => setSelectedSantriForCard(null)}
        santri={selectedSantriForCard}
        records={records}
        logoUrl={logoUrl}
        schoolProfile={schoolProfile}
        onOpenNewSetoranForSantri={santriId => {
          setSelectedSantriForCard(null);
          handleOpenNewSetoran(santriId);
        }}
      />

      {/* Export & Data Backup Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        santriList={santriList}
        records={records}
        onRestoreData={handleRestoreData}
        onOpenImportModal={() => {
          setIsExportModalOpen(false);
          setIsImportModalOpen(true);
        }}
        onOpenDeleteAllModal={() => {
          setIsExportModalOpen(false);
          setIsDeleteAllModalOpen(true);
        }}
      />

      {/* Excel / CSV Import Modal */}
      <ImportExcelModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        existingSantri={santriList}
        existingRecords={records}
        onImportSuccess={handleImportSuccess}
      />

      {/* Delete All Confirmation Modal */}
      <DeleteAllModal
        isOpen={isDeleteAllModalOpen}
        onClose={() => setIsDeleteAllModalOpen(false)}
        totalSantri={santriList.length}
        totalRecords={records.length}
        onConfirmDelete={handleDeleteAll}
        onResetToSample={handleResetToSample}
      />

      {/* Custom Logo Modal */}
      <ChangeLogoModal
        isOpen={isChangeLogoModalOpen}
        onClose={() => setIsChangeLogoModalOpen(false)}
        currentLogo={logoUrl}
        onSaveLogo={handleSaveLogo}
        onResetLogo={handleResetLogo}
      />

      {/* Footer */}
      <footer className="no-print bg-white border-t border-slate-200/80 py-6 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-semibold text-slate-700">
            Aplikasi Setoran & Mutaba'ah Tahfidz Al-Qur'an • {schoolProfile.namaSekolah}
          </p>
          <p className="text-slate-400">
            "Sebaik-baik kalian adalah orang yang belajar Al-Qur'an dan mengajarkannya." (HR. Bukhari)
          </p>
        </div>
      </footer>
    </div>
  );
}
