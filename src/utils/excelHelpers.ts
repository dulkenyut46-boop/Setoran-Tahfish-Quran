import * as XLSX from 'xlsx';
import { Santri, SetoranRecord, SetoranType, KelancaranGrade } from '../types';
import { ALL_SURAHS, getSurahByNumber } from '../data/quranData';

/**
 * Format date from Excel (handles serial numbers or string dates)
 */
export function formatExcelDate(raw: any): string {
  if (!raw) return new Date().toISOString().slice(0, 10);

  // If number (Excel serial date)
  if (typeof raw === 'number') {
    const excelEpoch = new Date(Math.round((raw - 25569) * 86400 * 1000));
    return excelEpoch.toISOString().slice(0, 10);
  }

  const str = String(raw).trim();
  // If format is YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    return str;
  }
  // If DD/MM/YYYY
  const dmyMatch = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (dmyMatch) {
    const day = dmyMatch[1].padStart(2, '0');
    const month = dmyMatch[2].padStart(2, '0');
    const year = dmyMatch[3];
    return `${year}-${month}-${day}`;
  }

  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }

  return new Date().toISOString().slice(0, 10);
}

/**
 * Format time from Excel
 */
export function formatExcelTime(raw: any): string {
  if (!raw) return '07:00';
  if (typeof raw === 'number') {
    const totalSeconds = Math.round(raw * 86400);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }
  const str = String(raw).trim();
  if (/^\d{1,2}:\d{2}$/.test(str)) {
    const [h, m] = str.split(':');
    return `${h.padStart(2, '0')}:${m}`;
  }
  return '07:00';
}

/**
 * Generate a beautifully structured, comprehensive Excel Template (.xlsx)
 */
