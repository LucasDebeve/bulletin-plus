import StatsCard from '@/components/stats/StatsCard.tsx';
import { fetchNotes } from '@/lib/api.ts';
import { useEffect, useState } from 'react';
import { DataTable } from '@/components/notes/data-table.tsx';
import { columns } from '@/components/notes/columns.tsx';
import { Competence } from '@/types/notes.ts';
import {
  getCoefMatiereForCompetence,
  getIntranetAverage,
  getMatieresAverages,
  listEvaluations,
  removeDoublonsMatieresAverages,
} from '@/lib/utils.ts';
import { EvaluationComplete } from '@/types/notes';

function MainStats() {
  const [competences, setCompetences] = useState([] as Competence[]);
  const [evaluations, setEvaluations] = useState([] as EvaluationComplete[]);
  const [oldEvaluations, setOldEvaluations] = useState(
    [] as EvaluationComplete[]
  );
  const [moyenneIntranet, setMoyenneIntranet] = useState(0);
  const [oldMoyenneIntranet, setOldMoyenneIntranet] = useState(0);
  const [competencesAverages, setCompetencesAverages] = useState(
    [] as number[]
  );
  const [oldCompetencesAverages, setOldCompetencesAverages] = useState(
    [] as number[]
  );

  const [totalCoefsCompetences, setTotalCoefsCompetences] = useState(0);
  const [totalAverageCompetences, setTotalAverageCompetences] = useState(0);
  const [oldTotalCoefsCompetences, setOldTotalCoefsCompetences] = useState(0);
  const [oldTotalAverageCompetences, setOldTotalAverageCompetences] =
    useState(0);

  useEffect(() => {
    fetchNotes(
      import.meta.env.VITE_API_USERNAME as string,
      import.meta.env.VITE_API_PASSWORD as string
    ).then(({ old_data, data }) => {
      setCompetences(data[1]);

      const evaluationsTemp = listEvaluations(data[0]);
      const oldEvaluationsTemp = listEvaluations(old_data[0]);
      setEvaluations(evaluationsTemp);
      setMoyenneIntranet(getIntranetAverage(evaluationsTemp));
      setOldEvaluations(oldEvaluationsTemp);
      setOldMoyenneIntranet(getIntranetAverage(oldEvaluationsTemp));

      const matieresAverages = removeDoublonsMatieresAverages(
        getMatieresAverages(data[0], data[2])
      );
      const oldMatieresAverages = removeDoublonsMatieresAverages(
        getMatieresAverages(old_data[0], old_data[2])
      );

      data[1].forEach((competence) => {
        let sumCoef = 0;
        const sumAverage = matieresAverages.reduce(
          (acc: number, matiereAverage) => {
            const coefMatiere = getCoefMatiereForCompetence(
              matiereAverage,
              competence.id
            );
            sumCoef += coefMatiere.coef;
            return acc + coefMatiere.average * coefMatiere.coef;
          },
          0
        );

        setTotalCoefsCompetences(
          (totalCoefsCompetences) => totalCoefsCompetences + sumCoef
        );
        setTotalAverageCompetences(
          (totalAverageCompetences) => totalAverageCompetences + sumAverage
        );

        setCompetencesAverages((competencesAverages) => [
          ...competencesAverages,
          sumAverage / sumCoef,
        ]);
      });
      old_data[1].forEach((competence) => {
        let sumCoef = 0;
        const sumAverage = oldMatieresAverages.reduce(
          (acc: number, matiereAverage) => {
            const coefMatiere = getCoefMatiereForCompetence(
              matiereAverage,
              competence.id
            );
            sumCoef += coefMatiere.coef;
            return acc + coefMatiere.average * coefMatiere.coef;
          },
          0
        );

        setOldTotalCoefsCompetences(
          (totalCoefsCompetences) => totalCoefsCompetences + sumCoef
        );
        setOldTotalAverageCompetences(
          (totalAverageCompetences) => totalAverageCompetences + sumAverage
        );

        setOldCompetencesAverages((oldCompetencesAverages) => [
          ...oldCompetencesAverages,
          sumAverage / sumCoef,
        ]);
      });
    });
  }, []);

  return (
    <main className={'pt-10 pb-4 space-y-4'}>
      <div className={'grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4'}>
        <StatsCard
          description={'Nombres de notes'}
          value={evaluations.length}
          oldValue={oldEvaluations.length}
        />
        <StatsCard
          description={'Moyenne générale'}
          value={
            totalCoefsCompetences === 0
              ? 0
              : totalAverageCompetences / totalCoefsCompetences
          }
          oldValue={
            oldTotalCoefsCompetences === 0
              ? 0
              : oldTotalAverageCompetences / oldTotalCoefsCompetences
          }
        />
        <StatsCard
          description={"Moyenne générale de l'intranet"}
          value={moyenneIntranet}
          oldValue={oldMoyenneIntranet}
        />
      </div>
      <div className={`grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-6`}>
        {competences.map((competence) => (
          <StatsCard
            key={competence.id}
            description={competence.name}
            value={competencesAverages[competence.id] || 0}
            oldValue={oldCompetencesAverages[competence.id] || 0}
          />
        ))}
      </div>
      <DataTable columns={columns} data={evaluations}></DataTable>
    </main>
  );
}

export default MainStats;
