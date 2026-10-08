'use client';

import Link from 'next/link';
import Styles from './pagPrin.module.css'
export default function PaginaPrincipal() {
    return (
        <main>
            <h1>KrakenLabs</h1>

            <h2>Sistema de Reservas</h2>

            <Link href="/laboratorios"
            className={Styles.botao}>
                Cadastrar Laboratório
            </Link>

            <br />
            <br />

            <Link href="/salas"
            className={Styles.botao}>
                Cadastrar Sala
            </Link>

            <br />
            <br />

            <Link href="/status"
            className={Styles.botao}>
                Cadastrar Status
            </Link>
        </main>
    );
}