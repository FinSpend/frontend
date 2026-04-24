import { Sidebar } from '@/app/Components/Sidebar';
import { ToastProvider } from '@/app/Components/ui/ToastProvider';
import { DataProvider } from '@/app/lib/data-context';

export default function MainLayout({ children }: LayoutProps<'/(main)'>) {
  return (
    <DataProvider>
      <ToastProvider>
        <div className="min-h-screen bg-gray-50">
          <Sidebar />
          <div className="md:ml-64 pt-16 md:pt-0">
            <main className="p-4 md:p-8">
              {children}
            </main>
          </div>
        </div>
      </ToastProvider>
    </DataProvider>
  );
}
