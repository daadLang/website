import React, {useMemo, useState, useEffect} from 'react';
import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Link from '@docusaurus/Link';

// A modern download page: latest release summary, release selector, platform cards

const EXAMPLE_RELEASES = [
  {
    id: 1,
    tag_name: 'v0.2.0',
    name: 'إصدار 0.2.0',
    published_at: '2026-01-15',
    assets: [
      { name: 'daad-0.2.0-windows-installer.exe', browser_download_url: 'https://example.com/downloads/daad-0.2.0-windows-installer.exe' },
      { name: 'daad-0.2.0-mac.dmg', browser_download_url: 'https://example.com/downloads/daad-0.2.0-mac.dmg' },
      { name: 'daad-0.2.0-linux.AppImage', browser_download_url: 'https://example.com/downloads/daad-0.2.0-linux.AppImage' },
      { name: 'daad-0.2.0-lang.zip', browser_download_url: 'https://example.com/downloads/daad-0.2.0-lang.zip' },
      { name: 'daad-0.2.0-ide.zip', browser_download_url: 'https://example.com/downloads/daad-0.2.0-ide.zip' },
    ],
  },
  {
    id: 2,
    tag_name: 'v0.1.0',
    name: 'الإصدار التجريبي 0.1.0',
    published_at: '2025-12-01',
    assets: [
      { name: 'daad-0.1.0.zip', browser_download_url: 'https://example.com/downloads/daad-0.1.0.zip' },
    ],
  },
];

function detectPlatform() {
  if (typeof navigator === 'undefined') return 'linux';
  const p = navigator.platform.toLowerCase();
  if (p.includes('win')) return 'windows';
  if (p.includes('mac') || p.includes('darwin')) return 'mac';
  if (p.includes('linux')) return 'linux';
  return 'linux';
}

function pickAsset(release, pattern) {
  if (!release || !release.assets) return null;
  const found = release.assets.find(a => a.name.toLowerCase().includes(pattern));
  return found || null;
}

function PlatformCard({platform, release, recommended}) {
  const primary = pickAsset(release, platform) || pickAsset(release, 'installer') || release?.assets?.[0];
  const lang = pickAsset(release, 'lang') || pickAsset(release, '.zip') || null;
  const ide = pickAsset(release, 'ide') || null;

  return (
    <div style={{border: recommended ? '2px solid var(--ifm-color-primary)' : '1px solid var(--ifm-color-emphasis-200)', borderRadius: 8, padding: 16, flex: '1 1 280px', minWidth: 220}}>
      <h3 style={{marginTop: 0, textTransform: 'capitalize'}}>{platform}</h3>
      <p style={{marginTop: 4, marginBottom: 12}}>حزمة مُختارة لنظام {platform}.</p>

      <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
        {primary ? (
          <a className="button button--primary" href={primary.browser_download_url} target="_blank" rel="noopener noreferrer" style={{display: 'block', width: '100%', textAlign: 'center'}}>تنزيل مُوصى به — {primary.name}</a>
        ) : (
          <a className="button button--primary" href="#" style={{display: 'block', width: '100%', textAlign: 'center'}}>تنزيل (غير متوفر)</a>
        )}

        <div style={{display: 'flex', gap: 8, marginTop: 8}}>
          {lang ? <a className="button button--secondary" href={lang.browser_download_url} target="_blank" rel="noopener noreferrer" style={{flex: 1}}>اللغة فقط</a> : null}
          {ide ? <a className="button button--secondary" href={ide.browser_download_url} target="_blank" rel="noopener noreferrer" style={{flex: 1}}>IDE فقط</a> : null}
        </div>
      </div>
    </div>
  );
}

