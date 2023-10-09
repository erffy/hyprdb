export default function get(object: Record<string, any>, path: string): Record<string, any> | undefined {
  if (typeof object != 'object') throw new TypeError('\'object\' is not object.');
  if (typeof path != 'string') throw new TypeError('\'path\' is not string.');

  const keys: Array<string> = path.split('.');

  for (const key of keys) {
    if (object.hasOwnProperty(key)) object = object[key];
    else return undefined;
  };

  return object;
};