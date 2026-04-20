export interface City {
  slug: string;
  name: string;
  displayName: string;
  province: string;
  provinceCode: string;
  latitude: number;
  longitude: number;
  areaServed: string[];
}

export const CITIES_DATA: City[] = [
  {
    slug: "toronto", 
    name: "Toronto", 
    displayName: "Toronto",
    province: "Ontario", 
    provinceCode: "ON",
    latitude: 43.6532, 
    longitude: -79.3832,
    areaServed: ["Toronto", "North York", "Scarborough", "Etobicoke", "Mississauga", "Brampton", "Markham", "Richmond Hill"]
  },
  {
    slug: "calgary", 
    name: "Calgary", 
    displayName: "Calgary",
    province: "Alberta", 
    provinceCode: "AB",
    latitude: 51.0447, 
    longitude: -114.0719,
    areaServed: ["Calgary", "Airdrie", "Chestermere", "Cochrane", "Okotoks"]
  },
  {
    slug: "vancouver", 
    name: "Vancouver", 
    displayName: "Vancouver",
    province: "British Columbia", 
    provinceCode: "BC",
    latitude: 49.2827, 
    longitude: -123.1207,
    areaServed: ["Vancouver", "Burnaby", "Richmond", "Surrey", "Coquitlam", "North Vancouver"]
  },
  {
    slug: "ottawa", 
    name: "Ottawa", 
    displayName: "Ottawa",
    province: "Ontario", 
    provinceCode: "ON",
    latitude: 45.4215, 
    longitude: -75.6972,
    areaServed: ["Ottawa", "Gatineau", "Kanata", "Nepean", "Gloucester"]
  },
  {
    slug: "edmonton", 
    name: "Edmonton", 
    displayName: "Edmonton",
    province: "Alberta", 
    provinceCode: "AB",
    latitude: 53.5461, 
    longitude: -113.4938,
    areaServed: ["Edmonton", "St. Albert", "Sherwood Park", "Fort Saskatchewan"]
  },
  {
    slug: "mississauga", 
    name: "Mississauga", 
    displayName: "Mississauga",
    province: "Ontario", 
    provinceCode: "ON",
    latitude: 43.5890, 
    longitude: -79.6441,
    areaServed: ["Mississauga", "Brampton", "Oakville", "Burlington"]
  },
  {
    slug: "winnipeg", 
    name: "Winnipeg", 
    displayName: "Winnipeg",
    province: "Manitoba", 
    provinceCode: "MB",
    latitude: 49.8951, 
    longitude: -97.1384,
    areaServed: ["Winnipeg", "St. Boniface", "Transcona"]
  },
  {
    slug: "halifax", 
    name: "Halifax", 
    displayName: "Halifax",
    province: "Nova Scotia", 
    provinceCode: "NS",
    latitude: 44.6488, 
    longitude: -63.5752,
    areaServed: ["Halifax", "Dartmouth", "Bedford", "Sackville"]
  },
  {
    slug: "hamilton", 
    name: "Hamilton", 
    displayName: "Hamilton",
    province: "Ontario", 
    provinceCode: "ON",
    latitude: 43.2557, 
    longitude: -79.8711,
    areaServed: ["Hamilton", "Burlington", "Ancaster", "Dundas", "Waterdown"]
  },
  {
    slug: "kitchener", 
    name: "Kitchener", 
    displayName: "Kitchener",
    province: "Ontario", 
    provinceCode: "ON",
    latitude: 43.4516, 
    longitude: -80.4925,
    areaServed: ["Kitchener", "Waterloo", "Cambridge", "Guelph"]
  },
  {
    slug: "victoria", 
    name: "Victoria", 
    displayName: "Victoria",
    province: "British Columbia", 
    provinceCode: "BC",
    latitude: 48.4284, 
    longitude: -123.3656,
    areaServed: ["Victoria", "Saanich", "Oak Bay", "Esquimalt"]
  },
  {
    slug: "saskatoon", 
    name: "Saskatoon", 
    displayName: "Saskatoon",
    province: "Saskatchewan", 
    provinceCode: "SK",
    latitude: 52.1579, 
    longitude: -106.6702,
    areaServed: ["Saskatoon", "Martensville", "Warman"]
  },
  {
    slug: "regina", 
    name: "Regina", 
    displayName: "Regina",
    province: "Saskatchewan", 
    provinceCode: "SK",
    latitude: 50.4452, 
    longitude: -104.6189,
    areaServed: ["Regina", "White City", "Emerald Park"]
  },
  {
    slug: "surrey", 
    name: "Surrey", 
    displayName: "Surrey",
    province: "British Columbia", 
    provinceCode: "BC",
    latitude: 49.1913, 
    longitude: -122.8490,
    areaServed: ["Surrey", "White Rock", "Langley", "Delta"]
  },
  {
    slug: "burnaby", 
    name: "Burnaby", 
    displayName: "Burnaby",
    province: "British Columbia", 
    provinceCode: "BC",
    latitude: 49.2488, 
    longitude: -122.9805,
    areaServed: ["Burnaby", "New Westminster", "Coquitlam"]
  },
  {
    slug: "markham", 
    name: "Markham", 
    displayName: "Markham",
    province: "Ontario", 
    provinceCode: "ON",
    latitude: 43.8561, 
    longitude: -79.3370,
    areaServed: ["Markham", "Richmond Hill", "Vaughan", "Thornhill"]
  },
  {
    slug: "brampton", 
    name: "Brampton", 
    displayName: "Brampton",
    province: "Ontario", 
    provinceCode: "ON",
    latitude: 43.7315, 
    longitude: -79.7624,
    areaServed: ["Brampton", "Mississauga", "Caledon"]
  },
  {
    slug: "richmond-hill", 
    name: "Richmond Hill", 
    displayName: "Richmond Hill",
    province: "Ontario", 
    provinceCode: "ON",
    latitude: 43.8828, 
    longitude: -79.4403,
    areaServed: ["Richmond Hill", "Markham", "Vaughan", "Aurora"]
  },
  {
    slug: "oakville", 
    name: "Oakville", 
    displayName: "Oakville",
    province: "Ontario", 
    provinceCode: "ON",
    latitude: 43.4675, 
    longitude: -79.6877,
    areaServed: ["Oakville", "Burlington", "Milton", "Mississauga"]
  },
  {
    slug: "oshawa", 
    name: "Oshawa", 
    displayName: "Oshawa",
    province: "Ontario", 
    provinceCode: "ON",
    latitude: 43.8971, 
    longitude: -78.8658,
    areaServed: ["Oshawa", "Whitby", "Ajax", "Pickering"]
  },
  {
    slug: "windsor", 
    name: "Windsor", 
    displayName: "Windsor",
    province: "Ontario", 
    provinceCode: "ON",
    latitude: 42.3149, 
    longitude: -83.0364,
    areaServed: ["Windsor", "Tecumseh", "LaSalle", "Amherstburg"]
  },
  {
    slug: "barrie", 
    name: "Barrie", 
    displayName: "Barrie",
    province: "Ontario", 
    provinceCode: "ON",
    latitude: 44.3894, 
    longitude: -79.6903,
    areaServed: ["Barrie", "Innisfil", "Angus", "Midhurst"]
  },
  {
    slug: "charlottetown", 
    name: "Charlottetown", 
    displayName: "Charlottetown",
    province: "Prince Edward Island", 
    provinceCode: "PE",
    latitude: 46.2382, 
    longitude: -63.1311,
    areaServed: ["Charlottetown", "Stratford", "Cornwall"]
  },
  {
    slug: "abbotsford", 
    name: "Abbotsford", 
    displayName: "Abbotsford",
    province: "British Columbia", 
    provinceCode: "BC",
    latitude: 49.0504, 
    longitude: -122.3045,
    areaServed: ["Abbotsford", "Mission", "Chilliwack"]
  },
  {
    slug: "burlington", 
    name: "Burlington", 
    displayName: "Burlington",
    province: "Ontario", 
    provinceCode: "ON",
    latitude: 43.3255, 
    longitude: -79.7990,
    areaServed: ["Burlington", "Hamilton", "Oakville", "Milton"]
  },
  {
    slug: "coquitlam", 
    name: "Coquitlam", 
    displayName: "Coquitlam",
    province: "British Columbia", 
    provinceCode: "BC",
    latitude: 49.3839, 
    longitude: -122.7619,
    areaServed: ["Coquitlam", "Port Coquitlam", "Port Moody"]
  },
  {
    slug: "guelph", 
    name: "Guelph", 
    displayName: "Guelph",
    province: "Ontario", 
    provinceCode: "ON",
    latitude: 43.5448, 
    longitude: -80.2482,
    areaServed: ["Guelph", "Cambridge", "Kitchener"]
  },
  {
    slug: "kelowna", 
    name: "Kelowna", 
    displayName: "Kelowna",
    province: "British Columbia", 
    provinceCode: "BC",
    latitude: 49.8880, 
    longitude: -119.4960,
    areaServed: ["Kelowna", "West Kelowna", "Vernon", "Penticton"]
  },
  {
    slug: "kingston", 
    name: "Kingston", 
    displayName: "Kingston",
    province: "Ontario", 
    provinceCode: "ON",
    latitude: 44.2312, 
    longitude: -76.4860,
    areaServed: ["Kingston", "Napanee", "Gananoque"]
  },
  {
    slug: "london-ontario", 
    name: "London", 
    displayName: "London",
    province: "Ontario", 
    provinceCode: "ON",
    latitude: 42.9849, 
    longitude: -81.2453,
    areaServed: ["London", "St. Thomas", "Strathroy"]
  },
  {
    slug: "north-vancouver", 
    name: "North Vancouver", 
    displayName: "North Vancouver",
    province: "British Columbia", 
    provinceCode: "BC",
    latitude: 49.3163, 
    longitude: -123.0926,
    areaServed: ["North Vancouver", "West Vancouver", "Vancouver"]
  },
  {
    slug: "richmond", 
    name: "Richmond", 
    displayName: "Richmond",
    province: "British Columbia", 
    provinceCode: "BC",
    latitude: 49.1666, 
    longitude: -123.1336,
    areaServed: ["Richmond", "Vancouver", "Delta", "Surrey"]
  },
  {
    slug: "waterloo", 
    name: "Waterloo", 
    displayName: "Waterloo",
    province: "Ontario", 
    provinceCode: "ON",
    latitude: 43.4643, 
    longitude: -80.5204,
    areaServed: ["Waterloo", "Kitchener", "Cambridge", "Guelph"]
  }
];