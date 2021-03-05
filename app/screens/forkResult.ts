import React from "react";
import { UseQueryResult, UseMutationResult } from "react-query";

const isEmpty = (value: any) =>
  !value || (typeof value.length !== "undefined" && value.length === 0);

const noop = (...args: any) => null;

interface Forks<T> {
  error?: (error: string, ...rest: any) => React.ReactNode;
  data: (data: T, ...rest: any) => React.ReactNode;
  loading?: (...rest: any) => React.ReactNode;
  empty?: (...rest: any) => React.ReactNode;
}

/**
 * A function which accepts a result and runs a given function based on the state of the result.
 */
export function forkResult<T>(
  { error = noop, data = noop, empty = noop, loading = noop }: Forks<T>,
  resultType: UseQueryResult<T, any> | UseMutationResult<T, any>,
  ...rest: any
) {
  switch (resultType.status) {
    case "success": {
      if (isEmpty(resultType.data)) {
        return empty(...rest);
      }

      return data(resultType.data as T, ...rest);
    }
    case "error": {
      return error(resultType.error, ...rest);
    }
    case "loading": {
      return loading(...rest);
    }
  }
}
