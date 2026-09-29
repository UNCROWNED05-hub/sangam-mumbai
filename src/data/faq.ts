export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq_1',
    question: "I don't know anyone, is that okay?",
    answer: "Most plans on Sangam are started or joined by people going solo. Because you see who is already in the group before you join and can say hi in the live group chat, showing up feels like meeting friendly acquaintances rather than stepping into an awkward crowd.",
  },
  {
    id: 'faq_2',
    question: 'Is it safe to meet strangers?',
    answer: "Safety is our core architecture: all plans must take place in public, well-lit spaces like parks, verified cafes, sports turfs, and seaside promenades. Member profiles require real names and verification, and you can report or block any plan instantly with one tap.",
  },
  {
    id: 'faq_3',
    question: 'Can I bring a friend?',
    answer: "Yes! When you tap 'Join' on any plan, you can easily select '+1 friend' so the host and group know to reserve an extra spot on the court, table, or trail.",
  },
  {
    id: 'faq_4',
    question: 'What if nobody shows up?',
    answer: "Plans have capacity indicators, verified member stacks, and active pre-event group chats where everyone confirms attendance 30 minutes before meeting. If someone is delayed, they message the group in real time.",
  },
  {
    id: 'faq_5',
    question: 'What does it cost, and what does "sponsored" mean?',
    answer: "Sangam is 100% free to explore, join, and post public plans. Sponsored bubbles are hosted by curated local businesses (like an artisanal coffee roaster or a dance studio) who pay to showcase community activities. They are always clearly labelled with a distinct outline.",
  },
];
