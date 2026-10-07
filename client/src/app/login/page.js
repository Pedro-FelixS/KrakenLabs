'use client'; 
import styles from './login.module.css'
import Link from 'next/link'; 

export default function PaginaLogin() { 
  const Login = async (e) => { // função que apenas é disparada quando o usuário entra no servidor
    const data = new FormData(e.target); //captura os dados inseridos no formulário

    const resultado = await fetch('http://localhost:5000/login', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(data)),
    });

    const mensagem = await resultado.text();
    alert(mensagem);
  };

return (
  <div className={styles.page}>

    <div className={styles.main}>
    
    <div className={styles.statusContainer}>

      <h1>Realize o Login do KrakenLabs</h1>

      <form onSubmit={Login}>

        <input
          name="email"
          type="email"
          placeholder="E-mail"
          required
        />

        <br/>
        <br/>

        <input
          name="senha"
          type="password"
          placeholder="Senha"
          required
        />

        <br/>
        <br/>

        <button
          className={styles.botao}
          type="submit"
        >
          Entrar
        </button>

      </form>

      <br />

      <Link
        href="/"
        className={styles.meuBotaoLogin}
      >
        Não possui conta? Faça seu cadastro!
      </Link>

    </div>
  </div>
  </div>
);
}