import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lock,
  Link as LinkIcon,
  MessageSquare,
  Copy,
  LogOut,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  X,
  Eye,
  EyeOff,
  Smartphone,
  Trash2,
  Search,
  ExternalLink,
  Users,
  Check,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  Send,
  UserCheck,
  UserX,
  HelpCircle,
  Sparkles,
  KeyRound
} from 'lucide-react';

const BASE_URL = window.location.origin;

interface Wish {
  id: string;
  name: string;
  message: string;
  status: 'Hadir' | 'Tidak Hadir' | 'Masih Ragu';
  created_at: string;
  reply: string | null;
}

interface GuestItem {
  id: string;
  name: string;
  url: string;
  category: 'muslim' | 'umum';
  created_at: string;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => sessionStorage.getItem('admin_auth') === 'true');
  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState<'url' | 'wishes'>('url');

  // URL Generator State
  const [guestName, setGuestName] = useState('');
  const [category, setCategory] = useState<'muslim' | 'umum'>('muslim');
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  // Wishes State
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [isLoadingWishes, setIsLoadingWishes] = useState(false);
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [isSubmittingReply, setIsSubmittingReply] = useState<{ [key: string]: boolean }>({});
  const [wishStatusFilter, setWishStatusFilter] = useState<'all' | 'Hadir' | 'Tidak Hadir' | 'Masih Ragu'>('all');

  // Guest Tracker State
  const [invitedGuests, setInvitedGuests] = useState<GuestItem[]>([]);
  const [isLoadingGuests, setIsLoadingGuests] = useState(false);
  const [guestCategoryFilter, setGuestCategoryFilter] = useState<'all' | 'muslim' | 'umum'>('all');

  // Search State
  const [searchGuests, setSearchGuests] = useState('');
  const [searchWishes, setSearchWishes] = useState('');

  // Toast Notifications State
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  };

  // Filtered lists
  const filteredGuests = invitedGuests.filter(g => {
    const matchSearch = g.name.toLowerCase().includes(searchGuests.toLowerCase());
    const matchCategory = guestCategoryFilter === 'all' || g.category === guestCategoryFilter;
    return matchSearch && matchCategory;
  });

  const filteredWishes = wishes.filter(w => {
    const matchSearch =
      w.name.toLowerCase().includes(searchWishes.toLowerCase()) ||
      w.message.toLowerCase().includes(searchWishes.toLowerCase());
    const matchStatus = wishStatusFilter === 'all' || w.status === wishStatusFilter;
    return matchSearch && matchStatus;
  });

  // Pagination State
  const [currentPageGuests, setCurrentPageGuests] = useState(1);
  const [currentPageWishes, setCurrentPageWishes] = useState(1);
  const ITEMS_PER_PAGE_GUESTS = 8;
  const ITEMS_PER_PAGE_WISHES = 8;

  const totalPagesGuests = Math.ceil(filteredGuests.length / ITEMS_PER_PAGE_GUESTS) || 1;
  const startIndexGuests = (currentPageGuests - 1) * ITEMS_PER_PAGE_GUESTS;
  const paginatedGuests = filteredGuests.slice(startIndexGuests, startIndexGuests + ITEMS_PER_PAGE_GUESTS);

  const totalPagesWishes = Math.ceil(filteredWishes.length / ITEMS_PER_PAGE_WISHES) || 1;
  const startIndexWishes = (currentPageWishes - 1) * ITEMS_PER_PAGE_WISHES;
  const paginatedWishes = filteredWishes.slice(startIndexWishes, startIndexWishes + ITEMS_PER_PAGE_WISHES);

  useEffect(() => {
    setCurrentPageGuests(1);
  }, [searchGuests, guestCategoryFilter]);

  useEffect(() => {
    setCurrentPageWishes(1);
  }, [searchWishes, wishStatusFilter]);

  useEffect(() => {
    if (currentPageGuests > totalPagesGuests) {
      setCurrentPageGuests(totalPagesGuests || 1);
    }
  }, [filteredGuests.length, totalPagesGuests, currentPageGuests]);

  useEffect(() => {
    if (currentPageWishes > totalPagesWishes) {
      setCurrentPageWishes(totalPagesWishes || 1);
    }
  }, [filteredWishes.length, totalPagesWishes, currentPageWishes]);

  const handlePageChangeGuests = (action: 'prev' | 'next' | number) => {
    if (action === 'prev') setCurrentPageGuests(prev => Math.max(prev - 1, 1));
    else if (action === 'next') setCurrentPageGuests(prev => Math.min(prev + 1, totalPagesGuests));
    else setCurrentPageGuests(action);
  };

  const handlePageChangeWishes = (action: 'prev' | 'next' | number) => {
    if (action === 'prev') setCurrentPageWishes(prev => Math.max(prev - 1, 1));
    else if (action === 'next') setCurrentPageWishes(prev => Math.min(prev + 1, totalPagesWishes));
    else setCurrentPageWishes(action);
  };

  const getPaginationGroup = (currentPage: number, totalPages: number) => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, '...', totalPages];
    if (currentPage >= totalPages - 2) return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  const fetchGuests = async () => {
    try {
      setIsLoadingGuests(true);
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setInvitedGuests(data);
    } catch (err) {
      console.error('Error fetching guests:', err);
    } finally {
      setIsLoadingGuests(false);
    }
  };

  const addToTracker = async (name: string, url: string, cat: string) => {
    if (!name || !url) return;

    try {
      const { data, error } = await supabase
        .from('guests')
        .insert([{ name, url, category: cat }])
        .select();

      if (error) throw error;
      if (data) setInvitedGuests([data[0], ...invitedGuests]);
    } catch (err) {
      console.error('Error adding guest:', err);
    }
  };

  const removeGuest = async (id: string) => {
    try {
      const { error } = await supabase
        .from('guests')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setInvitedGuests(invitedGuests.filter(g => g.id !== id));
      showToast('Tamu berhasil dihapus dari daftar.', 'success');
    } catch (err) {
      console.error('Error removing guest:', err);
      showToast('Gagal menghapus tamu.', 'error');
    }
  };

  const clearAllGuests = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus seluruh riwayat tamu di database?')) return;
    try {
      const { error } = await supabase
        .from('guests')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (error) throw error;
      setInvitedGuests([]);
      showToast('Seluruh riwayat tamu berhasil dihapus.', 'info');
    } catch (err) {
      console.error('Error clearing guests:', err);
      showToast('Gagal menghapus riwayat tamu.', 'error');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode) {
      setError('Silakan masukkan passcode admin.');
      return;
    }

    try {
      setIsLoggingIn(true);
      setError('');
      let isValid = false;

      // Cek passcode dari Supabase settings jika online
      try {
        const { data, error: fetchError } = await supabase
          .from('settings')
          .select('value')
          .eq('key', 'admin_passcode')
          .single();

        if (!fetchError && data && passcode.trim() === data.value.trim()) {
          isValid = true;
        }
      } catch (e) {
        console.warn('Supabase offline or unreachable, checking local fallback:', e);
      }

      // Fallback passcode lokal
      if (!isValid && (passcode.trim() === '221126' || passcode.trim() === 'admin123' || passcode.trim() === 'syarifputri2026')) {
        isValid = true;
      }

      if (isValid) {
        setIsAuthenticated(true);
        sessionStorage.setItem('admin_auth', 'true');
        showToast('Selamat datang di Dashboard Admin!', 'success');
      } else {
        setError('Passcode yang Anda masukkan salah. Silakan coba lagi.');
      }
    } catch (err) {
      console.error('Error authenticating:', err);
      setError('Gagal memvalidasi passcode. Periksa koneksi internet Anda.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_auth');
    setPasscode('');
    showToast('Anda telah keluar dari sesi admin.', 'info');
  };

  const currentUrl = guestName
    ? `${BASE_URL}/?to=${encodeURIComponent(guestName)}`
    : '';

  useEffect(() => {
    setGeneratedUrl(currentUrl);
  }, [guestName, currentUrl]);

  const getDefaultWhatsAppMessage = (name: string, url: string, cat: string) => {
    if (cat === 'muslim') {
      return `Assalamu'alaikum Warahmatullahi Wabarakatuh.\n\nKepada Yth. Bapak/Ibu/Saudara/i\n*${name}*\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Anda untuk menghadiri acara pernikahan kami:\n\n*Putri Andiani & Moch Syarif Hidayat*\n\nInformasi lengkap acara, lokasi, dan RSVP dapat diakses melalui tautan undangan berikut:\n${url}\n\nMerupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir serta memberikan doa restu bagi kedua mempelai.\n\nWassalamu'alaikum Warahmatullahi Wabarakatuh.`;
    }
    return `Kepada Yth. Bapak/Ibu/Saudara/i\n*${name}*\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Anda untuk menghadiri acara pernikahan kami:\n\n*Putri Andiani & Moch Syarif Hidayat*\n\nInformasi lengkap acara, lokasi, dan RSVP dapat diakses melalui tautan undangan berikut:\n${url}\n\nMerupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir serta memberikan doa restu bagi kedua mempelai.\n\nTerima kasih.`;
  };

  const handleCopyUrl = async () => {
    if (!generatedUrl) return;

    const alreadyInvited = invitedGuests.some(
      g => g.name.toLowerCase() === guestName.toLowerCase()
    );

    if (alreadyInvited) {
      showToast('Tamu dengan nama ini sudah pernah dibuat sebelumnya.', 'info');
    }

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(generatedUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = generatedUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedUrl(true);
      showToast('Tautan undangan berhasil disalin!', 'success');
      setTimeout(() => setCopiedUrl(false), 2200);

      if (!alreadyInvited) {
        addToTracker(guestName, generatedUrl, category);
      }
    } catch (err) {
      console.error('Failed to copy URL:', err);
      showToast('Gagal menyalin tautan.', 'error');
    }
  };

  const handleWhatsAppShare = () => {
    if (!generatedUrl || !guestName) return;

    const alreadyInvited = invitedGuests.some(
      g => g.name.toLowerCase() === guestName.toLowerCase()
    );

    if (!alreadyInvited) {
      addToTracker(guestName, generatedUrl, category);
    }

    let text = customMessage;
    if (!text) {
      text = getDefaultWhatsAppMessage(guestName, generatedUrl, category);
    } else {
      text = text.replace(/{nama}/g, guestName).replace(/{url}/g, generatedUrl);
    }

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const sendGuestWa = (gName: string, gUrl: string, gCat: string) => {
    let text = customMessage;
    if (!text) {
      text = getDefaultWhatsAppMessage(gName, gUrl, gCat);
    } else {
      text = text.replace(/{nama}/g, gName).replace(/{url}/g, gUrl);
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const fetchWishes = async () => {
    try {
      setIsLoadingWishes(true);
      const { data, error } = await supabase
        .from('wishes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setWishes(data as Wish[]);
        const replyState: { [key: string]: string } = {};
        data.forEach((w: any) => {
          if (w.reply) replyState[w.id] = w.reply;
        });
        setReplyText(replyState);
      }
    } catch (err) {
      console.error('Error fetching wishes:', err);
      showToast('Gagal mengambil data ucapan.', 'error');
    } finally {
      setIsLoadingWishes(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      if (activeTab === 'wishes') {
        fetchWishes();
      } else if (activeTab === 'url') {
        fetchGuests();
      }
    }
  }, [isAuthenticated, activeTab]);

  const handleReplySubmit = async (wishId: string) => {
    const reply = replyText[wishId];
    if (reply === undefined || reply.trim() === '') return;

    try {
      setIsSubmittingReply(prev => ({ ...prev, [wishId]: true }));
      const { error } = await supabase
        .from('wishes')
        .update({ reply })
        .eq('id', wishId);

      if (error) throw error;

      setWishes(wishes.map(w => w.id === wishId ? { ...w, reply } : w));
      setEditingReplyId(null);
      showToast('Balasan doa berhasil disimpan!', 'success');
    } catch (err) {
      console.error('Error updating reply:', err);
      showToast('Gagal menyimpan balasan.', 'error');
    } finally {
      setIsSubmittingReply(prev => ({ ...prev, [wishId]: false }));
    }
  };

  // =========================================================================
  // VIEW: LOGIN SCREEN (PROFESSIONAL & ELEGAN)
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FBF9F5] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
        {/* Subtle background ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#EDE7DB]/60 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-texture opacity-[0.04] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md bg-white border border-[#E8E2D9] rounded-2xl shadow-[0_16px_40px_-12px_rgba(77,52,45,0.08)] p-8 sm:p-10 relative z-10"
        >
          {/* Header Monogram & Title */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4D342D] to-[#54543E] flex items-center justify-center text-[#EDE7DB] shadow-md border border-[#DDCCB7]/30 mb-4">
              <span className="italiana-font text-2xl font-bold tracking-wider">PS</span>
            </div>
            <p className="outfit-font text-[10.5px] uppercase tracking-[0.35em] text-[#9B9879] font-semibold mb-1">
              THE WEDDING OF PUTRI & SYARIF
            </p>
            <h1 className="italiana-font text-3xl sm:text-[32px] text-[#4D342D] font-normal tracking-wide">
              Portal Administrasi
            </h1>
            <p className="text-xs text-[#6A6A53] mt-1.5 max-w-xs leading-relaxed">
              Silakan masukkan passcode keamanan untuk mengelola daftar tamu dan buku ucapan.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-[#6A6A53] mb-2 outfit-font">
                Passcode Admin
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9B9879]">
                  <KeyRound size={16} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Masukkan passcode..."
                  className="w-full bg-[#FBF9F5] border border-[#E8E2D9] focus:border-[#54543E] rounded-xl pl-10 pr-11 py-3 text-sm text-[#4D342D] placeholder-[#9B9879]/60 focus:outline-none focus:ring-2 focus:ring-[#54543E]/10 transition-all font-medium"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#9B9879] hover:text-[#4D342D] transition-colors"
                  aria-label={showPassword ? 'Sembunyikan passcode' : 'Lihat passcode'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2.5 p-2.5 rounded-lg bg-red-50 border border-red-200/60 text-red-700 text-xs flex items-center gap-2"
                >
                  <X size={14} className="shrink-0 text-red-500" />
                  <span>{error}</span>
                </motion.div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-[#54543E] hover:bg-[#4D342D] text-[#EDE7DB] py-3.5 rounded-xl font-serif text-[12px] font-semibold tracking-widest uppercase transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw size={15} className="animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>

            <div className="pt-2 text-center">
              <a
                href="/"
                className="inline-flex items-center gap-1.5 text-xs text-[#6A6A53] hover:text-[#4D342D] transition-colors py-1 border-b border-transparent hover:border-[#4D342D]/30"
              >
                <ArrowLeft size={13} />
                <span>Kembali ke Halaman Undangan</span>
              </a>
            </div>
          </form>
        </motion.div>

        {/* Footer Note */}
        <p className="text-[11px] text-[#9B9879] mt-6 relative z-10 text-center">
          Sistem Administrasi Undangan Digital Putri & Syarif
        </p>
      </div>
    );
  }

  // =========================================================================
  // VIEW: ADMIN DASHBOARD (PROFESSIONAL & CLEAN)
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#4D342D] font-sans relative overflow-x-hidden pb-20">
      <div className="absolute inset-0 bg-texture opacity-[0.03] pointer-events-none z-0" />

      {/* Top Navbar */}
      <header className="bg-white/90 backdrop-blur-md sticky top-0 z-40 border-b border-[#E8E2D9] shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Brand Logo & Status */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4D342D] to-[#54543E] flex items-center justify-center text-[#EDE7DB] shadow-xs border border-[#DDCCB7]/30">
                <span className="italiana-font text-base font-bold">PS</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h1 className="italiana-font text-lg sm:text-xl text-[#4D342D] leading-tight font-medium">
                    Putri & Syarif
                  </h1>
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live
                  </span>
                </div>
                <span className="outfit-font text-[9.5px] uppercase tracking-[0.25em] text-[#9B9879] font-medium">
                  Admin Workspace
                </span>
              </div>
            </div>

            {/* Top Navigation Actions */}
            <div className="flex items-center gap-3">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#6A6A53] hover:text-[#4D342D] bg-[#FBF9F5] border border-[#E8E2D9] hover:border-[#54543E]/30 px-3.5 py-2 rounded-xl transition-all font-medium"
              >
                <span>Lihat Undangan</span>
                <ExternalLink size={13} />
              </a>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100/70 border border-red-200/60 px-3.5 py-2 rounded-xl transition-all font-medium"
                title="Keluar dari sesi admin"
              >
                <LogOut size={13} />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 space-y-8">
        
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#E8E2D9] pb-4">
          <div className="flex bg-[#F2EDE4] p-1 rounded-xl border border-[#E8E2D9]">
            <button
              onClick={() => setActiveTab('url')}
              className={`px-5 py-2.5 rounded-lg text-xs font-semibold tracking-wider transition-all flex items-center gap-2 ${
                activeTab === 'url'
                  ? 'bg-white text-[#4D342D] shadow-xs font-bold'
                  : 'text-[#6A6A53] hover:text-[#4D342D]'
              }`}
            >
              <LinkIcon size={14} />
              <span>Generator Tautan Tamu</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'url' ? 'bg-[#54543E] text-white' : 'bg-[#E8E2D9] text-[#6A6A53]'
              }`}>
                {invitedGuests.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('wishes')}
              className={`px-5 py-2.5 rounded-lg text-xs font-semibold tracking-wider transition-all flex items-center gap-2 ${
                activeTab === 'wishes'
                  ? 'bg-white text-[#4D342D] shadow-xs font-bold'
                  : 'text-[#6A6A53] hover:text-[#4D342D]'
              }`}
            >
              <MessageSquare size={14} />
              <span>Buku Tamu & Ucapan</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'wishes' ? 'bg-[#54543E] text-white' : 'bg-[#E8E2D9] text-[#6A6A53]'
              }`}>
                {wishes.length}
              </span>
            </button>
          </div>

          <div className="text-xs text-[#9B9879] outfit-font font-medium hidden md:block">
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* TAB 1: URL GENERATOR & GUEST TRACKER */}
        {activeTab === 'url' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Form Generator Column (Left 2 cols) */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6 sm:p-8 shadow-xs">
                  <div className="mb-6">
                    <h2 className="italiana-font text-2xl text-[#4D342D] mb-1 font-medium">
                      Buat Tautan Undangan Khusus
                    </h2>
                    <p className="text-xs text-[#6A6A53] leading-relaxed">
                      Masukkan nama tamu untuk membuat tautan personal dengan salam otomatis via WhatsApp.
                    </p>
                  </div>

                  <div className="space-y-5">
                    {/* Input Nama Tamu */}
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-[#6A6A53] mb-2 outfit-font">
                        Nama Tamu Undangan
                      </label>
                      <input
                        type="text"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="Contoh: Bpk. Bambang & Keluarga"
                        className="w-full bg-[#FBF9F5] border border-[#E8E2D9] focus:border-[#54543E] rounded-xl px-4 py-3 text-sm text-[#4D342D] placeholder-[#9B9879]/60 focus:outline-none focus:ring-2 focus:ring-[#54543E]/10 transition-all font-medium"
                      />
                    </div>

                    {/* Kategori Salam */}
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-[#6A6A53] mb-2 outfit-font">
                        Kategori Salam
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setCategory('muslim')}
                          className={`py-2.5 px-4 rounded-xl text-xs font-semibold transition-all border text-center ${
                            category === 'muslim'
                              ? 'bg-[#54543E] text-[#EDE7DB] border-[#54543E] shadow-xs'
                              : 'bg-[#FBF9F5] text-[#6A6A53] border-[#E8E2D9] hover:border-[#54543E]/30'
                          }`}
                        >
                          Muslim (Salam Islami)
                        </button>
                        <button
                          type="button"
                          onClick={() => setCategory('umum')}
                          className={`py-2.5 px-4 rounded-xl text-xs font-semibold transition-all border text-center ${
                            category === 'umum'
                              ? 'bg-[#54543E] text-[#EDE7DB] border-[#54543E] shadow-xs'
                              : 'bg-[#FBF9F5] text-[#6A6A53] border-[#E8E2D9] hover:border-[#54543E]/30'
                          }`}
                        >
                          Umum (Salam Universal)
                        </button>
                      </div>
                    </div>

                    {/* Custom Pesan WhatsApp */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#6A6A53] outfit-font">
                          Pesan Pengantar WhatsApp (Opsional)
                        </label>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-[#9B9879]">Sisipkan token:</span>
                          <button
                            type="button"
                            onClick={() => setCustomMessage(prev => prev + ' {nama}')}
                            className="text-[10px] bg-[#EDE7DB] hover:bg-[#DDCCB7] text-[#4D342D] px-2 py-0.5 rounded font-mono font-bold transition-colors"
                          >
                            + {'{nama}'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setCustomMessage(prev => prev + ' {url}')}
                            className="text-[10px] bg-[#EDE7DB] hover:bg-[#DDCCB7] text-[#4D342D] px-2 py-0.5 rounded font-mono font-bold transition-colors"
                          >
                            + {'{url}'}
                          </button>
                        </div>
                      </div>
                      <textarea
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value)}
                        placeholder="Kosongkan untuk menggunakan pesan standar yang sopan dan lengkap..."
                        rows={3}
                        className="w-full bg-[#FBF9F5] border border-[#E8E2D9] focus:border-[#54543E] rounded-xl px-4 py-3 text-xs text-[#4D342D] placeholder-[#9B9879]/60 focus:outline-none focus:ring-2 focus:ring-[#54543E]/10 transition-all font-medium resize-none leading-relaxed"
                      />
                      {customMessage && (
                        <button
                          type="button"
                          onClick={() => setCustomMessage('')}
                          className="text-[10px] text-[#9B9879] hover:text-[#4D342D] underline mt-1"
                        >
                          Reset ke pesan default
                        </button>
                      )}
                    </div>

                    {/* Result Actions Card */}
                    <AnimatePresence>
                      {generatedUrl && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pt-4 border-t border-[#E8E2D9] space-y-4"
                        >
                          <div className="p-3.5 bg-[#F2EDE4]/50 rounded-xl border border-[#E8E2D9] flex items-center justify-between gap-3">
                            <span className="text-xs font-mono text-[#54543E] truncate">
                              {generatedUrl}
                            </span>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-[#9B9879] shrink-0">
                              Siap Dibagikan
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <button
                              type="button"
                              onClick={handleCopyUrl}
                              className={`py-3 px-4 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-2 border ${
                                copiedUrl
                                  ? 'bg-[#54543E] text-white border-[#54543E]'
                                  : 'bg-white text-[#4D342D] border-[#E8E2D9] hover:bg-[#FBF9F5]'
                              }`}
                            >
                              {copiedUrl ? <Check size={15} /> : <Copy size={15} />}
                              <span>{copiedUrl ? 'Tersalin ke Clipboard' : 'Salin Tautan'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={handleWhatsAppShare}
                              className="py-3 px-4 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white shadow-xs"
                            >
                              <MessageSquare size={15} />
                              <span>Buka di WhatsApp</span>
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => setShowPreview(true)}
                            className="w-full py-2.5 rounded-xl text-xs font-medium text-[#6A6A53] hover:text-[#4D342D] bg-[#FBF9F5] border border-[#E8E2D9] lg:hidden flex items-center justify-center gap-1.5"
                          >
                            <Smartphone size={14} />
                            <span>Lihat Tampilan Layar Ponsel</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Desktop Live Smartphone Mockup Column (Right 1 col) */}
              <div className="hidden lg:block space-y-6">
                <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6 shadow-xs sticky top-24">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="italiana-font text-lg font-medium text-[#4D342D]">Live Preview Cover</h3>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#9B9879]">Mobile View</span>
                  </div>

                  {/* Phone Bezel */}
                  <div className="w-full max-w-[260px] mx-auto aspect-[9/18] bg-[#1C1C1E] p-2 rounded-[32px] shadow-xl border-4 border-[#2C2C2E] relative">
                    {/* Speaker notch */}
                    <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-16 h-3.5 bg-black rounded-full z-20" />

                    {/* Screen View */}
                    <div className="w-full h-full rounded-[24px] overflow-hidden relative bg-[#FAF8F5] flex flex-col justify-center items-center text-center">
                      <img
                        src="/gallery/bawah-2.webp"
                        alt="Cover"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/35 backdrop-blur-[0.5px]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />

                      <div className="relative z-10 p-4 w-full flex flex-col items-center text-white">
                        <p className="outfit-font text-[7.5px] uppercase tracking-[0.35em] text-[#EDE7DB] mb-2 font-medium">
                          THE WEDDING OF
                        </p>
                        <h4 className="italiana-font text-2xl font-bold mb-4 drop-shadow-sm text-white">
                          Putri & Syarif
                        </h4>
                        <div className="w-8 h-[1px] bg-[#DDCCB7]/70 mb-4" />
                        
                        <p className="serif-font text-[9px] italic text-[#EDE7DB] mb-1">
                          Kepada Yth. Bapak/Ibu/Saudara/i:
                        </p>
                        <p className="outfit-font text-sm font-bold text-white drop-shadow-md px-2 py-0.5 rounded bg-white/10 backdrop-blur-xs max-w-[200px] truncate">
                          {guestName || 'Nama Tamu'}
                        </p>

                        <div className="mt-6 w-full max-w-[150px]">
                          <div className="py-1.5 px-3 rounded-full bg-white text-[#4D342D] text-[8px] font-bold tracking-widest uppercase shadow-sm">
                            Buka Undangan
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Guest Tracker Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h3 className="italiana-font text-2xl text-[#4D342D] font-medium">
                    Riwayat Tamu Terdaftar
                  </h3>
                  <p className="text-xs text-[#6A6A53]">
                    Daftar seluruh tamu yang telah dibuatkan tautan personal.
                  </p>
                </div>

                {invitedGuests.length > 0 && (
                  <button
                    type="button"
                    onClick={clearAllGuests}
                    className="text-xs text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200/60 px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center gap-1.5"
                  >
                    <Trash2 size={13} />
                    <span>Hapus Semua Riwayat</span>
                  </button>
                )}
              </div>

              {/* Stat Chips Row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white border border-[#E8E2D9] rounded-xl p-3.5 flex flex-col">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#9B9879] outfit-font">Total Tamu</span>
                  <span className="text-xl font-bold text-[#4D342D] mt-0.5">{invitedGuests.length}</span>
                </div>
                <div className="bg-white border border-[#E8E2D9] rounded-xl p-3.5 flex flex-col">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#54543E] outfit-font">Kategori Muslim</span>
                  <span className="text-xl font-bold text-[#54543E] mt-0.5">
                    {invitedGuests.filter(g => g.category === 'muslim').length}
                  </span>
                </div>
                <div className="bg-white border border-[#E8E2D9] rounded-xl p-3.5 flex flex-col">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#6A6A53] outfit-font">Kategori Umum</span>
                  <span className="text-xl font-bold text-[#6A6A53] mt-0.5">
                    {invitedGuests.filter(g => g.category === 'umum').length}
                  </span>
                </div>
              </div>

              {/* Table Container Card */}
              <div className="bg-white border border-[#E8E2D9] rounded-2xl overflow-hidden shadow-xs">
                {/* Search & Category Filter Toolbar */}
                <div className="p-4 border-b border-[#E8E2D9] bg-[#FBF9F5]/40 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="relative w-full sm:w-72">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9B9879] pointer-events-none" />
                    <input
                      type="text"
                      value={searchGuests}
                      onChange={(e) => setSearchGuests(e.target.value)}
                      placeholder="Cari nama tamu..."
                      className="w-full bg-white border border-[#E8E2D9] focus:border-[#54543E] rounded-xl pl-9 pr-3.5 py-2 text-xs text-[#4D342D] placeholder-[#9B9879]/60 focus:outline-none font-medium"
                    />
                  </div>

                  {/* Category Filter Pills */}
                  <div className="flex items-center gap-1.5 w-full sm:w-auto">
                    {(['all', 'muslim', 'umum'] as const).map(cat => (
                      <button
                        key={cat}
                        onClick={() => setGuestCategoryFilter(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                          guestCategoryFilter === cat
                            ? 'bg-[#54543E] text-white shadow-xs'
                            : 'bg-white border border-[#E8E2D9] text-[#6A6A53] hover:bg-[#F2EDE4]'
                        }`}
                      >
                        {cat === 'all' ? 'Semua' : cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Table Content */}
                {isLoadingGuests ? (
                  <div className="py-16 text-center text-xs text-[#9B9879] flex flex-col items-center justify-center gap-2">
                    <RefreshCw size={18} className="animate-spin text-[#54543E]" />
                    <span>Memuat daftar riwayat tamu...</span>
                  </div>
                ) : invitedGuests.length === 0 ? (
                  <div className="py-16 text-center text-xs text-[#9B9879] italic">
                    Belum ada tamu yang diundang. Masukkan nama di atas untuk membuat tautan.
                  </div>
                ) : filteredGuests.length === 0 ? (
                  <div className="py-16 text-center text-xs text-[#9B9879] italic">
                    Tidak ditemukan tamu yang cocok dengan filter atau pencarian "{searchGuests}".
                  </div>
                ) : (
                  <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-[#FBF9F5] text-[10px] font-bold uppercase tracking-[0.2em] text-[#6A6A53] border-b border-[#E8E2D9]">
                            <th className="px-6 py-3.5">Nama Tamu</th>
                            <th className="px-6 py-3.5">Kategori</th>
                            <th className="px-6 py-3.5">Waktu Pembuatan</th>
                            <th className="px-6 py-3.5 text-right">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E8E2D9]/60 text-xs">
                          {paginatedGuests.map((guest) => (
                            <tr key={guest.id} className="hover:bg-[#FBF9F5]/60 transition-colors">
                              <td className="px-6 py-4">
                                <p className="font-semibold text-sm text-[#4D342D]">{guest.name}</p>
                                <p className="font-mono text-[10px] text-[#9B9879] truncate max-w-xs mt-0.5">
                                  {guest.url}
                                </p>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  guest.category === 'muslim'
                                    ? 'bg-[#54543E]/10 text-[#54543E]'
                                    : 'bg-[#9B9879]/15 text-[#4D342D]'
                                }`}>
                                  {guest.category}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-[#6A6A53] outfit-font">
                                {new Date(guest.created_at).toLocaleString('id-ID', {
                                  dateStyle: 'medium',
                                  timeStyle: 'short'
                                })}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => sendGuestWa(guest.name, guest.url, guest.category)}
                                    className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                                    title="Kirim via WhatsApp"
                                  >
                                    <MessageSquare size={14} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={async () => {
                                      await navigator.clipboard.writeText(guest.url);
                                      showToast(`Tautan untuk ${guest.name} berhasil disalin!`);
                                    }}
                                    className="p-2 rounded-lg bg-[#F2EDE4] text-[#4D342D] hover:bg-[#DDCCB7] transition-colors"
                                    title="Salin Tautan"
                                  >
                                    <Copy size={14} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => removeGuest(guest.id)}
                                    className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                    title="Hapus dari daftar"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="block md:hidden divide-y divide-[#E8E2D9]">
                      {paginatedGuests.map((guest) => (
                        <div key={guest.id} className="p-4 space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-semibold text-sm text-[#4D342D]">{guest.name}</p>
                              <p className="text-[10px] text-[#9B9879] mt-0.5">
                                {new Date(guest.created_at).toLocaleString('id-ID', {
                                  dateStyle: 'medium',
                                  timeStyle: 'short'
                                })}
                              </p>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              guest.category === 'muslim'
                                ? 'bg-[#54543E]/10 text-[#54543E]'
                                : 'bg-[#9B9879]/15 text-[#4D342D]'
                            }`}>
                              {guest.category}
                            </span>
                          </div>

                          <div className="p-2 rounded-lg bg-[#FBF9F5] border border-[#E8E2D9] text-[11px] font-mono text-[#6A6A53] break-all">
                            {guest.url}
                          </div>

                          <div className="flex items-center gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => sendGuestWa(guest.name, guest.url, guest.category)}
                              className="flex-1 py-2 rounded-lg bg-[#25D366] text-white text-xs font-semibold flex items-center justify-center gap-1.5"
                            >
                              <MessageSquare size={14} />
                              <span>Kirim WA</span>
                            </button>
                            <button
                              type="button"
                              onClick={async () => {
                                await navigator.clipboard.writeText(guest.url);
                                showToast('Tautan berhasil disalin!');
                              }}
                              className="px-3.5 py-2 rounded-lg bg-[#F2EDE4] text-[#4D342D] text-xs font-semibold flex items-center justify-center"
                              title="Salin Tautan"
                            >
                              <Copy size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeGuest(guest.id)}
                              className="px-3.5 py-2 rounded-lg bg-red-50 text-red-600 text-xs font-semibold flex items-center justify-center"
                              title="Hapus"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPagesGuests > 1 && (
                      <div className="px-6 py-4 border-t border-[#E8E2D9] bg-[#FBF9F5]/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                        <span className="text-[#6A6A53]">
                          Menampilkan <b>{startIndexGuests + 1}</b> - <b>{Math.min(startIndexGuests + ITEMS_PER_PAGE_GUESTS, filteredGuests.length)}</b> dari <b>{filteredGuests.length}</b> tamu
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handlePageChangeGuests('prev')}
                            disabled={currentPageGuests === 1}
                            className="p-1.5 rounded-lg border border-[#E8E2D9] hover:bg-[#F2EDE4] disabled:opacity-30 disabled:hover:bg-transparent"
                            aria-label="Halaman sebelumnya"
                          >
                            <ChevronLeft size={15} />
                          </button>

                          {getPaginationGroup(currentPageGuests, totalPagesGuests).map((p, idx) => (
                            <React.Fragment key={idx}>
                              {p === '...' ? (
                                <span className="px-2 text-[#9B9879]">...</span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handlePageChangeGuests(p as number)}
                                  className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${
                                    currentPageGuests === p
                                      ? 'bg-[#54543E] text-white'
                                      : 'hover:bg-[#F2EDE4] text-[#4D342D]'
                                  }`}
                                >
                                  {p}
                                </button>
                              )}
                            </React.Fragment>
                          ))}

                          <button
                            type="button"
                            onClick={() => handlePageChangeGuests('next')}
                            disabled={currentPageGuests === totalPagesGuests}
                            className="p-1.5 rounded-lg border border-[#E8E2D9] hover:bg-[#F2EDE4] disabled:opacity-30 disabled:hover:bg-transparent"
                            aria-label="Halaman selanjutnya"
                          >
                            <ChevronRight size={15} />
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: WISHES MANAGEMENT */}
        {activeTab === 'wishes' && (
          <div className="space-y-6">
            
            {/* Summary Statistics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white border border-[#E8E2D9] rounded-2xl p-4 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#9B9879] outfit-font block mb-1">
                  Total Ucapan
                </span>
                <span className="text-2xl font-bold text-[#4D342D]">{wishes.length}</span>
              </div>
              <div className="bg-white border border-[#E8E2D9] rounded-2xl p-4 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 outfit-font block mb-1">
                  Konfirmasi Hadir
                </span>
                <span className="text-2xl font-bold text-emerald-700">
                  {wishes.filter(w => w.status === 'Hadir').length}
                </span>
              </div>
              <div className="bg-white border border-[#E8E2D9] rounded-2xl p-4 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 outfit-font block mb-1">
                  Tidak Hadir
                </span>
                <span className="text-2xl font-bold text-rose-700">
                  {wishes.filter(w => w.status === 'Tidak Hadir').length}
                </span>
              </div>
              <div className="bg-white border border-[#E8E2D9] rounded-2xl p-4 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 outfit-font block mb-1">
                  Masih Ragu
                </span>
                <span className="text-2xl font-bold text-amber-700">
                  {wishes.filter(w => w.status === 'Masih Ragu').length}
                </span>
              </div>
            </div>

            {/* Wishes Filter & Search Bar */}
            <div className="bg-white border border-[#E8E2D9] rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9B9879] pointer-events-none" />
                <input
                  type="text"
                  value={searchWishes}
                  onChange={(e) => setSearchWishes(e.target.value)}
                  placeholder="Cari pengirim atau kata dalam ucapan..."
                  className="w-full bg-[#FBF9F5] border border-[#E8E2D9] focus:border-[#54543E] rounded-xl pl-9 pr-3.5 py-2 text-xs text-[#4D342D] placeholder-[#9B9879]/60 focus:outline-none font-medium"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex items-center gap-1">
                  {(['all', 'Hadir', 'Tidak Hadir', 'Masih Ragu'] as const).map(st => (
                    <button
                      key={st}
                      onClick={() => setWishStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        wishStatusFilter === st
                          ? 'bg-[#54543E] text-white shadow-xs'
                          : 'bg-[#FBF9F5] border border-[#E8E2D9] text-[#6A6A53] hover:bg-[#F2EDE4]'
                      }`}
                    >
                      {st === 'all' ? 'Semua' : st === 'Tidak Hadir' ? 'Absen' : st === 'Masih Ragu' ? 'Ragu' : 'Hadir'}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={fetchWishes}
                  disabled={isLoadingWishes}
                  className="p-2 rounded-lg border border-[#E8E2D9] text-[#6A6A53] hover:text-[#4D342D] hover:bg-[#FBF9F5] transition-colors"
                  title="Muat ulang data ucapan"
                >
                  <RefreshCw size={14} className={isLoadingWishes ? 'animate-spin' : ''} />
                </button>
              </div>
            </div>

            {/* Wishes Grid */}
            {isLoadingWishes ? (
              <div className="py-20 text-center text-xs text-[#9B9879] flex flex-col items-center justify-center gap-2 bg-white rounded-2xl border border-[#E8E2D9]">
                <RefreshCw size={20} className="animate-spin text-[#54543E]" />
                <span>Memuat ucapan dan doa restu...</span>
              </div>
            ) : wishes.length === 0 ? (
              <div className="py-20 text-center text-xs text-[#9B9879] bg-white rounded-2xl border border-[#E8E2D9]">
                Belum ada ucapan yang masuk dari tamu undangan.
              </div>
            ) : filteredWishes.length === 0 ? (
              <div className="py-20 text-center text-xs text-[#9B9879] bg-white rounded-2xl border border-[#E8E2D9] italic">
                Tidak ditemukan ucapan dengan pencarian atau filter yang dipilih.
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {paginatedWishes.map((wish) => (
                    <div
                      key={wish.id}
                      className="bg-white border border-[#E8E2D9] rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4"
                    >
                      <div>
                        {/* Header: Name, Status & Date */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <h4 className="font-bold text-base text-[#4D342D] leading-tight">
                              {wish.name}
                            </h4>
                            <p className="text-[10.5px] text-[#9B9879] outfit-font mt-0.5">
                              {new Date(wish.created_at).toLocaleString('id-ID', {
                                dateStyle: 'medium',
                                timeStyle: 'short'
                              })}
                            </p>
                          </div>

                          <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                            wish.status === 'Hadir'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : wish.status === 'Tidak Hadir'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {wish.status === 'Hadir' ? 'Hadir' : wish.status === 'Tidak Hadir' ? 'Tidak Hadir' : 'Masih Ragu'}
                          </span>
                        </div>

                        {/* Message Quote */}
                        <div className="p-4 rounded-xl bg-[#FBF9F5] border border-[#E8E2D9]/70 text-xs sm:text-[13px] serif-font italic text-[#4D342D] leading-relaxed">
                          "{wish.message}"
                        </div>
                      </div>

                      {/* Reply Section */}
                      <div className="pt-2 border-t border-[#E8E2D9]/70 space-y-3">
                        <div className="flex items-center justify-between text-[10.5px] uppercase font-bold tracking-wider text-[#6A6A53] outfit-font">
                          <span>Balasan Kedua Mempelai</span>
                          {wish.reply && editingReplyId !== wish.id && (
                            <button
                              type="button"
                              onClick={() => setEditingReplyId(wish.id)}
                              className="text-[#9B9879] hover:text-[#4D342D] underline normal-case font-medium"
                            >
                              Ubah Balasan
                            </button>
                          )}
                        </div>

                        {/* Existing Reply Display */}
                        {wish.reply && editingReplyId !== wish.id ? (
                          <div className="p-3 bg-[#EDE7DB]/40 rounded-xl border border-[#DDCCB7]/60 text-xs text-[#54543E] leading-relaxed flex items-start gap-2">
                            <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className="font-medium text-[#4D342D]">{wish.reply}</p>
                            </div>
                          </div>
                        ) : (
                          /* Reply Form */
                          <div className="space-y-2">
                            <textarea
                              value={replyText[wish.id] || ''}
                              onChange={(e) => setReplyText({ ...replyText, [wish.id]: e.target.value })}
                              placeholder="Ketik balasan terima kasih untuk ucapan ini..."
                              rows={2}
                              className="w-full bg-[#FBF9F5] border border-[#E8E2D9] focus:border-[#54543E] rounded-xl px-3.5 py-2.5 text-xs text-[#4D342D] placeholder-[#9B9879]/60 focus:outline-none font-medium resize-none leading-relaxed"
                            />
                            <div className="flex items-center justify-end gap-2">
                              {editingReplyId === wish.id && (
                                <button
                                  type="button"
                                  onClick={() => setEditingReplyId(null)}
                                  className="px-3 py-1.5 rounded-lg text-xs text-[#6A6A53] hover:text-[#4D342D]"
                                >
                                  Batal
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleReplySubmit(wish.id)}
                                disabled={isSubmittingReply[wish.id] || !replyText[wish.id]}
                                className="px-4 py-1.5 rounded-lg bg-[#54543E] hover:bg-[#4D342D] text-white text-xs font-semibold transition-all flex items-center gap-1.5 disabled:opacity-50"
                              >
                                {isSubmittingReply[wish.id] ? (
                                  <>
                                    <RefreshCw size={12} className="animate-spin" />
                                    <span>Menyimpan...</span>
                                  </>
                                ) : (
                                  <>
                                    <Send size={12} />
                                    <span>Kirim Balasan</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Wishes Pagination */}
                {totalPagesWishes > 1 && (
                  <div className="bg-white border border-[#E8E2D9] rounded-2xl px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-xs">
                    <span className="text-[#6A6A53]">
                      Menampilkan <b>{startIndexWishes + 1}</b> - <b>{Math.min(startIndexWishes + ITEMS_PER_PAGE_WISHES, filteredWishes.length)}</b> dari <b>{filteredWishes.length}</b> ucapan
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handlePageChangeWishes('prev')}
                        disabled={currentPageWishes === 1}
                        className="p-1.5 rounded-lg border border-[#E8E2D9] hover:bg-[#F2EDE4] disabled:opacity-30 disabled:hover:bg-transparent"
                        aria-label="Halaman sebelumnya"
                      >
                        <ChevronLeft size={15} />
                      </button>

                      {getPaginationGroup(currentPageWishes, totalPagesWishes).map((p, idx) => (
                        <React.Fragment key={idx}>
                          {p === '...' ? (
                            <span className="px-2 text-[#9B9879]">...</span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handlePageChangeWishes(p as number)}
                              className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${
                                currentPageWishes === p
                                  ? 'bg-[#54543E] text-white'
                                  : 'hover:bg-[#F2EDE4] text-[#4D342D]'
                              }`}
                            >
                              {p}
                            </button>
                          )}
                        </React.Fragment>
                      ))}

                      <button
                        type="button"
                        onClick={() => handlePageChangeWishes('next')}
                        disabled={currentPageWishes === totalPagesWishes}
                        className="p-1.5 rounded-lg border border-[#E8E2D9] hover:bg-[#F2EDE4] disabled:opacity-30 disabled:hover:bg-transparent"
                        aria-label="Halaman selanjutnya"
                      >
                        <ChevronRight size={15} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Mobile Live Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs lg:hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-xs bg-white rounded-3xl p-5 shadow-2xl border border-[#E8E2D9] flex flex-col items-center"
            >
              <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-[#E8E2D9]">
                <span className="italiana-font text-base font-bold text-[#4D342D]">Preview Kartu Undangan</span>
                <button
                  type="button"
                  onClick={() => setShowPreview(false)}
                  className="p-1.5 rounded-full hover:bg-[#F2EDE4] text-[#6A6A53]"
                  aria-label="Tutup preview"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="w-full aspect-[9/16] rounded-2xl overflow-hidden relative shadow-inner">
                <img
                  src="/gallery/bawah-2.webp"
                  alt="Cover"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/35" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />

                <div className="relative z-10 p-4 h-full flex flex-col justify-center items-center text-center text-white">
                  <p className="outfit-font text-[7.5px] uppercase tracking-[0.35em] text-[#EDE7DB] mb-2">
                    THE WEDDING OF
                  </p>
                  <h4 className="italiana-font text-2xl font-bold mb-3 text-white">
                    Putri & Syarif
                  </h4>
                  <div className="w-8 h-[1px] bg-[#DDCCB7]/70 mb-3" />
                  
                  <p className="serif-font text-[9px] italic text-[#EDE7DB] mb-1">
                    Kepada Yth. Bapak/Ibu/Saudara/i:
                  </p>
                  <p className="outfit-font text-sm font-bold text-white px-2 py-0.5 rounded bg-white/10 backdrop-blur-xs max-w-[200px] truncate">
                    {guestName || 'Nama Tamu'}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification Stack */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              className={`pointer-events-auto p-4 rounded-xl shadow-lg flex items-center justify-between gap-3 text-xs font-medium border ${
                toast.type === 'error'
                  ? 'bg-red-50 text-red-800 border-red-200'
                  : toast.type === 'info'
                    ? 'bg-[#F2EDE4] text-[#4D342D] border-[#DDCCB7]'
                    : 'bg-white text-[#4D342D] border-emerald-200'
              }`}
            >
              <div className="flex items-center gap-2">
                {toast.type === 'success' && <CheckCircle2 size={15} className="text-emerald-600" />}
                {toast.type === 'error' && <X size={15} className="text-red-600" />}
                {toast.type === 'info' && <Sparkles size={15} className="text-[#9B9879]" />}
                <span>{toast.message}</span>
              </div>
              <button
                type="button"
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                className="text-[#9B9879] hover:text-[#4D342D] transition-colors"
              >
                <X size={13} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Admin;
