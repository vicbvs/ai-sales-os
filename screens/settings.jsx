// settings.jsx — Configurações: Aparência + WhatsApp dual-API + seções existentes
const { useState } = React;

const SETTINGS_NAV = [
  { id: 'appearance', label: 'Aparência',              icon: 'Palette' },
  { id: 'team',       label: 'Equipe',                 icon: 'Users' },
  { id: 'routing',    label: 'Roteamento',             icon: 'GitBranch' },
  { id: 'fields',     label: 'Campos personalizados',  icon: 'Sliders' },
  { id: 'whatsapp',   label: 'WhatsApp',               icon: 'MessageCircle' },
  { id: 'integrations', label: 'Integrações',          icon: 'Plug' },
  { id: 'permissions',  label: 'Permissões',           icon: 'Shield' },
];

const TEAM = [
  { id: 1, name: 'Marina Costa',  email: 'marina@franquia.com', role: 'Consultora', status: 'active', convs: 12 },
  { id: 2, name: 'Rafael Sousa',  email: 'rafael@franquia.com', role: 'Consultor',  status: 'active', convs: 8 },
  { id: 3, name: 'Juliana Alves', email: 'juliana@franquia.com',role: 'Consultora', status: 'active', convs: 6 },
  { id: 4, name: 'Pedro Ribeiro', email: 'pedro@franquia.com',  role: 'Consultor',  status: 'away',   convs: 3 },
  { id: 5, name: 'Ana Gestora',   email: 'ana@franquia.com',    role: 'Gerente',    status: 'active', convs: 0 },
  { id: 6, name: 'João Melo',     email: 'joao@franquia.com',   role: 'Admin',      status: 'active', convs: 0 },
];

const ROLES = ['Admin','Gerente','Consultor','Consultora','Suporte'];
const STATUS_DOT   = { active: 'dot-green', away: 'dot-warn', offline: 'dot-neutral' };
const STATUS_LABEL = { active: 'Ativo', away: 'Ausente', offline: 'Offline' };

const INTEGRATIONS = [
  { name: 'WhatsApp Business API', provider: 'Meta',    status: 'connected',    icon: 'MessageCircle' },
  { name: 'CRM HubSpot',           provider: 'HubSpot', status: 'connected',    icon: 'Database' },
  { name: 'Google Calendar',       provider: 'Google',  status: 'disconnected', icon: 'Calendar' },
  { name: 'Stripe Pagamentos',     provider: 'Stripe',  status: 'connected',    icon: 'CreditCard' },
  { name: 'Zapier',                provider: 'Zapier',  status: 'disconnected', icon: 'Zap' },
  { name: 'Google Sheets',         provider: 'Google',  status: 'connected',    icon: 'Table' },
];

const CUSTOM_FIELDS = [
  { id: 1, name: 'CPF / CNPJ',          type: 'Texto',  entity: 'Cliente', required: true  },
  { id: 2, name: 'Data nascimento',      type: 'Data',   entity: 'Cliente', required: false },
  { id: 3, name: 'Origem do lead',       type: 'Select', entity: 'Cliente', required: true  },
  { id: 4, name: 'Produto de interesse', type: 'Select', entity: 'Deal',    required: false },
  { id: 5, name: 'Motivo de perda',      type: 'Texto',  entity: 'Deal',    required: false },
];

const ACCENT_PRESETS = [
  { label: 'Esmeralda', hex: '#00c46e',  oklch: '0.71 0.195 160' },
  { label: 'Azul',      hex: '#3b82f6',  oklch: '0.60 0.180 250' },
  { label: 'Violeta',   hex: '#8b5cf6',  oklch: '0.58 0.200 290' },
  { label: 'Rosa',      hex: '#ec4899',  oklch: '0.60 0.210 340' },
  { label: 'Laranja',   hex: '#f97316',  oklch: '0.72 0.200 55'  },
  { label: 'Ciano',     hex: '#06b6d4',  oklch: '0.72 0.145 210' },
];

