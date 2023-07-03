const Database = require('./dist/Database');

const YAMLProvider = require('./dist/providers/YAML');
const JSONProvider = require('./dist/providers/JSON');
const BSONProvider = require('./dist/providers/BSON');

module.exports = {
  Database,
  YAMLProvider,
  JSONProvider,
  BSONProvider
};