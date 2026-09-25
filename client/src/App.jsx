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
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Projeto de Laboratório</h1>
      <p>Status do Servidor: <strong>{mensagem}</strong></p>
    </div>
  );
}

export default App;