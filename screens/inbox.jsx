// inbox.jsx — Caixa de Entrada (AI-native 3-column inbox)
const { useState, useRef, useEffect } = React;

const CONVS = [
  { id:1, name:'Ana Silva',     phone:'+55 11 9 8765-4321', tag:'VIP',     status:'ai',    unread:3, last:'Quero saber mais sobre o pacote premium', time:'2m',   avatar:'AS', city:'São Paulo',      deal:'R$12k', stage:'Negociação', urgency:'high' },
  { id:2, name:'Carlos Mendes', phone:'+55 21 9 7654-3210', tag:'Novo',    status:'human', unread:1, last:'Pode me ligar agora?',                   time:'8m',   avatar:'CM', city:'Rio de Janeiro', deal:'R$8.5k',stage:'Contatado',  urgency:'medium' },
  { id:3, name:'Juliana Rocha', phone:'+55 31 9 6543-2109', tag:null,      status:'ai',    unread:0, last:'Obrigada pelo atendimento!',             time:'14m',  avatar:'JR', city:'Belo Horizonte', deal:null,    stage:null,         urgency:'low' },
  { id:4, name:'Pedro Alves',   phone:'+55 41 9 5432-1098', tag:'Inativo', status:'wait',  unread:2, last:'Ainda estou interessado, mas preciso…',  time:'22m',  avatar:'PA', city:'Curitiba',       deal:'R$5k',  stage:'Novo',       urgency:'medium' },
  { id:5, name:'Marina Torres', phone:'+55 51 9 4321-0987', tag:'VIP',     status:'ai',    unread:0, last:'Perfeito, pode confirmar o pedido',      time:'35m',  avatar:'MT', city:'Porto Alegre',   deal:'R$22k', stage:'Ganho',      urgency:'low' },
  { id:6, name:'Roberto Lima',  phone:'+55 85 9 3210-9876', tag:null,      status:'human', unread:0, last:'Qual o prazo de entrega para o Nordeste?',time:'1h',  avatar:'RL', city:'Fortaleza',      deal:'R$3.2k',stage:'Contatado',  urgency:'low' },
  { id:7, name:'Beatriz Costa', phone:'+55 62 9 2109-8765', tag:'Recente', status:'ai',    unread:0, last:'Já recebi, muito obrigada!',             time:'2h',   avatar:'BC', city:'Goiânia',        deal:null,    stage:null,         urgency:'low' },
  { id:8, name:'Lucas Ferreira',phone:'+55 71 9 1098-7654', tag:null,      status:'wait',  unread:4, last:'URGENTE: preciso de retorno ainda hoje', time:'2h',   avatar:'LF', city:'Salvador',       deal:'R$6.8k',stage:'Negociação', urgency:'critical' },
];

const MSGS = {
  1: [
    { id:1, role:'system', text:'Conversa iniciada via WhatsApp' },
    { id:2, role:'in',  name:'Ana Silva', text:'Olá! Vi a promoção de vocês no Instagram e fiquei interessada.', time:'14:02' },
    { id:3, role:'ai',  text:'Olá, Ana! 😊 Que ótimo ter você aqui! Sou a assistente virtual da equipe. Posso te contar mais sobre nossas opções. Qual produto te interessou?', time:'14:02', conf:0.94, reasoning:'Saudação padrão + qualificação de interesse inicial. Alta confiança por padrão reconhecido.' },
    { id:4, role:'in',  name:'Ana Silva', text:'O pacote premium mensal. Quanto custa?', time:'14:05' },
    { id:5, role:'ai',  text:'O Pacote Premium tem um investimento de R$ 1.197/mês com 12 módulos incluídos, suporte prioritário e acesso antecipado a novidades. Você gostaria de ver todos os benefícios ou prefere falar com um consultor especializado?', time:'14:05', conf:0.91, reasoning:'Consulta ao Catálogo de Produtos 2026 · Padrão: pergunta de preço → resposta com valor + proposta de valor + CTA.' },
    { id:6, role:'in',  name:'Ana Silva', text:'Quero saber mais sobre o pacote premium, especialmente sobre o suporte. Como funciona?', time:'14:08' },
    { id:7, role:'system', text:'IA transferiu para atendimento humano — Consultor: Marina Costa' },
  ],
};

