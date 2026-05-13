import { useState } from 'react'

const CATEGORIAS = [
  'Móvel', 'Eletrodoméstico', 'Eletrônico', 'Caixa', 'Palete', 'Fragil', 'Outro'
]

const blockInvalidChar = (e) => {
  if (['-', 'e', 'E', '+'].includes(e.key)) e.preventDefault()
}

export default function NewItemPage({ onSave, onCancel, initialData }) {
  const [form, setForm] = useState(initialData || {
    name: '', categoria: '', quantidade: '', larg: '', alt: '', comp: '', peso: ''
  })

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const hasEmpty = Object.values(form).some(v => v === '')
    if (hasEmpty) return
    onSave(form)
  }

  return (
    <div className="new-item-page">
      <h1>{initialData ? 'Editar item' : 'Novo item'}</h1>

      <form className="new-item-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nome / Descrição</label>
          <input
            type="text"
            placeholder="Ex: Sofá 3 lugares"
            value={form.name}
            onChange={e => set('name', e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Categoria</label>
          <select
            value={form.categoria}
            onChange={e => set('categoria', e.target.value)}
            required
          >
            <option value="">Selecione...</option>
            {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <div className="form-section-title">Dimensões (m)</div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Comp.</label>
            <input
              type="number" min="0" step="any"
              placeholder="Ex: 2.00"
              value={form.comp}
              onKeyDown={blockInvalidChar}
              onChange={e => set('comp', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Larg.</label>
            <input
              type="number" min="0" step="any"
              placeholder="Ex: 0.90"
              value={form.larg}
              onKeyDown={blockInvalidChar}
              onChange={e => set('larg', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Alt.</label>
            <input
              type="number" min="0" step="any"
              placeholder="Ex: 0.85"
              value={form.alt}
              onKeyDown={blockInvalidChar}
              onChange={e => set('alt', e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Peso (kg)</label>
            <input
              type="number" min="0" step="any"
              placeholder="Ex: 45"
              value={form.peso}
              onKeyDown={blockInvalidChar}
              onChange={e => set('peso', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Quantidade</label>
            <input
              type="number" min="1"
              placeholder="Ex: 1"
              value={form.quantidade}
              onKeyDown={blockInvalidChar}
              onChange={e => set('quantidade', e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onCancel}>Cancelar</button>
          <button type="submit" className="btn-primary">Salvar</button>
        </div>
      </form>
    </div>
  )
}