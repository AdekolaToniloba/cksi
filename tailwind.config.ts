import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        cksi: {
          red: '#E24B4A',
          'brand-red': '#AF262A',
          'red-hover': '#C94040',
          'red-light': '#FEE2E2',
          'red-muted': '#FEF2F2',
          blue: '#EFF8FD',
          'blue-mid': '#C8E6F5',
          'blue-dark': '#0C4A6E',
          grey: '#6B7280',
          'grey-light': '#E5E7EB',
          'grey-muted': '#9CA3AF',
          'grey-divider': '#F3F4F6',
          warm: '#FAF8F5',
          'brand-surface': '#F9F9FF',
          dark: '#1C1917',
          'brand-dark': '#151C27',
          'brand-light': '#DCE2F3',
          'dark-card': '#242424',
          'dark-border': '#2D2D2D',
          'dark-surface': '#374151',
          body: '#4B5563',
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        // --- NITHUB BRAND IDENTITY ---
        primary: {
          DEFAULT: "#00A651", // NITHUB Main Green
          foreground: "#FFFFFF",
          // Generated shades for hover states
          50: "#E5F7ED",
          100: "#BDEBD1",
          200: "#92DEB3",
          300: "#63D093",
          400: "#32C172",
          500: "#00A651", // Base
          600: "#008A43",
          700: "#006E35",
          800: "#005328",
          900: "#003A1C",
        },
        secondary: {
          DEFAULT: "#0B1630", // NITHUB Deep Blue
          foreground: "#FFFFFF",
          50: "#E7E8EB",
          100: "#C3C6CC",
          200: "#9CA1AB",
          300: "#757C8C",
          400: "#4F596F",
          500: "#2B3854",
          600: "#0B1630", // Base
          700: "#081024",
          800: "#060B19",
          900: "#03060D",
        },
        // Explicit "Bright" Green for highlights/accents
        accent: {
          DEFAULT: "#20C20E",
          foreground: "#0B1630",
        },

        // --- FEEDBACK COLORS ---
        success: {
          DEFAULT: "#3AD500",
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "#D30B0B", // Main Error Red
          foreground: "#FFFFFF",
          hover: "#DD2C2C", // Lighter Red for hover
          soft: "#F2E0E0", // Background for error alerts
        },

        // --- NEUTRALS (Mapped from your Hues List) ---
        neutral: {
          900: "#222222", // Darkest text
          800: "#3B3B3B",
          700: "#515151",
          600: "#626262",
          500: "#7E7E7E", // Medium grey
          400: "#9E9E9E",
          300: "#B1B1B1",
          200: "#C4C4C4",
          100: "#CFCFCF",
          50: "#E1E1E1", // Lightest background grey
        },

        // --- SHADCN DEFAULTS (Mapped to Brand) ---
        muted: {
          DEFAULT: "#E1E1E1", // Using lightest neutral
          foreground: "#7E7E7E",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#0B1630",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#0B1630",
        },
      },
      fontFamily: {
        serif: ['var(--font-dm-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
      },
      spacing: {
        'section': '6rem',
        'section-sm': '4rem',
        'container-x': '4rem',
        'container-x-mobile': '1rem',
        'gutter': '1.5rem',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        'card': '1rem',
        'card-lg': '1.25rem',
        'pill': '9999px',
        'icon': '0.5rem',
        'input': '0.75rem',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
