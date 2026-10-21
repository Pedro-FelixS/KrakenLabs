const ReservaModel = require('../models/reservaModels');

class ReservaController {
  // Lista todos os recursos do banco para o select de laboratórios/salas
  static async listarRecursos(req, res) {
    try {
      const recursos = await ReservaModel.buscarRecursos();
      const lista = recursos.recordset || recursos;
      return res.status(200).json(lista);
    } catch (erro) {
      console.error('Erro ao buscar recursos:', erro);
      return res.status(500).send('Erro ao buscar a lista de recursos.');
    }
  }

  // Lista todas as reservas cadastradas
  static async listarReservas(req, res) {
    try {
      const reservas = await ReservaModel.getAll();
      const lista = reservas.recordset || reservas;
      return res.status(200).json(lista);
    } catch (erro) {
      console.error('Erro ao buscar reservas:', erro);
      return res.status(500).send('Erro ao buscar reservas.');
    }
  }

  // Cria uma nova reserva
  static async criarReserva(req, res) {
    const { codigo_recurso, usuario_nome, data_inicio, data_fim, hora_inicio, hora_fim } = req.body;

    if (!codigo_recurso || !usuario_nome || !data_inicio || !data_fim || !hora_inicio || !hora_fim) {
      return res.status(400).send('Todos os campos são obrigatórios.');
    }

    try {
      const conflitos = await ReservaModel.verificarDisponibilidade(
        codigo_recurso, data_inicio, data_fim, hora_inicio, hora_fim
      );
      const listaConflitos = conflitos.recordset || conflitos;

      if (listaConflitos.length > 0) {
        const recursoBloqueado = listaConflitos.some(c => c.status === 'Bloqueado');
        if (recursoBloqueado) {
          return res.status(400).send('Recurso indisponível: o recurso está BLOQUEADO!');
        }
        return res.status(409).send('O recurso já possui um agendamento neste horário.');
      }

      await ReservaModel.create(req.body);
      return res.status(201).send('Reserva cadastrada com sucesso!');
    } catch (erro) {
      console.error('Erro ao criar reserva:', erro);
      return res.status(500).send('Infelizmente, ocorreu um erro ao processar a reserva.');
    }
  }
}

module.exports = ReservaController;