'use client';

import { useMemo, useState } from 'react';

export default function ParentPage() {
  const [hold, setHold] = useState(0);

  const unlocked = useMemo(() => hold >= 3, [hold]);

  return (
    <main className="space-y-4">
      <section className="card">
        <p className="text-sm font-bold text-slate-700">🛡 Parent Gate</p>
        <h2 className="kid-title text-2xl mt-1">Espace parent</h2>
        <p className="text-slate-600 mt-2">Maintiens 3 fois pour confirmer, puis réponds : 2 + 2 = ?</p>

        <div className="mt-4 flex gap-3 items-center">
          <button
            className="big-btn"
            onMouseDown={() => setHold((v) => Math.min(v + 1, 3))}
            onTouchStart={() => setHold((v) => Math.min(v + 1, 3))}
          >
            Maintenir pour confirmer ({hold}/3)
          </button>
          <button className="soft-btn" onClick={() => setHold(0)}>Reset</button>
        </div>

        {unlocked ? (
          <div className="mt-5 rounded-2xl bg-emerald-50 p-4 border border-emerald-200">
            <p className="font-bold text-emerald-800">✅ Vérification étape 1 réussie</p>
            <ul className="list-disc pl-5 mt-2 text-sm text-slate-700">
              <li>Temps total</li>
              <li>Concepts vus</li>
              <li>Maîtrise par tags</li>
              <li>Export / suppression des données</li>
            </ul>
          </div>
        ) : null}
      </section>
    </main>
  );
}
