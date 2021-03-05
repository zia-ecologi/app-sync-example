import { Callback, Event } from "../types";

export function handlerFn<T, T2>(promiseFn: (event: Event<T>) => Promise<T2>) {
  return (event: Event<T>, callback: Callback<T2>) => {
    (async function () {
      try {
        const result = await promiseFn(event);
        callback(null, result);
      } catch (error) {
        callback(null, {
          error_message: error.message,
          error_type: "handlerError",
          error_data: error,
        });
      }
    })();
  };
}
