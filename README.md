# QubyLocker

Gerenciador de senhas offline, pessoal, feito com Expo + React Native + TypeScript.
Sem acesso à rede — todos os dados ficam apenas no dispositivo.

Ver `documentacao_tecnica.md` para a arquitetura completa e `roteiro_qubylocker.txt`
para o roteiro original do projeto.

## Status

Este é o **esqueleto inicial** do projeto: estrutura de pastas, tipos, telas e
módulos de criptografia/armazenamento estão criados, mas alguns pontos ainda
precisam de decisão/implementação antes de ir para produção — ver seção
"Pendências" abaixo.

## Rodando localmente

Este projeto usa módulos nativos (`expo-secure-store` com `requireAuthentication`,
`expo-local-authentication`, `expo-screen-capture`), então **não roda no app Expo Go**.
É necessário um Development Build:

```bash
npm install
npx expo prebuild
npx expo run:android
```

Ou, com EAS:

```bash
eas build --profile development --platform android
```

## Gerando o APK final (sideload)

```bash
eas build --profile production --platform android
```

Gera um `.apk` assinado para instalar via USB/transferência direta (fora da Play Store).

## Sem rede, de propósito

`app.json` bloqueia explicitamente as permissões de rede no manifest final:

```json
"blockedPermissions": [
  "android.permission.INTERNET",
  "android.permission.ACCESS_NETWORK_STATE",
  "android.permission.ACCESS_WIFI_STATE"
]
```

Isso vale mesmo que alguma dependência tente declarar essas permissões — elas são
removidas do manifest gerado.

## Pendências antes de usar com senhas reais

1. **Cifragem:** `crypto-js` não implementa AES-GCM. `src/crypto/cipher.ts` usa
   AES-256-CBC + HMAC-SHA256 (Encrypt-then-MAC) como alternativa. Funcionalmente
   segura, mas é uma decisão diferente do "AES-256 GCM" citado no roteiro original —
   revisar se isso é aceitável ou se vale migrar para `react-native-quick-crypto`
   (que tem GCM nativo).
2. **PIN local:** ainda não há hash/verificação do PIN — `src/crypto/keystore.ts`
   e a tela `app/(auth)/unlock.tsx` têm um `TODO` marcando isso.
3. **Ícones por app:** a lista hoje usa a inicial do nome como "ícone" — decidir se
   isso é suficiente ou se vale um conjunto de ícones locais.
