import React, { useState } from 'react';

const SLIDE_COLORS = [
  '#fbbf24','#f97316','#ef4444','#8b5cf6','#22d3ee',
  '#34d399','#fbbf24','#f97316','#a78bfa','#10b981',
];

export default function PitchDeckTab({ data, branding }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [showNotes, setShowNotes] = useState(false);

  if (!data) return <Empty />;

  const slides = data.slides || [];
  const slide = slides[activeSlide];
  const primaryName = branding?.nameOptions?.[0]?.name || 'Startup';
  const tagline = branding?.tagline || '';
  const primaryColor = branding?.colorPalette?.primary?.hex || '#fbbf24';
  // const accentColor = branding?.colorPalette?.accent?.hex || '#f97316';

  return (
    <div style={s.root}>
      {/* Header */}
      <div style={s.header}>
        <div>
          <h2 style={s.title}>📊 Pitch Deck</h2>
          <p style={s.subtitle}>{slides.length} investor-ready slides</p>
        </div>
        <button onClick={() => setShowNotes(!showNotes)} style={showNotes ? { ...s.notesBtn, ...s.notesBtnActive } : s.notesBtn}>
          💬 {showNotes ? 'Hide' : 'Show'} Speaker Notes
        </button>
      </div>

      <div style={s.layout}>
        {/* Slide thumbnails sidebar */}
        <div style={s.sidebar}>
          {slides.map((sl, i) => (
            <button
              key={i}
              onClick={() => setActiveSlide(i)}
              style={activeSlide === i ? { ...s.thumb, ...s.thumbActive } : s.thumb}
            >
              <div style={{ ...s.thumbNum, background: SLIDE_COLORS[i % SLIDE_COLORS.length], color: '#0a0a12' }}>
                {sl.number}
              </div>
              <div style={s.thumbTitle}>{sl.title}</div>
            </button>
          ))}
        </div>

        {/* Main slide view */}
        <div style={s.mainArea}>
          {slide && (
            <>
              <div style={s.slideContainer}>
                {/* Slide */}
                <div style={{
                  ...s.slide,
                  background: `linear-gradient(135deg, #05050a 0%, #0f0f1a 100%)`,
                }}>
                  {/* Slide header bar */}
                  <div style={{ ...s.slideBar, background: SLIDE_COLORS[activeSlide % SLIDE_COLORS.length] }} />

                  {/* Slide number */}
                  <div style={{ ...s.slideNumBadge, color: SLIDE_COLORS[activeSlide % SLIDE_COLORS.length] }}>
                    {String(slide.number).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
                  </div>

                  {/* Slide title */}
                  <h2 style={{ ...s.slideTitle, color: SLIDE_COLORS[activeSlide % SLIDE_COLORS.length] }}>
                    {slide.title}
                  </h2>

                  {/* Special treatment for title slide */}
                  {activeSlide === 0 ? (
                    <div style={s.titleSlideContent}>
                      <div style={{ ...s.companyName, color: primaryColor }}>{primaryName}</div>
                      <div style={s.companyTagline}>{tagline}</div>
                      {(slide.content || []).slice(1).map((line, i) => (
                        <div key={i} style={s.titleMeta}>{line}</div>
                      ))}
                    </div>
                  ) : (
                    <ul style={s.bulletList}>
                      {(slide.content || []).map((point, i) => (
                        <li key={i} style={s.bulletItem}>
                          <span style={{ ...s.bullet, background: SLIDE_COLORS[activeSlide % SLIDE_COLORS.length] }} />
                          <span style={s.bulletText}>{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Bottom branding */}
                  <div style={s.slideBranding}>
                    <span style={{ color: primaryColor, fontWeight: 700 }}>{primaryName}</span>
                    <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
                    <span style={{ color: 'rgba(255,255,255,0.3)' }}>{tagline}</span>
                  </div>
                </div>

                {/* Speaker notes */}
                {showNotes && slide.speakerNotes && (
                  <div style={s.notesBox}>
                    <div style={s.notesLabel}>💬 Speaker Notes</div>
                    <p style={s.notesText}>{slide.speakerNotes}</p>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div style={s.navControls}>
                <button
                  onClick={() => setActiveSlide(Math.max(0, activeSlide - 1))}
                  disabled={activeSlide === 0}
                  style={activeSlide === 0 ? { ...s.navBtn, opacity: 0.3 } : s.navBtn}
                >
                  ← Previous
                </button>
                <span style={s.navCounter}>{activeSlide + 1} / {slides.length}</span>
                <button
                  onClick={() => setActiveSlide(Math.min(slides.length - 1, activeSlide + 1))}
                  disabled={activeSlide === slides.length - 1}
                  style={activeSlide === slides.length - 1 ? { ...s.navBtn, opacity: 0.3 } : s.navBtn}
                >
                  Next →
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* All slides overview */}
      <div style={s.overviewSection}>
        <h3 style={s.overviewTitle}>📋 All Slides Overview</h3>
        <div style={s.overviewGrid}>
          {slides.map((sl, i) => (
            <div key={i} style={s.overviewCard} onClick={() => { setActiveSlide(i); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
              <div style={{ ...s.overviewNum, color: SLIDE_COLORS[i % SLIDE_COLORS.length] }}>
                Slide {sl.number}
              </div>
              <div style={s.overviewSlideTitle}>{sl.title}</div>
              <ul style={s.overviewBullets}>
                {(sl.content || []).slice(0, 3).map((point, j) => (
                  <li key={j} style={s.overviewBullet}>
                    <span style={{ color: SLIDE_COLORS[i % SLIDE_COLORS.length], marginRight: 6 }}>·</span>
                    {point.length > 60 ? point.slice(0, 60) + '…' : point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Investor FAQ */}
      {data.investorFAQ?.length > 0 && (
        <div style={s.faqSection}>
          <h3 style={s.overviewTitle}>❓ Investor FAQ</h3>
          {data.investorFAQ.map((faq, i) => (
            <div key={i} style={s.faqItem}>
              <div style={s.faqQ}>{faq.question}</div>
              <div style={s.faqA}>{faq.answer}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const Empty = () => (
  <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>No pitch deck data</div>
);

const s = {
  root: { display: 'flex', flexDirection: 'column', gap: 24 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700 },
  subtitle: { fontSize: 14, color: 'var(--text-muted)', marginTop: 4 },
  notesBtn: {
    background: 'var(--bg-surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)',
    padding: '8px 16px', fontSize: 13, cursor: 'pointer',
    fontFamily: 'var(--font-body)',
  },
  notesBtnActive: { background: 'var(--amber-dim)', borderColor: 'var(--amber)', color: 'var(--amber)' },

  layout: { display: 'grid', gridTemplateColumns: '220px 1fr', gap: 20, alignItems: 'start' },

  sidebar: {
    display: 'flex', flexDirection: 'column', gap: 4,
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)', padding: '12px',
    maxHeight: 540, overflowY: 'auto',
  },
  thumb: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '10px 12px', borderRadius: 'var(--radius-md)',
    background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
    transition: 'background 0.15s', fontFamily: 'var(--font-body)',
  },
  thumbActive: { background: 'var(--bg-elevated)' },
  thumbNum: {
    width: 26, height: 26, borderRadius: 6,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 12, fontWeight: 800, flexShrink: 0,
  },
  thumbTitle: { fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.3 },

  mainArea: { display: 'flex', flexDirection: 'column', gap: 16 },
  slideContainer: { display: 'flex', flexDirection: 'column', gap: 12 },

  slide: {
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-xl)',
    padding: '40px 48px',
    minHeight: 380,
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    animation: 'fadeIn 0.3s ease',
  },
  slideBar: { position: 'absolute', top: 0, left: 0, right: 0, height: 4 },
  slideNumBadge: {
    fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700,
    marginBottom: 20, letterSpacing: 2,
  },
  slideTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 32, fontWeight: 800,
    marginBottom: 28, lineHeight: 1.2,
  },

  titleSlideContent: { display: 'flex', flexDirection: 'column', gap: 12, flex: 1, justifyContent: 'center' },
  companyName: { fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 900, lineHeight: 1 },
  companyTagline: { fontSize: 20, color: 'rgba(255,255,255,0.6)', fontStyle: 'italic' },
  titleMeta: { fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 4 },

  bulletList: { listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 16, flex: 1 },
  bulletItem: { display: 'flex', gap: 16, alignItems: 'flex-start' },
  bullet: { width: 8, height: 8, borderRadius: '50%', marginTop: 6, flexShrink: 0 },
  bulletText: { fontSize: 16, color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 },

  slideBranding: {
    position: 'absolute', bottom: 16, right: 24,
    display: 'flex', gap: 8, alignItems: 'center',
    fontSize: 12,
  },

  notesBox: {
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)', padding: '16px 20px',
    borderLeft: '4px solid var(--amber)',
  },
  notesLabel: { fontSize: 12, color: 'var(--amber)', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
  notesText: { fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 },

  navControls: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  navBtn: {
    background: 'var(--bg-surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)',
    padding: '10px 20px', fontSize: 14, cursor: 'pointer',
    fontFamily: 'var(--font-body)',
  },
  navCounter: { fontSize: 14, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' },

  overviewSection: {
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)', padding: '28px',
  },
  overviewTitle: { fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 20 },
  overviewGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 },
  overviewCard: {
    background: 'var(--bg-surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)', padding: '16px', cursor: 'pointer',
    transition: 'border-color 0.2s',
  },
  overviewNum: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
  overviewSlideTitle: { fontSize: 14, fontWeight: 700, marginBottom: 10, color: 'var(--text-primary)' },
  overviewBullets: { listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 },
  overviewBullet: { fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4 },

  faqSection: {
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)', padding: '28px',
    display: 'flex', flexDirection: 'column', gap: 16,
  },
  faqItem: {
    background: 'var(--bg-surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)', padding: '20px',
  },
  faqQ: { fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 },
  faqA: { fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 },
};
