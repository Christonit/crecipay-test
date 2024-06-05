/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontFamily: {
      sans: ['Exo 2', 'sans-serif'],
    },
    colors: {
      slate: {
        100: '#F5F5F5',
        200: '#EBEBEB',
        300: '#E3E3E3',
        500: '#8D8D8D',
        700: '#474747',
        900: '#000000',
      }
    },

  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
