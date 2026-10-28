---
name: design-system-the-wedding-of-syarif-putri
description: Implementation-ready design system guidance for The Wedding of Putri & Syarif digital invitation, covering earth palette tokens, typography rules, component behaviors, and accessibility standards.
---

<!-- TYPEUI_SH_MANAGED_START -->

# The Wedding of Putri & Syarif (Digital Invitation Design System)

## Mission
Deliver implementation-ready design-system guidance for The Wedding of Putri & Syarif digital wedding invitation, ensuring visual harmony, timeless botanical-earth aesthetics, accessibility, and smooth responsive behavior across all mobile and desktop devices.

## Brand & Surface
- Product/brand: The Wedding of Putri & Syarif
- Source template: ayurudi.web.id (Re-skinned to Botanical Earth palette)
- Audience: Wedding guests, family, relatives, and invited guests
- Product surface: Responsive Digital Wedding Invitation (mobile-first, centered portrait column)

## Style Foundations
- Visual style: Warm botanical earth, editorial luxury, tactile paper texture, organic typography
- Typography Stack:
  - Display / Headings: `Playfair Display`, `Italiana` (Serif Display)
  - Names / Script: `Charlotte Southern` (Calligraphy Script for couple names)
  - Narrative / Quotes: `Lora` (Book Serif with italics for Quranic verses & love story)
  - UI / Body: `Inter` (Clean sans-serif for body text, forms, and instructions)
  - Badges / Labels / Countdown: `Outfit` (Geometric sans with wide tracking for labels and numbers)
  - Kaligrafi / Doa: `Amiri`, `Lateef` (Arabic script)
- Core Color Palette (Tokens):
  - `color.primary=#6A6A53` (Moss: latar seksi gelap, judul di latar terang, tombol)
  - `color.secondary=#9B9879` (Olive: ornamen garis, divider, aksen sedang)
  - `color.tertiary=#DDCCB7` (Linen: latar kartu lembut, chip dresscode, border lembut)
  - `color.accent=#4D342D` (Mahogany: teks isi utama, tombol primer, penekanan)
  - `color.neutral=#EDE7DB` (Egg Shell: latar terang utama, teks di atas Moss/Mahogany)
  - `color.surface.white=#FFFFFF` (White: kartu & form permukaan)
- Theme Derivatives:
  - `color.primary-deep=#54543E` (Moss pekat: judul & teks di latar terang)
  - `color.ink=#4D342D` (Mahogany: teks isi utama)
  - `color.muted=#6F6C50` (Teks sekunder di latar terang)
  - `color.line=#DDCCB7` (Garis & border lembut)
  - `color.linen-tint=rgba(221, 204, 183, 0.45)` (Latar kartu lembut)
- Texture & Radii:
  - Background texture: Subtle paper fibers (`paper-fibers.webp`)
  - Border radius: `10px` for cards/panels, `9999px` (full pill) for interactive buttons

## Accessibility (WCAG 2.2 AA)
- Contrast Requirements:
  - Mahogany on Egg Shell: ~9.3:1 (passes AAA for normal text)
  - Egg Shell / White on Mahogany: ~9:1 - 11:1 (passes AAA)
  - Moss pekat (`#54543E`) on Egg Shell: ~6:1 (passes AA)
  - Prohibited: Olive (`#9B9879`) for body paragraph text (contrast only ~2.4:1; reserve strictly for lines and decorative elements)
- Touch Targets: Minimum 44x44px hit target for all buttons and interactive controls.
- Keyboard: All actions (audio toggle, RSVP form, copy account number, calendar add, maps link) must be keyboard accessible with visible focus outline.

## Component Specifications
1. **Cover / Hero**:
   - Moss backdrop with delicate Egg Shell botanical line framing.
   - Script calligraphy couple names as largest display text.
   - Primary pill button: Egg Shell background with Mahogany text.
2. **Save The Date / Event Card**:
   - Warm dark glassmorphism (`#1C1815` tint) over outdoor photography with subtle scrim.
   - Inner hairline border (`#DDCCB7]/20`) for authentic stationery feel.
   - Symmetrical session cards (Akad Nikah & Resepsi) with Playfair Display titles and time capsules.
   - Primary action: Google Maps pill button with clear hierarchy.
3. **Amplop Digital (Wedding Gift)**:
   - Soft Linen-tinted card (`#DDCCB7]/45`) with official bank branding preserved.
   - Dedicated "Salin Nomor" button with tactile copy-to-clipboard feedback.
4. **Buku Tamu (Guest Book)**:
   - Vintage paper-fiber texture form.
   - Input borders in Linen, active focus in Moss.
   - Submit action in Mahogany with instant validation and confirmation message.

## Rules: Do
- Adhere strictly to the 5-color earth palette (Moss, Olive, Mahogany, Egg Shell, Linen).
- Retain authentic wedding guest voice and respectful cultural/Islamic etiquette.
- Ensure every button and interactive feature (music player, copy to clipboard, calendar link, RSVP) operates smoothly without dead controls.
- Provide fluid responsiveness across 320px to 1440px+ viewports without horizontal scroll leaks.

## Rules: Don't
- Do not use generic AI-slop palettes (neon blue/purple gradients, generic dark mode without brand intent).
- Do not use Olive for body text where contrast falls below 4.5:1.
- Do not use em dashes in agent copy; use natural punctuation (comma, colon, parentheses).
- Do not introduce arbitrary component sizes or inconsistent radius values.

## Quality Gates
- Every non-negotiable rule must use "must".
- Every recommendation should use "should".
- Every accessibility rule must be testable in implementation.
- Prefer system consistency over local visual exceptions.

<!-- TYPEUI_SH_MANAGED_END -->
