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
      data,
      hora,
      usuario,
      status
    } = filtros;

    // Base da Query unindo Reservas, Recurso e Usuário
    let sql = `
      SELECT 
        res.id AS reserva_id,
        rec.codigo AS recurso_codigo,
        rec.nome AS recurso_nome,
        u.nome AS usuario_nome,
        u.email AS usuario_email,
        res.data_reserva,
        res.hora_inicio,
        res.hora_fim,
        res.status
      FROM reservas res
      INNER JOIN recursos rec ON res.recurso_id = rec.id
      INNER JOIN usuarios u ON res.usuario_cpf = u.cpf
      WHERE 1=1
    `;

    // Filtros dinâmicos adicionados apenas se fornecidos
    if (codigoRecurso) {
      sql += ` AND rec.codigo LIKE '%${codigoRecurso}%'`;
    }

    if (nomeRecurso) {
      sql += ` AND rec.nome LIKE '%${nomeRecurso}%'`;
    }

    // Período de datas ou Data exata
    if (dataInicio && dataFim) {
      sql += ` AND res.data_reserva BETWEEN '${dataInicio}' AND '${dataFim}'`;
    } else if (data) {
      sql += ` AND res.data_reserva = '${data}'`;
    }

    // Horário da reserva
    if (hora) {
      sql += ` AND '${hora}' BETWEEN res.hora_inicio AND res.hora_fim`;
    }

    // Usuário (pode buscar por nome, email ou CPF)
    if (usuario) {
      sql += ` AND (u.nome LIKE '%${usuario}%' OR u.email LIKE '%${usuario}%' OR u.cpf = '${usuario}')`;
    }

    // Status da reserva (ex: 'Ativa', 'Cancelada', 'Concluída')
    if (status) {
      sql += ` AND res.status = '${status}'`;
    }

    sql += ` ORDER BY res.data_reserva DESC, res.hora_inicio ASC`;

    console.log("SQL de Consulta montado =", sql);

    // Retorna a Promise nativa do db.query
    return this._db.query(sql);
  }
}

module.exports = ConsultaModel;