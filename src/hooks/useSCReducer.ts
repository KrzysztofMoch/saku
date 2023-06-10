import { useReducer } from 'react';

type SetAction<T> = {
  [K in keyof T]: {
    type: `set${Capitalize<string & K>}`;
    payload: T[K];
  };
}[keyof T];

type ClearAction<T> = {
  [K in keyof T]: {
    type: `clear${Capitalize<string & K>}`;
    payload?: undefined;
  };
}[keyof T];

export type Action<T> =
  | SetAction<T>
  | ClearAction<T>
  | { type: 'clearAll'; payload?: undefined }
  | { type: 'setState'; payload: T };

const useSCReducer = <T>(initialState: T) => {
  return useReducer((state: T, { type, payload }: Action<T>) => {
    if (type === 'clearAll') {
      return initialState;
    }

    if (type === 'setState') {
      return payload as T;
    }

    if (type.startsWith('set')) {
      const key = type.slice(3) as keyof T;
      return {
        ...state,
        [key.toString().toLowerCase()]: payload,
      };
    }

    if (type.startsWith('clear')) {
      const key = type.slice(5) as keyof T;
      return {
        ...state,
        [key.toString().toLowerCase()]: undefined,
      };
    }

    throw new Error('Unknown action type');
  }, initialState);
};

export { useSCReducer };
