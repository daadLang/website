import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function SimpleDownload() {
  const releasesUrl = 'https://github.com/daadLang/website/releases';
  const advanced = useBaseUrl('/download');

  return (
    <Layout title="تنزيل بسيط" description="صفحة تنزيل بسيطة تشير إلى إصدارات GitHub">
      <main className="container" style={{ padding: 'var(--ifm-leading) 0' }}>
        <div style={{ maxWidth: 920 }}>
          <h1 style={{ marginTop: 0 }}>تنزيل بسيط</h1>

          <p>
            هذه صفحة تنزيل مبسطة. للحصول على الإصدارات والملفات القابلة للتنزيل (مثل مثبتات النظام، حزم اللغة، أو حزم IDE)،
            راجع صفحة الإصدارات على GitHub.
          </p>

          <p>
            <a
              className="button button--primary"
              href={releasesUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              فتح صفحة الإصدارات على GitHub
            </a>
          </p>

          <section style={{ marginTop: 20 }}>
            <h2>تعليمات لكل نظام تشغيل</h2>

            <article style={{ marginTop: 12 }}>
              <h3>Windows</h3>
              <p>
                ابحث عن ملفات بصيغ مثل <code>*.exe</code> أو حزم <code>*.zip</code> التي تحتوي على
                المثبّت (مثلاً <code>daad-&lt;version&gt;-windows-installer.exe</code>). عادةً اختر الملف الذي
                يحتوي على كلمة <strong>installer</strong> أو نسخة <code>.exe</code> لتثبيت سهل.
              </p>
            </article>

            <article style={{ marginTop: 12 }}>
              <h3>macOS</h3>
              <p>
                ابحث عن ملفات بصيغ مثل <code>*.dmg</code> أو <code>*.zip</code>. على mac عادةً يكون ملف
                <code>*.dmg</code> مريحاً للتثبيت؛ أما إن وُجدت حزمة <code>*.tar.gz</code> أو <code>*.zip</code> فستحتوي على
                ملفات قابلة للتثبيت يدوياً.
              </p>
            </article>

            <article style={{ marginTop: 12 }}>
              <h3>Linux</h3>
              <p>
                قد تجد <code>*.AppImage</code> أو أرشيفات <code>*.tar.gz</code> أو نماذج حزم خاصة بالتوزيعة
                (مثل <code>.deb</code> أو <code>.rpm</code>). اختر الصيغة المناسبة لتوزيعتك؛ إذا لم تكن متأكداً فالـ
                <code>.AppImage</code> غالباً تعمل مباشرة بعد جعلها قابلة للتنفيذ.
              </p>
            </article>

            <article style={{ marginTop: 12 }}>
              <h3>حزم إضافية</h3>
              <p>
                في صفحة الإصدارات قد ترى أيضاً حزماً مخصصة للـ <strong>لغة فقط</strong> (مثلاً
                <code>*-lang.zip</code>) أو <strong>IDE فقط</strong> (مثلاً <code>*-ide.zip</code>). إذا كنت تريد
                تثبيت اللغة فقط أو تثبيت محرر/امتدادات دون تثبيت كامل، فاختر هذه الحزم.
              </p>
            </article>

            <div style={{ marginTop: 20 }}>
              <strong>ملاحظة قصيرة عن الأمان:</strong>
              <p style={{ marginTop: 6 }}>
                تأكد دوماً من تنزيل الملفات من صفحة الإصدارات الرسمية وتحقق من الشيكسومات أو توقيع الإصدار
                إذا كان متوفراً.
              </p>
            </div>

           
          </section>
        </div>
      </main>
    </Layout>
  );
}
