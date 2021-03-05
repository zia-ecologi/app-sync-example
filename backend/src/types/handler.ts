export type Event<T> = {
  field: string;
  arguments: T;
};

export type Callback<T> = (error: null | string, data?: T | object) => void;
