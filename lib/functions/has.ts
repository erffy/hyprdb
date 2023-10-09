export default function has(object: Record<string, any>, path: string): boolean {
  if (typeof object != 'object') throw new TypeError('\'object\' is not object.');
  if (typeof path != 'string') throw new TypeError('\'path\' is not string.');

  const keys: Array<string> = path.split('.');

  for (const key of keys) {
    if (object.hasOwnProperty(key)) object = object[key];
    else return false;
  };

  return true;
};