import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { cn } from './utils';

export type Language = 'id' | 'en';

export interface Translations {
  nav: {
    home: string;
    couple: string;
    event: string;
    gallery: string;
    wishes: string;
  };
  cover: {
    weddingOf: string;
    date: string;
    dear: string;
    defaultGuest: string;
    apology: string;
    openBtn: string;
  };
  hero: {
    weddingOf: string;
    day: string;
    monthYear: string;
    timeTag: string;
    quote: string;
    surah: string;
    scroll: string;
  };
  quoteSection: {
    quote: string;
    surah: string;
  };
  profile: {
    salutation: string;
    greetingBody: string;
    daughterOf: string;
    sonOf: string;
    brideParents: string;
    groomParents: string;
  };
  event: {
    subtitle: string;
    title: string;
    day: string;
    monthYear: string;
    akadTitle: string;
    akadTime: string;
    resepsiTitle: string;
    resepsiTime: string;
    address: string;
    locationMapBtn: string;
    calendarBtn: string;
    calTitle: string;
    calDesc: string;
  };
  countdown: {
    tag: string;
    title: string;
    desc: string;
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
  story: {
    tag: string;
    title: string;
    milestone1: {
      date: string;
      title: string;
      desc: string;
    };
    milestone2: {
      date: string;
      title: string;
      desc: string;
    };
    milestone3: {
      date: string;
      title: string;
      desc: string;
    };
  };
  gallery: {
    tag: string;
    title: string;
    swipeHint: string;
    moment: string;
  };
  gift: {
    tag: string;
    title: string;
    desc: string;
    sendGiftBtn: string;
    copyAccount: string;
    copyAddress: string;
    copiedToast: (label: string) => string;
    putriAccLabel: string;
    syarifAccLabel: string;
    addressLabel: string;
    recipient: string;
  };
  wishes: {
    tag: string;
    title: string;
    subtitle: string;
    lockedMsg: string;
    writeMsg: string;
    guestNameLabel: string;
    wishesFieldLabel: string;
    placeholderMsg: string;
    rsvpLabel: string;
    rsvpOptions: {
      hadir: string;
      tidakHadir: string;
      ragu: string;
    };
    sendBtn: string;
    sent: string;
    thankYou: string;
    successMsg: string;
    errorSubmit: (errorMsg: string) => string;
    feedTag: string;
    wishesCount: (count: number) => string;
    loading: string;
    emptyWishes: string;
    coupleReply: string;
    dateLocale: string;
  };
  prayer: {
    title: string;
    meaning: string;
    narrator: string;
  };
  closing: {
    title: string;
    narrative: string;
    salutation: string;
    happyCouple: string;
  };
  footer: {
    madeWithLove: string;
    author: string;
    copyright: string;
  };
}

export const TRANSLATIONS: Record<Language, Translations> = {
  id: {
    nav: {
      home: 'Beranda',
      couple: 'Mempelai',
      event: 'Acara',
      gallery: 'Galeri',
      wishes: 'Ucapan'
    },
    cover: {
      weddingOf: 'THE WEDDING OF',
      date: 'MINGGU, 22 NOVEMBER 2026',
      dear: 'Dear,',
      defaultGuest: 'Tamu Undangan',
      apology: 'Tanpa mengurangi rasa hormat, mohon maaf bila ada kesalahan penulisan nama/gelar.',
      openBtn: 'BUKA UNDANGAN'
    },
    hero: {
      weddingOf: 'THE WEDDING OF',
      day: 'MINGGU',
      monthYear: 'NOVEMBER 2026',
      timeTag: '08.30 WIB – SELESAI',
      quote: '"Dan segala sesuatu Kami ciptakan berpasang-pasangan agar kamu mengingat (kebesaran Allah)."',
      surah: 'QS. ADZ ZARIYAT : 49',
      scroll: 'Gulir'
    },
    quoteSection: {
      quote: '"Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir."',
      surah: 'QS. AR-RUM : 21'
    },
    profile: {
      salutation: "Assalamu'alaikum Wr. Wb.",
      greetingBody: 'Dengan memohon rahmat dan ridho Allah SWT. Kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami.',
      daughterOf: 'Putri Pertama',
      sonOf: 'Putra Keenam',
      brideParents: 'Bapak Andrian & Ibu Ai Mimah',
      groomParents: 'Bapak Nindin & Ibu Yayah'
    },
    event: {
      subtitle: 'WAKTU & TEMPAT',
      title: 'Save The Date',
      day: 'Minggu',
      monthYear: 'NOVEMBER 2026',
      akadTitle: 'AKAD NIKAH',
      akadTime: 'Pukul 08.30 - 10.00 WIB',
      resepsiTitle: 'RESEPSI',
      resepsiTime: 'Pukul 11.00 WIB - Selesai',
      address: 'Sukatani, Kec. Pacet, Kab. Cianjur,\nJawa Barat 43253',
      locationMapBtn: 'PETA LOKASI',
      calendarBtn: 'SIMPAN TANGGAL',
      calTitle: 'Pernikahan Putri & Syarif',
      calDesc: 'Mohon doa restu atas pernikahan kami.'
    },
    countdown: {
      tag: 'MENUJU HARI BAHAGIA',
      title: 'You Are The One',
      desc: 'Menghitung hari menuju ikatan janji suci pernikahan kami',
      days: 'HARI',
      hours: 'JAM',
      minutes: 'MENIT',
      seconds: 'DETIK'
    },
    story: {
      tag: 'KISAH KAMI',
      title: 'Love Story',
      milestone1: {
        date: 'AKHIR DESEMBER 2016',
        title: 'Titik Awal',
        desc: 'Semua bermula dari sebuah perkenalan sederhana di penghujung tahun 2016. Berkat perantara seorang teman, jalan takdir mempertemukan kami untuk pertama kalinya.'
      },
      milestone2: {
        date: '14 JUNI 2026',
        title: 'Mengikat Janji',
        desc: 'Waktu telah menguji, dan keyakinan telah berbicara. Setelah bertahun-tahun membersamai dalam suka dan duka, kami memutuskan untuk melangkah ke jenjang yang lebih serius.'
      },
      milestone3: {
        date: '22 NOVEMBER 2026',
        title: 'Menuju Selamanya',
        desc: 'Kini, penantian panjang itu sampai pada puncaknya. Dengan izin dan ridha-Nya, babak terindah dalam hidup kami akan segera dimulai.'
      }
    },
    gallery: {
      tag: 'MOMEN KAMI',
      title: 'Our Moments',
      swipeHint: 'GESER KANAN',
      moment: 'Momen'
    },
    gift: {
      tag: 'TANDA KASIH',
      title: 'Wedding Gift',
      desc: 'Apabila Bapak/Ibu/Saudara/i ingin mengirimkan hadiah tanda kasih, dapat melalui tautan di bawah ini.',
      sendGiftBtn: 'KIRIM HADIAH',
      copyAccount: 'Salin Rekening',
      copyAddress: 'Salin Alamat',
      copiedToast: (label) => `${label} berhasil disalin!`,
      putriAccLabel: 'Nomor Rekening Putri',
      syarifAccLabel: 'Nomor Rekening Syarif',
      addressLabel: 'Alamat Pengiriman',
      recipient: '(Penerima: Putri / Syarif)'
    },
    wishes: {
      tag: 'BUKU TAMU',
      title: 'Wedding Wishes',
      subtitle: 'Berikan doa dan harapan terbaik untuk kami berdua',
      lockedMsg: 'Halaman ini tertutup untuk umum.',
      writeMsg: 'Tulis Pesan Anda',
      guestNameLabel: 'Nama Tamu',
      wishesFieldLabel: 'Wedding Wishes',
      placeholderMsg: 'Tulis doa dan harapan terbaik...',
      rsvpLabel: 'Konfirmasi Kehadiran',
      rsvpOptions: {
        hadir: 'Hadir',
        tidakHadir: 'Absen',
        ragu: 'Ragu'
      },
      sendBtn: 'Kirim Ucapan',
      sent: 'Terkirim',
      thankYou: 'Terima Kasih',
      successMsg: 'Pesan dan doa restu Anda telah kami terima. Kehadiran Anda adalah kebahagiaan bagi kami.',
      errorSubmit: (err) => `Gagal mengirim ucapan. Silakan coba lagi. Detail Error: ${err}`,
      feedTag: 'Pesan dari Para Tamu',
      wishesCount: (count) => `${count} Doa & Ucapan`,
      loading: 'Memuat...',
      emptyWishes: 'Jadilah yang pertama memberikan doa.',
      coupleReply: 'Balasan Mempelai',
      dateLocale: 'id-ID'
    },
    prayer: {
      title: "Do'a Untuk Pengantin",
      meaning: '"Semoga Allah memberkahimu dan memberkahi apa yang menjadi tanggung jawabmu, serta menyatukan kalian berdua dalam kebaikan."',
      narrator: "(HR. Ahmad, at-Tirmidzi, dan an-Nasa'i)"
    },
    closing: {
      title: 'Terima Kasih',
      narrative: 'Merupakan suatu kehormatan dan kebahagiaan bagi kami beserta keluarga apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kedua mempelai.',
      salutation: "Wassalamu'alaikum Warahmatullahi Wabarakatuh",
      happyCouple: 'KAMI YANG BERBAHAGIA'
    },
    footer: {
      madeWithLove: 'Dibuat dengan Cinta oleh',
      author: 'IT Palugada',
      copyright: '© 2026 IT PALUGADA. ALL RIGHTS RESERVED.'
    }
  },
  en: {
    nav: {
      home: 'Home',
      couple: 'Couple',
      event: 'Event',
      gallery: 'Gallery',
      wishes: 'Wish'
    },
    cover: {
      weddingOf: 'THE WEDDING OF',
      date: 'SUNDAY, 22 NOVEMBER 2026',
      dear: 'Dear,',
      defaultGuest: 'Honored Guest',
      apology: 'We apologize if your name or title is written incorrectly.',
      openBtn: 'OPEN INVITATION'
    },
    hero: {
      weddingOf: 'THE WEDDING OF',
      day: 'SUNDAY',
      monthYear: 'NOVEMBER 2026',
      timeTag: '08.30 WIB ONWARDS',
      quote: '"And of all things We created two mates; perhaps you will remember."',
      surah: 'QS. ADH-DHARIYAT : 49',
      scroll: 'Scroll'
    },
    quoteSection: {
      quote: '"And of His signs is that He created for you from yourselves mates that you may find tranquillity in them; and He placed between you affection and mercy. Indeed in that are signs for a people who give thought."',
      surah: 'QS. AR-RUM : 21'
    },
    profile: {
      salutation: "Assalamu'alaikum Wr. Wb.",
      greetingBody: 'Seeking the grace and blessings of Allah SWT, we request the honor of your presence at our wedding.',
      daughterOf: 'First Daughter of',
      sonOf: 'Sixth Son of',
      brideParents: 'Mr. Andrian & Mrs. Ai Mimah',
      groomParents: 'Mr. Nindin & Mrs. Yayah'
    },
    event: {
      subtitle: 'TIME & LOCATION',
      title: 'Save The Date',
      day: 'Sunday',
      monthYear: 'NOVEMBER 2026',
      akadTitle: 'WEDDING CEREMONY',
      akadTime: '08.30 - 10.00 WIB',
      resepsiTitle: 'RECEPTION',
      resepsiTime: '11.00 WIB onwards',
      address: 'Sukatani, Pacet, Cianjur,\nWest Java 43253',
      locationMapBtn: 'LOCATION MAP',
      calendarBtn: 'ADD TO CALENDAR',
      calTitle: 'Wedding of Putri & Syarif',
      calDesc: 'We kindly ask for your prayers and blessings for our wedding.'
    },
    countdown: {
      tag: 'FROM THIS TIME',
      title: 'You Are The One',
      desc: 'Counting the days until we make our vows',
      days: 'DAYS',
      hours: 'HOURS',
      minutes: 'MINUTES',
      seconds: 'SECONDS'
    },
    story: {
      tag: 'OUR JOURNEY',
      title: 'Love Story',
      milestone1: {
        date: 'LATE DECEMBER 2016',
        title: 'Where It Began',
        desc: 'It all started with a simple introduction at the end of 2016. Through a friend, fate brought us together for the first time.'
      },
      milestone2: {
        date: '14 JUNE 2026',
        title: 'Making a Promise',
        desc: 'Time put us to the test, and we grew sure of each other. After years together through good times and hard ones, we decided to take a more serious step.'
      },
      milestone3: {
        date: '22 NOVEMBER 2026',
        title: 'Toward Forever',
        desc: 'Now the long wait is over. With His permission and blessing, the most beautiful chapter of our lives is about to begin.'
      }
    },
    gallery: {
      tag: 'CAPTURING',
      title: 'Our Moments',
      swipeHint: 'SWIPE RIGHT',
      moment: 'Moment'
    },
    gift: {
      tag: 'SHARE THE JOY',
      title: 'Wedding Gift',
      desc: 'If you would like to send a gift, you can use the details below.',
      sendGiftBtn: 'SEND GIFT',
      copyAccount: 'Copy account number',
      copyAddress: 'Copy address',
      copiedToast: (label) => `${label} copied`,
      putriAccLabel: "Putri's account number",
      syarifAccLabel: "Syarif's account number",
      addressLabel: 'Shipping address',
      recipient: '(Recipient: Putri / Syarif)'
    },
    wishes: {
      tag: 'GUEST BOOK',
      title: 'Wedding Wishes',
      subtitle: 'Share your prayers and wishes for the two of us',
      lockedMsg: 'The guest book is open to invited guests only.',
      writeMsg: 'Write Your Message',
      guestNameLabel: 'Guest Name',
      wishesFieldLabel: 'Wedding Wishes',
      placeholderMsg: 'Write your prayers and wishes for us...',
      rsvpLabel: 'RSVP Confirmation',
      rsvpOptions: {
        hadir: 'Attending',
        tidakHadir: 'Absent',
        ragu: 'Maybe'
      },
      sendBtn: 'Send Wish',
      sent: 'Sent',
      thankYou: 'Thank You',
      successMsg: 'We have received your message and prayers. Your presence means a great deal to us.',
      errorSubmit: (err) => `Your wish could not be sent. Please try again. Error: ${err}`,
      feedTag: 'Messages from Guests',
      wishesCount: (count) => `${count} Wedding Wishes`,
      loading: 'Loading...',
      emptyWishes: 'Be the first to leave a wish.',
      coupleReply: "Couple's Reply",
      dateLocale: 'en-GB'
    },
    prayer: {
      title: 'A Prayer for the Couple',
      meaning: '"May Allah bless you, shower His blessings upon you, and unite you both in goodness."',
      narrator: "(Narrated by Ahmad, at-Tirmidhi, and an-Nasa'i)"
    },
    closing: {
      title: 'Thank You',
      narrative: 'It would be an honor and a joy for us and our families if you could attend and give your blessings to the bride and groom.',
      salutation: "Wassalamu'alaikum Warahmatullahi Wabarakatuh",
      happyCouple: 'THE HAPPY COUPLE'
    },
    footer: {
      madeWithLove: 'Made with love by',
      author: 'IT Palugada',
      copyright: '© 2026 IT PALUGADA. ALL RIGHTS RESERVED.'
    }
  }
};

const STORAGE_KEY = 'wedding_invitation_language';

export const getInitialLanguage = (): Language => {
  if (typeof window === 'undefined') return 'id';

  // 1. Check URL query parameter: ?lang=id or ?lang=en
  try {
    const params = new URLSearchParams(window.location.search);
    const paramLang = params.get('lang')?.toLowerCase();
    if (paramLang === 'id' || paramLang === 'en') {
      return paramLang;
    }
  } catch (e) {
    // ignore URL parsing error
  }

  // 2. Check saved preference in localStorage
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'id' || saved === 'en') {
      return saved;
    }
  } catch (e) {
    // ignore storage error
  }

  // 3. Detect device / browser language
  try {
    const languages = navigator.languages || [navigator.language || ''];
    for (const lang of languages) {
      if (lang && lang.toLowerCase().startsWith('id')) {
        return 'id';
      }
    }
    const primary = (navigator.language || '').toLowerCase();
    if (primary.startsWith('id')) {
      return 'id';
    }
  } catch (e) {
    // ignore detection error
  }

  // If device is set to English or other languages
  return 'en';
};

