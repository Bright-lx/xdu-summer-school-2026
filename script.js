'use strict';

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  //  1. Particle Network Animation
  // ============================================================
  (function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const COLOR = '#00D4FF';
    const PARTICLE_COUNT = 90;
    const CONNECT_DIST = 120;
    const LINE_OPACITY = 0.18;
    const PARTICLE_OPACITY = 0.5;
    const SPEED = 0.35;

    let particles = [];
    let width, height;
    let animId;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }

    function createParticles() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * SPEED,
          vy: (Math.random() - 0.5) * SPEED,
          r: Math.random() * 2 + 1
        });
      }
    }

    function update() {
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECT_DIST) {
            const alpha = LINE_OPACITY * (1 - dist / CONNECT_DIST);
            ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (const p of particles) {
        ctx.fillStyle = `rgba(0, 212, 255, ${PARTICLE_OPACITY})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function loop() {
      update();
      draw();
      animId = requestAnimationFrame(loop);
    }

    resize();
    createParticles();

    window.addEventListener('resize', () => {
      resize();
      createParticles();
    });

    loop();

    // Cleanup helper if needed (not typically required for SPA pages)
    window.__particleCleanup = () => {
      if (animId) cancelAnimationFrame(animId);
    };
  })();

  // ============================================================
  //  2. Countdown Timer
  // ============================================================
  (function initCountdown() {
    const daysEl = document.getElementById('countdown-days');
    const hoursEl = document.getElementById('countdown-hours');
    const minsEl = document.getElementById('countdown-mins');
    const secsEl = document.getElementById('countdown-secs');

    // If no countdown elements exist, skip
    if (!daysEl && !hoursEl && !minsEl && !secsEl) return;

    //const targetDate = new Date('2026-07-18T23:59:59');
    const targetDate = new Date('2026-07-18T15:00:00');

    function pad(n) {
      return String(n).padStart(2, '0');
    }

    function update() {
      const now = new Date();
      let diff = targetDate - now;

      if (diff <= 0) {
        // Expired
        if (daysEl) daysEl.textContent = '报名已截止';
        if (hoursEl) hoursEl.textContent = '';
        if (minsEl) minsEl.textContent = '';
        if (secsEl) secsEl.textContent = '';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      diff -= days * 1000 * 60 * 60 * 24;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      diff -= hours * 1000 * 60 * 60;
      const mins = Math.floor(diff / (1000 * 60));
      diff -= mins * 1000 * 60;
      const secs = Math.floor(diff / 1000);

      if (daysEl) daysEl.textContent = pad(days);
      if (hoursEl) hoursEl.textContent = pad(hours);
      if (minsEl) minsEl.textContent = pad(mins);
      if (secsEl) secsEl.textContent = pad(secs);
    }

    update();
    setInterval(update, 1000);
  })();

  // ============================================================
  //  3. Scroll-Triggered Reveal Animations
  // ============================================================
  (function initReveal() {
    const revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealEls.forEach((el) => observer.observe(el));
  })();

  // ============================================================
  //  4. Typewriter Effect
  // ============================================================
  (function initTypewriter() {
    const el = document.querySelector('.typewriter-text');
    if (!el) return;

    const fullText = el.textContent.trim();
    el.textContent = '';
    el.style.visibility = 'visible';

    // Create cursor element if it doesn't exist
    let cursor = el.parentElement.querySelector('.typewriter-cursor');
    if (!cursor) {
      cursor = document.createElement('span');
      cursor.className = 'typewriter-cursor';
      cursor.setAttribute('aria-hidden', 'true');
      el.parentElement.appendChild(cursor);
    }

    let i = 0;
    const speed = 50;

    function type() {
      if (i < fullText.length) {
        el.textContent += fullText.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    }

    type();
  })();

  // ============================================================
  //  5. Sticky Navigation + Active Link Highlighting
  // ============================================================
  (function initNav() {
    const header = document.querySelector('.site-header');
    const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');

    function onScroll() {
      const scrollY = window.scrollY;

      // Scrolled class
      if (header) {
        header.classList.toggle('scrolled', scrollY > 50);
      }

      // Active link based on scroll position
      if (!navLinks.length) return;

      let currentId = '';
      const sections = [];

      navLinks.forEach((link) => {
        const id = link.getAttribute('href');
        if (!id || id === '#') return;
        const section = document.querySelector(id);
        if (section) {
          sections.push({ id: id.substring(1), el: section });
        }
      });

      for (let i = sections.length - 1; i >= 0; i--) {
        const s = sections[i];
        const rect = s.el.getBoundingClientRect();
        // Use section top within a reasonable offset
        if (rect.top <= 120) {
          currentId = s.id;
          break;
        }
      }

      navLinks.forEach((link) => {
        const href = link.getAttribute('href');
        if (href) {
          const id = href.substring(1);
          link.classList.toggle('active', id === currentId);
        }
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // check initial state
  })();

  // ============================================================
  //  6. Mobile Menu Toggle
  // ============================================================
  (function initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.site-nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      nav.classList.toggle('open');
    });

    // Close when a nav link is clicked
    const navLinks = nav.querySelectorAll('a');
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (nav.classList.contains('open') && !nav.contains(e.target) && !toggle.contains(e.target)) {
        nav.classList.remove('open');
      }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
      }
    });
  })();

  // ============================================================
  //  7. Registration CTA
  // ============================================================
  (function initRegistrationCta() {
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-action="open-form"]');
      if (!trigger) return;

      const target = document.querySelector('#register');
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  })();

  // ============================================================
  //  8. Back to Top Button
  // ============================================================
  (function initBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;

    function onScroll() {
      const show = window.scrollY > 500;
      btn.classList.toggle('visible', show);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  })();

  // ============================================================
  //  9. Parallax Effect on Hero Visual
  // ============================================================
  (function initParallax() {
    const heroVisual = document.querySelector('.hero-visual');
    if (!heroVisual) return;

    const hero = heroVisual.closest('.hero');
    if (!hero) return;

    function onScroll() {
      const heroRect = hero.getBoundingClientRect();
      const heroHeight = hero.offsetHeight;

      // Only apply when hero is still in view (top above viewport bottom)
      if (heroRect.bottom <= 0 || heroRect.top >= window.innerHeight) return;

      // Calculate progress: 0 at top of hero, 1 at bottom of hero in viewport
      const progress = (window.innerHeight - heroRect.top) / (window.innerHeight + heroHeight);
      const offset = progress * 30; // max 30px shift

      heroVisual.style.transform = `translateY(${offset}px) perspective(800px) rotateY(-2deg)`;
    }

    function resetTransform() {
      heroVisual.style.transform = '';
    }

    window.addEventListener('scroll', () => {
      const heroRect = hero.getBoundingClientRect();
      if (heroRect.bottom > 0 && heroRect.top < window.innerHeight) {
        onScroll();
      } else {
        resetTransform();
      }
    }, { passive: true });
  })();

  // ============================================================
  //  10. Smooth Scroll for Anchor Links
  // ============================================================
  (function initSmoothScroll() {
    document.addEventListener('click', (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      // Account for fixed header height
      const header = document.querySelector('.site-header');
      const headerHeight = header ? header.offsetHeight : 0;

      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 12;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  })();

});
