import { useState } from 'react'

export default function RegisterPage({ onRegister, onBackToLogin }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const fd = new FormData(e.target)
    const data = Object.fromEntries(fd.entries())

    try {
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: data.email, // Use email as username
          full_name: data.username, // Original typed full name
          email: data.email,
          password: data.password,
          role: data.role
        })
      })

      if (!response.ok) {
        const errData = await response.json()
        const fieldError = errData.username?.[0] || errData.email?.[0] || errData.password?.[0] || errData.detail
        throw new Error(fieldError || 'Erro ao registrar. Verifique os dados.')
      }

      const result = await response.json()
      onRegister(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-card">
      <h1>Criar Conta</h1>
      {error && <p className="error-message" style={{ color: 'red', marginBottom: '1rem', background: '#fee', padding: '10px', borderRadius: '4px', fontSize: '0.9rem' }}>{error}</p>}

      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Sou um(a):</label>
          <select name="role" className="user-type-select" required>
            <option value="CLIENT">Cliente (Tenho carga)</option>
            <option value="CARRIER">Transportadora (Tenho caminhão)</option>
          </select>
        </div>

        <div className="form-group">
          <label>Nome de Usuário</label>
          <input 
            name="username" 
            type="text" 
            placeholder="joao_123" 
            required 
            pattern="^[\w.@+-]+$"
            title="Apenas letras, números e @ . + - _"
          />
          <small style={{ color: '#666', fontSize: '0.75rem' }}>Apenas letras, números e @/./+/-/_</small>
        </div>

        <div className="form-group">
          <label>E-mail</label>
          <input name="email" type="email" placeholder="seu@email.com" required />
        </div>

        <div className="form-group">
          <label>Senha</label>
          <input name="password" type="password" placeholder="••••••••" required />
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Criando...' : 'Registrar'}
        </button>
      </form>

      <p style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        Já tem uma conta? <a href="#" onClick={(e) => { e.preventDefault(); onBackToLogin() }}>Entrar</a>
      </p>
    </div>
  )
}
