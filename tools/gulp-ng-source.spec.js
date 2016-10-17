'use strict';

const Vinyl = require('vinyl');
const proxyquire = require('proxyquire');
const should = require('should');
const through = require('through2');

describe('Angular file injection', function() {
  it('should build app with no dependencies', function(done) {
    const NgSource = require('./gulp-ng-source');
    let ngsource = new NgSource();

    let srcDef = new Vinyl({
      path: 'project/app/app.js',
      contents: new Buffer('angular.module(\'app\', []); angular.element()')
    });

    let srcCtrl = new Vinyl({
      path: 'project/app/app.controller.js',
      contents: new Buffer('angular.module(\'app\').controller()')
    });

    let buildDeps = ngsource.buildDependencies('app');

    buildDeps.on('end', function() {
      let mod = ngsource.apps.getModule('app');
      mod.label.should.equal('app');
      mod.defFile.should.equal(srcDef.path);
      mod.files.length.should.equal(1);
      mod.files[0].should.equal(srcCtrl.path);
      done();
    });

    buildDeps.write(srcCtrl);
    buildDeps.end(srcDef);
    buildDeps.resume();
  });

  it('should build app with no dependencies (swap file order)', function(done) {
    const NgSource = require('./gulp-ng-source');
    let ngsource = new NgSource();

    let srcDef = new Vinyl({
      path: 'project/app/app.js',
      contents: new Buffer('angular.module(\'app\', [])')
    });

    let srcCtrl = new Vinyl({
      path: 'project/app/app.controller.js',
      contents: new Buffer('angular.module(\'app\').controller()')
    });

    let buildDeps = ngsource.buildDependencies('app');

    buildDeps.on('end', function() {
      let mod = ngsource.apps.getModule('app');
      mod.label.should.equal('app');
      mod.defFile.should.equal(srcDef.path);
      mod.files.length.should.equal(1);
      mod.files[0].should.equal(srcCtrl.path);
      done();
    });

    buildDeps.write(srcDef);
    buildDeps.end(srcCtrl);
    buildDeps.resume();
  });

  it('should build app with no label', function(done) {
    const NgSource = require('./gulp-ng-source');
    let ngsource = new NgSource();

    let srcDef = new Vinyl({
      path: 'project/app/app.js',
      contents: new Buffer('angular.module(\'app\', [])')
    });

    let srcCtrl = new Vinyl({
      path: 'project/app/app.controller.js',
      contents: new Buffer('angular.module(\'app\').controller()')
    });

    let buildDeps = ngsource.buildDependencies();

    buildDeps.on('end', function() {
      let mod = ngsource.apps.getModule('app');
      mod.label.should.equal('');
      mod.defFile.should.equal(srcDef.path);
      mod.files.length.should.equal(1);
      mod.files[0].should.equal(srcCtrl.path);
      done();
    });

    buildDeps.write(srcCtrl);
    buildDeps.end(srcDef);
    buildDeps.resume();
  });

  it('should build app with dependencies', function(done) {
    const NgSource = require('./gulp-ng-source');
    let ngsource = new NgSource();

    let srcApp = new Vinyl({
      path: 'project/app/app.js',
      contents:
        new Buffer('angular.module(\'app\', [\'ngAria\', \'ngCookies\', \'common.header\'])')
    });

    let srcHeader = new Vinyl({
      path: 'project/app/header.js',
      contents: new Buffer('angular.module(\'common.header\', [])')
    });

    let buildDeps = ngsource.buildDependencies('app');

    buildDeps.on('end', function() {
      let app = ngsource.apps.getModule('app');
      app.label.should.equal('app');
      app.defFile.should.equal(srcApp.path);
      app.deps.length.should.equal(3);
      app.deps[0].should.equal('ngAria');
      app.deps[1].should.equal('ngCookies');
      app.deps[2].should.equal('common.header');
      app.children.length.should.equal(1);
      app.children[0].should.equal('common.header');
      let common = ngsource.apps.getModule('common.header');
      common.label.should.equal('app');
      common.defFile.should.equal(srcHeader.path);
      common.deps.length.should.equal(0);
      common.parents.length.should.equal(1);
      common.parents[0].should.equal('app');
      done();
    });

    buildDeps.write(srcApp);
    buildDeps.end(srcHeader);
    buildDeps.resume();
  });

  it('should build app with dependencies (duplicate error)', function(done) {
    const NgSource = require('./gulp-ng-source');
    let ngsource = new NgSource();

    let srcApp = new Vinyl({
      path: 'project/app/app.js',
      contents:
        new Buffer('angular.module(\'app\', [\'ngAria\', \'ngCookies\', \'common.header\'])')
    });

    let srcDup = new Vinyl({
      path: 'project/app/app-dup.js',
      contents: new Buffer('angular.module(\'app\', [])')
    });

    let buildDeps = ngsource.buildDependencies('app');

    buildDeps.on('error', function(err) {
      err.message.should.equal('Duplicate Angular module defined: app');
      done();
    });

    buildDeps.write(srcApp);
    buildDeps.end(srcDup);
    buildDeps.resume();
  });

  it('should build app with dependencies (swap order)', function(done) {
    const NgSource = require('./gulp-ng-source');
    let ngsource = new NgSource();

    let srcApp = new Vinyl({
      path: 'project/app/app.js',
      contents:
        new Buffer('angular.module(\'app\', [\'ngAria\', \'ngCookies\', \'common.header\'])')
    });

    let srcHeader = new Vinyl({
      path: 'project/app/header.js',
      contents: new Buffer('angular.module(\'common.header\', [])')
    });

    let buildDeps = ngsource.buildDependencies('app');

    buildDeps.on('end', function() {
      let app = ngsource.apps.getModule('app');
      app.label.should.equal('app');
      app.defFile.should.equal(srcApp.path);
      app.deps.length.should.equal(3);
      app.deps[0].should.equal('ngAria');
      app.deps[1].should.equal('ngCookies');
      app.deps[2].should.equal('common.header');
      app.children.length.should.equal(1);
      app.children[0].should.equal('common.header');
      let common = ngsource.apps.getModule('common.header');
      common.label.should.equal('app');
      common.defFile.should.equal(srcHeader.path);
      common.deps.length.should.equal(0);
      common.parents.length.should.equal(1);
      common.parents[0].should.equal('app');
      done();
    });

    buildDeps.write(srcHeader);
    buildDeps.end(srcApp);
    buildDeps.resume();
  });

  it('should build app with bower dependencies', function(done) {
    const NgSource = proxyquire('./gulp-ng-source', {'vinyl-fs': {
      src: function(path) {
        path.should.equal('project/bower/angular-lib/angular-lib.min.js');
        let anglib = new Vinyl({
          path: 'project/bower/angular-lib/angular-lib.min.js',
          contents: new Buffer('angular.module(\'angularLib\', [])')
        });

        let stream = through.obj(function(file, enc, cb) {cb(null, file);});
        stream.end(anglib);
        return stream;
      }
    },
    fs: {
      stat: function(path, cb) {
        path.should.equal('project/bower/angular-lib/angular-lib.min.js');
        cb(null, {});
      }
    }});
    let ngsource = new NgSource();

    let bower = new Vinyl({
      path: 'project/bower/angular-lib/bower.json',
      contents: new Buffer('{"main": "./angular-lib.js"}')
    });

    let buildDeps = ngsource.buildDependencies('bower');

    buildDeps.on('end', function() {
      let mod = ngsource.apps.getModule('angularLib');
      mod.label.should.equal('bower');
      mod.defFile.should.equal('project/bower/angular-lib/angular-lib.min.js');
      done();
    });

    buildDeps.end(bower);
    buildDeps.resume();
  });

  it('should build app with bower dependencies (angularjs)', function(done) {
    const NgSource = proxyquire('./gulp-ng-source', {'vinyl-fs': {
      src: function(path) {
        path.should.equal('project/bower/angular/angular.min.js');
        let ang = new Vinyl({
          path: 'project/bower/angular/angular.min.js'
        });

        let stream = through.obj(function(file, enc, cb) {cb(null, file);});
        stream.end(ang);
        return stream;
      }
    },
    fs: {
      stat: function(path, cb) {
        path.should.equal('project/bower/angular/angular.min.js');
        cb(null, {});
      }
    }});
    let ngsource = new NgSource();

    let bower = new Vinyl({
      path: 'project/bower/angular/bower.json',
      contents: new Buffer('{"main": "./angular.js"}')
    });

    let buildDeps = ngsource.buildDependencies('bower');

    buildDeps.on('end', function() {
      let mod = ngsource.apps.getModule('angular');
      mod.label.should.equal('bower');
      mod.defFile.should.equal('project/bower/angular/angular.min.js');
      done();
    });

    buildDeps.end(bower);
    buildDeps.resume();
  });

  it('should build app with bower dependencies w/array main property', function(done) {
    const NgSource = proxyquire('./gulp-ng-source', {'vinyl-fs': {
      src: function(path) {
        path.should.equal('project/bower/angular-lib/angular-lib.min.js');
        let anglib = new Vinyl({
          path: 'project/bower/angular-lib/angular-lib.min.js',
          contents: new Buffer('angular.module(\'angularLib\', [])')
        });

        let stream = through.obj(function(file, enc, cb) {cb(null, file);});
        stream.end(anglib);
        return stream;
      }
    },
    fs: {
      stat: function(path, cb) {
        path.should.equal('project/bower/angular-lib/angular-lib.min.js');
        cb(null, {});
      }
    }});
    let ngsource = new NgSource();

    let bower = new Vinyl({
      path: 'project/bower/angular-lib/bower.json',
      contents: new Buffer('{"main": ["./angular-lib.js"]}')
    });

    let buildDeps = ngsource.buildDependencies('bower');

    buildDeps.on('end', function() {
      let mod = ngsource.apps.getModule('angularLib');
      mod.label.should.equal('bower');
      mod.defFile.should.equal('project/bower/angular-lib/angular-lib.min.js');
      done();
    });

    buildDeps.end(bower);
    buildDeps.resume();
  });

  // jscs:disable maximumLineLength
  it('should build app with bower dependencies w/no min version', function(done) {
    const NgSource = proxyquire('./gulp-ng-source', {'vinyl-fs': {
      src: function(path) {
        path.should.equal('project/bower/angular-lib/angular-lib.js');
        let anglib = new Vinyl({
          path: 'project/bower/angular-lib/angular-lib.js',
          contents: new Buffer('angular.module(\'angularLib\', []); angular.isDefined(\'\'); angular.$$csp()')
        });

        let stream = through.obj(function(file, enc, cb) {cb(null, file);});
        stream.end(anglib);
        return stream;
      }
    },
    fs: {
      stat: function(path, cb) {
        path.should.equal('project/bower/angular-lib/angular-lib.min.js');
        cb('not found');
      }
    }});
    let ngsource = new NgSource();

    let bower = new Vinyl({
      path: 'project/bower/angular-lib/bower.json',
      contents: new Buffer('{"main": "./angular-lib.js"}')
    });

    let buildDeps = ngsource.buildDependencies('bower');

    buildDeps.on('end', function() {
      let mod = ngsource.apps.getModule('angularLib');
      mod.label.should.equal('bower');
      mod.defFile.should.equal('project/bower/angular-lib/angular-lib.js');
      done();
    });

    buildDeps.end(bower);
    buildDeps.resume();
  });

  it('should build app with bower dependencies (no main in package)', function(done) {
    const NgSource = require('./gulp-ng-source');
    let ngsource = new NgSource();

    let bower = new Vinyl({
      path: 'project/bower/angular-lib/bower.json',
      contents: new Buffer('{}')
    });

    let buildDeps = ngsource.buildDependencies('bower');

    buildDeps.on('end', function() {
      let mod = ngsource.apps.getModule('angularLib');
      should.not.exist(mod);
      done();
    });

    buildDeps.end(bower);
    buildDeps.resume();
  });

  it('should build app with bower dependencies (main file is not javascript)', function(done) {
    const NgSource = require('./gulp-ng-source');
    let ngsource = new NgSource();

    let bower = new Vinyl({
      path: 'project/bower/angular-lib/bower.json',
      contents: new Buffer('{"main": "./angular-lib.sh"}')
    });

    let buildDeps = ngsource.buildDependencies('bower');

    buildDeps.on('end', function() {
      let mod = ngsource.apps.getModule('angularLib');
      should.not.exist(mod);
      done();
    });

    buildDeps.end(bower);
    buildDeps.resume();
  });

  it('should traverse dependencies (app)', function(done) {
    const NgSource = proxyquire('./gulp-ng-source', {'vinyl-fs': {
      src: function(paths, opts) {
        paths.should.be.an.Array();
        opts.read.should.equal(false);

        let files = paths.map(path => new Vinyl({path: path}));

        let stream = through.obj(function(file, enc, cb) {cb(null, file);});
        files.forEach(file => stream.write(file));
        stream.end();
        return stream;
      }
    }});
    let ngsource = new NgSource();

    ngsource.apps.addModule('app', ['ngLib', 'common.header'], 'app', 'project/app/app.js');
    ngsource.apps.addFile('app', 'project/app/app.controller.js');
    ngsource.apps.addModule('common.header', ['ngLib'], 'app', 'project/app/common.js');
    ngsource.apps.addFile('common.header', 'project/app/common.controller.js');
    ngsource.apps.addModule('ngLib', [], 'bower', 'project/bower/angular-lib.min.js');
    ngsource.apps.addModule('angular', [], 'bower', 'project/bower/angular.min.js');

    let traverseDeps = ngsource.src('app', 'app');

    let sources = [];
    traverseDeps.on('data', chunk => {
      should.exist(chunk.path);
      sources.push(chunk.path);
    });

    traverseDeps.on('end', () => {
      sources.length.should.equal(4);
      sources[0].should.equal('project/app/common.js');
      sources[1].should.equal('project/app/common.controller.js');
      sources[2].should.equal('project/app/app.js');
      sources[3].should.equal('project/app/app.controller.js');
      done();
    });

    traverseDeps.resume();
  });

  it('should traverse dependencies (bower)', function(done) {
    const NgSource = proxyquire('./gulp-ng-source', {'vinyl-fs': {
      src: function(paths, opts) {
        paths.should.be.an.Array();
        opts.read.should.equal(false);

        let files = paths.map(path => new Vinyl({path: path}));

        let stream = through.obj(function(file, enc, cb) {cb(null, file);});
        files.forEach(file => stream.write(file));
        stream.end();
        return stream;
      }
    }});
    let ngsource = new NgSource();

    ngsource.apps.addModule('app', ['ngLib', 'common.header'], 'app', 'project/app/app.js');
    ngsource.apps.addFile('app', 'project/app/app.controller.js');
    ngsource.apps.addModule('common.header', ['ngLib'], 'app', 'project/app/common.js');
    ngsource.apps.addFile('common.header', 'project/app/common.controller.js');
    ngsource.apps.addModule('ngLib', [], 'bower', 'project/bower/angular-lib.min.js');
    ngsource.apps.addModule('angular', [], 'bower', 'project/bower/angular.min.js');

    let traverseDeps = ngsource.src('app', 'bower');

    let sources = [];
    traverseDeps.on('data', chunk => {
      should.exist(chunk.path);
      sources.push(chunk.path);
    });

    traverseDeps.on('end', () => {
      sources.length.should.equal(2);
      sources[0].should.equal('project/bower/angular.min.js');
      sources[1].should.equal('project/bower/angular-lib.min.js');
      done();
    });

    traverseDeps.resume();
  });

  it('should traverse dependencies (Missing Mod Error)', function(done) {
    const NgSource = proxyquire('./gulp-ng-source', {'vinyl-fs': {
      src: function(paths, opts) {
        paths.should.be.an.Array();
        opts.read.should.equal(false);

        let files = paths.map(path => new Vinyl({path: path}));

        let stream = through.obj(function(file, enc, cb) {cb(null, file);});
        files.forEach(file => stream.write(file));
        stream.end();
        return stream;
      }
    }});
    let ngsource = new NgSource();

    ngsource.apps.addModule('app', ['ngLib', 'common.header'], 'app', 'project/app/app.js');
    ngsource.apps.addFile('app', 'project/app/app.controller.js');
    ngsource.apps.addModule('common.header', ['ngLib'], 'app', 'project/app/common.js');
    ngsource.apps.addFile('common.header', 'project/app/common.controller.js');
    ngsource.apps.addModule('angular', [], 'bower', 'project/bower/angular.min.js');

    try {
      ngsource.src('app', 'bower');
    } catch (err) {
      done();
    }
  });

  it('should traverse dependencies w/ duplicate files', function(done) {
    const NgSource = proxyquire('./gulp-ng-source', {'vinyl-fs': {
      src: function(paths, opts) {
        paths.should.be.an.Array();
        opts.read.should.equal(false);

        let files = paths.map(path => new Vinyl({path: path}));

        let stream = through.obj(function(file, enc, cb) {cb(null, file);});
        files.forEach(file => stream.write(file));
        stream.end();
        return stream;
      }
    }});
    let ngsource = new NgSource();

    ngsource.apps.addModule('app', ['ngLib', 'common.header', 'common.common'],
                          'app', 'project/app/app.js');
    ngsource.apps.addFile('app', 'project/app/app.controller.js');
    ngsource.apps.addModule('common.header', ['ngLib', 'common.common', 'another.dep'],
                          'app', 'project/app/app.js');
    ngsource.apps.addFile('common.header', 'project/app/common.controller.js');
    ngsource.apps.addFile('common.header', 'project/app/common.controller.js');
    ngsource.apps.addModule('common.common', [], 'app', 'project/app/common.common.js');
    ngsource.apps.addModule('another.dep', [], 'app', 'project/app/another.dep.js');
    ngsource.apps.addModule('ngLib', [], 'bower', 'project/bower/angular-lib.min.js');
    ngsource.apps.addModule('angular', [], 'bower', 'project/bower/angular.min.js');

    let traverseDeps = ngsource.src('app', 'app');

    let sources = [];
    traverseDeps.on('data', chunk => {
      should.exist(chunk.path);
      sources.push(chunk.path);
    });

    traverseDeps.on('end', () => {
      sources.length.should.equal(5);
      sources[0].should.equal('project/app/another.dep.js');
      sources[1].should.equal('project/app/common.common.js');
      sources[2].should.equal('project/app/app.js');
      sources[3].should.equal('project/app/common.controller.js');
      sources[4].should.equal('project/app/app.controller.js');
      done();
    });

    traverseDeps.resume();
  });

  it('should validate dependencies', function() {
    const NgSource = require('./gulp-ng-source');
    let ngsource = new NgSource();

    ngsource.apps.addModule('app', ['ngLib', 'common.header'], 'app', 'project/app/app.js');
    ngsource.apps.addFile('app', 'project/app/app.controller.js');
    ngsource.apps.addModule('common.header', ['ngLib'], 'app', 'project/app/common.js');
    ngsource.apps.addFile('common.header', 'project/app/common.controller.js');
    ngsource.apps.addModule('ngLib', [], 'bower', 'project/bower/angular-lib.min.js');
    ngsource.apps.addModule('angular', [], 'bower', 'project/bower/angular.min.js');

    ngsource.validateDependencies();
  });

  it('should validate dependences (circle error)', function(done) {
    const NgSource = require('./gulp-ng-source');
    let ngsource = new NgSource();

    ngsource.apps.addModule('app', ['ngLib', 'common.header'], 'app', 'project/app/app.js');
    ngsource.apps.addFile('app', 'project/app/app.controller.js');
    ngsource.apps.addModule('common.header', ['ngLib', 'app'], 'app', 'project/app/common.js');
    ngsource.apps.addFile('common.header', 'project/app/common.controller.js');
    ngsource.apps.addModule('ngLib', [], 'bower', 'project/bower/angular-lib.min.js');
    ngsource.apps.addModule('angular', [], 'bower', 'project/bower/angular.min.js');

    try {
      ngsource.validateDependencies();
    } catch (err) {
      err.message.should.equal('Circular Dependency on app');
      done();
    }
  });

  it('should validate dependences (missing error)', function(done) {
    const NgSource = require('./gulp-ng-source');
    let ngsource = new NgSource();

    ngsource.apps.addModule('app', ['ngLib', 'common.header'], 'app', 'project/app/app.js');
    ngsource.apps.addFile('app', 'project/app/app.controller.js');
    ngsource.apps.addFile('common.header', 'project/app/common.controller.js');
    ngsource.apps.addModule('ngLib', [], 'bower', 'project/bower/angular-lib.min.js');
    ngsource.apps.addModule('angular', [], 'bower', 'project/bower/angular.min.js');

    try {
      ngsource.validateDependencies();
    } catch (err) {
      err.message.should.equal('Missing Module: common.header');
      done();
    }
  });

  it('should traverse dependencies (missing main module)', function(done) {
    const NgSource = require('./gulp-ng-source');
    let ngsource = new NgSource();

    ngsource.apps.addModule('app', [], 'app', 'project/app/app.js');

    try {
      let traverseDeps = ngsource.src('missingMod', 'app');
      traverseDeps.resume();
    } catch (err) {
      done();
    }
  });
});
