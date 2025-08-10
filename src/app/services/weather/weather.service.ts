import { Injectable } from '@angular/core';
import { fetchWeatherApi } from 'openmeteo';
import { IWeatherForecast } from '../../interfaces/weather-forecast';
import { roundDecimals } from '../../utils';
@Injectable({
  providedIn: 'root',
})
export class WeatherService {
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
        'weather_code',
      ],
    };
    const url = 'https://api.open-meteo.com/v1/forecast';
    const responses = await fetchWeatherApi(url, params);

    // Process first location. Add a for-loop for multiple locations or weather models
    return responses[0];
  }

  parseWeatherData(response: any) {
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
        weather_code: current.variables(7)!.value(),
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

  getDailyWeatherData(weatherData: any): IWeatherForecast {
    return {
      day: (weatherData.daily.time[0].toISOString() as string).split('T')[0], // Day associated with the forecast (ONLY DAY, this is not the exact hour)
      sunrise: weatherData.daily.sunrise[0].toLocaleString(),
      sunset: weatherData.daily.sunset[0].toLocaleString(),
      temperatureMax: roundDecimals(weatherData.daily.temperature2mMax[0]),
      temperatureMean: roundDecimals(weatherData.current.temperature2m),
      apparentTemperature: roundDecimals(
        weatherData.current.apparentTemperature
      ),
      precipitationProbability:
        weatherData.daily.precipitationProbabilityMean[0],
      humidity: roundDecimals(weatherData.daily.relativeHumidity2mMean[0]),
      temperatureMin: roundDecimals(weatherData.daily.temperature2mMin[0]),
      windSpeed: roundDecimals(weatherData.current.windSpeed10m),
      rainSum: roundDecimals(weatherData.daily.rainSum[0]),
      isDay: weatherData.current.isDay,
      weatherCode: weatherData.current.weatherCode,
    };
  }

  getWeeklyWeatherData(data: any) {
    return data;
  }
}
