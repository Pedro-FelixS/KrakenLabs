
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

  listarReservas: async (req, res) => {
    try {
      const reservas = await ReservaModel.getAll();
      res.status(200).json(reservas);
    } catch (erro) {
      console.error('Erro ao buscar reservas:', erro);
      res.status(500).json({
        error: 'Erro ao buscar reservas.'
      });
    }
  },

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

      const conflitos = await ReservaModel.verificarDisponibilidade(
        codigo_recurso,
        data_inicio,
        data_fim,
        hora_inicio,
        hora_fim
      );

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
    }
  }
};

module.exports = ReservaController;
