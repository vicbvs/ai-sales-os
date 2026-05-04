// automations.jsx — Automações (Visual Builder)
const { useState } = React;

const PLAYBOOKS = [
  { id:1, name:'Re-engajamento 60 dias', trigger:'Cliente inativo 60d', status:'active',  runs:248, lastRun:'2h atrás' },
  { id:2, name:'Boas-vindas novo lead',  trigger:'Novo contato criado', status:'active',  runs:1842,lastRun:'5 min' },
  { id:3, name:'Follow-up pós proposta', trigger:'Deal em negociação 3d',status:'active', runs:94,  lastRun:'1d atrás' },
  { id:4, name:'NPS pós compra',         trigger:'Compra confirmada',   status:'paused',  runs:312, lastRun:'3d atrás' },
  { id:5, name:'Alerta VIP inativo',     trigger:'VIP sem contato 15d', status:'active',  runs:18,  lastRun:'4h atrás' },
];

const NODES_REENG = [
  { id:'t1', type:'trigger',   label:'Gatilho',    title:'Cliente Inativo',   desc:'60 dias sem compra ou mensagem',     icon:'Zap' },
  { id:'c1', type:'condition', label:'Condição',   title:'É cliente VIP?',    desc:'Tag contém "VIP"',                   icon:'GitBranch' },
  { id:'a1', type:'action',    label:'Ação',       title:'Enviar mensagem',   desc:'Template: Reativação VIP',           icon:'MessageSquare' },
  { id:'a2', type:'action',    label:'Ação',       title:'Criar deal',        desc:'Funil: Re-engajamento · Valor: R$0', icon:'PlusSquare' },
  { id:'a3', type:'action',    label:'Ação',       title:'Aguardar 3 dias',   desc:'Delay de 72h',                       icon:'Clock' },
  { id:'c2', type:'condition', label:'Condição',   title:'Respondeu?',        desc:'Verificar resposta na conversa',     icon:'MessageCircle' },
  { id:'a4', type:'action',    label:'Ação',       title:'Atribuir consultor',desc:'Responsável: Marina Costa',          icon:'UserCheck' },
  { id:'a5', type:'action',    label:'Ação',       title:'Aplicar tag',       desc:'Adicionar tag "Reengajado"',         icon:'Tag' },
];

const NODE_COLORS = { trigger:'var(--p)', condition:'var(--warn)', action:'var(--info)' };

function AutoNode({ node, selected, onSelect }) {
  const color = NODE_COLORS[node.type];
  return (
    <div className={`auto-node ${node.type}`}
      style={{ borderColor: selected===node.id ? color : undefined, boxShadow: selected===node.id ? `0 0 0 2px ${color}44` : undefined }}
      onClick={()=>onSelect(node.id)}>
      <div className="auto-node-type" style={{ color }}>
        <div style={{ display:'flex', alignItems:'center', gap:4 }}>
          <LucideIcon name={node.icon} size={11} />
          {node.label}
        </div>
      </div>
      <div className="auto-node-label">{node.title}</div>
      <div className="auto-node-desc">{node.desc}</div>
    </div>
  );
}

function AutoConnector({ label }) {
  return (
    <div className="auto-connector">
      <div className="auto-line" />
      {label && <div style={{ fontSize:10, color:'var(--text-3)', background:'var(--surface-2)', border:'1px solid var(--border-sub)', borderRadius:'var(--r-full)', padding:'1px 6px', margin:'2px 0' }}>{label}</div>}
      <div className="auto-line" />
      <div className="auto-dot" />
    </div>
  );
}

