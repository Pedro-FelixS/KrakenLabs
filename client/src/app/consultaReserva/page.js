"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './consulta.module.css';

const ConsultaReservas = () => {
  const [filtros, setFiltros] = useState({
    codigoRecurso: '',
    nomeRecurso: '',
    dataInicio: '',
    dataFim: '',
    hora: '',
    usuario: '',
    status: ''
  });

  const [reservas, setReservas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const buscarReservas = async () => {
    setCarregando(true);
    setErro('');

    const params = new URLSearchParams();
    Object.keys(filtros).forEach((key) => {
      if (filtros[key] && filtros[key].trim() !== '') {
        params.append(key, filtros[key].trim());
      }
    });

    const queryString = params.toString() ? `?${params.toString()}` : '';

    try {
      const res = await fetch(`http://localhost:5000/consultar${queryString}`);

      if (!res.ok) {
        throw new Error(`Servidor respondeu com status ${res.status}`);
      }

      const dados = await res.json();
      
      // Trata array vindo direto ou envolto em objeto recordset
      const lista = Array.isArray(dados) ? dados : (dados.recordset || []);
      setReservas(lista);
    } catch (err) {
      console.error('Erro na consulta:', err);
      setErro('Erro ao buscar reservas. Verifique a conexão com o servidor.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    buscarReservas();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    buscarReservas();
  };

  const handleLimpar = () => {
    setFiltros({
      codigoRecurso: '',
      nomeRecurso: '',
      dataInicio: '',
      dataFim: '',
      hora: '',
      usuario: '',
      status: ''
    });
    
    // Dispara a busca sem nenhum filtro
    setTimeout(() => {
      buscarReservas();
    }, 50);
  };

  const getBadgeClass = (status) => {
    const statusNormalizado = status ? status.toString().trim() : '';
    switch (statusNormalizado) {
      case 'Bloqueado': 
      case 'Ocupado': return `${styles.badgeStatus} ${styles.statusCancelada}`;
      case 'Reservado': 
      case 'Ativa': return `${styles.badgeStatus} ${styles.statusAtiva}`;
      default: return `${styles.badgeStatus} ${styles.statusConcluida}`;
    }
  };

  const formatarData = (dataStr) => {
    if (!dataStr) return '-';
    // Trata datas vindas no formato ISO do SQL Server (Ex: 2026-10-22T00:00:00.000Z)
    const parteData = dataStr.split('T')[0];
    const partes = parteData.split('-');
    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    return dataStr;
  };

  return (
    <div className={styles.pageConsulta}>
      <main className={styles.mainConsulta}>
        <h1>KrakenLabs</h1>
        <h2 style={{ color: '#b7d4df', marginBottom: '20px' }}>Consulta de Reservas</h2>

        {/* Formulário de Filtros */}
        <form onSubmit={handleSubmit} className={styles.cardFiltros}>
          <div className={styles.gridFiltros}>
            
            <div className={styles.campoFiltro}>
              <label htmlFor="codigoRecurso">Código do Recurso:</label>
              <input
                id="codigoRecurso"
                type="text"
                name="codigoRecurso"
                value={filtros.codigoRecurso}
                onChange={handleChange}
                placeholder="Ex: LAB01"
              />
            </div>

            <div className={styles.campoFiltro}>
              <label htmlFor="nomeRecurso">Nome do Recurso:</label>
              <input
                id="nomeRecurso"
                type="text"
                name="nomeRecurso"
                value={filtros.nomeRecurso}
                onChange={handleChange}
                placeholder="Ex: Laboratório de Redes"
              />
            </div>

            <div className={styles.campoFiltro}>
              <label htmlFor="dataInicio">Data Início:</label>
              <input
                id="dataInicio"
                type="date"
                name="dataInicio"
                value={filtros.dataInicio}
                onChange={handleChange}
                suppressHydrationWarning
              />
            </div>

            <div className={styles.campoFiltro}>
              <label htmlFor="dataFim">Data Fim:</label>
              <input
                id="dataFim"
                type="date"
                name="dataFim"
                value={filtros.dataFim}
                onChange={handleChange}
                suppressHydrationWarning
              />
            </div>

            <div className={styles.campoFiltro}>
              <label htmlFor="hora">Horário:</label>
              <input
                id="hora"
                type="time"
                name="hora"
                value={filtros.hora}
                onChange={handleChange}
                suppressHydrationWarning
              />
            </div>

            <div className={styles.campoFiltro}>
              <label htmlFor="usuario">Usuário (Nome):</label>
              <input
                id="usuario"
                type="text"
                name="usuario"
                value={filtros.usuario}
                onChange={handleChange}
                placeholder="Ex: João Silva"
              />
            </div>

            <div className={styles.campoFiltro}>
              <label htmlFor="status">Status:</label>
              <select
                id="status"
                name="status"
                value={filtros.status}
                onChange={handleChange}
              >
                <option value="">Todos</option>
                <option value="Reservado">Reservado</option>
                <option value="Ocupado">Ocupado</option>
                <option value="Bloqueado">Bloqueado</option>
              </select>
            </div>

          </div>

          <div className={styles.acoesFiltros}>
            <button type="submit" className={styles.botao}>
              Filtrar
            </button>
            <button 
              type="button" 
              onClick={handleLimpar} 
              className={`${styles.botao} ${styles.botaoSecundario}`}
            >
              Limpar Filtros
            </button>
          </div>
        </form>

        {/* Mensagens de Feedback */}
        {carregando && <p className={styles.mensagemStatus}>Carregando reservas...</p>}
        {erro && <p className={`${styles.mensagemStatus} ${styles.mensagemErro}`}>{erro}</p>}

        {/* Tabela de Resultados */}
        {!carregando && reservas.length === 0 ? (
          <p className={styles.mensagemStatus}>Nenhuma reserva encontrada para os filtros aplicados.</p>
        ) : (
          <div className={styles.tabelaContainer}>
            <table className={styles.tabelaReservas}>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nome do Recurso / Tipo</th>
                  <th>Usuário</th>
                  <th>Período Data</th>
                  <th>Horário</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {reservas.map((r, index) => (
                  <tr key={r.id || index}>
                    <td><strong>{r.codigo_recurso || '-'}</strong></td>
                    <td>
                      {r.recurso_nome || r.codigo_recurso}
                      {r.ehLaboratorio !== undefined && (
                        <span style={{ fontSize: '12px', color: '#b7d4df', display: 'block' }}>
                          {r.ehLaboratorio ? 'Laboratório' : 'Sala'} | Cap: {r.capacidade || '-'}
                        </span>
                      )}
                    </td>
                    <td>{r.usuario_nome || '-'}</td>
                    <td>
                      {r.data_inicio ? `${formatarData(r.data_inicio)} até ${formatarData(r.data_fim)}` : '-'}
                    </td>
                    <td>
                      {r.hora_inicio ? `${r.hora_inicio} às ${r.hora_fim}` : '-'}
                    </td>
                    <td>
                      <span className={getBadgeClass(r.status)}>
                        {r.status || 'Reservado'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <br />
        <Link href="/paginaPrincipal" className={styles.botao}>
          Voltar ao Menu Principal
        </Link>
      </main>

      <footer className={styles.rodape}>
        KrakenLabs <br />
        &copy; Feito pelos REAIS devs Seniors P. Felix e H. Pompei
      </footer>
    </div>
  );
};

export default ConsultaReservas;