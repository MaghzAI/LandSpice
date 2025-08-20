// LandSpices Landing Page JS
(function () {
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    // Keep aria-hidden in sync with viewport (desktop menu is always visible)
    function syncMenuAria() {
      if (window.innerWidth > 820) {
        navMenu.classList.remove('open');
        document.body.classList.remove('menu-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.setAttribute('aria-hidden', 'false');
        // Ensure the rest of the page is interactive on desktop
        if (mainEl) { mainEl.removeAttribute('inert'); mainEl.removeAttribute('aria-hidden'); }
        if (footerEl) { footerEl.removeAttribute('inert'); footerEl.removeAttribute('aria-hidden'); }
      } else {
        const isOpen = navMenu.classList.contains('open');
        navMenu.setAttribute('aria-hidden', String(!isOpen));
      }
    }
    const mainEl = document.getElementById('main');
    const footerEl = document.querySelector('footer.footer');
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navMenu.setAttribute('aria-hidden', String(!isOpen));
      document.body.classList.toggle('menu-open', isOpen);
      if (isOpen) {
        // Move focus to the first menu item for better accessibility when opening
        const firstFocusable = navMenu.querySelector('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) setTimeout(() => firstFocusable.focus(), 0);
        // Inert the rest of the page while menu is open
        if (mainEl) { mainEl.setAttribute('inert', ''); mainEl.setAttribute('aria-hidden', 'true'); }
        if (footerEl) { footerEl.setAttribute('inert', ''); footerEl.setAttribute('aria-hidden', 'true'); }
      } else {
        // Return focus to the toggle when closing
        navToggle.focus();
        // Restore the rest of the page
        if (mainEl) { mainEl.removeAttribute('inert'); mainEl.removeAttribute('aria-hidden'); }
        if (footerEl) { footerEl.removeAttribute('inert'); footerEl.removeAttribute('aria-hidden'); }
      }
    });

    // Close on link click (mobile)
    navMenu.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        // Only close the menu on mobile viewports
        if (window.innerWidth > 820) return;
        const isOpen = navMenu.classList.contains('open');
        if (!isOpen) return;
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('menu-open');
        // Restore page and focus
        if (mainEl) { mainEl.removeAttribute('inert'); mainEl.removeAttribute('aria-hidden'); }
        if (footerEl) { footerEl.removeAttribute('inert'); footerEl.removeAttribute('aria-hidden'); }
        navToggle.focus();
      });
    });

    // Focus trap within mobile menu when open
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab' || !document.body.classList.contains('menu-open')) return;
      const focusables = Array.from(navMenu.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'));
      // Include the toggle as part of the cycle to avoid escaping to page behind
      const cycle = [navToggle, ...focusables].filter(Boolean);
      if (cycle.length === 0) return;
      const first = cycle[0];
      const last = cycle[cycle.length - 1];
      const active = document.activeElement;
      if (e.shiftKey) {
        if (active === first || !cycle.includes(active)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (active === last || !cycle.includes(active)) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    // Close when clicking outside (overlay or outside nav)
    document.addEventListener('click', (e) => {
      if (!document.body.classList.contains('menu-open')) return;
      if (navMenu.contains(e.target) || navToggle.contains(e.target)) return;
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navMenu.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('menu-open');
      // Return focus to the toggle when menu is closed via outside click
      navToggle.focus();
      // Restore page when closed via outside click
      if (mainEl) { mainEl.removeAttribute('inert'); mainEl.removeAttribute('aria-hidden'); }
      if (footerEl) { footerEl.removeAttribute('inert'); footerEl.removeAttribute('aria-hidden'); }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      if (!document.body.classList.contains('menu-open')) return;
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navMenu.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('menu-open');
      if (mainEl) { mainEl.removeAttribute('inert'); mainEl.removeAttribute('aria-hidden'); }
      if (footerEl) { footerEl.removeAttribute('inert'); footerEl.removeAttribute('aria-hidden'); }
      navToggle.focus();
    });

    // Keep ARIA/state in sync on resize
    window.addEventListener('resize', syncMenuAria);
    // Initial sync on load
    syncMenuAria();
  }

  // i18n, direction, and theme
  const root = document.documentElement;
  const STORAGE = { lang: 'landspices_lang', theme: 'landspices_theme' };

  // Translation dictionary
  const i18n = {
    ar: {
      'skip.to_content': 'تخطٍ إلى المحتوى',
      'nav.products': 'المنتجات',
      'nav.quality': 'الجودة',
      'nav.partners': 'الشركاء',
      'nav.about': 'من نحن',
      'nav.faq': 'الأسئلة الشائعة',
      'nav.cta_contact': 'اطلب الآن',

      'hero.eyebrow': 'صُنع في اليمن • جودة عالمية',
      'hero.title': 'الجودة اليمنية بطعم عالمي',
      'hero.lead': 'نصنع منتجات غذائية عالية الجودة من مكونات يمنية خالصة. رسالتنا الجودة، ورؤيتنا: صنع في اليمن عالميًا.',
      'hero.cta_whatsapp': 'تواصل واتساب',
      'hero.cta_explore': 'استكشف المنتجات',
      'hero.badge1': 'مكونات يمنية خالصة',
      'hero.badge2': 'جودة تستحق الاختيار',
      'hero.badge3': 'نَكهات أصلية',

      'section.products.title': 'منتجاتنا',
      'section.products.sub': 'من الأرض اليمنية إلى مائدتكم.',

      'product1.title': 'شطة لاند سبايس الحارة',
      'product1.desc': 'شطة يمنية بمذاق حار متوازن ونكهة أصيلة.',
      'product2.title': 'كاتشب لاند سبايس',
      'product2.desc': 'كاتشب بطعم غني ومكونات يمنية مختارة.',
      'product3.title': 'مسحوق الطماطم المجففة',
      'product3.desc': 'طماطم طبيعية 100% بدون مواد حافظة.',
      'product4.title': 'مسحوق البسباس المبهر',
      'product4.desc': 'فلفل مطحون مع الثوم والبهارات؛ لذيذ وسهل التقديم.',

      'section.quality.title': 'لماذا لاند سبايس؟',
      'section.quality.sub': 'نهتم بأدق التفاصيل لتقديم طعم أصيل وثابت.',
      'quality1.title': 'أصالة يمنية',
      'quality1.desc': 'مكونات يمنية مختارة بروح أصيلة.',
      'quality2.title': 'معايير جودة',
      'quality2.desc': 'عمليات إنتاج دقيقة لضمان الجودة.',
      'quality3.title': 'ثقة وتميز',
      'quality3.desc': 'نكهات مميزة تنافس المنتجات العالمية.',

      'section.partners.title': 'شركاؤنا',
      'section.partners.sub': 'نفخر بثقة شركائنا وعملائنا.',

      'section.about.title': 'من نحن',
      'section.about.text': 'لاند سبايس شركة يمنية ناشئة وقوية متخصصة في المنتجات الغذائية عالية الجودة. رسالتنا <strong>الجودة</strong>، ورؤيتنا <strong>صنع في اليمن عالميًا</strong>.',

      'section.faq.title': 'الأسئلة الشائعة',
      'section.faq.sub': 'إجابات سريعة على أكثر الأسئلة تكرارًا.',
      'faq.answer': 'الإجابة',
      'faq1.q': 'ما هي مكونات منتجاتكم؟',
      'faq1.a': 'نستخدم مكونات يمنية طبيعية مختارة بعناية لضمان جودة وطعم أصيل.',
      'faq2.q': 'هل توفرون كميات جملة للمطاعم؟',
      'faq2.a': 'نعم، تتوفر عبوات كبيرة للمطاعم وشركاء الضيافة والتوريد.',
      'faq3.q': 'أين تتوفر منتجاتكم؟',
      'faq3.a': 'يمكن طلبها مباشرة عبر واتساب أو البريد، وبالتعاون مع متاجر وموزعين مختارين.',
      'faq4.q': 'هل تقدمون شحنًا خارج اليمن؟',
      'faq4.a': 'نتعاون مع شركاء لوجستيين لتوفير الشحن حسب الكميات والوجهة. تواصلوا معنا للتفاصيل.',

      'section.contact.title': 'تواصل معنا',
      'section.contact.sub': 'لطلب الجملة والتوزيع أو للاستفسارات.',
      'contact.quick': 'اتصال سريع',
      'contact.whatsapp_label': 'واتساب المبيعات',
      'contact.copy': 'نسخ',
      'contact.message_us': 'راسلنا',
      'contact.email.title': 'البريد الإلكتروني',
      'contact.email.send': 'أرسل رسالة',

      'footer.copy': '© <span id="year"></span> لاند سبايس LandSpices. جميع الحقوق محفوظة.',

      'toast.copied': 'تم النسخ ✅',
      'toast.failed': 'تعذر النسخ',

      'aria.back_to_top': 'العودة للأعلى',
      'aria.scroll_down': 'تصفح للأسفل',
      'aria.menu': 'قائمة',
      'aria.whatsapp': 'واتساب',
      'aria.theme': 'تبديل الثيم',
      'aria.lang': 'تغيير اللغة',
      'aria.navigation': 'التنقل الرئيسي'
    },
    en: {
      'skip.to_content': 'Skip to content',
      'nav.products': 'Products',
      'nav.quality': 'Quality',
      'nav.partners': 'Partners',
      'nav.about': 'About',
      'nav.faq': 'FAQ',
      'nav.cta_contact': 'Order Now',

      'hero.eyebrow': 'Made in Yemen • World-class Quality',
      'hero.title': 'Yemeni quality with a global taste',
      'hero.lead': 'We craft high-quality food products from pure Yemeni ingredients. Our mission is quality; our vision: Made in Yemen, globally.',
      'hero.cta_whatsapp': 'WhatsApp Us',
      'hero.cta_explore': 'Explore Products',
      'hero.badge1': 'Pure Yemeni ingredients',
      'hero.badge2': 'Quality worth choosing',
      'hero.badge3': 'Authentic flavors',

      'section.products.title': 'Our Products',
      'section.products.sub': 'From Yemeni land to your table.',

      'product1.title': 'LandSpices Hot Chili Sauce',
      'product1.desc': 'Balanced heat with an authentic Yemeni taste.',
      'product2.title': 'LandSpices Ketchup',
      'product2.desc': 'Rich taste with carefully selected ingredients.',
      'product3.title': 'Dried Tomato Powder',
      'product3.desc': '100% natural, no preservatives.',
      'product4.title': 'Seasoned Basbas Powder',
      'product4.desc': 'Ground chili with garlic and spices; tasty and easy to serve.',

      'section.quality.title': 'Why LandSpices?',
      'section.quality.sub': 'We care about every detail to deliver an authentic, consistent taste.',
      'quality1.title': 'Yemeni Authenticity',
      'quality1.desc': 'Selected Yemeni ingredients with authentic spirit.',
      'quality2.title': 'Quality Standards',
      'quality2.desc': 'Precise production processes for guaranteed quality.',
      'quality3.title': 'Trust & Distinction',
      'quality3.desc': 'Distinctive flavors that compete globally.',

      'section.partners.title': 'Our Partners',
      'section.partners.sub': 'We are proud of our partners’ and customers’ trust.',

      'section.about.title': 'About Us',
      'section.about.text': 'LandSpices is a strong Yemeni startup specialized in high-quality food products. Our mission is <strong>quality</strong>, and our vision is <strong>Made in Yemen, globally</strong>.',

      'section.faq.title': 'Frequently Asked Questions',
      'section.faq.sub': 'Quick answers to the most common questions.',
      'faq.answer': 'Answer',
      'faq1.q': 'What are your product ingredients?',
      'faq1.a': 'We use carefully selected natural Yemeni ingredients for authentic quality and taste.',
      'faq2.q': 'Do you supply wholesale for restaurants?',
      'faq2.a': 'Yes, we provide large packs for restaurants and hospitality partners.',
      'faq3.q': 'Where are your products available?',
      'faq3.a': 'Order directly via WhatsApp or email; also via selected stores and distributors.',
      'faq4.q': 'Do you ship outside Yemen?',
      'faq4.a': 'We work with logistics partners to ship based on quantity and destination. Contact us for details.',

      'section.contact.title': 'Contact Us',
      'section.contact.sub': 'For wholesale and distribution orders or inquiries.',
      'contact.quick': 'Quick contact',
      'contact.whatsapp_label': 'Sales WhatsApp',
      'contact.copy': 'Copy',
      'contact.message_us': 'Message us',
      'contact.email.title': 'Email',
      'contact.email.send': 'Send Email',

      'footer.copy': '© <span id="year"></span> LandSpices. All rights reserved.',

      'toast.copied': 'Copied ✅',
      'toast.failed': 'Could not copy',

      'aria.back_to_top': 'Back to top',
      'aria.scroll_down': 'Scroll down',
      'aria.menu': 'Menu',
      'aria.whatsapp': 'WhatsApp',
      'aria.theme': 'Switch theme',
      'aria.lang': 'Change language',
      'aria.navigation': 'Main navigation'
    }
  };

  let currentLang = (localStorage.getItem(STORAGE.lang) || (root.getAttribute('lang') === 'en' ? 'en' : 'ar'));
  function t(key) {
    return (i18n[currentLang] && i18n[currentLang][key]) || key;
  }

  function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const val = t(key);
      if (val != null) el.innerHTML = val;
    });
  }

  function applyAriaLabels() {
    const backTop = document.getElementById('backToTop');
    if (backTop) backTop.setAttribute('aria-label', t('aria.back_to_top'));
    const scrollDown = document.getElementById('scrollDown');
    if (scrollDown) scrollDown.setAttribute('aria-label', t('aria.scroll_down'));
    const navToggleBtn = document.getElementById('navToggle');
    if (navToggleBtn) navToggleBtn.setAttribute('aria-label', t('aria.menu'));
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) themeToggle.setAttribute('aria-label', t('aria.theme'));
    const langToggle = document.getElementById('langToggle');
    if (langToggle) langToggle.setAttribute('aria-label', t('aria.lang'));
    const navRoot = document.getElementById('nav');
    if (navRoot) navRoot.setAttribute('aria-label', t('aria.navigation'));
    document.querySelectorAll('.copy-btn').forEach((btn) => btn.setAttribute('aria-label', t('contact.copy')));
    const wa = document.querySelector('.float-whatsapp');
    if (wa) wa.setAttribute('aria-label', t('aria.whatsapp'));
    // Update FAQ answers region labels (only if not already labelled by a heading)
    document.querySelectorAll('.faq__a').forEach((panel) => {
      if (!panel.hasAttribute('aria-labelledby')) {
        panel.setAttribute('aria-label', t('faq.answer'));
      }
    });
  }

  function updateLangToggleUI() {
    const btn = document.getElementById('langToggle');
    if (btn) btn.textContent = currentLang.toUpperCase();
  }
  function updateThemeToggleUI() {
    const btn = document.getElementById('themeToggle');
    const themeNow = root.getAttribute('data-theme') || 'light';
    if (btn) btn.textContent = themeNow === 'dark' ? '🌙' : '☀️';
  }

  function updateProgressOrigin() {
    const el = document.getElementById('progress');
    if (el) el.style.transformOrigin = (root.getAttribute('dir') === 'rtl') ? 'right' : 'left';
  }

  function setLang(lang) {
    currentLang = lang === 'en' ? 'en' : 'ar';
    root.setAttribute('lang', currentLang);
    root.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');
    localStorage.setItem(STORAGE.lang, currentLang);
    applyTranslations();
    updateYear();
    applyAriaLabels();
    updateLangToggleUI();
    updateProgressOrigin();
    // Reposition indicator and refresh progress without directly depending on onScroll
    positionNavIndicator();
    window.requestAnimationFrame(() => window.dispatchEvent(new Event('scroll')));
  }

  function setTheme(theme) {
    const tVal = theme === 'dark' ? 'dark' : 'light';
    root.setAttribute('data-theme', tVal);
    localStorage.setItem(STORAGE.theme, tVal);
    updateThemeToggleUI();
    setThemeMetaColor();
  }
  function initTheme() {
    const saved = localStorage.getItem(STORAGE.theme);
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const prefersDark = mql.matches;
    setTheme(saved ? saved : (prefersDark ? 'dark' : 'light'));
    if (!saved) {
      mql.addEventListener('change', (e) => setTheme(e.matches ? 'dark' : 'light'));
    }
  }

  function setThemeMetaColor() {
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'theme-color');
      document.head.appendChild(meta);
    }
    const themeNow = root.getAttribute('data-theme') || 'light';
    const bg = (getComputedStyle(root).getPropertyValue('--bg') || '').trim() || (themeNow === 'dark' ? '#0f0f12' : '#fffaf8');
    meta.setAttribute('content', bg);
  }
  function initLang() {
    const saved = localStorage.getItem(STORAGE.lang);
    setLang(saved ? saved : (root.getAttribute('lang') === 'en' ? 'en' : 'ar'));
  }

  const langBtn = document.getElementById('langToggle');
  if (langBtn) langBtn.addEventListener('click', () => setLang(currentLang === 'ar' ? 'en' : 'ar'));
  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) themeBtn.addEventListener('click', () => setTheme((root.getAttribute('data-theme') || 'light') === 'dark' ? 'light' : 'dark'));

  // Initialize theme, language, ARIA labels and progress origin
  initTheme();
  initLang();

  // FAQ accordion
  const faqButtons = Array.from(document.querySelectorAll('.faq__q'));
  if (faqButtons.length) {
    function closeAll() {
      faqButtons.forEach((b) => {
        const id = b.getAttribute('aria-controls');
        const panel = id ? document.getElementById(id) : null;
        b.setAttribute('aria-expanded', 'false');
        if (panel) {
          // If panel was set to 'none' after expand, re-enable height for collapse
          if (panel.style.maxHeight === 'none') {
            panel.style.maxHeight = panel.scrollHeight + 'px';
            // force reflow before collapsing
            void panel.offsetHeight;
          }
          // Clear any pending fallback timers when collapsing
          if (panel._expandTimer) {
            clearTimeout(panel._expandTimer);
            panel._expandTimer = null;
          }
          panel.style.maxHeight = '0px';
          panel.setAttribute('aria-hidden', 'true');
        }
      });
    }
    faqButtons.forEach((btn) => {
      const id = btn.getAttribute('aria-controls');
      const panel = id ? document.getElementById(id) : null;
      if (!panel) return;
      // After expanding, allow content growth by removing max-height constraint
      panel.addEventListener('transitionend', (ev) => {
        if (ev.propertyName !== 'max-height') return;
        if (btn.getAttribute('aria-expanded') === 'true') {
          panel.style.maxHeight = 'none';
        }
      });
      btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        closeAll();
        if (!expanded) {
          btn.setAttribute('aria-expanded', 'true');
          panel.setAttribute('aria-hidden', 'false');
          // ensure starting from 0 for transition and force reflow before expanding
          panel.style.maxHeight = '0px';
          void panel.offsetHeight;
          panel.style.maxHeight = panel.scrollHeight + 'px';
          // Fallback: if transitionend doesn't fire (e.g., due to rounding), ensure unlock
          if (panel._expandTimer) clearTimeout(panel._expandTimer);
          panel._expandTimer = setTimeout(() => {
            if (btn.getAttribute('aria-expanded') === 'true') {
              panel.style.maxHeight = 'none';
            }
            panel._expandTimer = null;
          }, 350);
        }
      });
    });
    window.addEventListener('resize', () => {
      document.querySelectorAll('.faq__q[aria-expanded="true"]').forEach((btn) => {
        const id = btn.getAttribute('aria-controls');
        const p = id ? document.getElementById(id) : null;
        if (p) p.style.maxHeight = p.scrollHeight + 'px';
      });
    });
  }

  // Copy to clipboard with toast
  function ensureToast() {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      toast.setAttribute('aria-atomic', 'true');
      document.body.appendChild(toast);
    }
    return toast;
  }
  function showToast(msg) {
    const toast = ensureToast();
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._hideTimer);
    toast._hideTimer = setTimeout(() => toast.classList.remove('show'), 1600);
  }
  document.querySelectorAll('.copy-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const text = btn.getAttribute('data-copy');
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
        showToast(t('toast.copied'));
      } catch (err) {
        // Fallback
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand('copy');
          showToast(t('toast.copied'));
        } catch (e) {
          showToast(t('toast.failed'));
        } finally {
          document.body.removeChild(ta);
        }
      }
    });
  });
  // Hero references and reduced-motion flag (declare early to avoid TDZ before use)
  const heroBg = document.querySelector('.hero__bg');
  const heroDecor = document.querySelector('.hero__decor');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Optional: light pointer parallax for hero decor (disables float animation while active)
  const heroEl = document.querySelector('.hero');
  if (heroEl && heroDecor && !reduce) {
    let moveTimer;
    heroEl.addEventListener('mousemove', (e) => {
      const spans = heroDecor.querySelectorAll('span');
      const rect = heroEl.getBoundingClientRect();
      const rx = (e.clientX - rect.left) / rect.width - 0.5;
      const ry = (e.clientY - rect.top) / rect.height - 0.5;
      spans.forEach((s, i) => {
        s.style.animation = 'none';
        const depth = (i + 1) * 4; // px
        s.style.transform = `translate3d(${(-rx * depth).toFixed(1)}px, ${(-ry * depth).toFixed(1)}px, 0)`;
      });
      clearTimeout(moveTimer);
      moveTimer = setTimeout(() => {
        spans.forEach((s) => {
          s.style.animation = '';
          s.style.transform = '';
        });
      }, 200);
    });
    heroEl.addEventListener('mouseleave', () => {
      heroDecor.querySelectorAll('span').forEach((s) => {
        s.style.animation = '';
        s.style.transform = '';
      });
    });
  }

  // Smooth scroll for internal links (fallback for browsers without CSS smooth behavior)
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (!id || id === '#' || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      // Respect reduced motion preference
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
      history.replaceState(null, '', id);
    });
  });

  // Reveal animations (IntersectionObserver with fallback)
  const revealEls = Array.from(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) entry.target.classList.add('show');
        }
      },
      { threshold: 0.2 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    // No IO support: reveal immediately
    revealEls.forEach((el) => el.classList.add('show'));
  }

  // Safety: reveal items currently in viewport on load/scroll in case IO misses
  function revealVisibleNow() {
    for (const el of revealEls) {
      if (el.classList.contains('show')) continue;
      const rect = el.getBoundingClientRect();
      if (rect.bottom <= 0 || rect.top >= window.innerHeight) continue;
      // Consider it visible enough
      el.classList.add('show');
    }
  }
  window.addEventListener('load', () => setTimeout(revealVisibleNow, 60));
  window.addEventListener('scroll', revealVisibleNow, { passive: true });
  // Initial pass to reveal anything already in view and disable CSS fallbacks
  try {
    revealVisibleNow();
    const docEl = document.documentElement;
    if (docEl.classList) { docEl.classList.remove('no-js'); docEl.classList.add('js'); }
    document.body.setAttribute('data-reveal-init', '1');
  } catch (e) { /* noop */ }
  // Safety: if nothing revealed after a short delay, show critical sections
  setTimeout(() => {
    try {
      const shownCount = document.querySelectorAll('.reveal.show').length;
      if (shownCount === 0) {
        document.querySelectorAll('#products .reveal, #quality .reveal, #about .reveal')
          .forEach((el) => el.classList.add('show'));
      }
    } catch (e) { /* noop */ }
  }, 1500);
  // Mark reveal system initialized so CSS fallback can disable itself
  try { document.body.setAttribute('data-reveal-init', '1'); } catch (e) {}

  // Dynamic year in footer
  function updateYear() {
    const y = document.getElementById('year');
    if (y) y.textContent = String(new Date().getFullYear());
  }
  updateYear();

  // Header shadow on scroll + Scroll progress + Scroll spy
  const header = document.querySelector('.header');
  // Ensure content does not slide under fixed header
  function adjustBodyOffset() {
    try {
      if (!header) return;
      const h = header.offsetHeight;
      document.body.style.paddingTop = h + 'px';
      document.documentElement.style.setProperty('--header-offset', h + 'px');
    } catch (e) { /* noop */ }
  }
  const progressEl = document.getElementById('progress');
  const backTop = document.getElementById('backToTop');
  const navLinks = Array.from(document.querySelectorAll('.nav__menu a[href^="#"]'));
  const navEl = document.querySelector('.nav');
  let navIndicator = null;
  const sections = navLinks
    .map((l) => document.querySelector(l.getAttribute('href')))
    .filter(Boolean);

  function ensureNavIndicator() {
    if (!navEl || navIndicator) return;
    navIndicator = document.createElement('span');
    navIndicator.className = 'nav__indicator';
    navEl.appendChild(navIndicator);
  }

  function positionNavIndicator() {
    if (!navEl) return;
    ensureNavIndicator();
    if (!navIndicator) return;
    const active = document.querySelector('.nav__menu a.active');
    const targetEl = active || navLinks[0] || null;
    if (!targetEl) {
      navIndicator.style.width = '0px';
      navIndicator.style.opacity = '0';
      return;
    }
    const navRect = navEl.getBoundingClientRect();
    const rect = targetEl.getBoundingClientRect();
    const width = rect.width;
    const isRTL = (root.getAttribute('dir') || document.dir || 'rtl') === 'rtl';
    navIndicator.style.width = width + 'px';
    if (isRTL) {
      const right = Math.max(0, navRect.right - rect.right);
      navIndicator.style.right = right + 'px';
      navIndicator.style.left = 'auto';
    } else {
      const left = Math.max(0, rect.left - navRect.left);
      navIndicator.style.left = left + 'px';
      navIndicator.style.right = 'auto';
    }
    navIndicator.style.opacity = '1';
  }

  function onScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;
    if (progressEl) progressEl.style.transform = `scaleX(${progress.toFixed(3)})`;
    if (header) header.classList.toggle('scrolled', scrollTop > 8);
    if (backTop) backTop.classList.toggle('show', scrollTop > 400);

    // Scroll spy: mark active section
    for (const link of navLinks) { link.classList.remove('active'); link.removeAttribute('aria-current'); }
    let currentId = null;
    for (const sec of sections) {
      if (!sec.id) continue;
      const rect = sec.getBoundingClientRect();
      const headerH = header ? header.offsetHeight : 90;
      const offsetTop = rect.top - (headerH + 20); // dynamic header offset
      if (offsetTop <= 0) currentId = `#${sec.id}`;
    }
    if (currentId) {
      const active = navLinks.find((l) => l.getAttribute('href') === currentId);
      if (active) { active.classList.add('active'); active.setAttribute('aria-current', 'location'); }
    } else if (navLinks[0]) {
      // Default to first link for better a11y when no section is active yet
      navLinks[0].setAttribute('aria-current', 'location');
    }
    positionNavIndicator();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  adjustBodyOffset();
  onScroll();

  // Reposition nav indicator on resize and after clicks
  window.addEventListener('resize', () => { positionNavIndicator(); adjustBodyOffset(); });
  navLinks.forEach((link) => link.addEventListener('click', () => {
    setTimeout(positionNavIndicator, 150);
  }));

  // Hero parallax (light) + decor
  function parallax() {
    if (reduce) return;
    const y = Math.min((window.scrollY || 0) * 0.08, 60);
    if (heroBg) heroBg.style.transform = `translateY(${y.toFixed(1)}px)`;
    if (heroDecor) heroDecor.style.transform = `translateY(${(-y * 0.4).toFixed(1)}px)`;
  }
  window.addEventListener('scroll', parallax, { passive: true });
  parallax();

  // Tilt effect for cards
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced) {
    document.querySelectorAll('.tilt').forEach((card) => {
      const strength = 10; // deg
      const perspective = 800; // px
      function handleMove(e) {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const px = (e.clientX - cx) / (rect.width / 2);
        const py = (e.clientY - cy) / (rect.height / 2);
        const rx = py * strength; // X rotates with Y movement
        const ry = -px * strength; // Y rotates with X movement (rtl friendly)
        card.style.transform = `perspective(${perspective}px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
      }
      function reset() {
        card.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg)`;
      }
      card.addEventListener('mousemove', handleMove);
      card.addEventListener('mouseleave', reset);
    });
  }
})();
