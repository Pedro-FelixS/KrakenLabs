const SalaModel = require('../models/salaModel');

class SalaController {
  static async cadastrar(req, res) {
    const { nome, codigo, capacidade, localizacao } = req.body;

    if (!nome || !codigo || !capacidade || !localizacao) {
      return res.status(400).send("Preencha todos os campos da sala!");
    }

    try {
      await SalaModel.criarSala({ nome, codigo, capacidade, localizacao });
      return res.status(201).send('Sala cadastrada com sucesso!');
    } catch (erro) {
      console.error('Erro no cadastro de sala:', erro);

      if (erro.number === 2627 || erro.number === 2601) {
        return res.status(400).send('Já existe uma sala/recurso cadastrado com este código.');
      }

      return res.status(500).send("Não foi possível cadastrar a sala.");
    }
  }
}

module.exports = SalaController;