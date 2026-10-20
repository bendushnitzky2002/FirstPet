// FirstPet shared Tailwind preset. Every prototype imports this so the three
// apps share one visual system. See CLAUDE.md, "Visual system".

/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        navy: '#1F2E4D',
        teal: {
          DEFAULT: '#1F9BA6',
          light: '#E6F0EF',
        },
        orange: '#F0A43C',
        peach: '#FFF3E0',
        body: '#3B475E',
        line: '#DDE3E8',
        canvas: '#FAFBF9',
      },
      fontFamily: {
        heading: ['Nunito', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Nunito Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderColor: {
        DEFAULT: '#DDE3E8',
      },
      borderRadius: {
        card: '1rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(31, 46, 77, 0.04)',
      },
    },
  },
}
