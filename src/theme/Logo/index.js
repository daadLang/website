import React, {useEffect, useState} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function Logo(props) {
  const {siteConfig} = useDocusaurusContext();
  const logoLight = useBaseUrl('/img/logo.png');
  const logoDarkPng = useBaseUrl('/img/logo-dark.png');
  const logoDarkSvg = useBaseUrl('/img/logo-dark.svg');
  const homeUrl = useBaseUrl('/');

  const [src, setSrc] = useState(logoLight);

  useEffect(() => {
    function update() {
      const html = document.documentElement;
      let theme = html.getAttribute('data-theme');
      if (!theme) {
        theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      if (theme === 'dark') {
        // Prefer PNG dark logo; if not available fall back to SVG
        const tryPng = new Image();
        tryPng.onload = () => setSrc(logoDarkPng);
        tryPng.onerror = () => setSrc(logoDarkSvg);
        tryPng.src = logoDarkPng;
      } else {
        setSrc(logoLight);
      }
    }

    update();

    const mo = new MutationObserver(() => update());
    mo.observe(document.documentElement, { attributes: true });
    window.addEventListener('storage', update);
    return () => {
      mo.disconnect();
      window.removeEventListener('storage', update);
    };
  }, []);

    return (
    <Link to={homeUrl} {...props}>
      <img className="navbar__logo" src={src} alt={siteConfig.title} style={{height: 36}} />
    </Link>
  );
}
