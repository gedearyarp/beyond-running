/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "avant-garde": ['"ITC Avant Garde Gothic Pro"', 'sans-serif'],
        "avant-bk": ['ITCAvantGardePro-Bk', 'sans-serif'],
        "avant-bk-obl": ['ITCAvantGardePro-BkObl', 'sans-serif'],
        "avant-bold": ['ITCAvantGardePro-Bold', 'sans-serif'],
        "avant-bold-obl": ['ITCAvantGardePro-BoldObl', 'sans-serif'],
        "avant-demi": ['ITCAvantGardePro-Demi', 'sans-serif'],
        "avant-demi-obl": ['ITCAvantGardePro-DemiObl', 'sans-serif'],
        "avant-md": ['ITCAvantGardePro-Md', 'sans-serif'],
        "avant-md-obl": ['ITCAvantGardePro-MdObl', 'sans-serif'],
        "avant-xlt": ['ITCAvantGardePro-XLt', 'sans-serif'],
        "avant-xlt-obl": ['ITCAvantGardePro-XLtObl', 'sans-serif'],
        "folio-bold": ['FolioStd-Bold', 'sans-serif'],
        "folio-bold-condensed": ['FolioStd-BoldCondensed', 'sans-serif'],
        "folio-extrabold": ['FolioStd-ExtraBold', 'sans-serif'],
        "folio-light": ['FolioStd-Light', 'sans-serif'],
        "folio-medium": ['FolioStd-Medium', 'sans-serif'],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
  plugins: [],
}
