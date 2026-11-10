'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from './pagPrin.module.css'
export default function PaginaPrincipal() {
    const [ehProfessor, setEhProfessor] = useState(null);

    useEffect(() => {
        const dadosUsuario = sessionStorage.getItem('usuario');

        if (!dadosUsuario) {
            window.location.href = '/login';
            return;
        }

        const usuario = JSON.parse(dadosUsuario);

        setEhProfessor(usuario.ehProfessor === true || usuario.ehProfessor === 1);
    }, []);

    if (ehProfessor === null) {
        return <p>Carregando...</p>;
    }
    return (
    <div className={styles.page}>
      <div className={styles.main}>
            <h1>KrakenLabs</h1>

            <h2>Sistema de reservas</h2>
          {ehProfessor && (
            <>
            <Link href="/lab"
            className={styles.botao}>
                Cadastrar Laboratório
            </Link>

            <br/>
            <br/>

            <Link href="/sala"
            className={styles.botao}>
                Cadastrar Sala
            </Link>

            <br/>
            <br/>

            <Link href="/status"
            className={styles.botao}>
                Cadastrar Status
            </Link>

            <br />
        <br />
    </>
      )}
        <Link href="/reservas" className={styles.botao}>
          Reservar Recursos
        </Link>
     
        <br/>
        <br/>
        <Link href="/consultaReserva" className={styles.botao}>
          Consultar as reservas
        </Link>
        </div>
        <span className={styles.rodape}>
        KrakenLabs <br />
        &copy; Feito pelos REAIS devs Sêniors P. Felix e H. Pompei
      </span>
    </div>
    );
}