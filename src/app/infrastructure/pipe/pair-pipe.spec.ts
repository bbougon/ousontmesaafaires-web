import {PairPipe} from './pair-pipe';

describe('Pair Pipe', () => {
  let pipe: PairPipe;

  beforeEach(() => {
    pipe = new PairPipe();
  });

  it('should keep the element the same way if its not an object', () => {
    expect(pipe.transform([1, 2, 3])).toEqual([1, 2, 3]);
    expect(pipe.transform([])).toEqual([]);
    expect(pipe.transform('foo')).toEqual('foo');
    expect(pipe.transform(null)).toEqual(null);
    expect(pipe.transform(undefined)).toEqual(undefined);
  });

  it('should return array of pairs', () => {
    expect(pipe.transform({})).toEqual([]);
    expect(pipe.transform({foo: 'bar'})).toEqual([['foo', ' bar']]);
    expect(pipe.transform({foo: 1, bar: 42})).toEqual([['foo', ' 1'], ['bar', ' 42']]);
  });
});
