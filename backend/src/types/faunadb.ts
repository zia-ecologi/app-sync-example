export type FaunaResult<T> = {
  ref: {
    id: string;
  };
  data: T;
};

export type FaunaListResult<T> = {
  data: FaunaResult<T>[];
};
