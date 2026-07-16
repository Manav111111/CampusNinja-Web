import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, hoverable = false, className = '', ...props }) => {
  return (
    <div
      className={`surface-card rounded-2xl p-6 transition-all duration-200 ${
        hoverable ? 'hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-[0_24px_60px_-42px_rgba(15,23,42,0.6)]' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
