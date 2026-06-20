/* === yushutan.top — Main JS === */

// Language state
let currentLang = (() => {
  const path = window.location.pathname;
  if (path.includes('/jp/')) return 'jp';
  if (path.includes('/en/')) return 'en';
  // Detect browser preference
  const navLang = navigator.language || navigator.userLanguage || '';
  if (navLang.startsWith('ja')) return 'jp';
  return 'en';
})();

// Get current page name
function getPage() {
  const path = window.location.pathname;
  const parts = path.split('/').filter(Boolean);
  // Remove language prefix
  if (parts[0] === 'en' || parts[0] === 'jp') {
    return parts[1] || 'index';
  }
  return parts[0] || 'index';
}

// Language toggle
function toggleLang() {
  const page = getPage();
  const newLang = currentLang === 'en' ? 'jp' : 'en';
  const basePath = window.location.pathname.includes('/jp/') || window.location.pathname.includes('/en/')
    ? '/' + newLang + '/' + (page === 'index' ? '' : page + '.html')
    : '/' + newLang + '/';
  window.location.href = newLang === 'en' ? '/en/' + (page === 'index' ? 'index.html' : page + '.html') : '/jp/' + (page === 'index' ? 'index.html' : page + '.html');
}

// Gallery Lightbox
function initLightbox() {
  const lightbox = document.querySelector('.lightbox');
  if (!lightbox) return;
  
  const img = lightbox.querySelector('img');
  const caption = lightbox.querySelector('.lightbox-caption');
  
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const src = item.querySelector('img').getAttribute('data-full') || item.querySelector('img').src;
      const cap = item.querySelector('.gallery-caption h4')?.textContent || '';
      img.src = src;
      if (caption) caption.textContent = cap;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });
  
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

// Lazy loading
function initLazyLoad() {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });
    
    document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
  } else {
    // Fallback
    document.querySelectorAll('img[data-src]').forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  }
}

// Smooth scroll
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// Set active nav link
function setActiveNav() {
  const page = getPage();
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (page === 'index' && (href === 'index.html' || href === './' || href === '../')) {
      link.classList.add('active');
    } else if (href && href.includes(page)) {
      link.classList.add('active');
    }
  });
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  initLightbox();
  initLazyLoad();
  initSmoothScroll();
  setActiveNav();
});
