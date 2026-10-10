'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

const ESTADO_INICIAL = {
  nome: '',
  senha: '',
  cpf: '',
  dataNascimento: '',
  telefone: '',
  email: ''
};

export default function Home() {
  const router = useRouter();
  const [mensagem, setMensagem] = useState('Carregando...');
  const [formData, setFormData] = useState(ESTADO_INICIAL);
  const [statusEnvio, setStatusEnvio] = useState(null);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {

    fetch('http://localhost:5000/api/dados')
      .then((res) => res.json())
      .then((data) => setMensagem(data.mensagem))
      .catch(() => setMensagem('Erro de conexão'));

  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.senha.length < 8) {
      setStatusEnvio({
        texto: 'A senha precisa ter pelo menos 8 caracteres.',
        tipo: 'erro'
      });
      return;
    }

    setCarregando(true);
    setStatusEnvio(null);

    try {

      const res = await fetch('http://localhost:5000/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.text();

      if (!res.ok) throw new Error(data);

      setStatusEnvio({
        texto: data,
        tipo: 'sucesso'
      });

      setFormData(ESTADO_INICIAL);

      router.push('/paginaPrincipal');

    } catch (err) {

      setStatusEnvio({
        texto: err.message || 'Falha ao cadastrar.',
        tipo: 'erro'
      });

    } finally {

      setCarregando(false);

    }
  };

  return (

    <div className={styles.page}>
      <div className={styles.main}>
        <div className={styles.statusContainer}>
          <h1>KrakenLabs</h1>
          <p>Sistema de Reserva de Laboratórios e Salas</p>
        </div>

        <div className={styles.usuario}>
          <h2>Cadastro de Usuário</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.campos}>

            <label className={styles.cadastro}>

              <span className={styles.grupo}>
                Nome completo:
              </span>

              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Seu nome completo"
                required
              />

            </label>

            <label className={styles.cadastro}>

              <span className={styles.grupo}>
                Senha (Mínimo de 8 caracteres):
              </span>

              <input
                type="password"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                placeholder="Digite sua senha"
                minLength={8}
                required
              />

            </label>

            <label className={styles.cadastro}>

              <span className={styles.grupo}>
                CPF:
              </span>

              <input
                type="text"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                placeholder="XXX.XXX.XXX-XX"
                required
              />

            </label>

            <label className={styles.cadastro}>

              <span className={styles.grupo}>
                Data de aniversário:
              </span>

              <input
                type="date"
                name="dataNascimento"
                value={formData.dataNascimento}
                onChange={handleChange}
              />

            </label>

            <label className={styles.cadastro}>

              <span className={styles.grupo}>
                Número de telefone:
              </span>

              <input
                type="tel"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                placeholder="Digite seu telefone"
              />

            </label>

            <label className={styles.cadastro}>

              <span className={styles.grupo}>
                E-mail:
              </span>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Digite seu e-mail"
                required
              />

            </label>
            </div>

            <button
              className={styles.botao}
              type="submit"
              disabled={carregando}
            >
              {carregando ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          
          </form>
          <br/>
          <Link
            href="/login"
            className={styles.meuBotaoLogin}
          >
            Já tem uma conta? Ir para o Login
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