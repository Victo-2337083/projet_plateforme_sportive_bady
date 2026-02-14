import './globals.css';
import Link from 'next/link';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <nav className="p-3 flex gap-3">
          <Link href="/">Aujourd'hui</Link><Link href="/session">Session</Link><Link href="/review">Réviser</Link><Link href="/badges">Badges</Link><Link href="/parent">Parent</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
