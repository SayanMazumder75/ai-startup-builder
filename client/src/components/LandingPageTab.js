import React, { useState, useRef, useEffect } from 'react';
import { copyToClipboard } from '../utils/export';

// ── Toast notification ────────────────────────────────────────────────────────
function Toast({ message, show }) {
  return (
    <div style={{
      position:'fixed', bottom:32, right:32, zIndex:9999,
      background:'linear-gradient(135deg,#1a1a28,#0f0f1a)',
      border:'1px solid rgba(251,191,36,0.4)',
      borderRadius:14, padding:'14px 22px',
      color:'#fbbf24', fontSize:14, fontWeight:600,
      boxShadow:'0 8px 32px rgba(0,0,0,0.6), 0 0 40px rgba(251,191,36,0.15)',
      display:'flex', alignItems:'center', gap:10,
      transform: show ? 'translateY(0) scale(1)' : 'translateY(80px) scale(0.9)',
      opacity: show ? 1 : 0,
      transition:'all 0.4s cubic-bezier(0.16,1,0.3,1)',
      pointerEvents:'none',
    }}>
      <span style={{ fontSize:18 }}>✅</span> {message}
    </div>
  );
}

// ── Animated counter ──────────────────────────────────────────────────────────
function AnimStat({ num, suffix, label }) {
  const [v, setV] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      let i = 0, step = num / 50;
      const t = setInterval(() => { i = Math.min(i + step, num); setV(Math.round(i)); if (i >= num) clearInterval(t); }, 30);
    }, { threshold: 0.4 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [num]);
  return <span ref={ref}>{v}{suffix}</span>;
}

// ── FAQ accordion ─────────────────────────────────────────────────────────────
function FaqItem({ q, a, primary }) {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={() => setOpen(!open)} style={{
      background: open ? `${primary}08` : 'rgba(255,255,255,0.02)',
      border:`1px solid ${open ? primary+'40' : 'rgba(255,255,255,0.07)'}`,
      borderRadius:16, padding:'20px 24px', cursor:'pointer',
      transition:'all 0.3s',
    }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:16 }}>
        <h4 style={{ fontSize:15, fontWeight:700, color: open ? primary : 'var(--text-primary)', margin:0 }}>{q}</h4>
        <span style={{
          width:28, height:28, borderRadius:'50%',
          background: open ? primary : 'rgba(255,255,255,0.06)',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:16, fontWeight:700, color: open ? '#0a0a12' : 'var(--text-muted)',
          flexShrink:0, transition:'all 0.3s',
          transform: open ? 'rotate(45deg)' : 'rotate(0)',
        }}>+</span>
      </div>
      <div style={{
        maxHeight: open ? 200 : 0, overflow:'hidden',
        transition:'max-height 0.4s cubic-bezier(0.16,1,0.3,1)',
      }}>
        <p style={{ margin:'14px 0 0', fontSize:14, color:'var(--text-secondary)', lineHeight:1.75 }}>{a}</p>
      </div>
    </div>
  );
}

