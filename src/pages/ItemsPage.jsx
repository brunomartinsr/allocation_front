import { useState } from 'react'

function IconPackage() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20 7l-8-4-8 4m16 0v10l-8 4m-8-4V7m16 0l-8 4m-8-4l8 4"/>
    </svg>
  )
}

function IconEdit() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  )
}

function IconTrash() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
      <path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
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

export default function ItemsPage({ items, onAdd, onEdit, onDelete, onSolicitar, onPedidos, user }) {
  const [activeTab, setActiveTab] = useState('items')

  return (
    <div className="items-page">
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
        <button
          className={`tab-btn ${activeTab === 'items' ? 'active' : ''}`}
          onClick={() => setActiveTab('items')}
        >
          Itens
        </button>
        <button
          className={`tab-btn ${activeTab === 'pedidos' ? 'active' : ''}`}
          onClick={() => { setActiveTab('pedidos'); onPedidos() }}
        >
          Pedidos
        </button>
      </div>

      <div className="add-item-bar">
        <button className="btn-primary" onClick={onAdd}>+ Adicionar item</button>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <IconPackage />
          <p>Nenhum item adicionado ainda.</p>
          <p style={{ fontSize: 13 }}>Clique em "Adicionar item" para começar.</p>
        </div>
      ) : (
        <>
          <div className="items-list">
            {items.map((item, i) => (
              <div key={i} className="item-card">
                <div className="item-icon"><IconPackage /></div>
                <div className="item-info">
                  <div className="item-name">{item.name || 'Item sem nome'}</div>
                  <div className="item-meta">
                    {item.comp}x{item.larg}x{item.alt} m · {item.peso} kg
                    {item.quantidade > 1 && ` · x${item.quantidade}`}
                  </div>
                </div>
                <div className="item-actions">
                  <button className="btn-icon" onClick={() => onEdit(i)} title="Editar"><IconEdit /></button>
                  <button className="btn-icon danger" onClick={() => onDelete(i)} title="Remover"><IconTrash /></button>
                </div>
              </div>
            ))}
          </div>

          <div className="items-footer">
            <button className="btn-primary" onClick={onSolicitar}>
              Solicitar transporte
            </button>
          </div>
        </>
      )}
    </div>
  )
}