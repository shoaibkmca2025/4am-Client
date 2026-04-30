# 4AM Global Media — World-Class Scroll Animation Upgrade

## Current State Assessment

Based on full visual testing of the website, here's the current status:

### ✅ What's Working Well
- Hero section loads with GSAP stagger entrance — WE BUILD / GROWTH / THROUGH / DIGITAL
- Marquee strips animate horizontally with scroll-velocity boost
- Stats counter animation on scroll into view
- RevealText word-by-word scroll-triggered reveals
- Framer Motion `whileInView` stagger for services, process, trends
- Scroll-linked parallax ghost words (IMPACT, SERVICES, PROCESS, NETWORK, INSIGHTS)
- Ring rotation scrub in Global Network section
- Film grain overlay for texture
- Magnetic cursor with hover enlarge (desktop)

### ⚠️ Current Issues Identified

| Issue | Location | Impact |
|-------|----------|--------|
| **Projects heading ("OUR WORK") invisible** — `autoAlpha: 0` not triggered because scroll-trigger start is too late | Projects.tsx | Major — entire heading is invisible |
| **Large empty black gaps** between sections where GSAP `autoAlpha: 0` content hasn't triggered yet | Multiple sections | Makes site look broken/empty when scrolling fast |
| **No Lenis smooth scroll** — SmoothScroll.tsx no longer uses Lenis despite `lenis` being in package.json | SmoothScroll.tsx | Scroll feels jerky/native |
| **MagneticCursor removed from App.tsx** — custom cursor not rendering | App.tsx | Feature missing |
| **Project card images all grayscale** with heavy black overlay — feels dull | Projects.tsx | Visual quality |

---

## Proposed Animations to Add (World-Class Level)

These are the animations that top agencies like Dentsu, Basic/Agency, Awwwards-winning sites use. Organized by **section** and **priority**.

> [!IMPORTANT]
> This is a comprehensive upgrade plan. Approve it and I'll implement everything in order.

---

### 1. 🌊 Lenis Smooth Scroll (Foundation)
**File:** `SmoothScroll.tsx`
- Re-enable Lenis smooth scrolling (already in `package.json`)
- Buttery-smooth 120fps scroll interpolation
- This is the **foundation** — every scroll animation feels better with Lenis

---

### 2. 🎬 Hero Section — Cinematic Entrance
**File:** `Hero.tsx`
- **Split-text character animation** — each letter of "WE BUILD" reveals individually with spring physics
- **Scroll-linked title scaling** — as user scrolls down, hero text scales down from 100% → 85% while fading
- **Horizontal parallax layers** — badge, title, subtitle move at different speeds creating depth
- **Gradient color shift** — the "GROWTH" stroke text smoothly shifts hue on scroll (white → cyan → back)

---

### 3. ⚡ Page Load Sequence
**File:** `App.tsx`, new `Preloader.tsx`
- **Branded preloader** — "4AM" text with a progressive bar, then curtain-wipe reveal
- **Staggered entrance** — Navbar slides from top, hero fades up, all with orchestrated timing
- This replaces the current PageTransition which fires on every mount

---

### 4. 📊 Stats Section — Kinetic Numbers
**File:** `Stats.tsx`
- **Individual digit flip animation** — each digit of "120+" flips like an airline departure board (odometer effect)
- **Progress bar fills with elastic overshoot** — bar shoots past target then settles back
- **Hover: stat card lifts** with 3D `perspective` and subtle shadow

---

### 5. 🔄 Process Section — Horizontal Scroll Takeover
**File:** `ProcessSection.tsx`
- **Pin-and-scroll horizontal layout** — section pins to viewport, 4 steps scroll horizontally as user scrolls vertically
- **Active step highlight** — current step card scales up, others dim, step number fills with color
- **Connection line draws** between steps as you progress (SVG path animation)
- This creates a memorable "scroll-jacking" moment that agencies love

---

