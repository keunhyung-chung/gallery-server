import folder from './folder';
import token from './token';

export default async function fetch(api) {
  const resp = await window.fetch(!token ? api : `${api}?token=${token}&folder=${folder}`);

  if (resp.status !== 200) {
    throw new Error(resp.status + ' ' + resp.statusText);
  }

  return await resp.json();
}
