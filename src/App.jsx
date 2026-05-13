import { useState } from 'react'
import './App.css'
import LoginPage from './pages/LoginPage'
import ItemsPage from './pages/ItemsPage'
import NewItemPage from './pages/NewItemPage'
import ResumoPage from './pages/ResumoPage'
import ConfirmacaoPage from './pages/ConfirmacaoPage'
import PedidosPage from './pages/PedidosPage'

export default function App() {
  const [page, setPage] = useState('login')
  const [user, setUser] = useState(null)
  const [items, setItems] = useState([])
  const [pedidos, setPedidos] = useState([])
  const [editingItem, setEditingItem] = useState(null)
  const [lastPedido, setLastPedido] = useState(null)

  const navigate = (p) => setPage(p)

  const handleLogin = (userData) => {
    setUser(userData)
    navigate('items')
  }

  const handleSaveItem = (item) => {
    if (editingItem !== null) {
      setItems(prev => prev.map((it, i) => i === editingItem ? item : it))
      setEditingItem(null)
    } else {
      setItems(prev => [...prev, item])
    }
    navigate('items')
  }

  const handleDeleteItem = (index) => {
    setItems(prev => prev.filter((_, i) => i !== index))
  }

  const handleEditItem = (index) => {
    setEditingItem(index)
    navigate('new-item')
  }

  const handleConfirmarPedido = (pedido) => {
    const novoPedido = {
      ...pedido,
      id: `TRK-${Math.floor(10000 + Math.random() * 90000)}`,
      data: new Date().toLocaleDateString('pt-BR'),
      hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      status: [
        { label: 'Pedido confirmado', done: true },
        { label: 'Transportadora alocada', done: false },
        { label: 'Coleta agendada', done: false },
        { label: 'Em trânsito', done: false },
        { label: 'Entregue', done: false },
      ]
    }
    setLastPedido(novoPedido)
    setPedidos(prev => [novoPedido, ...prev])
    setItems([])
    navigate('confirmacao')
  }

  const pageProps = { navigate, user, items, pedidos, lastPedido, editingItem }

  return (
    <main className="container">
      {page === 'login' && <LoginPage onLogin={handleLogin} />}
      {page === 'items' && (
        <ItemsPage
          items={items}
          onAdd={() => { setEditingItem(null); navigate('new-item') }}
          onEdit={handleEditItem}
          onDelete={handleDeleteItem}
          onSolicitar={() => navigate('resumo')}
          onPedidos={() => navigate('pedidos')}
          user={user}
        />
      )}
      {page === 'new-item' && (
        <NewItemPage
          onSave={handleSaveItem}
          onCancel={() => { setEditingItem(null); navigate('items') }}
          initialData={editingItem !== null ? items[editingItem] : null}
        />
      )}
      {page === 'resumo' && (
        <ResumoPage
          items={items}
          onConfirmar={handleConfirmarPedido}
          onCancel={() => navigate('items')}
        />
      )}
      {page === 'confirmacao' && (
        <ConfirmacaoPage
          pedido={lastPedido}
          onVerPedidos={() => navigate('pedidos')}
        />
      )}
      {page === 'pedidos' && (
        <PedidosPage
          pedidos={pedidos}
          onBack={() => navigate('items')}
          user={user}
        />
      )}
    </main>
  )
}