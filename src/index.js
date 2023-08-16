const kleur = require('kleur');

const Database = require('./database/Database');

module.exports = Database;
module.exports.Database = Database;
module.exports.Drivers = Database.Drivers;

let notified = false;
const checkUpdates = async () => {
  if (notified) return null;

  const __module = await (await fetch('https://registry.npmjs.org/hypr.db')).json();

  const latest = __module['dist-tags'].latest;
  const current = '5.1.8';
  
  if (current === latest) return true;

  const __latest = latest.split('.');
  const __current = current.split('.');

  const latestMajor = __latest[0];
  const latestMinor = __latest[1];
  const latestPatch = __latest[2];
  const latestBuild = __latest[3];

  const currentMajor = __current[0];
  const currentMinor = __current[1];
  const currentPatch = __current[2];
  const currentBuild = __current[3];

  let message = `New update available: ${kleur.white(current)} > ${kleur.white(latest)}`;

  if (currentMajor != latestMajor) message = `New ${kleur.red('Major')} version available: ${kleur.red(current)} > ${kleur.red(latest)}`;
  else if (currentMinor != latestMinor) message = `New ${kleur.yellow('Minor')} version available: ${kleur.red(current)} > ${kleur.yellow(latest)}`;
  else if (currentPatch != latestPatch) message = `New ${kleur.blue('Patch')} version available: ${kleur.red(current)} > ${kleur.blue(latest)}`;
  
  if (latestBuild && (currentBuild != latestBuild)) message = `New ${kleur.green('Build')} version available: ${kleur.green(current)} > ${kleur.green(latest)}`;

  notified = true;

  return console.info(`[hypr.db] ${message}`);
};

checkUpdates();