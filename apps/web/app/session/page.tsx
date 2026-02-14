'use client';
import { useEffect, useState } from 'react';
import { fetchWithOffline } from '../../lib/api';

export default function SessionPage() {
  const [session, setSession] = useState<any>(null);
  useEffect(() => { fetchWithOffline('/session', 'session').then(setSession); }, []);
  return <main className="p-6"><h1 className="text-xl">Session ~5 min</h1>{session?.exercises?.map((e: any) => <p key={e._id}>{e.type}: {e.prompt}</p>)}</main>;
}
