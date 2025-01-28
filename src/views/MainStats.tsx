import StatsCard from "@/components/stats/StatsCard.tsx";
import {fetchNotes} from "@/lib/api.ts";
import {useEffect, useState} from "react";
import {DataTable} from "@/components/notes/data-table.tsx";
import {columns} from "@/components/notes/columns.tsx";
import {Competence, Matiere, MatiereEvaluee} from "@/types/notes.ts";
import {listEvaluations} from "@/lib/utils.ts";
import {EvaluationComplete} from "@/types/notes";

function MainStats() {
    const [matieres, setMatieres] = useState([] as Matiere[]);
    const [matieresEvaluees, setMatieresEvaluees] = useState([] as MatiereEvaluee[]);
    const [competences, setCompetences] = useState([] as Competence[]);

    const [evaluations, setEvaluations] = useState([] as EvaluationComplete[]);

    useEffect(() => {
        fetchNotes(
            import.meta.env.VITE_API_USERNAME as string,
            import.meta.env.VITE_API_PASSWORD as string
        ).then(data => {
            setMatieresEvaluees(data[0]);
            setCompetences(data[1]);
            setMatieres(data[2]);
            // Use matieresEvaluees, competences, matieres as needed
            setEvaluations(listEvaluations(data[0]));
        });
    }, []);
    return (
        <main className={"py-4"}>
            <div className={"grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4"}>
                <StatsCard description={"Nombres de notes"} value={0}/>
                <StatsCard description={"Moyenne générale"} value={16.5} oldValue={16.49}/>
            </div>
            <DataTable columns={columns} data={evaluations}></DataTable>
            <div>
                {JSON.stringify(matieres)}
            </div>
            <div>
                {JSON.stringify(matieresEvaluees)}
            </div>
            <div>
                {JSON.stringify(competences)}
            </div>
        </main>
    );
}

export default MainStats;