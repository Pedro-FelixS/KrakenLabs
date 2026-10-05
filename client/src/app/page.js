'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [mensagem, setMensagem] = useState('Carregando...');

  useEffect(() => {
    fetch('http://localhost:5000/api/dados')
      .then((res) => res.json())
      .then((data) => setMensagem(data.mensagem))
      .catch((err) => console.error('Erro ao buscar dados:', err));
  }, []);

  return (
    <div>
      <div className="status-container">
        <h1>KrakenLabs</h1>
        <p>Sistema de Reserva de Laboratórios e Salas</p>
        <p>Status do Servidor: <strong>{mensagem}</strong></p>
      </div>

      <div className="usuario">
        <h2>Login / Cadastro de usuário</h2>

        <label className="cadastro">
          <span className="grupo">Nome completo:</span>
          <input type="text" placeholder="Seu nome completo" />
        </label>

        <label className="cadastro">
          <span className="grupo">Senha (Deve ter no mínimo oito caracteres):</span>
          <input type="password" placeholder="Digite sua senha" />
        </label>

        <label className="cadastro">
          <span className="grupo">CPF:</span>
          <input type="text" placeholder="XXX.XXX.XXX-XX" />
        </label>

        <label className="cadastro">
          <span className="grupo">Data de aniversário:</span>
          <input type="date" />
        </label>

        <label className="cadastro">
          <span className="grupo">Número de telefone:</span>
          <input type="tel" placeholder="digite seu número de telefone" />
        </label>

        <label className="cadastro">
          <span className="grupo">E-mail:</span>
          <input type="email" placeholder="digite seu e-mail" />
        </label>
      </div>
    </div>
  );
}