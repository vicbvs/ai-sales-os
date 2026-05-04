// agents.jsx — Agentes IA
const { useState, useRef, useEffect } = React;

const AGENT_TABS = [
  { id:'identity',    label:'Identidade',   icon:'Bot' },
  { id:'voice',       label:'Tom de voz',   icon:'Mic' },
  { id:'instructions',label:'Instruções',   icon:'FileText' },
  { id:'knowledge',   label:'Conhecimento', icon:'BookOpen' },
  { id:'actions',     label:'Ações',        icon:'Zap' },
  { id:'transfer',    label:'Transferência',icon:'ArrowRightLeft' },
  { id:'simulation',  label:'Simulação',    icon:'PlayCircle' },
];

const KNOWLEDGE_SOURCES = [
  { id:1, name:'Catálogo de Produtos 2026', type:'PDF',  size:'2.4 MB', status:'indexed', chunks:142 },
  { id:2, name:'FAQ — Perguntas Frequentes',type:'Doc',  size:'480 KB', status:'indexed', chunks:87 },
  { id:3, name:'Política de Trocas',         type:'PDF',  size:'920 KB', status:'indexed', chunks:34 },
  { id:4, name:'Tabela de Preços',           type:'Sheet',size:'180 KB', status:'indexed', chunks:12 },
  { id:5, name:'Scripts de Vendas',          type:'Doc',  size:'1.1 MB', status:'processing', chunks:0 },
];

const SIM_EXCHANGES = [
  { role:'user', text:'Olá! Vocês têm o pacote premium disponível?' },
  { role:'ai',   text:'Olá! Sim, o Pacote Premium está disponível! Ele inclui 12 módulos completos, suporte prioritário e um gerente de conta dedicado, por R$1.197/mês. Posso te enviar mais detalhes ou prefere falar com um consultor?', conf:0.96, sources:['Catálogo de Produtos 2026'] },
  { role:'user', text:'Qual a política de cancelamento?' },
  { role:'ai',   text:'Nossa política permite cancelamento a qualquer momento com aviso prévio de 30 dias. Para contratos anuais, o reembolso é proporcional ao período não utilizado. Quer que eu envie o documento completo?', conf:0.89, sources:['Política de Trocas','FAQ — Perguntas Frequentes'] },
];

