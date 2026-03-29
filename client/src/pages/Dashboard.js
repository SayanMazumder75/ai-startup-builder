import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import ResultsPage from './ResultsPage';

const EXAMPLE_IDEAS = [
  'An AI-powered meal planner that creates personalized recipes based on dietary restrictions and fridge contents',
  'A marketplace connecting remote workers with local coworking spaces for flexible daily bookings',
  'Mental health app that uses voice analysis to detect stress levels and recommend micro-interventions',
  'SaaS platform for small restaurants to manage online orders, inventory, and staff scheduling',
  'Peer-to-peer tool sharing app for neighborhoods to rent out equipment they rarely use',
];

export default function Dashboard() {
  const { user, logout, token } = useAuth();
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [savedProjects, setSavedProjects] = useState([]);
  const [showProjects, setShowProjects] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('savedProjects');
    if (saved) setSavedProjects(JSON.parse(saved));
  }, []);

  const handleGenerate = async () => {
    if (!idea.trim() || idea.trim().length < 10) {
      setError('Please describe your startup idea (at least 10 characters)');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const data = await api.post('/generate', { idea: idea.trim() }, token);
      const project = {
        id: data.projectId,
        idea: data.idea,
        kit: data.kit,
        createdAt: data.generatedAt,
      };
      setResult(project);

      // Save to local storage
      const updated = [project, ...savedProjects.filter(p => p.id !== project.id)].slice(0, 10);
      setSavedProjects(updated);
      localStorage.setItem('savedProjects', JSON.stringify(updated));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return <ResultsPage project={result} onBack={() => setResult(null)} />;
  }

  return (
    <div style={s.root}>
      {/* Nav */}
      <nav style={s.nav}>
        <div style={s.navLogo}>
          <span style={{ fontSize: 20 }}>⚡</span>
          <span style={s.navBrand}>AI Startup Builder</span>
        </div>
        <div style={s.navRight}>
          <button onClick={() => setShowProjects(!showProjects)} style={s.navBtn}>
            📁 Projects ({savedProjects.length})
          </button>
          <div style={s.avatar}>{user?.name?.[0]?.toUpperCase() || 'U'}</div>
          <button onClick={logout} style={s.logoutBtn}>Sign out</button>
        </div>
      </nav>

      {/* Saved projects panel */}
      {showProjects && savedProjects.length > 0 && (
        <div style={s.projectsPanel}>
          <h3 style={s.projectsTitle}>Saved Projects</h3>
          <div style={s.projectsList}>
            {savedProjects.map(p => (
              <button key={p.id} style={s.projectItem} onClick={() => { setResult(p); setShowProjects(false); }}>
                <div style={s.projectIdea}>{p.idea}</div>
                <div style={s.projectDate}>{new Date(p.createdAt).toLocaleDateString()}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Hero */}
      <div style={s.hero}>
        <div style={s.orb1} />
        <div style={s.orb2} />

        <div style={s.badge}>✨ Powered by AI</div>

        <h1 style={s.h1}>
          Turn your idea into a<br />
          <span className="gradient-text">complete startup kit</span>
        </h1>

        <p style={s.tagline}>
          Generate landing page, business plan, branding & pitch deck<br />
          in under 60 seconds — powered by Claude.
        </p>

        {/* Input */}
        <div style={s.inputWrapper}>
          <textarea
            value={idea}
            onChange={e => { setIdea(e.target.value); setError(''); }}
            placeholder="Describe your startup idea... e.g. 'An app that helps remote teams stay connected through virtual water cooler moments and async video check-ins'"
            style={s.textarea}
            rows={4}
            onFocus={e => e.target.style.borderColor = '#fbbf24'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
            disabled={loading}
          />
          <div style={s.charCount}>{idea.length}/500</div>
        </div>

        {error && <div style={s.error}>⚠ {error}</div>}

        <button
          onClick={handleGenerate}
          disabled={loading || !idea.trim()}
          style={loading || !idea.trim() ? { ...s.generateBtn, opacity: 0.6, cursor: 'not-allowed' } : s.generateBtn}
        >
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
              <span style={s.spinner} />
              Generating your startup kit...
            </span>
          ) : (
            '🚀 Generate Startup Kit'
          )}
        </button>

        {loading && (
          <div style={s.loadingSteps}>
            {['Analyzing your idea...', 'Building business plan...', 'Designing branding...', 'Creating pitch deck...'].map((step, i) => (
              <div key={i} style={{ ...s.step, animationDelay: `${i * 0.8}s` }}>
                <span style={s.stepDot} /> {step}
              </div>
            ))}
          </div>
        )}

        {/* Example ideas */}
        {!loading && (
          <div style={s.examples}>
            <p style={s.examplesLabel}>💡 Try an example:</p>
            <div style={s.examplesList}>
              {EXAMPLE_IDEAS.slice(0, 3).map((ex, i) => (
                <button key={i} style={s.exampleChip} onClick={() => setIdea(ex)}>
                  {ex.slice(0, 60)}...
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Features grid */}
      {!loading && (
        <div style={s.features}>
          {[
            { icon: '🌐', label: 'Landing Page', desc: 'Hero, features, pricing & testimonials' },
            { icon: '📋', label: 'Business Plan', desc: 'Problem, solution, market & revenue model' },
            { icon: '🎨', label: 'Brand Identity', desc: 'Name, colors, logo concept & voice' },
            { icon: '📊', label: 'Pitch Deck', desc: '10 investor-ready slides with speaker notes' },
          ].map((f, i) => (
            <div key={i} style={s.featureCard}>
              <span style={s.featureIcon}>{f.icon}</span>
              <strong style={s.featureLabel}>{f.label}</strong>
              <span style={s.featureDesc}>{f.desc}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const s = {
  root: { minHeight: '100vh', background: 'var(--bg-void)', position: 'relative' },
  nav: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '16px 32px',
    background: 'rgba(10,10,18,0.8)', backdropFilter: 'blur(20px)',
    borderBottom: '1px solid var(--border)',
    position: 'sticky', top: 0, zIndex: 100,
  },
  navLogo: { display: 'flex', alignItems: 'center', gap: 10 },
  navBrand: { fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700 },
  navRight: { display: 'flex', alignItems: 'center', gap: 12 },
  navBtn: {
    background: 'var(--bg-surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)',
    padding: '8px 14px', fontSize: 13, cursor: 'pointer',
    fontFamily: 'var(--font-body)',
  },
  avatar: {
    width: 34, height: 34, borderRadius: '50%',
    background: 'linear-gradient(135deg, #fbbf24, #f97316)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 700, fontSize: 14, color: '#0a0a12',
  },
  logoutBtn: {
    background: 'none', border: 'none', color: 'var(--text-muted)',
    fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-body)',
  },
  projectsPanel: {
    background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)',
    padding: '20px 32px',
  },
  projectsTitle: {
    fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 12,
  },
  projectsList: { display: 'flex', gap: 12, flexWrap: 'wrap' },
  projectItem: {
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)', padding: '12px 16px',
    cursor: 'pointer', textAlign: 'left', maxWidth: 280,
    fontFamily: 'var(--font-body)',
  },
  projectIdea: { fontSize: 13, color: 'var(--text-primary)', marginBottom: 4, lineClamp: 2 },
  projectDate: { fontSize: 11, color: 'var(--text-muted)' },
  hero: {
    maxWidth: 760, margin: '0 auto',
    padding: '80px 24px 60px',
    textAlign: 'center', position: 'relative',
    overflow: 'hidden',
  },
  orb1: {
    position: 'absolute', top: -100, right: -100,
    width: 500, height: 500, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(251,191,36,0.07) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  orb2: {
    position: 'absolute', bottom: -100, left: -100,
    width: 400, height: 400, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  badge: {
    display: 'inline-block',
    background: 'var(--amber-dim)',
    border: '1px solid var(--amber)',
    color: 'var(--amber)',
    borderRadius: 100, padding: '6px 16px',
    fontSize: 13, fontWeight: 600,
    marginBottom: 32, letterSpacing: 0.5,
  },
  h1: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(36px, 6vw, 60px)',
    fontWeight: 800, lineHeight: 1.15,
    marginBottom: 20, color: 'var(--text-primary)',
  },
  tagline: {
    fontSize: 18, color: 'var(--text-secondary)',
    lineHeight: 1.7, marginBottom: 48,
  },
  inputWrapper: { position: 'relative', marginBottom: 8 },
  textarea: {
    width: '100%', background: 'var(--bg-card)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 'var(--radius-lg)',
    color: 'var(--text-primary)',
    padding: '20px 24px',
    fontSize: 16, outline: 'none',
    resize: 'none', transition: 'border-color 0.2s',
    fontFamily: 'var(--font-body)', lineHeight: 1.6,
    boxSizing: 'border-box',
  },
  charCount: {
    textAlign: 'right', fontSize: 12, color: 'var(--text-muted)',
    marginTop: 4, marginBottom: 4,
  },
  error: {
    background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)',
    borderRadius: 'var(--radius-sm)', color: '#f87171',
    padding: '10px 16px', fontSize: 14, marginBottom: 16,
  },
  generateBtn: {
    width: '100%',
    background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)',
    color: '#0a0a12', border: 'none',
    borderRadius: 'var(--radius-lg)',
    padding: '18px', fontSize: 18,
    fontWeight: 800, cursor: 'pointer',
    fontFamily: 'var(--font-display)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 8px 32px rgba(251,191,36,0.3)',
    marginBottom: 24,
  },
  spinner: {
    width: 20, height: 20,
    border: '3px solid rgba(0,0,0,0.2)',
    borderTopColor: '#0a0a12', borderRadius: '50%',
    display: 'inline-block', animation: 'spin 0.7s linear infinite',
  },
  loadingSteps: {
    display: 'flex', flexDirection: 'column', gap: 12,
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: 32,
  },
  step: {
    display: 'flex', alignItems: 'center', gap: 12,
    color: 'var(--text-secondary)', fontSize: 14,
    animation: 'fadeIn 0.5s ease both',
  },
  stepDot: {
    width: 8, height: 8, borderRadius: '50%',
    background: 'var(--amber)', display: 'inline-block',
    animation: 'pulse-glow 1.5s ease-in-out infinite',
  },
  examples: { marginTop: 8 },
  examplesLabel: { fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 },
  examplesList: { display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' },
  exampleChip: {
    background: 'var(--bg-surface)', border: '1px solid var(--border)',
    borderRadius: 100, color: 'var(--text-secondary)',
    padding: '8px 16px', fontSize: 13, cursor: 'pointer',
    fontFamily: 'var(--font-body)', textAlign: 'left',
    transition: 'border-color 0.2s, color 0.2s',
    maxWidth: 280,
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 16, maxWidth: 900, margin: '0 auto 80px', padding: '0 24px',
  },
  featureCard: {
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)', padding: '24px',
    display: 'flex', flexDirection: 'column', gap: 8,
    animation: 'fadeIn 0.5s ease both',
  },
  featureIcon: { fontSize: 28 },
  featureLabel: { fontFamily: 'var(--font-display)', fontSize: 15, color: 'var(--text-primary)' },
  featureDesc: { fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 },
};
