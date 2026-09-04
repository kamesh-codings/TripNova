/**
 * Live Time, Timezone, Weather, AQI, and Travel Advice Utility
 * Powered by Open-Meteo Keyless Public APIs
 * Ported & enhanced from tourism-proj-main/tourism_api.py
 */

export interface CityLocation {
  city: string;
  country: string;
  countryCode: string;
  timezone: string;
  latitude: number;
  longitude: number;
}

export interface CurrentWeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  precipitation: number;
  rain: number;
  windSpeed: number;
  uvIndex: number;
  weatherCode: number;
  condition: string;
  isDay: boolean;
  sunrise: string;
  sunset: string;
  daylightDurationSeconds: number;
}

export interface DailyForecastItem {
  date: string;
  maxTemp: number;
  minTemp: number;
  rain: number;
  rainProbability: number;
  uvIndex: number;
  sunrise: string;
  sunset: string;
  daylightDurationSeconds: number;
  weatherCode: number;
  condition: string;
}

export interface AirQualityData {
  usAqi: number;
  aqiStatus: string;
  aqiColor: string;
  pm25: number;
  pm10: number;
}

export interface DestinationTimeData {
  homeCity: string;
  homeTimezone: string;
  homeTime: string;
  destinationCity: string;
  destinationCountry: string;
  destinationTimezone: string;
  destinationTime: string;
  differenceText: string;
  diffHours: number;
  diffMinutes: number;
  isAhead: boolean;
}

export interface FullDestinationIntelligence {
  location: CityLocation;
  time: DestinationTimeData;
  weather: CurrentWeatherData;
  forecast: DailyForecastItem[];
  airQuality: AirQualityData;
  travelAdvice: string[];
}

export const DEFAULT_HOME_CITY = 'Chennai';
export const DEFAULT_HOME_TIMEZONE = 'Asia/Kolkata';

// WMO Weather Interpretation Codes
export const WEATHER_CODE_MAP: Record<number, { text: string; icon: string }> = {
  0: { text: 'Clear sky', icon: '☀️' },
  1: { text: 'Mainly clear', icon: '🌤️' },
  2: { text: 'Partly cloudy', icon: '⛅' },
  3: { text: 'Overcast', icon: '☁️' },
  45: { text: 'Foggy', icon: '🌫️' },
  48: { text: 'Depositing rime fog', icon: '🌫️' },
  51: { text: 'Light drizzle', icon: '🌦️' },
  53: { text: 'Moderate drizzle', icon: '🌦️' },
  55: { text: 'Dense drizzle', icon: '🌧️' },
  56: { text: 'Light freezing drizzle', icon: '🌧️' },
  57: { text: 'Dense freezing drizzle', icon: '🌧️' },
  61: { text: 'Slight rain', icon: '🌧️' },
  63: { text: 'Moderate rain', icon: '🌧️' },
  65: { text: 'Heavy rain', icon: '🌧️' },
  66: { text: 'Light freezing rain', icon: '🌧️' },
  67: { text: 'Heavy freezing rain', icon: '🌧️' },
  71: { text: 'Slight snowfall', icon: '🌨️' },
  73: { text: 'Moderate snowfall', icon: '🌨️' },
  75: { text: 'Heavy snowfall', icon: '❄️' },
  77: { text: 'Snow grains', icon: '❄️' },
  80: { text: 'Slight rain showers', icon: '🌦️' },
  81: { text: 'Moderate rain showers', icon: '🌧️' },
  82: { text: 'Violent rain showers', icon: '⛈️' },
  85: { text: 'Slight snow showers', icon: '🌨️' },
  86: { text: 'Heavy snow showers', icon: '🌨️' },
  95: { text: 'Thunderstorm', icon: '⛈️' },
  96: { text: 'Thunderstorm with slight hail', icon: '⛈️' },
  99: { text: 'Thunderstorm with heavy hail', icon: '⛈️' }
};

export const getWeatherDescription = (code: number): { text: string; icon: string } => {
  return WEATHER_CODE_MAP[code] || { text: 'Clear / Variable', icon: '🌤️' };
};

