import React from 'react';
import { Person, getPerson } from '../data/people';
import { Avatar } from './Avatar';

interface AvatarStackProps {
  people?: Person[];
  userIds?: string[];
  limit?: number;
  max?: number;
  totalGoing?: number;
  size?: 'xs' | 'sm' | 'md';
  onTap?: () => void;
}

export const AvatarStack: React.FC<AvatarStackProps> = ({
  people,
  userIds,
  limit,
  max,
  totalGoing,
  size = 'md',
  onTap,
}) => {
  const resolvedPeople: Person[] =
    people ||
    (userIds ? userIds.map((id) => getPerson(id)) : []);

  const actualLimit = max ?? limit ?? 4;
  const visible = resolvedPeople.slice(0, actualLimit);
  const remaining = (totalGoing ?? resolvedPeople.length) - visible.length;

  return (
    <div
      className="flex items-center -space-x-2.5 overflow-hidden cursor-pointer group"
      onClick={onTap}
    >
      {visible.map((p) => (
        <Avatar key={p.id} person={p} size={size} showVerified={false} />
      ))}

      {remaining > 0 && (
        <div
          className={`rounded-full bg-ink/10 dark:bg-white/10 text-ink dark:text-white font-bold flex items-center justify-center ring-2 ring-white dark:ring-night select-none ${
            size === 'xs'
              ? 'w-5 h-5 text-[9px]'
              : size === 'sm'
              ? 'w-6 h-6 text-[10px]'
              : 'w-8 h-8 text-xs'
          }`}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
};
