import React, { useState, useRef, useEffect } from 'react';

// ── Animated number ───────────────────────────────────────────────────────────
function AnimNum({ val }) {
  const [v, setV] = useState('');
  const ref = useRef(null);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      let i = 0; const s = val.replace(/[^0-9.]/g,''), n = parseFloat(s);
      if (isNaN(n)) { setV(val); return; }
      const prefix = val.match(/^[^0-9]*/)?.[0]||'', suffix = val.slice((prefix+s).length);
      const step = n/40;
      const t = setInterval(() => {
        i = Math.min(i+step, n);
        setV(prefix + (Number.isInteger(n) ? Math.round(i) : i.toFixed(1)) + suffix);
        if (i>=n) clearInterval(t);
      }, 30);
    }, { threshold:0.3 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [val]);
  return <span ref={ref}>{v || val}</span>;
}

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({ icon, title, accent, badge, children }) {
  return (
    <div style={{
      background:'rgba(255,255,255,0.015)',
      border:'1px solid rgba(255,255,255,0.07)',
      borderRadius:24, overflow:'hidden',
      transition:'border-color 0.3s',
    }}>
      <div style={{
        display:'flex', alignItems:'center', gap:12,
        padding:'18px 28px', borderBottom:'1px solid rgba(255,255,255,0.07)',
        background:'rgba(255,255,255,0.02)',
        borderLeft:`4px solid ${accent}`,
      }}>
        <span style={{ fontSize:22 }}>{icon}</span>
        <h3 style={{ fontFamily:'var(--font-display)', fontSize:18, fontWeight:800, flex:1 }}>{title}</h3>
        {badge && (
          <span style={{
            background:`${accent}18`, border:`1px solid ${accent}40`,
            color:accent, fontSize:11, fontWeight:700,
            padding:'4px 12px', borderRadius:100, letterSpacing:0.5,
          }}>{badge}</span>
        )}
      </div>
      <div style={{ padding:'24px 28px' }}>{children}</div>
    </div>
  );
}

// ── Milestone timeline ────────────────────────────────────────────────────────
function Timeline({ milestones }) {
  return (
    <div style={{ position:'relative', paddingLeft:32 }}>
      <div style={{
        position:'absolute', left:10, top:8, bottom:8, width:2,
        background:'linear-gradient(180deg,var(--amber),var(--violet),var(--cyan))',
        borderRadius:1, opacity:0.4,
      }} />
      {milestones.map((m, i) => (
        <div key={i} style={{ display:'flex', gap:20, marginBottom:24, alignItems:'flex-start', position:'relative' }}>
          <div style={{
            position:'absolute', left:-22,
            width:14, height:14, borderRadius:'50%',
            background:'linear-gradient(135deg,var(--amber),var(--violet))',
            border:'2px solid var(--bg-void)',
            boxShadow:'0 0 12px rgba(251,191,36,0.4)',
            flexShrink:0,
          }} />
          <div style={{
            background:'var(--amber-dim)', border:'1px solid var(--amber)',
            color:'var(--amber)', borderRadius:8,
            padding:'4px 12px', fontSize:12, fontWeight:800,
            whiteSpace:'nowrap', letterSpacing:0.5,
          }}>{m.phase}</div>
          <p style={{ fontSize:14, color:'var(--text-secondary)', lineHeight:1.6, margin:0 }}>{m.goal}</p>
        </div>
      ))}
    </div>
  );
}