export const getAqiDetails = (aqi: number | null): { status: string; color: string; advice: string } => {
  if (aqi === null || aqi === undefined || isNaN(aqi)) {
    return { status: 'Unknown', color: '#94a3b8', advice: 'Air quality data currently unavailable.' };
  }
  if (aqi <= 50) {
    return { status: 'Good 🟢', color: '#10b981', advice: 'Air quality is great! Ideal for outdoor exploring and sightseeing.' };
  }
  if (aqi <= 100) {
    return { status: 'Moderate 🟡', color: '#fbbf24', advice: 'Air quality is acceptable. Very sensitive tourists may notice slight irritation.' };
  }
  if (aqi <= 150) {
    return { status: 'Unhealthy for Sensitive Groups 🟠', color: '#f97316', advice: 'Asthma or respiratory-sensitive travelers should take precautions outdoors.' };
  }
  if (aqi <= 200) {
    return { status: 'Unhealthy 🔴', color: '#ef4444', advice: 'Everyone may begin to experience health effects. N95 masks recommended.' };
  }
  if (aqi <= 300) {
    return { status: 'Very Unhealthy 🟣', color: '#a855f7', advice: 'Health alert: avoid prolonged outdoor physical exertion.' };
  }
  return { status: 'Hazardous 🟤', color: '#78350f', advice: 'Emergency conditions. Stay indoors and use indoor air purifiers.' };
};

/**
 * 1. Search City using Open-Meteo Geocoding
 */
export async function searchCity(cityName: string): Promise<CityLocation | null> {
  const cleanName = cityName.trim();
  if (!cleanName) return null;

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanName)}&count=1&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    if (!data.results || data.results.length === 0) {
      return null;
    }

    const loc = data.results[0];
    return {
      city: loc.name,
      country: loc.country || 'Unknown',
      countryCode: loc.country_code || '',
      timezone: loc.timezone || 'UTC',
      latitude: loc.latitude,
      longitude: loc.longitude
    };
  } catch (err) {
    console.warn('Geocoding error:', err);
    return null;
  }
}

/**
 * 2. Calculate Real-time Time & Timezone Difference
 */
