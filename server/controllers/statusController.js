const db = require('../db');
const StatusModels = require('../models/statusModel');
const statusModel = new StatusModels(db);

class StatusController {
  static alterarStatus(req, res) {
    const { recursoId, estado } = req.body;

    if (!recursoId || !estado) {
      return res.status(400).send('ID do recurso e estado são obrigatórios.');
    }

    statusModel.atualizarStatusRecurso(req.body)
      .then(() => {
        return res.status(200).send('Status do recurso atualizado com sucesso!');
      })
      .catch((erro) => {
        return res.status(500).send(erro);
      });
  }

  static listarStatus(req, res) {
    statusModel.listarStatusRecursos()
      .then((recordset) => {
        return res.status(200).json(recordset);
      })
      .catch((erro) => {
        return res.status(500).send(erro);
      });
  }
}

module.exports = StatusController;