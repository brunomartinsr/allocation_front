function IconClipboard() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
      <rect x="9" y="3" width="6" height="4" rx="1"/>
    </svg>
  )
}

function IconUser() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>
  )
}

export default function PedidosPage({ pedidos, onBack, user }) {
  return (
    <div className="pedidos-page">
      <div className="page-header">
        <h1>Cliente</h1>
        {user && (
          <div className="user-badge">
            <IconUser />
            {user.email}
          </div>
        )}
      </div>

      <div className="tabs">
        <button className="tab-btn" onClick={onBack}>Itens</button>
        <button className="tab-btn active">Pedidos</button>
      </div>

      {pedidos.length === 0 ? (
        <div className="empty-pedidos">
          <IconClipboard />
          <p>Você não tem nenhum pedido no momento.</p>
          <button className="btn-primary" onClick={onBack} style={{ marginTop: 8 }}>
            Adicionar itens
          </button>
        </div>
      ) : (
        pedidos.map((pedido, i) => (
          <div key={i} className="pedido-card">
            <div className="pedido-header">
              <div>
                <div className="pedido-id">#{pedido.id}</div>
                <div className="pedido-date" style={{ marginTop: 6 }}>{pedido.data} · {pedido.hora}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="pedido-title">
                  {pedido.items?.length} {pedido.items?.length === 1 ? 'item' : 'itens'}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text)', fontFamily: 'var(--mono)', marginTop: 2 }}>
                  {pedido.pesoTotal?.toFixed(1)} kg · {pedido.volTotal?.toFixed(2)} m³
                </div>
              </div>
            </div>

            <div style={{ fontSize: 13, color: 'var(--text)', marginBottom: 12 }}>
              <strong style={{ color: 'var(--text-h)' }}>Origem:</strong> {pedido.origem}<br />
              <strong style={{ color: 'var(--text-h)' }}>Destino:</strong> {pedido.destino}
            </div>

            <div className="timeline">
              {pedido.status.map((step, j) => (
                <div key={j} className="timeline-item">
                  <div className={`timeline-dot ${step.done ? 'done' : ''}`} />
                  <div className={`timeline-label ${step.done ? 'done' : ''}`}>{step.label}</div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}