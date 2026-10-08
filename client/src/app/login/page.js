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

      <h1>Realize o Login do KrakenLabs</h1><br/><br/>
  
      <form onSubmit={Login}>
      
        <input
          name="email"
          type="email" size="30"
          placeholder="E-mail"
          required
        />

        <br/>
        <br/>

        <input
          name="senha"
          type="password" size="30"
          placeholder="Senha"
          required
          
        />

        <br/>
        <br/>

        <button
          className={styles.botao}
          type="submit" size="20"
        >
          Entrar
        </button>

      </form>

      <br/>

      <Link
        href="/"
        className={styles.meuBotaoLogin}
      >
        Não possui conta? Faça seu cadastro!
      </Link>
    </div>
  </div>
  <span className={styles.rodape}>
                KrakenLabs <br/>
                &copy; Feito pelos REAIS devs Seniors P. Felix e H. Pompei
              </span>
  </div>
);
}