// ── Pricing card hover ────────────────────────────────────────────────────────
function PricingCard({ plan, primary, accent, onCta }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        background: plan.highlighted
          ? `linear-gradient(160deg, ${primary}18 0%, ${accent}10 100%)`
          : 'rgba(255,255,255,0.02)',
        border:`1.5px solid ${plan.highlighted ? primary : hovered ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.07)'}`,
        borderRadius:24, padding:'32px 28px',
        transform: plan.highlighted ? 'scale(1.04)' : hovered ? 'translateY(-4px)' : 'none',
        transition:'all 0.35s cubic-bezier(0.16,1,0.3,1)',
        position:'relative', overflow:'hidden',
        boxShadow: plan.highlighted ? `0 16px 48px ${primary}25, 0 0 0 1px ${primary}20` : 'none',
      }}>
      {plan.highlighted && (
        <div style={{
          position:'absolute', top:-1, left:'50%', transform:'translateX(-50%)',
          background:`linear-gradient(135deg,${primary},${accent})`,
          color:'#0a0a12', fontSize:11, fontWeight:800,
          padding:'5px 18px', borderRadius:'0 0 12px 12px',
          letterSpacing:1, textTransform:'uppercase',
        }}>⭐ Most Popular</div>
      )}
      {plan.highlighted && (
        <div style={{
          position:'absolute', top:0, left:0, right:0, bottom:0, pointerEvents:'none',
          background:`radial-gradient(circle at 50% 0%, ${primary}15 0%, transparent 60%)`,
        }} />
      )}
      <div style={{ fontSize:13, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:1, marginBottom:10 }}>{plan.name}</div>
      <div style={{ display:'flex', alignItems:'baseline', gap:4, marginBottom:4 }}>
        <span style={{ fontSize:48, fontWeight:900, fontFamily:'var(--font-display)', color: plan.highlighted ? primary : 'var(--text-primary)', lineHeight:1 }}>{plan.price}</span>
      </div>
      <div style={{ fontSize:12, color:'var(--text-muted)', marginBottom:8 }}>{plan.period}</div>
      <p style={{ fontSize:13, color:'var(--text-secondary)', marginBottom:24, lineHeight:1.6 }}>{plan.description}</p>
      <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:10, marginBottom:28 }}>
        {(plan.features||[]).map((f,i) => (
          <li key={i} style={{ display:'flex', gap:10, fontSize:13, color:'var(--text-secondary)', alignItems:'flex-start' }}>
            <span style={{ color:primary, fontWeight:800, flexShrink:0, marginTop:1 }}>✓</span> {f}
          </li>
        ))}
      </ul>
      <button onClick={() => onCta(plan)} style={{
        width:'100%', padding:'14px',
        background: plan.highlighted ? `linear-gradient(135deg,${primary},${accent})` : 'rgba(255,255,255,0.06)',
        border: plan.highlighted ? 'none' : '1px solid rgba(255,255,255,0.12)',
        borderRadius:12, color: plan.highlighted ? '#0a0a12' : 'var(--text-primary)',
        fontSize:14, fontWeight:800, cursor:'pointer',
        fontFamily:'var(--font-display)',
        boxShadow: plan.highlighted ? `0 8px 24px ${primary}40` : 'none',
        transition:'all 0.2s',
        transform: hovered && !plan.highlighted ? 'scale(1.02)' : 'scale(1)',
      }}>Get Started →</button>
    </div>
  );
}

// ── Feature card ──────────────────────────────────────────────────────────────
function FeatureCard({ f, primary, i }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? `${primary}08` : 'rgba(255,255,255,0.02)',
        border:`1px solid ${hov ? primary+'35' : 'rgba(255,255,255,0.07)'}`,
        borderRadius:20, padding:'28px 24px',
        transition:'all 0.3s cubic-bezier(0.16,1,0.3,1)',
        transform: hov ? 'translateY(-6px)' : 'none',
        boxShadow: hov ? `0 16px 40px rgba(0,0,0,0.4), 0 0 0 1px ${primary}20` : 'none',
        position:'relative', overflow:'hidden',
      }}>
      <div style={{
        position:'absolute', top:0, right:0,
        width:80, height:80, borderRadius:'0 0 0 80px',
        background: hov ? `${primary}15` : 'transparent',
        transition:'all 0.3s',
      }} />
      <div style={{
        width:52, height:52, borderRadius:14,
        background:`${primary}15`, border:`1px solid ${primary}25`,
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:24, marginBottom:18,
        boxShadow: hov ? `0 0 20px ${primary}30` : 'none',
        transition:'box-shadow 0.3s',
      }}>{f.icon}</div>
      <h3 style={{ fontFamily:'var(--font-display)', fontSize:16, fontWeight:700, marginBottom:10, color:'var(--text-primary)' }}>{f.title}</h3>
      <p style={{ fontSize:13, color:'var(--text-secondary)', lineHeight:1.7 }}>{f.description}</p>
      <div style={{
        marginTop:16, fontSize:12, color:primary, fontWeight:700,
        opacity: hov ? 1 : 0, transition:'opacity 0.2s',
        display:'flex', alignItems:'center', gap:6,
      }}>Learn more <span>→</span></div>
    </div>
  );
}

