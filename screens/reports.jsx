// reports.jsx — Relatórios refinados com animações e charts melhorados
const { useState, useEffect, useRef } = React;

// ── Animated Bar Chart ───────────────────────────────────────────
function BarChart({ data, labels, color = 'var(--p)', height = 120, delay = 0 }) {
  const max = Math.max(...data);
  const [revealed, setRevealed] = useState(false);
  useEffect(() => { const t = setTimeout(() => setRevealed(true), delay + 100); return () => clearTimeout(t); }, [delay]);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: height + 20, paddingTop: 8 }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <div style={{
            width: '100%', borderRadius: '3px 3px 0 0',
            background: color,
            height: revealed ? `${(v / max) * height}px` : '2px',
            opacity: 0.75 + (v / max) * 0.25,
            transition: `height 0.5s cubic-bezier(0.4,0,0.2,1) ${delay + i * 25}ms`,
            minHeight: 2,
          }} title={`${labels[i]}: ${v}`} />
          <span style={{ fontSize: 9, color: 'var(--text-3)', whiteSpace: 'nowrap' }}>{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

// ── Animated Line Chart ──────────────────────────────────────────
function LineChart({ data, color = 'var(--p)', height = 80, delay = 0 }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      const start = performance.now();
      const dur = 900;
      function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        setProgress(1 - Math.pow(1 - p, 3));
        if (p < 1) requestAnimationFrame(tick);
        else setProgress(1);
      }
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(t);
  }, [delay]);

  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const w = 300, h = height;
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * (w - 20) + 10,
    y: h - ((v - min) / range) * (h - 20) - 10,
  }));

  // Only draw points up to progress
  const visibleCount = Math.max(2, Math.ceil(pts.length * progress));
  const visPts = pts.slice(0, visibleCount);
  const path = visPts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const area = visPts.length > 1
    ? `${path} L${visPts[visPts.length-1].x},${h} L${visPts[0].x},${h} Z`
    : '';
  const gradId = `grad_${color.replace(/[^a-z0-9]/gi, '_')}`;

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ height, display: 'block' }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.20" />
          <stop offset="100%" stopColor={color} stopOpacity="0.01" />
        </linearGradient>
      </defs>
      {area && <path d={area} fill={`url(#${gradId})`} />}
      {visPts.length > 1 && <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}
      {visPts.length > 1 && (
        <circle cx={visPts[visPts.length-1].x} cy={visPts[visPts.length-1].y} r="3.5" fill={color} />
      )}
    </svg>
  );
}

// ── Multi-line chart (for comparison) ───────────────────────────
function MultiLineChart({ series, height = 100, delay = 0 }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      const start = performance.now(), dur = 1000;
      function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        setProgress(1 - Math.pow(1 - p, 3));
        if (p < 1) requestAnimationFrame(tick); else setProgress(1);
      }
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(t);
  }, [delay]);

  const allVals = series.flatMap(s => s.data);
  const max = Math.max(...allVals), min = Math.min(...allVals), range = max - min || 1;
  const w = 300, h = height;
  const toPath = (data) => {
    const count = Math.max(2, Math.ceil(data.length * progress));
    const pts = data.slice(0, count).map((v, i) => ({
      x: (i / (data.length - 1)) * (w - 20) + 10,
      y: h - ((v - min) / range) * (h - 20) - 10,
    }));
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  };
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ height, display: 'block' }}>
      {series.map((s, i) => (
        <path key={i} d={toPath(s.data)} fill="none" stroke={s.color} strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round" opacity={0.9} />
      ))}
    </svg>
  );
}

// ── Radial progress ──────────────────────────────────────────────
function RadialProgress({ value, max = 100, size = 72, color = 'var(--p)', label, sub, delay = 0 }) {
  const [animVal, setAnimVal] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      const start = performance.now(), dur = 900;
      function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        setAnimVal((1 - Math.pow(1 - p, 3)) * value);
        if (p < 1) requestAnimationFrame(tick); else setAnimVal(value);
      }
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  const r = size / 2 - 7, c = 2 * Math.PI * r;
  const pct = animVal / max;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--surface-2)" strokeWidth="6" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={`${c * pct} ${c}`} strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ transition: 'stroke-dasharray 0.1s linear' }} />
        <text x={size/2} y={size/2 + 5} textAnchor="middle" fill="var(--text)" fontSize={size > 60 ? 14 : 11}
          fontWeight="700" fontFamily="DM Sans">{label || `${Math.round(animVal)}%`}</text>
      </svg>
      {sub && <div style={{ fontSize: 11, color: 'var(--text-3)', textAlign: 'center', lineHeight: 1.3 }}>{sub}</div>}
    </div>
  );
}

