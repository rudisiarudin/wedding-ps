# 💍 The Wedding of Putri & Syarif — Digital Wedding Invitation

<div align="center">

![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)

**A premium, animated digital wedding invitation with guest management system.**

*Built with love for Putri Andiani & Moch Syarif Hidayat — Sunday, 22 November 2026* 🤍

[Live Site](https://www.putri-syarif.web.id) · [Report Bug](https://github.com/rudisiarudin/wedding-ps/issues)

---

</div>

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎬 **Cinematic Opening** | Split-screen cover with Lottie accents & guest name personalization |
| 🎵 **Background Music** | Ambient backsound with toggle control; automatically switches to the reception song when the reception starts (11.00 WIB) |
| ⏳ **Live Countdown** | Real-time countdown timer to the wedding day |
| 👫 **Couple Profiles** | Elegant bride & groom cards with photo overlays |
| 📅 **Event Details** | Akad Nikah & Resepsi info with Google Maps & Add to Calendar integration |
| 📖 **Love Story Timeline** | Animated timeline of the couple's journey (2016 — 2026) |
| 📸 **Photo Gallery** | 26 photos from the Bali & jeep prewedding shoots |
| 💌 **Interactive Guestbook** | Real-time guest wishes with attendance status (powered by Supabase) |
| 💝 **Wedding Gift** | Bank transfer (2 BCA accounts) & physical gift information with copy-to-clipboard |
| 📺 **Live Streaming** | YouTube live link for guests who cannot attend in person |
| 🕌 **Islamic Elements** | Bismillah, Quranic verses (QS. Adz-Dzariyat: 49 & QS. Ar-Rum: 21) & wedding prayer (doa pengantin) |
| 🔗 **Personalized Links** | Unique guest URLs via `?to=NamaTamu` parameter |
| 🌐 **Bilingual** | Bahasa Indonesia / English language toggle |
| 📱 **Fully Responsive** | Mobile-first panel with an elegant desktop sidebar layout |
| 🛡️ **Admin Panel** | Dashboard for managing wishes & the guest list (`/admin`) |

## 🖼️ Layout

```
┌──────────────────────────────────────────────────┐
│  Desktop View                                    │
│  ┌────────────────────┬─────────────────────┐    │
│  │                    │                     │    │
│  │   Desktop Sidebar  │  Mobile-like Panel  │    │
│  │   (Prewed Photo    │  (Scrollable        │    │
│  │    + Names + Date) │   Invitation)       │    │
│  │                    │                     │    │
│  │   flex-1           │   invitation panel  │    │
│  └────────────────────┴─────────────────────┘    │
│                                                  │
│  Mobile View                                     │
│  ┌─────────────────────┐                         │
│  │  Full Width Panel   │                         │
│  └─────────────────────┘                         │
└──────────────────────────────────────────────────┘
```

## 🛠️ Tech Stack

- **Framework:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite 6](https://vitejs.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Animation:** [Motion](https://motion.dev/) + [Lottie](https://airbnb.io/lottie/)
- **Database:** [Supabase](https://supabase.com/) (PostgreSQL)
- **Fonts:** Custom fonts served from `public/font/`
- **Icons:** [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Supabase](https://supabase.com/) account (free tier)

### 1. Clone the repository

```bash
git clone https://github.com/rudisiarudin/wedding-ps.git
cd wedding-ps
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Setup Supabase database

Run the SQL script bundled in this repository — [`supabase_schema.sql`](supabase_schema.sql) — in your Supabase SQL Editor. It creates the `wishes` table (guestbook) and the `guests` table (guest list management) with their Row Level Security policies.

### 5. Run development server

```bash
npm run dev
```

Open [http://localhost:3000/?to=NamaTamu](http://localhost:3000/?to=NamaTamu) in your browser.

## 📁 Project Structure

```
wedding-ps/
├── public/
│   ├── font/                 # Custom fonts
│   ├── gallery/              # Gallery photos (atas-*.webp, bawah-*.webp)
│   ├── images/               # Ornaments, verses & section imagery
│   ├── video/                # Prewedding video
│   ├── backsound.mp3         # Background music
│   ├── couple.png            # Couple portrait
│   ├── lottie_birds.json     # Lottie animation data
│   └── lottie_arrow-down.json
├── src/
│   ├── components/
│   │   └── Reveal.tsx        # Scroll-triggered animation wrapper
│   ├── lib/
│   │   ├── i18n.tsx          # ID / EN language provider
│   │   ├── supabase.ts       # Supabase client config
│   │   └── utils.ts          # Utility functions (cn)
│   ├── App.tsx               # Main application (all sections)
│   ├── Admin.tsx             # Admin panel for wishes & guest list
│   ├── config.ts             # Wedding details & asset paths
│   ├── index.css             # Global styles & font faces
│   └── main.tsx              # App entry point & routing
├── .env                      # Environment variables (git-ignored)
├── index.html                # HTML entry point (title & share-preview meta)
├── supabase_schema.sql       # Supabase database schema
├── vercel.json               # Vercel deployment config
├── vite.config.ts
└── package.json
```

## ⚙️ Configuration

All wedding details can be easily customized in [`src/config.ts`](src/config.ts):

```typescript
export const WEDDING_CONFIG = {
  brideName: 'Putri Andiani',
  groomName: 'Moch Syarif Hidayat',
  weddingDate: '22 . 11 . 2026',
  akadTime: '08.30 - 10.00 WIB',
  resepsiTime: '11.00 WIB onwards',
  akadLocationName: 'MI Mihadunal Ula',
  akadLocationAddress: 'Sukatani, Kec. Pacet, Kab. Cianjur, Jawa Barat 43253',
  // ... more options
};
```

## 🌐 Deployment

The live site — [www.putri-syarif.web.id](https://www.putri-syarif.web.id) — is deployed on **Vercel**:

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com/)
3. Add the environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) in the Vercel project settings
4. Deploy — every push to `main` redeploys automatically 🚀

## 🔗 Guest Link Format

Each guest receives a personalized link:

```
https://www.putri-syarif.web.id/?to=Nama+Tamu
```

Example:
- `https://www.putri-syarif.web.id/?to=Budi%20Santoso`
- `https://www.putri-syarif.web.id/?to=Keluarga%20Pak%20Ahmad`

## 📄 License

© 2026 IT Palugada. All rights reserved.

---

<div align="center">

**Made with 💖 by IT Palugada**

*"And of His signs is that He created for you from yourselves mates that you may find tranquillity in them; and He placed between you affection and mercy."*
*(QS. Ar-Rum: 21)*

</div>
