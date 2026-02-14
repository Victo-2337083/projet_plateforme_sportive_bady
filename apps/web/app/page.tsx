'use client';

import { useEffect, useState } from 'react';
import { fetchWithOffline } from '../lib/api';

export default function HomePage() {
  const [concept, setConcept] = useState<any>(null);

  useEffect(() => {
    fetchWithOffline('/today', 'today').then(setConcept);
  }, []);

  return (
    <main className="space-y-4">
      <section className="card">
        <p className="text-sm text-blue-700 font-bold">🎯 Aujourd'hui</p>
        <h2 className="kid-title mt-1">{concept?.title ?? 'Ton concept arrive...'}</h2>
        <p className="mt-2 text-slate-600">
          {concept?.story ?? 'Une petite histoire et 3 exercices amusants pour apprendre sans pression.'}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="badge-chip">5 minutes</span>
          <span className="badge-chip">Bienveillance</span>
          <span className="badge-chip">Offline prêt</span>
        </div>
        <div className="mt-5 flex gap-3">
          <button className="big-btn">Commencer</button>
          <button className="soft-btn">🔊 Écouter</button>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        <article className="card">
          <p className="text-2xl">🧠</p>
          <h3 className="font-bold text-lg">Concept court</h3>
          <p className="text-sm text-slate-600">Texte simple, adapté primaire.</p>
        </article>
        <article className="card">
          <p className="text-2xl">🎲</p>
          <h3 className="font-bold text-lg">3 exercices</h3>
          <p className="text-sm text-slate-600">QCM + Association + jeu mémoire.</p>
        </article>
        <article className="card">
          <p className="text-2xl">⭐</p>
          <h3 className="font-bold text-lg">Badges doux</h3>
          <p className="text-sm text-slate-600">Récompenses non addictives.</p>
        </article>
      </section>
    </main>
  );
}
