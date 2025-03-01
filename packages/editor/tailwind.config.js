/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'aa-blue': '#192740',
        'aa-red': '#A42029',
        'aa-gold': '#D4AF37',
        'aa-gray': '#2F3738',
        prosecution: '#722F37',
        defense: '#1F3163',
        court: '#8B5A2B',
        evidence: '#0F4C81',
        background: {
          DEFAULT: '#0F172A',
          light: '#1E293B',
        },
        border: {
          DEFAULT: '#334155',
          light: '#475569',
        },
        primary: {
          DEFAULT: '#D4AF37',
          hover: '#F7CF4F',
        },
        secondary: {
          DEFAULT: '#A42029',
          hover: '#C42833',
        },
      },
      fontFamily: {
        ace: ['Roboto Condensed', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        aa: '4px',
      },
      boxShadow: {
        evidence: '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
        dialog: '0 10px 30px -5px rgba(0, 0, 0, 0.3)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'text-reveal': {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
        },
        flash: {
          '0%, 50%, 100%': { opacity: 1 },
          '25%, 75%': { opacity: 0.5 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'text-reveal': 'text-reveal 2s ease-out forwards',
        wiggle: 'wiggle 1s ease-in-out',
        shake: 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
        flash: 'flash 0.5s ease infinite',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
};
