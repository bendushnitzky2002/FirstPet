// FirstPet shared Tailwind preset. Every prototype imports this so the three
// apps share one visual system. See CLAUDE.md, "Visual system".
// Colors, fonts, radii and shadows follow Sala's Figma Make prototypes
// (Customer Persona, Shelter Workspace, Investor/Partner), rebuilt here.

/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#142D4E',
          deep: '#0D213A',
        },
        teal: {
          DEFAULT: '#168C91',
          dark: '#16787C',
          light: '#E7F5F4',
        },
        orange: {
          DEFAULT: '#F47B35',
          dark: '#D85E1B',
          ink: '#A4552D',
        },
        peach: '#FFF0E6',
        body: '#263D58',
        muted: '#687587',
        line: '#DDE3E9',
        canvas: '#F4F6F5',
      },
      fontFamily: {
        heading: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"DM Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderColor: {
        DEFAULT: '#DDE3E9',
      },
      borderRadius: {
        card: '0.75rem',
      },
      boxShadow: {
        card: '0 8px 28px rgba(20, 45, 78, 0.07)',
        cta: '0 7px 20px rgba(244, 123, 53, 0.16)',
      },
    },
  },
}
