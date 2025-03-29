import { Injectable } from '@angular/core';
import { fetchWeatherApi } from 'openmeteo';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  constructor() {}

  // conseguir localizador para poder obtener precision en la medicion del clima

  async test() {
    const position = await this.getPosition();

    const params = {
      latitude: position.latitude,
      longitude: position.longitude,
      hourly: [
        'temperature_2m',
        'wind_speed_1000hPa',
        'precipitation_probability',
        'apparent_temperature',
      ],
      current: [
        'temperature_2m',
        'precipitation',
        'wind_speed_10m',
        'rain',
        'apparent_temperature',
      ],
      timezone: 'America/Sao_Paulo',
    };
    const url = 'https://api.open-meteo.com/v1/forecast';
    const responses = await fetchWeatherApi(url, params);

    // Helper function to form time ranges
    const range = (start: number, stop: number, step: number) =>
      Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];

    // Attributes for timezone and location
    const utcOffsetSeconds = response.utcOffsetSeconds();
    const timezone = response.timezone();
    const timezoneAbbreviation = response.timezoneAbbreviation();
    const latitude = response.latitude();
    const longitude = response.longitude();

    const current = response.current()!;
    const hourly = response.hourly()!;

    // Note: The order of weather variables in the URL query and the indices below need to match!
    const weatherData = {
      current: {
        time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
        temperature2m: current.variables(0)!.value(),
        precipitation: current.variables(1)!.value(),
        windSpeed10m: current.variables(2)!.value(),
        rain: current.variables(3)!.value(),
        apparentTemperature: current.variables(4)!.value(),
      },
      hourly: {
        time: range(
          Number(hourly.time()),
          Number(hourly.timeEnd()),
          hourly.interval()
        ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
        temperature2m: hourly.variables(0)!.valuesArray()!,
        windSpeed1000hPa: hourly.variables(1)!.valuesArray()!,
        precipitationProbability: hourly.variables(2)!.valuesArray()!,
        apparentTemperature: hourly.variables(3)!.valuesArray()!,
      },
    };

    // `weatherData` now contains a simple structure with arrays for datetime and weather data
    for (let i = 0; i < weatherData.hourly.time.length; i++) {
      console.log(
        weatherData.current.time,
        weatherData.current.apparentTemperature,
        weatherData.current.precipitation,
        weatherData.current.rain,
        weatherData.current.temperature2m,
        weatherData.current.windSpeed10m
      );
    }
  }

  private getPosition(): Promise<{ longitude: number; latitude: number }> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (resp) =>
          resolve({
            longitude: resp.coords.longitude,
            latitude: resp.coords.latitude,
          }),
        (err) => reject(err)
      );
    });
  }
}
