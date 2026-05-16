import { useState } from 'react'

export default function TruckDetailPage({ truck, onSave, onDelete, onCancel }) {
  const [formData, setFormData] = useState(truck || {
    model: '',
    plate: '',
    capacity: 0,
    alt: 0,
    larg: 0,
    comp: 0
  })

  const isEditing = !!truck?.id

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="truck-detail-page">
      <header className="page-header">
        <button onClick={onCancel} className="btn-back">← Voltar</button>
        <h1>{isEditing ? 'Detalhes do Caminhão' : 'Novo Caminhão'}</h1>
      </header>

      <form className="truck-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Modelo / Nome</label>
          <input 
            type="text" 
            value={formData.model} 
            onChange={e => setFormData({...formData, model: e.target.value})}
            placeholder="Ex: Scania R450"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Placa</label>
            <input 
              type="text" 
              value={formData.plate} 
              onChange={e => setFormData({...formData, plate: e.target.value})}
              placeholder="ABC-1234"
              required
            />
          </div>
          <div className="form-group">
            <label>Capacidade (kg)</label>
            <input 
              type="number" 
              value={formData.capacity} 
              onChange={e => setFormData({...formData, capacity: parseFloat(e.target.value)})}
              required
            />
          </div>
        </div>

        <div className="form-section-title" style={{marginTop: '10px', fontSize: '12px', color: 'var(--app-accent)'}}>DIMENSÕES</div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Comprimento (m)</label>
            <input 
              type="number" step="0.01"
              value={formData.comp} 
              onChange={e => setFormData({...formData, comp: parseFloat(e.target.value)})}
              required
            />
          </div>
          <div className="form-group">
            <label>Largura (m)</label>
            <input 
              type="number" step="0.01"
              value={formData.larg} 
              onChange={e => setFormData({...formData, larg: parseFloat(e.target.value)})}
              required
            />
          </div>
          <div className="form-group">
            <label>Altura (m)</label>
            <input 
              type="number" step="0.01"
              value={formData.alt} 
              onChange={e => setFormData({...formData, alt: parseFloat(e.target.value)})}
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">Salvar</button>
          {isEditing && (
            <button 
              type="button" 
              onClick={() => onDelete(truck.id)} 
              className="btn-danger"
            >
              Excluir
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
