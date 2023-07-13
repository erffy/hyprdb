import { writeFileSync } from 'node:fs';

import DatabaseError from './DatabaseError.mjs';

export default class Transaction {
  /**
   * Create new Logging.
   * @param {string} path
   * @constructor
   */
  constructor(path, name, extension) {
    path ??= process.cwd();
    name ??= 'transaction-history';
    extension ??= '.txt';

    if (typeof path !== 'string') (new DatabaseError(`'${path}' is not String.`, { name: 'TransactionTypeError' })).throw();
    if (typeof name !== 'string') (new DatabaseError(`'${name}' is not String.`, { name: 'TransactionTypeError' })).throw();
    if (typeof extension !== 'string') (new DatabaseError(`'${extension}' is not String.`, { name: 'TransactionTypeError' })).throw();

    /**
     * @type string
     * @readonly
     * @protected
     */
    this.path = path;

    path += name;
    if (!path.endsWith(extension)) path += extension;

    const __path = path.substring(0, path.lastIndexOf('/'));
    if (!fs.existsSync(__path)) fs.mkdirSync(__path, { recursive: true });
  };

  /**
   * Save log.
   * @param {string} _case 
   * @param {?string} message 
   * @returns {void}
   */
  save(_case, message = null) {
    if (typeof _case !== 'string') (new DatabaseError(`'${_case}' is not String.`, { name: 'TransactionTypeError' })).throw();

    const date = new Date();

    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();

    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    if (month < 10) month = `0${month}`;
    if (day < 10) day = `0${day}`;
    if (hour < 10) hour = `0${hour}`;
    if (minute < 10) minute = `0${minute}`;
    if (second < 10) second = `0${second}`;

    _case = _case.toUpperCase();

    const schema = `> [${_case}]: ${month}/${day}/${year} - ${hour}:${minute}:${second}\n- ${message ?? 'No message specified.'}\n\n`;
    writeFileSync(this.path, schema, { encoding: 'utf8', flag: 'a+' });

    return void 0;
  };
};