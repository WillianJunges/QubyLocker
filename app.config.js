const isDevelopmentBuild = process.env.EAS_BUILD_PROFILE === 'development';

module.exports = {
  expo: {
    name: 'QubyLocker',
    slug: 'QubyLocker',
    scheme: 'qubylocker',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    ios: {
      supportsTablet: true,
      infoPlist: {
        NSFaceIDUsageDescription: 'Usado para desbloquear o QubyLocker e revelar senhas.',
      },
    },
    android: {
      package: 'com.willianjunges.qubylocker',
      adaptiveIcon: {
        backgroundColor: '#0284FC',
        foregroundImage: './assets/android-icon-foreground.png',
      },
      predictiveBackGestureEnabled: false,
      permissions: ['android.permission.USE_BIOMETRIC', 'android.permission.USE_FINGERPRINT'],
      // Só o build "development" (descartável, usado pra testar com o Metro
      // via USB/cabo) libera internet — é exigência do próprio dev-client do
      // Expo. O app final (preview/production, o que fica instalado de
      // verdade) nunca tem essa permissão.
      blockedPermissions: isDevelopmentBuild
        ? []
        : [
            'android.permission.INTERNET',
            'android.permission.ACCESS_NETWORK_STATE',
            'android.permission.ACCESS_WIFI_STATE',
          ],
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: [
      'expo-router',
      'expo-secure-store',
      'expo-sqlite',
      [
        'expo-local-authentication',
        {
          faceIDPermission: 'Usado para desbloquear o QubyLocker e revelar senhas.',
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: 'c4d94024-693d-4a32-a67b-f73ae1e04207',
      },
    },
    owner: 'willianjunges',
  },
};
