import { useCallback, useEffect, useRef, useState } from 'react';

import { toAppError, type AppError } from '@/lib/errors';

import { fetchBooks } from '../api/book-service';
import type { BookSummary } from '../types';

type Status = 'idle' | 'loading' | 'success' | 'error';

export function useBooks() {
  const [books, setBooks] = useState<BookSummary[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<AppError | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const runFetch = useCallback(
    async (mode: 'initial' | 'refresh' = 'initial') => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      if (mode === 'refresh') {
        setIsRefreshing(true);
      } else {
        setStatus('loading');
      }

      setError(null);

      try {
        const response = await fetchBooks(controller.signal);
        setBooks(response);
        setStatus('success');
      } catch (err) {
        if (controller.signal.aborted) {
          return;
        }
        setError(toAppError(err));
        setStatus('error');
      } finally {
        if (mode === 'refresh') {
          setIsRefreshing(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    runFetch();
    return () => abortRef.current?.abort();
  }, [runFetch]);

  return {
    books,
    status,
    error,
    isRefreshing,
    isLoading: status === 'loading' && !isRefreshing,
    refetch: () => runFetch('initial'),
    refresh: () => runFetch('refresh'),
  };
}
