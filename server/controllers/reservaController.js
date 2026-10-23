const ReservaModel = require('../models/reservaModels'); // Atente-se ao nome do arquivo!

class ReservaController {
  static async listarRecursos(req, res) {
    try {
      const recursos = await ReservaModel.buscarRecursos();
      return res.status(200).json(recursos);
    } catch (erro) {
      console.error('Erro ao buscar recursos:', erro);
      return res.status(500).send('Erro ao buscar a lista de recursos.');
    }
  }

  static async listarReservas(req, res) {
    try {
      const reservas = await ReservaModel.getAll();
      return res.status(200).json(reservas);
    } catch (erro) {
      console.error('Erro ao buscar reservas:', erro);
      return res.status(500).send('Erro ao buscar reservas.');
    }
  }

  static async criarReserva(req, res) {
    const { codigo_recurso, usuario_nome, data_inicio, data_fim, hora_inicio, hora_fim } = req.body;

    if (!codigo_recurso || !usuario_nome || !data_inicio || !data_fim || !hora_inicio || !hora_fim) {
      return res.status(400).send('Todos os campos são obrigatórios.');
    }

    try {
      // 1. Verifica disponibilidade antes de salvar
      const conflitos = await ReservaModel.verificarDisponibilidade(
        codigo_recurso, data_inicio, data_fim, hora_inicio, hora_fim
      );

      if (conflitos && conflitos.length > 0) {
        return res.status(409).send('O recurso já possui um agendamento conflitante neste período/horário.');
      }

      // 2. Cria a reserva
      await ReservaModel.create(req.body);
      return res.status(201).send('Reserva cadastrada com sucesso!');
    } catch (erro) {
      console.error('Erro ao criar reserva:', erro);
      return res.status(500).send('Erro interno ao processar a reserva.');
    }
  }
}

module.exports = ReservaController;