const STATUS_LABELS = { ai:'IA', human:'Humano', wait:'Aguardando', resolved:'Resolvido' };
const STATUS_BADGE  = { ai:'badge-info', human:'badge-green', wait:'badge-warn', resolved:'badge-neutral' };
const HEALTH_COLORS = { critical:'var(--err)', high:'var(--warn)', medium:'var(--info)', low:'transparent' };

const AI_SUGGESTIONS = [
  'Nosso suporte premium inclui: canal dedicado via WhatsApp, tempo de resposta de até 2h e gerente de conta exclusivo.',
  'Posso agendar uma demonstração com nossa consultora Marina para amanhã. Você teria disponibilidade?',
  'Temos um desconto especial de 20% para contratos anuais. Isso reduziria para R$957/mês.',
];

const NOTES = [
  { text:'Cliente VIP desde 2023. Alta probabilidade de conversão.', date:'20 abr', by:'Marina' },
  { text:'Interesse confirmado em produto premium. Aguarda proposta formal.',  date:'28 abr', by:'Sistema' },
];

function StatusBadge({ status }) {
  return <span className={`badge ${STATUS_BADGE[status]}`}>{STATUS_LABELS[status]}</span>;
}

function AIMessage({ m }) {
  const [showReason, setShowReason] = useState(false);
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-start', gap:3 }}>
      <div style={{ display:'flex', alignItems:'center', gap:6, paddingLeft:4 }}>
        <LucideIcon name="Bot" size={11} style={{ color:'var(--info)' }} />
        <span style={{ fontSize:11, color:'var(--info)' }}>Agente IA</span>
        {m.conf && <span className="ai-badge">conf {Math.round(m.conf*100)}%</span>}
      </div>
      <div style={{ display:'flex', alignItems:'flex-end', gap:6 }}>
        <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
          <div className="chat-bubble ai">{m.text}</div>
          {m.conf && (
            <div className="conf-bar-wrap" style={{ maxWidth:300 }}>
              <div className="conf-bar">
                <div className="conf-bar-fill" style={{ width:`${m.conf*100}%` }} />
              </div>
              <span style={{ fontSize:9, color:'var(--info)', fontFamily:'var(--font-mono)', whiteSpace:'nowrap' }}>{Math.round(m.conf*100)}%</span>
              {m.reasoning && (
                <button onClick={() => setShowReason(r => !r)}
                  style={{ background:'none', border:'none', cursor:'pointer', fontSize:9, color:'var(--text-3)', fontFamily:'var(--font-mono)', padding:0, marginLeft:2, whiteSpace:'nowrap' }}>
                  {showReason ? '▲ fechar' : '▼ raciocínio'}
                </button>
              )}
            </div>
          )}
          {showReason && m.reasoning && (
            <div style={{ background:'oklch(0.72 0.165 240 / 0.07)', border:'1px solid oklch(0.72 0.165 240 / 0.18)', borderRadius:'var(--r2)', padding:'6px 10px', fontSize:10, color:'var(--info)', fontFamily:'var(--font-mono)', lineHeight:1.6, maxWidth:300 }}>
              {m.reasoning}
            </div>
          )}
        </div>
        <span style={{ fontSize:10, color:'var(--text-3)', flexShrink:0 }}>{m.time}</span>
      </div>
    </div>
  );
}

