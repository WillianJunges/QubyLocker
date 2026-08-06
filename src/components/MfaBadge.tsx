import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function MfaBadge({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <View style={styles.badge}>
      <Text style={styles.text}>MFA</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#DCFCE7',
  },
  text: {
    fontSize: 10,
    fontWeight: '700',
    color: '#166534',
  },
});
