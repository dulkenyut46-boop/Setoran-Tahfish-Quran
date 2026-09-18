import React from 'react';
import { X, Printer, MessageCircle, BookOpen, CheckCircle, Award, Calendar, User } from 'lucide-react';
import { Santri, SetoranRecord } from '../types';
import { getSantriStats, generateWhatsAppMessage } from '../utils/tahfidzHelpers';
import { formatSetoranRange, KELANCARAN_CONFIG } from '../data/quranData';

interface KartuMutabaahModalProps {
  isOpen: boolean;
  onClose: () => void;
  santri: Santri | null;
  records: SetoranRecord[];
  onOpenNewSetoranForSantri?: (santriId: string) => void;
  logoUrl?: string;
}

export const KartuMutabaahModal: React.FC<KartuMutabaahModalProps> = ({
  isOpen,
  onClose,
  santri,
  records,
  onOpenNewSetoranForSantri,
  logoUrl = '/logo.png',
}) => {
  if (!isOpen || !santri) return null;

  const stats = getSantriStats(santri, records);
  const santriRecords = stats.records;

  // Track which Juz have passed
  const passedJuz = new Set(
    santriRecords.filter(r => r.status === 'lulus').map(r => r.juz)
  );

  const handlePrint = () => {
    window.print();
  };

  const handleSendWhatsApp = () => {
    const text = generateWhatsAppMessage(santri, undefined, records);
    const phone = santri.noHpWali.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[94vh] flex flex-col overflow-hidden border border-emerald-100 print:max-w-none print:max-h-none print:shadow-none print:border-none print:rounded-none">
        {/* Modal Action Bar (Hidden on print) */}
        <div className="no-print bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white px-6 py-3.5 flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-300" />
            <h2 className="text-base font-bold">Kartu Mutaba'ah & Raport Tahfidz</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSendWhatsApp}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-xs"
              title="Kirim rekap ke nomor WhatsApp Wali Santri"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Wali</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Raport</span>
            </button>
            <button
              onClick={onClose}
              className="text-emerald-300 hover:text-white p-1 rounded-lg hover:bg-emerald-800/60 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 bg-white print:p-0 print:space-y-4">
          {/* Official Kop Madrasah Header */}
          <div className="border-b-2 border-emerald-900 pb-4 text-center relative">
            <div className="flex items-center justify-between">
              <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 flex items-center justify-center p-1.5 mx-auto sm:mx-0 shadow-xs print:w-14 print:h-14 print:border-none">
                <img 
                  src={logoUrl} 
                  alt="Logo Madrasah" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="flex-1 px-4 text-center">
                <h1 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-emerald-950">
                  MADRASAH TSANAWIYAH SIROJUT THOLIBIN
                </h1>
                <p className="text-xs font-semibold text-emerald-800 tracking-wide">
                  LEMBAGA PENDIDIKAN & PENGEMBANGAN TAHFIDZUL QUR'AN
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Jl. Pesantren No. 07, Sirojut Tholibin • Email: mtssirojuttholibin07@gmail.com
                </p>
                <div className="font-quran text-base text-emerald-900 font-bold mt-1">
                  كِتَابُ مُتَابَعَةِ حِفْظِ الْقُرْآنِ الْكَرِيمِ
                </div>
              </div>
              <div className="w-16 h-16 hidden sm:flex items-center justify-center">
                <div className="w-14 h-14 rounded-full border-2 border-emerald-700/40 flex items-center justify-center text-xs font-bold text-emerald-800">
                  MUTQIN
                </div>
              </div>
            </div>
          </div>

          {/* Title of Document */}
          <div className="text-center">
            <h2 className="text-base sm:text-lg font-extrabold uppercase text-slate-900 tracking-tight">
              KARTU KENDALI & MUTABA'AH SETORAN HAFALAN
            </h2>
            <p className="text-xs text-slate-500">Tahun Ajaran 2024 / 2025</p>
          </div>

          {/* Biodata Santri Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div className="space-y-1.5">
              <div className="flex">
                <span className="w-32 font-semibold text-slate-600">Nama Lengkap</span>
                <span className="font-bold text-slate-900">: {santri.nama}</span>
              </div>
              <div className="flex">
                <span className="w-32 font-semibold text-slate-600">Nomor Induk / NISN</span>
                <span className="text-slate-800">: {santri.nisn}</span>
              </div>
              <div className="flex">
                <span className="w-32 font-semibold text-slate-600">Kelas / Kamar</span>
                <span className="text-slate-800">: {santri.kelas}</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex">
                <span className="w-36 font-semibold text-slate-600">Target Hafalan</span>
                <span className="font-bold text-emerald-800">: {santri.targetJuz} Juz</span>
              </div>
              <div className="flex">
                <span className="w-36 font-semibold text-slate-600">Ustadz Pembimbing</span>
                <span className="text-slate-800">: {santri.ustadzPembimbing}</span>
              </div>
              <div className="flex">
                <span className="w-36 font-semibold text-slate-600">Wali Santri / HP</span>
                <span className="text-slate-800">: {santri.namaWali || 'Wali Santri'} ({santri.noHpWali})</span>
              </div>
            </div>
          </div>

          {/* 30 Juz Matrix Map */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-700" />
                Matriks Capaian 30 Juz Al-Qur'an
              </h3>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1 text-slate-600">
                  <span className="w-3 h-3 rounded bg-emerald-600 inline-block"></span> Mutqin / Lulus
                </span>
                <span className="flex items-center gap-1 text-slate-600">
                  <span className="w-3 h-3 rounded bg-slate-100 border border-slate-300 inline-block"></span> Belum Disetor
                </span>
              </div>
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-10 gap-1.5 p-3 bg-slate-50/80 rounded-xl border border-slate-200">
              {Array.from({ length: 30 }, (_, i) => i + 1).map(juzNum => {
                const isPassed = passedJuz.has(juzNum);
                return (
                  <div
                    key={juzNum}
                    className={`h-9 rounded-lg flex flex-col items-center justify-center text-[10px] font-bold border transition-all ${
                      isPassed
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    <span>Juz {juzNum}</span>
                    {isPassed && <span className="text-[8px] opacity-90">✓ Lulus</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Summary Numbers */}
          <div className="grid grid-cols-4 gap-3 text-center">
            <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl">
              <span className="text-[10px] text-emerald-700 uppercase font-bold block">Total Setoran</span>
              <span className="text-lg font-extrabold text-emerald-950">{stats.totalSetoran}x</span>
            </div>
            <div className="bg-teal-50 border border-teal-200 p-2.5 rounded-xl">
              <span className="text-[10px] text-teal-700 uppercase font-bold block">Ziyadah Baru</span>
              <span className="text-lg font-extrabold text-teal-950">{stats.ziyadahCount}x</span>
            </div>
            <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl">
              <span className="text-[10px] text-amber-700 uppercase font-bold block">Muroja'ah</span>
              <span className="text-lg font-extrabold text-amber-950">{stats.murojaahCount}x</span>
            </div>
            <div className="bg-sky-50 border border-sky-200 p-2.5 rounded-xl">
              <span className="text-[10px] text-sky-700 uppercase font-bold block">Rata-rata Nilai</span>
              <span className="text-lg font-extrabold text-sky-950">{stats.avgScore}</span>
            </div>
          </div>

          {/* Table of Records */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-700" />
                Catatan Rincian Setoran Santri
              </h3>
              {onOpenNewSetoranForSantri && (
                <button
                  onClick={() => onOpenNewSetoranForSantri(santri.id)}
                  className="no-print text-xs text-emerald-700 hover:text-emerald-900 font-semibold underline"
                >
                  + Tambah Setoran Santri Ini
                </button>
              )}
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Tanggal / Jam</th>
                    <th className="py-2.5 px-3">Jenis</th>
                    <th className="py-2.5 px-3">Surat & Ayat</th>
                    <th className="py-2.5 px-2 text-center">Juz</th>
                    <th className="py-2.5 px-2 text-center">Nilai</th>
                    <th className="py-2.5 px-3">Kelancaran</th>
                    <th className="py-2.5 px-3">Catatan Ustadz</th>
                    <th className="py-2.5 px-3">Penguji</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700">
                  {santriRecords.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-6 text-center text-slate-400">
                        Belum ada data setoran untuk santri ini.
                      </td>
                    </tr>
                  ) : (
                    santriRecords.map(r => {
                      const rangeStr = formatSetoranRange(r.surahMulai, r.ayatMulai, r.surahSelesai, r.ayatSelesai);
                      const gradeConf = KELANCARAN_CONFIG[r.kelancaran];
                      return (
                        <tr key={r.id} className="hover:bg-slate-50">
                          <td className="py-2 px-3 whitespace-nowrap font-medium">
                            {r.tanggal}
                            <span className="block text-[10px] text-slate-400">{r.jam}</span>
                          </td>
                          <td className="py-2 px-3 uppercase text-[10px] font-bold">
                            <span className={`px-1.5 py-0.5 rounded ${
                              r.tipe === 'ziyadah' ? 'bg-emerald-100 text-emerald-800' :
                              r.tipe === 'tasmi' ? 'bg-purple-100 text-purple-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {r.tipe}
                            </span>
                          </td>
                          <td className="py-2 px-3 font-semibold text-slate-900">
                            {rangeStr}
                          </td>
                          <td className="py-2 px-2 text-center font-bold text-emerald-800">
                            Juz {r.juz}
                          </td>
                          <td className="py-2 px-2 text-center font-extrabold text-slate-900">
                            {r.nilaiAngka}
                          </td>
                          <td className="py-2 px-3">
                            <span className={`text-[11px] font-semibold ${gradeConf?.color}`}>
                              {gradeConf?.label || r.kelancaran}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-slate-600 max-w-xs">
                            <p className="line-clamp-2">{r.catatan || '-'}</p>
                            {r.tajwidNotes && (
                              <p className="text-[10px] text-emerald-700 italic">Tajwid: {r.tajwidNotes}</p>
                            )}
                          </td>
                          <td className="py-2 px-3 text-slate-600 whitespace-nowrap text-[11px]">
                            {r.ustadzPenguji}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Official Signatures Section (Tanda Tangan) */}
          <div className="pt-6 grid grid-cols-3 gap-4 text-center text-xs text-slate-800 print:pt-4">
            <div>
              <p className="text-slate-500 mb-12">Mengetahui,<br />Orang Tua / Wali Santri</p>
              <div className="border-b border-slate-400 w-32 mx-auto"></div>
              <p className="font-semibold mt-1">{santri.namaWali || '(................................)'}</p>
            </div>
            <div>
              <p className="text-slate-500 mb-12">Disimak Oleh,<br />Ustadz Pembimbing</p>
              <div className="border-b border-slate-400 w-36 mx-auto"></div>
              <p className="font-semibold mt-1">{santri.ustadzPembimbing}</p>
            </div>
            <div>
              <p className="text-slate-500 mb-12">Kepala Madrasah /<br />Koordinator Tahfidz</p>
              <div className="border-b border-slate-400 w-36 mx-auto"></div>
              <p className="font-semibold mt-1">KH. M. Sirojuddin, M.Pd</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