// ── Stat card with animated value ───────────────────────────────
function AnimatedStatCard({ label, value, delta, up, color, icon, delay = 0 }) {
  return (
    <div className="stat-card" style={{ animation: 'fadeUp 0.35s ease both', animationDelay: `${delay}ms` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 'var(--s2)' }}>
        {icon && <LucideIcon name={icon} size={13} style={{ color }} />}
        <div className="stat-label" style={{ margin: 0 }}>{label}</div>
      </div>
      <div className="stat-value" style={{ fontSize: 22, color }}>{value}</div>
      <div className={`stat-delta ${up ? 'up' : 'down'}`} style={{ color: up ? color : 'var(--err)', marginTop: 'var(--s1)' }}>
        <LucideIcon name={up ? 'TrendingUp' : 'TrendingDown'} size={12} />
        {delta} vs período anterior
      </div>
    </div>
  );
}

const DAYS14 = ['S','T','Q','Q','S','S','D','S','T','Q','Q','S','S','D'];
const DATA = {
  messages:     [142,198,176,221,268,148,112,189,234,256,289,248,312,284],
  responseTime: [4.2,3.8,4.1,3.5,2.9,5.2,4.8,3.2,2.8,2.5,2.2,2.6,2.4,2.1],
  conversions:  [22,31,28,35,42,18,14,30,38,44,52,41,58,49],
  revenue:      [18,25,22,32,41,14,11,28,34,42,54,44,61,52],
  prevRevenue:  [14,19,17,26,34,10,8,22,27,34,42,35,48,41],
};

const CONSULTANTS = [
  { name: 'Marina Costa',  initials: 'MC', msgs: 342, avgTime: '1.8m', deals: 14, revenue: 'R$42k', rate: 67, satisfaction: '4.9' },
  { name: 'Rafael Sousa',  initials: 'RS', msgs: 281, avgTime: '2.2m', deals: 11, revenue: 'R$31k', rate: 58, satisfaction: '4.7' },
  { name: 'Juliana Alves', initials: 'JA', msgs: 224, avgTime: '2.8m', deals: 9,  revenue: 'R$28k', rate: 53, satisfaction: '4.6' },
  { name: 'Pedro Ribeiro', initials: 'PR', msgs: 198, avgTime: '3.1m', deals: 7,  revenue: 'R$19k', rate: 44, satisfaction: '4.4' },
];

const AI_STATS = [
  { label: 'Resolução Autônoma', value: 81,  display: '81%',    color: 'var(--p)',    icon: 'Bot',       sub: '54 de 67 conversas' },
  { label: 'Confiança Média',    value: 91.4,display: '91.4%',  color: 'var(--info)', icon: 'Sparkles',  sub: 'Score médio IA' },
  { label: 'CSAT IA',            value: 94,  display: '4.8★',   color: 'var(--warn)', icon: 'Star',      sub: 'Satisfação clientes' },
];

