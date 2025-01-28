import { ApiData } from "../types/notes.ts";

export async function fetchNotes(username: string, password: string): Promise<ApiData> {
    const result = await fetch(import.meta.env.VITE_API_URL + "/notes", {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: new URLSearchParams({ username, password }).toString(),
    });
    return await result.json();
}