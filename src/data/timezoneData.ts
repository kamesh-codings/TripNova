/**
 * Comprehensive Global Timezone Database
 * Covering all 195 UN-recognized & global countries,
 * all 38 UTC Offset bands (UTC-12 to UTC+14),
 * and exact IANA Timezone Identifiers.
 */

export interface TimezoneSubZone {
  name: string;
  tzId: string;
  offset: string;
}

export interface CountryTimezoneInfo {
  id: number;
  name: string;
  flag: string;
  continent: 'Asia' | 'Europe' | 'Americas' | 'Africa' | 'Oceania';
  utcOffset: string;
  timezoneName: string;
  primaryTzId: string;
  subZones?: TimezoneSubZone[];
  capitalOrMajorCity: string;
}

export interface UtcOffsetBand {
  offset: string;
  examplePlace: string;
  numericOffset: number; // in hours, e.g. 5.5 for UTC+5:30
}

export const UTC_OFFSET_BANDS: UtcOffsetBand[] = [
  { offset: 'UTC−12', examplePlace: 'Baker Island, Howland Island', numericOffset: -12 },
  { offset: 'UTC−11', examplePlace: 'American Samoa, Niue', numericOffset: -11 },
  { offset: 'UTC−10', examplePlace: 'Hawaii (USA), Tahiti', numericOffset: -10 },
  { offset: 'UTC−9:30', examplePlace: 'Marquesas Islands (French Polynesia)', numericOffset: -9.5 },
  { offset: 'UTC−9', examplePlace: 'Alaska (USA), Gambier Islands', numericOffset: -9 },
  { offset: 'UTC−8', examplePlace: 'Pacific US/Canada (Los Angeles, Vancouver)', numericOffset: -8 },
  { offset: 'UTC−7', examplePlace: 'Mountain US/Canada (Denver, Edmonton, Phoenix)', numericOffset: -7 },
  { offset: 'UTC−6', examplePlace: 'Central US/Mexico (Chicago, Mexico City)', numericOffset: -6 },
  { offset: 'UTC−5', examplePlace: 'Eastern US/Central America (New York, Toronto, Bogota)', numericOffset: -5 },
  { offset: 'UTC−4', examplePlace: 'Atlantic US/Canada, Caribbean (Santiago, Santo Domingo)', numericOffset: -4 },
  { offset: 'UTC−3:30', examplePlace: 'Newfoundland (Canada)', numericOffset: -3.5 },
  { offset: 'UTC−3', examplePlace: 'Argentina, parts of Brazil (Buenos Aires, São Paulo)', numericOffset: -3 },
  { offset: 'UTC−2', examplePlace: 'Fernando de Noronha (Brazil), South Georgia', numericOffset: -2 },
  { offset: 'UTC−1', examplePlace: 'Cabo Verde, Azores (Portugal)', numericOffset: -1 },
  { offset: 'UTC±0', examplePlace: 'UK, Ireland, Iceland, Ghana, Senegal, Portugal', numericOffset: 0 },
  { offset: 'UTC+1', examplePlace: 'Central/Western Europe (France, Germany, Italy, Spain, Nigeria)', numericOffset: 1 },
  { offset: 'UTC+2', examplePlace: 'Eastern Europe, South Africa, Egypt, Greece, Israel', numericOffset: 2 },
  { offset: 'UTC+3', examplePlace: 'East Africa, Saudi Arabia, Russia (Moscow), Turkey, Kenya', numericOffset: 3 },
  { offset: 'UTC+3:30', examplePlace: 'Iran (Tehran)', numericOffset: 3.5 },
  { offset: 'UTC+4', examplePlace: 'UAE (Dubai), Oman, Georgia, Azerbaijan, Mauritius', numericOffset: 4 },
  { offset: 'UTC+4:30', examplePlace: 'Afghanistan (Kabul)', numericOffset: 4.5 },
  { offset: 'UTC+5', examplePlace: 'Pakistan (Karachi), Uzbekistan, Kazakhstan, Maldives', numericOffset: 5 },
  { offset: 'UTC+5:30', examplePlace: 'India (Chennai, Delhi, Mumbai), Sri Lanka (Colombo)', numericOffset: 5.5 },
  { offset: 'UTC+5:45', examplePlace: 'Nepal (Kathmandu)', numericOffset: 5.75 },
  { offset: 'UTC+6', examplePlace: 'Bangladesh (Dhaka), Bhutan (Thimphu)', numericOffset: 6 },
  { offset: 'UTC+6:30', examplePlace: 'Myanmar (Yangon), Cocos Islands', numericOffset: 6.5 },
  { offset: 'UTC+7', examplePlace: 'Thailand (Bangkok), Vietnam (Hanoi), Indonesia (Jakarta)', numericOffset: 7 },
  { offset: 'UTC+8', examplePlace: 'China (Beijing), Singapore, Malaysia, Western Australia (Perth)', numericOffset: 8 },
  { offset: 'UTC+8:45', examplePlace: 'Western Australia - Eucla & Border Region', numericOffset: 8.75 },
  { offset: 'UTC+9', examplePlace: 'Japan (Tokyo), South Korea (Seoul), Eastern Indonesia', numericOffset: 9 },
  { offset: 'UTC+9:30', examplePlace: 'Central Australia (Adelaide, Darwin)', numericOffset: 9.5 },
  { offset: 'UTC+10', examplePlace: 'Eastern Australia (Sydney, Melbourne, Brisbane), Guam', numericOffset: 10 },
  { offset: 'UTC+10:30', examplePlace: 'Lord Howe Island (Australia)', numericOffset: 10.5 },
  { offset: 'UTC+11', examplePlace: 'Solomon Islands, Vanuatu, New Caledonia, Russia (Vladivostok)', numericOffset: 11 },
  { offset: 'UTC+12', examplePlace: 'New Zealand (Auckland), Fiji (Suva), Marshall Islands', numericOffset: 12 },
  { offset: 'UTC+12:45', examplePlace: 'Chatham Islands (New Zealand)', numericOffset: 12.75 },
  { offset: 'UTC+13', examplePlace: 'Tonga (Nukuʻalofa), Samoa (Apia), Tokelau', numericOffset: 13 },
  { offset: 'UTC+14', examplePlace: 'Kiribati - Line Islands & Kiritimati (Earliest Time on Earth)', numericOffset: 14 }
];

export const MULTI_TIMEZONE_COUNTRIES_OVERVIEW = [
  { country: 'France', flag: '🇫🇷', zonesCount: 12, note: 'Includes overseas territories from Tahiti (UTC-10) to Réunion (UTC+4)' },
  { country: 'Russia', flag: '🇷🇺', zonesCount: 11, note: 'Spans Kaliningrad (UTC+2) to Kamchatka (UTC+12)' },
  { country: 'United States', flag: '🇺🇸', zonesCount: 11, note: 'Spans Samoa/Hawaii (UTC-11/-10) to Eastern/Virgin Islands (UTC-5/-4)' },
  { country: 'Australia', flag: '🇦🇺', zonesCount: 9, note: 'Spans Western (UTC+8), Central (UTC+9:30), Eastern (UTC+10), and Lord Howe (UTC+10:30)' },
  { country: 'United Kingdom', flag: '🇬🇧', zonesCount: 9, note: 'Includes overseas territories from Pitcairn (UTC-8) to GMT/BST' },
  { country: 'Canada', flag: '🇨🇦', zonesCount: 6, note: 'Spans Pacific (UTC-8) to Newfoundland (UTC-3:30)' },
  { country: 'Denmark', flag: '🇩🇰', zonesCount: 5, note: 'Includes Greenland (UTC-3 to UTC-1), Faroe Islands (UTC+0), Copenhagen (UTC+1/+2)' },
  { country: 'New Zealand', flag: '🇳🇿', zonesCount: 5, note: 'Includes Auckland (UTC+12), Chatham (UTC+12:45), Tokelau (UTC+13), Cook Islands (UTC-10)' },
  { country: 'Brazil', flag: '🇧🇷', zonesCount: 4, note: 'Spans Acre (UTC-5), Amazon (UTC-4), Brasília (UTC-3), Noronha (UTC-2)' },
  { country: 'Mexico', flag: '🇲🇽', zonesCount: 4, note: 'Spans Northwest (UTC-8), Pacific (UTC-7), Central (UTC-6), Eastern (UTC-5)' },
  { country: 'Chile', flag: '🇨🇱', zonesCount: 3, note: 'Easter Island (UTC-6), Continental (UTC-4/-3), Magallanes (UTC-3)' },
  { country: 'Indonesia', flag: '🇮🇩', zonesCount: 3, note: 'Western WIB (UTC+7), Central WITA (UTC+8), Eastern WIT (UTC+9)' },
  { country: 'Kiribati', flag: '🇰🇮', zonesCount: 3, note: 'Gilbert (UTC+12), Phoenix (UTC+13), Line Islands (UTC+14)' }
];

