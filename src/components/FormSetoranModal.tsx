import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Sparkles, BookOpen, AlertCircle, ArrowRight, UserCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Santri, SetoranRecord, SetoranType, KelancaranGrade } from '../types';
import { ALL_SURAHS, getSurahByNumber, KELANCARAN_CONFIG } from '../data/quranData';

interface FormSetoranModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: Omit<SetoranRecord, 'id' | 'createdAt'>) => void;
  santriList: Santri[];
  records: SetoranRecord[];
  initialSantriId?: string;
}

export const FormSetoranModal: React.FC<FormSetoranModalProps> = ({
  isOpen,
  onClose,
  onSave,
  santriList,
  records,
  initialSantriId,
}) => {
  const [selectedSantriId, setSelectedSantriId] = useState<string>(initialSantriId || (santriList[0]?.id ?? ''));
  const [tanggal, setTanggal] = useState<string>(new Date().toISOString().slice(0, 10));
  const [jam, setJam] = useState<string>(
    new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':')
  );
  const [tipe, setTipe] = useState<SetoranType>('ziyadah');
  
  // Surah & Ayat selection
  const [surahMulai, setSurahMulai] = useState<number>(78);
  const [ayatMulai, setAyatMulai] = useState<number>(1);
  const [surahSelesai, setSurahSelesai] = useState<number>(78);
  const [ayatSelesai, setAyatSelesai] = useState<number>(15);
  const [juz, setJuz] = useState<number>(30);

  // Grading
  const [kelancaran, setKelancaran] = useState<KelancaranGrade>('mumtaz');
  const [nilaiAngka, setNilaiAngka] = useState<number>(92);
  const [status, setStatus] = useState<'lulus' | 'ulang'>('lulus');
  const [tajwidNotes, setTajwidNotes] = useState<string>('Makhraj dan hukum tajwid fasih');
  const [catatan, setCatatan] = useState<string>('Alhamdulillah hafalan lancar dan tartil.');
  const [ustadzPenguji, setUstadzPenguji] = useState<string>('Ustadz Ahmad Fauzi, S.Pd.I');

  // Selected student
  const activeSantri = santriList.find(s => s.id === selectedSantriId);

  // Sync initialSantriId
  useEffect(() => {
    if (initialSantriId) {
      setSelectedSantriId(initialSantriId);
    }
  }, [initialSantriId]);

  // Update juz when surah changes
  useEffect(() => {
    const s = getSurahByNumber(surahMulai);
    if (s) {
      setJuz(s.juzStart);
    }
  }, [surahMulai]);

  // Quick auto-fill from last setoran of this santri
  const handleAutoFillLast = () => {
    if (!selectedSantriId) return;
    const santriRecords = records
      .filter(r => r.santriId === selectedSantriId)
      .sort((a, b) => new Date(b.tanggal + 'T' + (b.jam || '00:00')).getTime() - new Date(a.tanggal + 'T' + (a.jam || '00:00')).getTime());

    const last = santriRecords[0];
    if (last) {
      const currentSurah = getSurahByNumber(last.surahSelesai);
      if (currentSurah) {
        if (last.ayatSelesai < currentSurah.versesCount) {
          // Continue in same surah
          setSurahMulai(last.surahSelesai);
          setAyatMulai(last.ayatSelesai + 1);
          setSurahSelesai(last.surahSelesai);
          setAyatSelesai(Math.min(currentSurah.versesCount, last.ayatSelesai + 15));
        } else {
          // Go to next surah if exists
          const nextSurahNum = last.surahSelesai < 114 ? last.surahSelesai + 1 : 1;
          const nextSurah = getSurahByNumber(nextSurahNum);
          setSurahMulai(nextSurahNum);
          setAyatMulai(1);
          setSurahSelesai(nextSurahNum);
          setAyatSelesai(Math.min(nextSurah?.versesCount || 10, 15));
        }
        setJuz(last.juz);
      }
    }
  };

  const selectedSurahStartMeta = getSurahByNumber(surahMulai);
  const selectedSurahEndMeta = getSurahByNumber(surahSelesai);

  // Quick range helpers
  const handleFullSurah = () => {
    if (!selectedSurahStartMeta) return;
    setSurahSelesai(surahMulai);
    setAyatMulai(1);
    setAyatSelesai(selectedSurahStartMeta.versesCount);
  };

  const handleAddVerses = (count: number) => {
    if (!selectedSurahEndMeta) return;
    const newEnd = Math.min(selectedSurahEndMeta.versesCount, ayatMulai + count - 1);
    setAyatSelesai(Math.max(ayatMulai, newEnd));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSantriId) return;

    onSave({
      santriId: selectedSantriId,
      tanggal,
      jam,
      tipe,
      surahMulai,
      ayatMulai,
      surahSelesai,
      ayatSelesai,
      juz,
      kelancaran,
      nilaiAngka,
      tajwidNotes,
      catatan,
      ustadzPenguji,
      status,
    });

    if (kelancaran === 'mumtaz' && status === 'lulus') {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // silent fail
      }
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-emerald-100">
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-700/80 flex items-center justify-center border border-emerald-600/50">
              <BookOpen className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Catat Setoran Tahfidz</h2>
              <p className="text-xs text-emerald-200/80">Input hafalan ziyadah baru atau muroja'ah santri</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-300 hover:text-white p-1 rounded-lg hover:bg-emerald-700/50 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Santri Selection */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                Pilih Santri / Siswa
              </label>
              {activeSantri && (
                <button
                  type="button"
                  onClick={handleAutoFillLast}
                  className="text-xs font-medium text-emerald-700 hover:text-emerald-900 bg-emerald-100 hover:bg-emerald-200 px-2.5 py-1 rounded-md transition-colors flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  Lanjutan Setoran Terakhir
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <select
                  id="select-santri"
                  value={selectedSantriId}
                  onChange={e => setSelectedSantriId(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                >
                  {santriList.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.nama} ({s.kelas})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-600 bg-white px-3 py-2 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-700">NISN:</span>
                <span>{activeSantri?.nisn || '-'}</span>
                <span className="text-slate-300">•</span>
                <span className="font-semibold text-slate-700">Target:</span>
                <span className="text-emerald-700 font-bold">{activeSantri?.targetJuz} Juz</span>
              </div>
            </div>
          </div>

          {/* Tanggal, Jam & Tipe Setoran */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal</label>
              <input
                type="date"
                value={tanggal}
                onChange={e => setTanggal(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Waktu / Jam</label>
              <input
                type="time"
                value={jam}
                onChange={e => setJam(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Jenis Setoran</label>
              <div className="grid grid-cols-3 gap-1">
                {(['ziyadah', 'murojaah', 'tasmi'] as SetoranType[]).map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTipe(t)}
                    className={`py-1.5 px-2 text-xs font-semibold rounded-lg capitalize transition-colors ${
                      tipe === t
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {t === 'murojaah' ? 'Muroja\'ah' : t === 'tasmi' ? 'Tasmi\'' : 'Ziyadah'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Surah, Ayat, and Juz Selection */}
          <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-700" />
                Rentang Hafalan (Surat & Ayat)
              </label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-slate-500 font-medium">Pilihan Juz:</span>
                <select
                  value={juz}
                  onChange={e => setJuz(Number(e.target.value))}
                  className="bg-white border border-emerald-300 rounded-md px-2 py-0.5 text-xs font-bold text-emerald-900 focus:outline-none"
                >
                  {Array.from({ length: 30 }, (_, i) => i + 1).map(j => (
                    <option key={j} value={j}>Juz {j}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Surah Mulai */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <label className="text-xs font-medium text-slate-500 mb-1 block">Mulai Dari</label>
                <div className="flex items-center gap-2">
                  <select
                    value={surahMulai}
                    onChange={e => {
                      const val = Number(e.target.value);
                      setSurahMulai(val);
                      if (surahSelesai < val) setSurahSelesai(val);
                      setAyatMulai(1);
                    }}
                    className="flex-1 border border-slate-300 rounded-lg px-2 py-1.5 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {ALL_SURAHS.map(s => (
                      <option key={s.number} value={s.number}>
                        {s.number}. {s.name} ({s.arabic})
                      </option>
                    ))}
                  </select>
                  <div className="w-20">
                    <input
                      type="number"
                      min={1}
                      max={selectedSurahStartMeta?.versesCount || 286}
                      value={ayatMulai}
                      onChange={e => setAyatMulai(Math.max(1, Number(e.target.value)))}
                      placeholder="Ayat"
                      className="w-full border border-slate-300 rounded-lg px-2 py-1.5 text-sm text-center font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Surah Selesai */}
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <label className="text-xs font-medium text-slate-500 mb-1 block">Sampai Dengan</label>
                <div className="flex items-center gap-2">
                  <select
                    value={surahSelesai}
                    onChange={e => {
                      const val = Number(e.target.value);
                      setSurahSelesai(val);
                      const s = getSurahByNumber(val);
                      if (s) setAyatSelesai(Math.min(s.versesCount, ayatMulai + 10));
                    }}
                    className="flex-1 border border-slate-300 rounded-lg px-2 py-1.5 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {ALL_SURAHS.filter(s => s.number >= surahMulai).map(s => (
                      <option key={s.number} value={s.number}>
                        {s.number}. {s.name} ({s.arabic})
                      </option>
                    ))}
                  </select>
                  <div className="w-20">
                    <input
                      type="number"
                      min={ayatMulai}
                      max={selectedSurahEndMeta?.versesCount || 286}
                      value={ayatSelesai}
                      onChange={e => setAyatSelesai(Math.max(ayatMulai, Number(e.target.value)))}
                      placeholder="Ayat"
                      className="w-full border border-slate-300 rounded-lg px-2 py-1.5 text-sm text-center font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Helper Range Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-xs text-slate-500">Pintasan:</span>
              <button
                type="button"
                onClick={() => handleAddVerses(5)}
                className="text-xs px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-md transition-colors font-medium"
              >
                +5 Ayat
              </button>
              <button
                type="button"
                onClick={() => handleAddVerses(10)}
                className="text-xs px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-md transition-colors font-medium"
              >
                +10 Ayat
              </button>
              <button
                type="button"
                onClick={() => handleAddVerses(15)}
                className="text-xs px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-md transition-colors font-medium"
              >
                +1 Halaman (~15 ayat)
              </button>
              <button
                type="button"
                onClick={handleFullSurah}
                className="text-xs px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-md transition-colors font-medium"
              >
                1 Surat Penuh ({selectedSurahStartMeta?.name})
              </button>
            </div>
          </div>

          {/* Penilaian Kelancaran & Skor */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
              Penilaian & Fashohah (Kelancaran)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {(Object.keys(KELANCARAN_CONFIG) as KelancaranGrade[]).map(k => {
                const conf = KELANCARAN_CONFIG[k];
                const isSelected = kelancaran === k;
                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => {
                      setKelancaran(k);
                      setNilaiAngka(conf.minScore);
                      if (k === 'rasib') setStatus('ulang');
                      else setStatus('lulus');
                    }}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      isSelected
                        ? `${conf.bg} ring-2 ring-emerald-600 shadow-sm font-semibold`
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className={`text-xs font-bold ${conf.color}`}>{conf.label}</span>
                    <span className="text-[10px] text-slate-500 mt-1 line-clamp-1">{conf.sublabel}</span>
                  </button>
                );
              })}
            </div>

            {/* Nilai Angka Slider & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Nilai Angka</span>
                    <span className="text-emerald-700 font-bold text-sm">{nilaiAngka} / 100</span>
                  </div>
                  <input
                    type="range"
                    min={40}
                    max={100}
                    value={nilaiAngka}
                    onChange={e => setNilaiAngka(Number(e.target.value))}
                    className="w-full accent-emerald-700 cursor-pointer"
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">Hasil Kelulusan:</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStatus('lulus')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                      status === 'lulus'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Lulus (Mutqin)
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('ulang')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                      status === 'ulang'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    Ulang (Tikror)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Tajwid Pills & Notes */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 block">Catatan Tajwid</label>
            <div className="flex flex-wrap gap-1.5">
              {[
                'Makhraj dan tajwid fasih',
                'Perhatikan mad thabi\'i',
                'Ghunnah kurang dengung 2 harakat',
                'Qalqalah kubra perlu ditebalkan',
                'Waqaf & ibtida\' sangat tertib',
                'Perhatikan nun sukun/tanwin (ikhfa)'
              ].map(note => (
                <button
                  key={note}
                  type="button"
                  onClick={() => setTajwidNotes(note)}
                  className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${
                    tajwidNotes === note
                      ? 'bg-emerald-100 border-emerald-400 text-emerald-900 font-semibold'
                      : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {note}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={tajwidNotes}
              onChange={e => setTajwidNotes(e.target.value)}
              placeholder="Catatan tajwid khusus..."
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Catatan Motivasi & Penguji */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Catatan Musyrif / Ustadz</label>
              <textarea
                rows={2}
                value={catatan}
                onChange={e => setCatatan(e.target.value)}
                placeholder="Catatan motivasi atau instruksi..."
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Nama Ustadz / Penguji</label>
              <input
                type="text"
                value={ustadzPenguji}
                onChange={e => setUstadzPenguji(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
              <p className="text-[11px] text-slate-400 mt-1">Nama musyrif yang menyimak setoran santri saat ini.</p>
            </div>
          </div>

          {/* Submit buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              id="btn-submit-setoran"
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-700 hover:to-teal-700 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Simpan Setoran
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
