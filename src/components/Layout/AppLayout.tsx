import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';

interface AppLayoutProps {
  children: ReactNode;
}

/**
 * Main application layout for authenticated routes
 * Matches Figma design exactly with proper spacing, typography, and colors
 */
export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const isSubscriptionsActive = location.pathname.startsWith('/app/subscriptions');
  const isSettingsActive = location.pathname.startsWith('/app/settings');

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-neutral-100 h-9 border-b border-neutral-200 sticky top-0 z-30">
        <nav className="max-w-[1360px] mx-auto px-10 h-full flex items-center justify-between relative">
          {/* Logo - left side */}
          <Link
            to="/app/subscriptions"
            className="flex items-center h-9 shrink-0"
            aria-label="Subloop Home"
          >
            <Logo className="h-9 w-auto" showText={true} />
          </Link>

          {/* Navigation Links - centered */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-6 h-7">
            <Link
              to="/app/subscriptions"
              className={`h-7 px-3 pb-3 flex items-center font-medium text-base leading-4 text-white transition-colors ${
                isSubscriptionsActive
                  ? 'border-b-2 border-white'
                  : 'border-b-2 border-transparent hover:text-white/80'
              }`}
              aria-current={isSubscriptionsActive ? 'page' : undefined}
            >
              Subscriptions
            </Link>
            <Link
              to="/app/settings"
              className={`h-7 px-3 pb-3 flex items-center font-medium text-base leading-4 text-white transition-colors ${
                isSettingsActive
                  ? 'border-b-2 border-white'
                  : 'border-b-2 border-transparent hover:text-white/80'
              }`}
              aria-current={isSettingsActive ? 'page' : undefined}
            >
              Settings
            </Link>
          </div>

          {/* Right side: Get Pro button + Profile */}
          <div className="flex items-center gap-4 shrink-0 ml-auto">
            {/* Get Pro Button */}
            <Link
              to="/pricing"
              className="relative h-8 w-[90px] px-4 py-1.5 rounded-lg flex items-center justify-center font-semibold text-sm leading-5 text-white overflow-hidden"
              style={{
                backgroundImage: 'linear-gradient(250.87deg, #1EBBE6 9.18%, #1F36E6 87.99%)',
              }}
            >
              <span className="relative z-10">Get Pro</span>
              <div className="absolute inset-0 rounded-[inherit] pointer-events-none shadow-[inset_0px_1px_2px_0px_rgba(146,231,255,0.5)]" />
            </Link>

            {/* Profile Avatar with Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="w-9 h-9 rounded-full overflow-hidden relative focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:ring-offset-2 focus:ring-offset-neutral-100"
                aria-label="User profile menu"
                aria-expanded={isProfileDropdownOpen}
              >
                {/* Avatar placeholder - will be replaced with actual avatar */}
                <div className="w-full h-full bg-gradient-to-br from-brand-primary-400 to-brand-secondary-400" />
                <div className="absolute inset-0 bg-neutral-200/30" />
              </button>

              {/* Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-neutral-200 border border-neutral-300 rounded-lg shadow-lg py-1 z-50">
                  <Link
                    to="/app/profile"
                    className="block px-4 py-2 text-sm text-white hover:bg-neutral-300 transition-colors"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    type="button"
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-neutral-300 transition-colors"
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      // Logout logic will be added later
                    }}
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="bg-neutral-50 min-h-[calc(100vh-36px)]">
        {/* Container matches Figma: 1360px width with 40px padding */}
        <div className="max-w-[1360px] mx-auto px-10">
          {children}
        </div>
      </main>

      {/* Click outside to close dropdown */}
      {isProfileDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileDropdownOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
