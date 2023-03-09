export type ApiError = {
  result: 'error';
  errors: {
    id: string;
    status: number;
    title: string;
    detail: string;
  }[];
};
