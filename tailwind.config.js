/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#D2691E',
          light: '#E5935F',
          dark: '#8B4513'
        },
        secondary: {
          DEFAULT: '#8B4513',
          light: '#A0522D',
          dark: '#654321'
        },
        accent: '#FF6B35',
        surface: {
          50: '#FFF8F3',
          100: '#FAF6F2',
          200: '#F5EDE6',
          300: '#EAD5C7',
          400: '#D4B59E',
          500: '#B8956F',
          600: '#A0754B',
          700: '#8B4513',
          800: '#6B340F',
          900: '#4A230A'
        }
      },
      fontFamily: { 
        sans: ['Inter', 'ui-sans-serif', 'system-ui'], 
        heading: ['Outfit', 'ui-sans-serif', 'system-ui'],
        display: ['Outfit', 'ui-sans-serif', 'system-ui']
      },
boxShadow: { 
        soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'neu-light': '5px 5px 15px #d1d9e6, -5px -5px 15px #ffffff',
        'neu-dark': '5px 5px 15px rgba(0, 0, 0, 0.3), -5px -5px 15px rgba(255, 255, 255, 0.05)'
      },
borderRadius: { xl: '0.75rem', '2xl': '1rem' },
      gridTemplateColumns: {
        'sidebar': '280px 1fr',
        'project': '1fr 300px'
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem'
      }
    },
  },
plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
          'scrollbar-color': '#cbd5e1 #f8fafc',
        },
        '.scrollbar-auto': {
          'scrollbar-width': 'auto',
          'scrollbar-color': '#cbd5e1 #f8fafc',
        },
        '.scrollbar-thin-auto': {
          'scrollbar-width': 'thin',
          'scrollbar-color': '#cbd5e1 #f8fafc',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f8fafc',
            'border-radius': '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            'background-color': '#cbd5e1',
            'border-radius': '4px',
            border: '1px solid #f8fafc',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            'background-color': '#94a3b8',
          },
          '&::-webkit-scrollbar-corner': {
            background: '#f8fafc',
          },
        },
        '.scrollbar-thumb-gray': {
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            'background-color': '#cbd5e1',
            'border-radius': '3px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            'background-color': '#94a3b8',
          },
        },
      });
    },
  ],
}