export function generateExcelTemplate(): void {
  const wb = XLSX.utils.book_new();

  // -------------------------------------------------------------
  // Sheet 1: PETUNJUK & PANDUAN
  // -------------------------------------------------------------
  const instructions = [
    ['PANDUAN & PETUNJUK PENGISIAN TEMPLATE EXCEL TAHFIDZ AL-QUR\'AN'],
    ['MTs SIROJUT THOLIBIN'],
    [''],
    ['KETERANGAN SHEET:', ''],
    ['1. Sheet "DATA_SANTRI"', 'Gunakan untuk mengimpor atau memperbarui data santri binaan.'],
    ['2. Sheet "DATA_SETORAN"', 'Gunakan untuk mengimpor riwayat setoran hafalan (Ziyadah, Muroja\'ah, Tasmi\').'],
    ['3. Sheet "DAFTAR_114_SURAT"', 'Tabel referensi nomor dan nama surat Al-Qur\'an untuk mempermudah pengisian.'],
    [''],
    ['ATURAN PENGISIAN KOLOM SANTRI:', ''],
    ['* NISN', 'Wajib diisi, unik untuk setiap santri (contoh: 202407001).'],
    ['* Nama Lengkap', 'Wajib diisi.'],
    ['* Kelas', 'Contoh: 7A Tahfidz, 8B Putri, dll.'],
    ['* Jenis Kelamin', 'Isi "L" (Laki-laki) atau "P" (Perempuan).'],
    ['* Target Juz', 'Angka target hafalan (1 s/d 30).'],
    ['* Ustadz Pembimbing', 'Nama ustadz / ustadzah pembimbing halaqah.'],
    ['* No HP WhatsApp Wali', 'Awali dengan 62 atau 08 (contoh: 6281234567890).'],
    [''],
    ['ATURAN PENGISIAN KOLOM SETORAN:', ''],
    ['* NISN Santri', 'Wajib cocok dengan NISN yang ada di daftar santri agar otomatis terhubung.'],
    ['* Tanggal', 'Format YYYY-MM-DD (contoh: 2024-09-18) atau format tanggal Excel standar.'],
    ['* Jenis Setoran', 'Pilih salah satu: ziyadah, murojaah, atau tasmi.'],
    ['* No Surat Mulai & Selesai', 'Nomor surat 1 s/d 114 (lihat sheet DAFTAR_114_SURAT).'],
    ['* Kelancaran', 'Pilihan nilai kelancaran: mumtaz (Sangat Lancar), jayyid_jiddan (Lancar), jayyid (Cukup), maqbul (Kurang), rasib (Perlu Ulang).'],
    ['* Nilai Angka', 'Angka 60 sampai 100.'],
    ['* Status', 'Isi "lulus" atau "ulang".'],
    [''],
    ['Catatan Tambahan:', 'Baris dengan tanda bintang (*) wajib diisi. Baris contoh dapat dihapus atau diganti data asli Anda.']
  ];
  const wsGuide = XLSX.utils.aoa_to_sheet(instructions);
  wsGuide['!cols'] = [{ wch: 30 }, { wch: 75 }];
  XLSX.utils.book_append_sheet(wb, wsGuide, 'PANDUAN');

  // -------------------------------------------------------------
  // Sheet 2: DATA_SANTRI (Template with Sample Data)
  // -------------------------------------------------------------
  const santriHeader = [
    'NISN*',
    'Nama Lengkap*',
    'Kelas*',
    'Jenis Kelamin (L/P)*',
    'Target Juz (1-30)*',
    'Ustadz Pembimbing*',
    'No HP WhatsApp Wali*',
    'Nama Wali',
    'Catatan Khusus'
  ];

  const santriSamples = [
    santriHeader,
    ['202407001', 'Ahmad Raihan Pratama', '7A Tahfidz', 'L', 5, 'Ustadz Ahmad Fauzi, S.Pd.I', '6281234567890', 'Bpk. Joko Susilo', 'Santri baru bersemangat tinggi'],
    ['202407002', 'Fatimah Az-Zahra', '7B Putri', 'P', 7, 'Ustadzah Nurul Hidayah, S.Ag', '6282198765432', 'Ibu Siti Aminah', 'Mempunyai hafalan dasar Juz 30'],
    ['202407003', 'Muhammad Dzaki Al-Fatih', '8A Tahfidz', 'L', 10, 'Ustadz Ahmad Fauzi, S.Pd.I', '6285712345678', 'Bpk. Rahman', 'Program akselerasi tahfidz'],
    ['202407004', 'Aisyah Putri Rahmadani', '8B Putri', 'P', 6, 'Ustadzah Siti Maryam, S.Pd.I', '6281356789012', 'Bpk. Budi Santoso', 'Target khatam 5 juz semester ini'],
    ['202407005', 'Ibrahim Abdullah', '9A Tahfidz', 'L', 15, 'Ustadz M. Ridwan, M.Pd', '6287890123456', 'Ibu Wardah', 'Persiapan ujian tasmi juz 1-5']
  ];

  const wsSantri = XLSX.utils.aoa_to_sheet(santriSamples);
  wsSantri['!cols'] = [
    { wch: 16 }, // NISN
    { wch: 28 }, // Nama
    { wch: 14 }, // Kelas
    { wch: 20 }, // Gender
    { wch: 18 }, // Target Juz
    { wch: 28 }, // Pembimbing
    { wch: 22 }, // No HP
    { wch: 20 }, // Nama Wali
    { wch: 35 }, // Catatan
  ];
  XLSX.utils.book_append_sheet(wb, wsSantri, 'DATA_SANTRI');

  // -------------------------------------------------------------
  // Sheet 3: DATA_SETORAN (Template with Sample Data)
  // -------------------------------------------------------------
  const setoranHeader = [
    'NISN Santri*',
    'Nama Santri (Opsional)',
    'Tanggal (YYYY-MM-DD)*',
    'Jam (HH:MM)',
    'Jenis Setoran (ziyadah/murojaah/tasmi)*',
    'Juz (1-30)*',
    'No Surat Mulai (1-114)*',
    'Ayat Mulai*',
    'No Surat Selesai (1-114)*',
    'Ayat Selesai*',
    'Kelancaran (mumtaz/jayyid_jiddan/jayyid/maqbul/rasib)*',
    'Nilai (60-100)*',
    'Status (lulus/ulang)*',
    'Ustadz Penguji*',
    'Catatan Tajwid',
    'Catatan Evaluasi'
  ];

  const setoranSamples = [
    setoranHeader,
    ['202407001', 'Ahmad Raihan Pratama', '2024-09-15', '07:30', 'ziyadah', 30, 78, 1, 78, 20, 'mumtaz', 95, 'lulus', 'Ustadz Ahmad Fauzi, S.Pd.I', 'Makhraj huruf shad & tha sudah tepat', 'Alhamdulillah lancar dan tartil'],
    ['202407001', 'Ahmad Raihan Pratama', '2024-09-16', '07:30', 'ziyadah', 30, 78, 21, 78, 40, 'jayyid_jiddan', 88, 'lulus', 'Ustadz Ahmad Fauzi, S.Pd.I', 'Perhatikan hukum ghunnah musyaddadah', 'Tingkatkan irama tilawah'],
    ['202407002', 'Fatimah Az-Zahra', '2024-09-15', '16:00', 'murojaah', 30, 87, 1, 89, 30, 'mumtaz', 96, 'lulus', 'Ustadzah Nurul Hidayah, S.Ag', 'Mad thabi\'i konsisten 2 harakat', 'Bacaan sangat tenang dan mutqin'],
    ['202407003', 'Muhammad Dzaki Al-Fatih', '2024-09-16', '08:00', 'tasmi', 30, 78, 1, 114, 6, 'mumtaz', 98, 'lulus', 'Ustadz Ahmad Fauzi, S.Pd.I', 'Sangat baik dan fashih', 'Tasmi sekali duduk Juz 30 Mumtaz!'],
    ['202407004', 'Aisyah Putri Rahmadani', '2024-09-17', '16:30', 'ziyadah', 30, 82, 1, 82, 19, 'jayyid', 78, 'ulang', 'Ustadzah Siti Maryam, S.Pd.I', 'Hafalan ayat 10-15 masih tersendat', 'Wajib tikror 10x dan setorkan kembali besok']
  ];

  const wsSetoran = XLSX.utils.aoa_to_sheet(setoranSamples);
  wsSetoran['!cols'] = [
    { wch: 15 }, // NISN
    { wch: 25 }, // Nama
    { wch: 15 }, // Tanggal
    { wch: 12 }, // Jam
    { wch: 22 }, // Tipe
    { wch: 12 }, // Juz
    { wch: 15 }, // Surat Mulai
    { wch: 12 }, // Ayat Mulai
    { wch: 15 }, // Surat Selesai
    { wch: 12 }, // Ayat Selesai
    { wch: 20 }, // Kelancaran
    { wch: 12 }, // Nilai
    { wch: 14 }, // Status
    { wch: 26 }, // Penguji
    { wch: 30 }, // Tajwid
    { wch: 35 }, // Catatan
  ];
  XLSX.utils.book_append_sheet(wb, wsSetoran, 'DATA_SETORAN');

  // -------------------------------------------------------------
  // Sheet 4: DAFTAR_114_SURAT (Reference)
  // -------------------------------------------------------------
  const surahHeader = [
    'No Surat',
    'Nama Surat',
    'Nama Arab',
    'Jumlah Ayat',
    'Tempat Turun',
    'Juz Awal',
    'Juz Akhir'
  ];
  const surahRows = ALL_SURAHS.map(s => [
    s.number,
    s.name,
    s.arabic,
    s.versesCount,
    s.place,
    s.juzStart,
    s.juzEnd
  ]);
  const wsSurah = XLSX.utils.aoa_to_sheet([surahHeader, ...surahRows]);
  wsSurah['!cols'] = [
    { wch: 10 },
    { wch: 22 },
    { wch: 18 },
    { wch: 14 },
    { wch: 16 },
    { wch: 12 },
    { wch: 12 }
  ];
  XLSX.utils.book_append_sheet(wb, wsSurah, 'DAFTAR_114_SURAT');

  // Write and trigger download
  XLSX.writeFile(wb, 'Template_Impor_Tahfidz_MTs_Sirojut_Tholibin.xlsx');
}