export const saveLanguagePreference = (lang: Language): void => {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch (e) {
    // ignore storage write error
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLangState] = useState<Language>(getInitialLanguage);

  const setLanguage = (newLang: Language) => {
    setLangState(newLang);
    saveLanguagePreference(newLang);
  };

  useEffect(() => {
    // Sync html lang attribute
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: TRANSLATIONS[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageSwitcher: React.FC<{ className?: string }> = ({ className }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className={cn(
        "fixed top-4 right-4 sm:top-5 sm:right-6 z-[120] flex items-center select-none pointer-events-auto",
        className
      )}
    >
      {/* Liquid Glass Outer Container with Specular Rim */}
      <div className="relative group overflow-hidden rounded-full p-[1px] bg-gradient-to-b from-white/55 via-white/20 to-white/10 hover:from-white/70 hover:via-white/30 hover:to-white/15 shadow-[0_16px_36px_-6px_rgba(0,0,0,0.45),0_4px_12px_-2px_rgba(0,0,0,0.25)] transition-all duration-300">
        {/* Specular Liquid Light Sheen along Top Edge */}
        <div className="absolute top-0 inset-x-3 h-[1px] bg-gradient-to-r from-transparent via-white/85 to-transparent z-30 pointer-events-none" />

        {/* Liquid Glass Pill Body */}
        <div className="relative flex items-center bg-black/30 hover:bg-black/40 backdrop-blur-2xl backdrop-saturate-[180%] rounded-full p-1 border border-white/25 shadow-[inset_0_1px_1.5px_0_rgba(255,255,255,0.45),inset_0_-1px_1px_0_rgba(0,0,0,0.25)] transition-all duration-300">
          {/* ID Button */}
          <button
            type="button"
            onClick={() => setLanguage('id')}
            className={cn(
              "relative px-3 py-1 text-[9.5px] sm:text-[10px] outfit-font font-bold tracking-wider rounded-full transition-all duration-300 cursor-pointer flex items-center justify-center",
              language === 'id'
                ? "text-[#4D342D]"
                : "text-white/80 hover:text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
            )}
            aria-label="Bahasa Indonesia"
          >
            {language === 'id' && (
              <motion.div
                layoutId="lang-liquid-pill"
                className="absolute inset-0 bg-gradient-to-b from-white via-white/95 to-white/90 rounded-full shadow-[0_3px_10px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.95)]"
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
              />
            )}
            <span className="relative z-10 drop-shadow-sm">ID</span>
          </button>

          {/* Liquid Glass Center Divider */}
          <div className="w-[1px] h-3 bg-gradient-to-b from-transparent via-white/35 to-transparent mx-0.5 z-10 pointer-events-none" />

          {/* EN Button */}
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={cn(
              "relative px-3 py-1 text-[9.5px] sm:text-[10px] outfit-font font-bold tracking-wider rounded-full transition-all duration-300 cursor-pointer flex items-center justify-center",
              language === 'en'
                ? "text-[#4D342D]"
                : "text-white/80 hover:text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
            )}
            aria-label="English"
          >
            {language === 'en' && (
              <motion.div
                layoutId="lang-liquid-pill"
                className="absolute inset-0 bg-gradient-to-b from-white via-white/95 to-white/90 rounded-full shadow-[0_3px_10px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.95)]"
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
              />
            )}
            <span className="relative z-10 drop-shadow-sm">EN</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
