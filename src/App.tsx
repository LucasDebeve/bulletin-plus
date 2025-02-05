import './App.css';
import Header from '@/components/layout/Header.tsx';
import { ThemeProvider } from '@/components/theme-provider.tsx';
import MainStats from '@/views/MainStats.tsx';
import { Toaster } from '@/components/ui/sonner';
import { useMemo } from 'react';
import { useAuth } from '@/hooks/use-auth.ts';
import { useNotes } from '@/hooks/use-notes.ts';
import {
  calculateCompetenceAverages,
  getIntranetAverage,
  getMatieresAverages,
  listEvaluations,
  mergeEvaluationsData,
  removeDoublonsMatieresAverages,
} from '@/lib/utils.ts';

function App() {
  const { credentials } = useAuth();

  // eslint-disable-next-line prefer-const
  let { data: notesData, isLoading, error } = useNotes(credentials);

  // Par défaut, on récupère les données du localStorage
  if (!notesData) {
    const data = localStorage.getItem('data');
    const date = localStorage.getItem('date');
    if (data && date === new Date().toDateString()) {
      console.log('On récupère la donnée du localStorage');
      const tmpData = JSON.parse(data);
      notesData = {
        data: tmpData,
        old_data: tmpData,
      };
    }
  }

  const setDataToLocalStorage = () => {
    console.log('On sauvegarde la donnée dans le localStorage');
    localStorage.setItem('data', JSON.stringify(notesData?.data || []));
    localStorage.setItem('date', new Date().toDateString());
  };

  const {
    evaluations,
    oldEvaluations,
    competences,
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

    console.log('UseMemo');

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

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Header setDataToLocalStorage={setDataToLocalStorage} />
      <MainStats
        evaluations={evaluations}
        oldEvaluations={oldEvaluations}
        competences={competences}
        mergedMatieresAverages={mergedMatieresAverages}
        competenceAverages={competenceAverages}
        oldCompetenceAverages={oldCompetenceAverages}
        generalAverage={generalAverage}
        oldGeneralAverage={oldGeneralAverage}
        intranetAverage={intranetAverage}
        oldIntranetAverage={oldIntranetAverage}
        isYearValidated={isYearValidated}
        isLoading={isLoading}
        error={error}
      />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
