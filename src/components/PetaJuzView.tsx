import React, { useState } from 'react';
import { Layers, BookOpen, Users, CheckCircle, ArrowRight, Award } from 'lucide-react';
import { JuzMeta, Santri, SetoranRecord } from '../types';
import { JUZ_LIST, ALL_SURAHS, getSurahByNumber } from '../data/quranData';

interface PetaJuzViewProps {
  records: SetoranRecord[];
  santriList: Santri[];
  onOpenNewSetoran: () => void;
  onViewSantriCard: (santri: Santri) => void;
}

export const PetaJuzView: React.FC<PetaJuzViewProps> = ({
  records,
  santriList,
  onOpenNewSetoran,
  onViewSantriCard,
}) => {
  const [selectedJuz, setSelectedJuz] = useState<number>(30);

  const santriMap = new Map(santriList.map(s => [s.id, s]));

  // Find info for selected juz
  const juzMeta = JUZ_LIST.find(j => j.juzNumber === selectedJuz) || JUZ_LIST[29];

  // Surahs in selected juz
  const surahsInJuz = ALL_SURAHS.filter(s => 
    (s.juzStart <= selectedJuz && s.juzEnd >= selectedJuz) ||
    (s.number >= juzMeta.startSurah && s.number <= juzMeta.endSurah)
  );

  // Setoran in this juz
  const juzRecords = records.filter(r => r.juz === selectedJuz);

  // Santri who have touched this juz
  const santriInJuzIds = Array.from(new Set(juzRecords.map(r => r.santriId)));
  const santriInJuz = santriInJuzIds.map(id => santriMap.get(id)).filter(Boolean) as Santri[];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-700" />
              Peta 30 Juz Al-Qur'anul Karim
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Struktur pembagian 30 juz, rincian surat, serta pemetaan santri yang sedang atau telah menyelesaikan hafalan
            </p>
          </div>
          <button
            onClick={onOpenNewSetoran}
            className="bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <BookOpen className="w-4 h-4" />
            <span>+ Setoran di Juz Ini</span>
          </button>
        </div>
      </div>

      {/* 30 Juz Grid Selector */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700 uppercase tracking-wider">
            Pilih Juz (1 - 30)
          </span>
          <span className="text-slate-400">
            Klik nomor juz untuk melihat rincian surat dan capaian santri
          </span>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-10 lg:grid-cols-15 gap-2">
          {JUZ_LIST.map(j => {
            const countSetoran = records.filter(r => r.juz === j.juzNumber).length;
            const isSelected = selectedJuz === j.juzNumber;

            return (
              <button
                key={j.juzNumber}
                onClick={() => setSelectedJuz(j.juzNumber)}
                className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${
                  isSelected
                    ? 'bg-emerald-800 text-white border-emerald-900 shadow-md ring-2 ring-emerald-500/50 scale-105 z-10'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'
                }`}
              >
                <span className="text-xs font-bold">Juz {j.juzNumber}</span>
                <span className={`text-[9px] font-quran mt-0.5 ${isSelected ? 'text-amber-300' : 'text-emerald-700'}`}>
                  {j.nameArabic}
                </span>
                {countSetoran > 0 && (
                  <span className={`text-[8px] mt-1 px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-emerald-900 text-emerald-200' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {countSetoran} setoran
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Juz Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Surahs inside this Juz */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-xs font-extrabold rounded-lg">
                  Juz {juzMeta.juzNumber}
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  Surat-surat di Juz {juzMeta.juzNumber}
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Dimulai dari QS. {getSurahByNumber(juzMeta.startSurah)?.name} ayat {juzMeta.startAyat} s.d QS. {getSurahByNumber(juzMeta.endSurah)?.name} ayat {juzMeta.endAyat}
              </p>
            </div>
            <div className="font-quran text-xl text-emerald-900 font-bold">
              {juzMeta.nameArabic}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
            {surahsInJuz.map(surah => (
              <div
                key={surah.number}
                className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white font-bold text-xs flex items-center justify-center">
                    {surah.number}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{surah.name}</h4>
                    <span className="text-[10px] text-slate-500">
                      {surah.versesCount} ayat • {surah.place}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-quran text-base text-emerald-950 block font-bold">
                    {surah.arabic}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Santri Progress on this Juz */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-700" />
              Santri di Juz {selectedJuz}
            </h3>
            <span className="text-xs text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
              {santriInJuz.length} Santri
            </span>
          </div>

          {santriInJuz.length === 0 ? (
            <div className="py-8 text-center text-slate-400">
              <BookOpen className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-xs">Belum ada riwayat setoran di Juz {selectedJuz}.</p>
              <button
                onClick={onOpenNewSetoran}
                className="mt-3 text-xs text-emerald-700 hover:text-emerald-900 font-bold underline"
              >
                + Input setoran pertama di juz ini
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {santriInJuz.map(s => {
                const sRecords = juzRecords.filter(r => r.santriId === s.id);
                const hasPassed = sRecords.some(r => r.status === 'lulus');

                return (
                  <div
                    key={s.id}
                    onClick={() => onViewSantriCard(s)}
                    className="p-3 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/40 transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{s.nama}</h4>
                      <span className="text-[10px] text-slate-500">{s.kelas} • {sRecords.length} setoran di juz ini</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {hasPassed && (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                          <CheckCircle className="w-3 h-3" />
                          Mutqin
                        </span>
                      )}
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
