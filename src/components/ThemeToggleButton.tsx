import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { useTheme } from '@/theme/ThemeContext';

export function ThemeToggleButton() {
  const { isDark, colors, toggleTheme } = useTheme();

  return (
    <Pressable
      style={[styles.button, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={toggleTheme}
      hitSlop={8}
    >
      <Text style={styles.icon}>{isDark ? '☀️' : '🌙'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: 50,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  icon: {
    fontSize: 18,
  },
});
