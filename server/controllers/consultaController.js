const db = require('../db');
const ConsultaModel = require('../models/consultaModel');
const consultaModel = new ConsultaModel(db);

class ConsultaController {
  static async buscar(req, res) {
    try {
      const filtros = req.query;
      const resultado = await consultaModel.consultarReservasComFiltros(filtros);

      // Extrai os dados independentemente do formato retornado pelo driver SQL
      let dados = [];
      if (Array.isArray(resultado)) {
        dados = resultado;
      } else if (resultado && resultado.recordset) {
        dados = resultado.recordset;
      } else if (resultado && resultado[0]) {
        dados = resultado[0];
      }

      console.log(`Consulta realizada com sucesso! Total de registros encontrados: ${dados.length}`);
      
      return res.status(200).json(dados);
    } catch (erro) {
      console.error("Erro na consulta de reservas:", erro);
      return res.status(500).json({ mensagem: "Falha ao realizar a consulta de reservas." });
    }
  }
}

module.exports = ConsultaController;