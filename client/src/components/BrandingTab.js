import React, { useState } from 'react';
import { copyToClipboard } from '../utils/export';

export default function BrandingTab({ data }) {
  const [copiedHex, setCopiedHex] = useState('');
  if (!data) return <Empty />;

  const handleCopyHex = async (hex) => {
    await copyToClipboard(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(''), 1500);
  };

  const palette = data.colorPalette || {};
  const colors = Object.entries(palette);

  return (
    <div style={s.root}>

      {/* Name Options */}
      <section style={s.section}>
        <h2 style={s.sectionTitle}>✏️ Name Options</h2>
        <div style={s.namesGrid}>
          {(data.nameOptions || []).map((n, i) => (
            <div key={i} style={{ ...s.nameCard, ...(i === 0 ? s.nameCardFeatured : {}) }}>
              {i === 0 && <div style={s.recommendedBadge}>⭐ Recommended</div>}
              <h3 style={s.nameName}>{n.name}</h3>
              <div style={s.nameDomain}>🌐 {n.domain}</div>
              <p style={s.nameRationale}>{n.rationale}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tagline & Brand Personality */}
      <div style={s.row2}>
        <section style={{ ...s.section, flex: 1 }}>
          <h2 style={s.sectionTitle}>💬 Tagline</h2>
          <div style={s.taglineBox}>
            <span style={s.taglineMark}>"</span>
            <span style={s.taglineText}>{data.tagline}</span>
            <span style={s.taglineMark}>"</span>
          </div>
        </section>
        <section style={{ ...s.section, flex: 1 }}>
          <h2 style={s.sectionTitle}>🧠 Brand Personality</h2>
          <div style={s.personalityGrid}>
            {(data.brandPersonality || []).map((trait, i) => (
              <div key={i} style={s.traitChip}>{trait}</div>
            ))}
          </div>
        </section>
      </div>

      {/* Color Palette */}
      <section style={s.section}>
        <h2 style={s.sectionTitle}>🎨 Color Palette</h2>
        <div style={s.paletteStrip}>
          {colors.map(([key, color]) => (
            <div
              key={key}
              style={{ ...s.stripSwatch, background: color.hex, flex: 1 }}
              title={color.hex}
            />
          ))}
        </div>
        <div style={s.colorsGrid}>
          {colors.map(([key, color]) => (
            <div key={key} style={s.colorCard}>
              <button
                onClick={() => handleCopyHex(color.hex)}
                style={{ ...s.colorSwatch, background: color.hex }}
                title={`Click to copy ${color.hex}`}
              >
                {copiedHex === color.hex ? (
                  <span style={s.copiedTick}>✓</span>
                ) : (
                  <span style={s.copyHint}>Copy</span>
                )}
              </button>
              <div style={s.colorInfo}>
                <div style={s.colorName}>{color.name}</div>
                <div style={s.colorHex}>{color.hex}</div>
                <div style={s.colorUsage}>{color.usage}</div>
                <div style={s.colorRole}>{key}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Logo Concept */}
      <section style={s.section}>
        <h2 style={s.sectionTitle}>🖼 Logo Concept</h2>
        <div style={s.logoBox}>
          {/* Visual mock of logo area */}
          <div style={{ ...s.logoMock, borderColor: palette.primary?.hex || '#fbbf24' }}>
            <div style={{ ...s.logoSymbol, color: palette.primary?.hex || '#fbbf24' }}>
              {data.nameOptions?.[0]?.name?.[0] || '✦'}
            </div>
            <div style={s.logoWordmark}>{data.nameOptions?.[0]?.name || 'Startup'}</div>
          </div>
          <div style={s.logoDescBox}>
            <h3 style={s.logoDescTitle}>Concept Description</h3>
            <p style={s.logoDesc}>{data.logoDescription}</p>
          </div>
        </div>
      </section>

      {/* Typography */}
      <div style={s.row2}>
        <section style={{ ...s.section, flex: 1 }}>
          <h2 style={s.sectionTitle}>🔤 Typography</h2>
          <div style={s.fontCard}>
            <div style={s.fontLabel}>Heading Font</div>
            <div style={s.fontName}>{data.typography?.heading?.split(' ')[0]}</div>
            <div style={s.fontDesc}>{data.typography?.heading}</div>
          </div>
          <div style={{ ...s.fontCard, marginTop: 16 }}>
            <div style={s.fontLabel}>Body Font</div>
            <div style={{ ...s.fontName, fontSize: 22, fontWeight: 400 }}>{data.typography?.body?.split(' ')[0]}</div>
            <div style={s.fontDesc}>{data.typography?.body}</div>
          </div>
        </section>

        <section style={{ ...s.section, flex: 1 }}>
          <h2 style={s.sectionTitle}>🗣 Brand Voice</h2>
          <div style={s.voiceBox}>
            <p style={s.voiceText}>{data.brandVoice}</p>
          </div>
        </section>
      </div>

      {/* Brand Preview mockup */}
      <section style={s.section}>
        <h2 style={s.sectionTitle}>👁 Brand Preview</h2>
        <div style={{ ...s.brandPreview, background: palette.background?.hex || '#0a0a12' }}>
          <div style={{ ...s.previewNav, borderBottomColor: `${palette.primary?.hex || '#fbbf24'}30` }}>
            <span style={{ ...s.previewLogo, color: palette.primary?.hex || '#fbbf24' }}>
              {data.nameOptions?.[0]?.name || 'Brand'}
            </span>
            <div style={s.previewNavLinks}>
              {['Product', 'Pricing', 'About'].map(l => (
                <span key={l} style={{ ...s.previewNavLink, color: `${palette.text?.hex || '#f8f8ff'}80` }}>{l}</span>
              ))}
              <span style={{ ...s.previewNavCta, background: palette.primary?.hex || '#fbbf24', color: palette.background?.hex || '#0a0a12' }}>
                Get Started
              </span>
            </div>
          </div>
          <div style={s.previewHero}>
            <div style={{ ...s.previewHeadline, color: palette.primary?.hex || '#fbbf24' }}>
              {data.nameOptions?.[0]?.name}
            </div>
            <div style={{ ...s.previewTagline, color: `${palette.text?.hex || '#f8f8ff'}80` }}>
              {data.tagline}
            </div>
            <div style={{ ...s.previewBtn, background: `linear-gradient(135deg, ${palette.primary?.hex || '#fbbf24'}, ${palette.accent?.hex || '#f97316'})`, color: palette.background?.hex || '#0a0a12' }}>
              Get Started →
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

const Empty = () => (
  <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>No branding data</div>
);

const s = {
  root: { display: 'flex', flexDirection: 'column', gap: 20 },
  section: {
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)', padding: '28px',
    animation: 'fadeIn 0.4s ease',
  },
  sectionTitle: {
    fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700,
    marginBottom: 20, color: 'var(--text-primary)',
  },
  row2: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 },

  // Names
  namesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 },
  nameCard: {
    background: 'var(--bg-surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)', padding: '20px', position: 'relative',
  },
  nameCardFeatured: {
    border: '1px solid var(--amber)', background: 'var(--amber-glow)',
  },
  recommendedBadge: {
    position: 'absolute', top: -10, right: 12,
    background: 'var(--amber)', color: '#0a0a12',
    fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 100,
  },
  nameName: { fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, marginBottom: 6 },
  nameDomain: { fontSize: 12, color: 'var(--amber)', marginBottom: 10, fontFamily: 'var(--font-mono)' },
  nameRationale: { fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 },

  // Tagline
  taglineBox: {
    display: 'flex', gap: 8, alignItems: 'center',
    background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)',
    padding: '20px 24px',
  },
  taglineMark: { fontSize: 32, color: 'var(--amber)', lineHeight: 1, fontFamily: 'Georgia, serif' },
  taglineText: { fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, lineHeight: 1.4 },

  // Personality
  personalityGrid: { display: 'flex', gap: 10, flexWrap: 'wrap' },
  traitChip: {
    background: 'var(--violet-dim)', border: '1px solid var(--violet)',
    color: 'var(--violet)', borderRadius: 100,
    padding: '8px 16px', fontSize: 14, fontWeight: 600,
  },

  // Palette
  paletteStrip: { display: 'flex', height: 48, borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: 20 },
  stripSwatch: { transition: 'flex 0.3s' },
  colorsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 },
  colorCard: {
    background: 'var(--bg-surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)', overflow: 'hidden',
  },
  colorSwatch: {
    width: '100%', height: 80, border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 12, fontWeight: 600, transition: 'opacity 0.2s',
  },
  copiedTick: { background: 'rgba(0,0,0,0.5)', borderRadius: 100, padding: '4px 10px', color: '#fff', fontSize: 14 },
  copyHint: { background: 'rgba(0,0,0,0.4)', borderRadius: 4, padding: '3px 8px', color: 'rgba(255,255,255,0.8)', opacity: 0 },
  colorInfo: { padding: '12px 14px' },
  colorName: { fontSize: 14, fontWeight: 700, marginBottom: 2 },
  colorHex: { fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', marginBottom: 4 },
  colorUsage: { fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4 },
  colorRole: { fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 },

  // Logo
  logoBox: { display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 32, alignItems: 'start' },
  logoMock: {
    width: 160, height: 160, borderRadius: 20,
    background: 'var(--bg-surface)', border: '2px solid',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', gap: 8, flexShrink: 0,
  },
  logoSymbol: { fontSize: 56, fontWeight: 900, lineHeight: 1, fontFamily: 'var(--font-display)' },
  logoWordmark: { fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', fontFamily: 'var(--font-display)' },
  logoDescBox: {},
  logoDescTitle: { fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, marginBottom: 12, color: 'var(--text-secondary)' },
  logoDesc: { fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8 },

  // Typography
  fontCard: {
    background: 'var(--bg-surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)', padding: '20px',
  },
  fontLabel: { fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  fontName: { fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: 8 },
  fontDesc: { fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 },

  // Voice
  voiceBox: {
    background: 'var(--bg-surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)', padding: '20px',
    borderLeft: '4px solid var(--amber)',
  },
  voiceText: { fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8 },

  // Brand Preview
  brandPreview: { borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)' },
  previewNav: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 24px', borderBottom: '1px solid',
  },
  previewLogo: { fontWeight: 900, fontSize: 18, fontFamily: 'var(--font-display)' },
  previewNavLinks: { display: 'flex', alignItems: 'center', gap: 20 },
  previewNavLink: { fontSize: 13, cursor: 'pointer' },
  previewNavCta: { padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' },
  previewHero: { padding: '60px 40px', textAlign: 'center' },
  previewHeadline: { fontSize: 36, fontWeight: 900, fontFamily: 'var(--font-display)', marginBottom: 12 },
  previewTagline: { fontSize: 16, marginBottom: 28 },
  previewBtn: { display: 'inline-block', padding: '12px 28px', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer' },
};
