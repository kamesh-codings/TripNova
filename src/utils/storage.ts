import { UserProfile, TripPlan, ServiceProviderProfile } from '../types';
import { DEFAULT_USER_PROFILE } from '../data/mockData';

const PROFILE_KEY = 'tripnova_user_profile';
const PROVIDER_KEY = 'tripnova_provider_profile';
const TRIPS_KEY = 'tripnova_saved_trips';
const SOS_HISTORY_KEY = 'tripnova_sos_logs';

export const getStoredProfile = (): UserProfile => {
  try {
    const data = localStorage.getItem(PROFILE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse user profile', e);
  }
  return DEFAULT_USER_PROFILE;
};

export const saveStoredProfile = (profile: UserProfile): void => {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save user profile', e);
  }
};

export const deleteStoredProfile = (): void => {
  try {
    localStorage.removeItem(PROFILE_KEY);
  } catch (e) {
    console.error('Failed to delete user profile', e);
  }
};

export const getStoredProviderProfile = (): ServiceProviderProfile | null => {
  try {
    const data = localStorage.getItem(PROVIDER_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse provider profile', e);
  }
  return null;
};

export const saveStoredProviderProfile = (profile: ServiceProviderProfile): void => {
  try {
    localStorage.setItem(PROVIDER_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save provider profile', e);
  }
};

export const deleteStoredProviderProfile = (): void => {
  try {
    localStorage.removeItem(PROVIDER_KEY);
  } catch (e) {
    console.error('Failed to delete provider profile', e);
  }
};

export const getStoredTrips = (): TripPlan[] => {
  try {
    const data = localStorage.getItem(TRIPS_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to parse trips', e);
  }
  return [
    {
      id: 'trip_sample_01',
      title: 'Heritage & Misty Nilgiris Expedition',
      boardingPoint: 'Chennai Central',
      destination: 'Ooty & Madurai Heritage Circuit',
      transportMode: 'Train',
      startDate: '2026-09-12',
      endDate: '2026-09-16',
      durationDays: 5,
      budgetType: 'suggested',
      budgetAmount: 18500,
      suggestedBudgetBreakdown: {
        travel: 4500,
        stay: 7000,
        food: 3500,
        activities: 2000,
        buffer: 1500
      },
      selectedSpots: [
        'Brihadeeswarar Temple',
        'Meenakshi Amman Temple',
        'Ooty Nilgiri Mountain Toy Train',
        'Doddabetta Peak'
      ],
      selectedResidencies: ['Savoy - IHCL Heritage Hotel', 'Heritage Madurai Resort'],
      itinerary: [
        {
          id: 'it_1',
          day: 1,
          time: '06:30 AM',
          title: 'Departure & Morning Temple Tour',
          description: 'Board morning Vande Bharat express to Thanjavur / Madurai. Visit Great Living Chola temple complex.',
          spotName: 'Brihadeeswarar Temple',
          residencyName: 'Hotel Sangam Heritage',
          transportNotes: 'Express Train + Pre-booked AC Cab',
          estimatedCost: 2800,
          weatherForecast: { temp: '31°C', condition: 'Sunny & Clear' }
        },
        {
          id: 'it_2',
          day: 2,
          time: '08:00 AM',
          title: 'Madurai Cultural Walk & Night Ceremony',
          description: 'Experience Meenakshi Amman temple thousand-pillar hall and evening golden chariot procession.',
          spotName: 'Meenakshi Amman Temple',
          residencyName: 'Heritage Madurai Resort',
          transportNotes: 'Official Prepaid Auto',
          estimatedCost: 1900,
          weatherForecast: { temp: '33°C', condition: 'Warm / Clear' }
        },
        {
          id: 'it_3',
          day: 3,
          time: '09:00 AM',
          title: 'Ascent to Nilgiri Hills via Toy Train',
          description: 'Scenic climb through pine forests and tea estates. Check into mountain cottage.',
          spotName: 'Ooty Mountain Railway & Tea Museum',
          residencyName: 'Savoy Heritage Cottage',
          transportNotes: 'UNESCO Heritage Mountain Steam Train',
          estimatedCost: 3500,
          weatherForecast: { temp: '16°C', condition: 'Mist & Light Drizzle', alert: 'Carry Warm Fleece & Rain Gear' }
        }
      ],
      createdAt: '2026-09-01',
      status: 'ongoing'
    }
  ];
};

export const saveStoredTrips = (trips: TripPlan[]): void => {
  try {
    localStorage.setItem(TRIPS_KEY, JSON.stringify(trips));
  } catch (e) {
    console.error('Failed to save trips', e);
  }
};

export const logSOSEvent = (details: { timestamp: string; location: string; note: string }) => {
  try {
    const existing = JSON.parse(localStorage.getItem(SOS_HISTORY_KEY) || '[]');
    existing.unshift(details);
    localStorage.setItem(SOS_HISTORY_KEY, JSON.stringify(existing.slice(0, 20)));
  } catch (e) {
    console.error('Failed to log SOS event', e);
  }
};