function Reports() {
  const [period, setPeriod] = useState('14d');
  const [section, setSection] = useState('overview');

  const sections = [
    { id: 'overview',    label: 'Visão Geral',  icon: 'LayoutDashboard' },
    { id: 'messages',    label: 'Mensagens',    icon: 'MessageSquare' },
    { id: 'conversions', label: 'Conversões',   icon: 'Target' },
    { id: 'consultants', label: 'Consultores',  icon: 'Users' },
    { id: 'campaigns',   label: 'Campanhas',    icon: 'Megaphone' },
    { id: 'ai',          label: 'IA',           icon: 'Bot' },
  ];

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Section nav */}
      <div style={{ width: 190, borderRight: '1px solid var(--border-sub)', padding: 'var(--s4) 0', flexShrink: 0 }}>
        <div style={{ padding: '0 var(--s4)', marginBottom: 'var(--s3)', fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Seções</div>
        {sections.map(s => (
          <div key={s.id} className={`nav-item${section === s.id ? ' active' : ''}`} onClick={() => setSection(s.id)}>
            <LucideIcon name={s.icon} size={14} />
            <span style={{ fontSize: 13 }}>{s.label}</span>
          </div>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }} key={section}>
        <div className="page">
          <div className="page-header" style={{ animation: 'fadeUp 0.3s ease both' }}>
            <div>
              <div className="page-title">Relatórios — {sections.find(s => s.id === section)?.label}</div>
              <div className="page-subtitle">Franquia SP · Atualizado agora</div>
            </div>
            <div className="flex gap-2">
              {[{id:'7d',label:'7d'},{id:'14d',label:'14d'},{id:'30d',label:'30d'},{id:'90d',label:'90d'}].map(p => (
                <button key={p.id} className={`btn btn-xs ${period === p.id ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setPeriod(p.id)}>{p.label}</button>
              ))}
              <button className="btn btn-secondary btn-sm"><LucideIcon name="Download" size={13} /> Exportar</button>
            </div>
          </div>

          {/* ── OVERVIEW ── */}
          {section === 'overview' && (
            <div>
              {/* KPI row */}
              <div className="grid-4" style={{ marginBottom: 'var(--s5)' }}>
                <AnimatedStatCard label="Total Mensagens"    value="3.842"   delta="+12%" up={true}  color="var(--info)" icon="MessageSquare" delay={0} />
                <AnimatedStatCard label="Tempo Méd Resposta" value="2.1 min" delta="-18%" up={true}  color="var(--p)"    icon="Clock"         delay={60} />
                <AnimatedStatCard label="Taxa Conversão"     value="34,8%"   delta="+2,1%" up={true} color="var(--warn)" icon="Target"         delay={120} />
                <AnimatedStatCard label="Receita Período"    value="R$142k"  delta="+22%" up={true}  color="var(--p)"    icon="TrendingUp"     delay={180} />
              </div>

              {/* Charts */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s4)', marginBottom: 'var(--s4)', animation: 'fadeUp 0.35s ease 0.2s both' }}>
                <div className="card">
                  <div className="card-header">
                    <span className="card-title">Mensagens por Dia</span>
                    <span className="badge badge-info">14 dias</span>
                  </div>
                  <div className="card-body">
                    <BarChart data={DATA.messages} labels={DAYS14} color="var(--info)" height={110} delay={300} />
                  </div>
                </div>
                <div className="card">
                  <div className="card-header">
                    <span className="card-title">Receita (R$k) — atual vs anterior</span>
                    <span className="badge badge-green">Acumulado</span>
                  </div>
                  <div className="card-body">
                    <MultiLineChart
                      series={[
                        { data: DATA.revenue,     color: 'var(--p)' },
                        { data: DATA.prevRevenue, color: 'var(--border)' },
                      ]}
                      height={120} delay={350}
                    />
                    <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <div style={{ width: 24, height: 2, background: 'var(--p)', borderRadius: 2 }} />
                        <span style={{ fontSize: 11, color: 'var(--text-3)' }}>Atual</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <div style={{ width: 24, height: 2, background: 'var(--border)', borderRadius: 2 }} />
                        <span style={{ fontSize: 11, color: 'var(--text-3)' }}>Anterior</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s4)', marginBottom: 'var(--s4)', animation: 'fadeUp 0.35s ease 0.3s both' }}>
                <div className="card">
                  <div className="card-header">
                    <span className="card-title">Tempo Médio de Resposta (min)</span>
                    <span className="badge badge-green" style={{ fontSize: 10 }}>✓ Meta &lt;3min</span>
                  </div>
                  <div className="card-body">
                    <LineChart data={DATA.responseTime} color="var(--warn)" height={100} delay={400} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                      <span style={{ fontSize: 11, color: 'var(--text-3)' }}>Meta: &lt;3 min</span>
                      <span style={{ fontSize: 11, color: 'var(--p)', fontWeight: 600 }}>Atingida</span>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-header">
                    <span className="card-title">Conversões por Dia</span>
                  </div>
                  <div className="card-body">
                    <BarChart data={DATA.conversions} labels={DAYS14} color="var(--p)" height={100} delay={420} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── CONSULTANTS ── */}
          {(section === 'overview' || section === 'consultants') && (
            <div className="card" style={{ animation: 'fadeUp 0.35s ease 0.35s both' }}>
              <div className="card-header">
                <span className="card-title">Desempenho por Consultor</span>
                <button className="btn btn-ghost btn-xs"><LucideIcon name="Download" size={12} /> CSV</button>
              </div>
              <div className="table-wrap">
                <table>
                  <thead><tr>
                    <th>#</th><th>Consultor</th><th>Mensagens</th><th>Tempo Médio</th>
                    <th>Deals</th><th>Receita</th><th>Conversão</th><th>Satisfação</th>
                  </tr></thead>
                  <tbody>
                    {CONSULTANTS.map((c, i) => (
                      <tr key={i}>
                        <td style={{ color: 'var(--text-3)', fontWeight: 600 }}>#{i + 1}</td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="avatar sm">{c.initials}</div>
                            <span style={{ fontWeight: 500 }}>{c.name}</span>
                          </div>
                        </td>
                        <td>{c.msgs}</td>
                        <td>
                          <span style={{ color: parseFloat(c.avgTime) < 2.5 ? 'var(--p)' : 'var(--warn)', fontWeight: 500 }}>
                            {c.avgTime}
                          </span>
                        </td>
                        <td>{c.deals}</td>
                        <td style={{ fontWeight: 600 }}>{c.revenue}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 56, height: 4, background: 'var(--surface-2)', borderRadius: 2, overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: c.rate + '%', background: c.rate > 60 ? 'var(--p)' : 'var(--warn)', borderRadius: 2, transition: 'width 0.8s ease' }} />
                            </div>
                            <span style={{ fontSize: 12 }}>{c.rate}%</span>
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <span style={{ color: 'var(--warn)', fontSize: 13 }}>★</span>
                            <span style={{ fontWeight: 600, fontSize: 12 }}>{c.satisfaction}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── AI SECTION ── */}
          {section === 'ai' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--s4)', marginBottom: 'var(--s5)' }}>
                {AI_STATS.map((s, i) => (
                  <div key={i} className="card card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--s3)', animation: 'fadeUp 0.35s ease both', animationDelay: `${i * 80}ms` }}>
                    <RadialProgress value={s.value} color={s.color} size={80} label={s.display} sub={s.sub} delay={i * 120} />
                    <div style={{ fontWeight: 600, fontSize: 13, textAlign: 'center' }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s4)', animation: 'fadeUp 0.35s ease 0.25s both' }}>
                <div className="card">
                  <div className="card-header"><span className="card-title">Resolução por Dia</span></div>
                  <div className="card-body">
                    <BarChart data={[78,82,85,79,83,88,91,86,84,89,92,88,94,81]} labels={DAYS14} color="var(--p)" height={100} delay={300} />
                  </div>
                </div>
                <div className="card">
                  <div className="card-header"><span className="card-title">Confiança Média por Dia</span></div>
                  <div className="card-body">
                    <LineChart data={[88,90,89,91,92,87,85,91,93,92,94,91,93,91]} color="var(--info)" height={100} delay={350} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── CAMPAIGNS ── */}
          {section === 'campaigns' && (
            <div className="card" style={{ overflow: 'hidden', animation: 'fadeUp 0.35s ease both' }}>
              <div className="card-header">
                <span className="card-title">Campanhas Recentes</span>
              </div>
              <table>
                <thead><tr><th>Campanha</th><th>Envios</th><th>Abertura</th><th>Resposta</th><th>Conversão</th><th>Receita</th><th>Status</th></tr></thead>
                <tbody>
                  {[
                    { name: 'Black Friday 2025',   sent: 4200, open: 68, reply: 42, conv: 18, rev: 'R$54k', status: 'done' },
                    { name: 'Reativação 60d',      sent: 1240, open: 44, reply: 28, conv: 11, rev: 'R$18k', status: 'active' },
                    { name: 'Lançamento Premium',  sent: 890,  open: 72, reply: 55, conv: 24, rev: 'R$32k', status: 'done' },
                    { name: 'Follow-up Pipeline',  sent: 620,  open: 58, reply: 38, conv: 16, rev: 'R$12k', status: 'active' },
                    { name: 'Clientes VIP',        sent: 320,  open: 84, reply: 67, conv: 34, rev: 'R$41k', status: 'done' },
                  ].map((c, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 500 }}>{c.name}</td>
                      <td>{c.sent.toLocaleString('pt-BR')}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 40, height: 3, background: 'var(--surface-2)', borderRadius: 2, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: c.open + '%', background: 'var(--info)', borderRadius: 2 }} />
                          </div>
                          <span style={{ fontSize: 12 }}>{c.open}%</span>
                        </div>
                      </td>
                      <td style={{ fontSize: 12 }}>{c.reply}%</td>
                      <td>
                        <span style={{ fontSize: 12, fontWeight: 600, color: c.conv > 20 ? 'var(--p)' : 'var(--text-2)' }}>{c.conv}%</span>
                      </td>
                      <td style={{ fontWeight: 600 }}>{c.rev}</td>
                      <td>
                        <span className={`badge ${c.status === 'active' ? 'badge-green' : 'badge-neutral'}`}>
                          {c.status === 'active' ? 'Ativa' : 'Concluída'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── MESSAGES SECTION ── */}
          {section === 'messages' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s4)', animation: 'fadeUp 0.35s ease both' }}>
              <div className="grid-3">
                <AnimatedStatCard label="Total Mensagens" value="3.842" delta="+12%" up={true} color="var(--info)" icon="MessageSquare" delay={0} />
                <AnimatedStatCard label="Enviadas IA"     value="3.140" delta="+15%" up={true} color="var(--p)"    icon="Bot"           delay={60} />
                <AnimatedStatCard label="Enviadas Humano" value="702"   delta="-8%"  up={false} color="var(--warn)" icon="User"          delay={120} />
              </div>
              <div className="card">
                <div className="card-header"><span className="card-title">Volume diário de mensagens</span></div>
                <div className="card-body">
                  <BarChart data={DATA.messages} labels={DAYS14} color="var(--info)" height={140} delay={200} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s4)' }}>
                <div className="card">
                  <div className="card-header"><span className="card-title">Pico de horário</span></div>
                  <div className="card-body">
                    <BarChart data={[12,8,5,3,4,18,42,68,84,96,88,74,80,91,85,78,62,54,46,38,28,22,16,10]} labels={[...Array(24).keys()].map(h => h % 3 === 0 ? `${h}h` : '')} color="var(--p)" height={100} delay={250} />
                  </div>
                </div>
                <div className="card">
                  <div className="card-header"><span className="card-title">Tempo médio de resposta</span></div>
                  <div className="card-body">
                    <LineChart data={DATA.responseTime} color="var(--warn)" height={100} delay={300} />
                    <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>Meta: &lt;3 min · Atual: 2.1 min</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── CONVERSIONS SECTION ── */}
          {section === 'conversions' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s4)', animation: 'fadeUp 0.35s ease both' }}>
              <div className="grid-3">
                <AnimatedStatCard label="Taxa Conversão"  value="34,8%"   delta="+2,1%" up={true}  color="var(--p)"    icon="Target"     delay={0} />
                <AnimatedStatCard label="Deals Ganhos"    value="48"      delta="+8"    up={true}  color="var(--info)" icon="CheckCircle" delay={60} />
                <AnimatedStatCard label="Ticket Médio"    value="R$2.96k" delta="+12%"  up={true}  color="var(--warn)" icon="DollarSign"  delay={120} />
              </div>
              <div className="card">
                <div className="card-header"><span className="card-title">Conversões diárias</span></div>
                <div className="card-body">
                  <BarChart data={DATA.conversions} labels={DAYS14} color="var(--p)" height={130} delay={200} />
                </div>
              </div>
              <div className="card">
                <div className="card-header"><span className="card-title">Funil de conversão</span></div>
                <div className="card-body">
                  {[
                    { label: 'Contatos iniciados', value: 1420, pct: 100, color: 'var(--info)' },
                    { label: 'Qualificados',        value: 842,  pct: 59,  color: 'var(--p)' },
                    { label: 'Em negociação',       value: 312,  pct: 22,  color: 'var(--warn)' },
                    { label: 'Propostas enviadas',  value: 184,  pct: 13,  color: 'var(--warn)' },
                    { label: 'Fechados',            value: 494,  pct: 35,  color: 'var(--p)' },
                  ].map((row, i) => (
                    <div key={i} style={{ marginBottom: 12 }}>
                      <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
                        <span style={{ fontSize: 12 }}>{row.label}</span>
                        <div className="flex items-center gap-2">
                          <span style={{ fontSize: 12, fontWeight: 600 }}>{row.value.toLocaleString('pt-BR')}</span>
                          <span style={{ fontSize: 11, color: 'var(--text-3)', width: 36, textAlign: 'right' }}>{row.pct}%</span>
                        </div>
                      </div>
                      <div className="progress-bar" style={{ height: 6 }}>
                        <div className="progress-fill" style={{ width: row.pct + '%', background: row.color, transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1) ' + (200 + i * 80) + 'ms' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Reports });
