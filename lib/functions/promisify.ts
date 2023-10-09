type Result<T> = (...args: Array<any>) => Promise<T>;

export default function promisify<T = any>(fn: (...args: Array<any>) => any): Result<T> {
  function _promisify(...args: Parameters<typeof fn.arguments>): Promise<T> {
    const promise: Promise<T> = new Promise((resolve, reject) => {
      try {
        resolve(fn(...args));
      } catch (error: unknown) {
        reject(error);
      };
    });

    return promise;
  };

  return _promisify;
};