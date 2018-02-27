import {LocationItemPipe} from './location-item-pipe';
import {Item} from '../../domain/item';

describe('Location Item Pipe', () => {
  let pipe: LocationItemPipe;

  beforeEach(() => {
    pipe = new LocationItemPipe();
  });

  it('should transform an item into a readable string', () => {
    expect(pipe.transform(new Item({'type': 'chaussure'}))).toEqual('<b>Type:</b> chaussure');
    expect(pipe.transform(new Item({'type': 'chaussure', 'couleur': 'noir'})))
      .toEqual('<b>Type:</b> chaussure, <b>Couleur:</b> noir');
    expect(pipe.transform({type: 'item'})).toEqual('<b>Type:</b> item');
  });

  it('should transform an item with accent into a readable string', () => {
    expect(pipe.transform(new Item({'matière': 'cuir'}))).toEqual('<b>Matière:</b> cuir');
  });

  it('should throw an error if not an Object', () => {
    function errorThrown() {
      pipe.transform(2);
    }
    expect(errorThrown).toThrow();
  });
});
