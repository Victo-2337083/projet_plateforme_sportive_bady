'use client';
import { useState } from 'react';

export default function ParentPage() {
  const [hold, setHold] = useState(false);
  return <main className="p-6"><h1>Parent gate</h1><button className="big-btn" onMouseDown={() => setHold(true)} onMouseUp={() => setHold(false)}>{hold ? 'Question: 2+2?' : 'Maintenir pour confirmer'}</button><p>Dashboard: temps total, concepts vus, maîtrise.</p></main>;
}
