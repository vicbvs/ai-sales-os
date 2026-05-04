// pipeline.jsx — Pipeline / Funis com gerenciamento customizável
const { useState, useRef } = React;

// ── Default funnel definitions ───────────────────────────────────
const DEFAULT_FUNNELS = [
  {
    id: 'inbound',
    name: 'Inbound',
    icon: 'ArrowDownToLine',
    stages: [
      { id: 'new',  label: 'Novo Contato', color: '#888899' },
      { id: 'cont', label: 'Contatado',    color: '#5b8dee' },
      { id: 'neg',  label: 'Negociação',   color: '#e0a830' },
      { id: 'won',  label: 'Ganho',        color: null },   // null = use --p
      { id: 'lost', label: 'Perdido',      color: '#e05a42' },
    ],
  },
  {
    id: 'outbound',
    name: 'Outbound',
    icon: 'ArrowUpFromLine',
    stages: [
      { id: 'prospect',  label: 'Prospecção',   color: '#888899' },
      { id: 'qualify',   label: 'Qualificação', color: '#5b8dee' },
      { id: 'proposal',  label: 'Proposta',     color: '#e0a830' },
      { id: 'closing',   label: 'Fechamento',   color: null },
      { id: 'lost',      label: 'Perdido',      color: '#e05a42' },
    ],
  },
  {
    id: 'support',
    name: 'Suporte',
    icon: 'HeadphonesIcon',
    stages: [
      { id: 'open',       label: 'Aberto',      color: '#5b8dee' },
      { id: 'inprogress', label: 'Em andamento',color: '#e0a830' },
      { id: 'waiting',    label: 'Aguardando',  color: '#888899' },
      { id: 'resolved',   label: 'Resolvido',   color: null },
      { id: 'closed',     label: 'Fechado',     color: '#888899' },
    ],
  },
];

const INITIAL_DEALS = {
  new:  [
    { id: 1, name: 'Diego Souza',   value: 'R$6.400',  days: 1, consultant: 'RS', tag: 'Empresa',  source: 'WhatsApp' },
    { id: 2, name: 'Beatriz Costa', value: 'R$2.100',  days: 0, consultant: 'MC', tag: 'Novo',     source: 'Instagram' },
    { id: 3, name: 'Thiago Nunes',  value: 'R$4.800',  days: 2, consultant: 'JA', tag: null,       source: 'WhatsApp' },
  ],
  cont: [
    { id: 4, name: 'Carlos Mendes', value: 'R$8.500',  days: 3, consultant: 'RS', tag: 'Quente',   source: 'WhatsApp' },
    { id: 5, name: 'Roberto Lima',  value: 'R$3.200',  days: 5, consultant: 'PR', tag: 'Nordeste', source: 'Site' },
    { id: 6, name: 'Camila Braga',  value: 'R$11.000', days: 1, consultant: 'MC', tag: 'VIP',      source: 'WhatsApp' },
  ],
  neg:  [
    { id: 7, name: 'Ana Silva',      value: 'R$12.000', days: 7, consultant: 'MC', tag: 'VIP',     source: 'WhatsApp' },
    { id: 8, name: 'Lucas Ferreira', value: 'R$6.800',  days: 4, consultant: 'JA', tag: null,      source: 'WhatsApp' },
    { id: 9, name: 'Paulo Matos',    value: 'R$9.500',  days: 2, consultant: 'RS', tag: 'Empresa', source: 'Site' },
  ],
  won:  [
    { id: 10, name: 'Marina Torres', value: 'R$22.000', days: 14, consultant: 'RS', tag: 'VIP',   source: 'WhatsApp' },
    { id: 11, name: 'Fernanda Lima', value: 'R$15.500', days: 9,  consultant: 'MC', tag: 'VIP',   source: 'WhatsApp' },
  ],
  lost: [
    { id: 12, name: 'Eduardo Faria', value: 'R$3.100',  days: 18, consultant: 'JA', tag: null,    source: 'Site' },
  ],
};

