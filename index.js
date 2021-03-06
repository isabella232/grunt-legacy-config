/*!
 * grunt <http://gruntjs.com/>
 *
 * Copyright (c) 2013-2015 "Cowboy" Ben Alman.
 * Licensed under the MIT license.
 */

'use strict';

var grunt = require('grunt');

/**
 * Get/set config data. If value was passed, set. Otherwise, get.
 *
 * ```js
 * config([prop [, value]]);
 * ```
 * @name config
 * @param  {String} `prop`
 * @param  {*} `value`
 * @return {String}
 * @api public
 */

var config = module.exports = function(prop, value) {
  if (arguments.length === 2) {
    // Two arguments were passed, set the property's value.
    return config.set(prop, value);
  } else {
    // Get the property's value (or the entire data object).
    return config.get(prop);
  }
};

/**
 * The actual `config.data` object.
 */

config.data = {};

/**
 * Escape any `.` in the given `propString` with `\.` This should be used for
 * property names that contain dots.
 *
 * ```js
 * config.escape('foo.js');
 * //=> 'foo\.js'
 * ```
 * @param  {String} `str` String with `.`s to escape
 * @return {String}
 * @api public
 */

config.escape = function(str) {
  return str.replace(/\./g, '\\.');
};

/**
 * Return prop as a string. If an array is passed, a dot-notated
 * string will be returned.
 *
 * ```js
 * config.getPropString(['a', 'b']);
 * //=> 'a.b'
 * ```
 *
 * @param  {String|Array} `prop`
 * @return {String}
 * @api public
 */

config.getPropString = function(prop) {
  return Array.isArray(prop) ? prop.map(config.escape).join('.') : prop;
};

/**
 * Get a raw value from the project's Grunt configuration,
 * without processing `<% %>` template strings.
 *
 * ```js
 * config.getRaw([prop]);
 * ```
 * @param  {String} `prop` The name of the property to get.
 * @return {*} Returns the value of the given property.
 * @api public
 */

config.getRaw = function(prop) {
  if (prop) {
    // Prop was passed, get that specific property's value.
    return grunt.util.namespace.get(config.data, config.getPropString(prop));
  } else {
    // No prop was passed, return the entire config.data object.
    return config.data;
  }
};

/**
 * Match `<%= FOO %>` where FOO is a propString,
 * eg. `foo` or `foo.bar` but not a method call like
 * `foo()` or `foo.bar()`.
 */

var propStringTmplRe = /^<%=\s*([a-z0-9_$]+(?:\.[a-z0-9_$]+)*)\s*%>$/i;

/**
 * Get a value from the project's Grunt configuration, recursively
 * processing templates.
 *
 * ```js
 * config.set('a', 'b');
 * var foo = config.get('a');
 * //=> 'b'
 * ```
 * @param  {String} `prop`
 * @return {*} Returns the value of `prop`
 * @api public
 */

config.get = function(prop) {
  return config.process(config.getRaw(prop));
};

/**
 * Expand a config value recursively. Used for post-processing
 * raw values already retrieved from the config.
 *
 * ```js
 * config.set('a', 'b');
 * config.set('x', 'z');
 *
 * var foo = config.process('<%= a %>');
 * //=> 'b'
 * var bar = config.process(['<%= a %>', '<%= x %>']);
 * //=> ['a', 'z']
 * ```
 * @param  {String} `str`
 * @return {*} Resolved config values.
 * @api public
 */

config.process = function(raw) {
  return grunt.util.recurse(raw, function(value) {
    // If the value is not a string, return it.
    if (typeof value !== 'string') { return value; }
    // If possible, access the specified property via config.get, in case it
    // doesn't refer to a string, but instead refers to an object or array.
    var matches = value.match(propStringTmplRe);
    var result;
    if (matches) {
      result = config.get(matches[1]);
      // If the result retrieved from the config data wasn't null or undefined,
      // return it.
      if (result != null) { return result; }
    }
    // Process the string as a template.
    return grunt.template.process(value, {data: config.data});
  });
};

/**
 * Set a value onto the project's Grunt configuration.
 *
 * ```js
 * config.set(prop, value);
 * ```
 * @param {String} `prop` The property name.
 * @param {*} `value` The value of the specified property
 * @api public
 */

config.set = function(prop, value) {
  return grunt.util.namespace.set(config.data, config.getPropString(prop), value);
};

/**
 * Recursively merge properties of the specified `configObject`
 * into the current project configuration.
 *
 * ```js
 * config.init({
 *   jshint: {
 *     src: ['*.js']
 *   }
 * });
 *
 * // merge the following properties from the `jshint` object onto
 * // the `jshint` object in the above config
 * config.merge({
 *   jshint: {
 *     options: {...}
 *   }
 * });
 * ```
 * @param  {Object} `obj` The object to merge onto the project config.
 * @return {Object} Returns `config.data`
 * @api public
 */

config.merge = function(obj) {
  grunt.util._.merge(config.data, obj);
  return config.data;
};

/**
 * Initialize a configuration object. The specified `configObject`
 * is used by tasks and can be accessed using the grunt.config method.
 *
 * Nearly every project's `Gruntfile.js` will call this method.
 *
 * ```js
 * config.init(configObject);
 * ```
 * @param  {Object} `obj` The object to initialize.
 * @return {Object}
 */

config.init = function(obj) {
  grunt.verbose.write('Initializing config...').ok();
  // Initialize and return data.
  return (config.data = obj || {});
};

/**
 * Test to see if required config params have been defined. If not,
 * throw an exception (use this inside of a task). One or more
 * config property names may be specified.
 *
 * ```js
 * config.requires(prop [, prop [, ...]]);
 * ```
 * @param  {String|Array} `props` Property name as a string or array of property names.
 * @return {*}
 * @api public
 */

config.requires = function() {
  var p = grunt.util.pluralize;
  var props = grunt.util.toArray(arguments).map(config.getPropString);
  var msg = 'Verifying propert' + p(props.length, 'y/ies') +
    ' ' + grunt.log.wordlist(props) + ' exist' + p(props.length, 's') +
    ' in config...';
  grunt.verbose.write(msg);
  var failProps = config.data && props.filter(function(prop) {
    return config.get(prop) == null;
  }).map(function(prop) {
    return '"' + prop + '"';
  });
  if (config.data && failProps.length === 0) {
    grunt.verbose.ok();
    return true;
  } else {
    grunt.verbose.or.write(msg);
    grunt.log.error().error('Unable to process task.');
    if (!config.data) {
      throw grunt.util.error('Unable to load config.');
    } else {
      throw grunt.util.error('Required config propert' +
        p(failProps.length, 'y/ies') + ' ' + failProps.join(', ') + ' missing.');
    }
  }
};
