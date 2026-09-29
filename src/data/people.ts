export interface Person {
  id: string;
  name: string;
  avatarGradient: [string, string];
  initials: string;
  verified: boolean;
  interests: string[];
  plansHosted: number;
  area?: string;
}

export const CURRENT_USER: Person = {
  id: 'u_aarav',
  name: 'Aarav M.',
  avatarGradient: ['#FFC21A', '#FF3D7F'],
  initials: 'AM',
  verified: true,
  interests: ['Sports', 'Badminton', 'Chai', 'Outdoors'],
  plansHosted: 12,
};

export const PEOPLE: Person[] = [
  CURRENT_USER,
  { id: 'u_riya', name: 'Riya K.', avatarGradient: ['#10B5A5', '#4B3FA6'], initials: 'RK', verified: true, interests: ['Outdoors', 'Cycling', 'Coffee'], plansHosted: 8 },
  { id: 'u_kabir', name: 'Kabir S.', avatarGradient: ['#FF3D7F', '#FFC21A'], initials: 'KS', verified: true, interests: ['Sports', 'Football', 'Running'], plansHosted: 15 },
  { id: 'u_ananya', name: 'Ananya P.', avatarGradient: ['#8B5CF6', '#EC4899'], initials: 'AP', verified: true, interests: ['Creative', 'Sketching', 'Books'], plansHosted: 6 },
  { id: 'u_dev', name: 'Dev N.', avatarGradient: ['#3B82F6', '#10B5A5'], initials: 'DN', verified: false, interests: ['Games', 'Chess', 'Chai'], plansHosted: 3 },
  { id: 'u_meera', name: 'Meera D.', avatarGradient: ['#F59E0B', '#EF4444'], initials: 'MD', verified: true, interests: ['Music', 'Acoustic', 'Sunset'], plansHosted: 11 },
  { id: 'u_rohan', name: 'Rohan V.', avatarGradient: ['#10B5A5', '#3B82F6'], initials: 'RV', verified: true, interests: ['Sports', 'Badminton'], plansHosted: 9 },
  { id: 'u_zoya', name: 'Zoya H.', avatarGradient: ['#EC4899', '#8B5CF6'], initials: 'ZH', verified: true, interests: ['Food', 'Bakeries', 'Walks'], plansHosted: 7 },
  { id: 'u_aditya', name: 'Aditya T.', avatarGradient: ['#6366F1', '#14163A'], initials: 'AT', verified: false, interests: ['Outdoors', 'Hikes'], plansHosted: 4 },
  { id: 'u_tanvi', name: 'Tanvi G.', avatarGradient: ['#FFC21A', '#10B5A5'], initials: 'TG', verified: true, interests: ['Wellness', 'Yoga', 'Sunsets'], plansHosted: 14 },
  { id: 'u_sam', name: 'Samir L.', avatarGradient: ['#14163A', '#4B3FA6'], initials: 'SL', verified: true, interests: ['Startups', 'Coffee'], plansHosted: 5 },
  { id: 'u_elena', name: 'Elena R.', avatarGradient: ['#FF3D7F', '#F59E0B'], initials: 'ER', verified: true, interests: ['Creative', 'Photowalks'], plansHosted: 8 },
  { id: 'u_karan', name: 'Karan B.', avatarGradient: ['#06B6D4', '#3B82F6'], initials: 'KB', verified: false, interests: ['Sports', 'Cricket'], plansHosted: 2 },
  { id: 'u_pooja', name: 'Pooja J.', avatarGradient: ['#10B5A5', '#FFC21A'], initials: 'PJ', verified: true, interests: ['Music', 'Jamming'], plansHosted: 6 },
  { id: 'u_arjun', name: 'Arjun W.', avatarGradient: ['#8B5CF6', '#3B82F6'], initials: 'AW', verified: true, interests: ['Games', 'Catan', 'Boardgames'], plansHosted: 10 },
  { id: 'u_shreya', name: 'Shreya C.', avatarGradient: ['#EC4899', '#FF3D7F'], initials: 'SC', verified: true, interests: ['Dance', 'Salsa', 'Socials'], plansHosted: 9 },
  { id: 'u_sid', name: 'Siddharth M.', avatarGradient: ['#3B82F6', '#14163A'], initials: 'SM', verified: true, interests: ['Cycling', 'Morning Runs'], plansHosted: 13 },
  { id: 'u_neha', name: 'Neha B.', avatarGradient: ['#F59E0B', '#10B5A5'], initials: 'NB', verified: false, interests: ['Study', 'Quiet reading'], plansHosted: 1 },
  { id: 'u_marcus', name: 'Marcus D.', avatarGradient: ['#4B3FA6', '#FF3D7F'], initials: 'MD', verified: true, interests: ['Food', 'Street food', 'Walks'], plansHosted: 4 },
  { id: 'u_tara', name: 'Tara K.', avatarGradient: ['#10B5A5', '#06B6D4'], initials: 'TK', verified: true, interests: ['Wellness', 'Breathwork'], plansHosted: 8 },
  { id: 'u_vikram', name: 'Vikram A.', avatarGradient: ['#FFC21A', '#EF4444'], initials: 'VA', verified: true, interests: ['Sports', 'Table Tennis'], plansHosted: 7 },
  { id: 'u_leila', name: 'Leila C.', avatarGradient: ['#EC4899', '#14163A'], initials: 'LC', verified: true, interests: ['Creative', 'Ceramics', 'Crafts'], plansHosted: 5 },
  { id: 'u_yash', name: 'Yash G.', avatarGradient: ['#3B82F6', '#8B5CF6'], initials: 'YG', verified: false, interests: ['Games', 'Poker night'], plansHosted: 3 },
  { id: 'u_priya', name: 'Priya N.', avatarGradient: ['#10B5A5', '#FF3D7F'], initials: 'PN', verified: true, interests: ['Outdoors', 'Botanical walks'], plansHosted: 12 },
  { id: 'u_rahul', name: 'Rahul R.', avatarGradient: ['#F59E0B', '#FFC21A'], initials: 'RR', verified: true, interests: ['Music', 'Indie', 'Vinyls'], plansHosted: 6 },
  { id: 'u_aisha', name: 'Aisha S.', avatarGradient: ['#6366F1', '#EC4899'], initials: 'AS', verified: true, interests: ['Coffee', 'Chai', 'Conversations'], plansHosted: 10 },
  { id: 'u_nikhil', name: 'Nikhil P.', avatarGradient: ['#14163A', '#10B5A5'], initials: 'NP', verified: true, interests: ['Sports', 'Football turf'], plansHosted: 16 },
  { id: 'u_simran', name: 'Simran V.', avatarGradient: ['#FF3D7F', '#8B5CF6'], initials: 'SV', verified: false, interests: ['Books', 'Silent book club'], plansHosted: 4 },
  { id: 'u_david', name: 'David M.', avatarGradient: ['#3B82F6', '#10B5A5'], initials: 'DM', verified: true, interests: ['Hikes', 'Trails'], plansHosted: 7 },
  { id: 'u_isha', name: 'Isha L.', avatarGradient: ['#EC4899', '#F59E0B'], initials: 'IL', verified: true, interests: ['Dance', 'Bachata'], plansHosted: 8 },
  { id: 'u_varun', name: 'Varun K.', avatarGradient: ['#10B5A5', '#6366F1'], initials: 'VK', verified: true, interests: ['Sports', 'Badminton'], plansHosted: 11 },
  { id: 'u_kriti', name: 'Kriti J.', avatarGradient: ['#FFC21A', '#14163A'], initials: 'KJ', verified: true, interests: ['Creative', 'Art galleries'], plansHosted: 9 },
  { id: 'u_aman', name: 'Aman C.', avatarGradient: ['#4B3FA6', '#10B5A5'], initials: 'AC', verified: false, interests: ['Chai', 'Philosophy talks'], plansHosted: 2 },
  { id: 'u_maya', name: 'Maya F.', avatarGradient: ['#FF3D7F', '#EC4899'], initials: 'MF', verified: true, interests: ['Food', 'Rooftops'], plansHosted: 6 },
  { id: 'u_prateek', name: 'Prateek S.', avatarGradient: ['#06B6D4', '#14163A'], initials: 'PS', verified: true, interests: ['Tech', 'Hacks', 'Coffee'], plansHosted: 14 },
  { id: 'u_deepa', name: 'Deepa V.', avatarGradient: ['#F59E0B', '#8B5CF6'], initials: 'DV', verified: true, interests: ['Wellness', 'Morning stretches'], plansHosted: 5 },
  { id: 'u_lucas', name: 'Lucas W.', avatarGradient: ['#10B5A5', '#14163A'], initials: 'LW', verified: true, interests: ['Outdoors', 'Seafront jogs'], plansHosted: 8 },
  { id: 'u_avni', name: 'Avni D.', avatarGradient: ['#8B5CF6', '#FFC21A'], initials: 'AD', verified: true, interests: ['Music', 'Flute & tabla'], plansHosted: 4 },
  { id: 'u_neil', name: 'Neil P.', avatarGradient: ['#3B82F6', '#FF3D7F'], initials: 'NP', verified: false, interests: ['Sports', 'Basketball'], plansHosted: 3 },
  { id: 'u_tanya', name: 'Tanya R.', avatarGradient: ['#EC4899', '#10B5A5'], initials: 'TR', verified: true, interests: ['Games', 'Trivia nights'], plansHosted: 7 },
];

export function getPerson(id: string): Person {
  return PEOPLE.find((p) => p.id === id) || {
    id,
    name: 'Explorer',
    avatarGradient: ['#FFC21A', '#FF3D7F'],
    initials: 'EX',
    verified: false,
    interests: ['Plans'],
    plansHosted: 1,
  };
}