function SectionHeader({ title, sub, action }) {
  return (
    <div className="flex items-center justify-between" style={{ marginBottom: 'var(--s4)' }}>
      <div>
        <div style={{ fontWeight: 600, fontSize: 15 }}>{title}</div>
        {sub && <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>{sub}</div>}
      </div>
      {action}
    </div>
  );
}

// ── Appearance Section ───────────────────────────────────────────
function AppearanceSection({ tweaks, setTweak }) {
  const [customColor, setCustomColor] = useState('');

  const currentColor = tweaks?.accentColor || '#00c46e';
  const darkMode = tweaks?.darkMode !== false;
  const density = tweaks?.density || 'default';

  function applyAccent(hex, oklchStr) {
    setTweak && setTweak('accentColor', hex);
    // Update CSS custom property immediately
    document.documentElement.style.setProperty('--p', `oklch(${oklchStr})`);
    document.documentElement.style.setProperty('--p-hover', `oklch(${oklchStr.replace(/^[\d.]+/, v => (parseFloat(v)+0.05).toFixed(2))})`);
    document.documentElement.style.setProperty('--p-dim', `oklch(${oklchStr} / 0.12)`);
    document.documentElement.style.setProperty('--p-border', `oklch(${oklchStr} / 0.38)`);
  }

  function applyTheme(dark) {
    setTweak && setTweak('darkMode', dark);
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }

  function applyDensity(d) {
    setTweak && setTweak('density', d);
    const compact = d === 'compact';
    document.documentElement.style.setProperty('--topbar-h', compact ? '44px' : '52px');
    document.documentElement.style.setProperty('--sidebar-w', compact ? '200px' : '224px');
  }

  function resetDefaults() {
    applyAccent('#00c46e', '0.71 0.195 160');
    applyTheme(true);
    applyDensity('default');
  }

  // Mini UI preview thumbnail
  function ThemePreview({ dark, selected, onClick }) {
    const bg      = dark ? '#101318' : '#f6f7f9';
    const surface = dark ? '#161b24' : '#ffffff';
    const border  = dark ? '#252d3a' : '#e4e7ec';
    const text    = dark ? '#edf0f5' : '#1a1e28';
    const text2   = dark ? '#7c8694' : '#626978';
    return (
      <div className={`theme-preview${selected ? ' selected' : ''}`}
        style={{ width: 140, cursor: 'pointer' }}
        onClick={onClick}>
        <div style={{ background: bg, padding: 10, borderRadius: 'var(--r3)' }}>
          {/* Fake mini sidebar + content */}
          <div style={{ display: 'flex', gap: 6, height: 72 }}>
            <div style={{ width: 28, background: surface, borderRadius: 4, border: `1px solid ${border}`, flexShrink: 0 }}>
              <div style={{ margin: '6px auto', width: 14, height: 14, borderRadius: 3, background: currentColor }} />
              {[1,2,3].map(i => <div key={i} style={{ margin: '4px 6px', height: 4, borderRadius: 2, background: i===1? currentColor+'44':border }} />)}
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
              <div style={{ height: 12, background: surface, borderRadius: 3, border: `1px solid ${border}` }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, flex: 1 }}>
                {[0,1,2,3].map(i => (
                  <div key={i} style={{ background: surface, border: `1px solid ${border}`, borderRadius: 3, padding: '4px 5px' }}>
                    <div style={{ height: 3, width: '60%', background: text2, borderRadius: 2, marginBottom: 3, opacity: 0.5 }} />
                    <div style={{ height: 5, background: i===0?currentColor:text, borderRadius: 1, opacity: i===0?0.9:0.7 }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div style={{ padding: '6px 10px 8px', fontSize: 11, fontWeight: 500, color: selected ? 'var(--p)' : 'var(--text-2)', textAlign: 'center', background: 'var(--surface-2)', borderTop: `1px solid ${border}` }}>
          {dark ? 'Modo Escuro' : 'Modo Claro'}
          {selected && <span style={{ marginLeft: 4, color: 'var(--p)' }}>✓</span>}
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600 }}>
      <SectionHeader title="Aparência" sub="Personalize a interface da plataforma"
        action={
          <button className="btn btn-ghost btn-sm" onClick={resetDefaults}>
            <LucideIcon name="RotateCcw" size={13} /> Restaurar padrão
          </button>
        }
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s5)' }}>

        {/* Theme */}
        <div className="card card-body">
          <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 'var(--s3)' }}>Tema</div>
          <div style={{ display: 'flex', gap: 'var(--s4)', flexWrap: 'wrap' }}>
            <ThemePreview dark={true}  selected={darkMode}  onClick={() => applyTheme(true)} />
            <ThemePreview dark={false} selected={!darkMode} onClick={() => applyTheme(false)} />
          </div>
        </div>

        {/* Accent color */}
        <div className="card card-body">
          <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>Cor principal</div>
          <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 'var(--s3)' }}>
            Usada em botões, links ativos, badges e destaques.
          </div>
          <div style={{ display: 'flex', gap: 'var(--s3)', flexWrap: 'wrap', marginBottom: 'var(--s4)' }}>
            {ACCENT_PRESETS.map(c => (
              <div key={c.hex} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div
                  className={`color-swatch${currentColor === c.hex ? ' selected' : ''}`}
                  style={{ background: c.hex }}
                  onClick={() => applyAccent(c.hex, c.oklch)}
                />
                <span style={{ fontSize: 10, color: 'var(--text-3)' }}>{c.label}</span>
              </div>
            ))}
          </div>
          {/* Custom color input */}
          <div style={{ display: 'flex', gap: 'var(--s2)', alignItems: 'center' }}>
            <div style={{ width: 28, height: 28, borderRadius: 'var(--r-full)', background: currentColor, border: '1px solid var(--border)', flexShrink: 0 }} />
            <input
              className="input"
              style={{ width: 120, fontFamily: 'var(--font-mono)', fontSize: 12 }}
              value={customColor || currentColor}
              onChange={e => setCustomColor(e.target.value)}
              placeholder="#000000"
            />
            <button className="btn btn-secondary btn-sm"
              onClick={() => {
                const hex = customColor || currentColor;
                // Basic fallback: apply as CSS color directly
                document.documentElement.style.setProperty('--p', hex);
                setTweak && setTweak('accentColor', hex);
              }}>
              Aplicar
            </button>
            <span style={{ fontSize: 11, color: 'var(--text-3)' }}>Cor personalizada (hex)</span>
          </div>
        </div>

        {/* Density */}
        <div className="card card-body">
          <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>Densidade da interface</div>
          <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 'var(--s3)' }}>
            Afeta espaçamento, tamanho da barra lateral e altura dos elementos.
          </div>
          <div style={{ display: 'flex', gap: 'var(--s2)' }}>
            {[
              { id: 'compact',     label: 'Compacta',    sub: 'Mais informações na tela' },
              { id: 'default',     label: 'Padrão',      sub: 'Equilíbrio conforto/densidade' },
            ].map(d => (
              <div key={d.id} className={`density-pill${density === d.id ? ' selected' : ''}`}
                onClick={() => applyDensity(d.id)}
                style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 'var(--s3)', textAlign: 'left' }}>
                <div style={{ fontWeight: 600, fontSize: 12 }}>{d.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{d.sub}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// ── WhatsApp Config Section ──────────────────────────────────────
function WhatsAppSection() {
  const [apiType, setApiType] = useState('official');
  const [officialConnected, setOfficialConnected] = useState(true);
  const [evoConnected, setEvoConnected] = useState(false);
  const [evoTestLoading, setEvoTestLoading] = useState(false);
  const [evoTestResult, setEvoTestResult] = useState(null);
  const [showKey, setShowKey] = useState(false);

  function testEvoConnection() {
    setEvoTestLoading(true);
    setEvoTestResult(null);
    setTimeout(() => {
      setEvoTestLoading(false);
      setEvoTestResult('error');
    }, 1800);
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <SectionHeader title="WhatsApp" sub="Configuração da conexão e integração" />

      {/* API type selector */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s3)', marginBottom: 'var(--s5)' }}>
        {[
          { id: 'official', label: 'WhatsApp Cloud API', sub: 'API oficial Meta — recomendado', icon: 'BadgeCheck', stable: true },
          { id: 'evolution',label: 'Evolution API',       sub: 'Conexão não oficial via QR code', icon: 'Zap', stable: false },
        ].map(opt => (
          <div key={opt.id}
            onClick={() => setApiType(opt.id)}
            style={{
              border: `1px solid ${apiType === opt.id ? 'var(--p-border)' : 'var(--border-sub)'}`,
              background: apiType === opt.id ? 'var(--p-dim)' : 'var(--surface)',
              borderRadius: 'var(--r3)', padding: 'var(--s4)', cursor: 'pointer',
              transition: 'all var(--t)'
            }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <LucideIcon name={opt.icon} size={16} style={{ color: apiType === opt.id ? 'var(--p)' : 'var(--text-3)' }} />
              <span style={{ fontWeight: 600, fontSize: 13 }}>{opt.label}</span>
              <div style={{ marginLeft: 'auto', width: 16, height: 16, borderRadius: 'var(--r-full)', border: `2px solid ${apiType === opt.id ? 'var(--p)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {apiType === opt.id && <div style={{ width: 8, height: 8, borderRadius: 'var(--r-full)', background: 'var(--p)' }} />}
              </div>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{opt.sub}</div>
            {!opt.stable && (
              <div style={{ marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 5, background: 'var(--warn-dim)', border: '1px solid var(--warn-border)', borderRadius: 'var(--r1)', padding: '3px 8px', fontSize: 11, color: 'var(--warn)' }}>
                <LucideIcon name="AlertTriangle" size={11} />
                API não oficial
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Official API panel */}
      {apiType === 'official' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s4)' }}>
          {/* Status card */}
          <div style={{ display: 'flex', gap: 12, background: officialConnected ? 'var(--p-dim)' : 'var(--surface-2)', border: `1px solid ${officialConnected ? 'var(--p-border)' : 'var(--border)'}`, borderRadius: 'var(--r3)', padding: 'var(--s4)' }}>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--r3)', background: 'var(--p)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <LucideIcon name="MessageCircle" size={20} style={{ color: 'var(--p-text)' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 13 }}>+55 11 3000-0001 — Franquia SP</div>
              <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>
                WhatsApp Business verificado · Cloud API v20.0
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                <span className={`badge ${officialConnected ? 'badge-green' : 'badge-neutral'}`}>
                  <span className={`dot ${officialConnected ? 'dot-green' : 'dot-neutral'} pulse`} style={{ width: 5, height: 5 }} />
                  {officialConnected ? 'Conectado' : 'Desconectado'}
                </span>
                {officialConnected && (
                  <>
                    <span style={{ fontSize: 11, color: 'var(--text-3)' }}>Qualidade: Alta</span>
                    <span style={{ fontSize: 11, color: 'var(--text-3)' }}>· Última sync: 2 min atrás</span>
                  </>
                )}
              </div>
            </div>
            <button className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start' }}>
              {officialConnected ? 'Reconfigurar' : 'Conectar'}
            </button>
          </div>

          <div className="card card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s3)' }}>
            <div className="form-group">
              <div className="form-label">Phone Number ID</div>
              <div style={{ position: 'relative' }}>
                <input className="input" defaultValue="102938473829201" type={showKey ? 'text' : 'password'} />
              </div>
            </div>
            <div className="form-group">
              <div className="form-label">Access Token (Bearer)</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <input className="input" defaultValue="EAABzxxxxxxxxxxxxxxxxxxxxxx" type={showKey ? 'text' : 'password'} />
                <button className="btn btn-secondary btn-sm" onClick={() => setShowKey(s => !s)}>
                  <LucideIcon name={showKey ? 'EyeOff' : 'Eye'} size={13} />
                </button>
              </div>
            </div>
            <div className="form-group">
              <div className="form-label">Webhook URL</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <input className="input" defaultValue="https://api.salesos.com.br/whatsapp/webhook" readOnly />
                <button className="btn btn-secondary btn-sm"><LucideIcon name="Copy" size={13} /></button>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-3)' }}>Configure esta URL no painel Meta Developers</div>
            </div>
            <div className="form-group">
              <div className="form-label">Webhook Verify Token</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <input className="input" defaultValue="sk_verify_xxx" type={showKey ? 'text' : 'password'} />
                <button className="btn btn-secondary btn-sm"><LucideIcon name="Copy" size={13} /></button>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 'var(--s2)' }}>
            <button className="btn btn-primary btn-sm">Salvar configurações</button>
            <button className="btn btn-secondary btn-sm">Testar conexão</button>
          </div>
        </div>
      )}

      {/* Evolution API panel */}
      {apiType === 'evolution' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s4)' }}>

          {/* Warning */}
          <div style={{ display: 'flex', gap: 12, background: 'var(--warn-dim)', border: '1px solid var(--warn-border)', borderRadius: 'var(--r3)', padding: 'var(--s4)' }}>
            <LucideIcon name="AlertTriangle" size={18} style={{ color: 'var(--warn)', flexShrink: 0, marginTop: 1 }} />
            <div>
              <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--warn)', marginBottom: 4 }}>API não oficial — uso por conta e risco</div>
              <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6 }}>
                A Evolution API conecta via automação do WhatsApp Web e pode sofrer instabilidades, bloqueios de conta ou interrupções sem aviso. Não é suportada ou endossada pela Meta.
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                {['Risco de banimento da conta', 'Sem SLA de disponibilidade', 'Violação dos Termos de Uso da Meta'].map(w => (
                  <span key={w} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--warn)', background: 'oklch(0.80 0.155 82 / 0.08)', border: '1px solid var(--warn-border)', borderRadius: 'var(--r-full)', padding: '2px 8px' }}>
                    <LucideIcon name="Dot" size={10} />{w}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Status */}
          <div style={{ display: 'flex', gap: 12, background: 'var(--surface-2)', border: '1px solid var(--border-sub)', borderRadius: 'var(--r3)', padding: 'var(--s4)', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 13 }}>Estado da instância</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <span className={`badge ${evoConnected ? 'badge-green' : 'badge-err'}`}>
                  {evoConnected ? 'Conectado' : 'Desconectado'}
                </span>
                {!evoConnected && <span style={{ fontSize: 11, color: 'var(--text-3)' }}>Escaneie o QR code para conectar</span>}
                {evoConnected && <span style={{ fontSize: 11, color: 'var(--text-3)' }}>+55 11 9 9999-0000 · Última sync: 5 min</span>}
              </div>
            </div>
            {!evoConnected && (
              <div style={{ width: 80, height: 80, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {/* QR code placeholder */}
                <svg width="60" height="60" viewBox="0 0 60 60">
                  {[0,1,2,3,4,5,6].map(row =>
                    [0,1,2,3,4,5,6].map(col => {
                      const b = (row+col+row*col) % 3 === 0;
                      return b ? <rect key={`${row}-${col}`} x={col*8} y={row*8} width="7" height="7" rx="1" fill="var(--text)" opacity={0.85} /> : null;
                    })
                  )}
                </svg>
              </div>
            )}
          </div>

          <div className="card card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s3)' }}>
            <div className="form-group">
              <div className="form-label">URL da instância Evolution</div>
              <input className="input" placeholder="https://evo.suaempresa.com.br" />
            </div>
            <div className="form-group">
              <div className="form-label">API Key (Global Key)</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <input className="input" type="password" placeholder="••••••••••••••••" />
                <button className="btn btn-secondary btn-sm"><LucideIcon name="Eye" size={13} /></button>
              </div>
            </div>
            <div className="form-group">
              <div className="form-label">Nome da instância</div>
              <input className="input" placeholder="franquia-sp-01" />
            </div>
            <div className="form-group">
              <div className="form-label">Webhook URL (receber eventos)</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <input className="input" defaultValue="https://api.salesos.com.br/evo/webhook" readOnly />
                <button className="btn btn-secondary btn-sm"><LucideIcon name="Copy" size={13} /></button>
              </div>
            </div>
          </div>

          {/* Test result */}
          {evoTestResult === 'error' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--err-dim)', border: '1px solid var(--err-border)', borderRadius: 'var(--r2)', padding: '10px 14px', fontSize: 12 }}>
              <LucideIcon name="XCircle" size={14} style={{ color: 'var(--err)', flexShrink: 0 }} />
              <span>Não foi possível conectar. Verifique a URL e a API Key.</span>
            </div>
          )}

          <div style={{ display: 'flex', gap: 'var(--s2)' }}>
            <button className="btn btn-primary btn-sm">Salvar e reconectar</button>
            <button className="btn btn-secondary btn-sm" onClick={testEvoConnection} disabled={evoTestLoading}>
              {evoTestLoading
                ? <><LucideIcon name="Loader2" size={13} style={{ animation: 'spin 1s linear infinite' }} /> Testando…</>
                : <><LucideIcon name="Wifi" size={13} /> Testar conexão</>
              }
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Settings ────────────────────────────────────────────────
function Settings({ tweaks, setTweak: setTweakProp }) {
  const [section, setSection] = useState('appearance');
  const [showAddUser, setShowAddUser] = useState(false);
  const [team, setTeam] = useState(TEAM);

  // Allow settings to call setTweak from the outer App via prop or window
  const setTweak = setTweakProp || (window.useTweaks ? undefined : undefined);

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Section nav */}
      <div style={{ width: 220, borderRight: '1px solid var(--border-sub)', padding: 'var(--s4) 0', flexShrink: 0 }}>
        <div style={{ padding: '0 var(--s4)', marginBottom: 'var(--s3)', fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Configurações</div>
        {SETTINGS_NAV.map(s => (
          <div key={s.id} className={`nav-item${section === s.id ? ' active' : ''}`} onClick={() => setSection(s.id)}>
            <LucideIcon name={s.icon} size={15} />
            <span style={{ fontSize: 13 }}>{s.label}</span>
          </div>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div className="page">

          {section === 'appearance' && (
            <AppearanceSection tweaks={tweaks} setTweak={setTweak} />
          )}

          {section === 'team' && (
            <div>
              <SectionHeader title="Equipe" sub={`${team.length} membros`}
                action={<button className="btn btn-primary btn-sm" onClick={() => setShowAddUser(true)}><LucideIcon name="UserPlus" size={13} /> Convidar</button>} />
              <div className="card" style={{ overflow: 'hidden' }}>
                <table>
                  <thead><tr><th>Membro</th><th>Email</th><th>Função</th><th>Status</th><th>Conversas</th><th></th></tr></thead>
                  <tbody>
                    {team.map(u => (
                      <tr key={u.id}>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="avatar sm">{u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
                            <span style={{ fontWeight: 500 }}>{u.name}</span>
                          </div>
                        </td>
                        <td style={{ fontSize: 12, color: 'var(--text-2)' }}>{u.email}</td>
                        <td><span className="tag">{u.role}</span></td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className={`dot ${STATUS_DOT[u.status]}`} />
                            <span style={{ fontSize: 12 }}>{STATUS_LABEL[u.status]}</span>
                          </div>
                        </td>
                        <td style={{ fontSize: 12 }}>{u.convs} ativas</td>
                        <td>
                          <div className="flex gap-1">
                            <button className="icon-btn" style={{ width: 26, height: 26 }}><LucideIcon name="Edit" size={13} /></button>
                            <button className="icon-btn" style={{ width: 26, height: 26 }}><LucideIcon name="Trash2" size={13} style={{ color: 'var(--err)' }} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {section === 'routing' && (
            <div style={{ maxWidth: 640 }}>
              <SectionHeader title="Roteamento de Conversas" sub="Defina como novas conversas são distribuídas" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s4)' }}>
                <div className="card card-body">
                  <div style={{ fontWeight: 600, marginBottom: 'var(--s3)' }}>Modo de distribuição</div>
                  {['Round-robin (distribuição uniforme)', 'Por disponibilidade (menor carga)', 'Manual (sem atribuição automática)', 'Por território (cidade/região)'].map((opt, i) => (
                    <label key={i} className="checkbox-row" style={{ marginBottom: 10 }}>
                      <input type="radio" name="routing" defaultChecked={i === 0} style={{ accentColor: 'var(--p)' }} />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
                <div className="card card-body">
                  <div style={{ fontWeight: 600, marginBottom: 'var(--s3)' }}>Territórios</div>
                  {[
                    { region: 'São Paulo Capital', consultants: 'Marina Costa, Rafael Sousa', leads: 842 },
                    { region: 'Interior SP',        consultants: 'Juliana Alves',             leads: 312 },
                    { region: 'Sul do Brasil',       consultants: 'Pedro Ribeiro',             leads: 218 },
                  ].map((t, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 'var(--s3) 0', borderBottom: '1px solid var(--border-sub)' }}>
                      <LucideIcon name="MapPin" size={14} style={{ color: 'var(--p)' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{t.region}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{t.consultants}</div>
                      </div>
                      <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{t.leads} leads</span>
                      <button className="btn btn-ghost btn-xs">Editar</button>
                    </div>
                  ))}
                  <button className="btn btn-secondary btn-sm" style={{ marginTop: 'var(--s3)' }}>
                    <LucideIcon name="Plus" size={13} /> Novo Território
                  </button>
                </div>
                <div className="card card-body">
                  <div style={{ fontWeight: 600, marginBottom: 'var(--s3)' }}>Horários de atendimento</div>
                  {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((d, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                      <span style={{ width: 36, fontSize: 12 }}>{d}</span>
                      <input type="checkbox" defaultChecked={i < 5} style={{ accentColor: 'var(--p)' }} />
                      <input type="time" className="input" style={{ width: 100, height: 28 }} defaultValue={i < 5 ? '09:00' : '10:00'} />
                      <span style={{ fontSize: 12, color: 'var(--text-3)' }}>até</span>
                      <input type="time" className="input" style={{ width: 100, height: 28 }} defaultValue={i < 5 ? '18:00' : '14:00'} />
                    </div>
                  ))}
                </div>
                <button className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-start' }}>Salvar roteamento</button>
              </div>
            </div>
          )}

          {section === 'fields' && (
            <div>
              <SectionHeader title="Campos Personalizados" sub="Campos adicionais para clientes e deals"
                action={<button className="btn btn-primary btn-sm"><LucideIcon name="Plus" size={13} /> Novo Campo</button>} />
              <div className="card" style={{ overflow: 'hidden' }}>
                <table>
                  <thead><tr><th>Nome</th><th>Tipo</th><th>Entidade</th><th>Obrigatório</th><th></th></tr></thead>
                  <tbody>
                    {CUSTOM_FIELDS.map(f => (
                      <tr key={f.id}>
                        <td style={{ fontWeight: 500 }}>{f.name}</td>
                        <td><span className="tag">{f.type}</span></td>
                        <td style={{ fontSize: 12 }}>{f.entity}</td>
                        <td>{f.required ? <span className="badge badge-err">Sim</span> : <span className="badge badge-neutral">Não</span>}</td>
                        <td>
                          <div className="flex gap-1">
                            <button className="icon-btn" style={{ width: 26, height: 26 }}><LucideIcon name="Edit" size={13} /></button>
                            <button className="icon-btn" style={{ width: 26, height: 26 }}><LucideIcon name="Trash2" size={13} style={{ color: 'var(--err)' }} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {section === 'whatsapp' && <WhatsAppSection />}

          {section === 'integrations' && (
            <div>
              <SectionHeader title="Integrações" sub="Conecte ferramentas externas" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s3)' }}>
                {INTEGRATIONS.map((intg, i) => (
                  <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border-sub)', borderRadius: 'var(--r4)', padding: 'var(--s4)', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 'var(--r3)', background: 'var(--surface-2)', border: '1px solid var(--border-sub)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <LucideIcon name={intg.icon} size={18} style={{ color: 'var(--text-2)' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{intg.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 8 }}>{intg.provider}</div>
                      <span className={`badge ${intg.status === 'connected' ? 'badge-green' : 'badge-neutral'}`}>
                        {intg.status === 'connected' ? 'Conectado' : 'Desconectado'}
                      </span>
                    </div>
                    <button className={`btn btn-xs ${intg.status === 'connected' ? 'btn-secondary' : 'btn-primary'}`}>
                      {intg.status === 'connected' ? 'Configurar' : 'Conectar'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {section === 'permissions' && (
            <div>
              <SectionHeader title="Permissões por Função" sub="Controle de acesso baseado em papel" />
              <div className="card" style={{ overflow: 'hidden' }}>
                <div className="table-wrap">
                  <table>
                    <thead><tr>
                      <th>Permissão</th>
                      {ROLES.map(r => <th key={r} style={{ textAlign: 'center' }}>{r}</th>)}
                    </tr></thead>
                    <tbody>
                      {[
                        { label: 'Ver conversas',         access: [true, true, true,  true,  true]  },
                        { label: 'Responder conversas',   access: [true, true, true,  true,  false] },
                        { label: 'Criar campanhas',       access: [true, true, false, false, false] },
                        { label: 'Gerenciar equipe',      access: [true, true, false, false, false] },
                        { label: 'Configurar agentes IA', access: [true, false,false, false, false] },
                        { label: 'Ver relatórios',        access: [true, true, true,  false, false] },
                        { label: 'Exportar dados',        access: [true, true, false, false, false] },
                        { label: 'Configurações gerais',  access: [true, false,false, false, false] },
                      ].map((row, i) => (
                        <tr key={i}>
                          <td style={{ fontSize: 13 }}>{row.label}</td>
                          {row.access.map((a, j) => (
                            <td key={j} style={{ textAlign: 'center' }}>
                              {a
                                ? <LucideIcon name="Check" size={14} style={{ color: 'var(--p)' }} />
                                : <LucideIcon name="Minus" size={14} style={{ color: 'var(--border)' }} />
                              }
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {showAddUser && (
        <div className="modal-overlay" onClick={() => setShowAddUser(false)}>
          <div className="modal" style={{ width: 440 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Convidar Membro</span>
              <button className="icon-btn" onClick={() => setShowAddUser(false)}><LucideIcon name="X" size={16} /></button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s3)' }}>
              <div className="form-group"><div className="form-label">Nome completo</div><input className="input" placeholder="Ex: Lucas Martins" /></div>
              <div className="form-group"><div className="form-label">Email</div><input className="input" type="email" placeholder="lucas@franquia.com" /></div>
              <div className="form-group"><div className="form-label">Função</div><select className="select">{ROLES.map(r => <option key={r}>{r}</option>)}</select></div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowAddUser(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={() => setShowAddUser(false)}><LucideIcon name="Send" size={13} /> Enviar Convite</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Add spin keyframe for loader
const styleTag = document.createElement('style');
styleTag.textContent = '@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }';
document.head.appendChild(styleTag);

Object.assign(window, { Settings });
