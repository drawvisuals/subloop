import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { Button } from '../Auth';

interface MarketingLayoutProps {
  children: ReactNode;
}

/**
 * Marketing site layout
 * Used for landing, pricing, and FAQ pages
 * Different navigation from app layout
 */
export function MarketingLayout({ children }: MarketingLayoutProps) {
  const location = useLocation();

  const isPricingActive = location.pathname === '/pricing';
  const isFaqActive = location.pathname === '/faq';
  const isHomeActive = location.pathname === '/';

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-neutral-100 h-9 border-b border-neutral-200 sticky top-0 z-30">
        <nav className="max-w-[1360px] mx-auto px-10 h-full flex items-center justify-between">
          {/* Logo - left side */}
          <Link
            to="/"
            className="flex items-center h-9 shrink-0"
            aria-label="Subloop Home"
          >
            <Logo className="h-9 w-auto" showText={true} />
          </Link>

          {/* Navigation Links - centered */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-6 h-7">
            <Link
              to="/"
              className={`h-7 px-3 pb-3 flex items-center font-medium text-base leading-4 text-white transition-colors ${
                isHomeActive
                  ? 'border-b-2 border-white'
                  : 'border-b-2 border-transparent hover:text-white/80'
              }`}
              aria-current={isHomeActive ? 'page' : undefined}
            >
              Home
            </Link>
            <Link
              to="/pricing"
              className={`h-7 px-3 pb-3 flex items-center font-medium text-base leading-4 text-white transition-colors ${
                isPricingActive
                  ? 'border-b-2 border-white'
                  : 'border-b-2 border-transparent hover:text-white/80'
              }`}
              aria-current={isPricingActive ? 'page' : undefined}
            >
              Pricing
            </Link>
            <Link
              to="/faq"
              className={`h-7 px-3 pb-3 flex items-center font-medium text-base leading-4 text-white transition-colors ${
                isFaqActive
                  ? 'border-b-2 border-white'
                  : 'border-b-2 border-transparent hover:text-white/80'
              }`}
              aria-current={isFaqActive ? 'page' : undefined}
            >
              FAQ
            </Link>
          </div>

          {/* Right side: CTA button */}
          <div className="flex items-center gap-4 shrink-0 ml-auto">
            <Link
              to="/auth/login"
              className="px-4 py-2 text-sm font-medium text-white hover:text-white/80 transition-colors"
            >
              Login
            </Link>
            <Link to="/auth/signup">
              <Button className="h-8 w-auto px-4 py-1.5 text-sm">
                Get started
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="bg-neutral-50 min-h-[calc(100vh-36px)]">
        <div className="max-w-[1360px] mx-auto px-10">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-neutral-100 border-t border-neutral-200">
        <div className="max-w-[1360px] mx-auto px-10 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Link
                to="/"
                className="flex items-center h-9 shrink-0"
                aria-label="Subloop Home"
              >
                <Logo className="h-9 w-auto" showText={true} />
              </Link>
              <nav className="flex gap-6 items-center">
                <Link
                  to="/"
                  className="font-normal text-base leading-[22px] text-white hover:text-white/80 transition-colors"
                >
                  Home
                </Link>
                <Link
                  to="/pricing"
                  className="font-normal text-base leading-[22px] text-white hover:text-white/80 transition-colors"
                >
                  Pricing
                </Link>
                <Link
                  to="/faq"
                  className="font-normal text-base leading-[22px] text-white hover:text-white/80 transition-colors"
                >
                  FAQ
                </Link>
              </nav>
            </div>
            <div className="flex flex-col items-center md:items-end gap-2">
              <p className="font-normal text-sm leading-5 text-neutral-700">
                © 2026 Subloop. All rights reserved.
              </p>
              <a
                href="mailto:support@usesubloop.com"
                className="font-normal text-sm leading-5 text-neutral-700 hover:text-white transition-colors"
              >
                support@usesubloop.com
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
