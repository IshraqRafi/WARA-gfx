# WARA gfx - Project Development Status & Documentation

**Date:** February 2026
**Project:** WARA gfx Portfolio Website
**Theme:** "Luxury Motion Studio" (Refined Cyberpunk/Tech-Noir Aesthetic - Calm, Confident, Expensive, Dark Mode)

This document serves as the persistent memory of the project's architecture, key features, and development decisions in case the original chat history is lost.

---

## 1. Tech Stack Overview
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animation & Physics:** Framer Motion, GSAP
- **3D & Canvas:** Three.js, `@react-three/fiber`, `@react-three/drei`
- **Smooth Scrolling:** Lenis (`@studio-freight/lenis`)
- **Icons:** `lucide-react`
- **CMS / Data:** Sanity CMS
- **Form Handling:** EmailJS / Resend (via Next.js API route with Zod validation)

---

## 2. Core Features & Micro-Interactions

### Navigation & Global
- **Smart Ring Cursor:** Custom V2 `useCursor` hook. A non-obstructive hollow ring that expands and changes color when hovering interactive elements.
- **Scroll Progress Rail:** A fixed timeline on the right side of the screen mapped to major sections (Welcome, Work, Reviews, Creators, Stats, Uplink).
- **Cinematic Background:** A global 3D Three.js environment providing organic fog, subtle dust/grain, and a dynamic "Fire Particle Sweep" effect that bursts into existence periodically.

### Hero Section (`Hero.tsx`)
- **Boot Sequence:** Terminal-style decryption effect for the main title on load (cycles random characters `W#R@ g&x` before settling on `WARA gfx`).
- **Media Presentation:** Auto-playing `animated_logo.webm` integrated as the central focus.
- **CTA:** "Magnetic Pattern" button effect for the primary action.

### Projects Section (`Projects.tsx` & `ProjectCard.tsx`)
- **Holographic 3D Cards:** Physical reaction to mouse movement (parallax tilt) with a dynamic glare radial gradient tracking the cursor.
- **Cinematic Hue Shift:** Ambient background color dynamically extracts and pulses based on the currently hovered project's associated accent color.
- **Filtering System:** Tabs for organizing work (YouTube, Insta, TikTok, Realms).

### Reviews Section (`Reviews.tsx`)
- **Galaxy Star Scatter:** When hovering over a review card, the 5 rating stars physically explode outward (scatter) and snap back into their sockets one-by-one with staggered timing.
- **Endless Marquee:** Auto-scrolling infinite loop of client testimonials for a fluid UX.

### Founders Section (`Founders.tsx`)
- **Neural Link Spotlights:** Mouse-reactive spotlight background for each founder card.
- **Parallax Depth:** Text and interactive elements float independently from the card background.
- *(Note: Audio effects were tested and subsequently removed from this section for cleaner UX).*

### Stats Section (`Stats.tsx`)
- **Time Travel UI:** Motion-blurred spinning counters.
- **Data Graph:** Smooth, full-width data visualization graph underneath the counters with animated pointer markers displaying milestones per platform.
- **Platform Selectors:** Animated Fabicon-style glowing indicators tied to the active stats view.

### Contact Section (`Contact.tsx`)
- **Holographic HUD:** Glassmorphic panel with "Scanline" borders and a 3D wireframe rotating background grid.
- **Laser Scan Input Form:** Horizontal blue laser scanline triggers top-to-bottom upon focusing on an input field.
- Includes a backend API route (`/api/send`) for transmitting form data securely.

---

## 3. The Audio Engine (`useAudio.ts` Hook)

A custom, robust Web Audio API hook was built to synthesize "Luxury Motion Studio" sounds programmatically directly in the browser, eliminating the need to load heavy `.mp3` assets (except where explicitly required).

**Synthesized Profiles Included:**
- **Ambient Drone:** Deep 55Hz sub-bass hum layered with filtered atmospheric noise (400Hz wide band). Forms the calm background tension.
- **Hero Load:** Soft low "whoom" rise + subtle click.
- **Button Hover:** High-frequency, extremely fast (<100ms) sine drop simulating a "glass tap".
- **Button Click:** "Luxury confirmation" merging a soft low thud (150Hz -> 40Hz) with a fast high-frequency tick.
- **Project Expansion:** Soft airy bandpass sweep matching physical air movement.
- **Scroll Reveal:** Very subtle, almost psycho-acoustic shimmer.
- **Review Star Scatter:** Fast sweeping glassy texture.
- **Review Star Impact:** Sharp descending square-wave clicks (expensive switch snap) when stars return to sockets.
- **Meme Sound Support:** Capability to load external specific `.webm`/`.mp3` files (e.g., specific YouTube short downloads) if requested. *Audio was ultimately disabled on Founder cards.*

**Integration:** Controlled globally via a toggle "AUDIO: ON/OFF" located in the `Footer.tsx`.

---

## 4. Key File Architecture

```
/src
  /app           # Next.js 14 App Router pages (page.tsx, layout.tsx, /api)
  /components
    /layout      # Header, Footer, MainLayout
    /sections    # Hero, Projects, Reviews, Founders, Stats, Contact, CinematicBackground
    /ui          # Reusable components (ProjectCard, Buttons, Custom Cursor)
  /hooks         # useAudio.ts, useScrollProgress.ts
  /sanity        # CMS schema boundaries and API client
```

---

## 5. Deployment Information
- **Hosting:** Vercel (Auto-deploys via GitHub `main` branch).
- **Environment Variables:**
    - Requires Sanity project keys (`NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`).
    - Requires Email provider API keys (e.g., `RESEND_API_KEY`) for the contact form in Production.

---

## Ongoing Polish / Future Ideas
Should development resume, the following areas were designated as minor polish tasks:
- Adjusting instant cursor response speeds (removing physics drag if desired).
- Smoothing out scroll rail transitions.
- Tweaking timing on contact form laser scan animations.
- Link updates: Ensuring the "Secure Line" points to the correct WhatsApp (`wa.me`) and "Email Encryption" invokes the user's mail client natively.
