// tailwind.config.js
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'sage': {
          DEFAULT: '#87A878',
          light: '#B4C5AB',
          pale: '#E8F0E3'
        },
        'cream': '#FAF6F0',
        'warm-beige': '#F5EFE7',
        'charcoal': '#2C3E2F',
        'soft-black': '#1A1F1B',
        'accent-coral': '#F4A09C',
        'accent-yellow': '#F7D060'
      },
      fontFamily: {
        'display': ['Instrument Serif', 'serif'],
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        'mono': ['Space Mono', 'monospace']
      },
      animation: {
        'float': 'float 20s ease-in-out infinite',
        'fadeIn': 'fadeIn 0.5s ease-out',
        'slideDown': 'slideDown 0.3s ease-out',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0,0,0,0.05)',
        'medium': '0 10px 40px rgba(0,0,0,0.08)',
        'large': '0 20px 60px rgba(0,0,0,0.12)'
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '24px',
        '4xl': '32px'
      }
    },
  },
  plugins: [],
}
