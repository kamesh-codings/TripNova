import { EmergencyPhrase, SafetyPlace, CountryRule, LocalGuide, UserProfile } from '../types';

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'usr_guest_01',
  name: '',
  email: '',
  googleId: '',
  avatarUrl: '',
  nativeCurrency: 'INR',
  dob: '',
  age: 0,
  gender: 'Male',
  bloodGroup: 'Unknown',
  allergies: '',
  medicalConditions: '',
  disability: '',
  address: '',
  govtIdType: 'Aadhaar Card',
  govtIdNumber: '',
  govtIdState: '',
  languagesKnown: [],
  trustedContacts: [
    { id: 'tc1', name: '', relationship: 'Family', phone: '', isPrimary: true }
  ],
  interestedTopPicks: [],
  isRegistered: false
};

export const TOP_PICKS_CATEGORIES = [
  {
    id: 'heritage',
    title: 'Heritage & Temples',
    tagline: 'Ancient Dravidian architecture & historic wonders',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    spots: ['Brihadeeswarar Temple, Thanjavur', 'Meenakshi Amman Temple, Madurai', 'Shore Temple, Mahabalipuram', 'Rameshwaram Corridor']
  },
  {
    id: 'hills',
    title: 'Hill Stations & Mist',
    tagline: 'Cool mountain breezes and tea plantations',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    spots: ['Ooty Nilgiri Hills', 'Kodaikanal Lake & Pillar Rocks', 'Yercaud Shevaroy Hills', 'Valparai Tea Valleys']
  },
  {
    id: 'coastal',
    title: 'Beaches & Coastal Drives',
    tagline: 'East Coast Road sunsets & serene coastlines',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    spots: ['Marina Beach & Promenade', 'Dhanushkodi Ghost Town Coast', 'Kanyakumari Sunset Point', 'Puducherry French Quarter']
  },
  {
    id: 'nature',
    title: 'Nature & Waterfalls',
    tagline: 'Lush biodiversity, rainforests & cascading falls',
    image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80',
    spots: ['Hogenakkal Falls', 'Courtallam Waterfalls', 'Mudumalai Tiger Reserve', 'Anamalai Wildlife Sanctuary']
  },
  {
    id: 'culinary',
    title: 'Food & Culinary Trails',
    tagline: 'Chettinad spices, filter coffee & authentic street delicacies',
    image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=800&q=80',
    spots: ['Karaikudi Chettinad Mansions', 'Madurai Jigarthanda Trail', 'Tirunelveli Halwa Stores', 'Chennai Sowcarpet Street Food']
  }
];

