import React, {useEffect, useMemo, useState} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './download.module.css';

const GITHUB_API = {
  language: 'https://api.github.com/repos/daadLang/daad/releases/latest',
  editor: 'https://api.github.com/repos/daadLang/d-editor/releases/latest',
};

const RELEASE_LINKS = {
  languageAll: 'https://github.com/daadLang/daad/releases',
  editorAll: 'https://github.com/daadLang/d-editor/releases',
};

const OS_LIST = [
  {key: 'windows', label: 'ويندوز'},
  {key: 'macos', label: 'ماك'},
  {key: 'linux', label: 'لينكس'},
  {key: 'android', label: 'أندرويد'},
  {key: 'ios', label: 'iOS'},
];

const DESKTOP_OS_KEYS = new Set(['windows', 'macos', 'linux']);
const MOBILE_OS_KEYS = new Set(['android', 'ios']);

function prioritizeDetectedOS(osList, detectedKey) {
  if (!detectedKey || detectedKey === 'unknown') return osList;
  const detected = osList.find((os) => os.key === detectedKey);
  if (!detected) return osList;
  return [detected, ...osList.filter((os) => os.key !== detectedKey)];
}

const OS_TECH_LABEL = {
  windows: 'Windows',
  macos: 'macOS',
  linux: 'Linux',
  android: 'Android',
  ios: 'iOS',
  unknown: 'Unknown',
};

function isMobileOS(os) {
  return os === 'android' || os === 'ios';
}

function normalizePlatform(raw) {
  const value = String(raw || '').toLowerCase();
  if (value.includes('win')) return 'windows';
  if (value.includes('mac') || value.includes('darwin')) return 'macos';
  if (value.includes('android')) return 'android';
  if (value.includes('iphone') || value.includes('ipad') || value.includes('ipod') || value.includes('ios')) return 'ios';
  if (value.includes('linux') || value.includes('x11')) return 'linux';
  return 'unknown';
}

function normalizeArch(raw) {
  const value = String(raw || '').toLowerCase();
  if (value.includes('arm64') || value.includes('aarch64')) return 'arm64';
  if (value.includes('arm')) return 'arm';
  if (value.includes('x64') || value.includes('x86_64') || value.includes('amd64') || value.includes('win64')) return 'x64';
  if (value.includes('x86') || value.includes('i386') || value.includes('i686') || value.includes('win32')) return 'x86';
  return 'unknown';
}

function detectClient() {
  if (typeof navigator === 'undefined') {
    return {os: 'unknown', arch: 'unknown'};
  }

  const osSource = navigator.userAgentData?.platform || `${navigator.platform} ${navigator.userAgent}`;
  const archSource = navigator.userAgentData?.architecture || `${navigator.platform} ${navigator.userAgent}`;

  return {
    os: normalizePlatform(osSource),
    arch: normalizeArch(archSource),
  };
}

function stageLabel(tag) {
  const t = String(tag || '').toLowerCase();
  if (t.includes('beta')) return 'Beta';
  if (t.includes('alpha')) return 'Alpha';
  if (t.includes('rc')) return 'RC';
  return 'Stable';
}

function archLabel(value) {
  if (value === 'x64') return 'x64';
  if (value === 'x86') return 'x86';
  if (value === 'arm64') return 'ARM64';
  if (value === 'arm') return 'ARM';
  return 'Universal';
}

function detectArchFromName(name) {
  const n = String(name || '').toLowerCase();
  if (/(x64|x86_64|amd64)/.test(n)) return 'x64';
  if (/(x86|i386|i686)/.test(n)) return 'x86';
  if (/(arm64|aarch64)/.test(n)) return 'arm64';
  if (/\barm\b/.test(n)) return 'arm';
  return 'unknown';
}

