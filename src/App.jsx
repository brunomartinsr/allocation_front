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
import AllocationResultPage from './pages/AllocationResultPage'

export default function App() {
  const [page, setPage] = useState('login')
  const [user, setUser] = useState(null)
  const [items, setItems] = useState([])
  const [pedidos, setPedidos] = useState([])
  const [editingItem, setEditingItem] = useState(null)
  const [lastPedido, setLastPedido] = useState(null)
  const [allocationResult, setAllocationResult] = useState(null)
  const [orderMetadata, setOrderMetadata] = useState({ origem: '', destino: '' })
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
    // ... (unchanged)
  }

  const fetchPedidos = async () => {
    const token = localStorage.getItem('token')
    if (!token) return
    try {
      const res = await fetch('http://localhost:8000/api/pedidos', {
        headers: { 'Authorization': `Token ${token}` }
      })
      const data = await res.json()
      setPedidos(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Erro ao buscar pedidos:', err)
    }
  }

  useEffect(() => {
    if (page === 'carrier-dashboard') {
      if (carrierTab === 'caminhoes') fetchTrucks()
      else fetchTransports()
    }
    if (page === 'pedidos') {
      fetchPedidos()
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

  const handleSaveItem = (newItems) => {
    if (editingItem !== null) {
      // Se estiver editando, substitui o item específico pelo primeiro item do array de novos itens
      setItems(prev => prev.map((it, i) => i === editingItem ? newItems[0] : it))
      setEditingItem(null)
    } else {
      // Se for novo, apenas adiciona ao final
      setItems(prev => [...prev, ...newItems])
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

  const handleRunAllocation = (result, meta) => {
    setAllocationResult(result)
    setOrderMetadata(meta)
    navigate('allocation-result')
  }

  const handleFinalConfirmOrder = async () => {
    const token = localStorage.getItem('token')
    const payload = {
      origem: orderMetadata.origem,
      destino: orderMetadata.destino,
      alocacao: allocationResult
    }

    try {
      const res = await fetch('http://localhost:8000/api/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Erro ao salvar pedido')
      
      const data = await res.json()
      // Reaproveita a lógica de sucesso
      handleConfirmarPedido({ ...allocationResult, origem: orderMetadata.origem, destino: orderMetadata.destino })
      setAllocationResult(null)
    } catch (err) {
      console.error(err)
      alert('Erro ao confirmar pedido no servidor.')
    }
  }

  const handleCancelAllocation = () => {
    setItems([])
    setAllocationResult(null)
    navigate('pedidos')
  }

  const handleConfirmarPedido = (resultadoAlocacao) => {
    // resultadoAlocacao contém { resumo_geral, caminhoes, nao_alocados, message, origem, destino }
    const novoPedido = {
      id: `TRK-${Math.floor(10000 + Math.random() * 90000)}`,
      data: new Date().toLocaleDateString('pt-BR'),
      hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      origem: resultadoAlocacao.origem,
      destino: resultadoAlocacao.destino,
      // Quantidade de itens é a soma de itens alocados + não alocados
      itensCount: resultadoAlocacao.resumo_geral.qtd_itens_alocados + resultadoAlocacao.resumo_geral.qtd_itens_nao_alocados,
      pesoTotal: resultadoAlocacao.caminhoes.reduce((acc, c) => acc + c.peso_utilizado, 0),
      volTotal: resultadoAlocacao.caminhoes.reduce((acc, c) => acc + c.comprimento_utilizado, 0), // Simplificado
      status: [
        { label: 'Pedido confirmado', done: true },
        { label: 'Transportadora alocada', done: false },
        { label: 'Coleta agendada', done: false },
        { label: 'Em trânsito', done: false },
        { label: 'Entregue', done: false },
      ],
      detalhes: resultadoAlocacao // Guarda o objeto completo da API
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
            allCurrentItems={items}
          />
        )}

        {page === 'resumo' && (
          <ResumoPage
            items={items}
            onConfirmar={handleRunAllocation}
            onCancel={() => navigate('items')}
          />
        )}

        {page === 'allocation-result' && (
          <AllocationResultPage
            result={allocationResult}
            onConfirm={handleFinalConfirmOrder}
            onCancel={handleCancelAllocation}
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
