// onboarding.jsx — Guided 5-step onboarding flow
const { useState, useEffect } = React;

const STEPS = [
  {
    id: 'welcome',
    label: 'Boas-vindas',
    title: 'Bem-vindo ao AI Sales OS',
    desc: 'Sua central de operações de vendas com inteligência artificial integrada. Gerencie conversas, campanhas e pipeline em tempo real — tudo em um lugar.',
    visual: 'welcome',
    cta: 'Vamos começar →',
  },
  {
    id: 'workspace',
    label: 'Workspace',
    title: 'Configure seu workspace',
    desc: 'Conecte seus canais de atendimento, adicione consultores e importe sua base de clientes para começar a operar.',
    visual: 'workspace',
    tasks: [
      { icon: 'Smartphone',  label: 'Conectar WhatsApp Business', done: false },
      { icon: 'Users',       label: 'Convidar consultores ao time', done: false },
      { icon: 'Upload',      label: 'Importar clientes (CSV)',      done: false },
    ],
    cta: 'Próximo →',
  },
  {
    id: 'agent',
    label: 'Agente IA',
    title: 'Crie seu primeiro Agente IA',
    desc: 'Um Agente IA responde clientes automaticamente, qualifica leads e transfere para humanos quando necessário. Configure o tom, as regras e o conhecimento.',
    visual: 'agent',
    cta: 'Próximo →',
  },
  {
    id: 'inbox',
    label: 'Inbox',
    title: 'Responda sua primeira mensagem',
    desc: 'A Caixa de Entrada é o coração do sistema. Veja conversas em tempo real, use sugestões da IA e resolva atendimentos sem sair de uma tela.',
    visual: 'inbox',
    cta: 'Próximo →',
  },
  {
    id: 'campaign',
    label: 'Campanha',
    title: 'Lance sua primeira campanha',
    desc: 'Crie campanhas de WhatsApp para reativar clientes inativos, anunciar promoções ou enviar follow-ups automáticos para sua lista.',
    visual: 'campaign',
    cta: 'Ir para o painel →',
  },
];

