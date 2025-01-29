import { useQuery } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api.ts';

export const useNotes = () => {
  return useQuery({
    queryKey: ['notes'],
    queryFn: () =>
      fetchNotes(
        import.meta.env.VITE_API_USERNAME as string,
        import.meta.env.VITE_API_PASSWORD as string
      ),
  });
};