export default function DownloadPage() {
  const [releases] = useState(EXAMPLE_RELEASES);
  const [selected, setSelected] = useState(releases[0]);
  const [platform] = useState(() => detectPlatform());
    const [versions, setVersions] = useState(null);

    useEffect(() => {
      // Try to load Docusaurus versions.json (native versioning). If present,
      // use it to provide version choices. This is client-side only.
      async function loadVersions() {
        try {
          const res = await fetch('/versions.json');
          if (!res.ok) return;
          const data = await res.json();
          if (Array.isArray(data) && data.length) {
            setVersions(data);
            // If a version matches a release tag, select it
            const match = data.find(v => releases.some(r => r.tag_name === v));
            if (match) {
              const rel = releases.find(r => r.tag_name === match);
              if (rel) setSelected(rel);
            }
          }
        } catch (e) {
          // ignore - fallback to example data
        }
      }
      loadVersions();
    }, [releases]);

  useEffect(() => {
    // placeholder: later we could fetch real releases here and setSelected accordingly
  }, []);

  const platforms = useMemo(() => ['windows', 'mac', 'linux'], []);

  return (
    <Layout title="تنزيل" description="تنزيل لغة ض وملفاتها">
      <main style={{padding: 'var(--ifm-leading) 0'}}>
        <div className="container">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16}}>
            <div>
              <h1 style={{margin: 0}}>تنزيل ض — {selected.name}</h1>
              <p style={{marginTop: 8}}>تاريخ الإصدار: {selected.published_at}</p>
            </div>

            <div>
              <label style={{display: 'block', marginBottom: 6}}>الإصدار </label>
              {versions ? (
                <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
                  {versions.map(v => (
                    <button key={v} className={v === selected.tag_name ? 'button button--primary' : 'button button--secondary'} onClick={() => {
                      const rel = releases.find(r => r.tag_name === v);
                      if (rel) setSelected(rel);
                    }}>{v}</button>
                  ))}
                </div>
              ) : (
                <div style={{display: 'flex', gap: 8}}>
                  {releases.map(r => (
                    <button key={r.id} className={r.tag_name === selected.tag_name ? 'button button--primary' : 'button button--secondary'} onClick={() => setSelected(r)}>{r.tag_name}</button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <section style={{marginTop: 24}}>
            <h2>اختر نظام التشغيل</h2>
            <div style={{display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap'}}>
              {platforms.map((p) => (
                <PlatformCard key={p} platform={p} release={selected} recommended={p === platform} />
              ))}
            </div>
          </section>

          <section style={{marginTop: 28}}>
            <h2>جميع الإصدارات (مثال)</h2>
            <p>قائمة إصدارات من المثال. لاحقاً يمكن سحب هذه القائمة مباشرة من GitHub Releases عبر API.</p>
            <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
              {releases.map((r) => (
                <div key={r.id} style={{padding: 12, border: '1px solid var(--ifm-color-emphasis-200)', borderRadius: 8}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div>
                      <strong>{r.name}</strong>
                      <div style={{fontSize: 12, color: 'var(--ifm-color-emphasis-500)'}}>تاريخ النشر: {r.published_at}</div>
                    </div>
                    <div style={{display: 'flex', gap: 8}}>
                      {r.assets.map((a) => (
                        <a key={a.name} className="button button--secondary" href={a.browser_download_url} target="_blank" rel="noopener noreferrer">تنزيل {a.name}</a>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </Layout>
  );
}


// -----------------------------
// Releases list (example data)
// -----------------------------

function ReleasesList() {
  // Example data — replace with a real fetch to the GitHub Releases API later.
  const exampleReleases = [
    {
      id: 1,
      tag_name: 'v0.2.0',
      name: 'إصدار 0.2.0',
      published_at: '2026-01-15',
      assets: [
        { name: 'daad-0.2.0-windows-installer.exe', browser_download_url: 'https://example.com/downloads/daad-0.2.0-windows-installer.exe' },
        { name: 'daad-0.2.0-mac.dmg', browser_download_url: 'https://example.com/downloads/daad-0.2.0-mac.dmg' },
        { name: 'daad-0.2.0-linux.AppImage', browser_download_url: 'https://example.com/downloads/daad-0.2.0-linux.AppImage' },
      ],
    },
    {
      id: 2,
      tag_name: 'v0.1.0',
      name: 'الإصدار التجريبي 0.1.0',
      published_at: '2025-12-01',
      assets: [
        { name: 'daad-0.1.0.zip', browser_download_url: 'https://example.com/downloads/daad-0.1.0.zip' },
      ],
    },
  ];

  // Clicking an asset should start download — we'll navigate the browser to the asset URL.
  function download(url) {
    // create an <a> and click it so the browser treats it as a download/navigation.
    const a = document.createElement('a');
    a.href = url;
    a.rel = 'noopener noreferrer';
    // If same-origin and served with Content-Disposition attachment the download will start.
    a.click();
  }

  return (
    <section style={{marginTop: 28}}>
      <h2>الإصدارات</h2>
      <p>قائمة إصدارات من المثال. لاحقاً يمكن سحب هذه القائمة مباشرة من GitHub Releases عبر API.</p>

      <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
        {exampleReleases.map((r) => (
          <div key={r.id} style={{padding: 12, border: '1px solid var(--ifm-color-emphasis-200)', borderRadius: 8}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div>
                <strong>{r.name}</strong>
                <div style={{fontSize: 12, color: 'var(--ifm-color-emphasis-500)'}}>تاريخ النشر: {r.published_at}</div>
              </div>
              <div style={{display: 'flex', gap: 8}}>
                {r.assets.map((a) => (
                  <button key={a.name} className="button button--secondary" onClick={() => download(a.browser_download_url)}>
                    تنزيل {a.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

