import { openLibraryRequest } from '@/lib/http/open-library';

import type { BookDetail, BookSummary, OpenLibrarySubjectResponse, OpenLibraryWorkResponse } from '../types';
import { mapWorkResponseToDetail, mapWorkToSummary } from '../utils';

const SUBJECT_ENDPOINT = '/subjects/love.json';

export async function fetchBooks(signal?: AbortSignal): Promise<BookSummary[]> {
  const response = await openLibraryRequest<OpenLibrarySubjectResponse>({
    path: SUBJECT_ENDPOINT,
    query: { limit: 10 },
    signal,
  });

  return response.works.map(mapWorkToSummary);
}

export async function fetchBookDetail(workId: string, signal?: AbortSignal): Promise<Partial<BookDetail>> {
  const response = await openLibraryRequest<OpenLibraryWorkResponse>({
    path: `/works/${workId}.json`,
    signal,
  });

  const detail = mapWorkResponseToDetail(response);
  if (!detail.firstPublishYear && response.first_publish_date) {
    const maybeYear = Number(response.first_publish_date.slice(0, 4));
    if (!Number.isNaN(maybeYear)) {
      detail.firstPublishYear = maybeYear;
    }
  }

  return detail;
}
