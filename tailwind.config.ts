import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-poppins)", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "var(--mainColor)",
          20: "var(--mainColor20)",
          10: "var(--mainColor10)",
          11: "var(--mainColor11)",
        },
        gold: "var(--goldColor)",
        white: "var(--whiteColor)",
        dark: "var(--darkColor)",
        gray: {
          light: "var(--lightGrayColor)",
          DEFAULT: "var(--grayColor)",
        },
        border: {
          light: "var(--lightBorderColor)",
        },
      },
      boxShadow: {
        DEFAULT: "var(--shadow)",
        big: "var(--BigShadow)",
      },
      transitionProperty: {
        DEFAULT: "var(--transition)",
      },
    },
  },
  plugins: [],
};

export default config;
