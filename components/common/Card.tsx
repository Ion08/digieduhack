import React from 'react';

// FIX: Extend CardProps with React.HTMLAttributes<HTMLDivElement> to allow passing DOM attributes like onClick, fixing the type error in BookingModal.tsx.
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div className={`bg-base-100 rounded-lg shadow-md p-6 ${className}`} {...props}>
      {children}
    </div>
  );
};
