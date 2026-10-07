import { Caesar_Dressing, Kings, Supermercado_One } from 'next/font/google';
import "./globals.css";

const caesar = Caesar_Dressing({
  weight: '400',
  subsets: ['latin'],
});

const kings = Kings({
  weight: '400',
  subsets: ['latin'],
});

const supermercado = Supermercado_One({
  weight: '400',
  subsets: ['latin'],
});

export const metadata = {
  title: "KrakenLabs",
  description: "Sistema de Reserva de Laboratórios e Salas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}