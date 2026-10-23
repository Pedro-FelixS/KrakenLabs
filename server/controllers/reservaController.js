<<<<<<< HEAD

const ReservaModel = require('../models/reservaModels');

const ReservaController = {

  listarRecursos: async (req, res) => {
    try {
      const recursos = await ReservaModel.buscarRecursos();
      res.status(200).json(recursos);
    } catch (erro) {
      console.error('Erro ao buscar recursos:', erro);
      res.status(500).json({
        error: 'Erro ao buscar a lista de recursos.'
      });
    }
  },
=======
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
>>>>>>> 867e14e444dfbff7c3abb1d084ee251235637671

  static async listarReservas(req, res) {
    try {
      const reservas = await ReservaModel.getAll();
<<<<<<< HEAD
      res.status(200).json(reservas);
    } catch (erro) {
      console.error('Erro ao buscar reservas:', erro);
      res.status(500).json({
        error: 'Erro ao buscar reservas.'
      });
=======
      return res.status(200).json(reservas);
    } catch (erro) {
      console.error('Erro ao buscar reservas:', erro);
      return res.status(500).send('Erro ao buscar reservas.');
>>>>>>> 867e14e444dfbff7c3abb1d084ee251235637671
    }
  }

<<<<<<< HEAD
  criarReserva: async (req, res) => {
    const {
      codigo_recurso,
      usuario_nome,
      data_inicio,
      data_fim,
      hora_inicio,
      hora_fim
    } = req.body;

    if (
      !codigo_recurso ||
      !usuario_nome ||
      !data_inicio ||
      !data_fim ||
      !hora_inicio ||
      !hora_fim
    ) {
      return res.status(400).json({
        error: 'Todos os campos são obrigatórios.'
      });
    }

    if (data_inicio > data_fim) {
      return res.status(400).json({
        error: 'A data inicial não pode ser posterior à data final.'
      });
    }

    if (hora_inicio >= hora_fim) {
      return res.status(400).json({
        error: 'A hora inicial deve ser anterior à hora final.'
      });
    }

    try {
      const recursos = await ReservaModel.buscarRecursos();

      const recurso = recursos.find(
        (item) => item.codigo === codigo_recurso
      );

      if (!recurso) {
        return res.status(404).json({
          error: 'Recurso não encontrado.'
        });
      }

      if (
        String(recurso.status_atual).trim().toLowerCase() !== 'livre'
      ) {
        return res.status(400).json({
          error: 'Este recurso não está livre para reserva.'
        });
      }

=======
  static async criarReserva(req, res) {
    const { codigo_recurso, usuario_nome, data_inicio, data_fim, hora_inicio, hora_fim } = req.body;

    if (!codigo_recurso || !usuario_nome || !data_inicio || !data_fim || !hora_inicio || !hora_fim) {
      return res.status(400).send('Todos os campos são obrigatórios.');
    }

    try {
      // 1. Verifica disponibilidade antes de salvar
>>>>>>> 867e14e444dfbff7c3abb1d084ee251235637671
      const conflitos = await ReservaModel.verificarDisponibilidade(
        codigo_recurso,
        data_inicio,
        data_fim,
        hora_inicio,
        hora_fim
      );

<<<<<<< HEAD
      if (conflitos.length > 0) {
        return res.status(409).json({
          error: 'O recurso já possui uma reserva nesse período.'
        });
      }

      const novaReserva = await ReservaModel.create(req.body);

      return res.status(201).json({
        message: 'Reserva cadastrada com sucesso!',
        reserva: novaReserva
      });

    } catch (erro) {
      console.error('Erro ao cadastrar reserva:', erro);

      return res.status(500).json({
        error: 'Erro ao cadastrar a reserva.'
      });
=======
      if (conflitos && conflitos.length > 0) {
        return res.status(409).send('O recurso já possui um agendamento conflitante neste período/horário.');
      }

      // 2. Cria a reserva
      await ReservaModel.create(req.body);
      return res.status(201).send('Reserva cadastrada com sucesso!');
    } catch (erro) {
      console.error('Erro ao criar reserva:', erro);
      return res.status(500).send('Erro interno ao processar a reserva.');
>>>>>>> 867e14e444dfbff7c3abb1d084ee251235637671
    }
  }
}

module.exports = ReservaController;
