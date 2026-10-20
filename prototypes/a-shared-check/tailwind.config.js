import firstpet from '@firstpet/theme/tailwind-preset'

/** @type {import('tailwindcss').Config} */
export default {
  presets: [firstpet],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
}
