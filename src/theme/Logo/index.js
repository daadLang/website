import React, {useEffect, useState} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function Logo(props) {
  const {siteConfig} = useDocusaurusContext();
  const [src, setSrc] = useState('/img/logo.png');

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
        tryPng.onload = () => setSrc('/img/logo-dark.png');
        tryPng.onerror = () => setSrc('/img/logo-dark.svg');
        tryPng.src = '/img/logo-dark.png';
      } else {
        setSrc('/img/logo.png');
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
    <Link to={siteConfig.baseUrl || '/'} {...props}>
      <img className="navbar__logo" src={src} alt={siteConfig.title} style={{height: 36}} />
    </Link>
  );
}
