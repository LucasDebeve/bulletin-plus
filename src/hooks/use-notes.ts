import { useQuery } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api.ts';

export const useNotes = (credentials?: {
  username: string;
  password: string;
}) => {
  return useQuery({
    queryKey: ['notes', credentials?.username],
    queryFn: () =>
      fetchNotes(credentials?.username || '', credentials?.password || ''),
    enabled: !!credentials,
  });
};
