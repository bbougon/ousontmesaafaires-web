import {Item} from './item';

export class NewContainer {

  name: string;
  items: Item[];

  constructor(name: string, item: Item) {
    this.name = name;
    this.items = new Array(item);
  }
}
