import {Item} from './item';
import {isUndefined} from 'util';

export class Container {
  public id: string;
  public items: Item[];
  public name: string;
  public description: string;

  constructor(private body: any) {
    this.id = body.id;
    this.items = body.items.map(singleItem => {
      if (!isUndefined(singleItem.imageStore) && !isUndefined(singleItem.hash)) {
        return new Item(singleItem.item, singleItem.imageStore, singleItem.hash);
      }
      return new Item(singleItem.item);
    });
    this.name = body.name;
    this.description = body.description;
  }

  add = (item: Item) => this.items.push(item);
}
