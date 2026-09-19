import { Santri, SetoranRecord, SchoolProfile, AppSettings } from '../types';

export const INITIAL_SANTRI: Santri[] = [
  {
    id: 's-1',
    nisn: '202407001',
    nama: 'Muhammad Fatih Al-Faruq',
    kelas: '7A Tahfidz',
    gender: 'L',
    targetJuz: 5,
    ustadzPembimbing: 'Ustadz Ahmad Fauzi, S.Pd.I',
    noHpWali: '6281234567890',
    namaWali: 'Bpk. Hendra Gunawan',
    catatanKhusus: 'Fokus penguatan tajwid nun mati dan waqaf',
    createdAt: '2024-07-15'
  },
  {
    id: 's-2',
    nisn: '202407002',
    nama: 'Aisyah Nur Ramadhani',
    kelas: '8B Tahfidz',
    gender: 'P',
    targetJuz: 10,
    ustadzPembimbing: 'Ustadzah Fatimah Azzahra, Lc',
    noHpWali: '6281298765432',
    namaWali: 'Ibu Siti Munawaroh',
    catatanKhusus: 'Hafalan sangat kuat (mutqin), fashohah istimewa',
    createdAt: '2024-07-15'
  },
  {
    id: 's-3',
    nisn: '202407003',
    nama: 'Ahmad Zaky Mubarak',
    kelas: '9 Unggulan Tahfidz',
    gender: 'L',
    targetJuz: 30,
    ustadzPembimbing: 'Ustadz KH. Abdullah Ridho, SQ',
    noHpWali: '6285712341234',
    namaWali: 'Bpk. H. Rahmat Hidayat',
    catatanKhusus: 'Persiapan Tasmi\' Akbar 15 Juz sekali duduk',
    createdAt: '2024-07-15'
  },
  {
    id: 's-4',
    nisn: '202407004',
    nama: 'Fatimah Zahra Al-Habsyi',
    kelas: '7A Tahfidz',
    gender: 'P',
    targetJuz: 3,
    ustadzPembimbing: 'Ustadzah Halimah, S.Ag',
    noHpWali: '6287811223344',
    namaWali: 'Bpk. Habib Umar',
    catatanKhusus: 'Rajin muroja\'ah mandiri ba\'da Shubuh',
    createdAt: '2024-07-15'
  },
  {
    id: 's-5',
    nisn: '202407005',
    nama: 'Bilal Ramadhan As-Sayuti',
    kelas: '8A Reguler',
    gender: 'L',
    targetJuz: 5,
    ustadzPembimbing: 'Ustadz Ahmad Fauzi, S.Pd.I',
    noHpWali: '6289988776655',
    namaWali: 'Bpk. Syarifuddin',
    catatanKhusus: 'Butuh motivasi tambahan untuk ziyadah harian',
    createdAt: '2024-07-15'
  },
  {
    id: 's-6',
    nisn: '202407006',
    nama: 'Khadijah Najwa Azzahra',
    kelas: '9 Unggulan Tahfidz',
    gender: 'P',
    targetJuz: 15,
    ustadzPembimbing: 'Ustadzah Fatimah Azzahra, Lc',
    noHpWali: '6281355443322',
    namaWali: 'Ibu dr. Hj. Maryam',
    catatanKhusus: 'Memiliki suara tartil merdu dan tajwid matang',
    createdAt: '2024-07-15'
  }
];

