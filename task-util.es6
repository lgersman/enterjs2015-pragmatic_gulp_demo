const stream = require('stream'),
      exec   = require('child_process').exec
;

const promisify = (arg,options={})=>
  (...params)=>{
    if(arg instanceof stream.Stream) {
      return promisify.stream(arg);
    } else if(typeof(arg)==='string') {
      return promisify.exec(arg, options);
    } else if(typeof(arg)==='function') {
      return promisify.func(arg, ...params);
    } else {
      Promise.reject(`Don't know how to handle argument ${arg}`);
    }
  }
;

promisify.stream = (stream)=>new Promise((resolve, reject)=>{
  stream
  .on('end', resolve)
  .on('error', reject)
});

promisify.func = (func, ...args)=>{
  let reject,resolve;
  const p = new Promise((_resolve,_reject)=>(resolve=_resolve) && (reject=_reject));
  func(...args, (err, res)=>(err && reject(err)) || resolve(res));
};

promisify.exec = (cmd, options)=>{
  return new Promise((resolve,reject)=>{
    options.verbose && console.log(`[exec] ${cmd}`);
    exec(cmd, (err, stdout, stderr)=>{
      if(err) {
        const message = `[exec] "${cmd}" exited with error code ${err.code} : ${stderr} ${stdout}`;
        //options.verbose && console.error(message);
        reject(message);        
      } else {
        options.verbose && stdout && console.log(`[exec] ${stdout}`);
        resolve(stdout);
      }
    });
  });    
}

module.exports=promisify;
