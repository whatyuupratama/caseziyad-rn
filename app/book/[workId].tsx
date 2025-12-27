import { Image } from 'expo-image';
import { useNavigation, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { FeedbackState } from '@/components/feedback-state';
import { useBookDetail } from '@/features/books/hooks/use-book-detail';
import type { BookDetail, BookSummary } from '@/features/books/types';
import { getCoverImageUrl } from '@/features/books/utils';

function parseInitialBook(serialized?: string | string[]) {
  if (!serialized) {
    return null;
  }

  const raw = Array.isArray(serialized) ? serialized[0] : serialized;

  try {
    return JSON.parse(decodeURIComponent(raw)) as BookSummary;
  } catch {
    return null;
  }
}

export default function BookDetailScreen() {
  const params = useLocalSearchParams<{ workId?: string; initial?: string }>();
  const navigation = useNavigation();
  const initialBook = useMemo(() => parseInitialBook(params.initial), [params.initial]);
  const workId = params.workId ? String(params.workId) : undefined;
  const { book, error, isLoading, refetch, status } = useBookDetail(workId, initialBook ?? undefined);

  useEffect(() => {
    if (book?.title) {
      navigation.setOptions({ title: book.title });
    }
  }, [book?.title, navigation]);

  if (!workId) {
    return <FeedbackState title="Buku tidak ditemukan" message="Pastikan Anda membuka detail dari daftar buku." />;
  }

  if (!book && status === 'loading') {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" />
        <Text style={styles.hintText}>Menyiapkan detail buku...</Text>
      </View>
    );
  }

  if (!book && error) {
    return (
      <FeedbackState
        title="Tidak dapat membuka detail"
        message={error.message}
        actionLabel="Coba Lagi"
        onAction={refetch}
        iconName={error.kind === 'network' ? 'wifi-off' : 'warning-amber'}
      />
    );
  }

  if (!book) {
    return null;
  }

  const coverUri = getCoverImageUrl(book.coverId, 'L');
  const detailedBook = hasExtendedFields(book) ? book : undefined;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.coverWrapper}>
          {coverUri ? (
            <Image source={{ uri: coverUri }} style={styles.cover} contentFit="cover" transition={300} />
          ) : (
            <Text style={styles.coverFallback}>Sampul tidak tersedia</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>{book.title}</Text>
          <Text style={styles.authorLabel}>{book.authors.length ? book.authors.join(', ') : 'Penulis tidak diketahui'}</Text>
        </View>

        <View style={[styles.section, styles.infoRow]}>
          {book.firstPublishYear ? <InfoBadge label="Tahun Terbit" value={String(book.firstPublishYear)} /> : null}
          <InfoBadge label="Topik" value={`${book.subjectTags.length} tags`} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ringkasan</Text>
          <Text style={styles.paragraph}>{detailedBook?.description || 'Belum ada deskripsi resmi untuk karya ini.'}</Text>
        </View>

        {book.subjectTags.length ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tag Populer</Text>
            <View style={styles.tagsWrapper}>
              {book.subjectTags.slice(0, 8).map((tag) => (
                <Text key={tag} style={styles.tag}>
                  {tag}
                </Text>
              ))}
            </View>
          </View>
        ) : null}

        {error ? (
          <FeedbackState
            title="Detail offline"
            message="Anda sedang melihat data cache. Aktifkan kembali koneksi lalu tekan tombol di bawah."
            actionLabel="Muat Ulang"
            onAction={refetch}
            iconName="wifi-off"
          />
        ) : null}
      </ScrollView>

      {isLoading && book ? (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator />
          <Text style={styles.hintText}>Sinkronisasi detail terbaru...</Text>
        </View>
      ) : null}
    </View>
  );
}

function InfoBadge({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeLabel}>{label}</Text>
      <Text style={styles.badgeValue}>{value}</Text>
    </View>
  );
}

function hasExtendedFields(book: BookSummary | BookDetail): book is BookDetail {
  return 'description' in book || 'excerpt' in book;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 48,
    gap: 20,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  coverWrapper: {
    height: 280,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cover: {
    height: '100%',
    width: '100%',
  },
  coverFallback: {
    paddingHorizontal: 16,
    textAlign: 'center',
    color: '#374151',
  },
  section: {
    gap: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
  },
  authorLabel: {
    color: '#6b7280',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0f172a',
  },
  paragraph: {
    color: '#374151',
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#11181C10',
  },
  badgeLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  badgeValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  tagsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#0a7ea410',
    fontSize: 13,
  },
  loadingOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#ffffffee',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 12,
  },
  hintText: {
    color: '#6b7280',
  },
});
