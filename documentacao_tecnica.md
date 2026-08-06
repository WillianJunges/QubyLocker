# QubyLocker — Documentação Técnica (Expo / React Native)

Documento de planejamento antes do início da implementação. Baseado no roteiro original (`roteiro_qubylocker.txt`), adaptado para Expo + React Native + TypeScript.

---

## 1. Stack Escolhida

| Camada          | Tecnologia                                    |
|-----------------|------------------------------------------------|
| Framework       | Expo (SDK atual, com **Development Build**)    |
| Linguagem       | TypeScript                                      |
| Navegação       | Expo Router (file-based routing)                |
| Banco de dados  | `expo-sqlite`                                   |
| Criptografia    | AES-256-GCM (lib a definir — ver seção 5)       |
| Chave mestra    | `expo-secure-store` (Android Keystore / iOS Keychain) |
| Biometria       | `expo-local-authentication`                     |
| Anti-print      | `expo-screen-capture`                           |
| Build/Distribuição | EAS Build (APK assinado)                     |

**Por que Development Build e não Expo Go:** `expo-secure-store` com `requireAuthentication`, `expo-local-authentication` e `expo-screen-capture` exigem código nativo compilado. O app precisa rodar via `expo-dev-client` + `eas build`, não no app Expo Go da loja.

---

## 2. Estrutura de Pastas Proposta

```
QubyLocker/
├── app/                            # Expo Router — telas e rotas
│   ├── _layout.tsx                 # Layout raiz, provider de auth/lock
│   ├── index.tsx                   # Redireciona p/ unlock ou dashboard
│   ├── (auth)/
│   │   └── unlock.tsx              # Tela de acesso (PIN + biometria)
│   └── (app)/
│       ├── _layout.tsx             # Layout da área autenticada
│       ├── dashboard.tsx           # Lista de senhas
│       └── entry/
│           ├── [id].tsx            # Detalhes / edição de uma entrada
│           └── new.tsx             # Cadastro de nova entrada
│
├── src/
│   ├── components/
│   │   ├── EntryListItem.tsx       # Item da lista (ícone, nome, usuário)
│   │   ├── PasswordField.tsx       # Campo de senha oculto + botão "ver"
│   │   ├── MfaBadge.tsx            # Indicador visual de MFA ativo
│   │   └── FloatingAddButton.tsx   # Botão "+" flutuante
│   │
│   ├── db/
│   │   ├── schema.ts               # Definição da tabela password_entries
│   │   ├── client.ts               # Conexão/inicialização do SQLite
│   │   └── passwordRepository.ts   # CRUD (insert/update/delete/list)
│   │
│   ├── crypto/
│   │   ├── keystore.ts             # Geração/leitura da chave mestra via SecureStore
│   │   └── cipher.ts               # encrypt()/decrypt() AES-256-GCM
│   │
│   ├── auth/
│   │   ├── biometrics.ts           # Wrapper de expo-local-authentication
│   │   ├── AuthContext.tsx         # Estado global: locked/unlocked
│   │   └── useAutoLock.ts          # Bloqueia ao ir para background (AppState)
│   │
│   ├── hooks/
│   │   └── usePasswordEntries.ts   # Hook de leitura/escrita reativa da lista
│   │
│   ├── types/
│   │   └── PasswordEntry.ts        # Tipos compartilhados
│   │
│   └── utils/
│       └── validators.ts           # Validação de formulário
│
├── assets/                         # Ícones, splash screen
├── app.config.ts                   # Config Expo: plugins, permissões, nome/bundle id
├── eas.json                        # Perfis de build (development/preview/production)
├── package.json
├── tsconfig.json
└── README.md
```

---

## 3. Modelo de Dados

```ts
// src/types/PasswordEntry.ts
type PasswordEntry = {
  id: string;              // uuid
  appName: string;
  username: string;
  passwordCipher: string;  // ciphertext em base64
  iv: string;               // vetor de inicialização (base64)
  url?: string;
  notes?: string;
  mfaEnabled: boolean;
  createdAt: number;
  updatedAt: number;
};
```

