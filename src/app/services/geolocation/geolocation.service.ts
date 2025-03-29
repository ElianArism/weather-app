import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  //https://my.locationiq.com/dashboard#accesstoken
  private readonly apiUrl = 'http://api.openweathermap.org/geo/1.0/direct';

  constructor(private http: HttpClient) {}

  getCoordinates() {
    this.http
      .get(`${this.apiUrl}`)

      .subscribe({
        next: (r) => {
          console.log(r);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
}
