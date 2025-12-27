import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const checklist = [
  'Data diambil dari OpenLibrary search API dengan query love dan limit 10 item.',
  'Hook khusus (`useBooksQuery`) mengelola loading, retry, cache dasar, dan status offline.',
  'Halaman detail memakai data yang sama dari list sehingga tidak akan refetch saat offline.',
];

const featureHighlights = [
  'Komponen `BookCard` reusable untuk list maupun detail sehingga tampilan konsisten.',
  'Skeleton state dan pull-to-refresh bawaan Expo untuk UX yang terasa responsif.',
  'Error boundary sederhana dengan tombol Coba Lagi agar tester mudah validasi.',
];

const verificationChecklist = [
  'Scroll list buku memastikan cover dan judul muncul dari cache lokal maupun fetch baru.',
  'Buka detail buku untuk melihat reusability komponen dan state sharing antar layar.',
  'Matikan koneksi lalu tekan Coba Lagi guna menunjukkan fallback offline tidak crash.',
];

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <MaterialIcons name="info" size={48} color="#0a7ea4" />
          <Text style={styles.title}>Tentang Aplikasi</Text>
          <Text style={styles.paragraph}>
            Simple Book Explorer adalah demo coding React Native/Expo untuk proses rekrutmen. Fokusnya menunjukkan bagaimana aku
            menata data fetching, state, dan tampilan yang bersih untuk daftar buku sederhana.
          </Text>
          <Text style={styles.paragraph}>
            Proyek ini disusun modular: data logic di folder features/books, UI di components, dan utilitas di lib sehingga reviewer
            bisa cepat membaca struktur kode tanpa harus membuka terlalu banyak file.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cara Kerja Singkat</Text>
          {checklist.map((item) => (
            <View key={item} style={styles.bulletRow}>
              <MaterialIcons name="verified" size={18} color="#16a34a" style={styles.checkIcon} />
              <Text style={styles.paragraph}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sorotan Fitur</Text>
          {featureHighlights.map((item) => (
            <View key={item} style={styles.bulletRow}>
              <MaterialIcons name="verified" size={18} color="#16a34a" style={styles.checkIcon} />
              <Text style={styles.paragraph}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Checklist Verifikasi</Text>
          {verificationChecklist.map((item) => (
            <View key={item} style={styles.bulletRow}>
              <MaterialIcons name="verified" size={18} color="#16a34a" style={styles.checkIcon} />
              <Text style={styles.paragraph}>{item}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  content: {
    gap: 24,
    paddingBottom: 48,
  },
  header: {
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  section: {
    gap: 12,
  },
  paragraph: {
    color: '#6b7280',
    fontSize: 16,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0f172a',
  },
  bulletRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  checkIcon: {
    marginTop: 3,
  },
});
