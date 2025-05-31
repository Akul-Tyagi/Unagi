/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: '#242124',
        light: '#F8F4FF',
        accent: '#451F55',
        black: {
          DEFAULT: '#242124',
          dark: '#242124',
        },
        gray: {
          DEFAULT: '#1a1a1a',
          dark: '#2a2a2a',
        },
        electricBlue: '#451F55',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
        unagi: ['UnagiFontCustom', 'sans-serif'],
        unagii: ['UnagiFontCustom2', 'sans-serif'],
        unagiii: ['UnagiFontCustom3', 'sans-serif'],
        unagiiii: ['UnagiFontCustom4', 'sans-serif'],
        unagiiiii: ['UnagiFontCustom5', 'sans-serif'],
        unagiiiiii: ['UnagiFontCustom6', 'sans-serif'],
        unagiiiiiii: ['UnagiFontCustom7', 'sans-serif'],
        unagiiiiiiii: ['UnagiFontCustom8', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}