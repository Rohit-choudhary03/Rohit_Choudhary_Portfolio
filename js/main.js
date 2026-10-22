/* ================================================
   MAIN.JS — Core functionality
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ---- Preloader ----
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      preloader.addEventListener('transitionend', () => {
        preloader.style.display = 'none';
      });
    }, 600);
  });

  // Fallback if load already fired
  if (document.readyState === 'complete') {
    setTimeout(() => {
      preloader.classList.add('hidden');
    }, 600);
  }

  // ---- Theme Toggle (Dark / Light) ----
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('portfolio-theme');

  function setTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      if (themeToggle) {
        themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
        themeToggle.setAttribute('aria-label', 'Switch to dark theme');
      }
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (themeToggle) {
        themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
        themeToggle.setAttribute('aria-label', 'Switch to light theme');
      }
    }
    localStorage.setItem('portfolio-theme', theme);
  }

  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    setTheme('dark');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      setTheme(isLight ? 'dark' : 'light');
    });
  }

  // ---- Navbar Scroll ----
  const navbar = document.getElementById('navbar');
  const scrollProgress = document.getElementById('scrollProgress');
  const backToTop = document.getElementById('backToTop');
  const sections = document.querySelectorAll('.section, .hero');

  function onScroll() {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

    // Scroll progress bar
    scrollProgress.style.width = progress + '%';

    // Navbar background
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to top
    if (scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }

    // Active nav link
    updateActiveNav(scrollY);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- Active Nav Link on Scroll ----
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav(scrollY) {
    let current = '';
    sections.forEach((section) => {
      const top = section.offsetTop - 120;
      const bottom = top + section.offsetHeight;
      if (scrollY >= top && scrollY < bottom) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  // ---- Mobile Nav ----
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('open');
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('open');
    });
  });

  // ---- Back to Top ----
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---- Typing Effect ----
  const typedElement = document.getElementById('heroTyped');
  const roles = [
    'AI / Machine Learning Engineer',
    'Full Stack Developer',
    'AWS Certified AI Practitioner',
    'Data Analytics & Predictive Modeler',
    'Java & Spring Boot Engineer',
    'Problem Solver',
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function typeRole() {
    const current = roles[roleIndex];

    if (isDeleting) {
      typedElement.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      typedElement.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 80;
    }

    if (!isDeleting && charIndex === current.length) {
      isDeleting = true;
      typingSpeed = 2000; // Pause before deleting
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400; // Pause before next word
    }

    setTimeout(typeRole, typingSpeed);
  }

  typeRole();

  // ---- Project Filters ----
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      projectCards.forEach((card) => {
        const category = card.dataset.category;
        const shouldShow = filter === 'all' || category === filter;

        if (!shouldShow) {
          card.classList.add('fade-out');
          setTimeout(() => {
            card.classList.add('hidden');
            card.classList.remove('fade-out');
          }, 300);
        } else {
          card.classList.remove('hidden');
          card.classList.remove('fade-out');
          // Trigger reflow then fade in
          void card.offsetWidth;
          card.classList.add('fade-in');
          setTimeout(() => card.classList.remove('fade-in'), 400);
        }
      });
    });
  });

  // ---- Testimonial Slider (if present) ----
  const track = document.getElementById('testimonialTrack');
  const dotsContainer = document.getElementById('testimonialDots');

  if (track && dotsContainer) {
    const testimonialCards = track.querySelectorAll('.testimonial-card');
    let currentSlide = 0;
    let autoPlayTimer;

    // Create dots
    testimonialCards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.classList.add('dot');
      dot.setAttribute('aria-label', `Testimonial ${i + 1}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });

    function goToSlide(index) {
      currentSlide = index;
      track.style.transform = `translateX(-${index * 100}%)`;

      dotsContainer.querySelectorAll('.dot').forEach((d, i) => {
        d.classList.toggle('active', i === index);
      });
    }

    function nextSlide() {
      const next = (currentSlide + 1) % testimonialCards.length;
      goToSlide(next);
    }

    function startAutoPlay() {
      autoPlayTimer = setInterval(nextSlide, 5000);
    }

    function stopAutoPlay() {
      clearInterval(autoPlayTimer);
    }

    startAutoPlay();

    const slider = document.querySelector('.testimonial-slider');
    if (slider) {
      slider.addEventListener('mouseenter', stopAutoPlay);
      slider.addEventListener('mouseleave', startAutoPlay);
    }
  }

  // ---- Contact Form ----
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('.btn-submit');
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    // Simulate sending
    setTimeout(() => {
      submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Sent!';
      formStatus.textContent = 'Thank you! Your message has been sent successfully.';
      formStatus.className = 'form-status success';
      contactForm.reset();

      setTimeout(() => {
        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled = false;
        formStatus.textContent = '';
        formStatus.className = 'form-status';
      }, 3000);
    }, 1500);
  });
});
