const db = require('../db');
const UsuarioModel = require('../models/usuarioModels');
const usuarioModel = new UsuarioModel(db);

class UsuarioController {
  static criar(req, res) {
    const { cpf, nome, email, senhaHash } = req.body;

    if (!cpf || !nome || !email || !senhaHash) {
      return res.status(400).send('CPF, nome, e-mail e senha são obrigatórios.');
    }

    usuarioModel.criarUsuario(req.body)
      .then(() => {
        return res.status(201).send('Usuário cadastrado com sucesso!');
      })
      .catch((erro) => {
        return res.status(500).send(erro);
      });
  }
}

module.exports = UsuarioController;