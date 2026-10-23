const { conectarBancoDeDados, sql } = require('../db');
class ReservaModel {
  // 1. Busca todos os recursos
  static async buscarRecursos() {
    const pool = await conectarBancoDeDados();
    const resultado = await pool.request().query(`
      SELECT 
        id, 
        codigo, 
        nome, 
        capacidade, 
        localizacao, 
        ehLaboratorio, 
        status_atual
      FROM recursos
      ORDER BY nome ASC
    `);
    return resultado.recordset;
  }

  // 2. Busca o histórico de reservas
    static async getAll() {
    const pool = await conectarBancoDeDados();
    const resultado = await pool.request().query(`
      SELECT id, codigo_recurso, usuario_nome, data_inicio, data_fim, hora_inicio, hora_fim, status
      FROM Reservas
      ORDER BY id DESC
    `);
    return resultado.recordset;
  }

  // 3. Método que estava faltando: Verifica conflitos de horários
  static async verificarDisponibilidade(codigo_recurso, data_inicio, data_fim, hora_inicio, hora_fim) {
    const pool = await conectarBancoDeDados();
    const resultado = await pool.request()
      .input('codigo_recurso', sql.VarChar(20), codigo_recurso)
      .input('data_inicio', sql.Date, data_inicio)
      .input('data_fim', sql.Date, data_fim)
      .input('hora_inicio', sql.VarChar(10), hora_inicio)
      .input('hora_fim', sql.VarChar(10), hora_fim)
      .query(`
        SELECT * FROM Reservas 
        WHERE codigo_recurso = @codigo_recurso
          AND status IN ('Reservado', 'Ocupado', 'Bloqueado')
          AND (data_inicio <= @data_fim AND data_fim >= @data_inicio)
          AND (
            (@hora_inicio >= hora_inicio AND @hora_inicio < hora_fim) OR
            (@hora_fim > hora_inicio AND @hora_fim <= hora_fim) OR
            (hora_inicio >= @hora_inicio AND hora_fim <= @hora_fim)
          )
      `);
    return resultado.recordset;
  }

  // 4. Cria o registro da nova reserva
  static async create(dados) {
    const { codigo_recurso, usuario_nome, data_inicio, data_fim, hora_inicio, hora_fim, status } = dados;
    const pool = await conectarBancoDeDados();

    await pool.request()
      .input('codigo_recurso', sql.VarChar(20), codigo_recurso)
      .input('usuario_nome', sql.VarChar(100), usuario_nome)
      .input('data_inicio', sql.Date, data_inicio)
      .input('data_fim', sql.Date, data_fim)
      .input('hora_inicio', sql.VarChar(10), hora_inicio)
      .input('hora_fim', sql.VarChar(10), hora_fim)
      .input('status', sql.VarChar(20), status || 'Reservado')
      .query(`
        INSERT INTO Reservas (codigo_recurso, usuario_nome, data_inicio, data_fim, hora_inicio, hora_fim, status)
        VALUES (@codigo_recurso, @usuario_nome, @data_inicio, @data_fim, @hora_inicio, @hora_fim, @status)
      `);

    return { message: 'Reserva cadastrada com sucesso!' };
  }
}

module.exports = ReservaModel;
