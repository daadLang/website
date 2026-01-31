// Swap the navbar logo between light and dark variants depending on site theme.
(function () {
  try {
    const LIGHT = '/img/logo.png';
      const DARK_PNG = '/img/logo-dark.png';
      const DARK_SVG = '/img/logo-dark.svg';

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
