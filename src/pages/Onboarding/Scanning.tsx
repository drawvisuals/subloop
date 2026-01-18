import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScanText, CornerDownRight } from 'lucide-react';
import { ProgressBar, ConnectedInbox } from '@/components/Onboarding';
import { markScanComplete } from '@/services/onboarding';

/**
 * Scan in progress page
 * Matches Figma design exactly with progress bar and connected inbox list
 */
export default function Scanning() {
	const navigate = useNavigate();
	const [progress, setProgress] = useState(0);

	// Mock scanning progress - will be replaced with actual logic
	useEffect(() => {
		const interval = setInterval(() => {
			setProgress((prev) => {
				if (prev >= 100) {
					clearInterval(interval);
					// Mark scan as complete and redirect
					markScanComplete();
					// Redirect to browser extension step (if not completed) or subscriptions
					const { getOnboardingState } = require('@/services/onboarding');
					const state = getOnboardingState();
					if (state.browserExtensionStatus === 'unknown') {
						navigate('/onboarding/browser-extension');
					} else {
						navigate('/app/subscriptions');
					}
					return 100;
				}
				return prev + 2;
			});
		}, 200);

		return () => clearInterval(interval);
	}, [navigate]);

	// Mock connected inboxes - will be replaced with actual data
	const connectedInboxes = [
		{ email: 'ivan.rubyo@gmail.com', provider: 'gmail' as const },
		{ email: 'ivan.rubyo@outlook.com', provider: 'outlook' as const },
	];

	return (
		<div className="min-h-screen bg-neutral-800 flex items-center justify-center px-4 sm:px-6 md:px-10 py-12 sm:py-16 md:py-20">
			{/* Container matching Figma: 438px width, centered */}
			<div className="w-full max-w-[438px] flex flex-col gap-6 sm:gap-8 items-center justify-center">
				{/* Icon + Title */}
				<div className="w-full flex flex-col items-center">
					<div className="w-full flex flex-col items-center gap-0">
						{/* Scan icon */}
						<ScanText className="w-6 h-6 shrink-0 mb-0 text-text-primary" />

						{/* Title */}
						<h1 className="font-semibold min-h-[39px] leading-8 sm:leading-9 text-2xl sm:text-[30px] text-center text-text-primary tracking-tight whitespace-pre-wrap w-full mt-0">
							Scan in progress
						</h1>
					</div>
				</div>

				{/* Scanning Status Container */}
				<div className="w-full bg-neutral-900 rounded-xl sm:rounded-2xl p-1 flex flex-col gap-2 items-center">
					{/* Scanning Status Row */}
					<div className="w-full flex flex-col items-start pb-4">
						{/* "Scanning the last 12 months..." row */}
						<div className="w-full flex gap-1 items-center p-4">
							{/* Corner icon */}
							<CornerDownRight className="w-3 h-3 shrink-0 text-text-secondary" />
							<span className="flex-1 font-normal text-base leading-normal text-text-primary tracking-tight">
								Scanning the last 12 months...
							</span>
						</div>

						{/* Progress Bar */}
						<ProgressBar
							progress={progress}
							label={`${Math.round(progress)}%`}
						/>
					</div>

					{/* Connected Inboxes */}
					<div className="w-full flex flex-col gap-1 items-start">
						{connectedInboxes.map((inbox) => (
							<ConnectedInbox
								key={inbox.email}
								email={inbox.email}
								provider={inbox.provider}
								status="connected"
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
