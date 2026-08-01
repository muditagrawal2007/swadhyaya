/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx,mdx}",
    "./content/**/*.{ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "var(--bg)",
        elev: "var(--bg-elev)",
        card: "var(--bg-card)",
        ink: "var(--ink)",
        dim: "var(--ink-dim)",
        faint: "var(--ink-faint)",
        line: "var(--line)",
        accent: "var(--accent)",
        vector: "var(--vector)",
        matrix: "var(--matrix)",
        transform: "var(--transform)",
        eigen: "var(--eigen)",
        singular: "var(--singular)",
        warn: "var(--warn)",
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui"],
        serif: ["ui-serif", "Georgia", "serif"],
        mono: ["ui-monospace", "JetBrains Mono", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};
