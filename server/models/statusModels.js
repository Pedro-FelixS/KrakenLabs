const { conectarBancoDeDados, sql } = require('../db');

class StatusModel {
  static async atualizarStatusRecurso({ recursoId, estado, observacao }) {
    const pool = await conectarBancoDeDados();

    await pool.request()
      .input('recursoId', sql.Int, Number(recursoId))
      .input('estado', sql.VarChar, estado) 
      .input('observacao', sql.VarChar, observacao || null)
      .query(`
        INSERT INTO status_recursos (recurso_id, estado, observacao, data_atualizacao)
        VALUES (@recursoId, @estado, @observacao, GETDATE());

        UPDATE recursos 
        SET status_atual = @estado 
        WHERE id = @recursoId;
      `);
  }

  static async listarStatusRecursos() {
    const pool = await conectarBancoDeDados();
    const resultado = await pool.request().query(`
      SELECT r.id, r.nome, r.codigo, r.capacidade, r.localizacao, ISNULL(r.status_atual, 'Livre') as status_atual
      FROM recursos r
    `);
    return resultado.recordset;
  }
}