export const EMERGENCY_PHRASES: EmergencyPhrase[] = [
  {
    id: 'p1',
    category: 'medical',
    english: 'I need urgent medical help! Please call an ambulance.',
    tamil: 'எனக்கு உடனடியாக மருத்துவ உதவி தேவை! தயவுசெய்து ஆம்புலன்ஸை அழையுங்கள்.',
    hindi: 'मुझे तुरंत चिकित्सीय सहायता चाहिए! कृपया एम्बुलेंस बुलाएं।',
    french: "J'ai besoin d'une aide médicale urgente ! Veuillez appeler une ambulance.",
    spanish: '¡Necesito ayuda médica urgente! Por favor llame a una ambulancia.',
    audioPrompt: 'I need urgent medical help! Please call an ambulance.',
    importance: 'critical'
  },
  {
    id: 'p2',
    category: 'police',
    english: 'Please help me, I am being harassed / attacked. Call the police!',
    tamil: 'தயவுசெய்து எனக்கு உதவுங்கள், என்னை மிரட்டுகிறார்கள். போலீஸை அழையுங்கள்!',
    hindi: 'कृपया मेरी मदद करें, मुझे परेशान किया जा रहा है। पुलिस को बुलाओ!',
    french: "Aidez-moi s'il vous plaît, je suis agressé. Appelez la police !",
    spanish: '¡Por favor ayúdame, me están acosando! ¡Llama a la policía!',
    audioPrompt: 'Please help me, call the police immediately!',
    importance: 'critical'
  },
  {
    id: 'p3',
    category: 'medical',
    english: 'I have severe allergies and I am having trouble breathing.',
    tamil: 'எனக்கு கடுமையான ஒவ்வாமை உள்ளது மற்றும் எனக்கு மூச்சுத்திணறல் ஏற்படுகிறது.',
    hindi: 'मुझे गंभीर एलर्जी है और मुझे सांस लेने में कठिनाई हो रही है।',
    french: "J'ai de graves allergies et j'ai du mal à respirer.",
    spanish: 'Tengo alergias graves y tengo dificultades para respirar.',
    audioPrompt: 'I have severe allergies and difficulty breathing.',
    importance: 'high'
  },
  {
    id: 'p4',
    category: 'urgent',
    english: 'I am lost. Where is the nearest police station or hospital?',
    tamil: 'நான் வழி தவறிவிட்டேன். அருகிலுள்ள காவல் நிலையம் அல்லது மருத்துவமனை எங்கே உள்ளது?',
    hindi: 'मैं रास्ता भटक गया हूँ। निकटतम पुलिस स्टेशन या अस्पताल कहाँ है?',
    french: "Je suis perdu. Où se trouve le poste de police ou l'hôpital le plus proche ?",
    spanish: 'Estoy perdido. ¿Dónde está la estación de policía o el hospital más cercano?',
    audioPrompt: 'I am lost. Where is the nearest police station or hospital?',
    importance: 'normal'
  },
  {
    id: 'p5',
    category: 'direction',
    english: 'Can you please show me the way to the main bus station or railway junction?',
    tamil: 'முக்கிய பேருந்து நிலையம் அல்லது ரயில் நிலையத்திற்கு வழிகாட்ட முடியுமா?',
    hindi: 'क्या आप मुझे मुख्य बस स्टेशन या रेलवे स्टेशन का रास्ता बता सकते हैं?',
    french: 'Pouvez-vous me montrer le chemin vers la gare principale ?',
    spanish: '¿Puede mostrarme el camino a la estación principal?',
    audioPrompt: 'Can you show me the way to the railway station or bus stand?',
    importance: 'normal'
  },
  {
    id: 'p6',
    category: 'urgent',
    english: 'My passport, phone and wallet were stolen! I need immediate help.',
    tamil: 'என் பாஸ்போர்ட், போன் மற்றும் பணம் திருடப்பட்டுவிட்டது! எனக்கு உடனடியாக உதவி வேண்டும்.',
    hindi: 'मेरा पासपोर्ट, फोन और बटुआ चोरी हो गया है! मुझे तत्काल मदद चाहिए।',
    french: "Mon passeport, téléphone et portefeuille ont été volés ! J'ai besoin d'aide.",
    spanish: '¡Me han robado el pasaporte, el teléfono y la cartera! Necesito ayuda.',
    audioPrompt: 'My belongings were stolen. I need assistance.',
    importance: 'high'
  }
];

export const NEARBY_HOSPITALS: SafetyPlace[] = [
  {
    id: 'h1',
    type: 'hospital',
    name: 'Apollo Speciality Multi-Super Hospital',
    address: 'Greams Road, Thousand Lights, Chennai, TN',
    phone: '+91 44 2829 0200',
    emergencyHotline: '1066 / 108',
    distanceKm: 1.2,
    rating: 4.8,
    openHours: 'Open 24/7 Emergency & Trauma',
    verified: true
  },
  {
    id: 'h2',
    type: 'hospital',
    name: 'Government Rajaji General Hospital',
    address: 'Panagal Road, Shenoy Nagar, Madurai, TN',
    phone: '+91 452 253 2535',
    emergencyHotline: '108',
    distanceKm: 2.5,
    rating: 4.5,
    openHours: 'Open 24/7 Free Govt Emergency',
    verified: true
  },
  {
    id: 'h3',
    type: 'hospital',
    name: 'KIMS Alshifa Emergency Hospital',
    address: 'Ooty-Coonoor Highway, Nilgiris, TN',
    phone: '+91 423 244 4455',
    emergencyHotline: '108',
    distanceKm: 3.8,
    rating: 4.6,
    openHours: 'Open 24/7',
    verified: true
  },
  {
    id: 'h4',
    type: 'pharmacy',
    name: 'Apollo 24/7 Night Pharmacy & First Aid',
    address: 'Opp. Central Railway Station, Coimbatore, TN',
    phone: '+91 422 222 1000',
    emergencyHotline: '1860 500 0101',
    distanceKm: 0.6,
    rating: 4.7,
    openHours: 'Open 24 Hours',
    verified: true
  }
];

