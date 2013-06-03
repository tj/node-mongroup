
var assert = require('assert');
var Group = require('..');
var parse = Group.parseConfig;

var conf = parse('foo = bar');
assert(conf.processes.foo == 'bar')

var conf = parse('foo = bar\nbar=DEBUG=* baz');
assert(conf.processes.foo == 'bar')
assert(conf.processes.bar == 'DEBUG=* baz');
