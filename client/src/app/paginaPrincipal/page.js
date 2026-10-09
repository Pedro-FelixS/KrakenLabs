'use client';

import Link from 'next/link';
import styles from './pagPrin.module.css'
export default function PaginaPrincipal() {
    return (
    <div className={styles.page}>
      <div className={styles.main}>
            <h1>KrakenLabs</h1>

            <h2>Sistema de reservas</h2>

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
        </div>
    </div>
    );
}