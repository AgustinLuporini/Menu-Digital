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
        primary: "#137FEC",
        accent: "#f4af25",
        "background-dark": "#101922",
        "background-light": "#f6f7f8",
      },
      fontFamily: {
        display: ["var(--font-jakarta)", "sans-serif"],
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"), 
    require("@tailwindcss/container-queries")
  ],
};
export default config;