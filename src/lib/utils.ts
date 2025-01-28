import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { MatiereEvaluee, EvaluationComplete } from '@/types/notes';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function listEvaluations(data: MatiereEvaluee[]): EvaluationComplete[] {
  return data.flatMap((matiereEvaluee) => {
    return matiereEvaluee.evaluations.map((evaluation) => {
      return {
        ...evaluation,
        matiere: {
          matiere: matiereEvaluee.matiere,
          coefs: [],
        },
      };
    });
  });
}
