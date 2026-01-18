import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MarketingLayout } from '@/components/Layout';
import { ChromeIcon } from '@/components/ChromeIcon';
import {
	ScanText,
	Globe,
	Bell,
	ShieldHalf,
	Search,
	ArrowUpToLine,
	Check,
	Plus,
	ArrowRight,
} from 'lucide-react';
import { redirectToCheckout } from '@/services/stripe';

interface FAQItem {
	question: string;
	answer: string;
}

const faqData: FAQItem[] = [
	{
		question: 'How does Subloop find my subscriptions?',
		answer: 'We detect subscription signals in billing emails like receipts, renewal notices, trial confirmations, and plan changes.',
	},
	{
		question: 'What does the Chrome extension do?',
		answer: 'It helps you capture subscriptions while you are signing up online, so new subscriptions do not get lost or forgotten.',
	},
	{
		question: 'Subloop reads my emails?',
		answer: 'No human reads your email. We use automated detection with read-only access.',
	},
	{
		question: 'Which email providers are supported?',
		answer: 'At the moment only Gmail and Outlook are supported. But we plan to add iCloud and IMAP solutions in the future.',
	},
	{
		question: 'What if Subloop misses a subscription?',
		answer: 'You can add it manually and edit details anytime.',
	},
	{
		question: 'Can I cancel at any time?',
		answer: 'Yes, you can cancel anytime. We want happy customers that are willing to pay for the service we provide and support the mission of helping people track their finances.',
	},
	{
		question: 'Is my data secure?',
		answer: 'Yes. Connections are read-only and secured with encryption.',
	},
];

