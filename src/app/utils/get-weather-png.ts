const WEATHER_PNG: Record<string, string> = {
  'clear-day': 'assets/clear-day.png',
  'clear-night': 'assets/clear-night.png',
  'cloudy-day': 'assets/cloudy-day.png',
  'cloudy-night': 'assets/cloudy-night.png',
  'rainy-day': 'assets/storm.png',
  'rainy-night': 'assets/storm.png',
  'snow-day': 'assets/snow.png',
  'snow-night': 'assets/snow.png',
  'storm-day': 'assets/storm.png',
  'storm-night': 'assets/storm.png',
  'partly-cloudy-day': 'assets/cloudy-day.png',
  'partly-cloudy-night': 'assets/cloudy-night.png',
};

export const getWeatherPng = (weatherClass: string) => {
  return WEATHER_PNG[weatherClass] ?? WEATHER_PNG['cloudy-day'];
};
