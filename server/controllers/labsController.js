const db = require('../db');
const LabModel = require('../models/labsModels');
const labModel = new LabModel(db);

class LabController {
  // Renomeado para cadastrar
  static cadastrar(req, res) {
    const { nome, codigo, capacidade, localizacao } = req.body;

    if (!nome || !codigo || !capacidade || !localizacao) {
      return res.status(400).send('Todos os campos são obrigatórios.');
    }

    labModel.criarLab(req.body)
      .then(() => {
        return res.status(201).send('Laboratório cadastrado com sucesso!');
      })
      .catch((erro) => {
        return res.status(500).send(erro);
      });
  }
}

module.exports = LabController;