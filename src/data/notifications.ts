export interface NotificationItem {
  id: string;
  title: string;
  time: string;
  unread: boolean;
  type: 'join' | 'message' | 'reminder' | 'system';
  targetPlanId?: string;
}

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  { id: 'n1', title: 'Kabir S. joined your Worli Seafront Sprint plan', time: '12m ago', unread: true, type: 'join', targetPlanId: 'p_my_plan' },
  { id: 'n2', title: 'Badminton doubles starts in 30 minutes at Bandra YMCA', time: '25m ago', unread: true, type: 'reminder', targetPlanId: 'p_badminton_1' },
  { id: 'n3', title: 'Rohan V. in Badminton chat: "Court 2 is ours"', time: '1h ago', unread: false, type: 'message', targetPlanId: 'p_badminton_1' },
  { id: 'n4', title: 'Riya K. confirmed attendance for Marine Drive walk', time: '2h ago', unread: false, type: 'join', targetPlanId: 'p_walk_marine' },
  { id: 'n5', title: 'Your plan reached 3 nearby explorers in Bandra', time: '3h ago', unread: false, type: 'system', targetPlanId: 'p_my_plan' },
  { id: 'n6', title: 'New plan near you: Silent Book Club at Carter Road', time: '4h ago', unread: false, type: 'system', targetPlanId: 'p_silent_books' },
  { id: 'n7', title: 'Monsoon Goa trip chat has 8 new messages', time: '1d ago', unread: false, type: 'message' },
  { id: 'n8', title: 'Welcome to Sangam! Your local map is live.', time: '2d ago', unread: false, type: 'system' },
];
