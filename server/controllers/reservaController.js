const ReservaModel = require('../models/reservaModels');

const ReservaController = {
  listarRecursos: async (req, res) => {
  try {
    const recursos = await ReservaModel.buscarRecursos();
    // Garante envio direto da lista
    const lista = recursos.recordset || recursos;
    res.status(200).json(lista);
  } catch (error) {
    console.error('Erro ao buscar recursos:', error);
    res.status(500).json({ error: 'Erro ao buscar a lista de recursos.' });
  }
},

  listarReservas: async (req, res) => {
    try {
      const reservas = await ReservaModel.getAll();
      res.status(200).json(reservas);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar reservas.' });
    }
  },

  criarReserva: async (req, res) => {
    const { codigo_recurso, usuario_nome, data_inicio, data_fim, hora_inicio, hora_fim } = req.body;

    if (!codigo_recurso || !usuario_nome || !data_inicio || !data_fim || !hora_inicio || !hora_fim) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    try {
      const conflitos = await ReservaModel.verificarDisponibilidade(
        codigo_recurso, data_inicio, data_fim, hora_inicio, hora_fim
      );

      if (conflitos.length > 0) {
        const recursoBloqueado = conflitos.some(c => c.status === 'Bloqueado');
        if (recursoBloqueado) {
          return res.status(400).json({ error: 'Recurso indisponível: o recurso está BLOQUEADO!' });
        }
        return res.status(409).json({ error: 'O recurso já possui um agendamento neste horário.' });
      }

      const novaReserva = await ReservaModel.create(req.body);
      res.status(201).json(novaReserva);
    } catch (error) {
      res.status(500).json({ error: 'Infelizmente, ocorreu um erro ao processar a reserva.' });
    }
  }
};

module.exports = ReservaController;