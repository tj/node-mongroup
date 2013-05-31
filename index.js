
/**
 * Module dependencies.
 */

var Group = require('./lib/group');

/**
 * Expose `Group`.
 */

exports = module.exports = Group;

/**
 * Parse configuration `str`.
 *
 * @param {String} str
 * @return {Object}
 * @api public
 */

exports.parseConfig = function(str){
  var conf = {};
  conf.processes = {};

  str.split(/\r?\n/).forEach(function(line){
    if ('' == line.trim()) return;
    if (/^ *#/.test(line)) return;

    var parts = line.split(/ *= */);
    var key = parts.shift();
    var val = parts.shift();

    switch (key) {
      case 'logs':
      case 'pids':
        conf[key] = val;
        break;
      default:
        conf.processes[key] = val;
    }
  });

  return conf;
};
