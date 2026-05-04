// dashboard.jsx — refined with semantic colors, distinct channel chart, animations
const { useState, useEffect, useRef } = React;

const SPARKDATA = [
  [40,55,38,72,61,88,75,92,68,84,95,78],
  [20,35,28,42,38,55,48,62,44,58,70,52],
  [15,22,18,30,25,40,35,48,32,44,56,42],
  [8,12,9,18,14,22,19,28,16,24,32,20],
];

// ── Count-up hook ────────────────────────────────────────────────
function useCountUp(target, duration = 900, delay = 0) {
  const [val, setVal] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      started.current = true;
      const start = performance.now();
      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setVal(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(timer);
  }, [target, duration, delay]);
  return val;
}

// ── Sparkline with animated fill ────────────────────────────────
function Spark({ data, color = 'var(--p)', delay = 0 }) {
  const max = Math.max(...data);
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), delay + 200);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div className="sparkline" style={{ height: 36 }}>
      {data.map((v, i) => (
        <div key={i} className="spark-bar"
          style={{
            height: revealed ? `${(v / max) * 100}%` : '4%',
            background: i === data.length - 1 ? color : undefined,
            opacity: i === data.length - 1 ? 1 : 0.28 + (i / data.length) * 0.52,
            transition: `height ${300 + i * 30}ms cubic-bezier(0.4,0,0.2,1) ${delay + i * 18}ms`,
          }}
        />
      ))}
    </div>
  );
}

function MiniDonut({ pct, size = 40, color = 'var(--p)' }) {
  const r = 16, c = 2 * Math.PI * r;
  const [animPct, setAnimPct] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setAnimPct(pct), 300);
    return () => clearTimeout(t);
  }, [pct]);
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <circle cx="20" cy="20" r={r} fill="none" stroke="var(--surface-2)" strokeWidth="5" />
      <circle cx="20" cy="20" r={r} fill="none" stroke={color} strokeWidth="5"
        strokeDasharray={`${c * animPct / 100} ${c}`}
        strokeLinecap="round"
        transform="rotate(-90 20 20)"
        style={{ transition: 'stroke-dasharray 0.8s cubic-bezier(0.4,0,0.2,1)' }} />
      <text x="20" y="24" textAnchor="middle" fill="var(--text)" fontSize="10"
        fontWeight="700" fontFamily="DM Sans, sans-serif">{pct}%</text>
    </svg>
  );
}

// KPI card definitions — semantic color per meaning
const KPIS = [
  { label: 'Conversas Hoje',    value: '284',    numVal: 284,    suffix: '',      delta: '+18%', up: true,  icon: 'MessageSquare', color: 'var(--p)',    spark: SPARKDATA[0], screen: 'inbox' },
  { label: 'Aguard. Resposta',  value: '12',     numVal: 12,     suffix: '',      delta: '-4',   up: true,  icon: 'Clock',         color: 'var(--warn)', spark: SPARKDATA[1], screen: 'inbox' },
  { label: 'Deals no Pipeline', value: 'R$142k', numVal: 142,    suffix: 'k',     delta: '+22%', up: true,  icon: 'TrendingUp',    color: 'var(--info)', spark: SPARKDATA[2], screen: 'pipeline' },
  { label: 'Taxa de Conversão', value: '34,8%',  numVal: 34.8,   suffix: '%',     delta: '+2,1%',up: true,  icon: 'Target',        color: 'var(--p)',    spark: SPARKDATA[3], screen: 'reports',  prefix:'', decimals: 1 },
];