function Inbox() {
  const [filter,       setFilter]       = useState('all');
  const [search,       setSearch]       = useState('');
  const [activeId,     setActiveId]     = useState(1);
  const [msgText,      setMsgText]      = useState('');
  const [ctxTab,       setCtxTab]       = useState('info');
  const [typing,       setTyping]       = useState(false);
  const [msgs,         setMsgs]         = useState(MSGS);
  const [showTransfer, setShowTransfer] = useState(false);
  const chatRef = useRef(null);

  const active     = CONVS.find(c => c.id === activeId);
  const activeMsgs = msgs[activeId] || [];

  const filters = [
    { id:'all',   label:'Todas' },
    { id:'mine',  label:'Minhas' },
    { id:'ai',    label:'IA Ativa' },
    { id:'human', label:'Humano' },
    { id:'wait',  label:'Aguardando' },
  ];

  const filtered = CONVS.filter(c => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter === 'mine')  return c.status === 'human';
    if (filter === 'ai')    return c.status === 'ai';
    if (filter === 'human') return c.status === 'human';
    if (filter === 'wait')  return c.status === 'wait';
    return true;
  });

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [activeId, activeMsgs]);

  function sendMsg() {
    if (!msgText.trim()) return;
    const newMsg = { id:Date.now(), role:'out', text:msgText, time:new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}) };
    setMsgs(m => ({ ...m, [activeId]:[...(m[activeId]||[]), newMsg] }));
    setMsgText('');
    setTyping(true);
    setTimeout(() => setTyping(false), 2200);
  }

  return (
    <div style={{ display:'flex', height:'100%', overflow:'hidden' }}>

      {/* ── Col 1: Conversation list ── */}
      <div style={{ width:300, borderRight:'1px solid var(--border-sub)', display:'flex', flexDirection:'column', flexShrink:0 }}>
        <div style={{ padding:'var(--s3) var(--s4)', borderBottom:'1px solid var(--border-sub)', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, background:'var(--surface-2)', border:'1px solid var(--border-sub)', borderRadius:'var(--r2)', padding:'0 10px', height:32, marginBottom:8 }}>
            <LucideIcon name="Search" size={13} style={{ color:'var(--text-3)', flexShrink:0 }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar conversas…"
              style={{ background:'none', border:'none', outline:'none', fontFamily:'var(--font)', fontSize:12, color:'var(--text)', flex:1 }} />
          </div>
          <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
            {filters.map(f => (
              <button key={f.id} onClick={() => setFilter(f.id)}
                className={`btn btn-xs ${filter===f.id?'btn-primary':'btn-ghost'}`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ flex:1, overflowY:'auto' }}>
          {filtered.map(c => (
            <div key={c.id} onClick={() => setActiveId(c.id)}
              style={{ position:'relative', padding:'10px var(--s4) 10px calc(var(--s4) + 6px)', borderBottom:'1px solid var(--border-sub)', cursor:'pointer', background:activeId===c.id?'var(--p-dim)':'', borderLeft:activeId===c.id?'2px solid var(--p)':'2px solid transparent', transition:'background var(--t)' }}
              onMouseEnter={e => { if(activeId!==c.id) e.currentTarget.style.background='var(--surface-2)'; }}
              onMouseLeave={e => { if(activeId!==c.id) e.currentTarget.style.background=''; }}>
              {/* Health indicator */}
              <div className="conv-health" style={{ background: HEALTH_COLORS[c.urgency] || 'transparent' }} />
              <div style={{ display:'flex', alignItems:'flex-start', gap:8 }}>
                <div className="avatar sm" style={{ marginTop:1 }}>{c.avatar}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:4, marginBottom:2 }}>
                    <span style={{ fontSize:13, fontWeight:600, flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.name}</span>
                    <span style={{ fontSize:10, color:'var(--text-3)', flexShrink:0 }}>{c.time}</span>
                  </div>
                  <div style={{ fontSize:11, color:'var(--text-2)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginBottom:4 }}>{c.last}</div>
                  <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                    <StatusBadge status={c.status} />
                    {c.tag && <span className="tag" style={{ fontSize:10 }}>{c.tag}</span>}
                    {c.unread > 0 && <span style={{ marginLeft:'auto', background:'var(--err)', color:'white', fontSize:10, fontWeight:700, padding:'1px 5px', borderRadius:'var(--r-full)' }}>{c.unread}</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Col 2: Chat ── */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
        {/* Chat topbar */}
        <div style={{ height:'var(--topbar-h)', borderBottom:'1px solid var(--border-sub)', display:'flex', alignItems:'center', padding:'0 var(--s4)', gap:'var(--s3)', flexShrink:0 }}>
          <div className="avatar">{active?.avatar}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:600, fontSize:14 }}>{active?.name}</div>
            <div style={{ fontSize:11, color:'var(--text-3)', display:'flex', alignItems:'center', gap:6 }}>
              <span className="dot dot-green pulse" style={{ width:6, height:6 }} />
              WhatsApp · {active?.phone}
            </div>
          </div>
          <StatusBadge status={active?.status||'ai'} />
          <button className="btn btn-secondary btn-sm" onClick={() => setShowTransfer(true)}>
            <LucideIcon name="ArrowRightLeft" size={13} /> Transferir
          </button>
          <button className="btn btn-primary btn-sm">
            <LucideIcon name="CheckCircle" size={13} /> Resolver
          </button>
          <button className="icon-btn"><LucideIcon name="MoreHorizontal" size={16} /></button>
        </div>

        {/* Messages */}
        <div ref={chatRef} style={{ flex:1, overflowY:'auto', padding:'var(--s5)', display:'flex', flexDirection:'column', gap:'var(--s3)' }}>
          {activeMsgs.map(m => (
            <div key={m.id}>
              {m.role === 'system' && (
                <div className="chat-bubble system">{m.text}</div>
              )}
              {m.role === 'in' && (
                <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-start', gap:3 }}>
                  <div style={{ fontSize:11, color:'var(--text-3)', paddingLeft:4 }}>{m.name}</div>
                  <div style={{ display:'flex', alignItems:'flex-end', gap:6 }}>
                    <div className="chat-bubble in">{m.text}</div>
                    <span style={{ fontSize:10, color:'var(--text-3)', flexShrink:0 }}>{m.time}</span>
                  </div>
                </div>
              )}
              {m.role === 'ai' && <AIMessage m={m} />}
              {m.role === 'out' && (
                <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:3 }}>
                  <div style={{ fontSize:11, color:'var(--text-3)', paddingRight:4 }}>Você</div>
                  <div style={{ display:'flex', alignItems:'flex-end', gap:6 }}>
                    <span style={{ fontSize:10, color:'var(--text-3)', flexShrink:0 }}>{m.time}</span>
                    <div className="chat-bubble out">{m.text}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
          {typing && (
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div className="avatar sm" style={{ background:'var(--info-dim)', color:'var(--info)', border:'1px solid var(--info-dim)' }}>AI</div>
              <div style={{ background:'var(--surface-2)', border:'1px solid var(--border-sub)', borderRadius:'var(--r3)', padding:'8px 12px' }}>
                <div className="typing-dots"><span /><span /><span /></div>
              </div>
            </div>
          )}
        </div>

        {/* AI Intelligence Panel */}
        {active?.status === 'ai' && (
          <div className="intel-panel">
            <div className="intel-panel-header">
              <LucideIcon name="Sparkles" size={11} />
              <span>Inteligência — Sugestões</span>
              <span className="ai-badge" style={{ marginLeft:'auto' }}>conf média 92%</span>
            </div>
            {AI_SUGGESTIONS.map((s, i) => (
              <button key={i} className="intel-suggestion" onClick={() => setMsgText(s)}>
                <span style={{ display:'flex', alignItems:'flex-start', gap:8 }}>
                  <span style={{ fontSize:9, color:'var(--info)', fontFamily:'var(--font-mono)', marginTop:2, flexShrink:0 }}>#{i+1}</span>
                  <span>{s.length > 95 ? s.slice(0,95)+'…' : s}</span>
                </span>
              </button>
            ))}
            <div className="intel-reasoning">
              <LucideIcon name="Brain" size={11} style={{ color:'var(--info)', flexShrink:0, marginTop:1 }} />
              <span>Raciocínio: cliente perguntou sobre suporte premium → priorizar gerente de conta + oferecer demo com consultora</span>
            </div>
          </div>
        )}

        {/* Input */}
        <div style={{ padding:'var(--s3) var(--s4)', borderTop:'1px solid var(--border-sub)', flexShrink:0 }}>
          <div style={{ display:'flex', gap:6, alignItems:'flex-end', background:'var(--surface-2)', border:'1px solid var(--border)', borderRadius:'var(--r3)', padding:'var(--s2) var(--s3)' }}>
            <button className="icon-btn"><LucideIcon name="Paperclip" size={15} /></button>
            <button className="icon-btn"><LucideIcon name="Smile" size={15} /></button>
            <textarea value={msgText} onChange={e => setMsgText(e.target.value)}
              onKeyDown={e => { if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMsg();} }}
              placeholder="Escreva uma mensagem… (Enter para enviar)"
              style={{ flex:1, background:'none', border:'none', outline:'none', fontFamily:'var(--font)', fontSize:13, color:'var(--text)', resize:'none', maxHeight:120, minHeight:20, lineHeight:1.5 }} rows={1} />
            <button className="btn btn-primary btn-sm btn-icon" onClick={sendMsg} disabled={!msgText.trim()}>
              <LucideIcon name="Send" size={14} />
            </button>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:4, paddingLeft:2 }}>
            <LucideIcon name="Bot" size={11} style={{ color:'var(--info)' }} />
            <span style={{ fontSize:10, color:'var(--text-3)' }}>IA monitorando — resposta automática ativa</span>
          </div>
        </div>
      </div>

      {/* ── Col 3: Context ── */}
      <div style={{ width:300, borderLeft:'1px solid var(--border-sub)', display:'flex', flexDirection:'column', flexShrink:0 }}>
        {/* Customer header */}
        <div style={{ padding:'var(--s4)', borderBottom:'1px solid var(--border-sub)', textAlign:'center', flexShrink:0 }}>
          <div className="avatar xl" style={{ margin:'0 auto var(--s2)' }}>{active?.avatar}</div>
          <div style={{ fontWeight:600, fontSize:14 }}>{active?.name}</div>
          <div style={{ fontSize:11, color:'var(--text-3)', marginBottom:'var(--s3)' }}>{active?.city} · {active?.phone}</div>
          {active?.tag && <span className="tag">{active.tag}</span>}
          {/* Customer health score */}
          {active?.deal && (
            <div style={{ marginTop:'var(--s3)', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
              <div style={{ fontSize:10, color:'var(--text-3)' }}>Score</div>
              <div style={{ flex:1, maxWidth:80 }}>
                <div className="conf-bar">
                  <div className="conf-bar-fill" style={{ width:'82%', background:'var(--p)' }} />
                </div>
              </div>
              <div style={{ fontSize:10, fontWeight:600, color:'var(--p)' }}>82</div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', borderBottom:'1px solid var(--border-sub)', flexShrink:0 }}>
          {[{id:'info',label:'Info'},{id:'deals',label:'Deals'},{id:'notes',label:'Notas'},{id:'hist',label:'Histórico'}].map(t => (
            <button key={t.id} onClick={() => setCtxTab(t.id)}
              style={{ flex:1, padding:'8px 4px', fontSize:11, fontWeight:ctxTab===t.id?600:400, color:ctxTab===t.id?'var(--p)':'var(--text-2)', borderBottom:ctxTab===t.id?'2px solid var(--p)':'2px solid transparent', marginBottom:-1, background:'none', border:'none', borderBottom:ctxTab===t.id?'2px solid var(--p)':'2px solid transparent', cursor:'pointer', transition:'color var(--t)' }}>
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:'var(--s4)' }}>
          {ctxTab === 'info' && (
            <div style={{ display:'flex', flexDirection:'column', gap:'var(--s3)' }}>
              {[
                { label:'Cidade',        value: active?.city },
                { label:'Telefone',      value: active?.phone },
                { label:'Status',        value: active?.tag || '—' },
                { label:'Canal',         value: 'WhatsApp' },
                { label:'Consultor',     value: 'Marina Costa' },
                { label:'Última compra', value: '15 mar 2026' },
              ].map((row, i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', fontSize:12, paddingBottom:'var(--s2)', borderBottom:'1px solid var(--border-sub)' }}>
                  <span style={{ color:'var(--text-3)' }}>{row.label}</span>
                  <span style={{ fontWeight:500 }}>{row.value}</span>
                </div>
              ))}
              <div style={{ marginTop:'var(--s2)' }}>
                <div style={{ fontSize:11, fontWeight:600, color:'var(--text-3)', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.07em' }}>Tags</div>
                <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
                  <span className="tag">VIP</span><span className="tag">Premium</span><span className="tag">SP-Capital</span>
                </div>
              </div>
            </div>
          )}

          {ctxTab === 'deals' && (
            <div style={{ display:'flex', flexDirection:'column', gap:'var(--s3)' }}>
              {active?.deal ? (
                <div style={{ background:'var(--surface-2)', border:'1px solid var(--border)', borderRadius:'var(--r3)', padding:'var(--s3)' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                    <span style={{ fontSize:12, fontWeight:600 }}>Pacote Premium</span>
                    <span style={{ fontSize:13, fontWeight:700, color:'var(--p)' }}>{active.deal}</span>
                  </div>
                  <div style={{ fontSize:11, color:'var(--text-3)', marginBottom:6 }}>Funil: Vendas Diretas</div>
                  <span className={`badge ${active.stage==='Ganho'?'badge-green':active.stage==='Perdido'?'badge-err':'badge-warn'}`}>{active.stage}</span>
                </div>
              ) : (
                <div className="empty-state" style={{ padding:'var(--s8)' }}>
                  <LucideIcon name="PackageOpen" size={28} style={{ color:'var(--text-3)' }} />
                  <div className="empty-desc">Nenhum deal aberto</div>
                  <button className="btn btn-primary btn-sm">+ Criar Deal</button>
                </div>
              )}
            </div>
          )}

          {ctxTab === 'notes' && (
            <div style={{ display:'flex', flexDirection:'column', gap:'var(--s3)' }}>
              <textarea className="input" style={{ height:72, fontSize:12 }} placeholder="Adicionar nota…" />
              <button className="btn btn-primary btn-sm">Salvar nota</button>
              <div className="divider" />
              {NOTES.map((n, i) => (
                <div key={i} style={{ background:'var(--surface-2)', borderRadius:'var(--r2)', padding:'var(--s3)', fontSize:12 }}>
                  <div style={{ marginBottom:4 }}>{n.text}</div>
                  <div style={{ fontSize:10, color:'var(--text-3)' }}>{n.by} · {n.date}</div>
                </div>
              ))}
            </div>
          )}

          {ctxTab === 'hist' && (
            <div style={{ display:'flex', flexDirection:'column', gap:'var(--s2)' }}>
              {[
                { icon:'MessageSquare', text:'12 conversas anteriores', color:'var(--info)' },
                { icon:'ShoppingBag',   text:'3 compras realizadas',     color:'var(--p)' },
                { icon:'Megaphone',     text:'Recebeu 4 campanhas',      color:'var(--warn)' },
                { icon:'Star',          text:'NPS: 9 — Promotor',        color:'var(--purple)' },
              ].map((h, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:8, padding:'var(--s2) 0', borderBottom:'1px solid var(--border-sub)', cursor:'pointer' }}>
                  <div style={{ width:26, height:26, borderRadius:'var(--r2)', background:h.color+'1a', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <LucideIcon name={h.icon} size={13} style={{ color:h.color }} />
                  </div>
                  <span style={{ fontSize:12 }}>{h.text}</span>
                  <LucideIcon name="ChevronRight" size={12} style={{ color:'var(--text-3)', marginLeft:'auto' }} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Transfer modal */}
      {showTransfer && (
        <div className="modal-overlay" onClick={() => setShowTransfer(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ width:400 }}>
            <div className="modal-header">
              <span className="modal-title">Transferir Conversa</span>
              <button className="icon-btn" onClick={() => setShowTransfer(false)}><LucideIcon name="X" size={16} /></button>
            </div>
            <div className="modal-body">
              {['Marina Costa','Rafael Sousa','Juliana Alves','Pedro Ribeiro'].map((name, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 0', borderBottom:'1px solid var(--border-sub)', cursor:'pointer' }}
                  onClick={() => setShowTransfer(false)}>
                  <div className="avatar sm">{name.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:500 }}>{name}</div>
                    <div style={{ fontSize:11, color:'var(--text-3)' }}>Consultora · 3 conversas ativas</div>
                  </div>
                  <span className="dot dot-green" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { Inbox });
