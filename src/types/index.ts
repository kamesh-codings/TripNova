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
  username?: string;
  password?: string;
  email?: string;
  googleId?: string;
  avatarUrl?: string;
  nativeCurrency?: string; // Default: 'INR'
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
  preferredLanguage?: string; // e.g. "English" or "Tamil"
  currentLocation?: string; // e.g. "Chennai, Tamil Nadu, India"
  locationCoordinates?: { latitude: number; longitude: number };
  trustedContacts: TrustedContact[]; // 5 trusted contacts
  interestedTopPicks: string[]; // e.g. ["Heritage & Temples", "Hill Stations", "Beach & Coastal", "Adventure", "Food & Culture"]
  isRegistered: boolean;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  country: string;
  formattedAddress: string;
  timestamp: string;
  isApproximate?: boolean;
}

export type ProviderCategory = 
  | 'transport'
  | 'tour_guide'
  | 'homestay'
  | 'emergency_medical'
  | 'rental_agency';

export interface BaseProviderInfo {
  id: string;
  providerName: string;
  businessName: string;
  username?: string;
  password?: string;
  email: string;
  phone: string;
  category: ProviderCategory;
  operatingCity: string;
  operatingState: string;
  nativeCurrency: string;
  isVerified: boolean;
  registeredAt: string;
}

// Category 1: Transport & Drivers
export interface TransportProviderDetails {
  vehicleType: 'Auto Rickshaw' | 'Sedan Cab' | 'SUV' | 'Tourist Van / Bus' | 'Bike Taxi';
  vehicleRegNumber: string;
  driverLicenseNumber: string;
  commercialBadgeNumber: string;
  operatingStand: string;
  baseTariffPerKm: number;
  hasAC: boolean;
  seatingCapacity: number;
}

// Category 2: Tour Guides
export interface TourGuideDetails {
  guideLicenseType: 'Govt Certified National Guide' | 'State Tourism Guide' | 'Local Heritage Expert';
  guideBadgeNumber: string;
  specialization: 'Heritage & Temples' | 'Hill Stations & Treks' | 'Wildlife & Eco-Tour' | 'Food & Culture';
  languagesSpoken: string[];
  experienceYears: number;
  hourlyRate: number;
  dailyRate: number;
  hasFirstAidCert: boolean;
}

// Category 3: Homestay & Hospitality
export interface HomestayDetails {
  propertyType: 'Heritage Cottage' | 'Mountain Villa' | 'Traditional Homestay' | 'Eco-Camp / Resort';
  homestayRegNumber: string;
  totalRooms: number;
  amenities: string[];
  nightlyRateMin: number;
  nightlyRateMax: number;
  address: string;
  fssaiLicense?: string;
}

// Category 4: Emergency & Medical Assistance
export interface EmergencyMedicalDetails {
  serviceType: 'Private Ambulance Operator' | '24/7 Urgent Clinic / Hospital' | '24/7 Pharmacy' | 'Emergency Rescue Unit';
  medicalLicenseNumber: string;
  emergencyHotline: string;
  availableVehiclesOrBeds: number;
  serviceRadiusKm: number;
  equipmentSupported: string[];
}

// Category 5: Rental & Activity Agency
export interface RentalAgencyDetails {
  agencyType: 'Trekking & Camping Gear' | 'Two-Wheeler & Bicycle Rental' | 'Boating & Safari Agency';
  gstOrMsmeNumber: string;
  itemsOffered: string[];
  insuranceIncluded: boolean;
}

export interface ServiceProviderProfile extends BaseProviderInfo {
  transportDetails?: TransportProviderDetails;
  tourGuideDetails?: TourGuideDetails;
  homestayDetails?: HomestayDetails;
  emergencyMedicalDetails?: EmergencyMedicalDetails;
  rentalAgencyDetails?: RentalAgencyDetails;
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
