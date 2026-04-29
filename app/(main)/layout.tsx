import type { ReactNode } from 'react';
import { Sidebar } from '@/app/Components/Sidebar';
import { TopBar } from '@/app/Components/TopBar';
import { ToastProvider } from '@/app/Components/ui/ToastProvider';
import { DataProvider } from '@/app/lib/data-context';
import { ErrorBoundary } from '@/app/Components/ErrorBoundary';
import { AuthGuard } from '@/app/Components/AuthGuard';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <DataProvider>
      <ToastProvider>
        <AuthGuard>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar />
            <div className="md:ml-64">
              <TopBar />
              <main className="p-4 md:p-8 pt-20 md:pt-8">
                <ErrorBoundary>
                  {children}
                </ErrorBoundary>
              </main>
            </div>
          </div>
        </AuthGuard>
      </ToastProvider>
    </DataProvider>
  );
}
