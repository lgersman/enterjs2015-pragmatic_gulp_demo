import B from '../src/b.es6';

describe('B', ()=>{
  it('constructor', ()=>{
    let b = new B('foo');

    expect(b.name).toEqual('foo');
  });
});
