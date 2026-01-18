import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScanText } from 'lucide-react';
import { EmailProviderRow } from '@/components/Onboarding';
import { Button } from '@/components/Auth';
import { markEmailConnected, markScanStarted } from '@/services/onboarding';

/**
 * Connect and scan emails page
 * Matches Figma design exactly with proper spacing, typography, and colors
 */
export default function EmailScan() {
	const navigate = useNavigate();
	const [gmailEnabled, setGmailEnabled] = useState(false);
	const [outlookEnabled, setOutlookEnabled] = useState(false);

	const handleScanEmails = () => {
		// Update onboarding state
		const connectedCount = (gmailEnabled ? 1 : 0) + (outlookEnabled ? 1 : 0);
		markEmailConnected(connectedCount);
		markScanStarted();
		navigate('/onboarding/scanning');
	};

	const handleSkip = () => {
		// Mock skip logic - will be implemented later
		console.log('Skip for now clicked');
		navigate('/app/subscriptions');
	};

	const hasProviderEnabled = gmailEnabled || outlookEnabled;

	return (
		<div className="min-h-screen bg-neutral-800 flex items-center justify-center px-4 sm:px-6 md:px-10 py-12 sm:py-16 md:py-20">
			{/* Container matching Figma: 439px width, centered */}
			<div className="w-full max-w-[439px] flex flex-col gap-6 sm:gap-8 items-center">
				{/* Icon + Title + Text */}
				<div className="w-full flex flex-col gap-3 items-center">
					<div className="w-full flex flex-col items-center gap-0">
						{/* Scan icon */}
						<ScanText className="w-6 h-6 shrink-0 mb-0 text-text-primary" />

						{/* Title */}
						<h1 className="font-semibold min-h-[39px] leading-8 sm:leading-9 text-2xl sm:text-[30px] text-center text-text-primary tracking-tight whitespace-pre-wrap w-full mt-0">
							Connect and scan your emails
						</h1>
					</div>

					{/* Description */}
					<p className="font-normal min-h-[63px] leading-5 sm:leading-[22px] text-sm sm:text-base text-text-secondary text-center tracking-tight whitespace-pre-wrap w-full">
						We connect and scan your inbox only for billing and subscription emails to detect recurring payments. We{' '}
						<span className="text-text-primary">never</span> read{' '}
						<span className="text-text-primary">personal emails</span> or{' '}
						<span className="text-text-primary">send anything</span> on your behalf.
					</p>
				</div>

				{/* Email Providers Container */}
				<div className="w-full bg-neutral-900 rounded-xl sm:rounded-2xl p-4 sm:p-5 flex flex-col gap-4 sm:gap-5 items-center">
					<EmailProviderRow
						provider="gmail"
						checked={gmailEnabled}
						onChange={setGmailEnabled}
					/>

					<EmailProviderRow
						provider="outlook"
						checked={outlookEnabled}
						onChange={setOutlookEnabled}
					/>

					<EmailProviderRow
						provider="icloud"
						checked={false}
						onChange={() => { }}
						comingSoon
					/>

					<EmailProviderRow
						provider="imap"
						checked={false}
						onChange={() => { }}
						comingSoon
					/>
				</div>

				{/* Button + Skip */}
				<div className="w-full flex flex-col gap-3 items-start">
					<Button
						onClick={handleScanEmails}
						disabled={!hasProviderEnabled}
						showArrow
					>
						Scan emails
					</Button>

					{/* Skip for now link */}
					<button
						type="button"
						onClick={handleSkip}
						className="w-full min-h-[44px] sm:min-h-[22px] sm:h-[22px] py-2 sm:py-0 font-normal leading-5 sm:leading-[22px] text-sm sm:text-base text-text-secondary text-center tracking-tight hover:text-text-brand transition-colors active:opacity-75"
					>
						Skip for now
					</button>
				</div>
			</div>
		</div>
	);
}
