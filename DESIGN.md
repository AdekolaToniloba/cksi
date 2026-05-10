---
name: CKSI Human-Centered Advocacy
colors:
  surface: '#f9f9ff'
  surface-dim: '#d3daea'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eefe'
  surface-container-high: '#e2e8f8'
  surface-container-highest: '#dce2f3'
  on-surface: '#151c27'
  on-surface-variant: '#59413f'
  inverse-surface: '#2a313d'
  inverse-on-surface: '#ebf1ff'
  outline: '#8d706e'
  outline-variant: '#e1bebc'
  surface-tint: '#b3282c'
  primary: '#af262a'
  on-primary: '#ffffff'
  primary-container: '#d23f40'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb3ae'
  secondary: '#46626f'
  on-secondary: '#ffffff'
  secondary-container: '#c6e4f3'
  on-secondary-container: '#4a6773'
  tertiary: '#605b58'
  on-tertiary: '#ffffff'
  tertiary-container: '#797371'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad7'
  primary-fixed-dim: '#ffb3ae'
  on-primary-fixed: '#410004'
  on-primary-fixed-variant: '#900a18'
  secondary-fixed: '#c9e7f6'
  secondary-fixed-dim: '#adcbda'
  on-secondary-fixed: '#001f29'
  on-secondary-fixed-variant: '#2e4b57'
  tertiary-fixed: '#e9e1dd'
  tertiary-fixed-dim: '#ccc5c2'
  on-tertiary-fixed: '#1e1b19'
  on-tertiary-fixed-variant: '#4a4643'
  background: '#f9f9ff'
  on-background: '#151c27'
  surface-variant: '#dce2f3'
typography:
  headline-xl:
    fontFamily: DM Serif Display
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: DM Serif Display
    fontSize: 36px
    fontWeight: '500'
    lineHeight: 44px
  headline-md:
    fontFamily: DM Serif Display
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 36px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  headline-xl-mobile:
    fontFamily: DM Serif Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  card: 1rem
  card-lg: 1.25rem
  xl: 1.5rem
  pill: 9999px
  icon: 0.5rem
  input: 0.75rem
  full: 9999px
spacing:
  margin-mobile: 1rem
  margin-desktop: 4rem
  gutter: 1.5rem
  stack-sm: 0.5rem
  stack-md: 1.5rem
  stack-lg: 3rem
  section-gap: 6rem
---

## Brand & Style

This design system centers on empathy, credibility, and clarity, specifically tailored for the Nigerian context. It moves away from the sterile, clinical aesthetic often associated with healthcare, instead embracing a "Warm Editorial" style. The brand personality is that of a "Trusted Advocate"—knowledgeable yet approachable, sophisticated yet deeply rooted in community.

The visual direction blends **Minimalism** with **Asymmetric Layouts** to create a sense of movement and modern storytelling. It avoids traditional nonprofit tropes in favor of agency-quality visuals that command respect and attention. By utilizing generous whitespace and high-quality typography, the design system ensures that critical medical information is digestible while maintaining an emotional connection with families and donors.

## Colors

The color palette is grounded in a warm, inviting foundation to reduce "hospital anxiety" and foster a sense of hope.

