'use strict';

const _ = require('lodash');
const gutil = require('gulp-util');
const jsdom = require('jsdom').jsdom;
const fs = require('fs');
const path = require('path');
const through = require('through2');
const vfs = require('vinyl-fs');
const vm = require('vm');

const mockModule = {
  provider: moduleNoop,
  factory: moduleNoop,
  service: moduleNoop,
  value: moduleNoop,
  constant: moduleNoop,
  decorator: moduleNoop,
  animation: moduleNoop,
  filter: moduleNoop,
  controller: moduleNoop,
  directive: moduleNoop,
  component: moduleNoop,
  config: moduleNoop,
  run: moduleNoop
};

const mockAngular = {
  extend: _.extend,
  merge: _.merge,
  equals: _.isEqual,
  forEach: _.forEach,
  noop: _.noop,
  bind: _.bind,
  toJson: JSON.stringify,
  fromJson: JSON.parse,
  identity: _.identity,
  isUndefined: _.isUndefined,
  isDefined: (value) => !_.isUndefined(value),
  isString: _.isString,
  isFunction: _.isFunction,
  isObject: _.isObject,
  isNumber: _.isNumber,
  isElement: _.isElement,
  isArray: _.isArray,
  verion: {full: '', major: 0, minor: 0, done: 0, codeName: ''},
  isDate: _.isDate,
  lowercase: _.toLower,
  uppercase: _.toUpper,
  getTestability: _.noop,
  callbacks: {counter: 0},
  '$$minErr': _.noop,
  '$$csp': () => true,
  reloadWithDebugInfo: _.noop,
  element: function() {return {ready: _.noop};}
};

function moduleNoop() {
  return mockModule;
}

const doc = jsdom('<html><body></body></html>');
const sandbox = {
  angular: mockAngular,
  window: doc.defaultView,
  document: doc,
  Node: doc.defaultView.Node,
  setTimeout: doc.defaultView.setTimeout
};
sandbox.window.angular = mockAngular;

class NgApps {
  constructor() {
    this.mods = {};
  }

  addModule(name, deps, label, filepath) {
    if (this.mods[name] && this.mods[name].defFile) {
      throw new Error('Duplicate Angular module defined: ' + name);
    }

    if (!this.mods[name]) {
      this.mods[name] = {
        name: name,
        files: [],
        children: [],
        parents: []
      };
    }

    let newMod = this.mods[name];
    newMod.defFile = filepath;
    newMod.deps = deps;
    newMod.label = label;

    for (let modName in this.mods) {
      let mod = this.mods[modName];
      if (mod.deps && mod.deps.indexOf(name) >= 0) {
        mod.children.push(newMod.name);
        newMod.parents.push(mod.name);
      }
    }

    newMod.deps.forEach(depName => {
      if (this.mods[depName]) {
        this.mods[depName].parents.push(newMod.name);
        newMod.children.push(this.mods[depName].name);
      }
    });
  }

  addFile(modName, filepath) {
    if (!this.mods[modName]) {
      this.mods[modName] = {
        name: modName,
        files: [],
        children: [],
        parents: []
      };
    }

    this.mods[modName].files.push(filepath);
  }

  getModule(name) {
    return this.mods[name];
  }

  hasModule(name) {
    return this.mods[name] !== undefined;
  }

  circularDependencyCheck() {
    for (let modName in this.mods) {
      let mod = this.mods[modName];
      let parents = mod.parents.map(parent => parent);
      while (parents.length > 0) {
        let parent = this.mods[parents.shift()];
        if (parent.name === mod.name) {
          throw new Error('Circular Dependency on ' + mod.name);
        }

        Array.prototype.push.apply(parents, parent.parents);
      }
    }
  }

  missingDependencyCheck() {
    let check = dep => {
      if (!this.hasModule(dep) || this.mods[dep].defFile === undefined) {
        throw new Error('Missing Module: ' + dep);
      }
    };

    for (let modName in this.mods) {
      this.mods[modName].deps.forEach(check);
    }
  }
}

function NgSource() {
  this.apps = new NgApps();
}

