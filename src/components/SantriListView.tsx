import React, { useState } from 'react';
import { Users, UserPlus, Search, BookOpen, Printer, MessageCircle, Edit3, Trash2, Award, ChevronRight, Filter, Upload, FileSpreadsheet, Download } from 'lucide-react';
import { Santri, SetoranRecord } from '../types';
import { getSantriStats, generateWhatsAppMessage } from '../utils/tahfidzHelpers';
import { formatSetoranRange } from '../data/quranData';
import { generateExcelTemplate } from '../utils/excelHelpers';

interface SantriListViewProps {
  santriList: Santri[];
  records: SetoranRecord[];
  onAddSantri: (santri: Omit<Santri, 'id' | 'createdAt'>) => void;
  onUpdateSantri: (santri: Santri) => void;
  onDeleteSantri: (id: string) => void;
  onOpenNewSetoran: (santriId: string) => void;
  onViewSantriCard: (santri: Santri) => void;
  onOpenImportModal?: () => void;
  onOpenDeleteAllModal?: () => void;
  onOpenExportModal?: () => void;
}

export const SantriListView: React.FC<SantriListViewProps> = ({
  santriList,
  records,
  onAddSantri,
  onUpdateSantri,
  onDeleteSantri,
  onOpenNewSetoran,
  onViewSantriCard,
  onOpenImportModal,
  onOpenDeleteAllModal,
  onOpenExportModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSantri, setEditingSantri] = useState<Santri | null>(null);

  // Form states for Add/Edit
  const [formNama, setFormNama] = useState('');
  const [formNisn, setFormNisn] = useState('');
  const [formKelas, setFormKelas] = useState('7A Tahfidz');
  const [formGender, setFormGender] = useState<'L' | 'P'>('L');
  const [formTargetJuz, setFormTargetJuz] = useState<number>(5);
  const [formUstadz, setFormUstadz] = useState('Ustadz Ahmad Fauzi, S.Pd.I');
  const [formNoHpWali, setFormNoHpWali] = useState('628');
  const [formNamaWali, setFormNamaWali] = useState('');
  const [formCatatanKhusus, setFormCatatanKhusus] = useState('');

  // Extract distinct classes
  const classes = Array.from(new Set(santriList.map(s => s.kelas)));

  // Filter santri
  const filteredSantri = santriList.filter(s => {
    const matchClass = selectedClass === 'all' || s.kelas === selectedClass;
    const matchSearch =
      s.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nisn.includes(searchTerm) ||
      s.ustadzPembimbing.toLowerCase().includes(searchTerm.toLowerCase());
    return matchClass && matchSearch;
  });

  const handleOpenAdd = () => {
    setEditingSantri(null);
    setFormNama('');
    setFormNisn(`20240700${santriList.length + 1}`);
    setFormKelas('7A Tahfidz');
    setFormGender('L');
    setFormTargetJuz(5);
    setFormUstadz('Ustadz Ahmad Fauzi, S.Pd.I');
    setFormNoHpWali('628');
    setFormNamaWali('');
    setFormCatatanKhusus('');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (s: Santri) => {
    setEditingSantri(s);
    setFormNama(s.nama);
    setFormNisn(s.nisn);
    setFormKelas(s.kelas);
    setFormGender(s.gender);
    setFormTargetJuz(s.targetJuz);
    setFormUstadz(s.ustadzPembimbing);
    setFormNoHpWali(s.noHpWali);
    setFormNamaWali(s.namaWali || '');
    setFormCatatanKhusus(s.catatanKhusus || '');
    setIsAddModalOpen(true);
  };

  const handleSaveSantri = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNama.trim()) return;

    if (editingSantri) {
      onUpdateSantri({
        ...editingSantri,
        nama: formNama,
        nisn: formNisn,
        kelas: formKelas,
        gender: formGender,
        targetJuz: Number(formTargetJuz),
        ustadzPembimbing: formUstadz,
        noHpWali: formNoHpWali,
        namaWali: formNamaWali,
        catatanKhusus: formCatatanKhusus,
      });
    } else {
      onAddSantri({
        nama: formNama,
        nisn: formNisn,
        kelas: formKelas,
        gender: formGender,
        targetJuz: Number(formTargetJuz),
        ustadzPembimbing: formUstadz,
        noHpWali: formNoHpWali,
        namaWali: formNamaWali,
        catatanKhusus: formCatatanKhusus,
      });
    }

    setIsAddModalOpen(false);
  };

  const handleSendWA = (s: Santri) => {
    const text = generateWhatsAppMessage(s, undefined, records);
    const phone = s.noHpWali.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-700" />
            Data Santri & Mutaba'ah
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola profil santri, target juz, raport tahfidz, dan kontak wali
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Template Excel */}
          <button
            type="button"
            onClick={() => generateExcelTemplate()}
            className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-950 font-semibold px-3 py-2 rounded-xl border border-amber-300 transition-colors text-xs shadow-2xs"
            title="Unduh Format Template Excel (.xlsx) untuk input data santri & setoran"
          >
            <Download className="w-3.5 h-3.5 text-amber-700" />
            <span className="hidden sm:inline">Template Excel</span>
          </button>

          {/* Import Excel */}
          {onOpenImportModal && (
            <button
              type="button"
              onClick={onOpenImportModal}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-3 py-2 rounded-xl border border-slate-300 transition-colors text-xs shadow-2xs"
              title="Impor santri dari Excel (.xlsx) atau CSV"
            >
              <Upload className="w-3.5 h-3.5 text-slate-700" />
              <span>Impor Excel</span>
            </button>
          )}

          {/* Delete All */}
          {onOpenDeleteAllModal && (
            <button
              type="button"
              onClick={onOpenDeleteAllModal}
              className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold px-3 py-2 rounded-xl border border-rose-200 transition-colors text-xs shadow-2xs"
              title="Hapus data santri atau setoran"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden sm:inline">Hapus Semua</span>
            </button>
          )}

          <button
            onClick={handleOpenAdd}
            id="btn-tambah-santri"
            className="bg-emerald-800 hover:bg-emerald-700 text-white font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 text-sm justify-center"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Tambah Santri</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama santri, NISN, atau ustadz pembimbing..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedClass}
            onChange={e => setSelectedClass(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-2xs"
          >
            <option value="all">Semua Kelas ({santriList.length})</option>
            {classes.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Santri Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSantri.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
            <Users className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="font-semibold text-slate-600">Tidak ada data santri yang cocok</p>
            <p className="text-xs text-slate-400 mt-1">Coba ganti kata kunci pencarian atau tambah santri baru.</p>
          </div>
        ) : (
          filteredSantri.map(s => {
            const stats = getSantriStats(s, records);
            const lastRec = stats.lastRecord;
            const lastRange = lastRec
              ? formatSetoranRange(lastRec.surahMulai, lastRec.ayatMulai, lastRec.surahSelesai, lastRec.ayatSelesai)
              : null;

            return (
              <div
                key={s.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                <div className="p-5 space-y-4">
                  {/* Card Header: Avatar & Info */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shadow-inner ${
                        s.gender === 'P'
                          ? 'bg-rose-100 text-rose-900 border border-rose-200'
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                      }`}>
                        {s.nama.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm hover:text-emerald-800 transition-colors">
                          {s.nama}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <span className="font-medium">{s.kelas}</span>
                          <span>•</span>
                          <span>NISN: {s.nisn}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(s)}
                        title="Edit Profil Santri"
                        className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus santri "${s.nama}" beserta seluruh data setorannya?`)) {
                            onDeleteSantri(s.id);
                          }
                        }}
                        title="Hapus Santri"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Progress Indicator */}
                  <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-600 font-medium">Capaian Hafalan:</span>
                      <span className="font-bold text-emerald-800">
                        {stats.juzCompletedEstimate} / {s.targetJuz} Juz
                        <span className="text-slate-400 font-normal ml-1">({stats.progressPercent}%)</span>
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${stats.progressPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Micro stats */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-slate-50 py-1.5 px-2 rounded-lg">
                      <span className="text-[10px] text-slate-400 block">Setoran</span>
                      <strong className="text-slate-800">{stats.totalSetoran}x</strong>
                    </div>
                    <div className="bg-slate-50 py-1.5 px-2 rounded-lg">
                      <span className="text-[10px] text-slate-400 block">Rata-rata</span>
                      <strong className="text-emerald-800">{stats.avgScore}</strong>
                    </div>
                    <div className="bg-slate-50 py-1.5 px-2 rounded-lg">
                      <span className="text-[10px] text-slate-400 block">Ziyadah</span>
                      <strong className="text-slate-800">{stats.ziyadahCount}</strong>
                    </div>
                  </div>

                  {/* Last setoran note */}
                  <div className="text-[11px] text-slate-500 border-t border-slate-100 pt-2">
                    {lastRec ? (
                      <p className="line-clamp-1">
                        <span className="font-semibold text-slate-700">Terakhir:</span> {lastRange} ({lastRec.tanggal})
                      </p>
                    ) : (
                      <p className="italic text-slate-400">Belum ada setoran tercatat.</p>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons Footer */}
                <div className="bg-slate-50/80 px-4 py-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleSendWA(s)}
                      title="Kirim Laporan WA ke Wali Santri"
                      className="p-1.5 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onViewSantriCard(s)}
                      title="Buka & Cetak Kartu Mutaba'ah"
                      className="flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-emerald-800 px-2 py-1 rounded-lg hover:bg-slate-200/60 transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Kartu</span>
                    </button>
                  </div>

                  <button
                    onClick={() => onOpenNewSetoran(s.id)}
                    className="flex items-center gap-1 text-xs font-bold bg-emerald-800 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg shadow-2xs transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>+ Setor</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Add / Edit Santri */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-emerald-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingSantri ? 'Edit Profil Santri' : 'Tambah Santri Baru'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-emerald-200 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSantri} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap Santri</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Muhammad Fatih"
                  value={formNama}
                  onChange={e => setFormNama(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nomor Induk / NISN</label>
                  <input
                    type="text"
                    required
                    value={formNisn}
                    onChange={e => setFormNisn(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kelas / Kamar</label>
                  <input
                    type="text"
                    required
                    value={formKelas}
                    onChange={e => setFormKelas(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jenis Kelamin</label>
                  <select
                    value={formGender}
                    onChange={e => setFormGender(e.target.value as 'L' | 'P')}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="L">Laki-laki (Ikhwan)</option>
                    <option value="P">Perempuan (Akhwat)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Hafalan (Juz)</label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    required
                    value={formTargetJuz}
                    onChange={e => setFormTargetJuz(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ustadz / Ustadzah Pembimbing</label>
                <input
                  type="text"
                  required
                  value={formUstadz}
                  onChange={e => setFormUstadz(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Orang Tua / Wali</label>
                  <input
                    type="text"
                    placeholder="Bpk / Ibu..."
                    value={formNamaWali}
                    onChange={e => setFormNamaWali(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">No. WhatsApp Wali</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 62812345678"
                    value={formNoHpWali}
                    onChange={e => setFormNoHpWali(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Catatan Khusus (Opsional)</label>
                <textarea
                  rows={2}
                  placeholder="Catatan kebiasaan santri, fokus tajwid..."
                  value={formCatatanKhusus}
                  onChange={e => setFormCatatanKhusus(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-xs"
                >
                  Simpan Santri
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