// ── Testimonial card ──────────────────────────────────────────────────────────
function TestimonialCard({ t, primary }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background:'rgba(255,255,255,0.02)',
        border:`1px solid ${hov ? primary+'30' : 'rgba(255,255,255,0.07)'}`,
        borderRadius:20, padding:'28px',
        transition:'all 0.3s', transform: hov ? 'translateY(-4px)' : 'none',
        boxShadow: hov ? '0 12px 40px rgba(0,0,0,0.3)' : 'none',
      }}>
      <div style={{ display:'flex', gap:4, marginBottom:16 }}>
        {[1,2,3,4,5].map(s => <span key={s} style={{ color:primary, fontSize:14 }}>★</span>)}
      </div>
      <p style={{ fontSize:14, color:'var(--text-secondary)', lineHeight:1.8, fontStyle:'italic', marginBottom:20 }}>"{t.text}"</p>
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        <div style={{
          width:42, height:42, borderRadius:'50%',
          background:`linear-gradient(135deg,${primary},#f97316)`,
          display:'flex', alignItems:'center', justifyContent:'center',
          fontWeight:800, fontSize:16, color:'#0a0a12',
          boxShadow:`0 0 16px ${primary}40`,
        }}>{t.name[0]}</div>
        <div>
          <div style={{ fontSize:14, fontWeight:700, color:'var(--text-primary)' }}>{t.name}</div>
          <div style={{ fontSize:12, color:'var(--text-muted)' }}>{t.role} · {t.company}</div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function LandingPageTab({ data, branding }) {
  const [view, setView] = useState('preview');
  const [toast, setToast] = useState({ show:false, msg:'' });
  const [copied, setCopied] = useState(false);

  if (!data) return <div style={{ textAlign:'center', padding:60, color:'var(--text-muted)' }}>No landing page data</div>;

  const primary = branding?.colorPalette?.primary?.hex || '#fbbf24';
  const accent  = branding?.colorPalette?.accent?.hex  || '#f97316';
  const bg      = branding?.colorPalette?.background?.hex || '#05050a';
  const name    = branding?.nameOptions?.[0]?.name || 'YourStartup';

  const showToast = (msg) => {
    setToast({ show:true, msg });
    setTimeout(() => setToast({ show:false, msg:'' }), 3000);
  };

  const handleCta = (plan) => showToast(`🚀 "${plan.name}" plan selected! Redirecting to checkout...`);
  const handleHero = () => showToast(`✨ Opening signup for ${name}...`);
  const handleSecondary = () => showToast(`📖 Loading product tour...`);
  const handleNav = (item) => showToast(`📌 Navigating to ${item}...`);
  const handleCopyCode = async () => {
    await copyToClipboard(buildReactCode(data, branding, name, primary, accent));
    setCopied(true); setTimeout(() => setCopied(false), 2000);
    showToast('📋 React code copied to clipboard!');
  };

  return (
    <div>
      <Toast message={toast.msg} show={toast.show} />

      {/* ── Tab header ── */}
      <div style={s.header}>
        <div>
          <p className="section-eyebrow">Output</p>
          <h2 style={s.title}>🌐 Landing Page</h2>
        </div>
        <div style={s.toggleGroup}>
          {[['preview','👁 Preview'],['code','{ } Code']].map(([v,l]) => (
            <button key={v} onClick={() => setView(v)}
              style={view===v ? {...s.toggleBtn,...s.toggleActive} : s.toggleBtn}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {view === 'preview' ? (
        <div style={s.previewRoot}>

          {/* ══ NAV ══ */}
          <nav style={{ ...s.nav, borderBottomColor:`${primary}20` }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ ...s.navDot, background:primary, boxShadow:`0 0 12px ${primary}80` }} />
              <span style={{ ...s.navBrand, color:primary }}>{name}</span>
            </div>
            <div style={s.navLinks}>
              {['Features','Pricing','Testimonials','FAQ'].map(item => (
                <button key={item} onClick={() => handleNav(item)} style={s.navLink}>{item}</button>
              ))}
            </div>
            <button onClick={handleHero} style={{ ...s.navCta, background:`linear-gradient(135deg,${primary},${accent})`, color:bg }}>
              {data.hero?.ctaText || 'Get Started'}
            </button>
          </nav>

          {/* ══ HERO ══ */}
          <section style={{ ...s.heroSection, background:`linear-gradient(160deg, ${bg} 0%, ${bg}ee 40%, ${primary}08 100%)` }}>
            {/* Background glow */}
            <div style={{ position:'absolute', inset:0, pointerEvents:'none',
              background:`radial-gradient(ellipse 70% 50% at 50% 100%, ${primary}12 0%, transparent 70%)` }} />

            <div style={s.heroBadge} onClick={() => showToast('🎉 Beta access is live!')}>
              <span style={{ ...s.heroBadgeDot, background:primary, boxShadow:`0 0 8px ${primary}` }} />
              Now in Beta · Free to Start
            </div>

            <h1 style={{ ...s.heroH1, background:`linear-gradient(135deg,${primary} 0%,${accent} 60%,#fff 100%)`,
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
              {data.hero?.headline}
            </h1>
            <p style={s.heroSub}>{data.hero?.subheadline}</p>

            {/* Stats row */}
            <div style={s.heroStats}>
              {[
                { n:10000, s:'+', l:'Users' },
                { n:99, s:'%', l:'Uptime' },
                { n:60, s:'s', l:'Setup Time' },
              ].map(({ n,s,l }) => (
                <div key={l} style={s.heroStatItem}>
                  <div style={{ ...s.heroStatNum, color:primary }}>
                    <AnimStat num={n} suffix={s} label={l} />
                  </div>
                  <div style={s.heroStatLabel}>{l}</div>
                </div>
              ))}
            </div>

            <div style={s.heroCtas}>
              <button onClick={handleHero} style={{
                ...s.ctaPrimary,
                background:`linear-gradient(135deg,${primary} 0%,${accent} 100%)`,
                color:bg,
                boxShadow:`0 8px 32px ${primary}50, 0 0 0 1px ${primary}30`,
              }}>
                🚀 {data.hero?.ctaText}
              </button>
              <button onClick={handleSecondary} style={s.ctaSecondary}>
                ▶ {data.hero?.ctaSecondary}
              </button>
            </div>

            {/* Trust badges */}
            <div style={s.trustRow}>
              {['No credit card','Cancel anytime','SOC 2 Compliant','GDPR Ready'].map(t => (
                <span key={t} style={s.trustBadge}>✓ {t}</span>
              ))}
            </div>
          </section>

          {/* ══ FEATURES ══ */}
          <section style={s.section}>
            <p className="section-eyebrow" style={{ textAlign:'center' }}>Why choose us</p>
            <h2 style={s.sectionH2}>Everything you need to succeed</h2>
            <p style={s.sectionSub}>Built for teams who move fast and demand quality</p>
            <div style={s.featuresGrid}>
              {(data.features||[]).map((f,i) => (
                <FeatureCard key={i} f={f} primary={primary} i={i} />
              ))}
            </div>
          </section>

          {/* ══ SOCIAL PROOF BANNER ══ */}
          <div style={{ ...s.socialBanner, background:`${primary}08`, borderColor:`${primary}20` }}>
            <span style={{ fontSize:24 }}>🏆</span>
            <p style={{ fontSize:15, color:'var(--text-secondary)' }}>
              Trusted by <strong style={{ color:primary }}>10,000+</strong> teams worldwide ·
              Rated <strong style={{ color:primary }}>4.9/5</strong> across all reviews
            </p>
            <div style={{ display:'flex', gap:8 }}>
              {[...Array(5)].map((_,i) => <span key={i} style={{ color:primary, fontSize:18 }}>★</span>)}
            </div>
          </div>

          {/* ══ TESTIMONIALS ══ */}
          <section style={{ ...s.section, background:'rgba(255,255,255,0.01)' }}>
            <p className="section-eyebrow" style={{ textAlign:'center' }}>Social proof</p>
            <h2 style={s.sectionH2}>What our customers say</h2>
            <div style={s.testimonialsGrid}>
              {(data.testimonials||[]).map((t,i) => (
                <TestimonialCard key={i} t={t} primary={primary} />
              ))}
            </div>
          </section>

          {/* ══ PRICING ══ */}
          <section style={s.section} id="pricing">
            <p className="section-eyebrow" style={{ textAlign:'center' }}>Pricing</p>
            <h2 style={s.sectionH2}>Simple, transparent pricing</h2>
            <p style={s.sectionSub}>No hidden fees. No surprises. Cancel anytime.</p>
            <div style={s.pricingGrid}>
              {(data.pricing||[]).map((plan,i) => (
                <PricingCard key={i} plan={plan} primary={primary} accent={accent} onCta={handleCta} />
              ))}
            </div>
            <p style={{ textAlign:'center', marginTop:24, fontSize:13, color:'var(--text-muted)' }}>
              All plans include 14-day free trial · No credit card required
            </p>
          </section>

          {/* ══ FAQ ══ */}
          <section style={s.section}>
            <p className="section-eyebrow" style={{ textAlign:'center' }}>FAQ</p>
            <h2 style={s.sectionH2}>Frequently asked questions</h2>
            <div style={s.faqList}>
              {(data.faq||[]).map((f,i) => (
                <FaqItem key={i} q={f.question} a={f.answer} primary={primary} />
              ))}
            </div>
            <div style={{ textAlign:'center', marginTop:28 }}>
              <button onClick={() => showToast('💬 Opening live chat...')} style={{
                background:'none', border:`1px solid ${primary}40`,
                borderRadius:50, color:primary, padding:'12px 28px',
                fontSize:14, cursor:'pointer', fontFamily:'var(--font-body)',
                transition:'all 0.2s',
              }}>Still have questions? Chat with us →</button>
            </div>
          </section>

          {/* ══ CTA FOOTER ══ */}
          <section style={{
            padding:'80px 40px', textAlign:'center', position:'relative', overflow:'hidden',
            background:`linear-gradient(160deg, ${bg} 0%, ${primary}12 50%, ${bg} 100%)`,
          }}>
            <div style={{ position:'absolute', inset:0,
              background:`radial-gradient(ellipse 60% 60% at 50% 50%, ${primary}15 0%, transparent 70%)`,
              pointerEvents:'none' }} />
            <div style={{ position:'relative', zIndex:1 }}>
              <p className="section-eyebrow" style={{ textAlign:'center' }}>Get started</p>
              <h2 style={{ ...s.sectionH2, fontSize:'clamp(28px,4vw,44px)' }}>
                Ready to build something amazing?
              </h2>
              <p style={{ ...s.sectionSub, maxWidth:480, margin:'0 auto 36px' }}>
                Join thousands of founders using {name} to launch faster.
              </p>
              <div style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap' }}>
                <button onClick={handleHero} style={{
                  background:`linear-gradient(135deg,${primary},${accent})`,
                  border:'none', borderRadius:14, color:bg,
                  padding:'16px 36px', fontSize:17, fontWeight:900,
                  cursor:'pointer', fontFamily:'var(--font-display)',
                  boxShadow:`0 12px 40px ${primary}50`,
                  transition:'transform 0.2s',
                }}>🚀 Start Free Today</button>
                <button onClick={() => showToast('📅 Opening demo calendar...')} style={{
                  background:'rgba(255,255,255,0.05)',
                  border:'1px solid rgba(255,255,255,0.15)',
                  borderRadius:14, color:'var(--text-primary)',
                  padding:'16px 36px', fontSize:17, fontWeight:600,
                  cursor:'pointer', fontFamily:'var(--font-body)',
                }}>Book a Demo</button>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer style={{ ...s.footer, borderTopColor:`${primary}15` }}>
            <span style={{ ...s.footerBrand, color:primary }}>{name}</span>
            <span style={s.footerCopy}>© {new Date().getFullYear()} {name}. All rights reserved.</span>
            <div style={{ display:'flex', gap:20 }}>
              {['Privacy','Terms','Contact'].map(l => (
                <button key={l} onClick={() => showToast(`Opening ${l} page...`)}
                  style={{ background:'none', border:'none', color:'var(--text-muted)', fontSize:13, cursor:'pointer' }}>{l}</button>
              ))}
            </div>
          </footer>
        </div>
      ) : (
        /* ── CODE VIEW ── */
        <div style={s.codeRoot}>
          <div style={s.codeBar}>
            <div style={{ display:'flex', gap:6 }}>
              {['#ff5f57','#ffbd2e','#28ca41'].map(c => (
                <div key={c} style={{ width:12,height:12,borderRadius:'50%',background:c }} />
              ))}
            </div>
            <span style={s.codeFileName}>LandingPage.jsx — React + Tailwind CSS</span>
            <button onClick={handleCopyCode} style={s.codeCopyBtn}>
              {copied ? '✅ Copied!' : '📋 Copy Code'}
            </button>
          </div>
          <pre style={s.code}>{buildReactCode(data, branding, name, primary, accent)}</pre>
        </div>
      )}
    </div>
  );
}

function buildReactCode(data, branding, name, primary, accent) {
  return `import React, { useState } from 'react';

// ── ${name} Landing Page ─────────────────────────────────────────
// Generated by AI Startup Builder · aiStartupBuilder.app
// Primary: ${primary} · Accent: ${accent}
// ────────────────────────────────────────────────────────────────

const FEATURES = ${JSON.stringify(data?.features||[], null, 2)};
const PRICING  = ${JSON.stringify(data?.pricing||[], null, 2)};
const FAQS     = ${JSON.stringify(data?.faq||[], null, 2)};

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen bg-[#02020a] text-white font-sans">

      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#02020a]/90 backdrop-blur-2xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-black" style={{ color:'${primary}' }}>${name}</span>
          <div className="hidden md:flex gap-8">
            {['Features','Pricing','FAQ'].map(l => (
              <a key={l} href={\`#\${l.toLowerCase()}\`}
                className="text-sm text-gray-400 hover:text-white transition">{l}</a>
            ))}
          </div>
          <button className="px-5 py-2.5 rounded-xl text-sm font-bold transition hover:scale-105"
            style={{ background:'linear-gradient(135deg,${primary},${accent})', color:'#02020a' }}>
            ${data?.hero?.ctaText || 'Get Started'}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative text-center py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background:'radial-gradient(ellipse 60% 50% at 50% 100%, ${primary}15, transparent)' }} />
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold mb-10"
            style={{ borderColor:'${primary}40', color:'${primary}', background:'${primary}12' }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background:'${primary}' }} />
            Now in Beta · Free to Start
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6"
            style={{ background:'linear-gradient(135deg,${primary},${accent},white)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            ${data?.hero?.headline}
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            ${data?.hero?.subheadline}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button className="px-8 py-4 rounded-2xl text-lg font-black transition hover:scale-105 hover:brightness-110"
              style={{ background:'linear-gradient(135deg,${primary},${accent})', color:'#02020a',
                boxShadow:'0 8px 32px ${primary}50' }}>
              🚀 ${data?.hero?.ctaText}
            </button>
            <button className="px-8 py-4 rounded-2xl text-lg font-semibold border border-white/15 hover:border-white/30 transition">
              ▶ ${data?.hero?.ctaSecondary}
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-4">Everything you need</h2>
          <p className="text-center text-gray-500 mb-16">Built for teams who move fast</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="group p-6 rounded-2xl border border-white/8 bg-white/2
                hover:border-[${primary}35] hover:-translate-y-1.5 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                  style={{ background:'${primary}15', border:'1px solid ${primary}25' }}>{f.icon}</div>
                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-16">Simple pricing</h2>
          <div className="grid md:grid-cols-3 gap-6 items-start">
            {PRICING.map((plan, i) => (
              <div key={i} className={\`p-8 rounded-2xl border relative \${plan.highlighted
                ? 'scale-105 shadow-2xl' : 'border-white/8 bg-white/2'}\`}
                style={plan.highlighted ? {
                  border:'1.5px solid ${primary}',
                  background:'linear-gradient(160deg,${primary}18,${accent}10)',
                  boxShadow:'0 24px 64px ${primary}25'
                } : {}}>
                {plan.highlighted && (
                  <div className="absolute -top-px left-1/2 -translate-x-1/2 text-xs font-black px-4 py-1.5 rounded-b-xl"
                    style={{ background:'linear-gradient(135deg,${primary},${accent})', color:'#02020a' }}>
                    ⭐ Most Popular
                  </div>
                )}
                <div className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">{plan.name}</div>
                <div className="text-5xl font-black mb-1" style={{ color: plan.highlighted ? '${primary}' : 'white' }}>
                  {plan.price}
                </div>
                <div className="text-xs text-gray-600 mb-6">{plan.period}</div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f,j) => (
                    <li key={j} className="flex gap-3 text-sm text-gray-300">
                      <span style={{ color:'${primary}' }} className="font-black">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <button className="w-full py-3.5 rounded-xl font-black text-sm transition hover:opacity-90"
                  style={plan.highlighted
                    ? { background:'linear-gradient(135deg,${primary},${accent})', color:'#02020a' }
                    : { background:'rgba(255,255,255,0.07)', color:'white' }}>
                  Get Started →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-12">FAQ</h2>
          {FAQS.map((f, i) => (
            <div key={i} onClick={() => setOpenFaq(openFaq===i?null:i)}
              className="mb-4 p-6 rounded-2xl border cursor-pointer transition-all"
              style={{ borderColor: openFaq===i ? '${primary}40' : 'rgba(255,255,255,0.07)',
                background: openFaq===i ? '${primary}08' : 'rgba(255,255,255,0.02)' }}>
              <div className="flex justify-between items-center gap-4">
                <h3 className="font-bold" style={{ color: openFaq===i ? '${primary}' : 'white' }}>{f.question}</h3>
                <span className="transition-transform" style={{ transform: openFaq===i ? 'rotate(45deg)' : 'none',
                  color: openFaq===i ? '${primary}' : 'gray' }}>+</span>
              </div>
              {openFaq===i && <p className="mt-4 text-gray-400 text-sm leading-relaxed">{f.answer}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/8 py-10 text-center">
        <p className="text-2xl font-black mb-2" style={{ color:'${primary}' }}>${name}</p>
        <p className="text-gray-600 text-sm">© {new Date().getFullYear()} ${name}. All rights reserved.</p>
      </footer>
    </div>
  );
}`;
}

const s = {
  header: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24, flexWrap:'wrap', gap:12 },
  title: { fontFamily:'var(--font-display)', fontSize:26, fontWeight:800, margin:0 },
  toggleGroup: { display:'flex', gap:4, background:'rgba(255,255,255,0.04)', borderRadius:12, padding:4 },
  toggleBtn: {
    padding:'9px 18px', borderRadius:9, background:'none', border:'none',
    color:'var(--text-muted)', cursor:'pointer', fontSize:14, fontWeight:600,
    fontFamily:'var(--font-body)', transition:'all 0.2s',
  },
  toggleActive: { background:'rgba(255,255,255,0.08)', color:'var(--text-primary)' },

  previewRoot: { border:'1px solid var(--border)', borderRadius:24, overflow:'hidden', background:'var(--bg-void)' },

  nav: {
    display:'flex', alignItems:'center', justifyContent:'space-between',
    padding:'16px 28px', borderBottom:'1px solid',
    background:'rgba(2,2,10,0.95)', backdropFilter:'blur(20px)',
    position:'sticky', top:0, zIndex:10, flexWrap:'wrap', gap:12,
  },
  navDot: { width:8, height:8, borderRadius:'50%' },
  navBrand: { fontFamily:'var(--font-display)', fontSize:18, fontWeight:900 },
  navLinks: { display:'flex', gap:4 },
  navLink: {
    background:'none', border:'none', color:'var(--text-secondary)',
    padding:'6px 12px', fontSize:13, cursor:'pointer', borderRadius:8,
    fontFamily:'var(--font-body)', transition:'color 0.2s',
  },
  navCta: { padding:'9px 20px', borderRadius:10, border:'none', fontSize:14, fontWeight:800, cursor:'pointer', fontFamily:'var(--font-display)' },

  heroSection: {
    padding:'90px 40px 80px', textAlign:'center', position:'relative', overflow:'hidden',
  },
  heroBadge: {
    display:'inline-flex', alignItems:'center', gap:8,
    padding:'7px 18px', borderRadius:100,
    background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)',
    fontSize:13, fontWeight:600, color:'var(--text-secondary)',
    marginBottom:28, cursor:'pointer', transition:'all 0.2s',
  },
  heroBadgeDot: { width:7, height:7, borderRadius:'50%', display:'inline-block' },
  heroH1: {
    fontFamily:'var(--font-display)',
    fontSize:'clamp(32px,5vw,60px)',
    fontWeight:900, lineHeight:1.1, marginBottom:20,
  },
  heroSub: { fontSize:18, color:'var(--text-secondary)', lineHeight:1.75, marginBottom:32, maxWidth:600, margin:'0 auto 32px' },
  heroStats: { display:'flex', justifyContent:'center', gap:48, marginBottom:36, flexWrap:'wrap' },
  heroStatItem: { textAlign:'center' },
  heroStatNum: { fontFamily:'var(--font-display)', fontSize:32, fontWeight:900, lineHeight:1 },
  heroStatLabel: { fontSize:12, color:'var(--text-muted)', marginTop:4 },
  heroCtas: { display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap', marginBottom:28 },
  ctaPrimary: {
    padding:'15px 32px', borderRadius:14, border:'none',
    fontSize:16, fontWeight:900, cursor:'pointer', fontFamily:'var(--font-display)',
    transition:'transform 0.2s, box-shadow 0.2s',
  },
  ctaSecondary: {
    padding:'15px 32px', borderRadius:14,
    border:'1px solid rgba(255,255,255,0.12)',
    background:'rgba(255,255,255,0.04)',
    color:'var(--text-primary)', fontSize:16, fontWeight:600,
    cursor:'pointer', fontFamily:'var(--font-body)', transition:'all 0.2s',
  },
  trustRow: { display:'flex', gap:20, justifyContent:'center', flexWrap:'wrap' },
  trustBadge: { fontSize:12, color:'var(--text-muted)', display:'flex', alignItems:'center', gap:4 },

  section: { padding:'72px 40px', background:'var(--bg-void)' },
  sectionH2: { fontFamily:'var(--font-display)', fontSize:'clamp(24px,3vw,38px)', fontWeight:900, textAlign:'center', marginBottom:12 },
  sectionSub: { fontSize:16, color:'var(--text-secondary)', textAlign:'center', marginBottom:48, lineHeight:1.6 },

  socialBanner: {
    margin:'0 40px', padding:'24px 32px',
    borderRadius:20, border:'1px solid',
    display:'flex', alignItems:'center', justifyContent:'center', gap:20, flexWrap:'wrap',
  },
  featuresGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:18 },
  testimonialsGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:18 },
  pricingGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:24, alignItems:'start' },
  faqList: { maxWidth:720, margin:'0 auto', display:'flex', flexDirection:'column', gap:12 },

  footer: {
    display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16,
    padding:'24px 40px', borderTop:'1px solid',
    background:'rgba(2,2,10,0.9)',
  },
  footerBrand: { fontFamily:'var(--font-display)', fontSize:18, fontWeight:900 },
  footerCopy: { fontSize:13, color:'var(--text-muted)' },

  codeRoot: { border:'1px solid var(--border)', borderRadius:20, overflow:'hidden' },
  codeBar: {
    display:'flex', alignItems:'center', justifyContent:'space-between',
    padding:'12px 20px', background:'var(--bg-elevated)',
    borderBottom:'1px solid var(--border)',
  },
  codeFileName: { fontSize:13, color:'var(--text-muted)', fontFamily:'var(--font-mono)' },
  codeCopyBtn: {
    background:'var(--amber-dim)', border:'1px solid var(--amber)',
    borderRadius:8, color:'var(--amber)',
    padding:'6px 14px', fontSize:13, cursor:'pointer', fontFamily:'var(--font-body)',
  },
  code: {
    background:'var(--bg-surface)', padding:'28px',
    fontFamily:'var(--font-mono)', fontSize:12.5, lineHeight:1.75,
    color:'#a5b4fc', overflowX:'auto', maxHeight:600, overflow:'auto',
    whiteSpace:'pre', margin:0,
  },
};
