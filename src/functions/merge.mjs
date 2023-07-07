export default function merge(obj, source) {
  if (typeof obj !== 'object') throw new TypeError(`'${obj}' is not Object.`);
  if (typeof source !== 'object') throw new TypeError(`'${source}' is not Object.`);

  for (const key in source) {
    if (typeof source[key] === 'object' && typeof obj[key] === 'object') merge(obj[key], source[key]);
    else obj[key] = source[key];
  };

  return obj;
};