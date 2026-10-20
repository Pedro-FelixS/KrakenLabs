const db = require('../db'); 

const ReservaModel = {
  buscarRecursos: async () => {
    const result = await db.query("SELECT * FROM recursos ORDER BY nome");
    return result.recordset || result || [];
  },

  getAll: async () => {
    const result = await db.query('SELECT * FROM Reservas ORDER BY data_inicio DESC, hora_inicio DESC');
    return result.recordset || result || [];
  },

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
    return result.recordset || result || [];
  },

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