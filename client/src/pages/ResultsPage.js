import React, { useState } from 'react';
import { exportToPDF, copyToClipboard } from '../utils/export';
import LandingPageTab from '../components/LandingPageTab';
import BusinessPlanTab from '../components/BusinessPlanTab';
import BrandingTab from '../components/BrandingTab';
import PitchDeckTab from '../components/PitchDeckTab';

const TABS = [
  { id: 'landing',   label: '🌐 Landing Page',  short: 'Landing'  },
  { id: 'business',  label: '📋 Business Plan',  short: 'Business' },
  { id: 'branding',  label: '🎨 Branding',       short: 'Branding' },
  { id: 'pitch',     label: '📊 Pitch Deck',     short: 'Pitch'    },
];

export default function ResultsPage({ project, onBack }) {
  const [activeTab, setActiveTab] = useState('landing');
  const [copied, setCopied] = useState(false);

  const { kit, idea } = project;

  const handleCopy = async () => {
    const text = JSON.stringify(kit, null, 2);
    await copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => exportToPDF(kit, idea);

  return (
    <div style={s.root}>
      {/* Top bar */}
      <div style={s.topbar}>
        <button onClick={onBack} style={s.backBtn}>← Back</button>
        <div style={s.ideaPreview}>
          <span style={s.ideaLabel}>Startup idea:</span>
          <span style={s.ideaText}>{idea.slice(0, 80)}{idea.length > 80 ? '...' : ''}</span>
        </div>
        <div style={s.actions}>
          <button onClick={handleCopy} style={s.actionBtn}>
            {copied ? '✅ Copied!' : '📋 Copy JSON'}
          </button>
          <button onClick={handleExport} style={s.actionBtnPrimary}>
            ⬇ Export PDF
          </button>
        </div>
      </div>

      {/* Name badge */}
      {kit.branding?.nameOptions?.[0] && (
        <div style={s.nameBanner}>
          <span style={s.nameLabel}>Suggested name:</span>
          <span style={s.nameValue}>{kit.branding.nameOptions[0].name}</span>
          <span style={s.nameTagline}>&ldquo;{kit.branding.tagline}&rdquo;</span>
        </div>
      )}

      {/* Tabs */}
      <div style={s.tabsWrapper}>
        <div style={s.tabs}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={activeTab === tab.id ? { ...s.tab, ...s.tabActive } : s.tab}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={s.content}>
        {activeTab === 'landing'  && <LandingPageTab  data={kit.landingPage}  branding={kit.branding} />}
        {activeTab === 'business' && <BusinessPlanTab  data={kit.businessPlan} />}
        {activeTab === 'branding' && <BrandingTab      data={kit.branding}    />}
        {activeTab === 'pitch'    && <PitchDeckTab     data={kit.pitchDeck}   branding={kit.branding} />}
      </div>
    </div>
  );
}

const s = {
  root: { minHeight: '100vh', background: 'var(--bg-void)' },
  topbar: {
    display: 'flex', alignItems: 'center', gap: 16,
    padding: '14px 24px',
    background: 'rgba(10,10,18,0.9)', backdropFilter: 'blur(20px)',
    borderBottom: '1px solid var(--border)',
    position: 'sticky', top: 0, zIndex: 100,
    flexWrap: 'wrap',
  },
  backBtn: {
    background: 'var(--bg-surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)',
    padding: '8px 14px', fontSize: 14, cursor: 'pointer',
    fontFamily: 'var(--font-body)', whiteSpace: 'nowrap',
  },
  ideaPreview: {
    flex: 1, display: 'flex', alignItems: 'center', gap: 8,
    minWidth: 0, overflow: 'hidden',
  },
  ideaLabel: { fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' },
  ideaText: { fontSize: 13, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  actions: { display: 'flex', gap: 10, flexShrink: 0 },
  actionBtn: {
    background: 'var(--bg-surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)',
    padding: '8px 14px', fontSize: 13, cursor: 'pointer',
    fontFamily: 'var(--font-body)',
  },
  actionBtnPrimary: {
    background: 'linear-gradient(135deg, #fbbf24, #f97316)',
    border: 'none', borderRadius: 'var(--radius-md)',
    color: '#0a0a12', padding: '8px 16px',
    fontSize: 13, fontWeight: 700, cursor: 'pointer',
    fontFamily: 'var(--font-display)',
  },
  nameBanner: {
    display: 'flex', alignItems: 'center', gap: 16,
    padding: '16px 24px',
    background: 'var(--amber-glow)',
    borderBottom: '1px solid var(--border-glow)',
    flexWrap: 'wrap',
  },
  nameLabel: { fontSize: 12, color: 'var(--amber)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 },
  nameValue: { fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: 'var(--amber-light)' },
  nameTagline: { fontSize: 14, color: 'var(--text-secondary)', fontStyle: 'italic' },
  tabsWrapper: {
    borderBottom: '1px solid var(--border)',
    background: 'var(--bg-base)',
    overflowX: 'auto',
  },
  tabs: {
    display: 'flex', maxWidth: 1100, margin: '0 auto',
    padding: '0 24px',
  },
  tab: {
    padding: '14px 20px', fontSize: 14, fontWeight: 500,
    background: 'none', border: 'none',
    borderBottom: '2px solid transparent',
    color: 'var(--text-muted)', cursor: 'pointer',
    whiteSpace: 'nowrap', transition: 'color 0.2s',
    fontFamily: 'var(--font-body)',
  },
  tabActive: {
    color: 'var(--amber)',
    borderBottomColor: 'var(--amber)',
  },
  content: { maxWidth: 1100, margin: '0 auto', padding: '32px 24px 80px' },
};
