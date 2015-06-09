import A from '../src/a.es6';

describe('A', ()=>{
  it('constructor', ()=>{
    let a = new A('foo');

    expect(a.name).toEqual('foo');
  });
});
