# grunt-legacy-config [![NPM version](https://badge.fury.io/js/grunt-legacy-config.svg)](http://badge.fury.io/js/grunt-legacy-config) [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

> Grunt's config methods, as a standalone library.

## Heads up!

This is not ready for use yet! We'll update the readme when it's ready to go, feel free to star the project if you want updates in the meantime!

## Install

Install with [npm](https://www.npmjs.com/)

```sh
$ npm i grunt-legacy-config --save-dev
```

## Usage

```js
var config = require('grunt-legacy-config');
```

## API

### [config](index.js#L25)

Get/set config data. If value was passed, set. Otherwise, get.

**Params**

* `prop` **{String}**
* `value` **{*}**
* `returns` **{String}**

**Example**

```js
config([prop [, value]]);
```

### [.escape](index.js#L54)

Escape any `.` in the given `propString` with `\.` This should be used for property names that contain dots.

**Params**

* `str` **{String}**: String with `.`s to escape
* `returns` **{String}**

**Example**

```js
config.escape('foo.js');
//=> 'foo\.js'
```

### [.getPropString](index.js#L72)

Return prop as a string. If an array is passed, a dot-notated string will be returned.

**Params**

* `prop` **{String|Array}**
* `returns` **{String}**

**Example**

```js
config.getPropString(['a', 'b']);
//=> 'a.b'
```

### [.getRaw](index.js#L88)

Get a raw value from the project's Grunt configuration, without processing `<% %>` template strings.

**Params**

* `prop` **{String}**: The name of the property to get.
* `returns` **{*}**: Returns the value of the given property.

**Example**

```js
config.getRaw([prop]);
```

### [.get](index.js#L120)

Get a value from the project's Grunt configuration, recursively processing templates.

**Params**

* `prop` **{String}**
* `returns` **{*}**: Returns the value of `prop`

**Example**

```js
config.set('a', 'b');
var foo = config.get('a');
//=> 'b'
```

### [.process](index.js#L142)

Expand a config value recursively. Used for post-processing raw values already retrieved from the config.

**Params**

* `str` **{String}**
* `returns` **{*}**: Resolved config values.

**Example**

```js
config.set('a', 'b');
config.set('x', 'z');

var foo = config.process('<%= a %>');
//=> 'b'
var bar = config.process(['<%= a %>', '<%= x %>']);
//=> ['a', 'z']
```

### [.set](index.js#L172)

Set a value onto the project's Grunt configuration.

**Params**

* `prop` **{String}**: The property name.
* `value` **{*}**: The value of the specified property

**Example**

```js
config.set(prop, value);
```

### [.merge](index.js#L200)

Recursively merge properties of the specified `configObject` into the current project configuration.

**Params**

* `obj` **{Object}**: The object to merge onto the project config.
* `returns` **{Object}**: Returns `config.data`

**Example**

```js
config.init({
  jshint: {
    src: ['*.js']
  }
});

// merge the following properties from the `jshint` object onto
// the `jshint` object in the above config
config.merge({
  jshint: {
    options: {...}
  }
});
```

### [.requires](index.js#L237)

Test to see if required config params have been defined. If not, throw an exception (use this inside of a task). One or more config property names may be specified.

**Params**

* `props` **{String|Array}**: Property name as a string or array of property names.
* `returns` **{*}**

**Example**

```js
config.requires(prop [, prop [, ...]]);
```

## TODO

**First:**

_(loosely in this order...)_

* [x] migrate code
* [x] migrate tests
* [x] get tests passing with 100% parity
* [x] add Grunfile
* [ ] coverage reports
* [x] API documentation, written as code comments
* [ ] Add links to website docs for any methods that have more info
* [ ] Add the event to the changelogs of both libraries

**Next:**

* [ ] replace core `grunt.config` internal module with `grunt-legacy-config`
* [ ] remove any dependencies that are no longer needed from grunt.
* [ ] enable travis
* [ ] add travis badge

## Related projects

* [grunt](http://gruntjs.com/): The JavaScript Task Runner
* [grunt-cli](http://gruntjs.com/): The grunt command line interface.
* [grunt-legacy-log](http://gruntjs.com/): The Grunt 0.4.x logger.
* [grunt-legacy-util](http://gruntjs.com/): Some old grunt utils provided for backwards compatibility.

## Running tests

Install dev dependencies:

```sh
$ npm install -d && grunt
```

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/gruntjs/grunt-legacy-config/issues/new)

## Author

**"Cowboy" Ben Alman**

+ [github/cowboy](https://github.com/cowboy)
* [twitter/cowboy](http://twitter.com/cowboy)

## License

Copyright (c) 2015 "Cowboy" Ben Alman
Released under the MIT license.

***

_This file was generated by [verb-cli](https://github.com/assemble/verb-cli) on May 14, 2015._