export default function BusinessPlanTab({ data }) {
  const [toast, setToast] = useState({ show:false, msg:'' });
  const [expandedRisk, setExpandedRisk] = useState(null);
  if (!data) return <div style={{ textAlign:'center', padding:60, color:'var(--text-muted)' }}>No business plan data</div>;

  const showToast = (msg) => {
    setToast({ show:true, msg });
    setTimeout(() => setToast({ show:false, msg:'' }), 2500);
  };

  const handleExport = () => showToast('📄 Business plan copied to clipboard!');
  const handleShare = () => showToast('🔗 Share link generated!');

  return (
    <div style={s.root}>
      {/* Toast */}
      <div style={{
        position:'fixed', bottom:32, right:32, zIndex:9999,
        background:'linear-gradient(135deg,#1a1a28,#0f0f1a)',
        border:'1px solid rgba(251,191,36,0.4)',
        borderRadius:14, padding:'14px 22px',
        color:'#fbbf24', fontSize:14, fontWeight:600,
        boxShadow:'0 8px 32px rgba(0,0,0,0.6)',
        display:'flex', alignItems:'center', gap:10,
        transform: toast.show ? 'translateY(0)' : 'translateY(80px)',
        opacity: toast.show ? 1 : 0,
        transition:'all 0.4s cubic-bezier(0.16,1,0.3,1)',
        pointerEvents:'none',
      }}>✅ {toast.msg}</div>

      {/* ── Header Actions ── */}
      <div style={s.pageHeader}>
        <div>
          <p className="section-eyebrow">Strategy</p>
          <h2 style={s.pageTitle}>📋 Business Plan</h2>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={handleShare} style={s.actionBtn}>🔗 Share</button>
          <button onClick={handleExport} style={s.actionBtnPrimary}>📄 Export Plan</button>
        </div>
      </div>

      {/* ── Executive Summary ── */}
      <Section icon="📌" title="Executive Summary" accent="var(--amber)" badge="Overview">
        <p style={s.prose}>{data.executiveSummary}</p>
        <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginTop:16 }}>
          {['Innovative','Scalable','Market-Ready','Data-Driven'].map(tag => (
            <span key={tag} style={{
              background:'var(--amber-dim)', border:'1px solid var(--amber)',
              color:'var(--amber)', fontSize:11, fontWeight:700,
              padding:'4px 12px', borderRadius:100,
            }}>{tag}</span>
          ))}
        </div>
      </Section>

      {/* ── Problem & Solution ── */}
      <div style={s.grid2}>
        <Section icon="⚠️" title="The Problem" accent="#f87171" badge="Pain Points">
          <p style={s.prose}>{data.problem?.statement}</p>
          <ul style={s.list}>
            {(data.problem?.painPoints||[]).map((p,i) => (
              <li key={i} style={{ ...s.listItem, display:'flex', gap:10, alignItems:'flex-start' }}>
                <div style={{ ...s.listBullet, background:'#f87171', boxShadow:'0 0 8px #f8717140' }} />
                {p}
              </li>
            ))}
          </ul>
        </Section>

        <Section icon="💡" title="Our Solution" accent="#34d399" badge="Differentiators">
          <p style={s.prose}>{data.solution?.description}</p>
          <ul style={s.list}>
            {(data.solution?.keyDifferentiators||[]).map((d,i) => (
              <li key={i} style={{ ...s.listItem, display:'flex', gap:10, alignItems:'flex-start' }}>
                <div style={{ ...s.listBullet, background:'#34d399', boxShadow:'0 0 8px #34d39940' }} />
                {d}
              </li>
            ))}
          </ul>
        </Section>
      </div>

      {/* ── Target Audience ── */}
      <Section icon="🎯" title="Target Audience" accent="#22d3ee" badge="Market">
        <div style={s.audienceGrid}>
          {[
            { label:'Primary Segment', value:data.targetAudience?.primarySegment, icon:'👥' },
            { label:'Market Size (TAM)', value:data.targetAudience?.marketSize, icon:'📈', highlight:true },
            { label:'Demographics', value:data.targetAudience?.demographics, icon:'🌍' },
          ].map(({ label,value,icon,highlight }) => (
            <div key={label} style={{
              background: highlight ? 'var(--cyan-dim)' : 'rgba(255,255,255,0.03)',
              border:`1px solid ${highlight ? 'var(--cyan)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius:16, padding:'18px 20px',
            }}>
              <div style={{ fontSize:11, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:1.5, marginBottom:8 }}>{icon} {label}</div>
              <div style={{ fontSize:15, fontWeight:700, color: highlight ? 'var(--cyan)' : 'var(--text-primary)', lineHeight:1.5 }}>
                {highlight ? <AnimNum val={value||''} /> : value}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop:20 }}>
          <div style={s.subLabel}>Psychographic Profile</div>
          <p style={{ ...s.prose, borderLeft:'3px solid var(--cyan)', paddingLeft:16, marginTop:8 }}>
            {data.targetAudience?.psychographics}
          </p>
        </div>
      </Section>

      {/* ── Revenue Model ── */}
      <Section icon="💰" title="Revenue Model" accent="var(--amber)" badge="Monetisation">
        <div style={s.revenuePrimary}>
          <div>
            <div style={{ fontSize:11, color:'var(--amber)', fontWeight:700, textTransform:'uppercase', letterSpacing:1.5, marginBottom:4 }}>Primary Revenue Stream</div>
            <div style={{ fontSize:16, fontWeight:600, color:'var(--text-primary)' }}>{data.revenueModel?.primaryRevenue}</div>
          </div>
        </div>

        <div style={s.subLabel}>Additional Revenue Streams</div>
        <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:24 }}>
          {(data.revenueModel?.streams||[]).map((s2,i) => (
            <div key={i} style={{
              background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)',
              borderRadius:10, padding:'8px 16px', fontSize:13, color:'var(--text-secondary)',
              cursor:'pointer', transition:'all 0.2s',
            }} onClick={() => showToast(`💡 ${s2}`)}>
              {['💳','📊','🤝'][i]||'💰'} {s2}
            </div>
          ))}
        </div>

        <div style={s.subLabel}>Revenue Projections</div>
        <div style={s.projectionsGrid}>
          {[
            { yr:'Year 1', val:data.revenueModel?.projections?.year1, c:'#6b7280' },
            { yr:'Year 2', val:data.revenueModel?.projections?.year2, c:'var(--amber)' },
            { yr:'Year 3', val:data.revenueModel?.projections?.year3, c:'#34d399' },
          ].map(({ yr,val,c }) => (
            <div key={yr} style={{
              background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)',
              borderRadius:16, padding:'20px', textAlign:'center',
              transition:'all 0.3s', cursor:'default',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=c; e.currentTarget.style.boxShadow=`0 0 20px ${c}30`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow='none'; }}>
              <div style={{ fontSize:11, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:1.5, marginBottom:8 }}>{yr}</div>
              <div style={{ fontFamily:'var(--font-display)', fontSize:22, fontWeight:900, color:c }}>
                <AnimNum val={val||'—'} />
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Marketing ── */}
      <Section icon="📣" title="Marketing Strategy" accent="#8b5cf6" badge="GTM">
        <p style={{ ...s.prose, borderLeft:'3px solid #8b5cf6', paddingLeft:16 }}>{data.marketingStrategy?.gtmStrategy}</p>
        <div style={s.grid2col}>
          <div>
            <div style={s.subLabel}>Channels</div>
            <ul style={s.list}>
              {(data.marketingStrategy?.channels||[]).map((c,i) => (
                <li key={i} style={{ ...s.listItem, display:'flex', gap:10 }}>
                  <span style={{ color:'#8b5cf6', fontWeight:700 }}>→</span> {c}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div style={s.subLabel}>Tactics</div>
            <ul style={s.list}>
              {(data.marketingStrategy?.tactics||[]).map((t,i) => (
                <li key={i} style={{ ...s.listItem, display:'flex', gap:10 }}>
                  <span style={{ color:'#8b5cf6', fontWeight:700 }}>→</span> {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* ── Milestones + Risks ── */}
      <div style={s.grid2}>
        <Section icon="🗓" title="Roadmap & Milestones" accent="#22d3ee">
          <Timeline milestones={data.milestones||[]} />
        </Section>

        <Section icon="⚡" title="Risks & Mitigations" accent="#f87171">
          {(data.risks||[]).map((r,i) => (
            <div key={i} onClick={() => setExpandedRisk(expandedRisk===i ? null : i)}
              style={{
                background: expandedRisk===i ? 'rgba(248,113,113,0.08)' : 'rgba(255,255,255,0.02)',
                border:`1px solid ${expandedRisk===i ? 'rgba(248,113,113,0.35)' : 'rgba(255,255,255,0.07)'}`,
                borderRadius:14, padding:'16px 18px', marginBottom:12, cursor:'pointer',
                transition:'all 0.25s',
              }}>
              <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                <span style={{ color:'#f87171', fontSize:16 }}>⚠</span>
                <span style={{ fontSize:14, fontWeight:600, color:'#f87171', flex:1 }}>{r.risk}</span>
                <span style={{ color:'var(--text-muted)', fontSize:12, transform: expandedRisk===i ? 'rotate(180deg)' : 'none', transition:'transform 0.2s' }}>▼</span>
              </div>
              {expandedRisk===i && (
                <div style={{ marginTop:12, paddingTop:12, borderTop:'1px solid rgba(255,255,255,0.06)', display:'flex', gap:10 }}>
                  <span style={{ fontSize:16 }}>🛡</span>
                  <p style={{ fontSize:13, color:'var(--text-secondary)', lineHeight:1.6, margin:0 }}>{r.mitigation}</p>
                </div>
              )}
            </div>
          ))}
        </Section>
      </div>

      {/* ── Competitive Advantages ── */}
      <Section icon="🏆" title="Competitive Advantages" accent="var(--amber)" badge="Moat">
        <div style={s.advantagesGrid}>
          {(data.competitiveAdvantage||[]).map((adv,i) => (
            <div key={i} style={{
              background:'rgba(255,255,255,0.02)',
              border:'1px solid rgba(255,255,255,0.07)',
              borderRadius:18, padding:'24px',
              transition:'all 0.3s', cursor:'default',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(251,191,36,0.35)'; e.currentTarget.style.background='rgba(251,191,36,0.05)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'; e.currentTarget.style.background='rgba(255,255,255,0.02)'; }}>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:32, fontWeight:900, color:'rgba(255,255,255,0.07)', marginBottom:10, lineHeight:1 }}>
                {String(i+1).padStart(2,'0')}
              </div>
              <p style={{ fontSize:14, color:'var(--text-secondary)', lineHeight:1.7 }}>{adv}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

const s = {
  root: { display:'flex', flexDirection:'column', gap:18 },
  pageHeader: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12, marginBottom:4 },
  pageTitle: { fontFamily:'var(--font-display)', fontSize:26, fontWeight:800, margin:0 },
  actionBtn: {
    background:'rgba(255,255,255,0.04)', border:'1px solid var(--border)',
    borderRadius:10, color:'var(--text-secondary)',
    padding:'9px 16px', fontSize:13, cursor:'pointer', fontFamily:'var(--font-body)',
    transition:'all 0.2s',
  },
  actionBtnPrimary: {
    background:'linear-gradient(135deg,var(--amber),#f97316)',
    border:'none', borderRadius:10,
    color:'#0a0a12', padding:'9px 18px',
    fontSize:13, fontWeight:800, cursor:'pointer', fontFamily:'var(--font-display)',
    boxShadow:'0 4px 16px rgba(251,191,36,0.3)',
  },
  prose: { color:'var(--text-secondary)', lineHeight:1.8, fontSize:14, margin:0 },
  subLabel: { fontSize:11, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:1.5, fontWeight:700, marginBottom:12, marginTop:8 },
  list: { listStyle:'none', display:'flex', flexDirection:'column', gap:10, marginTop:12 },
  listItem: { fontSize:14, color:'var(--text-secondary)', lineHeight:1.6 },
  listBullet: { width:8, height:8, borderRadius:'50%', flexShrink:0, marginTop:6 },
  grid2: { display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:18 },
  grid2col: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:24, marginTop:8 },
  audienceGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:14, marginBottom:8 },
  revenuePrimary: {
    background:'var(--amber-glow)', border:'1px solid var(--border-amber)',
    borderRadius:14, padding:'16px 20px', marginBottom:20,
    display:'flex', alignItems:'center', justifyContent:'space-between',
  },
  projectionsGrid: { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 },
  advantagesGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:14 },
};
