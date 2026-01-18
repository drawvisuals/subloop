import { useNavigate } from 'react-router-dom';
import { Globe, ArrowRight, ShieldHalf } from 'lucide-react';

/**
 * Browser extension onboarding page
 * Matches Figma design exactly with proper spacing, typography, and colors
 */
export default function BrowserExtension() {
	const navigate = useNavigate();

	const handleAddExtension = () => {
		// Mock extension logic - will be implemented later
		console.log('Add Chrome extension clicked');
		// Navigate to subscriptions after extension is "added"
		// navigate('/app/subscriptions');
	};

	const handleSkip = () => {
		// Mock skip logic - will be implemented later
		console.log('Skip for now clicked');
		navigate('/app/subscriptions');
	};

	return (
		<div className="min-h-screen bg-neutral-100 flex flex-col items-center justify-center px-10 py-8">
			{/* Logo */}
			<div className="flex gap-3 items-center justify-center mb-8">
				{/* Logo icon with gradient */}
				<div
					className="w-9 h-9 rounded-lg relative shrink-0"
					style={{
						backgroundImage: 'linear-gradient(135.86deg, #1EBBE6 45.11%, #1E2FE6 91.65%)',
					}}
				>
					<div className="absolute inset-0 rounded-[inherit] pointer-events-none shadow-[inset_0px_1px_2px_0px_rgba(255,255,255,0.5)]" />
					{/* Logo placeholder - will be replaced with actual logo */}
					<div className="absolute inset-0 flex items-center justify-center">
						<div className="w-[18px] h-[18px] bg-white rounded-sm" />
					</div>
				</div>
				{/* Logotype placeholder */}
				<div className="h-5 w-[78px] bg-white/20 rounded" />
			</div>

			{/* Main Content Container */}
			<div className="flex-1 flex flex-col items-center justify-center w-full">
				<div className="w-full max-w-[439px] flex flex-col gap-8 items-center">
					{/* Icon + Title + Text */}
					<div className="w-full flex flex-col gap-3 items-center">
						<div className="w-full flex flex-col gap-3 items-center">
							{/* Globe icon */}
							<Globe className="w-6 h-6 text-white shrink-0" />

							{/* Title */}
							<h1 className="font-semibold leading-9 text-[30px] text-center text-white tracking-tight whitespace-pre-wrap w-full">
								Track new subscriptions{'\n'}with browser reading
							</h1>
						</div>

						{/* Description */}
						<p className="font-normal leading-[22px] text-base text-neutral-700 text-center tracking-tight whitespace-pre-wrap w-full">
							The <span className="text-white">browser extension</span> helps you{'\n'}
							<span className="text-white">save new subscriptions</span> when you{'\n'}
							<span className="text-white">sign up online</span>.
						</p>
					</div>

					{/* Button + Skip */}
					<div className="w-full flex flex-col gap-3 items-start">
						{/* Add Chrome Extension Button */}
						<button
							type="button"
							onClick={handleAddExtension}
							className="w-full h-[54px] px-6 py-4 bg-brand-secondary-500 rounded-lg flex gap-2 items-center justify-center font-semibold text-base leading-[22px] text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{/* Chrome Icon placeholder */}
							<div className="w-[23px] h-[22px] shrink-0 bg-white/20 rounded" />
							<span>Add Chrome extension</span>
							<ArrowRight className="w-[18px] h-[18px] shrink-0" />
						</button>

						{/* Skip for now link */}
						<button
							type="button"
							onClick={handleSkip}
							className="w-full h-[22px] font-normal leading-[22px] text-base text-neutral-700 text-center tracking-tight hover:text-brand-primary-500 transition-colors"
						>
							Skip for now
						</button>
					</div>
				</div>
			</div>

			{/* Trust Note */}
			<div className="flex gap-2 items-center justify-center mt-8">
				<ShieldHalf className="w-6 h-6 text-neutral-700 shrink-0" />
				<p className="font-normal leading-[22px] text-base text-neutral-700 text-center tracking-tight">
					You're always in control. Nothing is saved without your confirmation.
				</p>
			</div>
		</div>
	);
}
