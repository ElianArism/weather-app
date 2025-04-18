import { TitleCasePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { from, switchMap } from 'rxjs';
import { GeolocationService } from '../../services/geolocation/geolocation.service';
import { WeatherService } from '../../services/weather/weather.service';

interface IAddressForm {
  address: string;
}
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TitleCasePipe, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  weatherService = inject(WeatherService);
  geolocationService = inject(GeolocationService);
  days = [
    'Monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];

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

  ngOnInit(): void {
    // this.weatherService.test();
  }

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
        next: (r) => {
          console.log(r);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
}
