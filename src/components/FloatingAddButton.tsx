import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { ThemeColors } from '@/theme/colors';
import { useTheme } from '@/theme/ThemeContext';

export function FloatingAddButton({ onPress }: { onPress: () => void }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <Pressable style={styles.fab} onPress={onPress}>
      <Text style={styles.plus}>+</Text>
    </Pressable>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    fab: {
      position: 'absolute',
      right: 20,
      bottom: 20,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 4,
    },
    plus: {
      color: colors.primaryText,
      fontSize: 28,
      lineHeight: 28,
    },
  });
}
