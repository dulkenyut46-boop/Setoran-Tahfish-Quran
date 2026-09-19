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

export interface SchoolProfile {
  namaSekolah: string;
  programName?: string;
  logoUrl?: string;
  npsn: string;
  nsm: string;
  alamat: string;
  email: string;
  telepon: string;
  kepalaSekolah: string;
  nipKepalaSekolah: string;
  koordinatorTahfidz: string;
  nipKoordinator: string;
  tahunAjaran: string;
  semester: 'Ganjil' | 'Genap';
  slogan: string;
}

export interface AppSettings {
  kkmNilai: number;
  mumtazMin: number;
  jayyidJiddanMin: number;
  jayyidMin: number;
  maqbulMin: number;
  enableConfetti: boolean;
  enableHijriDate: boolean;
  defaultTargetJuz: number;
  waTemplate: string;
}

