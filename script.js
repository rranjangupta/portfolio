/* ========================================
   PORTFOLIO — Main JavaScript
   ======================================== */

// ─── Particles Background ──────────────────────────────────────
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: null, y: null };

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(108, 99, 255, ${this.opacity})`;
      ctx.fill();
    }
  }

  const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
  for (let i = 0; i < count; i++) particles.push(new Particle());

  function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(108, 99, 255, ${0.06 * (1 - dist / 150)})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
      // Mouse interaction
      if (mouse.x !== null) {
        const dx = particles[a].x - mouse.x;
        const dy = particles[a].y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 212, 255, ${0.12 * (1 - dist / 200)})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(animate);
  }

  animate();
})();

// ─── Custom Cursor ──────────────────────────────────────────────
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  if (!cursor || !follower) return;

  let cx = 0, cy = 0, fx = 0, fy = 0;

  document.addEventListener('mousemove', (e) => {
    cx = e.clientX;
    cy = e.clientY;
  });

  function tick() {
    fx += (cx - fx) * 0.15;
    fy += (cy - fy) * 0.15;
    cursor.style.transform = `translate(${cx - 4}px, ${cy - 4}px)`;
    follower.style.transform = `translate(${fx - 18}px, ${fy - 18}px)`;
    requestAnimationFrame(tick);
  }
  tick();

  // Hover effects
  document.querySelectorAll('a, button, .skill-tag, .project-card, .cert-card, .award-item, .detail-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      follower.style.width = '50px';
      follower.style.height = '50px';
      follower.style.borderColor = 'rgba(0, 212, 255, 0.6)';
    });
    el.addEventListener('mouseleave', () => {
      follower.style.width = '36px';
      follower.style.height = '36px';
      follower.style.borderColor = 'rgba(108, 99, 255, 0.5)';
    });
  });
})();

// ─── Theme Toggle ──────────────────────────────────────────────
(function initThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  const root = document.documentElement;

  // Determine initial theme
  function getStoredTheme() {
    return localStorage.getItem('portfolio-theme');
  }

  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      root.removeAttribute('data-theme');
    }
  }

  // Set initial theme (stored > system > dark)
  const stored = getStoredTheme();
  if (stored) {
    applyTheme(stored);
  }
  // If no stored preference, default to dark (current design default)

  // Toggle handler
  toggle.addEventListener('click', () => {
    const isCurrentlyLight = root.getAttribute('data-theme') === 'light';
    const newTheme = isCurrentlyLight ? 'dark' : 'light';
    applyTheme(newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
  });

  // Listen for OS theme changes
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
    // Only auto-switch if user hasn't set a preference
    if (!getStoredTheme()) {
      applyTheme(e.matches ? 'light' : 'dark');
    }
  });
})();

// ─── Navbar Scroll ──────────────────────────────────────────────
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile menu
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close menu on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // Active link highlighting
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 150;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = navLinks.querySelector(`a[href="#${id}"]`);
      if (link) {
        if (scrollY >= top && scrollY < top + height) {
          link.style.color = '#6c63ff';
        } else {
          link.style.color = '';
        }
      }
    });
  });
})();

// ─── Typewriter Effect ──────────────────────────────────────────
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const phrases = [
    'Senior Software Engineer',
    'Backend Developer',
    'Cloud Enthusiast',
    'Microservices Architect',
    'Problem Solver',
    'Tech Explorer',
  ];
  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function type() {
    const current = phrases[phraseIdx];
    if (isDeleting) {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
    } else {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
    }

    let speed = isDeleting ? 40 : 70;

    if (!isDeleting && charIdx === current.length) {
      speed = 2000; // pause at end
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      speed = 400;
    }

    setTimeout(type, speed);
  }

  setTimeout(type, 800);
})();

// ─── Scroll Reveal ──────────────────────────────────────────────
(function initReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings for grid layouts
        const parent = entry.target.parentElement;
        const siblings = parent.querySelectorAll('.reveal');
        const idx = Array.from(siblings).indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 100);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => observer.observe(el));
})();

// ─── Smooth scroll for anchor links ────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ─── Counter Animation for Stats ────────────────────────────────
(function initCounters() {
  const counters = document.querySelectorAll('.detail-info h4');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const text = target.textContent;
        const match = text.match(/(\d+)/);
        if (match) {
          const end = parseInt(match[1]);
          const suffix = text.replace(match[1], '');
          let current = 0;
          const duration = 1500;
          const step = end / (duration / 16);

          function count() {
            current += step;
            if (current >= end) {
              target.textContent = end + suffix;
            } else {
              target.textContent = Math.floor(current) + suffix;
              requestAnimationFrame(count);
            }
          }
          count();
        }
        observer.unobserve(target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();
