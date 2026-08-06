import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

export function FloatingAddButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable style={styles.fab} onPress={onPress}>
      <Text style={styles.plus}>+</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0369A1',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  plus: {
    color: 'white',
    fontSize: 28,
    lineHeight: 28,
  },
});
