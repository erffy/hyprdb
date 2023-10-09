export default function set(object: Record<string, any>, path: string, value?: any): Record<string, any> {
  if (typeof object != 'object') throw new TypeError('\'object\' is not object.');
  if (typeof path != 'string') throw new TypeError('\'path\' is not string.');

  const keys: Array<string> = path.split('.');

  for (let index: number = 0; index < (keys.length - 1); index++) {
    const key: string = keys[index];

    if (!object.hasOwnProperty(key)) object[key] = {};

    object = object[key];
  };

  object[keys[keys.length - 1]] = value;

  return object;
};