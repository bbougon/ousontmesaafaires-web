import {LocationItemPipe} from './location-item-pipe';
import {ElementRef} from '@angular/core';

describe('Location Item Pipe', () => {
  let pipe: LocationItemPipe;

  beforeEach(() => {
    pipe = new LocationItemPipe();
  });

  it('should transform an item into a readable string', () => {
    const elementRef = new ElementRef('div');
    expect(pipe.transform({'type': 'chaussure'})).toEqual('<b>Type:</b> chaussure');
    expect(pipe.transform({'type': 'chaussure', 'couleur': 'noir'})).toEqual('<b>Type:</b> chaussure, <b>Couleur:</b> noir');
  });

  it('should transform an item with accent into a readable string', () => {
    expect(pipe.transform({'matière': 'cuir'})).toEqual('<b>Matière:</b> cuir');
  });

  it('should throw an error if not a string', () => {
    function errorThrown() {
      pipe.transform(2);
    }
    expect(errorThrown).toThrow();
  });
});
