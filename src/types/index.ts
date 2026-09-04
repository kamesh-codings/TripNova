export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'Unknown';

export interface TrustedContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  isPrimary?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  dob: string;
  age: number;
  gender: 'Male' | 'Female' | 'Non-Binary' | 'Prefer not to say';
  bloodGroup: BloodGroup;
  allergies: string; // e.g. "Peanuts, Penicillin, Dust"
  medicalConditions: string; // e.g. "Asthma, Diabetes"
  disability: string; // e.g. "Wheelchair accessible needed" or "None"
  address: string;
  govtIdType: 'Aadhaar Card' | 'Passport' | 'Driving License' | 'Voter ID';
  govtIdNumber: string;
  govtIdState: string; // e.g. "Tamil Nadu (TN), India"
  languagesKnown: string[]; // e.g. ["English", "Tamil", "Hindi"]
  trustedContacts: TrustedContact[]; // 5 trusted contacts
  interestedTopPicks: string[]; // e.g. ["Heritage & Temples", "Hill Stations", "Beach & Coastal", "Adventure", "Food & Culture"]
  isRegistered: boolean;
}

export type TransportMode = 'Flight' | 'Train' | 'Bus' | 'Cab / Taxi' | 'Self-Drive / Rental';

export interface ItineraryItem {
  id: string;
  day: number;
  time: string;
  title: string;
  description: string;
  spotName: string;
  residencyName?: string;
  transportNotes?: string;
  estimatedCost: number;
  weatherForecast?: {
    temp: string;
    condition: string;
    alert?: string;
  };
}

export interface LocalGuide {
  id: string;
  name: string;
  photo: string;
  location: string;
  languages: string[];
  rating: number;
  reviewsCount: number;
  specialty: string;
  hourlyRate: number;
  phone: string;
  verified: boolean;
  bio: string;
}

export interface TripPlan {
  id: string;
  title: string;
  boardingPoint: string;
  destination: string;
  transportMode: TransportMode;
  startDate: string;
  endDate: string;
  durationDays: number;
  budgetType: 'manual' | 'suggested';
  budgetAmount: number;
  suggestedBudgetBreakdown?: {
    travel: number;
    stay: number;
    food: number;
    activities: number;
    buffer: number;
  };
  selectedSpots: string[];
  selectedResidencies: string[];
  itinerary: ItineraryItem[];
  assignedGuide?: LocalGuide;
  createdAt: string;
  status: 'planning' | 'ongoing' | 'completed';
}

export interface EmergencyPhrase {
  id: string;
  category: 'medical' | 'police' | 'direction' | 'urgent';
  english: string;
  tamil: string;
  hindi: string;
  french: string;
  spanish: string;
  audioPrompt: string; // Phonetic or spoken text
  importance: 'critical' | 'high' | 'normal';
}

export interface SafetyPlace {
  id: string;
  type: 'hospital' | 'police' | 'pharmacy';
  name: string;
  address: string;
  phone: string;
  emergencyHotline: string;
  distanceKm: number;
  rating: number;
  openHours: string;
  verified: boolean;
}

export interface CountryRule {
  country: string;
  flag: string;
  emergencyNumbers: {
    police: string;
    ambulance: string;
    fire: string;
    universal: string;
  };
  timezone: string;
  gmtOffset: string;
  currencyCode: string;
  currencySymbol: string;
  exchangeRateToINR: number;
  keyRegulations: string[];
  culturalEtiquette: string[];
  scamAlerts: string[];
}

export interface VehicleFareEstimate {
  vehicleType: string;
  baseFare: number;
  ratePerKm: number;
  minimumFare: number;
  nightSurchargeMultiplier: number;
  description: string;
}
