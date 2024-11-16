import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'background': "#F0F2F5",
        'foreground': "#2C3E50",
        'primary': "#3498DB",
        'secondary': "#AAB7C4",
        'accent': "#E74C3C",
        'button': {
          'hover': "#2980B9",
          'active': "#ECF0F1",
          'voted': "#3498db",
          'default': "#bdc3c7",
          'clear-vote': "#e74c3c",
          'cast-vote': "#2ecc71",
        }
      },
      animation: {
        'spinner': 'spin 1s linear infinite',
      },
    },
  },
  plugins: [],
};
export default config;
