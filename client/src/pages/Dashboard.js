import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import ResultsPage from './ResultsPage';
import { HeroScene3D } from '../components/Scene3D';

const EXAMPLES = [
  'AI-powered meal planner that creates personalized recipes based on dietary restrictions and fridge contents',
  'Marketplace connecting remote workers with local coworking spaces for flexible daily bookings',
  'Mental health app using voice analysis to detect stress and recommend micro-interventions',
  'SaaS platform for small restaurants to manage online orders, inventory and staff scheduling',
  'Peer-to-peer tool sharing app for neighborhoods to rent out equipment they rarely use',
];

const STEPS = [
  { icon:'🧠', text:'Analyzing your idea with AI...' },
  { icon:'📋', text:'Crafting business strategy...' },
  { icon:'🎨', text:'Designing brand identity...' },
  { icon:'📊', text:'Building pitch deck...' },
  { icon:'🌐', text:'Generating landing page...' },
  { icon:'✨', text:'Finalizing your startup kit...' },
];

function AnimatedCounter({ target, suffix='' }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0;
        const step = target / 40;
        const timer = setInterval(() => {
          start = Math.min(start + step, target);
          setVal(Math.round(start));
          if (start >= target) clearInterval(timer);
        }, 40);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return <span ref={ref}>{val}{suffix}</span>;
}

