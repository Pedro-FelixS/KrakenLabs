import "./globals.css";

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