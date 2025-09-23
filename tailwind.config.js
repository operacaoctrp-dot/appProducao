/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {
      colors: {
        // Paleta Principal de Laranja
        orange: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316', // Laranja principal
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        
        // Paleta de Cinza Personalizada
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },

        // Cores Semânticas - Sistema de Design
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316', // Cor primária (laranja)
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },

        secondary: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373', // Cor secundária (cinza médio)
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },

        // Cores de Background
        background: {
          primary: '#ffffff',    // Fundo principal (branco)
          secondary: '#fafafa',  // Fundo secundário (cinza muito claro)
          tertiary: '#f5f5f5',   // Fundo terciário (cinza claro)
          dark: '#171717',       // Fundo escuro
        },

        // Cores de Texto
        text: {
          primary: '#171717',    // Texto principal (cinza escuro)
          secondary: '#525252',  // Texto secundário (cinza médio)
          tertiary: '#a3a3a3',   // Texto terciário (cinza claro)
          inverse: '#ffffff',    // Texto inverso (branco)
          accent: '#f97316',     // Texto de destaque (laranja)
        },

        // Cores de Borda
        border: {
          light: '#e5e5e5',     // Borda clara
          medium: '#d4d4d4',     // Borda média
          dark: '#a3a3a3',       // Borda escura
          accent: '#f97316',     // Borda de destaque
        },

        // Estados e Feedback
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },

        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },

        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },

        info: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },

      // Gradientes personalizados
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)',
        'gradient-hero': 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fed7aa 100%)',
        'gradient-dark': 'linear-gradient(135deg, #262626 0%, #171717 100%)',
      },

      // Sombras personalizadas
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'strong': '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 4px 25px -5px rgba(0, 0, 0, 0.1)',
        'orange': '0 4px 25px -5px rgba(249, 115, 22, 0.2), 0 10px 10px -5px rgba(249, 115, 22, 0.1)',
      },

      // Animações personalizadas
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-orange': 'pulseOrange 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseOrange: {
          '0%, 100%': { 
            boxShadow: '0 0 0 0 rgba(249, 115, 22, 0.7)' 
          },
          '70%': { 
            boxShadow: '0 0 0 10px rgba(249, 115, 22, 0)' 
          },
        },
      },

      // Tipografia personalizada
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },

      // Espaçamentos personalizados
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },

      // Bordas arredondadas personalizadas
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
    },
  },
  plugins: [],
}