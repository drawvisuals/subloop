import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';

const PROFILE_STORAGE_KEY = 'subloop_profile_data';

interface AppLayoutProps {
  children: ReactNode;
}

/**
 * Main application layout for authenticated routes
 * Matches Figma design exactly with proper spacing, typography, and colors
 */
export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState(false);

  const isSubscriptionsActive = location.pathname.startsWith('/app/subscriptions');
  const isSettingsActive = location.pathname.startsWith('/app/settings');

  // Load profile photo from localStorage
  const loadProfilePhoto = () => {
    try {
      const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.photoUrl) {
          setProfilePhoto(parsed.photoUrl);
          setPhotoError(false);
          return;
        }
      }
    } catch (error) {
      console.error('Error loading profile photo:', error);
    }
    setProfilePhoto(null);
  };

  // Load profile photo on mount
  useEffect(() => {
    loadProfilePhoto();
  }, []);

  // Listen for profile updates (custom event dispatched from Profile page)
  useEffect(() => {
    const handleProfileUpdate = () => {
      loadProfilePhoto();
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);

    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, []);

  return (
    <div className="min-h-screen bg-neutral-800">
      {/* Header */}
      <header className="pt-8 h-9 sm:h-10 sticky top-0 z-30">
        <nav className="max-w-[1360px] mx-auto px-3 sm:px-4 md:px-10 h-full flex items-center justify-between relative">
          {/* Logo - left side */}
          <Link
            to="/app/subscriptions"
            className="flex items-center h-7 sm:h-9 shrink-0"
            aria-label="Subloop Home"
          >
            <Logo className="h-7 sm:h-9 w-auto" showText={false} />
            <span className="hidden sm:inline ml-2 text-text-primary font-medium text-sm">Subloop</span>
          </Link>

          {/* Navigation Links - centered - hide on mobile */}
          <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex items-center gap-4 lg:gap-6 h-7">
            <Link
              to="/app/subscriptions"
              className={`h-7 px-3 pb-3 flex items-center font-medium text-base leading-4 text-text-primary transition-colors ${
                isSubscriptionsActive
                  ? 'border-b-2 border-text-primary'
                  : 'border-b-2 border-transparent hover:text-text-secondary'
              }`}
              aria-current={isSubscriptionsActive ? 'page' : undefined}
            >
              Subscriptions
            </Link>
            <Link
              to="/app/settings"
              className={`h-7 px-3 pb-3 flex items-center font-medium text-base leading-4 text-text-primary transition-colors ${
                isSettingsActive
                  ? 'border-b-2 border-text-primary'
                  : 'border-b-2 border-transparent hover:text-text-secondary'
              }`}
              aria-current={isSettingsActive ? 'page' : undefined}
            >
              Settings
            </Link>
          </div>

          {/* Right side: Get Pro button + Profile */}
          <div className="flex items-center gap-1.5 sm:gap-3 md:gap-4 shrink-0 ml-auto">
            {/* Get Pro Button - hide text on small mobile */}
            <Link
              to="/#pricing"
              className="relative h-7 sm:h-9 w-7 sm:w-[90px] sm:px-4 px-0 py-1 sm:py-1.5 rounded-lg flex items-center justify-center font-semibold text-xs sm:text-sm leading-4 sm:leading-5 text-text-primary overflow-hidden bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500 hover:from-brand-secondary-500 hover:to-brand-primary-500 transition-all"
              aria-label="Get Pro"
            >
              <span className="relative z-10 hidden sm:inline">Get Pro</span>
              <span className="relative z-10 sm:hidden">$</span>
              <div className="absolute inset-0 rounded-[inherit] pointer-events-none shadow-[inset_0px_1px_2px_0px_rgba(146,231,255,0.5)]" />
            </Link>

            {/* Profile Avatar - navigates to Profile page */}
            <Link
              to="/app/profile"
              className="w-7 h-7 sm:w-9 sm:h-9 rounded-full overflow-hidden relative focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:ring-offset-2 focus:ring-offset-neutral-900 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0"
              aria-label="User profile"
            >
              {profilePhoto && !photoError ? (
                <img
                  src={profilePhoto}
                  alt="User profile"
                  className="w-full h-full object-cover"
                  onError={() => setPhotoError(true)}
                />
              ) : (
                <>
                  <div className="w-full h-full bg-gradient-to-br from-brand-primary-400 to-brand-secondary-400" />
                  <div className="absolute inset-0 bg-neutral-200/30" />
                </>
              )}
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="bg-neutral-800 min-h-[calc(100vh-36px)] sm:min-h-[calc(100vh-40px)]">
        {/* Container matches Figma: 1360px width with responsive padding */}
        <div className="max-w-[1360px] mx-auto px-3 sm:px-4 md:px-6 lg:px-10">
          {children}
        </div>
      </main>
    </div>
  );
}
