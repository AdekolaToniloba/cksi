# CKSI Project — Agent Rules

## Project
- Next.js App Router, TypeScript, Tailwind CSS
- This is a UI-first rework. Do NOT modify API routes, 
  database logic, or backend files unless explicitly asked.
- Work page by page, component by component. Never refactor 
  multiple pages in one task.

## Design System
- Full design spec is in DESIGN.md — read it before every task
- Brand colors: Red #E24B4A / Light Blue #EFF8FD / 
  Grey #6B7280 / Warm White #FAF8F5 / Near Black #1C1917
- Headlines: DM Serif Display (serif)
- Body + UI: Plus Jakarta Sans (sans-serif)
- Never use pure white (#FFFFFF) as a page background — 
  use #FAF8F5 (warm white) instead
- Never use pure black for text — use #1C1917
- Red is used ONLY for: primary buttons, stat numbers, 
  eyebrow labels, key accents. Never as a section background.

## Component Rules
- Build every UI element as a named, reusable component
- Client components ("use client") only where interactivity 
  is strictly needed — forms, accordions, animations
- Server components by default everywhere else
- No inline styles — Tailwind classes only
- No third-party component libraries (no shadcn, no MUI) 
  unless already in the project

## Tailwind Config
- Extend the config with CKSI brand tokens — do not use 
  arbitrary values like bg-[#E24B4A] everywhere. 
  Define them as: colors.cksi.red, colors.cksi.blue, etc.

## What Not To Touch
- /api/* routes
- /lib/db or any database files  
- Authentication logic
- Environment variables
- package.json (ask before adding dependencies)

## After Each Task
- Run the dev server and confirm no build errors
- Check mobile layout at 375px viewport
- Confirm fonts are loading from next/font/google