import { FlatList, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { EntryListItem } from '@/components/EntryListItem';
import { FloatingAddButton } from '@/components/FloatingAddButton';
import { usePasswordEntries } from '@/hooks/usePasswordEntries';

export default function DashboardScreen() {
  const { entries, loading } = usePasswordEntries();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas Senhas</Text>

      {!loading && entries.length === 0 && (
        <Text style={styles.empty}>Nenhuma senha cadastrada ainda.</Text>
      )}

      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EntryListItem entry={item} onPress={(id) => router.push(`/(app)/entry/${id}`)} />
        )}
      />

      <FloatingAddButton onPress={() => router.push('/(app)/entry/new')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  empty: {
    textAlign: 'center',
    color: '#6B7280',
    marginTop: 40,
  },
});
