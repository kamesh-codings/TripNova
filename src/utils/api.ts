/**
 * TripNova Centralized Backend API Client
 * Connects Frontend to Backend with API Key Authentication
 */

const API_BASE_URL = 'http://localhost:5000/api';
const API_KEY = 'tripnova_live_api_key_2026';

const defaultHeaders = {
  'Content-Type': 'application/json',
  'x-api-key': API_KEY
};

export interface LocationItem {
  id: string;
  name: string;
  state: string;
  country: string;
  currency_code: string;
  description: string;
  latitude?: number | null;
  longitude?: number | null;
  region?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PlaceItem {
  id: string;
  location_id: string;
  name: string;
  category: string;
  avg_rating: number;
  review_count: number;
  entry_fee: number;
  opening_hours: string;
  location_name?: string;
  location_state?: string;
  location_region?: string;
  latitude?: number | null;
  longitude?: number | null;
  map_url?: string | null;
  description?: string;
  best_season?: string;
  avg_visit_time?: string;
  transport?: string;
  nearby_hotels?: string;
  nearby_restaurants?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CulturalRuleItem {
  id: string;
  location_id: string;
  rule_type: string;
  title: string;
  description: string;
  severity: 'advisory' | 'standard' | 'mandatory' | 'strict';
}

export interface SafetyContactItem {
  id: string;
  location_id: string;
  service_type: string;
  contact_number: string;
  operating_hours: string;
  location_name?: string;
  location_state?: string;
}

// Fallback initial locations if server is unreachable
export const FALLBACK_LOCATIONS: LocationItem[] = [
  { id: 'loc-chn', name: 'Chennai', state: 'Tamil Nadu', country: 'India', currency_code: 'INR', description: 'Capital city known for its colonial heritage, Marina Beach, and Dravidian temples.' },
  { id: 'loc-tnj', name: 'Thanjavur', state: 'Tamil Nadu', country: 'India', currency_code: 'INR', description: 'The cultural heart of the Chola empire, home to the UNESCO World Heritage Brihadisvara Temple.' },
  { id: 'loc-mdu', name: 'Madurai', state: 'Tamil Nadu', country: 'India', currency_code: 'INR', description: 'One of the oldest continuously inhabited cities, renowned for Meenakshi Amman Temple.' },
  { id: 'loc-cbe', name: 'Coimbatore', state: 'Tamil Nadu', country: 'India', currency_code: 'INR', description: 'Gateway to Nilgiris hill stations and the Adiyogi Shiva bust.' },
  { id: 'loc-cgl', name: 'Chengalpattu', state: 'Tamil Nadu', country: 'India', currency_code: 'INR', description: 'Coastal heritage district housing Mamallapuram shore temples.' },
  { id: 'loc-kpm', name: 'Kanchipuram', state: 'Tamil Nadu', country: 'India', currency_code: 'INR', description: 'The City of Thousand Temples and world-famous silk sarees.' },
  { id: 'loc-nlg', name: 'Nilgiris', state: 'Tamil Nadu', country: 'India', currency_code: 'INR', description: 'Scenic hill district encompassing Ooty, Coonoor, and Kotagiri.' },
  { id: 'loc-dgl', name: 'Dindigul', state: 'Tamil Nadu', country: 'India', currency_code: 'INR', description: 'Home to Kodaikanal hill resort and historic rock forts.' },
  { id: 'loc-kkm', name: 'Kanyakumari', state: 'Tamil Nadu', country: 'India', currency_code: 'INR', description: 'Southernmost tip of India with Vivekananda Rock Memorial.' },
  { id: 'loc-try', name: 'Tiruchirappalli', state: 'Tamil Nadu', country: 'India', currency_code: 'INR', description: 'Historic city with Rockfort and Sri Ranganathaswamy Temple.' },
  { id: 'loc-rmd', name: 'Ramanathapuram', state: 'Tamil Nadu', country: 'India', currency_code: 'INR', description: 'Coastal pilgrimage hub encompassing Rameswaram and Dhanushkodi.' },
  { id: 'loc-tvm', name: 'Tiruvannamalai', state: 'Tamil Nadu', country: 'India', currency_code: 'INR', description: 'Spiritual destination centered around sacred Arunachala hill.' },
  { id: 'loc-tnv', name: 'Tirunelveli', state: 'Tamil Nadu', country: 'India', currency_code: 'INR', description: 'Ancient city along Thamirabarani river, noted for Nellaiappar Temple.' },
  { id: 'loc-tks', name: 'Tenkasi', state: 'Tamil Nadu', country: 'India', currency_code: 'INR', description: 'Known for Courtallam mineral waterfalls and Kasiviswanathar Temple.' },
  { id: 'loc-slm', name: 'Salem', state: 'Tamil Nadu', country: 'India', currency_code: 'INR', description: 'Gateway to Yercaud hill station in the Shevaroy range.' },
  { id: 'loc-vel', name: 'Vellore', state: 'Tamil Nadu', country: 'India', currency_code: 'INR', description: 'Historical city featuring 16th-century Vellore Fort and Sripuram Golden Temple.' },
  { id: 'loc-tni', name: 'Theni', state: 'Tamil Nadu', country: 'India', currency_code: 'INR', description: 'Lush valley nestled in the Western Ghats with Meghamalai tea estates.' },
  { id: 'loc-ngp', name: 'Nagapattinam', state: 'Tamil Nadu', country: 'India', currency_code: 'INR', description: 'Coastal district holding Velankanni Basilica and Nagore Dargah.' },
  { id: 'loc-myd', name: 'Mayiladuthurai', state: 'Tamil Nadu', country: 'India', currency_code: 'INR', description: 'Cauvery delta region with Chola temples and Tranquebar Fort.' },
  { id: 'loc-svg', name: 'Sivaganga', state: 'Tamil Nadu', country: 'India', currency_code: 'INR', description: 'Heritage region famous for Chettinad mansions and cuisine.' },
  { id: 'loc-dpi', name: 'Dharmapuri', state: 'Tamil Nadu', country: 'India', currency_code: 'INR', description: 'Popular for Hogenakkal Falls on the Kaveri river.' },
  { id: 'loc-cud', name: 'Cuddalore', state: 'Tamil Nadu', country: 'India', currency_code: 'INR', description: 'Coastal town with Silver Beach and Pichavaram mangroves.' },
  { id: 'loc-tut', name: 'Thoothukudi', state: 'Tamil Nadu', country: 'India', currency_code: 'INR', description: 'The Pearl City with historic seaport and Tiruchendur Murugan Temple.' },
  { id: 'loc-erd', name: 'Erode', state: 'Tamil Nadu', country: 'India', currency_code: 'INR', description: 'Agricultural district with Bhavani Sangameshwarar Temple.' },
  { id: 'loc-trv', name: 'Thiruvananthapuram', state: 'Kerala', country: 'India', currency_code: 'INR', description: 'Capital city known for Sree Padmanabhaswamy Temple and Varkala cliffs.' },
  { id: 'loc-klm', name: 'Kollam', state: 'Kerala', country: 'India', currency_code: 'INR', description: 'Historic port city with Ashtamudi Lake backwaters and Jatayu Earth Center.' },
  { id: 'loc-pta', name: 'Pathanamthitta', state: 'Kerala', country: 'India', currency_code: 'INR', description: 'Transit base for Sabarimala pilgrimage and Gavi rainforests.' },
  { id: 'loc-alp', name: 'Alappuzha', state: 'Kerala', country: 'India', currency_code: 'INR', description: 'Venice of the East with tranquil backwater houseboats and Marari Beach.' },
  { id: 'loc-ktm', name: 'Kottayam', state: 'Kerala', country: 'India', currency_code: 'INR', description: 'Bordered by Vembanad Lake, rubber plantations, and Kumarakom sanctuary.' },
  { id: 'loc-idk', name: 'Idukki', state: 'Kerala', country: 'India', currency_code: 'INR', description: 'Highland district with Munnar tea plantations and Eravikulam National Park.' },
  { id: 'loc-ekm', name: 'Ernakulam', state: 'Kerala', country: 'India', currency_code: 'INR', description: 'Commercial heart of Kerala with Fort Kochi and Chinese fishing nets.' },
  { id: 'loc-tsr', name: 'Thrissur', state: 'Kerala', country: 'India', currency_code: 'INR', description: 'Cultural capital of Kerala with Thrissur Pooram and Vadakkunnathan Temple.' },
  { id: 'loc-pkd', name: 'Palakkad', state: 'Kerala', country: 'India', currency_code: 'INR', description: 'Granary of Kerala with Palakkad Fort and Silent Valley rainforests.' },
  { id: 'loc-mlp', name: 'Malappuram', state: 'Kerala', country: 'India', currency_code: 'INR', description: 'Rich in Malabar culture, Nilambur teak reserves, and Kottakkal Ayurveda.' },
  { id: 'loc-kkd', name: 'Kozhikode', state: 'Kerala', country: 'India', currency_code: 'INR', description: 'Historic spice trade port with Malabar cuisine and Beypore dhows.' },
  { id: 'loc-wyd', name: 'Wayanad', state: 'Kerala', country: 'India', currency_code: 'INR', description: 'Highland plateau with Chembra Peak and Edakkal Cave petroglyphs.' },
  { id: 'loc-knr', name: 'Kannur', state: 'Kerala', country: 'India', currency_code: 'INR', description: 'Land of Looms and Lores with sacred Theyyam rituals and St. Angelo Fort.' },
  { id: 'loc-ksd', name: 'Kasaragod', state: 'Kerala', country: 'India', currency_code: 'INR', description: 'Northernmost coastal district featuring Bekal Fort battlements.' }
];

export const FALLBACK_PLACES: PlaceItem[] = [
  { id: 'plc-marina-beach', location_id: 'loc-chn', name: 'Marina Beach & Promenade', category: 'beach', avg_rating: 4.5, review_count: 2, entry_fee: 0, opening_hours: '24 Hours (Best: 05:00 - 08:30 & 16:30 - 20:30)', location_name: 'Chennai', location_state: 'Tamil Nadu', latitude: 13.0827, longitude: 80.2707, best_season: 'Nov-Feb', avg_visit_time: '2-3 hours' },
  { id: 'plc-kapaleeshwarar-temple', location_id: 'loc-chn', name: 'Kapaleeshwarar Temple', category: 'religious', avg_rating: 4.8, review_count: 2, entry_fee: 0, opening_hours: '05:30 - 12:00, 16:00 - 21:00', location_name: 'Chennai', location_state: 'Tamil Nadu', latitude: 13.0827, longitude: 80.2707, best_season: 'Oct-Mar', avg_visit_time: '1-2 hours' },
  { id: 'plc-brihadisvara-temple', location_id: 'loc-tnj', name: 'Brihadisvara Temple (Big Temple)', category: 'historical', avg_rating: 4.9, review_count: 2, entry_fee: 0, opening_hours: '06:00 - 12:30, 16:00 - 20:30', location_name: 'Thanjavur', location_state: 'Tamil Nadu', latitude: 10.7870, longitude: 79.1378, best_season: 'Oct-Mar', avg_visit_time: '2-3 hours' },
  { id: 'plc-meenakshi-amman', location_id: 'loc-mdu', name: 'Meenakshi Amman Temple', category: 'religious', avg_rating: 4.9, review_count: 4, entry_fee: 0, opening_hours: '05:00 - 12:30, 16:00 - 22:00', location_name: 'Madurai', location_state: 'Tamil Nadu', latitude: 9.9252, longitude: 78.1198, best_season: 'Oct-Mar', avg_visit_time: '2-3 hours' },
  { id: 'plc-mamallapuram-shore', location_id: 'loc-cgl', name: 'Shore Temple & Rock Reliefs', category: 'historical', avg_rating: 4.7, review_count: 3, entry_fee: 40, opening_hours: '06:00 - 18:00', location_name: 'Chengalpattu', location_state: 'Tamil Nadu', latitude: 12.6819, longitude: 79.9888, best_season: 'Oct-Mar', avg_visit_time: '2-3 hours' },
  { id: 'plc-ooty-lake-train', location_id: 'loc-nlg', name: 'Nilgiri Mountain Railway & Doddabetta', category: 'nature', avg_rating: 4.8, review_count: 5, entry_fee: 30, opening_hours: '08:30 - 18:00', location_name: 'Nilgiris', location_state: 'Tamil Nadu', latitude: 11.4102, longitude: 76.6950, best_season: 'Oct-Jun', avg_visit_time: '3-4 hours' },
  { id: 'plc-alappuzha-backwaters', location_id: 'loc-alp', name: 'Punnamada Lake & Houseboat Route', category: 'nature', avg_rating: 4.8, review_count: 6, entry_fee: 0, opening_hours: '06:00 - 18:30', location_name: 'Alappuzha', location_state: 'Kerala', latitude: 9.4981, longitude: 76.3388, best_season: 'Sep-Mar', avg_visit_time: '4-6 hours' },
  { id: 'plc-fort-kochi', location_id: 'loc-ekm', name: 'Fort Kochi Chinese Fishing Nets', category: 'cultural', avg_rating: 4.6, review_count: 4, entry_fee: 0, opening_hours: '24 Hours', location_name: 'Ernakulam', location_state: 'Kerala', latitude: 9.9656, longitude: 76.2425, best_season: 'Oct-Feb', avg_visit_time: '1-2 hours' }
];

// Check backend health & connectivity
export async function checkBackendHealth(): Promise<{ isConnected: boolean; locationsCount: number }> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, {
      headers: defaultHeaders,
      signal: AbortSignal.timeout(3000)
    });
    if (res.ok) {
      const data = await res.json();
      return {
        isConnected: true,
        locationsCount: data.database?.locationsLoaded || 38
      };
    }
  } catch (err) {
    // Offline or server not responding
  }
  return { isConnected: false, locationsCount: FALLBACK_LOCATIONS.length };
}

