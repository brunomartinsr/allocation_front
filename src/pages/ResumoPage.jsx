import { useState } from 'react'

export default function ResumoPage({ items, onConfirmar, onCancel }) {
  const [origem, setOrigem] = useState('')
  const [destino, setDestino] = useState('')

  const pesoTotal = items.reduce((acc, it) => acc + parseFloat(it.peso || 0) * parseInt(it.quantidade || 1), 0)
  const volTotal = items.reduce((acc, it) => {
    const vol = parseFloat(it.comp || 0) * parseFloat(it.larg || 0) * parseFloat(it.alt || 0) * parseInt(it.quantidade || 1)
    return acc + vol
  }, 0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!origem || !destino) return

    const token = localStorage.getItem('token')
    
    // Preparar o payload exatamente como o backend espera
    const payload = {
      cargas: items.map(it => ({
        name: it.name,
        categoria: it.categoria,
        comp: parseFloat(it.comp),
        larg: parseFloat(it.larg),
        alt: parseFloat(it.alt),
        peso: parseFloat(it.peso),
        quantidade: parseInt(it.quantidade),
        valor: parseFloat(it.valor || 0) // Assumindo que o front possui o campo valor
      }))
    }

    try {
      const response = await fetch('http://localhost:8000/api/run-allocation/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) throw new Error('Erro na alocação')

      const data = await response.json()
      // Passa o resultado da alocação para a função de confirmação
      onConfirmar({ ...data, origem, destino })
    } catch (err) {
      console.error('Erro ao enviar pedido:', err)
      alert('Não foi possível realizar a alocação. Verifique os dados.')
    }
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
          <div className="items-list">
            {items.map((it, i) => (
              <div key={i} className="item-card" style={{ marginBottom: '12px' }}>
                <div className="item-info">
                  <div className="item-name">{it.name}</div>
                  <div className="item-details" style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px' }}>
                    <div><strong>Categoria:</strong> {it.categoria}</div>
                    <div><strong>Dimensões:</strong> {it.comp} x {it.larg} x {it.alt} m</div>
                    <div><strong>Peso:</strong> {it.peso} kg</div>
                    <div><strong>Quantidade:</strong> {it.quantidade} unidades</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="resumo-totals" style={{ marginTop: '24px' }}>
            <div className="total-item">
              <span className="total-label">Volume total </span>
              <span className="total-value">{volTotal.toFixed(2)} m³</span>
            </div>
            <div className="total-item">
              <span className="total-label">Peso total </span>
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