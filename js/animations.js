/* ================================================
   ANIMATIONS.JS — Scroll reveals, particles, skill bars
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ---- Intersection Observer for Reveal Animations ----
  const revealElements = document.querySelectorAll('.reveal-up');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Don't unobserve so we can re-trigger if needed
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // ---- Timeline Items Observer ----
  const timelineItems = document.querySelectorAll('.timeline-item');

  const timelineObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  timelineItems.forEach((item) => timelineObserver.observe(item));

  // ---- Skill Bar Animation ----
  const skillFills = document.querySelectorAll('.skill-fill');

  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          const targetWidth = fill.dataset.width;
          fill.style.width = targetWidth + '%';
          fill.classList.add('animated');
          skillObserver.unobserve(fill);
        }
      });
    },
    {
      threshold: 0.5,
    }
  );

  skillFills.forEach((fill) => skillObserver.observe(fill));

  // ---- Hero Particles ----
  const particleContainer = document.getElementById('heroParticles');

  function createParticle() {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    const size = Math.random() * 4 + 1;
    const x = Math.random() * 100;
    const duration = Math.random() * 8 + 6;
    const delay = Math.random() * 4;

    particle.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${x}%;
      bottom: -10px;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
      opacity: 0;
    `;

    // Vary colors slightly
    const colors = [
      'rgba(0, 212, 255, 0.6)',
      'rgba(123, 47, 247, 0.5)',
      'rgba(0, 212, 255, 0.4)',
      'rgba(255, 255, 255, 0.3)',
    ];
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];

    particleContainer.appendChild(particle);

    // Remove after animation
    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, (duration + delay) * 1000);
  }

  // Create initial batch
  for (let i = 0; i < 30; i++) {
    createParticle();
  }

  // Continuously generate particles
  setInterval(() => {
    if (particleContainer.children.length < 40) {
      createParticle();
    }
  }, 800);

  // ---- Smooth Anchor Scrolling (fallback for Safari) ----
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const navHeight = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--nav-height')
        );
        const targetPosition = targetEl.offsetTop - navHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    });
  });

  // ---- Tilt effect on project cards (mouse only) ----
  const projectCards = document.querySelectorAll('.project-card');

  projectCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -3;
      const rotateY = ((x - centerX) / centerX) * 3;

      card.style.transform = `translateY(-8px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
});
