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

export function getIntranetAverage(data: EvaluationComplete[]): number {
  const sum = data.reduce((acc, evaluation) => {
    return acc + evaluation.note * evaluation.coefficient;
  }, 0);
  const totalCoef = data.reduce((acc, evaluation) => {
    return acc + evaluation.coefficient;
  }, 0);
  return sum / totalCoef;
}
