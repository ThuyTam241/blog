module.exports = {
  mode: 'jit',
  content: ['./src/views/**/*.hbs', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: false,
  theme: {
    extend: {},
    colors: {
      primary: '#111F4D',
      secondary: {
        100: '#F3F3F3',
        200: '#FFFFFF',
        300: '#020205',
        400: '#E43A19',
        500: '#F9F9F9',
        600: '#637282',
      },
    },
    fontFamily: {
      Montserrat: ['Montserrat'],
      Hindmadurai: ['Hind Madurai'],
    },
  },
  variants: {},
  plugins: [],
}