// Fetch Locations (with state or query filter)
export async function fetchLocations(state?: string, search?: string): Promise<LocationItem[]> {
  try {
    const params = new URLSearchParams();
    if (state && state !== 'All') params.append('state', state);
    if (search) params.append('search', search);

    const url = `${API_BASE_URL}/locations${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await fetch(url, { headers: defaultHeaders, signal: AbortSignal.timeout(3500) });
    if (res.ok) {
      const data = await res.json();
      if (data.data && Array.isArray(data.data)) {
        return data.data;
      }
    }
  } catch (err) {
    console.warn('API fetchLocations fallback to local dataset:', err);
  }

  // Local fallback
  return FALLBACK_LOCATIONS.filter(l => {
    if (state && state !== 'All' && l.state.toLowerCase() !== state.toLowerCase()) return false;
    if (search && !l.name.toLowerCase().includes(search.toLowerCase()) && !l.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
}

// Fetch Places (by location_id, category, search, state)
export async function fetchPlaces(locationId?: string, category?: string, search?: string, state?: string): Promise<PlaceItem[]> {
  try {
    const params = new URLSearchParams();
    if (locationId && locationId !== 'all') params.append('location_id', locationId);
    if (state && state !== 'All') params.append('state', state);
    if (category && category !== 'all') params.append('category', category);
    if (search) params.append('search', search);

    const url = `${API_BASE_URL}/places${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await fetch(url, { headers: defaultHeaders, signal: AbortSignal.timeout(6000) });
    if (res.ok) {
      const data = await res.json();
      if (data.data && Array.isArray(data.data)) {
        return data.data;
      }
    }
  } catch (err) {
    console.warn('API fetchPlaces fallback to local dataset:', err);
  }

  // Local fallback
  return FALLBACK_PLACES.filter(p => {
    if (locationId && p.location_id !== locationId) return false;
    if (category && category !== 'all' && p.category !== category) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
}

// Fetch Cultural Rules by location
export async function fetchCulturalRules(locationId?: string): Promise<CulturalRuleItem[]> {
  try {
    const url = locationId ? `${API_BASE_URL}/safety/rules?location_id=${locationId}` : `${API_BASE_URL}/safety/rules`;
    const res = await fetch(url, { headers: defaultHeaders, signal: AbortSignal.timeout(3500) });
    if (res.ok) {
      const data = await res.json();
      if (data.data) return data.data;
    }
  } catch (err) {
    // Silent fallback
  }
  return [];
}

// Fetch Safety Contacts by location
export async function fetchSafetyContacts(locationId?: string): Promise<SafetyContactItem[]> {
  try {
    const url = locationId ? `${API_BASE_URL}/safety/contacts?location_id=${locationId}` : `${API_BASE_URL}/safety/contacts`;
    const res = await fetch(url, { headers: defaultHeaders, signal: AbortSignal.timeout(3500) });
    if (res.ok) {
      const data = await res.json();
      if (data.data) return data.data;
    }
  } catch (err) {
    // Silent fallback
  }
  return [];
}

// Sync & Register Tourist profile with backend MySQL database
export async function syncUserProfile(profile: any): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/register-tourist`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(profile),
      signal: AbortSignal.timeout(4000)
    });
    return res.ok;
  } catch (err) {
    return false;
  }
}

// Register or update Service Provider profile with MySQL database
export async function syncProviderProfile(provider: any): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/register-provider`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(provider),
      signal: AbortSignal.timeout(4000)
    });
    return res.ok;
  } catch (err) {
    return false;
  }
}

