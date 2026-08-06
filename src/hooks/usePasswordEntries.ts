import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import { listEntries } from '@/db/passwordRepository';
import { PasswordEntry } from '@/types/PasswordEntry';

export function usePasswordEntries() {
  const [entries, setEntries] = useState<PasswordEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await listEntries();
      setEntries(rows);
    } finally {
      setLoading(false);
    }
  }, []);

  // Reconsulta sempre que a tela ganha foco (ex: voltando de criar/editar/
  // excluir uma senha) — o dashboard não é remontado nesses casos, só um
  // useEffect de montagem não seria suficiente.
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  return { entries, loading, refresh };
}