// ── Step visuals ─────────────────────────────────────────────────
function Visual({ type }) {
  const base = {
    width: '100%', height: '100%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    position: 'relative', overflow: 'hidden',
  };

  if (type === 'welcome') return (
    <div style={{ ...base, background: 'linear-gradient(135deg, oklch(0.14 0.010 258) 0%, oklch(0.12 0.015 200) 100%)' }}>
      {/* Dot grid */}
      <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle, oklch(0.30 0.015 258 / 0.5) 1px, transparent 1px)', backgroundSize:'20px 20px' }} />
      {/* Rings */}
      {[80,110,140].map((r,i) => (
        <div key={i} style={{ position:'absolute', width:r*2, height:r*2, borderRadius:'50%', border:`1px solid oklch(0.71 0.195 160 / ${0.15 - i*0.04})`, animation:`logo-ring-spin ${6+i*3}s linear infinite` }} />
      ))}
      {/* Center logo */}
      <div style={{ position:'relative', zIndex:2, textAlign:'center' }}>
        <div style={{ width:64, height:64, borderRadius:16, background:'var(--p)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px', fontSize:22, fontWeight:700, color:'oklch(0.10 0.012 258)', boxShadow:'0 0 32px oklch(0.71 0.195 160 / 0.4)' }}>AI</div>
        <div style={{ fontSize:13, fontWeight:600, color:'var(--text)', letterSpacing:-0.02 }}>Sales OS</div>
        <div style={{ fontSize:11, color:'var(--text-3)', marginTop:4 }}>Powered by AI</div>
      </div>
      {/* Floating chips */}
      {[
        { label:'WhatsApp', x:-90, y:-30, color:'var(--p)' },
        { label:'Pipeline', x: 80, y:-45, color:'var(--info)' },
        { label:'Campanha', x:-80, y: 40, color:'var(--warn)' },
        { label:'Agente IA',x: 78, y: 35, color:'var(--purple)' },
      ].map((c,i) => (
        <div key={i} style={{ position:'absolute', left:`calc(50% + ${c.x}px)`, top:`calc(50% + ${c.y}px)`, transform:'translate(-50%,-50%)', background:`${c.color}18`, border:`1px solid ${c.color}40`, borderRadius:20, padding:'3px 10px', fontSize:10, fontWeight:600, color:c.color, whiteSpace:'nowrap' }}>
          {c.label}
        </div>
      ))}
    </div>
  );

  if (type === 'workspace') return (
    <div style={{ ...base, background:'oklch(0.13 0.010 258)' }}>
      <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle, oklch(0.24 0.013 258 / 0.5) 1px, transparent 1px)', backgroundSize:'20px 20px' }} />
      <div style={{ position:'relative', zIndex:2, display:'flex', flexDirection:'column', gap:10, alignItems:'center' }}>
        {/* WhatsApp connect */}
        <div style={{ display:'flex', alignItems:'center', gap:10, background:'var(--surface)', border:'1px solid var(--p-border)', borderRadius:10, padding:'10px 16px', width:280, boxShadow:'0 0 20px oklch(0.71 0.195 160 / 0.15)' }}>
          <div style={{ width:32, height:32, borderRadius:8, background:'var(--p-dim)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <LucideIcon name="Smartphone" size={16} style={{ color:'var(--p)' }} />
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12, fontWeight:600 }}>WhatsApp Business</div>
            <div style={{ fontSize:10, color:'var(--p)' }}>Conectar →</div>
          </div>
          <div style={{ width:8, height:8, borderRadius:'50%', background:'var(--p)', animation:'pulse-dot 2s infinite' }} />
        </div>
        {/* Users */}
        <div style={{ display:'flex', alignItems:'center', gap:10, background:'var(--surface)', border:'1px solid var(--border-sub)', borderRadius:10, padding:'10px 16px', width:280 }}>
          <div style={{ width:32, height:32, borderRadius:8, background:'var(--info-dim)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <LucideIcon name="Users" size={16} style={{ color:'var(--info)' }} />
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12, fontWeight:600 }}>Convidar Consultores</div>
            <div style={{ fontSize:10, color:'var(--text-3)' }}>Adicionar membros</div>
          </div>
        </div>
        {/* Import */}
        <div style={{ display:'flex', alignItems:'center', gap:10, background:'var(--surface)', border:'1px solid var(--border-sub)', borderRadius:10, padding:'10px 16px', width:280 }}>
          <div style={{ width:32, height:32, borderRadius:8, background:'var(--warn-dim)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <LucideIcon name="Upload" size={16} style={{ color:'var(--warn)' }} />
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12, fontWeight:600 }}>Importar Clientes</div>
            <div style={{ fontSize:10, color:'var(--text-3)' }}>CSV ou integração</div>
          </div>
        </div>
      </div>
    </div>
  );

  if (type === 'agent') return (
    <div style={{ ...base, background:'oklch(0.13 0.012 240)' }}>
      <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 50% 100%, oklch(0.72 0.165 240 / 0.10) 0%, transparent 70%)' }} />
      <div style={{ position:'relative', zIndex:2, textAlign:'center' }}>
        {/* Agent avatar */}
        <div style={{ width:72, height:72, borderRadius:'50%', background:'oklch(0.72 0.165 240 / 0.15)', border:'2px solid oklch(0.72 0.165 240 / 0.4)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', boxShadow:'0 0 40px oklch(0.72 0.165 240 / 0.25)' }}>
          <LucideIcon name="Bot" size={32} style={{ color:'var(--info)' }} />
        </div>
        {/* Chat bubbles */}
        <div style={{ display:'flex', flexDirection:'column', gap:6, width:260 }}>
          <div style={{ alignSelf:'flex-start', background:'var(--surface-2)', border:'1px solid var(--border-sub)', borderRadius:'8px 8px 8px 2px', padding:'6px 12px', fontSize:11, textAlign:'left' }}>
            Olá! Quero saber sobre o pacote premium 👋
          </div>
          <div style={{ alignSelf:'flex-end', background:'oklch(0.72 0.165 240 / 0.15)', border:'1px solid oklch(0.72 0.165 240 / 0.3)', borderRadius:'8px 8px 2px 8px', padding:'6px 12px', fontSize:11, color:'var(--info)', textAlign:'left' }}>
            Olá! Claro, vou te ajudar com isso agora 😊
          </div>
          <div style={{ alignSelf:'flex-end', display:'flex', alignItems:'center', gap:4 }}>
            <span style={{ fontSize:9, color:'var(--info)', fontFamily:'var(--font-mono)' }}>conf 94%</span>
            <div style={{ width:40, height:2, borderRadius:2, background:'oklch(0.72 0.165 240 / 0.2)', overflow:'hidden' }}>
              <div style={{ width:'94%', height:'100%', background:'var(--info)', borderRadius:2 }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (type === 'inbox') return (
    <div style={{ ...base, background:'oklch(0.12 0.010 258)', gap:0, alignItems:'stretch', padding:0 }}>
      {/* Mini 3-col inbox */}
      <div style={{ width:90, borderRight:'1px solid var(--border-sub)', display:'flex', flexDirection:'column', padding:8, gap:5 }}>
        {[{n:'Ana S.', c:'var(--p)', a:'AS'},{n:'Carlos M.', c:'var(--warn)', a:'CM'},{n:'Pedro A.', c:'var(--err)', a:'PA'}].map((c,i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:4, background:i===0?'var(--p-dim)':'', borderRadius:5, padding:'4px 4px', borderLeft:i===0?'2px solid var(--p)':'2px solid transparent' }}>
            <div style={{ width:18, height:18, borderRadius:'50%', background:c.c+'22', border:`1px solid ${c.c}44`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:8, fontWeight:700, color:c.c, flexShrink:0 }}>{c.a}</div>
            <div style={{ fontSize:8, fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.n}</div>
          </div>
        ))}
      </div>
      {/* Chat area */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', padding:10, gap:6 }}>
        <div style={{ display:'flex', alignItems:'flex-start', gap:4 }}>
          <div style={{ width:14, height:14, borderRadius:'50%', background:'var(--surface-2)', flexShrink:0, marginTop:1 }} />
          <div style={{ background:'var(--surface-2)', borderRadius:'4px 4px 4px 1px', padding:'4px 7px', fontSize:9, lineHeight:1.4 }}>Quero saber mais sobre o pacote premium…</div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:2 }}>
          <div style={{ display:'flex', alignItems:'center', gap:3 }}>
            <LucideIcon name="Bot" size={8} style={{ color:'var(--info)' }} />
            <span style={{ fontSize:8, color:'var(--info)' }}>Agente IA · 94%</span>
          </div>
          <div style={{ background:'oklch(0.72 0.165 240 / 0.12)', border:'1px solid oklch(0.72 0.165 240 / 0.25)', borderRadius:'4px 4px 1px 4px', padding:'4px 7px', fontSize:9, lineHeight:1.4, maxWidth:140 }}>Olá! O Pacote Premium inclui suporte prioritário…</div>
        </div>
        {/* Suggestion bar */}
        <div style={{ marginTop:'auto', background:'oklch(0.72 0.165 240 / 0.06)', borderRadius:5, padding:'4px 6px' }}>
          <div style={{ fontSize:8, color:'var(--info)', marginBottom:3 }}>✦ Sugestões IA</div>
          <div style={{ background:'oklch(0.72 0.165 240 / 0.10)', borderRadius:3, padding:'3px 5px', fontSize:8 }}>Nosso suporte inclui canal dedicado…</div>
        </div>
      </div>
    </div>
  );

  if (type === 'campaign') return (
    <div style={{ ...base, background:'oklch(0.12 0.015 82)', flexDirection:'column', gap:0 }}>
      <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 50% 0%, oklch(0.82 0.170 82 / 0.12) 0%, transparent 60%)' }} />
      <div style={{ position:'relative', zIndex:2, width:300, padding:'0 20px' }}>
        {/* Campaign card */}
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:10, padding:14, marginBottom:10 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
            <div style={{ width:28, height:28, borderRadius:7, background:'var(--warn-dim)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <LucideIcon name="Megaphone" size={14} style={{ color:'var(--warn)' }} />
            </div>
            <div>
              <div style={{ fontSize:11, fontWeight:600 }}>Black Friday 2026</div>
              <div style={{ fontSize:9, color:'var(--text-3)' }}>1.240 contatos · Amanhã 09:00</div>
            </div>
            <span style={{ marginLeft:'auto', background:'var(--warn-dim)', color:'var(--warn)', fontSize:9, fontWeight:600, border:'1px solid var(--warn)44', borderRadius:12, padding:'2px 7px' }}>Agendada</span>
          </div>
          {/* Stats bar */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginTop:8 }}>
            {[{l:'Enviados',v:'0',c:'var(--text-3)'},{l:'Abertos',v:'0%',c:'var(--info)'},{l:'Conversões',v:'0%',c:'var(--p)'}].map((s,i) => (
              <div key={i} style={{ textAlign:'center' }}>
                <div style={{ fontSize:13, fontWeight:700, color:s.c }}>{s.v}</div>
                <div style={{ fontSize:9, color:'var(--text-3)' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Progress hint */}
        <div style={{ background:'var(--surface)', border:'1px solid var(--border-sub)', borderRadius:10, padding:'10px 14px', display:'flex', alignItems:'center', gap:8 }}>
          <LucideIcon name="Clock" size={14} style={{ color:'var(--warn)' }} />
          <span style={{ fontSize:11, color:'var(--text-2)' }}>Disparo em 14h 23min</span>
        </div>
      </div>
    </div>
  );

  return null;
}

// ── Onboarding component ─────────────────────────────────────────
function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isLast  = step === STEPS.length - 1;

  function next() {
    if (isLast) { onComplete(); return; }
    setStep(s => s + 1);
  }

  return (
    <div className="onboarding-overlay" onClick={(e) => e.target === e.currentTarget && onComplete()}>
      <div className="onboarding-card">

        {/* Visual */}
        <div className="onboarding-visual">
          <Visual type={current.visual} />
        </div>

        {/* Body */}
        <div className="onboarding-body">
          {/* Progress pips */}
          <div className="onboarding-progress">
            {STEPS.map((_, i) => (
              <div key={i} className={`onboarding-pip ${i < step ? 'done' : i === step ? 'active' : ''}`}
                onClick={() => setStep(i)} style={{ cursor:'pointer' }} />
            ))}
          </div>

          <div className="onboarding-step-label">Passo {step + 1} de {STEPS.length} — {current.label}</div>
          <div className="onboarding-title">{current.title}</div>
          <div className="onboarding-desc">{current.desc}</div>

          {/* Task list (workspace step) */}
          {current.tasks && (
            <div style={{ display:'flex', flexDirection:'column', gap:0, marginBottom:'var(--s4)' }}>
              {current.tasks.map((t, i) => (
                <div key={i} className="onboarding-task">
                  <div style={{ width:28, height:28, borderRadius:'var(--r2)', background:'var(--surface-3)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <LucideIcon name={t.icon} size={14} style={{ color:'var(--text-2)' }} />
                  </div>
                  <span style={{ flex:1 }}>{t.label}</span>
                  <LucideIcon name="ChevronRight" size={14} style={{ color:'var(--text-3)' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="onboarding-footer">
          <button className="btn btn-ghost btn-sm" onClick={onComplete} style={{ color:'var(--text-3)' }}>
            Pular tour
          </button>
          <div style={{ display:'flex', alignItems:'center', gap:'var(--s2)' }}>
            {step > 0 && (
              <button className="btn btn-secondary btn-sm" onClick={() => setStep(s => s - 1)}>
                ← Voltar
              </button>
            )}
            <button className="btn btn-primary btn-sm" onClick={next}>
              {current.cta}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Onboarding });
