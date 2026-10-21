'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './reserva.module.css';

const API_URL = 'http://localhost:5000';

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

  const carregarReservas = async () => {
    try {
      const res = await fetch(`${API_URL}/reservas`);
      if (!res.ok) throw new Error('Falha ao obter lista de reservas');
      const dados = await res.json();
      if (Array.isArray(dados)) setReservas(dados);
    } catch (err) {
      console.error('Erro ao buscar reservas:', err);
    }
  };

  const carregarRecursos = async () => {
    try {
      const res = await fetch(`${API_URL}/reservas/recursos`);
      if (!res.ok) throw new Error('Falha ao obter lista de recursos');
      const dados = await res.json();
      
      const listaArray = Array.isArray(dados) ? dados : (dados.recordset || []);

      const labsLivres = listaArray.filter((rec) => {
        const eLaboratorio = rec.ehLaboratorio == 1 || rec.ehLaboratorio === true;
        const estaLivre = rec.status_atual && rec.status_atual.toString().trim().toLowerCase() === 'livre';
        return eLaboratorio && estaLivre;
      });

      setRecursosDisponiveis(labsLivres);

      if (labsLivres.length > 0) {
        setForm((prev) => ({ ...prev, codigo_recurso: labsLivres[0].codigo }));
      }
    } catch (err) {
      console.error('Erro ao buscar laboratórios livres:', err);
    }
  };

  useEffect(() => {
    setMontado(true);
    carregarReservas();
    carregarRecursos();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // FUNÇÃO QUE ESTAVA FALTANDO:
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem({ tipo: '', texto: '' });
    setCarregando(true);

    try {
      const res = await fetch(`${API_URL}/reservas/criar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const dataText = await res.text();

      if (!res.ok) {
        setMensagem({ tipo: 'erro', texto: dataText || 'Erro ao cadastrar reserva.' });
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

      carregarReservas();
      carregarRecursos();
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
                {recursosDisponiveis.map((rec) => (
                  <option key={rec.id} value={rec.codigo}>
                    [{rec.codigo}] {rec.nome} — ({rec.ehLaboratorio ? 'Laboratório' : 'Sala'}) | Cap: {rec.capacidade}
                  </option>
                ))}
              </select>
            ) : (
              <p style={{ color: '#ff6b6b', fontWeight: 'bold' }}>
                Nenhum laboratório está com o status 'Livre' no momento.
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