// Resolve stage color (null = primary CSS var)
function stageColor(stage) {
  return stage.color || 'var(--p)';
}

// ── Deal Card ────────────────────────────────────────────────────
function DealCard({ deal, onOpen, onMove, currentStage, stages }) {
  const [drag, setDrag] = useState(false);
  return (
    <div className={`kanban-card${drag ? ' dragging' : ''}`}
      draggable
      onDragStart={e => { setDrag(true); e.dataTransfer.setData('dealId', deal.id); e.dataTransfer.setData('fromStage', currentStage); }}
      onDragEnd={() => setDrag(false)}
      onClick={() => onOpen(deal)}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
        <div style={{ fontWeight: 600, fontSize: 13 }}>{deal.name}</div>
        {deal.tag && <span className="tag" style={{ fontSize: 10 }}>{deal.tag}</span>}
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--p)', marginBottom: 6 }}>{deal.value}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-3)' }}>
        <LucideIcon name="Clock" size={11} />
        <span>{deal.days === 0 ? 'Hoje' : `${deal.days}d atrás`}</span>
        <span style={{ marginLeft: 'auto' }}>
          <div className="avatar sm" style={{ fontSize: 10 }}>{deal.consultant}</div>
        </span>
      </div>
      <div style={{ marginTop: 6, display: 'flex', gap: 4, alignItems: 'center' }}>
        <LucideIcon name={deal.source === 'WhatsApp' ? 'MessageCircle' : deal.source === 'Instagram' ? 'Instagram' : 'Globe'} size={10} style={{ color: 'var(--text-3)' }} />
        <span style={{ fontSize: 10, color: 'var(--text-3)' }}>{deal.source}</span>
      </div>
    </div>
  );
}

// ── Kanban Column ────────────────────────────────────────────────
function KanbanCol({ stage, deals, onOpen, onMove }) {
  const [over, setOver] = useState(false);
  const total = deals.reduce((s, d) => s + parseInt(d.value.replace(/[^\d]/g, '')), 0);
  const fmt = v => v >= 1000 ? `R$${(v / 1000).toFixed(0)}k` : `R$${v}`;
  const color = stageColor(stage);

  return (
    <div className="kanban-col"
      onDragOver={e => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={e => { e.preventDefault(); setOver(false); const id = parseInt(e.dataTransfer.getData('dealId')); const from = e.dataTransfer.getData('fromStage'); if (from !== stage.id) onMove(id, from, stage.id); }}>
      <div className="kanban-col-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: 'var(--r-full)', background: color, flexShrink: 0 }} />
          <span className="kanban-col-title">{stage.label}</span>
          <span className="kanban-count">{deals.length}</span>
        </div>
        <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600 }}>{fmt(total)}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s2)', minHeight: 80, background: over ? 'var(--p-dim)' : undefined, borderRadius: 'var(--r3)', transition: 'background var(--t)', padding: over ? 4 : 0 }}>
        {deals.map(d => (
          <DealCard key={d.id} deal={d} onOpen={onOpen} onMove={onMove} currentStage={stage.id} stages={[stage]} />
        ))}
        <button style={{ background: 'none', border: '1px dashed var(--border)', borderRadius: 'var(--r3)', padding: '8px', cursor: 'pointer', color: 'var(--text-3)', fontSize: 12, transition: 'all var(--t)' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--p)'; e.currentTarget.style.color = 'var(--p)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.color = ''; }}>
          + Adicionar deal
        </button>
      </div>
    </div>
  );
}

