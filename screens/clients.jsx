// clients.jsx — Clientes
const { useState } = React;

const CLIENTS = [
  { id:1,  name:'Ana Silva',      phone:'+55 11 98765-4321', city:'São Paulo',      lastPurchase:'15 abr 2026', status:'VIP',     consultant:'Marina Costa',  tags:['VIP','Premium'],  ltv:'R$34.2k', deals:3 },
  { id:2,  name:'Carlos Mendes',  phone:'+55 21 97654-3210', city:'Rio de Janeiro', lastPurchase:'02 abr 2026', status:'Ativo',   consultant:'Rafael Sousa',   tags:['Recente'],        ltv:'R$12.8k', deals:1 },
  { id:3,  name:'Juliana Rocha',  phone:'+55 31 96543-2109', city:'Belo Horizonte', lastPurchase:'28 mar 2026', status:'Ativo',   consultant:'Marina Costa',   tags:[],                 ltv:'R$8.5k',  deals:2 },
  { id:4,  name:'Pedro Alves',    phone:'+55 41 95432-1098', city:'Curitiba',       lastPurchase:'10 fev 2026', status:'Inativo', consultant:'Juliana Alves',  tags:['Inativo'],        ltv:'R$5.1k',  deals:0 },
  { id:5,  name:'Marina Torres',  phone:'+55 51 94321-0987', city:'Porto Alegre',   lastPurchase:'22 abr 2026', status:'VIP',     consultant:'Rafael Sousa',   tags:['VIP','Top'],      ltv:'R$61.0k', deals:5 },
  { id:6,  name:'Roberto Lima',   phone:'+55 85 93210-9876', city:'Fortaleza',      lastPurchase:'05 abr 2026', status:'Ativo',   consultant:'Pedro Ribeiro',  tags:['Nordeste'],       ltv:'R$9.3k',  deals:1 },
  { id:7,  name:'Beatriz Costa',  phone:'+55 62 92109-8765', city:'Goiânia',        lastPurchase:'18 abr 2026', status:'Novo',    consultant:'Marina Costa',   tags:['Novo'],           ltv:'R$1.2k',  deals:0 },
  { id:8,  name:'Lucas Ferreira', phone:'+55 71 91098-7654', city:'Salvador',       lastPurchase:'30 jan 2026', status:'Inativo', consultant:'Juliana Alves',  tags:['Inativo','Risk'], ltv:'R$22.4k', deals:2 },
  { id:9,  name:'Fernanda Lima',  phone:'+55 11 90987-6543', city:'São Paulo',      lastPurchase:'25 abr 2026', status:'VIP',     consultant:'Marina Costa',   tags:['VIP'],            ltv:'R$48.7k', deals:4 },
  { id:10, name:'Diego Souza',    phone:'+55 21 89876-5432', city:'Rio de Janeiro', lastPurchase:'12 abr 2026', status:'Ativo',   consultant:'Rafael Sousa',   tags:['Empresa'],        ltv:'R$15.9k', deals:2 },
];

const STATUS_STYLE = {
  'VIP':     'badge-green',
  'Ativo':   'badge-info',
  'Inativo': 'badge-neutral',
  'Novo':    'badge-warn',
};

const PROFILE_TABS = ['Visão Geral','Histórico','Deals','Campanhas','Notas','Atividade'];

