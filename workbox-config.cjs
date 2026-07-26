module.exports = {
  globDirectory: 'dist/',
  globPatterns: [
    '**/*.{css,html,ico,js,json,png,ttf,wasm}',
  ],
  globIgnores: ['**/*.map'],
  swDest: 'dist/sw.js',
  cleanupOutdatedCaches: true,
  clientsClaim: true,
  skipWaiting: true,
  navigateFallback: '/index.html',
  maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
};
