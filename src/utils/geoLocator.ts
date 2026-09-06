import { UserLocation } from '../types';

const LOCATION_KEY = 'tripnova_user_location';
const LANGUAGE_KEY = 'tripnova_selected_language';

// Known hubs for smart offline proximity fallback & quick selection
export const KNOWN_HUBS = [
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
export function getClosestHub(lat: number, lng: number) {
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
 * Reverse geocode coordinates using high-precision OpenStreetMap Nominatim with BigDataCloud and Proximity fallbacks
 */
export async function reverseGeocodeCoordinates(
  lat: number, 
  lng: number
): Promise<{ city: string; state: string; country: string; formattedAddress: string; locality?: string; postcode?: string }> {
  // 1. Try Nominatim (OpenStreetMap) - Richest address detail with street, suburb, city & pincode
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        signal: controller.signal,
        headers: { 'Accept-Language': 'en' }
      }
    );
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const addr = data.address || {};
      
      const street = addr.road || addr.pedestrian || addr.street || addr.hamlet || '';
      const locality = addr.suburb || addr.neighbourhood || addr.quarter || addr.residential || addr.city_district || '';
      const city = addr.city || addr.town || addr.village || addr.municipality || addr.county || locality || 'Local City';
      const state = addr.state || addr.region || 'Tamil Nadu';
      const country = addr.country || 'India';
      const postcode = addr.postcode || '';

      const addressParts = [
        street,
        locality,
        city !== locality ? city : null,
        state,
        postcode ? `PIN: ${postcode}` : null,
        country
      ].filter(Boolean);

      const formattedAddress = addressParts.length > 0 ? addressParts.join(', ') : (data.display_name || `${city}, ${state}, ${country}`);

      return { 
        city: locality ? `${locality}, ${city}` : city, 
        state, 
        country, 
        formattedAddress,
        locality,
        postcode
      };
    }
  } catch {
    // Continue to next fallback
  }

  // 2. Try BigDataCloud (CORS friendly, fast, high accuracy)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const locality = data.locality || '';
      const city = data.city || locality || data.principalSubdivision || 'Local City';
      const state = data.principalSubdivision || 'Tamil Nadu';
      const country = data.countryName || 'India';
      const postcode = data.postcode || '';

      const addressParts = [locality, city !== locality ? city : null, state, postcode ? `PIN: ${postcode}` : null, country].filter(Boolean);
      const formattedAddress = addressParts.join(', ');

      return { 
        city: locality ? `${locality}, ${city}` : city, 
        state, 
        country, 
        formattedAddress,
        locality,
        postcode
      };
    }
  } catch {
    // Continue to hub fallback
  }

  // 3. Smart Offline Proximity Hub Fallback
  const hub = getClosestHub(lat, lng);
  return {
    city: hub.name,
    state: hub.state,
    country: hub.country,
    formattedAddress: `${hub.name}, ${hub.state}, ${hub.country}`
  };
}

/**
 * IP-based geolocation fallback when browser GPS is denied, unavailable, or on desktop
 */
export async function detectIPLocation(): Promise<UserLocation> {
  // 1. BigDataCloud Client Info / Reverse Geocode
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch('https://api.bigdatacloud.net/data/reverse-geocode-client', {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const lat = data.latitude || 13.0827;
      const lng = data.longitude || 80.2707;
      const locality = data.locality || '';
      const city = data.city || locality || data.principalSubdivision || 'Chennai';
      const state = data.principalSubdivision || 'Tamil Nadu';
      const country = data.countryName || 'India';
      const formattedAddress = [locality, city !== locality ? city : null, state, country].filter(Boolean).join(', ');

      const loc: UserLocation = {
        latitude: lat,
        longitude: lng,
        city: locality ? `${locality}, ${city}` : city,
        state,
        country,
        formattedAddress,
        timestamp: new Date().toISOString(),
        isApproximate: true
      };
      saveStoredLocation(loc);
      return loc;
    }
  } catch {
    // Fall through to next provider
  }

  // 2. ipwho.is provider
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch('https://ipwho.is/', {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.success !== false) {
        const lat = data.latitude || 13.0827;
        const lng = data.longitude || 80.2707;
        const city = data.city || 'Chennai';
        const state = data.region || 'Tamil Nadu';
        const country = data.country || 'India';
        const formattedAddress = `${city}, ${state}, ${country}`;

        const loc: UserLocation = {
          latitude: lat,
          longitude: lng,
          city,
          state,
          country,
          formattedAddress,
          timestamp: new Date().toISOString(),
          isApproximate: true
        };
        saveStoredLocation(loc);
        return loc;
      }
    }
  } catch {
    // Fall through to default hub
  }

  // 3. Final default hub fallback (Never fails)
  const defaultHub = KNOWN_HUBS[0]; // Chennai
  const fallbackLoc: UserLocation = {
    latitude: defaultHub.lat,
    longitude: defaultHub.lng,
    city: defaultHub.name,
    state: defaultHub.state,
    country: defaultHub.country,
    formattedAddress: `${defaultHub.name}, ${defaultHub.state}, ${defaultHub.country}`,
    timestamp: new Date().toISOString(),
    isApproximate: true
  };
  saveStoredLocation(fallbackLoc);
  return fallbackLoc;
}

/**
 * Resilient high-accuracy multi-tiered location detector:
 * Tier 1: Hardware Browser GPS (Forced fresh query maximumAge: 0, high accuracy, 10s timeout)
 * Tier 2: Real-time IP Geolocation fallback
 * Tier 3: Known Hub fallback
 * Guaranteed to NEVER reject or throw an unhandled error.
 */
export async function detectUserCurrentLocation(): Promise<UserLocation> {
  if (typeof window !== 'undefined' && navigator.geolocation) {
    try {
      const gpsResult = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0 // Force fresh satellite/hardware GPS query
          }
        );
      });

      const { latitude, longitude, accuracy } = gpsResult.coords;
      const geoInfo = await reverseGeocodeCoordinates(latitude, longitude);
      
      const locationData: UserLocation = {
        latitude,
        longitude,
        city: geoInfo.city,
        state: geoInfo.state,
        country: geoInfo.country,
        formattedAddress: geoInfo.formattedAddress,
        timestamp: new Date().toISOString(),
        isApproximate: accuracy ? accuracy > 200 : false
      };
      saveStoredLocation(locationData);
      return locationData;
    } catch {
      // GPS permission denied, timed out, or unavailable; seamlessly fallback to IP geolocation
      console.log('GPS unavailable or permission denied, using high-precision IP geolocation fallback...');
    }
  }

  // Tier 2 Fallback: Fast IP Geolocation
  return await detectIPLocation();
}

/**
 * Manually set or override user location (e.g. from city selector or manual search)
 */
export function setManualUserLocation(
  city: string,
  state: string = '',
  country: string = 'India',
  latitude?: number,
  longitude?: number
): UserLocation {
  const hub = KNOWN_HUBS.find(h => h.name.toLowerCase().includes(city.toLowerCase()));
  const finalLat = latitude ?? hub?.lat ?? 13.0827;
  const finalLng = longitude ?? hub?.lng ?? 80.2707;
  const finalState = state || hub?.state || '';
  const finalCountry = country || hub?.country || 'India';
  const formattedAddress = [city, finalState, finalCountry].filter(Boolean).join(', ');

  const locationData: UserLocation = {
    latitude: finalLat,
    longitude: finalLng,
    city,
    state: finalState,
    country: finalCountry,
    formattedAddress,
    timestamp: new Date().toISOString(),
    isApproximate: false
  };

  saveStoredLocation(locationData);
  return locationData;
}

