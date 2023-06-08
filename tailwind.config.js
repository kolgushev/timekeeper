const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ["./client/index.html", "./client/**/*.tsx"],
  darkMode: 'class',

  theme: {
    screens: {
      'vsm': { 'raw': '(min-height: 640px)' },
      'vmd': { 'raw': '(min-height: 768px)' },
      '2vmd': { 'raw': '(min-height: 896px)' },
      'vlg': { 'raw': '(min-height: 1024px)' },
      'vxl': { 'raw': '(min-height: 1280px)' },
      '2vxl': { 'raw': '(min-height: 1536px)' },
      ...defaultTheme.screens,
    },
    extend: {
      fontFamily: {
        'pop': ['Poppins', 'sans-serif',],
        'ridge': ['Manrope', 'sans-serif']
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
