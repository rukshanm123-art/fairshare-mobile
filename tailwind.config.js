/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0D0D0D',
          card: '#161616',
          input: '#1C1C1C',
          border: '#262626',
        },
        brand: {
          DEFAULT: '#4ADE80',
          dim: '#166534',
        },
        muted: '#737373',
      },
    },
  },
  plugins: [],
}
