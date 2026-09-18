export type SetoranType = 'ziyadah' | 'murojaah' | 'tasmi';

export type KelancaranGrade = 'mumtaz' | 'jayyid_jiddan' | 'jayyid' | 'maqbul' | 'rasib';

export interface Surah {
  number: number;
  name: string;
  arabic: string;
  versesCount: number;
  place: 'Makkiyyah' | 'Madaniyyah';
  juzStart: number;
  juzEnd: number;
}

export interface Santri {
  id: string;
  nisn: string;
  nama: string;
  kelas: string;
  gender: 'L' | 'P';
  targetJuz: number;
  ustadzPembimbing: string;
  noHpWali: string;
  namaWali?: string;
  catatanKhusus?: string;
  createdAt: string;
}

export interface SetoranRecord {
  id: string;
  santriId: string;
  tanggal: string; // YYYY-MM-DD
  jam: string;     // HH:mm
  tipe: SetoranType;
  surahMulai: number;
  ayatMulai: number;
  surahSelesai: number;
  ayatSelesai: number;
  juz: number;
  kelancaran: KelancaranGrade;
  nilaiAngka: number; // 60 - 100
  tajwidNotes?: string;
  catatan: string;
  ustadzPenguji: string;
  status: 'lulus' | 'ulang';
  createdAt: string;
}

export interface JuzMeta {
  juzNumber: number;
  nameArabic: string;
  startSurah: number;
  startAyat: number;
  endSurah: number;
  endAyat: number;
}
