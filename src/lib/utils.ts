import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  MatiereEvaluee,
  EvaluationComplete,
  MatiereAverage,
  Matiere,
  MatiereCompleteForOneCompetence,
  Competence,
} from '@/types/notes';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function listEvaluations(data: MatiereEvaluee[]): EvaluationComplete[] {
  if (data.length === 0) {
    return [];
  }

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

export function removeDoublonsMatieresAverages(
  data: MatiereAverage[]
): MatiereAverage[] {
  return data.filter((matiereAverage, index, self) => {
    return (
      index ===
      self.findIndex(
        (t) =>
          t.matiere.matiere === matiereAverage.matiere.matiere &&
          t.average === matiereAverage.average
      )
    );
  });
}

export function getMatieresAverages(
  data: MatiereEvaluee[],
  matieres: Matiere[]
): MatiereAverage[] {
  return data.map((matiereEvaluee) => {
    const total = matiereEvaluee.evaluations.reduce((acc, evaluation) => {
      return acc + evaluation.note * evaluation.coefficient;
    }, 0);

    const matiereId = matiereEvaluee.matiere.match(/\|(.*)$/)?.[1].trim();
    const matiereData = matieres.find((matiereData) => {
      const matiereDataId = matiereData.matiere.match(/\|(.*)$/)?.[1].trim();
      return matiereDataId === matiereId;
    });

    if (!matiereData) {
      throw new Error(
        `La matière ${matiereEvaluee.matiere} n'a pas été trouvée`
      );
    }

    return {
      matiere: matiereData,
      average:
        total /
        matiereEvaluee.evaluations.reduce((acc, evaluation) => {
          return acc + evaluation.coefficient;
        }, 0),
    };
  });
}

export function calculateCompetenceAverages(
  competences: Competence[],
  matieresAverages: ReturnType<typeof getMatieresAverages>
): CompetenceAverage[] {
  return competences.map((competence) => {
    const result = matieresAverages.reduce(
      (acc, matiereAverage) => {
        const coefMatiere = getCoefMatiereForCompetence(
          matiereAverage,
          competence.id
        );
        return {
          totalCoef: acc.totalCoef + coefMatiere.coef,
          totalWeightedAverage:
            acc.totalWeightedAverage + coefMatiere.average * coefMatiere.coef,
        };
      },
      { totalCoef: 0, totalWeightedAverage: 0 }
    );

    return {
      id: competence.id,
      totalCoef: result.totalCoef,
      totalWeightedAverage: result.totalWeightedAverage,
      average:
        result.totalCoef === 0
          ? 0
          : result.totalWeightedAverage / result.totalCoef,
    };
  });
}

export function getCoefMatiereForCompetence(
  matiere: MatiereAverage,
  competenceId: number
): MatiereCompleteForOneCompetence {
  // Extriare tous les caractères situés après le '|'

  let coef = matiere.matiere.coefs.find((coef) => coef.ue === competenceId);

  if (!coef) {
    coef = { coef: 0, ue: competenceId };
  }

  return {
    matiere: matiere.matiere.matiere,
    average: matiere.average,
    coef: coef.coef,
    ue: competenceId,
  };
}

export function getIntranetAverage(data: EvaluationComplete[]): number {
  const total = data.reduce((acc, evaluation) => {
    return acc + evaluation.note * evaluation.coefficient;
  }, 0);

  return (
    total /
    data.reduce((acc, evaluation) => {
      return acc + evaluation.coefficient;
    }, 0)
  );
}
