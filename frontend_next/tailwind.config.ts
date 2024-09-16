import type { Config } from "tailwindcss";
const { nextui } = require("@nextui-org/react");

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        show: "show .2s ease-in-out",
        close: "close .2s ease-in-out",
      },
      keyframes: {
        show: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      colors: {
        "primary-default": "#0070AD", // Vibrant Blue
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            background: "#FFFFFF",
            "project-gray": "#ECECEC",
            primary: {
              light: "#12ABDB", //Blue
              DEFAULT: "#0070AD", //Vibrant Blue
              dark: "#2B0A3D", //Deep Purple
              100: "#C8F5FA",
              200: "#94E6F6",
              300: "#5CC6E6",
              400: "#33A1CD",
              500: "#0070AD",
              600: "#005694",
              700: "#00417C",
              800: "#002E64",
              900: "#002053",
            },
            success: {
              DEFAULT: "#95E616", // Zest Green
              100: "#F3FDCF",
              200: "#E3FCA1",
              300: "#CDF771",
              400: "#B7F04D",
              500: "#95E616",
              600: "#77C510",
              700: "#5DA50B",
              800: "#458507",
              900: "#346E04",
            },
            danger: {
              DEFAULT: "#FF304C", //Tech Red
              100: "#FCDDD0",
              200: "#FAB5A2",
              300: "#F18271",
              400: "#E4534D",
              500: "#D31922",
              600: "#B51228",
              700: "#970C2C",
              800: "#7A072C",
              900: "#65042B",
            },
          },
        },
      },
    }),
  ],
};
export default config;
