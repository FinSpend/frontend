import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={`bg-white rounded-lg p-6 shadow-sm border border-gray-200${className ? ` ${className}` : ''}`}>
      {children}
    </div>
  );
}
