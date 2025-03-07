/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './index.html'
  ],
  theme: {
    extend: {
      colors: {
        // Ace Attorney color palette
        'aa-blue': {
          50: '#e6f0ff',
          100: '#bdd4ff',
          200: '#94b8ff',
          300: '#6b9cff',
          400: '#4280ff',
          500: '#1964ff',
          600: '#1650cc',
          700: '#103c99',
          800: '#0b2866',
          900: '#051433',
        },
        'aa-red': {
          50: '#ffe6e6',
          100: '#ffbdbd',
          200: '#ff9494',
          300: '#ff6b6b',
          400: '#ff4242',
          500: '#ff1919',
          600: '#cc1414',
          700: '#990f0f',
          800: '#660a0a',
          900: '#330505',
        },
        'aa-green': {
          50: '#e6ffe6',
          100: '#bdffbd',
          200: '#94ff94',
          300: '#6bff6b',
          400: '#42ff42',
          500: '#19ff19',
          600: '#14cc14',
          700: '#0f990f',
          800: '#0a660a',
          900: '#053305',
        },
        'aa-yellow': {
          50: '#fffde6',
          100: '#fff9bd',
          200: '#fff694',
          300: '#fff26b',
          400: '#ffef42',
          500: '#ffeb19',
          600: '#ccbc14',
          700: '#998d0f',
          800: '#665e0a',
          900: '#332f05',
        },
        'aa-evidence': '#e7c89d',
        'aa-court-record': '#3e6c9c',
        'aa-dialogue': {
          'wright': '#2b65ad',
          'edgeworth': '#9c2b2b',
          'witness': '#7a572b',
          'judge': '#4b3a56',
        },
        'aa-bg': {
          'court': '#f0e6d8',
          'office': '#e8eff6',
          'detention': '#dcdfe2',
        }
      },
      fontFamily: {
        'ace': ['"Ace Attorney"', 'system-ui', 'sans-serif'],
        'pixel': ['"Press Start 2P"', 'monospace'],
        'dialogue': ['"M PLUS Rounded 1c"', 'sans-serif'],
      },
      boxShadow: {
        'aa-button': '0 4px 0 0 rgba(0, 0, 0, 0.3)',
        'aa-button-pressed': '0 2px 0 0 rgba(0, 0, 0, 0.3)',
        'aa-evidence': '0 5px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.2)',
        'aa-dialogue': '0 4px 15px -3px rgba(0, 0, 0, 0.4)',
      },
      backgroundImage: {
        'scanlines': 'linear-gradient(transparent 50%, rgba(0, 0, 0, 0.1) 50%)',
        'objection': 'url("/assets/images/ui/objection.png")',
        'holdit': 'url("/assets/images/ui/holdit.png")',
        'takethat': 'url("/assets/images/ui/takethat.png")',
        'noise': 'url("/assets/images/ui/noise.png")',
      },
      animation: {
        'typing': 'typing 2s steps(40, end)',
        'blink': 'blink 1s step-end infinite',
        'shake': 'shake 0.5s linear',
        'flash': 'flash 0.5s ease-in-out',
        'slam': 'slam 0.3s cubic-bezier(0.5, 0, 0.75, 0)',
        'objection': 'objection 2s ease forwards',
      },
      keyframes: {
        typing: {
          'from': { width: '0' },
          'to': { width: '100%' }
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' }
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' }
        },
        flash: {
          '0%, 50%, 100%': { opacity: '1' },
          '25%, 75%': { opacity: '0' }
        },
        slam: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        objection: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '50%': { transform: 'scale(1.2)', opacity: '1' },
          '70%': { transform: 'scale(0.9)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        }
      },
      backgroundSize: {
        'scanlines-sm': '100% 2px',
        'scanlines-md': '100% 3px',
        'scanlines-lg': '100% 4px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('tailwindcss-animate')
  ],
}