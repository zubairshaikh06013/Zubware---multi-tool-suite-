export interface IslamicContentItem {
  id: string;
  title: string;
  category: 'Dua' | 'Quran' | 'Hadith' | 'Durood' | 'Wazifa' | 'Motivation';
  arabic: string;
  romanUrdu: string;
  english: string;
  reference?: string;
}

export const ISLAMIC_CONTENT_PRESETS: IslamicContentItem[] = [
  {
    id: 'ayat-al-kursi',
    title: 'Ayat al-Kursi (آية الكرسي)',
    category: 'Quran',
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ',
    romanUrdu: 'Allah! Uske Siwa Koi Mabood Nahi, Woh Zinda Aur Sabka Thambne Wala Hai.',
    english: 'Allah! There is no deity except Him, the Ever-Living, the Sustainer of all existence.',
    reference: 'Surah Al-Baqarah (2:255)'
  },
  {
    id: 'surah-ikhlas',
    title: 'Surah Al-Ikhlas (سورة الإخلاص)',
    category: 'Quran',
    arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ',
    romanUrdu: 'Aap Farma Dijiye: Woh Allah Ek Hai, Allah Be-Niyaz Hai.',
    english: 'Say, "He is Allah, [who is] One, Allah, the Eternal Refuge."',
    reference: 'Surah Al-Ikhlas (112:1-2)'
  },
  {
    id: 'durood-ibrahimi',
    title: 'Durood Ibrahim (اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ)',
    category: 'Durood',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ',
    romanUrdu: 'Ay Allah! Mohammad ﷺ Aur Unki Aal Par Rehmat Naazil Farma.',
    english: 'O Allah, send blessings upon Muhammad and upon the family of Muhammad.',
    reference: 'Sahih Al-Bukhari'
  },
  {
    id: 'subhanallah-wa-bihamdihi',
    title: 'SubhanAllah wa Bihamdihi (100 Times Wazifa)',
    category: 'Wazifa',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ ، سُبْحَانَ اللَّهِ الْعَظِيمِ',
    romanUrdu: 'Rozaana 100 Baar Padhne Se Tamaam Gunah Maaf Ho Jaate Hain.',
    english: 'Glory be to Allah and His is the praise, Glory be to Allah the Greatest.',
    reference: 'Sahih Al-Bukhari & Muslim'
  },
  {
    id: 'dua-yunus',
    title: 'Dua-e-Yunus (Mushkilat Ka Hal)',
    category: 'Dua',
    arabic: 'لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ',
    romanUrdu: 'Tere Siwa Koi Mabood Nahi, Tu Pak Hai, Beshak Main Zalamo Mein Se Tha.',
    english: 'There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.',
    reference: 'Surah Al-Anbiya (21:87)'
  },
  {
    id: 'astaghfirullah',
    title: 'Astaghfirullah (Maghfirat & Rizq)',
    category: 'Wazifa',
    arabic: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ',
    romanUrdu: 'Main Allah Se Apne Tamaam Gunahon Ki Maghfirat Maangta Hoon.',
    english: 'I seek forgiveness from Allah, the Magnificent, whom there is no deity but Him.',
    reference: 'Sunan Abi Dawud'
  },
  {
    id: 'rabbana-atina',
    title: 'Rabbana Atina (Duniya Aur Aakhirat Ki Bhalai)',
    category: 'Dua',
    arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    romanUrdu: 'Ay Hamare Rab! Humein Duniya Mein Bhalai De Aur Aakhirat Mein Bhi Bhalai De.',
    english: 'Our Lord, give us in this world that which is good and in the Hereafter that which is good.',
    reference: 'Surah Al-Baqarah (2:201)'
  },
  {
    id: 'hasbunallah',
    title: 'Hasbunallahu wa Ni\'mal Wakeel',
    category: 'Dua',
    arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
    romanUrdu: 'Humein Allah Kafi Hai Aur Woh Behtareen Karsaaz Hai.',
    english: 'Sufficient for us is Allah, and [He is] the best Disposer of affairs.',
    reference: 'Surah Ali \'Imran (3:173)'
  },
  {
    id: 'hadith-niyyah',
    title: 'Hadith: Aamal Ka Daromadar Niyyat Par Hai',
    category: 'Hadith',
    arabic: 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ',
    romanUrdu: 'Beshak Tamaam Aamal Ka Daromadar Niyyat Par Hai.',
    english: 'Actions are judged according to intentions.',
    reference: 'Sahih Al-Bukhari #1'
  },
  {
    id: 'morning-dua',
    title: 'Morning Azkar (صبح کی دعا)',
    category: 'Dua',
    arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ',
    romanUrdu: 'Humne Subah Ki Aur Subah Tamam Mulk Allah Ke Liye Hai.',
    english: 'We have reached the morning and at this very morning all sovereignty belongs to Allah.',
    reference: 'Sahih Muslim'
  }
];
