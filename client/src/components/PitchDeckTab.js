import React, { useState, useEffect } from 'react';

const SLIDE_THEMES = [
  { bg:'linear-gradient(135deg,#05050a 0%,#1a0a00 100%)', accent:'#fbbf24' },
  { bg:'linear-gradient(135deg,#05050a 0%,#100020 100%)', accent:'#8b5cf6' },
  { bg:'linear-gradient(135deg,#05050a 0%,#001a1a 100%)', accent:'#22d3ee' },
  { bg:'linear-gradient(135deg,#05050a 0%,#001a0a 100%)', accent:'#34d399' },
  { bg:'linear-gradient(135deg,#05050a 0%,#1a0005 100%)', accent:'#fb7185' },
  { bg:'linear-gradient(135deg,#05050a 0%,#0a0a1a 100%)', accent:'#a78bfa' },
  { bg:'linear-gradient(135deg,#05050a 0%,#1a0a00 100%)', accent:'#fcd34d' },
  { bg:'linear-gradient(135deg,#05050a 0%,#0a001a 100%)', accent:'#c084fc' },
  { bg:'linear-gradient(135deg,#05050a 0%,#001a10 100%)', accent:'#6ee7b7' },
  { bg:'linear-gradient(135deg,#05050a 0%,#1a0500 100%)', accent:'#f97316' },
];

