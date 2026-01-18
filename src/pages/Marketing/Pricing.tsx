import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MarketingLayout } from '@/components/Layout';
import { Button } from '@/components/Auth';
import { Check, X } from 'lucide-react';
import { redirectToCheckout, PlanType } from '@/services/stripe';

type BillingCycle = 'monthly' | 'yearly';

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');

  const proPrice = billingCycle === 'monthly' ? 9 : 90; // $9/month or $90/year (2 months free)
  const proPricePerMonth = billingCycle === 'monthly' ? 9 : 7.5; // Show effective monthly price for yearly

  const features = [
    {
      name: 'Track subscriptions',
      free: 'Unlimited',
      pro: 'Unlimited',
      lifetime: 'Unlimited',
    },
    {
      name: 'Email scanning',
      free: '1 inbox',
      pro: 'Unlimited inboxes',
      lifetime: 'Unlimited inboxes',
    },
    {
      name: 'Browser extension',
      free: true,
      pro: true,
      lifetime: true,
    },
    {
      name: 'Renewal reminders',
      free: 'Basic',
      pro: 'Smart alerts',
      lifetime: 'Smart alerts',
    },
    {
      name: 'Export subscriptions',
      free: false,
      pro: 'CSV / XLS / PDF',
      lifetime: 'CSV / XLS / PDF',
    },
    {
      name: 'Priority support',
      free: false,
      pro: true,
      lifetime: true,
    },
  ];

  const renderFeatureValue = (value: string | boolean) => {
    if (value === true) {
      return <Check className="w-5 h-5 text-success-500 shrink-0" />;
    }
    if (value === false) {
      return <X className="w-5 h-5 text-text-secondary shrink-0" />;
    }
    return <span className="font-normal text-base leading-[22px]">{value}</span>;
  };

  return (
    <MarketingLayout>
      <div className="pt-16 pb-20">
        {/* Header */}
        <div className="max-w-3xl mx-auto flex flex-col gap-6 items-center text-center mb-12">
          <h1 className="font-semibold text-4xl leading-[48px] text-text-primary tracking-tight">
            Simple, transparent pricing
          </h1>
          <p className="font-normal text-xl leading-7 text-text-secondary">
            Choose the plan that works for you. Start free and upgrade when you're ready.
          </p>
        </div>

        {/* Billing Toggle (for Pro plan) */}
        <div className="max-w-5xl mx-auto flex justify-center mb-8">
          <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-1 flex gap-1">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-md font-medium text-sm leading-5 transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-brand-primary-500 text-text-inverse'
                  : 'text-text-primary hover:text-text-primary/80'
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-md font-medium text-sm leading-5 transition-colors ${
                billingCycle === 'yearly'
                  ? 'bg-brand-primary-500 text-text-inverse'
                  : 'text-text-primary hover:text-text-primary/80'
              }`}
            >
              Yearly
              <span className="ml-1 text-xs text-text-inverse/80">(Save 17%)</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Free Plan */}
          <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-8 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="font-semibold text-2xl leading-8 text-text-primary">
                Free
              </h2>
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-4xl leading-10 text-text-primary">
                  $0
                </span>
                <span className="font-normal text-base leading-6 text-text-secondary">
                  /month
                </span>
              </div>
            </div>

            <ul className="flex flex-col gap-4 flex-1">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-success-500 shrink-0 mt-0.5" />
                <span className="font-normal text-base leading-[22px] text-text-primary">
                  Track unlimited subscriptions
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-success-500 shrink-0 mt-0.5" />
                <span className="font-normal text-base leading-[22px] text-text-primary">
                  Email scanning (1 inbox)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-success-500 shrink-0 mt-0.5" />
                <span className="font-normal text-base leading-[22px] text-text-primary">
                  Chrome extension
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-success-500 shrink-0 mt-0.5" />
                <span className="font-normal text-base leading-[22px] text-text-primary">
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
              <span className="bg-neutral-900 text-text-primary text-xs font-medium px-2 py-1 rounded">
                Popular
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="font-semibold text-2xl leading-8 text-text-inverse">
                Pro
              </h2>
              <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-4xl leading-10 text-text-inverse">
                    ${proPrice}
                  </span>
                  <span className="font-normal text-base leading-6 text-text-inverse/80">
                    {billingCycle === 'monthly' ? '/month' : '/year'}
                  </span>
                </div>
                {billingCycle === 'yearly' && (
                  <span className="font-normal text-sm leading-5 text-text-inverse/70">
                    ${proPricePerMonth}/month billed annually
                  </span>
                )}
              </div>
            </div>

            <ul className="flex flex-col gap-4 flex-1">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-text-inverse shrink-0 mt-0.5" />
                <span className="font-normal text-base leading-[22px] text-text-inverse">
                  Everything in Free
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-text-inverse shrink-0 mt-0.5" />
                <span className="font-normal text-base leading-[22px] text-text-inverse">
                  Unlimited email inboxes
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-text-inverse shrink-0 mt-0.5" />
                <span className="font-normal text-base leading-[22px] text-text-inverse">
                  Smart renewal alerts
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-text-inverse shrink-0 mt-0.5" />
                <span className="font-normal text-base leading-[22px] text-text-inverse">
                  Export (CSV / XLS / PDF)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-text-inverse shrink-0 mt-0.5" />
                <span className="font-normal text-base leading-[22px] text-text-inverse">
                  Priority support
                </span>
              </li>
            </ul>

            <Link
              to="/#pricing"
              className="w-full min-h-[54px] px-6 py-4 rounded-lg flex items-center justify-center font-semibold text-base leading-normal text-text-primary overflow-hidden bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500 hover:from-brand-secondary-500 hover:to-brand-primary-500 transition-all relative"
            >
              <span className="relative z-10">Get Pro</span>
              <div className="absolute inset-0 rounded-[inherit] pointer-events-none shadow-[inset_0px_1px_2px_0px_rgba(146,231,255,0.5)]" />
            </Link>
          </div>

          {/* Lifetime Plan */}
          <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-8 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="font-semibold text-2xl leading-8 text-text-primary">
                Lifetime
              </h2>
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-4xl leading-10 text-text-primary">
                  $199
                </span>
                <span className="font-normal text-base leading-6 text-text-secondary">
                  one-time
                </span>
              </div>
            </div>

            <ul className="flex flex-col gap-4 flex-1">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-success-500 shrink-0 mt-0.5" />
                <span className="font-normal text-base leading-[22px] text-text-primary">
                  Everything in Pro
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-success-500 shrink-0 mt-0.5" />
                <span className="font-normal text-base leading-[22px] text-text-primary">
                  One-time payment
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-success-500 shrink-0 mt-0.5" />
                <span className="font-normal text-base leading-[22px] text-text-primary">
                  All future features included
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-success-500 shrink-0 mt-0.5" />
                <span className="font-normal text-base leading-[22px] text-text-primary">
                  No recurring charges
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-success-500 shrink-0 mt-0.5" />
                <span className="font-normal text-base leading-[22px] text-text-primary">
                  Priority support
                </span>
              </li>
            </ul>

            <Button
              onClick={() => redirectToCheckout('lifetime')}
              variant="secondary"
              className="w-full"
            >
              Get Lifetime
            </Button>
          </div>
        </div>

        {/* Feature Comparison Table */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="font-semibold text-2xl leading-8 text-text-primary text-center mb-8">
            Feature comparison
          </h2>
          <div className="bg-neutral-900 border border-neutral-700 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-700">
                    <th className="px-6 py-4 text-left font-semibold text-base leading-[22px] text-text-primary">
                      Feature
                    </th>
                    <th className="px-6 py-4 text-center font-semibold text-base leading-[22px] text-text-primary">
                      Free
                    </th>
                    <th className="px-6 py-4 text-center font-semibold text-base leading-[22px] text-text-primary">
                      Pro
                    </th>
                    <th className="px-6 py-4 text-center font-semibold text-base leading-[22px] text-text-primary">
                      Lifetime
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((feature, index) => (
                    <tr
                      key={index}
                      className={index < features.length - 1 ? 'border-b border-neutral-700' : ''}
                    >
                      <td className="px-6 py-4 font-normal text-base leading-[22px] text-text-primary">
                        {feature.name}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {renderFeatureValue(feature.free)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {renderFeatureValue(feature.pro)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {renderFeatureValue(feature.lifetime)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FAQ Link */}
        <div className="text-center">
          <p className="font-normal text-base leading-[22px] text-text-secondary">
            Have questions?{' '}
            <Link
              to="/faq"
              className="text-text-brand hover:text-brand-primary-400 transition-colors underline"
            >
              Check our FAQ
            </Link>
          </p>
        </div>
      </div>
    </MarketingLayout>
  );
}
