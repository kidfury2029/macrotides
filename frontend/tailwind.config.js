/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html"
    ],
    theme: {
        extend: {
            colors: {
                // Macrotides custom colors
                background: '#05030A',
                surface: '#0C0714',
                'surface-glass': 'rgba(12, 7, 20, 0.4)',
                primary: '#D4AF37',
                'primary-hover': '#F1D570',
                secondary: '#3B0955',
                'secondary-light': '#6B1D8A',
                'text-primary': '#F8F7FA',
                'text-secondary': '#A39BA8',
                'border-gold': 'rgba(212, 175, 55, 0.15)',
                'border-gold-hover': 'rgba(212, 175, 55, 0.30)',
                error: '#CF6679',
                warning: '#F2C94C',
                success: '#27AE60',
                // Shadcn compatibility
                foreground: '#F8F7FA',
                card: {
                    DEFAULT: '#0C0714',
                    foreground: '#F8F7FA'
                },
                popover: {
                    DEFAULT: '#0C0714',
                    foreground: '#F8F7FA'
                },
                muted: {
                    DEFAULT: '#1A1025',
                    foreground: '#A39BA8'
                },
                accent: {
                    DEFAULT: '#3B0955',
                    foreground: '#F8F7FA'
                },
                destructive: {
                    DEFAULT: '#CF6679',
                    foreground: '#F8F7FA'
                },
                border: 'rgba(212, 175, 55, 0.15)',
                input: 'rgba(212, 175, 55, 0.15)',
                ring: '#D4AF37',
            },
            fontFamily: {
                heading: ['Cormorant Garamond', 'serif'],
                body: ['Manrope', 'sans-serif'],
            },
            borderRadius: {
                lg: '0.5rem',
                md: 'calc(0.5rem - 2px)',
                sm: 'calc(0.5rem - 4px)'
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' }
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' }
                },
                'fade-in': {
                    from: { opacity: '0', transform: 'translateY(20px)' },
                    to: { opacity: '1', transform: 'translateY(0)' }
                },
                'slide-in-right': {
                    from: { transform: 'translateX(100%)' },
                    to: { transform: 'translateX(0)' }
                },
                'pulse-gold': {
                    '0%, 100%': { boxShadow: '0 0 0 0 rgba(212, 175, 55, 0.4)' },
                    '50%': { boxShadow: '0 0 0 10px rgba(212, 175, 55, 0)' }
                }
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                'fade-in': 'fade-in 0.5s ease-out forwards',
                'slide-in-right': 'slide-in-right 0.3s ease-out',
                'pulse-gold': 'pulse-gold 2s infinite'
            }
        }
    },
    plugins: [require("tailwindcss-animate")],
};
