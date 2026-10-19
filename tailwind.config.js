/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0B0D12',
          800: '#1C1F26',
          600: '#4B5160',
          400: '#8A909C',
          200: '#DADDE3',
          100: '#EEF0F3',
          50: '#F6F7F9',
        },
        brand: {
          DEFAULT: '#12B76A',
          50: '#ECFDF3',
          100: '#D1FADF',
          600: '#039855',
          700: '#027A48',
        },
      },
    },
  },
  plugins: [],
};