export const NEARBY_POLICE_STATIONS: SafetyPlace[] = [
  {
    id: 'p1',
    type: 'police',
    name: 'Tamil Nadu Tourist Police & Help Desk Precinct',
    address: 'Marina Beach Road, Triplicane, Chennai, TN',
    phone: '+91 44 2844 7788',
    emergencyHotline: '100 / 112 / 1091 (Women)',
    distanceKm: 0.9,
    rating: 4.9,
    openHours: 'Open 24/7 Tourist Assistance',
    verified: true
  },
  {
    id: 'p2',
    type: 'police',
    name: 'Central City Law & Order Police Station',
    address: 'Town Hall Circle, West Boulevard, Madurai, TN',
    phone: '+91 452 234 1100',
    emergencyHotline: '100 / 112',
    distanceKm: 1.8,
    rating: 4.4,
    openHours: 'Open 24/7',
    verified: true
  },
  {
    id: 'p3',
    type: 'police',
    name: 'Nilgiris Hill District Highway Police Patrol',
    address: 'Commercial Road Junction, Ooty, TN',
    phone: '+91 423 244 2200',
    emergencyHotline: '112 / 103 (Highway)',
    distanceKm: 2.1,
    rating: 4.6,
    openHours: 'Open 24/7',
    verified: true
  }
];

