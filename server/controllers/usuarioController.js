class UsuarioController {
  static async cadastrar(req, res) {
    const { nome, senha, cpf, dataNascimento, telefone, email } = req.body;

    if (!nome || !senha || !email || !cpf) {
      return res.status(400).send('Preencha todos os campos obrigatórios.');
    }

    if (senha.length < 8) {
      return res.status(400).send('A senha deve ter no mínimo 8 caracteres.');
    }

    const cpfApenasNumeros = cpf.replace(/\D/g, '');
    if (cpfApenasNumeros.length !== 11) {
      return res.status(400).send('CPF inválido. O CPF deve conter exatamente 11 dígitos.');
    }

    try {
      const senhaHash = await bcrypt.hash(senha, 10);

      // Chama o Model para inserir no banco de dados
      await UsuarioModel.criarUsuario({
        cpf: cpfApenasNumeros,
        nome,
        dataNascimento,
        telefone,
        email,
        senhaHash
      });

      return res.status(201).send('Usuário cadastrado com sucesso!');

    } catch (erro) {
      console.error('Erro ao cadastrar:', erro);

      if (erro.number === 2627 || erro.number === 2601) {
        return res.status(400).send('Este CPF ou E-mail já está cadastrado.');
      }

      return res.status(500).send('Erro interno do servidor ao cadastrar usuário.');
    }
  }
}

module.exports = UsuarioController;