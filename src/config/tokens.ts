/**
 * Figma Design Tokens
 *
 * Extracted from Figma file: https://www.figma.com/design/R092nwIYAAv67Sj2YheHS0/Subloop
 * All values are extracted directly from Figma design system.
 */

export const tokens = {
  colors: {
    // Brand colors
    brand: {
      primary: {
        100: '#d2f1fa',
        200: '#a5e4f5',
        300: '#78d6f0',
        400: '#4bc9eb',
        500: '#1ebbe6',
        600: '#12708a',
        700: '#093845',
        800: '#06252e',
        900: '#031317',
      },
      secondary: {
        100: '#d2d7fa',
        200: '#bcc3f8',
        300: '#a5aff5',
        400: '#7986f0',
        500: '#1f36e6',
        600: '#1A2AAA',
        700: '#13208a',
        800: '#091045',
        900: '#030517',
      },
    },

    // Foundation colors
    foundation: {
      white: '#ffffff',
      black: '#000000',
    },

    // Neutral scale - darkest to lightest
    neutral: {
      50: '#0B0B0B',
      100: '#101010',
      200: '#1B1B1B',
      300: '#262626',
      400: '#303030',
      500: '#404040',
      600: '#505050',
      700: '#7C7C7C',
      800: '#919191',
      900: '#000000', // Pure black - used for darkest backgrounds (marketing/app main)
    },

    // Semantic colors
    semantic: {
      success: {
        100: '#ccf9e4',
        200: '#99f3c9',
        300: '#66edad',
        400: '#33e792',
        500: '#00e177',
        600: '#00b45f',
        700: '#008747',
        800: '#004424',
        900: '#00170c',
      },
      information: {
        // Note: Information uses similar scale to success in Figma
        500: '#1171EE', // Primary information color
      },
      warning: {
        100: '#f9e1d0',
        200: '#f7d3b9',
        300: '#eea673',
        400: '#e98945',
        500: '#e36b16',
        600: '#b65612',
        700: '#88400d',
        800: '#442007',
        900: '#2d1504',
      },
      danger: {
        100: '#f7d5d5',
        200: '#f3c0c0',
        300: '#e88080',
        400: '#e05656',
        500: '#d82c2c',
        600: '#ad2323',
        700: '#821a1a',
        800: '#561212',
        900: '#2b0909',
      },
    },

    // Commonly used color mappings (from Figma design)
    // Text colors - for dark UI theme
    text: {
      primary: '#ffffff', // foundation.white - primary text on dark backgrounds
      secondary: '#7C7C7C', // neutral.700 - secondary/muted text
      muted: '#7C7C7C', // neutral.700 - muted text
    },

    // Background colors - dark UI theme
    background: {
      primary: '#0B0B0B', // neutral.50 - main dark background
      secondary: '#101010', // neutral.100 - secondary dark background
      card: '#101010', // neutral.100 - card backgrounds
    },

    // Border colors - for dark UI theme
    border: {
      default: '#1B1B1B', // neutral.200 - primary borders
      muted: '#7C7C7C', // neutral.700 - subtle borders
    },
  },

  typography: {
    fontFamily: {
      primary: '"Geist", sans-serif',
      sans: '"Geist", sans-serif',
    },

    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px', // Body medium
      lg: '18px',
      xl: '20px',
      '2xl': '22px',
      '3xl': '24px',
      '4xl': '30px',
      '5xl': '36px',
    },

    lineHeight: {
      tight: '1.25',
      normal: '22px', // Body medium line height
      relaxed: '1.5',
    },

    fontWeight: {
      normal: 400, // Geist:Regular
      medium: 500,
      semibold: 600, // Geist:SemiBold
      bold: 700,
    },

    letterSpacing: {
      tight: '-0.16px', // -1 tracking
      normal: '0',
      wide: '0.5px',
    },

    // Text style mappings from Figma
    textStyles: {
      'button-large': {
        fontFamily: '"Geist", sans-serif',
        fontSize: '16px',
        fontWeight: 600, // SemiBold
        lineHeight: '22px',
        letterSpacing: '0',
      },
      'body-medium': {
        fontFamily: '"Geist", sans-serif',
        fontSize: '16px',
        fontWeight: 400, // Regular
        lineHeight: '22px',
        letterSpacing: '-0.16px',
      },
    },
  },

  spacing: {
    // Spacing scale inferred from component layouts (4px base grid)
    0: '0px',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    7: '28px',
    8: '32px',
    9: '36px',
    10: '40px',
    12: '48px',
    14: '56px',
    16: '64px',
    18: '72px',
    20: '80px',
    24: '96px',
  },

  borderRadius: {
    none: '0px',
    sm: '4px',
    md: '8px',
    lg: '12px', // Used for inputs
    xl: '16px',
    full: '100px', // Used for toggles/switches
  },

  shadows: {
    // Shadows not explicitly shown in extracted design
    // Placeholder for future use
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },

  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const;

/**
 * Helper to validate that tokens are populated
 */
export function validateTokens() {
  const hasColors = Object.keys(tokens.colors).length > 0;
  const hasTypography = Object.keys(tokens.typography).length > 0;

  if (!hasColors || !hasTypography) {
    console.warn(
      '⚠️  Figma tokens not yet populated. ' +
      'Please update src/config/tokens.ts with actual design tokens from Figma.'
    );
  }
}