function fileTypeLabel(name) {
  const n = name.toLowerCase();
  if (n.endsWith('.appimage')) return 'AppImage';
  if (n.endsWith('.apk')) return 'APK (Alpine)';
  if (n.endsWith('.deb')) return 'DEB';
  if (n.endsWith('.rpm')) return 'RPM';
  if (n.endsWith('.tar.gz')) return 'TAR.GZ';
  if (n.endsWith('.tar.xz')) return 'TAR.XZ';
  if (n.endsWith('.exe')) return 'EXE';
  if (n.endsWith('.msi')) return 'MSI';
  if (n.endsWith('.dmg')) return 'DMG';
  if (n.endsWith('.pkg')) return 'PKG';
  if (n.endsWith('.ipa')) return 'IPA';
  if (n.endsWith('.zip')) return 'ZIP';
  return 'File';
}

function hasAny(text, patterns) {
  return patterns.some((p) => text.includes(p));
}

function detectAssetPlatform(name) {
  const n = name.toLowerCase();
  if (hasAny(n, ['windows_', 'windows-', '_windows', '-windows', 'win-'])) return 'windows';
  if (hasAny(n, ['darwin_', 'darwin-', '_darwin', '-darwin', 'mac', 'osx'])) return 'macos';
  if (hasAny(n, ['linux_', 'linux-', '_linux', '-linux'])) return 'linux';
  if (hasAny(n, ['android', 'aab', '.apk']) && !hasAny(n, ['linux_', 'linux-'])) return 'android';
  if (hasAny(n, ['ios', 'iphone', 'ipad', '.ipa'])) return 'ios';
  return 'unknown';
}

function isCompatibleEditorAsset(assetName, os) {
  const n = assetName.toLowerCase();
  const platform = detectAssetPlatform(assetName);

  if (/sha256|checksums?|\.sig$|\.txt$/.test(n)) return false;

  if (os === 'windows') return platform === 'windows' && (n.endsWith('.exe') || n.endsWith('.msi'));

  if (os === 'macos') {
    return platform === 'macos' && (n.endsWith('.dmg') || n.endsWith('.pkg') || n.endsWith('.zip') || n.endsWith('.tar.gz'));
  }

  if (os === 'linux') {
    return platform === 'linux' && (n.endsWith('.appimage') || n.endsWith('.deb') || n.endsWith('.rpm') || n.endsWith('.tar.gz') || n.endsWith('.tar.xz'));
  }

  if (os === 'android') return platform === 'android' && (n.endsWith('.apk') || n.endsWith('.aab'));

  if (os === 'ios') return platform === 'ios' && n.endsWith('.ipa');

  return false;
}

function isCompatibleCliAsset(name, os) {
  const n = name.toLowerCase();
  if (/sha256|checksums?|\.sig$|\.txt$/.test(n)) return false;
  const platform = detectAssetPlatform(name);

  if (os === 'windows') return platform === 'windows' && n.endsWith('.zip');
  if (os === 'macos') return platform === 'macos' && (n.endsWith('.tar.gz') || n.endsWith('.zip') || n.endsWith('.tar.xz'));
  if (os === 'linux') return platform === 'linux' && (n.endsWith('.apk') || n.endsWith('.deb') || n.endsWith('.rpm') || n.endsWith('.tar.gz') || n.endsWith('.tar.xz'));
  if (os === 'android') return platform === 'android' && (n.endsWith('.apk') || n.endsWith('.aab'));
  if (os === 'ios') return platform === 'ios' && n.endsWith('.ipa');

  return false;
}

function archScore(name, arch) {
  const n = name.toLowerCase();
  if (arch === 'x64' && /(x64|x86_64|amd64)/.test(n)) return 3;
  if (arch === 'x86' && /(x86|i386|i686)/.test(n)) return 3;
  if (arch === 'arm64' && /(arm64|aarch64)/.test(n)) return 3;
  if (arch === 'arm' && /\barm\b/.test(n)) return 3;
  return 0;
}

function typePriority(name, os) {
  const n = name.toLowerCase();

  if (os === 'windows') {
    if (n.endsWith('.exe')) return 12;
    if (n.endsWith('.msi')) return 10;
  }

  if (os === 'macos') {
    if (n.endsWith('.dmg')) return 12;
    if (n.endsWith('.pkg')) return 10;
  }

  if (os === 'linux') {
    if (n.endsWith('.appimage')) return 12;
    if (n.endsWith('.deb')) return 10;
    if (n.endsWith('.rpm')) return 9;
    if (n.endsWith('.apk')) return 9;
    if (n.endsWith('.tar.gz')) return 8;
    if (n.endsWith('.tar.xz')) return 7;
  }

  if (os === 'android' && n.endsWith('.apk')) return 12;
  if (os === 'ios' && n.endsWith('.ipa')) return 12;

  return 1;
}

