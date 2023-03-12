import { create } from 'apisauce';

const network = create({
  baseURL: 'https://api.mangadex.org',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export { network };
