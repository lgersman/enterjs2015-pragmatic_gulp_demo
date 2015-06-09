var jasmine = require('minijasminenode2');

require("babel/register")({
  extensions: ['.es6']
});

process.chdir(__dirname + '/..');

jasmine.executeSpecs({
  specs: ['test/a-spec.es6', 'test/b-spec.es6'],
  isVerbose: true,
  showColors: true,
  includeStackTrace: true,
});
