'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './reserva.module.css';

export default function PaginaReservas() {
  const [montado, setMontado] = useState(false);
  const [reservas, setReservas] = useState([]);
  const [recursosDisponiveis, setRecursosDisponiveis] = useState([]);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
  const [carregando, setCarregando] = useState(false);

  const [form, setForm] = useState({
    codigo_recurso: '',
    usuario_nome: '',
    data_inicio: '',
    data_fim: '',
    hora_inicio: '',
    hora_fim: '',
    status: 'Reservado'
  });

  // Busca recursos livres na tabela 'recursos'
  const carregarRecursos = async () => {
    const urlsParaTestar = [
      'http://localhost:5000/api/reservas/recursos',
      'http://localhost:5000/reservas/recursos'
    ];

    let dados = null;

    for (const url of urlsParaTestar) {
      try {
        const res = await fetch(url);
        if (res.ok) {
          dados = await res.json();
          break;
        }
      } catch (e) {
        // Tenta a próxima URL no loop
      }
    }

    if (!dados) {
      console.error('Erro ao conectar com o backend para buscar recursos.');
      return;
    }

    const listaArray = Array.isArray(dados) ? dados : (dados.recordset || []);

    // Filtra apenas os recursos cujo status_atual seja 'Livre'
    const livres = listaArray.filter((rec) => {
      const status = rec.status_atual ? rec.status_atual.toString().trim().toLowerCase() : '';
      return status === 'livre';
    });

    setRecursosDisponiveis(livres);

    if (livres.length > 0) {
      setForm((prev) => ({ ...prev, codigo_recurso: livres[0].codigo }));
    }
  };

  // Busca o histórico de reservas
  const carregarReservas = async () => {
    const urlsParaTestar = [
      'http://localhost:5000/api/reservas',
      'http://localhost:5000/reservas'
    ];

    for (const url of urlsParaTestar) {
      try {
        const res = await fetch(url);
        if (res.ok) {
          const dados = await res.json();
          const lista = Array.isArray(dados) ? dados : (dados.recordset || []);
          setReservas(lista);
          break;
        }
      } catch (e) {}
    }
  };

  useEffect(() => {
    setMontado(true);
    carregarRecursos();
    carregarReservas();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem({ tipo: '', texto: '' });
    setCarregando(true);

    try {
      const urlsPost = [
        'http://localhost:5000/api/reservas/criar',
        'http://localhost:5000/reservas/criar'
      ];

      let res = null;

      for (const url of urlsPost) {
        try {
          const resposta = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
          });
          if (resposta.ok || resposta.status === 400 || resposta.status === 409) {
            res = resposta;
            break;
          }
        } catch (err) {}
      }

      if (!res) {
        throw new Error('Servidor indisponível');
      }

      const txt = await res.text();

      if (!res.ok) {
        setMensagem({ tipo: 'erro', texto: txt || 'Erro ao cadastrar reserva.' });
        return;
      }

      setMensagem({ tipo: 'sucesso', texto: 'Reserva cadastrada com sucesso!' });
      
      setForm((prev) => ({
        ...prev,
        usuario_nome: '',
        data_inicio: '',
        data_fim: '',
        hora_inicio: '',
        hora_fim: '',
        status: 'Reservado'
      }));

      carregarRecursos();
      carregarReservas();
    } catch (err) {
      setMensagem({ tipo: 'erro', texto: 'Erro de comunicação com o servidor backend.' });
    } finally {
      setCarregando(false);
    }
  };

  const getBadgeClass = (status) => {
    switch (status) {
      case 'Bloqueado': return `${styles.badge} ${styles.statusBloqueado}`;
      case 'Ocupado': return `${styles.badge} ${styles.statusOcupado}`;
      case 'Reservado': return `${styles.badge} ${styles.statusReservado}`;
      default: return `${styles.badge} ${styles.statusLivre}`;
    }
  };

  if (!montado) return null;

  return (
    <div className={styles.page}>
      <div className={styles.main}>
        <h1>KrakenLabs</h1>
        <h2 className={styles.subtitulo}>Reserva de Recursos</h2>

        {mensagem.texto && (
          <div className={mensagem.tipo === 'erro' ? styles.alertaErro : styles.alertaSucesso}>
            {mensagem.texto}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.formulario}>
          <div className={styles.campoGroup}>
            <label htmlFor="codigo_recurso">Selecione o Recurso Livre:</label>
            {recursosDisponiveis.length > 0 ? (
              <select 
                id="codigo_recurso"
                name="codigo_recurso" 
                value={form.codigo_recurso} 
                onChange={handleChange} 
                className={styles.select}
                required
              >
                {recursosDisponiveis.map((rec) => {
                  const ehLab = rec.ehLaboratorio == 1 || rec.ehLaboratorio === true;
                  return (
                    <option key={rec.id} value={rec.codigo}>
                      [{rec.codigo}] {rec.nome} — ({ehLab ? 'Laboratório' : 'Sala'}) | Cap: {rec.capacidade}
                    </option>
                  );
                })}
              </select>
            ) : (
              <p style={{ color: '#ff6b6b', fontWeight: 'bold', marginTop: '8px' }}>
                Nenhum recurso está marcado como 'Livre' na tabela no momento.
              </p>
            )}
          </div>

          <div className={styles.campoGroup}>
            <label htmlFor="usuario_nome">Usuário Solicitante:</label>
            <input 
              id="usuario_nome"
              type="text" 
              name="usuario_nome" 
              placeholder="Ex: João da Silva" 
              value={form.usuario_nome} 
              onChange={handleChange} 
              required 
              className={styles.input}
            />
          </div>

          <div className={styles.linhaDupla}>
            <div className={styles.campoGroup}>
              <label htmlFor="data_inicio">Data Inicial:</label>
              <input 
                id="data_inicio"
                type="date" 
                name="data_inicio" 
                value={form.data_inicio} 
                onChange={handleChange} 
                required 
                className={styles.input}
                suppressHydrationWarning
              />
            </div>
            <div className={styles.campoGroup}>
              <label htmlFor="data_fim">Data Final:</label>
              <input 
                id="data_fim"
                type="date" 
                name="data_fim" 
                value={form.data_fim} 
                onChange={handleChange} 
                required 
                className={styles.input}
                suppressHydrationWarning
              />
            </div>
          </div>

          <div className={styles.linhaDupla}>
            <div className={styles.campoGroup}>
              <label htmlFor="hora_inicio">Hora Inicial:</label>
              <input 
                id="hora_inicio"
                type="time" 
                name="hora_inicio" 
                value={form.hora_inicio} 
                onChange={handleChange} 
                required 
                className={styles.input}
                suppressHydrationWarning
              />
            </div>
            <div className={styles.campoGroup}>
              <label htmlFor="hora_fim">Hora Final:</label>
              <input 
                id="hora_fim"
                type="time" 
                name="hora_fim" 
                value={form.hora_fim} 
                onChange={handleChange} 
                required 
                className={styles.input}
                suppressHydrationWarning
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={carregando || recursosDisponiveis.length === 0}
            className={styles.botao}
          >
            {carregando ? 'Cadastrando...' : 'Cadastrar Reserva'}
          </button>
        </form>

        <h2 className={styles.subtitulo}>Reservas Existentes</h2>
        {reservas.length === 0 ? (
          <p style={{ color: '#b7d4df' }}>Nenhuma reserva encontrada no momento.</p>
        ) : (
          <ul className={styles.listaReservas}>
            {reservas.map((r) => (
              <li key={r.id} className={styles.reservaItem}>
                <div className={styles.reservaInfo}>
                  <strong>Recurso: {r.codigo_recurso}</strong> — Por <b>{r.usuario_nome}</b>
                  <br />
                  <small>
                    Período: {r.data_inicio} até {r.data_fim} | Horário: {r.hora_inicio} às {r.hora_fim}
                  </small>
                </div>
                <span className={getBadgeClass(r.status)}>
                  {r.status}
                </span>
              </li>
            ))}
          </ul>
        )}

        <br />
        <Link href="/paginaPrincipal" className={styles.botao}>
          Voltar ao Menu Principal
        </Link>
      </div>

      <footer className={styles.rodape}>
        KrakenLabs <br />
        &copy; Feito pelos REAIS devs Seniors P. Felix e H. Pompei
      </footer>
    </div>
  );
}