// ── Column Editor (drag-to-reorder) ─────────────────────────────
function ColumnEditor({ stages, onChange }) {
  const [draggingIdx, setDraggingIdx] = useState(null);
  const [editingIdx, setEditingIdx] = useState(null);

  const PRESET_COLORS = ['#888899', '#5b8dee', '#e0a830', '#e05a42', '#27ae60', '#8e44ad', '#16a085'];

  function moveStage(from, to) {
    const arr = [...stages];
    const [item] = arr.splice(from, 1);
    arr.splice(to, 0, item);
    onChange(arr);
  }

  function updateStage(idx, patch) {
    const arr = stages.map((s, i) => i === idx ? { ...s, ...patch } : s);
    onChange(arr);
  }

  function removeStage(idx) {
    onChange(stages.filter((_, i) => i !== idx));
  }

  function addStage() {
    onChange([...stages, { id: `col_${Date.now()}`, label: 'Nova Coluna', color: '#888899' }]);
  }

  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 'var(--s2)' }}>Colunas do funil</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {stages.map((s, i) => (
          <div key={s.id} className="col-edit-row"
            draggable
            onDragStart={() => setDraggingIdx(i)}
            onDragOver={e => { e.preventDefault(); }}
            onDrop={() => { if (draggingIdx !== null && draggingIdx !== i) { moveStage(draggingIdx, i); setDraggingIdx(null); } }}
            onDragEnd={() => setDraggingIdx(null)}
            style={{ opacity: draggingIdx === i ? 0.4 : 1 }}>
            <LucideIcon name="GripVertical" size={14} style={{ color: 'var(--text-3)', cursor: 'grab', flexShrink: 0 }} />
            <div style={{ width: 10, height: 10, borderRadius: 'var(--r-full)', background: stageColor(s), flexShrink: 0, cursor: 'pointer', position: 'relative' }}
              onClick={() => setEditingIdx(editingIdx === i ? null : i)}>
              {editingIdx === i && (
                <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 20, background: 'var(--surface-3)', border: '1px solid var(--border)', borderRadius: 'var(--r2)', padding: 8, display: 'flex', gap: 6, flexWrap: 'wrap', width: 140, marginTop: 4 }}>
                  {PRESET_COLORS.map(c => (
                    <div key={c} style={{ width: 20, height: 20, borderRadius: 'var(--r-full)', background: c, cursor: 'pointer', border: s.color === c ? '2px solid var(--text)' : '2px solid transparent' }}
                      onClick={e => { e.stopPropagation(); updateStage(i, { color: c }); setEditingIdx(null); }} />
                  ))}
                  <div style={{ width: 20, height: 20, borderRadius: 'var(--r-full)', background: 'var(--p)', cursor: 'pointer', border: s.color === null ? '2px solid var(--text)' : '2px solid transparent' }}
                    onClick={e => { e.stopPropagation(); updateStage(i, { color: null }); setEditingIdx(null); }} />
                </div>
              )}
            </div>
            <input
              value={s.label}
              onChange={e => updateStage(i, { label: e.target.value })}
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', font: 'inherit', fontSize: 13, color: 'var(--text)' }}
            />
            <button className="icon-btn" style={{ width: 22, height: 22 }} onClick={() => removeStage(i)}>
              <LucideIcon name="X" size={12} />
            </button>
          </div>
        ))}
        <button className="btn btn-ghost btn-xs" style={{ alignSelf: 'flex-start', marginTop: 2 }} onClick={addStage}>
          <LucideIcon name="Plus" size={12} /> Adicionar coluna
        </button>
      </div>
    </div>
  );
}

