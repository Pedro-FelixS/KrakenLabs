const db = require('../db');

const ReservaModel = {
  // Listar todas as reservas
  getAll: async () => {
    const result = await db.query('SELECT * FROM Reservas ORDER BY data_inicio, hora_inicio');
    return result.recordset || result;
  },

  // Verificar se o recurso está Bloqueado, Ocupado ou Reservado no período selecionado
  verificarDisponibilidade: async (codigo_recurso, data_inicio, data_fim, hora_inicio, hora_fim) => {
    const result = await db.query(`
      SELECT * FROM Reservas 
      WHERE codigo_recurso = '${codigo_recurso}'
        AND status IN ('Reservado', 'Ocupado', 'Bloqueado')
        AND (data_inicio <= '${data_fim}' AND data_fim >= '${data_inicio}')
        AND (
          ('${hora_inicio}' >= hora_inicio AND '${hora_inicio}' < hora_fim) OR
          ('${hora_fim}' > hora_inicio AND '${hora_fim}' <= hora_fim) OR
          (hora_inicio >= '${hora_inicio}' AND hora_fim <= '${hora_fim}')
        )
    `);
    const recordset = result.recordset || result;
    return recordset; // Retorna os conflitos encontrados
  },

  // Criar nova reserva
  create: async (dados) => {
    const { codigo_recurso, usuario_nome, data_inicio, data_fim, hora_inicio, hora_fim, status } = dados;
    const statusFinal = status || 'Reservado';

    await db.query(`
      INSERT INTO Reservas (codigo_recurso, usuario_nome, data_inicio, data_fim, hora_inicio, hora_fim, status)
      VALUES ('${codigo_recurso}', '${usuario_nome}', '${data_inicio}', '${data_fim}', '${hora_inicio}', '${hora_fim}', '${statusFinal}')
    `);
    return { message: 'Reserva cadastrada com sucesso!' };
  }
};

module.exports = ReservaModel;