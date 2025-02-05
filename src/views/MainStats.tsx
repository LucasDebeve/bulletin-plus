import StatsCard from '@/components/stats/StatsCard';
import { DataTable } from '@/components/notes/data-table';
import { columns } from '@/components/notes/columns';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import BoolCard from '@/components/stats/BoolCard.tsx';
import RadarMeansMatieres from '@/components/charts/RadarMeansMatieres.tsx';
import ChartCard from '@/components/stats/ChartCard.tsx';
import CorrelationChart from '@/components/charts/CorrelationChart.tsx';
import {
  Competence,
  EvaluationComplete,
  MergedMatieresAverage,
} from '@/types/notes';

type MainStatsProps = {
  isLoading: boolean;
  error: {
    message: string;
  } | null;
  evaluations: EvaluationComplete[];
  oldEvaluations: EvaluationComplete[];
  generalAverage: number;
  oldGeneralAverage: number;
  intranetAverage: number;
  oldIntranetAverage: number;
  isYearValidated: boolean;
  mergedMatieresAverages: MergedMatieresAverage[];
  competences: Competence[];
  competenceAverages: CompetenceAverage[];
  oldCompetenceAverages: CompetenceAverage[];
};

function MainStats({
  isLoading,
  error,
  evaluations,
  oldEvaluations,
  generalAverage,
  oldGeneralAverage,
  intranetAverage,
  oldIntranetAverage,
  isYearValidated,
  mergedMatieresAverages,
  competences,
  competenceAverages,
  oldCompetenceAverages,
}: MainStatsProps) {
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
    <main className="pt-16 pb-4 space-y-4">
      <div
        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 print:grid-cols-2"
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
          description={`Semestre ${isYearValidated ? 'validé' : 'non validé'}`}
          value={isYearValidated}
          aria-label={`Semestre validée : ${isYearValidated ? 'Oui' : 'Non'}`}
        />
      </div>
      <div
        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 print:grid-cols-2"
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
          className="col-span-1 lg:col-span-2 print:col-span-1"
        >
          <RadarMeansMatieres mergedData={mergedMatieresAverages} />
        </ChartCard>
      </div>
      <div
        className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5"
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
      <div className={'pt-10'}>
        <hr className={'pb-3'} />
        <h1 className={'text-2xl font-semibold'}>Détails des notes</h1>
      </div>

      <DataTable columns={columns} data={evaluations} />
    </main>
  );
}

export default MainStats;
