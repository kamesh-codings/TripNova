// Hierarchical Location & Transit Hub Booking Engine Data

export interface BookingLink {
  provider: string;
  category: 'flight' | 'train' | 'bus' | 'cab' | 'pass' | 'hotel';
  url: string;
  badge: string;
  iconType: 'plane' | 'train' | 'bus' | 'car' | 'ticket' | 'globe';
  description: string;
}

export interface TransitHubInfo {
  airports: {
    name: string;
    code: string;
    distance: string;
    type: 'International' | 'Domestic' | 'Civil Enclave';
    bookingLinks: BookingLink[];
  }[];
  railways: {
    name: string;
    code: string;
    division: string;
    type: 'Junction' | 'Terminal' | 'Heritage Station' | 'Central';
    bookingLinks: BookingLink[];
  }[];
  busTerminals: {
    name: string;
    type: 'Intercity Bus Stand' | 'Mofussil Bus Terminus' | 'Private Fleet Hub';
    majorOperators: string[];
    bookingLinks: BookingLink[];
  }[];
  localTransit: {
    metroOrCabs: string;
    bookingLinks: BookingLink[];
  };
  monumentPasses?: {
    attractionName: string;
    bookingUrl: string;
    passType: 'Official E-Pass' | 'ASI Monument Pass' | 'Forest Permit' | 'State Tourism Ticket';
  }[];
}

export interface CityTownNode {
  name: string;
  pincodeOrZip?: string;
  description: string;
  popularSpots: string[];
  transit: TransitHubInfo;
}

export interface DistrictNode {
  name: string;
  headquarters: string;
  cities: CityTownNode[];
}

export interface StateNode {
  name: string;
  code: string;
  districts: DistrictNode[];
}

export interface CountryNode {
  name: string;
  code: string;
  flag: string;
  currency: string;
  states: StateNode[];
}

