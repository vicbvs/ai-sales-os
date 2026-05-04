// campaigns.jsx — Campanhas
const { useState } = React;

const CAMPAIGNS = [
  { id:1, name:'Reativação Novembro',  segment:'Inativos 60d',   status:'active',   start:'01 nov 2026', sent:1240, responses:387, conv:'31.2%', revenue:'R$28k' },
  { id:2, name:'Black Friday 2026',    segment:'Base Total',     status:'scheduled',start:'28 nov 2026', sent:0,    responses:0,   conv:'—',     revenue:'—' },
  { id:3, name:'Pós-Compra Premium',   segment:'Clientes VIP',   status:'active',   start:'15 out 2026', sent:312,  responses:201, conv:'64.4%', revenue:'R$44k' },
  { id:4, name:'Boas-vindas Novo Lead',segment:'Novos Leads',    status:'active',   start:'01 jan 2026', sent:2841, responses:1932,conv:'68.0%', revenue:'R$91k' },
  { id:5, name:'Upsell Plano Anual',   segment:'Mensalistas',    status:'paused',   start:'10 out 2026', sent:580,  responses:94,  conv:'16.2%', revenue:'R$12k' },
  { id:6, name:'NPS Trimestral',       segment:'Compradores 90d',status:'completed',start:'01 set 2026', sent:890,  responses:712, conv:'80.0%', revenue:'—' },
];

const STATUS_MAP = { active:'badge-green', scheduled:'badge-info', paused:'badge-warn', completed:'badge-neutral' };
const STATUS_LABEL = { active:'Ativa', scheduled:'Agendada', paused:'Pausada', completed:'Concluída' };

const STEP_LABELS = ['Segmento','Mensagem','Agendamento','Revisão','Lançar'];

const SEGMENTS = ['Base Total','Clientes VIP','Inativos 60d','Novos Leads','Mensalistas','Compradores 90d','Leads Frios','Região Sul'];

