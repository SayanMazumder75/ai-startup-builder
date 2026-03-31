import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { HelixLoader } from '../components/Scene3D';

// Particle canvas background
function ParticleBackground() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.4 + 0.1,
      color: Math.random() > 0.5 ? [251,191,36] : [139,92,246],
    }));

    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color[0]},${p.color[1]},${p.color[2]},${p.alpha})`;
        ctx.fill();
      });
      // Connect nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const d = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(251,191,36,${0.08 * (1 - d/100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    const onResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', onResize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position:'fixed',inset:0,pointerEvents:'none',zIndex:0 }} />;
}

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name:'', email:'', password:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');
  const { login, signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      if (mode === 'login') await login(form.email, form.password);
      else await signup(form.email, form.password, form.name);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={s.root}>
      <ParticleBackground />

      {/* Background mesh gradients */}
      <div style={s.gradientMesh1} />
      <div style={s.gradientMesh2} />

      <div style={s.layout}>
        {/* Left panel */}
        <div style={s.leftPanel}>
          <div style={s.logo}>
            <div style={s.logoIcon}>⚡</div>
            <span style={s.logoText}>AI Startup Builder</span>
          </div>
          <div style={s.helixWrap}>
            <HelixLoader size={160} />
          </div>
          <h2 style={s.leftHeading}>
            Launch your startup<br />
            <span className="gradient-text">10× faster</span>
          </h2>
          <p style={s.leftSub}>
            AI-generated landing pages, business plans, branding & pitch decks — in under 60 seconds.
          </p>
          <div style={s.statsRow}>
            {[['2,400+','Kits Generated'],['60s','Avg. Generation'],['100%','Free to Start']].map(([n,l])=>(
              <div key={l} style={s.stat}>
                <div style={s.statNum}>{n}</div>
                <div style={s.statLabel}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Auth card */}
        <div style={s.cardWrap}>
          <div style={s.card} className="glass-card">
            {/* Tab switcher */}
            <div style={s.tabs}>
              {['login','signup'].map(m => (
                <button key={m} onClick={() => { setMode(m); setError(''); }}
                  style={mode===m ? {...s.tab,...s.tabActive} : s.tab}>
                  {m==='login' ? 'Sign In' : 'Sign Up'}
                </button>
              ))}
            </div>

            <h1 style={s.cardTitle}>
              {mode==='login' ? 'Welcome back 👋' : 'Create account 🚀'}
            </h1>

            <form onSubmit={handleSubmit} style={s.form}>
              {mode==='signup' && (
                <Field label="Full Name" icon="👤" value={form.name} type="text"
                  placeholder="Jane Smith"
                  focused={focused==='name'} onFocus={() => setFocused('name')} onBlur={() => setFocused('')}
                  onChange={v => setForm(p => ({...p,name:v}))} />
              )}
              <Field label="Email" icon="✉️" value={form.email} type="email"
                placeholder="you@example.com"
                focused={focused==='email'} onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
                onChange={v => setForm(p => ({...p,email:v}))} />
              <Field label="Password" icon="🔒" value={form.password} type="password"
                placeholder={mode==='signup' ? 'Min. 6 characters' : '••••••••'}
                focused={focused==='password'} onFocus={() => setFocused('password')} onBlur={() => setFocused('')}
                onChange={v => setForm(p => ({...p,password:v}))} />

              {error && (
                <div style={s.errorBox} className="animate-fadeInUp">
                  <span style={s.errorIcon}>⚠</span>
                  <span>{error}</span>
                </div>
              )}

              <button type="submit" disabled={loading}
                style={loading ? {...s.submitBtn, opacity:0.75, cursor:'not-allowed'} : s.submitBtn}>
                {loading ? (
                  <span style={{display:'flex',alignItems:'center',gap:10,justifyContent:'center'}}>
                    <span style={s.btnSpinner} />
                    {mode==='login' ? 'Signing in...' : 'Creating account...'}
                  </span>
                ) : (
                  <span>{mode==='login' ? 'Sign In' : 'Create Account'} →</span>
                )}
              </button>
            </form>

            {mode==='login' && (
              <button onClick={() => setForm({name:'',email:'demo@startup.ai',password:'demo1234'})}
                style={s.demoBtn}>
                🎯 Try demo account
              </button>
            )}

            <p style={s.switchText}>
              {mode==='login' ? "Don't have an account? " : 'Already have an account? '}
              <button onClick={() => { setMode(mode==='login'?'signup':'login'); setError(''); }}
                style={s.switchLink}>
                {mode==='login' ? 'Sign up free' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, icon, value, type, placeholder, focused, onFocus, onBlur, onChange }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
      <label style={{ fontSize:12, fontWeight:600, color:'var(--text-secondary)', letterSpacing:0.5 }}>
        {label}
      </label>
      <div style={{
        display:'flex', alignItems:'center', gap:10,
        background:'rgba(255,255,255,0.04)',
        border:`1px solid ${focused ? 'var(--amber)' : 'var(--border-bright)'}`,
        borderRadius:'var(--r-md)', padding:'12px 16px',
        transition:'border-color 0.2s, box-shadow 0.2s',
        boxShadow: focused ? '0 0 0 3px rgba(251,191,36,0.12)' : 'none',
      }}>
        <span style={{ fontSize:16 }}>{icon}</span>
        <input type={type} value={value} placeholder={placeholder} required
          onFocus={onFocus} onBlur={onBlur}
          onChange={e => onChange(e.target.value)}
          style={{
            flex:1, background:'none', border:'none', outline:'none',
            color:'var(--text-primary)', fontSize:15,
            fontFamily:'var(--font-body)',
          }} />
      </div>
    </div>
  );
}

const s = {
  root: {
    minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
    background:'var(--bg-void)', position:'relative', overflow:'hidden', padding:24,
  },
  gradientMesh1: {
    position:'fixed', top:'-20%', right:'-10%',
    width:700, height:700, borderRadius:'50%',
    background:'radial-gradient(circle, rgba(251,191,36,0.07) 0%, transparent 70%)',
    pointerEvents:'none', zIndex:0,
    animation:'orbFloat 12s ease-in-out infinite',
  },
  gradientMesh2: {
    position:'fixed', bottom:'-20%', left:'-10%',
    width:600, height:600, borderRadius:'50%',
    background:'radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)',
    pointerEvents:'none', zIndex:0,
    animation:'orbFloat 15s ease-in-out infinite reverse',
  },
  layout: {
    position:'relative', zIndex:1, display:'flex',
    gap:60, alignItems:'center', maxWidth:960, width:'100%',
  },
  leftPanel: {
    flex:1, display:'flex', flexDirection:'column', gap:24,
    minWidth:0,
  },
  logo: { display:'flex', alignItems:'center', gap:10 },
  logoIcon: {
    width:40, height:40, borderRadius:12,
    background:'linear-gradient(135deg,#fbbf24,#f97316)',
    display:'flex', alignItems:'center', justifyContent:'center',
    fontSize:20, fontWeight:900,
    boxShadow:'0 4px 16px rgba(251,191,36,0.4)',
  },
  logoText: { fontFamily:'var(--font-display)', fontSize:18, fontWeight:800 },
  helixWrap: { display:'flex', justifyContent:'center', padding:'16px 0' },
  leftHeading: {
    fontFamily:'var(--font-display)', fontSize:'clamp(28px,3vw,42px)',
    fontWeight:800, lineHeight:1.2,
  },
  leftSub: { fontSize:15, color:'var(--text-secondary)', lineHeight:1.7, maxWidth:360 },
  statsRow: { display:'flex', gap:24, flexWrap:'wrap' },
  stat: {},
  statNum: { fontFamily:'var(--font-display)', fontSize:24, fontWeight:800, color:'var(--amber)' },
  statLabel: { fontSize:12, color:'var(--text-muted)', marginTop:2 },

  cardWrap: { width:420, flexShrink:0 },
  card: {
    borderRadius:'var(--r-xl)', padding:'40px 36px',
    position:'relative', overflow:'hidden',
  },
  tabs: {
    display:'flex', background:'rgba(255,255,255,0.04)',
    borderRadius:'var(--r-md)', padding:4, marginBottom:28,
  },
  tab: {
    flex:1, padding:'10px', border:'none', borderRadius:10,
    background:'none', color:'var(--text-secondary)',
    fontSize:14, fontWeight:600, cursor:'pointer',
    transition:'all 0.2s', fontFamily:'var(--font-display)',
  },
  tabActive: {
    background:'linear-gradient(135deg,rgba(251,191,36,0.2),rgba(249,115,22,0.2))',
    color:'var(--amber)', boxShadow:'0 2px 8px rgba(0,0,0,0.3)',
  },
  cardTitle: {
    fontFamily:'var(--font-display)', fontSize:26, fontWeight:800,
    marginBottom:28, color:'var(--text-primary)',
  },
  form: { display:'flex', flexDirection:'column', gap:18 },
  errorBox: {
    display:'flex', alignItems:'center', gap:10,
    background:'rgba(248,113,113,0.08)', border:'1px solid rgba(248,113,113,0.25)',
    borderRadius:'var(--r-sm)', padding:'12px 16px',
    color:'#fca5a5', fontSize:13,
  },
  errorIcon: { fontSize:16 },
  submitBtn: {
    background:'linear-gradient(135deg,#fbbf24 0%,#f97316 100%)',
    border:'none', borderRadius:'var(--r-md)', color:'#0a0a12',
    padding:'15px', fontSize:16, fontWeight:800, cursor:'pointer',
    fontFamily:'var(--font-display)', marginTop:4,
    boxShadow:'0 8px 32px rgba(251,191,36,0.35)',
    transition:'transform 0.2s, box-shadow 0.2s',
  },
  btnSpinner: {
    width:18, height:18, border:'2.5px solid rgba(0,0,0,0.2)',
    borderTopColor:'#0a0a12', borderRadius:'50%',
    display:'inline-block', animation:'spin 0.7s linear infinite',
  },
  demoBtn: {
    width:'100%', background:'rgba(255,255,255,0.04)',
    border:'1px solid var(--border-bright)',
    borderRadius:'var(--r-md)', color:'var(--text-secondary)',
    padding:'12px', fontSize:13, cursor:'pointer',
    fontFamily:'var(--font-body)', marginTop:12,
    transition:'all 0.2s',
  },
  switchText: { textAlign:'center', marginTop:20, fontSize:14, color:'var(--text-muted)' },
  switchLink: {
    background:'none', border:'none', color:'var(--amber)',
    cursor:'pointer', fontSize:14, fontWeight:700,
    fontFamily:'var(--font-body)',
  },
};
