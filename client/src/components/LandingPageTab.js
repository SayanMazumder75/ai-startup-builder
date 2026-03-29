import React, { useState } from 'react';
import { copyToClipboard } from '../utils/export';

export default function LandingPageTab({ data, branding }) {
  const [view, setView] = useState('preview');
  const [copied, setCopied] = useState(false);

  if (!data) return <Empty label="Landing page data" />;

  const primary = branding?.colorPalette?.primary?.hex || '#fbbf24';
  const accent  = branding?.colorPalette?.accent?.hex  || '#f97316';
  const name    = branding?.nameOptions?.[0]?.name     || 'YourStartup';

  const generatedCode = buildReactCode(data, branding, name, primary, accent);

  const handleCopyCode = async () => {
    await copyToClipboard(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div style={s.header}>
        <h2 style={s.sectionTitle}>🌐 Landing Page</h2>
        <div style={s.viewToggle}>
          {['preview', 'code'].map(v => (
            <button key={v} onClick={() => setView(v)} style={view === v ? { ...s.toggleBtn, ...s.toggleActive } : s.toggleBtn}>
              {v === 'preview' ? '👁 Preview' : '{ } Code'}
            </button>
          ))}
        </div>
      </div>

      {view === 'preview' ? (
        <div style={s.previewWrapper}>
          {/* Hero */}
          <section style={{ ...s.heroSection, background: `linear-gradient(135deg, #0a0a12 0%, #1a1a28 100%)` }}>
            <div style={s.heroBadge}>🚀 Now in Beta</div>
            <h1 style={{ ...s.heroH1, color: primary }}>{data.hero?.headline}</h1>
            <p style={s.heroSub}>{data.hero?.subheadline}</p>
            <div style={s.heroCtas}>
              <button style={{ ...s.ctaPrimary, background: `linear-gradient(135deg, ${primary}, ${accent})` }}>
                {data.hero?.ctaText}
              </button>
              <button style={s.ctaSecondary}>{data.hero?.ctaSecondary}</button>
            </div>
          </section>

          {/* Features */}
          <section style={s.section}>
            <h2 style={s.sectionH2}>Everything you need</h2>
            <div style={s.featuresGrid}>
              {(data.features || []).map((f, i) => (
                <div key={i} style={s.featureCard}>
                  <div style={{ ...s.featureIcon, background: `${primary}18` }}>{f.icon}</div>
                  <h3 style={s.featureTitle}>{f.title}</h3>
                  <p style={s.featureDesc}>{f.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Testimonials */}
          {data.testimonials?.length > 0 && (
            <section style={{ ...s.section, background: 'var(--bg-surface)' }}>
              <h2 style={s.sectionH2}>What customers say</h2>
              <div style={s.testimonialsGrid}>
                {data.testimonials.map((t, i) => (
                  <div key={i} style={s.testimonialCard}>
                    <p style={s.testimonialText}>"{t.text}"</p>
                    <div style={s.testimonialAuthor}>
                      <div style={{ ...s.testimonialAvatar, background: `linear-gradient(135deg,${primary},${accent})` }}>
                        {t.name[0]}
                      </div>
                      <div>
                        <div style={s.testimonialName}>{t.name}</div>
                        <div style={s.testimonialRole}>{t.role}, {t.company}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Pricing */}
          <section style={s.section}>
            <h2 style={s.sectionH2}>Simple, transparent pricing</h2>
            <div style={s.pricingGrid}>
              {(data.pricing || []).map((plan, i) => (
                <div key={i} style={plan.highlighted ? { ...s.pricingCard, ...s.pricingHighlighted, borderColor: primary } : s.pricingCard}>
                  {plan.highlighted && <div style={{ ...s.popularBadge, background: primary, color: '#0a0a12' }}>Most Popular</div>}
                  <div style={s.planName}>{plan.name}</div>
                  <div style={{ ...s.planPrice, color: plan.highlighted ? primary : 'var(--text-primary)' }}>{plan.price}</div>
                  <div style={s.planPeriod}>{plan.period}</div>
                  <p style={s.planDesc}>{plan.description}</p>
                  <ul style={s.planFeatures}>
                    {(plan.features || []).map((f, j) => (
                      <li key={j} style={s.planFeature}><span style={{ color: primary }}>✓</span> {f}</li>
                    ))}
                  </ul>
                  <button style={plan.highlighted
                    ? { ...s.planBtn, background: `linear-gradient(135deg,${primary},${accent})`, color: '#0a0a12' }
                    : s.planBtn}>
                    Get Started
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          {data.faq?.length > 0 && (
            <section style={s.section}>
              <h2 style={s.sectionH2}>Frequently asked questions</h2>
              <div style={s.faqList}>
                {data.faq.map((f, i) => (
                  <div key={i} style={s.faqItem}>
                    <h4 style={s.faqQ}>{f.question}</h4>
                    <p style={s.faqA}>{f.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CTA Footer */}
          <section style={{ ...s.heroSection, padding: '64px 40px' }}>
            <h2 style={{ ...s.heroH1, fontSize: 36, color: primary }}>Ready to get started?</h2>
            <p style={s.heroSub}>Join thousands of users already growing with {name}.</p>
            <button style={{ ...s.ctaPrimary, background: `linear-gradient(135deg,${primary},${accent})`, marginTop: 24 }}>
              {data.hero?.ctaText} — It's Free
            </button>
          </section>
        </div>
      ) : (
        <div style={s.codeWrapper}>
          <div style={s.codeHeader}>
            <span style={s.codeLabel}>LandingPage.jsx — React + Tailwind CSS</span>
            <button onClick={handleCopyCode} style={s.copyBtn}>
              {copied ? '✅ Copied!' : '📋 Copy Code'}
            </button>
          </div>
          <pre style={s.code}>{generatedCode}</pre>
        </div>
      )}
    </div>
  );
}

function buildReactCode(data, branding, name, primary, accent) {
  const features = (data.features || []).map(f =>
    `  { icon: "${f.icon}", title: "${f.title}", description: "${f.description?.replace(/"/g, "'")}" }`
  ).join(',\n');

  const pricing = (data.pricing || []).map(p =>
    `  { name: "${p.name}", price: "${p.price}", period: "${p.period}", features: ${JSON.stringify(p.features)}, highlighted: ${p.highlighted} }`
  ).join(',\n');

  return `import React from 'react';

// ─── ${name} Landing Page ───────────────────────────────────
// Generated by AI Startup Builder
// Colors: Primary ${primary} | Accent ${accent}
// ────────────────────────────────────────────────────────────

const FEATURES = [
${features}
];

const PRICING = [
${pricing}
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-gray-950/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-bold">${name}</span>
          <div className="flex gap-4 items-center">
            <a href="#features" className="text-sm text-gray-400 hover:text-white transition">Features</a>
            <a href="#pricing"  className="text-sm text-gray-400 hover:text-white transition">Pricing</a>
            <button className="px-4 py-2 rounded-lg text-sm font-semibold"
              style={{ background: 'linear-gradient(135deg, ${primary}, ${accent})', color: '#0a0a12' }}>
              ${data.hero?.ctaText}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="text-center py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 to-transparent pointer-events-none" />
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-8 border"
            style={{ borderColor: '${primary}50', color: '${primary}', background: '${primary}15' }}>
            🚀 Now in Beta
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6"
            style={{ color: '${primary}' }}>
            ${data.hero?.headline}
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            ${data.hero?.subheadline}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button className="px-8 py-4 rounded-xl text-lg font-bold shadow-2xl transition hover:scale-105"
              style={{ background: 'linear-gradient(135deg, ${primary}, ${accent})', color: '#0a0a12' }}>
              ${data.hero?.ctaText}
            </button>
            <button className="px-8 py-4 rounded-xl text-lg font-semibold border border-white/20 hover:border-white/40 transition">
              ${data.hero?.ctaSecondary}
            </button>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 px-6 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Everything you need</h2>
          <p className="text-center text-gray-400 mb-16">Built for modern teams who move fast</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="p-6 rounded-2xl border border-white/10 bg-gray-900 hover:border-yellow-500/30 transition group">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Simple, transparent pricing</h2>
          <p className="text-center text-gray-400 mb-16">No hidden fees. Cancel anytime.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {PRICING.map((plan, i) => (
              <div key={i} className={\`p-8 rounded-2xl border \${plan.highlighted ? 'border-yellow-500 bg-yellow-500/5 scale-105' : 'border-white/10 bg-gray-900'} relative\`}>
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold"
                    style={{ background: '${primary}', color: '#0a0a12' }}>
                    Most Popular
                  </div>
                )}
                <div className="text-sm font-semibold text-gray-400 mb-2">{plan.name}</div>
                <div className="text-4xl font-black mb-1" style={{ color: plan.highlighted ? '${primary}' : 'white' }}>{plan.price}</div>
                <div className="text-xs text-gray-500 mb-6">{plan.period}</div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex gap-2 text-sm text-gray-300">
                      <span style={{ color: '${primary}' }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <button className="w-full py-3 rounded-xl font-bold transition hover:opacity-90"
                  style={plan.highlighted
                    ? { background: 'linear-gradient(135deg, ${primary}, ${accent})', color: '#0a0a12' }
                    : { background: 'rgba(255,255,255,0.08)', color: 'white' }}>
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/10 py-12 text-center text-sm text-gray-500">
        <p className="text-2xl font-bold mb-2" style={{ color: '${primary}' }}>${name}</p>
        <p>© {new Date().getFullYear()} ${name}. All rights reserved.</p>
      </footer>
    </div>
  );
}
`;
}

const Empty = ({ label }) => (
  <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
    No {label} available
  </div>
);

const s = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 },
  sectionTitle: { fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700 },
  viewToggle: { display: 'flex', gap: 4 },
  toggleBtn: {
    padding: '8px 16px', borderRadius: 'var(--radius-md)',
    background: 'var(--bg-surface)', border: '1px solid var(--border)',
    color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 14,
    fontFamily: 'var(--font-body)',
  },
  toggleActive: { background: 'var(--amber-dim)', color: 'var(--amber)', borderColor: 'var(--amber)' },
  previewWrapper: {
    border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden',
    background: 'var(--bg-base)',
  },
  heroSection: {
    padding: '80px 40px', textAlign: 'center',
    background: 'linear-gradient(135deg, #05050a 0%, #0f0f1a 100%)',
  },
  heroBadge: {
    display: 'inline-block',
    background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)',
    color: '#fbbf24', padding: '6px 16px', borderRadius: 100,
    fontSize: 13, fontWeight: 600, marginBottom: 24,
  },
  heroH1: { fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,52px)', fontWeight: 800, marginBottom: 16, lineHeight: 1.2 },
  heroSub: { fontSize: 18, color: 'var(--text-secondary)', marginBottom: 32, maxWidth: 600, margin: '0 auto 32px' },
  heroCtas: { display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' },
  ctaPrimary: {
    padding: '14px 28px', borderRadius: 'var(--radius-md)', border: 'none',
    fontSize: 16, fontWeight: 700, cursor: 'pointer', color: '#0a0a12',
    fontFamily: 'var(--font-display)',
  },
  ctaSecondary: {
    padding: '14px 28px', borderRadius: 'var(--radius-md)',
    border: '1px solid rgba(255,255,255,0.15)',
    background: 'none', color: 'var(--text-primary)',
    fontSize: 16, fontWeight: 500, cursor: 'pointer',
    fontFamily: 'var(--font-body)',
  },
  section: { padding: '64px 40px', background: 'var(--bg-base)' },
  sectionH2: { fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, textAlign: 'center', marginBottom: 40 },
  featuresGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 },
  featureCard: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24 },
  featureIcon: { width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 16 },
  featureTitle: { fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 8 },
  featureDesc: { fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 },
  testimonialsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 20 },
  testimonialCard: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24 },
  testimonialText: { fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20, fontStyle: 'italic' },
  testimonialAuthor: { display: 'flex', alignItems: 'center', gap: 12 },
  testimonialAvatar: { width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, color: '#0a0a12' },
  testimonialName: { fontWeight: 600, fontSize: 14 },
  testimonialRole: { fontSize: 12, color: 'var(--text-muted)' },
  pricingGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 24, alignItems: 'start' },
  pricingCard: {
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)', padding: '32px 24px', position: 'relative',
  },
  pricingHighlighted: { background: 'rgba(251,191,36,0.04)', transform: 'scale(1.02)' },
  popularBadge: {
    position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
    padding: '4px 16px', borderRadius: 100, fontSize: 12, fontWeight: 700,
  },
  planName: { fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 },
  planPrice: { fontSize: 40, fontWeight: 800, fontFamily: 'var(--font-display)', lineHeight: 1 },
  planPeriod: { fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 },
  planDesc: { fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.5 },
  planFeatures: { listStyle: 'none', marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 8 },
  planFeature: { fontSize: 14, color: 'var(--text-secondary)', display: 'flex', gap: 8, alignItems: 'flex-start' },
  planBtn: {
    width: '100%', padding: '12px', borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border)', background: 'var(--bg-surface)',
    color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, cursor: 'pointer',
    fontFamily: 'var(--font-display)',
  },
  faqList: { maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 },
  faqItem: {
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)', padding: '20px 24px',
  },
  faqQ: { fontWeight: 600, fontSize: 16, marginBottom: 8, color: 'var(--text-primary)' },
  faqA: { fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 },
  codeWrapper: { border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' },
  codeHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '12px 20px', background: 'var(--bg-elevated)',
    borderBottom: '1px solid var(--border)',
  },
  codeLabel: { fontSize: 13, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' },
  copyBtn: {
    background: 'var(--amber-dim)', border: '1px solid var(--amber)',
    borderRadius: 'var(--radius-sm)', color: 'var(--amber)',
    padding: '6px 14px', fontSize: 13, cursor: 'pointer',
    fontFamily: 'var(--font-body)',
  },
  code: {
    background: 'var(--bg-surface)', padding: '24px',
    fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 1.7,
    color: '#a5b4fc', overflowX: 'auto',
    maxHeight: 600, overflow: 'auto',
    whiteSpace: 'pre',
  },
};
