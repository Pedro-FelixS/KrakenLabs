'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './consulta.module.css';

export default function ConsultaReservas() {
  const [montado, setMontado] = useState(false);
  const [reservas, setReservas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const [filtros, setFiltros] = useState({
    codigoRecurso: '',
    nomeRecurso: '',
    dataInicio: '',
    dataFim: '',
    hora: '',
    usuario: '',
    status: ''
  });

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

    // Utiliza o mesmo padrão de Fallback de URLs da tela de Cadastro
    const urlsParaTestar = [
      `http://localhost:5000/api/consultar`,
      `http://localhost:5000/api/reservas/consultar`,
      `http://localhost:5000/reservas/consultar`
    ];

    let dados = null;

    for (const url of urlsParaTestar) {
      try {
        const res = await fetch(url);
        if (res.ok) {
          dados = await res.json();
          break;
        }
      } catch (e) {}
    }

    if (dados) {
      const lista = Array.isArray(dados) ? dados : (dados.recordset || []);
      setReservas(lista);
    } else {
      setErro('Não foi possível conectar com o servidor backend.');
    }

    setCarregando(false);
  };

  useEffect(() => {
    setMontado(true);
    buscarReservas();
  }, []);

  const handleChange = (e) => {
    setFiltros((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

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
    setTimeout(() => buscarReservas(), 50);
  };

  const formatarData = (dataStr) => {
    if (!dataStr) return '-';
    const parteData = dataStr.split('T')[0];
    const partes = parteData.split('-');
    return partes.length === 3 ? `${partes[2]}/${partes[1]}/${partes[0]}` : dataStr;
  };

  if (!montado) return null;

  return (
    <div className={styles.pageConsulta}>
      <main className={styles.mainConsulta}>
        <h1>KrakenLabs</h1>
        <h2 className={styles.subtitulo}>Consulta de Recursos e Reservas</h2>

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
                placeholder="Ex: Laboratório"
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
                placeholder="Ex: Henrique"
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
                <option value="Livre">Livre</option>
                <option value="Reservado">Reservado</option>
                <option value="Ocupado">Ocupado</option>
                <option value="Bloqueado">Bloqueado</option>
              </select>
            </div>
          </div>

          <div className={styles.acoesFiltros}>
            <button type="submit" className={styles.botao}>Filtrar</button>
            <button type="button" onClick={handleLimpar} className={`${styles.botao} ${styles.botaoSecundario}`}>
              Limpar Filtros
            </button>
          </div>
        </form>

        {carregando && <p className={styles.mensagemStatus}>Carregando dados...</p>}
        {erro && <p className={`${styles.mensagemStatus} ${styles.mensagemErro}`}>{erro}</p>}

        {!carregando && reservas.length === 0 ? (
          <p className={styles.mensagemStatus}>Nenhum resultado encontrado.</p>
        ) : (
          <div className={styles.tabelaContainer}>
            <table className={styles.tabelaReservas}>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nome do Recurso / Tipo</th>
                  <th>Localização</th>
                  <th>Usuário</th>
                  <th>Período Data</th>
                  <th>Horário</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {reservas.map((item, index) => (
                  <tr key={item.reserva_id || item.recurso_id || index}>
                    <td><strong>{item.codigo_recurso}</strong></td>
                    <td>
                      {item.recurso_nome}
                      <span style={{ fontSize: '12px', color: '#b7d4df', display: 'block' }}>
                        {item.ehLaboratorio ? 'Laboratório' : 'Sala'} | Cap: {item.capacidade}
                      </span>
                    </td>
                    <td>{item.localizacao}</td>
                    <td>{item.usuario_nome || '-'}</td>
                    <td>
                      {item.data_inicio ? `${formatarData(item.data_inicio)} até ${formatarData(item.data_fim)}` : '-'}
                    </td>
                    <td>
                      {item.hora_inicio ? `${item.hora_inicio} às ${item.hora_fim}` : '-'}
                    </td>
                    <td>
                      <span>{item.status || 'Livre'}</span>
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
    </div>
  );
}