import { Injectable } from '@angular/core';
import { fetchWeatherApi } from 'openmeteo';
import { IWeatherForecast } from '../../interfaces/weather-forecast';
@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  constructor() {}

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

  async getWeather(locationDetails: any) {
    const params = {
      latitude: locationDetails.lat,
      longitude: locationDetails.lon,
      daily: [
        'sunrise',
        'sunset',
        'temperature_2m_max',
        'temperature_2m_mean',
        'apparent_temperature_mean',
        'precipitation_probability_mean',
        'relative_humidity_2m_mean',
        'temperature_2m_min',
        'wind_speed_10m_mean',
        'rain_sum',
      ],
      current: [
        'precipitation',
        'temperature_2m',
        'apparent_temperature',
        'wind_speed_10m',
        'rain',
        'showers',
        'is_day',
      ],
    };
    const url = 'https://api.open-meteo.com/v1/forecast';
    const responses = await fetchWeatherApi(url, params);

    this.logWeatherData(responses[0]);

    // Process first location. Add a for-loop for multiple locations or weather models
    return this.getDailyWeatherData(responses[0]);
  }

  private logWeatherData(data: any): void {
    const weatherData = this.parseWeatherData(data);
    for (let i = 0; i < weatherData.daily.time.length; i++) {
      console.log(
        weatherData.daily.time[i].toISOString(),
        weatherData.daily.sunrise[i].toISOString(),
        weatherData.daily.sunset[i].toISOString(),
        weatherData.daily.temperature2mMax[i],
        weatherData.daily.temperature2mMean[i],
        weatherData.daily.apparentTemperatureMean[i],
        weatherData.daily.precipitationProbabilityMean[i],
        weatherData.daily.relativeHumidity2mMean[i],
        weatherData.daily.temperature2mMin[i],
        weatherData.daily.windSpeed10mMean[i],
        weatherData.daily.rainSum[i]
      );
    }

    console.log(weatherData.current);
  }

  private parseWeatherData(response: any) {
    // Attributes for timezone and location
    const utcOffsetSeconds = response.utcOffsetSeconds();
    const current = response.current()!;
    const daily = response.daily()!;
    const sunrise = daily.variables(0)!;
    const sunset = daily.variables(1)!;

    // Note: The order of weather variables in the URL query and the indices below need to match!
    const weatherData = {
      current: {
        time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
        precipitation: current.variables(0)!.value(),
        temperature2m: current.variables(1)!.value(),
        apparentTemperature: current.variables(2)!.value(),
        windSpeed10m: current.variables(3)!.value(),
        rain: current.variables(4)!.value(),
        showers: current.variables(5)!.value(),
        isDay: current.variables(6)!.value(),
      },
      daily: {
        time: [
          ...Array(
            (Number(daily.timeEnd()) - Number(daily.time())) / daily.interval()
          ),
        ].map(
          (_, i) =>
            new Date(
              (Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) *
                1000
            )
        ),
        sunrise: [...Array(sunrise.valuesInt64Length())].map(
          (_, i) =>
            new Date((Number(sunrise.valuesInt64(i)) + utcOffsetSeconds) * 1000)
        ),
        sunset: [...Array(sunset.valuesInt64Length())].map(
          (_, i) =>
            new Date((Number(sunset.valuesInt64(i)) + utcOffsetSeconds) * 1000)
        ),
        temperature2mMax: daily.variables(2)!.valuesArray()!,
        temperature2mMean: daily.variables(3)!.valuesArray()!,
        apparentTemperatureMean: daily.variables(4)!.valuesArray()!,
        precipitationProbabilityMean: daily.variables(5)!.valuesArray()!,
        relativeHumidity2mMean: daily.variables(6)!.valuesArray()!,
        temperature2mMin: daily.variables(7)!.valuesArray()!,
        windSpeed10mMean: daily.variables(8)!.valuesArray()!,
        rainSum: daily.variables(9)!.valuesArray()!,
      },
    };

    // `weatherData` now contains a simple structure with arrays for datetime and weather data
    return weatherData;
  }

  getDailyWeatherData(data: any): IWeatherForecast {
    const weatherData = this.parseWeatherData(data);

    return {
      day: weatherData.daily.time[0].toISOString(), // Day associated with the forecast (ONLY DAY, this is not the exact hour)
      sunrise: weatherData.daily.sunrise[0].toLocaleString(),
      sunset: weatherData.daily.sunset[0].toLocaleString(),
      temperatureMax: weatherData.daily.temperature2mMax[0],
      temperatureMean: weatherData.daily.temperature2mMean[0],
      apparentTemperature: weatherData.daily.apparentTemperatureMean[0],
      precipitationProbability:
        weatherData.daily.precipitationProbabilityMean[0],
      humidity: weatherData.daily.relativeHumidity2mMean[0],
      temperatureMin: weatherData.daily.temperature2mMin[0],
      windSpeed: weatherData.daily.windSpeed10mMean[0],
      rainSum: weatherData.daily.rainSum[0],
    };
  }

  getWeeklyWeatherData(data: any) {
    const weatherData = this.parseWeatherData(data);
    return weatherData;
  }
}
