/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#493628",
        secondary: "#AB886D",
        accent: "#D6C0B3",
        light: "#efe6e1",
        link: "#785f4c",
      },
      screens: {
        xs: "650px",
        sm: "950px",
        md: "1300px",
        lg: "1600px",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
