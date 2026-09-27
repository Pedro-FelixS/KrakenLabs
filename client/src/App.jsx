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
        <input>Nome:</input>
      </div>
    </div>
  );
}

export default App;