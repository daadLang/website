import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import Heading from '@theme/Heading';
import styles from './index.module.css';
import React, {useEffect, useRef} from 'react';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  const logoRef = useRef(null);

  useEffect(() => {
    const logo = logoRef.current;
    if (!logo) return undefined;

    const updateLogo = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      logo.src = theme === 'dark' ? '/img/logo-dark.svg' : '/img/logo.svg';
    };

    updateLogo();

    const mo = new MutationObserver(() => updateLogo());
    mo.observe(document.documentElement, { attributes: true });
    return () => mo.disconnect();
  }, []);
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          <img
            ref={logoRef}
            id="hero-logo"
            src="/img/logo.svg"
            alt={siteConfig.title}
            className={clsx(styles.heroLogo, 'heroLogo')}
          />
        </Heading>
        <p className="hero__subtitle">لغة برمجة باللغة العربية</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/home">
            الدروس
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
