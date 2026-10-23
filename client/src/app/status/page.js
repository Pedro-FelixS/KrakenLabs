'use client';

import { useState, useEffect } from 'react';
import styles from './status.module.css';

export default function StatusPage() {
  const [recursos, setRecursos] = useState([]);
  const [recursoId, setRecursoId] = useState('');
  const [estado, setEstado] = useState('Livre');
  const [observacao, setObservacao] = useState('');
  const [carregando, setCarregando] = useState(false);

  // 1. Função isolada para buscar os recursos
  const carregarRecursos = async () => {
    try {
      const res = await fetch('http://localhost:5000/status');
      if (res.ok) {
        const dados = await res.json();
        setRecursos(dados);
      }
    } catch (erro) {
      console.error('Erro ao buscar recursos:', erro);
    }
  };

  // 2. Chama na abertura da tela
  useEffect(() => {
    carregarRecursos();
  }, []);

  const handleSalvarStatus = async (e) => {
    e.preventDefault();

    if (!recursoId) {
      alert('Selecione uma sala ou laboratório!');
      return;
    }

    setCarregando(true);

    try {
      const res = await fetch('http://localhost:5000/status/alterar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recursoId,
          estado,
          observacao
        }),
      });

      const mensagem = await res.text();

      if (!res.ok) {
        alert(mensagem);
        return;
      }

      alert('Status atualizado com sucesso!');
      
      setObservacao('');
      setRecursoId('');
      
      // 3. Recarrega a lista do banco para atualizar o "Atual: Status" no select na hora!
      carregarRecursos(); 
    } catch (erro) {
      alert('Erro ao conectar com o servidor.');
    } finally {
      setCarregando(false);
    }
  };

  return (
  <div className={styles.page}>
    <div className={styles.main}>
        <div className={styles.formContainer}>
            <h1>KrakenLabs</h1>
            <h2>Gerenciar Status de Recurso</h2>
            <form onSubmit={handleSalvarStatus}>
              <div className={styles.campos}>
                <label className={styles.cadastro}>
                <span className={styles.grupo}>
                  Selecione o Laboratório / Sala:
                </span>
              <select
               value={recursoId}
               onChange={(e) => setRecursoId(e.target.value)}
               required
              >
              <option value="">-- Selecione --</option>
                {recursos.map((item) => (
               <option key={item.id} value={item.id}>
              {item.nome} ({item.codigo}) - Atual: {item.status_atual}
                </option>
            ))}
              </select>
            </label>

            <label className={styles.cadastro}>
              <span className={styles.grupo}>
                Novo Status:
              </span>

             <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              required
            >
                <option value="Livre">Livre</option>
                <option value="Ocupado">Ocupado</option>
                <option value="Em Manutenção">Em Manutenção</option>
                <option value="Reservado">Reservado</option>
            </select>
          </label>

        <label className={styles.cadastro}>
            <span className={styles.grupo}>
                Observação / Motivo:
            </span>
            <input
                type="text"
                placeholder="Ex: Projetor queimado, aula prática de Redes..."
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                size="40"
            />
        </label>
      </div>
     <button
        type="submit"
        className={styles.botao}
        disabled={carregando}
      >
        {carregando ? 'Atualizando...' : 'Atualizar Status'}
    </button>
       </form>
        </div>
        </div>
        <span className={styles.rodape}>
            KrakenLabs <br />
            &copy; Feito pelos REAIS devs Sêniors P. Felix e H. Pompei
        </span>
    </div>
);
}