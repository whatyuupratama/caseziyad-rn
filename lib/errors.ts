export type AppErrorKind = 'network' | 'http' | 'unknown';

export interface AppError {
  kind: AppErrorKind;
  message: string;
  statusCode?: number;
  details?: string;
}

export class HttpError extends Error {
  public readonly status: number;
  public readonly responseText?: string;

  constructor(status: number, message: string, responseText?: string) {
    super(message);
    this.status = status;
    this.responseText = responseText;
    this.name = 'HttpError';
  }
}

const NETWORK_ERROR_MESSAGES = [
  'Network request failed',
  'Failed to fetch',
  'NetworkError when attempting to fetch resource.',
];

export function toAppError(error: unknown): AppError {
  if (error instanceof HttpError) {
    return {
      kind: 'http',
      message: error.message || 'Gagal memuat data.',
      statusCode: error.status,
      details: error.responseText,
    };
  }

  if (error instanceof TypeError) {
    const message = error.message ?? '';
    if (NETWORK_ERROR_MESSAGES.some((hint) => message.includes(hint))) {
      return {
        kind: 'network',
        message: 'Koneksi terputus. Periksa jaringan Anda lalu coba lagi.',
        details: message,
      };
    }
  }

  if (error instanceof Error) {
    return {
      kind: 'unknown',
      message: 'Terjadi kesalahan yang tidak terduga. Silakan coba lagi.',
      details: error.message,
    };
  }

  return {
    kind: 'unknown',
    message: 'Terjadi kesalahan yang tidak terduga. Silakan coba lagi.',
  };
}
