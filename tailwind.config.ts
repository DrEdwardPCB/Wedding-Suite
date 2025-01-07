import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        themeLight:"#FBF6D1",
        themeSemiLight:"#F3D777",
        themeReg:"#6C5A70",
        themeSemiDark: "#A74501",
        themeDark: "#260F05"
      },
      fontFamily:{
        theseasons: ['theseasons'],
        bevietnam: ['bevietnam']
      }
    },
  },
  plugins: [],
} satisfies Config;
