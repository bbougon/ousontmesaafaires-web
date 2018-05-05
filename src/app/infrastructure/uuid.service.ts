import { Injectable } from '@angular/core';
import {UUID} from 'angular2-uuid';

@Injectable()
export class UuidService {

  constructor() { }

  base64Encoded(): string {
    return btoa(UUID.UUID());
  }
}
