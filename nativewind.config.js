module.exports = {
  tailwindcss: {
    config: './tailwind.config.js',
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
};