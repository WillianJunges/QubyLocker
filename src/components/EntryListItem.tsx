import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { MfaBadge } from '@/components/MfaBadge';
import { ThemeColors } from '@/theme/colors';
import { useTheme } from '@/theme/ThemeContext';
import { PasswordEntry } from '@/types/PasswordEntry';

type Props = {
  entry: PasswordEntry;
  onPress: (id: string) => void;
};

export function EntryListItem({ entry, onPress }: Props) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

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

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
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
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconText: {
      fontWeight: '700',
      color: colors.primary,
    },
    info: {
      flex: 1,
    },
    appName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    username: {
      fontSize: 13,
      color: colors.textMuted,
    },
  });
}