export default function Dashboard() {
  const { user, logout, token } = useAuth();
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadStep, setLoadStep] = useState(0);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [saved, setSaved] = useState([]);
  const [showProjects, setShowProjects] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const textareaRef = useRef(null);

  useEffect(() => {
    const s = localStorage.getItem('savedProjects');
    if (s) setSaved(JSON.parse(s));
  }, []);

  // Cycle loading steps
  useEffect(() => {
    if (!loading) { setLoadStep(0); return; }
    const timer = setInterval(() => setLoadStep(p => (p + 1) % STEPS.length), 1800);
    return () => clearInterval(timer);
  }, [loading]);

  const handleGenerate = async () => {
    if (!idea.trim() || idea.trim().length < 10) { setError('Please describe your idea (at least 10 characters)'); return; }
    setError(''); setLoading(true);
    try {
      const data = await api.post('/generate', { idea: idea.trim() }, token);
      const project = { id: data.projectId, idea: data.idea, kit: data.kit, createdAt: data.generatedAt };
      setResult(project);
      const updated = [project, ...saved.filter(p => p.id !== project.id)].slice(0, 10);
      setSaved(updated);
      localStorage.setItem('savedProjects', JSON.stringify(updated));
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  if (result) return <ResultsPage project={result} onBack={() => setResult(null)} />;

  return (
    <div style={s.root}>
      {/* ── Nav ────────────────────────────────────────────────────── */}
      <nav style={s.nav}>
        <div style={s.navLeft}>
          <div style={s.navLogo}>
            <div style={s.navLogoIcon}>⚡</div>
            <span style={s.navBrand}>AI Startup Builder</span>
          </div>
          <div className="badge badge-green" style={{ gap:6 }}>
            <span style={{ width:6,height:6,borderRadius:'50%',background:'var(--green)',
              boxShadow:'0 0 6px var(--green)',display:'inline-block' }} />
            Live
          </div>
        </div>
        <div style={s.navRight}>
          {saved.length > 0 && (
            <button onClick={() => setShowProjects(!showProjects)} style={s.navBtn}>
              📁 Projects <span style={s.navBadge}>{saved.length}</span>
            </button>
          )}
          <div style={s.navAvatar}>
            <div style={s.avatarRing} />
            <span style={s.avatarLetter}>{user?.name?.[0]?.toUpperCase()||'U'}</span>
          </div>
          <span style={s.navUser}>{user?.name?.split(' ')[0]}</span>
          <button onClick={logout} style={s.navLogout}>Sign out</button>
        </div>
      </nav>

      {/* ── Projects Drawer ─────────────────────────────────────────── */}
      {showProjects && (
        <div style={s.projectsDrawer} className="animate-fadeInUp">
          <div style={s.drawerHeader}>
            <span style={s.drawerTitle}>📁 Your Projects</span>
            <button onClick={() => setShowProjects(false)} style={s.drawerClose}>✕</button>
          </div>
          <div style={s.drawerList}>
            {saved.map(p => (
              <button key={p.id} style={s.drawerItem}
                onClick={() => { setResult(p); setShowProjects(false); }}>
                <div style={s.drawerItemDot} />
                <div>
                  <div style={s.drawerItemText}>{p.idea.slice(0,70)}...</div>
                  <div style={s.drawerItemDate}>{new Date(p.createdAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</div>
                </div>
                <span style={s.drawerItemArrow}>→</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div style={s.hero}>
        {/* 3D scene */}
        <div style={s.scene3dWrap}>
          <HeroScene3D style={{ borderRadius:'50%' }} />
        </div>

        {/* Content */}
        <div style={s.heroContent}>
          <div className="badge badge-amber animate-fadeInUp" style={{ marginBottom:28 }}>
            ✨ Powered by Groq AI · Llama 3.3 70B
          </div>

          <h1 style={s.heroH1} className="animate-fadeInUp">
            Turn any idea into a<br />
            <span className="gradient-text-animated">complete startup</span>
          </h1>

          <p style={s.heroSub} className="animate-fadeInUp">
            Landing page · Business plan · Brand identity · Pitch deck<br />
            All generated in under <strong style={{color:'var(--amber)'}}>60 seconds</strong>.
          </p>

          {/* Stats */}
          <div style={s.statsRow} className="animate-fadeInUp">
            {[
              { num:2400, suffix:'+', label:'Kits Generated' },
              { num:60,   suffix:'s', label:'Avg. Time' },
              { num:4,    suffix:'',  label:'Deliverables' },
            ].map(({ num, suffix, label }) => (
              <div key={label} style={s.statItem}>
                <div style={s.statNum}><AnimatedCounter target={num} suffix={suffix} /></div>
                <div style={s.statLabel}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Input Section ───────────────────────────────────────────── */}
      <div style={s.inputSection}>
        <div style={s.inputCard} className="glass-card">
          {/* Header */}
          <div style={s.inputCardHeader}>
            <span style={s.inputCardTitle}>Describe your startup idea</span>
            <span style={{ ...s.inputCharCount, color: charCount > 450 ? '#f87171' : 'var(--text-muted)' }}>
              {charCount}/500
            </span>
          </div>

          {/* Textarea */}
          <div style={s.textareaWrap}>
            <textarea
              ref={textareaRef}
              value={idea}
              disabled={loading}
              onChange={e => { setIdea(e.target.value); setCharCount(e.target.value.length); setError(''); }}
              placeholder="e.g. An AI-powered fitness app that creates personalized workout plans based on your schedule, fitness level, and goals — with real-time form correction using your phone camera..."
              style={s.textarea}
              rows={4}
              maxLength={500}
            />
            {/* Sparkle decoration */}
            <div style={s.textareaDecor}>✦</div>
          </div>

          {error && (
            <div style={s.errorBox} className="animate-fadeInUp">
              <span>⚠</span> {error}
            </div>
          )}

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={loading || !idea.trim()}
            style={loading || !idea.trim()
              ? { ...s.genBtn, opacity:0.55, cursor:'not-allowed', boxShadow:'none' }
              : s.genBtn}
          >
            {loading ? (
              <span style={{ display:'flex', alignItems:'center', gap:12, justifyContent:'center' }}>
                <span style={s.btnSpinner} />
                <span>{STEPS[loadStep].icon} {STEPS[loadStep].text}</span>
              </span>
            ) : '🚀 Generate Startup Kit'}
          </button>

          {/* Loading progress */}
          {loading && (
            <div style={s.progressWrap} className="animate-fadeInUp">
              <div style={s.progressTrack}>
                <div style={{
                  ...s.progressBar,
                  width: `${((loadStep + 1) / STEPS.length) * 100}%`,
                  transition:'width 1.8s ease',
                }} />
              </div>
              <div style={s.progressSteps}>
                {STEPS.map((st, i) => (
                  <div key={i} style={{
                    ...s.progressStep,
                    opacity: i <= loadStep ? 1 : 0.3,
                    color: i === loadStep ? 'var(--amber)' : 'var(--text-muted)',
                    transform: i === loadStep ? 'scale(1.05)' : 'scale(1)',
                  }}>
                    {st.icon}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Examples */}
          {!loading && (
            <div style={s.examplesWrap}>
              <span style={s.examplesLabel}>💡 Quick examples:</span>
              <div style={s.examplesList}>
                {EXAMPLES.slice(0,3).map((ex, i) => (
                  <button key={i} style={s.exampleChip}
                    onClick={() => { setIdea(ex); setCharCount(ex.length); }}>
                    {ex.slice(0,55)}…
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── What You Get ─────────────────────────────────────────────── */}
      {!loading && (
        <div style={s.features}>
          <p className="section-eyebrow" style={{ textAlign:'center' }}>What you get</p>
          <div style={s.featureGrid}>
            {[
              { icon:'🌐', color:0xfbbf24, title:'Landing Page', desc:'Hero section, features, pricing, testimonials & FAQ — ready to deploy', tag:'React + Tailwind code' },
              { icon:'📋', color:0x8b5cf6, title:'Business Plan', desc:'Problem, solution, market size, revenue model, milestones & risk analysis', tag:'Investor-ready' },
              { icon:'🎨', color:0x22d3ee, title:'Brand Identity', desc:'4 name options, full color palette with hex codes, logo concept & typography', tag:'Complete kit' },
              { icon:'📊', color:0x34d399, title:'Pitch Deck', desc:'10 slides with bullet points, speaker notes & investor FAQ', tag:'Fundraise-ready' },
            ].map((f, i) => (
              <div key={i} style={s.featureCard} className="glass-card perspective-card animate-fadeInUp"
                style2={{ animationDelay:`${i*0.1}s` }}>
                <div style={{ ...s.featureIconBg, background:`rgba(${(f.color>>16)&255},${(f.color>>8)&255},${(f.color&255)},0.12)`}}>
                  <span style={s.featureIcon}>{f.icon}</span>
                </div>
                <div className="badge" style={{
                  background:`rgba(${(f.color>>16)&255},${(f.color>>8)&255},${(f.color&255)},0.1)`,
                  border:`1px solid rgba(${(f.color>>16)&255},${(f.color>>8)&255},${(f.color&255)},0.3)`,
                  color:`rgb(${(f.color>>16)&255},${(f.color>>8)&255},${(f.color&255)})`,
                  marginBottom:12, fontSize:11,
                }}>{f.tag}</div>
                <h3 style={s.featureTitle}>{f.title}</h3>
                <p style={s.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  root: { minHeight:'100vh', background:'var(--bg-void)' },

  // Nav
  nav: {
    display:'flex', alignItems:'center', justifyContent:'space-between',
    padding:'14px 28px',
    background:'rgba(6,6,15,0.85)', backdropFilter:'blur(24px)',
    borderBottom:'1px solid var(--border)',
    position:'sticky', top:0, zIndex:100,
  },
  navLeft: { display:'flex', alignItems:'center', gap:14 },
  navLogo: { display:'flex', alignItems:'center', gap:10 },
  navLogoIcon: {
    width:34, height:34, borderRadius:10,
    background:'linear-gradient(135deg,#fbbf24,#f97316)',
    display:'flex', alignItems:'center', justifyContent:'center',
    fontSize:16, boxShadow:'0 3px 12px rgba(251,191,36,0.4)',
  },
  navBrand: { fontFamily:'var(--font-display)', fontSize:16, fontWeight:700 },
  navRight: { display:'flex', alignItems:'center', gap:12 },
  navBtn: {
    display:'flex', alignItems:'center', gap:8,
    background:'rgba(255,255,255,0.04)', border:'1px solid var(--border)',
    borderRadius:'var(--r-md)', color:'var(--text-secondary)',
    padding:'8px 14px', fontSize:13, cursor:'pointer',
    fontFamily:'var(--font-body)', transition:'all 0.2s',
  },
  navBadge: {
    background:'var(--amber)', color:'#0a0a12',
    borderRadius:100, padding:'1px 7px', fontSize:11, fontWeight:800,
  },
  navAvatar: { position:'relative', width:34, height:34 },
  avatarRing: {
    position:'absolute', inset:-2, borderRadius:'50%',
    background:'linear-gradient(135deg,var(--amber),var(--violet))',
    animation:'spinSlow 4s linear infinite',
  },
  avatarLetter: {
    position:'absolute', inset:2, borderRadius:'50%',
    background:'var(--bg-card)',
    display:'flex', alignItems:'center', justifyContent:'center',
    fontWeight:800, fontSize:14, color:'var(--amber)',
  },
  navUser: { fontSize:14, color:'var(--text-secondary)' },
  navLogout: {
    background:'none', border:'none', color:'var(--text-muted)',
    fontSize:13, cursor:'pointer', fontFamily:'var(--font-body)',
  },

  // Projects drawer
  projectsDrawer: {
    background:'var(--bg-surface)', borderBottom:'1px solid var(--border)',
    padding:'16px 28px',
  },
  drawerHeader: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 },
  drawerTitle: { fontFamily:'var(--font-display)', fontSize:15, fontWeight:700 },
  drawerClose: {
    background:'none', border:'none', color:'var(--text-muted)',
    fontSize:18, cursor:'pointer',
  },
  drawerList: { display:'flex', gap:10, flexWrap:'wrap' },
  drawerItem: {
    display:'flex', alignItems:'center', gap:12,
    background:'var(--bg-card)', border:'1px solid var(--border)',
    borderRadius:'var(--r-md)', padding:'12px 16px',
    cursor:'pointer', textAlign:'left', maxWidth:340,
    fontFamily:'var(--font-body)', transition:'all 0.2s',
  },
  drawerItemDot: { width:8, height:8, borderRadius:'50%', background:'var(--amber)', flexShrink:0 },
  drawerItemText: { fontSize:13, color:'var(--text-primary)', lineHeight:1.4, marginBottom:3 },
  drawerItemDate: { fontSize:11, color:'var(--text-muted)' },
  drawerItemArrow: { color:'var(--text-muted)', marginLeft:'auto', flexShrink:0 },

  // Hero
  hero: {
    maxWidth:900, margin:'0 auto',
    padding:'60px 24px 20px',
    display:'grid', gridTemplateColumns:'1fr 1fr',
    gap:40, alignItems:'center',
    position:'relative',
  },
  scene3dWrap: {
    width:'100%', aspectRatio:'1',
    maxWidth:380, margin:'0 auto',
    filter:'drop-shadow(0 0 60px rgba(251,191,36,0.15))',
  },
  heroContent: { display:'flex', flexDirection:'column', gap:0 },
  heroH1: {
    fontFamily:'var(--font-display)',
    fontSize:'clamp(32px,4vw,52px)',
    fontWeight:900, lineHeight:1.15,
    marginBottom:20,
  },
  heroSub: {
    fontSize:17, color:'var(--text-secondary)',
    lineHeight:1.75, marginBottom:32,
  },
  statsRow: { display:'flex', gap:32 },
  statItem: {},
  statNum: {
    fontFamily:'var(--font-display)', fontSize:28, fontWeight:900,
    color:'var(--amber)', lineHeight:1,
  },
  statLabel: { fontSize:12, color:'var(--text-muted)', marginTop:4 },

  // Input section
  inputSection: { maxWidth:800, margin:'0 auto', padding:'0 24px 48px' },
  inputCard: {
    borderRadius:'var(--r-xl)', padding:'32px',
    border:'1px solid var(--border-bright)',
  },
  inputCardHeader: {
    display:'flex', justifyContent:'space-between',
    alignItems:'center', marginBottom:14,
  },
  inputCardTitle: {
    fontFamily:'var(--font-display)', fontSize:16, fontWeight:700,
    color:'var(--text-primary)',
  },
  inputCharCount: { fontSize:12, fontFamily:'var(--font-mono)' },
  textareaWrap: { position:'relative', marginBottom:16 },
  textarea: {
    width:'100%', background:'rgba(255,255,255,0.03)',
    border:'1px solid var(--border)',
    borderRadius:'var(--r-lg)', color:'var(--text-primary)',
    padding:'18px 20px', fontSize:15, outline:'none',
    resize:'none', lineHeight:1.7,
    fontFamily:'var(--font-body)', transition:'border-color 0.2s, box-shadow 0.2s',
    boxSizing:'border-box',
  },
  textareaDecor: {
    position:'absolute', top:12, right:14,
    fontSize:18, color:'var(--amber)', opacity:0.4, pointerEvents:'none',
  },
  errorBox: {
    background:'rgba(248,113,113,0.08)', border:'1px solid rgba(248,113,113,0.2)',
    borderRadius:'var(--r-sm)', color:'#fca5a5',
    padding:'10px 16px', fontSize:13, marginBottom:16,
    display:'flex', alignItems:'center', gap:8,
  },
  genBtn: {
    width:'100%',
    background:'linear-gradient(135deg,#fbbf24 0%,#f97316 50%,#ef4444 100%)',
    backgroundSize:'200% 200%',
    border:'none', borderRadius:'var(--r-lg)',
    color:'#05050a', padding:'18px',
    fontSize:17, fontWeight:900, cursor:'pointer',
    fontFamily:'var(--font-display)',
    boxShadow:'0 8px 40px rgba(251,191,36,0.4), 0 0 80px rgba(249,115,22,0.15)',
    transition:'all 0.3s',
    animation:'gradientShift 4s ease infinite',
    marginBottom:20,
  },
  btnSpinner: {
    width:20, height:20,
    border:'3px solid rgba(0,0,0,0.2)',
    borderTopColor:'#0a0a12', borderRadius:'50%',
    display:'inline-block', animation:'spin 0.7s linear infinite',
    flexShrink:0,
  },
  progressWrap: { marginBottom:20 },
  progressTrack: {
    height:3, background:'var(--border)',
    borderRadius:2, marginBottom:14, overflow:'hidden',
  },
  progressBar: {
    height:'100%',
    background:'linear-gradient(90deg,var(--amber),var(--rose),var(--violet))',
    borderRadius:2, transition:'width 1.8s ease',
  },
  progressSteps: { display:'flex', justifyContent:'space-between' },
  progressStep: { fontSize:18, transition:'all 0.3s' },
  examplesWrap: {},
  examplesLabel: { fontSize:12, color:'var(--text-muted)', display:'block', marginBottom:10 },
  examplesList: { display:'flex', gap:8, flexWrap:'wrap' },
  exampleChip: {
    background:'rgba(255,255,255,0.03)', border:'1px solid var(--border)',
    borderRadius:100, color:'var(--text-secondary)',
    padding:'7px 14px', fontSize:12, cursor:'pointer',
    fontFamily:'var(--font-body)', transition:'all 0.2s', maxWidth:260,
    textAlign:'left',
  },

  // Features
  features: { maxWidth:900, margin:'0 auto', padding:'0 24px 80px' },
  featureGrid: {
    display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(190px, 1fr))',
    gap:16, marginTop:20,
  },
  featureCard: {
    borderRadius:'var(--r-lg)', padding:'24px',
    display:'flex', flexDirection:'column', gap:0,
    background:'rgba(255,255,255,0.02)',
    border:'1px solid var(--border)',
    cursor:'default',
  },
  featureIconBg: {
    width:52, height:52, borderRadius:14,
    display:'flex', alignItems:'center', justifyContent:'center',
    marginBottom:16,
  },
  featureIcon: { fontSize:24 },
  featureTitle: { fontFamily:'var(--font-display)', fontSize:16, fontWeight:700, marginBottom:8 },
  featureDesc: { fontSize:13, color:'var(--text-secondary)', lineHeight:1.6 },
};
