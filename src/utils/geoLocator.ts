import { UserLocation } from '../types';

const LOCATION_KEY = 'tripnova_user_location';
const LANGUAGE_KEY = 'tripnova_selected_language';

// Known hubs for smart offline proximity fallback
const KNOWN_HUBS = [
  { name: 'Chennai', state: 'Tamil Nadu', country: 'India', lat: 13.0827, lng: 80.2707 },
  { name: 'Ooty (Udhagamandalam)', state: 'Tamil Nadu', country: 'India', lat: 11.4102, lng: 76.6950 },
  { name: 'Madurai', state: 'Tamil Nadu', country: 'India', lat: 9.9252, lng: 78.1198 },
  { name: 'Kodaikanal', state: 'Tamil Nadu', country: 'India', lat: 10.2381, lng: 77.4892 },
  { name: 'Coimbatore', state: 'Tamil Nadu', country: 'India', lat: 11.0168, lng: 76.9558 },
  { name: 'Thanjavur', state: 'Tamil Nadu', country: 'India', lat: 10.7870, lng: 79.1378 },
  { name: 'Rameshwaram', state: 'Tamil Nadu', country: 'India', lat: 9.2876, lng: 79.3129 },
  { name: 'Mahabalipuram', state: 'Tamil Nadu', country: 'India', lat: 12.6208, lng: 80.1944 },
  { name: 'Kanyakumari', state: 'Tamil Nadu', country: 'India', lat: 8.0883, lng: 77.5385 },
  { name: 'Puducherry', state: 'Puducherry', country: 'India', lat: 11.9416, lng: 79.8083 },
  { name: 'Bengaluru', state: 'Karnataka', country: 'India', lat: 12.9716, lng: 77.5946 },
  { name: 'Kochi', state: 'Kerala', country: 'India', lat: 9.9312, lng: 76.2673 },
  { name: 'Mumbai', state: 'Maharashtra', country: 'India', lat: 19.0760, lng: 72.8777 },
  { name: 'Delhi NCR', state: 'Delhi', country: 'India', lat: 28.6139, lng: 77.2090 },
  { name: 'Hyderabad', state: 'Telangana', country: 'India', lat: 17.3850, lng: 78.4867 },
  { name: 'Goa', state: 'Goa', country: 'India', lat: 15.2993, lng: 74.1240 },
  { name: 'Jaipur', state: 'Rajasthan', country: 'India', lat: 26.9124, lng: 75.7873 },
  { name: 'London', state: 'England', country: 'United Kingdom', lat: 51.5074, lng: -0.1278 },
  { name: 'New York', state: 'NY', country: 'USA', lat: 40.7128, lng: -74.0060 },
  { name: 'Dubai', state: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708 },
  { name: 'Singapore', state: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198 },
  { name: 'Tokyo', state: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503 },
  { name: 'Paris', state: 'Île-de-France', country: 'France', lat: 48.8566, lng: 2.3522 }
];

export const getStoredLocation = (): UserLocation | null => {
  try {
    const data = localStorage.getItem(LOCATION_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to parse stored location', e);
  }
  return null;
};

export const saveStoredLocation = (location: UserLocation): void => {
  try {
    localStorage.setItem(LOCATION_KEY, JSON.stringify(location));
    window.dispatchEvent(new CustomEvent('tripnova_location_updated', { detail: location }));
  } catch (e) {
    console.error('Failed to save location', e);
  }
};

export const getStoredLanguage = (): string => {
  try {
    return localStorage.getItem(LANGUAGE_KEY) || 'English';
  } catch (e) {
    return 'English';
  }
};

export const saveStoredLanguage = (language: string): void => {
  try {
    localStorage.setItem(LANGUAGE_KEY, language);
    window.dispatchEvent(new CustomEvent('tripnova_language_updated', { detail: language }));
  } catch (e) {
    console.error('Failed to save language', e);
  }
};

// Calculate nearest known hub if reverse geocoding is unavailable
function getClosestHub(lat: number, lng: number) {
  let closest = KNOWN_HUBS[0];
  let minDistance = Infinity;

  for (const hub of KNOWN_HUBS) {
    const dLat = hub.lat - lat;
    const dLng = hub.lng - lng;
    const distSq = dLat * dLat + dLng * dLng;
    if (distSq < minDistance) {
      minDistance = distSq;
      closest = hub;
    }
  }
  return closest;
}

/**
 * Reverse geocode coordinates using OpenStreetMap Nominatim or Open-Meteo with fallback
 */
export async function reverseGeocodeCoordinates(lat: number, lng: number): Promise<{ city: string; state: string; country: string; formattedAddress: string }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`,
      {
        signal: controller.signal,
        headers: { 'Accept-Language': 'en' }
      }
    );
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const addr = data.address || {};
      const city = addr.city || addr.town || addr.village || addr.suburb || addr.county || addr.state_district || 'Local City';
      const state = addr.state || addr.region || '';
      const country = addr.country || 'India';
      const formattedAddress = data.display_name || `${city}, ${state}, ${country}`;

      return { city, state, country, formattedAddress };
    }
  } catch (e) {
    console.warn('Online reverse geocoding timed out or failed, using proximity hub resolver', e);
  }

  // Smart Offline Fallback
  const hub = getClosestHub(lat, lng);
  return {
    city: hub.name,
    state: hub.state,
    country: hub.country,
    formattedAddress: `${hub.name}, ${hub.state}, ${hub.country} (GPS: ${lat.toFixed(4)}, ${lng.toFixed(4)})`
  };
}

/**
 * Detect current device location via browser Geolocation API
 */
export function detectUserCurrentLocation(): Promise<UserLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const geoInfo = await reverseGeocodeCoordinates(latitude, longitude);
          const locationData: UserLocation = {
            latitude,
            longitude,
            city: geoInfo.city,
            state: geoInfo.state,
            country: geoInfo.country,
            formattedAddress: geoInfo.formattedAddress,
            timestamp: new Date().toISOString()
          };
          saveStoredLocation(locationData);
          resolve(locationData);
        } catch (err) {
          const hub = getClosestHub(latitude, longitude);
          const fallbackLocation: UserLocation = {
            latitude,
            longitude,
            city: hub.name,
            state: hub.state,
            country: hub.country,
            formattedAddress: `${hub.name}, ${hub.state}, ${hub.country}`,
            timestamp: new Date().toISOString(),
            isApproximate: true
          };
          saveStoredLocation(fallbackLocation);
          resolve(fallbackLocation);
        }
      },
      (error) => {
        let msg = 'Unable to retrieve your location.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission was denied. Please allow location access in your browser.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Location information is currently unavailable.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Location request timed out.';
        }
        reject(new Error(msg));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  });
}
