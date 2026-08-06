import * as LocalAuthentication from 'expo-local-authentication';

export async function isBiometricAvailable(): Promise<boolean> {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  return hasHardware && isEnrolled;
}

type AuthenticateOptions = {
  /** true = exige biometria de verdade, sem opção de cair para PIN/padrão do sistema. */
  biometricOnly?: boolean;
};

export async function authenticate(
  promptMessage: string,
  { biometricOnly = false }: AuthenticateOptions = {}
): Promise<boolean> {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage,
    cancelLabel: 'Cancelar',
    disableDeviceFallback: biometricOnly,
  });
  return result.success;
}
