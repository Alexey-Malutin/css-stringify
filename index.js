
/**
 * Module dependencies.
 */

var Compressed;
var Identity;

var inBrowser = !!(this || (0,eval)('this')).document;
if(inBrowser){
  //in browser
  define(['./lib/compress.js', './lib/identity.js'], function(compress, identity){
    Compressed = compress;
    Identity = identity;
    return cssStringify
  });
} else {
  //in NodeJs
  Compressed = require('./lib/compress');
  Identity = require('./lib/identity');
  module.exports = cssStringify;
}

/**
 * Stringfy the given AST `node`.
 *
 * Options:
 *
 *  - `compress` space-optimized output
 *  - `sourcemap` return an object with `.code` and `.map`
 *
 * @param {Object} node
 * @param {Object} [options]
 * @return {String}
 * @api public
 */

var cssStringify = function(node, options){
  options = options || {};

  var compiler = options.compress
    ? new Compressed(options)
    : new Identity(options);

  // source maps
  if (options.sourcemap && !inBrowser) {
    var sourcemaps = require('./lib/source-map-support');
    sourcemaps(compiler);

    var code = compiler.compile(node);
    return { code: code, map: compiler.map.toJSON() };
  }

  var code = compiler.compile(node);
  return code;
};
