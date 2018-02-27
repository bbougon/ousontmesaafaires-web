import {Item} from './item';

export class LocationCreated {
  public id: string;
  public items: Item[];
  public location: string;
  public qrcode: string;

  constructor(private body: any) {
    this.id = body.id;
    this.items = body.items.map((item) => new Item(item));
    this.location = body.location;
    this.qrcode = body.qrcode;
  }

  add = (item: Item) => this.items.push(item);
}
