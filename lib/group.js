
/**
 * Module dependencies.
 */

var Emitter = require('events').EventEmitter;
var Process = require('./process');
var Batch = require('batch');

/**
 * Expose `Group`.
 */

module.exports = Group;

/**
 * Initialize a `Group` with the given `conf`.
 *
 * @param {Object} conf
 * @api public
 */

function Group(conf) {
  this.conf = conf;
  this.procs = this.processes();
}

/**
 * Inherit from `Emitter.prototype`.
 */

Group.prototype.__proto__ = Emitter.prototype;

/**
 * Return hydrated `Process`es.
 *
 * @return {Array}
 * @api private
 */

Group.prototype.processes = function(){
  var self = this;
  var procs = this.conf.processes;
  return Object.keys(procs).map(function(key){
    return new Process(self, key, procs[key]);
  });
};

/**
 * Return procs filtered by `names`.
 *
 * @param {Array} names
 * @return {Array}
 * @api private
 */

Group.prototype.find = function(names){
  if (!names.length) return this.procs;
  return this.procs.filter(byName(names));
};

/**
 * Start process `names` and invoke `fn(err)`.
 *
 * @param {Array} names
 * @param {Function} fn
 * @api public
 */

Group.prototype.start = function(names, fn){
  var batch = new Batch;
  var self = this;

  this.find(names).forEach(function(proc){
    batch.push(function(done){
      if (proc.alive()) return done();
      proc.start(function(err){
        if (err) return done(err);
        self.emit('start', proc);
        done();
      });
    });
  });

  batch.end(fn);
};

/**
 * Stop process `names` and invoke `fn(err)`.
 *
 * @param {Array} names
 * @param {String} sig
 * @param {Function} fn
 * @api public
 */

Group.prototype.stop = function(names, sig, fn){
  var batch = new Batch;
  var self = this;

  this.find(names).forEach(function(proc){
    batch.push(function(done){
      if (!proc.alive()) return done();
      self.emit('stopping', proc);
      proc.stop(sig, function(err){
        if (err) return done(err);
        self.emit('stop', proc);
        done();
      });
    });
  });

  batch.end(fn);
};

/**
 * Filter by names.
 */

function byName(names) {
  return function(proc){
    return ~names.indexOf(proc.name);
  }
}
