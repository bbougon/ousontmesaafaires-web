import {NewLocation} from '../../domain/new-location';
import {LocationCreated} from '../../domain/location-created';
import {Item} from '../../domain/item';
import {of} from 'rxjs/observable/of';
import {Observable} from 'rxjs/Observable';
import {LocationService} from '../location.service';

export const LOCATION_CREATED: LocationCreated = new LocationCreated({
  'id': 'an-id', 'location': 'Location',
  'items': [{'item': {'type': 'chaussure'}}], 'qrcode': 'a qr code'
});

export class FakeLocationService extends LocationService {
  private locations: LocationCreated[] = [];

  addLocation(location: NewLocation): Observable<LocationCreated> {
    const locationCreated = new LocationCreated({
      'id': Math.random().toString(36).substring(2, 15),
      'location': location.location,
      'items': [{'item': location.item}],
      'qrcode': 'a qr code'
    });
    this.locations.push(locationCreated);
    return of(locationCreated);
  }

  getLocations(): Observable<LocationCreated[]> {
    return of(this.locations);
  }

  addItemToLocation(locationId: String, item: Item): Observable<any> {
    this.locations.forEach(location => {
      if (location.id === locationId) {
        location.add(item);
      }
    });
    return of(null);
  }

  getLocation(locationId: String): Observable<LocationCreated> {
    this.locations.forEach(location => {
      if (location.id === locationId) {
        return of(location);
      }
    });
    return of(this.locations[0]);
  }

}
