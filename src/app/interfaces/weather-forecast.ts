export interface IWeatherForecast {
  day: string;
  sunrise: string;
  sunset: string;
  apparentTemperature: number;
  temperatureMin: number;
  temperatureMean: number;
  temperatureMax: number;
  precipitationProbability: number;
  rainSum: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  isDay: number;
}
