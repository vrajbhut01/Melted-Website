/* ============================================================
   MELTED — Main JavaScript
   Vanilla JS · No frameworks · No dependencies
   ============================================================ */

/* ------------------------------------------------------------
   WEB3FORMS ACCESS KEY (used by js/newsletter.js)
   ------------------------------------------------------------ */
const WEB3FORMS_KEY = "7c69feb1-39fe-4b02-8255-79a48c8b54e5";

(function () {
  'use strict';

  var header       = document.getElementById('site-header');
  var navToggle    = document.getElementById('nav-toggle');
  var navMenu      = document.getElementById('nav-menu');
  var navClose     = document.getElementById('nav-close');
  var productsGrid = document.getElementById('products-grid');
  var filterTabs   = document.querySelectorAll('.filter-tab');


  /* ---------------------------------------------------------
     1. LOGO IMAGE FALLBACK
     --------------------------------------------------------- */
  var logoImgs = document.querySelectorAll('.nav__logo img');
  logoImgs.forEach(function (img) {
    if (img.complete && img.naturalWidth === 0) {
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
     2. STICKY NAV — filled cocoa background on scroll
     --------------------------------------------------------- */
  if (header && !header.classList.contains('site-header--solid')) {
    var scrollTicking = false;

    function handleScroll() {
      if (!scrollTicking) {
        window.requestAnimationFrame(function () {
          if (window.scrollY > 40) {
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
    handleScroll();
  }


  /* ---------------------------------------------------------
     3. HAMBURGER MENU (slide-in overlay + focus trap)
     --------------------------------------------------------- */
  function getFocusableElements() {
    if (!navMenu) return [];
    var focusableSelectors = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    return Array.prototype.slice.call(navMenu.querySelectorAll(focusableSelectors));
  }

  function closeMenu(restoreFocus) {
    if (!navToggle || !navMenu) return;
    navToggle.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('open');
    document.body.classList.remove('body--no-scroll');
    if (restoreFocus !== false) {
      navToggle.focus();
    }
  }

  function openMenu() {
    if (!navToggle || !navMenu) return;
    navToggle.setAttribute('aria-expanded', 'true');
    navMenu.classList.add('open');
    document.body.classList.add('body--no-scroll');
    var target = navClose || navMenu.querySelector('.nav__link');
    if (target) target.focus();
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

  if (navClose) {
    navClose.addEventListener('click', function () {
      closeMenu(true);
    });
  }

  if (navMenu) {
    var allMenuLinks = navMenu.querySelectorAll('a');
    allMenuLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        closeMenu(false);
      });
    });
  }

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
        if (document.activeElement === first || !navMenu.contains(document.activeElement)) {
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


  /* ---------------------------------------------------------
     4. SMOOTH SCROLL FOR SAME-PAGE ANCHORS (#brand-story)
     --------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"], a[href^="index.html#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      var hashIndex = href.indexOf('#');
      if (hashIndex === -1) return;

      var targetId = href.slice(hashIndex);
      if (targetId === '#') return;

      /* Only intercept if target exists on the current page */
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
     5. PRODUCT RENDERING
     --------------------------------------------------------- */
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

      var priceHtml = product.price !== null
        ? '<span class="product-card__price">Rs ' + product.price + '</span>'
        : '<span class="product-card__price">Price coming soon</span>';

      var waNumber = (typeof MELTED_WHATSAPP !== 'undefined') ? MELTED_WHATSAPP : '918140000244';
      var waText = encodeURIComponent(
        'Hi! I\'d like to order ' + product.name + ' - ' + product.flavour + ' (' + product.weight + ')'
      );
      var waUrl = 'https://wa.me/' + waNumber + '?text=' + waText;

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

      var img = card.querySelector('.product-card__image');
      img.addEventListener('error', function () {
        this.classList.add('is-hidden');
      });

      container.appendChild(card);
    });
  }


  /* ---------------------------------------------------------
     6. FILTER TABS
     --------------------------------------------------------- */
  if (filterTabs.length > 0 && productsGrid) {
    renderProducts(productsGrid, 'all');

    filterTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        filterTabs.forEach(function (t) {
          t.classList.remove('filter-tab--active');
          t.setAttribute('aria-selected', 'false');
        });
        this.classList.add('filter-tab--active');
        this.setAttribute('aria-selected', 'true');

        var category = this.getAttribute('data-category');
        renderProducts(productsGrid, category);
      });
    });
  }

})();
