import { HttpError } from '@/lib/errors';

const BASE_URL = 'https://openlibrary.org';

type QueryRecord = Record<string, string | number | boolean | undefined>;

export interface OpenLibraryRequestConfig {
  path: string;
  query?: QueryRecord;
  signal?: AbortSignal;
}

function buildQueryString(query?: QueryRecord) {
  if (!query) {
    return '';
  }

  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined) {
      return;
    }

    params.append(key, String(value));
  });

  const serialized = params.toString();
  return serialized ? `?${serialized}` : '';
}

export async function openLibraryRequest<TResponse>({ path, query, signal }: OpenLibraryRequestConfig): Promise<TResponse> {
  const url = `${BASE_URL}${path}${buildQueryString(query)}`;
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
    signal,
  });

  if (!response.ok) {
    const responseText = await response.text();
    throw new HttpError(response.status, response.statusText, responseText);
  }

  return (await response.json()) as TResponse;
}
