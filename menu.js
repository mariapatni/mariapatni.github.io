const NAV_LINKS = [
  { label: 'Home', route: '/index.html' },
  { label: 'Experience', route: '/experience.html' },
  { label: 'Projects', route: '/projects.html' },
];

const FOOTER_HTML = `
  <footer>
    <a href="https://github.com/mariapatni" target="_blank">GitHub</a>
    <a href="https://linkedin.com/in/mariapatni" target="_blank">LinkedIn</a>
    <a href="mailto:mpatni@umich.edu" target="_blank">Email</a>
  </footer>
`;

const HAMBURGER_TEMPLATE = `
  <!-- 1) Hamburger button -->
  <button id="menuBtn" aria-label="Open menu" aria-controls="menuDrawer" aria-expanded="false">
    <span></span><span></span><span></span>
  </button>
  <div id="menuBackdrop" hidden></div>
  <aside id="menuDrawer" hidden role="dialog" aria-modal="true" tabindex="-1">
    <div class="menu-profile">
      <img data-route="/images/headshot2.jpg" alt="Maria Patni" width="200" height="200" />
      <div>Maria Patni</div>
    </div>
    <nav class="menu-links">
      ${NAV_LINKS.map(link => `<a class="menu-link" data-route="${link.route}">${link.label}</a>`).join('')}
      <div class="menu-divider"></div>
      <a class="menu-link" data-route="/files/resume.pdf" target="_blank">CV</a>
    </nav>
    <div class="menu-footer">
      <button id="closeMenu">Close</button>
    </div>
  </aside>
`;

const REPO_MARKER = '/mariapatni.github.io';

function getRepoRelativePath(pathname) {
  const idx = pathname.indexOf(REPO_MARKER);
  if (idx >= 0) {
    return pathname.slice(idx + REPO_MARKER.length);
  }
  return pathname;
}

function getCurrentDepth() {
  const suffix = getRepoRelativePath(window.location.pathname);
  const parts = suffix.split('/').filter(p => p && !p.endsWith('.html'));
  return parts.length;
}

function normalizeRoute(route) {
  if (route === '/') return '/index.html';
  return route.startsWith('/') ? route : `/${route}`;
}

function resolveRoute(route) {
  const depth = getCurrentDepth();
  const prefix = depth > 0 ? '../'.repeat(depth) : '';
  const normalized = normalizeRoute(route).replace(/^\//, '');
  return prefix + normalized;
}

function applyDataRoutes() {
  document.querySelectorAll('link[data-route]').forEach(link => {
    const route = link.dataset.route;
    if (route) {
      link.setAttribute('href', resolveRoute(route));
    }
  });
}

function injectSharedNav() {
  const navHTML = `
    <nav class="top-nav">
      ${NAV_LINKS.map(link => `<a data-route="${link.route}">${link.label}</a>`).join('')}
    </nav>`;
  document.querySelectorAll('[data-layout="nav"]').forEach(container => {
    container.innerHTML = navHTML;
    container.querySelectorAll('a').forEach(anchor => {
      anchor.setAttribute('href', resolveRoute(anchor.dataset.route));
    });
    const currentPath = normalizeRoute(window.location.pathname);
    container.querySelectorAll('a').forEach(anchor => {
      if (normalizeRoute(anchor.dataset.route) === currentPath) {
        anchor.classList.add('active');
      }
    });
  });
}

function injectSharedFooter() {
  document.querySelectorAll('[data-layout="footer"]').forEach(container => {
    container.innerHTML = FOOTER_HTML;
    container.querySelectorAll('a[data-route]').forEach(anchor => {
      anchor.setAttribute('href', resolveRoute(anchor.dataset.route));
    });
  });
}

function renderHamburger() {
  document.body.insertAdjacentHTML('afterbegin', HAMBURGER_TEMPLATE);
  document.querySelectorAll('#menuDrawer .menu-link').forEach(link => {
    const route = link.dataset.route;
    if (route) {
      link.setAttribute('href', resolveRoute(route));
    }
  });
  document.querySelector('#menuDrawer img')?.setAttribute('src', resolveRoute('/images/headshot2.jpg'));

  const btn = document.getElementById('menuBtn');
  const drawer = document.getElementById('menuDrawer');
  const backdrop = document.getElementById('menuBackdrop');
  const closeBtn = document.getElementById('closeMenu');

  const openMenu = () => {
    drawer.hidden = false;
    backdrop.hidden = false;
    requestAnimationFrame(() => {
      drawer.classList.add('open');
      backdrop.classList.add('visible');
      btn.setAttribute('aria-expanded', 'true');
      drawer.focus();
    });
  };

  const closeMenu = () => {
    drawer.classList.remove('open');
    backdrop.classList.remove('visible');
    btn.setAttribute('aria-expanded', 'false');
    setTimeout(() => {
      drawer.hidden = true;
      backdrop.hidden = true;
    }, 180);
  };

  btn.addEventListener('click', openMenu);
  closeBtn?.addEventListener('click', closeMenu);
  backdrop.addEventListener('click', closeMenu);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
  document.querySelectorAll('#menuDrawer .menu-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  applyDataRoutes();
  injectSharedNav();
  injectSharedFooter();
  renderHamburger();
});
