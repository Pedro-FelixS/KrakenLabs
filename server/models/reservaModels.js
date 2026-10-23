
const { conectarBancoDeDados, sql } = require('../db');

const ReservaModel = {

  buscarRecursos: async () => {
    const pool = await conectarBancoDeDados();

    const resultado = await pool.request().query(`
      SELECT *
      FROM recursos
      ORDER BY nome
    `);

    return resultado.recordset;
  },

  async getAll() {
  const pool = await conectarBancoDeDados();

  const resultado = await pool.request().query(`
    SELECT
      DB_NAME() AS banco_atual,
      COUNT(*) AS total_reservas
    FROM Reservas
  `);

  console.log('Teste do banco:', resultado.recordset);

  const reservas = await pool.request().query(`
    SELECT *
    FROM Reservas
    ORDER BY data_inicio DESC, hora_inicio DESC
  `);

  console.log('Reservas encontradas:', reservas.recordset.length);

  return reservas.recordset;
},

  verificarDisponibilidade: async (
    codigo_recurso,
    data_inicio,
    data_fim,
    hora_inicio,
    hora_fim
  ) => {
    const pool = await conectarBancoDeDados();

    const resultado = await pool.request()
      .input('codigo', sql.VarChar(20), codigo_recurso)
      .input('dataInicio', sql.Date, data_inicio)
      .input('dataFim', sql.Date, data_fim)
      .input('horaInicio', sql.Time, hora_inicio)
      .input('horaFim', sql.Time, hora_fim)
      .query(`
        SELECT *
        FROM Reservas
        WHERE codigo_recurso = @codigo
          AND status IN ('Reservado', 'Ocupado', 'Bloqueado')
          AND DATEADD(
            SECOND,
            DATEDIFF(SECOND, CAST('00:00:00' AS TIME), hora_inicio),
            CAST(data_inicio AS DATETIME2)
          ) < DATEADD(
            SECOND,
            DATEDIFF(SECOND, CAST('00:00:00' AS TIME), @horaFim),
            CAST(@dataFim AS DATETIME2)
          )
          AND DATEADD(
            SECOND,
            DATEDIFF(SECOND, CAST('00:00:00' AS TIME), hora_fim),
            CAST(data_fim AS DATETIME2)
          ) > DATEADD(
            SECOND,
            DATEDIFF(SECOND, CAST('00:00:00' AS TIME), @horaInicio),
            CAST(@dataInicio AS DATETIME2)
          )
      `);

    return resultado.recordset;
  },

  create: async (dados) => {
    const pool = await conectarBancoDeDados();

    const {
      codigo_recurso,
      usuario_nome,
      data_inicio,
      data_fim,
      hora_inicio,
      hora_fim
    } = dados;

    const resultado = await pool.request()
      .input('codigo', sql.VarChar(20), codigo_recurso)
      .input('usuario', sql.VarChar(100), usuario_nome)
      .input('dataInicio', sql.Date, data_inicio)
      .input('dataFim', sql.Date, data_fim)
      .input('horaInicio', sql.Time, hora_inicio)
      .input('horaFim', sql.Time, hora_fim)
      .query(`
        INSERT INTO Reservas (
          codigo_recurso,
          usuario_nome,
          data_inicio,
          data_fim,
          hora_inicio,
          hora_fim
        )
        OUTPUT INSERTED.*
        VALUES (
          @codigo,
          @usuario,
          @dataInicio,
          @dataFim,
          @horaInicio,
          @horaFim
        )
      `);

    return resultado.recordset[0];
  }
};

module.exports = ReservaModel;
