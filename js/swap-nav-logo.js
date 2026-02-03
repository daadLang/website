// Swap the navbar logo between light and dark variants depending on site theme.
(function () {
  try {
    // Derive base URL from this script's location so paths work when site
    // is served from a subpath (e.g. `/website/`). We expect this script to
    // be loaded from `<base>/js/swap-nav-logo.js`.
    function getScriptBase() {
      try {
        var s = document.currentScript;
        if (!s) {
          // fallback: find script element by filename
          var scripts = document.getElementsByTagName('script');
          for (var i = 0; i < scripts.length; i++) {
            if (scripts[i].src && /swap-nav-logo\.js(?:[?#].*)?$/.test(scripts[i].src)) { s = scripts[i]; break; }
          }
        }
        if (s && s.src) {
          return s.src.replace(/\/js\/[^\/?#]+(?:[?#].*)?$/, '/');
        }
      } catch (e) {
        // ignore
      }
      // final fallback: assume root
      return '/';
    }

    var BASE = getScriptBase();
    const LIGHT = BASE + 'img/logo.png';
    const DARK_PNG = BASE + 'img/logo-dark.png';
    const DARK_SVG = BASE + 'img/logo-dark.svg';

    function getLogoEl() {
      return (

        document.querySelector('.navbar__brand .navbar__logo')
      );
    }

    function updateLogo() {
      const el = getLogoEl();
      if (!el) return;
      let theme = document.documentElement.getAttribute('data-theme');
      if (!theme) {
        theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      if (theme === 'dark') {
          // prefer PNG, fall back to SVG if PNG missing
          const tryPng = new Image();
          tryPng.onload = function () {
            if (el.getAttribute('src') !== DARK_PNG) el.setAttribute('src', DARK_PNG);
          };
          tryPng.onerror = function () {
            if (el.getAttribute('src') !== DARK_SVG) el.setAttribute('src', DARK_SVG);
          };
          tryPng.src = DARK_PNG;
        } else {
          if (el.getAttribute('src') !== LIGHT) el.setAttribute('src', LIGHT);
        }
    }

    // Update now
    updateLogo();

    // Observe attribute changes on <html> (data-theme/class changes)
    const mo = new MutationObserver(mutations => {
      for (const m of mutations) {
        if (m.type === 'attributes') {
          updateLogo();
          break;
        }
      }
    });
    mo.observe(document.documentElement, { attributes: true, attributeOldValue: true });

    // Observe body subtree in case navbar is mounted later
    const domMo = new MutationObserver(() => updateLogo());
    domMo.observe(document.body, { childList: true, subtree: true, attributes: true });

    // Also listen for clicks/keyboard that might toggle the color mode UI
    document.addEventListener('click', updateLogo, true);
    document.addEventListener('keyup', updateLogo, true);

    // Listen for storage changes (theme stored in localStorage by Docusaurus)
    window.addEventListener('storage', e => {
      if (!e.key || e.key.toLowerCase().includes('theme') || e.key.toLowerCase().includes('color')) {
        updateLogo();
      }
    });
  } catch (e) {
    // noop
  }
})();
