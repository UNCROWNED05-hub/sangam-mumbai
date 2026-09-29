import React from 'react';
import { Person } from '../data/people';
import { Avatar } from './Avatar';

interface AvatarStackProps {
  people: Person[];
  limit?: number;
  totalGoing?: number;
  size?: 'sm' | 'md';
  onTap?: () => void;
}

export const AvatarStack: React.FC<AvatarStackProps> = ({
  people,
  limit = 4,
  totalGoing,
  size = 'md',
  onTap,
}) => {
  const visible = people.slice(0, limit);
  const remaining = (totalGoing ?? people.length) - visible.length;

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
            size === 'sm' ? 'w-6 h-6 text-[10px]' : 'w-8 h-8 text-xs'
          }`}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
};
