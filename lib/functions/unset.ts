export default function unset(object: Record<string, any>, path: string): boolean {
  if (typeof object != 'object') throw new TypeError('\'object\' is not object.');
  if (typeof path != 'string') throw new TypeError('\'path\' is not string.');

  const keys: Array<string> = path.split('.');

  for (let index: number = 0; index < (keys.length - 1); index++) {
    const key: string = keys[index];

    if (!object.hasOwnProperty(key)) return false;

    object = object[key];
  };

  delete object[keys[keys.length - 1]];

  return true;
};