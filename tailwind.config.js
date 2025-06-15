/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0F0F0F',
        title: '#FFFFFF',
        subtitle: '#8E8E93',
        inputPlaceholder: '#808080',
        inputBackground: '#242426',
        inputBorder: '#39383D',
        valueUp: '#28B45F',
        lime: '#ebff92',
        icon: '#A9A8AD',
        "top-blue": "#0174E7",
        "top-orange": "#FE6301",
        'input-bg': '#F5F5F5',
        'placeholder': '#808080'

      },

      fontFamily: {
        'sf-black': ['SfProRounded'],
        'sf-bold': ['SfProRoundedBold'],
        'sf-heavy': ['SfProRoundedHeavy'],
        'sf-light': ['SfProRoundedLight'],
        'sf-medium': ['SfProRoundedMedium'],
        'sf-regular': ['SfProRoundedRegular'],
        'sf-semibold': ['SfProRoundedSemibold'],
        'sf-thin': ['SfProRoundedThin'],
        'sf-ultralight': ['SfProRoundedUltraLight'],
      },
    },
  },
  plugins: [],
}
