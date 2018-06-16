import {Item} from './item';
import {Container} from './container';

export class ExtractedItem {
  constructor(public id: string, public item: Item, public sourceContainer: Container) {
  }

}
