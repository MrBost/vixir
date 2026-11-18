import { useState } from 'react';
import { useSearchParams } from 'react-router';

type Tab = 'signin' | 'signup';
type Role = 'STUDENT' | 'TEACHER' | 'ADMIN';

export function Auth() {
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState<Tab>('signin');
  const [role, setRole] = useState<Role>('STUDENT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    // API call would go here
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left: Dark blue side with hero message */}
      <div className="hidden flex-1 bg-[#0B1220] p-12 text-white lg:flex lg:flex-col lg:justify-center">
        <div className="max-w-md">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-white font-heading font-bold text-lg">
            V
          </div>
          <h2 className="mt-8 font-heading text-5xl font-bold leading-tight">Your lab bench is ready.</h2>
          <p className="mt-6 text-base text-blue-100">
            Sign in with the account your school or department created, or join a class with the code your teacher gave you.
          </p>
          <div className="mt-8 rounded-lg border border-blue-800 bg-[#0B1220] p-4 font-mono text-sm text-blue-200">
            <div>g = 42 / slope</div>
            <div className="mt-2">slope (T2 vs L) = 4.02 s2 m1</div>
            <div className="mt-2 text-green-300">g = 9.82 m s2 / within 2%</div>
          </div>
          <p className="mt-8 text-xs text-blue-300">Works offline once installed Data stays with your institution</p>
        </div>
      </div>

      {/* Right: Sign in / Sign up form */}
      <div className="flex flex-1 flex-col justify-center bg-white px-6 sm:px-8">
        <div className="w-full max-w-sm mx-auto">
          {/* Mobile header */}
          <div className="mb-8 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white font-heading font-bold">
              V
            </div>
            <h1 className="mt-4 font-heading text-2xl font-bold">Vixir</h1>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-line mb-6">
            <button
              onClick={() => setTab('signin')}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition ${
                tab === 'signin'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted hover:text-ink'
              }`}
            >
              Sign in
            </button>
            <button
              onClick={() => setTab('signup')}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition ${
                tab === 'signup'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted hover:text-ink'
              }`}
            >
              Create account
            </button>
          </div>

          {tab === 'signin' ? (
            <SignInForm error={error} loading={loading} onSubmit={handleSubmit} />
          ) : (
            <SignUpForm role={role} setRole={setRole} error={error} loading={loading} onSubmit={handleSubmit} />
          )}
        </div>
      </div>
    </div>
  );
}

function SignInForm({ error, loading, onSubmit }: { error: string | null; loading: boolean; onSubmit: (e: React.FormEvent<HTMLFormElement>) => void }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h3 className="font-heading text-xl font-semibold">Welcome back</h3>

      <div>
        <label className="block text-sm font-medium text-ink mb-2">Email or matric / admission number</label>
        <input
          type="text"
          placeholder="e.g. 2025/PHY/0142"
          className="w-full rounded-lg border border-line bg-white px-4 py-2.5 text-sm placeholder:text-blue-300 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-ink mb-2">Password</label>
        <input
          type="password"
          placeholder="••••••••"
          className="w-full rounded-lg border border-line bg-white px-4 py-2.5 text-sm placeholder:text-blue-300 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          required
        />
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="rounded" />
          <span className="text-muted">Keep me signed in on this device</span>
        </label>
        <a href="#" className="text-primary hover:underline font-medium">
          Forgot password?
        </a>
      </div>

      {error && <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
      >
        {loading ? 'Signing in...' : 'Sign in'}
      </button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-line" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-muted">or</span>
        </div>
      </div>

      <button
        type="button"
        className="w-full rounded-lg border border-line px-4 py-2.5 text-sm font-medium hover:bg-page transition"
      >
        Continue with Google
      </button>

      <p className="text-center text-xs text-muted mt-4">
        Signing in as a teacher?{' '}
        <a href="#" className="text-primary hover:underline font-medium">
          Go to teacher view
        </a>
      </p>
    </form>
  );
}

function SignUpForm({ role, setRole, error, loading, onSubmit }: { role: 'STUDENT' | 'TEACHER' | 'ADMIN'; setRole: (role: 'STUDENT' | 'TEACHER' | 'ADMIN') => void; error: string | null; loading: boolean; onSubmit: (e: React.FormEvent<HTMLFormElement>) => void }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h3 className="font-heading text-xl font-semibold">Create account</h3>

      <div>
        <label className="block text-sm font-medium text-ink mb-3">I am a</label>
        <div className="space-y-2">
          {[
            { value: 'STUDENT', label: 'Student' },
            { value: 'TEACHER', label: 'Teacher' },
            { value: 'ADMIN', label: 'Admin' }
          ].map((opt) => (
            <label key={opt.value} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="role"
                value={opt.value}
                checked={role === opt.value}
                onChange={(e) => setRole(e.target.value as any)}
                className="rounded-full"
              />
              <span className="text-sm">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {role === 'STUDENT' && (
        <div>
          <label className="block text-sm font-medium text-ink mb-2">Class code</label>
          <input
            type="text"
            placeholder="e.g. PHY-SS3-7KQ2"
            className="w-full rounded-lg border border-line bg-white px-4 py-2.5 text-sm placeholder:text-blue-300 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <p className="mt-1 text-xs text-muted">Ask your teacher for this code.</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-ink mb-2">Email</label>
        <input
          type="email"
          className="w-full rounded-lg border border-line bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-ink mb-2">First name</label>
          <input
            type="text"
            className="w-full rounded-lg border border-line bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-2">Last name</label>
          <input
            type="text"
            className="w-full rounded-lg border border-line bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-ink mb-2">Password</label>
        <input
          type="password"
          placeholder="At least 8 characters"
          className="w-full rounded-lg border border-line bg-white px-4 py-2.5 text-sm placeholder:text-blue-300 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          required
        />
      </div>

      {error && <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
      >
        {loading ? 'Creating account...' : 'Create account'}
      </button>

      <button
        type="button"
        className="w-full rounded-lg border border-line px-4 py-2.5 text-sm font-medium hover:bg-page transition"
      >
        Continue with Google
      </button>
    </form>
  );
}
