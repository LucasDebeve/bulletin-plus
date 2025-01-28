import { ColumnDef } from '@tanstack/react-table';
import type { EvaluationComplete, Matiere } from '@/types/notes';
import { Button } from '@/components/ui/button.tsx';
import { ArrowDown01, ArrowUp10, ArrowUpDown } from 'lucide-react';

export const columns: ColumnDef<EvaluationComplete>[] = [
  {
    accessorKey: 'matiere',
    header: 'Matière',
    cell: ({ row }) => {
      const matiere: Matiere = row.getValue('matiere');
      return matiere.matiere;
    },
    filterFn: (row, _columnId: string, filterValue) => {
      const matiere: Matiere = row.getValue('matiere');
      const normalizeString = (str: string) =>
        str
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');
      return normalizeString(matiere.matiere).includes(
        normalizeString(filterValue)
      );
    },
  },
  {
    accessorKey: 'note',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => {
            if (column.getIsSorted() === 'desc') {
              column.clearSorting();
              return;
            }
            column.toggleSorting(column.getIsSorted() === 'asc');
          }}
        >
          Note
          {column.getIsSorted() === 'asc' && <ArrowDown01 size={16} />}
          {column.getIsSorted() === 'desc' && <ArrowUp10 size={16} />}
          {column.getIsSorted() === false && <ArrowUpDown size={16} />}
        </Button>
      );
    },
  },
  {
    accessorKey: 'coefficient',
    header: 'Coefficient',
  },
];
