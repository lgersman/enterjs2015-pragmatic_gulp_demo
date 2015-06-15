const stream = require('stream'),
      exec   = require('child_process').exec,
      es     = require('event-stream')
;

const promisify = (arg,...params)=>
  ()=>{
    if(arg instanceof stream.Stream) {
      return promisify.stream(arg);
    } else if(typeof(arg)==='string') {
      return promisify.exec(arg);
    } else if(typeof(arg)==='function') {
      return promisify.func(arg, ...params);
    } else {
      Promise.reject(`Don't know how to handle argument ${arg}`);
    }
  }
;

promisify.stream = (stream)=>new Promise((resolve, reject)=>
    // we cannot ensure that end is called (https://github.com/gulpjs/gulp/issues/82)
    // but wrapping it with es.merge guarantees it
  es.merge(stream)
  .on('end', resolve)
  .on('error', reject)
);

promisify.func = (func, ...args)=>{
  let reject,resolve;
  const p = new Promise((_resolve,_reject)=>(resolve=_resolve) && (reject=_reject));
  func(...args, (err, res)=>(err && reject(err)) || resolve(res));
};

promisify.exec = (cmd)=>{
  return new Promise((resolve,reject)=>{
    promisify.verbose && console.log(`[exec] ${cmd}`);
    exec(cmd, (err, stdout, stderr)=>{
      if(err) {
        const message = `[exec] "${cmd}" exited with error code ${err.code} : ${stderr} ${stdout}`;
        //promisify.verbose && console.error(message);
        reject(message);        
      } else {
        promisify.verbose && (stdout || stderr) && console.log(`[exec] ${stdout} ${stderr}`);
        resolve(stdout);
      }
    });
  });    
}

module.exports=promisify;

