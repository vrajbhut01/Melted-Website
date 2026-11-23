/* ============================================================
   MELTED — Main JavaScript
   Vanilla JS · No frameworks · No dependencies
   ============================================================ */

/* ------------------------------------------------------------
   WEB3FORMS ACCESS KEY
   ------------------------------------------------------------ */
const WEB3FORMS_KEY = "7c69feb1-39fe-4b02-8255-79a48c8b54e5";

(function () {
  'use strict';

  /* ---------------------------------------------------------
     DOM References (with null-checks for multi-page support)
     --------------------------------------------------------- */
  var header          = document.getElementById('site-header');
  var navToggle       = document.getElementById('nav-toggle');
  var navMenu         = document.getElementById('nav-menu');
  var navLinks        = navMenu ? navMenu.querySelectorAll('.nav__link') : [];
  var newsletterForm  = document.getElementById('newsletter-form');
  var newsletterStatus = document.getElementById('newsletter-status');
  var productsGrid    = document.getElementById('products-grid');
  var filterTabs      = document.querySelectorAll('.filter-tab');


  /* ---------------------------------------------------------
     1. LOGO IMAGE FALLBACK
     Text is visually hidden by default to eliminate flashing.
     Only if the image fails to load, display the text fallback.
     --------------------------------------------------------- */
  var logoImgs = document.querySelectorAll('.nav__logo img');
  logoImgs.forEach(function (img) {
    if (img.complete && img.naturalWidth === 0) {
      /* Already errored */
      var parentLogo = img.closest('.nav__logo');
      if (parentLogo) parentLogo.classList.add('nav__logo--img-error');
      img.classList.add('is-hidden');
    } else {
      img.addEventListener('error', function () {
        var parentLogo = this.closest('.nav__logo');
        if (parentLogo) parentLogo.classList.add('nav__logo--img-error');
        this.classList.add('is-hidden');
      });
    }
  });


  /* ---------------------------------------------------------
     2. STICKY NAV — dark background on scroll
     Only runs on pages with a hero (no .site-header--solid).
     --------------------------------------------------------- */
  if (header && !header.classList.contains('site-header--solid')) {
    var scrollTicking = false;

    function handleScroll() {
      if (!scrollTicking) {
        window.requestAnimationFrame(function () {
          if (window.scrollY > 60) {
            header.classList.add('scrolled');
          } else {
            header.classList.remove('scrolled');
          }
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); /* Check on load */
  }


  /* ---------------------------------------------------------
     3. HAMBURGER MENU
     --------------------------------------------------------- */
  function getFocusableElements() {
    if (!navMenu) return [];
    var focusableSelectors = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    var items = Array.prototype.slice.call(navMenu.querySelectorAll(focusableSelectors));
    if (navToggle) items.unshift(navToggle);
    return items;
  }

  function closeMenu(restoreFocus) {
    if (!navToggle || !navMenu) return;
    navToggle.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('open');
    document.body.classList.remove('body--no-scroll');
    if (restoreFocus !== false && navToggle) {
      navToggle.focus();
    }
  }

  function openMenu() {
    if (!navToggle || !navMenu) return;
    navToggle.setAttribute('aria-expanded', 'true');
    navMenu.classList.add('open');
    document.body.classList.add('body--no-scroll');
    var firstLink = navMenu.querySelector('.nav__link');
    if (firstLink) firstLink.focus();
  }

  if (navToggle) {
    navToggle.addEventListener('click', function () {
      var isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        closeMenu(true);
      } else {
        openMenu();
      }
    });
  }

  /* Close when any nav link is clicked */
  if (navMenu) {
    var allMenuLinks = navMenu.querySelectorAll('a');
    allMenuLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        closeMenu(true);
      });
    });
  }

  /* Close on Escape and trap focus when open */
  document.addEventListener('keydown', function (e) {
    if (!navMenu || !navMenu.classList.contains('open')) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      closeMenu(true);
      return;
    }

    if (e.key === 'Tab') {
      var focusables = getFocusableElements();
      if (focusables.length === 0) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first || (!navMenu.contains(document.activeElement) && document.activeElement !== navToggle)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  });

  /* Close when clicking outside the menu */
  document.addEventListener('click', function (e) {
    if (
      navMenu && navMenu.classList.contains('open') &&
      !navMenu.contains(e.target) &&
      navToggle && !navToggle.contains(e.target)
    ) {
      closeMenu(true);
    }
  });


  /* ---------------------------------------------------------
     4. SMOOTH SCROLL FOR SAME-PAGE ANCHORS
     --------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var headerHeight = header ? header.offsetHeight : 0;
        var targetPos = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });


  /* ---------------------------------------------------------
     5. SCROLL-TRIGGERED REVEAL (IntersectionObserver)
     --------------------------------------------------------- */
  function initReveals() {
    var revealEls = document.querySelectorAll('.reveal:not(.revealed)');

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );

      revealEls.forEach(function (el) { observer.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add('revealed'); });
    }
  }

  initReveals();


  /* ---------------------------------------------------------
     6. PRODUCT RENDERING
     Reads from the global MELTED_PRODUCTS array defined in
     js/products.js. Builds cards into #products-grid.
     --------------------------------------------------------- */

  /**
   * Render product cards into the given container.
   * @param {HTMLElement} container  The grid element.
   * @param {string}      category  'all' or a category id.
   */
  function renderProducts(container, category) {
    if (!container || typeof MELTED_PRODUCTS === 'undefined') return;

    container.innerHTML = '';

    var items = (category === 'all')
      ? MELTED_PRODUCTS
      : MELTED_PRODUCTS.filter(function (p) { return p.category === category; });

    if (items.length === 0) {
      container.innerHTML = '<p class="products__empty">No products in this category yet.</p>';
      return;
    }

    items.forEach(function (product, index) {
      var card = document.createElement('article');
      card.className = 'product-card';

      /* Price display */
      var priceHtml;
      if (product.price !== null) {
        priceHtml = '<span class="product-card__price">Rs ' + product.price + '</span>';
      } else {
        priceHtml = '<span class="product-card__price product-card__price--coming-soon">Price coming soon</span>';
      }

      /* WhatsApp link with pre-filled message */
      var waNumber = (typeof MELTED_WHATSAPP !== 'undefined') ? MELTED_WHATSAPP : '918140000244';
      var waText = encodeURIComponent(
        'Hi! I\'d like to order ' + product.name + ' - ' + product.flavour + ' (' + product.weight + ')'
      );
      var waUrl = 'https://wa.me/' + waNumber + '?text=' + waText;

      /* First row of cards (first 2 on mobile grid) has no loading="lazy" for prompt LCP */
      var loadingAttr = index < 2 ? '' : 'loading="lazy" ';

      card.innerHTML =
        '<div class="product-card__image-wrap">' +
          '<img ' +
            'src="' + product.image + '" ' +
            'alt="' + product.alt + '" ' +
            'width="300" height="400" ' +
            loadingAttr +
            'decoding="async" ' +
            'class="product-card__image"' +
          '>' +
        '</div>' +
        '<div class="product-card__body">' +
          '<h3 class="product-card__name">' + product.name + '</h3>' +
          '<p class="product-card__flavour">' + product.flavour + '</p>' +
          '<p class="product-card__weight">' + product.weight + '</p>' +
          '<div class="product-card__footer">' +
            priceHtml +
            '<a href="' + waUrl + '" target="_blank" rel="noopener noreferrer" ' +
              'class="btn btn--whatsapp btn--sm">' +
              '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
                '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>' +
                '<path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.555 4.126 1.527 5.86L0 24l6.335-1.652A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818c-1.91 0-3.727-.5-5.33-1.377l-.38-.222-3.76.98.998-3.648-.248-.394A9.81 9.81 0 012.182 12c0-5.415 4.403-9.818 9.818-9.818S21.818 6.585 21.818 12 17.415 21.818 12 21.818z"/>' +
              '</svg>' +
              'Order' +
            '</a>' +
          '</div>' +
        '</div>';

      /* Handle broken product images — hide img, gradient fallback shows */
      var img = card.querySelector('.product-card__image');
      img.addEventListener('error', function () {
        this.classList.add('is-hidden');
      });

      container.appendChild(card);
    });
  }


  /* ---------------------------------------------------------
     7. FILTER TABS
     --------------------------------------------------------- */
  if (filterTabs.length > 0 && productsGrid) {

    /* Initial render */
    renderProducts(productsGrid, 'all');

    filterTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        /* Update active state */
        filterTabs.forEach(function (t) {
          t.classList.remove('filter-tab--active');
          t.setAttribute('aria-selected', 'false');
        });
        this.classList.add('filter-tab--active');
        this.setAttribute('aria-selected', 'true');

        /* Re-render with selected category */
        var category = this.getAttribute('data-category');
        renderProducts(productsGrid, category);
      });
    });
  }


  /* ---------------------------------------------------------
     8. NEWSLETTER FORM — Web3Forms submission
     --------------------------------------------------------- */
  if (newsletterForm && newsletterStatus) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var emailInput = document.getElementById('newsletter-email');
      var submitButton = newsletterForm.querySelector('button[type="submit"]');
      var honeypotInput = newsletterForm.querySelector('input[name="botcheck"]');
      var email = emailInput ? emailInput.value.trim() : '';

      /* Clear previous status */
      newsletterStatus.textContent = '';
      newsletterStatus.className = 'newsletter__status';

      /* Bot check: silently drop if honeypot was checked/filled */
      if (honeypotInput && (honeypotInput.checked || honeypotInput.value)) {
        return;
      }

      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!email) {
        newsletterStatus.textContent = 'Please enter your email address.';
        newsletterStatus.classList.add('newsletter__status--error');
        if (emailInput) emailInput.focus();
        return;
      }

      if (!emailPattern.test(email)) {
        newsletterStatus.textContent = 'Please enter a valid email address.';
        newsletterStatus.classList.add('newsletter__status--error');
        if (emailInput) emailInput.focus();
        return;
      }

      /* Disable button and display loading state */
      var originalButtonText = submitButton ? submitButton.textContent : 'Subscribe';
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
      }

      /* Build payload using FormData */
      var formData = new FormData();
      formData.append('access_key', WEB3FORMS_KEY);
      formData.append('email', email);
      formData.append('subject', 'New Melted newsletter signup');
      if (honeypotInput && honeypotInput.value) {
        formData.append('botcheck', honeypotInput.value);
      }

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Server responded with ' + response.status);
        }
        return response.json();
      })
      .then(function (data) {
        if (data.success) {
          newsletterStatus.textContent = "You're in! We'll email you about new flavours and offers.";
          newsletterStatus.className = 'newsletter__status newsletter__status--success';
          if (emailInput) emailInput.value = '';
        } else {
          throw new Error(data.message || 'Submission unconfirmed');
        }
      })
      .catch(function () {
        newsletterStatus.textContent = 'Something went wrong. Please email vrajfoods01@gmail.com.';
        newsletterStatus.className = 'newsletter__status newsletter__status--error';
      })
      .finally(function () {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = originalButtonText;
        }
      });
    });
  }

})();
