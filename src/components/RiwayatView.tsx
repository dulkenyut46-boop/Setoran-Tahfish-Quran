import React, { useState } from 'react';
import { History, Search, Filter, Download, MessageCircle, Trash2, Printer, CheckCircle2, AlertCircle, BookOpen } from 'lucide-react';
import { Santri, SetoranRecord, SetoranType } from '../types';
import { formatSetoranRange, KELANCARAN_CONFIG } from '../data/quranData';
import { exportToCSV, generateWhatsAppMessage } from '../utils/tahfidzHelpers';

interface RiwayatViewProps {
  records: SetoranRecord[];
  santriList: Santri[];
  onDeleteRecord: (id: string) => void;
  onViewSantriCard: (santri: Santri) => void;
  onOpenNewSetoran: () => void;
}

export const RiwayatView: React.FC<RiwayatViewProps> = ({
  records,
  santriList,
  onDeleteRecord,
  onViewSantriCard,
  onOpenNewSetoran,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSantri, setFilterSantri] = useState('all');
  const [filterTipe, setFilterTipe] = useState<'all' | SetoranType>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'lulus' | 'ulang'>('all');
  const [filterJuz, setFilterJuz] = useState('all');

  const santriMap = new Map(santriList.map(s => [s.id, s]));

  // Filter records
  const filteredRecords = records.filter(r => {
    const s = santriMap.get(r.santriId);
    const matchSantri = filterSantri === 'all' || r.santriId === filterSantri;
    const matchTipe = filterTipe === 'all' || r.tipe === filterTipe;
    const matchStatus = filterStatus === 'all' || r.status === filterStatus;
    const matchJuz = filterJuz === 'all' || r.juz === Number(filterJuz);
    
    const rangeText = formatSetoranRange(r.surahMulai, r.ayatMulai, r.surahSelesai, r.ayatSelesai).toLowerCase();
    const searchMatch =
      !searchTerm ||
      (s?.nama.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (s?.kelas.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      rangeText.includes(searchTerm.toLowerCase()) ||
      r.catatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.ustadzPenguji.toLowerCase().includes(searchTerm.toLowerCase());

    return matchSantri && matchTipe && matchStatus && matchJuz && searchMatch;
  }).sort((a, b) => 
    new Date(b.tanggal + 'T' + (b.jam || '00:00')).getTime() - new Date(a.tanggal + 'T' + (a.jam || '00:00')).getTime()
  );

  const handleSendWA = (record: SetoranRecord) => {
    const s = santriMap.get(record.santriId);
    if (!s) return;
    const text = generateWhatsAppMessage(s, record, records);
    const phone = s.noHpWali.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleExport = () => {
    exportToCSV(filteredRecords, santriList);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-700" />
            Riwayat Setoran & Evaluasi Hafalan
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Log lengkap setoran hafalan baru (ziyadah), pengulangan (muroja'ah), dan ujian tasmi'
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-300 transition-colors shadow-2xs"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Ekspor CSV</span>
          </button>
          <button
            onClick={onOpenNewSetoran}
            className="flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            <span>+ Catat Setoran</span>
          </button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari santri, surat, catatan, atau ustadz..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Filter Santri */}
          <div>
            <select
              value={filterSantri}
              onChange={e => setFilterSantri(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="all">Semua Santri</option>
              {santriList.map(s => (
                <option key={s.id} value={s.id}>
                  {s.nama} ({s.kelas})
                </option>
              ))}
            </select>
          </div>

          {/* Filter Tipe */}
          <div>
            <select
              value={filterTipe}
              onChange={e => setFilterTipe(e.target.value as 'all' | SetoranType)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="all">Semua Jenis Setoran</option>
              <option value="ziyadah">Ziyadah (Hafalan Baru)</option>
              <option value="murojaah">Muroja'ah (Mengulang)</option>
              <option value="tasmi">Tasmi' (Ujian Juz)</option>
            </select>
          </div>

          {/* Filter Juz */}
          <div>
            <select
              value={filterJuz}
              onChange={e => setFilterJuz(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="all">Semua Juz (1-30)</option>
              {Array.from({ length: 30 }, (_, i) => i + 1).map(j => (
                <option key={j} value={j}>Juz {j}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick status tabs */}
        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Status:</span>
            <div className="flex gap-1">
              {(['all', 'lulus', 'ulang'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-colors capitalize ${
                    filterStatus === st
                      ? 'bg-emerald-800 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st === 'all' ? 'Semua' : st === 'lulus' ? 'Lulus (Mutqin)' : 'Perlu Ulang'}
                </button>
              ))}
            </div>
          </div>

          <div className="text-slate-500">
            Menampilkan <strong className="text-slate-800">{filteredRecords.length}</strong> dari {records.length} setoran
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Tanggal / Waktu</th>
                <th className="py-3 px-4">Santri & Kelas</th>
                <th className="py-3 px-3">Jenis</th>
                <th className="py-3 px-4">Surat & Ayat</th>
                <th className="py-3 px-2 text-center">Juz</th>
                <th className="py-3 px-2 text-center">Nilai</th>
                <th className="py-3 px-3">Kelancaran</th>
                <th className="py-3 px-4">Catatan & Musyrif</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <BookOpen className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    Tidak ada data setoran yang sesuai filter.
                  </td>
                </tr>
              ) : (
                filteredRecords.map(r => {
                  const s = santriMap.get(r.santriId);
                  const rangeStr = formatSetoranRange(r.surahMulai, r.ayatMulai, r.surahSelesai, r.ayatSelesai);
                  const gradeConf = KELANCARAN_CONFIG[r.kelancaran];

                  return (
                    <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-semibold text-slate-900 block">{r.tanggal}</span>
                        <span className="text-[10px] text-slate-400">{r.jam} WIB</span>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          onClick={() => s && onViewSantriCard(s)}
                          className="font-bold text-slate-900 hover:text-emerald-800 cursor-pointer block underline-offset-2 hover:underline"
                        >
                          {s?.nama || 'Santri'}
                        </span>
                        <span className="text-[11px] text-slate-400">{s?.kelas}</span>
                      </td>

                      <td className="py-3 px-3 uppercase text-[10px] font-bold">
                        <span className={`px-2 py-0.5 rounded-full inline-block ${
                          r.tipe === 'ziyadah' ? 'bg-emerald-100 text-emerald-800' :
                          r.tipe === 'tasmi' ? 'bg-purple-100 text-purple-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {r.tipe}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {rangeStr}
                      </td>

                      <td className="py-3 px-2 text-center font-bold text-emerald-800">
                        Juz {r.juz}
                      </td>

                      <td className="py-3 px-2 text-center">
                        <span className={`font-extrabold text-sm ${
                          r.nilaiAngka >= 90 ? 'text-emerald-800' :
                          r.nilaiAngka >= 75 ? 'text-amber-800' : 'text-rose-700'
                        }`}>
                          {r.nilaiAngka}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          {r.status === 'lulus' ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          ) : (
                            <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          )}
                          <div>
                            <span className={`font-semibold ${gradeConf?.color}`}>
                              {gradeConf?.label}
                            </span>
                            <span className="block text-[10px] text-slate-400 capitalize">
                              {r.status === 'lulus' ? 'Lulus' : 'Ulang (Tikror)'}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 max-w-xs">
                        <p className="line-clamp-2 text-slate-700">{r.catatan || '-'}</p>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                          <span>Musyrif: {r.ustadzPenguji}</span>
                          {r.tajwidNotes && (
                            <>
                              <span>•</span>
                              <span className="text-emerald-700 italic line-clamp-1">
                                {r.tajwidNotes}
                              </span>
                            </>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleSendWA(r)}
                            title="Kirim Pesan WhatsApp ke Wali Santri"
                            className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => s && onViewSantriCard(s)}
                            title="Buka Kartu Santri"
                            className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Hapus catatan setoran ini?')) {
                                onDeleteRecord(r.id);
                              }
                            }}
                            title="Hapus Catatan"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
