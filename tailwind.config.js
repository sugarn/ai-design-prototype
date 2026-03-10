/**
 * Tailwind CSS Config — Design Tokens
 * Source: Figma · 设计语言（品牌色为点缀色存在）
 * Generated: 2026-03-09
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      // ─── COLORS ───────────────────────────────────────────
      colors: {
        brand: {
          cyan:        '#3AC8DB',
          'cyan-muted':'#3A92B4',
          'cyan-border':'#01C2C3',
          purple:      '#5564EE',
        },
        neutral: {
          0:   '#FFFFFF',
          50:  '#F9FAFB',
          100: '#F3F4F6',
          150: '#F2F3F5',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          600: '#4B5563',
          700: '#374151',
          900: '#111827',
          950: '#000000',
        },
        dark: {
          'bg-base':    '#14151A',
          'bg-raised':  '#1A1A1A',
          'bg-card':    '#2B2C3C',
          'bg-overlay': '#333333',
        },
        status: {
          success: '#22C55E',
          warning: '#FBBF24',
          error:   '#F87171',
        },
      },

      // ─── TYPOGRAPHY ───────────────────────────────────────
      fontFamily: {
        chinese: ['PingFang SC', 'sans-serif'],
        latin:   ['Inter', 'sans-serif'],
        base:    ['Inter', 'PingFang SC', 'sans-serif'],
      },
      fontWeight: {
        regular:  '400',
        medium:   '500',
        semibold: '600',
      },
      fontSize: {
        xs:   ['10px', { lineHeight: '14px',   letterSpacing: '0px' }],
        sm:   ['11px', { lineHeight: '15.4px', letterSpacing: '0px' }],
        base: ['12px', { lineHeight: '16.8px', letterSpacing: '0px' }],
        md:   ['14px', { lineHeight: '19.6px', letterSpacing: '0px' }],
        lg:   ['16px', { lineHeight: '22.4px', letterSpacing: '0px' }],
        xl:   ['18px', { lineHeight: '25.2px', letterSpacing: '0px' }],
        '2xl':['20px', { lineHeight: '28px',   letterSpacing: '0.5px' }],
        '3xl':['24px', { lineHeight: '33.6px', letterSpacing: '0.5px' }],
        hero: ['48px', { lineHeight: '67.2px', letterSpacing: '0px' }],
      },
      letterSpacing: {
        normal: '0px',
        wide:   '0.5px',
      },

      // ─── SPACING ──────────────────────────────────────────
      spacing: {
        '0':  '0px',
        '1':  '2px',
        '2':  '4px',
        '3':  '8px',
        '4':  '12px',
        '5':  '16px',
        '6':  '20px',
        '7':  '24px',
        '8':  '32px',
        '9':  '40px',
        '10': '56px',
        '11': '80px',
        '12': '96px',
        '13': '120px',
        '14': '150px',
      },

      // ─── BORDER RADIUS ────────────────────────────────────
      borderRadius: {
        none: '0px',
        sm:   '4px',
        md:   '6px',
        DEFAULT: '8px',
        lg:   '8px',
        xl:   '12px',
        '2xl':'16px',
        '3xl':'20px',
        full: '1000px',
      },

      // ─── BOX SHADOW ───────────────────────────────────────
      boxShadow: {
        'brand-glow': '0px 0px 3px 0px rgba(58, 200, 219, 0.25)',
        hairline:     '0px 1.2px 1.2px 0px rgba(0, 0, 0, 0.25)',
        sm:           '0px 2px 8px 0px rgba(0, 0, 0, 0.06)',
        DEFAULT:      '0px 6px 16px 0px rgba(0, 0, 0, 0.12)',
        md:           '0px 6px 16px 0px rgba(0, 0, 0, 0.12)',
        lg:           '0px 12px 32px 0px rgba(0, 0, 0, 0.18)',
      },
    },
  },
};