export const GLOBAL_195_COUNTRIES: CountryTimezoneInfo[] = [
  {
    id: 1,
    name: 'Afghanistan',
    flag: '🇦🇫',
    continent: 'Asia',
    utcOffset: 'UTC+04:30',
    timezoneName: 'Afghanistan Time (AFT)',
    primaryTzId: 'Asia/Kabul',
    capitalOrMajorCity: 'Kabul'
  },
  {
    id: 2,
    name: 'Albania',
    flag: '🇦🇱',
    continent: 'Europe',
    utcOffset: 'UTC+01:00 / +02:00',
    timezoneName: 'Central European Summer Time (CEST)',
    primaryTzId: 'Europe/Tirane',
    capitalOrMajorCity: 'Tirana'
  },
  {
    id: 3,
    name: 'Algeria',
    flag: '🇩🇿',
    continent: 'Africa',
    utcOffset: 'UTC+01:00',
    timezoneName: 'Central European Time (CET)',
    primaryTzId: 'Africa/Algiers',
    capitalOrMajorCity: 'Algiers'
  },
  {
    id: 4,
    name: 'Andorra',
    flag: '🇦🇩',
    continent: 'Europe',
    utcOffset: 'UTC+01:00 / +02:00',
    timezoneName: 'Central European Summer Time (CEST)',
    primaryTzId: 'Europe/Andorra',
    capitalOrMajorCity: 'Andorra la Vella'
  },
  {
    id: 5,
    name: 'Angola',
    flag: '🇦🇴',
    continent: 'Africa',
    utcOffset: 'UTC+01:00',
    timezoneName: 'West Africa Time (WAT)',
    primaryTzId: 'Africa/Luanda',
    capitalOrMajorCity: 'Luanda'
  },
  {
    id: 6,
    name: 'Antigua and Barbuda',
    flag: '🇦🇬',
    continent: 'Americas',
    utcOffset: 'UTC−04:00',
    timezoneName: 'Atlantic Standard Time (AST)',
    primaryTzId: 'America/Port_of_Spain',
    capitalOrMajorCity: "St. John's"
  },
  {
    id: 7,
    name: 'Argentina',
    flag: '🇦🇷',
    continent: 'Americas',
    utcOffset: 'UTC−03:00',
    timezoneName: 'Argentina Time (ART)',
    primaryTzId: 'America/Argentina/Buenos_Aires',
    capitalOrMajorCity: 'Buenos Aires'
  },
  {
    id: 8,
    name: 'Armenia',
    flag: '🇦🇲',
    continent: 'Asia',
    utcOffset: 'UTC+04:00',
    timezoneName: 'Armenia Time (AMT)',
    primaryTzId: 'Asia/Yerevan',
    capitalOrMajorCity: 'Yerevan'
  },
  {
    id: 9,
    name: 'Australia',
    flag: '🇦🇺',
    continent: 'Oceania',
    utcOffset: 'UTC+08:00 to +10:30',
    timezoneName: 'Australian Western / Central / Eastern Time',
    primaryTzId: 'Australia/Sydney',
    capitalOrMajorCity: 'Canberra & Sydney',
    subZones: [
      { name: 'Eastern (Sydney, Melbourne, Canberra)', tzId: 'Australia/Sydney', offset: 'UTC+10:00' },
      { name: 'Brisbane (Queensland - No DST)', tzId: 'Australia/Brisbane', offset: 'UTC+10:00' },
      { name: 'Central (Adelaide - South Australia)', tzId: 'Australia/Adelaide', offset: 'UTC+09:30' },
      { name: 'Northern Territory (Darwin)', tzId: 'Australia/Darwin', offset: 'UTC+09:30' },
      { name: 'Western Australia (Perth)', tzId: 'Australia/Perth', offset: 'UTC+08:00' },
      { name: 'Eucla Border Region', tzId: 'Australia/Eucla', offset: 'UTC+08:45' },
      { name: 'Lord Howe Island', tzId: 'Australia/Lord_Howe', offset: 'UTC+10:30' },
      { name: 'Hobart (Tasmania)', tzId: 'Australia/Hobart', offset: 'UTC+10:00' }
    ]
  },
  {
    id: 10,
    name: 'Austria',
    flag: '🇦🇹',
    continent: 'Europe',
    utcOffset: 'UTC+01:00 / +02:00',
    timezoneName: 'Central European Summer Time (CEST)',
    primaryTzId: 'Europe/Vienna',
    capitalOrMajorCity: 'Vienna'
  },
  {
    id: 11,
    name: 'Azerbaijan',
    flag: '🇦🇿',
    continent: 'Asia',
    utcOffset: 'UTC+04:00',
    timezoneName: 'Azerbaijan Time (AZT)',
    primaryTzId: 'Asia/Baku',
    capitalOrMajorCity: 'Baku'
  },
  {
    id: 12,
    name: 'Bahamas',
    flag: '🇧🇸',
    continent: 'Americas',
    utcOffset: 'UTC−05:00 / −04:00',
    timezoneName: 'Eastern Daylight Time (EDT)',
    primaryTzId: 'America/Nassau',
    capitalOrMajorCity: 'Nassau'
  },
  {
    id: 13,
    name: 'Bahrain',
    flag: '🇧🇭',
    continent: 'Asia',
    utcOffset: 'UTC+03:00',
    timezoneName: 'Arabian Standard Time (AST)',
    primaryTzId: 'Asia/Bahrain',
    capitalOrMajorCity: 'Manama'
  },
  {
    id: 14,
    name: 'Bangladesh',
    flag: '🇧🇩',
    continent: 'Asia',
    utcOffset: 'UTC+06:00',
    timezoneName: 'Bangladesh Standard Time (BST)',
    primaryTzId: 'Asia/Dhaka',
    capitalOrMajorCity: 'Dhaka'
  },
  {
    id: 15,
    name: 'Barbados',
    flag: '🇧🇧',
    continent: 'Americas',
    utcOffset: 'UTC−04:00',
    timezoneName: 'Atlantic Standard Time (AST)',
    primaryTzId: 'America/Barbados',
    capitalOrMajorCity: 'Bridgetown'
  },
  {
    id: 16,
    name: 'Belarus',
    flag: '🇧🇾',
    continent: 'Europe',
    utcOffset: 'UTC+03:00',
    timezoneName: 'Moscow Standard Time (MSK)',
    primaryTzId: 'Europe/Minsk',
    capitalOrMajorCity: 'Minsk'
  },
  {
    id: 17,
    name: 'Belgium',
    flag: '🇧🇪',
    continent: 'Europe',
    utcOffset: 'UTC+01:00 / +02:00',
    timezoneName: 'Central European Summer Time (CEST)',
    primaryTzId: 'Europe/Brussels',
    capitalOrMajorCity: 'Brussels'
  },
  {
    id: 18,
    name: 'Belize',
    flag: '🇧🇿',
    continent: 'Americas',
    utcOffset: 'UTC−06:00',
    timezoneName: 'Central Standard Time (CST)',
    primaryTzId: 'America/Belize',
    capitalOrMajorCity: 'Belmopan'
  },
  {
    id: 19,
    name: 'Benin',
    flag: '🇧🇯',
    continent: 'Africa',
    utcOffset: 'UTC+01:00',
    timezoneName: 'West Africa Time (WAT)',
    primaryTzId: 'Africa/Porto-Novo',
    capitalOrMajorCity: 'Porto-Novo'
  },
  {
    id: 20,
    name: 'Bhutan',
    flag: '🇧🇹',
    continent: 'Asia',
    utcOffset: 'UTC+06:00',
    timezoneName: 'Bhutan Time (BTT)',
    primaryTzId: 'Asia/Thimphu',
    capitalOrMajorCity: 'Thimphu'
  },
  {
    id: 21,
    name: 'Bolivia',
    flag: '🇧🇴',
    continent: 'Americas',
    utcOffset: 'UTC−04:00',
    timezoneName: 'Bolivia Time (BOT)',
    primaryTzId: 'America/La_Paz',
    capitalOrMajorCity: 'La Paz & Sucre'
  },
  {
    id: 22,
    name: 'Bosnia and Herzegovina',
    flag: '🇧🇦',
    continent: 'Europe',
    utcOffset: 'UTC+01:00 / +02:00',
    timezoneName: 'Central European Summer Time (CEST)',
    primaryTzId: 'Europe/Sarajevo',
    capitalOrMajorCity: 'Sarajevo'
  },
  {
    id: 23,
    name: 'Botswana',
    flag: '🇧🇼',
    continent: 'Africa',
    utcOffset: 'UTC+02:00',
    timezoneName: 'Central Africa Time (CAT)',
    primaryTzId: 'Africa/Gaborone',
    capitalOrMajorCity: 'Gaborone'
  },
  {
    id: 24,
    name: 'Brazil',
    flag: '🇧🇷',
    continent: 'Americas',
    utcOffset: 'UTC−05:00 to −02:00',
    timezoneName: 'Acre / Amazon / Brasília / Noronha Time',
    primaryTzId: 'America/Sao_Paulo',
    capitalOrMajorCity: 'Brasília & São Paulo',
    subZones: [
      { name: 'Brasília / São Paulo / Rio', tzId: 'America/Sao_Paulo', offset: 'UTC−03:00' },
      { name: 'Amazon (Manaus)', tzId: 'America/Manaus', offset: 'UTC−04:00' },
      { name: 'Acre (Rio Branco)', tzId: 'America/Rio_Branco', offset: 'UTC−05:00' },
      { name: 'Fernando de Noronha', tzId: 'America/Noronha', offset: 'UTC−02:00' }
    ]
  },
  {
    id: 25,
    name: 'Brunei',
    flag: '🇧🇳',
    continent: 'Asia',
    utcOffset: 'UTC+08:00',
    timezoneName: 'Brunei Darussalam Time (BNT)',
    primaryTzId: 'Asia/Brunei',
    capitalOrMajorCity: 'Bandar Seri Begawan'
  },
  {
    id: 26,
    name: 'Bulgaria',
    flag: '🇧🇬',
    continent: 'Europe',
    utcOffset: 'UTC+02:00 / +03:00',
    timezoneName: 'Eastern European Summer Time (EEST)',
    primaryTzId: 'Europe/Sofia',
    capitalOrMajorCity: 'Sofia'
  },
  {
    id: 27,
    name: 'Burkina Faso',
    flag: '🇧🇫',
    continent: 'Africa',
    utcOffset: 'UTC+00:00',
    timezoneName: 'Greenwich Mean Time (GMT)',
    primaryTzId: 'Africa/Ouagadougou',
    capitalOrMajorCity: 'Ouagadougou'
  },
  {
    id: 28,
    name: 'Burundi',
    flag: '🇧🇮',
    continent: 'Africa',
    utcOffset: 'UTC+02:00',
    timezoneName: 'Central Africa Time (CAT)',
    primaryTzId: 'Africa/Bujumbura',
    capitalOrMajorCity: 'Gitega'
  },
  {
    id: 29,
    name: 'Cabo Verde',
    flag: '🇨🇻',
    continent: 'Africa',
    utcOffset: 'UTC−01:00',
    timezoneName: 'Cape Verde Time (CVT)',
    primaryTzId: 'Atlantic/Cape_Verde',
    capitalOrMajorCity: 'Praia'
  },
  {
    id: 30,
    name: 'Cambodia',
    flag: '🇰🇭',
    continent: 'Asia',
    utcOffset: 'UTC+07:00',
    timezoneName: 'Indochina Time (ICT)',
    primaryTzId: 'Asia/Phnom_Penh',
    capitalOrMajorCity: 'Phnom Penh'
  },
  {
    id: 31,
    name: 'Cameroon',
    flag: '🇨🇲',
    continent: 'Africa',
    utcOffset: 'UTC+01:00',
    timezoneName: 'West Africa Time (WAT)',
    primaryTzId: 'Africa/Douala',
    capitalOrMajorCity: 'Yaoundé'
  },
  {
    id: 32,
    name: 'Canada',
    flag: '🇨🇦',
    continent: 'Americas',
    utcOffset: 'UTC−08:00 to −03:30',
    timezoneName: 'Pacific / Mountain / Central / Eastern / Atlantic / Newfoundland',
    primaryTzId: 'America/Toronto',
    capitalOrMajorCity: 'Ottawa & Toronto',
    subZones: [
      { name: 'Eastern (Toronto, Montreal, Ottawa)', tzId: 'America/Toronto', offset: 'UTC−05:00 / −04:00' },
      { name: 'Pacific (Vancouver)', tzId: 'America/Vancouver', offset: 'UTC−08:00 / −07:00' },
      { name: 'Mountain (Calgary, Edmonton)', tzId: 'America/Edmonton', offset: 'UTC−07:00 / −06:00' },
      { name: 'Central (Winnipeg)', tzId: 'America/Winnipeg', offset: 'UTC−06:00 / −05:00' },
      { name: 'Atlantic (Halifax)', tzId: 'America/Halifax', offset: 'UTC−04:00 / −03:00' },
      { name: 'Newfoundland (St. Johns)', tzId: 'America/St_Johns', offset: 'UTC−03:30 / −02:30' }
    ]
  },
  {
    id: 33,
    name: 'Central African Republic',
    flag: '🇨🇫',
    continent: 'Africa',
    utcOffset: 'UTC+01:00',
    timezoneName: 'West Africa Time (WAT)',
    primaryTzId: 'Africa/Bangui',
    capitalOrMajorCity: 'Bangui'
  },
  {
    id: 34,
    name: 'Chad',
    flag: '🇹🇩',
    continent: 'Africa',
    utcOffset: 'UTC+01:00',
    timezoneName: 'West Africa Time (WAT)',
    primaryTzId: 'Africa/Ndjamena',
    capitalOrMajorCity: "N'Djamena"
  },
  {
    id: 35,
    name: 'Chile',
    flag: '🇨🇱',
    continent: 'Americas',
    utcOffset: 'UTC−06:00 to −03:00',
    timezoneName: 'Continental / Easter Island / Magallanes Time',
    primaryTzId: 'America/Santiago',
    capitalOrMajorCity: 'Santiago',
    subZones: [
      { name: 'Continental (Santiago)', tzId: 'America/Santiago', offset: 'UTC−04:00 / −03:00' },
      { name: 'Easter Island', tzId: 'Pacific/Easter', offset: 'UTC−06:00 / −05:00' },
      { name: 'Magallanes (Punta Arenas)', tzId: 'America/Punta_Arenas', offset: 'UTC−03:00' }
    ]
  },
  {
    id: 36,
    name: 'China',
    flag: '🇨🇳',
    continent: 'Asia',
    utcOffset: 'UTC+08:00',
    timezoneName: 'China Standard Time (CST / Beijing Time)',
    primaryTzId: 'Asia/Shanghai',
    capitalOrMajorCity: 'Beijing & Shanghai'
  },
  {
    id: 37,
    name: 'Colombia',
    flag: '🇨🇴',
    continent: 'Americas',
    utcOffset: 'UTC−05:00',
    timezoneName: 'Colombia Time (COT)',
    primaryTzId: 'America/Bogota',
    capitalOrMajorCity: 'Bogota'
  },
  {
    id: 38,
    name: 'Comoros',
    flag: '🇰🇲',
    continent: 'Africa',
    utcOffset: 'UTC+03:00',
    timezoneName: 'East Africa Time (EAT)',
    primaryTzId: 'Indian/Comoro',
    capitalOrMajorCity: 'Moroni'
  },
  {
    id: 39,
    name: 'Democratic Republic of the Congo',
    flag: '🇨🇩',
    continent: 'Africa',
    utcOffset: 'UTC+01:00 / +02:00',
    timezoneName: 'West Africa / Central Africa Time',
    primaryTzId: 'Africa/Kinshasa',
    capitalOrMajorCity: 'Kinshasa',
    subZones: [
      { name: 'Western (Kinshasa)', tzId: 'Africa/Kinshasa', offset: 'UTC+01:00' },
      { name: 'Eastern (Lubumbashi)', tzId: 'Africa/Lubumbashi', offset: 'UTC+02:00' }
    ]
  },
  {
    id: 40,
    name: 'Republic of the Congo',
    flag: '🇨🇬',
    continent: 'Africa',
    utcOffset: 'UTC+01:00',
    timezoneName: 'West Africa Time (WAT)',
    primaryTzId: 'Africa/Brazzaville',
    capitalOrMajorCity: 'Brazzaville'
  },
  {
    id: 41,
    name: 'Costa Rica',
    flag: '🇨🇷',
    continent: 'Americas',
    utcOffset: 'UTC−06:00',
    timezoneName: 'Central Standard Time (CST)',
    primaryTzId: 'America/Costa_Rica',
    capitalOrMajorCity: 'San José'
  },
  {
    id: 42,
    name: "Côte d'Ivoire",
    flag: '🇨🇮',
    continent: 'Africa',
    utcOffset: 'UTC+00:00',
    timezoneName: 'Greenwich Mean Time (GMT)',
    primaryTzId: 'Africa/Abidjan',
    capitalOrMajorCity: 'Yamoussoukro & Abidjan'
  },
  {
    id: 43,
    name: 'Croatia',
    flag: '🇭🇷',
    continent: 'Europe',
    utcOffset: 'UTC+01:00 / +02:00',
    timezoneName: 'Central European Summer Time (CEST)',
    primaryTzId: 'Europe/Zagreb',
    capitalOrMajorCity: 'Zagreb'
  },
  {
    id: 44,
    name: 'Cuba',
    flag: '🇨🇺',
    continent: 'Americas',
    utcOffset: 'UTC−05:00 / −04:00',
    timezoneName: 'Cuba Daylight Time (CDT)',
    primaryTzId: 'America/Havana',
    capitalOrMajorCity: 'Havana'
  },
  {
    id: 45,
    name: 'Cyprus',
    flag: '🇨🇾',
    continent: 'Asia',
    utcOffset: 'UTC+02:00 / +03:00',
    timezoneName: 'Eastern European Summer Time (EEST)',
    primaryTzId: 'Asia/Nicosia',
    capitalOrMajorCity: 'Nicosia'
  },
  {
    id: 46,
    name: 'Czechia',
    flag: '🇨🇿',
    continent: 'Europe',
    utcOffset: 'UTC+01:00 / +02:00',
    timezoneName: 'Central European Summer Time (CEST)',
    primaryTzId: 'Europe/Prague',
    capitalOrMajorCity: 'Prague'
  },
  {
    id: 47,
    name: 'Denmark',
    flag: '🇩🇰',
    continent: 'Europe',
    utcOffset: 'UTC+01:00 / +02:00',
    timezoneName: 'Central European Summer Time (CEST)',
    primaryTzId: 'Europe/Copenhagen',
    capitalOrMajorCity: 'Copenhagen',
    subZones: [
      { name: 'Copenhagen (Mainland)', tzId: 'Europe/Copenhagen', offset: 'UTC+01:00 / +02:00' },
      { name: 'Greenland (Nuuk)', tzId: 'America/Nuuk', offset: 'UTC−02:00 / −01:00' },
      { name: 'Faroe Islands (Tórshavn)', tzId: 'Atlantic/Faroe', offset: 'UTC+00:00 / +01:00' }
    ]
  },
  {
    id: 48,
    name: 'Djibouti',
    flag: '🇩🇯',
    continent: 'Africa',
    utcOffset: 'UTC+03:00',
    timezoneName: 'East Africa Time (EAT)',
    primaryTzId: 'Africa/Djibouti',
    capitalOrMajorCity: 'Djibouti City'
  },
  {
    id: 49,
    name: 'Dominica',
    flag: '🇩🇲',
    continent: 'Americas',
    utcOffset: 'UTC−04:00',
    timezoneName: 'Atlantic Standard Time (AST)',
    primaryTzId: 'America/Dominica',
    capitalOrMajorCity: 'Roseau'
  },
  {
    id: 50,
    name: 'Dominican Republic',
    flag: '🇩🇴',
    continent: 'Americas',
    utcOffset: 'UTC−04:00',
    timezoneName: 'Atlantic Standard Time (AST)',
    primaryTzId: 'America/Santo_Domingo',
    capitalOrMajorCity: 'Santo Domingo'
  },
  {
    id: 51,
    name: 'Ecuador',
    flag: '🇪🇨',
    continent: 'Americas',
    utcOffset: 'UTC−05:00 / −06:00',
    timezoneName: 'Ecuador / Galapagos Time',
    primaryTzId: 'America/Guayaquil',
    capitalOrMajorCity: 'Quito',
    subZones: [
      { name: 'Mainland (Quito, Guayaquil)', tzId: 'America/Guayaquil', offset: 'UTC−05:00' },
      { name: 'Galapagos Islands', tzId: 'Pacific/Galapagos', offset: 'UTC−06:00' }
    ]
  },
  {
    id: 52,
    name: 'Egypt',
    flag: '🇪🇬',
    continent: 'Africa',
    utcOffset: 'UTC+02:00 / +03:00',
    timezoneName: 'Eastern European Summer Time (EEST)',
    primaryTzId: 'Africa/Cairo',
    capitalOrMajorCity: 'Cairo'
  },
  {
    id: 53,
    name: 'El Salvador',
    flag: '🇸🇻',
    continent: 'Americas',
    utcOffset: 'UTC−06:00',
    timezoneName: 'Central Standard Time (CST)',
    primaryTzId: 'America/El_Salvador',
    capitalOrMajorCity: 'San Salvador'
  },
  {
    id: 54,
    name: 'Equatorial Guinea',
    flag: '🇬🇶',
    continent: 'Africa',
    utcOffset: 'UTC+01:00',
    timezoneName: 'West Africa Time (WAT)',
    primaryTzId: 'Africa/Malabo',
    capitalOrMajorCity: 'Malabo'
  },
  {
    id: 55,
    name: 'Eritrea',
    flag: '🇪🇷',
    continent: 'Africa',
    utcOffset: 'UTC+03:00',
    timezoneName: 'East Africa Time (EAT)',
    primaryTzId: 'Africa/Asmara',
    capitalOrMajorCity: 'Asmara'
  },
  {
    id: 56,
    name: 'Estonia',
    flag: '🇪🇪',
    continent: 'Europe',
    utcOffset: 'UTC+02:00 / +03:00',
    timezoneName: 'Eastern European Summer Time (EEST)',
    primaryTzId: 'Europe/Tallinn',
    capitalOrMajorCity: 'Tallinn'
  },
  {
    id: 57,
    name: 'Eswatini',
    flag: '🇸🇿',
    continent: 'Africa',
    utcOffset: 'UTC+02:00',
    timezoneName: 'South Africa Standard Time (SAST)',
    primaryTzId: 'Africa/Mbabane',
    capitalOrMajorCity: 'Mbabane'
  },
  {
    id: 58,
    name: 'Ethiopia',
    flag: '🇪🇹',
    continent: 'Africa',
    utcOffset: 'UTC+03:00',
    timezoneName: 'East Africa Time (EAT)',
    primaryTzId: 'Africa/Addis_Ababa',
    capitalOrMajorCity: 'Addis Ababa'
  },
  {
    id: 59,
    name: 'Fiji',
    flag: '🇫🇯',
    continent: 'Oceania',
    utcOffset: 'UTC+12:00',
    timezoneName: 'Fiji Time (FJT)',
    primaryTzId: 'Pacific/Fiji',
    capitalOrMajorCity: 'Suva'
  },
  {
    id: 60,
    name: 'Finland',
    flag: '🇫🇮',
    continent: 'Europe',
    utcOffset: 'UTC+02:00 / +03:00',
    timezoneName: 'Eastern European Summer Time (EEST)',
    primaryTzId: 'Europe/Helsinki',
    capitalOrMajorCity: 'Helsinki'
  },
  {
    id: 61,
    name: 'France',
    flag: '🇫🇷',
    continent: 'Europe',
    utcOffset: 'UTC+01:00 / +02:00 (12 Overseas Zones)',
    timezoneName: 'Central European Summer Time (CEST)',
    primaryTzId: 'Europe/Paris',
    capitalOrMajorCity: 'Paris',
    subZones: [
      { name: 'Paris (Metropolitan France)', tzId: 'Europe/Paris', offset: 'UTC+01:00 / +02:00' },
      { name: 'French Guiana (Cayenne)', tzId: 'America/Cayenne', offset: 'UTC−03:00' },
      { name: 'Guadeloupe & Martinique', tzId: 'America/Guadeloupe', offset: 'UTC−04:00' },
      { name: 'Tahiti / French Polynesia', tzId: 'Pacific/Tahiti', offset: 'UTC−10:00' },
      { name: 'Marquesas Islands', tzId: 'Pacific/Marquesas', offset: 'UTC−09:30' },
      { name: 'Réunion Island', tzId: 'Indian/Reunion', offset: 'UTC+04:00' },
      { name: 'Mayotte', tzId: 'Indian/Mayotte', offset: 'UTC+03:00' },
      { name: 'New Caledonia (Noumea)', tzId: 'Pacific/Noumea', offset: 'UTC+11:00' }
    ]
  },
  {
    id: 62,
    name: 'Gabon',
    flag: '🇬🇦',
    continent: 'Africa',
    utcOffset: 'UTC+01:00',
    timezoneName: 'West Africa Time (WAT)',
    primaryTzId: 'Africa/Libreville',
    capitalOrMajorCity: 'Libreville'
  },
  {
    id: 63,
    name: 'Gambia',
    flag: '🇬🇲',
    continent: 'Africa',
    utcOffset: 'UTC+00:00',
    timezoneName: 'Greenwich Mean Time (GMT)',
    primaryTzId: 'Africa/Banjul',
    capitalOrMajorCity: 'Banjul'
  },
  {
    id: 64,
    name: 'Georgia',
    flag: '🇬🇪',
    continent: 'Asia',
    utcOffset: 'UTC+04:00',
    timezoneName: 'Georgia Standard Time (GET)',
    primaryTzId: 'Asia/Tbilisi',
    capitalOrMajorCity: 'Tbilisi'
  },
  {
    id: 65,
    name: 'Germany',
    flag: '🇩🇪',
    continent: 'Europe',
    utcOffset: 'UTC+01:00 / +02:00',
    timezoneName: 'Central European Summer Time (CEST)',
    primaryTzId: 'Europe/Berlin',
    capitalOrMajorCity: 'Berlin'
  },
  {
    id: 66,
    name: 'Ghana',
    flag: '🇬🇭',
    continent: 'Africa',
    utcOffset: 'UTC+00:00',
    timezoneName: 'Greenwich Mean Time (GMT)',
    primaryTzId: 'Africa/Accra',
    capitalOrMajorCity: 'Accra'
  },
  {
    id: 67,
    name: 'Greece',
    flag: '🇬🇷',
    continent: 'Europe',
    utcOffset: 'UTC+02:00 / +03:00',
    timezoneName: 'Eastern European Summer Time (EEST)',
    primaryTzId: 'Europe/Athens',
    capitalOrMajorCity: 'Athens'
  },
  {
    id: 68,
    name: 'Grenada',
    flag: '🇬🇩',
    continent: 'Americas',
    utcOffset: 'UTC−04:00',
    timezoneName: 'Atlantic Standard Time (AST)',
    primaryTzId: 'America/Grenada',
    capitalOrMajorCity: "St. George's"
  },
  {
    id: 69,
    name: 'Guatemala',
    flag: '🇬🇹',
    continent: 'Americas',
    utcOffset: 'UTC−06:00',
    timezoneName: 'Central Standard Time (CST)',
    primaryTzId: 'America/Guatemala',
    capitalOrMajorCity: 'Guatemala City'
  },
  {
    id: 70,
    name: 'Guinea',
    flag: '🇬🇳',
    continent: 'Africa',
    utcOffset: 'UTC+00:00',
    timezoneName: 'Greenwich Mean Time (GMT)',
    primaryTzId: 'Africa/Conakry',
    capitalOrMajorCity: 'Conakry'
  },
  {
    id: 71,
    name: 'Guinea-Bissau',
    flag: '🇬🇼',
    continent: 'Africa',
    utcOffset: 'UTC+00:00',
    timezoneName: 'Greenwich Mean Time (GMT)',
    primaryTzId: 'Africa/Bissau',
    capitalOrMajorCity: 'Bissau'
  },
  {
    id: 72,
    name: 'Guyana',
    flag: '🇬🇾',
    continent: 'Americas',
    utcOffset: 'UTC−04:00',
    timezoneName: 'Guyana Time (GYT)',
    primaryTzId: 'America/Guyana',
    capitalOrMajorCity: 'Georgetown'
  },
  {
    id: 73,
    name: 'Haiti',
    flag: '🇭🇹',
    continent: 'Americas',
    utcOffset: 'UTC−05:00 / −04:00',
    timezoneName: 'Eastern Daylight Time (EDT)',
    primaryTzId: 'America/Port-au-Prince',
    capitalOrMajorCity: 'Port-au-Prince'
  },
  {
    id: 74,
    name: 'Honduras',
    flag: '🇭🇳',
    continent: 'Americas',
    utcOffset: 'UTC−06:00',
    timezoneName: 'Central Standard Time (CST)',
    primaryTzId: 'America/Tegucigalpa',
    capitalOrMajorCity: 'Tegucigalpa'
  },
  {
    id: 75,
    name: 'Hungary',
    flag: '🇭🇺',
    continent: 'Europe',
    utcOffset: 'UTC+01:00 / +02:00',
    timezoneName: 'Central European Summer Time (CEST)',
    primaryTzId: 'Europe/Budapest',
    capitalOrMajorCity: 'Budapest'
  },
  {
    id: 76,
    name: 'Iceland',
    flag: '🇮🇸',
    continent: 'Europe',
    utcOffset: 'UTC+00:00',
    timezoneName: 'Greenwich Mean Time (GMT)',
    primaryTzId: 'Atlantic/Reykjavik',
    capitalOrMajorCity: 'Reykjavik'
  },
  {
    id: 77,
    name: 'India',
    flag: '🇮🇳',
    continent: 'Asia',
    utcOffset: 'UTC+05:30',
    timezoneName: 'India Standard Time (IST)',
    primaryTzId: 'Asia/Kolkata',
    capitalOrMajorCity: 'New Delhi & Chennai'
  },
  {
    id: 78,
    name: 'Indonesia',
    flag: '🇮🇩',
    continent: 'Asia',
    utcOffset: 'UTC+07:00 to +09:00',
    timezoneName: 'WIB / WITA / WIT (Western/Central/Eastern Time)',
    primaryTzId: 'Asia/Jakarta',
    capitalOrMajorCity: 'Jakarta & Bali',
    subZones: [
      { name: 'Western WIB (Jakarta, Sumatra, Java)', tzId: 'Asia/Jakarta', offset: 'UTC+07:00' },
      { name: 'Central WITA (Bali, Sulawesi, Nusa Tenggara)', tzId: 'Asia/Makassar', offset: 'UTC+08:00' },
      { name: 'Eastern WIT (Papua, Maluku)', tzId: 'Asia/Jayapura', offset: 'UTC+09:00' }
    ]
  },
  {
    id: 79,
    name: 'Iran',
    flag: '🇮🇷',
    continent: 'Asia',
    utcOffset: 'UTC+03:30',
    timezoneName: 'Iran Standard Time (IRST)',
    primaryTzId: 'Asia/Tehran',
    capitalOrMajorCity: 'Tehran'
  },
  {
    id: 80,
    name: 'Iraq',
    flag: '🇮🇶',
    continent: 'Asia',
    utcOffset: 'UTC+03:00',
    timezoneName: 'Arabia Standard Time (AST)',
    primaryTzId: 'Asia/Baghdad',
    capitalOrMajorCity: 'Baghdad'
  },
  {
    id: 81,
    name: 'Ireland',
    flag: '🇮🇪',
    continent: 'Europe',
    utcOffset: 'UTC+00:00 / +01:00',
    timezoneName: 'Irish Standard Time (IST / WEST)',
    primaryTzId: 'Europe/Dublin',
    capitalOrMajorCity: 'Dublin'
  },
  {
    id: 82,
    name: 'Israel',
    flag: '🇮🇱',
    continent: 'Asia',
    utcOffset: 'UTC+02:00 / +03:00',
    timezoneName: 'Israel Daylight Time (IDT)',
    primaryTzId: 'Asia/Jerusalem',
    capitalOrMajorCity: 'Jerusalem & Tel Aviv'
  },
  {
    id: 83,
    name: 'Italy',
    flag: '🇮🇹',
    continent: 'Europe',
    utcOffset: 'UTC+01:00 / +02:00',
    timezoneName: 'Central European Summer Time (CEST)',
    primaryTzId: 'Europe/Rome',
    capitalOrMajorCity: 'Rome & Milan'
  },
  {
    id: 84,
    name: 'Jamaica',
    flag: '🇯🇲',
    continent: 'Americas',
    utcOffset: 'UTC−05:00',
    timezoneName: 'Eastern Standard Time (EST)',
    primaryTzId: 'America/Jamaica',
    capitalOrMajorCity: 'Kingston'
  },
  {
    id: 85,
    name: 'Japan',
    flag: '🇯🇵',
    continent: 'Asia',
    utcOffset: 'UTC+09:00',
    timezoneName: 'Japan Standard Time (JST)',
    primaryTzId: 'Asia/Tokyo',
    capitalOrMajorCity: 'Tokyo & Kyoto'
  },
  {
    id: 86,
    name: 'Jordan',
    flag: '🇯🇴',
    continent: 'Asia',
    utcOffset: 'UTC+03:00',
    timezoneName: 'Arabia Standard Time (AST)',
    primaryTzId: 'Asia/Amman',
    capitalOrMajorCity: 'Amman'
  },
  {
    id: 87,
    name: 'Kazakhstan',
    flag: '🇰🇿',
    continent: 'Asia',
    utcOffset: 'UTC+05:00',
    timezoneName: 'Kazakhstan Standard Time (QST)',
    primaryTzId: 'Asia/Almaty',
    capitalOrMajorCity: 'Astana & Almaty'
  },
  {
    id: 88,
    name: 'Kenya',
    flag: '🇰🇪',
    continent: 'Africa',
    utcOffset: 'UTC+03:00',
    timezoneName: 'East Africa Time (EAT)',
    primaryTzId: 'Africa/Nairobi',
    capitalOrMajorCity: 'Nairobi'
  },
  {
    id: 89,
    name: 'Kiribati',
    flag: '🇰🇮',
    continent: 'Oceania',
    utcOffset: 'UTC+12:00 to +14:00',
    timezoneName: 'Gilbert / Phoenix / Line Islands Time',
    primaryTzId: 'Pacific/Tarawa',
    capitalOrMajorCity: 'South Tarawa',
    subZones: [
      { name: 'Gilbert Islands (Tarawa)', tzId: 'Pacific/Tarawa', offset: 'UTC+12:00' },
      { name: 'Phoenix Islands (Kanton)', tzId: 'Pacific/Kanton', offset: 'UTC+13:00' },
      { name: 'Line Islands (Kiritimati - UTC+14)', tzId: 'Pacific/Kiritimati', offset: 'UTC+14:00' }
    ]
  },
  {
    id: 90,
    name: 'Kuwait',
    flag: '🇰🇼',
    continent: 'Asia',
    utcOffset: 'UTC+03:00',
    timezoneName: 'Arabia Standard Time (AST)',
    primaryTzId: 'Asia/Kuwait',
    capitalOrMajorCity: 'Kuwait City'
  },
  {
    id: 91,
    name: 'Kyrgyzstan',
    flag: '🇰🇬',
    continent: 'Asia',
    utcOffset: 'UTC+06:00',
    timezoneName: 'Kyrgyzstan Time (KGT)',
    primaryTzId: 'Asia/Bishkek',
    capitalOrMajorCity: 'Bishkek'
  },
  {
    id: 92,
    name: 'Laos',
    flag: '🇱🇦',
    continent: 'Asia',
    utcOffset: 'UTC+07:00',
    timezoneName: 'Indochina Time (ICT)',
    primaryTzId: 'Asia/Vientiane',
    capitalOrMajorCity: 'Vientiane'
  },
  {
    id: 93,
    name: 'Latvia',
    flag: '🇱🇻',
    continent: 'Europe',
    utcOffset: 'UTC+02:00 / +03:00',
    timezoneName: 'Eastern European Summer Time (EEST)',
    primaryTzId: 'Europe/Riga',
    capitalOrMajorCity: 'Riga'
  },
  {
    id: 94,
    name: 'Lebanon',
    flag: '🇱🇧',
    continent: 'Asia',
    utcOffset: 'UTC+02:00 / +03:00',
    timezoneName: 'Eastern European Summer Time (EEST)',
    primaryTzId: 'Asia/Beirut',
    capitalOrMajorCity: 'Beirut'
  },
  {
    id: 95,
    name: 'Lesotho',
    flag: '🇱🇸',
    continent: 'Africa',
    utcOffset: 'UTC+02:00',
    timezoneName: 'South Africa Standard Time (SAST)',
    primaryTzId: 'Africa/Maseru',
    capitalOrMajorCity: 'Maseru'
  },
  {
    id: 96,
    name: 'Liberia',
    flag: '🇱🇷',
    continent: 'Africa',
    utcOffset: 'UTC+00:00',
    timezoneName: 'Greenwich Mean Time (GMT)',
    primaryTzId: 'Africa/Monrovia',
    capitalOrMajorCity: 'Monrovia'
  },
  {
    id: 97,
    name: 'Libya',
    flag: '🇱🇾',
    continent: 'Africa',
    utcOffset: 'UTC+02:00',
    timezoneName: 'Eastern European Time (EET)',
    primaryTzId: 'Africa/Tripoli',
    capitalOrMajorCity: 'Tripoli'
  },
  {
    id: 98,
    name: 'Liechtenstein',
    flag: '🇱🇮',
    continent: 'Europe',
    utcOffset: 'UTC+01:00 / +02:00',
    timezoneName: 'Central European Summer Time (CEST)',
    primaryTzId: 'Europe/Vaduz',
    capitalOrMajorCity: 'Vaduz'
  },
  {
    id: 99,
    name: 'Lithuania',
    flag: '🇱🇹',
    continent: 'Europe',
    utcOffset: 'UTC+02:00 / +03:00',
    timezoneName: 'Eastern European Summer Time (EEST)',
    primaryTzId: 'Europe/Vilnius',
    capitalOrMajorCity: 'Vilnius'
  },
  {
    id: 100,
    name: 'Luxembourg',
    flag: '🇱🇺',
    continent: 'Europe',
    utcOffset: 'UTC+01:00 / +02:00',
    timezoneName: 'Central European Summer Time (CEST)',
    primaryTzId: 'Europe/Luxembourg',
    capitalOrMajorCity: 'Luxembourg City'
  },
  {
    id: 101,
    name: 'Madagascar',
    flag: '🇲🇬',
    continent: 'Africa',
    utcOffset: 'UTC+03:00',
    timezoneName: 'East Africa Time (EAT)',
    primaryTzId: 'Indian/Antananarivo',
    capitalOrMajorCity: 'Antananarivo'
  },
  {
    id: 102,
    name: 'Malawi',
    flag: '🇲🇼',
    continent: 'Africa',
    utcOffset: 'UTC+02:00',
    timezoneName: 'Central Africa Time (CAT)',
    primaryTzId: 'Africa/Blantyre',
    capitalOrMajorCity: 'Lilongwe'
  },
  {
    id: 103,
    name: 'Malaysia',
    flag: '🇲🇾',
    continent: 'Asia',
    utcOffset: 'UTC+08:00',
    timezoneName: 'Malaysia Time (MYT)',
    primaryTzId: 'Asia/Kuala_Lumpur',
    capitalOrMajorCity: 'Kuala Lumpur'
  },
  {
    id: 104,
    name: 'Maldives',
    flag: '🇲🇻',
    continent: 'Asia',
    utcOffset: 'UTC+05:00',
    timezoneName: 'Maldives Time (MVT)',
    primaryTzId: 'Indian/Maldives',
    capitalOrMajorCity: 'Malé'
  },
  {
    id: 105,
    name: 'Mali',
    flag: '🇲🇱',
    continent: 'Africa',
    utcOffset: 'UTC+00:00',
    timezoneName: 'Greenwich Mean Time (GMT)',
    primaryTzId: 'Africa/Bamako',
    capitalOrMajorCity: 'Bamako'
  },
  {
    id: 106,
    name: 'Malta',
    flag: '🇲🇹',
    continent: 'Europe',
    utcOffset: 'UTC+01:00 / +02:00',
    timezoneName: 'Central European Summer Time (CEST)',
    primaryTzId: 'Europe/Malta',
    capitalOrMajorCity: 'Valletta'
  },
  {
    id: 107,
    name: 'Marshall Islands',
    flag: '🇲🇭',
    continent: 'Oceania',
    utcOffset: 'UTC+12:00',
    timezoneName: 'Marshall Islands Time (MHT)',
    primaryTzId: 'Pacific/Majuro',
    capitalOrMajorCity: 'Majuro'
  },
  {
    id: 108,
    name: 'Mauritania',
    flag: '🇲🇷',
    continent: 'Africa',
    utcOffset: 'UTC+00:00',
    timezoneName: 'Greenwich Mean Time (GMT)',
    primaryTzId: 'Africa/Nouakchott',
    capitalOrMajorCity: 'Nouakchott'
  },
  {
    id: 109,
    name: 'Mauritius',
    flag: '🇲🇺',
    continent: 'Africa',
    utcOffset: 'UTC+04:00',
    timezoneName: 'Mauritius Time (MUT)',
    primaryTzId: 'Indian/Mauritius',
    capitalOrMajorCity: 'Port Louis'
  },
  {
    id: 110,
    name: 'Mexico',
    flag: '🇲🇽',
    continent: 'Americas',
    utcOffset: 'UTC−08:00 to −05:00',
    timezoneName: 'Mexican Pacific / Central / Eastern Time',
    primaryTzId: 'America/Mexico_City',
    capitalOrMajorCity: 'Mexico City & Cancun',
    subZones: [
      { name: 'Central (Mexico City, Guadalajara)', tzId: 'America/Mexico_City', offset: 'UTC−06:00' },
      { name: 'Eastern (Cancun, Quintana Roo)', tzId: 'America/Cancun', offset: 'UTC−05:00' },
      { name: 'Pacific (Mazatlán, Baja California Sur)', tzId: 'America/Mazatlan', offset: 'UTC−07:00' },
      { name: 'Northwest (Tijuana, Mexicali)', tzId: 'America/Tijuana', offset: 'UTC−08:00' }
    ]
  },
  {
    id: 111,
    name: 'Micronesia',
    flag: '🇫🇲',
    continent: 'Oceania',
    utcOffset: 'UTC+10:00 / +11:00',
    timezoneName: 'Chuuk / Pohnpei / Kosrae Time',
    primaryTzId: 'Pacific/Pohnpei',
    capitalOrMajorCity: 'Palikir',
    subZones: [
      { name: 'Chuuk & Yap', tzId: 'Pacific/Chuuk', offset: 'UTC+10:00' },
      { name: 'Pohnpei & Kosrae', tzId: 'Pacific/Pohnpei', offset: 'UTC+11:00' }
    ]
  },
  {
    id: 112,
    name: 'Moldova',
    flag: '🇲🇩',
    continent: 'Europe',
    utcOffset: 'UTC+02:00 / +03:00',
    timezoneName: 'Eastern European Summer Time (EEST)',
    primaryTzId: 'Europe/Chisinau',
    capitalOrMajorCity: 'Chișinău'
  },
  {
    id: 113,
    name: 'Monaco',
    flag: '🇲🇨',
    continent: 'Europe',
    utcOffset: 'UTC+01:00 / +02:00',
    timezoneName: 'Central European Summer Time (CEST)',
    primaryTzId: 'Europe/Monaco',
    capitalOrMajorCity: 'Monaco'
  },
  {
    id: 114,
    name: 'Mongolia',
    flag: '🇲🇳',
    continent: 'Asia',
    utcOffset: 'UTC+07:00 / +08:00',
    timezoneName: 'Ulaanbaatar / Hovd Time',
    primaryTzId: 'Asia/Ulaanbaatar',
    capitalOrMajorCity: 'Ulaanbaatar',
    subZones: [
      { name: 'Ulaanbaatar & Central', tzId: 'Asia/Ulaanbaatar', offset: 'UTC+08:00' },
      { name: 'Western (Hovd)', tzId: 'Asia/Hovd', offset: 'UTC+07:00' }
    ]
  },
  {
    id: 115,
    name: 'Montenegro',
    flag: '🇲🇪',
    continent: 'Europe',
    utcOffset: 'UTC+01:00 / +02:00',
    timezoneName: 'Central European Summer Time (CEST)',
    primaryTzId: 'Europe/Podgorica',
    capitalOrMajorCity: 'Podgorica'
  },
  {
    id: 116,
    name: 'Morocco',
    flag: '🇲🇦',
    continent: 'Africa',
    utcOffset: 'UTC+01:00',
    timezoneName: 'Morocco Standard Time (WEST / +01:00)',
    primaryTzId: 'Africa/Casablanca',
    capitalOrMajorCity: 'Rabat & Casablanca'
  },
  {
    id: 117,
    name: 'Mozambique',
    flag: '🇲🇿',
    continent: 'Africa',
    utcOffset: 'UTC+02:00',
    timezoneName: 'Central Africa Time (CAT)',
    primaryTzId: 'Africa/Maputo',
    capitalOrMajorCity: 'Maputo'
  },
  {
    id: 118,
    name: 'Myanmar',
    flag: '🇲🇲',
    continent: 'Asia',
    utcOffset: 'UTC+06:30',
    timezoneName: 'Myanmar Time (MMT)',
    primaryTzId: 'Asia/Yangon',
    capitalOrMajorCity: 'Naypyidaw & Yangon'
  },
  {
    id: 119,
    name: 'Namibia',
    flag: '🇳🇦',
    continent: 'Africa',
    utcOffset: 'UTC+02:00',
    timezoneName: 'Central Africa Time (CAT)',
    primaryTzId: 'Africa/Windhoek',
    capitalOrMajorCity: 'Windhoek'
  },
  {
    id: 120,
    name: 'Nauru',
    flag: '🇳🇷',
    continent: 'Oceania',
    utcOffset: 'UTC+12:00',
    timezoneName: 'Nauru Time (NRT)',
    primaryTzId: 'Pacific/Nauru',
    capitalOrMajorCity: 'Yaren'
  },
  {
    id: 121,
    name: 'Nepal',
    flag: '🇳🇵',
    continent: 'Asia',
    utcOffset: 'UTC+05:45',
    timezoneName: 'Nepal Time (NPT)',
    primaryTzId: 'Asia/Kathmandu',
    capitalOrMajorCity: 'Kathmandu'
  },
  {
    id: 122,
    name: 'Netherlands',
    flag: '🇳🇱',
    continent: 'Europe',
    utcOffset: 'UTC+01:00 / +02:00',
    timezoneName: 'Central European Summer Time (CEST)',
    primaryTzId: 'Europe/Amsterdam',
    capitalOrMajorCity: 'Amsterdam',
    subZones: [
      { name: 'Amsterdam (Mainland)', tzId: 'Europe/Amsterdam', offset: 'UTC+01:00 / +02:00' },
      { name: 'Caribbean Netherlands (Bonaire, Curacao)', tzId: 'America/Curacao', offset: 'UTC−04:00' }
    ]
  },
  {
    id: 123,
    name: 'New Zealand',
    flag: '🇳🇿',
    continent: 'Oceania',
    utcOffset: 'UTC+12:00 / +12:45 / +13:00',
    timezoneName: 'New Zealand / Chatham Standard Time',
    primaryTzId: 'Pacific/Auckland',
    capitalOrMajorCity: 'Wellington & Auckland',
    subZones: [
      { name: 'Auckland & Wellington (Main Islands)', tzId: 'Pacific/Auckland', offset: 'UTC+12:00 / +13:00' },
      { name: 'Chatham Islands (UTC+12:45)', tzId: 'Pacific/Chatham', offset: 'UTC+12:45 / +13:45' },
      { name: 'Tokelau (Fakaofo)', tzId: 'Pacific/Fakaofo', offset: 'UTC+13:00' },
      { name: 'Cook Islands (Rarotonga)', tzId: 'Pacific/Rarotonga', offset: 'UTC−10:00' }
    ]
  },
  {
    id: 124,
    name: 'Nicaragua',
    flag: '🇳🇮',
    continent: 'Americas',
    utcOffset: 'UTC−06:00',
    timezoneName: 'Central Standard Time (CST)',
    primaryTzId: 'America/Managua',
    capitalOrMajorCity: 'Managua'
  },
  {
    id: 125,
    name: 'Niger',
    flag: '🇳🇪',
    continent: 'Africa',
    utcOffset: 'UTC+01:00',
    timezoneName: 'West Africa Time (WAT)',
    primaryTzId: 'Africa/Niamey',
    capitalOrMajorCity: 'Niamey'
  },
  {
    id: 126,
    name: 'Nigeria',
    flag: '🇳🇬',
    continent: 'Africa',
    utcOffset: 'UTC+01:00',
    timezoneName: 'West Africa Time (WAT)',
    primaryTzId: 'Africa/Lagos',
    capitalOrMajorCity: 'Abuja & Lagos'
  },
  {
    id: 127,
    name: 'North Korea',
    flag: '🇰🇵',
    continent: 'Asia',
    utcOffset: 'UTC+09:00',
    timezoneName: 'Korea Standard Time (KST)',
    primaryTzId: 'Asia/Pyongyang',
    capitalOrMajorCity: 'Pyongyang'
  },
  {
    id: 128,
    name: 'North Macedonia',
    flag: '🇲🇰',
    continent: 'Europe',
    utcOffset: 'UTC+01:00 / +02:00',
    timezoneName: 'Central European Summer Time (CEST)',
    primaryTzId: 'Europe/Skopje',
    capitalOrMajorCity: 'Skopje'
  },
  {
    id: 129,
    name: 'Norway',
    flag: '🇳🇴',
    continent: 'Europe',
    utcOffset: 'UTC+01:00 / +02:00',
    timezoneName: 'Central European Summer Time (CEST)',
    primaryTzId: 'Europe/Oslo',
    capitalOrMajorCity: 'Oslo'
  },
  {
    id: 130,
    name: 'Oman',
    flag: '🇴🇲',
    continent: 'Asia',
    utcOffset: 'UTC+04:00',
    timezoneName: 'Gulf Standard Time (GST)',
    primaryTzId: 'Asia/Muscat',
    capitalOrMajorCity: 'Muscat'
  },
  {
    id: 131,
    name: 'Pakistan',
    flag: '🇵🇰',
    continent: 'Asia',
    utcOffset: 'UTC+05:00',
    timezoneName: 'Pakistan Standard Time (PKT)',
    primaryTzId: 'Asia/Karachi',
    capitalOrMajorCity: 'Islamabad & Karachi'
  },
  {
    id: 132,
    name: 'Palau',
    flag: '🇵🇼',
    continent: 'Oceania',
    utcOffset: 'UTC+09:00',
    timezoneName: 'Palau Time (PWT)',
    primaryTzId: 'Pacific/Palau',
    capitalOrMajorCity: 'Ngerulmud'
  },
  {
    id: 133,
    name: 'Palestine',
    flag: '🇵🇸',
    continent: 'Asia',
    utcOffset: 'UTC+02:00 / +03:00',
    timezoneName: 'Palestine Summer Time',
    primaryTzId: 'Asia/Gaza',
    capitalOrMajorCity: 'Ramallah & Gaza'
  },
  {
    id: 134,
    name: 'Panama',
    flag: '🇵🇦',
    continent: 'Americas',
    utcOffset: 'UTC−05:00',
    timezoneName: 'Eastern Standard Time (EST)',
    primaryTzId: 'America/Panama',
    capitalOrMajorCity: 'Panama City'
  },
  {
    id: 135,
    name: 'Papua New Guinea',
    flag: '🇵🇬',
    continent: 'Oceania',
    utcOffset: 'UTC+10:00 / +11:00',
    timezoneName: 'PNG / Bougainville Time',
    primaryTzId: 'Pacific/Port_Moresby',
    capitalOrMajorCity: 'Port Moresby',
    subZones: [
      { name: 'Port Moresby & Mainland', tzId: 'Pacific/Port_Moresby', offset: 'UTC+10:00' },
      { name: 'Bougainville', tzId: 'Pacific/Bougainville', offset: 'UTC+11:00' }
    ]
  },
  {
    id: 136,
    name: 'Paraguay',
    flag: '🇵🇾',
    continent: 'Americas',
    utcOffset: 'UTC−04:00 / −03:00',
    timezoneName: 'Paraguay Time (PYT)',
    primaryTzId: 'America/Asuncion',
    capitalOrMajorCity: 'Asunción'
  },
  {
    id: 137,
    name: 'Peru',
    flag: '🇵🇪',
    continent: 'Americas',
    utcOffset: 'UTC−05:00',
    timezoneName: 'Peru Time (PET)',
    primaryTzId: 'America/Lima',
    capitalOrMajorCity: 'Lima & Cusco'
  },
  {
    id: 138,
    name: 'Philippines',
    flag: '🇵🇭',
    continent: 'Asia',
    utcOffset: 'UTC+08:00',
    timezoneName: 'Philippine Standard Time (PST / PHT)',
    primaryTzId: 'Asia/Manila',
    capitalOrMajorCity: 'Manila'
  },
  {
    id: 139,
    name: 'Poland',
    flag: '🇵🇱',
    continent: 'Europe',
    utcOffset: 'UTC+01:00 / +02:00',
    timezoneName: 'Central European Summer Time (CEST)',
    primaryTzId: 'Europe/Warsaw',
    capitalOrMajorCity: 'Warsaw'
  },
  {
    id: 140,
    name: 'Portugal',
    flag: '🇵🇹',
    continent: 'Europe',
    utcOffset: 'UTC+00:00 / +01:00',
    timezoneName: 'Western European Summer Time (WEST)',
    primaryTzId: 'Europe/Lisbon',
    capitalOrMajorCity: 'Lisbon & Porto',
    subZones: [
      { name: 'Lisbon & Mainland', tzId: 'Europe/Lisbon', offset: 'UTC+00:00 / +01:00' },
      { name: 'Madeira', tzId: 'Atlantic/Madeira', offset: 'UTC+00:00 / +01:00' },
      { name: 'Azores (Ponta Delgada)', tzId: 'Atlantic/Azores', offset: 'UTC−01:00 / UTC±0' }
    ]
  },
  {
    id: 141,
    name: 'Qatar',
    flag: '🇶🇦',
    continent: 'Asia',
    utcOffset: 'UTC+03:00',
    timezoneName: 'Arabia Standard Time (AST)',
    primaryTzId: 'Asia/Qatar',
    capitalOrMajorCity: 'Doha'
  },
  {
    id: 142,
    name: 'Romania',
    flag: '🇷🇴',
    continent: 'Europe',
    utcOffset: 'UTC+02:00 / +03:00',
    timezoneName: 'Eastern European Summer Time (EEST)',
    primaryTzId: 'Europe/Bucharest',
    capitalOrMajorCity: 'Bucharest'
  },
  {
    id: 143,
    name: 'Russia',
    flag: '🇷🇺',
    continent: 'Europe',
    utcOffset: 'UTC+02:00 to +12:00 (11 Time Zones)',
    timezoneName: 'Kaliningrad through Kamchatka Time',
    primaryTzId: 'Europe/Moscow',
    capitalOrMajorCity: 'Moscow & Saint Petersburg',
    subZones: [
      { name: 'Moscow & Saint Petersburg (MSK)', tzId: 'Europe/Moscow', offset: 'UTC+03:00' },
      { name: 'Kaliningrad (USZ1)', tzId: 'Europe/Kaliningrad', offset: 'UTC+02:00' },
      { name: 'Samara (SAMT)', tzId: 'Europe/Samara', offset: 'UTC+04:00' },
      { name: 'Yekaterinburg (YEKT)', tzId: 'Asia/Yekaterinburg', offset: 'UTC+05:00' },
      { name: 'Omsk (OMST)', tzId: 'Asia/Omsk', offset: 'UTC+06:00' },
      { name: 'Novosibirsk & Krasnoyarsk', tzId: 'Asia/Novosibirsk', offset: 'UTC+07:00' },
      { name: 'Irkutsk (IRKT)', tzId: 'Asia/Irkutsk', offset: 'UTC+08:00' },
      { name: 'Yakutsk (YAKT)', tzId: 'Asia/Yakutsk', offset: 'UTC+09:00' },
      { name: 'Vladivostok (VLAT)', tzId: 'Asia/Vladivostok', offset: 'UTC+10:00' },
      { name: 'Magadan (MAGT)', tzId: 'Asia/Magadan', offset: 'UTC+11:00' },
      { name: 'Kamchatka & Chukotka (PETT)', tzId: 'Asia/Kamchatka', offset: 'UTC+12:00' }
    ]
  },
  {
    id: 144,
    name: 'Rwanda',
    flag: '🇷🇼',
    continent: 'Africa',
    utcOffset: 'UTC+02:00',
    timezoneName: 'Central Africa Time (CAT)',
    primaryTzId: 'Africa/Kigali',
    capitalOrMajorCity: 'Kigali'
  },
  {
    id: 145,
    name: 'Saint Kitts and Nevis',
    flag: '🇰🇳',
    continent: 'Americas',
    utcOffset: 'UTC−04:00',
    timezoneName: 'Atlantic Standard Time (AST)',
    primaryTzId: 'America/Port_of_Spain',
    capitalOrMajorCity: 'Basseterre'
  },
  {
    id: 146,
    name: 'Saint Lucia',
    flag: '🇱🇨',
    continent: 'Americas',
    utcOffset: 'UTC−04:00',
    timezoneName: 'Atlantic Standard Time (AST)',
    primaryTzId: 'America/St_Lucia',
    capitalOrMajorCity: 'Castries'
  },
  {
    id: 147,
    name: 'Saint Vincent and the Grenadines',
    flag: '🇻🇨',
    continent: 'Americas',
    utcOffset: 'UTC−04:00',
    timezoneName: 'Atlantic Standard Time (AST)',
    primaryTzId: 'America/St_Vincent',
    capitalOrMajorCity: 'Kingstown'
  },
  {
    id: 148,
    name: 'Samoa',
    flag: '🇼🇸',
    continent: 'Oceania',
    utcOffset: 'UTC+13:00',
    timezoneName: 'Samoa Standard Time (WST)',
    primaryTzId: 'Pacific/Apia',
    capitalOrMajorCity: 'Apia'
  },
  {
    id: 149,
    name: 'San Marino',
    flag: '🇸🇲',
    continent: 'Europe',
    utcOffset: 'UTC+01:00 / +02:00',
    timezoneName: 'Central European Summer Time (CEST)',
    primaryTzId: 'Europe/San_Marino',
    capitalOrMajorCity: 'San Marino'
  },
  {
    id: 150,
    name: 'São Tomé and Príncipe',
    flag: '🇸🇹',
    continent: 'Africa',
    utcOffset: 'UTC+00:00',
    timezoneName: 'Greenwich Mean Time (GMT)',
    primaryTzId: 'Africa/Sao_Tome',
    capitalOrMajorCity: 'São Tomé'
  },
  {
    id: 151,
    name: 'Saudi Arabia',
    flag: '🇸🇦',
    continent: 'Asia',
    utcOffset: 'UTC+03:00',
    timezoneName: 'Arabia Standard Time (AST)',
    primaryTzId: 'Asia/Riyadh',
    capitalOrMajorCity: 'Riyadh & Jeddah'
  },
  {
    id: 152,
    name: 'Senegal',
    flag: '🇸🇳',
    continent: 'Africa',
    utcOffset: 'UTC+00:00',
    timezoneName: 'Greenwich Mean Time (GMT)',
    primaryTzId: 'Africa/Dakar',
    capitalOrMajorCity: 'Dakar'
  },
  {
    id: 153,
    name: 'Serbia',
    flag: '🇷🇸',
    continent: 'Europe',
    utcOffset: 'UTC+01:00 / +02:00',
    timezoneName: 'Central European Summer Time (CEST)',
    primaryTzId: 'Europe/Belgrade',
    capitalOrMajorCity: 'Belgrade'
  },
  {
    id: 154,
    name: 'Seychelles',
    flag: '🇸🇨',
    continent: 'Africa',
    utcOffset: 'UTC+04:00',
    timezoneName: 'Seychelles Time (SCT)',
    primaryTzId: 'Indian/Mahe',
    capitalOrMajorCity: 'Victoria'
  },
  {
    id: 155,
    name: 'Sierra Leone',
    flag: '🇸🇱',
    continent: 'Africa',
    utcOffset: 'UTC+00:00',
    timezoneName: 'Greenwich Mean Time (GMT)',
    primaryTzId: 'Africa/Freetown',
    capitalOrMajorCity: 'Freetown'
  },
  {
    id: 156,
    name: 'Singapore',
    flag: '🇸🇬',
    continent: 'Asia',
    utcOffset: 'UTC+08:00',
    timezoneName: 'Singapore Standard Time (SGT)',
    primaryTzId: 'Asia/Singapore',
    capitalOrMajorCity: 'Singapore'
  },
  {
    id: 157,
    name: 'Slovakia',
    flag: '🇸🇰',
    continent: 'Europe',
    utcOffset: 'UTC+01:00 / +02:00',
    timezoneName: 'Central European Summer Time (CEST)',
    primaryTzId: 'Europe/Bratislava',
    capitalOrMajorCity: 'Bratislava'
  },
  {
    id: 158,
    name: 'Slovenia',
    flag: '🇸🇮',
    continent: 'Europe',
    utcOffset: 'UTC+01:00 / +02:00',
    timezoneName: 'Central European Summer Time (CEST)',
    primaryTzId: 'Europe/Ljubljana',
    capitalOrMajorCity: 'Ljubljana'
  },
  {
    id: 159,
    name: 'Solomon Islands',
    flag: '🇸🇧',
    continent: 'Oceania',
    utcOffset: 'UTC+11:00',
    timezoneName: 'Solomon Islands Time (SBT)',
    primaryTzId: 'Pacific/Guadalcanal',
    capitalOrMajorCity: 'Honiara'
  },
  {
    id: 160,
    name: 'Somalia',
    flag: '🇸🇴',
    continent: 'Africa',
    utcOffset: 'UTC+03:00',
    timezoneName: 'East Africa Time (EAT)',
    primaryTzId: 'Africa/Mogadishu',
    capitalOrMajorCity: 'Mogadishu'
  },
  {
    id: 161,
    name: 'South Africa',
    flag: '🇿🇦',
    continent: 'Africa',
    utcOffset: 'UTC+02:00',
    timezoneName: 'South Africa Standard Time (SAST)',
    primaryTzId: 'Africa/Johannesburg',
    capitalOrMajorCity: 'Pretoria & Cape Town'
  },
  {
    id: 162,
    name: 'South Korea',
    flag: '🇰🇷',
    continent: 'Asia',
    utcOffset: 'UTC+09:00',
    timezoneName: 'Korea Standard Time (KST)',
    primaryTzId: 'Asia/Seoul',
    capitalOrMajorCity: 'Seoul'
  },
  {
    id: 163,
    name: 'South Sudan',
    flag: '🇸🇸',
    continent: 'Africa',
    utcOffset: 'UTC+02:00',
    timezoneName: 'Central Africa Time (CAT)',
    primaryTzId: 'Africa/Juba',
    capitalOrMajorCity: 'Juba'
  },
  {
    id: 164,
    name: 'Spain',
    flag: '🇪🇸',
    continent: 'Europe',
    utcOffset: 'UTC+01:00 / +02:00',
    timezoneName: 'Central European Summer Time (CEST)',
    primaryTzId: 'Europe/Madrid',
    capitalOrMajorCity: 'Madrid & Barcelona',
    subZones: [
      { name: 'Peninsular Spain (Madrid, Barcelona)', tzId: 'Europe/Madrid', offset: 'UTC+01:00 / +02:00' },
      { name: 'Canary Islands (Tenerife)', tzId: 'Atlantic/Canary', offset: 'UTC+00:00 / +01:00' }
    ]
  },
  {
    id: 165,
    name: 'Sri Lanka',
    flag: '🇱🇰',
    continent: 'Asia',
    utcOffset: 'UTC+05:30',
    timezoneName: 'Sri Lanka Standard Time (SLST)',
    primaryTzId: 'Asia/Colombo',
    capitalOrMajorCity: 'Colombo'
  },
  {
    id: 166,
    name: 'Sudan',
    flag: '🇸🇩',
    continent: 'Africa',
    utcOffset: 'UTC+02:00',
    timezoneName: 'Central Africa Time (CAT)',
    primaryTzId: 'Africa/Khartoum',
    capitalOrMajorCity: 'Khartoum'
  },
  {
    id: 167,
    name: 'Suriname',
    flag: '🇸🇷',
    continent: 'Americas',
    utcOffset: 'UTC−03:00',
    timezoneName: 'Suriname Time (SRT)',
    primaryTzId: 'America/Paramaribo',
    capitalOrMajorCity: 'Paramaribo'
  },
  {
    id: 168,
    name: 'Sweden',
    flag: '🇸🇪',
    continent: 'Europe',
    utcOffset: 'UTC+01:00 / +02:00',
    timezoneName: 'Central European Summer Time (CEST)',
    primaryTzId: 'Europe/Stockholm',
    capitalOrMajorCity: 'Stockholm'
  },
  {
    id: 169,
    name: 'Switzerland',
    flag: '🇨🇭',
    continent: 'Europe',
    utcOffset: 'UTC+01:00 / +02:00',
    timezoneName: 'Central European Summer Time (CEST)',
    primaryTzId: 'Europe/Zurich',
    capitalOrMajorCity: 'Bern & Zurich'
  },
  {
    id: 170,
    name: 'Syria',
    flag: '🇸🇾',
    continent: 'Asia',
    utcOffset: 'UTC+03:00',
    timezoneName: 'Arabia Standard Time (AST)',
    primaryTzId: 'Asia/Damascus',
    capitalOrMajorCity: 'Damascus'
  },
  {
    id: 171,
    name: 'Tajikistan',
    flag: '🇹🇯',
    continent: 'Asia',
    utcOffset: 'UTC+05:00',
    timezoneName: 'Tajikistan Time (TJT)',
    primaryTzId: 'Asia/Dushanbe',
    capitalOrMajorCity: 'Dushananbe'
  },
  {
    id: 172,
    name: 'Tanzania',
    flag: '🇹🇿',
    continent: 'Africa',
    utcOffset: 'UTC+03:00',
    timezoneName: 'East Africa Time (EAT)',
    primaryTzId: 'Africa/Dar_es_Salaam',
    capitalOrMajorCity: 'Dodoma & Dar es Salaam'
  },
  {
    id: 173,
    name: 'Thailand',
    flag: '🇹🇭',
    continent: 'Asia',
    utcOffset: 'UTC+07:00',
    timezoneName: 'Indochina Time (ICT)',
    primaryTzId: 'Asia/Bangkok',
    capitalOrMajorCity: 'Bangkok'
  },
  {
    id: 174,
    name: 'Timor-Leste',
    flag: '🇹🇱',
    continent: 'Asia',
    utcOffset: 'UTC+09:00',
    timezoneName: 'Timor-Leste Time (TLT)',
    primaryTzId: 'Asia/Dili',
    capitalOrMajorCity: 'Dili'
  },
  {
    id: 175,
    name: 'Togo',
    flag: '🇹🇬',
    continent: 'Africa',
    utcOffset: 'UTC+00:00',
    timezoneName: 'Greenwich Mean Time (GMT)',
    primaryTzId: 'Africa/Lome',
    capitalOrMajorCity: 'Lomé'
  },
  {
    id: 176,
    name: 'Tonga',
    flag: '🇹🇴',
    continent: 'Oceania',
    utcOffset: 'UTC+13:00',
    timezoneName: 'Tonga Standard Time (TOT)',
    primaryTzId: 'Pacific/Tongatapu',
    capitalOrMajorCity: 'Nukuʻalofa'
  },
  {
    id: 177,
    name: 'Trinidad and Tobago',
    flag: '🇹🇹',
    continent: 'Americas',
    utcOffset: 'UTC−04:00',
    timezoneName: 'Atlantic Standard Time (AST)',
    primaryTzId: 'America/Port_of_Spain',
    capitalOrMajorCity: 'Port of Spain'
  },
  {
    id: 178,
    name: 'Tunisia',
    flag: '🇹🇳',
    continent: 'Africa',
    utcOffset: 'UTC+01:00',
    timezoneName: 'Central European Time (CET)',
    primaryTzId: 'Africa/Tunis',
    capitalOrMajorCity: 'Tunis'
  },
  {
    id: 179,
    name: 'Türkiye',
    flag: '🇹🇷',
    continent: 'Asia',
    utcOffset: 'UTC+03:00',
    timezoneName: 'Türkiye Time (TRT)',
    primaryTzId: 'Europe/Istanbul',
    capitalOrMajorCity: 'Ankara & Istanbul'
  },
  {
    id: 180,
    name: 'Turkmenistan',
    flag: '🇹🇲',
    continent: 'Asia',
    utcOffset: 'UTC+05:00',
    timezoneName: 'Turkmenistan Time (TMT)',
    primaryTzId: 'Asia/Ashgabat',
    capitalOrMajorCity: 'Ashgabat'
  },
  {
    id: 181,
    name: 'Tuvalu',
    flag: '🇹🇻',
    continent: 'Oceania',
    utcOffset: 'UTC+12:00',
    timezoneName: 'Tuvalu Time (TVT)',
    primaryTzId: 'Pacific/Funafuti',
    capitalOrMajorCity: 'Funafuti'
  },
  {
    id: 182,
    name: 'Uganda',
    flag: '🇺🇬',
    continent: 'Africa',
    utcOffset: 'UTC+03:00',
    timezoneName: 'East Africa Time (EAT)',
    primaryTzId: 'Africa/Kampala',
    capitalOrMajorCity: 'Kampala'
  },
  {
    id: 183,
    name: 'Ukraine',
    flag: '🇺🇦',
    continent: 'Europe',
    utcOffset: 'UTC+02:00 / +03:00',
    timezoneName: 'Eastern European Summer Time (EEST)',
    primaryTzId: 'Europe/Kyiv',
    capitalOrMajorCity: 'Kyiv'
  },
  {
    id: 184,
    name: 'United Arab Emirates',
    flag: '🇦🇪',
    continent: 'Asia',
    utcOffset: 'UTC+04:00',
    timezoneName: 'Gulf Standard Time (GST)',
    primaryTzId: 'Asia/Dubai',
    capitalOrMajorCity: 'Abu Dhabi & Dubai'
  },
  {
    id: 185,
    name: 'United Kingdom',
    flag: '🇬🇧',
    continent: 'Europe',
    utcOffset: 'UTC+00:00 / +01:00',
    timezoneName: 'Greenwich Mean Time (GMT) / British Summer Time (BST)',
    primaryTzId: 'Europe/London',
    capitalOrMajorCity: 'London & Edinburgh',
    subZones: [
      { name: 'London & UK Mainland', tzId: 'Europe/London', offset: 'UTC+00:00 / +01:00' },
      { name: 'Gibraltar', tzId: 'Europe/Gibraltar', offset: 'UTC+01:00 / +02:00' },
      { name: 'Bermuda', tzId: 'Atlantic/Bermuda', offset: 'UTC−04:00 / −03:00' },
      { name: 'Cayman Islands', tzId: 'America/Cayman', offset: 'UTC−05:00' },
      { name: 'Falkland Islands', tzId: 'Atlantic/Stanley', offset: 'UTC−03:00' }
    ]
  },
  {
    id: 186,
    name: 'United States',
    flag: '🇺🇸',
    continent: 'Americas',
    utcOffset: 'UTC−10:00 to −04:00 (11 Zones)',
    timezoneName: 'Eastern / Central / Mountain / Pacific / Alaska / Hawaii Time',
    primaryTzId: 'America/New_York',
    capitalOrMajorCity: 'Washington D.C. & New York',
    subZones: [
      { name: 'Eastern (New York, Miami, DC)', tzId: 'America/New_York', offset: 'UTC−05:00 / −04:00' },
      { name: 'Central (Chicago, Dallas, Houston)', tzId: 'America/Chicago', offset: 'UTC−06:00 / −05:00' },
      { name: 'Mountain (Denver, Salt Lake City)', tzId: 'America/Denver', offset: 'UTC−07:00 / −06:00' },
      { name: 'Arizona (Phoenix - No DST)', tzId: 'America/Phoenix', offset: 'UTC−07:00' },
      { name: 'Pacific (Los Angeles, San Francisco, Seattle)', tzId: 'America/Los_Angeles', offset: 'UTC−08:00 / −07:00' },
      { name: 'Alaska (Anchorage, Juneau)', tzId: 'America/Anchorage', offset: 'UTC−09:00 / −08:00' },
      { name: 'Hawaii (Honolulu - No DST)', tzId: 'Pacific/Honolulu', offset: 'UTC−10:00' },
      { name: 'Aleutian Islands (Adak)', tzId: 'America/Adak', offset: 'UTC−10:00 / −09:00' },
      { name: 'Puerto Rico / Virgin Islands', tzId: 'America/Puerto_Rico', offset: 'UTC−04:00' },
      { name: 'Guam & Northern Mariana', tzId: 'Pacific/Guam', offset: 'UTC+10:00' },
      { name: 'American Samoa (Pago Pago)', tzId: 'Pacific/Pago_Pago', offset: 'UTC−11:00' }
    ]
  },
  {
    id: 187,
    name: 'Uruguay',
    flag: '🇺🇾',
    continent: 'Americas',
    utcOffset: 'UTC−03:00',
    timezoneName: 'Uruguay Time (UYT)',
    primaryTzId: 'America/Montevideo',
    capitalOrMajorCity: 'Montevideo'
  },
  {
    id: 188,
    name: 'Uzbekistan',
    flag: '🇺🇿',
    continent: 'Asia',
    utcOffset: 'UTC+05:00',
    timezoneName: 'Uzbekistan Time (UZT)',
    primaryTzId: 'Asia/Tashkent',
    capitalOrMajorCity: 'Tashkent & Samarkand'
  },
  {
    id: 189,
    name: 'Vanuatu',
    flag: '🇻🇺',
    continent: 'Oceania',
    utcOffset: 'UTC+11:00',
    timezoneName: 'Vanuatu Time (VUT)',
    primaryTzId: 'Pacific/Efate',
    capitalOrMajorCity: 'Port Vila'
  },
  {
    id: 190,
    name: 'Vatican City',
    flag: '🇻🇦',
    continent: 'Europe',
    utcOffset: 'UTC+01:00 / +02:00',
    timezoneName: 'Central European Summer Time (CEST)',
    primaryTzId: 'Europe/Vatican',
    capitalOrMajorCity: 'Vatican City'
  },
  {
    id: 191,
    name: 'Venezuela',
    flag: '🇻🇪',
    continent: 'Americas',
    utcOffset: 'UTC−04:00',
    timezoneName: 'Venezuela Time (VET)',
    primaryTzId: 'America/Caracas',
    capitalOrMajorCity: 'Caracas'
  },
  {
    id: 192,
    name: 'Vietnam',
    flag: '🇻🇳',
    continent: 'Asia',
    utcOffset: 'UTC+07:00',
    timezoneName: 'Indochina Time (ICT)',
    primaryTzId: 'Asia/Ho_Chi_Minh',
    capitalOrMajorCity: 'Hanoi & Ho Chi Minh City'
  },
  {
    id: 193,
    name: 'Yemen',
    flag: '🇾🇪',
    continent: 'Asia',
    utcOffset: 'UTC+03:00',
    timezoneName: 'Arabia Standard Time (AST)',
    primaryTzId: 'Asia/Aden',
    capitalOrMajorCity: "Sana'a & Aden"
  },
  {
    id: 194,
    name: 'Zambia',
    flag: '🇿🇲',
    continent: 'Africa',
    utcOffset: 'UTC+02:00',
    timezoneName: 'Central Africa Time (CAT)',
    primaryTzId: 'Africa/Lusaka',
    capitalOrMajorCity: 'Lusaka'
  },
  {
    id: 195,
    name: 'Zimbabwe',
    flag: '🇿🇼',
    continent: 'Africa',
    utcOffset: 'UTC+02:00',
    timezoneName: 'Central Africa Time (CAT)',
    primaryTzId: 'Africa/Harare',
    capitalOrMajorCity: 'Harare'
  }
];
