export default function (obj, path) {
  if (typeof obj !== 'object') throw new TypeError(`'${obj}' is not Object.`);
  if (typeof path !== 'string') throw new TypeError(`'${path}' is not String.`);

  const keys = path.split('.');

  let __object = obj;
  for (let index = 0; index < (keys.length - 1); index++) {
    const key = keys[index];

    if (!__object[key]) return false;

    __object = __object[key];
  };

  const lastKey = keys[keys.length - 1];
  delete __object[lastKey];

  return true;
};