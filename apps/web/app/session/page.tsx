'use client';

import { useEffect, useState } from 'react';
import { fetchWithOffline } from '../../lib/api';

export default function SessionPage() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    fetchWithOffline('/session', 'session').then(setSession);
  }, []);

  return (
    <main className="space-y-4">
      <section className="card">
        <p className="text-sm font-bold text-blue-700">⏱ Session ~5 min</p>
        <h2 className="kid-title text-2xl mt-1">On apprend en s'amusant !</h2>
        <div className="mt-3 progress-track">
          <div className="progress-fill" style={{ width: '33%' }} />
        </div>
        <p className="mt-2 text-sm text-slate-600">Exercice 1 / 3</p>
      </section>

      <section className="grid gap-3">
        {(session?.exercises ?? []).map((e: any, idx: number) => (
          <article key={e._id ?? idx} className="card">
            <p className="text-xs font-bold uppercase text-slate-500">{e.type}</p>
            <h3 className="text-lg font-bold mt-1">{e.prompt}</h3>
            <p className="text-sm text-slate-600 mt-2">Feedback bienveillant : "Tu progresses, continue !"</p>
          </article>
        ))}
      </section>
    </main>
  );
}
