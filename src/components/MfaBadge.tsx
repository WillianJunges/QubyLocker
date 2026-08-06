import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ThemeColors } from '@/theme/colors';
import { useTheme } from '@/theme/ThemeContext';

export function MfaBadge({ visible }: { visible: boolean }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  if (!visible) return null;

  return (
    <View style={styles.badge}>
      <Text style={styles.text}>MFA</Text>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    badge: {
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: colors.successBg,
    },
    text: {
      fontSize: 10,
      fontWeight: '700',
      color: colors.successText,
    },
  });
}
