import { Link } from 'react-router';
import en from '../i18n/en.json';
import { screens } from './screens';

export function Landing() {
  return (
    <main className="mx-auto max-w-5xl p-8">
      <div className="flex items-center gap-3">
        <img src="/illustrations/A_logo_vixir.svg" alt="" width={36} height={36} />
        <span className="font-heading text-2xl font-bold">{en['app.name']}</span>
      </div>
      <h1 className="mt-10 max-w-2xl font-heading text-5xl font-bold leading-tight tracking-tight">{en['landing.headline']}</h1>
      <p className="mt-4 max-w-xl text-lg text-muted">{en['landing.sub']}</p>
      <h2 className="mt-12 font-heading text-xl font-semibold">Screens to build</h2>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {screens.filter((s) => s.code !== 'A1').map((s) => (
          <li key={s.code}>
            <Link className="block rounded-lg border border-line bg-white p-3 hover:border-primary" to={s.path.replace(/:\w+/g, 'demo')}>
              <span className="font-mono text-sm text-muted">{s.code}</span> {s.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
