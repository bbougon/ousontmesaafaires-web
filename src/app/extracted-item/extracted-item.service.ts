import {Injectable} from '@angular/core';
import {Item} from '../domain/item';
import {Observable} from 'rxjs/Observable';
import {ExtractedItem} from '../domain/extracted-item';
import {HandleError, HttpErrorHandler} from '../infrastructure/http-error-handler.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {catchError, map, tap} from 'rxjs/operators';

@Injectable()
export class ExtractedItemService {
  private handleError: HandleError;

  constructor(private httpClient: HttpClient,
              httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('ExtractedItemService');
  }

  extractItem(item: Item, containerId: string): Observable<ExtractedItem> {
    return this.postItem(containerId, item)
      .mergeMap(location => {
        return this.httpClient.get<ExtractedItem>(location)
          .pipe(
            tap(_ => console.log(`Get Extracted item=${location}`)),
            catchError(this.handleError(`getExtractedItem`, location)),
            map((extractedItem: ExtractedItem) => {
              return extractedItem;
            }));
      });
  }

  private postItem(containerId: string, item: Item): Observable<string> {
    return this.httpClient.post(`${environment.apiUrl}/extracted-items`, {
        containerId: containerId,
        itemHash: item.item.hash
      },
      {
        observe: 'response',
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
        responseType: 'text'
      })
      .pipe(
        map(response => response.headers.get('Location')),
        tap(_ => console.log(`Post Extracted item=${containerId}, ${item}`)),
        catchError(this.handleError(`postExtractedItem`, `${containerId}, ${item}`)));
  }
}