/**
 * Export live database to formatted Excel workbook (.xlsx)
 */
export function exportFullDataToExcel(records: SetoranRecord[], santriList: Santri[]): void {
  const wb = XLSX.utils.book_new();
  const santriMap = new Map(santriList.map(s => [s.id, s]));

  // Sheet 1: RINGKASAN
  const totalSantri = santriList.length;
  const totalSetoran = records.length;
  const totalLulus = records.filter(r => r.status === 'lulus').length;
  const avgNilai = totalSetoran > 0 
    ? Math.round(records.reduce((a, b) => a + b.nilaiAngka, 0) / totalSetoran) 
    : 0;

  const summary = [
    ['LAPORAN REKAPITULASI TAHFIDZ AL-QUR\'AN'],
    ['MTs SIROJUT THOLIBIN'],
    [`Tanggal Ekspor: ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`],
    [''],
    ['STATISTIK UMUM', 'NILAI'],
    ['Total Santri Aktif', totalSantri],
    ['Total Riwayat Setoran', totalSetoran],
    ['Total Setoran Lulus / Mutqin', totalLulus],
    ['Total Perlu Diulang (Tikror)', totalSetoran - totalLulus],
    ['Rata-rata Nilai Keseluruhan', avgNilai],
  ];
  const wsSummary = XLSX.utils.aoa_to_sheet(summary);
  wsSummary['!cols'] = [{ wch: 30 }, { wch: 30 }];
  XLSX.utils.book_append_sheet(wb, wsSummary, 'RINGKASAN');

  // Sheet 2: DATA SANTRI
  const santriHeaders = [
    'NISN',
    'Nama Santri',
    'Kelas',
    'Gender',
    'Target Juz',
    'Ustadz Pembimbing',
    'No HP Wali',
    'Nama Wali',
    'Total Setoran',
    'Catatan Khusus'
  ];
  const santriRows = santriList.map(s => {
    const sRecords = records.filter(r => r.santriId === s.id);
    return [
      s.nisn,
      s.nama,
      s.kelas,
      s.gender,
      s.targetJuz,
      s.ustadzPembimbing,
      s.noHpWali,
      s.namaWali || '',
      sRecords.length,
      s.catatanKhusus || ''
    ];
  });
  const wsSantri = XLSX.utils.aoa_to_sheet([santriHeaders, ...santriRows]);
  wsSantri['!cols'] = [
    { wch: 15 },
    { wch: 26 },
    { wch: 14 },
    { wch: 8 },
    { wch: 12 },
    { wch: 25 },
    { wch: 18 },
    { wch: 20 },
    { wch: 14 },
    { wch: 30 }
  ];
  XLSX.utils.book_append_sheet(wb, wsSantri, 'DATA_SANTRI');

  // Sheet 3: RIWAYAT SETORAN
  const setoranHeaders = [
    'Tanggal',
    'Jam',
    'NISN',
    'Nama Santri',
    'Kelas',
    'Tipe',
    'Juz',
    'Surat Mulai',
    'Ayat Mulai',
    'Surat Selesai',
    'Ayat Selesai',
    'Kelancaran',
    'Nilai',
    'Status',
    'Ustadz Penguji',
    'Catatan Tajwid',
    'Catatan Evaluasi'
  ];
  const setoranRows = records.map(r => {
    const s = santriMap.get(r.santriId);
    const surahMulai = getSurahByNumber(r.surahMulai)?.name || r.surahMulai;
    const surahSelesai = getSurahByNumber(r.surahSelesai)?.name || r.surahSelesai;
    return [
      r.tanggal,
      r.jam || '07:00',
      s?.nisn || '',
      s?.nama || 'Santri Tidak Ditemukan',
      s?.kelas || '',
      r.tipe.toUpperCase(),
      r.juz,
      surahMulai,
      r.ayatMulai,
      surahSelesai,
      r.ayatSelesai,
      r.kelancaran,
      r.nilaiAngka,
      r.status.toUpperCase(),
      r.ustadzPenguji,
      r.tajwidNotes || '',
      r.catatan || ''
    ];
  });
  const wsSetoran = XLSX.utils.aoa_to_sheet([setoranHeaders, ...setoranRows]);
  wsSetoran['!cols'] = [
    { wch: 13 },
    { wch: 9 },
    { wch: 14 },
    { wch: 24 },
    { wch: 12 },
    { wch: 12 },
    { wch: 8 },
    { wch: 18 },
    { wch: 11 },
    { wch: 18 },
    { wch: 11 },
    { wch: 15 },
    { wch: 8 },
    { wch: 10 },
    { wch: 25 },
    { wch: 25 },
    { wch: 30 }
  ];
  XLSX.utils.book_append_sheet(wb, wsSetoran, 'RIWAYAT_SETORAN');

  // Trigger download
  const dateStr = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `Laporan_Tahfidz_MTs_Sirojut_Tholibin_${dateStr}.xlsx`);
}

