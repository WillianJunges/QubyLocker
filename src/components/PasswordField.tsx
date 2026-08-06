import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors } from '@/theme/colors';

type Props = {
  value: string;
  onChangeText?: (text: string) => void;
  editable?: boolean;
  revealed: boolean;
  onToggleReveal: () => void;
};

/**
 * Campo de senha controlado pelo componente pai. Este componente não faz
 * nenhuma checagem de biometria — quem decide se `revealed` pode virar
 * `true` é a tela que o usa (ex: já exigiu biometria para decifrar antes
 * de passar o valor pra cá).
 */
export function PasswordField({ value, onChangeText, editable = true, revealed, onToggleReveal }: Props) {
  return (
    <View style={styles.row}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        secureTextEntry={!revealed}
        placeholder="Senha"
        placeholderTextColor={colors.textMuted}
      />
      <Pressable onPress={onToggleReveal} style={styles.toggle}>
        <Text style={styles.toggleText}>{revealed ? 'Ocultar' : 'Ver Senha'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.text,
  },
  toggle: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  toggleText: {
    color: colors.link,
  },
});
