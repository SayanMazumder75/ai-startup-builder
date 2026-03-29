import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        await signup(form.email, form.password, form.name);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => setForm({ name: '', email: 'demo@startup.ai', password: 'demo1234' });

  return (
    <div style={styles.root}>
      {/* Background orbs */}
      <div style={styles.orb1} />
      <div style={styles.orb2} />

      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logo}>
          <span style={styles.logoIcon}>⚡</span>
          <span style={styles.logoText}>AI Startup Builder</span>
        </div>

        <h1 style={styles.title}>
          {mode === 'login' ? 'Welcome back' : 'Start building'}
        </h1>
        <p style={styles.subtitle}>
          {mode === 'login'
            ? 'Sign in to access your startup kits'
            : 'Create your account to get started'}
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          {mode === 'signup' && (
            <div style={styles.field}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                placeholder="Jane Smith"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                required
                style={styles.input}
                onFocus={e => e.target.style.borderColor = '#fbbf24'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </div>
          )}

          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              required
              style={styles.input}
              onFocus={e => e.target.style.borderColor = '#fbbf24'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder={mode === 'signup' ? 'Min. 6 characters' : '••••••••'}
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              required
              style={styles.input}
              onFocus={e => e.target.style.borderColor = '#fbbf24'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
            />
          </div>

          {error && <div style={styles.error}>⚠ {error}</div>}

          <button type="submit" disabled={loading} style={loading ? { ...styles.btn, opacity: 0.7 } : styles.btn}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                <span style={styles.spinner} />
                {mode === 'login' ? 'Signing in...' : 'Creating account...'}
              </span>
            ) : (
              mode === 'login' ? 'Sign In →' : 'Create Account →'
            )}
          </button>
        </form>

        {/* Demo login */}
        {mode === 'login' && (
          <button onClick={fillDemo} style={styles.demoBtn}>
            🎯 Use demo credentials
          </button>
        )}

        <div style={styles.toggle}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
            style={styles.toggleLink}
          >
            {mode === 'login' ? 'Sign up free' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  root: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg-void)',
    padding: '24px',
    position: 'relative',
    overflow: 'hidden',
  },
  orb1: {
    position: 'absolute', top: '-10%', right: '-5%',
    width: 500, height: 500, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(251,191,36,0.08) 0%, transparent 70%)',
    animation: 'orb-float 8s ease-in-out infinite',
    pointerEvents: 'none',
  },
  orb2: {
    position: 'absolute', bottom: '-10%', left: '-5%',
    width: 400, height: 400, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
    animation: 'orb-float 10s ease-in-out infinite reverse',
    pointerEvents: 'none',
  },
  card: {
    width: '100%',
    maxWidth: 440,
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-xl)',
    padding: '48px 40px',
    boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
    position: 'relative',
    zIndex: 1,
    animation: 'fadeIn 0.4s ease',
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: 10,
    marginBottom: 32, justifyContent: 'center',
  },
  logoIcon: { fontSize: 28 },
  logoText: {
    fontFamily: 'var(--font-display)',
    fontSize: 18, fontWeight: 700,
    color: 'var(--text-primary)',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: 28, fontWeight: 700,
    color: 'var(--text-primary)',
    textAlign: 'center', marginBottom: 8,
  },
  subtitle: {
    color: 'var(--text-secondary)', textAlign: 'center',
    fontSize: 14, marginBottom: 32,
  },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' },
  input: {
    background: 'var(--bg-surface)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-primary)',
    padding: '12px 16px',
    fontSize: 15,
    outline: 'none',
    transition: 'border-color 0.2s',
    fontFamily: 'var(--font-body)',
  },
  error: {
    background: 'rgba(248,113,113,0.1)',
    border: '1px solid rgba(248,113,113,0.3)',
    borderRadius: 'var(--radius-sm)',
    color: '#f87171', padding: '10px 14px',
    fontSize: 13,
  },
  btn: {
    background: 'linear-gradient(135deg, #fbbf24, #f97316)',
    color: '#0a0a12', border: 'none',
    borderRadius: 'var(--radius-md)',
    padding: '14px', fontSize: 15,
    fontWeight: 700, cursor: 'pointer',
    fontFamily: 'var(--font-display)',
    transition: 'opacity 0.2s, transform 0.2s',
    marginTop: 4,
  },
  spinner: {
    width: 16, height: 16,
    border: '2px solid rgba(0,0,0,0.3)',
    borderTopColor: '#0a0a12',
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'spin 0.7s linear infinite',
  },
  demoBtn: {
    width: '100%',
    background: 'var(--bg-surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-secondary)',
    padding: '11px', fontSize: 13,
    cursor: 'pointer', marginTop: 12,
    fontFamily: 'var(--font-body)',
    transition: 'color 0.2s, border-color 0.2s',
  },
  toggle: {
    textAlign: 'center', marginTop: 24,
    fontSize: 14, color: 'var(--text-muted)',
  },
  toggleLink: {
    background: 'none', border: 'none',
    color: 'var(--amber)', cursor: 'pointer',
    fontSize: 14, fontWeight: 600,
    fontFamily: 'var(--font-body)',
  },
};
