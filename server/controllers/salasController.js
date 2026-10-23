const db = require('../db');
const SalaModel = require('../models/salaModels');
const salaModel = new SalaModel(db);

class SalaController {
  static cadastrar(req, res) {
    const { nome, codigo, capacidade, localizacao } = req.body;

    if (!nome || !codigo || !capacidade || !localizacao) {
      return res.status(400).send('Todos os campos são obrigatórios.');
    }

    salaModel.criarSala(req.body)
      .then(() => {
        return res.status(201).send('Sala cadastrada com sucesso!');
      })
      .catch((erro) => {
        return res.status(500).send(erro);
      });
  }
}

module.exports = SalaController;