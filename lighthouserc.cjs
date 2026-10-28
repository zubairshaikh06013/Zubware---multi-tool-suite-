module.exports = {
  ci: {
    collect: {
      startServerCommand: 'node scripts/serveSeoBuild.mjs',
      startServerReadyPattern: 'SEO build ready',
      url: ['/', '/category/image-tools', '/image-compressor', '/qr-generator', '/age-calculator', '/blog'].map(p => `http://127.0.0.1:4173${p}`),
      numberOfRuns: 1,
      settings: { chromeFlags: '--no-sandbox --disable-dev-shm-usage' },
    },
    assert: {
      assertions: {
        'categories:seo': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['warn', { minScore: 0.9 }],
        'categories:performance': ['warn', { minScore: 0.7 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
      },
    },
    upload: { target: 'filesystem', outputDir: 'reports/lighthouse' },
  },
};
