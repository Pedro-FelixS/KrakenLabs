const db = require('../db');
const ConsultaModel = require('../models/consultaModel');
const consultaModel = new ConsultaModel(db);

class ConsultaController {
  static buscar(req, res) {
    // Pega todos os parâmetros que vierem na URL (ex: /consultar?nomeRecurso=Lab&status=Ativa)
    const filtros = req.query;

    consultaModel.consultarReservasComFiltros(filtros)
      .then((recordset) => {
        return res.status(200).json(recordset);
      })
      .catch((erro) => {
        console.error("Erro na consulta de reservas:", erro);
        return res.status(500).send("Falha ao realizar a consulta de reservas.");
      });
  }
}

module.exports = ConsultaController;