/**
 * RITHMOS — Clean Editorial Landing Page Script
 * Features: Scroll Progress Bar, Intersection Observer Reveal, Clean Modal Controls
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderAndScrollProgress();
  initScrollReveal();
  initHeroPassTilt();
  initModals();
  initSmoothScroll();
});

/* ==========================================================================
   1. SCROLL PROGRESS & STICKY HEADER
   ========================================================================== */
function initHeaderAndScrollProgress() {
  const header = document.querySelector('.site-header');
  const progressBar = document.getElementById('scrollProgress');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // Progress Bar Fill
    if (progressBar && docHeight > 0) {
      const progress = (scrollY / docHeight) * 100;
      progressBar.style.width = `${progress}%`;
    }

    // Header State
    if (header) {
      if (scrollY > 24) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  }, { passive: true });
}

/* ==========================================================================
   2. SCROLL REVEAL (IntersectionObserver)
   ========================================================================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px 60px 0px',
    threshold: 0.05
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  reveals.forEach((el, index) => {
    // Stagger delays only for desktop grid items
    if (window.innerWidth > 768) {
      if (el.parentElement && el.parentElement.classList.contains('audiences-grid')) {
        el.style.transitionDelay = `${(index % 3) * 0.1}s`;
      } else if (el.parentElement && el.parentElement.classList.contains('arc-cards-row')) {
        el.style.transitionDelay = `${(index % 4) * 0.08}s`;
      }
    }
    // If element is already in viewport on load, activate immediately
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      el.classList.add('active');
    } else {
      observer.observe(el);
    }
  });
}

/* ==========================================================================
   3. MODAL MANAGEMENT
   ========================================================================== */
function initModals() {
  document.querySelectorAll('[data-open-modal]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-open-modal');
      openModal(modalId);
    });
  });

  document.querySelectorAll('.modal-close-button, .modal-overlay').forEach(closer => {
    closer.addEventListener('click', (e) => {
      if (e.target === closer || closer.classList.contains('modal-close-button')) {
        closeAllModals();
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });

  // Forms
  const bandForm = document.getElementById('bandRegistrationForm');
  if (bandForm) {
    bandForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const bandName = document.getElementById('bandName').value || 'Your Band';
      closeAllModals();
      bandForm.reset();
      showToast(`Registration received for "${bandName}". Hyderabad Heats team notified.`);
    });
  }

  const fanForm = document.getElementById('fanUpdatesForm');
  if (fanForm) {
    fanForm.addEventListener('submit', (e) => {
      e.preventDefault();
      closeAllModals();
      fanForm.reset();
      showToast('You are on the VIP Stage Pass list. Venue alerts arriving soon.');
    });
  }

  const brandForm = document.getElementById('brandPartnerForm');
  if (brandForm) {
    brandForm.addEventListener('submit', (e) => {
      e.preventDefault();
      closeAllModals();
      brandForm.reset();
      showToast('Partnership overview dispatched to your corporate email.');
    });
  }
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
  document.body.style.overflow = '';
}

/* ==========================================================================
   4. TOAST NOTIFICATION
   ========================================================================== */
function showToast(message) {
  let toast = document.getElementById('siteToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'siteToast';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4200);
}

/* ==========================================================================
   5. SMOOTH SCROLLING
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ==========================================================================
   6. 3D HOLOGRAPHIC VIP PASS PERSPECTIVE TILT
   ========================================================================== */
function initHeroPassTilt() {
  const card = document.getElementById('arenaVipPass');
  const dock = document.getElementById('heroPassDock');
  if (!card || !dock) return;

  dock.addEventListener('mousemove', (e) => {
    const rect = dock.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Max tilt +- 10deg
    const rotateX = ((y - centerY) / centerY) * -9;
    const rotateY = ((x - centerX) / centerX) * 11;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    
    const shimmer = card.querySelector('.pass-hologram-shimmer');
    if (shimmer) {
      const px = ((x / rect.width) * 100).toFixed(1);
      const py = ((y / rect.height) * 100).toFixed(1);
      shimmer.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,0.22) 0%, rgba(226,33,40,0.14) 40%, transparent 75%)`;
    }
  });

  dock.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    const shimmer = card.querySelector('.pass-hologram-shimmer');
    if (shimmer) {
      shimmer.style.background = 'transparent';
    }
  });
}
