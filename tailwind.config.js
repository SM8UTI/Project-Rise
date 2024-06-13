/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./<custom directory>/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./app/*.js",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./components/*.js",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./drawer/**/*.{js,jsx,ts,tsx}",
    "./drawer/*.js",
    "./drawer/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        primary: ["Urbanist", "sans-serif"],
        primaryItalic: ["UrbanistItalic", "sans-serif"],
      },
      colors: {
        Primary01: "#037bcb",
        Primary02: "#0387df",
        Primary03: "#0387df",
        Primary04: "#3d70ff",
        Primary05: "#6198ff",
        Primary06: "#8dc1ff",
        Primary07: "#b8daff",
        Primary08: "#d8ebff",
        Primary09: "#e9f5ff",
        text: "#8391a1",
        input: "#F7F8F9",
        mainBlack: "#272727",
        bgColor: "#F7F8F9",
        mianRed: "#E75A5A",
      },
    },
  },
  plugins: [],
};
