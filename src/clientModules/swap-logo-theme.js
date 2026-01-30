// Swap logo images to dark variants when the site `data-theme` is 'dark'.
// Targets images with class `logoSvg` and `navbar__logo`. If an element has
// a `data-dark` attribute, that URL is used. Otherwise a `-dark` suffix before
// the file extension is attempted (logo.svg -> logo-dark.svg).

(function () {
  function makeDarkSrc(src) {
    if (!src) return src;
    // if already contains -dark, return
    if (/-dark\./i.test(src)) return src;
    // insert -dark before extension
    return src.replace(/(\.[^./?#]+)(?:[?#].*)?$/, '-dark$1');
  }

  function swapForTheme(theme) {
    var imgs = Array.prototype.slice.call(document.querySelectorAll('img.logoSvg, img.navbar__logo, img[data-dark]'));
    if (!imgs.length) {
      console.debug && console.debug('swap-logo-theme: no target images found');
    }
    imgs.forEach(function (img) {
      try {
        // store original src if not already
        if (!img.dataset._origSrc) img.dataset._origSrc = img.getAttribute('src') || img.src || '';
        var light = img.dataset.light || img.dataset._origSrc;
        var dark = img.dataset.dark || img.getAttribute('data-dark') || makeDarkSrc(img.dataset._origSrc || img.src);

        if (theme === 'dark') {
          if (dark) {
            // preload dark image first to avoid broken icon flashes
            var p = new Image();
            p.onload = function () {
              img.src = dark;
              console.debug && console.debug('swap-logo-theme: switched to dark src', dark, img);
            };
            p.onerror = function () {
              console.warn && console.warn('swap-logo-theme: dark src failed to load', dark, img);
            };
            p.src = dark;
          }
        } else {
          if (light) {
            img.src = light;
            console.debug && console.debug('swap-logo-theme: restored light src', light, img);
          }
        }
      } catch (e) {
        console.error && console.error('swap-logo-theme: error while swapping', e);
      }
    });
  }

  function setup() {
    // initial swap based on current attribute
    var theme = document.documentElement.getAttribute('data-theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    swapForTheme(theme);

    // observe attribute changes on <html>
    var obs = new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        if (m.type === 'attributes' && m.attributeName === 'data-theme') {
          var t = document.documentElement.getAttribute('data-theme');
          swapForTheme(t);
        }
      });
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    // also observe DOM additions so logos added later get swapped
    var mo = new MutationObserver(function (mutations) {
      var found = false;
      mutations.forEach(function (m) {
        if (m.addedNodes && m.addedNodes.length) {
          for (var i = 0; i < m.addedNodes.length; i++) {
            var n = m.addedNodes[i];
            if (n.querySelector && (n.querySelector('img.logoSvg') || n.querySelector('img.navbar__logo'))) {
              found = true; break;
            }
            if (n.nodeType === 1 && ((n.classList && n.classList.contains('logoSvg')) || (n.classList && n.classList.contains('navbar__logo')))) {
              found = true; break;
            }
          }
        }
      });
      if (found) {
        var t2 = document.documentElement.getAttribute('data-theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        swapForTheme(t2);
      }
    });
    mo.observe(document.body || document.documentElement, { childList: true, subtree: true });
  }

  if (typeof window !== 'undefined') {
    if (document.readyState === 'complete' || document.readyState === 'interactive') setup();
    else document.addEventListener('DOMContentLoaded', setup);
  }
})();
