/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
  // Tailwind CSS v4 configuration
  future: {
    hoverOnlyWhenSupported: true,
  },
};
