import { UserProfile, TripPlan, ServiceProviderProfile } from '../types';
import { DEFAULT_USER_PROFILE } from '../data/mockData';

const PROFILE_KEY = 'tripnova_user_profile';
const PROVIDER_KEY = 'tripnova_provider_profile';
const USERS_LIST_KEY = 'tripnova_registered_users_list';
const PROVIDERS_LIST_KEY = 'tripnova_registered_providers_list';
const TRIPS_KEY = 'tripnova_saved_trips';
const SOS_HISTORY_KEY = 'tripnova_sos_logs';

export const getAllRegisteredUsers = (): UserProfile[] => {
  try {
    const data = localStorage.getItem(USERS_LIST_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to parse users list', e);
  }
  return [];
};

export const getAllRegisteredProviders = (): ServiceProviderProfile[] => {
  try {
    const data = localStorage.getItem(PROVIDERS_LIST_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to parse providers list', e);
  }
  return [];
};

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

    // Also persist in users registry
    if (profile.isRegistered && (profile.username || profile.email)) {
      const allUsers = getAllRegisteredUsers();
      const existingIdx = allUsers.findIndex(u => 
        (profile.username && u.username?.toLowerCase() === profile.username.toLowerCase()) || 
        (profile.email && u.email?.toLowerCase() === profile.email.toLowerCase()) ||
        u.id === profile.id
      );
      if (existingIdx >= 0) {
        allUsers[existingIdx] = profile;
      } else {
        allUsers.push(profile);
      }
      localStorage.setItem(USERS_LIST_KEY, JSON.stringify(allUsers));
    }
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

    // Also persist in providers registry
    if (profile.username || profile.email) {
      const allProviders = getAllRegisteredProviders();
      const existingIdx = allProviders.findIndex(p => 
        (profile.username && p.username?.toLowerCase() === profile.username.toLowerCase()) || 
        (profile.email && p.email?.toLowerCase() === profile.email.toLowerCase()) ||
        p.id === profile.id
      );
      if (existingIdx >= 0) {
        allProviders[existingIdx] = profile;
      } else {
        allProviders.push(profile);
      }
      localStorage.setItem(PROVIDERS_LIST_KEY, JSON.stringify(allProviders));
    }
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

/**
 * Authenticate either Tourist or Service Provider using Username/Email and Password
 */
export const authenticateAccount = (
  identifier: string,
  passwordAttempt: string
): { type: 'tourist'; profile: UserProfile } | { type: 'provider'; profile: ServiceProviderProfile } | null => {
  const cleanId = identifier.trim().toLowerCase();
  const cleanPass = passwordAttempt.trim();

  // 1. Check current active tourist profile
  const activeTourist = getStoredProfile();
  if (activeTourist.isRegistered && cleanPass) {
    const matchesUser = activeTourist.username?.toLowerCase() === cleanId || activeTourist.email?.toLowerCase() === cleanId;
    if (matchesUser && (!activeTourist.password || activeTourist.password === cleanPass)) {
      return { type: 'tourist', profile: activeTourist };
    }
  }

  // 2. Check registered tourist registry
  const allUsers = getAllRegisteredUsers();
  const foundUser = allUsers.find(u => 
    u.username?.toLowerCase() === cleanId || u.email?.toLowerCase() === cleanId
  );
  if (foundUser && (!foundUser.password || foundUser.password === cleanPass)) {
    return { type: 'tourist', profile: foundUser };
  }

  // 3. Check current active provider profile
  const activeProvider = getStoredProviderProfile();
  if (activeProvider && cleanPass) {
    const matchesProvider = activeProvider.username?.toLowerCase() === cleanId || activeProvider.email?.toLowerCase() === cleanId;
    if (matchesProvider && (!activeProvider.password || activeProvider.password === cleanPass)) {
      return { type: 'provider', profile: activeProvider };
    }
  }

  // 4. Check registered provider registry
  const allProviders = getAllRegisteredProviders();
  const foundProvider = allProviders.find(p => 
    p.username?.toLowerCase() === cleanId || p.email?.toLowerCase() === cleanId
  );
  if (foundProvider && (!foundProvider.password || foundProvider.password === cleanPass)) {
    return { type: 'provider', profile: foundProvider };
  }

  return null;
};

/**
 * Find account by email for password reset flow
 */
export const findAccountByEmail = (
  email: string
): { type: 'tourist'; profile: UserProfile } | { type: 'provider'; profile: ServiceProviderProfile } | null => {
  const cleanEmail = email.trim().toLowerCase();

  const allUsers = getAllRegisteredUsers();
  const activeUser = getStoredProfile();
  if (activeUser.isRegistered && activeUser.email?.toLowerCase() === cleanEmail) {
    return { type: 'tourist', profile: activeUser };
  }
  const foundUser = allUsers.find(u => u.email?.toLowerCase() === cleanEmail);
  if (foundUser) return { type: 'tourist', profile: foundUser };

  const activeProvider = getStoredProviderProfile();
  if (activeProvider && activeProvider.email?.toLowerCase() === cleanEmail) {
    return { type: 'provider', profile: activeProvider };
  }
  const allProviders = getAllRegisteredProviders();
  const foundProvider = allProviders.find(p => p.email?.toLowerCase() === cleanEmail);
  if (foundProvider) return { type: 'provider', profile: foundProvider };

  return null;
};

/**
 * Update password for an account matching given email
 */
export const updateAccountPassword = (email: string, newPassword: string): boolean => {
  const cleanEmail = email.trim().toLowerCase();
  let updated = false;

  // Check tourist active
  const activeUser = getStoredProfile();
  if (activeUser.isRegistered && activeUser.email?.toLowerCase() === cleanEmail) {
    activeUser.password = newPassword;
    saveStoredProfile(activeUser);
    updated = true;
  }

  // Check tourist registry
  const allUsers = getAllRegisteredUsers();
  const userIdx = allUsers.findIndex(u => u.email?.toLowerCase() === cleanEmail);
  if (userIdx >= 0) {
    allUsers[userIdx].password = newPassword;
    localStorage.setItem(USERS_LIST_KEY, JSON.stringify(allUsers));
    updated = true;
  }

  // Check provider active
  const activeProvider = getStoredProviderProfile();
  if (activeProvider && activeProvider.email?.toLowerCase() === cleanEmail) {
    activeProvider.password = newPassword;
    saveStoredProviderProfile(activeProvider);
    updated = true;
  }

  // Check provider registry
  const allProviders = getAllRegisteredProviders();
  const provIdx = allProviders.findIndex(p => p.email?.toLowerCase() === cleanEmail);
  if (provIdx >= 0) {
    allProviders[provIdx].password = newPassword;
    localStorage.setItem(PROVIDERS_LIST_KEY, JSON.stringify(allProviders));
    updated = true;
  }

  return updated;
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
