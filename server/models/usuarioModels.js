class UsuarioModel {
  constructor(db) {
    this._db = db;
  }

  // Método para cadastrar um novo usuário
  criarUsuario(dadosUsuario) {
    const { cpf, nome, dataNascimento, telefone, email, senhaHash } = dadosUsuario;

    return new Promise((resolve, reject) => {
      const dataNiverVal = dataNascimento ? "'" + dataNascimento + "'" : "NULL";
      const celVal = telefone ? "'" + telefone + "'" : "NULL";

      let sql = "INSERT INTO usuarios (cpf, nome, dataniver, cel, email, senha) VALUES (";
      sql += "'" + cpf + "', ";
      sql += "'" + nome + "', ";
      sql += dataNiverVal + ", ";
      sql += celVal + ", ";
      sql += "'" + email + "', ";
      sql += "'" + senhaHash + "')";

      console.log("Comando INSERT de Usuário montado = " + sql);

      this._db.query(sql, (erro) => {
        if (erro) {
          console.log("ERRO = " + erro);
          return reject("Cadastro de novo Usuário FALHOU!");
        }
        console.log("Usuário cadastrado com SUCESSO!");
        resolve();
      });
    });
  }
}

module.exports = UsuarioModel;