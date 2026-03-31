import React, { useState } from 'react';
import { exportToPDF, copyToClipboard } from '../utils/export';
import LandingPageTab from '../components/LandingPageTab';
import BusinessPlanTab from '../components/BusinessPlanTab';
import BrandingTab from '../components/BrandingTab';
import PitchDeckTab from '../components/PitchDeckTab';

const TABS = [
  { id:'landing',  icon:'🌐', label:'Landing Page',  desc:'Preview & code' },
  { id:'business', icon:'📋', label:'Business Plan',  desc:'Strategy & model' },
  { id:'branding', icon:'🎨', label:'Branding',       desc:'Colors & identity' },
  { id:'pitch',    icon:'📊', label:'Pitch Deck',     desc:'10 slides' },
];

export default function ResultsPage({ project, onBack }) {
  const [activeTab, setActiveTab] = useState('landing');
  const [copied, setCopied] = useState(false);
  const { kit, idea } = project;

  const handleCopy = async () => {
    await copyToClipboard(JSON.stringify(kit, null, 2));
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const primaryName = kit.branding?.nameOptions?.[0]?.name || 'Startup';
  const tagline = kit.branding?.tagline || '';
  const primaryColor = kit.branding?.colorPalette?.primary?.hex || '#fbbf24';

  return (
    <div style={s.root}>
      {/* ── Top Bar ─────────────────────────────────────────────────── */}
      <div style={s.topbar}>
        <button onClick={onBack} style={s.backBtn}>
          <span style={s.backArrow}>←</span>
          <span>Back</span>
        </button>

        <div style={s.ideaPreview}>
          <span style={s.ideaChip}>💡</span>
          <span style={s.ideaText}>{idea.slice(0,90)}{idea.length>90?'…':''}</span>
        </div>

        <div style={s.actionGroup}>
          <button onClick={handleCopy} style={s.actionBtn}>
            {copied ? '✅ Copied!' : '📋 Copy JSON'}
          </button>
          <button onClick={() => exportToPDF(kit, idea)} style={s.exportBtn}>
            ⬇ Export PDF
          </button>
        </div>
      </div>

      {/* ── Brand Banner ─────────────────────────────────────────────── */}
      <div style={{ ...s.brandBanner, borderBottomColor: `${primaryColor}30` }}>
        <div style={{ ...s.brandColorDot, background: primaryColor, boxShadow:`0 0 16px ${primaryColor}60` }} />
        <div style={s.brandNameWrap}>
          <span style={{ ...s.brandName, color: primaryColor }}>{primaryName}</span>
          <span style={s.brandTagline}>"{tagline}"</span>
        </div>
        <div style={s.brandPalette}>
          {Object.values(kit.branding?.colorPalette || {}).slice(0,5).map((c, i) => (
            <div key={i} title={c.hex} style={{ ...s.brandSwatch, background: c.hex }} />
          ))}
        </div>
        <div className="badge badge-green" style={{ marginLeft:'auto' }}>
          ✅ Kit Generated
        </div>
      </div>

      {/* ── Tabs ─────────────────────────────────────────────────────── */}
      <div style={s.tabsBar}>
        <div style={s.tabsInner}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={activeTab===tab.id ? {...s.tabBtn,...s.tabBtnActive} : s.tabBtn}>
              <span style={s.tabIcon}>{tab.icon}</span>
              <div style={s.tabLabels}>
                <span style={s.tabLabel}>{tab.label}</span>
                <span style={s.tabDesc}>{tab.desc}</span>
              </div>
              {activeTab===tab.id && <div style={s.tabActivePill} />}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────────── */}
      <div style={s.content} className="animate-fadeInUp">
        {activeTab==='landing'  && <LandingPageTab  data={kit.landingPage}  branding={kit.branding} />}
        {activeTab==='business' && <BusinessPlanTab  data={kit.businessPlan} />}
        {activeTab==='branding' && <BrandingTab      data={kit.branding} />}
        {activeTab==='pitch'    && <PitchDeckTab     data={kit.pitchDeck} branding={kit.branding} />}
      </div>
    </div>
  );
}

