
import React from 'react';
import { Icon } from './Icon';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', label }) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };
  return (
    <div className="flex flex-col items-center justify-center gap-2 text-content/70">
      <Icon icon="loading" className={`animate-spin ${sizeClasses[size]}`} />
      {label && <p className="text-sm">{label}</p>}
    </div>
  );
};
