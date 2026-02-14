import './globals.css';
import Link from 'next/link';

const links = [
  { href: '/', label: "Aujourd'hui" },
  { href: '/session', label: 'Session' },
  { href: '/review', label: 'Réviser' },
  { href: '/badges', label: 'Badges' },
  { href: '/parent', label: 'Parent' }
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <div className="shell pt-4 space-y-4">
          <header className="card">
            <p className="text-sm font-bold text-blue-700">📚 1 concept par jour</p>
            <h1 className="text-xl font-black">Mini session éducative (~5 min)</h1>
            <nav className="top-nav mt-3">
              {links.map((link) => (
                <Link key={link.href} className="nav-link" href={link.href}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
