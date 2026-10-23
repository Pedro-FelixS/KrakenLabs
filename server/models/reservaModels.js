class ReservaModel {
  constructor(db) {
    this._db = db;
  }

  // Busca todos os recursos
  buscarRecursos() {
    return new Promise((resolve, reject) => {
      const sql = "SELECT id, codigo, nome, capacidade, localizacao, ehLaboratorio, status_atual FROM recursos ORDER BY nome ASC";
      
      this._db.query(sql, (erro, recordset) => {
        if (erro) {
          console.log("ERRO = " + erro);
          return reject("Listagem de recursos FALHOU!");
        }
        console.log("Listagem de recursos executou com SUCESSO!");
        resolve(recordset);
      });
    });
  }

  // Lista todas as reservas
  getAll() {
    return new Promise((resolve, reject) => {
      const sql = "SELECT id, codigo_recurso, usuario_nome, data_inicio, data_fim, hora_inicio, hora_fim, status FROM Reservas ORDER BY id DESC";
      
      this._db.query(sql, (erro, recordset) => {
        if (erro) {
          console.log("ERRO = " + erro);
          return reject("Listagem de reservas FALHOU!");
        }
        console.log("Listagem de reservas executou com SUCESSO!");
        resolve(recordset);
      });
    });
  }

  // Verifica se há conflito de horário
  verificarDisponibilidade(codigo_recurso, data_inicio, data_fim, hora_inicio, hora_fim) {
    return new Promise((resolve, reject) => {
      let sql = "SELECT * FROM Reservas ";
      sql += "WHERE codigo_recurso = '" + codigo_recurso + "' ";
      sql += "AND status IN ('Reservado', 'Ocupado', 'Bloqueado') ";
      sql += "AND (data_inicio <= '" + data_fim + "' AND data_fim >= '" + data_inicio + "') ";
      sql += "AND (";
      sql += "('" + hora_inicio + "' >= hora_inicio AND '" + hora_inicio + "' < hora_fim) OR ";
      sql += "('" + hora_fim + "' > hora_inicio AND '" + hora_fim + "' <= hora_fim) OR ";
      sql += "(hora_inicio >= '" + hora_inicio + "' AND hora_fim <= '" + hora_fim + "')";
      sql += ")";

      this._db.query(sql, (erro, recordset) => {
        if (erro) {
          console.log("ERRO = " + erro);
          return reject("Verificação de disponibilidade FALHOU!");
        }
        resolve(recordset);
      });
    });
  }

  // Insere uma nova reserva
  create(reserva) {
    return new Promise((resolve, reject) => {
      let sql = "INSERT INTO Reservas (codigo_recurso, usuario_nome, data_inicio, data_fim, hora_inicio, hora_fim, status) VALUES (";
      sql += "'" + reserva.codigo_recurso + "',";
      sql += "'" + reserva.usuario_nome + "',";
      sql += "'" + reserva.data_inicio + "',";
      sql += "'" + reserva.data_fim + "',";
      sql += "'" + reserva.hora_inicio + "',";
      sql += "'" + reserva.hora_fim + "',";
      sql += "'" + (reserva.status || 'Reservado') + "')";

      this._db.query(sql, (erro) => {
        if (erro) {
          console.log("ERRO = " + erro);
          return reject("Inclusão de nova reserva FALHOU!");
        }
        console.log("Reserva inserida com SUCESSO!");
        resolve();
      });
    });
  }
}

module.exports = ReservaModel;