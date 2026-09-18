import { Santri, SetoranRecord } from '../types';
import { ALL_SURAHS, getSurahByNumber, formatSetoranRange, KELANCARAN_CONFIG } from '../data/quranData';

export function getSantriStats(santri: Santri, records: SetoranRecord[]) {
  const santriRecords = records.filter(r => r.santriId === santri.id);
  const totalSetoran = santriRecords.length;
  const passedRecords = santriRecords.filter(r => r.status === 'lulus');
  const ziyadahCount = santriRecords.filter(r => r.tipe === 'ziyadah').length;
  const murojaahCount = santriRecords.filter(r => r.tipe === 'murojaah').length;
  const tasmiCount = santriRecords.filter(r => r.tipe === 'tasmi').length;

  const avgScore = totalSetoran > 0 
    ? Math.round(santriRecords.reduce((acc, r) => acc + r.nilaiAngka, 0) / totalSetoran)
    : 0;

  // Distinct Juz touched and passed
  const juzSet = new Set(passedRecords.map(r => r.juz));
  const juzCompletedEstimate = juzSet.size;

  // Last record
  const sortedRecords = [...santriRecords].sort((a, b) => 
    new Date(b.tanggal + 'T' + (b.jam || '00:00')).getTime() - new Date(a.tanggal + 'T' + (a.jam || '00:00')).getTime()
  );
  const lastRecord = sortedRecords[0] || null;

  const progressPercent = Math.min(100, Math.round((juzCompletedEstimate / (santri.targetJuz || 1)) * 100));

  return {
    totalSetoran,
    passedCount: passedRecords.length,
    ziyadahCount,
    murojaahCount,
    tasmiCount,
    avgScore,
    juzCompletedEstimate,
    progressPercent,
    lastRecord,
    records: sortedRecords
  };
}

export function generateWhatsAppMessage(santri: Santri, record?: SetoranRecord, allRecords?: SetoranRecord[]): string {
  const stats = allRecords ? getSantriStats(santri, allRecords) : null;
  const dateStr = record ? new Date(record.tanggal).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }) : new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  if (record) {
    const rangeStr = formatSetoranRange(record.surahMulai, record.ayatMulai, record.surahSelesai, record.ayatSelesai);
    const grade = KELANCARAN_CONFIG[record.kelancaran]?.label || record.kelancaran;

    return `*LAPORAN SETORAN TAHFIDZ AL-QUR'AN*
*MTs SIROJUT THOLIBIN*
----------------------------------------
*Assalamu'alaikum Warahmatullahi Wabarakatuh*

Yth. Bapak/Ibu Wali Santri dari:
*Nama*: ${santri.nama}
*Kelas*: ${santri.kelas}
*NISN*: ${santri.nisn}

Alhamdulillah, ananda telah melaksanakan setoran hafalan Al-Qur'an pada:
📅 *Hari/Tanggal*: ${dateStr}
⏰ *Waktu*: ${record.jam || 'Ba\'da Shubuh/Ashar'} WIB
📖 *Jenis*: ${record.tipe.toUpperCase()}
📖 *Hafalan*: ${rangeStr} (Juz ${record.juz})
⭐️ *Kelancaran*: ${grade}
📊 *Nilai*: ${record.nilaiAngka}/100
🎯 *Status*: ${record.status === 'lulus' ? '✅ LULUS / MUTQIN' : '⚠️ PERLU DIULANG (TIKROR)'}

📝 *Catatan Ustadz/Musyrif*:
"${record.catatan || 'Pertahankan semangat muroja\'ah dan hafalan barunya.'}"
${record.tajwidNotes ? `(Catatan Tajwid: ${record.tajwidNotes})` : ''}

👤 *Ustadz Penguji*: ${record.ustadzPenguji || santri.ustadzPembimbing}

Semoga ananda senantiasa istiqomah dalam menjaga dan menambah hafalan Al-Qur'anul Karim. Aamiin Ya Rabbal 'Alamin.

*Wassalamu'alaikum Warahmatullahi Wabarakatuh*`;
  }

  // Summary message
  return `*REKAPITULASI MUTABA'AH TAHFIDZ AL-QUR'AN*
*MTs SIROJUT THOLIBIN*
----------------------------------------
*Assalamu'alaikum Warahmatullahi Wabarakatuh*

Yth. Bapak/Ibu Wali Santri:
*Nama*: ${santri.nama}
*Kelas*: ${santri.kelas}
*Target Hafalan*: ${santri.targetJuz} Juz
*Progres Estimasi*: ${stats?.juzCompletedEstimate || 0} Juz (${stats?.progressPercent || 0}%)
*Rata-rata Nilai*: ${stats?.avgScore || 0}/100
*Total Riwayat Setoran*: ${stats?.totalSetoran || 0} kali

Pembimbing: ${santri.ustadzPembimbing}

Mohon senantiasa didoakan dan didampingi muroja'ah di rumah.
*Wassalamu'alaikum Warahmatullahi Wabarakatuh*`;
}

export function exportToCSV(records: SetoranRecord[], santriList: Santri[]) {
  const santriMap = new Map(santriList.map(s => [s.id, s]));

  const headers = [
    'Tanggal',
    'Jam',
    'NISN',
    'Nama Santri',
    'Kelas',
    'Jenis Setoran',
    'Juz',
    'Surat Mulai',
    'Ayat Mulai',
    'Surat Selesai',
    'Ayat Selesai',
    'Nilai',
    'Kelancaran',
    'Status',
    'Ustadz Penguji',
    'Catatan'
  ];

  const rows = records.map(r => {
    const s = santriMap.get(r.santriId);
    const surahMulai = getSurahByNumber(r.surahMulai)?.name || r.surahMulai;
    const surahSelesai = getSurahByNumber(r.surahSelesai)?.name || r.surahSelesai;
    return [
      r.tanggal,
      r.jam,
      `"${s?.nisn || ''}"`,
      `"${s?.nama || ''}"`,
      `"${s?.kelas || ''}"`,
      r.tipe.toUpperCase(),
      r.juz,
      `"${surahMulai}"`,
      r.ayatMulai,
      `"${surahSelesai}"`,
      r.ayatSelesai,
      r.nilaiAngka,
      r.kelancaran,
      r.status.toUpperCase(),
      `"${r.ustadzPenguji}"`,
      `"${(r.catatan || '').replace(/"/g, '""')}"`
    ];
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `rekap_tahfidz_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
