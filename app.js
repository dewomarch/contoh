/**
 * app.js — unique-simple-website
 * Architecture: Module Pattern (IIFE) — Vanilla JS, no framework, no build step.
 * Each module is an IIFE that returns a public API object.
 */

'use strict';

/* =========================================================
   1. themeManager
   Manages dark/light mode via data-theme on <html>.
   Requirements: 1.5, 1.6
   ========================================================= */
const themeManager = (function () {
  let _current = 'dark';

  function _readStored() {
    try {
      return localStorage.getItem('theme');
    } catch (_e) {
      return null;
    }
  }

  function _writeStored(theme) {
    try {
      localStorage.setItem('theme', theme);
    } catch (_e) {
      // localStorage unavailable (e.g. private mode) — fail silently
    }
  }

  function applyTheme(theme) {
    _current = theme;
    document.documentElement.setAttribute('data-theme', theme);

    // Sync theme-toggle icon visibility
    const iconSun  = document.getElementById('icon-sun');
    const iconMoon = document.getElementById('icon-moon');
    if (iconSun && iconMoon) {
      iconSun.classList.toggle('hidden',  theme === 'light');
      iconMoon.classList.toggle('hidden', theme === 'dark');
    }
  }

  function getCurrent() {
    return _current;
  }

  function toggle() {
    const next = _current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    _writeStored(next);
    // Notify spotlightEffect to update its enabled state
    if (typeof spotlightEffect !== 'undefined') {
      spotlightEffect.setMode(next);
    }
  }

  function init() {
    const stored = _readStored();
    applyTheme(stored === 'light' ? 'light' : 'dark');

    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', toggle);
    }
  }

  return { init, toggle, getCurrent, applyTheme };
})();


/* =========================================================
   2. spotlightEffect
   Cursor-following radial gradient overlay.
   Requirements: 2.4, 8.1–8.6
   ========================================================= */
const spotlightEffect = (function () {
  let _isEnabled  = true;
  let _rafPending = false;
  let _overlay    = null;

  function update(x, y) {
    if (!_overlay) return;
    document.documentElement.style.setProperty('--spotlight-x', x + 'px');
    document.documentElement.style.setProperty('--spotlight-y', y + 'px');
  }

  function show() {
    if (_overlay) _overlay.style.opacity = '1';
  }

  function hide() {
    if (_overlay) _overlay.style.opacity = '0';
  }

  function setMode(theme) {
    _isEnabled = theme === 'dark';
    if (!_isEnabled) hide();
  }

  function _onMouseMove(event) {
    if (!_isEnabled) return;
    if (_rafPending) return;
    _rafPending = true;
    requestAnimationFrame(function () {
      update(event.clientX, event.clientY);
      show();
      _rafPending = false;
    });
  }

  function init() {
    // Disable entirely on touch devices
    if ('ontouchstart' in window) return;

    _overlay = document.getElementById('spotlight-overlay');
    document.addEventListener('mousemove', _onMouseMove);

    // Apply initial mode
    setMode(themeManager.getCurrent());
  }

  return { init, update, show, hide, setMode, _onMouseMove };
})();


/* =========================================================
   3. navbarController
   Sticky navbar + scroll-class + hamburger menu.
   Requirements: 1.4, 9.2, 9.3
   ========================================================= */
