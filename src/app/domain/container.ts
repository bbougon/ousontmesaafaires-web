import {Item} from './item';

export class Container {
  public id: string;
  public items: Item[];
  public name: string;
  public qrcode: string;

  constructor(private body: any) {
    this.id = body.id;
    this.items = body.items.map((item) => new Item(item));
    this.name = body.location;
    this.qrcode = body.qrcode;
  }

  add = (item: Item) => this.items.push(item);
}
