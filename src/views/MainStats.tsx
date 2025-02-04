import { useMemo } from 'react';
import StatsCard from '@/components/stats/StatsCard';
import { DataTable } from '@/components/notes/data-table';
import { columns } from '@/components/notes/columns';
import {
  calculateCompetenceAverages,
  getIntranetAverage,
  getMatieresAverages,
  listEvaluations,
  mergeEvaluationsData,
  removeDoublonsMatieresAverages,
} from '@/lib/utils';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useNotes } from '@/hooks/use-notes.ts';
import { useAuth } from '@/hooks/use-auth.ts';
import BoolCard from '@/components/stats/BoolCard.tsx';
import RadarMeansMatieres from '@/components/charts/RadarMeansMatieres.tsx';
import ChartCard from '@/components/stats/ChartCard.tsx';
import CorrelationChart from '@/components/charts/CorrelationChart.tsx';

function MainStats() {
  const { credentials } = useAuth();

  const { data: notesData, isLoading, error } = useNotes(credentials);

  const {
    evaluations,
    oldEvaluations,
    competences,
    matieresAverages,
    oldMatieresAverages,
    mergedMatieresAverages,
    competenceAverages,
    oldCompetenceAverages,
    generalAverage,
    oldGeneralAverage,
    intranetAverage,
    oldIntranetAverage,
    isYearValidated,
  } = useMemo(() => {
    if (!notesData || !notesData.data) {
      return {
        evaluations: [],
        oldEvaluations: [],
        matieresAverages: [],
        oldMatieresAverages: [],
        mergedMatieresAverages: [],
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
    const matieresAverages = removeDoublonsMatieresAverages(
      getMatieresAverages(data[0], data[2])
    );

    let mergedMatieresAverages = mergeEvaluationsData(
      matieresAverages,
      undefined
    );

    const compAverages = calculateCompetenceAverages(data[1], matieresAverages);

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

    // Vérifier si l'année scolaire est validée.
    // Il faut au maximum 2 compétences en dessous de 10.
    const isYearValidated =
      validCompetences.filter((competence) => {
        const competenceAverage = compAverages.find(
          (ca) => ca.id === competence.id
        );
        return competenceAverage ? competenceAverage.average < 10 : false;
      }).length <= 2;

    // verifier si old_data est vide
    if (old_data[0].length === 0) {
      return {
        evaluations: currentEvals,
        oldEvaluations: currentEvals,
        competences: validCompetences,
        matieresAverages: matieresAverages,
        oldMatieresAverages: undefined,
        mergedMatieresAverages: mergedMatieresAverages,
        competenceAverages: compAverages,
        oldCompetenceAverages: compAverages,
        generalAverage: totalCoef === 0 ? 0 : totalWeightedAverage / totalCoef,
        oldGeneralAverage:
          totalCoef === 0 ? 0 : totalWeightedAverage / totalCoef,
        intranetAverage: getIntranetAverage(currentEvals),
        oldIntranetAverage: getIntranetAverage(currentEvals),
        isYearValidated,
      };
    }

    const oldEvals = listEvaluations(old_data[0] || []);
    const oldMatieresAverages = removeDoublonsMatieresAverages(
      getMatieresAverages(old_data[0], old_data[2])
    );
    mergedMatieresAverages = mergeEvaluationsData(
      matieresAverages,
      oldMatieresAverages
    );

    const oldCompAverages = calculateCompetenceAverages(
      old_data[1],
      oldMatieresAverages
    );
    const oldTotalWeightedAverage = oldCompAverages.reduce(
      (sum, curr) => sum + curr.totalWeightedAverage,
      0
    );
    const oldTotalCoef = oldCompAverages.reduce(
      (sum, curr) => sum + curr.totalCoef,
      0
    );

    return {
      evaluations: currentEvals,
      oldEvaluations: oldEvals,
      competences: validCompetences,
      matieresAverages: matieresAverages,
      oldMatieresAverages: oldMatieresAverages,
      mergedMatieresAverages: mergedMatieresAverages,
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
        <Alert variant="destructive" role={'alert'} aria-live={'assertive'}>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>
            {error.message || 'Une erreur est survenue'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <main className="pt-10 pb-4 space-y-4">
      <div
        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
        role={'group'}
        aria-label={'Statistiques principales'}
      >
        <StatsCard
          description="Nombres de notes"
          value={evaluations.length}
          oldValue={oldEvaluations.length}
          aria-label={`Nombre total de notes : ${evaluations.length}, précédemment ${oldEvaluations.length}`}
        />
        <StatsCard
          description="Moyenne générale"
          value={generalAverage}
          oldValue={oldGeneralAverage}
          aria-label={`Moyenne générale : ${generalAverage.toFixed(2)}, précédemment ${oldGeneralAverage.toFixed(2)}`}
        />
        <StatsCard
          description="Moyenne générale de l'intranet"
          value={intranetAverage}
          oldValue={oldIntranetAverage}
          aria-label={`Moyenne générale de l'intranet : ${intranetAverage.toFixed(2)}, précédemment ${oldIntranetAverage.toFixed(2)}`}
        />
        <BoolCard
          description={`Année scolaire ${isYearValidated ? 'validée' : 'non validée'}`}
          value={isYearValidated}
          aria-label={`Année scolaire validée : ${isYearValidated ? 'Oui' : 'Non'}`}
        />
      </div>
      <div
        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
        role="group"
        aria-label="Moyennes par matière"
      >
        <ChartCard
          title={'Moyennes des matières en fonction des coefficients'}
          aria-label={'Moyennes des matières en fonction des coefficients'}
        >
          <CorrelationChart data={mergedMatieresAverages} />
        </ChartCard>
        <ChartCard
          title={'Moyennes par matière'}
          aria-label={'Moyennes par matière'}
          className="col-span-2"
        >
          <RadarMeansMatieres mergedData={mergedMatieresAverages} />
        </ChartCard>
      </div>
      <div
        className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5"
        role="group"
        aria-label="Moyennes par compétence"
      >
        {competences.map((competence) => {
          const currentAverage =
            competenceAverages.find((ca) => ca.id === competence.id)?.average ||
            0;
          const previousAverage =
            oldCompetenceAverages.find((ca) => ca.id === competence.id)
              ?.average || 0;

          return (
            <StatsCard
              key={competence.id}
              description={competence.name}
              value={currentAverage}
              oldValue={previousAverage}
              aria-label={`${competence.name} : moyenne actuelle ${currentAverage.toFixed(2)}, précédente ${previousAverage.toFixed(2)}`}
            />
          );
        })}
      </div>
      <DataTable columns={columns} data={evaluations} />
    </main>
  );
}

export default MainStats;
