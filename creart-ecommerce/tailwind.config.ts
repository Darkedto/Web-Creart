import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#f5f1e8',
        paper: '#eee5d3',
        ink: '#0f0f0f',
        ink2: '#222222',
        red: '#e63946',
        yellow: '#ffd23f',
        blue: '#1d4e89',
        green: '#2a9d3f',
        orange: '#f77f00',
        muted: '#6b6557',
      },
      fontFamily: {
        anton: ['Anton', 'sans-serif'],
        archivo: ['"Archivo Black"', 'sans-serif'],
        bowlby: ['"Bowlby One"', 'sans-serif'],
        marker: ['"Permanent Marker"', 'cursive'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        hard: '5px 5px 0 #0f0f0f',
        'hard-sm': '3px 3px 0 #0f0f0f',
        'hard-lg': '8px 8px 0 #0f0f0f',
        'hard-red': '5px 5px 0 #e63946',
        'hard-red-lg': '8px 8px 0 #e63946',
        'hard-yellow': '5px 5px 0 #ffd23f',
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
        float: 'float 4s ease-in-out infinite',
        shake: 'shake 3s ease-in-out infinite',
        stamp: 'stamp 0.5s ease both',
        slideUp: 'slideUp 0.6s ease both',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0) rotate(var(--r, 0deg))' },
          '50%': { transform: 'translateY(-6px) rotate(var(--r, 0deg))' },
        },
        shake: {
          '0%,100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
        stamp: {
          '0%': { transform: 'scale(1.4) rotate(-8deg)', opacity: '0' },
          '50%': { transform: 'scale(0.95) rotate(-3deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(-5deg)', opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