export const HIERARCHICAL_TRANSIT_DATA: CountryNode[] = [
  // 1. INDIA
  {
    name: 'India',
    code: 'IN',
    flag: '🇮🇳',
    currency: 'INR (₹)',
    states: [
      {
        name: 'Tamil Nadu',
        code: 'TN',
        districts: [
          {
            name: 'The Nilgiris',
            headquarters: 'Udhagamandalam (Ooty)',
            cities: [
              {
                name: 'Ooty & Nilgiri Hills',
                pincodeOrZip: '643001',
                description: 'Queen of Hill Stations, famous for tea gardens, botanical gardens, and UNESCO Mountain Railway.',
                popularSpots: ['Ooty Lake', 'Botanical Garden', 'Doddabetta Peak', 'Tea Factory & Museum', 'Pykara Waterfalls'],
                transit: {
                  airports: [
                    {
                      name: 'Coimbatore International Airport',
                      code: 'CJB',
                      distance: '88 km from Ooty (approx. 2.5 hrs drive)',
                      type: 'International',
                      bookingLinks: [
                        { provider: 'IndiGo Airlines', category: 'flight', url: 'https://www.goindigo.in/', badge: 'Direct Flights', iconType: 'plane', description: 'Daily flights from Delhi, Mumbai, Chennai, Bengaluru' },
                        { provider: 'MakeMyTrip Flights', category: 'flight', url: 'https://www.makemytrip.com/flights/', badge: 'Best Deals', iconType: 'plane', description: 'Compare all airline airfares to Coimbatore (CJB)' },
                        { provider: 'Google Flights', category: 'flight', url: 'https://www.google.com/travel/flights', badge: 'Flight Tracker', iconType: 'globe', description: 'Live schedule and lowest fare calendar' }
                      ]
                    }
                  ],
                  railways: [
                    {
                      name: 'Udhagamandalam Railway Station (Ooty)',
                      code: 'UAM',
                      division: 'Salem Railway Division / Southern Railway',
                      type: 'Heritage Station',
                      bookingLinks: [
                        { provider: 'IRCTC UNESCO Toy Train', category: 'train', url: 'https://www.irctc.co.in/nget/train-search', badge: 'UNESCO Heritage Train', iconType: 'train', description: 'Nilgiri Mountain Railway toy train booking (Mettupalayam - Ooty)' },
                        { provider: 'ConfirmTkt IRCTC Booking', category: 'train', url: 'https://www.confirmtkt.com/', badge: 'Waitlist Predictor', iconType: 'train', description: 'Instant confirmation & seat availability' }
                      ]
                    },
                    {
                      name: 'Mettupalayam Railway Junction',
                      code: 'MTP',
                      division: 'Southern Railway (Connecting broad-gauge station)',
                      type: 'Junction',
                      bookingLinks: [
                        { provider: 'IRCTC Indian Railways', category: 'train', url: 'https://www.irctc.co.in/', badge: 'Official Rail', iconType: 'train', description: 'Nilgiri Superfast Express from Chennai' }
                      ]
                    }
                  ],
                  busTerminals: [
                    {
                      name: 'Ooty Central Bus Stand',
                      type: 'Intercity Bus Stand',
                      majorOperators: ['SETC Tamil Nadu', 'TNSTC Ultra Deluxe', 'KSRTC Airavat', 'Kallada Travels', 'GreenLine'],
                      bookingLinks: [
                        { provider: 'TNSTC / SETC Official Booking', category: 'bus', url: 'https://www.tnstc.in/', badge: 'Govt Official Portal', iconType: 'bus', description: 'Direct AC Sleeper buses from Chennai, Madurai, Trichy, Coimbatore' },
                        { provider: 'RedBus Nilgiris Express', category: 'bus', url: 'https://www.redbus.in/', badge: 'Top Private Fleets', iconType: 'bus', description: 'Live bus tracking & luxury sleeper berths' },
                        { provider: 'AbhiBus Bus Tickets', category: 'bus', url: 'https://www.abhibus.com/', badge: 'Zero Booking Fee', iconType: 'bus', description: 'Instant ticket confirmation and seat selection' }
                      ]
                    }
                  ],
                  localTransit: {
                    metroOrCabs: 'Nilgiris Taxi Drivers Union, Zoomcar Self-Drive, Prepaid Sightseeing Cabs',
                    bookingLinks: [
                      { provider: 'Uber Outstation Cabs', category: 'cab', url: 'https://www.uber.com/', badge: 'Instant Cab', iconType: 'car', description: 'Coimbatore to Ooty hill climb drop & pickup' },
                      { provider: 'Ola Outstation Rentals', category: 'cab', url: 'https://www.olacabs.com/', badge: 'Outstation Sedans & SUVs', iconType: 'car', description: '24/7 hill station cab service' },
                      { provider: 'Zoomcar Self Drive', category: 'cab', url: 'https://www.zoomcar.com/', badge: 'Self-Drive Rental', iconType: 'car', description: 'Rent cars directly from Coimbatore to explore Nilgiris' }
                    ]
                  },
                  monumentPasses: [
                    { attractionName: 'Nilgiris District Tourist E-Pass (TN Govt)', bookingUrl: 'https://epass.tnega.org/', passType: 'Official E-Pass' },
                    { attractionName: 'Tamil Nadu Tourism TTDC Sightseeing', bookingUrl: 'https://www.ttdconline.com/', passType: 'State Tourism Ticket' },
                    { attractionName: 'Mudumalai Tiger Reserve Safari Permit', bookingUrl: 'https://mudumalaitigerreserve.com/', passType: 'Forest Permit' }
                  ]
                }
              },
              {
                name: 'Coonoor',
                pincodeOrZip: '643101',
                description: 'Scenic hill retreat known for Sims Park, Droog Fort, and sprawling tea estates.',
                popularSpots: ['Sim\'s Park', 'Dolphin\'s Nose', 'Lamb\'s Rock', 'Highfield Tea Factory'],
                transit: {
                  airports: [
                    {
                      name: 'Coimbatore International Airport',
                      code: 'CJB',
                      distance: '68 km from Coonoor (approx. 2 hrs drive)',
                      type: 'International',
                      bookingLinks: [
                        { provider: 'MakeMyTrip Flights', category: 'flight', url: 'https://www.makemytrip.com/flights/', badge: 'Best Airfares', iconType: 'plane', description: 'Flights to CJB Coimbatore' }
                      ]
                    }
                  ],
                  railways: [
                    {
                      name: 'Coonoor Railway Station',
                      code: 'ONR',
                      division: 'Southern Railway',
                      type: 'Heritage Station',
                      bookingLinks: [
                        { provider: 'IRCTC Toy Train Booking', category: 'train', url: 'https://www.irctc.co.in/', badge: 'Heritage Pass', iconType: 'train', description: 'Mountain rail stop connecting Mettupalayam to Ooty' }
                      ]
                    }
                  ],
                  busTerminals: [
                    {
                      name: 'Coonoor Central Bus Stand',
                      type: 'Intercity Bus Stand',
                      majorOperators: ['TNSTC', 'KSRTC'],
                      bookingLinks: [
                        { provider: 'RedBus Coonoor Express', category: 'bus', url: 'https://www.redbus.in/', badge: 'Bus Tickets', iconType: 'bus', description: 'Daily buses from Coimbatore, Mettupalayam, Ooty' }
                      ]
                    }
                  ],
                  localTransit: {
                    metroOrCabs: 'Coonoor Local Taxi Stand',
                    bookingLinks: [
                      { provider: 'Ola Cabs', category: 'cab', url: 'https://www.olacabs.com/', badge: 'Cabs', iconType: 'car', description: 'Local point-to-point drop' }
                    ]
                  }
                }
              }
            ]
          },
          {
            name: 'Chennai District',
            headquarters: 'Chennai',
            cities: [
              {
                name: 'Chennai Central & Marina',
                pincodeOrZip: '600001',
                description: 'Capital of Tamil Nadu, Gateway of South India, rich in Dravidian heritage, coastal promenades, and arts.',
                popularSpots: ['Marina Beach', 'Kapaleeshwarar Temple', 'Fort St. George', 'San Thome Basilica', 'Government Museum'],
                transit: {
                  airports: [
                    {
                      name: 'Chennai International Airport (Meenambakkam)',
                      code: 'MAA',
                      distance: '18 km from City Center',
                      type: 'International',
                      bookingLinks: [
                        { provider: 'Air India / IndiGo / Emirates', category: 'flight', url: 'https://www.makemytrip.com/flights/', badge: 'Major Hub MAA', iconType: 'plane', description: 'Domestic & Global international non-stop flights' },
                        { provider: 'Skyscanner Global Flights', category: 'flight', url: 'https://www.skyscanner.co.in/', badge: 'Lowest Fare', iconType: 'globe', description: 'Live flight comparison to Chennai (MAA)' }
                      ]
                    }
                  ],
                  railways: [
                    {
                      name: 'Puratchi Thalaivar Dr. M.G.R. Central Railway Station',
                      code: 'MAS',
                      division: 'Chennai Division / Southern Railway',
                      type: 'Central',
                      bookingLinks: [
                        { provider: 'IRCTC Indian Railways Official', category: 'train', url: 'https://www.irctc.co.in/nget/train-search', badge: 'Vande Bharat / Shatabdi', iconType: 'train', description: 'Connects all major Indian capitals & express lines' },
                        { provider: 'Trainman Rail Ticket Portal', category: 'train', url: 'https://www.trainman.in/', badge: 'PNR Status & Live Train Tracking', iconType: 'train', description: 'Live running status and confirmed ticket prediction' }
                      ]
                    },
                    {
                      name: 'Chennai Egmore Railway Station',
                      code: 'MS',
                      division: 'Southern Railway (Gateway to Southern TN)',
                      type: 'Terminal',
                      bookingLinks: [
                        { provider: 'IRCTC Express South Trains', category: 'train', url: 'https://www.irctc.co.in/', badge: 'South TN Express', iconType: 'train', description: 'Trains to Madurai, Tirunelveli, Kanyakumari, Rameswaram' }
                      ]
                    }
                  ],
                  busTerminals: [
                    {
                      name: 'Kilambakkam Kalaignar Centenary Bus Terminus (KCBT)',
                      type: 'Mofussil Bus Terminus',
                      majorOperators: ['SETC Tamil Nadu', 'TNSTC', 'KSRTC', 'APSRTC', 'Parveen Travels', 'SRS Travels'],
                      bookingLinks: [
                        { provider: 'TNSTC Official Portal', category: 'bus', url: 'https://www.tnstc.in/', badge: 'State Bus Fleet', iconType: 'bus', description: 'Official bus reservations across Tamil Nadu, Kerala, Karnataka' },
                        { provider: 'RedBus Chennai Terminal', category: 'bus', url: 'https://www.redbus.in/bus-tickets/chennai', badge: 'Private Luxury Fleet', iconType: 'bus', description: 'AC Volvo & Multi-Axle sleeper coaches' }
                      ]
                    }
                  ],
                  localTransit: {
                    metroOrCabs: 'Chennai Metro Rail (CMRL), Local Electric Suburban Trains, Uber, Ola, Rapido',
                    bookingLinks: [
                      { provider: 'Chennai Metro Rail CMRL', category: 'cab', url: 'https://chennaimetrorail.org/', badge: 'Metro Transit', iconType: 'train', description: 'Fast airport-to-city transit system' },
                      { provider: 'Uber Chennai & Auto', category: 'cab', url: 'https://www.uber.com/', badge: 'On-Demand Cabs', iconType: 'car', description: 'Sedans, Auto rickshaws, and Intercity rentals' }
                    ]
                  },
                  monumentPasses: [
                    { attractionName: 'Archaeological Survey of India (ASI) Chennai Circle Ticket', bookingUrl: 'https://asi.paygov.org.in/', passType: 'ASI Monument Pass' },
                    { attractionName: 'Tamil Nadu Tourism TTDC Coastal Tours', bookingUrl: 'https://www.ttdconline.com/', passType: 'State Tourism Ticket' }
                  ]
                }
              }
            ]
          },
          {
            name: 'Madurai District',
            headquarters: 'Madurai',
            cities: [
              {
                name: 'Madurai Heritage City',
                pincodeOrZip: '625001',
                description: 'The Cultural Capital of Tamil Nadu, celebrated for the world-renowned Meenakshi Amman Temple and 2500+ years of continuous history.',
                popularSpots: ['Meenakshi Amman Temple', 'Thirumalai Nayakkar Palace', 'Gandhi Memorial Museum', 'Vandiyur Mariamman Teppakulam'],
                transit: {
                  airports: [
                    {
                      name: 'Madurai International Airport',
                      code: 'IXM',
                      distance: '12 km from City Center',
                      type: 'International',
                      bookingLinks: [
                        { provider: 'IndiGo / Air India / SpiceJet', category: 'flight', url: 'https://www.makemytrip.com/flights/', badge: 'IXM Flights', iconType: 'plane', description: 'Flights to Chennai, Bengaluru, Mumbai, Dubai, Colombo' }
                      ]
                    }
                  ],
                  railways: [
                    {
                      name: 'Madurai Railway Junction',
                      code: 'MDU',
                      division: 'Madurai Division / Southern Railway',
                      type: 'Junction',
                      bookingLinks: [
                        { provider: 'IRCTC Vande Bharat & Tejas Express', category: 'train', url: 'https://www.irctc.co.in/', badge: 'Chennai - Madurai High Speed', iconType: 'train', description: 'Vande Bharat Express connecting Chennai in 6 hrs' }
                      ]
                    }
                  ],
                  busTerminals: [
                    {
                      name: 'Mattuthavani Integrated Bus Terminus (MIBT) & Arappalayam',
                      type: 'Intercity Bus Stand',
                      majorOperators: ['SETC', 'TNSTC', 'KSRTC', 'KPN', 'IntrCity SmartBus'],
                      bookingLinks: [
                        { provider: 'TNSTC Official Portal', category: 'bus', url: 'https://www.tnstc.in/', badge: 'State Bus Fleet', iconType: 'bus', description: 'Buses to Kanyakumari, Rameshwaram, Chennai, Bangalore' },
                        { provider: 'RedBus Madurai Hub', category: 'bus', url: 'https://www.redbus.in/', badge: 'Bus Tickets', iconType: 'bus', description: 'Luxury sleeper coaches' }
                      ]
                    }
                  ],
                  localTransit: {
                    metroOrCabs: 'Madurai Prepaid Auto Booth, Uber, Ola Cabs',
                    bookingLinks: [
                      { provider: 'Ola Cabs Madurai', category: 'cab', url: 'https://www.olacabs.com/', badge: 'Local Cabs', iconType: 'car', description: 'Temple tour & airport transfers' }
                    ]
                  },
                  monumentPasses: [
                    { attractionName: 'Thirumalai Nayakkar Palace Entry Pass', bookingUrl: 'https://www.ttdconline.com/', passType: 'State Tourism Ticket' },
                    { attractionName: 'Meenakshi Temple Special Darshan Pass', bookingUrl: 'https://maduraimeenakshi.hrce.tn.gov.in/', passType: 'Official E-Pass' }
                  ]
                }
              }
            ]
          },
          {
            name: 'Kanyakumari District',
            headquarters: 'Nagercoil',
            cities: [
              {
                name: 'Kanyakumari Lands End',
                pincodeOrZip: '629702',
                description: 'The southernmost tip of mainland India, meeting point of the Indian Ocean, Arabian Sea, and Bay of Bengal.',
                popularSpots: ['Vivekananda Rock Memorial', 'Thiruvalluvar Statue', 'Sunset & Sunrise Point', 'Gandhi Memorial Mandapam'],
                transit: {
                  airports: [
                    {
                      name: 'Trivandrum International Airport (TRV)',
                      code: 'TRV',
                      distance: '90 km from Kanyakumari (approx. 2.5 hrs)',
                      type: 'International',
                      bookingLinks: [
                        { provider: 'MakeMyTrip Flights to TRV', category: 'flight', url: 'https://www.makemytrip.com/flights/', badge: 'Nearest Airport', iconType: 'plane', description: 'Direct flights from all major domestic & international hubs' }
                      ]
                    }
                  ],
                  railways: [
                    {
                      name: 'Kanyakumari Railway Station',
                      code: 'CAPE',
                      division: 'Thiruvananthapuram Division / Southern Railway',
                      type: 'Terminal',
                      bookingLinks: [
                        { provider: 'IRCTC Vivek Express & Himsagar Express', category: 'train', url: 'https://www.irctc.co.in/', badge: 'Longest Rail Routes', iconType: 'train', description: 'Direct express trains connecting Dibrugarh, Kashmir, Delhi, Mumbai' }
                      ]
                    }
                  ],
                  busTerminals: [
                    {
                      name: 'Kanyakumari Central Bus Stand',
                      type: 'Intercity Bus Stand',
                      majorOperators: ['SETC', 'TNSTC', 'Kerala KSRTC'],
                      bookingLinks: [
                        { provider: 'TNSTC Bus Booking', category: 'bus', url: 'https://www.tnstc.in/', badge: 'Govt Bus Fleet', iconType: 'bus', description: 'Daily buses along East Coast Road and Western Ghats' }
                      ]
                    }
                  ],
                  localTransit: {
                    metroOrCabs: 'Poompuhar Shipping Ferry (Vivekananda Rock), Local Tourist Cabs',
                    bookingLinks: [
                      { provider: 'Poompuhar Ferry Tickets', category: 'pass', url: 'https://poompuhar.tn.gov.in/', badge: 'Ferry to Rock Memorial', iconType: 'ticket', description: 'Boat tickets to Vivekananda Rock & Thiruvalluvar Statue' }
                    ]
                  }
                }
              }
            ]
          }
        ]
      },
      {
        name: 'Kerala',
        code: 'KL',
        districts: [
          {
            name: 'Ernakulam District',
            headquarters: 'Kochi (Cochin)',
            cities: [
              {
                name: 'Kochi & Fort Kochi',
                pincodeOrZip: '682001',
                description: 'Queen of the Arabian Sea, famous for Chinese fishing nets, spice bazaars, Dutch palaces, and tranquil backwaters.',
                popularSpots: ['Fort Kochi Beach', 'Mattancherry Palace', 'Jewish Synagogue', 'Marine Drive Walkway'],
                transit: {
                  airports: [
                    {
                      name: 'Cochin International Airport (World 1st Solar Powered)',
                      code: 'COK',
                      distance: '28 km from City Center',
                      type: 'International',
                      bookingLinks: [
                        { provider: 'Air India Express / IndiGo / Emirates', category: 'flight', url: 'https://www.makemytrip.com/flights/', badge: 'COK Global Hub', iconType: 'plane', description: 'Flights from Gulf, Europe, SE Asia, and Indian metros' }
                      ]
                    }
                  ],
                  railways: [
                    {
                      name: 'Ernakulam Junction (South) & Ernakulam Town (North)',
                      code: 'ERS / ERN',
                      division: 'Thiruvananthapuram Division / Southern Railway',
                      type: 'Junction',
                      bookingLinks: [
                        { provider: 'IRCTC Vande Bharat & Express Trains', category: 'train', url: 'https://www.irctc.co.in/', badge: 'Kerala Rail Line', iconType: 'train', description: 'High-speed rail connecting Kasaragod to Trivandrum' }
                      ]
                    }
                  ],
                  busTerminals: [
                    {
                      name: 'KSRTC Central Bus Station, Ernakulam & Vyttila Mobility Hub',
                      type: 'Mofussil Bus Terminus',
                      majorOperators: ['Kerala RTC SWIFT', 'TNSTC', 'Kallada', 'KPN', 'Orange Travels'],
                      bookingLinks: [
                        { provider: 'Kerala RTC Online Booking', category: 'bus', url: 'https://online.keralartc.com/', badge: 'KSRTC Swift Multi-Axle', iconType: 'bus', description: 'AC Sleeper buses across Kerala, Tamil Nadu, Karnataka' },
                        { provider: 'RedBus Kochi Terminal', category: 'bus', url: 'https://www.redbus.in/', badge: 'Bus Tickets', iconType: 'bus', description: 'Interstate private luxury coaches' }
                      ]
                    }
                  ],
                  localTransit: {
                    metroOrCabs: 'Kochi Metro Rail (KMRL), Kochi Water Metro (Electric Ferries), Uber, Ola',
                    bookingLinks: [
                      { provider: 'Kochi Water Metro Official', category: 'pass', url: 'https://watermetro.co.in/', badge: 'Water Metro', iconType: 'ticket', description: 'Electric boat transit across Kochi islands' }
                    ]
                  }
                }
              }
            ]
          }
        ]
      },
      {
        name: 'Karnataka',
        code: 'KA',
        districts: [
          {
            name: 'Bengaluru Urban',
            headquarters: 'Bengaluru',
            cities: [
              {
                name: 'Bengaluru Garden City',
                pincodeOrZip: '560001',
                description: 'Silicon Valley of India, celebrated for green parks, historic palaces, vibrant craft brew culture, and tech innovation.',
                popularSpots: ['Lalbagh Botanical Garden', 'Cubbon Park', 'Bangalore Palace', 'Bannerghatta National Park', 'ISKCON Temple'],
                transit: {
                  airports: [
                    {
                      name: 'Kempegowda International Airport Bengaluru',
                      code: 'BLR',
                      distance: '35 km from City Center',
                      type: 'International',
                      bookingLinks: [
                        { provider: 'All Domestic & Global Airlines', category: 'flight', url: 'https://www.makemytrip.com/flights/', badge: 'BLR Terminal 1 & 2', iconType: 'plane', description: 'Direct flights worldwide and across India' },
                        { provider: 'Skyscanner Flight Deals', category: 'flight', url: 'https://www.skyscanner.co.in/', badge: 'Cheapest Airfares', iconType: 'globe', description: 'Real-time fare alerts to BLR' }
                      ]
                    }
                  ],
                  railways: [
                    {
                      name: 'Krantivira Sangolli Rayanna (KSR) Bengaluru City Junction',
                      code: 'SBC',
                      division: 'Bengaluru Division / South Western Railway',
                      type: 'Junction',
                      bookingLinks: [
                        { provider: 'IRCTC Vande Bharat & Shatabdi Trains', category: 'train', url: 'https://www.irctc.co.in/', badge: 'High Speed Express', iconType: 'train', description: 'Express trains to Chennai, Mysuru, Hyderabad, Mumbai, Delhi' }
                      ]
                    },
                    {
                      name: 'Sir M. Visvesvaraya Terminal (SMVB)',
                      code: 'SMVB',
                      division: 'South Western Railway (Air Conditioned Terminal)',
                      type: 'Terminal',
                      bookingLinks: [
                        { provider: 'IRCTC Long Distance Trains', category: 'train', url: 'https://www.irctc.co.in/', badge: 'AC Rail Terminal', iconType: 'train', description: 'Trains to East and North India' }
                      ]
                    }
                  ],
                  busTerminals: [
                    {
                      name: 'Kempegowda Bus Station (Majestic) & Shantinagar / Satellite',
                      type: 'Mofussil Bus Terminus',
                      majorOperators: ['KSRTC Airavat', 'BMTC', 'TNSTC', 'APSRTC', 'VRL Travels', 'SRS Travels'],
                      bookingLinks: [
                        { provider: 'KSRTC Karnataka RTC Official', category: 'bus', url: 'https://ksrtc.in/', badge: 'Airavat Club Class', iconType: 'bus', description: 'State luxury Volvo & sleeper services' },
                        { provider: 'RedBus Bengaluru Hub', category: 'bus', url: 'https://www.redbus.in/bus-tickets/bangalore', badge: 'Private Fleets', iconType: 'bus', description: 'Over 2,000 daily intercity routes' }
                      ]
                    }
                  ],
                  localTransit: {
                    metroOrCabs: 'Namma Metro (Purple & Green Lines), BMTC Vayu Vajra Airport AC Buses, Uber, Ola, Rapido',
                    bookingLinks: [
                      { provider: 'Namma Metro BMRCL', category: 'cab', url: 'https://english.bmrc.co.in/', badge: 'Metro Transit', iconType: 'train', description: 'Fast city transit across Bengaluru' },
                      { provider: 'Uber Bengaluru & Auto', category: 'cab', url: 'https://www.uber.com/', badge: 'Ride Booking', iconType: 'car', description: 'Instant city and airport rides' }
                    ]
                  }
                }
              }
            ]
          }
        ]
      }
    ]
  },

  // 2. JAPAN
  {
    name: 'Japan',
    code: 'JP',
    flag: '🇯🇵',
    currency: 'JPY (¥)',
    states: [
      {
        name: 'Kanto Region',
        code: 'KT',
        districts: [
          {
            name: 'Tokyo Metropolis',
            headquarters: 'Shinjuku',
            cities: [
              {
                name: 'Tokyo City Center (Shinjuku / Shibuya)',
                pincodeOrZip: '160-0022',
                description: 'Hyper-modern metropolis blending neon skyscrapers, historic shrines, Michelin dining, and world-class transit.',
                popularSpots: ['Shinjuku Gyoen', 'Meiji Jingu Shrine', 'Shibuya Crossing', 'Tokyo Skytree', 'Senso-ji Temple Asakusa'],
                transit: {
                  airports: [
                    {
                      name: 'Tokyo Haneda Airport (HND) & Narita International (NRT)',
                      code: 'HND / NRT',
                      distance: 'Haneda 15 km / Narita 60 km from central Tokyo',
                      type: 'International',
                      bookingLinks: [
                        { provider: 'Japan Airlines (JAL) & ANA', category: 'flight', url: 'https://www.skyscanner.com/', badge: 'Global Hub', iconType: 'plane', description: 'Direct flights from all world capitals' },
                        { provider: 'MakeMyTrip International Flights', category: 'flight', url: 'https://www.makemytrip.com/flights/', badge: 'Best Airfares', iconType: 'plane', description: 'Compare deals to Tokyo (HND/NRT)' }
                      ]
                    }
                  ],
                  railways: [
                    {
                      name: 'Tokyo Central Station & Shinjuku Station',
                      code: 'TYO / SJK',
                      division: 'JR East / Tokaido Shinkansen',
                      type: 'Central',
                      bookingLinks: [
                        { provider: 'JR Pass Official (Japan Rail Pass)', category: 'train', url: 'https://japanrailpass.net/en/', badge: 'Bullet Train Shinkansen', iconType: 'train', description: 'Unlimited bullet train travel across Japan' },
                        { provider: 'SmartEX Shinkansen Booking', category: 'train', url: 'https://smart-ex.jp/en/', badge: 'Direct Shinkansen Seat', iconType: 'train', description: 'Tokyo to Kyoto, Osaka, Hiroshima bullet trains' }
                      ]
                    }
                  ],
                  busTerminals: [
                    {
                      name: 'Busta Shinjuku Highway Bus Terminal',
                      type: 'Intercity Bus Stand',
                      majorOperators: ['Willer Express', 'JR Bus Kanto', 'Keio Highway Bus'],
                      bookingLinks: [
                        { provider: 'Willer Express Japan Bus Pass', category: 'bus', url: 'https://willerexpress.com/en/', badge: 'Night Highway Buses', iconType: 'bus', description: 'Affordable sleeper highway coaches to Mt. Fuji, Kyoto, Osaka' }
                      ]
                    }
                  ],
                  localTransit: {
                    metroOrCabs: 'Tokyo Metro & Toei Subway, Suica/Pasmo IC Cards, JapanTaxi App',
                    bookingLinks: [
                      { provider: 'Tokyo Metro 24/48/72-Hour Pass', category: 'pass', url: 'https://www.tokyometro.jp/en/', badge: 'Unlimited Subway Pass', iconType: 'ticket', description: 'Unlimited rides on all Tokyo subway lines' }
                    ]
                  },
                  monumentPasses: [
                    { attractionName: 'Shibuya Sky & Tokyo Skytree E-Tickets', bookingUrl: 'https://www.tokyo-skytree.jp/en/', passType: 'Official E-Pass' },
                    { attractionName: 'teamLab Planets Tokyo Tickets', bookingUrl: 'https://planets.teamlab.art/tokyo/', passType: 'Official E-Pass' }
                  ]
                }
              }
            ]
          }
        ]
      }
    ]
  },

  // 3. UNITED STATES
  {
    name: 'United States',
    code: 'US',
    flag: '🇺🇸',
    currency: 'USD ($)',
    states: [
      {
        name: 'New York',
        code: 'NY',
        districts: [
          {
            name: 'New York City (5 Boroughs)',
            headquarters: 'Manhattan',
            cities: [
              {
                name: 'Manhattan & NYC',
                pincodeOrZip: '10001',
                description: 'The Big Apple: home of Times Square, Central Park, Broadway theaters, world-class art museums, and iconic skyline.',
                popularSpots: ['Times Square', 'Central Park', 'Statue of Liberty', 'Empire State Building', 'Metropolitan Museum of Art'],
                transit: {
                  airports: [
                    {
                      name: 'John F. Kennedy (JFK), Newark (EWR), & LaGuardia (LGA)',
                      code: 'JFK / EWR / LGA',
                      distance: '15-25 km from Midtown Manhattan',
                      type: 'International',
                      bookingLinks: [
                        { provider: 'Google Flights NYC', category: 'flight', url: 'https://www.google.com/travel/flights', badge: 'Compare All NYC Airports', iconType: 'plane', description: 'Flights to JFK, EWR, LGA' },
                        { provider: 'Skyscanner NYC Flights', category: 'flight', url: 'https://www.skyscanner.com/', badge: 'Cheapest Airfare', iconType: 'globe', description: 'Direct routes worldwide' }
                      ]
                    }
                  ],
                  railways: [
                    {
                      name: 'Penn Station & Grand Central Terminal',
                      code: 'NYP / GCT',
                      division: 'Amtrak Northeast Corridor / MTA Metro-North',
                      type: 'Central',
                      bookingLinks: [
                        { provider: 'Amtrak Official Rail', category: 'train', url: 'https://www.amtrak.com/', badge: 'Acela High Speed', iconType: 'train', description: 'High-speed trains to Washington D.C., Boston, Philadelphia' }
                      ]
                    }
                  ],
                  busTerminals: [
                    {
                      name: 'Port Authority Bus Terminal (PABT)',
                      type: 'Mofussil Bus Terminus',
                      majorOperators: ['Greyhound', 'FlixBus USA', 'Megabus', 'Peter Pan'],
                      bookingLinks: [
                        { provider: 'FlixBus USA', category: 'bus', url: 'https://www.flixbus.com/', badge: 'Intercity Bus', iconType: 'bus', description: 'Affordable buses across the East Coast' },
                        { provider: 'Greyhound Lines', category: 'bus', url: 'https://www.greyhound.com/', badge: 'Nationwide Network', iconType: 'bus', description: 'Direct coaches across all 50 states' }
                      ]
                    }
                  ],
                  localTransit: {
                    metroOrCabs: 'MTA NYC Subway (OMNY Contactless), NYC Yellow Taxis, Uber, Lyft',
                    bookingLinks: [
                      { provider: 'Uber NYC', category: 'cab', url: 'https://www.uber.com/', badge: 'Instant Cab', iconType: 'car', description: 'Rides across all 5 boroughs' },
                      { provider: 'MTA OMNY Subway Info', category: 'pass', url: 'https://omny.info/', badge: 'Contactless Tap', iconType: 'ticket', description: 'Tap to pay with credit card on all subways & buses' }
                    ]
                  },
                  monumentPasses: [
                    { attractionName: 'Statue of Liberty & Ellis Island Ferry Pass', bookingUrl: 'https://www.cityexperiences.com/new-york/city-cruises/statue/', passType: 'Official E-Pass' },
                    { attractionName: 'New York CityPASS / Sightseeing Pass', bookingUrl: 'https://www.citypass.com/new-york', passType: 'State Tourism Ticket' }
                  ]
                }
              }
            ]
          }
        ]
      }
    ]
  },

  // 4. FRANCE
  {
    name: 'France',
    code: 'FR',
    flag: '🇫🇷',
    currency: 'EUR (€)',
    states: [
      {
        name: 'Île-de-France',
        code: 'IDF',
        districts: [
          {
            name: 'Paris Department',
            headquarters: 'Paris',
            cities: [
              {
                name: 'Paris City of Light',
                pincodeOrZip: '75001',
                description: 'The City of Light, famed for the Eiffel Tower, Louvre Museum, Notre-Dame, haute cuisine, and romantic Seine cruises.',
                popularSpots: ['Eiffel Tower', 'Louvre Museum', 'Arc de Triomphe', 'Champs-Élysées', 'Sacré-Cœur Basilica'],
                transit: {
                  airports: [
                    {
                      name: 'Paris Charles de Gaulle (CDG) & Paris Orly (ORY)',
                      code: 'CDG / ORY',
                      distance: 'CDG 25 km / Orly 14 km from central Paris',
                      type: 'International',
                      bookingLinks: [
                        { provider: 'Air France / Google Flights', category: 'flight', url: 'https://www.google.com/travel/flights', badge: 'European Hub CDG', iconType: 'plane', description: 'Direct non-stop flights worldwide' }
                      ]
                    }
                  ],
                  railways: [
                    {
                      name: 'Gare du Nord, Gare de Lyon, & Gare Montparnasse',
                      code: 'PAR',
                      division: 'SNCF / TGV InOui / Eurostar',
                      type: 'Central',
                      bookingLinks: [
                        { provider: 'SNCF Connect TGV High-Speed Rail', category: 'train', url: 'https://www.sncf-connect.com/en-en', badge: 'TGV 320 km/h', iconType: 'train', description: 'Bullet trains across France, London (Eurostar), Switzerland' },
                        { provider: 'Eurail Global Pass', category: 'train', url: 'https://www.eurail.com/', badge: 'All Europe Rail Pass', iconType: 'train', description: 'Unlimited train travel across 33 European countries' }
                      ]
                    }
                  ],
                  busTerminals: [
                    {
                      name: 'Paris Bercy Seine Bus Station',
                      type: 'Intercity Bus Stand',
                      majorOperators: ['FlixBus Europe', 'BlaBlaCar Bus'],
                      bookingLinks: [
                        { provider: 'FlixBus Europe', category: 'bus', url: 'https://www.flixbus.com/', badge: 'Europe-Wide Buses', iconType: 'bus', description: 'Buses to Brussels, Amsterdam, Berlin, Lyon, Nice' }
                      ]
                    }
                  ],
                  localTransit: {
                    metroOrCabs: 'RATP Paris Metro & RER Trains, Uber France, G7 Taxis',
                    bookingLinks: [
                      { provider: 'RATP Paris Public Transit Pass', category: 'pass', url: 'https://www.ratp.fr/en', badge: 'Metro & RER Pass', iconType: 'ticket', description: 'Metro pass for central Paris' }
                    ]
                  },
                  monumentPasses: [
                    { attractionName: 'Eiffel Tower Official Summit Ticket', bookingUrl: 'https://www.toureiffel.paris/en', passType: 'Official E-Pass' },
                    { attractionName: 'Louvre Museum Timed-Entry Ticket', bookingUrl: 'https://www.louvre.fr/en', passType: 'Official E-Pass' },
                    { attractionName: 'Palace of Versailles Passport Ticket', bookingUrl: 'https://en.chateauversailles.fr/', passType: 'State Tourism Ticket' }
                  ]
                }
              }
            ]
          }
        ]
      }
    ]
  },

  // 5. UNITED ARAB EMIRATES
  {
    name: 'United Arab Emirates',
    code: 'AE',
    flag: '🇦🇪',
    currency: 'AED (د.إ)',
    states: [
      {
        name: 'Emirate of Dubai',
        code: 'DXB',
        districts: [
          {
            name: 'Dubai Central & Marina',
            headquarters: 'Dubai City',
            cities: [
              {
                name: 'Dubai Downtown & Palm Jumeirah',
                pincodeOrZip: '00000',
                description: 'Global oasis of luxury, home to Burj Khalifa (world\'s tallest building), Dubai Mall, desert safaris, and Palm Jumeirah.',
                popularSpots: ['Burj Khalifa', 'The Dubai Mall & Fountains', 'Palm Jumeirah', 'Museum of the Future', 'Dubai Marina Walk'],
                transit: {
                  airports: [
                    {
                      name: 'Dubai International Airport (DXB) & Al Maktoum (DWC)',
                      code: 'DXB / DWC',
                      distance: 'DXB 5 km from Downtown',
                      type: 'International',
                      bookingLinks: [
                        { provider: 'Emirates Airlines Official', category: 'flight', url: 'https://www.emirates.com/', badge: 'DXB Home Hub', iconType: 'plane', description: 'Direct non-stop flights to over 150 destinations worldwide' },
                        { provider: 'MakeMyTrip Flights to Dubai', category: 'flight', url: 'https://www.makemytrip.com/flights/', badge: 'Best UAE Airfares', iconType: 'plane', description: 'IndiGo, Air India Express, Flydubai flights' }
                      ]
                    }
                  ],
                  railways: [
                    {
                      name: 'Etihad Rail Network & Dubai Metro',
                      code: 'DXB-METRO',
                      division: 'RTA Dubai',
                      type: 'Terminal',
                      bookingLinks: [
                        { provider: 'RTA Dubai Metro NOL Card', category: 'train', url: 'https://www.rta.ae/', badge: 'Driverless Metro', iconType: 'train', description: 'Red & Green line automated air-conditioned metro' }
                      ]
                    }
                  ],
                  busTerminals: [
                    {
                      name: 'Al Ghubaiba Bus Station & Union Square Hub',
                      type: 'Intercity Bus Stand',
                      majorOperators: ['RTA Intercity Bus (Dubai - Abu Dhabi E100/E101)', 'Sharjah RTA'],
                      bookingLinks: [
                        { provider: 'RTA Intercity Bus Booking', category: 'bus', url: 'https://www.rta.ae/', badge: 'Dubai to Abu Dhabi & Sharjah', iconType: 'bus', description: 'Every 15-min luxury coaches to Abu Dhabi' }
                      ]
                    }
                  ],
                  localTransit: {
                    metroOrCabs: 'Dubai Taxi Corporation (DTC), Careem, Uber UAE, Dubai Water Taxi & Abra',
                    bookingLinks: [
                      { provider: 'Careem / Uber Dubai', category: 'cab', url: 'https://www.careem.com/', badge: 'Hala Taxi & Cabs', iconType: 'car', description: 'Instant RTA taxi hailing and private sedans' }
                    ]
                  },
                  monumentPasses: [
                    { attractionName: 'Burj Khalifa \'At The Top\' Observation Deck', bookingUrl: 'https://www.burjkhalifa.ae/', passType: 'Official E-Pass' },
                    { attractionName: 'Museum of the Future Timed Ticket', bookingUrl: 'https://museumofthefuture.ae/', passType: 'Official E-Pass' }
                  ]
                }
              }
            ]
          }
        ]
      }
    ]
  }
];