NgSource.prototype.buildDependencies = function(label) {
  if (label === undefined) {
    label = '';
  }

  return through.obj((file, enc, cb) => {
    if (path.basename(file.path) === 'bower.json') {
      return this._bowerMap(label, file, enc, cb);
    }

    return this._builder(label, file, enc, cb);
  });
};

NgSource.prototype.src = function(rootModule, label) {
  return vfs.src(this._collectSources(rootModule, label), {read: false});
};

NgSource.prototype.validateDependencies = function() {
  this.apps.circularDependencyCheck();
  this.apps.missingDependencyCheck();
};

NgSource.prototype._bowerMap = function(label, file, enc, cb) {
  let pack = JSON.parse(file.contents.toString());
  if (!pack.main) {
    gutil.log('Bower file does not contain \'main\' property: ', file.path);
    return cb();
  }

  if (typeof pack.main === 'object') {
    pack.main = pack.main[0];
  }

  if (path.extname(pack.main) !== '.js') {
    gutil.log('Bower main file is not javascript: ', pack.main);
    return cb();
  }

  let mainjs = path.join(path.dirname(file.path), pack.main);

  let minExt = '.min' + path.extname(mainjs);
  let min = pack.main.replace(path.extname(pack.main), minExt);
  let minPath = path.join(path.dirname(file.path), min);

  fs.stat(minPath, (err, stats) => {
    if (stats) {
      mainjs = minPath;
    }

    vfs.src(mainjs)
      .on('data', chunk => this._builder(label, chunk, enc, cb));
  });
};

NgSource.prototype._builder = function(label, file, enc, cb) {
  //Don't try to sandbox angular itself
  const filename = path.basename(file.path);
  if (filename === 'angular.min.js' || filename === 'angular.js') {
    this.apps.addModule('angular', [], label, file.path);
    this.apps.addModule('ng', ['ngLocale'], label, file.path);
    this.apps.addModule('ngLocale', [], label, file.path);
    return cb();
  }

  mockAngular.module = (name, deps) => {
    if (deps) {
      this.apps.addModule(name, deps, label, file.path);
    } else {
      this.apps.addFile(name, file.path);
    }

    return mockModule;
  };

  try {
    vm.createContext(sandbox);
    vm.runInContext(file.contents, sandbox);
  } catch (err) {
    gutil.log('Error loading module: ' + err.message);
    return cb(err);
  }

  return cb();
};

NgSource.prototype._collectSources = function(moduleName, label) {
  let sources = [];

  if (!this.apps.hasModule(moduleName)) {
    throw new Error('Missing root module: ' + moduleName);
  }
  let rootMod = this.apps.getModule(moduleName);

  let loaded = [moduleName];
  if (rootMod.label === label) {
    rootMod.files.forEach(file => {
      sources.unshift(file);
    });

    sources.unshift(rootMod.defFile);
  }
  let deps = rootMod.children.map(dep => dep);

  const addFile = (spliceIndex) => {
    return file => {
      if (sources.indexOf(file) < 0) {
        sources.splice(spliceIndex, 0, file);
      }
    };
  };

  const addDeps = dep => {
    if (loaded.indexOf(dep) < 0 && deps.indexOf(dep) < 0) {
      deps.push(dep);
    }
  };

  while (deps.length > 0) {
    let nextDep = deps.shift();
    let nextMod = this.apps.getModule(nextDep);

    if (nextMod === undefined) {
      throw new Error('Missing Angular Module: ' + nextDep + '.  Try running `npm install`');
    }

    if (nextMod.label === label) {
      let defIndex = sources.indexOf(nextMod.defFile);
      nextMod.files.forEach(addFile(defIndex + 1));

      if (defIndex < 0) {
        sources.unshift(nextMod.defFile);
      }
    }

    if (nextMod.deps && nextMod.deps.length > 0) {
      nextMod.deps.forEach(addDeps);
    }
    loaded.push(nextMod.name);
  }

  //If angular itself is in source modules, inject it
  let angular = this.apps.getModule('angular');
  if (angular && angular.label === label) {
    sources.unshift(angular.defFile);
  }

  return sources;
};

module.exports = NgSource;
