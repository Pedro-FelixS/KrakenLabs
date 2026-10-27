class ConsultaModels {
  constructor(db) {
    this._db = db;
  }

  consultarReservasComFiltros(filtros) {
    const { recursoCodigo, recursoNome, dataInicio, dataFim, horaInicio, usuarioNome, status } = filtros;

    return new Promise((resolve, reject) => {
      let sql = `
        SELECT 
          res.id AS reserva_id,
          res.codigo_recurso,
          rec.nome AS recurso_nome,
          res.usuario_nome,
          res.data_inicio,
          res.data_fim,
          res.hora_inicio,
          res.hora_fim,
          res.status
        FROM Reservas res
        LEFT JOIN recursos rec ON res.codigo_recurso = rec.codigo
        WHERE 1=1
      `;

      if (recursoCodigo) {
        sql += " AND res.codigo_recurso LIKE '%" + recursoCodigo + "%'";
      }
      if (recursoNome) {
        sql += " AND rec.nome LIKE '%" + recursoNome + "%'";
      }
      if (dataInicio && dataFim) {
        sql += " AND res.data_inicio >= '" + dataInicio + "' AND res.data_fim <= '" + dataFim + "'";
      } else if (dataInicio) {
        sql += " AND res.data_inicio = '" + dataInicio + "'";
      }
      if (horaInicio) {
        sql += " AND res.hora_inicio = '" + horaInicio + "'";
      }
      if (usuarioNome) {
        sql += " AND res.usuario_nome LIKE '%" + usuarioNome + "%'";
      }
      if (status) {
        sql += " AND res.status = '" + status + "'";
      }

      sql += " ORDER BY res.data_inicio DESC, res.hora_inicio ASC";

      this._db.query(sql, (erro, recordset) => {
        if (erro) {
          console.log("ERRO na consulta = " + erro);
          return reject("Falha ao buscar reservas filtradas!");
        }
        resolve(recordset);
      });
    });
  }
}

module.exports = ConsultaModels;