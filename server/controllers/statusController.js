const StatusModel = require('../models/statusModel');

class StatusController {
  static async alterarStatus(req, res) {
    const { recursoId, estado, observacao } = req.body;

    if (!recursoId || !estado) {
      return res.status(400).send('Selecione o recurso (sala ou lab) e informe o novo estado!');
    }

    try {
      await StatusModel.atualizarStatusRecurso({ recursoId, estado, observacao });
      return res.status(200).send('Status da sala ou laboratório atualizado com sucesso!');
    } catch (erro) {
      console.error('Erro ao atualizar status do recurso:', erro);
      return res.status(500).send('Não foi possível alterar o status da sala ou laboratório.');
    }
  }

  static async listarStatus(req, res) {
    try {
      const recursos = await StatusModel.listarStatusRecursos();
      return res.status(200).json(recursos);
    } catch (erro) {
      console.error('Erro ao buscar status dos recursos:', erro);
      return res.status(500).send('Erro ao buscar a lista de status.');
    }
  }
}

module.exports = StatusController;