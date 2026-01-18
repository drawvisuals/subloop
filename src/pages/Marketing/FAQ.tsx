import { useState } from 'react';
import { MarketingLayout } from '@/components/Layout';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'How does email scanning work?',
    answer: 'We connect to your email inbox with read-only access and scan for billing and subscription emails. We only look for subscription-related emails and never read your personal messages. All scanning is done securely and you can disconnect at any time.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes, absolutely. We use read-only access to your email and only store subscription metadata—never your personal emails or financial information. All data is encrypted in transit and at rest. You can delete your account and all data at any time.',
  },
  {
    question: 'What email providers do you support?',
    answer: 'Currently, we support Gmail and Outlook. Support for iCloud and other IMAP providers is coming soon. You can connect multiple inboxes to track subscriptions across all your email accounts.',
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer: 'Yes, you can cancel your subscription at any time from your account settings. There are no cancellation fees or long-term contracts. Your Pro features will remain active until the end of your billing period.',
  },
  {
    question: 'What happens to my data if I delete my account?',
    answer: 'When you delete your account, all of your data is permanently removed from our servers within 30 days. This includes all subscriptions, email connections, and account information. This action cannot be undone.',
  },
  {
    question: 'Do you connect to my bank account?',
    answer: 'No, we never connect to bank accounts or financial institutions. We only access your email inbox to find subscription receipts and billing information. This keeps your financial data private and secure.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <MarketingLayout>
      <div className="pt-16 pb-20">
        {/* Header */}
        <div className="max-w-3xl mx-auto flex flex-col gap-6 items-center text-center mb-16">
          <h1 className="font-semibold text-4xl leading-[48px] text-white tracking-tight">
            Frequently asked questions
          </h1>
          <p className="font-normal text-xl leading-7 text-neutral-700">
            Everything you need to know about Subloop.
          </p>
        </div>

        {/* FAQ List */}
        <div className="max-w-3xl mx-auto flex flex-col gap-4">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="bg-neutral-900 border border-neutral-700 rounded-lg overflow-hidden"
            >
              <button
                type="button"
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-neutral-800/50 transition-colors"
              >
                <h3 className="font-semibold text-lg leading-7 text-white pr-8">
                  {faq.question}
                </h3>
                <ChevronDown
                  className={`w-5 h-5 text-white shrink-0 transition-transform ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5 border-t border-neutral-700">
                  <p className="font-normal text-base leading-[22px] text-neutral-700 pt-4">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="max-w-2xl mx-auto flex flex-col gap-4 items-center text-center mt-16 pt-12 border-t border-neutral-200">
          <p className="font-normal text-base leading-[22px] text-neutral-700">
            Still have questions?
          </p>
          <p className="font-normal text-base leading-[22px] text-white">
            Contact us at{' '}
            <a
              href="mailto:support@usesubloop.com"
              className="text-brand-primary-500 hover:text-brand-primary-400 transition-colors underline"
            >
              support@usesubloop.com
            </a>
          </p>
        </div>
      </div>
    </MarketingLayout>
  );
}
