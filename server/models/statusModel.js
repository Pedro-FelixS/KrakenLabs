class StatusModels {
  constructor(db) {
    this._db = db;
  }

  // Atualiza o status do recurso (Insere no histórico + Atualiza a tabela recursos)
  atualizarStatusRecurso(dadosStatus) {
    const { recursoId, estado, observacao } = dadosStatus;

    return new Promise((resolve, reject) => {
      const obsValue = observacao ? "'" + observacao + "'" : "NULL";
      
      let sqlInsert = "INSERT INTO status_recursos (recurso_id, estado, observacao, data_atualizacao) VALUES (";
      sqlInsert += Number(recursoId) + ", ";
      sqlInsert += "'" + estado + "', ";
      sqlInsert += obsValue + ", ";
      sqlInsert += "GETDATE())";

      console.log("INSERT no histórico de status = " + sqlInsert);

      this._db.query(sqlInsert, (erroInsert) => {
        if (erroInsert) {
          console.log("ERRO no INSERT status_recursos = " + erroInsert);
          return reject("Atualização do histórico de status FALHOU!");
        }

        let sqlUpdate = "UPDATE recursos SET status_atual = '" + estado + "' WHERE id = " + Number(recursoId);
        console.log("UPDATE na tabela recursos = " + sqlUpdate);

        this._db.query(sqlUpdate, (erroUpdate) => {
          if (erroUpdate) {
            console.log("ERRO no UPDATE recursos = " + erroUpdate);
            return reject("Atualização do status atual do recurso FALHOU!");
          }
          console.log("Status do recurso atualizado com SUCESSO!");
          resolve();
        });
      });
    });
  }

  // Lista todos os recursos e seus status atuais
  listarStatusRecursos() {
    return new Promise((resolve, reject) => {
      const sqlQuery = "SELECT r.id, r.nome, r.codigo, r.capacidade, r.localizacao, ISNULL(r.status_atual, 'Livre') as status_atual FROM recursos r";

      this._db.query(sqlQuery, (erro, recordset) => {
        if (erro) {
          console.log("ERRO = " + erro);
          return reject("Listagem de status de recursos FALHOU!");
        }
        console.log("Listagem de status executou com SUCESSO!");
        resolve(recordset);
      });
    });
  }
}

module.exports = StatusModels;