const s = {
  root: { minHeight:'100vh', background:'var(--bg-void)' },
  topbar: {
    display:'flex', alignItems:'center', gap:16, padding:'12px 24px',
    background:'rgba(6,6,15,0.92)', backdropFilter:'blur(24px)',
    borderBottom:'1px solid var(--border)',
    position:'sticky', top:0, zIndex:100, flexWrap:'wrap',
  },
  backBtn: {
    display:'flex', alignItems:'center', gap:8,
    background:'rgba(255,255,255,0.04)', border:'1px solid var(--border)',
    borderRadius:'var(--r-md)', color:'var(--text-secondary)',
    padding:'8px 14px', fontSize:14, cursor:'pointer',
    fontFamily:'var(--font-body)', transition:'all 0.2s', flexShrink:0,
  },
  backArrow: { fontSize:16 },
  ideaPreview: {
    flex:1, display:'flex', alignItems:'center', gap:10, minWidth:0,
  },
  ideaChip: {
    background:'var(--amber-dim)', borderRadius:8,
    width:28, height:28, display:'flex', alignItems:'center', justifyContent:'center',
    fontSize:14, flexShrink:0,
  },
  ideaText: {
    fontSize:13, color:'var(--text-secondary)',
    overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
  },
  actionGroup: { display:'flex', gap:10, flexShrink:0 },
  actionBtn: {
    background:'rgba(255,255,255,0.04)', border:'1px solid var(--border)',
    borderRadius:'var(--r-md)', color:'var(--text-secondary)',
    padding:'8px 14px', fontSize:13, cursor:'pointer',
    fontFamily:'var(--font-body)',
  },
  exportBtn: {
    background:'linear-gradient(135deg,#fbbf24,#f97316)',
    border:'none', borderRadius:'var(--r-md)',
    color:'#05050a', padding:'8px 16px',
    fontSize:13, fontWeight:800, cursor:'pointer',
    fontFamily:'var(--font-display)',
    boxShadow:'0 4px 16px rgba(251,191,36,0.3)',
  },
  brandBanner: {
    display:'flex', alignItems:'center', gap:16, padding:'14px 24px',
    background:'rgba(251,191,36,0.03)',
    borderBottom:'1px solid',
    flexWrap:'wrap',
  },
  brandColorDot: { width:12, height:12, borderRadius:'50%', flexShrink:0 },
  brandNameWrap: { display:'flex', alignItems:'center', gap:14 },
  brandName: { fontFamily:'var(--font-display)', fontSize:22, fontWeight:900 },
  brandTagline: { fontSize:14, color:'var(--text-secondary)', fontStyle:'italic' },
  brandPalette: { display:'flex', gap:6 },
  brandSwatch: { width:20, height:20, borderRadius:5, border:'1px solid rgba(255,255,255,0.1)' },
  tabsBar: {
    background:'var(--bg-base)', borderBottom:'1px solid var(--border)',
    overflowX:'auto',
  },
  tabsInner: {
    display:'flex', maxWidth:1100, margin:'0 auto', padding:'0 20px',
  },
  tabBtn: {
    display:'flex', alignItems:'center', gap:10,
    padding:'14px 20px', background:'none', border:'none',
    borderBottom:'2px solid transparent',
    color:'var(--text-muted)', cursor:'pointer',
    transition:'all 0.2s', whiteSpace:'nowrap',
    fontFamily:'var(--font-body)', position:'relative',
  },
  tabBtnActive: { color:'var(--amber)', borderBottomColor:'var(--amber)' },
  tabIcon: { fontSize:18 },
  tabLabels: { display:'flex', flexDirection:'column', gap:1 },
  tabLabel: { fontSize:14, fontWeight:600 },
  tabDesc: { fontSize:11, opacity:0.6 },
  tabActivePill: {
    position:'absolute', bottom:-1, left:'50%', transform:'translateX(-50%)',
    width:32, height:2,
    background:'linear-gradient(90deg,var(--amber),var(--rose))',
    borderRadius:1,
  },
  content: { maxWidth:1100, margin:'0 auto', padding:'32px 24px 80px' },
};
