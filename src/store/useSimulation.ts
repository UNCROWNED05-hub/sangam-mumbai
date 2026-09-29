import { useEffect, useRef } from 'react';
import { useAppStore } from './useAppStore';
import { PEOPLE, CURRENT_USER } from '../data/people';
import { CITY } from '../config/city';
import { AUTO_REPLY_POOL } from '../data/chats';

export function useSimulation(enabled = true) {
  const {
    plans,
    myHostedPlanIds,
    joinedPlanIds,
    driftLiveCounter,
    addToast,
  } = useAppStore();

  const lastNewPlanToastRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    let isDocumentVisible = !document.hidden;
    const handleVisibilityChange = () => {
      isDocumentVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 1. Live people counter drift every 3.2s
    const counterTimer = setInterval(() => {
      if (!isDocumentVisible) return;
      const delta = Math.floor(Math.random() * 7) - 2; // -2 to +4
      driftLiveCounter(delta);
    }, 3200);

    // 2. Someone joins one of your hosted plans every ~12s
    const joinSimulationTimer = setInterval(() => {
      if (!isDocumentVisible) return;
      const state = useAppStore.getState();
      const myHosted = state.myHostedPlanIds;
      if (myHosted.length === 0) return;

      const randomHostedId = myHosted[Math.floor(Math.random() * myHosted.length)];
      const targetPlan = state.plans.find((p) => p.id === randomHostedId);
      if (!targetPlan || targetPlan.goingIds.length >= targetPlan.capacity) return;

      const availablePeople = PEOPLE.filter(
        (person) => person.id !== CURRENT_USER.id && !targetPlan.goingIds.includes(person.id)
      );
      if (availablePeople.length === 0) return;

      const newJoiner = availablePeople[Math.floor(Math.random() * availablePeople.length)];
      const updatedPlans = state.plans.map((p) => {
        if (p.id === randomHostedId) {
          return { ...p, goingIds: [...p.goingIds, newJoiner.id] };
        }
        return p;
      });

      // Add a notification
      const newNotification = {
        id: `n_${Date.now()}`,
        title: `${newJoiner.name} joined your "${targetPlan.title.slice(0, 24)}..." plan`,
        time: 'Just now',
        unread: true,
        type: 'join' as const,
        targetPlanId: targetPlan.id,
      };

      useAppStore.setState({
        plans: updatedPlans,
        notifications: [newNotification, ...state.notifications],
      });
    }, 12000);

    // 3. New ambient plan drops onto map every 11s
    const dropNewPlanTimer = setInterval(() => {
      if (!isDocumentVisible) return;
      const state = useAppStore.getState();
      const anchor = CITY.anchors[Math.floor(Math.random() * CITY.anchors.length)];
      const randomPerson = PEOPLE[1 + Math.floor(Math.random() * (PEOPLE.length - 1))];

      const simulatedTitles = [
        { title: 'Evening sunset tea & seaside chat', emoji: '🍵', category: 'Food and coffee' as const },
        { title: 'Casual sprint along the promenade', emoji: '🏃', category: 'Sports' as const },
        { title: 'Acoustic guitar circle under the trees', emoji: '🎸', category: 'Music' as const },
        { title: 'Board games at outdoor pavilion', emoji: '🎲', category: 'Games' as const },
        { title: 'Gentle mobility stretches on grass', emoji: '🧘', category: 'Wellness' as const },
      ];
      const pick = simulatedTitles[Math.floor(Math.random() * simulatedTitles.length)];

      const newSimulatedPlan = {
        id: `p_sim_${Date.now()}`,
        title: pick.title,
        emoji: pick.emoji,
        category: pick.category,
        hostId: randomPerson.id,
        startsInMin: 25,
        durationMin: 75,
        place: {
          name: `Near ${anchor.name}`,
          area: anchor.name,
          lngLat: [
            anchor.lngLat[0] + (Math.random() - 0.5) * 0.003,
            anchor.lngLat[1] + (Math.random() - 0.5) * 0.003,
          ] as [number, number],
          isPublic: true as const,
        },
        capacity: 6,
        goingIds: [randomPerson.id],
        vibeTags: ['Spontaneous', 'Friendly'],
        description: 'New spontaneous plan just dropped on the map. Walk over and say hi!',
      };

      const now = Date.now();
      useAppStore.setState({ plans: [newSimulatedPlan, ...state.plans] });

      // Toast at most once per 30s
      if (now - lastNewPlanToastRef.current > 30000) {
        lastNewPlanToastRef.current = now;
        addToast(`New plan near ${anchor.name}: ${pick.title.slice(0, 24)}...`);
      }
    }, 11000);

    return () => {
      clearInterval(counterTimer);
      clearInterval(joinSimulationTimer);
      clearInterval(dropNewPlanTimer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled, driftLiveCounter, addToast]);
}
