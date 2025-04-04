import { TitleCasePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { GeolocationService } from '../../services/geolocation/geolocation.service';
import { WeatherService } from '../../services/weather/weather.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TitleCasePipe],
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

  ngOnInit(): void {
    // this.weatherService.test();
  }
}