### 6. 🎯 Services Section — Reveal + Magnetic Hover
**File:** `Services.tsx`
- **Clip-path wipe reveal** — each service row reveals via `clip-path: inset()` sliding from left
- **Cursor-following title** — on hover, service title follows mouse slightly (magnetic effect)
- **Background image peek** — on hover, a related image fades in behind the service text (like Dentsu)

---

### 7. 🖼️ Projects Section — Immersive Gallery
**File:** `Projects.tsx`
- **Image reveal with clip-path** — images wipe in from bottom as they enter viewport
- **Color transition** — images start grayscale, transition to full color on scroll
- **Cursor: "VIEW" label** — custom cursor shows "VIEW" text when hovering project cards
- **Parallax within cards** — image and text move at different scroll speeds
- **Fix: heading visibility** — fix the `autoAlpha` trigger so "OUR WORK" heading appears

---

### 8. 💬 Testimonials — Depth Animation
**File:** `Testimonials.tsx`
- **3D flip transition** — quotes rotate on Y-axis when transitioning (like flipping a card)
- **Text typing effect** — quote text appears character by character with a cursor
- **Background: large animated quotation mark** that rotates slowly on scroll

---

### 9. 🌐 Network Globe — Real 3D Globe
**File:** `NetworkAndTrends.tsx`, `GlobalNetworkBackground.tsx`
- **Replace the CSS ring** with the existing Three.js globe component (already built!)
- **Globe auto-rotates** with city dots glowing
- **Route beams pulse** between connected cities
- This would be the visual centerpiece of the site

---

### 10. 📝 Contact Section — Interactive Form
**File:** `Contact.tsx`
- **Stagger field reveals** — each form field slides up with delay as section enters
- **Focus spotlight** — active input has a glowing underline with gradient animation
- **Submit button: morphing** — button stretches and shows progress spinner, then morphs to checkmark

---

### 11. 🔝 Scroll-to-Top + Progress
**File:** `ScrollProgress.tsx`, `App.tsx`
- **Circular progress ring** around scroll-to-top button instead of linear bar
- **Section indicator dots** on the side (like a page-level navigation with active highlight)

---

### 12. 🎭 Global Micro-Animations
**Files:** `index.css`, various
- **Parallax mouse movement** on hero background elements
- **Scroll velocity-based effects** — marquee speeds up, grain opacity increases on fast scroll
- **Section transition dividers** — animated gradient lines that draw as you scroll past
- **Stagger-reveal for ALL text blocks** — every paragraph/description has subtle blur→clear entrance

---

## Priority Order

| Phase | Items | Impact |
|-------|-------|--------|
| **Phase 1 — Fix & Foundation** | Lenis scroll, fix Projects heading, fix empty gaps | High — fixes bugs |
| **Phase 2 — Hero & Preloader** | Cinematic hero, preloader | High — first impression |
| **Phase 3 — Scroll Takeover** | Horizontal scroll process, clip-path services | High — wow factor |
| **Phase 4 — Project Gallery** | Image reveals, color transition, cursor label | Medium-High |
| **Phase 5 — Globe & Network** | 3D globe integration | Medium — visual centerpiece |
| **Phase 6 — Polish** | Testimonials 3D, contact form, micro-animations | Medium — refinement |

---

## Open Questions

> [!IMPORTANT]
> 1. **Which phases do you want me to implement?** All 6, or specific ones?
> 2. **Horizontal scroll process** — Do you want the pin-and-scroll takeover (immersive but opinionated) or keep the current grid layout?
> 3. **3D Globe** — Should I integrate the existing `GlobalNetworkBackground.tsx` Three.js globe, or keep the lightweight CSS ring?
> 4. **Preloader** — Do you want a branded loading screen, or skip it for instant content?

## Verification Plan

### Automated Tests
- Visual testing via browser screenshots at each section
- Scroll through entire page recording to verify animations trigger correctly
- Check no console errors
- Verify reduced-motion fallbacks

### Manual Verification
- Test on different viewport sizes (mobile, tablet, desktop)
- Check animation performance (should be 60fps)
