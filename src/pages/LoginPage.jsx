export default function LoginPage({ onLogin }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    const fd = new FormData(e.target)
    onLogin({ email: fd.get('email'), type: fd.get('type') })
  }

  return (
    <div className="login-card">
      <div className="login-avatar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
        </svg>
      </div>

      <h1>Entrar</h1>

      <form className="login-form" onSubmit={handleSubmit}>
        <select name="type" className="user-type-select" defaultValue="cliente">
          <option value="transportadora">Transportadora</option>
          <option value="admin">Administrador</option>
          <option value="cliente">Cliente</option>
        </select>

        <div className="form-group">
          <label>E-mail</label>
          <input name="email" type="email" placeholder="seu@email.com" required />
        </div>

        <div className="form-group">
          <label>Senha</label>
          <input name="password" type="password" placeholder="••••••••" required />
        </div>

        <button type="submit" className="btn-primary">Entrar</button>
      </form>
    </div>
  )
}