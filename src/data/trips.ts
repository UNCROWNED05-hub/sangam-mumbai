export interface Trip {
  id: string;
  title: string;
  destination: string;
  emoji: string;
  dates: string;
  memberIds: string[];
  coverColor: string;
  budgetPerPerson: number;
  itinerary: Array<{ day: string; activity: string; time: string }>;
  packingChecklist: Array<{ item: string; done: boolean }>;
}

export const INITIAL_TRIPS: Trip[] = [
  {
    id: 'trip_goa',
    title: 'Monsoon South Goa Workation & Surf',
    destination: 'Palolem & Agonda, Goa',
    emoji: '🌊',
    dates: 'Oct 9 - 12 (Long Weekend)',
    memberIds: ['u_aarav', 'u_riya', 'u_sam', 'u_tanvi'],
    coverColor: 'from-cyan-600 to-emerald-600',
    budgetPerPerson: 14500,
    itinerary: [
      { day: 'Day 1', time: '10:00 am', activity: 'Arrive at Madgaon, check-in to beachfront wooden cottages' },
      { day: 'Day 1', time: '04:30 pm', activity: 'Sunset kayak through backwaters of Palolem' },
      { day: 'Day 2', time: '07:00 am', activity: 'Beginner surf clinic at Agonda shore' },
      { day: 'Day 2', time: '08:00 pm', activity: 'Fresh seafood barbecue & acoustic music' },
      { day: 'Day 3', time: '11:00 am', activity: 'Scooter ride up to Cabo de Rama fort ruins' },
    ],
    packingChecklist: [
      { item: 'Dry bag for boat trips', done: true },
      { item: 'Sunscreen & aloe vera gel', done: true },
      { item: 'Surf rashguard', done: false },
      { item: 'Polarized sunglasses', done: false },
      { item: 'Power bank & spare cables', done: true },
    ],
  },
  {
    id: 'trip_lonavala',
    title: 'Lonavala Monsoon Ridge Trail & Mist Run',
    destination: 'Khandala Ghats',
    emoji: '⛰️',
    dates: 'Next Saturday (Day Trip)',
    memberIds: ['u_aarav', 'u_kabir', 'u_david'],
    coverColor: 'from-emerald-700 to-indigo-800',
    budgetPerPerson: 2200,
    itinerary: [
      { day: 'Saturday', time: '05:30 am', activity: 'Carpool departure from Chembur highway' },
      { day: 'Saturday', time: '07:30 am', activity: 'Hot poha & chai at ghat viewpoint' },
      { day: 'Saturday', time: '09:00 am', activity: 'Duke’s Nose ridge hike through waterfall streams' },
      { day: 'Saturday', time: '02:00 pm', activity: 'Traditional Dhaba lunch & chikki tasting' },
    ],
    packingChecklist: [
      { item: 'Trekking shoes with solid grip', done: true },
      { item: 'Rain poncho / lightweight windbreaker', done: true },
      { item: 'Electrolyte packets', done: false },
      { item: 'Change of clothes in ziplock', done: true },
    ],
  },
  {
    id: 'trip_kanheri',
    title: 'Ancient Kanheri Buddhist Caves Exploration',
    destination: 'Sanjay Gandhi National Park',
    emoji: '🪨',
    dates: 'Sunday, Oct 18',
    memberIds: ['u_aarav', 'u_ananya', 'u_kriti', 'u_arjun'],
    coverColor: 'from-amber-600 to-purple-800',
    budgetPerPerson: 650,
    itinerary: [
      { day: 'Sunday', time: '07:00 am', activity: 'Bicycle rental at park gate' },
      { day: 'Sunday', time: '08:15 am', activity: 'Cave 3 prayer hall acoustics & rock carvings' },
      { day: 'Sunday', time: '11:00 am', activity: 'Higher elevation stream picnic' },
    ],
    packingChecklist: [
      { item: 'Park entry ticket & ID', done: true },
      { item: 'Sketchbook and water brush', done: false },
      { item: '2 Litres water', done: true },
    ],
  }
];
