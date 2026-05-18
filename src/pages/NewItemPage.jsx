import { useState } from 'react'

const CATEGORIAS = ['Móvel', 'Eletrodoméstico', 'Eletrônico', 'Caixa', 'Palete', 'Fragil', 'Outro']
const blockInvalidChar = (e) => ['-', 'e', 'E', '+'].includes(e.key) && e.preventDefault()

const createEmptyItem = () => ({
  name: '', categoria: '', quantidade: '', larg: '', alt: '', comp: '', peso: ''
})

export default function NewItemPage({ onSave, onCancel, allCurrentItems }) {
  const [items, setItems] = useState(allCurrentItems && allCurrentItems.length > 0 ? allCurrentItems : [createEmptyItem()])

  const updateItem = (index, field, value) => {
    setItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item))
  }

  const removeItem = (index) => {
    if (items.length > 1) {
      setItems(prev => prev.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(items)
  }

  return (
    <div className="new-item-page">
      <h1>Adicionar Itens</h1>
      <form onSubmit={handleSubmit} className="new-items-scroll">
        {items.map((item, index) => (
          <div key={index} className="item-form-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3>Item {index + 1}</h3>
              {items.length > 1 && (
                <button type="button" className="btn-icon danger" onClick={() => removeItem(index)}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                  </svg>
                </button>
              )}
            </div>
            <div className="form-group">
              <label>Nome / Descrição</label>
              <input type="text" value={item.name} onChange={e => updateItem(index, 'name', e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Categoria</label>
              <select value={item.categoria} onChange={e => updateItem(index, 'categoria', e.target.value)} required>
                <option value="">Selecione...</option>
                {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Comprimento (metros).</label><input type="number" step="any" value={item.comp} onKeyDown={blockInvalidChar} onChange={e => updateItem(index, 'comp', e.target.value)} required /></div>
              <div className="form-group"><label>Largura (metros).</label><input type="number" step="any" value={item.larg} onKeyDown={blockInvalidChar} onChange={e => updateItem(index, 'larg', e.target.value)} required /></div>
              <div className="form-group"><label>Altura (metros).</label><input type="number" step="any" value={item.alt} onKeyDown={blockInvalidChar} onChange={e => updateItem(index, 'alt', e.target.value)} required /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Peso (kg)</label><input type="number" step="any" value={item.peso} onKeyDown={blockInvalidChar} onChange={e => updateItem(index, 'peso', e.target.value)} required /></div>
              <div className="form-group"><label>Quantidade (unidades).</label><input type="number" min="1" value={item.quantidade} onKeyDown={blockInvalidChar} onChange={e => updateItem(index, 'quantidade', e.target.value)} required /></div>
            </div>
          </div>
        ))}
        <div className="add-another-btn" onClick={() => setItems([...items, createEmptyItem()])}>
          + Adicionar outro item
        </div>
        <div className="form-actions" style={{minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '10px'}}>
          <button type="submit" className="btn-primary">Salvar tudo</button>
          <button type="button" className="btn-secondary" onClick={onCancel}>Cancelar</button>
        </div>
      </form>
    </div>
  )
}
