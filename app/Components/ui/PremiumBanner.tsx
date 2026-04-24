import { ReactNode } from 'react';
import { CheckCircle } from 'lucide-react';

interface PremiumBannerProps {
  icon: ReactNode;
  title: string;
  badge?: string;
  description: string;
  features?: string[];
  ctaLabel: string;
  onCtaClick?: () => void;
}

export function PremiumBanner({ icon, title, badge, description, features, ctaLabel, onCtaClick }: PremiumBannerProps) {
  return (
    <div className="bg-linear-to-r from-amber-50 to-yellow-50 rounded-lg p-6 border-2 border-amber-200">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg mb-2 flex items-center gap-2">
            {title}
            {badge && (
              <span className="px-2 py-1 bg-amber-200 text-amber-800 rounded text-xs">{badge}</span>
            )}
          </h3>
          <p className="text-sm text-gray-700 mb-4">{description}</p>
          {features && features.length > 0 && (
            <ul className="space-y-2 mb-4">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          )}
          <button
            onClick={onCtaClick}
            className="bg-linear-to-r from-amber-500 to-yellow-500 text-white px-6 py-3 rounded-lg hover:from-amber-600 hover:to-yellow-600 transition-all"
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
