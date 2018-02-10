
import {Item} from './item';

export class LocationCreated {

  constructor(public id: string, public items: Item[], public location: string) {
  }

}
