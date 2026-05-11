import type { ReactNode } from 'react';
import { DataProvider } from '@/app/lib/data-context';

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <DataProvider>
      <div className="min-h-screen">
        {children}
      </div>
    </DataProvider>
  );
}
