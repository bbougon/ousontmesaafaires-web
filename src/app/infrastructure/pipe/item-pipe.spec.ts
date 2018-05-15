import {ItemPipe} from './item-pipe';
import {Item} from '../../domain/item';
import {ImageStore} from '../../domain/image-store';

describe('Item Pipe', () => {
  let pipe: ItemPipe;

  beforeEach(() => {
    pipe = new ItemPipe();
  });

  it('should transform an item into a readable string', () => {
    expect(pipe.transform(new Item({
      'type': 'chaussure',
      'imageStore': new ImageStore('imageStore'),
      hash: 'dfsdfsfsf'
    })))
      .toEqual('<b>Type:</b> chaussure');
    expect(pipe.transform(new Item({
      'type': 'chaussure', 'couleur': 'noir', 'imageStore': new ImageStore('imageStore'),
      hash: 'sdfshjskdfhs'
    }))).toEqual('<b>Type:</b> chaussure, <b>Couleur:</b> noir');
    expect(pipe.transform({type: 'item'})).toEqual('<b>Type:</b> item');
  });

  it('should transform an item with accent into a readable string', () => {
    expect(pipe.transform(new Item({
      'matière': 'cuir',
      'imageStore': new ImageStore('imageStore'),
      hash: 'sdjhsjfhsfjksf'
    }))).toEqual('<b>Matière:</b> cuir');
  });

  it('should throw an error if not an Object', () => {
    function errorThrown() {
      pipe.transform(2);
    }

    expect(errorThrown).toThrow();
  });
});