// Authenticate against backend MySQL database
export async function loginWithBackendAPI(identifier: string, passwordAttempt: string): Promise<any | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify({ identifier, password: passwordAttempt }),
      signal: AbortSignal.timeout(4000)
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success) return data;
    }
  } catch (err) {
    // Falls back to local offline storage authentication
  }
  return null;
}

// Trigger password reset OTP
export async function requestPasswordResetAPI(email: string): Promise<{ success: boolean; code?: string; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify({ email }),
      signal: AbortSignal.timeout(4000)
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Server offline' };
  }
}

// Complete password reset
export async function completePasswordResetAPI(email: string, code: string, newPassword: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify({ email, code, newPassword }),
      signal: AbortSignal.timeout(4000)
    });
    return res.ok;
  } catch (err) {
    return false;
  }
}

// Fetch all registered service providers from MySQL database
export async function fetchProvidersFromAPI(category?: string, city?: string): Promise<any[]> {
  try {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (city) params.append('city', city);

    const url = `${API_BASE_URL}/providers?${params.toString()}`;
    const res = await fetch(url, { headers: defaultHeaders, signal: AbortSignal.timeout(4000) });
    if (res.ok) {
      const json = await res.json();
      if (json.data && Array.isArray(json.data)) return json.data;
    }
  } catch (err) {
    // Silent fallback
  }
  return [];
}

