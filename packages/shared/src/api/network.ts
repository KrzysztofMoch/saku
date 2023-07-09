import axios from 'axios';

const network = axios.create({
  baseURL: 'https://api.mangadex.org',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

const get = async <Response, ErrorResponse = Response>(
  url: string,
): Promise<Response | ErrorResponse | undefined> => {
  try {
    const { data } = await network.get<Response>(url);
    return data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return err.response?.data as ErrorResponse;
    } else {
      console.error('[API] Unexpected error', err);
      return undefined;
    }
  }
};

export { get, network };
