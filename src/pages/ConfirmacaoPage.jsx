export default function ConfirmacaoPage({ pedido, onVerPedidos }) {
  return (
    <div className="confirmacao-page">
      <div className="check-circle">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>

      <h1>Pedido realizado com sucesso!</h1>
      <p>Sua solicitação foi enviada às transportadoras disponíveis.</p>

      <div className="tracking-code">#{pedido?.id}</div>

      <p>Acompanhe o status em <strong>Pedidos</strong>.</p>

      <div className="info-box">
        A transportadora entrará em contato em até 24h para confirmar a coleta.
      </div>

      <button className="btn-primary" onClick={onVerPedidos} style={{ width: '100%', padding: '13px', fontSize: 16 }}>
        Ver meus pedidos
      </button>
    </div>
  )
}