import StatsCard from '@/components/stats/StatsCard.tsx';
import { fetchNotes } from '@/lib/api.ts';
import { useEffect, useState } from 'react';
import { DataTable } from '@/components/notes/data-table.tsx';
import { columns } from '@/components/notes/columns.tsx';
import { Competence, Matiere, MatiereEvaluee } from '@/types/notes.ts';
import { getIntranetAverage, listEvaluations } from '@/lib/utils.ts';
import { EvaluationComplete } from '@/types/notes';

function MainStats() {
  const [matieres, setMatieres] = useState([] as Matiere[]);
  const [matieresEvaluees, setMatieresEvaluees] = useState(
    [] as MatiereEvaluee[]
  );
  const [competences, setCompetences] = useState([] as Competence[]);
  const [evaluations, setEvaluations] = useState([] as EvaluationComplete[]);
  const [oldEvaluations, setOldEvaluations] = useState(
    [] as EvaluationComplete[]
  );
  const [moyenneIntranet, setMoyenneIntranet] = useState(0);
  const [oldMoyenneIntranet, setOldMoyenneIntranet] = useState(0);

  useEffect(() => {
    fetchNotes(
      import.meta.env.VITE_API_USERNAME as string,
      import.meta.env.VITE_API_PASSWORD as string
    ).then(({ old_data, data }) => {
      setMatieresEvaluees(data[0]);
      setCompetences(data[1]);
      setMatieres(data[2]);

      const evaluationsTemp = listEvaluations(data[0]);
      const oldEvaluationsTemp = listEvaluations(old_data[0]);
      setEvaluations(evaluationsTemp);
      setMoyenneIntranet(getIntranetAverage(evaluationsTemp));
      setOldEvaluations(oldEvaluationsTemp);
      setOldMoyenneIntranet(getIntranetAverage(oldEvaluationsTemp));
    });
  }, []);

  return (
    <main className={'py-4'}>
      <div className={'grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4'}>
        <StatsCard
          description={'Nombres de notes'}
          value={evaluations.length}
          oldValue={oldEvaluations.length}
        />
        <StatsCard
          description={'Moyenne générale'}
          value={16.5}
          oldValue={16.1}
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
            value={competence.id}
          />
        ))}
      </div>
      <DataTable columns={columns} data={evaluations}></DataTable>
      <div>{JSON.stringify(matieres)}</div>
      <div>{JSON.stringify(matieresEvaluees)}</div>
      <div>{JSON.stringify(competences)}</div>
    </main>
  );
}

export default MainStats;
