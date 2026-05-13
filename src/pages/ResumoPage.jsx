import { useState } from 'react'

export default function ResumoPage({ items, onConfirmar, onCancel }) {
  const [origem, setOrigem] = useState('')
  const [destino, setDestino] = useState('')

  const pesoTotal = items.reduce((acc, it) => acc + parseFloat(it.peso || 0) * parseInt(it.quantidade || 1), 0)
  const volTotal = items.reduce((acc, it) => {
    const vol = parseFloat(it.comp || 0) * parseFloat(it.larg || 0) * parseFloat(it.alt || 0) * parseInt(it.quantidade || 1)
    return acc + vol
  }, 0)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!origem || !destino) return
    onConfirmar({ items, origem, destino, pesoTotal, volTotal })
  }

  return (
    <div className="resumo-page">
      <h1>Resumo do Pedido</h1>

      <form onSubmit={handleSubmit}>
        <div className="resumo-section">
          <div className="resumo-section-title">Endereços</div>
          <div className="resumo-addresses">
            <div className="form-group">
              <label>Origem</label>
              <input
                type="text"
                placeholder="Rua, número, cidade"
                value={origem}
                onChange={e => setOrigem(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Destino</label>
              <input
                type="text"
                placeholder="Rua, número, cidade"
                value={destino}
                onChange={e => setDestino(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        <div className="resumo-section">
          <div className="resumo-section-title">Resumo dos itens</div>
          <table className="resumo-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Dimensões (m)</th>
                <th>Qtd</th>
                <th>Peso</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, i) => (
                <tr key={i}>
                  <td>{it.name}</td>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: 13 }}>
                    {it.comp}x{it.larg}x{it.alt}
                  </td>
                  <td>{it.quantidade}</td>
                  <td>{(parseFloat(it.peso) * parseInt(it.quantidade)).toFixed(1)} kg</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="resumo-totals">
            <div className="total-item">
              <span className="total-label">Volume total</span>
              <span className="total-value">{volTotal.toFixed(2)} m³</span>
            </div>
            <div className="total-item">
              <span className="total-label">Peso total</span>
              <span className="total-value accent">{pesoTotal.toFixed(1)} kg</span>
            </div>
          </div>
        </div>

        <div className="resumo-actions">
          <button type="button" className="btn-secondary" onClick={onCancel}>Cancelar</button>
          <button type="submit" className="btn-primary">Confirmar pedido</button>
        </div>
      </form>
    </div>
  )
}