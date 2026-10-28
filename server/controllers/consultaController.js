const db = require('../db');
const sql = require('mssql');

class ConsultaController {
  static async buscar(req, res) {
    try {
      const {
        codigoRecurso,
        nomeRecurso,
        dataInicio,
        dataFim,
        hora,
        usuario,
        status
      } = req.query;

      // 1. Obtém o pool resolvendo a Promise do db.js (ou chamando a função)
      let pool;
      if (typeof db === 'function') {
        pool = await db();
      } else if (db && typeof db.conectarBancoDeDados === 'function') {
        pool = await db.conectarBancoDeDados();
      } else {
        pool = await db;
      }

      // 2. Instancia o Request diretamente do Pool ativo
      const request = pool.request();

      // 3. Query cruzando a tabela 'recursos' com 'Reservas'
      let querySql = `
        SELECT 
          rec.id AS recurso_id,
          rec.codigo AS codigo_recurso,
          rec.nome AS recurso_nome,
          rec.capacidade,
          rec.localizacao,
          rec.ehLaboratorio,
          rec.status_atual,
          res.id AS reserva_id,
          res.usuario_nome,
          res.data_inicio,
          res.data_fim,
          res.hora_inicio,
          res.hora_fim,
          ISNULL(res.status, rec.status_atual) AS status
        FROM recursos rec
        LEFT JOIN Reservas res ON rec.codigo = res.codigo_recurso
        WHERE 1=1
      `;

      // 4. Aplicação dos filtros dinâmicos
      if (codigoRecurso && codigoRecurso.trim() !== '') {
        request.input('codigoRecurso', sql.VarChar, `%${codigoRecurso.trim()}%`);
        querySql += ` AND rec.codigo LIKE @codigoRecurso`;
      }

      if (nomeRecurso && nomeRecurso.trim() !== '') {
        request.input('nomeRecurso', sql.VarChar, `%${nomeRecurso.trim()}%`);
        querySql += ` AND rec.nome LIKE @nomeRecurso`;
      }

      if (dataInicio && dataFim) {
        request.input('dataInicio', sql.Date, dataInicio);
        request.input('dataFim', sql.Date, dataFim);
        querySql += ` AND (res.data_inicio <= @dataFim AND res.data_fim >= @dataInicio)`;
      } else if (dataInicio) {
        request.input('dataInicio', sql.Date, dataInicio);
        querySql += ` AND (res.data_fim >= @dataInicio OR res.data_fim IS NULL)`;
      } else if (dataFim) {
        request.input('dataFim', sql.Date, dataFim);
        querySql += ` AND (res.data_inicio <= @dataFim OR res.data_inicio IS NULL)`;
      }

      if (hora && hora.trim() !== '') {
        request.input('hora', sql.VarChar, hora.trim());
        querySql += ` AND (@hora >= res.hora_inicio AND @hora <= res.hora_fim OR res.hora_inicio IS NULL)`;
      }

      if (usuario && usuario.trim() !== '') {
        request.input('usuario', sql.VarChar, `%${usuario.trim()}%`);
        querySql += ` AND res.usuario_nome LIKE @usuario`;
      }

      if (status && status.trim() !== '') {
        request.input('status', sql.VarChar, status.trim());
        querySql += ` AND (res.status = @status OR rec.status_atual = @status)`;
      }

      querySql += ` ORDER BY rec.codigo ASC, res.data_inicio DESC`;

      // 5. Executa a query
      const resultado = await request.query(querySql);
      const registros = resultado.recordset || [];

      console.log(`[SUCESSO] Registros retornados: ${registros.length}`);
      return res.status(200).json(registros);

    } catch (erro) {
      console.error("[ERRO BANCO DE DADOS]:", erro);
      return res.status(500).json({ mensagem: "Erro ao realizar consulta.", detalhe: erro.message });
    }
  }
}

module.exports = ConsultaController;