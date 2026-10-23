const db = require('../db');
const ReservaModel = require('../models/reservaModels');
const reservaModel = new ReservaModel(db);

class ReservaController {
  static listarRecursos(req, res) {
    reservaModel.buscarRecursos()
      .then((recordset) => {
        return res.status(200).json(recordset);
      })
      .catch((erro) => {
        return res.status(500).send(erro);
      });
  }

  static listarReservas(req, res) {
    reservaModel.getAll()
      .then((recordset) => {
        return res.status(200).json(recordset);
      })
      .catch((erro) => {
        return res.status(500).send(erro);
      });
  }

  static criarReserva(req, res) {
    const { codigo_recurso, usuario_nome, data_inicio, data_fim, hora_inicio, hora_fim } = req.body;

    if (!codigo_recurso || !usuario_nome || !data_inicio || !data_fim || !hora_inicio || !hora_fim) {
      return res.status(400).send('Todos os campos são obrigatórios.');
    }

    reservaModel.verificarDisponibilidade(codigo_recurso, data_inicio, data_fim, hora_inicio, hora_fim)
      .then((conflitos) => {
        if (conflitos && conflitos.length > 0) {
          return res.status(409).send('O recurso já possui um agendamento conflitante neste período.');
        }
        return reservaModel.create(req.body);
      })
      .then(() => {
        return res.status(201).send('Reserva cadastrada com sucesso!');
      })
      .catch((erro) => {
        return res.status(500).send(erro);
      });
  }
}

module.exports = ReservaController;