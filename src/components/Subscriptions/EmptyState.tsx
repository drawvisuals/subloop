import { useNavigate } from 'react-router-dom';
import { TableProperties, ArrowRight } from 'lucide-react';

/**
 * Empty state component for subscriptions list
 * Matches Figma design exactly with proper spacing, typography, and colors
 */
export function EmptyState() {
	const navigate = useNavigate();

	const handleAddChromeExtension = () => {
		// Mock extension logic - will be implemented later
		console.log('Add Chrome extension clicked');
		navigate('/onboarding/browser-extension');
	};

	const handleScanEmails = () => {
		// Mock scan logic - will be implemented later
		console.log('Scan emails clicked');
		navigate('/onboarding/email-scan');
	};

	const handleAddManually = () => {
		navigate('/app/subscription/add');
	};

	return (
		<div className="flex-1 flex flex-col items-center justify-center w-full py-12">
			<div className="w-full max-w-[439px] flex flex-col gap-8 items-center">
				{/* Icon + Title */}
				<div className="w-full flex flex-col gap-3 items-center">
					<TableProperties className="w-6 h-6 text-white shrink-0" />
					<h2 className="font-semibold leading-9 text-[30px] text-center text-white tracking-tight whitespace-pre-wrap w-full">
						No subscriptions yet
					</h2>
				</div>

				{/* Add Chrome Extension CTA */}
				<div className="w-full flex flex-col gap-3 items-start">
					<p className="font-normal leading-[22px] text-base text-neutral-700 text-center tracking-tight whitespace-pre-wrap w-full">
						Add the browser extension to <span className="text-white">save new subscriptions</span>.
					</p>
					<button
						type="button"
						onClick={handleAddChromeExtension}
						className="w-full h-[54px] px-6 py-4 bg-brand-secondary-500 rounded-lg flex gap-2 items-center justify-center font-semibold text-base leading-[22px] text-white transition-opacity hover:opacity-90"
					>
						{/* Chrome Icon placeholder */}
						<div className="w-[23px] h-[22px] shrink-0 bg-white/20 rounded" />
						<span>Add Chrome extension</span>
						<ArrowRight className="w-[18px] h-[18px] shrink-0" />
					</button>
				</div>

				{/* Scan Emails CTA */}
				<div className="w-full flex flex-col gap-3 items-start">
					<p className="font-normal leading-[22px] text-base text-neutral-700 text-center tracking-tight whitespace-pre-wrap w-full">
						Scan you email inbox to <span className="text-white">add new subscriptions</span>.
					</p>
					<button
						type="button"
						onClick={handleScanEmails}
						className="w-full h-[54px] px-6 py-4 bg-brand-primary-500 rounded-lg flex gap-2 items-center justify-center font-semibold text-base leading-[22px] text-neutral-900 transition-opacity hover:opacity-90"
					>
						<span>Scan emails</span>
						<ArrowRight className="w-[18px] h-[18px] shrink-0" />
					</button>
				</div>

				{/* Add Manually CTA */}
				<div className="w-full flex flex-col gap-3 items-start">
					<p className="font-normal leading-[22px] text-base text-neutral-700 text-center tracking-tight whitespace-pre-wrap w-full">
						Add your subscriptions manually.
					</p>
					<button
						type="button"
						onClick={handleAddManually}
						className="w-full h-[54px] px-6 py-4 bg-neutral-200 border border-neutral-50 rounded-lg flex gap-2 items-center justify-center font-semibold text-base leading-[22px] text-white transition-opacity hover:opacity-90"
					>
						<span>Add manually</span>
						<ArrowRight className="w-[18px] h-[18px] shrink-0" />
					</button>
				</div>
			</div>
		</div>
	);
}