const ACTIVITY = [
  { icon: 'MessageSquare', color: 'var(--p)',    text: 'Ana Silva enviou mensagem no pipeline "Negociação"',         time: '1 min' },
  { icon: 'DollarSign',    color: 'var(--info)', text: 'Novo deal criado — Carlos Mendes (R$ 8.500)',                 time: '4 min' },
  { icon: 'Megaphone',     color: 'var(--warn)', text: 'Campanha "Reativação Nov" iniciou envio — 1.240 contatos',   time: '12 min' },
  { icon: 'Bot',           color: 'var(--p)',    text: 'Agente IA resolveu 7 conversas sem intervenção humana',       time: '18 min' },
  { icon: 'ArrowRightLeft',color: 'var(--text-2)',text: 'Conversa transferida para Consultora Marina — cliente VIP', time: '24 min' },
  { icon: 'CheckCircle',   color: 'var(--p)',    text: 'Deal "Pacote Premium" marcado como ganho — R$ 12.000',       time: '31 min' },
  { icon: 'Zap',           color: 'var(--warn)', text: 'Automação "Inativo 60d" disparou para 48 clientes',          time: '45 min' },
];

const ALERTS = [
  { icon: 'AlertCircle', severity: 'err',  text: '3 conversas aguardando humano há mais de 30 minutos' },
  { icon: 'Clock',       severity: 'warn', text: 'Campanha "Black Friday" agendada para amanhã às 09:00' },
];

const TOP_CONSULTANTS = [
  { name: 'Marina Costa',  initials: 'MC', deals: 14, revenue: 'R$42k', rate: 67 },
  { name: 'Rafael Sousa',  initials: 'RS', deals: 11, revenue: 'R$31k', rate: 58 },
  { name: 'Juliana Alves', initials: 'JA', deals: 9,  revenue: 'R$28k', rate: 53 },
  { name: 'Pedro Ribeiro', initials: 'PR', deals: 7,  revenue: 'R$19k', rate: 44 },
];

const CHANNEL_DATA   = [58, 22, 12, 8];
const CHANNEL_LABELS = ['WhatsApp', 'Instagram DM', 'Site', 'Outros'];
// Distinct, harmonious colors — primary + semantic palette
const CHANNEL_COLORS = ['var(--p)', 'var(--info)', 'var(--warn)', 'var(--text-3)'];

const STAGE_COLORS = {
  'Novo Contato': 'var(--text-3)',
  'Contatado':    'var(--info)',
  'Negociação':   'var(--warn)',
  'Ganho':        'var(--p)',
  'Perdido':      'var(--err)',
};

