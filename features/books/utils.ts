import type { BookDetail, BookSummary, OpenLibraryWork, OpenLibraryWorkResponse } from './types';

export function normalizeWorkId(workKey: string) {
  return workKey.replace('/works/', '');
}

export function getCoverImageUrl(coverId?: number, size: 'S' | 'M' | 'L' = 'M') {
  if (!coverId) {
    return undefined;
  }

  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
}

function extractRichText(value?: unknown): string | undefined {
  if (!value) {
    return undefined;
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'object' && 'value' in value && typeof (value as { value?: unknown }).value === 'string') {
    return (value as { value: string }).value;
  }

  if (typeof value === 'object' && 'text' in value && typeof (value as { text?: unknown }).text === 'string') {
    return (value as { text: string }).text;
  }

  return undefined;
}

export function mapWorkToSummary(work: OpenLibraryWork): BookSummary {
  return {
    id: normalizeWorkId(work.key),
    title: work.title,
    authors: (work.authors ?? []).map((author) => author.name).filter(Boolean),
    coverId: work.cover_id,
    firstPublishYear: work.first_publish_year,
    subjectTags: work.subject ?? [],
  };
}

export function mapWorkResponseToDetail(work: OpenLibraryWorkResponse): Partial<BookDetail> {
  return {
    id: normalizeWorkId(work.key),
    title: work.title,
    coverId: work.covers?.[0],
    subjectTags: work.subjects ?? [],
    description: extractRichText(work.description),
    excerpt: extractRichText(work.excerpt),
  };
}

export function mergeBookDetail(base: BookSummary | null | undefined, detail: Partial<BookDetail>): BookDetail {
  return {
    id: detail.id ?? base?.id ?? 'unknown',
    title: detail.title ?? base?.title ?? 'Tanpa Judul',
    authors: detail.authors && detail.authors.length > 0 ? detail.authors : base?.authors ?? [],
    coverId: detail.coverId ?? base?.coverId,
    firstPublishYear: detail.firstPublishYear ?? base?.firstPublishYear,
    subjectTags: detail.subjectTags ?? base?.subjectTags ?? [],
    description: detail.description ?? base?.description,
    excerpt: detail.excerpt ?? base?.excerpt,
  };
}
