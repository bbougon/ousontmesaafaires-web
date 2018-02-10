import {LocationService} from '../location.service';
import {NewLocation} from '../../domain/new-location';
import {LocationCreated} from '../../domain/location-created';
import {Item} from '../../domain/item';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';

export const LOCATION_CREATED: LocationCreated = new LocationCreated('an-id', [new Item({'type': 'chaussure'})], 'Location');

export class FakeLocationService extends LocationService {

  addLocation(location: NewLocation): Observable<LocationCreated> {
    return of(LOCATION_CREATED);
  }

}
