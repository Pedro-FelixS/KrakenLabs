'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './lab.module.css'
const ESTADO_INICIAL = {
  nome: '',
  codigo: '',
  capacidade: '',
  localizacao: ''
};
export default function lab() {
    const router = useRouter();
    const [mensagem, setMensagem] = useState('Carregando...');
    const [formData, setFormData] = useState(ESTADO_INICIAL);
    const [carregando, setCarregando] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        setCarregando(true);
        setMensagem('');
    try {
      const res = await fetch('http://localhost:5000/api/sala', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const texto = await res.text();
            if (!res.ok) {
                setMensagem(texto);
                return;
            }
            setMensagem(texto);
            setFormData(ESTADO_INICIAL);
            router.push('/paginaPrincipal');
    } catch (error) {
      console.error('Erro!', error);
      setMensagem('Erro de conexão com o servidor.');
    } finally {
            setCarregando(false);
        }
    };
    return (
        <div className={styles.page}>
            <div className={styles.main}>
             <div className={styles.formContainer}>
                <h1>KrakenLabs</h1>
                <h2>Cadastro de Sala</h2>
                <form onSubmit={handleSubmit}>
                 <div className={styles.campos}>

            <label className={styles.cadastro}>

              <span className={styles.grupo}>
                Nome da Sala:
              </span>

              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Digite o nome da Sala"
                required
              />

            </label>

            <label className={styles.cadastro}>

              <span className={styles.grupo}>
                Código:
              </span>

              <input
                type="text"
                name="codigo"
                value={formData.codigo}
                onChange={handleChange}
                placeholder="Código da Sala"
                required
              />

            </label>

            <label className={styles.cadastro}>

              <span className={styles.grupo}>
                Capacidade Máxima:
              </span>

              <input
                type="number"
                name="capacidade"
                value={formData.capacidade}
                onChange={handleChange}
                placeholder="Capacidade Máxima"
                minLength={1}
                required
              />

            </label>

            <label className={styles.cadastro}>

              <span className={styles.grupo}>
                Localização:
              </span>

              <input
                type="text"
                name="localizacao"
                value={formData.localizacao}
                onChange={handleChange}
                placeholder="Localização da Sala"
                required
              />
            </label>

            </div>
            <button type="submit" 
            className={styles.botao}
            disabled={carregando}>
                {carregando ? 'Cadastrando...' : 'Cadastrar Sala'}
            </button>

            {mensagem && <p>{mensagem}</p>}
            </form>
            </div>
        </div>
    </div>
    );
}