function Automations() {
  const [selected, setSelected] = useState(null);
  const [activePlaybook, setActivePlaybook] = useState(1);
  const [nodeSelected, setNodeSelected] = useState(null);

  const activeP = PLAYBOOKS.find(p=>p.id===activePlaybook);

  return (
    <div style={{ display:'flex', height:'100%', overflow:'hidden' }}>
      {/* Sidebar list */}
      <div style={{ width:280, borderRight:'1px solid var(--border-sub)', display:'flex', flexDirection:'column', flexShrink:0, overflow:'hidden' }}>
        <div style={{ padding:'var(--s4)', borderBottom:'1px solid var(--border-sub)', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
          <span style={{ fontWeight:600, fontSize:13 }}>Playbooks</span>
          <button className="btn btn-primary btn-xs"><LucideIcon name="Plus" size={12} /> Novo</button>
        </div>
        <div style={{ flex:1, overflowY:'auto' }}>
          {PLAYBOOKS.map(p=>(
            <div key={p.id} onClick={()=>setActivePlaybook(p.id)}
              style={{ padding:'var(--s3) var(--s4)', borderBottom:'1px solid var(--border-sub)', cursor:'pointer', background:activePlaybook===p.id?'var(--p-dim)':'', borderLeft:activePlaybook===p.id?'2px solid var(--p)':'2px solid transparent', transition:'background var(--t)' }}
              onMouseEnter={e=>{ if(activePlaybook!==p.id) e.currentTarget.style.background='var(--surface-2)'; }}
              onMouseLeave={e=>{ if(activePlaybook!==p.id) e.currentTarget.style.background=''; }}>
              <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:3 }}>
                <span style={{ flex:1, fontSize:13, fontWeight:500 }}>{p.name}</span>
                <span className={`badge ${p.status==='active'?'badge-green':'badge-warn'}`} style={{ fontSize:10 }}>
                  {p.status==='active'?'Ativa':'Pausada'}
                </span>
              </div>
              <div style={{ fontSize:11, color:'var(--text-3)' }}>{p.trigger}</div>
              <div style={{ fontSize:11, color:'var(--text-3)', marginTop:2, display:'flex', gap:8 }}>
                <span>{p.runs.toLocaleString()} execuções</span>
                <span>· {p.lastRun}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Canvas area */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        {/* Canvas header */}
        <div style={{ padding:'0 var(--s5)', height:'var(--topbar-h)', borderBottom:'1px solid var(--border-sub)', display:'flex', alignItems:'center', gap:'var(--s3)', flexShrink:0 }}>
          <span style={{ fontWeight:600 }}>{activeP?.name}</span>
          <span className={`badge ${activeP?.status==='active'?'badge-green':'badge-warn'}`}>
            {activeP?.status==='active'?'Ativa':'Pausada'}
          </span>
          <div style={{ marginLeft:'auto', display:'flex', gap:8 }}>
            <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'var(--text-2)' }}>
              <LucideIcon name="Activity" size={13} style={{ color:'var(--p)' }} />
              <span><strong style={{ color:'var(--p)' }}>{activeP?.runs}</strong> execuções</span>
            </div>
            <button className="btn btn-secondary btn-sm"><LucideIcon name="Play" size={13} /> Testar</button>
            <button className="btn btn-secondary btn-sm"><LucideIcon name="Settings2" size={13} /> Configurar</button>
            <button className={`btn btn-sm ${activeP?.status==='active'?'btn-secondary':'btn-primary'}`}>
              {activeP?.status==='active' ? <><LucideIcon name="Pause" size={13} /> Pausar</> : <><LucideIcon name="Play" size={13} /> Ativar</>}
            </button>
          </div>
        </div>

        {/* Canvas + inspector */}
        <div style={{ flex:1, display:'flex', overflow:'hidden' }}>
          {/* Canvas */}
          <div style={{ flex:1, overflowY:'auto', overflowX:'auto', padding:'var(--s8)', display:'flex', justifyContent:'center' }}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', minWidth:280 }}>
              {NODES_REENG.map((node, i) => (
                <div key={node.id} style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                  <AutoNode node={node} selected={nodeSelected} onSelect={setNodeSelected} />
                  {i < NODES_REENG.length - 1 && (
                    <AutoConnector label={
                      node.id==='c1' ? 'SIM — É VIP' :
                      node.id==='c2' ? 'SIM — Respondeu' : undefined
                    } />
                  )}
                </div>
              ))}
              {/* Add node button */}
              <div className="auto-connector"><div className="auto-line" /></div>
              <button style={{ width:36, height:36, borderRadius:'var(--r-full)', border:'2px dashed var(--border)', background:'none', cursor:'pointer', color:'var(--text-3)', display:'flex', alignItems:'center', justifyContent:'center', transition:'all var(--t)' }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor='var(--p)'; e.currentTarget.style.color='var(--p)'; }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor=''; e.currentTarget.style.color=''; }}>
                <LucideIcon name="Plus" size={16} />
              </button>
            </div>
          </div>

          {/* Inspector panel */}
          {nodeSelected && (() => {
            const node = NODES_REENG.find(n=>n.id===nodeSelected);
            const color = NODE_COLORS[node?.type];
            return (
              <div style={{ width:300, borderLeft:'1px solid var(--border-sub)', padding:'var(--s5)', overflowY:'auto', flexShrink:0, animation:'slideInRight 0.15s ease' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'var(--s4)' }}>
                  <div>
                    <div style={{ fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.07em', color, marginBottom:3 }}>
                      {node?.label}
                    </div>
                    <div style={{ fontSize:14, fontWeight:600 }}>{node?.title}</div>
                  </div>
                  <button className="icon-btn" onClick={()=>setNodeSelected(null)}><LucideIcon name="X" size={15} /></button>
                </div>

                <div style={{ display:'flex', flexDirection:'column', gap:'var(--s3)' }}>
                  {node?.type === 'trigger' && (
                    <>
                      <div className="form-group">
                        <div className="form-label">Evento de disparo</div>
                        <select className="select"><option>Cliente inativo por</option></select>
                      </div>
                      <div className="form-group">
                        <div className="form-label">Período (dias)</div>
                        <input type="number" className="input" defaultValue={60} />
                      </div>
                    </>
                  )}
                  {node?.type === 'condition' && (
                    <>
                      <div className="form-group">
                        <div className="form-label">Campo</div>
                        <select className="select"><option>Tag do cliente</option></select>
                      </div>
                      <div className="form-group">
                        <div className="form-label">Operador</div>
                        <select className="select"><option>Contém</option></select>
                      </div>
                      <div className="form-group">
                        <div className="form-label">Valor</div>
                        <input className="input" defaultValue="VIP" />
                      </div>
                    </>
                  )}
                  {node?.type === 'action' && (
                    <>
                      <div className="form-group">
                        <div className="form-label">Ação</div>
                        <select className="select"><option>{node.title}</option></select>
                      </div>
                      <div className="form-group">
                        <div className="form-label">Parâmetro</div>
                        <input className="input" defaultValue={node.desc} />
                      </div>
                    </>
                  )}
                  <div className="divider" />
                  <div style={{ display:'flex', gap:8 }}>
                    <button className="btn btn-primary btn-sm" style={{ flex:1, justifyContent:'center' }}>Salvar</button>
                    <button className="btn btn-danger btn-sm"><LucideIcon name="Trash2" size={13} /></button>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Automations });
