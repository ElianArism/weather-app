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
import { getWeatherClassByWeatherCode } from '../../utils';
import { SearchLocationComponent } from './components/search-location/search-location.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule, SearchLocationComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  @ViewChild('containerRef')
  containerRef!: ElementRef<HTMLDivElement>;
  renderer2 = inject(Renderer2);

  dailyWeatherForecast$ = signal<ILocationAndWeatherDetails | null>(null);

  updateForecast(weatherData: ILocationAndWeatherDetails) {
    const date = new Date(weatherData.day);
    const dayNumber: DayIndexes = date.getDay() as DayIndexes;
    const dayStr: string = SCHEDULER_CONFIG.DAYS[dayNumber];
    const monthNumber: MonthIndexes = date.getMonth() as MonthIndexes;
    const monthStr: string = SCHEDULER_CONFIG.MONTHS[monthNumber];

    this.dailyWeatherForecast$.set({
      ...weatherData,
      day: `${dayStr}, ${date.getDate()} ${monthStr} of ${date.getFullYear()}`,
    });

    this.renderer2.addClass(
      this.containerRef.nativeElement,
      getWeatherClassByWeatherCode(weatherData.weatherCode, weatherData.isDay)
    );
  }
}
