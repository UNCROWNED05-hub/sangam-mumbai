import React from 'react';
import { Person } from '../data/people';
import { Check } from 'lucide-react';

interface AvatarProps {
  person: Person;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showVerified?: boolean;
  showVerifiedRing?: boolean;
  showOnlineBadge?: boolean;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  person,
  size = 'md',
  showVerified = true,
  showVerifiedRing = false,
  showOnlineBadge = false,
  className = '',
}) => {
  const sizeClasses = {
    xs: 'w-5 h-5 text-[9px]',
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-8 h-8 text-xs',
    lg: 'w-11 h-11 text-sm',
    xl: 'w-16 h-16 text-xl font-bold',
  }[size];

  return (
    <div className={`relative inline-block select-none ${className}`}>
      <div
        className={`${sizeClasses} rounded-full flex items-center justify-center font-bold text-white shadow-sm ring-2 ${
          showVerifiedRing && person.verified
            ? 'ring-lagoon'
            : 'ring-white dark:ring-night'
        }`}
        style={{
          background: `linear-gradient(135deg, ${person.avatarGradient[0]}, ${person.avatarGradient[1]})`,
        }}
      >
        {person.initials}
      </div>

      {showVerified && person.verified && (
        <span
          className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-lagoon text-white flex items-center justify-center shadow-xs"
          title="Verified Profile"
        >
          <Check className="w-2.5 h-2.5 stroke-[3]" />
        </span>
      )}

      {showOnlineBadge && (
        <span
          className="absolute top-0 right-0 w-2 h-2 rounded-full bg-lagoon ring-1 ring-white dark:ring-night"
          title="Online"
        />
      )}
    </div>
  );
};
