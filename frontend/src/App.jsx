import { useState } from 'react'
import './App.css'

function App() {
  const [loads, setLoads] = useState([
    { name: '', quantidade: '', larg: '', alt: '', comp: '', peso: '', val: '' }
  ])
  const [response, setResponse] = useState('')

  const handleAddRow = () => {
    setLoads([...loads, { name: '', quantidade: '', larg: '', alt: '', comp: '', peso: '', val: '' }])
  }

  const handleChange = (index, field, value) => {
    // Bloqueia qualquer valor que contenha o sinal de menos (exceto para o campo name)
    if (field !== 'name' && typeof value === 'string' && value.includes('-')) return

    const newLoads = [...loads]
    newLoads[index][field] = value
    setLoads(newLoads)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validação final: impede envio se houver campos vazios
    const hasInvalid = loads.some(load => 
      Object.values(load).some(val => val === '')
    )

    if (hasInvalid) {
      setResponse('Erro: Todos os campos devem ser preenchidos.')
      return
    }

    setResponse('Enviando dados...')

    try {
      // Formata os dados para garantir que os valores numéricos sejam enviados como números
      const payload = {
        cargas: loads.map(load => ({
          name: load.name,
          quantidade: parseInt(load.quantidade),
          larg: parseFloat(load.larg),
          alt: parseFloat(load.alt),
          comp: parseFloat(load.comp),
          peso: parseFloat(load.peso),
          val: parseFloat(load.val)
        }))
      }

      // Requisição para o backend Django
      const res = await fetch('http://127.0.0.1:8000/api/run-allocation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      
      if (res.ok) {
        // Exibe o conteúdo da propriedade message (ou mensage) conforme solicitado
        setResponse(data.message || data.mensage || JSON.stringify(data, null, 2))
      } else {
        setResponse(`Erro do Servidor (${res.status}): ` + (data.message || data.mensage || JSON.stringify(data, null, 2)))
      }
    } catch (error) {
      setResponse('Erro de Conexão: Não foi possível alcançar o servidor em http://127.0.0.1:8000. Verifique se o Django está rodando e se o CORS está configurado.')
    }
  }

  // Função auxiliar para bloquear teclas indesejadas (sinal de menos e notação científica)
  const blockInvalidChar = (e) => {
    if (['-', 'e', 'E', '+'].includes(e.key)) {
      e.preventDefault()
    }
  }

  return (
    <main className="container">
      <h1>Calculador de Cargas</h1>
      
      <form onSubmit={handleSubmit} className="load-form">
        <div className="rows-container">
          {loads.map((load, index) => (
            <div key={index} className="load-row-wrapper">
              <div className="load-row">
                <div className="form-group">
                  <label>Nome da Carga</label>
                  <input
                    type="text"
                    value={load.name}
                    onChange={(e) => handleChange(index, 'name', e.target.value)}
                    placeholder="Ex: PALETE-FRAGIL"
                  />
                </div>
                <div className="form-group">
                  <label>Qtd</label>
                  <input
                    type="number"
                    min="1"
                    onKeyDown={blockInvalidChar}
                    value={load.quantidade}
                    onChange={(e) => handleChange(index, 'quantidade', e.target.value)}
                    placeholder="Ex: 10"
                  />
                </div>
                <div className="form-group">
                  <label>Larg (m)</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    onKeyDown={blockInvalidChar}
                    value={load.larg}
                    onChange={(e) => handleChange(index, 'larg', e.target.value)}
                    placeholder="Ex: 0.90"
                  />
                </div>
                <div className="form-group">
                  <label>Alt (m)</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    onKeyDown={blockInvalidChar}
                    value={load.alt}
                    onChange={(e) => handleChange(index, 'alt', e.target.value)}
                    placeholder="Ex: 2.18"
                  />
                </div>
                <div className="form-group">
                  <label>Comp (m)</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    onKeyDown={blockInvalidChar}
                    value={load.comp}
                    onChange={(e) => handleChange(index, 'comp', e.target.value)}
                    placeholder="Ex: 1.60"
                  />
                </div>
                <div className="form-group">
                  <label>Peso (kg)</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    onKeyDown={blockInvalidChar}
                    value={load.peso}
                    onChange={(e) => handleChange(index, 'peso', e.target.value)}
                    placeholder="Ex: 385"
                  />
                </div>
                <div className="form-group">
                  <label>Valor (R$)</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    onKeyDown={blockInvalidChar}
                    value={load.val}
                    onChange={(e) => handleChange(index, 'val', e.target.value)}
                    placeholder="Ex: 6959"
                  />
                </div>
              </div>
              
              <div className="add-row-container">
                <button type="button" className="add-button" onClick={handleAddRow}>
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        <button type="submit" className="submit-button">Enviar Alocação</button>
      </form>

      {response && (
        <section className="response-section">
          <h2>Resultado da Alocação</h2>
          <pre className="response-box">{response}</pre>
        </section>
      )}
    </main>
  )
}

export default App
