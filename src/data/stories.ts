export interface StoryQuote {
  id: string;
  name: string;
  city: string;
  quote: string;
  avatarGradient: [string, string];
  planEmoji: string;
}

export const STORIES: StoryQuote[] = [
  { id: 's1', name: 'Kabir S.', city: 'Mumbai', quote: 'Found my Sunday morning cycling crew in 10 minutes. No endless DMs.', avatarGradient: ['#FFC21A', '#FF3D7F'], planEmoji: '🚴' },
  { id: 's2', name: 'Ananya P.', city: 'Bengaluru', quote: 'Joined a watercolours meetup at Cubbon Park. Four strangers, now close friends.', avatarGradient: ['#10B5A5', '#4B3FA6'], planEmoji: '🎨' },
  { id: 's3', name: 'Zoya H.', city: 'Delhi', quote: 'Moved to a new city knowing nobody. Sangam made my weekends completely active.', avatarGradient: ['#EC4899', '#8B5CF6'], planEmoji: '☕' },
  { id: 's4', name: 'Rohan V.', city: 'Pune', quote: 'Needed two players for badminton doubles. Posted a bubble, court was full by 6 PM.', avatarGradient: ['#3B82F6', '#10B5A5'], planEmoji: '🏸' },
  { id: 's5', name: 'Elena R.', city: 'Goa', quote: 'Catching sunset surf sessions without coordinating 15 people in group chats.', avatarGradient: ['#F59E0B', '#EF4444'], planEmoji: '🏄‍♀️' },
  { id: 's6', name: 'Siddharth M.', city: 'Mumbai', quote: 'The zero-feed design is refreshing. You open the map, you meet up, you leave your phone.', avatarGradient: ['#6366F1', '#14163A'], planEmoji: '🏃' },
  { id: 's7', name: 'Pooja J.', city: 'Hyderabad', quote: 'Sunday acoustic jam under the banyan tree was pure magic.', avatarGradient: ['#10B5A5', '#FFC21A'], planEmoji: '🎸' },
  { id: 's8', name: 'Dev N.', city: 'Bengaluru', quote: 'Board game nights at the local cafe have become my weekly decompression ritual.', avatarGradient: ['#FF3D7F', '#F59E0B'], planEmoji: '🎲' },
  { id: 's9', name: 'Simran V.', city: 'Mumbai', quote: 'Silent Book Club is the calmest community I have ever been part of.', avatarGradient: ['#8B5CF6', '#3B82F6'], planEmoji: '📖' },
  { id: 's10', name: 'Aarav M.', city: 'Pune', quote: 'Posted a sprint on the promenade and had someone matching my pace within an hour.', avatarGradient: ['#FFC21A', '#10B5A5'], planEmoji: '⚡' },
  { id: 's11', name: 'Tanya R.', city: 'Delhi', quote: 'Real people, verified faces, zero creepy followers. Only genuine shared plans.', avatarGradient: ['#EC4899', '#10B5A5'], planEmoji: '✨' },
  { id: 's12', name: 'Lucas W.', city: 'Mumbai', quote: 'Seafront photowalk in Colaba helped me see the city with completely fresh eyes.', avatarGradient: ['#10B5A5', '#14163A'], planEmoji: '📸' },
  { id: 's13', name: 'Deepa V.', city: 'Bengaluru', quote: 'Morning terrace yoga with neighbours I had lived near for years without meeting.', avatarGradient: ['#F59E0B', '#8B5CF6'], planEmoji: '🧘' },
  { id: 's14', name: 'Marcus D.', city: 'Kolkata', quote: 'Street food crawl with four enthusiastic foodies. 10/10 evening.', avatarGradient: ['#4B3FA6', '#FF3D7F'], planEmoji: '🥟' },
];
