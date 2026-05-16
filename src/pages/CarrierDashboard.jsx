import { useState, useEffect } from 'react'

export default function CarrierDashboard({ activeTab, onAddTruck, onSelectTruck, loading, trucks }) {
  // Using props passed from App.jsx instead of internal fetch for cleaner sync with Header
  return (
    <div className="carrier-dashboard">
      <main className="dashboard-content">
        {activeTab === 'caminhoes' ? (
          <div className="trucks-section">
            {loading ? <p>Carregando...</p> : (
              <div className="truck-list">
                {trucks.map(truck => (
                  <div key={truck.id} className="truck-item-card" onClick={() => onSelectTruck(truck)}>
                    <div className="truck-icon">
                      <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M1 14h13V6H4L1 9v5zM14 14h7v-3l-3-3h-4v6z" />
                        <circle cx="4" cy="18" r="2" /><circle cx="17" cy="18" r="2" />
                      </svg>
                    </div>
                    <div className="truck-details">
                      <div className="info-row"><strong>Modelo:</strong> {truck.model}</div>
                      <div className="info-row"><strong>Placa:</strong> {truck.plate}</div>
                      <div className="info-row"><strong>Capacidade:</strong> {truck.capacity}kg</div>
                      <div className="info-row"><strong>Dimensões:</strong> {truck.comp}m x {truck.larg}m x {truck.alt}m</div>
                    </div>
                  </div>
                ))}
                
                <div className="truck-item-card add-truck-card" onClick={onAddTruck}>
                  <div className="truck-icon add-icon">
                    <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </div>
                  <div className="truck-details">
                    <div className="info-row" style={{fontWeight: '600', color: 'var(--accent)'}}>Adicionar Novo Caminhão</div>
                    <div className="info-row" style={{fontSize: '12px'}}>Clique para cadastrar um novo veículo</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <TransportHistoryPage />
        )}
      </main>
    </div>
  )
}

function TransportHistoryPage() {
  const [transports, setTransports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetch('http://localhost:8000/api/transports/my-transports', {
        headers: {
          'Authorization': `Token ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        setTransports(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
    }
  }, [])

  return (
    <div className="history-section">
      <h3>Transportes Confirmados</h3>
      {loading ? <p>Carregando...</p> : (
        <div className="transport-list">
          {transports.length > 0 ? transports.map(t => (
            <div key={t.id} className="transport-card">
              <div className="transport-main">
                <strong>{t.name}</strong>
                <span>{t.origin} → {t.destination}</span>
              </div>
              <div className="transport-status">
                <span className={`badge ${t.status}`}>{t.status}</span>
                <span>{t.date}</span>
              </div>
            </div>
          )) : <p>Nenhum transporte realizado ainda.</p>}
        </div>
      )}
    </div>
  )
}
