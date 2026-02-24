import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#f8f6f1",
        button: "#e4dbe2",
        sage: {
          50: "#f4f6f3",
          100: "#e6ebe3",
          200: "#cfd9cb",
          300: "#aec1a7",
          400: "#8aa380",
          500: "#6b8662",
          600: "#556b4d",
          700: "#45563e",
          800: "#3a4834",
          900: "#323d2d",
        },
      },
      fontFamily: {
        arabic: [
          '"KFGQPC Uthmanic Script HAFS"',
          "var(--font-amiri)",
          "Amiri",
          "serif",
        ],
      },
      transitionDuration: {
        "300": "300ms",
      },
      minHeight: {
        touch: "48px",
      },
    },
  },
  plugins: [],
};

export default config;