const navbarController = (function () {
  let _header        = null;
  let _heroSection   = null;
  let _heroObserver  = null;
  let _menuOpen      = false;

  function onScroll() {
    if (!_header || !_heroSection) return;
    const heroBottom = _heroSection.getBoundingClientRect().bottom;
    if (heroBottom <= 0) {
      _header.classList.add('scrolled');
    } else {
      _header.classList.remove('scrolled');
    }
  }

  function _setMenuOpen(open) {
    _menuOpen = open;
    const menu   = document.getElementById('mobile-menu');
    const btn    = document.getElementById('hamburger-btn');
    const line1  = document.getElementById('ham-line-1');
    const line2  = document.getElementById('ham-line-2');
    const line3  = document.getElementById('ham-line-3');

    if (!menu || !btn) return;

    menu.classList.toggle('hidden', !open);
    btn.setAttribute('aria-expanded', String(open));

    // Animate hamburger → X
    if (line1 && line2 && line3) {
      if (open) {
        line1.style.transform = 'translateY(7px) rotate(45deg)';
        line2.style.opacity   = '0';
        line3.style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        line1.style.transform = '';
        line2.style.opacity   = '';
        line3.style.transform = '';
      }
    }
  }

  function init() {
    _header      = document.querySelector('header');
    _heroSection = document.getElementById('hero');

    window.addEventListener('scroll', onScroll, { passive: true });

    // Close mobile menu when a nav link is clicked
    const mobileLinks = document.querySelectorAll('#mobile-menu a');
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () { _setMenuOpen(false); });
    });

    // Hamburger toggle
    const hamBtn = document.getElementById('hamburger-btn');
    if (hamBtn) {
      hamBtn.addEventListener('click', function () { _setMenuOpen(!_menuOpen); });
    }

    // IntersectionObserver as an alternative / supplementary approach
    if (_heroSection && 'IntersectionObserver' in window) {
      _heroObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            _header.classList.add('scrolled');
          } else {
            _header.classList.remove('scrolled');
          }
        });
      }, { threshold: 0, rootMargin: '-1px 0px 0px 0px' });
      _heroObserver.observe(_heroSection);
    }

    // Initial check
    onScroll();
  }

  return {
    init,
    onScroll,
    get _heroObserver() { return _heroObserver; }
  };
})();


/* =========================================================
   4. smoothScroll
   Delegate smooth scrolling for [data-scroll-to] links.
   Requirements: 1.3, 2.5
   ========================================================= */
const smoothScroll = (function () {
  function to(targetId) {
    const el = document.querySelector(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  function init() {
    document.addEventListener('click', function (event) {
      const link = event.target.closest('[data-scroll-to]');
      if (!link) return;
      event.preventDefault();
      const targetId = link.getAttribute('data-scroll-to');
      if (targetId) to(targetId);
    });
  }

  return { init, to };
})();


/* =========================================================
   5. counterAnimation
   Animates .stat-counter elements from 0 → data-target.
   Requirements: 3.3, 3.4
   ========================================================= */
const counterAnimation = (function () {
  const _hasRun = new Set();

  function _animate(el, end, duration) {
    const start     = 0;
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed  = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out
      const value = Math.round(progress * (end - start) + start);
      el.textContent = value;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = end;
      }
    }

    requestAnimationFrame(step);
  }

  function start(el) {
    if (_hasRun.has(el)) return;
    const raw    = parseInt(el.getAttribute('data-target'), 10);
    const target = isNaN(raw) ? 0 : raw;
    _hasRun.add(el);
    _animate(el, target, 1500);
  }

  function init() {
    const counters = document.querySelectorAll('.stat-counter');
    if (!counters.length) return;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            start(entry.target);
          }
        });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { observer.observe(el); });
    } else {
      // Fallback: run immediately
      counters.forEach(start);
    }
  }

  return { init, start, _hasRun };
})();


/* =========================================================
   6. cardHoverEffects
   Applies elevation on .feature-card hover via Tailwind classes.
   Requirements: 4.2, 4.3
   ========================================================= */
const cardHoverEffects = (function () {
  const HOVER_CLASSES = ['scale-105', 'shadow-xl'];

  function init() {
    const cards = document.querySelectorAll('.feature-card');
    cards.forEach(function (card) {
      card.addEventListener('mouseenter', function () {
        card.classList.add(...HOVER_CLASSES);
      });
      card.addEventListener('mouseleave', function () {
        card.classList.remove(...HOVER_CLASSES);
      });
    });
  }

  return { init };
})();


/* =========================================================
   7. portfolioFilter
   Filter .portfolio-item by data-category.
   Requirements: 5.3, 5.4, 5.5
   ========================================================= */
