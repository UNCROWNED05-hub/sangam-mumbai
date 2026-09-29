export interface CitySummary {
  name: string;
  state: string;
  plansCount: number;
  activeNowCount: number;
  center: [number, number];
}

export const CITIES: CitySummary[] = [
  { name: 'Mumbai', state: 'Maharashtra', plansCount: 124, activeNowCount: 38, center: [72.83, 19.059] },
  { name: 'Delhi NCR', state: 'Delhi', plansCount: 142, activeNowCount: 44, center: [77.209, 28.6139] },
  { name: 'Bengaluru', state: 'Karnataka', plansCount: 186, activeNowCount: 62, center: [77.5946, 12.9716] },
  { name: 'Pune', state: 'Maharashtra', plansCount: 78, activeNowCount: 22, center: [73.8567, 18.5204] },
  { name: 'Goa', state: 'Goa', plansCount: 64, activeNowCount: 29, center: [73.8180, 15.2993] },
  { name: 'Hyderabad', state: 'Telangana', plansCount: 92, activeNowCount: 31, center: [78.4867, 17.3850] },
  { name: 'Kolkata', state: 'West Bengal', plansCount: 58, activeNowCount: 18, center: [88.3639, 22.5726] },
  { name: 'Chennai', state: 'Tamil Nadu', plansCount: 71, activeNowCount: 24, center: [80.2707, 13.0827] },
];
