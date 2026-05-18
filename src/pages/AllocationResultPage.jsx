import { useState } from 'react'

export default function AllocationResultPage({ result, onConfirm, onCancel }) {
  if (!result) return null

  const { resumo_geral, caminhoes, nao_alocados, message } = result

  return (
    <div className="allocation-result-page">
      <h1>Resultado da Alocação</h1>
      
      <div className="result-summary-card">
        <div className="summary-header">
          <div className="summary-main">
            <span className="summary-label">Valor Total Alocado</span>
            <span className="summary-value accent">R$ {resumo_geral.valor_total_alocado.toFixed(2)}</span>
          </div>
          <div className="summary-stats">
            <div className="stat">
              <span className="stat-label">Itens Alocados</span>
              <span className="stat-value">{resumo_geral.qtd_itens_alocados}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Itens não alocados</span>
              <span className="stat-value danger">{resumo_geral.qtd_itens_nao_alocados}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="allocation-details">
        <h3>Detalhamento por Caminhão</h3>
        <div className="truck-allocation-grid">
          {caminhoes.map((truck, idx) => (
            <div key={idx} className="truck-plan-card" style={{ opacity: truck.itens.length > 0 ? 1 : 0.6 }}>
              <div className="truck-plan-header">
                <strong>{truck.nome}</strong>
              </div>
              
              <div className="truck-plan-usage">
                <div className="usage-bar-container">
                  <div className="usage-label">Peso ({truck.percentual_peso}%)</div>
                  <div className="usage-bar"><div className="usage-fill" style={{ width: `${truck.percentual_peso}%` }}></div></div>
                </div>
                <div className="usage-bar-container">
                  <div className="usage-label">Espaço ({truck.percentual_comprimento}%)</div>
                  <div className="usage-bar"><div className="usage-fill accent" style={{ width: `${truck.percentual_comprimento}%` }}></div></div>
                </div>
              </div>

              <div className="truck-plan-items">
                <p><strong>{truck.itens.length} itens alocados:</strong></p>
                <ul>
                  {truck.itens.map((it, i) => (
                    <li key={i}>{it.nome} - R$ {it.valor.toFixed(2)}</li>
                  ))}
                </ul>
              </div>
              <div className="truck-plan-footer">
                <span>Valor no caminhão: <strong>R$ {truck.valor_total.toFixed(2)}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {nao_alocados.length > 0 && (
        <div className="not-allocated-section">
          <h3 className="danger">Itens não alocados</h3>
          <div className="items-list">
            {nao_alocados.map((it, i) => (
              <div key={i} className="item-card danger">
                <span>{it.nome} (Sem espaço ou excesso de peso)</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="result-actions">
        <button className="btn-secondary" onClick={onCancel}>Cancelar e Voltar</button>
        <button className="btn-primary" onClick={onConfirm}>Confirmar e Gerar Pedido</button>
      </div>
    </div>
  )
}
