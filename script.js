/* ═══════════════════════════════════════════
   0. SELETORES
   ═══════════════════════════════════════════ */
const html       = document.documentElement;
const themeBtn   = document.getElementById('themeBtn');
const themeText  = document.getElementById('themeText');
const themeIcon  = themeBtn.querySelector('.btn__icon');
const toast      = document.getElementById('toast');
const yearEl     = document.getElementById('year');
const copyBtns   = [document.getElementById('copyEmail'), document.getElementById('copyEmail2')];
const emailText  = document.getElementById('emailText');
const counters   = document.querySelectorAll('[data-counter]');
const reveals    = document.querySelectorAll('.reveal');

/* ═══════════════════════════════════════════
   1. ANO NO FOOTER
   ═══════════════════════════════════════════ */
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ═══════════════════════════════════════════
   2. TEMA ESCURO / CLARO
   ═══════════════════════════════════════════ */
function getStoredTheme() {
  return localStorage.getItem('theme') || 'dark';
}

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);

  if (theme === 'dark') {
    themeIcon.textContent = '🌙';
    themeText.textContent = 'Escuro';
  } else {
    themeIcon.textContent = '☀️';
    themeText.textContent = 'Claro';
  }
}

applyTheme(getStoredTheme());

themeBtn.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

/* ═══════════════════════════════════════════
   3. TOAST
   ═══════════════════════════════════════════ */
let toastTimer = null;

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

/* ═══════════════════════════════════════════
   4. COPIAR E-MAIL
   ═══════════════════════════════════════════ */
function copyEmail() {
  const email = emailText ? emailText.textContent.trim() : '';
  if (!email) return;

  navigator.clipboard.writeText(email).then(() => {
    showToast('✅ E-mail copiado!');
  }).catch(() => {
    const temp = document.createElement('textarea');
    temp.value = email;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand('copy');
    document.body.removeChild(temp);
    showToast('✅ E-mail copiado!');
  });
}

copyBtns.forEach(btn => {
  if (btn) btn.addEventListener('click', copyEmail);
});

/* ═══════════════════════════════════════════
   5. CONTADORES ANIMADOS
   ═══════════════════════════════════════════ */
function animateCounter(el) {
  const target = +el.getAttribute('data-counter');
  const duration = 1600;
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(2, -10 * progress);
    const value = Math.floor(ease * target);

    el.textContent = value + (target === 100 ? '%' : '+');

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = target + (target === 100 ? '%' : '+');
    }
  }

  requestAnimationFrame(tick);
}

/* ═══════════════════════════════════════════
   6. REVEAL ON SCROLL
   ═══════════════════════════════════════════ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');

      const allCounters = entry.target.querySelectorAll('[data-counter]');
      allCounters.forEach(counter => {
        if (!counter.dataset.animated) {
          counter.dataset.animated = 'true';
          animateCounter(counter);
        }
      });

      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -40px 0px'
});

reveals.forEach(el => revealObserver.observe(el));

counters.forEach(el => {
  if (!el.closest('.reveal')) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !el.dataset.animated) {
          el.dataset.animated = 'true';
          animateCounter(el);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counterObserver.observe(el);
  }
});

/* ═══════════════════════════════════════════
   7. SMOOTH SCROLL
   ═══════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ═══════════════════════════════════════════
   8. HEADER SCROLL EFFECT
   ═══════════════════════════════════════════ */
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    header.style.borderBottomColor = 'var(--border-h)';
    header.style.boxShadow = '0 4px 20px rgba(0,0,0,.08)';
  } else {
    header.style.borderBottomColor = 'var(--border)';
    header.style.boxShadow = 'none';
  }
}, { passive: true });

/* ═══════════════════════════════════════════
   9. TILT NOS CARDS
   ═══════════════════════════════════════════ */
document.querySelectorAll('.card, .hero__card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;

    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ═══════════════════════════════════════════
   10. NAV LINK ATIVO
   ═══════════════════════════════════════════ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link');

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('nav__link--active',
          link.getAttribute('href') === `#${id}`
        );
      });
    }
  });
}, {
  threshold: 0.3,
  rootMargin: '-80px 0px -50% 0px'
});

sections.forEach(sec => activeObserver.observe(sec));

/* ═══════════════════════════════════════════
   11. SELETOR DE PALETA DE CORES
   ═══════════════════════════════════════════ */
const paletteDots = document.querySelectorAll('.palette-dot');

function getStoredPalette() {
  return localStorage.getItem('palette') || 'purple';
}

function applyPalette(palette) {
  html.setAttribute('data-palette', palette);
  localStorage.setItem('palette', palette);

  paletteDots.forEach(dot => {
    dot.classList.toggle('active', dot.dataset.palette === palette);
  });
}

applyPalette(getStoredPalette());

paletteDots.forEach(dot => {
  dot.addEventListener('click', () => {
    applyPalette(dot.dataset.palette);
    showToast(`🎨 Cor: ${dot.title}`);
  });
});