/**
 * Result structure for Excel / CSV import parsing
 */
export interface ParseImportResult {
  santri: Santri[];
  records: SetoranRecord[];
  warnings: string[];
  errors: string[];
  totalRowsProcessed: number;
}

/**
 * Parses an uploaded Excel (.xlsx, .xls) or CSV file
 */
export async function parseUploadedExcel(
  file: File,
  existingSantri: Santri[]
): Promise<ParseImportResult> {
  const warnings: string[] = [];
  const errors: string[] = [];
  const parsedSantri: Santri[] = [];
  const parsedRecords: SetoranRecord[] = [];

  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type: 'array' });

  // Map to find existing santri by NISN or name (case-insensitive)
  const santriByNisn = new Map<string, Santri>();
  const santriByName = new Map<string, Santri>();

  existingSantri.forEach(s => {
    if (s.nisn) santriByNisn.set(s.nisn.trim().toLowerCase(), s);
    if (s.nama) santriByName.set(s.nama.trim().toLowerCase(), s);
  });

  let foundSantriSheet = false;
  let foundSetoranSheet = false;

  // Iterate over all sheets in the workbook
  for (const sheetName of wb.SheetNames) {
    const lowerName = sheetName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const ws = wb.Sheets[sheetName];
    if (!ws) continue;

    // Convert to JSON array of objects
    const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(ws, { defval: '' });
    if (jsonData.length === 0) continue;

    // Determine sheet type from name or header keys
    const sampleKeys = Object.keys(jsonData[0]).map(k => k.toLowerCase());
    const isSantriSheet =
      lowerName.includes('santri') ||
      sampleKeys.some(k => k.includes('nisn') && !sampleKeys.some(k => k.includes('surat') || k.includes('ayat')));

    const isSetoranSheet =
      lowerName.includes('setoran') ||
      lowerName.includes('riwayat') ||
      sampleKeys.some(k => k.includes('ayat') || k.includes('surat') || k.includes('kelancaran'));

    // Process SANTRI SHEET
    if (isSantriSheet && !lowerName.includes('setoran')) {
      foundSantriSheet = true;
      jsonData.forEach((row, index) => {
        // Find fields with flexible column name matching
        const rowKeys = Object.keys(row);
        const getVal = (patterns: string[]): any => {
          for (const key of rowKeys) {
            const normalized = key.toLowerCase().replace(/[^a-z0-9]/g, '');
            if (patterns.some(p => normalized.includes(p))) {
              return row[key];
            }
          }
          return '';
        };

        const nama = String(getVal(['nama', 'santri'])).trim();
        if (!nama || nama.toLowerCase().includes('contoh') || nama.toLowerCase().includes('panduan')) {
          return; // skip empty or instruction rows
        }

        let nisn = String(getVal(['nisn', 'induk', 'nomor'])).trim();
        if (!nisn) {
          nisn = `202407${String(index + 1).padStart(3, '0')}`;
          warnings.push(`Baris ${index + 2} (${nama}): NISN kosong, dibuatkan otomatis: ${nisn}`);
        }

        const kelas = String(getVal(['kelas', 'rombel'])).trim() || '7A Tahfidz';
        const genderRaw = String(getVal(['gender', 'kelamin', 'jk', 'l/p'])).trim().toUpperCase();
        const gender: 'L' | 'P' = genderRaw.startsWith('P') ? 'P' : 'L';
        const targetJuzNum = parseInt(getVal(['target', 'juz']), 10);
        const targetJuz = isNaN(targetJuzNum) || targetJuzNum < 1 || targetJuzNum > 30 ? 5 : targetJuzNum;
        const ustadzPembimbing = String(getVal(['pembimbing', 'ustadz', 'musyrif'])).trim() || 'Ustadz Pembimbing';
        const noHpWali = String(getVal(['hp', 'wa', 'telepon', 'whatsapp', 'kontak'])).trim() || '628';
        const namaWali = String(getVal(['wali', 'orangtua', 'ayah', 'ibu'])).trim();
        const catatanKhusus = String(getVal(['catatan', 'keterangan'])).trim();

        const santriId = 's-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
        const newSantri: Santri = {
          id: santriId,
          nisn,
          nama,
          kelas,
          gender,
          targetJuz,
          ustadzPembimbing,
          noHpWali,
          namaWali: namaWali || undefined,
          catatanKhusus: catatanKhusus || undefined,
          createdAt: new Date().toISOString().slice(0, 10),
        };

        parsedSantri.push(newSantri);
        // Register in maps so subsequent setoran records can resolve this new santri
        santriByNisn.set(nisn.toLowerCase(), newSantri);
        santriByName.set(nama.toLowerCase(), newSantri);
      });
    }

    // Process SETORAN SHEET
    if (isSetoranSheet) {
      foundSetoranSheet = true;
      jsonData.forEach((row, index) => {
        const rowKeys = Object.keys(row);
        const getVal = (patterns: string[]): any => {
          for (const key of rowKeys) {
            const normalized = key.toLowerCase().replace(/[^a-z0-9]/g, '');
            if (patterns.some(p => normalized.includes(p))) {
              return row[key];
            }
          }
          return '';
        };

        const nisnOrName = String(getVal(['nisn', 'nama', 'santri'])).trim();
        if (!nisnOrName || nisnOrName.toLowerCase().includes('contoh')) {
          return;
        }

        // Match santri
        let matchedSantri = santriByNisn.get(nisnOrName.toLowerCase());
        if (!matchedSantri) {
          matchedSantri = santriByName.get(nisnOrName.toLowerCase());
        }
        // Try exact numeric NISN match
        if (!matchedSantri) {
          for (const s of existingSantri.concat(parsedSantri)) {
            if (s.nisn === nisnOrName || s.nama.toLowerCase() === nisnOrName.toLowerCase()) {
              matchedSantri = s;
              break;
            }
          }
        }

        if (!matchedSantri) {
          // If santri not found, auto-create minimal placeholder santri
          const autoSantriId = 's-imp-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
          const isNum = /^\d+$/.test(nisnOrName);
          matchedSantri = {
            id: autoSantriId,
            nisn: isNum ? nisnOrName : `2024${Math.floor(1000 + Math.random() * 9000)}`,
            nama: isNum ? `Santri ${nisnOrName}` : nisnOrName,
            kelas: '7A Tahfidz',
            gender: 'L',
            targetJuz: 5,
            ustadzPembimbing: 'Ustadz Pembimbing',
            noHpWali: '628',
            createdAt: new Date().toISOString().slice(0, 10),
          };
          parsedSantri.push(matchedSantri);
          santriByNisn.set(matchedSantri.nisn.toLowerCase(), matchedSantri);
          santriByName.set(matchedSantri.nama.toLowerCase(), matchedSantri);
          warnings.push(`Setoran baris ${index + 2}: Santri "${nisnOrName}" belum ada di master data. Dibuatkan data santri baru secara otomatis.`);
        }

        // Parse date and time
        const rawDate = getVal(['tanggal', 'tgl', 'date']);
        const tanggal = formatExcelDate(rawDate);
        const rawTime = getVal(['jam', 'waktu', 'time']);
        const jam = formatExcelTime(rawTime);

        // Parse Tipe
        const rawTipe = String(getVal(['jenis', 'tipe', 'type'])).toLowerCase();
        let tipe: SetoranType = 'ziyadah';
        if (rawTipe.includes('muroja') || rawTipe.includes('muraja')) tipe = 'murojaah';
        else if (rawTipe.includes('tasmi')) tipe = 'tasmi';

        // Parse Juz
        const rawJuz = parseInt(getVal(['juz']), 10);
        const juz = !isNaN(rawJuz) && rawJuz >= 1 && rawJuz <= 30 ? rawJuz : 30;

        // Parse Surah Mulai
        let surahMulai = 78;
        const rawSurahMulai = getVal(['suratmulai', 'surahmulai', 'nomorsuratmulai', 'awal']);
        if (typeof rawSurahMulai === 'number') {
          surahMulai = Math.max(1, Math.min(114, rawSurahMulai));
        } else if (rawSurahMulai) {
          const num = parseInt(String(rawSurahMulai).replace(/[^0-9]/g, ''), 10);
          if (!isNaN(num) && num >= 1 && num <= 114) {
            surahMulai = num;
          } else {
            // lookup by surah name
            const found = ALL_SURAHS.find(s => s.name.toLowerCase().includes(String(rawSurahMulai).toLowerCase()));
            if (found) surahMulai = found.number;
          }
        }

        // Parse Ayat Mulai
        const rawAyatMulai = parseInt(getVal(['ayatmulai', 'dariayat', 'ayat1']), 10);
        const ayatMulai = isNaN(rawAyatMulai) || rawAyatMulai < 1 ? 1 : rawAyatMulai;

        // Parse Surah Selesai
        let surahSelesai = surahMulai;
        const rawSurahSelesai = getVal(['suratselesai', 'surahselesai', 'akhir']);
        if (typeof rawSurahSelesai === 'number') {
          surahSelesai = Math.max(1, Math.min(114, rawSurahSelesai));
        } else if (rawSurahSelesai) {
          const num = parseInt(String(rawSurahSelesai).replace(/[^0-9]/g, ''), 10);
          if (!isNaN(num) && num >= 1 && num <= 114) {
            surahSelesai = num;
          } else {
            const found = ALL_SURAHS.find(s => s.name.toLowerCase().includes(String(rawSurahSelesai).toLowerCase()));
            if (found) surahSelesai = found.number;
          }
        }

        // Parse Ayat Selesai
        const rawAyatSelesai = parseInt(getVal(['ayatselesai', 'sampaiayat', 'ayat2']), 10);
        const maxAyat = getSurahByNumber(surahSelesai)?.versesCount || 286;
        const ayatSelesai = isNaN(rawAyatSelesai) || rawAyatSelesai < 1 ? Math.min(10, maxAyat) : Math.min(rawAyatSelesai, maxAyat);

        // Parse Kelancaran
        const rawKelancaran = String(getVal(['kelancaran', 'predikat', 'kategori', 'kualitas'])).toLowerCase();
        let kelancaran: KelancaranGrade = 'jayyid';
        if (rawKelancaran.includes('mumtaz') || rawKelancaran.includes('istimewa') || rawKelancaran.includes('a')) {
          kelancaran = 'mumtaz';
        } else if (rawKelancaran.includes('jiddan') || rawKelancaran.includes('sangat baik') || rawKelancaran.includes('b+')) {
          kelancaran = 'jayyid_jiddan';
        } else if (rawKelancaran.includes('jayyid') || rawKelancaran.includes('baik') || rawKelancaran.includes('b')) {
          kelancaran = 'jayyid';
        } else if (rawKelancaran.includes('maqbul') || rawKelancaran.includes('cukup') || rawKelancaran.includes('c')) {
          kelancaran = 'maqbul';
        } else if (rawKelancaran.includes('rasib') || rawKelancaran.includes('kurang') || rawKelancaran.includes('d')) {
          kelancaran = 'rasib';
        }

        // Parse Nilai
        const rawNilai = parseInt(getVal(['nilai', 'skor', 'angka']), 10);
        const nilaiAngka = !isNaN(rawNilai) && rawNilai >= 0 && rawNilai <= 100 ? rawNilai : (kelancaran === 'mumtaz' ? 95 : 85);

        // Parse Status
        const rawStatus = String(getVal(['status', 'kelulusan'])).toLowerCase();
        const status: 'lulus' | 'ulang' = rawStatus.includes('ulang') || rawStatus.includes('tikror') || kelancaran === 'rasib'
          ? 'ulang'
          : 'lulus';

        const ustadzPenguji = String(getVal(['penguji', 'ustadz', 'musyrif'])).trim() || matchedSantri.ustadzPembimbing;
        const tajwidNotes = String(getVal(['tajwid', 'makhraj'])).trim();
        const catatan = String(getVal(['catatan', 'evaluasi', 'pesan'])).trim() || 'Setoran tercatat dari impor excel.';

        const recordId = 'rec-imp-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
        const newRecord: SetoranRecord = {
          id: recordId,
          santriId: matchedSantri.id,
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
          status,
          tajwidNotes: tajwidNotes || undefined,
          catatan,
          ustadzPenguji,
          createdAt: new Date().toISOString(),
        };

        parsedRecords.push(newRecord);
      });
    }
  }

  // If no specific sheet matched, try the first sheet as a fallback
  if (!foundSantriSheet && !foundSetoranSheet && wb.SheetNames.length > 0) {
    const firstWs = wb.Sheets[wb.SheetNames[0]];
    const firstData = XLSX.utils.sheet_to_json<Record<string, any>>(firstWs, { defval: '' });
    if (firstData.length > 0) {
      warnings.push(`Berkas diproses menggunakan sheet pertama: "${wb.SheetNames[0]}".`);
      // check if it has santri columns or setoran columns
      const keys = Object.keys(firstData[0]).map(k => k.toLowerCase());
      if (keys.some(k => k.includes('ayat') || k.includes('surat'))) {
        // treat as setoran
      } else {
        // treat as santri
        firstData.forEach((row, i) => {
          const nama = String(row['Nama Lengkap'] || row['Nama'] || row['nama'] || '').trim();
          if (!nama) return;
          const nisn = String(row['NISN'] || row['nisn'] || `202407${i + 1}`).trim();
          parsedSantri.push({
            id: 's-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
            nisn,
            nama,
            kelas: String(row['Kelas'] || row['kelas'] || '7A Tahfidz'),
            gender: String(row['Jenis Kelamin'] || row['gender'] || 'L').toUpperCase().startsWith('P') ? 'P' : 'L',
            targetJuz: parseInt(row['Target Juz'] || row['targetJuz'] || 5, 10) || 5,
            ustadzPembimbing: String(row['Ustadz Pembimbing'] || 'Ustadz Pembimbing'),
            noHpWali: String(row['No HP'] || '628'),
            createdAt: new Date().toISOString().slice(0, 10)
          });
        });
      }
    }
  }

  if (parsedSantri.length === 0 && parsedRecords.length === 0) {
    errors.push('Tidak ditemukan data santri atau riwayat setoran yang valid pada berkas yang diunggah. Pastikan Anda menggunakan format sesuai template.');
  }

  return {
    santri: parsedSantri,
    records: parsedRecords,
    warnings,
    errors,
    totalRowsProcessed: parsedSantri.length + parsedRecords.length
  };
}
