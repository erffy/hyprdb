export default function (obj, path) {
  if (typeof obj !== 'object') throw new TypeError(`'${obj}' is not Object.`);
  if (typeof path !== 'string') throw new TypeError(`'${path}' is not String.`);

  const keys = path.split('.');

  let __object = obj;
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    if (__object[key]) __object = __object[key];
    else return undefined;
  };

  return __object;
};