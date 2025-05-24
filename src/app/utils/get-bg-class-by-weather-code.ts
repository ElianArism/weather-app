const weatherCodeToBaseClass: Record<number, string> = {
  0: 'clear', // Cielo despejado
  1: 'partly-cloudy', // Principalmente despejado
  2: 'partly-cloudy', // Parcialmente nublado
  3: 'cloudy', // Nublado
  45: 'cloudy', // Niebla
  48: 'cloudy', // Niebla con escarcha
  51: 'rainy', // Llovizna leve
  53: 'rainy', // Llovizna moderada
  55: 'rainy', // Llovizna intensa
  56: 'rainy', // Llovizna helada leve
  57: 'rainy', // Llovizna helada intensa
  61: 'rainy', // Lluvia leve
  63: 'rainy', // Lluvia moderada
  65: 'rainy', // Lluvia intensa
  66: 'rainy', // Lluvia helada leve
  67: 'rainy', // Lluvia helada intensa
  71: 'snow', // Nieve leve
  73: 'snow', // Nieve moderada
  75: 'snow', // Nieve intensa
  77: 'snow', // Copos/granos de nieve
  80: 'rainy', // Chubascos leves
  81: 'rainy', // Chubascos moderados
  82: 'rainy', // Chubascos violentos
  85: 'snow', // Chubascos de nieve leves
  86: 'snow', // Chubascos de nieve fuertes
  95: 'storm', // Tormenta eléctrica leve/moderada
  96: 'storm', // Tormenta con granizo leve
  99: 'storm', // Tormenta con granizo fuerte
};

export const getWeatherClassByWeatherCode = (
  code: number,
  isDay: number
): string => {
  const baseClass = weatherCodeToBaseClass[code] || 'clear';
  return `${baseClass}-${isDay > 0 ? 'day' : 'night'}`;
};