export const INITIAL_SETORAN: SetoranRecord[] = [
  {
    id: 'rec-1',
    santriId: 's-1',
    tanggal: '2024-11-18',
    jam: '06:15',
    tipe: 'ziyadah',
    surahMulai: 78,
    ayatMulai: 1,
    surahSelesai: 78,
    ayatSelesai: 20,
    juz: 30,
    kelancaran: 'mumtaz',
    nilaiAngka: 95,
    tajwidNotes: 'Ghunnah musyaddadah sangat bagus',
    catatan: 'Alhamdulillah hafalan lancar tanpa ragu, fashohah sangat baik.',
    ustadzPenguji: 'Ustadz Ahmad Fauzi, S.Pd.I',
    status: 'lulus',
    createdAt: '2024-11-18T06:15:00Z'
  },
  {
    id: 'rec-2',
    santriId: 's-1',
    tanggal: '2024-11-19',
    jam: '06:20',
    tipe: 'ziyadah',
    surahMulai: 78,
    ayatMulai: 21,
    surahSelesai: 78,
    ayatSelesai: 40,
    juz: 30,
    kelancaran: 'jayyid_jiddan',
    nilaiAngka: 88,
    tajwidNotes: 'Perhatikan panjang mad wajib muttashil di ayat 38',
    catatan: 'Hafalan selesai 1 surat An-Naba, siap lanjut An-Nazi\'at.',
    ustadzPenguji: 'Ustadz Ahmad Fauzi, S.Pd.I',
    status: 'lulus',
    createdAt: '2024-11-19T06:20:00Z'
  },
  {
    id: 'rec-3',
    santriId: 's-2',
    tanggal: '2024-11-19',
    jam: '16:30',
    tipe: 'murojaah',
    surahMulai: 67,
    ayatMulai: 1,
    surahSelesai: 67,
    ayatSelesai: 30,
    juz: 29,
    kelancaran: 'mumtaz',
    nilaiAngka: 98,
    tajwidNotes: "Makhraj kha dan 'ain sangat bersih",
    catatan: 'Muroja\'ah Surah Al-Mulk 1 surat penuh sekali duduk. Mutqin!',
    ustadzPenguji: 'Ustadzah Fatimah Azzahra, Lc',
    status: 'lulus',
    createdAt: '2024-11-19T16:30:00Z'
  },
  {
    id: 'rec-4',
    santriId: 's-3',
    tanggal: '2024-11-19',
    jam: '19:45',
    tipe: 'tasmi',
    surahMulai: 1,
    ayatMulai: 1,
    surahSelesai: 2,
    ayatSelesai: 141,
    juz: 1,
    kelancaran: 'mumtaz',
    nilaiAngka: 96,
    tajwidNotes: 'Tanda waqaf lazim dan jaiz ditaati dengan tertib',
    catatan: 'Tasmi\' Juz 1 sekali duduk di hadapan dewan asatidz. Mumtaz.',
    ustadzPenguji: 'Ustadz KH. Abdullah Ridho, SQ',
    status: 'lulus',
    createdAt: '2024-11-19T19:45:00Z'
  },
  {
    id: 'rec-5',
    santriId: 's-4',
    tanggal: '2024-11-18',
    jam: '06:30',
    tipe: 'ziyadah',
    surahMulai: 93,
    ayatMulai: 1,
    surahSelesai: 95,
    ayatSelesai: 8,
    juz: 30,
    kelancaran: 'jayyid',
    nilaiAngka: 82,
    tajwidNotes: 'Qalqalah kubra di akhir ayat perlu ditebalkan',
    catatan: 'Adh-Dhuha s/d At-Tin. Cukup lancar, perlu tikror 2x lagi.',
    ustadzPenguji: 'Ustadzah Halimah, S.Ag',
    status: 'lulus',
    createdAt: '2024-11-18T06:30:00Z'
  },
  {
    id: 'rec-6',
    santriId: 's-5',
    tanggal: '2024-11-19',
    jam: '06:45',
    tipe: 'ziyadah',
    surahMulai: 89,
    ayatMulai: 1,
    surahSelesai: 89,
    ayatSelesai: 15,
    juz: 30,
    kelancaran: 'rasib',
    nilaiAngka: 58,
    tajwidNotes: 'Banyak lupa di sambungan ayat 8-12',
    catatan: 'Belum mutqin, diminta mengulang kembali bersama santri musyrif kamar.',
    ustadzPenguji: 'Ustadz Ahmad Fauzi, S.Pd.I',
    status: 'ulang',
    createdAt: '2024-11-19T06:45:00Z'
  }
];

export const DEFAULT_SCHOOL_PROFILE: SchoolProfile = {
  namaSekolah: 'MTs Sirojut Tholibin',
  programName: "Lembaga Pendidikan & Pengembangan Tahfidzul Qur'an",
  logoUrl: '/logo.png',
  npsn: '20584123',
  nsm: '121235170012',
  alamat: 'Jl. Pesantren No. 07, Sirojut Tholibin',
  email: 'mtssirojuttholibin07@gmail.com',
  telepon: '0812-3456-7890',
  kepalaSekolah: 'KH. M. Sirojuddin, M.Pd',
  nipKepalaSekolah: '197508122003121002',
  koordinatorTahfidz: 'Ust. Ahmad Fauzan, Al-Hafidz',
  nipKoordinator: '198804152015031004',
  tahunAjaran: '2024 / 2025',
  semester: 'Ganjil',
  slogan: "Mencetak Generasi Qur'ani yang Berakhlakul Karimah, Cerdas, dan Berprestasi",
};

export const DEFAULT_APP_SETTINGS = {
  kkmNilai: 75,
  mumtazMin: 90,
  jayyidJiddanMin: 80,
  jayyidMin: 70,
  maqbulMin: 60,
  enableConfetti: true,
  enableHijriDate: true,
  defaultTargetJuz: 5,
  waTemplate: `Assalamu'alaikum Wr. Wb.
Bapak/Ibu Wali dari {nama},

Alhamdulillah, berikut laporan evaluasi mutaba'ah hafalan Al-Qur'an terbaru di {namaSekolah}:
• Tanggal: {tanggal}
• Jenis: {tipe}
• Surat/Ayat: {surat}
• Juz: {juz}
• Kategori Kelancaran: {kelancaran}
• Nilai Angka: {nilai} / 100
• Hasil: {status}
• Catatan Musyrif: {catatan}

Ustadz Penguji: {ustadz}
Mohon senantiasa didoakan dan dimotivasi saat santri di rumah.
Wassalamu'alaikum Wr. Wb.`,
};

