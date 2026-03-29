export const exportToPDF = (kit, idea) => {
  const { businessPlan: bp, branding, pitchDeck, landingPage: lp } = kit;
  const primaryName = branding?.nameOptions?.[0]?.name || 'Startup';

  const styles = `
    body { font-family: 'Segoe UI', sans-serif; color: #1a1a2e; margin: 0; padding: 0; }
    .cover { background: linear-gradient(135deg,#0a0a12,#1a1a28); color: #fff; padding: 80px 60px; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; }
    .cover h1 { font-size: 56px; font-weight: 800; margin-bottom: 16px; color: #fbbf24; }
    .cover p  { font-size: 20px; opacity: 0.7; max-width: 600px; }
    .section  { padding: 48px 60px; border-bottom: 1px solid #e5e7eb; page-break-inside: avoid; }
    .section h2 { font-size: 28px; font-weight: 700; color: #0a0a12; margin-bottom: 24px; border-left: 4px solid #fbbf24; padding-left: 16px; }
    .section h3 { font-size: 18px; font-weight: 600; color: #374151; margin: 20px 0 8px; }
    p  { margin: 8px 0; line-height: 1.7; color: #4b5563; }
    ul { padding-left: 20px; }
    li { margin: 6px 0; color: #4b5563; line-height: 1.6; }
    .tag { display: inline-block; background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 20px; font-size: 13px; margin: 4px; }
    .color-swatch { display: inline-block; width: 40px; height: 40px; border-radius: 8px; margin-right: 12px; vertical-align: middle; }
    .slide { background: #f8f8ff; border-radius: 12px; padding: 24px; margin: 16px 0; border-left: 4px solid #8b5cf6; }
    .slide h4 { font-size: 16px; font-weight: 700; color: #0a0a12; margin-bottom: 12px; }
    .meta { font-size: 13px; color: #9ca3af; margin-top: 8px; }
    .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 16px; }
    .card { background: #f9fafb; border-radius: 8px; padding: 16px; border: 1px solid #e5e7eb; }
  `;

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>${primaryName} - Startup Kit</title>
<style>${styles}</style></head>
<body>

<div class="cover">
  <div style="font-size:13px;text-transform:uppercase;letter-spacing:4px;color:#fbbf24;margin-bottom:24px;">AI Startup Builder Kit</div>
  <h1>${primaryName}</h1>
  <p style="font-size:24px;color:#fcd34d;margin-bottom:16px;">${branding?.tagline || ''}</p>
  <p>Generated for: <em>"${idea}"</em></p>
  <p class="meta" style="margin-top:40px;color:#6b7280;">Generated on ${new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}</p>
</div>

<div class="section">
  <h2>📋 Executive Summary</h2>
  <p>${bp?.executiveSummary || ''}</p>
</div>

<div class="section">
  <h2>🎯 Business Plan</h2>
  <h3>The Problem</h3>
  <p>${bp?.problem?.statement || ''}</p>
  <ul>${(bp?.problem?.painPoints || []).map(p => `<li>${p}</li>`).join('')}</ul>

  <h3>Our Solution</h3>
  <p>${bp?.solution?.description || ''}</p>
  <ul>${(bp?.solution?.keyDifferentiators || []).map(d => `<li>${d}</li>`).join('')}</ul>

  <h3>Target Audience</h3>
  <p><strong>Primary:</strong> ${bp?.targetAudience?.primarySegment || ''}</p>
  <p><strong>Market Size:</strong> ${bp?.targetAudience?.marketSize || ''}</p>
  <p>${bp?.targetAudience?.demographics || ''}</p>

  <h3>Revenue Model</h3>
  <p><strong>Primary:</strong> ${bp?.revenueModel?.primaryRevenue || ''}</p>
  <div class="grid2">
    <div class="card"><strong>Year 1</strong><br/>${bp?.revenueModel?.projections?.year1 || ''}</div>
    <div class="card"><strong>Year 2</strong><br/>${bp?.revenueModel?.projections?.year2 || ''}</div>
  </div>

  <h3>Marketing Strategy</h3>
  <p>${bp?.marketingStrategy?.gtmStrategy || ''}</p>
  <ul>${(bp?.marketingStrategy?.channels || []).map(c => `<li>${c}</li>`).join('')}</ul>

  <h3>Milestones</h3>
  ${(bp?.milestones || []).map(m => `<div class="card" style="margin:8px 0"><strong>${m.phase}:</strong> ${m.goal}</div>`).join('')}
</div>

<div class="section">
  <h2>🎨 Branding</h2>
  <h3>Name Options</h3>
  ${(branding?.nameOptions || []).map(n => `
    <div class="card" style="margin:8px 0">
      <strong>${n.name}</strong> — ${n.domain}<br/>
      <span style="color:#6b7280">${n.rationale}</span>
    </div>`).join('')}

  <h3>Color Palette</h3>
  ${Object.entries(branding?.colorPalette || {}).map(([key, c]) => `
    <div style="margin:8px 0;display:flex;align-items:center">
      <span class="color-swatch" style="background:${c.hex}"></span>
      <div><strong>${c.name}</strong> ${c.hex} — <em>${c.usage}</em></div>
    </div>`).join('')}

  <h3>Logo Concept</h3>
  <p>${branding?.logoDescription || ''}</p>
  <h3>Brand Voice</h3>
  <p>${branding?.brandVoice || ''}</p>
</div>

<div class="section">
  <h2>📊 Pitch Deck</h2>
  ${(pitchDeck?.slides || []).map(s => `
    <div class="slide">
      <div style="font-size:12px;color:#8b5cf6;font-weight:600;text-transform:uppercase;letter-spacing:2px">Slide ${s.number}</div>
      <h4>${s.title}</h4>
      <ul>${(s.content || []).map(c => `<li>${c}</li>`).join('')}</ul>
      ${s.speakerNotes ? `<p class="meta">💬 ${s.speakerNotes}</p>` : ''}
    </div>`).join('')}
</div>

<div class="section">
  <h2>🌐 Landing Page Structure</h2>
  <h3>Hero Section</h3>
  <p><strong>Headline:</strong> ${lp?.hero?.headline || ''}</p>
  <p><strong>Subheadline:</strong> ${lp?.hero?.subheadline || ''}</p>
  <p><strong>CTA:</strong> ${lp?.hero?.ctaText || ''}</p>

  <h3>Features</h3>
  ${(lp?.features || []).map(f => `<div class="card" style="margin:8px 0">${f.icon} <strong>${f.title}</strong><br/><span style="color:#6b7280">${f.description}</span></div>`).join('')}
</div>

<div style="text-align:center;padding:40px;color:#9ca3af;font-size:13px;">
  Generated with AI Startup Builder &bull; ai-startup-builder.app
</div>
</body></html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${primaryName.replace(/\s+/g, '-')}-startup-kit.html`;
  a.click();
  URL.revokeObjectURL(url);
};

export const copyToClipboard = async (text) => {
  await navigator.clipboard.writeText(text);
};
