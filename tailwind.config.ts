import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        green: {
          50:  '#EAF3DE',
          100: '#C0DD97',
          200: '#97C459',
          300: '#7BB33A',
          400: '#639922',
          500: '#4E7F16',
          600: '#3B6D11',
          700: '#2E580D',
          800: '#27500A',
          900: '#173404',
        },
        amber: {
          50:  '#FAEEDA',
          100: '#FAC775',
          400: '#BA7517',
          600: '#854F0B',
          800: '#633806',
        },
        teal: {
          50:  '#E1F5EE',
          200: '#5DCAA5',
          600: '#0F6E56',
          800: '#085041',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '8px',
        lg: '12px',
        xl: '16px',
      },
    },
  },
  plugins: [],
}

export default config
