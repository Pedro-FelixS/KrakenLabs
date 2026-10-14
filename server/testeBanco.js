const { conectarBancoDeDados } = require('./db');

async function testarBanco() {
    let banco;

    try {
        banco = await conectarBancoDeDados();

        const resultado = await banco.request().query(
            'SELECT DB_NAME() AS bancoAtual'
        );

        console.log('Conexão funcionando!');
        console.log('Banco conectado:', resultado.recordset[0].bancoAtual);

    } catch (erro) {
        console.log('Erro na conexão:', erro.message);

    } finally {
        if (banco) {
            await banco.close();
        }
    }
}

testarBanco();