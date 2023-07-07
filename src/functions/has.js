module.exports = function (obj, path) {
  if (typeof obj !== 'object') throw new TypeError(`'${obj}' is not Object.`);
  if (typeof path !== 'string') throw new TypeError(`'${path}' is not String.`);

  const keys = path.split('.');

  let __object = obj;
  for (let index = 0; index < keys.length; index++) {
    const key = keys[index];

    if (__object[key]) __object = __object[key];
    else return false;
  };

  return true;
};