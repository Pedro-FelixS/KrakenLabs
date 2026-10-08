'use client';

import Link from 'next/link';

export default function PaginaPrincipal() {
    return (
        <main>
            <h1>KrakenLabs</h1>

            <h2>Sistema de Reservas</h2>

            <Link href="/laboratorios">
                Cadastrar Laboratório
            </Link>

            <br />
            <br />

            <Link href="/salas">
                Cadastrar Sala
            </Link>

            <br />
            <br />

            <Link href="/status">
                Cadastrar Status
            </Link>
        </main>
    );
}