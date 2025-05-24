import { NgIf, TitleCasePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  OnInit,
  Renderer2,
  signal,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { from, switchMap } from 'rxjs';
import { IWeatherForecast } from '../../interfaces/weather-forecast';
import { GeolocationService } from '../../services/geolocation/geolocation.service';
import { WeatherService } from '../../services/weather/weather.service';
import { getWeatherClassByWeatherCode } from '../../utils';

interface IAddressForm {
  address: string;
}
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TitleCasePipe, ReactiveFormsModule, NgIf],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  @ViewChild('containerRef')
  containerRef!: ElementRef<HTMLDivElement>;

  weatherService = inject(WeatherService);
  geolocationService = inject(GeolocationService);
  renderer2 = inject(Renderer2);
  days = [
    'Monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];

  dailyWeatherForecast$ = signal<IWeatherForecast | null>(null);

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

  ngOnInit(): void {}

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
          this.updateForecast(dailyForescast);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  updateForecast(weatherData: IWeatherForecast) {
    this.dailyWeatherForecast$.set({
      ...weatherData,
    });

    this.renderer2.addClass(
      this.containerRef.nativeElement,
      getWeatherClassByWeatherCode(weatherData.weatherCode, weatherData.isDay)
    );
  }
}
