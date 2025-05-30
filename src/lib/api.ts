import { ApiData } from '../types/notes.ts';

export async function fetchNotes(
  username: string,
  password: string
): Promise<{ old_data: ApiData; data: ApiData }> {
  const result = await fetch(import.meta.env.VITE_API_URL + '/notes', {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
      'Permissions-Policy': 'interest-cohort=()',
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: new URLSearchParams({ username, password }).toString(),
  });

  // Mettre en cache dans le localStorage
  return result.json().then((data: ApiData) => {
    // si la date n'est pas la même que celle d'aujours'hui
    let old_data: ApiData | [] = JSON.parse(
      localStorage.getItem('data') || '[]'
    );

    if (old_data.length === 0) {
      old_data = [[], [], []] as ApiData;
    }

    return { old_data, data };

    // if (old_data.length === 0) {
    //   return { old_data: data, data };
    // } else {
    //   return { old_data, data };
    // }
  });
}
