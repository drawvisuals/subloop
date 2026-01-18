import { Link } from 'react-router-dom';
import { MarketingLayout } from '@/components/Layout';
import { Button } from '@/components/Auth';
import { Mail, Globe, Bell, CheckCircle2, Check } from 'lucide-react';
import { redirectToCheckout } from '@/services/stripe';

export default function Landing() {
  return (
    <MarketingLayout>
      <div className="pt-16 pb-20">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto flex flex-col gap-8 items-center text-center mb-20">
          <h1 className="font-semibold text-5xl leading-[56px] text-white tracking-tight">
            Track all your subscriptions{'\n'}with a simple list
          </h1>
          <p className="font-normal text-xl leading-7 text-neutral-700 max-w-2xl">
            Subloop helps you discover, track, and manage your subscriptions with minimal effort. No bank connections, no dashboards—just clarity.
          </p>

          {/* CTAs */}
          <div className="flex gap-4 items-center mt-4">
            <Link to="/auth/signup">
              <Button showArrow className="w-auto">
                Get started
              </Button>
            </Link>
            <Link
              to="/auth/login"
              className="px-6 py-4 text-base font-medium text-white hover:text-white/80 transition-colors"
            >
              Sign in
            </Link>
          </div>

          {/* Trust Note */}
          <div className="flex gap-6 items-center mt-8 text-sm text-neutral-700">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Read-only</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {/* Feature 1: Email scan */}
          <div className="flex flex-col gap-4 items-center text-center">
            <div className="w-16 h-16 rounded-lg bg-brand-primary-500/20 flex items-center justify-center mb-2">
              <Mail className="w-8 h-8 text-brand-primary-500" />
            </div>
            <h3 className="font-semibold text-xl leading-7 text-white">
              Email scan
            </h3>
            <p className="font-normal text-base leading-[22px] text-neutral-700">
              Connect your email inbox and we'll scan for billing and subscription emails to automatically discover your subscriptions.
            </p>
          </div>

          {/* Feature 2: Browser reading */}
          <div className="flex flex-col gap-4 items-center text-center">
            <div className="w-16 h-16 rounded-lg bg-brand-primary-500/20 flex items-center justify-center mb-2">
              <Globe className="w-8 h-8 text-brand-primary-500" />
            </div>
            <h3 className="font-semibold text-xl leading-7 text-white">
              Browser reading
            </h3>
            <p className="font-normal text-base leading-[22px] text-neutral-700">
              The Chrome extension helps you save new subscriptions when you sign up online. Nothing is saved without your confirmation.
            </p>
          </div>

          {/* Feature 3: Renewal alerts */}
          <div className="flex flex-col gap-4 items-center text-center">
            <div className="w-16 h-16 rounded-lg bg-brand-primary-500/20 flex items-center justify-center mb-2">
              <Bell className="w-8 h-8 text-brand-primary-500" />
            </div>
            <h3 className="font-semibold text-xl leading-7 text-white">
              Renewal alerts
            </h3>
            <p className="font-normal text-base leading-[22px] text-neutral-700">
              Get calm, non-intrusive reminders before your subscriptions renew. You're always in control of when and how you're notified.
            </p>
          </div>
        </div>

        {/* Value Framing Section */}
        <div className="max-w-4xl mx-auto flex flex-col gap-8 items-center text-center mb-20 pt-12 border-t border-neutral-200">
          <h2 className="font-semibold text-3xl leading-9 text-white">
            Why Subloop?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="flex flex-col gap-3">
              <h3 className="font-semibold text-xl leading-7 text-white">
                Read-only access
              </h3>
              <p className="font-normal text-base leading-[22px] text-neutral-700">
                We only scan your inbox for billing emails. We never read your personal messages, send emails on your behalf, or access your bank accounts.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="font-semibold text-xl leading-7 text-white">
                You're in control
              </h3>
              <p className="font-normal text-base leading-[22px] text-neutral-700">
                Nothing is saved without your confirmation. Every subscription is reviewed before being added to your list, giving you complete control.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="font-semibold text-xl leading-7 text-white">
                No dashboards, just clarity
              </h3>
              <p className="font-normal text-base leading-[22px] text-neutral-700">
                Simple list view showing what matters: your subscriptions, their costs, and when they renew. No complex charts or unnecessary features.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="font-semibold text-xl leading-7 text-white">
                Calm reminders
              </h3>
              <p className="font-normal text-base leading-[22px] text-neutral-700">
                Get notified before renewals without being overwhelmed. Set your preferences and manage notifications on your terms.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Preview */}
        <div className="max-w-5xl mx-auto mb-20 pt-12 border-t border-neutral-200">
          <div className="flex flex-col gap-6 items-center text-center mb-12">
            <h2 className="font-semibold text-3xl leading-9 text-white">
              Simple, transparent pricing
            </h2>
            <p className="font-normal text-xl leading-7 text-neutral-700 max-w-2xl">
              Start free and upgrade when you're ready. No hidden fees, no long-term contracts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Free Plan */}
            <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-8 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold text-2xl leading-8 text-white">
                  Free
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-4xl leading-10 text-white">
                    $0
                  </span>
                  <span className="font-normal text-base leading-6 text-neutral-700">
                    /month
                  </span>
                </div>
              </div>
              <ul className="flex flex-col gap-3 flex-1">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-success-500 shrink-0 mt-0.5" />
                  <span className="font-normal text-base leading-[22px] text-white">
                    Track unlimited subscriptions
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-success-500 shrink-0 mt-0.5" />
                  <span className="font-normal text-base leading-[22px] text-white">
                    Email scanning (1 inbox)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-success-500 shrink-0 mt-0.5" />
                  <span className="font-normal text-base leading-[22px] text-white">
                    Chrome extension
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-success-500 shrink-0 mt-0.5" />
                  <span className="font-normal text-base leading-[22px] text-white">
                    Basic renewal reminders
                  </span>
                </li>
              </ul>
              <Link to="/auth/signup">
                <Button variant="secondary" className="w-full">
                  Get started free
                </Button>
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-brand-primary-500 border-2 border-brand-primary-500 rounded-lg p-8 flex flex-col gap-6 relative">
              <div className="absolute top-4 right-4">
                <span className="bg-neutral-900 text-white text-xs font-medium px-2 py-1 rounded">
                  Popular
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold text-2xl leading-8 text-neutral-900">
                  Pro
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-4xl leading-10 text-neutral-900">
                    $9
                  </span>
                  <span className="font-normal text-base leading-6 text-neutral-900/80">
                    /month
                  </span>
                </div>
              </div>
              <ul className="flex flex-col gap-3 flex-1">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-neutral-900 shrink-0 mt-0.5" />
                  <span className="font-normal text-base leading-[22px] text-neutral-900">
                    Everything in Free
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-neutral-900 shrink-0 mt-0.5" />
                  <span className="font-normal text-base leading-[22px] text-neutral-900">
                    Unlimited email inboxes
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-neutral-900 shrink-0 mt-0.5" />
                  <span className="font-normal text-base leading-[22px] text-neutral-900">
                    Advanced renewal reminders
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-neutral-900 shrink-0 mt-0.5" />
                  <span className="font-normal text-base leading-[22px] text-neutral-900">
                    Export subscriptions (CSV)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-neutral-900 shrink-0 mt-0.5" />
                  <span className="font-normal text-base leading-[22px] text-neutral-900">
                    Priority support
                  </span>
                </li>
              </ul>
              <Button
                onClick={() => redirectToCheckout('pro-monthly')}
                className="w-full bg-neutral-900 text-white hover:bg-neutral-800"
              >
                Upgrade to Pro
              </Button>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/pricing"
              className="text-brand-primary-500 hover:text-brand-primary-400 transition-colors underline font-normal text-base leading-[22px]"
            >
              View full pricing details →
            </Link>
          </div>
        </div>

        {/* FAQ Preview */}
        <div className="max-w-3xl mx-auto mb-20 pt-12 border-t border-neutral-200">
          <div className="flex flex-col gap-6 items-center text-center mb-12">
            <h2 className="font-semibold text-3xl leading-9 text-white">
              Frequently asked questions
            </h2>
          </div>

          <div className="flex flex-col gap-4 mb-8">
            {[
              {
                question: 'How does email scanning work?',
                answer: 'We connect to your email inbox with read-only access and scan for billing and subscription emails. We only look for subscription-related emails and never read your personal messages.',
              },
              {
                question: 'Is my data secure?',
                answer: 'Yes, absolutely. We use read-only access to your email and only store subscription metadata—never your personal emails or financial information. All data is encrypted in transit and at rest.',
              },
              {
                question: 'Can I cancel my subscription anytime?',
                answer: 'Yes, you can cancel your subscription at any time from your account settings. There are no cancellation fees or long-term contracts.',
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-neutral-900 border border-neutral-700 rounded-lg overflow-hidden"
              >
                <h3 className="font-semibold text-lg leading-7 text-white px-6 py-5">
                  {faq.question}
                </h3>
                <div className="px-6 pb-5 border-t border-neutral-700">
                  <p className="font-normal text-base leading-[22px] text-neutral-700 pt-4">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/faq"
              className="text-brand-primary-500 hover:text-brand-primary-400 transition-colors underline font-normal text-base leading-[22px]"
            >
              View all FAQs →
            </Link>
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="max-w-2xl mx-auto flex flex-col gap-6 items-center text-center pt-12 border-t border-neutral-200">
          <h2 className="font-semibold text-3xl leading-9 text-white">
            Ready to get started?
          </h2>
          <p className="font-normal text-base leading-[22px] text-neutral-700">
            Start tracking your subscriptions in minutes. No credit card required.
          </p>
          <Link to="/auth/signup">
            <Button showArrow className="w-auto">
              Create your account
            </Button>
          </Link>
        </div>
      </div>
    </MarketingLayout>
  );
}
