/*
/** @type {import('tailwindcss').Config} 
export default {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
}
*/
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        primary: "#00040f",
        secondary: "#00f6ff",
        dimWhite: "rgba(255, 255, 255, 0.7)",
        dimBlue: "rgba(9, 151, 124, 0.1)",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
    screens: {
      xs: "480px",
      ss: "620px",
      sm: "768px",
      md: "1060px",
      lg: "1200px",
      xl: "1700px",
    },
    container: {
      center: true,
      padding: {
        default: "1rem",
        sm: "2rem",
        lg: "3rem",
        xl: "4rem",
      },
    },
    animation: {
      'running-color-1': 'runningColor1 1s linear infinite',
      'running-color-2': 'runningColor2 1s linear infinite',
      'running-color-3': 'runningColor3 1s linear infinite',
    },
    keyframes: {
      runningColor1: {
        '0%': { backgroundColor: '#D3D3D3' }, // Gray
        '50%': { backgroundColor: '#38a169' }, // Green
        '100%': { backgroundColor: '#e53e3e' }, // Red
        
      },
      runningColor2: {
        '0%': { backgroundColor: '#38a169' }, // Green
        '50%': { backgroundColor: '#dd6b20' }, // Orange
        '100%': { backgroundColor: '#e53e3e' }, // Red
      },
      runningColor3: {
        '0%': { backgroundColor: '#D3D3D3' }, // Gray
        '50%': { backgroundColor: '#e53e3e' }, // Red
        '100%': { backgroundColor: '#38a169' }, // Green
      },
    },
  },
  plugins: [],
};

// screens: {
//   xs: "480px",
//   ss: "620px",
//   sm: "768px",
//   md: "1060px",
//   lg: "1200px",
//   xl: "1700px",
// },
