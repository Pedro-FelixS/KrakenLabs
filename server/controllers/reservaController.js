const db = require('../db');
const ReservaModel = require('../models/reservaModels');
const reservaModel = new ReservaModel(db);

class ReservaController {
  static async listarRecursos(req, res) {
    try {
      const recordset = await reservaModel.buscarRecursos();
      return res.status(200).json(recordset);
    } catch (erro) {
      console.error('Erro ao buscar recursos:', erro);
      return res.status(500).send(erro.message || erro);
    }
  }

  static async listarReservas(req, res) {
    try {
      const recordset = await reservaModel.getAll();
      return res.status(200).json(recordset);
    } catch (erro) {
      console.error('Erro ao buscar reservas:', erro);
      return res.status(500).send(erro.message || erro);
    }
  }

  static async criarReserva(req, res) {
    try {
      const { codigo_recurso, usuario_nome, data_inicio, data_fim, hora_inicio, hora_fim } = req.body;

      // 1. Validação de campos obrigatórios
      if (!codigo_recurso || !usuario_nome || !data_inicio || !data_fim || !hora_inicio || !hora_fim) {
        return res.status(400).send('Todos os campos são obrigatórios.');
      }

      // 2. Validação de datas
      if (data_fim < data_inicio) {
        return res.status(400).send('A data final não pode ser anterior à data inicial.');
      }

      // 3. Verifica se há conflito de horário
      const conflitos = await reservaModel.verificarDisponibilidade(
        codigo_recurso,
        data_inicio,
        data_fim,
        hora_inicio,
        hora_fim
      );

      if (conflitos && conflitos.length > 0) {
        // Envia resposta de conflito e PARA a execução da função
        return res.status(409).send('O recurso já possui um agendamento conflitante neste período.');
      }

      // 4. Cria a reserva se não houver conflitos
      await reservaModel.create(req.body);
      return res.status(201).send('Reserva cadastrada com sucesso!');

    } catch (erro) {
      console.error('Erro ao criar reserva:', erro);
      return res.status(500).send(erro.message || erro);
    }
  }
}

module.exports = ReservaController;