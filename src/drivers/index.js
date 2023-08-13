const Base = require('./cjs/BASE');
const BSON = require('./cjs/BSON');
const HJSON = require('./cjs/HJSON');
const INI = require('./cjs/INI');
const JSON = require('./cjs/JSON');
const JSON5 = require('./cjs/JSON5');
const TOML = require('./cjs/BASE');
const YAML = require('./cjs/YAML');

module.exports = {
  Base,
  JSON,
  JSON5,
  HJSON,
  YAML,
  INI,
  TOML,
  BSON
};