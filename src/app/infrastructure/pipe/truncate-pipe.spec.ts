import {TruncatePipe} from './truncate-pipe';

describe('Truncate Pipe', () => {
  let pipe: TruncatePipe;

  beforeEach(() => {
    pipe = new TruncatePipe();
  });

  it('should truncate a string to expectedsize', () => {
    expect(pipe.transform('message', 5)).toEqual('messa...');
    expect(pipe.transform('abcdefghijklmnopqrstu', 20)).toEqual('abcdefghijklmnopqrst...');
    expect(pipe.transform('abcdef', 20)).toEqual('abcdef');
  });

  it('should throw an error if not a string', () => {
    function errorThrown() {
      pipe.transform(Object.create({a: 2}), 10);
    }
    expect(errorThrown).toThrow();
  });
});
