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
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: new URLSearchParams({ username, password }).toString(),
  });

  // Mettre en cache dans le localStorage
  return result.json().then((data) => {
    // si la date n'est pas la même que celle d'aujourd'hui
    const old_data: ApiData = JSON.parse(localStorage.getItem('data') ?? '');
    if (localStorage.getItem('date') !== new Date().toDateString()) {
      localStorage.setItem('data', JSON.stringify(data));
      localStorage.setItem('date', new Date().toDateString());
    }
    return { old_data, data };
  });
}