export const COUNTRY_RULES: CountryRule[] = [
  {
    country: 'India (Tamil Nadu Focus)',
    flag: '🇮🇳',
    emergencyNumbers: {
      universal: '112',
      police: '100',
      ambulance: '108',
      fire: '101'
    },
    timezone: 'Asia/Kolkata (IST)',
    gmtOffset: 'UTC +05:30',
    currencyCode: 'INR',
    currencySymbol: '₹',
    exchangeRateToINR: 1.0,
    keyRegulations: [
      'Carry valid ID proof (Passport / Aadhaar) for hotel check-ins and monument tickets.',
      'Modest dress code mandatory when visiting traditional temples (shoulders & knees covered). Footwear strictly removed outside.',
      'Always insist on meter or pre-fixed official app fares for Auto-rickshaws to avoid surge gouging.',
      'Drinking in public places is prohibited under state regulations.'
    ],
    culturalEtiquette: [
      'Use right hand for giving, receiving money, or eating.',
      'A gentle "Vanakkam" (folded hands) is a respected greeting.',
      'Respect photography restrictions inside sanctum sanctorum of heritage temples.'
    ],
    scamAlerts: [
      'Unauthorized "Temple Guides" charging ₹1,500 - ₹3,000 for VIP darshan lines.',
      'Auto drivers claiming destination is "closed for festival" to redirect you to commission craft shops.',
      'Uncalibrated taxi meters charging 5x standard tariff.'
    ]
  },
  {
    country: 'United States',
    flag: '🇺🇸',
    emergencyNumbers: {
      universal: '911',
      police: '911',
      ambulance: '911',
      fire: '911'
    },
    timezone: 'America/New_York (EST)',
    gmtOffset: 'UTC -05:00',
    currencyCode: 'USD',
    currencySymbol: '$',
    exchangeRateToINR: 86.85,
    keyRegulations: [
      'Jaywalking is strictly fined in major city downtowns.',
      'Standard tipping etiquette is 15% - 20% in restaurants.',
      'Strict 21+ age verification for alcohol and nightlife venues.'
    ],
    culturalEtiquette: [
      'Maintain personal space in queues.',
      'Eye contact and a friendly "How are you?" is customary.'
    ],
    scamAlerts: [
      'Fake CD/Bracelet gifting in tourist squares demanding hefty "tips".',
      'Unlicensed airport curbside ride touts.'
    ]
  },
  {
    country: 'United Kingdom',
    flag: '🇬🇧',
    emergencyNumbers: {
      universal: '999',
      police: '101 (Non-urgent) / 999',
      ambulance: '999 / 111 (Medical Advice)',
      fire: '999'
    },
    timezone: 'Europe/London (GMT/BST)',
    gmtOffset: 'UTC +00:00',
    currencyCode: 'GBP',
    currencySymbol: '£',
    exchangeRateToINR: 109.50,
    keyRegulations: [
      'Stand on the right on Tube escalators.',
      'Oyster card or contactless payment needed for public transit (cash not accepted on London buses).'
    ],
    culturalEtiquette: [
      'Queuing order is sacred and queue jumping is heavily frowned upon.',
      'Polite "sorry" and "excuse me" are ubiquitous.'
    ],
    scamAlerts: [
      'Fake police checking tourist wallets for counterfeit money.',
      'Three-card monte / shell games on pedestrian bridges.'
    ]
  },
  {
    country: 'United Arab Emirates (Dubai)',
    flag: '🇦🇪',
    emergencyNumbers: {
      universal: '999',
      police: '999',
      ambulance: '998',
      fire: '997'
    },
    timezone: 'Asia/Dubai (GST)',
    gmtOffset: 'UTC +04:00',
    currencyCode: 'AED',
    currencySymbol: 'د.إ',
    exchangeRateToINR: 23.65,
    keyRegulations: [
      'Zero tolerance on narcotics and specific prescription medications without attested doctor clearance.',
      'Photography of government buildings and individuals without consent is illegal.',
      'Public displays of affection are restricted in public family areas.'
    ],
    culturalEtiquette: [
      'Dress respectfully in public malls and religious centers.',
      'Eating or drinking on public transport during fasting hours is prohibited.'
    ],
    scamAlerts: [
      'Counterfeit perfume and designer watch hawkers in alleyways.',
      'Unofficial desert safari tour operators without licensed safety roll-cages.'
    ]
  },
  {
    country: 'Singapore',
    flag: '🇸🇬',
    emergencyNumbers: {
      universal: '995',
      police: '999',
      ambulance: '995',
      fire: '995'
    },
    timezone: 'Asia/Singapore (SGT)',
    gmtOffset: 'UTC +08:00',
    currencyCode: 'SGD',
    currencySymbol: 'S$',
    exchangeRateToINR: 64.70,
    keyRegulations: [
      'Chewing gum import/sale is strictly banned.',
      'Heavy fines for littering, jaywalking, or smoking in unauthorized zones.',
      'Strict drug trafficking laws with capital punishment.'
    ],
    culturalEtiquette: [
      '"Chope" culture: Leaving a packet of tissues on hawker center tables reserves the seat.',
      'Return food trays after dining in public food centers.'
    ],
    scamAlerts: [
      'Electronics shop warranty upselling scams in unlicensed corners.'
    ]
  },
  {
    country: 'France',
    flag: '🇫🇷',
    emergencyNumbers: {
      universal: '112',
      police: '17',
      ambulance: '15 (SAMU)',
      fire: '18'
    },
    timezone: 'Europe/Paris (CET)',
    gmtOffset: 'UTC +01:00',
    currencyCode: 'EUR',
    currencySymbol: '€',
    exchangeRateToINR: 91.20,
    keyRegulations: [
      'Validate metro tickets and keep them until you exit the station.',
      'Service charge is included in restaurant bills by law ("service compris").'
    ],
    culturalEtiquette: [
      'Always greet shopkeepers with "Bonjour Madame/Monsieur" upon entering.',
      'Speak softly in public transport.'
    ],
    scamAlerts: [
      'Petition signers / clipboard distraction pickpockets near Eiffel Tower & Louvre.',
      'String / Friendship bracelet scam at Sacré-Cœur steps.'
    ]
  },
  {
    country: 'Japan',
    flag: '🇯🇵',
    emergencyNumbers: {
      universal: '110 / 119',
      police: '110',
      ambulance: '119',
      fire: '119'
    },
    timezone: 'Asia/Tokyo (JST)',
    gmtOffset: 'UTC +09:00',
    currencyCode: 'JPY',
    currencySymbol: '¥',
    exchangeRateToINR: 0.58,
    keyRegulations: [
      'Carry passport at all times (police can conduct random checks on tourists).',
      'No tipping; it can be considered impolite or confusing.',
      'Public garbage cans are rare; tourists must carry their trash.'
    ],
    culturalEtiquette: [
      'No talking on phones on public trains.',
      'Take off shoes when stepping onto tatami mats or inside designated lodgings.'
    ],
    scamAlerts: [
      'Nightclub / bar touts in Roppongi / Kabukicho promising cheap drinks leading to exorbitant hidden cover charges.'
    ]
  }
];

