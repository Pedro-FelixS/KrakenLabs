const db = require('../db');
const ProfessorModel = require('../models/professorModels');
const professorModel = new ProfessorModel(db);

class ProfessorController {
  static criar(req, res) {
    const { cpf, nome, email, senhaHash } = req.body;

    if (!cpf || !nome || !email || !senhaHash) {
      return res.status(400).send('CPF, nome, e-mail e senha são obrigatórios.');
    }

    professorModel.criarProfessor(req.body)
      .then(() => {
        return res.status(201).send('Professor cadastrado com sucesso!');
      })
      .catch((erro) => {
        return res.status(500).send(erro);
      });
  }
}

module.exports = ProfessorController;