function Clients({ navigate }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState([]);
  const [profile, setProfile] = useState(null);
  const [profileTab, setProfileTab] = useState('Visão Geral');

  const filtered = CLIENTS.filter(c => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search) || c.city.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  function toggleSelect(id) {
    setSelected(s => s.includes(id) ? s.filter(x=>x!==id) : [...s, id]);
  }

  const profileClient = profile ? CLIENTS.find(c=>c.id===profile) : null;

  return (
    <div style={{ display:'flex', height:'100%', overflow:'hidden' }}>
      {/* Main list */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <div className="page" style={{ paddingBottom:0 }}>
          <div className="page-header" style={{ marginBottom:'var(--s4)' }}>
            <div>
              <div className="page-title">Clientes</div>
              <div className="page-subtitle">{CLIENTS.length.toLocaleString()} clientes cadastrados</div>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-secondary btn-sm"><LucideIcon name="Upload" size={13} /> Importar</button>
              <button className="btn btn-secondary btn-sm"><LucideIcon name="Download" size={13} /> Exportar</button>
              <button className="btn btn-primary btn-sm"><LucideIcon name="UserPlus" size={13} /> Novo Cliente</button>
            </div>
          </div>

          {/* Filters row */}
          <div className="flex items-center gap-3" style={{ marginBottom:'var(--s4)' }}>
            <div className="topbar-search" style={{ maxWidth:280 }}>
              <LucideIcon name="Search" size={13} style={{ color:'var(--text-3)', flexShrink:0 }} />
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar clientes…" />
            </div>
            <div className="flex gap-2">
              {['all','VIP','Ativo','Inativo','Novo'].map(s=>(
                <button key={s} onClick={()=>setStatusFilter(s)}
                  className={`btn btn-xs ${statusFilter===s?'btn-primary':'btn-secondary'}`}>
                  {s==='all'?'Todos':s}
                </button>
              ))}
            </div>
            <div className="ml-auto flex gap-2">
              <button className="btn btn-secondary btn-sm"><LucideIcon name="Filter" size={13} /> Filtros</button>
              <button className="btn btn-secondary btn-sm"><LucideIcon name="Tag" size={13} /> Segmentos</button>
            </div>
          </div>

          {/* Bulk actions */}
          {selected.length > 0 && (
            <div style={{ display:'flex', alignItems:'center', gap:8, background:'var(--p-dim)', border:'1px solid var(--p-border)', borderRadius:'var(--r2)', padding:'8px 12px', marginBottom:'var(--s3)' }}>
              <span style={{ fontSize:13, color:'var(--p)', fontWeight:500 }}>{selected.length} selecionados</span>
              <div className="flex gap-2" style={{ marginLeft:'auto' }}>
                <button className="btn btn-secondary btn-xs"><LucideIcon name="Megaphone" size={11} /> Campanha</button>
                <button className="btn btn-secondary btn-xs"><LucideIcon name="Tag" size={11} /> Tag</button>
                <button className="btn btn-secondary btn-xs"><LucideIcon name="UserCheck" size={11} /> Atribuir</button>
                <button className="btn btn-danger btn-xs"><LucideIcon name="Trash2" size={11} /> Excluir</button>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div style={{ flex:1, overflow:'auto', padding:'0 var(--s6) var(--s6)' }}>
          <div className="card" style={{ overflow:'hidden' }}>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th style={{ width:36, paddingRight:0 }}>
                      <input type="checkbox" style={{ accentColor:'var(--p)' }}
                        checked={selected.length===filtered.length && filtered.length>0}
                        onChange={e=>setSelected(e.target.checked ? filtered.map(c=>c.id) : [])} />
                    </th>
                    <th>Nome</th><th>Telefone</th><th>Cidade</th>
                    <th>Última Compra</th><th>Status</th><th>Consultor</th><th>LTV</th><th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(c=>(
                    <tr key={c.id} style={{ background: selected.includes(c.id)?'var(--p-dim)':'' }}>
                      <td style={{ paddingRight:0 }}>
                        <input type="checkbox" style={{ accentColor:'var(--p)' }}
                          checked={selected.includes(c.id)} onChange={()=>toggleSelect(c.id)} />
                      </td>
                      <td>
                        <div className="flex items-center gap-2" style={{ cursor:'pointer' }} onClick={()=>{ setProfile(c.id); setProfileTab('Visão Geral'); }}>
                          <div className="avatar sm">{c.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
                          <div>
                            <div style={{ fontWeight:500, fontSize:13 }}>{c.name}</div>
                            <div style={{ display:'flex', gap:3 }}>
                              {c.tags.map((t,i)=><span key={i} className="tag" style={{ fontSize:10 }}>{t}</span>)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize:12, color:'var(--text-2)', fontFamily:'var(--font-mono)' }}>{c.phone}</td>
                      <td style={{ fontSize:12 }}>{c.city}</td>
                      <td style={{ fontSize:12 }}>{c.lastPurchase}</td>
                      <td><span className={`badge ${STATUS_STYLE[c.status]}`}>{c.status}</span></td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="avatar sm">{c.consultant.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
                          <span style={{ fontSize:12 }}>{c.consultant.split(' ')[0]}</span>
                        </div>
                      </td>
                      <td style={{ fontWeight:600, fontSize:13 }}>{c.ltv}</td>
                      <td>
                        <div className="flex gap-1">
                          <button className="icon-btn" style={{ width:26,height:26 }} title="Mensagem" onClick={()=>navigate('inbox')}>
                            <LucideIcon name="MessageSquare" size={13} style={{ color:'var(--p)' }} />
                          </button>
                          <button className="icon-btn" style={{ width:26,height:26 }} title="Perfil" onClick={()=>{ setProfile(c.id); setProfileTab('Visão Geral'); }}>
                            <LucideIcon name="ChevronRight" size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Profile drawer */}
      {profileClient && (
        <div style={{ width:420, borderLeft:'1px solid var(--border-sub)', background:'var(--surface)', display:'flex', flexDirection:'column', overflow:'hidden', flexShrink:0, animation:'slideInRight 0.2s ease' }}>
          {/* Header */}
          <div style={{ padding:'var(--s5)', borderBottom:'1px solid var(--border-sub)', display:'flex', gap:'var(--s4)', alignItems:'flex-start' }}>
            <div className="avatar xl">{profileClient.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:16, fontWeight:700, marginBottom:2 }}>{profileClient.name}</div>
              <div style={{ fontSize:12, color:'var(--text-3)', marginBottom:6 }}>{profileClient.city} · {profileClient.phone}</div>
              <div className="flex gap-2">
                <span className={`badge ${STATUS_STYLE[profileClient.status]}`}>{profileClient.status}</span>
                {profileClient.tags.map((t,i)=><span key={i} className="tag" style={{ fontSize:10 }}>{t}</span>)}
              </div>
            </div>
            <button className="icon-btn" onClick={()=>setProfile(null)}><LucideIcon name="X" size={16} /></button>
          </div>

          {/* Stats strip */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', borderBottom:'1px solid var(--border-sub)' }}>
            {[{label:'LTV',value:profileClient.ltv},{label:'Deals',value:profileClient.deals},{label:'NPS',value:'9'}].map((s,i)=>(
              <div key={i} style={{ padding:'var(--s3)', textAlign:'center', borderRight:i<2?'1px solid var(--border-sub)':'' }}>
                <div style={{ fontSize:16, fontWeight:700, color:'var(--p)' }}>{s.value}</div>
                <div style={{ fontSize:10, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.06em' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Profile tabs */}
          <div style={{ display:'flex', borderBottom:'1px solid var(--border-sub)', overflowX:'auto', flexShrink:0 }}>
            {PROFILE_TABS.map(t=>(
              <button key={t} onClick={()=>setProfileTab(t)}
                style={{ padding:'8px 12px', fontSize:11, fontWeight:profileTab===t?600:400, color:profileTab===t?'var(--p)':'var(--text-2)', borderBottom:profileTab===t?'2px solid var(--p)':'2px solid transparent', marginBottom:-1, background:'none', border:'none', borderBottom:profileTab===t?'2px solid var(--p)':'2px solid transparent', cursor:'pointer', whiteSpace:'nowrap', transition:'color var(--t)' }}>
                {t}
              </button>
            ))}
          </div>

          <div style={{ flex:1, overflowY:'auto', padding:'var(--s4)' }}>
            {profileTab === 'Visão Geral' && (
              <div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'var(--s3)', marginBottom:'var(--s4)' }}>
                  {[{l:'Consultor',v:profileClient.consultant},{l:'Canal',v:'WhatsApp'},{l:'Última compra',v:profileClient.lastPurchase},{l:'Cadastro',v:'12 jan 2024'}].map((r,i)=>(
                    <div key={i} style={{ background:'var(--surface-2)', borderRadius:'var(--r2)', padding:'var(--s3)' }}>
                      <div style={{ fontSize:10, color:'var(--text-3)', marginBottom:2, textTransform:'uppercase', letterSpacing:'0.06em' }}>{r.l}</div>
                      <div style={{ fontSize:12, fontWeight:500 }}>{r.v}</div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-primary btn-sm" style={{ flex:1, justifyContent:'center' }} onClick={()=>navigate('inbox')}>
                    <LucideIcon name="MessageSquare" size={13} /> Mensagem
                  </button>
                  <button className="btn btn-secondary btn-sm" style={{ flex:1, justifyContent:'center' }} onClick={()=>navigate('pipeline')}>
                    <LucideIcon name="PlusSquare" size={13} /> Novo Deal
                  </button>
                </div>
              </div>
            )}
            {profileTab !== 'Visão Geral' && (
              <div className="empty-state" style={{ padding:'var(--s12)' }}>
                <LucideIcon name="FileText" size={28} style={{ color:'var(--text-3)' }} />
                <div className="empty-desc">Nenhum dado em {profileTab}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { Clients });
