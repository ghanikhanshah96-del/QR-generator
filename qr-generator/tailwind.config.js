/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './*.html',
    './*/*.html',
    './*/*/*.html',
    './partials/**/*.html',
    './assets/js/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eefbf8',
          100: '#d5f5ee',
          200: '#aeebdd',
          300: '#79d9c7',
          400: '#3fbfaa',
          500: '#1fa392',
          600: '#148577',
          700: '#146b61',
          800: '#15564f',
          900: '#154842',
          950: '#062a27',
        },
        ink: {
          50: '#f4f6f8',
          100: '#e4e8ee',
          200: '#ccd4df',
          300: '#a8b5c7',
          400: '#7e8fa8',
          500: '#5f718c',
          600: '#4a5a73',
          700: '#3d4a5e',
          800: '#353f50',
          900: '#2f3745',
          950: '#0b1020',
        },
        sand: {
          50: '#f7f5f1',
          100: '#efebe3',
          200: '#ddd5c6',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Fraunces"', 'Georgia', 'ui-serif', 'serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgb(11 16 32 / 0.04), 0 10px 28px rgb(11 16 32 / 0.06)',
        panel: '0 1px 0 rgb(11 16 32 / 0.05), 0 18px 50px rgb(11 16 32 / 0.1)',
        preview: '0 24px 60px rgb(11 16 32 / 0.14)',
        glow: '0 0 0 1px rgb(20 133 119 / 0.12), 0 12px 40px rgb(20 133 119 / 0.12)',
      },
      maxWidth: {
        content: '74rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out both',
        'rise-in': 'riseIn 0.5s cubic-bezier(0.22,1,0.36,1) both',
        'preview-in': 'previewIn 0.55s cubic-bezier(0.22,1,0.36,1) both',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        riseIn: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        previewIn: {
          from: { opacity: '0', transform: 'translateY(16px) scale(0.98)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
