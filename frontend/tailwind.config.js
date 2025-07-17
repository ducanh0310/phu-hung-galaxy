/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './frontend/index.html',
    './frontend/App.tsx',
    './frontend/components/**/*.{js,ts,jsx,tsx}',
    './frontend/hooks/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