function Agents() {
  const [tab, setTab] = useState('identity');
  const [saved, setSaved] = useState(false);
  const [simInput, setSimInput] = useState('');
  const [simHistory, setSimHistory] = useState(SIM_EXCHANGES);
  const [simLoading, setSimLoading] = useState(false);
  const simRef = useRef(null);

  function handleSave() { setSaved(true); setTimeout(()=>setSaved(false), 2200); }

  function sendSim() {
    if (!simInput.trim()) return;
    const userMsg = { role:'user', text:simInput };
    setSimHistory(h=>[...h, userMsg]);
    setSimInput('');
    setSimLoading(true);
    setTimeout(()=>{
      setSimHistory(h=>[...h, {
        role:'ai',
        text:'Entendido! Vou verificar essa informação na nossa base de conhecimento e retornar em instantes com a resposta mais precisa para você.',
        conf:0.88,
        sources:['FAQ — Perguntas Frequentes']
      }]);
      setSimLoading(false);
    }, 1800);
  }

  useEffect(()=>{ if(simRef.current) simRef.current.scrollTop=simRef.current.scrollHeight; },[simHistory,simLoading]);

  return (
    <div style={{ display:'flex', height:'100%', overflow:'hidden' }}>
      {/* Sidebar */}
      <div style={{ width:220, borderRight:'1px solid var(--border-sub)', display:'flex', flexDirection:'column', flexShrink:0 }}>
        <div style={{ padding:'var(--s5) var(--s4)', borderBottom:'1px solid var(--border-sub)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:'var(--s3)' }}>
            <div style={{ width:40,height:40,borderRadius:'var(--r3)', background:'var(--info-dim)', border:'1px solid oklch(0.72 0.165 240 / 0.30)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <LucideIcon name="Bot" size={20} style={{ color:'var(--info)' }} />
            </div>
            <div>
              <div style={{ fontWeight:700, fontSize:14 }}>Sofia</div>
              <div style={{ fontSize:11, color:'var(--text-3)' }}>Agente de Vendas</div>
            </div>
          </div>
          <span className="badge badge-green" style={{ fontSize:10 }}>
            <span className="dot dot-green" style={{ width:5,height:5 }} /> Online
          </span>
        </div>
        <div style={{ flex:1, padding:'var(--s2) 0' }}>
          {AGENT_TABS.map(t=>(
            <div key={t.id} className={`nav-item${tab===t.id?' active':''}`} onClick={()=>setTab(t.id)}>
              <LucideIcon name={t.icon} size={15} />
              <span style={{ fontSize:13 }}>{t.label}</span>
            </div>
          ))}
        </div>
        <div style={{ padding:'var(--s4)', borderTop:'1px solid var(--border-sub)' }}>
          <button className="btn btn-secondary btn-sm w-full" style={{ justifyContent:'center', marginBottom:6 }}>
            <LucideIcon name="Copy" size={13} /> Duplicar Agente
          </button>
          <button className="btn btn-ghost btn-xs w-full" style={{ justifyContent:'center', color:'var(--err)' }}>
            <LucideIcon name="Trash2" size={12} /> Excluir
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <div style={{ height:'var(--topbar-h)', borderBottom:'1px solid var(--border-sub)', display:'flex', alignItems:'center', padding:'0 var(--s5)', gap:'var(--s3)', flexShrink:0 }}>
          <span style={{ fontWeight:600 }}>{AGENT_TABS.find(t=>t.id===tab)?.label}</span>
          <div style={{ marginLeft:'auto', display:'flex', gap:8 }}>
            {saved && <span style={{ fontSize:12, color:'var(--p)', display:'flex', alignItems:'center', gap:4 }}><LucideIcon name="CheckCircle" size={13} />Salvo!</span>}
            <button className="btn btn-primary btn-sm" onClick={handleSave}><LucideIcon name="Save" size={13} /> Salvar</button>
          </div>
        </div>

        <div style={{ flex:1, overflowY:'auto' }}>
          {tab === 'identity' && (
            <div style={{ maxWidth:640, margin:'0 auto', padding:'var(--s6)' }}>
              <div style={{ display:'flex', flexDirection:'column', gap:'var(--s4)' }}>
                <div style={{ display:'flex', gap:'var(--s4)', alignItems:'flex-start' }}>
                  <div style={{ width:80,height:80,borderRadius:'var(--r4)', background:'var(--info-dim)', border:'2px solid oklch(0.72 0.165 240 / 0.30)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, cursor:'pointer', fontSize:28 }}>🤖</div>
                  <div style={{ flex:1, display:'flex', flexDirection:'column', gap:'var(--s3)' }}>
                    <div className="form-group">
                      <div className="form-label">Nome do Agente</div>
                      <input className="input" defaultValue="Sofia" />
                    </div>
                    <div className="form-group">
                      <div className="form-label">Função / Cargo</div>
                      <input className="input" defaultValue="Consultora de Vendas Virtual" />
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <div className="form-label">Descrição / Persona</div>
                  <textarea className="input" style={{ height:100 }} defaultValue="Sofia é uma consultora de vendas especialista nos produtos da franquia. Ela é empática, proativa e sempre busca entender as necessidades do cliente antes de apresentar soluções." />
                </div>
                <div className="form-group">
                  <div className="form-label">Idioma principal</div>
                  <select className="select"><option>Português Brasileiro</option><option>Inglês</option><option>Espanhol</option></select>
                </div>
                <div style={{ background:'var(--p-dim)', border:'1px solid var(--p-border)', borderRadius:'var(--r3)', padding:'var(--s4)', display:'flex', gap:10 }}>
                  <LucideIcon name="Info" size={14} style={{ color:'var(--p)', flexShrink:0, marginTop:1 }} />
                  <span style={{ fontSize:12, color:'var(--p)' }}>Esta identidade será apresentada aos clientes em todas as conversas do WhatsApp.</span>
                </div>
              </div>
            </div>
          )}

          {tab === 'voice' && (
            <div style={{ maxWidth:640, margin:'0 auto', padding:'var(--s6)', display:'flex', flexDirection:'column', gap:'var(--s4)' }}>
              <div className="form-group">
                <div className="form-label">Tom de comunicação</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'var(--s2)' }}>
                  {['Formal','Profissional','Amigável','Casual','Empático','Direto'].map((tone,i)=>(
                    <div key={i} onClick={()=>{}}
                      style={{ padding:'var(--s3)', border:`1px solid ${i===1?'var(--p)':'var(--border)'}`, borderRadius:'var(--r2)', textAlign:'center', cursor:'pointer', background:i===1?'var(--p-dim)':'', fontSize:13, fontWeight:i===1?600:400, color:i===1?'var(--p)':'var(--text-2)', transition:'all var(--t)' }}>
                      {tone}
                    </div>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <div className="form-label">Comprimento de resposta</div>
                <div style={{ display:'flex', gap:'var(--s2)' }}>
                  {['Conciso','Equilibrado','Detalhado'].map((l,i)=>(
                    <div key={i} onClick={()=>{}} style={{ flex:1, padding:'var(--s3)', border:`1px solid ${i===1?'var(--p)':'var(--border)'}`, borderRadius:'var(--r2)', textAlign:'center', cursor:'pointer', background:i===1?'var(--p-dim)':'', fontSize:13, fontWeight:i===1?600:400, color:i===1?'var(--p)':'var(--text-2)', transition:'all var(--t)' }}>{l}</div>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <div className="form-label">Uso de emojis</div>
                <select className="select"><option>Moderado (recomendado)</option><option>Nenhum</option><option>Frequente</option></select>
              </div>
              <div className="form-group">
                <div className="form-label">Saudação padrão</div>
                <textarea className="input" style={{ height:80 }} defaultValue="Olá, {{nome}}! 😊 Sou a Sofia, consultora virtual. Como posso te ajudar hoje?" />
              </div>
              <div className="form-group">
                <div className="form-label">Despedida padrão</div>
                <textarea className="input" style={{ height:60 }} defaultValue="Obrigada pelo contato! Estarei aqui caso precise de mais alguma coisa. Tenha um ótimo dia! 🌟" />
              </div>
            </div>
          )}

          {tab === 'instructions' && (
            <div style={{ maxWidth:640, margin:'0 auto', padding:'var(--s6)', display:'flex', flexDirection:'column', gap:'var(--s4)' }}>
              <div className="form-group">
                <div className="form-label">Instruções do sistema</div>
                <textarea className="input" style={{ height:200 }} defaultValue={`Você é Sofia, consultora de vendas virtual da franquia.

OBJETIVOS:
1. Qualificar leads e identificar necessidades
2. Apresentar produtos relevantes
3. Encaminhar clientes qualificados para consultores humanos

REGRAS:
- Nunca invente preços; use apenas os dados do catálogo
- Sempre peça o nome do cliente na primeira interação
- Em caso de reclamação, transferir imediatamente para humano
- Não discutir concorrentes
- Máximo de 3 tentativas antes de transferir`} />
              </div>
              <div className="form-group">
                <div className="form-label">Tópicos proibidos</div>
                <textarea className="input" style={{ height:60 }} defaultValue="Concorrentes, política, preços não catalogados, informações pessoais de outros clientes" />
              </div>
            </div>
          )}

          {tab === 'knowledge' && (
            <div style={{ padding:'var(--s6)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'var(--s4)' }}>
                <div>
                  <div style={{ fontWeight:600 }}>Base de Conhecimento</div>
                  <div style={{ fontSize:12, color:'var(--text-2)' }}>{KNOWLEDGE_SOURCES.filter(k=>k.status==='indexed').length} fontes indexadas · {KNOWLEDGE_SOURCES.reduce((a,k)=>a+k.chunks,0)} chunks</div>
                </div>
                <button className="btn btn-primary btn-sm"><LucideIcon name="Upload" size={13} /> Adicionar Fonte</button>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'var(--s2)' }}>
                {KNOWLEDGE_SOURCES.map(k=>(
                  <div key={k.id} style={{ display:'flex', alignItems:'center', gap:12, background:'var(--surface)', border:'1px solid var(--border-sub)', borderRadius:'var(--r3)', padding:'var(--s3) var(--s4)' }}>
                    <div style={{ width:36,height:36,borderRadius:'var(--r2)', background:'var(--info-dim)', border:'1px solid oklch(0.72 0.165 240 / 0.25)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <LucideIcon name={k.type==='PDF'?'FileText':k.type==='Sheet'?'Table':'FileCode'} size={16} style={{ color:'var(--info)' }} />
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:500 }}>{k.name}</div>
                      <div style={{ fontSize:11, color:'var(--text-3)' }}>{k.type} · {k.size} {k.status==='indexed'?`· ${k.chunks} chunks`:''}</div>
                    </div>
                    <span className={`badge ${k.status==='indexed'?'badge-green':'badge-warn'}`}>
                      {k.status==='indexed'?'Indexado':'Processando…'}
                    </span>
                    <button className="icon-btn" style={{ width:26,height:26 }}><LucideIcon name="Trash2" size={13} style={{ color:'var(--err)' }} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'actions' && (
            <div style={{ padding:'var(--s6)' }}>
              <div style={{ display:'flex', flexDirection:'column', gap:'var(--s3)' }}>
                {[
                  { label:'Criar deal no pipeline', desc:'Quando qualificar um lead com intenção de compra', enabled:true },
                  { label:'Enviar catálogo por PDF', desc:'Quando cliente solicitar informações de produto', enabled:true },
                  { label:'Agendar follow-up', desc:'Quando cliente pedir para contato posterior', enabled:true },
                  { label:'Aplicar tag ao cliente', desc:'Com base nas respostas do cliente', enabled:false },
                  { label:'Emitir proposta comercial', desc:'Quando deal atingir estágio "Negociação"', enabled:false },
                ].map((a,i)=>(
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:12, background:'var(--surface)', border:'1px solid var(--border-sub)', borderRadius:'var(--r3)', padding:'var(--s3) var(--s4)' }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:500 }}>{a.label}</div>
                      <div style={{ fontSize:11, color:'var(--text-3)' }}>{a.desc}</div>
                    </div>
                    <div onClick={()=>{}} style={{ width:36, height:20, borderRadius:10, background:a.enabled?'var(--p)':'var(--surface-3)', cursor:'pointer', position:'relative', transition:'background var(--t)', flexShrink:0 }}>
                      <div style={{ width:16, height:16, borderRadius:'var(--r-full)', background:'white', position:'absolute', top:2, left:a.enabled?18:2, transition:'left var(--t)', boxShadow:'0 1px 3px rgba(0,0,0,0.3)' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'transfer' && (
            <div style={{ maxWidth:560, margin:'0 auto', padding:'var(--s6)', display:'flex', flexDirection:'column', gap:'var(--s4)' }}>
              <div className="form-group">
                <div className="form-label">Transferir para humano quando</div>
                <div style={{ display:'flex', flexDirection:'column', gap:'var(--s2)', marginTop:'var(--s2)' }}>
                  {['Cliente solicitar explicitamente falar com humano','Reclamação ou insatisfação detectada','Confiança da IA abaixo de 70%','Deal acima de R$5.000','3 tentativas sem resolução','Palavra-chave: cancelar, reembolso, reclamação'].map((cond,i)=>(
                    <label key={i} className="checkbox-row" style={{ background:'var(--surface)', border:'1px solid var(--border-sub)', borderRadius:'var(--r2)', padding:'var(--s3) var(--s4)', cursor:'pointer' }}>
                      <input type="checkbox" defaultChecked={i<4} />
                      <span style={{ fontSize:13 }}>{cond}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <div className="form-label">Consultor padrão de transferência</div>
                <select className="select"><option>Disponível (round-robin)</option><option>Marina Costa</option><option>Rafael Sousa</option></select>
              </div>
              <div className="form-group">
                <div className="form-label">Mensagem de transição</div>
                <textarea className="input" style={{ height:72 }} defaultValue="Vou conectar você com um de nossos consultores especializados. Um momento, por favor! 🤝" />
              </div>
            </div>
          )}

          {tab === 'simulation' && (
            <div style={{ display:'flex', height:'100%', overflow:'hidden' }}>
              <div style={{ flex:1, display:'flex', flexDirection:'column', maxWidth:560, margin:'0 auto', width:'100%', padding:'var(--s4)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:'var(--s4)', padding:'var(--s3) var(--s4)', background:'var(--info-dim)', border:'1px solid oklch(0.72 0.165 240 / 0.25)', borderRadius:'var(--r3)' }}>
                  <LucideIcon name="FlaskConical" size={14} style={{ color:'var(--info)' }} />
                  <span style={{ fontSize:12, color:'var(--info)' }}>Simulador — testando <strong>Sofia v2.4</strong> com base de conhecimento atual</span>
                </div>
                <div ref={simRef} style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column', gap:'var(--s3)', marginBottom:'var(--s4)', paddingRight:4 }}>
                  {simHistory.map((m,i)=>(
                    <div key={i}>
                      {m.role==='user' && (
                        <div style={{ display:'flex', justifyContent:'flex-end' }}>
                          <div style={{ background:'var(--surface-2)', border:'1px solid var(--border)', borderRadius:'var(--r3)', borderBottomRightRadius:'var(--r1)', padding:'8px 12px', fontSize:13, maxWidth:'80%' }}>{m.text}</div>
                        </div>
                      )}
                      {m.role==='ai' && (
                        <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                            <div style={{ width:22,height:22,borderRadius:'var(--r-full)', background:'var(--info-dim)', border:'1px solid oklch(0.72 0.165 240 / 0.30)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                              <LucideIcon name="Bot" size={12} style={{ color:'var(--info)' }} />
                            </div>
                            <span style={{ fontSize:11, color:'var(--info)', fontWeight:500 }}>Sofia</span>
                            <span className="ai-badge">conf {Math.round(m.conf*100)}%</span>
                          </div>
                          <div style={{ background:'oklch(0.72 0.165 240 / 0.08)', border:'1px solid oklch(0.72 0.165 240 / 0.20)', borderRadius:'var(--r3)', borderBottomLeftRadius:'var(--r1)', padding:'8px 12px', fontSize:13, maxWidth:'85%' }}>{m.text}</div>
                          {m.sources && (
                            <div style={{ display:'flex', gap:4, flexWrap:'wrap', paddingLeft:2 }}>
                              {m.sources.map((s,j)=>(
                                <div key={j} style={{ display:'flex', alignItems:'center', gap:3, fontSize:10, color:'var(--text-3)', background:'var(--surface-2)', border:'1px solid var(--border-sub)', borderRadius:'var(--r1)', padding:'1px 5px' }}>
                                  <LucideIcon name="BookOpen" size={9} /> {s}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                  {simLoading && (
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <div style={{ width:22,height:22,borderRadius:'var(--r-full)', background:'var(--info-dim)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <LucideIcon name="Bot" size={12} style={{ color:'var(--info)' }} />
                      </div>
                      <div style={{ background:'oklch(0.72 0.165 240 / 0.08)', border:'1px solid oklch(0.72 0.165 240 / 0.20)', borderRadius:'var(--r3)', padding:'8px 12px' }}>
                        <div className="typing-dots"><span/><span/><span/></div>
                      </div>
                    </div>
                  )}
                </div>
                <div style={{ display:'flex', gap:8, background:'var(--surface-2)', border:'1px solid var(--border)', borderRadius:'var(--r3)', padding:'var(--s2) var(--s3)' }}>
                  <input value={simInput} onChange={e=>setSimInput(e.target.value)}
                    onKeyDown={e=>{ if(e.key==='Enter') sendSim(); }}
                    placeholder="Simular mensagem do cliente…"
                    style={{ flex:1, background:'none', border:'none', outline:'none', fontFamily:'var(--font)', fontSize:13, color:'var(--text)' }} />
                  <button className="btn btn-primary btn-sm btn-icon" onClick={sendSim} disabled={!simInput.trim()}>
                    <LucideIcon name="Send" size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Agents });
