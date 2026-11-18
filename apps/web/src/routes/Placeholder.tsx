import { Link } from 'react-router';
import type { ScreenDef } from './screens';

export function Placeholder({ screen }: { screen: ScreenDef }) {
  return (
    <main className="mx-auto max-w-3xl p-8">
      <p className="font-mono text-sm text-muted">{screen.code} · {screen.path}</p>
      <h1 className="mt-1 font-heading text-3xl font-bold">{screen.title}</h1>
      <p className="mt-3 text-muted">Not built yet. Build this screen from the spec in <code>.kiro/specs/frontend-app</code> and the Vixir canvas design {screen.code}.</p>
      <Link className="mt-6 inline-block text-primary underline" to="/">Back to start</Link>
    </main>
  );
}
