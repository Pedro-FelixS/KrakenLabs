const db = require('../db');
const AlunoModel = require('../models/alunoModels');
const alunoModel = new AlunoModel(db);

class AlunoController {
  static criar(req, res) {
    const { cpf, nome, email, senhaHash } = req.body;

    if (!cpf || !nome || !email || !senhaHash) {
      return res.status(400).send('CPF, nome, e-mail e senha são obrigatórios.');
    }

    alunoModel.criarAluno(req.body)
      .then(() => {
        return res.status(201).send('Aluno cadastrado com sucesso!');
      })
      .catch((erro) => {
        return res.status(500).send(erro);
      });
  }
}

module.exports = AlunoController;