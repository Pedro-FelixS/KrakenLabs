'use client'; //indica que esta página utilizará recursos do cliente, mais especificamente chamando o next.js

import Link from 'next/link'; //indica para usar o link da página de cadastro, que será necessário para mudar de página caso o usuário não tenha feito o cadastro da conta

export default function PaginaLogin() { //esta função exportará a página principal do login
  const Login = async (e) => { //uma função que apenas é disparada quando o usuário entra no servidor
    const data = new FormData(e.target); //captura os dados inseridos no formulário abaixo, senão seria apenas um html sem nenhuma interação com o backend

    const resultado = await fetch('http://localhost:5000/login', { //faz a requisição com o localhost do express
      method: 'POST', //define o método post, um método de envio de dados para requisição
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(data)),
    });

    const mensagem = await resultado.text();
    alert(mensagem);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Realize o Login do KrakenLabs</h1>

      <form onSubmit={Login}>
        <input name="email" type="email" placeholder="E-mail" required />
        <br /><br />
        <input name="senha" type="password" placeholder="Senha" required />
        <br /><br />
        <button type="submit">Entrar</button>
      </form>

      <br />
      <Link href="/">
        <button type="button">Não possui conta? Faça seu cadastro!</button>
      </Link>
    </div>
  );
}