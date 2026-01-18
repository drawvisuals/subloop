import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScanText } from 'lucide-react';
import { EmailProviderRow } from '@/components/Onboarding';
import { Button } from '@/components/Auth';

/**
 * Connect and scan emails page
 * Matches Figma design exactly with proper spacing, typography, and colors
 */
export default function EmailScan() {
	const navigate = useNavigate();
	const [gmailEnabled, setGmailEnabled] = useState(false);
	const [outlookEnabled, setOutlookEnabled] = useState(false);

	const handleScanEmails = () => {
		// Mock scanning logic - will be implemented later
		console.log('Scan emails clicked', { gmail: gmailEnabled, outlook: outlookEnabled });
		navigate('/onboarding/scanning');
	};

	const handleSkip = () => {
		// Mock skip logic - will be implemented later
		console.log('Skip for now clicked');
		navigate('/app/subscriptions');
	};

	const hasProviderEnabled = gmailEnabled || outlookEnabled;

	return (
		<div className="min-h-screen bg-neutral-50 flex items-center justify-center px-10 py-20">
			{/* Container matching Figma: 439px width, centered */}
			<div className="w-full max-w-[439px] flex flex-col gap-8 items-center">
				{/* Icon + Title + Text */}
				<div className="w-full flex flex-col gap-3 items-center">
					<div className="w-full flex flex-col items-center gap-0">
						{/* Scan icon */}
						<ScanText className="w-6 h-6 shrink-0 mb-0 text-white" />

						{/* Title */}
						<h1 className="font-semibold h-[39px] leading-9 text-[30px] text-center text-white tracking-tight whitespace-pre-wrap w-full mt-0">
							Connect and scan your emails
						</h1>
					</div>

					{/* Description */}
					<p className="font-normal h-[63px] leading-[22px] text-base text-neutral-700 text-center tracking-tight whitespace-pre-wrap w-full">
						We connect and scan your inbox only for billing and subscription emails to detect recurring payments. We{' '}
						<span className="text-white">never</span> read{' '}
						<span className="text-white">personal emails</span> or{' '}
						<span className="text-white">send anything</span> on your behalf.
					</p>
				</div>

				{/* Email Providers Container */}
				<div className="w-full bg-neutral-50 rounded-2xl p-5 flex flex-col gap-5 items-center">
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
						className="w-full h-[22px] font-normal leading-[22px] text-base text-neutral-700 text-center tracking-tight hover:text-brand-primary-500 transition-colors"
					>
						Skip for now
					</button>
				</div>
			</div>
		</div>
	);
}
