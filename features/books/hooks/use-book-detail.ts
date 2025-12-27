import { useCallback, useEffect, useRef, useState } from 'react';

import { toAppError, type AppError } from '@/lib/errors';

import { fetchBookDetail } from '../api/book-service';
import type { BookDetail, BookSummary } from '../types';
import { mergeBookDetail } from '../utils';

type Status = 'idle' | 'loading' | 'success' | 'error';

export function useBookDetail(workId: string | undefined, initialBook?: BookSummary | null) {
  const [book, setBook] = useState<BookDetail | BookSummary | null>(() => initialBook ?? null);
  const [status, setStatus] = useState<Status>(() => (initialBook ? 'success' : 'idle'));
  const [error, setError] = useState<AppError | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const baseBookRef = useRef<BookSummary | null>(initialBook ?? null);

  useEffect(() => {
    baseBookRef.current = initialBook ?? null;
    setBook(initialBook ?? null);
    setStatus(initialBook ? 'success' : 'idle');
  }, [initialBook, workId]);

  const load = useCallback(async () => {
    if (!workId) {
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setStatus('loading');
    setError(null);

    try {
      const detail = await fetchBookDetail(workId, controller.signal);
      setBook((prev) => mergeBookDetail(prev ?? baseBookRef.current, detail));
      setStatus('success');
    } catch (err) {
      if (controller.signal.aborted) {
        return;
      }
      setError(toAppError(err));
      setStatus('error');
    }
  }, [workId]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  useEffect(() => {
    if (!workId) {
      return;
    }
    load();
  }, [load, workId]);

  return {
    book,
    status,
    error,
    refetch: load,
    isLoading: status === 'loading',
  };
}