export function calculateTimeDifference(destTz: string, homeTz: string = DEFAULT_HOME_TIMEZONE) {
  const now = new Date();

  // Destination formatted time
  let destFormatted = '';
  let homeFormatted = '';
  let diffHours = 0;
  let diffMinutes = 0;
  let isAhead = true;
  let differenceText = '';

  try {
    const destString = now.toLocaleString('en-US', {
      timeZone: destTz,
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    destFormatted = destString;

    const homeString = now.toLocaleString('en-US', {
      timeZone: homeTz,
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    homeFormatted = homeString;

    // Calculate timezone offset difference accurately using Intl
    const getOffsetMinutes = (timeZone: string, date: Date) => {
      const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
      const tzDate = new Date(date.toLocaleString('en-US', { timeZone }));
      return Math.round((tzDate.getTime() - utcDate.getTime()) / 60000);
    };

    const destOffset = getOffsetMinutes(destTz, now);
    const homeOffset = getOffsetMinutes(homeTz, now);
    const diffTotalMin = destOffset - homeOffset;

    isAhead = diffTotalMin >= 0;
    const absMin = Math.abs(diffTotalMin);
    diffHours = Math.floor(absMin / 60);
    diffMinutes = absMin % 60;

    const sign = isAhead ? '+' : '-';
    if (diffTotalMin === 0) {
      differenceText = 'Same time as home';
    } else if (diffMinutes === 0) {
      differenceText = `${sign}${diffHours} hrs ${isAhead ? 'ahead of' : 'behind'} Home`;
    } else {
      differenceText = `${sign}${diffHours} hrs ${diffMinutes} mins ${isAhead ? 'ahead of' : 'behind'} Home`;
    }
  } catch (err) {
    console.warn('Timezone calculation error:', err);
    destFormatted = now.toLocaleTimeString();
    homeFormatted = now.toLocaleTimeString();
    differenceText = 'Local time';
  }

  return {
    homeTime: homeFormatted,
    destinationTime: destFormatted,
    differenceText,
    diffHours,
    diffMinutes,
    isAhead
  };
}

/**
 * 3. Fetch Weather & 7-Day Forecast
 */
export async function getWeatherData(
  lat: number,
  lon: number,
  timezone: string
): Promise<{ current: CurrentWeatherData; forecast: DailyForecastItem[] } | null> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m,uv_index,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,rain_sum,uv_index_max,sunrise,sunset,daylight_duration&timezone=${encodeURIComponent(timezone)}&forecast_days=7`;

    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    const cur = data.current || {};
    const daily = data.daily || {};

    const curCode = cur.weather_code ?? 0;
    const curDesc = getWeatherDescription(curCode);

    const current: CurrentWeatherData = {
      temperature: Math.round(cur.temperature_2m ?? 22),
      feelsLike: Math.round(cur.apparent_temperature ?? cur.temperature_2m ?? 22),
      humidity: Math.round(cur.relative_humidity_2m ?? 50),
      precipitation: cur.precipitation ?? 0,
      rain: cur.rain ?? 0,
      windSpeed: Math.round(cur.wind_speed_10m ?? 0),
      uvIndex: Math.round((cur.uv_index ?? 0) * 10) / 10,
      weatherCode: curCode,
      condition: `${curDesc.icon} ${curDesc.text}`,
      isDay: cur.is_day === 1,
      sunrise: daily.sunrise?.[0] ? daily.sunrise[0].split('T')[1] : '06:00',
      sunset: daily.sunset?.[0] ? daily.sunset[0].split('T')[1] : '18:30',
      daylightDurationSeconds: daily.daylight_duration?.[0] ?? 43200
    };

    const forecast: DailyForecastItem[] = [];
    const times = daily.time || [];
    for (let i = 0; i < times.length; i++) {
      const code = daily.weather_code?.[i] ?? 0;
      const desc = getWeatherDescription(code);
      forecast.push({
        date: times[i],
        maxTemp: Math.round(daily.temperature_2m_max?.[i] ?? 25),
        minTemp: Math.round(daily.temperature_2m_min?.[i] ?? 18),
        rain: daily.rain_sum?.[i] ?? 0,
        rainProbability: daily.precipitation_probability_max?.[i] ?? 0,
        uvIndex: daily.uv_index_max?.[i] ?? 0,
        sunrise: daily.sunrise?.[i]?.split('T')[1] || '06:00',
        sunset: daily.sunset?.[i]?.split('T')[1] || '18:30',
        daylightDurationSeconds: daily.daylight_duration?.[i] ?? 43200,
        weatherCode: code,
        condition: `${desc.icon} ${desc.text}`
      });
    }

    return { current, forecast };
  } catch (err) {
    console.warn('Weather fetch error:', err);
    return null;
  }
}

/**
 * 4. Fetch Air Quality (US AQI, PM2.5, PM10)
 */
export async function getAirQualityData(
  lat: number,
  lon: number,
  timezone: string
): Promise<AirQualityData | null> {
  try {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm2_5,pm10&timezone=${encodeURIComponent(timezone)}`;
    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    const cur = data.current || {};
    const aqi = cur.us_aqi != null ? Math.round(cur.us_aqi) : 42;
    const aqiMeta = getAqiDetails(aqi);

    return {
      usAqi: aqi,
      aqiStatus: aqiMeta.status,
      aqiColor: aqiMeta.color,
      pm25: cur.pm2_5 ? Math.round(cur.pm2_5 * 10) / 10 : 12.5,
      pm10: cur.pm10 ? Math.round(cur.pm10 * 10) / 10 : 25.0
    };
  } catch (err) {
    console.warn('Air quality fetch error:', err);
    return null;
  }
}

/**
 * 5. Generate Dynamic Smart Travel & Safety Advice
 */
export function generateTravelAdvice(
  weather: CurrentWeatherData | null,
  airQuality: AirQualityData | null
): string[] {
  const advice: string[] = [];

  if (weather) {
    const { temperature, rain, precipitation, uvIndex, weatherCode } = weather;

    // Temperature Advice
    if (temperature >= 35) {
      advice.push('🥵 Very hot weather! Carry electrolytes, stay hydrated, and limit outdoor walking at midday.');
    } else if (temperature >= 30) {
      advice.push('☀️ Warm tropical weather. Light cotton wear and regular hydration recommended.');
    } else if (temperature <= 10) {
      advice.push('🥶 Cold weather. Thermal innerwear, heavy jackets, and gloves are essential.');
    } else if (temperature <= 18) {
      advice.push('🧥 Cool & pleasant. A light sweater or windbreaker will keep you comfortable.');
    } else {
      advice.push('😊 Perfect sightseeing weather! Comfortable conditions for walking and photography.');
    }

    // Rain & Storm Advice
    if (rain > 0 || precipitation > 0) {
      advice.push('☔ Active rain occurring right now. Keep an umbrella or waterproof jacket ready.');
    } else if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(weatherCode)) {
      advice.push('🌧️ Rain showers forecast today. Carry rain gear for spontaneous downpours.');
    } else if ([95, 96, 99].includes(weatherCode)) {
      advice.push('⛈️ Thunderstorm warning! Avoid open hilltops or water bodies during lightning.');
    }

    // UV Index Advice
    if (uvIndex >= 8) {
      advice.push('🧴 Very high UV Index (8+). Apply SPF 50+ sunscreen, wear UV sunglasses & wide-brim hat.');
    } else if (uvIndex >= 6) {
      advice.push('🧴 High UV Index. Sunscreen is recommended if out in the sun for more than 30 mins.');
    } else if (uvIndex >= 3) {
      advice.push('😎 Moderate UV. Sun protection recommended for extended outdoor tours.');
    }
  }

  // Air Quality Advice
  if (airQuality) {
    const { usAqi } = airQuality;
    if (usAqi > 150) {
      advice.push('😷 Air quality is unhealthy. Sensitive travelers and elderly should wear an N95 mask.');
    } else if (usAqi > 100) {
      advice.push('😷 Moderate air pollution. Limit strenuous outdoor cardio if sensitive to dust/smoke.');
    } else if (usAqi <= 50) {
      advice.push('🌿 Pristine, clean air! Enjoy fresh deep breaths in parks and gardens.');
    }
  }

  if (advice.length === 0) {
    advice.push('✨ Great travel conditions overall. Keep your emergency contacts and route map handy.');
  }

  return advice;
}

/**
 * 6. All-In-One Fetcher for Any Destination Worldwide
 */
export async function fetchCompleteDestinationData(
  cityName: string,
  homeTz: string = DEFAULT_HOME_TIMEZONE
): Promise<FullDestinationIntelligence | null> {
  const location = await searchCity(cityName);
  if (!location) return null;

  const [weatherRes, airRes] = await Promise.all([
    getWeatherData(location.latitude, location.longitude, location.timezone),
    getAirQualityData(location.latitude, location.longitude, location.timezone)
  ]);

  const defaultWeather: CurrentWeatherData = {
    temperature: 24,
    feelsLike: 25,
    humidity: 60,
    precipitation: 0,
    rain: 0,
    windSpeed: 12,
    uvIndex: 4,
    weatherCode: 1,
    condition: '🌤️ Mainly clear',
    isDay: true,
    sunrise: '06:00',
    sunset: '18:30',
    daylightDurationSeconds: 43200
  };

  const weather = weatherRes?.current || defaultWeather;
  const forecast = weatherRes?.forecast || [];
  const airQuality = airRes || {
    usAqi: 35,
    aqiStatus: 'Good 🟢',
    aqiColor: '#10b981',
    pm25: 8.5,
    pm10: 18.0
  };

  const timeDiff = calculateTimeDifference(location.timezone, homeTz);
  const time: DestinationTimeData = {
    homeCity: DEFAULT_HOME_CITY,
    homeTimezone: homeTz,
    homeTime: timeDiff.homeTime,
    destinationCity: location.city,
    destinationCountry: location.country,
    destinationTimezone: location.timezone,
    destinationTime: timeDiff.destinationTime,
    differenceText: timeDiff.differenceText,
    diffHours: timeDiff.diffHours,
    diffMinutes: timeDiff.diffMinutes,
    isAhead: timeDiff.isAhead
  };

  const travelAdvice = generateTravelAdvice(weather, airQuality);

  return {
    location,
    time,
    weather,
    forecast,
    airQuality,
    travelAdvice
  };
}