export const LOCAL_GUIDES: LocalGuide[] = [
  {
    id: 'g1',
    name: 'K. Ranganathan (Govt Certified Heritage Guide)',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    location: 'Madurai & Thanjavur, Tamil Nadu',
    languages: ['Tamil', 'English', 'French', 'Telugu'],
    rating: 4.95,
    reviewsCount: 142,
    specialty: 'Temple Inscriptions, Chola Architecture & Dravidian History',
    hourlyRate: 450,
    phone: '+91 94432 11988',
    verified: true,
    bio: '14+ years experience with Archeological Survey of India registered guide badge. Specialized in secret architecture symbolism of Great Living Chola Temples.'
  },
  {
    id: 'g2',
    name: 'Shreya Sundaram (Nature & Eco-Trek Specialist)',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    location: 'Nilgiris (Ooty & Coonoor), Tamil Nadu',
    languages: ['Tamil', 'English', 'Badaga', 'Hindi'],
    rating: 4.9,
    reviewsCount: 98,
    specialty: 'High Altitude Tea Estate Trails & Bird Watching',
    hourlyRate: 500,
    phone: '+91 98421 77654',
    verified: true,
    bio: 'Botanist and certified mountain leader. Leads private walks through Toda tribal hamlets and heritage steam railway trails.'
  },
  {
    id: 'g3',
    name: 'Mohamed Faisal (Coastal & Heritage Explorer)',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    location: 'Ramanathapuram (Rameshwaram), Tamil Nadu',
    languages: ['Tamil', 'Hindi', 'English', 'Malayalam'],
    rating: 4.88,
    reviewsCount: 110,
    specialty: 'Ram Setu Lore, Coral Beach Walks & Marine Sanctuary',
    hourlyRate: 400,
    phone: '+91 94862 33441',
    verified: true,
    bio: 'Born in Dhanushkodi coastal belt. Knows the safest hidden spots, legend lore, and provides 4x4 sand dune guidance.'
  },
  {
    id: 'g4',
    name: 'Aravind Krishnan (Colonial & Cultural Walk Guide)',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    location: 'Chennai & Chengalpattu (Mamallapuram), Tamil Nadu',
    languages: ['English', 'Tamil', 'Hindi', 'German'],
    rating: 4.92,
    reviewsCount: 165,
    specialty: 'Shore Temples, Pallava Monoliths & British Colonial Heritage',
    hourlyRate: 550,
    phone: '+91 98401 22334',
    verified: true,
    bio: 'Ministry of Tourism certified guide. Specializes in UNESCO monuments of Mamallapuram, Fort St. George, and George Town heritage walks.'
  },
  {
    id: 'g5',
    name: 'Anjali Menon (Backwaters & Spice Trail Guide)',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    location: 'Ernakulam (Kochi) & Alappuzha, Kerala',
    languages: ['Malayalam', 'English', 'Hindi', 'French'],
    rating: 4.96,
    reviewsCount: 204,
    specialty: 'Fort Kochi Heritage, Kathakali Art & Houseboat Safaris',
    hourlyRate: 600,
    phone: '+91 94471 88990',
    verified: true,
    bio: 'Kerala Tourism accredited guide. 11 years leading cultural walks through spice markets, Jew Town, and Chinese fishing nets.'
  },
  {
    id: 'g6',
    name: 'Vikramaditya Rathore (Forts & Royal Palaces Guide)',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    location: 'Jaipur & Udaipur, Rajasthan',
    languages: ['Hindi', 'English', 'Rajasthani', 'Spanish'],
    rating: 4.94,
    reviewsCount: 180,
    specialty: 'Rajput Architecture, Amber Fort In-depth & Desert Astronomy',
    hourlyRate: 650,
    phone: '+91 98290 44556',
    verified: true,
    bio: 'Descendant of Mewar court historians. Authorized guide for Amber Palace, City Palace, and Jantar Mantar.'
  },
  {
    id: 'g7',
    name: 'Tariq Ahmed Khan (Mughal Architecture Historian)',
    photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
    location: 'Agra & Delhi, Uttar Pradesh',
    languages: ['Hindi', 'Urdu', 'English', 'Italian', 'Japanese'],
    rating: 4.98,
    reviewsCount: 310,
    specialty: 'Taj Mahal Sunrise Acoustics, Agra Fort & Fatehpur Sikri',
    hourlyRate: 700,
    phone: '+91 98370 66778',
    verified: true,
    bio: 'ASI Gold Badge certified guide with Master degree in Medieval Indian History. Explains pietra dura inlay and optical illusions of the Taj Mahal.'
  },
  {
    id: 'g8',
    name: 'Preeti Sharma (Himalayan High Altitude Guide)',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    location: 'Shimla & Kullu (Manali), Himachal Pradesh',
    languages: ['Hindi', 'English', 'Pahari'],
    rating: 4.89,
    reviewsCount: 92,
    specialty: 'Himalayan Ridge Treks, Apple Orchard Walks & Tibetan Monasteries',
    hourlyRate: 500,
    phone: '+91 98160 11223',
    verified: true,
    bio: 'Certified by Atal Bihari Vajpayee Institute of Mountaineering. Leads safe alpine nature trails and village immersion walks.'
  },
  {
    id: 'g9',
    name: 'Savio Fernandes (Portuguese Heritage & Coastal Guide)',
    photo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
    location: 'North Goa & South Goa, Goa',
    languages: ['Konkani', 'English', 'Portuguese', 'Hindi'],
    rating: 4.91,
    reviewsCount: 156,
    specialty: 'Fontainhas Latin Quarter, Old Goa Cathedrals & Spice Plantations',
    hourlyRate: 600,
    phone: '+91 98221 33445',
    verified: true,
    bio: 'Goa Heritage Action Group member. Expert in Baroque architecture, fado music history, and secret backwater kayaking.'
  }
];

