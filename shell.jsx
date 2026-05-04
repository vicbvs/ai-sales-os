// shell.jsx — AppShell: sidebar + topbar + content routing
const { useState } = React;

const NAV_GROUPS = [
  {
    label: 'Núcleo',
    items: [
      { id: 'dashboard',   label: 'Painel',          icon: 'LayoutDashboard', badge: null },
      { id: 'inbox',       label: 'Caixa de Entrada', icon: 'MessageSquare',   badge: 12 },
    ]
  },
  {
    label: 'Vendas',
    items: [
      { id: 'campaigns',   label: 'Campanhas',        icon: 'Megaphone',       badge: null },
      { id: 'clients',     label: 'Clientes',         icon: 'Users',           badge: null },
      { id: 'pipeline',    label: 'Pipeline',         icon: 'Kanban',          badge: null },
    ]
  },
  {
    label: 'Inteligência',
    items: [
      { id: 'automations', label: 'Automações',       icon: 'Zap',             badge: null },
      { id: 'agents',      label: 'Agentes IA',       icon: 'Bot',             badge: null },
      { id: 'reports',     label: 'Relatórios',       icon: 'BarChart3',       badge: null },
    ]
  },
  {
    label: 'Sistema',
    items: [
      { id: 'settings',    label: 'Configurações',    icon: 'Settings',        badge: null },
    ]
  },
];

const SCREEN_LABELS = {
  dashboard:   'Painel',
  inbox:       'Caixa de Entrada',
  campaigns:   'Campanhas',
  clients:     'Clientes',
  pipeline:    'Pipeline',
  automations: 'Automações',
  agents:      'Agentes IA',
  reports:     'Relatórios',
  settings:    'Configurações',
};

function LucideIcon({ name, size = 16, style = {}, strokeWidth = 1.75 }) {
  const iconData = window.lucide?.[name];
  if (!iconData || !Array.isArray(iconData)) return null;
  const childNodes = iconData[2] || [];
  const svgAttrs = {
    xmlns: 'http://www.w3.org/2000/svg',
    width: size, height: size,
    viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth,
    strokeLinecap: 'round', strokeLinejoin: 'round',
    style,
  };
  const children = childNodes.map(([tag, attrs], i) =>
    React.createElement(tag, { key: i, ...attrs })
  );
  return React.createElement('svg', svgAttrs, ...children);
}

function AISignalBars() {
  return (
    <div className="ai-signal-bars">
      {[1,2,3,4,5].map(i => (
        <div key={i} className="ai-signal-bar" />
      ))}
    </div>
  );
}

