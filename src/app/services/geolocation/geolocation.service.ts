import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  private readonly apiUrl = `https://us1.locationiq.com/v1/search?key=${environment.apiKey}`;

  constructor(private http: HttpClient) {}

  getCoordinates(address: string) {
    console.log(this.apiUrl);
    console.log(address);
    return this.http.get(`${this.apiUrl}&q=${address}&format=json`).pipe(
      map((results: any) => {
        return results[0];
      })
    );
  }
}
