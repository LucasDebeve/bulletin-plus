import { useMemo } from 'react';
import StatsCard from '@/components/stats/StatsCard';
import { DataTable } from '@/components/notes/data-table';
import { columns } from '@/components/notes/columns';
import {
  calculateCompetenceAverages,
  getIntranetAverage,
  getMatieresAverages,
  listEvaluations,
  removeDoublonsMatieresAverages,
} from '@/lib/utils';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useNotes } from '@/hooks/use-notes.ts';

function MainStats() {
  const { data: notesData, isLoading, error } = useNotes();

  const {
    evaluations,
    oldEvaluations,
    competences,
    competenceAverages,
    oldCompetenceAverages,
    generalAverage,
    oldGeneralAverage,
    intranetAverage,
    oldIntranetAverage,
    isYearValidated,
  } = useMemo(() => {
    if (!notesData) {
      return {
        evaluations: [],
        oldEvaluations: [],
        competences: [],
        competenceAverages: [],
        oldCompetenceAverages: [],
        generalAverage: 0,
        oldGeneralAverage: 0,
        intranetAverage: 0,
        oldIntranetAverage: 0,
        isYearValidated: false,
      };
    }

    const { data, old_data } = notesData;

    const currentEvals = listEvaluations(data[0]);
    const oldEvals = listEvaluations(old_data[0]);

    const matieresAverages = removeDoublonsMatieresAverages(
      getMatieresAverages(data[0], data[2])
    );
    const oldMatieresAverages = removeDoublonsMatieresAverages(
      getMatieresAverages(old_data[0], old_data[2])
    );

    const compAverages = calculateCompetenceAverages(data[1], matieresAverages);
    const oldCompAverages = calculateCompetenceAverages(
      old_data[1],
      oldMatieresAverages
    );

    const validCompetences = data[1].filter((competence) => {
      const competenceAverage = compAverages.find(
        (ca) => ca.id === competence.id
      );
      return competenceAverage ? competenceAverage.totalCoef > 0 : false;
    });

    const totalWeightedAverage = compAverages.reduce(
      (sum, curr) => sum + curr.totalWeightedAverage,
      0
    );
    const totalCoef = compAverages.reduce(
      (sum, curr) => sum + curr.totalCoef,
      0
    );

    const oldTotalWeightedAverage = oldCompAverages.reduce(
      (sum, curr) => sum + curr.totalWeightedAverage,
      0
    );
    const oldTotalCoef = oldCompAverages.reduce(
      (sum, curr) => sum + curr.totalCoef,
      0
    );

    // Vérifier si l'année scolaire est validée
    // il faut au maximum 2 compétences en dessous de 10
    const isYearValidated =
      validCompetences.filter((competence) => {
        const competenceAverage = compAverages.find(
          (ca) => ca.id === competence.id
        );
        return competenceAverage ? competenceAverage.average < 10 : false;
      }).length <= 2;

    return {
      evaluations: currentEvals,
      oldEvaluations: oldEvals,
      competences: validCompetences,
      competenceAverages: compAverages,
      oldCompetenceAverages: oldCompAverages,
      generalAverage: totalCoef === 0 ? 0 : totalWeightedAverage / totalCoef,
      oldGeneralAverage:
        oldTotalCoef === 0 ? 0 : oldTotalWeightedAverage / oldTotalCoef,
      intranetAverage: getIntranetAverage(currentEvals),
      oldIntranetAverage: getIntranetAverage(oldEvals),
      isYearValidated,
    };
  }, [notesData]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Chargement...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>
            Une erreur s'est produite lors du chargement des données.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <main className="pt-10 pb-4 space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          description="Nombres de notes"
          value={evaluations.length}
          oldValue={oldEvaluations.length}
        />
        <StatsCard
          description="Moyenne générale"
          value={generalAverage}
          oldValue={oldGeneralAverage}
        />
        <StatsCard
          description="Moyenne générale de l'intranet"
          value={intranetAverage}
          oldValue={oldIntranetAverage}
        />
        <StatsCard
          description="Année scolaire validée"
          value={isYearValidated ? 1 : 0}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {competences.map((competence) => (
          <StatsCard
            key={competence.id}
            description={competence.name}
            value={
              competenceAverages.find((ca) => ca.id === competence.id)
                ?.average || 0
            }
            oldValue={
              oldCompetenceAverages.find((ca) => ca.id === competence.id)
                ?.average || 0
            }
          />
        ))}
      </div>
      <DataTable columns={columns} data={evaluations} />
    </main>
  );
}

export default MainStats;
