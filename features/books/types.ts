export type WorkId = string;

export interface BookSummary {
  id: WorkId;
  title: string;
  authors: string[];
  coverId?: number;
  firstPublishYear?: number;
  subjectTags: string[];
}

export interface BookDetail extends BookSummary {
  description?: string;
  excerpt?: string;
}

export interface OpenLibrarySubjectResponse {
  key: string;
  name: string;
  work_count: number;
  works: OpenLibraryWork[];
}

export interface OpenLibraryWork {
  key: string;
  title: string;
  edition_count?: number;
  cover_id?: number;
  subject?: string[];
  first_publish_year?: number;
  authors?: Array<{ key: string; name: string }>;
}

export interface OpenLibraryWorkResponse {
  key: string;
  title: string;
  first_publish_date?: string;
  description?: string | { value: string };
  excerpt?: string | { comment?: string; text: string };
  covers?: number[];
  subjects?: string[];
  authors?: Array<{ author: { key: string } }>;
}
