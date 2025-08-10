import {
  Component,
  ElementRef,
  inject,
  Renderer2,
  signal,
  ViewChild,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SCHEDULER_CONFIG } from '../../constants/scheduler.config';
import { ILocationAndWeatherDetails } from '../../interfaces/weather-forecast';
import { DayIndexes, MonthIndexes } from '../../types/day.index';
import { getWeatherClassByWeatherCode, getWeatherPng } from '../../utils';
import { SearchLocationComponent } from './components/search-location/search-location.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule, SearchLocationComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private weatherClass!: string;

  @ViewChild('containerRef')
  containerRef!: ElementRef<HTMLDivElement>;

  renderer2 = inject(Renderer2);

  dailyWeatherForecast$ = signal<ILocationAndWeatherDetails | null>(null);
  weatherPicturePath$ = signal<string>('assets/cloudy-day.png');

  resetForecast(): void {
    this.dailyWeatherForecast$.set(null);
    this.renderer2.removeClass(
      this.containerRef.nativeElement,
      this.weatherClass
    );
    this.renderer2.setStyle(this.containerRef.nativeElement, 'color', 'black');
  }

  updateForecast(weatherData: ILocationAndWeatherDetails): void {
    const date = new Date(weatherData.day);
    const dayNumber: DayIndexes = date.getDay() as DayIndexes;
    const dayStr: string = SCHEDULER_CONFIG.DAYS[dayNumber];
    const monthNumber: MonthIndexes = date.getMonth() as MonthIndexes;
    const monthStr: string = SCHEDULER_CONFIG.MONTHS[monthNumber];

    this.dailyWeatherForecast$.set({
      ...weatherData,
      day: `${dayStr}, ${date.getDate()} ${monthStr} of ${date.getFullYear()}`,
    });

    this.weatherClass = getWeatherClassByWeatherCode(
      weatherData.weatherCode,
      weatherData.isDay
    );

    this.renderer2.addClass(this.containerRef.nativeElement, this.weatherClass);

    this.weatherPicturePath$.set(getWeatherPng(this.weatherClass));

    if (weatherData.isDay) {
      this.renderer2.setStyle(
        this.containerRef.nativeElement,
        'color',
        'black'
      );
    } else {
      this.renderer2.setStyle(
        this.containerRef.nativeElement,
        'color',
        '#f3f3f3'
      );
    }
  }
}
