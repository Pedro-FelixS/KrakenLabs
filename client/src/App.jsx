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
      <div className='usuario'>
        <h2>Login do usuário</h2>
        <label className='cadastro'>
          <span className='grupo'>Nome completo:</span>
          <input type='text' placeholder='Seu nome completo'></input>
        </label>
        <label className='cadastro'>
          <span className='grupo'>CPF:</span>
          <input type='text' placeholder='XXX.XXX.XXX-XX'></input>
        </label>
        <label className='cadastro'>
          <span className='grupo'>Data de aniversário:</span>
          <input type='date' placeholder='digite sua data de aniversário'></input>
        </label>
        <label className='cadastro'>
          <span className='grupo'>Número de telefone:</span>
          <input type='tel' placeholder='digite seu número de telefone'></input>
        </label>
        <label className='cadastro'>
          <span className='grupo'>E-mail:</span>
          <input type='email' placeholder='digite seu e-mail'></input>
        </label>

      </div>
    </div>
  );
}

export default App;