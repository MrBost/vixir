/**
 * Thin fetch wrapper. Replace the hand-written types with ones generated from the API's OpenAPI spec:
 *   pnpm dlx openapi-typescript http://localhost:8080/v3/api-docs -o src/api/schema.d.ts
 * Rules (frontend-app Req 2–3): access token in memory only; refresh once on 401; send X-Request-Id.
 */
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';
let accessToken: string | null = null;
export const setAccessToken = (t: string | null) => { accessToken = t; };

export interface Problem { type?: string; title: string; status: number; detail?: string; code?: string }
export class ApiError extends Error { constructor(public problem: Problem) { super(problem.title); } }

export async function api<T>(path: string, init: RequestInit = {}, retried = false): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set('X-Request-Id', crypto.randomUUID());
  if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
  const res = await fetch(`${API_URL}/api/v1${path}`, { ...init, headers, credentials: 'include' });
  if (res.status === 401 && !retried && path !== '/auth/refresh') {
    const r = await fetch(`${API_URL}/api/v1/auth/refresh`, { method: 'POST', credentials: 'include' });
    if (r.ok) { setAccessToken(((await r.json()) as { accessToken: string }).accessToken); return api<T>(path, init, true); }
    setAccessToken(null);
  }
  if (!res.ok) throw new ApiError(await res.json().catch(() => ({ title: res.statusText, status: res.status })));
  return (res.status === 204 ? undefined : await res.json()) as T;
}