// ── Animated Channel Donut ───────────────────────────────────────
function ChannelDonut() {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 400); return () => clearTimeout(t); }, []);

  const r = 44, circumference = 2 * Math.PI * r;
  let offset = 0;
  const segments = CHANNEL_DATA.map((v, i) => {
    const dash = (v / 100) * circumference;
    const seg = { v, color: CHANNEL_COLORS[i], dash, offset };
    offset += v;
    return seg;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0 16px', position: 'relative' }}>
        <svg width="130" height="130" viewBox="0 0 130 130">
          {/* Track */}
          <circle cx="65" cy="65" r={r} fill="none" stroke="var(--surface-2)" strokeWidth="14" />
          {segments.map((seg, i) => (
            <circle key={i} cx="65" cy="65" r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth="14"
              strokeLinecap="butt"
              strokeDasharray={animated
                ? `${seg.dash - 1.5} ${circumference - (seg.dash - 1.5)}`
                : `0 ${circumference}`}
              strokeDashoffset={-seg.offset * circumference / 100}
              transform="rotate(-90 65 65)"
              style={{ transition: `stroke-dasharray 0.9s cubic-bezier(0.4,0,0.2,1) ${i * 120}ms` }}
            />
          ))}
          <text x="65" y="60" textAnchor="middle" fill="var(--text)" fontSize="20" fontWeight="700" fontFamily="DM Sans">284</text>
          <text x="65" y="76" textAnchor="middle" fill="var(--text-3)" fontSize="10" fontFamily="DM Sans">conversas</text>
        </svg>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {CHANNEL_DATA.map((v, i) => (
          <div key={i} className="flex items-center gap-2">
            <div style={{ width: 10, height: 10, borderRadius: 2, background: CHANNEL_COLORS[i], flexShrink: 0 }} />
            <span style={{ fontSize: 12, flex: 1 }}>{CHANNEL_LABELS[i]}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 48, height: 3, borderRadius: 2, background: 'var(--surface-2)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: animated ? `${v}%` : '0%', background: CHANNEL_COLORS[i], borderRadius: 2, transition: `width 0.8s cubic-bezier(0.4,0,0.2,1) ${i * 80}ms` }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, width: 28, textAlign: 'right' }}>{v}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Signal Band ──────────────────────────────────────────────────
function SignalBand({ navigate }) {
  return (
    <div className="signal-band" style={{ marginBottom: 'var(--s5)' }}>
      <div className="signal-scan" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, position: 'relative' }}>
        <span className="dot dot-green pulse" />
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--p)' }}>Ao Vivo</span>
      </div>
      <div className="signal-divider" />
      {[
        { value: '284', label: 'Conversas',   color: 'var(--p)',    screen: 'inbox' },
        { value: '67',  label: 'IA Ativa',    color: 'var(--info)', screen: null },
        { value: '12',  label: 'Aguardando',  color: 'var(--warn)', screen: null },
        { value: '81%', label: 'Resolução IA',color: 'var(--p)',    screen: null },
        { value: 'R$142k', label: 'Pipeline', color: 'var(--info)', screen: 'pipeline' },
        { value: '34,8%',  label: 'Conversão',color: 'var(--p)',    screen: 'reports' },
      ].map((m, i, arr) => (
        <React.Fragment key={i}>
          <div className="signal-metric"
            onClick={() => m.screen && navigate(m.screen)}
            style={{ cursor: m.screen ? 'pointer' : 'default', position: 'relative' }}>
            <div className="signal-metric-value" style={{ color: m.color }}>{m.value}</div>
            <div className="signal-metric-label">{m.label}</div>
          </div>
          {i < arr.length - 1 && <div className="signal-divider" />}
        </React.Fragment>
      ))}
      <div style={{ marginLeft: 'auto', position: 'relative' }}>
        <button className="btn btn-ghost btn-xs" onClick={() => navigate('reports')}>
          <LucideIcon name="BarChart3" size={12} /> Relatório
        </button>
      </div>
    </div>
  );
}

// ── KPI Card with count-up + sparkline ──────────────────────────
function KPICard({ k, idx, navigate }) {
  const color = k.color;
  return (
    <div className="stat-card-v2"
      style={{
        '--kpi-color': color,
        animation: `fadeUp 0.35s ease both`,
        animationDelay: `${idx * 60}ms`,
      }}
      onClick={() => k.screen && navigate(k.screen)}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--s3)' }}>
        <div className="stat-label">{k.label}</div>
        <div style={{ width: 30, height: 30, borderRadius: 'var(--r2)', background: `${color === 'var(--p)' ? 'var(--p-dim)' : color + '18'}`, border: `1px solid ${color === 'var(--p)' ? 'var(--p-border)' : color + '40'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LucideIcon name={k.icon} size={14} style={{ color }} />
        </div>
      </div>
      <div className="stat-value" style={{ color }}>{k.value}</div>
      <div className="flex items-center justify-between" style={{ marginTop: 'var(--s3)' }}>
        <div className={`stat-delta ${k.up ? 'up' : 'down'}`} style={{ color: k.up ? color : 'var(--err)' }}>
          <LucideIcon name={k.up ? 'TrendingUp' : 'TrendingDown'} size={11} />
          {k.delta} vs ontem
        </div>
      </div>
      <div style={{ marginTop: 'var(--s3)' }}>
        <Spark data={k.spark} color={color} delay={idx * 80} />
      </div>
    </div>
  );
}

// ── Main Dashboard ───────────────────────────────────────────────
function Dashboard({ navigate }) {
  const [period, setPeriod] = useState('today');
  const [dismissedAlerts, setDismissedAlerts] = useState([]);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const visibleAlerts = ALERTS.filter((_, i) => !dismissedAlerts.includes(i));

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header" style={{ animation: 'fadeUp 0.3s ease both' }}>
        <div>
          <div className="page-title">Painel</div>
          <div className="page-subtitle">Visão operacional em tempo real — Domingo, 4 de Maio 2026</div>
        </div>
        <div className="flex gap-2">
          {[['today','Hoje'],['week','Semana'],['month','Mês']].map(([p, l]) => (
            <button key={p} className={`btn btn-sm ${period === p ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setPeriod(p)}>{l}</button>
          ))}
          <button className="btn btn-secondary btn-sm">
            <LucideIcon name="Download" size={13} /> Exportar
          </button>
        </div>
      </div>

      {/* Live signal band */}
      <div style={{ animation: 'fadeUp 0.3s ease 0.05s both' }}>
        <SignalBand navigate={navigate} />
      </div>

      {/* Alerts */}
      {visibleAlerts.map((a, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: `var(--${a.severity}-dim)`,
          border: `1px solid var(--${a.severity}-border)`,
          borderRadius: 'var(--r3)', padding: '9px 14px', marginBottom: 8,
          animation: 'fadeUp 0.3s ease both',
          animationDelay: `${0.1 + i * 0.04}s`,
        }}>
          <LucideIcon name={a.icon} size={14} style={{ color: `var(--${a.severity})`, flexShrink: 0 }} />
          <span style={{ fontSize: 13, flex: 1 }}>{a.text}</span>
          <button className="btn btn-ghost btn-xs" style={{ color: `var(--${a.severity})` }}>Ver</button>
          <button className="icon-btn" style={{ width: 24, height: 24 }}
            onClick={() => setDismissedAlerts(d => [...d, ALERTS.indexOf(a)])}>
            <LucideIcon name="X" size={12} />
          </button>
        </div>
      ))}

      {/* KPI row */}
      <div className="grid-4" style={{ marginBottom: 'var(--s5)' }}>
        {KPIS.map((k, i) => (
          <KPICard key={i} k={k} idx={i} navigate={navigate} />
        ))}
      </div>

      {/* Second row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 360px', gap: 'var(--s4)', marginBottom: 'var(--s5)', animation: 'fadeUp 0.35s ease 0.25s both' }}>

        {/* Pipeline por estágio */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Pipeline por Estágio</span>
            <button className="btn btn-ghost btn-xs" onClick={() => navigate('pipeline')}>Ver Pipeline →</button>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s3)' }}>
            {[
              { label: 'Novo Contato', value: 'R$28k', count: 18, pct: 28 },
              { label: 'Contatado',    value: 'R$54k', count: 34, pct: 54 },
              { label: 'Negociação',   value: 'R$38k', count: 22, pct: 38 },
              { label: 'Ganho',        value: 'R$19k', count: 11, pct: 19 },
              { label: 'Perdido',      value: 'R$8k',  count: 5,  pct: 8  },
            ].map((row, i) => (
              <div key={i}>
                <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
                  <div className="flex items-center gap-2">
                    <div style={{ width: 7, height: 7, borderRadius: 'var(--r-full)', background: STAGE_COLORS[row.label], flexShrink: 0 }} />
                    <span style={{ fontSize: 12 }}>{row.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{row.count} deals</span>
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{row.value}</span>
                  </div>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: mounted ? `${row.pct}%` : '0%', background: STAGE_COLORS[row.label], transition: `width 0.7s cubic-bezier(0.4,0,0.2,1) ${0.3 + i * 0.08}s` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top consultores */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Top Consultores</span>
            <button className="btn btn-ghost btn-xs" onClick={() => navigate('reports')}>Relatório →</button>
          </div>
          <div style={{ padding: 'var(--s2) 0' }}>
            {TOP_CONSULTANTS.map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 'var(--s2) var(--s5)', transition: 'background var(--t)', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
                onMouseLeave={e => e.currentTarget.style.background = ''}>
                <span style={{ fontSize: 11, color: 'var(--text-3)', width: 14, fontWeight: 600 }}>#{i + 1}</span>
                <div className="avatar sm">{c.initials}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 500 }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{c.deals} deals · {c.revenue}</div>
                </div>
                <MiniDonut pct={c.rate} size={40} />
              </div>
            ))}
          </div>
        </div>

        {/* Canais — distinct colors per channel */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Canais de Entrada</span>
            <span className="badge badge-neutral">Hoje</span>
          </div>
          <div className="card-body">
            <ChannelDonut />
          </div>
        </div>
      </div>

      {/* Activity + right column */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 'var(--s4)', animation: 'fadeUp 0.35s ease 0.35s both' }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Feed de Atividade</span>
            <div className="flex items-center gap-2">
              <span className="dot dot-green pulse" />
              <span style={{ fontSize: 11, color: 'var(--text-3)' }}>Tempo real</span>
            </div>
          </div>
          <div style={{ padding: 'var(--s2) 0' }}>
            {ACTIVITY.map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, padding: '10px var(--s5)', borderBottom: i < ACTIVITY.length - 1 ? '1px solid var(--border-sub)' : 'none', cursor: 'pointer', transition: 'background var(--t)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
                onMouseLeave={e => e.currentTarget.style.background = ''}>
                <div style={{ width: 28, height: 28, borderRadius: 'var(--r2)', background: a.color + '18', border: `1px solid ${a.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                  <LucideIcon name={a.icon} size={13} style={{ color: a.color }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, lineHeight: 1.45 }}>{a.text}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{a.time} atrás</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s3)' }}>
          <div className="card">
            <div className="card-header" style={{ paddingBottom: 'var(--s3)' }}>
              <span className="card-title">Ações Rápidas</span>
            </div>
            <div style={{ padding: 'var(--s3)' }}>
              {[
                { icon: 'MessageSquarePlus', label: 'Nova Conversa', color: 'var(--p)',    screen: 'inbox' },
                { icon: 'Megaphone',         label: 'Nova Campanha', color: 'var(--warn)', screen: 'campaigns' },
                { icon: 'UserPlus',          label: 'Novo Cliente',  color: 'var(--info)', screen: 'clients' },
                { icon: 'PlusSquare',        label: 'Novo Deal',     color: 'var(--p)',    screen: 'pipeline' },
              ].map((a, i) => (
                <button key={i} className="btn btn-secondary w-full"
                  style={{ justifyContent: 'flex-start', marginBottom: 6, gap: 10 }}
                  onClick={() => navigate(a.screen)}>
                  <LucideIcon name={a.icon} size={13} style={{ color: a.color }} />
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <span className="card-title">Agente IA</span>
              <span className="badge badge-green">Online</span>
            </div>
            <div className="card-body">
              {[
                { label: 'Atendimentos hoje', value: '67' },
                { label: 'Resolvidos pelo AI', value: '54', highlight: true },
                { label: 'Transferidos',       value: '13' },
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between" style={{ marginBottom: 8, fontSize: 12 }}>
                  <span style={{ color: 'var(--text-2)' }}>{row.label}</span>
                  <strong style={{ color: row.highlight ? 'var(--p)' : 'inherit' }}>{row.value}</strong>
                </div>
              ))}
              <div className="progress-bar" style={{ marginTop: 6 }}>
                <div className="progress-fill" style={{ width: mounted ? '81%' : '0%', transition: 'width 1s cubic-bezier(0.4,0,0.2,1) 0.5s' }} />
              </div>
              <div style={{ textAlign: 'right', fontSize: 10, marginTop: 3, color: 'var(--text-3)' }}>81% resolução autônoma</div>
            </div>
            <div style={{ padding: '0 var(--s4) var(--s4)' }}>
              <button className="btn btn-primary w-full" style={{ justifyContent: 'center' }} onClick={() => navigate('agents')}>
                Configurar Agente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Dashboard });
