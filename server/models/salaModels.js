class SalaModel {
  constructor(db) {
    this._db = db;
  }

  // Método para criar uma nova sala de aula na tabela de recursos
  criarSala(dadosSala) {
    const { nome, codigo, capacidade, localizacao } = dadosSala;

    return new Promise((resolve, reject) => {
      let sql = "INSERT INTO recursos (nome, codigo, capacidade, localizacao, ehLaboratorio) VALUES (";
      sql += "'" + nome + "',";
      sql += "'" + codigo + "',";
      sql += Number(capacidade) + ",";
      sql += "'" + localizacao + "',";
      sql += "0)"; // 0 indica que ehLaboratorio = false (BIT)

      console.log("Comando INSERT de Sala montado = " + sql);

      this._db.query(sql, (erro) => {
        if (erro) {
          console.log("ERRO = " + erro);
          return reject("Inclusão de nova Sala FALHOU!");
        }
        console.log("Sala cadastrada com SUCESSO!");
        resolve();
      });
    });
  }
}

module.exports = SalaModel;