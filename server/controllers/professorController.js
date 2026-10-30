const db = require('../db');
const bcrypt = require('bcrypt');
const ProfessorModel = require('../models/professorModels');
const professorModel = new ProfessorModel(db);

class ProfessorController {
  static async criar(req, res) {
    const { cpf, nome, dataNascimento, email, telefone, senha } = req.body;

    if (!cpf || !nome || !email || !senha) {
      return res.status(400).send('CPF, nome, e-mail e senha são obrigatórios.');
    }

  try {
    const senhaHash = await bcrypt.hash(senha, 10);

    await professorModel.criarUsuario({
        cpf,
        nome,
        email,
        senhaHash,
        dataNascimento,
        telefone
      });
  
          return res.status(201).send('Professor cadastrado com sucesso!');
    } catch (erro) {
        console.error('Erro ao cadastrar professor:', erro);       
        return res.status(500).send(
          typeof erro === 'string'
              ? erro
              : 'Erro interno ao cadastrar professor.'
        )
      }
  }
}

module.exports = ProfessorController;