const portfolioFilter = (function () {
  let _currentCategory = 'all';

  function _animateItems(items, show) {
    items.forEach(function (item) {
      if (show) {
        item.style.opacity   = '0';
        item.style.transform = 'scale(0.95)';
        item.style.display   = '';
        // Trigger reflow then transition in
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            item.style.opacity    = '1';
            item.style.transform  = 'scale(1)';
          });
        });
      } else {
        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        item.style.opacity    = '0';
        item.style.transform  = 'scale(0.95)';
        setTimeout(function () {
          item.style.display = 'none';
        }, 300);
      }
    });
  }

  function apply(category) {
    _currentCategory = category;
    const items      = document.querySelectorAll('.portfolio-item');
    const showItems  = [];
    const hideItems  = [];

    items.forEach(function (item) {
      if (category === 'all' || item.getAttribute('data-category') === category) {
        showItems.push(item);
      } else {
        hideItems.push(item);
      }
    });

    _animateItems(hideItems, false);
    _animateItems(showItems, true);

    // Update active filter button styles
    document.querySelectorAll('.filter-btn').forEach(function (btn) {
      const isActive = btn.getAttribute('data-filter') === category;
      btn.style.background = isActive ? 'var(--accent)'   : 'var(--bg-card)';
      btn.style.color      = isActive ? '#fff'            : 'var(--text-secondary)';
    });
  }

  function init() {
    // Wire filter buttons
    document.querySelectorAll('.filter-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        apply(btn.getAttribute('data-filter') || 'all');
      });
    });

    // Wire mouseenter/mouseleave on each portfolio item to show/hide overlay
    document.querySelectorAll('.portfolio-item').forEach(function (item) {
      const overlay = item.querySelector('.portfolio-overlay');
      if (!overlay) return;

      item.addEventListener('mouseenter', function () {
        overlay.style.opacity = '1';
      });

      item.addEventListener('mouseleave', function () {
        overlay.style.opacity = '0';
      });
    });
  }

  return { init, apply, _currentCategory, _animateItems };
})();


/* =========================================================
   8. testimonialCarousel
   Auto-playing carousel with prev/next navigation.
   Requirements: 6.1–6.5
   ========================================================= */
const testimonialCarousel = (function () {
  let _currentIndex = 0;
  let _total        = 0;
  let _intervalId   = null;
  const AUTOPLAY_MS = 5000;
  const PAUSE_MS    = 10000;

  function _updateUI() {
    const track = document.getElementById('testimonial-track');
    if (track) {
      track.style.transform = 'translateX(-' + (_currentIndex * 100) + '%)';
    }

    // Update dots
    document.querySelectorAll('.carousel-dot').forEach(function (dot, i) {
      dot.style.background = i === _currentIndex ? 'var(--accent)' : 'var(--border)';
      dot.style.width      = i === _currentIndex ? '1.5rem' : '0.5rem';
    });
  }

  function goTo(index) {
    _currentIndex = ((index % _total) + _total) % _total;
    _updateUI();
  }

  function navigate(dir) {
    if (dir === 'next') {
      goTo(_currentIndex + 1);
    } else {
      goTo(_currentIndex - 1);
    }
    _pauseAndResume();
  }

  function _autoPlay() {
    _intervalId = setInterval(function () {
      goTo(_currentIndex + 1);
    }, AUTOPLAY_MS);
  }

  function _pauseAndResume() {
    clearInterval(_intervalId);
    _intervalId = null;
    setTimeout(function () {
      _autoPlay();
    }, PAUSE_MS);
  }

  function init() {
    const slides = document.querySelectorAll('.testimonial-slide');
    _total = slides.length;

    if (_total < 2) {
      const controls = document.getElementById('carousel-controls');
      if (controls) controls.style.display = 'none';
      return;
    }

    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');

    if (prevBtn) prevBtn.addEventListener('click', function () { navigate('prev'); });
    if (nextBtn) nextBtn.addEventListener('click', function () { navigate('next'); });

    // Dot clicks
    document.querySelectorAll('.carousel-dot').forEach(function (dot) {
      dot.addEventListener('click', function () {
        const idx = parseInt(dot.getAttribute('data-index'), 10);
        if (!isNaN(idx)) { goTo(idx); _pauseAndResume(); }
      });
    });

    _updateUI();
    _autoPlay();
  }

  return { init, navigate, goTo, _autoPlay, _pauseAndResume };
})();


