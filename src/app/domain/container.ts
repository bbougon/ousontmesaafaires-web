import {Item} from './item';

export class Container {
  public id: string;
  public items: Item[];
  public name: string;
  public description: string;

  constructor(private body: any) {
    this.id = body.id;
    this.items = body.items.map((item) => new Item(item, item.imageStore, item.hash));
    this.name = body.name;
    this.description = body.description;
  }

  add = (item: Item) => this.items.push(item);
}
