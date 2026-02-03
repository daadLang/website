import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function SimpleDownload() {
  const releasesUrl = 'https://github.com/daadLang/website/releases';
  const languageReleases = 'https://github.com/daadLang/daad/releases';
  const editorReleases = 'https://github.com/daadLang/d-editor/releases';
  const advanced = useBaseUrl('/download');

  return (
    <Layout title="تنزيل بسيط" description="صفحة تنزيل بسيطة تشير إلى إصدارات GitHub">
      <main className="container" style={{ padding: 'var(--ifm-leading) 0' }}>
        <div style={{ maxWidth: 920 }}>
          <div className="hero__title" style={{ marginTop: 0 }}>
            <h1>تنزيل ض</h1>
            <p style={{ marginTop: 8, fontSize: 18 }}>
              اختر ما تريد تنزيله من الروابط الرسمية على GitHub — الحزم الرسمية والـ installers للمشاريع.
            </p>
          </div>

          <div style={{ marginTop: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a
              className="button button--primary button--lg"
              href={languageReleases}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="تحميل لغة ض من الإصدارات"
            >
              تحميل اللغة — ض
            </a>

            <a
              className="button button--secondary button--lg"
              href={editorReleases}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="تحميل المحرر"
            >
              تحميل المحرر
            </a>

  
          </div>
          
          <br />

          <section style={{ marginTop: 20 }}>
          <h3>معلومة :</h3>
          <p style={{ marginTop: 6 }}>
            هذا المشروع لا يزال قيد التطوير. سنكون سعداء بتلقي ملاحظاتك — يرجى التواصل معنا إذا واجهت أي مشاكل أو كانت لديك اقتراحات.
          </p>

            <br />

            <div className="theme-admonition theme-admonition-warning admonition_xJq3 alert alert--warning" style={{ marginTop: 20 }}>
              <strong>ملاحظة :</strong>
              <p style={{ marginTop: 6 }}>
                تأكد دوماً من تنزيل الملفات من صفحة الإصدارات الرسمية وتحقق من توقيع الإصدار
                إذا كان متوفراً.
              </p>
            </div>


           
          </section>
        </div>
      </main>
    </Layout>
  );
}
