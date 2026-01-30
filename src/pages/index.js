import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import CodeBlock from '@theme/CodeBlock';
import styles from './index.module.css';

/* =====================
   Hero Section
===================== */
function Hero() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <header className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.heroGrid}>
          <div className={styles.heroText}>
            <Heading as="h1" className={styles.title}>
              {siteConfig.title}
            </Heading>
            <p className={styles.subtitle}>
              لغة برمجة عربية حديثة، مستوحاة من بايثون، مصممة للوضوح والبساطة.
            </p>

            <div className={styles.actions}>
              <Link
                className="button button--primary button--lg"
                to="/docs/home">
                ابدأ الآن
              </Link>
              <Link
                className="button button--secondary button--lg"
                to="/docs/tutorial/02-intro">
                دليل اللغة
              </Link>
            </div>
          </div>

          <div className={styles.heroLogo}>
            <img src="/img/logo.svg" data-dark="/img/logo-dark.svg" alt={siteConfig.title} className={`logoSvg ${styles.logoImg}`} />
          </div>
        </div>
      </div>
    </header>
  );
}


/* =====================
   Code Showcase
===================== */
function CodeShowcase() {
  return (
    <section className={styles.codeShowcase}>
      <div className={styles.container}>
        <div className={styles.codeInner}>
          <Heading as="h2" className={styles.sectionTitle}>مثال سريع</Heading>
          <div className={styles.codeMockup}>
            <CodeBlock language="daad">{`# مثال بلغة ض
دالة حساب_المجموع(قائمة):
    مجموع = 0
    لكل عنصر في قائمة:
        مجموع += عنصر
    ارجع مجموع

اطبع(حساب_المجموع([1, 2, 3, 4]))
`}</CodeBlock>
          </div>
        </div>
      </div>
    </section>
  );
}


/* =====================
   Features Section
===================== */
function Features() {
  const features = [
    {
      title: 'قريبة من بايثون',
      description: 'بنية مألوفة وفلسفة بسيطة مع كلمات مفتاحية عربية.'
    },
    {
      title: 'مناسبة للتعلم',
      description: 'مصممة للطلاب والمبتدئين في البرمجة.'
    },
    {
      title: 'مفتوحة المصدر',
      description: 'مشروع مجتمعي مفتوح وقابل للتوسعة.'
    },
    {
      title: 'خفيفة وسريعة',
      description: 'مفسر بسيط للتجارب والتعليم.'
    }
  ];

  return (
    <section className={styles.features}>
      <div className={styles.container}>
        <Heading as="h2" className={styles.sectionTitle}>
          لماذا لغة ض؟
        </Heading>

        <div className={styles.featuresGrid}>
          {features.map((f) => (
            <div key={f.title} className={styles.featureCard}>
              <h3>{f.title}</h3>
              <p>{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =====================
   Homepage
===================== */
export default function Home() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={siteConfig.title}
      description="لغة ض — لغة برمجة عربية حديثة">
      <main>
        <Hero />
        <CodeShowcase />
        <Features />
      </main>
    </Layout>
  );
}
