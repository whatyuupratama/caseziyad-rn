import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItemInfo,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

import { FeedbackState } from '@/components/feedback-state';
import { useBooks } from '@/features/books/hooks/use-books';
import type { BookSummary } from '@/features/books/types';

function createInitialBookPayload(book: BookSummary) {
  try {
    return encodeURIComponent(JSON.stringify(book));
  } catch {
    return undefined;
  }
}

export default function BooksScreen() {
  const router = useRouter();
  const { books, error, isLoading, isRefreshing, refetch, refresh, status } = useBooks();

  const handleOpenDetail = useCallback(
    (book: BookSummary) => {
      const initialPayload = createInitialBookPayload(book);
      const query = initialPayload ? `?initial=${initialPayload}` : '';
      const href = `/book/${book.id}${query}`;

      router.push(href as never);
    },
    [router],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<BookSummary>) => <BookListCard book={item} onPress={handleOpenDetail} />,
    [handleOpenDetail],
  );

  const keyExtractor = useCallback((item: BookSummary) => item.id, []);

  const listHeader = useMemo(() => {
    return (
      <View style={styles.header}>
        <MaterialIcons name="menu-book" size={48} color="#0a7ea4" />
        <Text style={styles.title}>Simple Book Explorer</Text>
        <Text style={styles.subtitle}>
          Jelajahi 10 karya bertema cinta dari OpenLibrary dan pelajari detailnya secara singkat.
        </Text>
        {error && books.length > 0 ? (
          <View style={styles.banner}>
            <Text style={styles.bannerText}>Terjadi kendala saat memuat data terbaru. Menampilkan data terakhir.</Text>
            <Text style={styles.link} onPress={refetch}>
              Coba Lagi
            </Text>
          </View>
        ) : null}
      </View>
    );
  }, [books.length, error, refetch]);

  const showInitialLoading = isLoading && books.length === 0;

  return (
    <View style={styles.container}>
      {showInitialLoading ? (
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingLabel}>Memuat buku terbaik untuk Anda...</Text>
        </View>
      ) : books.length === 0 && error ? (
        <FeedbackState
          title="Ups, koneksi terputus"
          message={error.message}
          actionLabel="Coba Lagi"
          onAction={refetch}
          iconName={error.kind === 'network' ? 'wifi-off' : 'warning-amber'}
        />
      ) : (
        <FlatList
          data={books}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} />}
          ListHeaderComponent={listHeader}
          ListEmptyComponent={
            status === 'success' ? (
              <FeedbackState title="Belum ada buku" message="Silakan tarik untuk memuat ulang data." />
            ) : null
          }
        />
      )}
    </View>
  );
}

function BookListCard({ book, onPress }: { book: BookSummary; onPress: (book: BookSummary) => void }) {
  const authors = book.authors.join(', ');
  const coverUri = buildCoverUrl(book.coverId, 'M');

  return (
    <Pressable onPress={() => onPress(book)} style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
      <View style={styles.coverContainer}>
        {coverUri ? (
          <Image source={{ uri: coverUri }} style={styles.cover} contentFit="cover" transition={200} />
        ) : (
          <Text style={styles.coverFallback}>No Cover</Text>
        )}
      </View>
      <View style={styles.meta}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {book.title}
        </Text>
        {authors ? (
          <Text numberOfLines={1} style={styles.authors}>
            {authors}
          </Text>
        ) : null}
        {book.firstPublishYear ? <Text style={styles.year}>First published • {book.firstPublishYear}</Text> : null}
        {book.subjectTags.length ? (
          <View style={styles.tagsRow}>
            {book.subjectTags.slice(0, 2).map((tag) => (
              <Text key={tag} style={styles.tag} numberOfLines={1}>
                {tag}
              </Text>
            ))}
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

function buildCoverUrl(coverId?: number, size: 'S' | 'M' | 'L' = 'M') {
  if (!coverId) {
    return undefined;
  }
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  listContent: {
    paddingBottom: 48,
  },
  header: {
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    color: '#6b7280',
    fontSize: 16,
  },
  loadingState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingLabel: {
    color: '#6b7280',
  },
  banner: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#fef3c7',
    gap: 4,
  },
  bannerText: {
    color: '#92400e',
  },
  link: {
    color: '#0a7ea4',
    fontWeight: '600',
  },
  card: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#f8fafc',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e5e7eb',
  },
  cardPressed: {
    opacity: 0.7,
  },
  coverContainer: {
    height: 120,
    width: 90,
    borderRadius: 12,
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
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  meta: {
    flex: 1,
    gap: 6,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  authors: {
    color: '#6b7280',
  },
  year: {
    fontSize: 12,
    color: '#6b7280',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: '#eef2ff',
  },
});
