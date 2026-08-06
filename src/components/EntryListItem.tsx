import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { MfaBadge } from '@/components/MfaBadge';
import { PasswordEntry } from '@/types/PasswordEntry';

type Props = {
  entry: PasswordEntry;
  onPress: (id: string) => void;
};

export function EntryListItem({ entry, onPress }: Props) {
  return (
    <Pressable style={styles.container} onPress={() => onPress(entry.id)}>
      <View style={styles.icon}>
        <Text style={styles.iconText}>{entry.appName.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.appName}>{entry.appName}</Text>
        <Text style={styles.username}>{entry.username}</Text>
      </View>
      <MfaBadge visible={entry.mfaEnabled} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E6F4FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontWeight: '700',
    color: '#0369A1',
  },
  info: {
    flex: 1,
  },
  appName: {
    fontSize: 16,
    fontWeight: '600',
  },
  username: {
    fontSize: 13,
    color: '#6B7280',
  },
});