function AppShell({ activeScreen, setActiveScreen, tweaks = {}, setTweak }) {
  const [collapsed, setCollapsed] = useState(tweaks.sidebarCollapsed || false);
  const [notifOpen, setNotifOpen] = useState(false);

  React.useEffect(() => {
    setCollapsed(tweaks.sidebarCollapsed || false);
  }, [tweaks.sidebarCollapsed]);

  // Apply dark/light theme
  React.useEffect(() => {
    const dark = tweaks.darkMode !== false;
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }, [tweaks.darkMode]);

  const ScreenMap = {
    dashboard:   window.Dashboard,
    inbox:       window.Inbox,
    campaigns:   window.Campaigns,
    clients:     window.Clients,
    pipeline:    window.Pipeline,
    automations: window.Automations,
    agents:      window.Agents,
    reports:     window.Reports,
    settings:    window.Settings,
  };

  const ActiveScreen = ScreenMap[activeScreen];

  return (
    <div className="app-shell">
      {/* ── Sidebar ── */}
      <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>

        {/* Logo */}
        <div className="sidebar-logo">
          <div style={{ position:'relative', width:28, height:28, flexShrink:0 }}>
            <div className="logo-mark">AI</div>
            <svg className="logo-ring-svg" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="19" cy="19" r="17" stroke="url(#lg1)" strokeWidth="1.5"
                strokeDasharray="18 50" strokeLinecap="round" />
              <circle cx="19" cy="19" r="17" stroke="url(#lg2)" strokeWidth="1"
                strokeDasharray="6 62" strokeLinecap="round" opacity="0.5" />
              <defs>
                <linearGradient id="lg1" x1="0" y1="0" x2="38" y2="38" gradientUnits="userSpaceOnUse">
                  <stop stopColor="var(--p)" />
                  <stop offset="0.5" stopColor="var(--p)" stopOpacity="0.1" />
                  <stop offset="1" stopColor="var(--p)" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="lg2" x1="38" y1="0" x2="0" y2="38" gradientUnits="userSpaceOnUse">
                  <stop stopColor="var(--info)" />
                  <stop offset="1" stopColor="var(--info)" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          {!collapsed && <span className="logo-text">Sales OS</span>}
          <button
            className="icon-btn"
            style={{ marginLeft:'auto' }}
            onClick={() => setCollapsed(c => !c)}
            title={collapsed ? 'Expandir' : 'Recolher'}
          >
            <LucideIcon name={collapsed ? 'PanelLeftOpen' : 'PanelLeftClose'} size={15} />
          </button>
        </div>

        {/* Grouped navigation */}
        <nav className="sidebar-nav">
          {NAV_GROUPS.map(group => (
            <div key={group.label} className="nav-group">
              {!collapsed && (
                <div className="nav-group-header">{group.label}</div>
              )}
              {collapsed && <div style={{ height:'var(--s2)' }} />}
              {group.items.map(item => (
                <div
                  key={item.id}
                  className={`nav-item${activeScreen === item.id ? ' active' : ''}`}
                  onClick={() => setActiveScreen(item.id)}
                  title={collapsed ? item.label : undefined}
                >
                  <span className="nav-icon">
                    <LucideIcon name={item.icon} size={16} />
                  </span>
                  {!collapsed && <span className="nav-label">{item.label}</span>}
                  {!collapsed && item.badge && (
                    <span className="nav-badge">{item.badge}</span>
                  )}
                  {collapsed && item.badge && (
                    <span className="nav-badge" style={{ position:'absolute', top:4, right:4, padding:'1px 4px', fontSize:9 }}>{item.badge}</span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-row">
            <div className="avatar">JM</div>
            {!collapsed && (
              <div className="user-info">
                <div className="user-name">João Melo</div>
                <div className="user-role">Admin · Franquia SP</div>
              </div>
            )}
            {!collapsed && (
              <button className="icon-btn" style={{ marginLeft:'auto' }}>
                <LucideIcon name="ChevronsUpDown" size={13} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="main-area">

        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-breadcrumb">
            <LucideIcon name="ChevronRight" size={13} style={{ color:'var(--text-3)' }} />
            <span className="current">{SCREEN_LABELS[activeScreen]}</span>
          </div>

          <div className="topbar-search">
            <LucideIcon name="Search" size={13} style={{ color:'var(--text-3)', flexShrink:0 }} />
            <input placeholder="Buscar clientes, conversas, campanhas…" />
            <span style={{ fontSize:11, color:'var(--text-3)', flexShrink:0, fontFamily:'var(--font-mono)', background:'var(--surface-3)', padding:'1px 5px', borderRadius:'var(--r1)' }}>⌘K</span>
          </div>

          <div className="topbar-actions">
            {/* AI signal */}
            <div className="ai-signal">
              <AISignalBars />
              <span>IA · 67 atend.</span>
            </div>

            <button className="icon-btn" onClick={() => setNotifOpen(o => !o)}>
              <LucideIcon name="Bell" size={16} />
              <span className="notif-dot" />
            </button>

            <button className="icon-btn">
              <LucideIcon name="HelpCircle" size={16} />
            </button>

            <div className="avatar sm" style={{ cursor:'pointer' }}>JM</div>
          </div>

          {/* Notification dropdown */}
          {notifOpen && (
            <div style={{
              position:'fixed', top:'calc(var(--topbar-h) + 4px)', right:12,
              width:340, background:'var(--surface)', border:'1px solid var(--border)',
              borderRadius:'var(--r4)', boxShadow:'var(--shadow-lg)', zIndex:50,
              overflow:'hidden', animation:'fadeUp 0.15s ease'
            }}>
              <div style={{ padding:'12px 16px', borderBottom:'1px solid var(--border-sub)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <span style={{ fontWeight:600, fontSize:13 }}>Notificações</span>
                <button className="btn btn-ghost btn-xs" onClick={() => setNotifOpen(false)}>Marcar lidas</button>
              </div>
              {[
                { icon:'MessageSquare', color:'var(--p)',    text:'Nova mensagem de Ana Silva — "Quero saber mais sobre…"', time:'2 min' },
                { icon:'Zap',          color:'var(--warn)', text:'Automação "Re-engajamento 60d" disparou para 48 clientes',time:'15 min' },
                { icon:'TrendingUp',   color:'var(--info)', text:'Campanha Black Friday atingiu 68% de conversão',         time:'1h' },
                { icon:'AlertCircle',  color:'var(--err)',  text:'3 conversas aguardando resposta humana há +30min',        time:'1h' },
              ].map((n, i) => (
                <div key={i} style={{ display:'flex', gap:12, padding:'12px 16px', borderBottom:'1px solid var(--border-sub)', cursor:'pointer', transition:'background var(--t)' }}
                  onMouseEnter={e => e.currentTarget.style.background='var(--surface-2)'}
                  onMouseLeave={e => e.currentTarget.style.background=''}>
                  <div style={{ width:32, height:32, borderRadius:'var(--r2)', background:n.color+'22', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <LucideIcon name={n.icon} size={14} style={{ color:n.color }} />
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12, lineHeight:1.45 }}>{n.text}</div>
                    <div style={{ fontSize:11, color:'var(--text-3)', marginTop:2 }}>{n.time} atrás</div>
                  </div>
                </div>
              ))}
              <div style={{ padding:'10px 16px', textAlign:'center' }}>
                <button className="btn btn-ghost btn-sm" style={{ width:'100%', justifyContent:'center' }}>Ver todas</button>
              </div>
            </div>
          )}
        </header>

        {/* Screen content */}
        <div className="content" onClick={() => notifOpen && setNotifOpen(false)}>
          {ActiveScreen
            ? <ActiveScreen tweaks={tweaks} setTweak={setTweak} navigate={setActiveScreen} />
            : <div className="empty-state"><div className="empty-title">Tela não encontrada</div></div>
          }
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AppShell, LucideIcon });
