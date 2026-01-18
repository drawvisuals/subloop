import { useNavigate } from 'react-router-dom';
import { Globe, ArrowRight, ShieldHalf } from 'lucide-react';
import { Logo } from '@/components/Layout/Logo';
import { markExtensionConnected, markExtensionSkipped } from '@/services/onboarding';

/**
 * Browser extension onboarding page
 * Matches Figma design exactly with proper spacing, typography, and colors
 */
export default function BrowserExtension() {
	const navigate = useNavigate();

	const handleAddExtension = () => {
		// Mark extension as connected
		markExtensionConnected();
		navigate('/app/subscriptions');
	};

	const handleSkip = () => {
		// Mark extension as skipped
		markExtensionSkipped();
		navigate('/app/subscriptions');
	};

	return (
		<div className="min-h-screen bg-neutral-800 flex flex-col items-center justify-center px-4 sm:px-6 md:px-10 py-8 sm:py-12">
			{/* Logo */}
			<div className="flex items-center justify-center mb-6 sm:mb-8">
				<Logo className="h-7 sm:h-9 w-auto" showText={false} />
				<span className="hidden sm:inline ml-2 text-text-primary font-medium text-sm">Subloop</span>
			</div>

			{/* Main Content Container */}
			<div className="flex-1 flex flex-col items-center justify-center w-full">
				<div className="w-full max-w-[439px] flex flex-col gap-6 sm:gap-8 items-center">
					{/* Icon + Title + Text */}
					<div className="w-full flex flex-col gap-3 items-center">
						<div className="w-full flex flex-col gap-3 items-center">
							{/* Globe icon */}
							<Globe className="w-6 h-6 text-text-primary shrink-0" />

							{/* Title */}
							<h1 className="font-semibold leading-8 sm:leading-9 text-2xl sm:text-[30px] text-center text-text-primary tracking-tight whitespace-pre-wrap w-full px-2">
								Track new subscriptions{'\n'}with browser reading
							</h1>
						</div>

						{/* Description */}
						<p className="font-normal leading-5 sm:leading-normal text-sm sm:text-base text-text-secondary text-center tracking-tight whitespace-pre-wrap w-full px-2">
							The <span className="text-text-primary">browser extension</span> helps you{'\n'}
							<span className="text-text-primary">save new subscriptions</span> when you{'\n'}
							<span className="text-text-primary">sign up online</span>.
						</p>
					</div>

					{/* Button + Skip */}
					<div className="w-full flex flex-col gap-3 items-start">
						{/* Add Chrome Extension Button */}
						<button
							type="button"
							onClick={handleAddExtension}
							className="w-full min-h-[44px] sm:h-[54px] px-6 py-3 sm:py-4 bg-brand-secondary-500 rounded-lg flex gap-2 items-center justify-center font-semibold text-sm sm:text-base leading-5 sm:leading-normal text-text-primary transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed active:opacity-75"
						>
							{/* Chrome Icon placeholder */}
							<div className="w-5 h-5 sm:w-[23px] sm:h-[22px] shrink-0 bg-white/20 rounded" />
							<span>Add Chrome extension</span>
							<ArrowRight className="w-4 h-4 sm:w-[18px] sm:h-[18px] shrink-0" />
						</button>

						{/* Skip for now link */}
						<button
							type="button"
							onClick={handleSkip}
							className="w-full min-h-[44px] sm:min-h-[22px] sm:h-[22px] py-2 sm:py-0 font-normal leading-5 sm:leading-normal text-sm sm:text-base text-text-secondary text-center tracking-tight hover:text-text-brand transition-colors active:opacity-75"
						>
							Skip for now
						</button>
					</div>
				</div>
			</div>

			{/* Trust Note */}
			<div className="flex flex-col sm:flex-row gap-2 items-center justify-center mt-6 sm:mt-8 px-4">
				<ShieldHalf className="w-5 h-5 sm:w-6 sm:h-6 text-text-secondary shrink-0" />
				<p className="font-normal leading-5 sm:leading-normal text-xs sm:text-base text-text-secondary text-center tracking-tight">
					You're always in control. Nothing is saved without your confirmation.
				</p>
			</div>
		</div>
	);
}
