'use client'; 
import { useState } from 'react';
import styles from './login.module.css';
import Link from 'next/link'; 
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [statusEnvio, setStatusEnvio] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const Login = async (e) => { 
    e.preventDefault();
    setCarregando(true);
    setStatusEnvio(null);

    try {
      const data = new FormData(e.target); 

      const resultado = await fetch('http://localhost:5000/login', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(data)),
      });

      const mensagem = await resultado.text();

      if (!resultado.ok) {
        alert(mensagem);
        return;
      }

      router.push('/paginaPrincipal');
    } catch (erro) {
      alert('Falha ao conectar com o servidor. Tente novamente mais tarde.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.main}>
        <div className={styles.formContainer}>
          <h1>Realize o Login do KrakenLabs</h1>
          <br /><br />
    
          <form onSubmit={Login}>
            <input
              name="email"
              type="email" 
              size="30"
              placeholder="E-mail"
              required
            />

            <br /><br />

            <input
              name="senha"
              type="password" 
              size="30"
              placeholder="Senha"
              required
            />

            <br /><br />

            <button
              className={styles.botao}
              type="submit"
              disabled={carregando}
            >
              {carregando ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <br />

          <Link
            href="/"
            className={styles.meuBotaoLogin}
          >
            Não possui conta? Faça seu cadastro!
          </Link>

          <br /><br />

          <button
            className={styles.botao}
            type="button"
            onClick={() => router.push('/paginaPrincipal')}
          >
            Testar Página Principal
          </button>
        </div>
      </div>

      <span className={styles.rodape}>
        KrakenLabs <br />
        &copy; Feito pelos REAIS devs Seniors P. Felix e H. Pompei
      </span>
    </div>
  );
}