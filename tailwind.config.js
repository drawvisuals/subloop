/** @type {import('tailwindcss').Config} */
import { tokens } from './src/config/tokens.ts';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors
        brand: {
          primary: { ...tokens.colors.brand.primary },
          secondary: { ...tokens.colors.brand.secondary },
        },

        // Foundation colors
        foundation: { ...tokens.colors.foundation },

        // Neutral scale - spread to avoid readonly issues
        neutral: { ...tokens.colors.neutral },

        // Semantic colors
        success: { ...tokens.colors.semantic.success },
        warning: { ...tokens.colors.semantic.warning },
        danger: { ...tokens.colors.semantic.danger },
        information: { ...tokens.colors.semantic.information },

        // Convenience color mappings
        text: { ...tokens.colors.text },
        background: { ...tokens.colors.background },
        border: { ...tokens.colors.border },
      },

      fontFamily: {
        primary: tokens.typography.fontFamily.primary,
        sans: tokens.typography.fontFamily.sans,
      },

      fontSize: {
        ...tokens.typography.fontSize,
      },

      lineHeight: {
        ...tokens.typography.lineHeight,
      },

      fontWeight: {
        ...tokens.typography.fontWeight,
      },

      letterSpacing: {
        ...tokens.typography.letterSpacing,
      },

      spacing: {
        ...tokens.spacing,
      },

      borderRadius: {
        ...tokens.borderRadius,
      },

      boxShadow: {
        ...tokens.shadows,
      },

      screens: {
        ...tokens.breakpoints,
      },
    },
  },
  plugins: [],
}