export const VEHICLE_FARE_BENCHMARKS = [
  {
    vehicleType: 'Auto-Rickshaw (3-Wheeler)',
    baseFare: 35, // For first 1.5 km
    ratePerKm: 18,
    minimumFare: 35,
    nightSurchargeMultiplier: 1.5, // 11 PM to 5 AM
    description: 'Standard Govt & App-metered auto tariff in South India (TN Benchmark).'
  },
  {
    vehicleType: 'Hatchback Cab (AC Mini)',
    baseFare: 80,
    ratePerKm: 22,
    minimumFare: 100,
    nightSurchargeMultiplier: 1.25,
    description: 'City point-to-point mini cab rates (e.g. WagonR, Swift).'
  },
  {
    vehicleType: 'Sedan Cab (Comfort Prime)',
    baseFare: 110,
    ratePerKm: 26,
    minimumFare: 140,
    nightSurchargeMultiplier: 1.25,
    description: 'Spacious sedan with luggage space (e.g. Dzire, Etios).'
  },
  {
    vehicleType: 'SUV / Multi-Utility (Innova/Xylo)',
    baseFare: 180,
    ratePerKm: 34,
    minimumFare: 250,
    nightSurchargeMultiplier: 1.3,
    description: '6-7 seater outstation or hill station travel.'
  },
  {
    vehicleType: 'Bike Taxi (Fast Commute)',
    baseFare: 25,
    ratePerKm: 12,
    minimumFare: 30,
    nightSurchargeMultiplier: 1.2,
    description: 'Quick single rider commute for solo backpackers.'
  }
];

export const TICKET_BOOKING_PLATFORMS = [
  {
    name: 'IRCTC Indian Railways',
    category: 'Train',
    url: 'https://www.irctc.co.in/',
    badge: 'Official Rail Portal',
    icon: 'train'
  },
  {
    name: 'MakeMyTrip Flights & Hotels',
    category: 'Flight / Hotel',
    url: 'https://www.makemytrip.com/',
    badge: 'Flights & Stays',
    icon: 'plane'
  },
  {
    name: 'RedBus Intercity Express',
    category: 'Bus',
    url: 'https://www.redbus.in/',
    badge: 'Bus Booking',
    icon: 'bus'
  },
  {
    name: 'Skyscanner Global',
    category: 'Flights',
    url: 'https://www.skyscanner.co.in/',
    badge: 'Cheapest Flights',
    icon: 'globe'
  },
  {
    name: 'Booking.com Residencies',
    category: 'Hotel',
    url: 'https://www.booking.com/',
    badge: 'Verified Stays',
    icon: 'hotel'
  }
];