A senha **nunca** é gravada em texto puro — apenas `passwordCipher` + `iv` vão para o SQLite. A descriptografia acontece só em memória, no momento de exibir.

---

## 4. Fluxo de Segurança

1. **Primeiro acesso:** usuário define um PIN → app gera uma chave mestra aleatória (256 bits) → chave é salva no `expo-secure-store` com `requireAuthentication: true` (fica atrelada ao Keystore/Keychain do hardware).
2. **Desbloqueio do app:** tela `unlock.tsx` pede PIN ou dispara biometria (`expo-local-authentication`). Sucesso → `AuthContext` marca sessão como "unlocked".
3. **Salvar uma senha:** texto puro é criptografado (AES-256-GCM) com a chave mestra antes de ir para o SQLite.
4. **Ver uma senha:** botão "Ver Senha" exige nova autenticação biométrica → chave é lida do SecureStore → decrypt em memória → exibição temporária.
5. **Bloqueio automático:** `useAutoLock` observa `AppState` e volta o app para "locked" ao ir para background/inativo (equivalente ao `OnPause`/`OnStop` nativo).
6. **Anti-print:** `expo-screen-capture` ativado nas telas sensíveis (equivalente ao `FLAG_SECURE`).
7. **Sem internet:** nenhuma permissão de rede declarada em produção; `app.config.ts` remove/bloqueia permissões de INTERNET no manifest gerado pelo EAS Build.

---

## 5. Pontos em Aberto (decidir antes de codar)

- **Lib de AES-256-GCM:** `expo-crypto` só cobre hashing/random bytes, não faz AES-GCM nativamente. Opções a avaliar:
  - `react-native-quick-crypto` (mais rápido, binding nativo)
  - `aes-js` / `crypto-js` (puro JS, mais simples, porém mais lento e sem aceleração de hardware)
  - Decisão afeta a implementação de `src/crypto/cipher.ts`.
- **PIN local:** o PIN em si também precisa de um armazenamento seguro (hash, não texto puro) — usar o próprio `expo-secure-store` ou um hash (ex. via `expo-crypto` digest) comparado no unlock.
- **Ícones de apps na lista:** buscar de um asset local (não há internet) — definir se será um conjunto de ícones genéricos ou iniciais do nome.

---

## 6. Passo a Passo de Implementação

1. `npx create-expo-app` + configurar TypeScript, Expo Router, `expo-dev-client`.
2. Instalar dependências: `expo-secure-store`, `expo-local-authentication`, `expo-sqlite`, `expo-screen-capture`, lib de AES escolhida.
3. Configurar `app.config.ts` (permissões, plugins, remoção de INTERNET).
4. Implementar `src/db` (schema + repository) e `src/crypto` (keystore + cipher).
5. Implementar `AuthContext` + `useAutoLock` + tela `unlock.tsx`.
6. Implementar `dashboard.tsx` (lista) com `usePasswordEntries`.
7. Implementar `entry/new.tsx` e `entry/[id].tsx` (formulário + `PasswordField` com biometria).
8. Ativar `expo-screen-capture` nas telas sensíveis.
9. Testes manuais do ciclo completo: criar → listar → editar → ver senha → auto-lock.
10. Build via EAS (`eas build -p android --profile production`) → gerar APK assinado → instalar via USB.

---

## 7. Testes

- Round-trip de criptografia: `encrypt(texto) → decrypt(cipher) === texto`.
- CRUD do repositório contra o SQLite (dados de teste).
- Fluxo de auto-lock: simular app indo para background e voltar.
- Verificar ausência de permissão de INTERNET no APK gerado.

---

Documento gerado como planejamento técnico antes da implementação do projeto QubyLocker em Expo/React Native.
