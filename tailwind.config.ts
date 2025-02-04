import type { Config } from "tailwindcss";

export default {
  important: true,
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
        //before ppt
        // themeLight:"#F8F4E3",
        // themeSemiLight:"#D4CDC3",
        // themeReg:"#946846",
        // themeSemiDark: "#535014",
        // themeDark: "#3A3703"

        //after ppt
        themeLight:"#FFFFFF",
        themeSemiLight:"#EAEAE4",
        themeReg:"#D3A684",
        themeSemiDark: "#95A392",
        themeDark: "#606F63"
      },
      fontFamily:{
        theseasons: "var(--font-theseasons)",
        bevietnam: "var(--font-bevietnam)",
        modelsignature: "var(--font-modelsignature)",
        zapfino:"var(--font-zapfino)"
      }
    },
  },
  plugins: [],
} satisfies Config;