function CampaignWizard({ onClose }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ segment:'', message:'', schedDate:'', schedTime:'09:00', name:'' });

  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const canNext = [form.segment, form.message.length>10, form.schedDate, true, true][step];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ width:640, maxHeight:'80vh' }} onClick={e=>e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">Nova Campanha</div>
          <button className="icon-btn" onClick={onClose}><LucideIcon name="X" size={16} /></button>
        </div>

        {/* Step nav */}
        <div style={{ display:'flex', padding:'0 var(--s5)', borderBottom:'1px solid var(--border-sub)', gap:0 }}>
          {STEP_LABELS.map((s,i)=>(
            <div key={i} style={{ display:'flex', alignItems:'center', gap:6, padding:'10px 12px', cursor:i<=step?'pointer':'default', opacity:i>step?0.45:1 }}
              onClick={()=>i<=step&&setStep(i)}>
              <div style={{ width:20,height:20,borderRadius:'var(--r-full)', background:i<=step?'var(--p)':'var(--surface-2)', color:i<=step?'oklch(0.1 0.01 258)':'var(--text-3)', display:'flex',alignItems:'center',justifyContent:'center', fontSize:10, fontWeight:700, border:'1px solid var(--border)', flexShrink:0 }}>
                {i < step ? '✓' : i+1}
              </div>
              <span style={{ fontSize:12, fontWeight:i===step?600:400, color:i===step?'var(--p)':'var(--text-2)', whiteSpace:'nowrap' }}>{s}</span>
              {i < STEP_LABELS.length-1 && <div style={{ width:24, height:1, background:'var(--border)', marginLeft:6 }} />}
            </div>
          ))}
        </div>

        <div className="modal-body">
          {step===0 && (
            <div>
              <div style={{ marginBottom:'var(--s4)' }}>
                <div className="form-label" style={{ marginBottom:'var(--s2)' }}>Nome da Campanha</div>
                <input className="input" value={form.name} onChange={e=>set('name',e.target.value)} placeholder="Ex: Reativação Dezembro" />
              </div>
              <div>
                <div className="form-label" style={{ marginBottom:'var(--s2)' }}>Segmento de clientes</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'var(--s2)' }}>
                  {SEGMENTS.map(s=>(
                    <div key={s} onClick={()=>set('segment',s)}
                      style={{ padding:'var(--s3) var(--s4)', border:`1px solid ${form.segment===s?'var(--p)':'var(--border)'}`, borderRadius:'var(--r3)', cursor:'pointer', background:form.segment===s?'var(--p-dim)':'', transition:'all var(--t)' }}>
                      <div style={{ fontSize:13, fontWeight:500, color:form.segment===s?'var(--p)':'var(--text)' }}>{s}</div>
                      <div style={{ fontSize:11, color:'var(--text-3)', marginTop:2 }}>{Math.floor(Math.random()*2000+200)} contatos</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step===1 && (
            <div style={{ display:'flex', flexDirection:'column', gap:'var(--s4)' }}>
              <div className="form-group">
                <div className="form-label">Mensagem</div>
                <textarea className="input" style={{ height:160, resize:'none' }} value={form.message}
                  onChange={e=>set('message',e.target.value)}
                  placeholder="Olá {{nome}}! Temos uma oferta especial para você…" />
                <div style={{ fontSize:11, color:'var(--text-3)', display:'flex', gap:8 }}>
                  <span>Variáveis: <code style={{ background:'var(--surface-2)', padding:'1px 4px', borderRadius:3 }}>{'{{nome}}'}</code> <code style={{ background:'var(--surface-2)', padding:'1px 4px', borderRadius:3 }}>{'{{produto}}'}</code></span>
                  <span style={{ marginLeft:'auto' }}>{form.message.length} / 1024</span>
                </div>
              </div>
              {form.message && (
                <div>
                  <div className="form-label" style={{ marginBottom:'var(--s2)' }}>Preview</div>
                  <div style={{ background:'oklch(0.18 0.05 148)', borderRadius:'var(--r4)', padding:'var(--s4)', maxWidth:320 }}>
                    <div style={{ background:'white', borderRadius:12, borderBottomLeftRadius:3, padding:'10px 14px', fontSize:13, color:'#111', maxWidth:280, boxShadow:'0 1px 2px rgba(0,0,0,0.15)', lineHeight:1.5 }}>
                      {form.message.replace('{{nome}}','João').replace('{{produto}}','Pacote Premium')}
                    </div>
                    <div style={{ fontSize:10, color:'oklch(0.6 0.05 148)', textAlign:'right', marginTop:4 }}>09:00 ✓✓</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {step===2 && (
            <div style={{ display:'flex', flexDirection:'column', gap:'var(--s4)' }}>
              <div className="form-group">
                <div className="form-label">Data de envio</div>
                <input type="date" className="input" value={form.schedDate} onChange={e=>set('schedDate',e.target.value)} />
              </div>
              <div className="form-group">
                <div className="form-label">Horário</div>
                <input type="time" className="input" value={form.schedTime} onChange={e=>set('schedTime',e.target.value)} />
              </div>
              <div style={{ background:'var(--info-dim)', border:'1px solid oklch(0.72 0.165 240 / 0.30)', borderRadius:'var(--r3)', padding:'var(--s3) var(--s4)', display:'flex', gap:8 }}>
                <LucideIcon name="Lightbulb" size={14} style={{ color:'var(--info)', flexShrink:0, marginTop:1 }} />
                <span style={{ fontSize:12, color:'var(--info)' }}>Recomendamos envios entre 9h–11h ou 14h–17h para maior taxa de abertura.</span>
              </div>
            </div>
          )}

          {step===3 && (
            <div style={{ display:'flex', flexDirection:'column', gap:'var(--s4)' }}>
              <div style={{ background:'var(--surface-2)', borderRadius:'var(--r4)', padding:'var(--s4)' }}>
                <div style={{ fontSize:14, fontWeight:600, marginBottom:'var(--s3)' }}>Resumo da Campanha</div>
                {[
                  { l:'Nome',      v: form.name||'Sem nome' },
                  { l:'Segmento',  v: form.segment },
                  { l:'Mensagem',  v: form.message.slice(0,60)+(form.message.length>60?'…':'') },
                  { l:'Agendamento',v:`${form.schedDate} às ${form.schedTime}` },
                ].map((r,i)=>(
                  <div key={i} style={{ display:'flex', gap:'var(--s4)', padding:'var(--s2) 0', borderBottom:'1px solid var(--border-sub)', fontSize:13 }}>
                    <span style={{ color:'var(--text-3)', width:100, flexShrink:0 }}>{r.l}</span>
                    <span>{r.v}</span>
                  </div>
                ))}
              </div>
              <div style={{ display:'flex', gap:8, background:'var(--p-dim)', border:'1px solid var(--p-border)', borderRadius:'var(--r3)', padding:'var(--s3) var(--s4)' }}>
                <LucideIcon name="Users" size={14} style={{ color:'var(--p)', flexShrink:0, marginTop:1 }} />
                <span style={{ fontSize:12, color:'var(--p)' }}>Estimativa: <strong>1.240 mensagens</strong> para {form.segment||'segmento selecionado'}</span>
              </div>
            </div>
          )}

          {step===4 && (
            <div style={{ textAlign:'center', padding:'var(--s8) 0' }}>
              <div style={{ width:64, height:64, borderRadius:'var(--r-full)', background:'var(--p-dim)', border:'1px solid var(--p-border)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto var(--s4)' }}>
                <LucideIcon name="Rocket" size={28} style={{ color:'var(--p)' }} />
              </div>
              <div style={{ fontSize:18, fontWeight:700, marginBottom:'var(--s2)' }}>Campanha Lançada! 🎉</div>
              <div style={{ fontSize:13, color:'var(--text-2)' }}>Sua campanha foi agendada com sucesso.<br/>Você receberá notificações de desempenho em tempo real.</div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          {step > 0 && step < 4 && <button className="btn btn-ghost" onClick={()=>setStep(s=>s-1)}>← Voltar</button>}
          <div style={{ flex:1 }} />
          {step < 3 && <button className="btn btn-primary" disabled={!canNext} onClick={()=>setStep(s=>s+1)}>Continuar →</button>}
          {step === 3 && <button className="btn btn-primary" onClick={()=>setStep(4)}><LucideIcon name="Rocket" size={13} /> Lançar Campanha</button>}
          {step === 4 && <button className="btn btn-primary" onClick={onClose}>Concluir</button>}
        </div>
      </div>
    </div>
  );
}

function Campaigns() {
  const [campaigns, setCampaigns] = useState(CAMPAIGNS);
  const [showWizard, setShowWizard] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [selected, setSelected] = useState(null);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-title">Campanhas</div>
          <div className="page-subtitle">{campaigns.length} campanhas · {campaigns.filter(c=>c.status==='active').length} ativas</div>
        </div>
        <button className="btn btn-primary" onClick={()=>setShowWizard(true)}>
          <LucideIcon name="Plus" size={13} /> Nova Campanha
        </button>
      </div>

      {/* Summary KPIs */}
      <div className="grid-4" style={{ marginBottom:'var(--s5)' }}>
        {[
          { label:'Total Enviadas', value:'5.863',  icon:'Send',        color:'var(--info)' },
          { label:'Respostas',      value:'3.326',  icon:'MessageCircle',color:'var(--p)' },
          { label:'Conversão Méd.', value:'56.7%',  icon:'Target',      color:'var(--warn)' },
          { label:'Receita Gerada', value:'R$175k', icon:'DollarSign',  color:'var(--purple)' },
        ].map((k,i)=>(
          <div key={i} className="stat-card">
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'var(--s2)' }}>
              <div className="stat-label">{k.label}</div>
              <LucideIcon name={k.icon} size={14} style={{ color:k.color }} />
            </div>
            <div className="stat-value" style={{ color:k.color, fontSize:22 }}>{k.value}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <div className="flex gap-2">
            {['all','active','scheduled','paused','completed'].map(s=>(
              <button key={s} className={`btn btn-xs ${activeTab===s?'btn-primary':'btn-ghost'}`} onClick={()=>setActiveTab(s)}>
                {s==='all'?'Todas':STATUS_LABEL[s]||s}
              </button>
            ))}
          </div>
          <button className="btn btn-secondary btn-sm"><LucideIcon name="Download" size={13} /> Exportar</button>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr>
              <th>Campanha</th><th>Segmento</th><th>Status</th><th>Início</th>
              <th>Enviadas</th><th>Respostas</th><th>Conversão</th><th>Receita</th><th></th>
            </tr></thead>
            <tbody>
              {campaigns.filter(c=>activeTab==='all'||c.status===activeTab).map(c=>(
                <tr key={c.id} style={{ cursor:'pointer' }} onClick={()=>setSelected(selected===c.id?null:c.id)}>
                  <td>
                    <div style={{ fontWeight:600, fontSize:13 }}>{c.name}</div>
                  </td>
                  <td><span className="tag">{c.segment}</span></td>
                  <td><span className={`badge ${STATUS_MAP[c.status]}`}>{STATUS_LABEL[c.status]}</span></td>
                  <td style={{ fontSize:12, color:'var(--text-2)' }}>{c.start}</td>
                  <td style={{ fontSize:13, fontWeight:500 }}>{c.sent.toLocaleString()}</td>
                  <td style={{ fontSize:13 }}>{c.responses.toLocaleString()}</td>
                  <td><strong style={{ color: parseFloat(c.conv)>50?'var(--p)':parseFloat(c.conv)>30?'var(--warn)':'var(--err)' }}>{c.conv}</strong></td>
                  <td style={{ fontWeight:600 }}>{c.revenue}</td>
                  <td>
                    <div className="flex gap-1">
                      {c.status==='active'&&<button className="icon-btn" style={{ width:26,height:26 }} title="Pausar"><LucideIcon name="Pause" size={12} style={{ color:'var(--warn)' }} /></button>}
                      {c.status==='paused'&&<button className="icon-btn" style={{ width:26,height:26 }} title="Retomar"><LucideIcon name="Play" size={12} style={{ color:'var(--p)' }} /></button>}
                      <button className="icon-btn" style={{ width:26,height:26 }}><LucideIcon name="BarChart2" size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {selected && (
          <div style={{ borderTop:'1px solid var(--border-sub)', padding:'var(--s4) var(--s5)', background:'var(--surface-2)' }}>
            <div style={{ fontSize:12, fontWeight:600, marginBottom:'var(--s3)', color:'var(--text-2)' }}>DESEMPENHO DA CAMPANHA</div>
            <div style={{ display:'flex', gap:'var(--s8)', alignItems:'center' }}>
              {[{ label:'Taxa de abertura', value:'84%', pct:84 },{ label:'Taxa de resposta', value:'56%', pct:56 },{ label:'Conversão', value:'31%', pct:31 }].map((m,i)=>(
                <div key={i} style={{ flex:1 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                    <span style={{ fontSize:11, color:'var(--text-3)' }}>{m.label}</span>
                    <span style={{ fontSize:12, fontWeight:600 }}>{m.value}</span>
                  </div>
                  <div className="progress-bar"><div className="progress-fill" style={{ width:`${m.pct}%` }} /></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {showWizard && <CampaignWizard onClose={()=>setShowWizard(false)} />}
    </div>
  );
}

Object.assign(window, { Campaigns });
