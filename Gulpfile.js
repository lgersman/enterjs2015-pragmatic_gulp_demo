  /*
  * gulp bootstrap file
  */

require("babel/register")({
  extensions: ['.es6']
});

require('./tasks.es6');
