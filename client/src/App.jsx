import { useEffect, useState } from 'react';

function App() {
  const [mensagem, setMensagem] = useState('Carregando...');

  useEffect(() => {
    // Usa o localhost para o seu próprio PC. 
    // (Se for testar no celular no mesmo Wi-Fi, substitua 'localhost' pelo seu IPv4 do 'ipconfig')
    fetch('http://localhost:5000/api/dados')
      .then((res) => res.json())
      .then((data) => setMensagem(data.mensagem))
      .catch((err) => console.error('Erro ao buscar dados:', err));
  }, []);

  return (
    <div>
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1>KrakenLabs</h1>
        <p>Status do Servidor: <strong>{mensagem}</strong></p>
      </div>
      <div style={{ textAlign: 'center', marginTop: '60px' }}>
        <h2 id="usuários">Login de usuários:</h2>
        <label style={{ display: 'block', marginBottom: '20px' }}>
        <span style={{ display: 'block', marginBottom: '5px' }}>Nome:</span>
        <input type="text" placeholder="Nome: " style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
        </label>
        <label style = {{display: 'block'}}>
        <span style={{ display: 'block', marginBottom: '5px' }}>
            Senha(deve ter pelo menos oito caracteres!)
        </span>
        <input type="password" placeholder="Senha:" style={{ padding: '11px', borderRadius: '4px', border: '1px solid #ccc' }} />
        </label>
      </div>
    </div>
  );
}

export default App;