import { Component, EventEmitter, inject, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { from, switchMap } from 'rxjs';
import { ILocationAndWeatherDetails } from '../../../../interfaces/weather-forecast';
import { GeolocationService } from '../../../../services/geolocation/geolocation.service';
import { WeatherService } from '../../../../services/weather/weather.service';

@Component({
  selector: 'app-search-location',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './search-location.component.html',
  styleUrl: './search-location.component.scss',
})
export class SearchLocationComponent {
  @Output('locationDetails')
  private readonly locationDetails$: EventEmitter<ILocationAndWeatherDetails> =
    new EventEmitter<ILocationAndWeatherDetails>();
  private readonly geolocationService: GeolocationService =
    inject(GeolocationService);
  private readonly weatherService: WeatherService = inject(WeatherService);

  readonly addressForm = new FormGroup({
    address: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ],
    }),
  });

  onSubmit() {
    if (this.addressForm.invalid) return;

    const address: string = this.addressForm.value.address!;
    this.geolocationService
      .getCoordinates(address)
      .pipe(
        switchMap((locationDetails: any) => {
          return from(this.weatherService.getWeather(locationDetails));
        })
      )
      .subscribe({
        next: (response) => {
          const weatherData = this.weatherService.parseWeatherData(response);
          const dailyForescast =
            this.weatherService.getDailyWeatherData(weatherData);
          this.locationDetails$.emit({ ...dailyForescast, location: address });
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
}
