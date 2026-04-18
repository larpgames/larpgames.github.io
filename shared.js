// ============================================================
// LARP GAMES — shared.js
// Scroll animations, nav logic, particle background, utilities
// ============================================================

/* ── Intersection Observer: fade/slide-in on scroll ── */
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll(
    '.reveal, .game-card, .section-header, .category-pill, .hero-text, .featured-badge'
  ).forEach((el) => observer.observe(el));
}

/* ── Staggered card delays ── */
function initCardStagger() {
  document.querySelectorAll('.games-grid').forEach((grid) => {
    grid.querySelectorAll('.game-card').forEach((card, i) => {
      card.style.transitionDelay = `${i * 55}ms`;
    });
  });
}

/* ── Parallax subtle on hero ── */
function initParallax() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    hero.style.backgroundPositionY = `${y * 0.35}px`;
  }, { passive: true });
}

/* ── Particle canvas background ── */
function initParticles(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function Particle() {
    this.reset = function () {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 1.6 + 0.4;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.alpha = Math.random() * 0.5 + 0.1;
    };
    this.reset();
  }

  function initP() {
    particles = Array.from({ length: 110 }, () => new Particle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(139,92,246,${p.alpha})`;
      ctx.fill();
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -5 || p.x > W + 5 || p.y < -5 || p.y > H + 5) p.reset();
    });

    // connect nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 90) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(139,92,246,${0.12 * (1 - dist / 90)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  resize();
  initP();
  draw();
  window.addEventListener('resize', () => { resize(); initP(); }, { passive: true });
}

/* ── Active nav link highlight ── */
function initNavHighlight() {
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach((a) => {
    const href = a.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

/* ── Mobile sidebar toggle ── */
function initSidebar() {
  const toggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (!toggle || !sidebar) return;

  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay && overlay.classList.toggle('show');
  });
  overlay && overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
  });
}

/* ── Search filter ── */
function initSearch() {
  const input = document.getElementById('gameSearch');
  if (!input) return;
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    document.querySelectorAll('.game-card').forEach((card) => {
      const name = card.querySelector('.game-title')?.textContent.toLowerCase() || '';
      card.style.display = !q || name.includes(q) ? '' : 'none';
    });
  });
}

/* ── Scroll-to-top button ── */
function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── Glitch text effect on logo ── */
function initGlitch() {
  const el = document.querySelector('.logo-glitch');
  if (!el) return;
  const txt = el.textContent;
  setInterval(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$';
    let out = '';
    for (let i = 0; i < txt.length; i++) {
      out += Math.random() < 0.07
        ? chars[Math.floor(Math.random() * chars.length)]
        : txt[i];
    }
    el.textContent = out;
    setTimeout(() => (el.textContent = txt), 80);
  }, 2800);
}

/* ── Boot ── */
document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initCardStagger();
  initParallax();
  initParticles('particleCanvas');
  initNavHighlight();
  initSidebar();
  initSearch();
  initScrollTop();
  initGlitch();
});