export default function Landing() {
	const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

	const toggleFAQ = (index: number) => {
		setOpenFaqIndex(openFaqIndex === index ? null : index);
	};

	return (
		<MarketingLayout>
			<div className="pt-8 pb-12 sm:pt-12 sm:pb-16 md:pt-16 md:pb-20 flex flex-col gap-12 sm:gap-16 md:gap-20 lg:gap-[128px]">
				{/* Hero Section */}
				<div className="flex flex-col gap-6 sm:gap-8 md:gap-10 items-center">
					{/* Title + Text */}
					<div className="flex flex-col gap-3 sm:gap-4 items-center text-center w-full px-4 sm:px-0 max-w-[668px]">
						<h1 className="font-semibold text-3xl sm:text-4xl md:text-[48px] leading-tight sm:leading-[44px] md:leading-[54px] text-white tracking-tight px-2">
							Track all your subscriptions
							<br />
							with a simple list
						</h1>
						<p className="font-normal text-base sm:text-lg leading-5 sm:leading-6 text-neutral-700 max-w-full sm:max-w-[668px] px-4 sm:px-0">
							Subloop automatically finds, tracks, and organizes your subscriptions straight from your inbox and browser. No spreadsheets. No guesswork.
						</p>
					</div>

					{/* Buttons + Footnote */}
					<div className="flex flex-col gap-4 sm:gap-4 items-center w-full px-4 sm:px-0">
						{/* Buttons - stack on mobile, horizontal on tablet+ */}
						<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 items-stretch sm:items-start justify-center w-full sm:w-auto">
							<Link to="/auth/signup" className="w-full sm:w-auto">
								<button className="bg-white min-h-[44px] sm:h-[52px] w-full sm:w-auto sm:min-w-[200px] px-6 py-3 sm:py-4 rounded-xl flex gap-2 items-center justify-center hover:opacity-90 transition-opacity active:opacity-75">
									<span className="font-semibold text-sm sm:text-base leading-[22px] text-neutral-900">
										Connect your email
									</span>
									<ArrowRight className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-neutral-900 shrink-0" />
								</button>
							</Link>
							<button
								onClick={() => window.location.href = 'https://chrome.google.com/webstore'}
								className="bg-brand-secondary-500 min-h-[44px] sm:h-[52px] w-full sm:w-auto sm:min-w-[200px] px-6 py-3 sm:py-4 rounded-xl flex gap-2 items-center justify-center hover:opacity-90 transition-opacity active:opacity-75"
							>
								<ChromeIcon className="w-5 h-5 sm:w-[23px] sm:h-[22px] shrink-0" />
								<span className="font-semibold text-sm sm:text-base leading-[22px] text-white">
									Add Chrome extension
								</span>
								<ArrowRight className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-white shrink-0" />
							</button>
						</div>

						{/* Footnote */}
						<div className="flex flex-wrap gap-2 items-center justify-center px-4 sm:px-0">
							<ShieldHalf className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-700 shrink-0" />
							<p className="font-light text-xs sm:text-sm leading-4 sm:leading-5 text-neutral-700 text-center">
								Secure. <span className="text-neutral-700">Read-only access. Cancel anytime.</span>
							</p>
						</div>
					</div>

					{/* Video Placeholder - responsive height */}
					<div className="bg-neutral-200 border border-neutral-100 rounded-xl sm:rounded-2xl h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] w-full max-w-[898px] mx-4 sm:mx-0" />
				</div>

				{/* App Preview Section - horizontal scroll on mobile */}
				<section className="border border-neutral-200 rounded-xl sm:rounded-2xl overflow-hidden mx-4 sm:mx-0">
					<div className="overflow-x-auto">
						<div className="min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:h-[780px] w-full min-w-[800px] sm:w-full sm:min-w-0 relative rounded-xl sm:rounded-2xl bg-neutral-900">
							{/* This would be an image/screenshot of the app */}
							<div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center">
								<p className="text-neutral-700 text-xs sm:text-sm">App preview screenshot</p>
							</div>
						</div>
					</div>
				</section>

				{/* Features Section */}
				<section id="features" className="flex flex-col gap-6 sm:gap-8 md:gap-10 items-center scroll-mt-16 w-full px-4 sm:px-0">
					{/* Title + Text */}
					<div className="flex flex-col gap-3 sm:gap-4 items-center text-center w-full max-w-[668px]">
						<h2 className="font-semibold text-2xl sm:text-3xl md:text-[38px] leading-tight sm:leading-[36px] md:leading-[44px] text-white px-4 sm:px-0">
							Everything you need to keep
							<br />
							track of your subscriptions
						</h2>
						<p className="font-normal text-base sm:text-lg leading-5 sm:leading-6 text-neutral-700 px-4 sm:px-0">
							Powerful features to help you track your expenses.
						</p>
					</div>

					{/* Main Features (3 cards) - stack on mobile */}
					<div className="flex flex-col lg:flex-row items-stretch lg:items-start w-full">
						{/* Scan your email */}
						<div className="flex-1 bg-neutral-900 border border-neutral-200 rounded-tl-2xl rounded-tr-2xl lg:rounded-tr-none lg:rounded-bl-2xl border-b lg:border-b-0 lg:border-r-0 p-6 sm:p-8 flex flex-col gap-6 sm:gap-8 items-center">
							<div className="flex flex-col gap-4 sm:gap-6 items-start w-full">
								<div className="flex gap-3 items-start">
									<ScanText className="w-6 h-6 sm:w-8 sm:h-8 text-white shrink-0" />
									<h3 className="font-semibold text-xl sm:text-2xl leading-[28px] sm:leading-[30px] text-white">
										Scan your email
									</h3>
								</div>
								<p className="font-normal text-sm sm:text-base leading-5 sm:leading-[22px] text-neutral-700 tracking-tight">
									Scans your email to find existing subscriptions and detects new ones every time you rescan.
								</p>
							</div>
							<div className="bg-neutral-100 h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] rounded-xl w-full" />
						</div>

						{/* Browser reading */}
						<div className="flex-1 bg-neutral-900 border border-neutral-200 border-t-0 lg:border-t lg:border-y border-l-0 lg:border-l p-6 sm:p-8 flex flex-col gap-6 sm:gap-8 items-center">
							<div className="flex flex-col gap-4 sm:gap-6 items-start w-full">
								<div className="flex gap-3 items-start">
									<Globe className="w-6 h-6 sm:w-8 sm:h-8 text-white shrink-0" />
									<h3 className="font-semibold text-xl sm:text-2xl leading-[28px] sm:leading-[30px] text-white">
										Browser reading
									</h3>
								</div>
								<p className="font-normal text-sm sm:text-base leading-5 sm:leading-[22px] text-neutral-700 tracking-tight">
									The browser extension helps you save new subscriptions when you sign up online.
								</p>
							</div>
							<div className="bg-neutral-100 h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] rounded-xl w-full" />
						</div>

						{/* Renewal alerts that matter */}
						<div className="flex-1 bg-neutral-900 border border-neutral-200 rounded-bl-2xl rounded-br-2xl lg:rounded-bl-none lg:rounded-tr-2xl border-t-0 lg:border-t border-l-0 lg:border-l-0 p-6 sm:p-8 flex flex-col gap-6 sm:gap-8 items-center">
							<div className="flex flex-col gap-4 sm:gap-6 items-start w-full">
								<div className="flex gap-3 items-start">
									<Bell className="w-6 h-6 sm:w-8 sm:h-8 text-white shrink-0" />
									<h3 className="font-semibold text-xl sm:text-2xl leading-[28px] sm:leading-[30px] text-white">
										Renewal alerts that matter
									</h3>
								</div>
								<p className="font-normal text-sm sm:text-base leading-5 sm:leading-[22px] text-neutral-700 tracking-tight">
									Get notified before renewals hit — so you can cancel, downgrade, or keep what you actually use.
								</p>
							</div>
							<div className="bg-neutral-100 h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] rounded-xl w-full" />
						</div>
					</div>

					{/* More Features - stack on mobile, 2 cols on tablet, 3 on desktop */}
					<div className="flex flex-col md:flex-row items-stretch md:items-start w-full">
						{/* Privacy first by design */}
						<div className="flex-1 px-4 sm:px-6 md:px-8">
							<div className="flex flex-col gap-4 sm:gap-6 items-start pb-6 border-b border-neutral-200">
								<div className="flex gap-3 items-center">
									<ShieldHalf className="w-6 h-6 sm:w-8 sm:h-8 text-white shrink-0" />
									<h3 className="font-normal text-lg sm:text-xl leading-[24px] sm:leading-[26px] text-white">
										Privacy first by design
									</h3>
								</div>
								<p className="font-normal text-sm sm:text-base leading-5 sm:leading-[22px] text-neutral-700 tracking-tight">
									Your data is encrypted. Emails are scanned securely and never stored or shared. Your personal data is always confidential.
								</p>
							</div>
						</div>

						{/* Instant search */}
						<div className="flex-1 px-4 sm:px-6 md:px-8">
							<div className="flex flex-col gap-4 sm:gap-6 items-start pb-6 border-b border-neutral-200">
								<div className="flex gap-3 items-center">
									<Search className="w-6 h-6 sm:w-8 sm:h-8 text-white shrink-0" />
									<h3 className="font-normal text-lg sm:text-xl leading-[24px] sm:leading-[26px] text-white">
										Instant search
									</h3>
								</div>
								<p className="font-normal text-sm sm:text-base leading-5 sm:leading-[22px] text-neutral-700 tracking-tight sm:w-[295px]">
									Find any subscription instantly. Start typing and your list filters in real time, no loading, no menus, no friction.
								</p>
							</div>
						</div>

						{/* Export options */}
						<div className="flex-1 px-4 sm:px-6 md:px-8">
							<div className="flex flex-col gap-4 sm:gap-6 items-start pb-6 border-b border-neutral-200">
								<div className="flex gap-3 items-center">
									<ArrowUpToLine className="w-6 h-6 sm:w-8 sm:h-8 text-white shrink-0" />
									<h3 className="font-normal text-lg sm:text-xl leading-[24px] sm:leading-[26px] text-white">
										Export options
									</h3>
								</div>
								<p className="font-normal text-sm sm:text-base leading-5 sm:leading-[22px] text-neutral-700 tracking-tight">
									Download your subscriptions as a CSV, XLSX and PDF. Perfect for budgeting, accounting, or just keeping a personal record.
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* Value Proposition Section */}
				<section className="flex flex-col gap-6 sm:gap-8 md:gap-10 items-center w-full px-4 sm:px-0">
					{/* Title + Text */}
					<div className="flex flex-col gap-3 sm:gap-4 items-center text-center w-full max-w-[668px]">
						<h2 className="font-semibold text-2xl sm:text-3xl md:text-[38px] leading-tight sm:leading-[36px] md:leading-[44px] text-white px-4 sm:px-0">
							Subscriptions are not the
							<br />
							problem, visibility is
						</h2>
						<p className="font-normal text-base sm:text-lg leading-5 sm:leading-6 text-neutral-700 px-4 sm:px-0">
							Most people do not overspend because they subscribe too much they overspend because renewals happen quietly.
						</p>
					</div>

					{/* Bullets - stack on mobile, 2 cols on tablet+ */}
					<div className="flex flex-col sm:grid sm:grid-cols-2 gap-6 sm:gap-8 items-start w-full max-w-[786px] px-4 sm:px-0">
						<div className="flex gap-3 items-center w-full">
							<div className="border-[1.5px] border-neutral-200 rounded-full p-2 shrink-0">
								<Check className="w-5 h-5 sm:w-[27px] sm:h-[27px] text-white" />
							</div>
							<p className="font-normal text-base sm:text-lg leading-5 sm:leading-6 text-white">
								Find subscriptions you forgot existed
							</p>
						</div>
						<div className="flex gap-3 items-center w-full">
							<div className="border-[1.5px] border-neutral-200 rounded-full p-2 shrink-0">
								<Check className="w-5 h-5 sm:w-[27px] sm:h-[27px] text-white" />
							</div>
							<p className="font-normal text-base sm:text-lg leading-5 sm:leading-6 text-white">
								Capture new ones while you sign up
							</p>
						</div>
						<div className="flex gap-3 items-center w-full">
							<div className="border-[1.5px] border-neutral-200 rounded-full p-2 shrink-0">
								<Check className="w-5 h-5 sm:w-[27px] sm:h-[27px] text-white" />
							</div>
							<p className="font-normal text-base sm:text-lg leading-5 sm:leading-6 text-white">
								Prevent surprise renewals with alerts
							</p>
						</div>
						<div className="flex gap-3 items-center w-full">
							<div className="border-[1.5px] border-neutral-200 rounded-full p-2 shrink-0">
								<Check className="w-5 h-5 sm:w-[27px] sm:h-[27px] text-white" />
							</div>
							<p className="font-normal text-base sm:text-lg leading-5 sm:leading-6 text-white">
								Control recurring spending with one clean list
							</p>
						</div>
					</div>
				</section>

				{/* Pricing Section */}
				<section id="pricing" className="flex flex-col gap-6 sm:gap-8 md:gap-10 items-center scroll-mt-16 w-full px-4 sm:px-0">
					{/* Title + Text */}
					<div className="flex flex-col gap-3 sm:gap-4 items-center text-center w-full max-w-[668px]">
						<h2 className="font-semibold text-2xl sm:text-3xl md:text-[38px] leading-tight sm:leading-[36px] md:leading-[44px] text-white px-4 sm:px-0">
							Simple plans
							<br />
							Built for real life
						</h2>
						<p className="font-normal text-base sm:text-lg leading-5 sm:leading-6 text-neutral-700 px-4 sm:px-0">
							Cancel anytime. Upgrade only if it saves you money.
						</p>
					</div>

					{/* Pricing Cards - stack on mobile, side-by-side on desktop */}
					<div className="flex flex-col lg:flex-row items-stretch lg:items-start justify-center w-full max-w-5xl gap-4 sm:gap-6 lg:gap-0">
						{/* Free Plan */}
						<div className="bg-neutral-900 border border-neutral-200 rounded-2xl lg:rounded-tl-2xl lg:rounded-bl-2xl lg:rounded-tr-none lg:rounded-br-none border-b lg:border-b lg:border-r-0 min-h-0 lg:h-auto lg:min-h-[700px] p-6 sm:p-8 lg:p-12 flex flex-col gap-4 sm:gap-6 items-start w-full lg:w-[450px]">
							<div className="flex flex-col gap-4 sm:gap-6 items-start w-full">
								<div className="flex flex-col gap-3 sm:gap-4 items-start w-full">
									<div className="flex gap-2 items-center w-full">
										<div className="w-4 h-4 rounded bg-brand-primary-500 shrink-0" />
										<p className="font-normal text-lg sm:text-xl leading-[24px] sm:leading-[26px] text-white">Free Plan</p>
									</div>
									<p className="font-semibold text-xl sm:text-2xl leading-[28px] sm:leading-[30px] text-white">$0/month</p>
								</div>

								{/* Bullets */}
								<div className="flex flex-col gap-3 sm:gap-4 items-start w-full">
									<div className="flex gap-3 items-center w-full">
										<Check className="w-5 h-5 sm:w-[26px] sm:h-[26px] text-success-500 shrink-0" />
										<p className="flex-1 font-normal text-sm sm:text-base leading-5 sm:leading-[22px] text-neutral-700 tracking-tight">
											Email scan (Gmail/Outlook)
										</p>
									</div>
									<div className="flex gap-3 items-center w-full">
										<Check className="w-5 h-5 sm:w-[26px] sm:h-[26px] text-success-500 shrink-0" />
										<p className="flex-1 font-normal text-sm sm:text-base leading-5 sm:leading-[22px] text-neutral-700 tracking-tight">
											Track up to 3 subscriptions
										</p>
									</div>
									<div className="flex gap-3 items-center w-full">
										<Check className="w-5 h-5 sm:w-[26px] sm:h-[26px] text-success-500 shrink-0" />
										<p className="flex-1 font-normal text-sm sm:text-base leading-5 sm:leading-[22px] text-neutral-700 tracking-tight">
											Basic renewal reminders
										</p>
									</div>
									<div className="flex gap-3 items-center w-full">
										<Check className="w-5 h-5 sm:w-[26px] sm:h-[26px] text-success-500 shrink-0" />
										<p className="flex-1 font-normal text-sm sm:text-base leading-5 sm:leading-[22px] text-neutral-700 tracking-tight">
											Manual add & edit
										</p>
									</div>
								</div>

								{/* Button */}
								<Link to="/auth/signup" className="w-full mt-auto">
									<button className="bg-white w-full min-h-[44px] sm:h-[52px] px-6 py-3 sm:py-4 rounded-xl flex gap-2 items-center justify-center hover:opacity-90 transition-opacity active:opacity-75">
										<span className="font-semibold text-sm sm:text-base leading-[22px] text-neutral-900">
											Get started for free
										</span>
										<ArrowRight className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-neutral-900 shrink-0" />
									</button>
								</Link>
							</div>
						</div>

						{/* Pro Plan */}
						<div className="bg-black border border-neutral-200 rounded-2xl lg:rounded-tl-none lg:rounded-bl-none lg:rounded-tr-2xl lg:rounded-br-2xl border-t-0 lg:border-t border-l-0 lg:border-l min-h-0 lg:h-auto lg:min-h-[700px] p-6 sm:p-8 lg:p-12 flex flex-col gap-6 sm:gap-8 items-start w-full lg:w-[448px]">
							<div className="flex flex-col gap-4 sm:gap-6 items-start w-full">
								<div className="flex gap-2 items-center">
									<div className="w-4 h-4 rounded bg-brand-primary-500 shrink-0" />
									<p className="font-normal text-lg sm:text-xl leading-[24px] sm:leading-[26px] text-white">Pro Plan</p>
								</div>

								{/* Pricing Options */}
								<div className="flex flex-col w-full border-b border-neutral-200 pb-4 sm:pb-6">
									{/* Yearly */}
									<div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-neutral-200">
										<div className="flex gap-3 items-center">
											<Check className="w-5 h-5 sm:w-[26px] sm:h-[26px] text-success-500 shrink-0" />
											<div className="flex flex-col gap-1">
												<p className="font-normal text-lg sm:text-xl leading-[24px] sm:leading-[26px] text-white">Yearly</p>
												<p className="font-mono font-normal text-xs sm:text-sm leading-4 sm:leading-5 text-neutral-700">Single user</p>
											</div>
										</div>
										<p className="font-semibold text-xl sm:text-2xl leading-[28px] sm:leading-[30px] text-white">$1.99</p>
									</div>

									{/* Lifetime */}
									<div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-neutral-200">
										<div className="flex gap-3 items-center">
											<Check className="w-5 h-5 sm:w-[26px] sm:h-[26px] text-success-500 shrink-0" />
											<div className="flex flex-col gap-1">
												<p className="font-normal text-lg sm:text-xl leading-[24px] sm:leading-[26px] text-white">Lifetime</p>
												<p className="font-mono font-normal text-xs sm:text-sm leading-4 sm:leading-5 text-neutral-700">Single user</p>
											</div>
										</div>
										<p className="font-semibold text-xl sm:text-2xl leading-[28px] sm:leading-[30px] text-white">$8.99</p>
									</div>

									{/* Lifetime Family */}
									<div className="flex items-center justify-between pb-4 sm:pb-6">
										<div className="flex gap-3 items-center">
											<Check className="w-5 h-5 sm:w-[26px] sm:h-[26px] text-success-500 shrink-0" />
											<div className="flex flex-col gap-1">
												<p className="font-normal text-lg sm:text-xl leading-[24px] sm:leading-[26px] text-white">Lifetime Family</p>
												<p className="font-mono font-normal text-xs sm:text-sm leading-4 sm:leading-5 text-neutral-700">Family sharing (4 people)</p>
											</div>
										</div>
										<p className="font-semibold text-xl sm:text-2xl leading-[28px] sm:leading-[30px] text-white">$35.99</p>
									</div>
								</div>

								{/* Features */}
								<div className="flex flex-col gap-3 sm:gap-4 items-start w-full">
									<div className="flex gap-3 items-center w-full">
										<Check className="w-5 h-5 sm:w-[26px] sm:h-[26px] text-success-500 shrink-0" />
										<p className="flex-1 font-normal text-sm sm:text-base leading-5 sm:leading-[22px] text-neutral-700 tracking-tight">
											Unlimited subscriptions
										</p>
									</div>
									<div className="flex gap-3 items-center w-full">
										<Check className="w-5 h-5 sm:w-[26px] sm:h-[26px] text-success-500 shrink-0" />
										<p className="flex-1 font-normal text-sm sm:text-base leading-5 sm:leading-[22px] text-neutral-700 tracking-tight">
											Smart renewal alerts (trials + renewals)
										</p>
									</div>
									<div className="flex gap-3 items-center w-full">
										<Check className="w-5 h-5 sm:w-[26px] sm:h-[26px] text-success-500 shrink-0" />
										<p className="flex-1 font-normal text-sm sm:text-base leading-5 sm:leading-[22px] text-neutral-700 tracking-tight">
											Faster rescans + priority detection
										</p>
									</div>
									<div className="flex gap-3 items-center w-full">
										<Check className="w-5 h-5 sm:w-[26px] sm:h-[26px] text-success-500 shrink-0" />
										<p className="flex-1 font-normal text-sm sm:text-base leading-5 sm:leading-[22px] text-neutral-700 tracking-tight">
											Chrome extension signup capture
										</p>
									</div>
									<div className="flex gap-3 items-center w-full">
										<Check className="w-5 h-5 sm:w-[26px] sm:h-[26px] text-success-500 shrink-0" />
										<p className="flex-1 font-normal text-sm sm:text-base leading-5 sm:leading-[22px] text-neutral-700 tracking-tight">
											Export CSV, XLSX and PDF
										</p>
									</div>
								</div>

								{/* Button */}
								<button
									onClick={() => redirectToCheckout('pro-yearly')}
									className="w-full min-h-[44px] sm:h-[52px] px-6 py-3 sm:py-4 rounded-xl flex items-center justify-center hover:opacity-90 transition-opacity active:opacity-75 relative overflow-hidden mt-auto"
									style={{
										backgroundImage: 'linear-gradient(231.21deg, #1EBBE6 9.18%, #1F36E6 87.99%)',
									}}
								>
									<span className="font-semibold text-sm sm:text-base leading-[22px] text-white relative z-10">
										Get Pro
									</span>
									<div className="absolute inset-0 rounded-[inherit] pointer-events-none shadow-[inset_0px_1px_2px_0px_rgba(146,231,255,0.5)]" />
								</button>
							</div>
						</div>
					</div>
				</section>

				{/* FAQ Section - stack on mobile, side-by-side on desktop */}
				<section id="faq" className="flex flex-col lg:flex-row items-start w-full rounded-xl sm:rounded-2xl scroll-mt-16 mx-4 sm:mx-0 overflow-hidden">
					<div className="bg-neutral-900 border border-neutral-200 rounded-xl sm:rounded-2xl flex flex-col lg:flex-row gap-4 sm:gap-6 items-start p-6 sm:p-8 lg:p-12 w-full">
						{/* Left: Title + Contact */}
						<div className="flex-1 flex flex-col gap-8 sm:gap-12 lg:gap-16 items-start justify-center w-full lg:w-auto">
							{/* Title + Text */}
							<div className="flex flex-col gap-3 sm:gap-4 items-start pb-8 sm:pb-12 lg:pb-16 border-b border-neutral-200 w-full">
								<h2 className="font-semibold text-2xl sm:text-3xl md:text-[38px] leading-tight sm:leading-[36px] md:leading-[44px] text-white">
									Frequently Asked Questions
								</h2>
								<p className="font-normal text-base sm:text-lg leading-5 sm:leading-6 text-neutral-700">
									Everything you need to know about Subloop.
								</p>
							</div>

							{/* Contact */}
							<div className="flex flex-col gap-3 sm:gap-4 items-start w-full lg:w-auto">
								<p className="font-normal text-lg sm:text-xl leading-[24px] sm:leading-[26px] text-white">
									Can not find what you are looking for?
								</p>
								<button className="bg-neutral-200 min-h-[44px] sm:h-[52px] px-6 py-3 sm:py-4 rounded-xl flex items-center justify-center hover:opacity-90 transition-opacity active:opacity-75 w-full sm:w-auto">
									<span className="font-semibold text-sm sm:text-base leading-[22px] text-white">
										Contact support
									</span>
								</button>
							</div>
						</div>

						{/* Right: Questions */}
						<div className="flex-1 flex flex-col gap-6 sm:gap-8 items-start justify-center w-full lg:w-auto">
							{faqData.map((faq, index) => (
								<div
									key={index}
									className={`flex flex-col gap-3 sm:gap-4 items-start w-full ${index < faqData.length - 1 ? 'pb-6 sm:pb-8 border-b border-neutral-200' : ''
										}`}
								>
									<button
										type="button"
										onClick={() => toggleFAQ(index)}
										className="flex items-center justify-between w-full min-h-[44px] text-left active:opacity-75"
									>
										<p className="font-normal text-lg sm:text-xl leading-[24px] sm:leading-[26px] text-white pr-4">
											{faq.question}
										</p>
										<Plus
											className={`w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0 transition-transform ${openFaqIndex === index ? 'rotate-45' : ''
												}`}
										/>
									</button>
									{openFaqIndex === index && (
										<p className="font-normal text-sm sm:text-base leading-5 sm:leading-[22px] text-neutral-700 tracking-tight pt-2">
											{faq.answer}
										</p>
									)}
								</div>
							))}
						</div>
					</div>
				</section>
			</div>
		</MarketingLayout>
	);
}
