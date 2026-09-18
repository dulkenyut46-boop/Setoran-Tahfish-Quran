import React from 'react';
import { BookOpen, Users, CheckCircle2, TrendingUp, Award, Clock, ArrowRight, MessageCircle, Sparkles, Star, Camera, ImageIcon } from 'lucide-react';
import { Santri, SetoranRecord } from '../types';
import { getSantriStats, generateWhatsAppMessage } from '../utils/tahfidzHelpers';
import { formatSetoranRange, KELANCARAN_CONFIG } from '../data/quranData';

interface DashboardViewProps {
  santriList: Santri[];
  records: SetoranRecord[];
  onOpenNewSetoran: (santriId?: string) => void;
  onViewSantriCard: (santri: Santri) => void;
  onNavigateTab: (tab: 'santri' | 'riwayat' | 'petaJuz') => void;
  logoUrl?: string;
  onOpenLogoModal?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  santriList,
  records,
  onOpenNewSetoran,
  onViewSantriCard,
  onNavigateTab,
  logoUrl = '/logo.png',
  onOpenLogoModal,
}) => {
  const totalSantri = santriList.length;
  const totalSetoran = records.length;
  
  // Today's records
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayRecords = records.filter(r => r.tanggal === todayStr);

  // Average score
  const avgScore = totalSetoran > 0
    ? Math.round(records.reduce((acc, r) => acc + r.nilaiAngka, 0) / totalSetoran)
    : 0;

  // Top students by estimated progress
  const santriWithStats = santriList.map(s => ({
    santri: s,
    stats: getSantriStats(s, records),
  })).sort((a, b) => b.stats.juzCompletedEstimate - a.stats.juzCompletedEstimate || b.stats.totalSetoran - a.stats.totalSetoran);

  // Latest records
  const latestRecords = [...records].sort((a, b) => 
    new Date(b.tanggal + 'T' + (b.jam || '00:00')).getTime() - new Date(a.tanggal + 'T' + (a.jam || '00:00')).getTime()
  ).slice(0, 6);

  const santriMap = new Map(santriList.map(s => [s.id, s]));

  const handleSendWA = (record: SetoranRecord) => {
    const s = santriMap.get(record.santriId);
    if (!s) return;
    const text = generateWhatsAppMessage(s, record, records);
    const phone = s.noHpWali.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome & Spiritual Header with Institution Logo */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        {/* Background Islamic Geometric Pattern Accent */}
        <div className="absolute -right-8 -bottom-10 opacity-10 text-9xl font-quran select-none pointer-events-none">
          ۝
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 text-center sm:text-left">
            {/* Institution Logo Card */}
            <div className="relative group shrink-0" id="dashboard-logo-container">
              <div 
                onClick={onOpenLogoModal}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white p-2.5 shadow-lg ring-4 ring-emerald-700/50 flex items-center justify-center cursor-pointer overflow-hidden transition-all group-hover:scale-105 group-hover:ring-amber-400"
                title="Klik untuk melihat atau mengubah logo"
              >
                <img 
                  src={logoUrl} 
                  alt="Logo Lembaga MTs Sirojut Tholibin" 
                  className="w-full h-full object-contain filter drop-shadow-xs"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              {onOpenLogoModal && (
                <button
                  type="button"
                  onClick={onOpenLogoModal}
                  title="Ubah Logo Dashboard"
                  className="absolute -bottom-1.5 -right-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 p-1.5 rounded-full shadow-md transition-transform active:scale-90 group-hover:scale-110"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Header Text & Badge */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-500/40 text-emerald-200 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Program Tahfidzul Qur'an • MTs Sirojut Tholibin</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Pencatatan Hafalan Al-Qur'an Santri
              </h2>

              <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed max-w-2xl">
                Memonitor kelancaran ziyadah dan muroja'ah santri MTs Sirojut Tholibin dengan tertib, terarah, dan transparan bagi wali santri.
              </p>
            </div>
          </div>

          {/* Quick CTA Buttons */}
          <div className="flex flex-wrap sm:flex-col gap-2.5 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => onOpenNewSetoran()}
              className="flex-1 sm:flex-none bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95 text-sm flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>+ Catat Setoran Baru</span>
            </button>
            {onOpenLogoModal && (
              <button
                onClick={onOpenLogoModal}
                className="flex-1 sm:flex-none bg-emerald-800/80 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-xl border border-emerald-600/50 transition-all text-xs flex items-center justify-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5 text-amber-300" />
                <span>Ubah Logo Dashboard</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Santri */}
        <div 
          onClick={() => onNavigateTab('santri')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Santri Aktif</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-700 group-hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalSantri}</div>
          <p className="text-xs text-slate-500 mt-1">Santri bimbingan tahfidz</p>
        </div>

        {/* Total Setoran */}
        <div 
          onClick={() => onNavigateTab('riwayat')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Setoran</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-700 group-hover:text-white transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalSetoran}</div>
          <p className="text-xs text-slate-500 mt-1">Ziyadah & muroja'ah tercatat</p>
        </div>

        {/* Setoran Hari Ini */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Setoran Hari Ini</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{todayRecords.length}</div>
          <p className="text-xs text-slate-500 mt-1">
            {todayRecords.length > 0 ? 'Santri setor hari ini' : 'Belum ada setoran hari ini'}
          </p>
        </div>

        {/* Rata-Rata Nilai */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Rata-rata Nilai</span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{avgScore} <span className="text-sm font-normal text-slate-400">/ 100</span></div>
          <p className="text-xs text-slate-500 mt-1">Taraf kelancaran & fashohah</p>
        </div>
      </div>

      {/* Main Content Split: Leaderboard & Latest Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Feed Setoran Terbaru */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-700" />
                Aktivitas Setoran Terbaru
              </h3>
              <p className="text-xs text-slate-500">Riwayat hafalan yang baru disimak oleh musyrif</p>
            </div>
            <button
              onClick={() => onNavigateTab('riwayat')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 transition-colors"
            >
              <span>Semua Riwayat</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {latestRecords.length === 0 ? (
              <div className="py-10 text-center text-slate-400">
                <BookOpen className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p>Belum ada catatan setoran. Mulai dengan mencatat setoran santri!</p>
              </div>
            ) : (
              latestRecords.map(rec => {
                const s = santriMap.get(rec.santriId);
                const range = formatSetoranRange(rec.surahMulai, rec.ayatMulai, rec.surahSelesai, rec.ayatSelesai);
                const gradeConf = KELANCARAN_CONFIG[rec.kelancaran];

                return (
                  <div
                    key={rec.id}
                    className="p-3.5 sm:p-4 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-900 font-bold flex items-center justify-center text-sm shrink-0 border border-emerald-200">
                        {s?.nama.charAt(0) || 'S'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span 
                            onClick={() => s && onViewSantriCard(s)}
                            className="font-bold text-sm text-slate-900 hover:text-emerald-800 cursor-pointer underline-offset-2 hover:underline"
                          >
                            {s?.nama || 'Santri'}
                          </span>
                          <span className="text-xs text-slate-500">({s?.kelas})</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            rec.tipe === 'ziyadah' ? 'bg-emerald-100 text-emerald-800' :
                            rec.tipe === 'tasmi' ? 'bg-purple-100 text-purple-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {rec.tipe}
                          </span>
                          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                            Juz {rec.juz}
                          </span>
                        </div>

                        <p className="text-xs font-semibold text-slate-700 mt-1">
                          📖 {range}
                        </p>

                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                          <span>Nilai: <strong className="text-slate-900">{rec.nilaiAngka}</strong> ({gradeConf?.label})</span>
                          <span>•</span>
                          <span>Oleh: {rec.ustadzPenguji}</span>
                          <span>•</span>
                          <span>{rec.tanggal} {rec.jam}</span>
                        </div>

                        {rec.catatan && (
                          <p className="text-xs text-slate-600 italic bg-white p-2 rounded-md border border-slate-200/80 mt-2">
                            "{rec.catatan}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Quick WhatsApp Share Button */}
                    <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                      <button
                        onClick={() => handleSendWA(rec)}
                        title="Kirim pemberitahuan setoran ini ke WhatsApp Wali"
                        className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Kirim WA</span>
                      </button>
                      <button
                        onClick={() => s && onViewSantriCard(s)}
                        className="text-xs text-slate-500 hover:text-emerald-800 transition-colors"
                      >
                        Kartu Santri
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right 1 Col: Top Santri & Doa */}
        <div className="space-y-6">
          {/* Santri Berprogres Terdepan */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                Capaian Hafalan Terdepan
              </h3>
              <button
                onClick={() => onNavigateTab('santri')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-900"
              >
                Semua
              </button>
            </div>

            <div className="space-y-3">
              {santriWithStats.slice(0, 5).map(({ santri: s, stats }, idx) => (
                <div
                  key={s.id}
                  onClick={() => onViewSantriCard(s)}
                  className="p-3 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/40 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                        idx === 0 ? 'bg-amber-400 text-slate-950' :
                        idx === 1 ? 'bg-slate-300 text-slate-800' :
                        idx === 2 ? 'bg-amber-700 text-white' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {idx + 1}
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{s.nama}</h4>
                        <span className="text-[11px] text-slate-500">{s.kelas}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-extrabold text-emerald-800 block">
                        {stats.juzCompletedEstimate} Juz
                      </span>
                      <span className="text-[10px] text-slate-400">Target: {s.targetJuz} Juz</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div 
                      className="bg-emerald-600 h-full rounded-full"
                      style={{ width: `${stats.progressPercent}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Doa Penghafal Al-Qur'an Card */}
          <div className="bg-emerald-950 text-emerald-100 p-5 rounded-2xl border border-emerald-900 space-y-3">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
              <Sparkles className="w-4 h-4" />
              <span>Doa Memohon Hafalan Al-Qur'an</span>
            </div>
            <p className="font-quran text-right text-base sm:text-lg text-amber-100 leading-loose">
              اللَّهُمَّ ارْحَمْنَا بِالْقُرْآنِ وَاجْعَلْهُ لَنَا إِمَامًا وَنُورًا وَهُدًى وَرَحْمَةً
            </p>
            <p className="text-[11px] text-emerald-300/80 italic leading-relaxed border-t border-emerald-900/80 pt-2">
              "Ya Allah, rahmatilah kami dengan Al-Qur'an. Jadikanlah ia bagi kami sebagai pemimpin, cahaya, petunjuk, dan rahmat."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
