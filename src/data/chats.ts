export interface ChatMessage {
  id: string;
  senderId: string; // 'u_aarav' or other
  senderName: string;
  text: string;
  time: string;
  isSystem?: boolean;
  poll?: {
    question: string;
    options: Array<{ text: string; votes: number; votedByMe?: boolean }>;
  };
  reactions?: Array<{ emoji: string; count: number; byMe?: boolean }>;
}

export interface PlanChatThread {
  planId: string;
  messages: ChatMessage[];
  unreadCount: number;
}

export const INITIAL_CHATS: Record<string, ChatMessage[]> = {
  p_badminton_1: [
    { id: 'm1', senderId: 'u_rohan', senderName: 'Rohan V.', text: 'Hey everyone! I just arrived and confirmed Court 2 is ours.', time: '6:42 pm' },
    { id: 'm2', senderId: 'u_varun', senderName: 'Varun K.', text: 'Awesome, grabbing water and walking in now. Bringing 3 Mavis shuttles.', time: '6:44 pm' },
    { id: 'm3', senderId: 'system', senderName: 'System', text: 'Aarav M. joined the plan', time: '6:45 pm', isSystem: true },
    {
      id: 'm4',
      senderId: 'u_rohan',
      senderName: 'Rohan V.',
      text: 'Which game format should we kick off with?',
      time: '6:46 pm',
      poll: {
        question: 'First set format',
        options: [
          { text: 'Standard 21-point rally', votes: 3, votedByMe: true },
          { text: 'Quick 11-point warmup sets', votes: 1 },
        ],
      },
      reactions: [{ emoji: '🏸', count: 3, byMe: true }, { emoji: '🔥', count: 2 }],
    },
    { id: 'm5', senderId: 'u_varun', senderName: 'Varun K.', text: 'See you at the court! Look for the red kitbag near entrance.', time: '6:48 pm' },
  ],

  p_walk_marine: [
    { id: 'm11', senderId: 'u_riya', senderName: 'Riya K.', text: 'Morning all! The sky is turning soft pink. Meeting right beside the sea wall.', time: '6:02 am' },
    { id: 'm12', senderId: 'u_sam', senderName: 'Samir L.', text: 'Got my thermos of black coffee. Walking up from Churchgate side.', time: '6:05 am' },
    { id: 'm13', senderId: 'u_lucas', senderName: 'Lucas W.', text: 'Running 3 mins late, just crossed the junction!', time: '6:07 am' },
    { id: 'm14', senderId: 'u_riya', senderName: 'Riya K.', text: 'No rush, taking in the waves. See you here!', time: '6:08 am' },
  ],

  p_games_chai: [
    { id: 'm21', senderId: 'u_arjun', senderName: 'Arjun W.', text: 'Got our table outside! Got Catan set up with 5-6 player expansion.', time: '5:50 pm' },
    { id: 'm22', senderId: 'u_dev', senderName: 'Dev N.', text: 'Bringing ginger biscuits and two packs of Exploding Kittens.', time: '5:54 pm' },
    { id: 'm23', senderId: 'u_ananya', senderName: 'Ananya P.', text: 'Ordering cutting chai for everyone, see you in two minutes!', time: '5:58 pm' },
  ],

  p_music_jam: [
    { id: 'm31', senderId: 'u_meera', senderName: 'Meera D.', text: 'Sitting at the middle tier of amphitheatre steps. Tuned up in D standard.', time: '5:15 pm' },
    { id: 'm32', senderId: 'u_rahul', senderName: 'Rahul R.', text: 'Got the acoustic guitar and a cajon. Let us start with some Prateek Kuhad tunes.', time: '5:19 pm' },
  ],

  // City chat general room
  city_mumbai: [
    { id: 'cm1', senderId: 'u_sam', senderName: 'Samir L.', text: 'Marine Drive breeze is incredible tonight. Anyone up for late night bun maska at Marine Lines?', time: '9:12 pm' },
    { id: 'cm2', senderId: 'u_kabir', senderName: 'Kabir S.', text: 'Setting up Sunday football turf at Bandra if anyone needs a workout.', time: '9:18 pm' },
    { id: 'cm3', senderId: 'u_aisha', senderName: 'Aisha S.', text: 'Anyone going to the Kala Ghoda photowalk tomorrow morning?', time: '9:25 pm' },
  ]
};

export const AUTO_REPLY_POOL = [
  'See you there in a few minutes!',
  'Just crossed the signal, on my way!',
  'Wearing a navy jacket, wave when you spot me.',
  'Brought extra water bottles if anyone needs one.',
  'The weather is so good right now!',
  'Let us grab chai together after we wrap up.',
  'Spot confirmed, look for the tree near the steps.',
  'Awesome, looking forward to this!',
];
