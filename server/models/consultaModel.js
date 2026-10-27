class ConsultaModel {
  constructor(db) {
    this._db = db;
  }

  consultarReservasComFiltros(filtros) {
    const {
      codigoRecurso,
      nomeRecurso,
      dataInicio,
      dataFim,
      hora,
      usuario,
      status
    } = filtros;

    // A consulta parte da tabela 'recursos' para garantir que salas/labs apareçam
    let sql = `
      SELECT 
        rec.id AS recurso_id,
        rec.codigo AS codigo_recurso,
        rec.nome AS recurso_nome,
        rec.capacidade,
        rec.localizacao,
        rec.ehLaboratorio,
        rec.status_atual,
        res.id AS reserva_id,
        res.usuario_nome,
        res.data_inicio,
        res.data_fim,
        res.hora_inicio,
        res.hora_fim,
        ISNULL(res.status, rec.status_atual) AS status
      FROM recursos rec
      LEFT JOIN Reservas res ON rec.codigo = res.codigo_recurso
      WHERE 1=1
    `;

    // Filtros aplicados na tabela de recursos ou na de reservas
    if (codigoRecurso) {
      sql += ` AND rec.codigo LIKE '%${codigoRecurso}%'`;
    }

    if (nomeRecurso) {
      sql += ` AND rec.nome LIKE '%${nomeRecurso}%'`;
    }

    if (dataInicio && dataFim) {
      sql += ` AND (res.data_inicio <= '${dataFim}' AND res.data_fim >= '${dataInicio}')`;
    } else if (dataInicio) {
      sql += ` AND (res.data_fim >= '${dataInicio}' OR res.data_fim IS NULL)`;
    } else if (dataFim) {
      sql += ` AND (res.data_inicio <= '${dataFim}' OR res.data_inicio IS NULL)`;
    }

    if (hora) {
      sql += ` AND ('${hora}' BETWEEN res.hora_inicio AND res.hora_fim OR res.hora_inicio IS NULL)`;
    }

    if (usuario) {
      sql += ` AND res.usuario_nome LIKE '%${usuario}%'`;
    }

    if (status) {
      sql += ` AND (res.status = '${status}' OR rec.status_atual = '${status}')`;
    }

    sql += ` ORDER BY rec.codigo ASC, res.data_inicio DESC`;

    console.log("SQL de Consulta montado =", sql);

    return this._db.query(sql);
  }
}

module.exports = ConsultaModel;