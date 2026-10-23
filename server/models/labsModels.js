class LabModel {
  constructor(db) {
    this._db = db;
  }

  // Método para criar um novo laboratório na tabela de recursos
  criarLab(dadosLab) {
    const { nome, codigo, capacidade, localizacao } = dadosLab;

    return new Promise((resolve, reject) => {
      let sql = "INSERT INTO recursos (nome, codigo, capacidade, localizacao, ehLaboratorio) VALUES (";
      sql += "'" + nome + "',";
      sql += "'" + codigo + "',";
      sql += Number(capacidade) + ",";
      sql += "'" + localizacao + "',";
      sql += "1)"; // 1 indica que ehLaboratorio = true (BIT)

      console.log("Comando INSERT de Laboratório montado = " + sql);

      this._db.query(sql, (erro) => {
        if (erro) {
          console.log("ERRO = " + erro);
          return reject("Inclusão de novo Laboratório FALHOU!");
        }
        console.log("Laboratório cadastrado com SUCESSO!");
        resolve();
      });
    });
  }
}

module.exports = LabModel;