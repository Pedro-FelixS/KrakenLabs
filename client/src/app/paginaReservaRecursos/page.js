'use client';

import { useState, useEffect } from 'react';
import styles from './reserva.module.css';

const API_URL = 'http://localhost:5000/api';

export default function PaginaReservas() {
  const [reservas, setReservas] = useState([]);
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

  useEffect(() => {
    carregarReservas();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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

      const data = await res.json();

      if (!res.ok) {
        setMensagem({ tipo: 'erro', texto: data.error || 'Erro ao cadastrar reserva.' });
        return;
      }

      setMensagem({ tipo: 'sucesso', texto: 'Reserva cadastrada com sucesso!' });
      
      setForm({
        codigo_recurso: '',
        usuario_nome: '',
        data_inicio: '',
        data_fim: '',
        hora_inicio: '',
        hora_fim: '',
        status: 'Reservado'
      });

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

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>Cadastro de Reserva de Recursos</h1>

      {mensagem.texto && (
        <div className={mensagem.tipo === 'erro' ? styles.alertaErro : styles.alertaSucesso}>
          {mensagem.texto}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.formulario}>
        <div className={styles.campoGroup}>
          <label htmlFor="codigo_recurso">Código do Recurso:</label>
          <input 
            id="codigo_recurso"
            type="text" 
            name="codigo_recurso" 
            placeholder="Ex: LAB-01 ou SALA-202" 
            value={form.codigo_recurso} 
            onChange={handleChange} 
            required 
            className={styles.input}
          />
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
            />
          </div>
        </div>

        <div className={styles.campoGroup}>
          <label htmlFor="status">Status Inicial da Reserva:</label>
          <select 
            id="status"
            name="status" 
            value={form.status} 
            onChange={handleChange} 
            className={styles.select}
          >
            <option value="Reservado">Reservado (Aguardando uso)</option>
            <option value="Ocupado">Ocupado (Em uso)</option>
            <option value="Bloqueado">Bloqueado (Manutenção)</option>
            <option value="Livre">Livre</option>
          </select>
        </div>

        <button 
          type="submit" 
          disabled={carregando}
          className={styles.botaoSubmit}
        >
          {carregando ? 'Cadastrando...' : 'Cadastrar Reserva'}
        </button>
      </form>

      <h2 className={styles.subtitulo}>Reservas e Bloqueios Existentes</h2>
      {reservas.length === 0 ? (
        <p>Nenhuma reserva encontrada no momento.</p>
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
    </div>
  );
}