const db = require('../db');
const ConsultaModels = require('../models/consultaModels');
const consultaModels = new ConsultaModels(db);

class ConsultaController {
  static filtrar(req, res) {
    const filtros = {
      recursoCodigo: req.query.recursoCodigo,
      recursoNome: req.query.recursoNome,
      dataInicio: req.query.dataInicio,
      dataFim: req.query.dataFim,
      horaInicio: req.query.horaInicio,
      usuarioNome: req.query.usuarioNome,
      status: req.query.status
    };

    consultaModel.consultarReservasComFiltros(filtros)
      .then((recordset) => {
        return res.status(200).json(recordset);
      })
      .catch((erro) => {
        return res.status(500).send(erro);
      });
  }
}

module.exports = ConsultaController;