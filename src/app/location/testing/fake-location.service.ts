import {LocationService} from '../location.service';
import {NewLocation} from '../../domain/new-location';
import {LocationCreated} from '../../domain/location-created';
import {Item} from '../../domain/item';
import {of} from 'rxjs/observable/of';
import {Observable} from 'rxjs/Observable';

export const LOCATION_CREATED: LocationCreated = new LocationCreated('an-id', [new Item({'type': 'chaussure'})], 'Location');

export class FakeLocationService extends LocationService {
  private locations: LocationCreated[] = [];

  addLocation(location: NewLocation): Observable<LocationCreated> {
    this.locations.push(LOCATION_CREATED);
    return of(LOCATION_CREATED);
  }

  getLocations(): Observable<LocationCreated[]> {
    return of(this.locations);
  }
}