- **Primary Red (#E24B4A):** Used intentionally for calls to action, urgent statistics, and branding accents. It is a warm red, signaling vitality rather than alarm.
- **Light Blue (#C8E6F5):** Employed for large section backgrounds to provide visual "breathing room" and a sense of calm.
- **Near Black (#1C1917):** Reserved for high-contrast moments, footers, and primary headers to establish authority and weight.
- **Warm White (#FAF8F5):** The global background color. This off-white reduces glare on mobile screens and feels more "editorial" and "human" than pure white.
- **Grey (#6B7280):** Specifically tuned for body text to ensure high readability while maintaining a soft, accessible tone.

## Typography

This design system uses a sophisticated typographic pairing to balance tradition with modernity. 

**DM Serif Display** is used for primary headlines. Its literary, high-contrast serif qualities evoke the "editorial" feel of a prestigious publication, providing the credibility required for health advocacy.

**Plus Jakarta Sans** serves as the workhorse for body text, UI elements, and labels. Its friendly, geometric forms ensure maximum legibility on mobile devices, which is critical for the primary Nigerian audience. 

To maintain the editorial rhythm:
- Use large serif headlines to introduce narrative sections.
- Use the sans-serif for functional text and secondary "kicker" headlines.
- Maintain tight tracking on large display text and generous line height for body copy to improve reading endurance.

## Layout & Spacing

The layout philosophy is **Asymmetric and Fluid**. By breaking the standard symmetrical grid, the UI feels more organic and less like a template.

### Grid System
- **Desktop:** 12-column grid with wide 4rem margins. Elements (like images and text blocks) should frequently be offset by 1 or 2 columns to create an asymmetric flow.
- **Mobile:** Single-column fluid layout with 1rem safe margins. Verticality is prioritized, using large imagery to break up text-heavy sections.

### Spacing Rhythm
A "Generous Whitespace" rule applies. Information is grouped into distinct "islands" using large section gaps (6rem+). This prevents cognitive overload, which is essential when explaining complex medical topics like sickle cell disorder.

## Elevation & Depth

To maintain a clean, editorial look, this design system avoids heavy drop shadows. Depth is communicated through **Tonal Layering** and **Subtle Outlines**.

- **Surface Tiers:** Use the Light Blue (#C8E6F5) and Warm White (#FAF8F5) to create depth. A card may sit on a light blue section background with no shadow, distinguished only by its color and a very thin, low-opacity grey border.
- **Interaction Depth:** When a user interacts with a card or button, use a very soft, diffused ambient shadow (10% opacity) or a slight scale-up (1.02x) to indicate lift.
- **Flat Overlays:** Navigation uses a solid white background (#FFFFFF) with a 1px bottom border (#E5E7EB). Glassmorphism is explicitly avoided — the blur effect is GPU-heavy and degrades performance on mid-range Android devices, which represent the primary Nigerian mobile audience.

## Shapes

The shape language is a mix of "Soft" and "Rounded" to reflect the human-centered nature of the organization.

- **Cards & Large Containers:** Use a `12px` to `16px` radius. This significant rounding helps soften the layout and makes the interface feel more approachable.
- **Buttons:** Use a pill shape (border-radius: 9999px).
- **Inputs:** Use an `8px` radius to match buttons, creating a consistent form language.

Images should follow the card's rounding (12-16px) or, for specific editorial impact, use a "contained" shape where one corner is sharp and three are rounded.

## Components

### Buttons
Buttons should be substantial and high-contrast. The primary CTA uses the Primary Red (#E24B4A) with white text. Secondary buttons should use a ghost style (Near Black outline) or the Near Black background for high-priority secondary actions.

### Editorial Cards
Cards are the primary vehicle for storytelling. They should feature generous internal padding (min 24px) and often include a "kicker" (a small, all-caps label in Plus Jakarta Sans) above the main headline.

### Input Fields
Inputs use the Warm White background with a subtle Grey border. On focus, the border transitions to Primary Red to provide clear feedback.

### Stats & Impact Counters
Given the NGO nature, statistics are vital. These should use the Primary Red for the numerical value, set in the DM Serif Display font at a large scale, with a small Plus Jakarta Sans descriptor underneath.

### Mobile Navigation
Mobile navigation uses a top-positioned hamburger menu (☰) that opens a full-screen overlay with an accordion pattern for the three dropdown groups (About / Our Work / Get Involved). The Donate button is always visible at the bottom of the open mobile menu.

---

## Tailwind Color Tokens

These map directly to tailwind.config.ts under 
theme.extend.colors.cksi. Use these token names everywhere 
in components — never use arbitrary hex values like bg-[#E24B4A].

Primary actions & accents:
  red: '#E24B4A'
  red-hover: '#C94040'
  red-light: '#FEE2E2'
  red-muted: '#FEF2F2'

Blue panels & calm zones:
  blue: '#EFF8FD'
  blue-mid: '#C8E6F5'
  blue-dark: '#0C4A6E'

Neutral structure:
  grey: '#6B7280'
  grey-light: '#E5E7EB'
  grey-muted: '#9CA3AF'
  grey-divider: '#F3F4F6'

Page surfaces:
  warm: '#FAF8F5'

Dark sections:
  dark: '#1C1917'
  dark-card: '#242424'
  dark-border: '#2D2D2D'
  dark-surface: '#374151'

Body text:
  body: '#4B5563'

## Section Background Rhythm

Every page alternates section backgrounds in this exact 
order to create visual rhythm as the user scrolls.
Never use the same background color for two consecutive 
sections — this is what separates a designed page from 
a template.

Standard alternation order:
  1. Warm white (#FAF8F5)   — hero and opening sections
  2. Light blue (#EFF8FD)   — calm, informational sections
  3. Warm white (#FAF8F5)   — alternates back to neutral
  4. Near black (#1C1917)   — high-impact: stats, CTAs
  5. Warm white (#FAF8F5)   — returns to neutral before footer
  6. Near black (#1C1917)   — footer

Rules:
- Red (#E24B4A) is NEVER a section background fill
- White (#FFFFFF) is NEVER a page or section background
- Near black (#1C1917) sections contain: stats strips, 
  timelines, volunteer/donor CTAs, and the footer
- Light blue (#EFF8FD) sections contain: about/mission panels, 
  FAQ, partner info, hero panels for inner pages
- Two consecutive dark sections: always put a warm white 
  or light blue section between them

## Eyebrow Labels

Small uppercase labels that sit directly above h1 and h2 
headings to introduce the section context.
This is one of the most repeated patterns on the site.

Style definition:
  font-family: Plus Jakarta Sans
  font-size: 11px
  font-weight: 500
  letter-spacing: 0.12em
  text-transform: uppercase
  color: #E24B4A (on light backgrounds)
  color: #E24B4A (on dark backgrounds — same color works on both)

Usage rules:
- Every major section on every page opens with an eyebrow 
  above the heading
- Never use eyebrow labels below headings or in body copy
- Never use them on card components (only on section level)
- Never bold them — weight 500 is intentional, not 600 or 700

Examples:
  "WHO WE ARE"     → above "Our Story, Our Mission, Our People"
  "OUR PROGRAMS"   → above "Awareness, Testing, and Counseling"
  "TAKE ACTION"    → above "Get Involved with CKSI"
  "WHAT WE DO"     → above "Our Programs"

Tailwind utility class: .eyebrow (defined in globals.css)

## Component Patterns

### Stat blocks
Used in hero sections, stats strips, and impact sections.
  Number: DM Serif Display, large (36–56px), color: #E24B4A
  Label:  Plus Jakarta Sans, 13–14px, color: #9CA3AF
  Always stacked vertically — number above, label below
  On dark sections: label color shifts to rgba(255,255,255,0.5)

### Cards
  Background: #FFFFFF
  Border: 1px solid #E5E7EB
  Border radius: 16px (rounded-card)
  Padding: 24px minimum
  No drop shadows — depth comes from border + bg contrast
  Hover: scale(1.02) transition or border-color shift to 
  #C8E6F5 — never a heavy shadow on hover

### Icon containers
  Small rounded containers that hold Lucide icons
  On light bg: background #FEE2E2, icon color #E24B4A
  On blue bg:  background #C8E6F5, icon color #0C4A6E
  On dark bg:  background rgba(255,255,255,0.1), icon color white
  Size: 36–44px, border-radius: 8px (rounded-icon)

### Section headings
  Always: eyebrow label → h2 (serif) → optional subtext
  h2 color on light bg: #1C1917
  h2 color on dark bg:  #FFFFFF
  Subtext: Plus Jakarta Sans, 16px, #6B7280, max-width 560px
  Centered or left-aligned depending on section layout

## Hard Rules

These rules are non-negotiable and apply to every component, 
page, and layout decision in this project:

Color rules:
- NEVER use #FFFFFF as a page or section background
  Always use #FAF8F5 (bg-cksi-warm) instead
- NEVER use #000000 for any text
  Always use #1C1917 (text-cksi-dark) instead
- NEVER use red (#E24B4A) as a large background fill
  Red appears only in: buttons, stat numbers, eyebrow labels, 
  icon backgrounds (at low opacity), and small accent marks
- NEVER use arbitrary Tailwind values like bg-[#E24B4A]
  Always use the named token: bg-cksi-red

Typography rules:
- DM Serif Display applies to h1, h2, h3 ONLY
  Never on body text, labels, buttons, or captions
- Plus Jakarta Sans is the default for everything else
- Never set headings in font-weight 700 or above — 
  DM Serif Display at weight 400 carries its own visual weight

Component rules:
- Every button is pill-shaped (rounded-pill / border-radius 9999px)
  No exceptions — no 8px radius buttons anywhere on this site
- Use .btn-primary, .btn-ghost, .btn-ghost-white utility 
  classes from globals.css — do not re-declare button styles inline
- Cards never have box-shadow in resting state
  Only use scale(1.02) or border color shift on hover
- No glassmorphism anywhere on the site

Performance rules:
- No backdrop-filter or blur effects — 
  too costly on mid-range Nigerian Android devices
- All fonts load via next/font/google only — 
  no <link> tags, no @import in CSS
- Images always include width, height, and alt attributes
- Use next/image for all images — never a raw <img> tag

Architecture rules:
- "use client" only when the component has: useState, 
  useEffect, event handlers, or browser-only APIs
- Server components by default for everything else
- No inline styles — Tailwind classes only
- No third-party UI component libraries unless already 
  in package.json
