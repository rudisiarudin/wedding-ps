import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import {
  Heart,
  Calendar,
  MapPin,
  Send,
  Copy,
  MessageSquare,
  Camera,
  Gift,
  ChevronDown,
  X,
  VolumeX,
  Home,
  BookOpen,
  Lock,
  Instagram,
  Check,
  User,
  Sparkles,
  Mail,
  MoveHorizontal,
  ArrowRight,
  Clock
} from 'lucide-react';
import { Player } from '@lottiefiles/react-lottie-player';
import { QRCodeSVG } from 'qrcode.react';
import { cn } from './lib/utils';
import { WEDDING_CONFIG } from './config';
import { Reveal } from './components/Reveal';
import Lottie from 'lottie-react';
import { supabase } from './lib/supabase';

// --- Types ---
interface Wish {
  id: string;
  name: string;
  message: string;
  status: 'Hadir' | 'Tidak Hadir' | 'Masih Ragu';
  timestamp: Date;
  reply?: string;
}

// --- Components ---

const FloatingNav = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [isClosingInView, setIsClosingInView] = useState(false);
  const navItems = [
    { icon: <Home size={18} />, label: 'Home', id: 'hero' },
    { icon: <Heart size={18} />, label: 'Couple', id: 'profile' },
    { icon: <Calendar size={18} />, label: 'Event', id: 'event' },
    { icon: <Camera size={18} />, label: 'Gallery', id: 'gallery' },
    { icon: <MessageSquare size={18} />, label: 'Wish', id: 'wishes' },
  ];

  useEffect(() => {
    const sectionIds = navItems.map(item => item.id);

    const handleScroll = () => {
      // Hide navbar when closing section or footer is reached
      const closingEl = document.getElementById('closing');
      if (closingEl) {
        const rect = closingEl.getBoundingClientRect();
        // Hide if closing has scrolled into view (top of closing is near or above 70% of viewport)
        setIsClosingInView(rect.top <= window.innerHeight * 0.7);
      }

      const scrollY = window.scrollY + window.innerHeight * 0.35;
      let current = sectionIds[0];

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) {
          current = id;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{
        y: isClosingInView ? 110 : 0,
        opacity: isClosingInView ? 0 : 1
      }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{ pointerEvents: isClosingInView ? 'none' : 'auto' }}
      className="fixed bottom-5 sm:bottom-6 left-1/2 lg:hidden z-[120] w-[min(92%,480px)] -translate-x-1/2"
    >
      {/* Outer Prism Border with Refractive Liquid Glass Rim */}
      <div className="relative overflow-hidden rounded-full p-[1px] bg-gradient-to-b from-white/45 via-white/20 to-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.14),0_6px_16px_rgba(0,0,0,0.06)]">
        {/* Specular Liquid Sheen along Top Edge */}
        <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-white/70 to-transparent z-20 pointer-events-none" />

        {/* Liquid Glass Body - Ultra Transparent & Refractive */}
        <div className="relative bg-white/[0.08] backdrop-blur-xl backdrop-saturate-[180%] rounded-full px-2 py-1.5 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.45),inset_0_-1px_1px_0_rgba(0,0,0,0.08),0_8px_30px_rgba(0,0,0,0.1)] border border-white/25">
          <div className="flex items-center justify-between gap-1">
            {navItems.map((item, idx) => {
              const isActive = activeSection === item.id;
              return (
                <motion.button
                  key={idx}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => scrollTo(item.id)}
                  className={cn(
                    "relative flex flex-col items-center justify-center min-w-[58px] sm:min-w-[65px] py-2 transition-colors duration-300 rounded-full",
                    isActive ? "text-[#2E201B]" : "text-[#4A3B32]/80 hover:text-[#2E201B]"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 bg-white/20 backdrop-blur-md rounded-full z-0 border border-white/35 shadow-[inset_0_1px_1px_rgba(255,255,255,0.5)]"
                      transition={{ type: "spring", bounce: 0.22, duration: 0.55 }}
                    />
                  )}
                  <div className="relative z-10 flex flex-col items-center gap-0.5">
                    <span className={cn(
                      "transition-transform duration-300 drop-shadow-[0_1px_2px_rgba(255,255,255,0.4)]",
                      isActive && "scale-110"
                    )}>
                      {item.icon}
                    </span>
                    <span className={cn(
                      "text-[9.5px] tracking-tight whitespace-nowrap transition-all drop-shadow-[0_1px_2px_rgba(255,255,255,0.4)]",
                      isActive ? "font-bold text-[#3B2822]" : "text-[#4A3B32]/85 font-semibold"
                    )}>
                      {item.label}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

const GiftModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[50px] relative">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.button
            key="btn"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={() => setIsOpen(true)}
            className="px-9 py-3.5 bg-white text-[#4D342D] hover:bg-white/90 border border-white/60 rounded-full font-serif text-[12px] font-semibold tracking-widest uppercase transition-all shadow-[0_10px_25px_-5px_rgba(0,0,0,0.25)] hover:shadow-[0_14px_30px_-5px_rgba(0,0,0,0.35)] hover:-translate-y-0.5 active:translate-y-0 relative z-10"
          >
            SEND GIFT
          </motion.button>
        ) : (
          <motion.div
            key="card"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full max-w-[400px] bg-white/95 backdrop-blur-md rounded-[16px] border border-[#DDCCB7] shadow-2xl overflow-hidden relative z-20"
          >
            {/* CLOSE button row */}
            <div className="flex justify-end p-4 pb-0 relative z-30">
              <button
                onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors group"
                aria-label="Close"
              >
                <X size={16} className="text-[#9B9879] group-hover:text-[#4D342D] transition-colors" />
              </button>
            </div>

            {/* Content List */}
            <div className="flex flex-col px-6 pb-6 mt-2">
              
              {/* Row 1: BCA - Putri */}
              <div className="flex items-center justify-between py-5 border-b border-[#DDCCB7]/60">
                <div className="flex items-center gap-5">
                  <div className="w-11 h-11 bg-white rounded-[10px] flex items-center justify-center p-2 shadow-sm shrink-0 border border-[#DDCCB7]/40">
                    <img src="/images/bca.webp" alt="BCA" className="w-full h-full object-contain" />
                  </div>
                  <div className="flex flex-col text-left">
                    <p className="text-[#4D342D] font-bold text-[13px] tracking-wide mb-0.5">{WEDDING_CONFIG.bankAccountName2}</p>
                    <p className="text-[#9B9879] text-[12px] font-mono tracking-wider">{WEDDING_CONFIG.bankAccount2} - BCA</p>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(WEDDING_CONFIG.bankAccountToCopy2)}
                  className="w-9 h-9 bg-[#9B9879] hover:bg-[#4D342D] text-white rounded-[10px] flex items-center justify-center shrink-0 ml-2 transition-colors"
                  title="Salin Rekening"
                >
                  {copiedText === WEDDING_CONFIG.bankAccountToCopy2 ? <Check size={14} className="text-white" /> : <Copy size={14} className="text-white" />}
                </button>
              </div>

              {/* Row 2: BCA - Syarif */}
              <div className="flex items-center justify-between py-5 border-b border-[#DDCCB7]/60">
                <div className="flex items-center gap-5">
                  <div className="w-11 h-11 bg-white rounded-[10px] flex items-center justify-center p-2 shadow-sm shrink-0 border border-[#DDCCB7]/40">
                    <img src="/images/bca.webp" alt="BCA" className="w-full h-full object-contain" />
                  </div>
                  <div className="flex flex-col text-left">
                    <p className="text-[#4D342D] font-bold text-[13px] tracking-wide mb-0.5">{WEDDING_CONFIG.bankAccountName}</p>
                    <p className="text-[#9B9879] text-[12px] font-mono tracking-wider">{WEDDING_CONFIG.bankAccount} - BCA</p>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(WEDDING_CONFIG.bankAccountToCopy)}
                  className="w-9 h-9 bg-[#9B9879] hover:bg-[#4D342D] text-white rounded-[10px] flex items-center justify-center shrink-0 ml-2 transition-colors"
                  title="Salin Rekening"
                >
                  {copiedText === WEDDING_CONFIG.bankAccountToCopy ? <Check size={14} className="text-white" /> : <Copy size={14} className="text-white" />}
                </button>
              </div>

              {/* Row 3: Physical Gift */}
              <div className="flex items-center justify-between py-5">
                <div className="flex items-center gap-5">
                  <div className="w-11 h-11 border border-[#DDCCB7] bg-[#DDCCB7]/25 rounded-[10px] flex items-center justify-center shrink-0">
                    <Gift size={18} className="text-[#9B9879]" />
                  </div>
                  <div className="flex flex-col text-left">
                    <p className="text-[#4D342D] font-bold text-[13px] tracking-wide mb-1">Send Gift</p>
                    <p className="text-[#4D342D]/80 text-[11px] leading-relaxed max-w-[190px]">
                      Putri & Syarif<br/>
                      {WEDDING_CONFIG.physicalGiftAddress}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(WEDDING_CONFIG.physicalGiftAddress)}
                  className="w-9 h-9 bg-[#9B9879] hover:bg-[#4D342D] text-white rounded-[10px] flex items-center justify-center shrink-0 ml-2 transition-colors"
                  title="Salin Alamat"
                >
                  {copiedText === WEDDING_CONFIG.physicalGiftAddress ? <Check size={14} className="text-white" /> : <Copy size={14} className="text-white" />}
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};



const Guestbook = ({ guestName }: { guestName: string }) => {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'Hadir' | 'Tidak Hadir' | 'Masih Ragu'>('Hadir');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const displayName = guestName !== 'Tamu Undangan' ? guestName : '';
  const hasSubmitted = wishes.some(w => w.name.toLowerCase() === displayName.toLowerCase());

  useEffect(() => {
    fetchWishes();
  }, []);

  const fetchWishes = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('wishes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const mappedWishes: Wish[] = data.map(item => ({
          id: item.id,
          name: item.name,
          message: item.message,
          status: item.status,
          timestamp: new Date(item.created_at),
          reply: item.reply
        }));
        setWishes(mappedWishes);
      }
    } catch (err) {
      console.error('Error fetching wishes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName || !message || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const { data, error } = await supabase
        .from('wishes')
        .insert([
          {
            name: displayName,
            message,
            status,
            created_at: new Date().toISOString()
          }
        ])
        .select();

      if (error) throw error;

      if (data && data[0]) {
        const newWish: Wish = {
          id: data[0].id,
          name: data[0].name,
          message: data[0].message,
          status: data[0].status,
          timestamp: new Date(data[0].created_at),
          reply: data[0].reply
        };
        setWishes(prev => [newWish, ...prev]);
        setMessage('');
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 5000);
      }
    } catch (err) {
      console.error('Error submitting wish:', err);
      alert(`Gagal mengirim ucapan. Silakan coba lagi. Detail Error: ${(err as Error).message || 'Koneksi gagal/Database tidak ditemukan.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-0">
      {/* Vintage Letter Form */}
      {!displayName ? (
        <div className="max-w-md mx-auto py-8 px-4">
          <div className="vintage-form-card p-8 text-center space-y-4">
             <div className="flex justify-center text-[#DDCCB7]/60"><Lock size={28} /></div>
             <p className="serif-font italic text-[13px] text-[#DDCCB7]/80">Halaman ini tertutup untuk umum.</p>
          </div>
        </div>
      ) : isLoading ? (
        <div className="max-w-md mx-auto py-20 px-4 flex items-center justify-center min-h-[350px]">
          <div className="w-8 h-8 border-[3px] border-[#DDCCB7]/40 border-t-[#9B9879] rounded-full animate-spin" />
        </div>
      ) : (isSuccess || hasSubmitted) ? (
        <AnimatePresence mode="wait">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-md mx-auto py-8 px-4"
          >
            <div className="vintage-form-card relative flex flex-col items-center justify-center text-center py-16 px-8 min-h-[350px]">
              <div className="vintage-corner vintage-corner-tl" />
              <div className="vintage-corner vintage-corner-tr" />
              <div className="vintage-corner vintage-corner-bl" />
              <div className="vintage-corner vintage-corner-br" />

              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 15, stiffness: 100, delay: 0.2 }}
                className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-xl relative"
              >
                <Check size={36} className="text-[#4D342D]" />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <p className="cinzel-font text-[10px] uppercase tracking-[0.4em] text-[#DDCCB7] font-semibold mb-2">Terkirim</p>
                <h3 className="italiana-font text-3xl text-[#EDE7DB] mb-4">Terima Kasih</h3>
                <p className="serif-font italic text-[14px] text-[#DDCCB7]/90 max-w-[280px] leading-relaxed">
                  Pesan dan doa restu Anda telah kami terima. Kehadiran Anda adalah kebahagiaan bagi kami.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto pb-8 px-2">
          <Reveal y={20} duration={1.2}>
          <div className="vintage-form-card relative">
            {/* Corner ornaments */}
            <div className="vintage-corner vintage-corner-tl" />
            <div className="vintage-corner vintage-corner-tr" />
            <div className="vintage-corner vintage-corner-bl" />
            <div className="vintage-corner vintage-corner-br" />

            {/* Inner header */}
            <div className="text-center mb-7">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="w-6 h-[0.5px] bg-[#DDCCB7]/40" />
                <Mail size={16} className="text-[#DDCCB7]" />
                <div className="w-6 h-[0.5px] bg-[#DDCCB7]/40" />
              </div>
              <p className="cinzel-font text-[10px] uppercase tracking-[0.4em] text-[#DDCCB7] font-semibold">Tulis Pesan Anda</p>
            </div>

            <div className="space-y-5">
              {/* Name field */}
              <div className="space-y-2">
                <label className="cinzel-font text-[9px] uppercase tracking-[0.3em] text-[#DDCCB7] font-semibold flex items-center gap-2">
                  <User size={12} className="text-[#DDCCB7]" />
                  Nama Tamu
                </label>
                <input
                  type="text"
                  value={displayName}
                  readOnly
                  className="w-full bg-white text-[#4D342D] border border-[#DDCCB7]/60 rounded-[8px] p-3 text-[13px] font-serif cursor-not-allowed opacity-90 shadow-sm outline-none"
                />
              </div>

              {/* Message field */}
              <div className="space-y-2">
                <label className="cinzel-font text-[9px] uppercase tracking-[0.3em] text-[#DDCCB7] font-semibold flex items-center gap-2">
                  <BookOpen size={12} className="text-[#DDCCB7]" />
                  Wedding Wishes
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-white text-[#4D342D] border border-[#DDCCB7]/60 rounded-[8px] p-3 text-[13px] font-serif resize-none min-h-[110px] shadow-sm outline-none focus:ring-2 focus:ring-[#DDCCB7] placeholder:italic placeholder:text-[#9B9879]/70"
                  placeholder="Tulis doa dan harapan terbaik..."
                  required
                />
              </div>

              {/* Attendance field */}
              <div className="space-y-2">
                <label className="cinzel-font text-[9px] uppercase tracking-[0.3em] text-[#DDCCB7] font-semibold flex items-center gap-2">
                  <Heart size={12} className="text-[#DDCCB7]" />
                  RSVP Confirmation
                </label>
                <div className="flex gap-2">
                  {(['Hadir', 'Tidak Hadir', 'Masih Ragu'] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setStatus(opt)}
                      className={cn(
                        "flex-1 py-2.5 rounded-full cinzel-font text-[9px] tracking-wider uppercase border transition-all duration-300 font-semibold",
                        status === opt
                          ? "bg-white text-[#4D342D] border-white shadow-md"
                          : "bg-black/20 text-[#DDCCB7] border-[#DDCCB7]/40 hover:border-[#DDCCB7] hover:bg-black/30"
                      )}
                    >
                      {opt === 'Tidak Hadir' ? 'Absen' : opt === 'Masih Ragu' ? 'Ragu' : opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit button - WHITE BUTTON requested by user */}
            <div className="pt-7">
              <motion.button
                disabled={isSubmitting || !displayName}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "w-full py-3.5 bg-white text-[#4D342D] rounded-full cinzel-font text-[10.5px] font-bold tracking-[0.3em] uppercase shadow-xl shadow-black/25 hover:bg-white/90 hover:shadow-2xl transition-all flex items-center justify-center gap-2.5 border border-white cursor-pointer",
                  (isSubmitting || !displayName) && "opacity-50 cursor-not-allowed"
                )}
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-[#4D342D]/30 border-t-[#4D342D] rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={12} className="-rotate-12 text-[#4D342D]" />
                    <span>Send Wish</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
          </Reveal>
        </form>
      )}

      {/* Vintage Feed Header */}
      <div className="text-center pt-8 pb-4 px-4">
        <Reveal>
          <div className="flex items-center justify-center gap-3">
            <div className="w-8 h-[0.5px] bg-[#9B9879]/30" />
            <p className="cinzel-font text-[9px] uppercase tracking-[0.4em] text-[#9B9879] font-semibold">Messages from Guests</p>
            <div className="w-8 h-[0.5px] bg-[#9B9879]/30" />
          </div>
        </Reveal>
      </div>

      {/* Wishes Count */}
      {!isLoading && wishes.length > 0 && (
        <Reveal y={5}>
          <div className="text-center pb-4">
            <p className="cinzel-font text-[9px] uppercase tracking-[0.3em] text-[#9B9879]/80 font-medium">
              {wishes.length} Wedding Wishes
            </p>
          </div>
        </Reveal>
      )}

      {/* Vintage Wishes Feed */}
      <div className="px-2 md:px-4">
        {isLoading ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-[#DDCCB7] border-t-[#9B9879] rounded-full animate-spin mx-auto" />
            <p className="cinzel-font text-[9px] uppercase tracking-[0.3em] text-[#9B9879]/70">Memuat...</p>
          </div>
        ) : wishes.length === 0 ? (
          <div className="py-16 text-center opacity-60">
            <BookOpen className="mx-auto mb-3 text-[#9B9879]" size={24} />
            <p className="serif-font italic text-[13px] text-[#4D342D]">Jadilah yang pertama memberikan doa.</p>
          </div>
        ) : (
          <div className="max-w-md mx-auto relative">
            {/* Scrollable wishes area */}
            <div
              className="overflow-y-auto space-y-3 pr-1"
              style={{
                maxHeight: '480px',
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(155,152,121,0.25) transparent',
              }}
            >
              <AnimatePresence mode="popLayout">
                {wishes.map((wish, idx) => (
                  <motion.div
                    key={wish.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ delay: Math.min(idx * 0.05, 0.3) }}
                  >
                    <div className="vintage-wish-card">
                      {/* Left vintage initial */}
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-[#DDCCB7]/40 border border-[#DDCCB7] flex items-center justify-center">
                          <span className="italiana-font text-lg text-[#54543E] font-bold">{wish.name.charAt(0).toUpperCase()}</span>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between gap-2">
                          <h4 className="cinzel-font text-[12px] font-semibold text-[#4D342D] truncate">{wish.name}</h4>
                          <span className="cinzel-font text-[8px] text-[#9B9879]/70 tracking-wider whitespace-nowrap flex-shrink-0">
                            {wish.timestamp.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                        <p className="serif-font text-[#4D342D]/85 text-[13px] leading-relaxed mt-1.5 italic">
                          "{wish.message}"
                        </p>

                        {wish.reply && (
                          <div className="mt-3 pt-3 border-t border-dashed border-[#DDCCB7] pl-3 border-l-2 border-l-[#9B9879]">
                            <p className="cinzel-font text-[8px] uppercase tracking-[0.25em] text-[#9B9879] mb-0.5">Couple's Reply</p>
                            <p className="serif-font text-[#4D342D]/80 italic text-[12px] leading-relaxed">{wish.reply}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Fade overlay hint — only visible when there are many wishes */}
            {wishes.length > 3 && (
              <div
                className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 rounded-b-xl"
                style={{ background: 'linear-gradient(to bottom, transparent, rgba(247,246,243,0.95))' }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const GalleryItem = ({ index, className, onClick }: { index: number; className?: string; onClick: () => void }) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative overflow-hidden cursor-pointer group border border-white/10",
        className
      )}
    >
      <div
        className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10"
      />
      <img
        src={WEDDING_CONFIG.galleryImages[index]}
        alt={`Gallery ${index + 1}`}
        className="h-full w-auto max-w-none object-cover transition-all duration-700 group-hover:scale-[1.03] contrast-[1.1] saturate-[0.85] sepia-[0.15] brightness-[0.95] hue-rotate-[-5deg]"
        loading="lazy"
      />

      {/* Subtle Overlay Label */}
      <div className="absolute bottom-4 left-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
        <p className="outfit-font text-[8px] uppercase tracking-[0.3em] text-white font-bold bg-black/60 px-3 py-1 rounded-full">
          Moment {index + 1}
        </p>
      </div>
    </div>
  );
};

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const isMobileDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsMobile(isMobileDevice);
    if (isMobileDevice) return;

    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement;
      setIsHovering(!!target.closest('button, a, input, select, textarea, .cursor-pointer'));
    };

    window.addEventListener('mousemove', updatePosition);
    return () => window.removeEventListener('mousemove', updatePosition);
  }, []);

  if (isMobile) return null;

  return (
    <>
      <motion.div
        animate={{
          x: position.x - 20,
          y: position.y - 20,
          scale: isHovering ? 1.5 : 1,
          opacity: 1
        }}
        transition={{ type: "spring", damping: 30, stiffness: 200, mass: 0.5 }}
        className="fixed top-0 left-0 w-10 h-10 border border-primary/20 rounded-full z-[9999] pointer-events-none mix-blend-difference"
      />
      <motion.div
        animate={{
          x: position.x - 4,
          y: position.y - 4,
          scale: isHovering ? 0 : 1
        }}
        transition={{ type: "spring", damping: 40, stiffness: 350 }}
        className="fixed top-0 left-0 w-2 h-2 bg-primary rounded-full z-[10000] pointer-events-none"
      />
    </>
  );
};

// --- Main App ---


const Countdown = ({ targetDate, className }: { targetDate: string; className?: string }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const items = [
    { label: 'DAYS', value: timeLeft.days },
    { label: 'HOURS', value: timeLeft.hours },
    { label: 'MINUTES', value: timeLeft.minutes },
    { label: 'SECONDS', value: timeLeft.seconds }
  ];

  return (
    <div className={cn("flex items-center justify-center gap-2 sm:gap-3.5 md:gap-4 py-2", className)}>
      {items.map((item, i) => (
        <motion.div
          key={i}
          whileHover={{ y: -3 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="flex flex-col items-center justify-center w-[70px] min-[390px]:w-[76px] sm:w-[90px] md:w-[100px] py-4 sm:py-5 md:py-6 px-1.5 rounded-2xl sm:rounded-3xl bg-white shadow-[0_10px_25px_-5px_rgba(0,0,0,0.22)]"
        >
          <motion.div
            key={item.value}
            initial={{ opacity: 0.85, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="playfair-font text-[26px] min-[390px]:text-[28px] sm:text-[36px] md:text-[40px] font-normal text-[#4D342D] leading-none"
            style={{ opacity: 1, color: '#4D342D' }}
          >
            {String(item.value).padStart(2, '0')}
          </motion.div>
          <div className="outfit-font text-[7.5px] sm:text-[9px] font-medium tracking-[0.22em] text-[#9B9879] mt-2 sm:mt-2.5 uppercase">
            {item.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const EventCardPhotoSlideshow = () => {
  const photos = WEDDING_CONFIG.eventCardPhotos || [
    '/VSF01875.webp',
    '/VSF01917.webp',
    '/VSF02190.webp'
  ];
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPhotoIndex((prev) => (prev + 1) % photos.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [photos.length]);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#2D3323]">
      <AnimatePresence initial={false}>
        <motion.img
          key={photoIndex}
          src={photos[photoIndex]}
          alt="Wedding Event Card Photo"
          initial={{ opacity: 0, scale: 1.15 }}
          animate={{ opacity: 1, scale: 1.02 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{
            opacity: { duration: 1.8, ease: "easeInOut" },
            scale: { duration: 7, ease: "easeOut" }
          }}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      </AnimatePresence>
      {/* Deep botanical dark scrim with smooth vertical gradient for optimal legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/55 to-black/75 z-[1]" />
      <div className="absolute inset-0 bg-[#353B28]/40 mix-blend-multiply z-[2]" />
    </div>
  );
};



const LeafOrnament = ({ className, rotate = 0, delay = 0, parallaxSpeed = 0 }: { className?: string; rotate?: number; delay?: number; parallaxSpeed?: number }) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 5000], [0, parallaxSpeed * 400]);

  return (
    <motion.div
      initial={{ opacity: 0, rotate: rotate - 20 }}
      whileInView={{ opacity: 0.2, rotate }}
      viewport={{ once: true }}
      transition={{ duration: 1.5, delay, ease: "easeOut" }}
      style={{ y }}
      className={cn("pointer-events-none select-none", className)}
    >
      <svg viewBox="0 0 200 200" fill="currentColor" className="w-full h-full">
        <path d="M100,0 C120,40 180,60 200,100 C180,140 120,160 100,200 C80,160 20,140 0,100 C20,60 80,40 100,0" />
      </svg>
    </motion.div>
  );
};

const DesktopSidebar = ({ guestName, isOpen, onOpen }: { guestName: string; isOpen: boolean; onOpen: () => void }) => {
  return (
    <div className="relative w-full h-full flex flex-col justify-center items-center text-center p-8 md:p-16 text-white overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.img
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
          src={WEDDING_CONFIG.coverImageLeft}
          alt="Sidebar Background"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
        
        {/* Lottie Bird Animation */}
        <div className="absolute top-[15%] left-[5%] w-[300px] pointer-events-none opacity-70 z-[5]">
          <Player
            autoplay
            loop
            src="/lottie_birds.json"
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </div>

      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center">
        <div className="flex items-center justify-center gap-4 mb-8 w-full overflow-hidden">
          <motion.p 
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            animate={{ opacity: 1, letterSpacing: "0.4em" }}
            transition={{ duration: 1.5, delay: 4.2, ease: "easeOut" }}
            className="outfit-font text-[10px] md:text-sm lg:text-[10px] uppercase font-semibold whitespace-nowrap"
          >
            THE WEDDING OF
          </motion.p>
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 4.5, ease: "easeInOut" }}
            className="w-16 md:w-32 h-[1px] bg-white/40 origin-left" 
          />
        </div>
        
        <h1 className="italiana-font text-[5rem] md:text-[7rem] lg:text-[5rem] leading-[0.85] text-white drop-shadow-2xl flex flex-col items-center text-center w-full">
          <motion.span 
            initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.5, delay: 4.8, ease: [0.16, 1, 0.3, 1] }}
            className="pr-12 md:pr-24"
          >
            Putri
          </motion.span>
          <motion.span 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.5, scale: 1 }}
            transition={{ duration: 1.5, delay: 5.2, ease: "easeOut" }}
            className="text-4xl md:text-6xl lg:text-4xl font-light italic my-2 md:my-4"
          >
            &
          </motion.span>
          <motion.span 
            initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.5, delay: 5.5, ease: [0.16, 1, 0.3, 1] }}
            className="pl-12 md:pl-24"
          >
            Syarif
          </motion.span>
        </h1>

        <div className="flex items-center justify-center gap-3 mt-8 w-full max-w-xs overflow-hidden">
          <div className="flex-1 h-[0.5px] bg-white/45" />
          <div className="w-1.5 h-1.5 rotate-45 border border-white/75 bg-white/45" />
          <div className="flex-1 h-[0.5px] bg-white/45" />
        </div>
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 6.0, ease: "easeOut" }}
          className="outfit-font text-[10.5px] md:text-xs uppercase tracking-[0.25em] font-medium text-white/95 mt-3"
        >
          MINGGU, 22 NOVEMBER 2026
        </motion.p>
      </div>

      <div className="relative z-10 w-full pt-10 mt-4">
        <AnimatePresence mode="wait">
          {!isOpen && (
            <motion.div
              key="opening"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center text-center space-y-5"
            >
              <div className="space-y-1">
                <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 6.4, duration: 1 }} className="serif-font text-sm md:text-base italic text-white/85">Dear,</motion.p>
                <motion.p initial={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} transition={{ delay: 6.6, duration: 1, ease: "easeOut" }} className="outfit-font text-2xl md:text-3xl font-normal text-white tracking-wide">{guestName || "Tamu Undangan"}</motion.p>
              </div>
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 6.8, duration: 1 }} className="serif-font text-[11.5px] md:text-xs italic text-white/80 max-w-[290px] leading-relaxed">
                Tanpa mengurangi rasa hormat, mohon maaf bila ada kesalahan penulisan nama/gelar.
              </motion.p>
              <motion.button
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 7.0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onOpen}
                className="relative group overflow-hidden rounded-full p-[1px] bg-gradient-to-b from-white/45 via-white/20 to-white/10 hover:from-white/60 hover:via-white/30 hover:to-white/15 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5),0_10px_20px_-5px_rgba(0,0,0,0.3)] cursor-pointer mt-2"
              >
                {/* Specular Liquid Light Sheen */}
                <div className="absolute top-0 inset-x-6 h-[1px] bg-gradient-to-r from-transparent via-white/70 to-transparent z-20 pointer-events-none" />

                {/* Liquid Glass Pill Body */}
                <div className="relative bg-white/[0.08] group-hover:bg-white/[0.18] active:bg-white/[0.22] backdrop-blur-2xl backdrop-saturate-[180%] border border-white/25 rounded-full px-8 py-3.5 inline-flex items-center justify-center gap-2.5 shadow-[inset_0_1px_1.5px_0_rgba(255,255,255,0.5),inset_0_-1px_1px_0_rgba(0,0,0,0.2)] transition-all duration-300">
                  <Mail size={16} className="text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:scale-110" />
                  <span className="outfit-font tracking-[0.25em] text-[10.5px] font-bold uppercase text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">
                    OPEN INVITATION
                  </span>
                </div>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const App = () => {
  const [isPreloading, setIsPreloading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [guestName, setGuestName] = useState('Tamu Undangan');
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<number | null>(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Tentukan musik aktif berdasarkan jam sekarang
  const getActiveMusicUrl = () => {
    const now = new Date();
    const weddingDay = new Date(WEDDING_CONFIG.weddingDateISO);
    const isWeddingDay =
      now.getFullYear() === weddingDay.getFullYear() &&
      now.getMonth() === weddingDay.getMonth() &&
      now.getDate() === weddingDay.getDate();
    const totalMinutesNow = now.getHours() * 60 + now.getMinutes();
    const resepsiStart = WEDDING_CONFIG.resepsiStartHour * 60 + WEDDING_CONFIG.resepsiStartMinute;
    if (isWeddingDay && totalMinutesNow >= resepsiStart) {
      return WEDDING_CONFIG.resepsiMusicUrl;
    }
    return WEDDING_CONFIG.musicUrl;
  };

  const halfGalleryLength = Math.ceil(WEDDING_CONFIG.galleryImages.length / 2);
  const galleryRow1 = WEDDING_CONFIG.galleryImages.slice(0, halfGalleryLength);
  const galleryRow2 = WEDDING_CONFIG.galleryImages.slice(halfGalleryLength);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const to = params.get('to');
    if (to) {
      // Decode potential double encoding (e.g. %2520) and character '+'
      try {
        const decodedOnce = decodeURIComponent(to.replace(/\+/g, ' '));
        const finalName = decodedOnce.includes('%') ? decodeURIComponent(decodedOnce) : decodedOnce;
        setGuestName(finalName);
      } catch (e) {
        setGuestName(to.replace(/\+/g, ' '));
      }
    }
  }, []);

  // State previously declared above

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPreloading(false);
    }, 3800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const storyInterval = setInterval(() => {
      setCurrentStoryIndex((prev) => (prev + 1) % (WEDDING_CONFIG.storyImages?.length || 1));
    }, 5000);
    const galleryInterval = setInterval(() => {
      setCurrentGalleryIndex((prev) => (prev + 1) % WEDDING_CONFIG.galleryImages.length);
    }, 4000);
    return () => {
      clearInterval(storyInterval);
      clearInterval(galleryInterval);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = '';
    } else {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleOpenInvitation = () => {
    setIsOpen(true);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.src = getActiveMusicUrl();
      audioRef.current.load();
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!audioRef.current) return;
      if (document.hidden) {
        audioRef.current.pause();
      } else if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Audio resume failed:", e));
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isPlaying]);

  const [scrollProgress, setScrollProgress] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative w-full min-h-screen font-sans text-primary selection:bg-tertiary/30">
      {/* Black Preloader */}
      <AnimatePresence>
        {isPreloading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] bg-[#111111] flex flex-col items-center justify-center text-white pointer-events-none"
          >
            {/* "THE WEDDING OF" Phase */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ duration: 1.5, times: [0, 0.2, 0.66, 1], ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <p className="outfit-font text-[10px] md:text-xs lg:text-[10px] uppercase tracking-[0.4em] text-white/60">
                THE WEDDING OF
              </p>
            </motion.div>

            {/* "PS" and Names Phase */}
            <div className="flex flex-col items-center relative top-[-10px]">
              <div className="flex items-center justify-center mb-6 overflow-visible">
                <motion.span
                  initial={{ opacity: 0, x: 25 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2, duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
                  className="italiana-font text-6xl md:text-7xl lg:text-6xl text-white inline-block"
                >
                  P
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, x: -25 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2, duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
                  className="italiana-font text-6xl md:text-7xl lg:text-6xl text-white inline-block"
                >
                  S
                </motion.span>
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1.2, ease: "easeOut" }}
                className="outfit-font text-[10px] md:text-xs lg:text-[10px] uppercase tracking-[0.4em] text-white/80"
              >
                PUTRI & SYARIF
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll Progress Bar */}
      {isOpen && (
        <div className="fixed top-0 left-0 w-full h-1 z-[110] pointer-events-none">
          <motion.div
            className="h-full bg-secondary shadow-[0_0_10px_rgba(155,152,121,0.5)]"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      )}
      {/* Background Music */}
      <audio
        ref={audioRef}
        src={WEDDING_CONFIG.musicUrl}
        loop
        preload="none"
      />

      {/* Music Toggle Button */}
      {isOpen && (
        <motion.button
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleMusic}
          className="fixed bottom-24 right-4 sm:bottom-28 sm:right-6 z-[100] w-12 h-12 sm:w-14 sm:h-14 bg-black/45 backdrop-blur-md rounded-full flex items-center justify-center shadow-[0_8px_25px_rgba(0,0,0,0.25)] border border-white/20 group cursor-pointer"
        >
          {/* Pulsing effect when playing */}
          {isPlaying && (
            <motion.div
              animate={{
                scale: [1, 1.5],
                opacity: [0.5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut"
              }}
              className="absolute inset-0 rounded-full border border-white/30"
            />
          )}

          <div className="relative z-10 flex items-center justify-center w-full h-full">
            {isPlaying ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 rounded-full border-[1.5px] border-white/30 flex items-center justify-center relative bg-gradient-to-br from-black/60 to-black/20 shadow-inner"
              >
                {/* Vinyl Grooves */}
                <div className="absolute inset-[3px] rounded-full border border-white/5" />
                <div className="absolute inset-[6px] rounded-full border border-white/5" />
                {/* Center dot */}
                <div className="w-1.5 h-1.5 rounded-full bg-white/60" />

                {/* Floating Note Ornaments */}
                {[...Array(2)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      y: [-10, -30],
                      x: [i === 0 ? -10 : 10, i === 0 ? -20 : 20],
                      opacity: [0, 1, 0],
                      scale: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 1,
                      ease: "easeOut"
                    }}
                    className="absolute text-[10px] text-white/40"
                  >
                    ♪
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="relative">
                <VolumeX size={20} className="text-white/80" />
              </div>
            )}
          </div>
        </motion.button>
      )}

      {/* Custom Desktop Cursor */}
      <CustomCursor />

      {/* Main Content Wrapper */}
      <div className="relative w-full min-h-screen bg-[#FFFFFF] flex flex-col overflow-x-hidden">
        {/* Desktop Sidebar (Cover) */}
        <aside className={cn(
          "hidden lg:block lg:fixed lg:right-0 lg:top-0 lg:h-screen overflow-hidden bg-primary transition-all duration-[1200ms] ease-[cubic-bezier(0.77,0,0.175,1)] z-0",
          !isOpen ? "lg:w-full" : "lg:w-[calc(100vw-500px)] lg:flex-none"
        )}>
          <DesktopSidebar guestName={guestName} isOpen={isOpen} onOpen={handleOpenInvitation} />
        </aside>

        {/* Main Content (Scrollable) */}
        <main className={cn(
          "relative shadow-2xl min-h-screen border-r border-black/5 bg-[#EDE7DB] transition-all duration-[1200ms] ease-[cubic-bezier(0.77,0,0.175,1)] origin-left z-10",
          !isOpen ? "w-full lg:w-0 lg:opacity-0 lg:overflow-hidden lg:pointer-events-none" : "w-full lg:w-[500px] lg:flex-none lg:opacity-100"
        )}>
          <div className="absolute inset-0 bg-texture opacity-20 pointer-events-none" />

          {/* Hero Section */}
          <section id="hero" className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-[#FFFFFF] lg:hidden">
            {/* Mobile Cover (Unopened) - Exact match to user screenshot */}
            <AnimatePresence>
              {!isOpen && (
                <motion.div
                  key="mobile-cover"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -40, filter: "blur(10px)" }}
                  transition={{ duration: 1.0, ease: [0.25, 1, 0.5, 1] }}
                  className="fixed inset-0 z-50 flex flex-col justify-between items-center text-center px-6 pt-12 sm:pt-14 pb-8 sm:pb-10 overflow-hidden bg-black"
                >
                  {/* Fullscreen Photo Background */}
                  <div className="absolute inset-0 z-0 overflow-hidden">
                    <motion.img
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
                      src={WEDDING_CONFIG.coverImageMobile || WEDDING_CONFIG.coverImageLeft}
                      alt="Cover Photo"
                      className="w-full h-full object-cover object-top"
                    />
                    {/* Dim Overlay: soft top vignette for sky text, clear center for couple, soft bottom vignette for guest & button */}
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-transparent to-black/85" />
                  </div>

                  {/* Top Block: THE WEDDING OF, Nama & Tanggal (Naik ke Atas di Langit) */}
                  <div className="relative z-10 flex flex-col items-center text-center w-full max-w-sm mx-auto">
                    {/* THE WEDDING OF */}
                    <motion.p
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 1 }}
                      className="outfit-font text-[10px] sm:text-[11px] uppercase tracking-[0.4em] text-[#EDE7DB]/95 font-semibold mb-1.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
                    >
                      THE WEDDING OF
                    </motion.p>

                    {/* Putri & Syarif */}
                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35, duration: 1.2 }}
                      className="italiana-font leading-[0.88] text-white flex flex-col items-center drop-shadow-[0_4px_14px_rgba(0,0,0,0.7)] mb-2"
                    >
                      <span className="text-[3rem] sm:text-[3.5rem]">Putri</span>
                      <span className="serif-font italic text-[1.6rem] sm:text-[1.9rem] opacity-90 font-light my-0.5">&</span>
                      <span className="text-[3rem] sm:text-[3.5rem]">Syarif</span>
                    </motion.h1>

                    {/* Divider with diamond: ———— ♦ ———— */}
                    <motion.div
                      initial={{ opacity: 0, scaleX: 0 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                      transition={{ delay: 0.5, duration: 1 }}
                      className="flex items-center justify-center gap-3 w-44 sm:w-52 my-1 text-white/70"
                    >
                      <div className="flex-1 h-[0.5px] bg-[#DDCCB7]/60" />
                      <div className="w-1.5 h-1.5 rotate-45 border border-[#DDCCB7]/80 bg-[#DDCCB7]/50" />
                      <div className="flex-1 h-[0.5px] bg-[#DDCCB7]/60" />
                    </motion.div>

                    {/* Date: MINGGU, 22 NOVEMBER 2026 */}
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 1 }}
                      className="outfit-font tracking-[0.25em] uppercase text-[10px] sm:text-[11px] text-[#EDE7DB] font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
                    >
                      MINGGU, 22 NOVEMBER 2026
                    </motion.p>
                  </div>

                  {/* Bottom Block: Guest Greeting & Liquid Glass Open Invitation Button */}
                  <div className="relative z-10 flex flex-col items-center text-center w-full max-w-sm mx-auto">
                    {/* Guest Greeting */}
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7, duration: 1 }}
                      className="flex flex-col items-center text-center space-y-0.5 mb-3"
                    >
                      <p className="serif-font italic text-[13px] text-[#EDE7DB]/90 drop-shadow-sm">Dear,</p>
                      <p className="outfit-font text-[18px] sm:text-[20px] font-normal text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)] tracking-wide">
                        {guestName || "Tamu Undangan"}
                      </p>
                      <p className="serif-font italic text-[10.5px] sm:text-[11.5px] text-[#EDE7DB]/85 max-w-[280px] leading-relaxed mt-0.5 drop-shadow-sm">
                        Tanpa mengurangi rasa hormat, mohon maaf bila ada kesalahan penulisan nama/gelar.
                      </p>
                    </motion.div>

                    {/* Button: OPEN INVITATION (Transparent Liquid Glass) */}
                    <motion.button
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.85, duration: 0.8 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleOpenInvitation}
                      className="relative group overflow-hidden rounded-full p-[1px] bg-gradient-to-b from-white/45 via-white/20 to-white/10 hover:from-white/60 hover:via-white/30 hover:to-white/15 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5),0_10px_20px_-5px_rgba(0,0,0,0.3)] cursor-pointer mt-1"
                    >
                      {/* Specular Liquid Light Sheen along Top Edge */}
                      <div className="absolute top-0 inset-x-6 h-[1px] bg-gradient-to-r from-transparent via-white/70 to-transparent z-20 pointer-events-none" />

                      {/* Liquid Glass Pill Body */}
                      <div className="relative bg-white/[0.08] group-hover:bg-white/[0.18] active:bg-white/[0.22] backdrop-blur-2xl backdrop-saturate-[180%] border border-white/25 rounded-full px-8 py-3.5 inline-flex items-center gap-2.5 shadow-[inset_0_1px_1.5px_0_rgba(255,255,255,0.5),inset_0_-1px_1px_0_rgba(0,0,0,0.2)] transition-all duration-300">
                        <Mail size={15} className="text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:scale-110" />
                        <span className="outfit-font tracking-[0.25em] text-[10.5px] font-bold uppercase text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">
                          OPEN INVITATION
                        </span>
                      </div>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Background: Botanical Calla Lily (White & Olive-Green Leaves) */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
              <img
                src={WEDDING_CONFIG.heroBg || "/calla-bg.png"}
                alt="Botanical Calla Lily"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="absolute inset-0 bg-texture opacity-[0.05] pointer-events-none z-[1]" />

            {/* Lottie Bird Animation */}
            <div className="absolute top-[16%] sm:top-[18%] right-[-10px] sm:right-[5%] w-[240px] sm:w-[280px] pointer-events-none opacity-75 z-[3] overflow-hidden">
              <Player
                autoplay
                loop
                src="/lottie_birds.json"
                style={{ width: '100%', height: '100%' }}
              />
            </div>

            <div className="relative z-10 flex flex-col justify-start min-h-[100dvh] w-full px-4 sm:px-6 pt-12 sm:pt-16 pb-28 sm:pb-32">
              
              {/* Top Block: Rata Kiri di Atas */}
              <div className="flex flex-col items-start text-left w-full max-w-sm pl-1">
                {/* Header: THE WEDDING OF */}
                <Reveal delay={0.2} y={15}>
                  <p className="outfit-font text-[10px] sm:text-[11px] uppercase tracking-[0.45em] text-[#6A6A53] font-bold mb-2">
                    THE WEDDING OF
                  </p>
                </Reveal>

                {/* Couple Names: Putri & Syarif (Grand Italiana, Rata Kiri) */}
                <Reveal delay={0.35} y={20} duration={1.2}>
                  <h1 className="italiana-font flex flex-col items-start text-left my-0.5 select-none">
                    <span className="text-[4rem] sm:text-[4.8rem] leading-[0.88] text-[#4D342D] tracking-tight">Putri</span>
                    <span className="serif-font italic font-light text-[2rem] sm:text-[2.4rem] text-[#9B9879] leading-none my-0.5 pl-1">&</span>
                    <span className="text-[4rem] sm:text-[4.8rem] leading-[0.88] text-[#4D342D] tracking-tight">Syarif</span>
                  </h1>
                </Reveal>

                {/* Date Badge: 22 | SUNDAY NOVEMBER 2026 08.30 WIB - SELESAI (Rata Kiri) */}
                <Reveal delay={0.5} y={15} duration={1.2}>
                  <div className="flex items-center gap-3.5 mt-3.5 text-left">
                    <span className="italiana-font text-[3.4rem] sm:text-[4rem] text-[#4D342D] font-normal leading-none tracking-tight">
                      22
                    </span>
                    <div className="w-[1.5px] h-10 bg-[#DDCCB7]" />
                    <div className="text-left outfit-font uppercase flex flex-col justify-center">
                      <p className="text-[#6A6A53] font-bold text-[9px] sm:text-[10px] tracking-[0.3em] leading-tight">
                        SUNDAY
                      </p>
                      <p className="text-[#4D342D] font-bold text-[10.5px] sm:text-[11.5px] tracking-[0.2em] leading-tight mt-0.5">
                        NOVEMBER 2026
                      </p>
                      <p className="text-[#9B9879] font-medium text-[8px] sm:text-[8.5px] tracking-[0.16em] leading-tight mt-1">
                        08.30 WIB – SELESAI
                      </p>
                    </div>
                  </div>
                </Reveal>
              </div>

              {/* Bottom Block: QS Adz-Zariyat & Scroll Indicator (Dinaikkan agar dekat ke blok tanggal, seimbang dari atas ke bawah) */}
              <div className="flex flex-col items-center text-center w-full max-w-sm mx-auto mt-8 sm:mt-12">
                <Reveal delay={0.6} y={15} duration={1.2}>
                  <div className="px-3">
                    <p className="serif-font text-[11.5px] sm:text-[13px] italic leading-[1.8] text-[#4D342D]/90">
                      "Dan segala sesuatu Kami ciptakan berpasang-pasangan agar kamu mengingat (kebesaran Allah)."
                    </p>
                    <div className="flex items-center justify-center gap-2.5 my-2.5 text-[#9B9879]/50">
                      <div className="h-[0.5px] w-8 bg-[#9B9879]/40" />
                      <div className="w-1.5 h-1.5 rotate-45 border border-[#9B9879]/60" />
                      <div className="h-[0.5px] w-8 bg-[#9B9879]/40" />
                    </div>
                    <p className="outfit-font text-[8.5px] sm:text-[9.5px] tracking-[0.28em] uppercase text-[#6A6A53] font-bold">
                      QS. ADZ ZARIYAT : 49
                    </p>
                  </div>
                </Reveal>

                {/* Scroll Down Indicator */}
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="flex flex-col items-center gap-0.5 text-[#9B9879] pt-3"
                >
                  <span className="outfit-font text-[7.5px] tracking-[0.35em] font-semibold uppercase">Scroll</span>
                  <ChevronDown size={13} />
                </motion.div>
              </div>
            </div>
          </section>

          {/* ↓ Portrait column starts here (all content below hero) */}
          <div className="w-full">
          
          {/* Welcome Info Section (Desktop Only) */}
          <section className="relative min-h-screen hidden lg:flex flex-col justify-between px-8 py-16 bg-[#FFFFFF] overflow-hidden">
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
              <img
                src={WEDDING_CONFIG.heroBg || "/calla-bg.png"}
                alt="Botanical Calla Lily"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="absolute inset-0 bg-texture opacity-[0.05] pointer-events-none z-[1]" />

            <div className="relative z-10 flex flex-col justify-between min-h-[calc(100vh-8rem)] w-full max-w-md mx-auto">
              
              {/* Top Block: Rata Kiri di Atas */}
              <div className="flex flex-col items-start text-left w-full">
                {/* Header: THE WEDDING OF */}
                <Reveal delay={0.2} y={15}>
                  <p className="outfit-font text-[10px] md:text-[11.5px] uppercase tracking-[0.45em] text-[#6A6A53] font-bold mb-3">
                    THE WEDDING OF
                  </p>
                </Reveal>

                {/* Couple Names: Putri & Syarif (Grand Italiana, Rata Kiri) */}
                <Reveal delay={0.35} y={20} duration={1.2}>
                  <h1 className="italiana-font flex flex-col items-start text-left my-1 select-none">
                    <span className="text-[4.2rem] md:text-[5rem] leading-[0.9] text-[#4D342D] tracking-tight">Putri</span>
                    <span className="serif-font italic font-light text-[2.1rem] md:text-[2.5rem] text-[#9B9879] leading-none my-1 pl-1">&</span>
                    <span className="text-[4.2rem] md:text-[5rem] leading-[0.9] text-[#4D342D] tracking-tight">Syarif</span>
                  </h1>
                </Reveal>

                {/* Date Badge: 22 | SUNDAY NOVEMBER 2026 08.30 WIB - SELESAI (Rata Kiri) */}
                <Reveal delay={0.5} y={15} duration={1.2}>
                  <div className="flex items-center gap-4 mt-5 text-left">
                    <span className="italiana-font text-[3.4rem] md:text-[4rem] text-[#4D342D] font-normal leading-none tracking-tight">
                      22
                    </span>
                    <div className="w-[1.5px] h-11 bg-[#DDCCB7]" />
                    <div className="text-left outfit-font uppercase flex flex-col justify-center">
                      <p className="text-[#6A6A53] font-bold text-[9.5px] md:text-[10.5px] tracking-[0.3em] leading-tight">
                        SUNDAY
                      </p>
                      <p className="text-[#4D342D] font-bold text-[11px] md:text-[12px] tracking-[0.2em] leading-tight mt-0.5">
                        NOVEMBER 2026
                      </p>
                      <p className="text-[#9B9879] font-medium text-[8.5px] md:text-[9px] tracking-[0.16em] leading-tight mt-1">
                        08.30 WIB – SELESAI
                      </p>
                    </div>
                  </div>
                </Reveal>
              </div>

              {/* Bottom Block: QS Adz-Zariyat & Divider */}
              <div className="flex flex-col items-center text-center w-full max-w-sm mx-auto mt-10 md:mt-14 pb-4">
                <Reveal delay={0.6} y={15} duration={1.2}>
                  <div className="px-4">
                    <p className="serif-font text-[12px] md:text-[13.5px] italic leading-[1.8] text-[#4D342D]/90">
                      "Dan segala sesuatu Kami ciptakan berpasang-pasangan agar kamu mengingat (kebesaran Allah)."
                    </p>
                    <div className="flex items-center justify-center gap-2.5 my-2.5 text-[#9B9879]/50">
                      <div className="h-[0.5px] w-8 bg-[#9B9879]/40" />
                      <div className="w-1.5 h-1.5 rotate-45 border border-[#9B9879]/60" />
                      <div className="h-[0.5px] w-8 bg-[#9B9879]/40" />
                    </div>
                    <p className="outfit-font text-[8.5px] md:text-[9.5px] tracking-[0.28em] uppercase text-[#6A6A53] font-bold">
                      QS. ADZ ZARIYAT : 49
                    </p>
                  </div>
                </Reveal>
              </div>

            </div>
          </section>

          {/* Quote Section with Cinematic Background — Neutral Black Scrim */}
          <section className="relative min-h-[45vh] md:min-h-[55vh] flex items-center justify-center py-20 px-8 overflow-hidden bg-black">
            {/* Animated Background Image - Smooth Looping Zoom */}
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.12, 1] }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute inset-0 z-0"
            >
              {/* Neutral Black Scrim Overlay */}
              <div className="absolute inset-0 bg-black/60 z-10" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/55 to-black/75 z-10" />
              <img
                src={WEDDING_CONFIG.quoteBg || "/VSF02391.webp"}
                alt="Background"
                className="w-full h-full object-cover object-[35%_center]"
              />
            </motion.div>

            <div className="relative z-20 w-full max-w-5xl mx-auto space-y-6 md:space-y-8 text-center px-4">
              <Reveal delay={0.2} scale={0.8} duration={1.5}>
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Heart className="mx-auto text-[#DDCCB7] drop-shadow-md" size={24} />
                </motion.div>
              </Reveal>

              <Reveal delay={0.5} y={20} duration={2}>
                <p className="serif-font text-[12px] sm:text-[14.5px] italic leading-[2] sm:leading-[1.9] text-[#EDE7DB] drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] max-w-3xl mx-auto px-2">
                  "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir"
                </p>
              </Reveal>

              <Reveal delay={1.2} y={10} duration={1.5}>
                <div className="flex flex-col items-center gap-2.5">
                  <div className="w-12 h-[1px] bg-[#DDCCB7]/60 shadow-sm" />
                  <p className="outfit-font text-[9px] md:text-xs lg:text-[9px] uppercase tracking-[0.4em] font-bold text-[#DDCCB7] drop-shadow-md">
                    QS. AR-RUM : 21
                  </p>
                </div>
              </Reveal>
            </div>
          </section>

          {/* Greeting + Couple Profile Section */}
          <section id="profile" className="pt-2 sm:pt-3 md:pt-5 pb-0 relative overflow-hidden bg-[#EDE7DB]">
            {/* Background Image (Calla Lily Botanical from WhatsApp Image) */}
            <div className="absolute top-0 left-0 right-0 h-[720px] md:h-[860px] pointer-events-none z-0 overflow-hidden">
              <img
                src={WEDDING_CONFIG.greetingBg || "/WhatsApp Image 2026-10-27 at 21.17.18.png"}
                alt="Botanical Calla Lily Greeting Background"
                className="w-full h-full object-cover object-top"
              />
            </div>
            {/* Texture Overlay */}
            <div className="absolute inset-0 bg-texture opacity-[0.05] pointer-events-none z-[1]" />

            <div className="max-w-md mx-auto relative z-30 px-6">
              {/* Bismillah Section */}
              <div className="flex flex-col items-center mb-8">
                <Reveal y={10} duration={1.5}>
                  <div className="px-10 mb-2">
                    <img
                      src={WEDDING_CONFIG.bismillahImage}
                      alt="Bismillah"
                      className="w-full max-w-[180px] h-auto object-contain opacity-85"
                      style={{ filter: 'brightness(0) saturate(100%) invert(21%) sepia(18%) saturate(1062%) hue-rotate(329deg) brightness(96%) contrast(91%)' }}
                    />
                  </div>
                </Reveal>

                <Reveal delay={0.4} y={10} duration={1.2}>
                  <h2 className="italiana-font text-[20px] md:text-2xl lg:text-[20px] font-bold text-center text-[#54543E] tracking-widest mb-3">Assalamu'alaikum Wr. Wb.</h2>
                </Reveal>

                <Reveal delay={0.6} y={10} duration={1.5}>
                  <p className="serif-font text-[12.5px] md:text-[16px] lg:text-[12.5px] leading-[1.8] text-[#4D342D]/85 italic text-center max-w-[340px] mx-auto">
                    Dengan memohon rahmat dan ridho Allah SWT. Kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami.
                  </p>
                </Reveal>
              </div>
              {/* Photo Section - Direct couple.png without CSS frame */}
              <div className="relative mx-auto max-w-[270px] sm:max-w-[310px] mt-4 sm:mt-6 mb-0 px-2 z-30">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2 }}
                  className="relative z-20"
                >
                  <img
                    src={WEDDING_CONFIG.couplePhoto || "/couple.png"}
                    alt="Putri & Syarif"
                    className="w-full h-auto object-contain"
                    referrerPolicy="no-referrer"
                  />

                  {/* Wedding Rings Overlayed on Photo Bottom */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    animate={{ y: [0, -4, 0] }}
                    viewport={{ once: true }}
                    transition={{
                      scale: { delay: 0.8, duration: 1, type: "spring" },
                      opacity: { delay: 0.8, duration: 1 },
                      y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="absolute -bottom-10 sm:-bottom-11 left-[45%] -translate-x-1/2 w-24 sm:w-28 h-auto z-40 pointer-events-none"
                  >
                    <img src={WEDDING_CONFIG.ringsImage} alt="" className="w-full h-auto object-contain drop-shadow-xl" />
                  </motion.div>
                </motion.div>
              </div>


            </div>

            {/* Names Section with Concave "Smile" Curve */}
            <div className="relative mt-[-50px] md:mt-[-70px] z-20">
              {/* The Curve Transition */}
              <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] translate-y-[-99%]">
                <svg viewBox="0 0 1440 120" className="relative block w-full h-auto" preserveAspectRatio="none">
                  <defs>
                    <pattern id="curve-texture" patternUnits="userSpaceOnUse" width="400" height="400">
                      <image href="/images/paper-fibers.webp" width="400" height="400" preserveAspectRatio="none" />
                    </pattern>
                  </defs>
                  <path
                    d="M0,0 Q720,120 1440,0 L1440,120 L0,120 Z"
                    fill="#6A6A53"
                  />
                  <path
                    d="M0,0 Q720,120 1440,0 L1440,120 L0,120 Z"
                    fill="url(#curve-texture)"
                    opacity="0.4"
                    style={{ mixBlendMode: 'overlay' }}
                  />
                </svg>
              </div>

              {/* Names Content Area */}
              <div className="bg-[#6A6A53] text-[#EDE7DB] pt-12 md:pt-16 pb-32 sm:pb-36 md:pb-28 px-4 relative z-20">
                {/* Paper Texture Overlay */}
                <div
                  className="absolute inset-0 pointer-events-none z-0 opacity-40 mix-blend-overlay"
                  style={{ backgroundImage: "url('/images/paper-fibers.webp')", backgroundRepeat: 'repeat' }}
                />

                <div className="max-w-md mx-auto relative z-10">
                  <div className="flex items-start justify-center gap-1 md:gap-3">
                    {/* Bride Column (Putri) */}
                    <div className="flex-1 text-center">
                      <Reveal delay={0.2} y={20}>
                        <div className="space-y-0 flex flex-col items-center justify-end min-h-[75px] md:min-h-[100px]">
                          <h3 className="italiana-font text-[24px] md:text-[34px] lg:text-[24px] text-white tracking-wide font-normal leading-tight">
                            {WEDDING_CONFIG.brideNickname}
                          </h3>
                          <p className="script-font text-[28px] md:text-[40px] lg:text-[28px] text-[#DDCCB7] leading-none mt-[-2px] md:mt-[-6px]">
                            Andiani
                          </p>
                        </div>

                        <div className="mt-6 md:mt-8 flex flex-col gap-1 md:gap-2">
                          <p className="outfit-font text-[9px] md:text-[12px] lg:text-[9px] text-[#DDCCB7]/70 tracking-[0.2em] font-bold uppercase">Putri Pertama</p>
                          <p className="serif-font text-[11.5px] md:text-[15px] lg:text-[11.5px] text-white italic leading-[1.8] px-1">
                            {WEDDING_CONFIG.brideParents}
                          </p>
                        </div>
                      </Reveal>
                    </div>

                    {/* Vertical Divider */}
                    <div className="flex flex-col items-center px-1 md:px-3 shrink-0 pt-3 md:pt-5 opacity-40">
                      <div className="w-[1px] h-14 md:h-20 bg-[#DDCCB7]" />
                      <div className="py-1.5 md:py-2.5">
                        <Heart size={10} fill="#DDCCB7" className="text-[#DDCCB7]" />
                      </div>
                      <div className="w-[1px] h-14 md:h-20 bg-[#DDCCB7]" />
                    </div>

                    {/* Groom Column (Syarif) */}
                    <div className="flex-1 text-center">
                      <Reveal delay={0.4} y={20}>
                        <div className="space-y-0 flex flex-col items-center justify-end min-h-[75px] md:min-h-[100px]">
                          <h3 className="italiana-font text-[24px] md:text-[34px] lg:text-[24px] text-white tracking-wide font-normal leading-tight">
                            {WEDDING_CONFIG.groomNickname}
                          </h3>
                          <p className="script-font text-[28px] md:text-[40px] lg:text-[28px] text-[#DDCCB7] leading-none mt-[-2px] md:mt-[-6px]">
                            Hidayat
                          </p>
                        </div>

                        <div className="mt-6 md:mt-8 flex flex-col gap-1 md:gap-2">
                          <p className="outfit-font text-[9px] md:text-[12px] lg:text-[9px] text-[#DDCCB7]/70 tracking-[0.2em] font-bold uppercase">Putra Keenam</p>
                          <p className="serif-font text-[11.5px] md:text-[15px] lg:text-[11.5px] text-white italic leading-[1.8] px-1">
                            {WEDDING_CONFIG.groomParents}
                          </p>
                        </div>
                      </Reveal>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Transition Curve */}
              <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] translate-y-[99%]">
                <svg viewBox="0 0 1440 120" className="relative block w-full h-auto rotate-180" preserveAspectRatio="none">
                  <path
                    d="M0,0 Q720,120 1440,0 L1440,120 L0,120 Z"
                    fill="#6A6A53"
                  />
                </svg>
              </div>
            </div>
          </section>

          {/* Event Details */}
          {/* Event Section (Waktu & Tempat) — Matched to User Reference Image 2 */}
          <section id="event" className="py-16 sm:py-20 px-3 sm:px-6 relative overflow-hidden bg-[#EDE7DB]">
            {/* Background Texture Overlay */}
            <div className="absolute inset-0 bg-texture opacity-[0.12] pointer-events-none" />

            <div className="w-full max-w-[430px] sm:max-w-[460px] mx-auto relative z-10 flex flex-col items-center">
              {/* Header Above Card: TIME & LOCATION / Save The Date */}
              <Reveal y={25} scale={1} className="w-full">
                <div className="text-center space-y-2 mb-6 sm:mb-7">
                  <p className="outfit-font text-[9.5px] uppercase tracking-[0.45em] text-[#6A6A53] font-semibold">
                    TIME &amp; LOCATION
                  </p>
                  <h2 className="italiana-font text-3xl sm:text-4xl text-[#4D342D] font-normal tracking-wide">
                    Save The Date
                  </h2>

                  {/* Two underline accents with center gap */}
                  <div className="flex items-center justify-between w-48 sm:w-56 mx-auto mt-2 px-3 text-[#9B9879] opacity-70">
                    <div className="w-16 sm:w-20 h-[0.75px] bg-current" />
                    <div className="w-16 sm:w-20 h-[0.75px] bg-current" />
                  </div>
                </div>
              </Reveal>

              {/* The Event Card */}
              <Reveal y={30} scale={1} duration={1.2} className="w-full">
                <div className="w-full rounded-[28px] sm:rounded-[32px] overflow-hidden shadow-[0_22px_55px_-12px_rgba(77,52,45,0.28)] bg-[#515743] text-[#EDE7DB] px-6 sm:px-9 py-12 sm:py-16 text-center relative border border-[#DDCCB7]/30">
                  {/* Photo Slideshow with smooth gentle zoom (Ken Burns effect) */}
                  <EventCardPhotoSlideshow />

                  {/* Subtle paper grain overlay inside card */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay z-[1]"
                    style={{ backgroundImage: "url('/images/paper-fibers.webp')", backgroundRepeat: 'repeat' }}
                  />

                  <div className="relative z-10 flex flex-col items-center">
                    {/* Day Name */}
                    <p className="italiana-font text-[28px] sm:text-[34px] text-[#EDE7DB] font-normal leading-tight tracking-wide">
                      Minggu
                    </p>

                    {/* Day Number */}
                    <p className="serif-font italic text-[56px] sm:text-[66px] text-[#EDE7DB] font-normal leading-none my-1 sm:my-1.5 tracking-tight">
                      22
                    </p>

                    {/* Month & Year */}
                    <p className="outfit-font text-[10px] sm:text-[11px] tracking-[0.38em] uppercase text-[#DDCCB7] font-normal mt-1.5 sm:mt-2">
                      NOVEMBER 2026
                    </p>

                    {/* Intertwined Rings Divider 1 */}
                    <div className="flex items-center justify-center gap-3 w-full max-w-[190px] mx-auto my-5 sm:my-6 text-[#DDCCB7] opacity-80">
                      <div className="flex-1 h-[0.75px] bg-current opacity-60" />
                      <svg width="24" height="13" viewBox="0 0 24 13" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 text-current">
                        <ellipse cx="8" cy="6.5" rx="5" ry="4.5" stroke="currentColor" strokeWidth="0.9" />
                        <ellipse cx="16" cy="6.5" rx="5" ry="4.5" stroke="currentColor" strokeWidth="0.9" />
                      </svg>
                      <div className="flex-1 h-[0.75px] bg-current opacity-60" />
                    </div>

                    {/* Akad Nikah */}
                    <div className="space-y-1">
                      <p className="outfit-font text-[10.5px] sm:text-[11.5px] tracking-[0.32em] uppercase text-[#EDE7DB] font-normal">
                        AKAD NIKAH
                      </p>
                      <p className="serif-font italic text-[12.5px] sm:text-[13.5px] text-[#DDCCB7] mt-0.5">
                        Pukul {WEDDING_CONFIG.akadTime}
                      </p>
                    </div>

                    {/* Resepsi */}
                    <div className="space-y-1 mt-4 sm:mt-5">
                      <p className="outfit-font text-[10.5px] sm:text-[11.5px] tracking-[0.32em] uppercase text-[#EDE7DB] font-normal">
                        RESEPSI
                      </p>
                      <p className="serif-font italic text-[12.5px] sm:text-[13.5px] text-[#DDCCB7] mt-0.5">
                        Pukul {WEDDING_CONFIG.resepsiTime}
                      </p>
                    </div>

                    {/* Intertwined Rings Divider 2 */}
                    <div className="flex items-center justify-center gap-3 w-full max-w-[190px] mx-auto my-5 sm:my-6 text-[#DDCCB7] opacity-80">
                      <div className="flex-1 h-[0.75px] bg-current opacity-60" />
                      <svg width="24" height="13" viewBox="0 0 24 13" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 text-current">
                        <ellipse cx="8" cy="6.5" rx="5" ry="4.5" stroke="currentColor" strokeWidth="0.9" />
                        <ellipse cx="16" cy="6.5" rx="5" ry="4.5" stroke="currentColor" strokeWidth="0.9" />
                      </svg>
                      <div className="flex-1 h-[0.75px] bg-current opacity-60" />
                    </div>

                    {/* Venue / Lokasi */}
                    <div className="space-y-1">
                      <h3 className="italiana-font text-[22px] sm:text-[26px] text-[#EDE7DB] font-normal tracking-wide">
                        {WEDDING_CONFIG.akadLocationName}
                      </h3>
                      <p className="serif-font italic text-[11px] sm:text-[12px] text-[#DDCCB7] max-w-xs mx-auto leading-relaxed mt-0.5">
                        Sukatani, Kec. Pacet, Kab. Cianjur,<br />Jawa Barat 43253
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="w-full space-y-3 pt-7 sm:pt-9">
                      {/* Button 1: Location Map (Solid Egg Shell) */}
                      <motion.a
                        href={WEDDING_CONFIG.akadGoogleMapsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full rounded-full bg-[#EDE7DB] hover:bg-white text-[#4D342D] py-3.5 px-6 font-semibold tracking-[0.25em] text-[10px] uppercase shadow-md transition-all block text-center border border-[#DDCCB7]"
                      >
                        LOCATION MAP
                      </motion.a>

                      {/* Button 2: Simpan Tanggal (Hairline Outline) */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          const startDate = new Date(WEDDING_CONFIG.weddingDateISO);
                          const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000); // 4 jam kemudian
                          const toGCalUTC = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
                          const event = {
                            title: "Pernikahan Syarif & Putri",
                            start: toGCalUTC(startDate),
                            end: toGCalUTC(endDate),
                            location: WEDDING_CONFIG.akadLocationName,
                            description: "Mohon doa restu atas pernikahan kami."
                          };
                          window.open(`https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.start}/${event.end}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`, '_blank');
                        }}
                        className="w-full rounded-full bg-transparent hover:bg-white/10 text-[#EDE7DB] border border-[#DDCCB7]/70 py-3.5 px-6 font-semibold tracking-[0.25em] text-[10px] uppercase transition-all block text-center cursor-pointer"
                      >
                        SIMPAN TANGGAL
                      </motion.button>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </section>

          {/* Countdown Section (Matched to Gambar 2) */}
          <section id="countdown" className="relative pt-20 sm:pt-28 pb-24 sm:pb-32 px-4 sm:px-8 text-center overflow-hidden">
            {/* Background Texture: WhatsApp Image 2026-10-27 at 23.51.19.png */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
              <img
                src={WEDDING_CONFIG.countdownBg || "/WhatsApp Image 2026-10-27 at 23.51.19.png"}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-texture opacity-[0.06] mix-blend-overlay" />
            </div>

            {/* Double Border Frame matching Gambar 2 */}
            <div className="absolute inset-3 sm:inset-5 md:inset-7 border border-[#DDCCB7]/50 pointer-events-none rounded-none z-10">
              <div className="absolute inset-1.5 sm:inset-2 md:inset-2.5 border border-[#DDCCB7]/40 pointer-events-none rounded-none" />
            </div>

            <div className="relative z-20 max-w-xl mx-auto flex flex-col items-center">
              <Reveal y={25}>
                <div className="flex flex-col items-center">
                  {/* FROM THIS TIME */}
                  <p className="outfit-font text-[10px] sm:text-[11px] uppercase tracking-[0.45em] text-[#DDCCB7]/90 font-normal mb-2 sm:mb-2.5">
                    FROM THIS TIME
                  </p>

                  {/* You Are The One */}
                  <h2 className="playfair-font text-[30px] sm:text-[40px] md:text-[46px] text-[#EDE7DB] font-normal tracking-wide leading-tight mb-3 sm:mb-3.5">
                    You Are The One
                  </h2>

                  {/* Elegant Divider: Line — Open Diamond — Line */}
                  <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-5">
                    <div className="h-[1px] w-12 sm:w-16 bg-[#DDCCB7]/50" />
                    <div className="w-2.5 h-2.5 rotate-45 border border-[#DDCCB7]/75 bg-transparent" />
                    <div className="h-[1px] w-12 sm:w-16 bg-[#DDCCB7]/50" />
                  </div>

                  {/* Subtitle */}
                  <p className="serif-font italic font-normal text-xs sm:text-[13.5px] text-[#DDCCB7]/90 leading-relaxed max-w-md mx-auto mb-7 sm:mb-9">
                    Menghitung hari menuju ikatan janji suci pernikahan kami
                  </p>
                </div>
              </Reveal>

              {/* Countdown Cards */}
              <Reveal delay={0.2} y={20}>
                <Countdown targetDate={WEDDING_CONFIG.weddingDateISO} />
              </Reveal>
            </div>
          </section>

          {/* Love Story Section — Our Journey Winding Timeline */}
          {/* Love Story Section */}
          <section id="story" className="pt-24 sm:pt-28 pb-20 sm:pb-24 px-4 sm:px-6 relative overflow-hidden bg-[#FAF7F2]">
            {/* Background Image: WhatsApp Image 2026-10-27 at 23.22.45.png (Watercolor leaf at top) */}
            <div className="absolute inset-0 pointer-events-none z-0">
              <img
                src={WEDDING_CONFIG.storyBg || "/WhatsApp Image 2026-10-27 at 23.22.45.png"}
                alt=""
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="absolute inset-0 bg-texture opacity-[0.06] pointer-events-none z-[1]" />

            <div className="relative z-10 max-w-lg mx-auto">
              {/* Header with Elegant Entrance */}
              <div className="text-center space-y-1.5 mb-12 sm:mb-14">
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="outfit-font text-[10px] sm:text-[11px] uppercase tracking-[0.45em] text-[#9B9879] font-medium text-center"
                >
                  OUR JOURNEY
                </motion.p>
                <motion.h2
                  initial={{ opacity: 0, y: 16, filter: "blur(5px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="italiana-font text-4xl sm:text-5xl text-[#54543E] text-center font-normal tracking-wide"
                >
                  Love Story
                </motion.h2>

                {/* Horizontal Divider Line expanding from center */}
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  whileInView={{ scaleX: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
                  className="w-14 h-[0.75px] bg-[#9B9879]/60 mx-auto !mt-3 origin-center"
                />
              </div>

              {/* Timeline Container with Continuous Vertical Line */}
              <div className="relative space-y-12 sm:space-y-14 pl-1">
                {/* Continuous Vertical Timeline Line on Left - draws downwards */}
                <motion.div
                  initial={{ scaleY: 0, opacity: 0 }}
                  whileInView={{ scaleY: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute left-[17px] sm:left-[19px] top-4 bottom-2 w-[1px] bg-[#DDCCB7] pointer-events-none z-0 origin-top"
                />

                {/* Milestone 1: Titik Awal */}
                <div className="relative flex items-start gap-4 sm:gap-5 z-10">
                  {/* Badge I */}
                  <motion.div
                    initial={{ scale: 0.7, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="w-[34px] h-[34px] sm:w-[38px] sm:h-[38px] rounded-full bg-[#54543E] text-white flex items-center justify-center font-serif text-[13px] sm:text-[14px] font-medium z-10 shrink-0 shadow-sm border border-white/30"
                  >
                    I
                  </motion.div>

                  {/* Story Text */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="flex-1 min-w-0 pt-0.5 text-left"
                  >
                    <motion.p
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.15 }}
                      className="outfit-font text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#9B9879] font-medium mb-1"
                    >
                      AKHIR DESEMBER 2016
                    </motion.p>
                    <motion.h3
                      initial={{ opacity: 0, filter: "blur(4px)" }}
                      whileInView={{ opacity: 1, filter: "blur(0px)" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      className="italiana-font text-[24px] sm:text-[27px] text-[#4D342D] leading-tight mb-2.5 font-normal"
                    >
                      Titik Awal
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="serif-font text-[12px] sm:text-[13px] text-[#4D342D]/80 leading-[1.8] text-left"
                    >
                      Semua bermula dari sebuah perkenalan sederhana di penghujung tahun 2016. Berkat perantara seorang teman, jalan takdir mempertemukan kami untuk pertama kalinya.
                    </motion.p>
                  </motion.div>
                </div>

                {/* Milestone 2: Mengikat Janji */}
                <div className="relative flex items-start gap-4 sm:gap-5 z-10">
                  {/* Badge II */}
                  <motion.div
                    initial={{ scale: 0.7, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="w-[34px] h-[34px] sm:w-[38px] sm:h-[38px] rounded-full bg-[#54543E] text-white flex items-center justify-center font-serif text-[13px] sm:text-[14px] font-medium z-10 shrink-0 shadow-sm border border-white/30"
                  >
                    II
                  </motion.div>

                  {/* Story Text */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="flex-1 min-w-0 pt-0.5 text-left"
                  >
                    <motion.p
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.15 }}
                      className="outfit-font text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#9B9879] font-medium mb-1"
                    >
                      14 JUNI 2026
                    </motion.p>
                    <motion.h3
                      initial={{ opacity: 0, filter: "blur(4px)" }}
                      whileInView={{ opacity: 1, filter: "blur(0px)" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      className="italiana-font text-[24px] sm:text-[27px] text-[#4D342D] leading-tight mb-2.5 font-normal"
                    >
                      Mengikat Janji
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="serif-font text-[12px] sm:text-[13px] text-[#4D342D]/80 leading-[1.8] text-left"
                    >
                      Waktu telah menguji, dan keyakinan telah berbicara. Setelah bertahun-tahun membersamai dalam suka dan duka, kami memutuskan untuk melangkah ke jenjang yang lebih serius.
                    </motion.p>
                  </motion.div>
                </div>

                {/* Milestone 3: Menuju Selamanya */}
                <div className="relative flex items-start gap-4 sm:gap-5 z-10">
                  {/* Badge III */}
                  <motion.div
                    initial={{ scale: 0.7, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="w-[34px] h-[34px] sm:w-[38px] sm:h-[38px] rounded-full bg-[#54543E] text-white flex items-center justify-center font-serif text-[13px] sm:text-[14px] font-medium z-10 shrink-0 shadow-sm border border-white/30"
                  >
                    III
                  </motion.div>

                  {/* Story Text */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="flex-1 min-w-0 pt-0.5 text-left"
                  >
                    <motion.p
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.15 }}
                      className="outfit-font text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#9B9879] font-medium mb-1"
                    >
                      22 NOVEMBER 2026
                    </motion.p>
                    <motion.h3
                      initial={{ opacity: 0, filter: "blur(4px)" }}
                      whileInView={{ opacity: 1, filter: "blur(0px)" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      className="italiana-font text-[24px] sm:text-[27px] text-[#4D342D] leading-tight mb-2.5 font-normal"
                    >
                      Menuju Selamanya
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="serif-font text-[12px] sm:text-[13px] text-[#4D342D]/80 leading-[1.8] text-left"
                    >
                      Kini, penantian panjang itu sampai pada puncaknya. Dengan izin dan ridha-Nya, babak terindah dalam hidup kami akan segera dimulai.
                    </motion.p>
                  </motion.div>
                </div>
              </div>
            </div>
          </section>

          {/* Gallery Section */}
          <section id="gallery" className="py-24 px-4 space-y-12 bg-[#EDE7DB] relative overflow-hidden">
            {/* Background Image: Light Cream Botanical Illustration */}
            <div className="absolute inset-0 pointer-events-none z-0">
              <img
                src={WEDDING_CONFIG.galleryBg || "/WhatsApp Image 2026-10-27 at 21.17.18.png"}
                alt="Botanical Gallery Background"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="absolute inset-0 bg-texture opacity-[0.06] pointer-events-none z-[1]" />

            <Reveal y={30}>
              <div className="text-center space-y-4 mb-16 relative z-10">
                <p className="outfit-font text-[9.5px] uppercase tracking-[0.6em] text-[#6A6A53] font-semibold">Capturing</p>
                <div className="flex items-center justify-center gap-4">
                  <div className="flex-1 max-w-[80px] h-[0.5px] bg-gradient-to-r from-transparent to-[#9B9879]/50" />
                  <Camera size={14} className="text-[#6A6A53]" />
                  <div className="flex-1 max-w-[80px] h-[0.5px] bg-gradient-to-l from-transparent to-[#9B9879]/50" />
                </div>
                <h2 className="playfair-font text-4xl md:text-5xl lg:text-4xl text-[#4D342D] font-normal tracking-wide drop-shadow-sm">Our Moments</h2>
                <div className="flex items-center justify-center gap-3">
                  <div className="h-[1px] w-8 bg-[#9B9879]/40" />
                  <div className="w-1.5 h-1.5 rotate-45 border border-[#9B9879]" />
                  <div className="h-[1px] w-8 bg-[#9B9879]/40" />
                </div>
              </div>
            </Reveal>

            {/* Gallery Layout - Horizontal Scrolling Rows */}
            <Reveal y={30} delay={0.2}>
              <div className="w-full relative z-10 pt-8 pb-16 space-y-4 md:space-y-6 overflow-hidden pl-4 md:pl-8">
                
                {/* Row 1: Images */}
                <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-3 md:gap-4 w-full pr-4 md:pr-8 h-[200px] md:h-[260px] items-stretch">
                  {galleryRow1.map((_, idx) => (
                    <div key={`row1-${idx}`} className="shrink-0 h-full snap-center">
                      <GalleryItem
                        index={idx}
                        onClick={() => setSelectedGalleryImage(idx)}
                        className="h-full w-auto transition-all duration-700 shadow-md hover:shadow-xl rounded-lg"
                      />
                    </div>
                  ))}
                </div>

                {/* Row 2: Images */}
                <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-3 md:gap-4 w-full pr-4 md:pr-8 h-[200px] md:h-[260px] items-stretch">
                  {galleryRow2.map((_, idx) => {
                    const originalIndex = halfGalleryLength + idx;
                    return (
                      <div key={`row2-${idx}`} className="shrink-0 h-full snap-center">
                        <GalleryItem
                          index={originalIndex}
                          onClick={() => setSelectedGalleryImage(originalIndex)}
                          className="h-full w-auto transition-all duration-700 shadow-md hover:shadow-xl rounded-lg"
                        />
                      </div>
                    );
                  })}
                </div>
                
                {/* Scroll Indicator */}
                <div className="flex items-center justify-center gap-4 mt-6 opacity-90">
                  <div className="w-16 h-[0.5px] bg-gradient-to-r from-transparent to-[#9B9879]/60" />
                  <div className="flex items-center gap-2 text-[#6A6A53] animate-pulse">
                    <span className="outfit-font text-[9px] uppercase tracking-[0.5em] ml-1">Swipe Right</span>
                    <ArrowRight size={14} strokeWidth={1.5} />
                  </div>
                  <div className="w-16 h-[0.5px] bg-gradient-to-l from-transparent to-[#9B9879]/60" />
                </div>
              </div>
            </Reveal>
          </section>

          {/* Wedding Gift Section */}
          <section className="py-24 px-8 text-center bg-[#5e6342] relative overflow-hidden">
            {/* Background Image requested by user */}
            <div className="absolute inset-0 pointer-events-none z-0">
              <img
                src={WEDDING_CONFIG.giftBg || "/WhatsApp Image 2026-10-27 at 23.53.28.png"}
                alt=""
                className="w-full h-full object-cover object-top"
              />
            </div>
            {/* Soft Overlay & Paper Texture */}
            <div className="absolute inset-0 bg-[#54543E]/15 pointer-events-none z-[1]" />
            <div className="absolute inset-0 bg-texture opacity-[0.10] pointer-events-none z-[2]" />

            <div className="max-w-4xl mx-auto space-y-8 relative z-10">
              <Reveal delay={0.4} y={20} duration={1.5}>
                <div className="text-center flex flex-col items-center mb-10 relative z-10">
                  <p className="outfit-font text-[10px] uppercase tracking-[0.5em] text-[#DDCCB7] font-semibold mb-4 ml-2">Share The Joy</p>
                  
                  <div className="flex items-center justify-center gap-5 mb-5 w-full max-w-[280px]">
                    <div className="flex-1 h-[0.5px] bg-[#DDCCB7]/50" />
                    <Gift size={16} className="text-[#DDCCB7]" />
                    <div className="flex-1 h-[0.5px] bg-[#DDCCB7]/50" />
                  </div>
                  
                  <h2 className="italiana-font text-4xl md:text-5xl lg:text-4xl text-[#EDE7DB] drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] mb-6">Wedding Gift</h2>
                  
                  <div className="flex items-center justify-center gap-4">
                    <div className="h-[0.5px] w-12 bg-[#DDCCB7]/50" />
                    <div className="w-1.5 h-1.5 rotate-45 border border-[#DDCCB7]/70" />
                    <div className="h-[0.5px] w-12 bg-[#DDCCB7]/50" />
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.6} y={15} duration={1.5}>
                <p className="sans-font text-[12px] text-[#EDE7DB]/95 mb-10 md:mb-12 leading-relaxed italic px-2 max-w-lg mx-auto drop-shadow-sm">
                  Apabila Bapak/Ibu/Saudara/i ingin mengirimkan hadiah tanda kasih, dapat melalui tautan di bawah ini.
                </p>
              </Reveal>

              <Reveal delay={0.8} scale={0.95} duration={1.2}>
                <GiftModal />
              </Reveal>
            </div>
          </section>

          {/* Guestbook Section — Vintage Parchment */}
          <section id="wishes" className="relative overflow-hidden">
            {/* Clean White background */}
            <div className="absolute inset-0 bg-[#FFFFFF] z-0" />
            <div className="absolute inset-0 pointer-events-none z-[1] opacity-10 overflow-hidden scale-110 botanical-tint">
              <img src="/images/flower-tema-31.webp" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-texture opacity-[0.12] pointer-events-none z-[2]" />
            <div className="absolute inset-0 pointer-events-none z-[3]" style={{ boxShadow: 'inset 0 0 80px rgba(77,52,45,0.04)' }} />

            {/* Section Header */}
            <div className="relative z-10 pt-20 pb-8 px-6">
              <Reveal y={20} duration={1.5}>
                <div className="text-center space-y-6 max-w-sm mx-auto">
                  <p className="outfit-font text-[9px] lg:text-[9px] uppercase tracking-[0.5em] text-[#9B9879] font-bold">Guest Book</p>

                  <div className="flex items-center justify-center gap-4">
                    <div className="flex-1 h-[0.5px] bg-gradient-to-r from-transparent to-[#9B9879]/25" />
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <Heart size={12} className="text-[#9B9879]" />
                    </motion.div>
                    <div className="flex-1 h-[0.5px] bg-gradient-to-l from-transparent to-[#9B9879]/25" />
                  </div>

                  <h2 className="italiana-font text-4xl md:text-5xl lg:text-4xl text-[#54543E] leading-tight">
                    Wedding Wishes
                  </h2>

                  <div className="flex items-center justify-center gap-4">
                    <div className="flex-1 h-[0.5px] bg-gradient-to-r from-transparent to-[#9B9879]/25" />
                    <div className="w-1.5 h-1.5 rotate-45 border border-[#9B9879]/40" />
                    <div className="flex-1 h-[0.5px] bg-gradient-to-l from-transparent to-[#9B9879]/25" />
                  </div>

                  <p className="serif-font italic text-[13px] text-[#4D342D]/75 leading-relaxed">
                    Berikan doa dan harapan terbaik untuk kami berdua
                  </p>
                </div>
              </Reveal>
            </div>

            <div className="relative z-10 px-3 md:px-6 pb-20">
              <Guestbook guestName={guestName} />
            </div>
          </section>

          {/* Prayer Section */}
          <section className="py-20 md:py-28 px-6 md:px-8 relative overflow-hidden flex items-center justify-center min-h-[480px] md:min-h-[620px]">
            {/* Gallery Smooth Sliding Slideshow Background */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-black">
              <AnimatePresence initial={false}>
                <motion.img
                  key={currentGalleryIndex}
                  src={WEDDING_CONFIG.galleryImages[currentGalleryIndex % WEDDING_CONFIG.galleryImages.length]}
                  initial={{ x: "100%", scale: 1.05 }}
                  animate={{ x: "0%", scale: 1 }}
                  exit={{ x: "-100%", scale: 0.98 }}
                  transition={{ duration: 1.8, ease: [0.25, 1, 0.5, 1] }}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
              </AnimatePresence>
              {/* Pure Black Opacity Overlay for Optimal Readability */}
              <div className="absolute inset-0 bg-black/65 z-10" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/45 to-black/80 z-10" />
              <div className="absolute inset-0 bg-texture opacity-[0.06] mix-blend-overlay z-10 pointer-events-none" />
            </div>

            <div className="relative z-10 max-w-2xl mx-auto text-center space-y-8">
              <div className="text-center flex flex-col items-center mb-10 relative z-10">
                <Reveal y={20} duration={1.5}>
                  <div className="flex items-center justify-center gap-5 mb-5 w-full max-w-[280px]">
                    <div className="flex-1 h-[0.5px] bg-[#DDCCB7]/40" />
                    <svg width="16" height="16" viewBox="0 0 448 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="text-[#DDCCB7]">
                      <path d="M352 64A64 64 0 1 0 224 64a64 64 0 1 0 128 0zM232.7 264l22.9 31.5c6.5 8.9 16.3 14.7 27.2 16.1s21.9-1.7 30.4-8.7l88-72c17.1-14 19.6-39.2 5.6-56.3s-39.2-19.6-56.3-5.6l-55.2 45.2-26.2-36C253.6 156.7 228.6 144 202 144c-30.9 0-59.2 17.1-73.6 44.4L79.8 280.9c-20.2 38.5-9.4 85.9 25.6 111.8L158.6 432 72 432c-22.1 0-40 17.9-40 40s17.9 40 40 40l208 0c17.3 0 32.6-11.1 38-27.5s-.3-34.4-14.2-44.7L187.7 354l45-90z" />
                    </svg>
                    <div className="flex-1 h-[0.5px] bg-[#DDCCB7]/40" />
                  </div>
                </Reveal>
                <Reveal delay={0.2} y={30} duration={1.5}>
                  <h3 className="italiana-font text-4xl md:text-5xl lg:text-4xl text-[#FFFFFF] drop-shadow-sm mb-6 leading-tight">Do'a Untuk Pengantin</h3>
                </Reveal>
                <Reveal delay={0.4} scale={0.5} duration={1}>
                  <div className="flex items-center justify-center gap-4">
                    <div className="h-[0.5px] w-12 bg-[#DDCCB7]/40" />
                    <div className="w-1.5 h-1.5 rotate-45 border border-[#DDCCB7]/60" />
                    <div className="h-[0.5px] w-12 bg-[#DDCCB7]/40" />
                  </div>
                </Reveal>
              </div>

              <div className="space-y-8 px-4">
                <Reveal delay={0.5} y={20} duration={2}>
                  <p className="text-[18px] sm:text-[22px] md:text-2xl lg:text-3xl text-[#DDCCB7] drop-shadow-md text-center arabic-font whitespace-nowrap" dir="rtl" style={{ lineHeight: '2' }}>
                    بَارَكَ اللهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِيْ خَيْرٍ
                  </p>
                </Reveal>
                <Reveal delay={0.6} y={20} duration={2}>
                  <p className="serif-font text-sm text-white/90 italic leading-relaxed md:leading-loose">
                    "Semoga Allah memberkahimu dan memberkahi apa yang menjadi tanggung jawabmu, serta menyatukan kalian berdua dalam kebaikan."
                  </p>
                </Reveal>
                <Reveal delay={1} y={10} duration={1.5}>
                  <p className="outfit-font text-[10px] text-[#DDCCB7]/80 tracking-widest uppercase">
                    (HR. Ahmad, at-Tirmidzi, dan an-Nasa'i)
                  </p>
                </Reveal>
              </div>
            </div>
          </section>

          {/* Closing Section — Cinematic Fullscreen Background (Matched to User Reference Image) */}
          <section id="closing" className="relative min-h-screen flex flex-col justify-end items-center text-center px-6 pt-24 pb-12 sm:pb-14 overflow-hidden">
            {/* Background Photo: VSF01904.webp */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img
                src={WEDDING_CONFIG.closingBg || "/VSF01904.webp"}
                alt="Putri & Syarif"
                className="w-full h-full object-cover object-[center_24%]"
              />
              {/* Soft cinematic vignette overlay matching user reference image */}
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/5" />
              <div className="absolute inset-0 bg-texture opacity-[0.05] mix-blend-overlay pointer-events-none" />
            </div>

            {/* Content Container (Positioned in lower half over the road/lower photo) */}
            <div className="relative z-10 max-w-lg mx-auto flex flex-col items-center text-center">
              {/* Terima Kasih */}
              <Reveal delay={0.2} y={15} duration={1.2}>
                <h2 className="italiana-font text-[28px] sm:text-[33px] md:text-[36px] text-white font-normal tracking-[0.03em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] mb-3">
                  Terima Kasih
                </h2>
              </Reveal>

              {/* Narrative Thank You Message */}
              <Reveal delay={0.4} y={15} duration={1.3}>
                <p className="outfit-font text-[10px] sm:text-[11.5px] md:text-[12px] text-white/90 leading-[1.85] font-light max-w-[320px] sm:max-w-[360px] mx-auto mb-3.5 sm:mb-4 drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)] px-1">
                  Merupakan suatu kehormatan dan kebahagiaan bagi kami beserta keluarga apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kedua mempelai.
                </p>
              </Reveal>

              {/* Islamic Salutation */}
              <Reveal delay={0.6} y={15} duration={1.3}>
                <p className="serif-font italic font-normal text-[11px] sm:text-[12.5px] text-white/95 mb-6 sm:mb-7 drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
                  Wassalamu'alaikum Warahmatullahi Wabarakatuh
                </p>
              </Reveal>

              {/* Subtitle: KAMI YANG BERBAHAGIA */}
              <Reveal delay={0.8} y={10} duration={1.2}>
                <p className="outfit-font text-[8.5px] sm:text-[9.5px] uppercase tracking-[0.5em] text-white/75 font-light mb-2.5 sm:mb-3 drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">
                  KAMI YANG BERBAHAGIA
                </p>
              </Reveal>

              {/* Couple Names: Putri & Syarif */}
              <Reveal delay={1.0} scale={0.97} duration={1.4}>
                <h3 className="italiana-font text-[30px] sm:text-[36px] md:text-[40px] text-white font-normal tracking-[0.02em] drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)] flex items-center justify-center">
                  Putri &amp; Syarif
                </h3>
              </Reveal>
            </div>
          </section>

          {/* Footer — Compact & Refined */}
          <footer className="py-6 sm:py-8 px-6 text-center bg-[#4A4A37] text-[#DDCCB7]/70 border-t border-[#DDCCB7]/15">
            <Reveal delay={0.1} y={10} duration={1.2}>
              <div className="flex flex-col items-center justify-center space-y-1.5 max-w-sm mx-auto">
                <p className="outfit-font text-[8.5px] uppercase tracking-[0.35em] text-[#DDCCB7]/60 font-medium">
                  Dibuat dengan Cinta oleh
                </p>
                <p className="italiana-font text-[18px] sm:text-[20px] text-[#EDE7DB] tracking-wide font-normal">
                  IT Palugada
                </p>
                <motion.a
                  href={`https://wa.me/${WEDDING_CONFIG.whatsappContact}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="inline-flex items-center gap-1.5 text-[10px] text-[#DDCCB7]/75 hover:text-white transition-colors pt-0.5"
                >
                  <MessageSquare size={11} className="text-[#DDCCB7]/70" />
                  <span>{WEDDING_CONFIG.whatsappContactDisplay}</span>
                </motion.a>
                <p className="outfit-font text-[7.5px] uppercase tracking-[0.25em] text-[#DDCCB7]/35 pt-2">
                  © 2026 IT PALUGADA. ALL RIGHTS RESERVED.
                </p>
              </div>
            </Reveal>
          </footer>
          </div>{/* /portrait-column-inner */}
        </main>
      </div>

      {/* Floating Nav */}
      {isOpen && <FloatingNav />}

      {/* Global Gallery Lightbox */}
      <AnimatePresence>
        {selectedGalleryImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedGalleryImage(null)}
            className="fixed inset-0 z-[3000] bg-primary/95 backdrop-blur-2xl flex items-center justify-center p-6"
          >
            <motion.button
              className="absolute top-10 right-10 text-neutral hover:scale-110 transition-transform"
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedGalleryImage(null)}
            >
              <X size={32} />
            </motion.button>
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              src={WEDDING_CONFIG.galleryImages[selectedGalleryImage]}
              className="max-w-full max-h-[85vh] rounded-[10px] shadow-2xl object-contain border border-white/10"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
              <p className="outfit-font text-[10px] uppercase tracking-[0.5em] text-white/40 font-bold bg-black/20 backdrop-blur-md px-6 py-2 rounded-full border border-white/5">
                Moment {selectedGalleryImage + 1}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};






export default App;
