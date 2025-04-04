module.exports = {
  port: 3000,
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: true,
    target: 'esnext',
  },
  preview: {
    port: 3000,
    host: true,
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@radix-ui/react-dialog',
      '@radix-ui/react-tooltip',
      'date-fns',
      'sonner',
    ],
    exclude: ['lovable-tagger'],
  },
  tagger: {
    include: ['src/**/*.{ts,tsx}'],
    exclude: ['node_modules/**', 'dist/**'],
    tagPrefix: 'data-lovable',
  },
} 