/* =========================================================
   9. contactForm
   Form validation + toast notification on submit.
   Requirements: 7.1–7.6
   ========================================================= */
const toastNotification = (function () {
  function show(message, type, duration) {
    type     = type     || 'success';
    duration = duration || 3000;

    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast       = document.createElement('div');
    toast.className   = 'toast ' + type;
    toast.textContent = message;
    toast.setAttribute('role', 'status');
    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        toast.classList.add('show');
      });
    });

    setTimeout(function () {
      toast.classList.remove('show');
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 350);
    }, duration);
  }

  return { show };
})();

const contactForm = (function () {
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function _showError(fieldId, message) {
    const errorEl = document.getElementById('error-' + fieldId);
    if (!errorEl) return;
    errorEl.textContent = message;
    errorEl.classList.remove('hidden');
  }

  function _clearError(fieldId) {
    const errorEl = document.getElementById('error-' + fieldId);
    if (!errorEl) return;
    errorEl.textContent = '';
    errorEl.classList.add('hidden');
  }

  function _validateField(field) {
    const id    = field.id.replace('field-', '');
    const value = field.value.trim();

    if (!value) {
      _showError(id, 'Field ini wajib diisi.');
      return false;
    }

    if (id === 'email' && !EMAIL_RE.test(value)) {
      _showError(id, 'Format email tidak valid.');
      return false;
    }

    _clearError(id);
    return true;
  }

  function validate() {
    const fields   = ['field-name', 'field-email', 'field-subject', 'field-message'];
    let   isValid  = true;

    fields.forEach(function (fieldId) {
      const el = document.getElementById(fieldId);
      if (el && !_validateField(el)) {
        isValid = false;
      }
    });

    return isValid;
  }

  function reset() {
    const form = document.getElementById('contact-form');
    if (form) form.reset();
    ['name', 'email', 'subject', 'message'].forEach(_clearError);
  }

  function submit(event) {
    event.preventDefault();
    if (!validate()) return;
    toastNotification.show('Pesan Anda berhasil dikirim! Terima kasih 🎉', 'success', 3000);
    reset();
  }

  function init() {
    const form = document.getElementById('contact-form');
    if (form) {
      form.addEventListener('submit', submit);
    }
  }

  return { init, validate, _validateField, submit, reset };
})();


/* =========================================================
   10. scrollTopButton
   Floating "back to top" button.
   Requirements: 10.3–10.5
   ========================================================= */
const scrollTopButton = (function () {
  let _btn = null;

  function toggle() {
    if (!_btn) return;
    if (window.scrollY > 300) {
      _btn.classList.add('visible');
    } else {
      _btn.classList.remove('visible');
    }
  }

  function scrollUp() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function init() {
    _btn = document.getElementById('scroll-top-btn');
    if (_btn) {
      _btn.addEventListener('click', scrollUp);
    }
    window.addEventListener('scroll', toggle, { passive: true });
    toggle();
  }

  return { init, toggle, scrollUp };
})();


/* =========================================================
   Initialisation — run all modules after DOMContentLoaded
   Requirements: 1.1, 2.3, 10.1
   ========================================================= */
document.addEventListener('DOMContentLoaded', function () {
  // Set footer year
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Boot all modules in dependency order
  themeManager.init();
  spotlightEffect.init();
  navbarController.init();
  smoothScroll.init();
  counterAnimation.init();
  cardHoverEffects.init();
  portfolioFilter.init();
  testimonialCarousel.init();
  contactForm.init();
  scrollTopButton.init();
});