// ── Funnel Manager Modal ─────────────────────────────────────────
function FunnelManager({ funnels, activeFunnelId, onClose, onSave, onActivate }) {
  const [localFunnels, setLocalFunnels] = useState(funnels.map(f => ({ ...f, stages: f.stages.map(s => ({ ...s })) })));
  const [selectedId, setSelectedId] = useState(activeFunnelId);
  const [editingName, setEditingName] = useState(false);

  const selectedFunnel = localFunnels.find(f => f.id === selectedId);
  const selectedIdx = localFunnels.findIndex(f => f.id === selectedId);

  function updateSelected(patch) {
    setLocalFunnels(fs => fs.map((f, i) => i === selectedIdx ? { ...f, ...patch } : f));
  }

  function addFunnel() {
    const newF = { id: `funnel_${Date.now()}`, name: 'Novo Funil', icon: 'Layers', stages: [
      { id: 's1', label: 'Entrada',  color: '#888899' },
      { id: 's2', label: 'Em curso', color: '#5b8dee' },
      { id: 's3', label: 'Ganho',    color: null },
      { id: 's4', label: 'Perdido',  color: '#e05a42' },
    ]};
    setLocalFunnels(fs => [...fs, newF]);
    setSelectedId(newF.id);
  }

  function deleteFunnel(id) {
    const remaining = localFunnels.filter(f => f.id !== id);
    setLocalFunnels(remaining);
    if (selectedId === id) setSelectedId(remaining[0]?.id || null);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ width: 680, maxWidth: '92vw' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Gerenciar Funis</span>
          <button className="icon-btn" onClick={onClose}><LucideIcon name="X" size={16} /></button>
        </div>
        <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 'var(--s5)', padding: 'var(--s5)' }}>
          {/* Left: funnel list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s2)' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 'var(--s1)' }}>Funis</div>
            {localFunnels.map(f => (
              <div key={f.id} className={`funnel-row${selectedId === f.id ? ' active' : ''}`}
                onClick={() => setSelectedId(f.id)}>
                <LucideIcon name={f.icon || 'Layers'} size={14} style={{ color: selectedId === f.id ? 'var(--p)' : 'var(--text-3)', flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: 500, flex: 1 }}>{f.name}</span>
                {localFunnels.length > 1 && (
                  <button className="icon-btn" style={{ width: 20, height: 20 }}
                    onClick={e => { e.stopPropagation(); deleteFunnel(f.id); }}>
                    <LucideIcon name="Trash2" size={11} />
                  </button>
                )}
              </div>
            ))}
            <button className="btn btn-ghost btn-xs" style={{ alignSelf: 'flex-start', marginTop: 4 }} onClick={addFunnel}>
              <LucideIcon name="Plus" size={12} /> Novo funil
            </button>
          </div>

          {/* Right: funnel editor */}
          {selectedFunnel && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s4)' }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 'var(--s1)' }}>Nome do funil</div>
                <input className="input"
                  value={selectedFunnel.name}
                  onChange={e => updateSelected({ name: e.target.value })}
                />
              </div>
              <ColumnEditor
                stages={selectedFunnel.stages}
                onChange={stages => updateSelected({ stages })}
              />
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn-secondary"
            onClick={() => { onActivate(selectedId); onSave(localFunnels); onClose(); }}>
            Ativar funil selecionado
          </button>
          <button className="btn btn-primary"
            onClick={() => { onSave(localFunnels); onClose(); }}>
            Salvar alterações
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Pipeline Screen ──────────────────────────────────────────────
function Pipeline({ navigate }) {
  const [funnels, setFunnels] = useState(DEFAULT_FUNNELS);
  const [activeFunnelId, setActiveFunnelId] = useState('inbound');
  const [deals, setDeals] = useState(INITIAL_DEALS);
  const [openDeal, setOpenDeal] = useState(null);
  const [view, setView] = useState('kanban');
  const [showFunnelMgr, setShowFunnelMgr] = useState(false);

  const activeFunnel = funnels.find(f => f.id === activeFunnelId) || funnels[0];
  const stages = activeFunnel.stages;

  // Ensure deals object has keys for all current stages
  const allDeals = React.useMemo(() => {
    const base = { ...deals };
    stages.forEach(s => { if (!base[s.id]) base[s.id] = []; });
    return base;
  }, [deals, stages]);

  const totalPipeline = Object.values(allDeals).flat().reduce((s, d) => s + parseInt(d.value.replace(/[^\d]/g, '')), 0);
  const wonStage = stages.find(s => s.label === 'Ganho' || s.label === 'Resolvido' || s.label === 'Fechamento');
  const wonDeals = wonStage ? (allDeals[wonStage.id] || []).reduce((s, d) => s + parseInt(d.value.replace(/[^\d]/g, '')), 0) : 0;

  function moveDeal(id, from, to) {
    setDeals(prev => {
      const all = { ...prev };
      stages.forEach(s => { if (!all[s.id]) all[s.id] = []; });
      const deal = (all[from] || []).find(d => d.id === id);
      if (!deal) return prev;
      return { ...all, [from]: all[from].filter(d => d.id !== id), [to]: [deal, ...(all[to] || [])] };
    });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: 'var(--s5) var(--s6) 0', flexShrink: 0 }}>
        <div className="page-header" style={{ marginBottom: 'var(--s3)' }}>
          <div>
            <div className="page-title">Pipeline / Funis</div>
            <div className="page-subtitle">
              Total: <strong>R${(totalPipeline / 1000).toFixed(0)}k</strong>
              {wonDeals > 0 && <> · Ganhos: <strong style={{ color: 'var(--p)' }}>R${(wonDeals / 1000).toFixed(0)}k</strong></>}
            </div>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-secondary btn-sm" onClick={() => setShowFunnelMgr(true)}>
              <LucideIcon name="Settings2" size={13} /> Gerenciar Funis
            </button>
            <div className="flex" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--r2)', padding: 2, gap: 2 }}>
              {[{ id: 'kanban', icon: 'Kanban' }, { id: 'list', icon: 'List' }].map(v => (
                <button key={v.id} className={`btn btn-xs ${view === v.id ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setView(v.id)}>
                  <LucideIcon name={v.icon} size={12} />
                </button>
              ))}
            </div>
            <button className="btn btn-secondary btn-sm"><LucideIcon name="Filter" size={13} /> Filtrar</button>
            <button className="btn btn-primary btn-sm"><LucideIcon name="Plus" size={13} /> Novo Deal</button>
          </div>
        </div>

        {/* Funnel tabs */}
        <div style={{ display: 'flex', gap: 'var(--s2)', marginBottom: 'var(--s3)', overflowX: 'auto' }}>
          {funnels.map(f => (
            <button key={f.id}
              className={`btn btn-sm ${activeFunnelId === f.id ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveFunnelId(f.id)}>
              <LucideIcon name={f.icon || 'Layers'} size={12} />
              {f.name}
            </button>
          ))}
        </div>

        {/* Stage totals */}
        <div style={{ display: 'flex', gap: 'var(--s3)', marginBottom: 'var(--s4)', overflowX: 'auto' }}>
          {stages.map(s => {
            const v = (allDeals[s.id] || []).reduce((acc, d) => acc + parseInt(d.value.replace(/[^\d]/g, '')), 0);
            const color = stageColor(s);
            return (
              <div key={s.id} style={{ flex: '0 0 auto', minWidth: 110, background: 'var(--surface)', border: '1px solid var(--border-sub)', borderRadius: 'var(--r3)', padding: 'var(--s3) var(--s4)', borderTop: `2px solid ${color}` }}>
                <div style={{ fontSize: 10, color: 'var(--text-3)', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.label}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: color }}>{v >= 1000 ? `R$${(v / 1000).toFixed(0)}k` : `R$${v}`}</div>
                <div style={{ fontSize: 10, color: 'var(--text-3)' }}>{(allDeals[s.id] || []).length} deals</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Board */}
      {view === 'kanban' ? (
        <div className="kanban-board">
          {stages.map(s => (
            <KanbanCol key={s.id} stage={s} deals={allDeals[s.id] || []} onOpen={setOpenDeal} onMove={moveDeal} />
          ))}
        </div>
      ) : (
        <div style={{ flex: 1, overflow: 'auto', padding: '0 var(--s6) var(--s6)' }}>
          <div className="card" style={{ overflow: 'hidden' }}>
            <table>
              <thead><tr>
                <th>Cliente</th><th>Valor</th><th>Estágio</th><th>Consultor</th><th>Última interação</th><th>Origem</th><th></th>
              </tr></thead>
              <tbody>
                {stages.flatMap(s => (allDeals[s.id] || []).map(d => (
                  <tr key={d.id} style={{ cursor: 'pointer' }} onClick={() => setOpenDeal(d)}>
                    <td><div style={{ fontWeight: 500 }}>{d.name}</div></td>
                    <td><strong style={{ color: 'var(--p)' }}>{d.value}</strong></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 7, height: 7, borderRadius: 'var(--r-full)', background: stageColor(s) }} />
                        <span style={{ fontSize: 12 }}>{s.label}</span>
                      </div>
                    </td>
                    <td><div className="avatar sm">{d.consultant}</div></td>
                    <td style={{ fontSize: 12, color: 'var(--text-2)' }}>{d.days === 0 ? 'Hoje' : `${d.days}d atrás`}</td>
                    <td style={{ fontSize: 12 }}>{d.source}</td>
                    <td><button className="icon-btn" style={{ width: 26, height: 26 }}><LucideIcon name="ChevronRight" size={13} /></button></td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Deal drawer */}
      {openDeal && (
        <div className="drawer-overlay" onClick={() => setOpenDeal(null)}>
          <div className="drawer" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <div>
                <div className="drawer-title">{openDeal.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>Deal · {openDeal.source}</div>
              </div>
              <button className="icon-btn" onClick={() => setOpenDeal(null)}><LucideIcon name="X" size={16} /></button>
            </div>
            <div className="drawer-body">
              <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--p)', marginBottom: 'var(--s5)', letterSpacing: '-0.03em' }}>{openDeal.value}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s3)', marginBottom: 'var(--s5)' }}>
                {[
                  { l: 'Estágio',   v: stages.find(s => (allDeals[s.id] || []).some(d => d.id === openDeal.id))?.label || '—' },
                  { l: 'Consultor', v: openDeal.consultant },
                  { l: 'Origem',    v: openDeal.source },
                  { l: 'Criado',    v: `${openDeal.days} dias atrás` },
                ].map((r, i) => (
                  <div key={i} style={{ background: 'var(--surface-2)', borderRadius: 'var(--r2)', padding: 'var(--s3)' }}>
                    <div style={{ fontSize: 10, color: 'var(--text-3)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{r.l}</div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{r.v}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 'var(--s4)' }}>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 'var(--s2)' }}>Mover para</div>
                <div style={{ display: 'flex', gap: 'var(--s2)', flexWrap: 'wrap' }}>
                  {stages.map(s => (
                    <button key={s.id} className="btn btn-secondary btn-sm"
                      style={{ borderColor: `${stageColor(s)}55`, color: stageColor(s) }}
                      onClick={() => {
                        const from = stages.find(st => (allDeals[st.id] || []).some(d => d.id === openDeal.id))?.id;
                        if (from && from !== s.id) moveDeal(openDeal.id, from, s.id);
                        setOpenDeal(null);
                      }}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => navigate('inbox')}>
                  <LucideIcon name="MessageSquare" size={13} /> Abrir Conversa
                </button>
                <button className="btn btn-secondary"><LucideIcon name="Edit" size={13} /></button>
                <button className="btn btn-danger"><LucideIcon name="Trash2" size={13} /></button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Funnel manager modal */}
      {showFunnelMgr && (
        <FunnelManager
          funnels={funnels}
          activeFunnelId={activeFunnelId}
          onClose={() => setShowFunnelMgr(false)}
          onSave={fs => setFunnels(fs)}
          onActivate={id => setActiveFunnelId(id)}
        />
      )}
    </div>
  );
}

Object.assign(window, { Pipeline });
