module.exports = {
  port: 3000,
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  preview: {
    port: 3000,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@radix-ui/react-dialog', '@radix-ui/react-tooltip'],
  },
} 