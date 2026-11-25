import { useAuthStore } from '@/store/auth-store';

export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1').replace(/\/$/, '');

/** Pagination info returned by list endpoints (rygn_be buildMeta). */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** Success envelope used by every rygn_be endpoint. */
export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

/** Appends query params, skipping undefined/empty values: withQuery('/users', { page: 1, role: undefined }) → '/users?page=1'. */
export function withQuery(path: string, params: Record<string, string | number | undefined>): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') query.set(key, String(value));
  }
  const qs = query.toString();
  return qs ? `${path}?${qs}` : path;
}

interface ApiFailureBody {
  success: false;
  message: string;
  error: { code: string; details?: unknown };
}

/** Any failed request: HTTP errors from the API, or a network failure (status 0). */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }

  /** Field → message map from a VALIDATION_ERROR response ({ field, message }[]). */
  get fieldErrors(): Record<string, string> {
    if (this.code !== 'VALIDATION_ERROR' || !Array.isArray(this.details)) return {};
    const out: Record<string, string> = {};
    for (const d of this.details) {
      if (d && typeof d.field === 'string' && typeof d.message === 'string' && !out[d.field]) out[d.field] = d.message;
    }
    return out;
  }
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  /** JSON body; serialized for you. */
  body?: unknown;
  /** Attach the access token and refresh it on 401. Default true. */
  auth?: boolean;
}

async function send<T>(path: string, { body, auth = true, headers, ...init }: RequestOptions): Promise<ApiSuccess<T>> {
  const token = auth ? useAuthStore.getState().accessToken : null;

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      credentials: 'include', // sends the httpOnly refresh cookie to /auth routes
      headers: {
        Accept: 'application/json',
        ...(body !== undefined && { 'Content-Type': 'application/json' }),
        ...(token && { Authorization: `Bearer ${token}` }),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('Cannot reach the server. Check your connection and try again.', 0, 'NETWORK_ERROR');
  }

  const json = (await res.json().catch(() => null)) as ApiSuccess<T> | ApiFailureBody | null;
  if (!res.ok || !json || json.success === false) {
    const failure = json && json.success === false ? json : null;
    throw new ApiError(
      failure?.message ?? `Request failed (${res.status})`,
      res.status,
      failure?.error.code ?? 'UNKNOWN_ERROR',
      failure?.error.details,
    );
  }
  return json;
}

// One refresh at a time: concurrent 401s all wait for the same request.
let refreshPromise: Promise<string | null> | null = null;

/** Exchanges the refresh cookie for a new access token. Clears the session if that fails. */
export function refreshAccessToken(): Promise<string | null> {
  refreshPromise ??= (async () => {
    try {
      const { data } = await send<{ accessToken: string; expiresIn: number }>('/auth/refresh', {
        method: 'POST',
        auth: false,
      });
      useAuthStore.getState().setAccessToken(data.accessToken);
      return data.accessToken;
    } catch {
      useAuthStore.getState().clearSession();
      return null;
    } finally {
      refreshPromise = null;
    }
  })();
  return refreshPromise;
}

/** Calls the API. On a 401 for an authenticated call, refreshes the token once and retries. */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<ApiSuccess<T>> {
  try {
    return await send<T>(path, options);
  } catch (error) {
    const canRetry =
      error instanceof ApiError && error.status === 401 && options.auth !== false && useAuthStore.getState().accessToken;
    if (!canRetry) throw error;
    if (!(await refreshAccessToken())) throw error;
    return send<T>(path, options);
  }
}
