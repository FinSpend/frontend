import { DataProvider } from '@/app/lib/data-context';
import { LandingPage } from '@/app/Components/landing/LandingPage';

export default function RootPageContent() {
  return (
    <DataProvider>
      <LandingPage />
    </DataProvider>
  );
}
