import { useState, useEffect } from 'react'
import './App.css'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CarrierDashboard from './pages/CarrierDashboard'
import TruckDetailPage from './pages/TruckDetailPage'
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
  const [selectedTruck, setSelectedTruck] = useState(null)
  const [carrierTab, setCarrierTab] = useState('caminhoes')
  const [trucks, setTrucks] = useState([])
  const [loadingTrucks, setLoadingTrucks] = useState(false)
  const [transports, setTransports] = useState([])
  const [loadingTransports, setLoadingTransports] = useState(false)

  const navigate = (p) => setPage(p)

  const fetchTrucks = async () => {
    const token = localStorage.getItem('token')
    if (!token) return
    setLoadingTrucks(true)
    try {
      const res = await fetch('http://localhost:8000/api/trucks', {
        headers: { 'Authorization': `Token ${token}` }
      })
      const data = await res.json()
      setTrucks(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingTrucks(false)
    }
  }

  const fetchTransports = async () => {
    const token = localStorage.getItem('token')
    if (!token) return
    setLoadingTransports(true)
    try {
      const res = await fetch('http://localhost:8000/api/transports/my-transports', {
        headers: { 'Authorization': `Token ${token}` }
      })
      const data = await res.json()
      setTransports(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingTransports(false)
    }
  }

  useEffect(() => {
    if (page === 'carrier-dashboard') {
      if (carrierTab === 'caminhoes') fetchTrucks()
      else fetchTransports()
    }
  }, [page, carrierTab])

  const handleSaveTruck = async (truckData) => {
    const method = truckData.id ? 'PUT' : 'POST'
    const url = truckData.id 
      ? `http://localhost:8000/api/trucks/${truckData.id}` 
      : 'http://localhost:8000/api/trucks'

    try {
      const token = localStorage.getItem('token')
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify(truckData)
      })
      if (res.ok) navigate('carrier-dashboard')
    } catch (err) {
      console.error('Erro ao salvar caminhão', err)
    }
  }

  const handleDeleteTruck = async (id) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`http://localhost:8000/api/trucks/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`
        }
      })
      if (res.ok) navigate('carrier-dashboard')
    } catch (err) {
      console.error('Erro ao excluir caminhão', err)
    }
  }

  const handleLogin = (userData) => {
    setUser(userData)
    if (userData.role === 'CARRIER') {
      navigate('carrier-dashboard')
    } else if (userData.role === 'ADMIN') {
      navigate('admin-dashboard')
    } else {
      navigate('items')
    }
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

  const Header = () => {
    if (page === 'login' || page === 'register') return null

    const getRoleLabel = (r) => {
      if (r === 'ADMIN') return 'Administrador'
      if (r === 'CARRIER') return 'Transportadora'
      return 'Cliente'
    }

    return (
      <header className="sticky-header">
        <nav className="header-nav">
          {user?.role === 'CARRIER' && (
            <>
              <button 
                className={`header-tab-btn ${carrierTab === 'caminhoes' && page === 'carrier-dashboard' ? 'active' : ''}`}
                onClick={() => { setCarrierTab('caminhoes'); navigate('carrier-dashboard') }}
              >
                Caminhões
              </button>
              <button 
                className={`header-tab-btn ${carrierTab === 'transportes' && page === 'carrier-dashboard' ? 'active' : ''}`}
                onClick={() => { setCarrierTab('transportes'); navigate('carrier-dashboard') }}
              >
                Transportes
              </button>
            </>
          )}
          {user?.role === 'CLIENT' && (
            <>
              <button 
                className={`header-tab-btn ${page === 'items' ? 'active' : ''}`}
                onClick={() => navigate('items')}
              >
                Novo Pedido
              </button>
              <button 
                className={`header-tab-btn ${page === 'pedidos' ? 'active' : ''}`}
                onClick={() => navigate('pedidos')}
              >
                Meus Pedidos
              </button>
            </>
          )}
        </nav>

        <div className="profile-section">
          <div className="profile-info">
            <span className="profile-name">{user?.full_name}</span>
            <span className="profile-role">{getRoleLabel(user?.role)}</span>
          </div>
          <div className="profile-avatar" onClick={() => navigate('login')} style={{cursor:'pointer'}}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
        </div>
      </header>
    )
  }

  return (
    <main className="container">
      <Header />

      <div className={page === 'login' || page === 'register' ? "" : "content-wrapper"}>
        {page === 'login' && <LoginPage onLogin={handleLogin} onGoToRegister={() => navigate('register')} />}
        {page === 'register' && <RegisterPage onRegister={handleLogin} onBackToLogin={() => navigate('login')} />}

        {page === 'carrier-dashboard' && (
          <CarrierDashboard 
            activeTab={carrierTab}
            onAddTruck={() => { setSelectedTruck(null); navigate('truck-detail') }}
            onSelectTruck={(truck) => { setSelectedTruck(truck); navigate('truck-detail') }}
            trucks={trucks}
            loading={loadingTrucks}
          />
        )}

        {page === 'truck-detail' && (
          <TruckDetailPage 
            truck={selectedTruck}
            onSave={handleSaveTruck}
            onDelete={handleDeleteTruck}
            onCancel={() => navigate('carrier-dashboard')}
          />
        )}

        {page === 'admin-dashboard' && (
          <div className="admin-view">
            <h1>Painel do Administrador</h1>
            <p>Gestão total do sistema de alocação.</p>
            <button onClick={() => navigate('login')} className="btn-secondary">Sair</button>
          </div>
        )}

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
      </div>
    </main>
  )
}
