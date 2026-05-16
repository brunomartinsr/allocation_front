import { useState } from 'react'

export default function LoginPage({ onLogin, onGoToRegister }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const fd = new FormData(e.target)
    const data = Object.fromEntries(fd.entries())

    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          password: data.password
        })
      })

      if (!response.ok) {
        throw new Error('E-mail ou senha incorretos.')
      }

      const result = await response.json()
      localStorage.setItem('token', result.token)
      onLogin(result.user)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page-container">
      <div className="login-card">
        <div className="login-avatar">
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
          </svg>
        </div>

        <h1>Entrar</h1>
        {error && <p style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>E-mail</label>
            <input name="email" type="email" placeholder="seu@email.com" required />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input name="password" type="password" placeholder="••••••••" required />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          Não tem uma conta? <a href="#" onClick={(e) => { e.preventDefault(); onGoToRegister() }}>Registre-se</a>
        </p>
      </div>
    </div>
  )
}