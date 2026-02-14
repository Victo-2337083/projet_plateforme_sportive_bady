'use client';
import { useEffect, useState } from 'react';
import { fetchWithOffline } from '../lib/api';

export default function HomePage() {
  const [concept, setConcept] = useState<any>(null);
  useEffect(() => { fetchWithOffline('/today', 'today').then(setConcept); }, []);
  return <main className="p-6"><h1 className="text-2xl">Aujourd'hui</h1><p>{concept?.title ?? 'Chargement...'}</p><button className="big-btn">Commencer</button></main>;
}
