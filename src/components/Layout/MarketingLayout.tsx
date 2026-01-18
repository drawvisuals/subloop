import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { Button } from '../Auth';

interface MarketingLayoutProps {
  children: ReactNode;
}

/**
 * Marketing site layout
 * Single-page website with anchor link navigation
 */
export function MarketingLayout({ children }: MarketingLayoutProps) {
  const location = useLocation();
  const hash = location.hash;

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      // Update URL without triggering scroll
      window.history.pushState(null, '', `#${targetId}`);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-800 text-text-primary">
      {/* Header */}
      <header className="pt-8 h-16 sticky top-0 z-30">
        <nav className="max-w-[1360px] mx-auto px-4 sm:px-10 h-full flex items-center justify-between relative">
          {/* Logo - left side */}
          <Link
            to="/"
            className="flex items-center h-9 shrink-0"
            aria-label="Subloop Home"
          >
            <Logo className="h-9 w-auto" showText={true} />
          </Link>

          {/* Navigation Links - centered */}
          <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex items-center gap-6 h-7">
            <a
              href="#features"
              onClick={(e) => handleAnchorClick(e, 'features')}
              className="h-7 px-3 flex items-center font-medium text-base leading-4 text-neutral-100 hover:text-foundation-white transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              onClick={(e) => handleAnchorClick(e, 'pricing')}
              className="h-7 px-3 flex items-center font-medium text-base leading-4 text-neutral-100 hover:text-foundation-white transition-colors"
            >
              Pricing
            </a>
            <a
              href="#faq"
              onClick={(e) => handleAnchorClick(e, 'faq')}
              className="h-7 px-3 flex items-center font-medium text-base leading-4 text-neutral-100 hover:text-foundation-white transition-colors"
            >
              FAQ
            </a>
          </div>

          {/* Right side: Get Pro button */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0 ml-auto">
            <Link
              to="/auth/login"
              className="px-3 sm:px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary/80 transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/#pricing"
              className="relative h-8 w-[90px] px-4 py-1.5 rounded-lg flex items-center justify-center font-semibold text-sm leading-5 text-text-primary overflow-hidden bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500 hover:from-brand-secondary-500 hover:to-brand-primary-500 transition-all"
            >
              <span className="relative z-10">Get Pro</span>
              <div className="absolute inset-0 rounded-[inherit] pointer-events-none shadow-[inset_0px_1px_2px_0px_rgba(146,231,255,0.5)]" />
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="bg-neutral-800 min-h-[calc(100vh-64px)]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-10">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-neutral-900 border-t border-neutral-700">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-10 py-8">
          <div className="flex items-start justify-between">
            {/* Logo section */}
            <div className="flex flex-col h-[136px] items-start justify-between">
              <div className="flex flex-col gap-4 items-start justify-center max-w-[692px]">
                <Link
                  to="/"
                  className="flex items-center h-9 shrink-0"
                  aria-label="Subloop Home"
                >
                  <Logo className="h-9 w-auto" showText={true} />
                </Link>
                <p className="font-normal text-base leading-[22px] text-text-primary tracking-tight">
                  Subscriptions, finally under control.
                </p>
              </div>
              <p className="font-normal text-[13px] leading-4 text-text-secondary">
                © {new Date().getFullYear()} Subloop. All rights reserved.
              </p>
            </div>

            {/* Product Links */}
            <div className="flex-[1_0_0] flex flex-col gap-6 items-start font-normal text-base">
              <p className="leading-[22px] text-text-primary tracking-tight">Product</p>
              <a
                href="#features"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="leading-4 text-text-secondary hover:text-text-primary/80 transition-colors"
              >
                Features
              </a>
              <a
                href="#pricing"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="leading-4 text-text-secondary hover:text-text-primary/80 transition-colors"
              >
                Pricing
              </a>
              <a
                href="#faq"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="leading-4 text-text-secondary hover:text-text-primary/80 transition-colors"
              >
                FAQ
              </a>
            </div>

            {/* Legal Links */}
            <div className="flex flex-col gap-6 items-start font-normal text-base w-[322px]">
              <p className="leading-[22px] text-text-primary tracking-tight">Legal</p>
              <a
                href="#"
                className="leading-4 text-text-secondary hover:text-text-primary/80 transition-colors"
                onClick={(e) => e.preventDefault()}
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="leading-4 text-text-secondary hover:text-text-primary/80 transition-colors"
                onClick={(e) => e.preventDefault()}
              >
                Terms and Conditions
              </a>
              <a
                href="mailto:support@usesubloop.com"
                className="leading-4 text-text-secondary hover:text-text-primary/80 transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
