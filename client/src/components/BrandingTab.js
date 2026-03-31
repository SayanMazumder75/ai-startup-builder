import React, { useState} from 'react';
import { copyToClipboard } from '../utils/export';
import { CubeScene3D } from './Scene3D';

export default function BrandingTab({ data }) {
  const [copiedHex, setCopiedHex] = useState('');
  const [activeName, setActiveName] = useState(0);
  if (!data) return <div style={{ textAlign:'center',padding:60,color:'var(--text-muted)' }}>No branding data</div>;

  const palette = data.colorPalette || {};
  const colors = Object.entries(palette);
  const primary = palette.primary?.hex || '#fbbf24';
  const accent = palette.accent?.hex || '#f97316';
  const bg = palette.background?.hex || '#0a0a12';

  const handleCopyHex = async (hex) => {
    await copyToClipboard(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(''), 1500);
  };

  return (
    <div style={s.root}>

      {/* ── Hero: 3D cube + Name ──────────────────────────────────── */}
      <div style={s.heroRow}>
        <div style={s.cubeWrap}>
          <CubeScene3D color={parseInt(primary.replace('#',''), 16)} style={{ borderRadius:'var(--r-xl)' }} />
          <div style={{ ...s.cubeGlow, background:`radial-gradient(circle, ${primary}30 0%, transparent 70%)` }} />
        </div>

        <div style={s.heroInfo}>
          <p className="section-eyebrow">Recommended Name</p>
          <h2 style={{ ...s.heroName, color: primary }}>
            {data.nameOptions?.[activeName]?.name || 'YourBrand'}
          </h2>
          <p style={s.heroTagline}>"{data.tagline}"</p>
          <div style={s.heroMeta}>
            <div style={s.heroDomain}>
              🌐 {data.nameOptions?.[activeName]?.domain}
            </div>
            <p style={s.heroRationale}>{data.nameOptions?.[activeName]?.rationale}</p>
          </div>
          <div style={s.personalityChips}>
            {(data.brandPersonality || []).map((t, i) => (
              <span key={i} className="badge" style={{
                background:'rgba(255,255,255,0.04)',
                border:'1px solid var(--border-bright)',
                color:'var(--text-secondary)', fontSize:12,
              }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Name Options ─────────────────────────────────────────── */}
      <SectionCard title="✏️ Name Options" eyebrow="Brand naming">
        <div style={s.namesGrid}>
          {(data.nameOptions || []).map((n, i) => (
            <button key={i} onClick={() => setActiveName(i)}
              style={activeName===i
                ? {...s.nameCard, borderColor:primary, background:`${primary}0a`}
                : s.nameCard}>
              {i===0 && <div style={{ ...s.badge, background:primary, color:'#0a0a12' }}>⭐ Top Pick</div>}
              <div style={s.nameCardNumber}>0{i+1}</div>
              <h3 style={{ ...s.nameName, color: activeName===i ? primary : 'var(--text-primary)' }}>{n.name}</h3>
              <div style={{ ...s.nameDomain, color: activeName===i ? primary : 'var(--text-muted)' }}>
                🌐 {n.domain}
              </div>
              <p style={s.nameRationale}>{n.rationale}</p>
            </button>
          ))}
        </div>
      </SectionCard>

      {/* ── Color Palette ─────────────────────────────────────────── */}
      <SectionCard title="🎨 Color Palette" eyebrow="Brand colors">
        {/* Strip */}
        <div style={s.paletteStrip}>
          {colors.map(([k, c]) => (
            <div key={k} style={{ flex:1, background:c.hex, position:'relative', cursor:'pointer' }}
              title={c.hex} onClick={() => handleCopyHex(c.hex)}>
              {copiedHex===c.hex && (
                <div style={s.stripCopied}>✓</div>
              )}
            </div>
          ))}
        </div>

        {/* Cards */}
        <div style={s.colorGrid}>
          {colors.map(([key, c]) => (
            <div key={key} style={s.colorCard} className="glass-card">
              <button style={{ ...s.colorSwatch, background:c.hex }}
                onClick={() => handleCopyHex(c.hex)}
                title="Click to copy">
                {copiedHex===c.hex
                  ? <span style={s.copiedBadge}>✓ Copied</span>
                  : <span style={s.hoverCopy}>Copy</span>
                }
              </button>
              <div style={s.colorMeta}>
                <div style={s.colorName}>{c.name}</div>
                <div style={s.colorHex}>{c.hex}</div>
                <div style={s.colorRole}>{key}</div>
                <div style={s.colorUsage}>{c.usage}</div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* ── Logo Concept ──────────────────────────────────────────── */}
      <SectionCard title="🖼 Logo Concept" eyebrow="Visual identity">
        <div style={s.logoRow}>
          {/* Mock logo */}
          <div style={{ ...s.logoMock, borderColor: `${primary}50`, background:`${primary}08` }}>
            <div style={{ ...s.logoSymbol, color: primary }}>
              {data.nameOptions?.[0]?.name?.[0] || '✦'}
            </div>
            <div style={{ ...s.logoWordmark, color: primary }}>
              {data.nameOptions?.[0]?.name}
            </div>
            <div style={{ ...s.logoTag, color:`${primary}70` }}>{data.tagline}</div>
          </div>

          <div style={s.logoDescWrap}>
            <div className="badge badge-violet" style={{ marginBottom:16 }}>Concept Description</div>
            <p style={s.logoDesc}>{data.logoDescription}</p>
            <div style={s.divider} className="divider" />
            <div className="badge badge-amber" style={{ marginTop:16, marginBottom:12 }}>Brand Voice</div>
            <p style={s.brandVoice}>{data.brandVoice}</p>
          </div>
        </div>
      </SectionCard>

      {/* ── Typography ───────────────────────────────────────────── */}
      <SectionCard title="🔤 Typography" eyebrow="Font pairing">
        <div style={s.fontGrid}>
          <div style={s.fontCard} className="glass-card">
            <div style={s.fontRole}>Heading Font</div>
            <div style={{ ...s.fontSample, fontSize:32, fontWeight:900 }}>Aa</div>
            <div style={s.fontName}>{data.typography?.heading}</div>
          </div>
          <div style={s.fontCard} className="glass-card">
            <div style={s.fontRole}>Body Font</div>
            <div style={{ ...s.fontSample, fontSize:24, fontWeight:400 }}>Aa</div>
            <div style={s.fontName}>{data.typography?.body}</div>
          </div>
        </div>
      </SectionCard>

      {/* ── Live Brand Preview ───────────────────────────────────── */}
      <SectionCard title="👁 Live Brand Preview" eyebrow="How it looks">
        <div style={{ ...s.brandPreview, background: bg }}>
          {/* Nav */}
          <div style={{ ...s.previewNav, borderBottomColor:`${primary}25` }}>
            <span style={{ ...s.previewLogoText, color: primary }}>
              {data.nameOptions?.[0]?.name}
            </span>
            <div style={s.previewLinks}>
              {['Product','Pricing','Docs','Blog'].map(l => (
                <span key={l} style={{ fontSize:13, color:`${palette.text?.hex || '#f8f8ff'}60`, cursor:'pointer' }}>{l}</span>
              ))}
              <span style={{ ...s.previewCta, background:primary, color: bg }}>
                Get Started
              </span>
            </div>
          </div>

          {/* Hero */}
          <div style={s.previewHero}>
            <div style={{
              display:'inline-block', background:`${primary}18`,
              border:`1px solid ${primary}40`,
              borderRadius:100, padding:'5px 16px',
              fontSize:12, color:primary, fontWeight:600, marginBottom:20,
            }}>
              ✨ Now Available
            </div>
            <div style={{ ...s.previewH1, color: primary }}>
              {data.nameOptions?.[0]?.name}
            </div>
            <div style={{ ...s.previewSubtitle, color:`${palette.text?.hex || '#f8f8ff'}70` }}>
              {data.tagline}
            </div>
            <div style={s.previewBtns}>
              <span style={{ ...s.previewPrimaryBtn,
                background:`linear-gradient(135deg,${primary},${accent})`, color: bg }}>
                Get Started →
              </span>
              <span style={{ ...s.previewSecondaryBtn,
                border:`1px solid ${primary}40`, color:`${palette.text?.hex || '#f8f8ff'}` }}>
                Learn More
              </span>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

function SectionCard({ title, eyebrow, children }) {
  return (
    <div style={sc.card} className="animate-fadeInUp">
      <div style={sc.header}>
        <div className="section-eyebrow">{eyebrow}</div>
        <h2 style={sc.title}>{title}</h2>
      </div>
      <div style={sc.body}>{children}</div>
    </div>
  );
}

const sc = {
  card: {
    background:'var(--bg-card)', border:'1px solid var(--border)',
    borderRadius:'var(--r-xl)', overflow:'hidden', marginBottom:0,
  },
  header: {
    padding:'20px 28px 0',
    background:'linear-gradient(180deg,rgba(255,255,255,0.03) 0%,transparent 100%)',
    borderBottom:'1px solid var(--border)',
    paddingBottom:16,
  },
  title: { fontFamily:'var(--font-display)', fontSize:20, fontWeight:800 },
  body: { padding:'24px 28px' },
};

const s = {
  root: { display:'flex', flexDirection:'column', gap:20 },

  // Hero row
  heroRow: {
    background:'var(--bg-card)', border:'1px solid var(--border)',
    borderRadius:'var(--r-xl)', padding:'28px',
    display:'grid', gridTemplateColumns:'240px 1fr', gap:40, alignItems:'center',
  },
  cubeWrap: { width:240, height:240, position:'relative', borderRadius:'var(--r-lg)', overflow:'hidden' },
  cubeGlow: { position:'absolute', inset:0, pointerEvents:'none' },
  heroInfo: { display:'flex', flexDirection:'column', gap:12 },
  heroName: { fontFamily:'var(--font-display)', fontSize:44, fontWeight:900, lineHeight:1, marginBottom:4 },
  heroTagline: { fontSize:17, color:'var(--text-secondary)', fontStyle:'italic' },
  heroMeta: { background:'rgba(255,255,255,0.03)', borderRadius:'var(--r-md)', padding:'16px' },
  heroDomain: { fontSize:13, color:'var(--amber)', fontFamily:'var(--font-mono)', marginBottom:8 },
  heroRationale: { fontSize:14, color:'var(--text-secondary)', lineHeight:1.6 },
  personalityChips: { display:'flex', gap:8, flexWrap:'wrap' },

  // Names
  namesGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:14 },
  nameCard: {
    background:'rgba(255,255,255,0.03)', border:'1px solid var(--border)',
    borderRadius:'var(--r-lg)', padding:'20px', cursor:'pointer', textAlign:'left',
    fontFamily:'var(--font-body)', transition:'all 0.25s', position:'relative',
  },
  badge: {
    position:'absolute', top:-10, right:12,
    padding:'3px 10px', borderRadius:100, fontSize:11, fontWeight:700,
  },
  nameCardNumber: {
    fontFamily:'var(--font-mono)', fontSize:28, fontWeight:800,
    color:'var(--border)', marginBottom:8, lineHeight:1,
  },
  nameName: { fontFamily:'var(--font-display)', fontSize:22, fontWeight:900, marginBottom:6 },
  nameDomain: { fontSize:12, fontFamily:'var(--font-mono)', marginBottom:10 },
  nameRationale: { fontSize:13, color:'var(--text-secondary)', lineHeight:1.5 },

  // Palette
  paletteStrip: { display:'flex', height:56, borderRadius:'var(--r-md)', overflow:'hidden', marginBottom:20, cursor:'pointer' },
  stripCopied: {
    position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center',
    background:'rgba(0,0,0,0.4)', color:'#fff', fontSize:18, fontWeight:700,
  },
  colorGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:14 },
  colorCard: { borderRadius:'var(--r-lg)', overflow:'hidden' },
  colorSwatch: {
    width:'100%', height:88, border:'none', cursor:'pointer',
    display:'flex', alignItems:'center', justifyContent:'center',
    position:'relative',
  },
  copiedBadge: {
    background:'rgba(0,0,0,0.5)', color:'#fff',
    padding:'5px 12px', borderRadius:100, fontSize:13, fontWeight:700,
  },
  hoverCopy: {
    background:'rgba(0,0,0,0.35)', color:'rgba(255,255,255,0.7)',
    padding:'4px 10px', borderRadius:6, fontSize:12, opacity:0,
  },
  colorMeta: { padding:'12px 14px' },
  colorName: { fontSize:14, fontWeight:700, marginBottom:2 },
  colorHex: { fontSize:13, fontFamily:'var(--font-mono)', color:'var(--text-secondary)', marginBottom:3 },
  colorRole: { fontSize:10, color:'var(--amber)', textTransform:'uppercase', letterSpacing:1.5, marginBottom:4 },
  colorUsage: { fontSize:11, color:'var(--text-muted)', lineHeight:1.4 },

  // Logo
  logoRow: { display:'grid', gridTemplateColumns:'200px 1fr', gap:32, alignItems:'start' },
  logoMock: {
    width:200, aspectRatio:'1', borderRadius:'var(--r-xl)',
    border:'1.5px solid',
    display:'flex', flexDirection:'column',
    alignItems:'center', justifyContent:'center', gap:8, padding:20,
  },
  logoSymbol: { fontSize:60, fontWeight:900, lineHeight:1, fontFamily:'var(--font-display)' },
  logoWordmark: { fontSize:14, fontWeight:800, fontFamily:'var(--font-display)' },
  logoTag: { fontSize:9, letterSpacing:2, textTransform:'uppercase', textAlign:'center' },
  logoDescWrap: {},
  logoDesc: { fontSize:14, color:'var(--text-secondary)', lineHeight:1.8 },
  divider: { margin:'16px 0' },
  brandVoice: { fontSize:14, color:'var(--text-secondary)', lineHeight:1.8 },

  // Typography
  fontGrid: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 },
  fontCard: { borderRadius:'var(--r-lg)', padding:'24px' },
  fontRole: { fontSize:11, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:1.5, marginBottom:12 },
  fontSample: { color:'var(--text-primary)', lineHeight:1, marginBottom:12, fontFamily:'var(--font-display)' },
  fontName: { fontSize:13, color:'var(--text-secondary)', lineHeight:1.5 },

  // Brand preview
  brandPreview: { borderRadius:'var(--r-xl)', overflow:'hidden', border:'1px solid var(--border)' },
  previewNav: {
    display:'flex', alignItems:'center', justifyContent:'space-between',
    padding:'14px 28px', borderBottom:'1px solid',
  },
  previewLogoText: { fontWeight:900, fontSize:20, fontFamily:'var(--font-display)' },
  previewLinks: { display:'flex', alignItems:'center', gap:24 },
  previewCta: { padding:'8px 18px', borderRadius:10, fontSize:13, fontWeight:700, cursor:'pointer' },
  previewHero: { padding:'64px 48px', textAlign:'center' },
  previewH1: { fontFamily:'var(--font-display)', fontSize:40, fontWeight:900, lineHeight:1.1, marginBottom:14 },
  previewSubtitle: { fontSize:18, marginBottom:32 },
  previewBtns: { display:'flex', gap:16, justifyContent:'center' },
  previewPrimaryBtn: { padding:'13px 28px', borderRadius:12, fontWeight:700, fontSize:15, cursor:'pointer' },
  previewSecondaryBtn: { padding:'13px 28px', borderRadius:12, fontSize:15, cursor:'pointer', background:'transparent' },
};
