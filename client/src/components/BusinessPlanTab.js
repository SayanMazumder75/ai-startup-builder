import React from 'react';

export default function BusinessPlanTab({ data }) {
  if (!data) return <Empty />;

  return (
    <div style={s.root}>
      {/* Executive Summary */}
      <Card icon="📌" title="Executive Summary" accent="#fbbf24">
        <p style={s.prose}>{data.executiveSummary}</p>
      </Card>

      <div style={s.grid2}>
        {/* Problem */}
        <Card icon="⚠️" title="The Problem" accent="#f87171">
          <p style={s.prose}>{data.problem?.statement}</p>
          <h4 style={s.subheading}>Pain Points</h4>
          <ul style={s.list}>
            {(data.problem?.painPoints || []).map((p, i) => (
              <li key={i} style={s.listItem}><span style={{ color: '#f87171' }}>•</span> {p}</li>
            ))}
          </ul>
        </Card>

        {/* Solution */}
        <Card icon="💡" title="Our Solution" accent="#34d399">
          <p style={s.prose}>{data.solution?.description}</p>
          <h4 style={s.subheading}>Key Differentiators</h4>
          <ul style={s.list}>
            {(data.solution?.keyDifferentiators || []).map((d, i) => (
              <li key={i} style={s.listItem}><span style={{ color: '#34d399' }}>✓</span> {d}</li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Target Audience */}
      <Card icon="🎯" title="Target Audience" accent="#22d3ee">
        <div style={s.grid3}>
          <div style={s.statBox}>
            <div style={s.statLabel}>Primary Segment</div>
            <div style={s.statValue}>{data.targetAudience?.primarySegment}</div>
          </div>
          <div style={s.statBox}>
            <div style={s.statLabel}>Market Size (TAM)</div>
            <div style={{ ...s.statValue, color: '#22d3ee' }}>{data.targetAudience?.marketSize}</div>
          </div>
          <div style={s.statBox}>
            <div style={s.statLabel}>Demographics</div>
            <div style={s.statValue}>{data.targetAudience?.demographics}</div>
          </div>
        </div>
        <h4 style={s.subheading}>Psychographics</h4>
        <p style={s.prose}>{data.targetAudience?.psychographics}</p>
      </Card>

      {/* Revenue Model */}
      <Card icon="💰" title="Revenue Model" accent="#fbbf24">
        <div style={s.revenuePrimary}>
          <span style={s.revenueLabel}>Primary Revenue</span>
          <span style={s.revenueValue}>{data.revenueModel?.primaryRevenue}</span>
        </div>
        <h4 style={s.subheading}>Revenue Streams</h4>
        <div style={s.streamsGrid}>
          {(data.revenueModel?.streams || []).map((stream, i) => (
            <div key={i} style={s.streamChip}>{stream}</div>
          ))}
        </div>
        <h4 style={s.subheading}>Revenue Projections</h4>
        <div style={s.projectionsGrid}>
          {[
            { label: 'Year 1', value: data.revenueModel?.projections?.year1, color: '#6b7280' },
            { label: 'Year 2', value: data.revenueModel?.projections?.year2, color: '#fbbf24' },
            { label: 'Year 3', value: data.revenueModel?.projections?.year3, color: '#34d399' },
          ].map((proj, i) => (
            <div key={i} style={s.projCard}>
              <div style={s.projLabel}>{proj.label}</div>
              <div style={{ ...s.projValue, color: proj.color }}>{proj.value}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Marketing */}
      <Card icon="📣" title="Marketing Strategy" accent="#8b5cf6">
        <p style={s.prose}>{data.marketingStrategy?.gtmStrategy}</p>
        <div style={s.grid2col}>
          <div>
            <h4 style={s.subheading}>Channels</h4>
            <ul style={s.list}>
              {(data.marketingStrategy?.channels || []).map((c, i) => (
                <li key={i} style={s.listItem}><span style={{ color: '#8b5cf6' }}>→</span> {c}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 style={s.subheading}>Tactics</h4>
            <ul style={s.list}>
              {(data.marketingStrategy?.tactics || []).map((t, i) => (
                <li key={i} style={s.listItem}><span style={{ color: '#8b5cf6' }}>→</span> {t}</li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      <div style={s.grid2}>
        {/* Milestones */}
        <Card icon="🗓" title="Roadmap & Milestones" accent="#22d3ee">
          <div style={s.milestones}>
            {(data.milestones || []).map((m, i) => (
              <div key={i} style={s.milestone}>
                <div style={s.milestonePhase}>{m.phase}</div>
                <div style={s.milestoneLine} />
                <div style={s.milestoneGoal}>{m.goal}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Risks */}
        <Card icon="⚡" title="Risks & Mitigations" accent="#f87171">
          {(data.risks || []).map((r, i) => (
            <div key={i} style={s.riskItem}>
              <div style={s.riskLabel}>⚠ {r.risk}</div>
              <div style={s.riskMitigation}>🛡 {r.mitigation}</div>
            </div>
          ))}
        </Card>
      </div>

      {/* Competitive Advantages */}
      <Card icon="🏆" title="Competitive Advantages" accent="#fbbf24">
        <div style={s.advantagesGrid}>
          {(data.competitiveAdvantage || []).map((adv, i) => (
            <div key={i} style={s.advantageCard}>
              <span style={s.advantageNum}>0{i + 1}</span>
              <p style={s.advantageText}>{adv}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

const Card = ({ icon, title, accent, children }) => (
  <div style={{ ...cs.card, '--card-accent': accent }}>
    <div style={{ ...cs.cardHeader, borderLeftColor: accent }}>
      <span style={cs.cardIcon}>{icon}</span>
      <h3 style={cs.cardTitle}>{title}</h3>
    </div>
    <div style={cs.cardBody}>{children}</div>
  </div>
);

const Empty = () => (
  <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>No business plan data</div>
);

const cs = {
  card: {
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)', overflow: 'hidden',
    marginBottom: 0, animation: 'fadeIn 0.4s ease',
  },
  cardHeader: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '16px 24px', borderBottom: '1px solid var(--border)',
    borderLeft: '4px solid',
    background: 'var(--bg-elevated)',
  },
  cardIcon: { fontSize: 20 },
  cardTitle: { fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700 },
  cardBody: { padding: '24px' },
};

const s = {
  root: { display: 'flex', flexDirection: 'column', gap: 20 },
  prose: { color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: 15 },
  subheading: {
    fontFamily: 'var(--font-display)', fontSize: 13,
    fontWeight: 700, color: 'var(--text-muted)',
    textTransform: 'uppercase', letterSpacing: 1,
    marginTop: 20, marginBottom: 10,
  },
  list: { listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 },
  listItem: { display: 'flex', gap: 10, fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 },
  grid2: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 },
  grid2col: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 8 },
  grid3: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 20 },
  statBox: {
    background: 'var(--bg-surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)', padding: '16px',
  },
  statLabel: { fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
  statValue: { fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4 },
  revenuePrimary: {
    display: 'flex', alignItems: 'center', gap: 12,
    background: 'var(--amber-glow)', border: '1px solid var(--border-glow)',
    borderRadius: 'var(--radius-md)', padding: '14px 20px', marginBottom: 20,
  },
  revenueLabel: { fontSize: 12, color: 'var(--amber)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 },
  revenueValue: { fontSize: 15, color: 'var(--text-primary)', fontWeight: 500 },
  streamsGrid: { display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 8 },
  streamChip: {
    background: 'var(--bg-surface)', border: '1px solid var(--border)',
    borderRadius: 100, padding: '6px 14px', fontSize: 13, color: 'var(--text-secondary)',
  },
  projectionsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 },
  projCard: {
    background: 'var(--bg-surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)', padding: '16px', textAlign: 'center',
  },
  projLabel: { fontSize: 12, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 },
  projValue: { fontSize: 18, fontWeight: 800, fontFamily: 'var(--font-display)' },
  milestones: { display: 'flex', flexDirection: 'column', gap: 0 },
  milestone: {
    display: 'grid', gridTemplateColumns: '100px 24px 1fr',
    gap: 12, alignItems: 'center', padding: '12px 0',
    borderBottom: '1px solid var(--border)',
  },
  milestonePhase: { fontSize: 12, fontWeight: 700, color: 'var(--amber)', fontFamily: 'var(--font-mono)' },
  milestoneLine: { width: 2, height: 24, background: 'var(--border)', margin: '0 auto' },
  milestoneGoal: { fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5 },
  riskItem: {
    background: 'var(--bg-surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)', padding: '16px', marginBottom: 12,
  },
  riskLabel: { fontSize: 14, fontWeight: 600, color: '#f87171', marginBottom: 8 },
  riskMitigation: { fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 },
  advantagesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 },
  advantageCard: {
    background: 'var(--bg-surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)', padding: '20px',
  },
  advantageNum: { fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 800, color: 'var(--border)', display: 'block', marginBottom: 8 },
  advantageText: { fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 },
};
