export function isRequired(value: string): boolean {
  return value.trim().length > 0;
}

export function validateNewEntry(input: { appName: string; username: string; password: string }): string | null {
  if (!isRequired(input.appName)) return 'Informe o nome do app/site.';
  if (!isRequired(input.username)) return 'Informe o usuário/login.';
  if (!isRequired(input.password)) return 'Informe a senha.';
  return null;
}
