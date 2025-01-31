import { useQuery } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api.ts';
import { toast } from 'sonner';

export const useNotes = (credentials?: {
  username: string;
  password: string;
}) => {
  return useQuery({
    queryKey: ['notes', credentials?.username],
    queryFn: () => {
      const fetchPromise = fetchNotes(
        credentials?.username || '',
        credentials?.password || ''
      );
      toast.promise(fetchPromise, {
        loading: 'Chargement des notes...',
        success: 'Notes chargées avec succès',
        error: 'Impossible de charger les notes',
        closeButton: true,
      });
      return fetchPromise;
    },
    enabled: !!credentials,
  });
};
