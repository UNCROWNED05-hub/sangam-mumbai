export type PlanCategory =
  | 'Sports'
  | 'Food and coffee'
  | 'Outdoors'
  | 'Creative'
  | 'Games'
  | 'Music'
  | 'Study'
  | 'Wellness'
  | 'Trips';

export const PLAN_CATEGORIES: PlanCategory[] = [
  'Sports',
  'Food and coffee',
  'Outdoors',
  'Creative',
  'Games',
  'Music',
  'Study',
  'Wellness',
  'Trips',
];

export interface Plan {
  id: string;
  title: string;
  emoji: string;
  category: PlanCategory;
  hostId: string;
  startsInMin: number; // minutes from now (-40 to 2100)
  durationMin: number;
  place: {
    name: string;
    area: string;
    lngLat: [number, number]; // [lng, lat]
    isPublic: true;
  };
  capacity: number;
  goingIds: string[];
  vibeTags: string[];
  description: string;
  sponsored?: boolean;
  sponsorName?: string;
}

export const INITIAL_PLANS: Plan[] = [
  // 1. Badminton Doubles (Live Now)
  {
    id: 'p_badminton_1',
    title: 'Badminton doubles, need two more',
    emoji: '🏸',
    category: 'Sports',
    hostId: 'u_rohan',
    startsInMin: -10,
    durationMin: 90,
    place: {
      name: 'Bandra YMCA Indoor Courts',
      area: 'Bandra West',
      lngLat: [72.8310, 19.0555],
      isPublic: true,
    },
    capacity: 4,
    goingIds: ['u_rohan', 'u_varun'],
    vibeTags: ['Friendly match', 'Intermediate', 'Chai after'],
    description: 'Booked Court 2 for an hour and a half. Bringing spare Yonex rackets. Let us smash some shuttles!',
  },

  // 2. Sunrise Seafront Walk (Live Now)
  {
    id: 'p_walk_marine',
    title: 'Sunrise stroll on Marine Drive',
    emoji: '🌅',
    category: 'Outdoors',
    hostId: 'u_riya',
    startsInMin: 5,
    durationMin: 75,
    place: {
      name: 'Promenade near Pizza By The Bay',
      area: 'Marine Drive',
      lngLat: [72.8242, 18.9385],
      isPublic: true,
    },
    capacity: 8,
    goingIds: ['u_riya', 'u_sam', 'u_priya', 'u_lucas'],
    vibeTags: ['Breezy', 'Slow pace', 'Morning coffee'],
    description: 'Catching the crisp morning sea breeze before the sun gets too bright. Slow walk down to Nariman Point.',
  },

  // 3. Board Games and Chai (Live Now)
  {
    id: 'p_games_chai',
    title: 'Board games and hot cutting chai',
    emoji: '🎲',
    category: 'Games',
    hostId: 'u_arjun',
    startsInMin: 12,
    durationMin: 120,
    place: {
      name: 'Steps outside Subko Coffee',
      area: 'Bandra West',
      lngLat: [72.8275, 19.0528],
      isPublic: true,
    },
    capacity: 6,
    goingIds: ['u_arjun', 'u_dev', 'u_ananya'],
    vibeTags: ['Catan', 'Casual', 'Snacks'],
    description: 'Brought Catan and Exploding Kittens. Open for anyone curious or seasoned. Good conversations guaranteed.',
  },

  // 4. Acoustic Jam (Live Now)
  {
    id: 'p_music_jam',
    title: 'Bandstand sunset acoustic jam, bring anything',
    emoji: '🎸',
    category: 'Music',
    hostId: 'u_meera',
    startsInMin: 20,
    durationMin: 100,
    place: {
      name: 'Bandstand Amphitheatre Steps',
      area: 'Bandra Bandstand',
      lngLat: [72.8198, 19.0435],
      isPublic: true,
    },
    capacity: 10,
    goingIds: ['u_meera', 'u_rahul', 'u_pooja', 'u_avni'],
    vibeTags: ['Unplugged', 'Beginner friendly', 'Acoustic'],
    description: 'Two guitars and a cajon already here. Bring a uke, shaker, or just your voice. Zero pressure.',
  },

  // 5. Five-a-side Football (Live Now)
  {
    id: 'p_turf_football',
    title: 'Five-a-side football turf match',
    emoji: '⚽',
    category: 'Sports',
    hostId: 'u_nikhil',
    startsInMin: 8,
    durationMin: 60,
    place: {
      name: 'Astro Turf Shivaji Park',
      area: 'Dadar West',
      lngLat: [72.8390, 19.0285],
      isPublic: true,
    },
    capacity: 10,
    goingIds: ['u_nikhil', 'u_kabir', 'u_karan', 'u_neil', 'u_sid', 'u_vikram'],
    vibeTags: ['Good cardio', 'Casual boots', 'Water coolers'],
    description: 'Casual friendly 5v5 game. Need two more to balance the squads. Bibs provided!',
  },

  // 6. Sponsored Cafe Plan (Sponsored)
  {
    id: 'p_cafe_sponsor',
    title: 'Pour-over tasting & cold brew flight',
    emoji: '☕',
    category: 'Food and coffee',
    hostId: 'u_sam',
    startsInMin: 35,
    durationMin: 80,
    place: {
      name: 'Kala Ghoda Artisanal Roastery',
      area: 'Kala Ghoda',
      lngLat: [72.8325, 18.9295],
      isPublic: true,
    },
    capacity: 12,
    goingIds: ['u_sam', 'u_aisha', 'u_elena', 'u_tanvi'],
    vibeTags: ['Single origin', 'Tasting notes', 'Complimentary biscuit'],
    description: 'Comparing light roast Ethiopian vs Chikmagalur estate beans with head roaster notes.',
    sponsored: true,
    sponsorName: 'Kala Ghoda Roasters',
  },

  // 7. Silent Book Club (Tonight)
  {
    id: 'p_silent_books',
    title: 'Silent book club at seaside steps',
    emoji: '📖',
    category: 'Study',
    hostId: 'u_simran',
    startsInMin: 70,
    durationMin: 90,
    place: {
      name: 'Carter Road Seafront Benches',
      area: 'Carter Road',
      lngLat: [72.8240, 19.0685],
      isPublic: true,
    },
    capacity: 8,
    goingIds: ['u_simran', 'u_neha', 'u_ananya'],
    vibeTags: ['Silent reading', '30 min discussion', 'Tea'],
    description: 'Bring whatever book you are currently immersed in. 1 hour of quiet collective reading, 30 min chat.',
  },

  // 8. Sunset Yoga on the Sand (Tonight)
  {
    id: 'p_sunset_yoga',
    title: 'Sunset mobility flow and breathwork',
    emoji: '🧘‍♀️',
    category: 'Wellness',
    hostId: 'u_tanvi',
    startsInMin: 95,
    durationMin: 60,
    place: {
      name: 'Juhu Beach (near Shivaji Statue)',
      area: 'Juhu Beach',
      lngLat: [72.8295, 19.0990],
      isPublic: true,
    },
    capacity: 12,
    goingIds: ['u_tanvi', 'u_tara', 'u_deepa', 'u_riya'],
    vibeTags: ['All levels', 'Sand grounding', 'Sunset'],
    description: 'Gentle spinal stretches and 10 minutes of box breathing as the sun dips into the sea.',
  },

  // 9. Sketching the Seafront (Tonight)
  {
    id: 'p_sketching',
    title: 'Sketching old art deco architecture',
    emoji: '🎨',
    category: 'Creative',
    hostId: 'u_ananya',
    startsInMin: 110,
    durationMin: 90,
    place: {
      name: 'Oval Maidan Tree Shaded Benches',
      area: 'Churchgate',
      lngLat: [72.8275, 18.9330],
      isPublic: true,
    },
    capacity: 6,
    goingIds: ['u_ananya', 'u_kriti', 'u_elena'],
    vibeTags: ['Watercolours', 'Graphite', 'Architecture'],
    description: 'Sketching the clock tower and Victorian facades across the lawn. Beginners warmly welcome.',
  },

  // 10. Sunday Cycle to Aarey (Tomorrow)
  {
    id: 'p_cycle_aarey',
    title: 'Sunday morning cycle into Aarey greens',
    emoji: '🚴',
    category: 'Outdoors',
    hostId: 'u_sid',
    startsInMin: 720,
    durationMin: 150,
    place: {
      name: 'Aarey Forest Entry Gate (Goregaon side)',
      area: 'Aarey Forest',
      lngLat: [72.8830, 19.1530],
      isPublic: true,
    },
    capacity: 14,
    goingIds: ['u_sid', 'u_david', 'u_kabir', 'u_lucas', 'u_nikhil'],
    vibeTags: ['22 km', 'Rolling hills', 'Breakfast at village'],
    description: 'Fresh clean air and quiet green canopy. Cruising at an easy 18-20 km/h pace. Helmets mandatory.',
  },

  // 11. Photowalk in Kala Ghoda (Tomorrow)
  {
    id: 'p_photowalk',
    title: 'Street photowalk through heritage lanes',
    emoji: '📸',
    category: 'Creative',
    hostId: 'u_elena',
    startsInMin: 780,
    durationMin: 120,
    place: {
      name: 'David Sassoon Library Garden',
      area: 'Kala Ghoda',
      lngLat: [72.8315, 18.9280],
      isPublic: true,
    },
    capacity: 8,
    goingIds: ['u_elena', 'u_kriti', 'u_marcus', 'u_ananya'],
    vibeTags: ['35mm film', 'Digital', 'Shadow play'],
    description: 'Capturing colonial doorways, vintage signboards, and morning chai vendors. Camera or phone!',
  },

  // 12. Kanheri Caves Trail (Tomorrow)
  {
    id: 'p_kanheri_trek',
    title: 'Kanheri Caves gentle forest hike',
    emoji: '🥾',
    category: 'Trips',
    hostId: 'u_david',
    startsInMin: 840,
    durationMin: 240,
    place: {
      name: 'Sanjay Gandhi National Park Gate',
      area: 'Borivali / Kanheri',
      lngLat: [72.9060, 19.2060],
      isPublic: true,
    },
    capacity: 10,
    goingIds: ['u_david', 'u_aditya', 'u_priya', 'u_tara'],
    vibeTags: ['Ancient caves', 'Moderate trail', 'Pack lunch'],
    description: 'Heading up to Cave 3 and the upper viewpoints. Shaded trails, birdwatching, and 2,000-year history.',
  },

  // 13. Salsa Beginners' Social (Sponsored)
  {
    id: 'p_salsa_social',
    title: 'Beginners salsa & bachata rooftop social',
    emoji: '💃',
    category: 'Music',
    hostId: 'u_shreya',
    startsInMin: 180,
    durationMin: 120,
    place: {
      name: 'Skyline Terrace Studio',
      area: 'Lower Parel',
      lngLat: [72.8270, 18.9955],
      isPublic: true,
    },
    capacity: 20,
    goingIds: ['u_shreya', 'u_isha', 'u_marcus', 'u_maya'],
    vibeTags: ['Partner not required', '30 min basics class', 'Latin music'],
    description: 'First 30 minutes is a foundational rhythm workshop, followed by open social dancing under the city lights.',
    sponsored: true,
    sponsorName: 'Latin Movement Studio',
  },

  // 14. Founders Coffee (Tomorrow)
  {
    id: 'p_founders_coffee',
    title: 'Founders & creators morning coffee (no pitching)',
    emoji: '☕',
    category: 'Food and coffee',
    hostId: 'u_prateek',
    startsInMin: 900,
    durationMin: 90,
    place: {
      name: 'Third Wave Coffee Roasters (BKC)',
      area: 'BKC',
      lngLat: [72.8685, 19.0665],
      isPublic: true,
    },
    capacity: 8,
    goingIds: ['u_prateek', 'u_sam', 'u_neil'],
    vibeTags: ['Product design', 'Bootstrapping', 'Zero slides'],
    description: 'Honest conversations on finding PMF, design systems, and scaling without burnout. Just good coffee.',
  },

  // 15. Your Plan (Hosted by Aarav M.)
  {
    id: 'p_my_plan',
    title: 'Saturday seafront sprint & iced Americano',
    emoji: '🏃‍♂️',
    category: 'Sports',
    hostId: 'u_aarav',
    startsInMin: 150,
    durationMin: 60,
    place: {
      name: 'Worli Sea Face Promenade Gazebo',
      area: 'Worli Sea Face',
      lngLat: [72.8175, 19.0115],
      isPublic: true,
    },
    capacity: 6,
    goingIds: ['u_aarav', 'u_kabir'],
    vibeTags: ['5k jog', 'Sea breeze', 'Iced coffee'],
    description: 'Starting with a dynamic 5 km jog along the sea wall, followed by iced brews at the corner cafe.',
  }
];