export default function PitchDeckTab({ data, branding }) {
  const [active, setActive] = useState(0);
  const [notes, setNotes] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') setActive(p => Math.min((data?.slides?.length||0)-1, p+1));
      if (e.key === 'ArrowLeft') setActive(p => Math.max(0, p-1));
      if (e.key === 'Escape') setIsFullscreen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [data]);

  if (!data?.slides?.length) return <div style={{ textAlign:'center',padding:60,color:'var(--text-muted)' }}>No pitch deck data</div>;

  const slides = data.slides;
  const slide = slides[active];
  const theme = SLIDE_THEMES[active % SLIDE_THEMES.length];
  const primaryName = branding?.nameOptions?.[0]?.name || 'Startup';
  const tagline = branding?.tagline || '';

  return (
    <div style={s.root}>
      {/* Header */}
      <div style={s.header}>
        <div>
          <h2 style={s.title}>📊 Pitch Deck</h2>
          <p style={s.subtitle}>{slides.length} investor-ready slides · Use ← → arrow keys to navigate</p>
        </div>
        <div style={s.headerActions}>
          <button onClick={() => setNotes(!notes)}
            style={notes ? {...s.headerBtn,...s.headerBtnActive} : s.headerBtn}>
            💬 Speaker Notes
          </button>
          <button onClick={() => setIsFullscreen(!isFullscreen)} style={s.headerBtn}>
            {isFullscreen ? '⊠ Exit' : '⛶ Fullscreen'}
          </button>
        </div>
      </div>

      <div style={isFullscreen ? s.fullscreen : s.layout}>
        {/* Sidebar thumbnails */}
        {!isFullscreen && (
          <div style={s.sidebar}>
            <div style={s.sidebarInner}>
              {slides.map((sl, i) => {
                const t = SLIDE_THEMES[i % SLIDE_THEMES.length];
                return (
                  <button key={i} onClick={() => setActive(i)}
                    style={active===i ? {...s.thumb,...s.thumbActive} : s.thumb}>
                    <div style={{ ...s.thumbMini, background:t.bg, borderColor: active===i ? t.accent : 'transparent' }}>
                      <div style={{ ...s.thumbNum, color:t.accent }}>
                        {String(i+1).padStart(2,'0')}
                      </div>
                      <div style={s.thumbBars}>
                        <div style={{ ...s.thumbBar, background:t.accent, width:'80%' }} />
                        <div style={{ ...s.thumbBar, background:`${t.accent}60`, width:'60%' }} />
                        <div style={{ ...s.thumbBar, background:`${t.accent}40`, width:'70%' }} />
                      </div>
                    </div>
                    <span style={{ ...s.thumbLabel, color: active===i ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                      {sl.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Main slide */}
        <div style={s.main}>
          {/* Slide */}
          <div style={{ ...s.slide, background: theme.bg }} className="animate-fadeInScale">
            {/* Top accent bar */}
            <div style={{ ...s.slideAccentBar, background: theme.accent }} />

            {/* Slide number */}
            <div style={{ ...s.slideCounter, color: `${theme.accent}80` }}>
              {String(active+1).padStart(2,'0')} / {String(slides.length).padStart(2,'0')}
            </div>

            {/* Slide content */}
            {active === 0 ? (
              /* Title slide special layout */
              <div style={s.titleSlide}>
                <div style={{ ...s.titleSlideGlow, background:`radial-gradient(circle, ${theme.accent}15 0%, transparent 70%)` }} />
                <div style={{ ...s.titleBadge, background:`${theme.accent}18`, border:`1px solid ${theme.accent}40`, color:theme.accent }}>
                  Investor Presentation
                </div>
                <h1 style={{ ...s.titleName, color: theme.accent }}>{primaryName}</h1>
                <p style={s.titleTagline}>{tagline}</p>
                {(slide.content || []).slice(1).map((line, i) => (
                  <p key={i} style={s.titleMeta}>{line}</p>
                ))}
                <div style={s.titleFooter}>
                  <div style={{ ...s.titleYear, color:`${theme.accent}60` }}>
                    {new Date().getFullYear()}
                  </div>
                </div>
              </div>
            ) : (
              /* Regular slide */
              <div style={s.regularSlide}>
                <h2 style={{ ...s.slideTitle, color: theme.accent }}>{slide.title}</h2>
                <ul style={s.bulletList}>
                  {(slide.content || []).map((point, i) => (
                    <li key={i} style={s.bulletItem}
                      className="animate-slideInLeft"
                      style2={{ animationDelay:`${i*0.1}s` }}>
                      <span style={{ ...s.bulletDot, background: theme.accent,
                        boxShadow:`0 0 8px ${theme.accent}60` }} />
                      <span style={s.bulletText}>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Branding footer */}
            <div style={s.slideFooter}>
              <span style={{ ...s.footerBrand, color:`${theme.accent}70` }}>{primaryName}</span>
              <span style={s.footerDivider}>·</span>
              <span style={s.footerTagline}>{tagline}</span>
              <span style={{ marginLeft:'auto', ...s.footerConfidential }}>Confidential</span>
            </div>
          </div>

          {/* Speaker notes */}
          {notes && slide.speakerNotes && (
            <div style={s.notesBox} className="animate-fadeInUp">
              <div style={{ ...s.notesHeader, borderLeftColor: theme.accent }}>
                <span style={{ color: theme.accent }}>💬</span>
                <span style={s.notesTitle}>Speaker Notes</span>
              </div>
              <p style={s.notesText}>{slide.speakerNotes}</p>
            </div>
          )}

          {/* Navigation */}
          <div style={s.navBar}>
            <button onClick={() => setActive(Math.max(0,active-1))} disabled={active===0}
              style={active===0 ? {...s.navBtn, opacity:0.3} : s.navBtn}>
              ← Prev
            </button>
            <div style={s.navDots}>
              {slides.map((_,i) => (
                <button key={i} onClick={() => setActive(i)} style={{
                  ...s.navDot,
                  background: i===active ? theme.accent : 'var(--border)',
                  width: i===active ? 20 : 8,
                  boxShadow: i===active ? `0 0 8px ${theme.accent}` : 'none',
                }} />
              ))}
            </div>
            <button onClick={() => setActive(Math.min(slides.length-1,active+1))} disabled={active===slides.length-1}
              style={active===slides.length-1 ? {...s.navBtn, opacity:0.3} : s.navBtn}>
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* All slides grid */}
      {!isFullscreen && (
        <div style={s.overviewSection}>
          <p className="section-eyebrow">All Slides</p>
          <div style={s.overviewGrid}>
            {slides.map((sl, i) => {
              const t = SLIDE_THEMES[i % SLIDE_THEMES.length];
              return (
                <div key={i} style={{ ...s.overviewCard, borderColor: active===i ? t.accent : 'var(--border)' }}
                  className="glass-card"
                  onClick={() => setActive(i)}>
                  <div style={{ ...s.overviewNum, color: t.accent }}>
                    Slide {sl.number}
                  </div>
                  <div style={s.overviewTitle}>{sl.title}</div>
                  <ul style={s.overviewBullets}>
                    {(sl.content || []).slice(0,2).map((p,j) => (
                      <li key={j} style={s.overviewBullet}>
                        <span style={{ color: t.accent }}>·</span> {p.length>50?p.slice(0,50)+'…':p}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Investor FAQ */}
      {data.investorFAQ?.length > 0 && !isFullscreen && (
        <div style={s.faqSection}>
          <p className="section-eyebrow">Investor Q&A</p>
          <h3 style={s.faqHeading}>❓ Anticipated Investor Questions</h3>
          <div style={s.faqGrid}>
            {data.investorFAQ.map((f, i) => (
              <div key={i} style={s.faqCard} className="glass-card">
                <div style={s.faqQ}>{f.question}</div>
                <div style={s.faqA}>{f.answer}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  root: { display:'flex', flexDirection:'column', gap:24 },
  header: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12 },
  title: { fontFamily:'var(--font-display)', fontSize:24, fontWeight:800 },
  subtitle: { fontSize:13, color:'var(--text-muted)', marginTop:4 },
  headerActions: { display:'flex', gap:10 },
  headerBtn: {
    background:'rgba(255,255,255,0.04)', border:'1px solid var(--border)',
    borderRadius:'var(--r-md)', color:'var(--text-secondary)',
    padding:'9px 16px', fontSize:13, cursor:'pointer',
    fontFamily:'var(--font-body)', transition:'all 0.2s',
  },
  headerBtnActive: { background:'var(--amber-dim)', borderColor:'var(--amber)', color:'var(--amber)' },

  layout: { display:'grid', gridTemplateColumns:'180px 1fr', gap:20 },
  fullscreen: {
    position:'fixed', inset:0, zIndex:200,
    background:'var(--bg-void)', padding:32,
    display:'flex', flexDirection:'column',
  },

  // Sidebar
  sidebar: {},
  sidebarInner: {
    background:'var(--bg-card)', border:'1px solid var(--border)',
    borderRadius:'var(--r-xl)', padding:10,
    maxHeight:520, overflowY:'auto', display:'flex', flexDirection:'column', gap:4,
  },
  thumb: {
    display:'flex', flexDirection:'column', gap:6,
    padding:'8px 6px', borderRadius:'var(--r-md)',
    background:'none', border:'none', cursor:'pointer',
    transition:'background 0.15s', fontFamily:'var(--font-body)',
  },
  thumbActive: { background:'rgba(255,255,255,0.06)' },
  thumbMini: {
    height:56, borderRadius:8, padding:8, border:'1.5px solid',
    display:'flex', flexDirection:'column', justifyContent:'space-between',
  },
  thumbNum: { fontSize:10, fontWeight:800, fontFamily:'var(--font-mono)' },
  thumbBars: { display:'flex', flexDirection:'column', gap:3 },
  thumbBar: { height:3, borderRadius:2 },
  thumbLabel: { fontSize:10, lineHeight:1.3, textAlign:'left' },

  // Main
  main: { display:'flex', flexDirection:'column', gap:14 },
  slide: {
    border:'1px solid var(--border)', borderRadius:'var(--r-xl)',
    minHeight:400, position:'relative', overflow:'hidden',
    display:'flex', flexDirection:'column',
  },
  slideAccentBar: { height:3, width:'100%' },
  slideCounter: {
    fontFamily:'var(--font-mono)', fontSize:11, fontWeight:700,
    letterSpacing:3, padding:'12px 28px 0',
  },

  // Title slide
  titleSlide: {
    flex:1, display:'flex', flexDirection:'column',
    alignItems:'center', justifyContent:'center',
    padding:'32px 48px', textAlign:'center', position:'relative',
  },
  titleSlideGlow: { position:'absolute', inset:0, pointerEvents:'none' },
  titleBadge: {
    padding:'6px 16px', borderRadius:100, fontSize:12, fontWeight:700,
    marginBottom:20, display:'inline-block',
  },
  titleName: {
    fontFamily:'var(--font-display)', fontSize:56, fontWeight:900, lineHeight:1,
    marginBottom:12,
  },
  titleTagline: { fontSize:20, color:'rgba(255,255,255,0.55)', fontStyle:'italic', marginBottom:8 },
  titleMeta: { fontSize:14, color:'rgba(255,255,255,0.35)', marginTop:4 },
  titleFooter: { marginTop:32 },
  titleYear: { fontFamily:'var(--font-mono)', fontSize:16, fontWeight:700 },

  // Regular slide
  regularSlide: { flex:1, padding:'20px 28px 16px' },
  slideTitle: { fontFamily:'var(--font-display)', fontSize:28, fontWeight:800, marginBottom:24, lineHeight:1.2 },
  bulletList: { listStyle:'none', display:'flex', flexDirection:'column', gap:14 },
  bulletItem: { display:'flex', alignItems:'flex-start', gap:14 },
  bulletDot: { width:9, height:9, borderRadius:'50%', marginTop:6, flexShrink:0 },
  bulletText: { fontSize:16, color:'rgba(255,255,255,0.82)', lineHeight:1.65 },

  // Footer
  slideFooter: {
    display:'flex', alignItems:'center', gap:10,
    padding:'12px 28px',
    borderTop:'1px solid rgba(255,255,255,0.05)',
    fontSize:11,
  },
  footerBrand: { fontFamily:'var(--font-display)', fontWeight:700 },
  footerDivider: { color:'rgba(255,255,255,0.2)' },
  footerTagline: { color:'rgba(255,255,255,0.25)', fontStyle:'italic' },
  footerConfidential: { color:'rgba(255,255,255,0.15)', fontSize:10, letterSpacing:1, textTransform:'uppercase' },

  // Notes
  notesBox: {
    background:'var(--bg-card)', border:'1px solid var(--border)',
    borderRadius:'var(--r-lg)', padding:'18px 20px',
  },
  notesHeader: { display:'flex', alignItems:'center', gap:10, marginBottom:10, paddingLeft:12, borderLeft:'3px solid' },
  notesTitle: { fontSize:13, fontWeight:700, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:1 },
  notesText: { fontSize:14, color:'var(--text-secondary)', lineHeight:1.75 },

  // Nav
  navBar: { display:'flex', justifyContent:'space-between', alignItems:'center' },
  navBtn: {
    background:'var(--bg-card)', border:'1px solid var(--border)',
    borderRadius:'var(--r-md)', color:'var(--text-secondary)',
    padding:'10px 20px', fontSize:14, cursor:'pointer',
    fontFamily:'var(--font-body)', transition:'all 0.2s',
  },
  navDots: { display:'flex', gap:6, alignItems:'center' },
  navDot: {
    height:8, borderRadius:4, border:'none', cursor:'pointer',
    transition:'all 0.3s', padding:0,
  },

  // Overview
  overviewSection: {
    background:'var(--bg-card)', border:'1px solid var(--border)',
    borderRadius:'var(--r-xl)', padding:'24px 28px',
  },
  overviewGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:12, marginTop:16 },
  overviewCard: {
    borderRadius:'var(--r-lg)', padding:'16px', cursor:'pointer',
    transition:'all 0.2s', border:'1px solid',
  },
  overviewNum: { fontSize:11, fontWeight:800, fontFamily:'var(--font-mono)', marginBottom:6, letterSpacing:2 },
  overviewTitle: { fontSize:14, fontWeight:700, marginBottom:8 },
  overviewBullets: { listStyle:'none', display:'flex', flexDirection:'column', gap:4 },
  overviewBullet: { fontSize:11, color:'var(--text-muted)', lineHeight:1.4 },

  // FAQ
  faqSection: {
    background:'var(--bg-card)', border:'1px solid var(--border)',
    borderRadius:'var(--r-xl)', padding:'24px 28px',
  },
  faqHeading: { fontFamily:'var(--font-display)', fontSize:18, fontWeight:700, marginBottom:20, marginTop:8 },
  faqGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:14 },
  faqCard: { borderRadius:'var(--r-lg)', padding:'20px' },
  faqQ: { fontSize:15, fontWeight:700, color:'var(--text-primary)', marginBottom:10 },
  faqA: { fontSize:14, color:'var(--text-secondary)', lineHeight:1.7 },
};
