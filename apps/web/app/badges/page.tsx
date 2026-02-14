const badges = ['Curieux du jour', 'Esprit logique', 'Super mémoire'];

export default function BadgesPage() {
  return (
    <main className="space-y-4">
      <section className="card">
        <p className="text-sm font-bold text-amber-700">🏅 Badges</p>
        <h2 className="kid-title text-2xl mt-1">Bravo pour tes efforts</h2>
        <p className="text-slate-600 mt-2">Badges non addictifs : on récompense la persévérance.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {badges.map((badge) => (
            <span key={badge} className="badge-chip">{badge}</span>
          ))}
        </div>
      </section>
    </main>
  );
}
