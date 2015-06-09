const gulp        = require('gulp'),
      es          = require('event-stream'),
      pfy         = require('./task-util.es6'),
      through2    = require('through2'),
      babel       = require('babel'),
      fs          = require('fs')
;

const PACKAGE = JSON.parse(fs.readFileSync('./package.json')),
      DIST    = 'dist',
      HEADER  = `/**
* Package         : ${PACKAGE.name}
* Version         : ${PACKAGE.version}
* GIT Repository  : ${PACKAGE.repository.url}
*
* Description     :
* ${PACKAGE.description.replace(/\n/g,'\n *')}
*
* Copyright ${PACKAGE.author}
*/

`;

gulp.task('clean', pfy(`rm -rf ${DIST}`));

gulp.task('prepare', ['clean'], done=>
  pfy(`mkdir ${DIST}`)()
  .then(()=>
    fs.writeFileSync(`${DIST}/index.js`, `${babel.buildExternalHelpers()} \n\nexports.b = require('./b');`)
  )
);

  // compare with similar gulp https://babeljs.io/docs/using-babel/#gulp
gulp.task('compile', ['prepare'], pfy(`./node_modules/.bin/babel src -s -r --out-dir ${DIST}`));

gulp.task('build', ['compile', 'test:node'], done=>
    // append header to all javascript files
  gulp.src([`${DIST}/**/*.es6`, `${DIST}/**/*.js`])
  .pipe(through2.obj((file, enc, done)=>
    (file.contents=new Buffer(HEADER + file.contents)) && done(null, file)
  ))
  .pipe(gulp.dest(DIST))
);

gulp.task('test', ['build']);

gulp.task('test:node', ()=>Promise.all([
  pfy('node_modules/.bin/eslint src/*.es6 test/*es6')(),
  pfy('node test/test-node-specs.js')()
]));

gulp.task('default', ['test']);