function collectEditorAssets(release, os, arch) {
  if (!release?.assets?.length) return [];

  return release.assets
    .filter((asset) => isCompatibleEditorAsset(asset.name, os))
    .map((asset) => {
      const detectedArch = detectArchFromName(asset.name);
      return {
        name: asset.name,
        url: asset.browser_download_url,
        type: fileTypeLabel(asset.name),
        arch: detectedArch !== 'unknown' ? detectedArch : arch,
        score: typePriority(asset.name, os) + archScore(asset.name, arch),
      };
    })
    .sort((a, b) => b.score - a.score);
}

function collectCliAssets(release, os, arch) {
  if (!release?.assets?.length) return [];

  return release.assets
    .filter((asset) => isCompatibleCliAsset(asset.name, os))
    .map((asset) => {
      return {
        name: asset.name,
        url: asset.browser_download_url,
        type: fileTypeLabel(asset.name),
        arch: detectArchFromName(asset.name),
        score: typePriority(asset.name, os) + archScore(asset.name, arch),
      };
    })
    .sort((a, b) => b.score - a.score);
}

async function fetchLatestRelease(url) {
  const res = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
    },
  });

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status}`);
  }

  const data = await res.json();
  return {
    html_url: data.html_url,
    tag_name: data.tag_name,
    assets: Array.isArray(data.assets) ? data.assets : [],
  };
}

function buildPlan(os, arch, releases) {
  const target = os;

  if (target === 'unknown') {
    return {
      os: 'unknown',
      osTechLabel: OS_TECH_LABEL.unknown,
      version: releases.editor?.tag_name || releases.language?.tag_name || null,
      stage: 'Stable',
      editorOptions: [],
      cliOptions: [],
      editorPrimary: null,
      cliPrimary: null,
      hasEditorInstall: false,
      hasCli: false,
      packageMeta: null,
      editorTag: releases.editor?.tag_name || null,
      languageTag: releases.language?.tag_name || null,
      loading: releases.loading,
      error: releases.error,
    };
  }

  const editorSource = isMobileOS(target) ? releases.language : releases.editor;

  const editorOptions = collectEditorAssets(editorSource, target, arch);
  const cliOptions = collectCliAssets(releases.language, target, arch);

  const editorPrimary = editorOptions[0] || null;
  const cliPrimary = cliOptions[0] || null;

  const version = editorSource?.tag_name || releases.editor?.tag_name || releases.language?.tag_name || null;
  const stage = stageLabel(version);

  return {
    os: target,
    osTechLabel: OS_TECH_LABEL[target] || OS_TECH_LABEL.unknown,
    version,
    stage,
    editorOptions,
    cliOptions,
    editorPrimary,
    cliPrimary,
    hasEditorInstall: editorOptions.length > 0,
    hasCli: cliOptions.length > 0,
    packageMeta: editorPrimary ? `${editorPrimary.type} • ${archLabel(editorPrimary.arch)} • ${stage}` : null,
    editorTag: releases.editor?.tag_name || null,
    languageTag: releases.language?.tag_name || null,
    loading: releases.loading,
    error: releases.error,
  };
}

function LinuxPackagePicker({options, label, buttonLabel, idPrefix, buttonVariant = 'primary'}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = options[selectedIndex] || null;

  useEffect(() => {
    setSelectedIndex(0);
  }, [options]);

  const selectId = `${idPrefix}-package`;
  const buttonClass = buttonVariant === 'secondary' ? 'button button--secondary button--md' : 'button button--primary button--md';

  return (
    <div className={styles.linuxPicker}>
      <label htmlFor={selectId}>{label}</label>
      <select id={selectId} value={selectedIndex} onChange={(e) => setSelectedIndex(Number(e.target.value))}>
        {options.map((opt, index) => (
          <option key={opt.name} value={index}>{`${opt.type} • ${archLabel(opt.arch)}`}</option>
        ))}
      </select>

      <a
        className={buttonClass}
        href={selected?.url}
        target="_blank"
        rel="noopener noreferrer"
        title={selected?.name || ''}
      >
        {buttonLabel}
      </a>
    </div>
  );
}

function OSCard({os, detected, plan}) {
  const isDetected = detected === os.key;
  const mobile = isMobileOS(os.key);
  const description = mobile
    ? 'نسخة خفيفة لتجربة اللغة ومراجعة الأكواد.'
    : 'بيئة التطوير المتكاملة (IDE) وأدوات البناء.';
  const editorLabel = mobile ? 'تحميل التطبيق' : 'تحميل المحرر';
  const cliLabel = mobile ? 'نواة اللغة فقط' : 'نواة اللغة (CLI)';
  const mobileUnavailable = mobile && !plan.hasEditorInstall;

  return (
    <article className={`${styles.osCard} ${isDetected ? styles.osCardActive : ''}`}>
      <div className={styles.osHeader}>
        <h3>{os.label}</h3>
        {isDetected ? <span className={styles.badge}>النظام الحالي</span> : null}
      </div>

      <p className={styles.cardDescription}>{description}</p>

      {mobileUnavailable ? (
        <div className={styles.cardButtons}>
          <span className={styles.heroComingSoon}>
            يتوفر قريباً إن شاء الله
          </span>
        </div>
      ) : (
        <div className={styles.cardButtons}>
          {plan.hasEditorInstall ? (
            os.key === 'linux' ? (
              <LinuxPackagePicker
                options={plan.editorOptions}
                label="اختر حزمة المحرر"
                buttonLabel={editorLabel}
                idPrefix={`${os.key}-editor`}
              />
            ) : (
              <a
                className="button button--primary button--md"
                href={plan.editorPrimary?.url}
                target="_blank"
                rel="noopener noreferrer"
                title={plan.editorPrimary?.name || ''}
              >
                {editorLabel}
              </a>
            )
          ) : (
            <span className={styles.heroComingSoon}>يتوفر قريباً إن شاء الله</span>
          )}

          {plan.hasCli ? (
            os.key === 'linux' ? (
              <LinuxPackagePicker
                options={plan.cliOptions}
                label="اختر حزمة اللغة"
                buttonLabel={cliLabel}
                idPrefix={`${os.key}-cli`}
                buttonVariant="secondary"
              />
            ) : (
              <a
                className="button button--secondary button--md"
                href={plan.cliPrimary.url}
                target="_blank"
                rel="noopener noreferrer"
                title={plan.cliPrimary.name}
              >
                {cliLabel}
              </a>
            )
          ) : (
            <span className={styles.cliUnavailable}>{`${cliLabel} تتوفر قريباً`}</span>
          )}
        </div>
      )}
    </article>
  );
}

export default function DownloadPage() {
  const [client, setClient] = useState({os: 'unknown', arch: 'unknown'});
  const [releases, setReleases] = useState({
    loading: true,
    error: null,
    editor: null,
    language: null,
  });

  useEffect(() => {
    setClient(detectClient());
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [editor, language] = await Promise.all([
          fetchLatestRelease(GITHUB_API.editor),
          fetchLatestRelease(GITHUB_API.language),
        ]);

        if (cancelled) return;
        setReleases({loading: false, error: null, editor, language});
      } catch {
        if (cancelled) return;
        setReleases({loading: false, error: 'تعذر جلب أحدث الإصدارات الآن.', editor: null, language: null});
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const detectedPlan = useMemo(() => buildPlan(client.os, client.arch, releases), [client.os, client.arch, releases]);
  const versionLabel = detectedPlan.version || 'v-';

  return (
    <Layout title="تنزيل ض" description="بوابة التحميل الرسمية لبيئة تطوير لغة ض">
      <main className={styles.page}>
        <section className={styles.heroSection}>
          <div className="container">
            <div className={styles.heroCard}>
              <h1>بيئة تطوير لغة "ض"</h1>
              <p className={styles.subhead}>نسخة متوافقة مع {detectedPlan.osTechLabel}</p>

              <div className={styles.heroButtonRow}>
                {detectedPlan.hasEditorInstall ? (
                  <a
                    className="button button--primary button--lg"
                    href={detectedPlan.editorPrimary?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={detectedPlan.editorPrimary?.name || ''}
                  >
                    {`تحميل الحزمة (${versionLabel})`}
                  </a>
                ) : (
                  <span className={styles.heroComingSoon}>يتوفر قريباً إن شاء الله</span>
                )}

                {detectedPlan.cliPrimary ? (
                  <a
                    className="button button--secondary button--lg"
                    href={detectedPlan.cliPrimary.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={detectedPlan.cliPrimary.name}
                  >
                    نواة اللغة (CLI)
                  </a>
                ) : null}
              </div>

              {detectedPlan.hasEditorInstall && detectedPlan.packageMeta ? (
                <p className={styles.packageMeta}>{detectedPlan.packageMeta}</p>
              ) : null}

              {detectedPlan.loading ? <p className={styles.releaseMeta}>جارِ التحقق من آخر الإصدارات...</p> : null}
              {detectedPlan.error ? <p className={styles.releaseError}>{detectedPlan.error}</p> : null}
              {!detectedPlan.loading && !detectedPlan.error ? (
                <p className={styles.releaseMeta}>
                  آخر إصدار للمحرر: {detectedPlan.editorTag || '-'} | آخر إصدار للغة: {detectedPlan.languageTag || '-'}
                </p>
              ) : null}
            </div>
          </div>
        </section>

        <section className={styles.stepsSection}>
          <div className="container">
            <h2 className={styles.sectionTitle}>إعداد بيئة العمل</h2>

            <div className={styles.stepsGrid}>
              <article className={styles.stepCard}>
                <span className={styles.stepNum}>1</span>
                <h3>التحقق التلقائي</h3>
                <p>تم تحديد النسخة الأنسب لنظام تشغيلك آلياً.</p>
              </article>

              <article className={styles.stepCard}>
                <span className={styles.stepNum}>2</span>
                <h3>الحصول على الحزمة</h3>
                <p>حمّل ملف التثبيت المتكامل (المحرر + اللغة).</p>
              </article>

              <article className={styles.stepCard}>
                <span className={styles.stepNum}>3</span>
                <h3>التثبيت والانطلاق</h3>
                <p>شغّل الملف وابدأ رحلتك البرمجية فوراً.</p>
              </article>
            </div>

            <div className={styles.supportLinks}>
              <Link to="/docs/home">التوثيق والدروس</Link>
              <a href={RELEASE_LINKS.editorAll} target="_blank" rel="noopener noreferrer">أرشيف المحرر</a>
              <a href={RELEASE_LINKS.languageAll} target="_blank" rel="noopener noreferrer">أرشيف اللغة</a>
            </div>
          </div>
        </section>

        <section className={styles.platformSection}>
          <div className="container">
            <h2 className={styles.sectionTitle}>التحميل اليدوي للمنصات</h2>

            <div className={styles.platformGroup}>
              <h3 className={styles.groupTitle}>منصات سطح المكتب</h3>
              <div className={styles.osGrid}>
                {prioritizeDetectedOS(
                  OS_LIST.filter((os) => DESKTOP_OS_KEYS.has(os.key)),
                  client.os,
                ).map((os) => {
                  const plan = buildPlan(os.key, client.arch, releases);
                  return <OSCard key={os.key} os={os} detected={client.os} plan={plan} />;
                })}
              </div>
            </div>

            <div className={styles.platformGroup}>
              <h3 className={styles.groupTitle}>منصات الهاتف</h3>
              <div className={styles.osGrid}>
                {prioritizeDetectedOS(
                  OS_LIST.filter((os) => MOBILE_OS_KEYS.has(os.key)),
                  client.os,
                ).map((os) => {
                  const plan = buildPlan(os.key, client.arch, releases);
                  return <OSCard key={os.key} os={os} detected={client.os} plan={plan} />;
                })}
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
