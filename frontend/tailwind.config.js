/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#493628",
        secondary: "#AB886D",
        accent: "#D6C0B3",
        light: "#E4E0E1",
      },
    },
  },
  plugins: [],
};
