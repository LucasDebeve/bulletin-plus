type Evaluation = {
  note: number;
  coefficient: number;
};

export type MatiereEvaluee = {
  evaluations: Evaluation[];
  matiere: string;
};

export type Competence = {
  id: number;
  name: string;
};

export type Coef = {
  ue: number;
  coef: number;
};

export type Matiere = {
  coefs: Coef[];
  matiere: string;
};

export type ApiData = [MatiereEvaluee[], Competence[], Matiere[]];

export type EvaluationComplete = {
  note: number;
  coefficient: number;
  matiere: Matiere;
};

export type MatiereAverage = {
  matiere: Matiere;
  average: number;
};

export type MatiereCompleteForOneCompetence = {
  matiere: string;
  average: number;
  coef: number;
  ue: number;
};
