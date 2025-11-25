const assert = require('node:assert');

const REPO_MARKER = '/mariapatni.github.io';

function getRepoRelativePath(pathname = '/') {
  const idx = pathname.indexOf(REPO_MARKER);
  if (idx >= 0) {
    return pathname.slice(idx + REPO_MARKER.length);
  }
  return pathname;
}

function getCurrentDepth(pathname) {
  const suffix = getRepoRelativePath(pathname);
  const parts = suffix.split('/').filter(p => p && !p.endsWith('.html'));
  return parts.length;
}

function normalizeRoute(route) {
  if (route === '/') return '/index.html';
  return route.startsWith('/') ? route : `/${route}`;
}

function resolveRoute(route, pathname) {
  const depth = getCurrentDepth(pathname);
  const prefix = depth > 0 ? '../'.repeat(depth) : '';
  const normalized = normalizeRoute(route).replace(/^\//, '');
  return prefix + normalized;
}

const scenarios = [
  { pathname: '/index.html', route: '/index.html', expected: 'index.html' },
  { pathname: '/experience.html', route: '/experience.html', expected: 'experience.html' },
  { pathname: '/blogs/repairing-server/index.html', route: '/projects.html', expected: '../../projects.html' },
  { pathname: '/blogs/repairing-server/index.html', route: '/files/resume.pdf', expected: '../../files/resume.pdf' },
  { pathname: '/Users/mariapatni/Documents/GitHub/mariapatni.github.io/index.html', route: '/experience.html', expected: 'experience.html' },
  { pathname: '/Users/mariapatni/Documents/GitHub/mariapatni.github.io/blogs/repairing-server/index.html', route: '/projects.html', expected: '../../projects.html' },
];

scenarios.forEach(({ pathname, route, expected }) => {
  const actual = resolveRoute(route, pathname);
  assert.strictEqual(
    actual,
    expected,
    `Expected pathname ${pathname} -> ${expected}, got ${actual}`
  );
});

console.log('Path resolver tests passed.');

