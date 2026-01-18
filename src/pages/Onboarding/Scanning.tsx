import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScanText, CornerDownRight, AlertTriangle } from 'lucide-react';
import { ProgressBar, ConnectedInbox } from '@/components/Onboarding';
import { markScanComplete, getOnboardingState } from '@/services/onboarding';
import { getEmailConnections } from '@/services/emailConnectionsStorage';
import { scanGmailForSubscriptions } from '@/services/gmailApi';

/**
 * Scan in progress page
 * Matches Figma design exactly with progress bar and connected inbox list
 */
export default function Scanning() {
	const navigate = useNavigate();
	const [progress, setProgress] = useState(0);
	const [progressStage, setProgressStage] = useState<string>('Connecting…');
	const [connectedInboxes, setConnectedInboxes] = useState<Array<{ email: string; provider: 'gmail' | 'outlook' }>>([]);
	const [scanError, setScanError] = useState<{
		message: string;
		httpStatus?: number;
		response?: any;
		likelyCause?: string;
		messagesSearched?: number;
		queriesUsed?: Array<{ query: string; messagesFound: number; success: boolean; error?: string; httpStatus?: number }>;
	} | null>(null);
	const [scanStats, setScanStats] = useState<{
		subscriptionsFound: number;
		messagesSearched: number;
		queriesUsed: Array<{ query: string; messagesFound: number; success: boolean }>;
	} | null>(null);

	// Load connected inboxes
	useEffect(() => {
		const connections = getEmailConnections().filter(c => c.connected);
		setConnectedInboxes(
			connections.map(c => ({
				email: c.email,
				provider: c.provider as 'gmail' | 'outlook',
			}))
		);
	}, []);

	// Real scanning progress using Gmail API
	useEffect(() => {
		// Check if we have a token (required for scanning)
		const hasToken = localStorage.getItem('google_access_token');
		if (!hasToken) {
			// No token → go back to email scan
			navigate('/onboarding/email-scan');
			return;
		}

		// Ensure scan is marked as started
		const state = getOnboardingState();
		if (state.scanStatus === 'not_started') {
			markScanStarted();
		}

		// Start actual Gmail scan (will use token from localStorage even if no connection record)
		const performScan = async () => {
			let progress = 0;
			const progressInterval = setInterval(() => {
				progress = Math.min(progress + 2, 95); // Cap at 95% until scan completes
				setProgress(progress);
			}, 200);

			try {
				// Scan Gmail for subscriptions (uses token from localStorage)
				const scanResult = await scanGmailForSubscriptions((stage) => {
					setProgressStage(stage);
				});

				clearInterval(progressInterval);
				setProgress(100);

				if (!scanResult.success) {
					console.error('Gmail scan failed:', scanResult.error);
					// Show error details
					setScanError({
						message: scanResult.error || 'Scan failed',
						httpStatus: scanResult.errorDetails?.status,
						response: scanResult.errorDetails?.response,
						likelyCause: scanResult.errorDetails?.likelyCause,
						messagesSearched: scanResult.messagesSearched,
						queriesUsed: scanResult.queriesUsed,
					});
					// Don't navigate away - let user see error
					return;
				}

				// Show stats if 0 subscriptions found
				if (scanResult.subscriptionsFound === 0) {
					setScanStats({
						subscriptionsFound: 0,
						messagesSearched: scanResult.messagesSearched || 0,
						queriesUsed: (scanResult.queriesUsed || []).filter(q => q.success),
					});
				}

				markScanComplete();

				// Small delay to show 100% and stats/error if any
				setTimeout(() => {
					// After successful scan → route to /app/subscriptions (skip extension for now)
					navigate('/app/subscriptions');
				}, scanResult.subscriptionsFound === 0 ? 3000 : 500); // Show stats for 3 seconds if 0 found
			} catch (error) {
				clearInterval(progressInterval);
				console.error('Error during scan:', error);
				setScanError({
					message: error instanceof Error ? error.message : 'Unexpected error occurred',
					likelyCause: 'Unexpected error occurred during scan. Please try again.',
				});
				// Don't navigate away - let user see error
			}
		};

		performScan();
	}, [navigate]);

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
						{/* Progress stage text */}
						<div className="w-full flex gap-1 items-center p-4">
							{/* Corner icon */}
							<CornerDownRight className="w-3 h-3 shrink-0 text-text-secondary" />
							<span className="flex-1 font-normal text-base leading-normal text-text-primary tracking-tight">
								{progressStage}
							</span>
						</div>

						{/* Progress Bar */}
						<ProgressBar
							progress={progress}
							label={`${Math.round(progress)}%`}
						/>
					</div>

					{/* Error Display */}
					{scanError && (
						<div className="w-full p-4 bg-danger-500/10 border border-danger-500 rounded-lg flex flex-col gap-3">
							<div className="flex items-start gap-2">
								<AlertTriangle className="w-5 h-5 text-text-danger shrink-0 mt-0.5" />
								<div className="flex-1 flex flex-col gap-2">
									<p className="font-medium text-base leading-normal text-text-danger">
										Scan Failed
									</p>
									{scanError.likelyCause && (
										<p className="font-normal text-sm leading-normal text-text-secondary">
											{scanError.likelyCause}
										</p>
									)}
									{scanError.httpStatus && (
										<p className="font-normal text-xs leading-normal text-text-secondary">
											HTTP Status: {scanError.httpStatus}
										</p>
									)}
									{scanError.response && (
										<details className="mt-2">
											<summary className="cursor-pointer text-xs text-text-secondary hover:text-text-primary">
												View error details
											</summary>
											<pre className="mt-2 p-2 bg-neutral-800 rounded text-xs text-text-secondary overflow-auto max-h-48">
												{JSON.stringify(scanError.response, null, 2)}
											</pre>
										</details>
									)}
									{scanError.messagesSearched !== undefined && (
										<p className="font-normal text-xs leading-normal text-text-secondary mt-2">
											Messages searched: {scanError.messagesSearched}
										</p>
									)}
									{scanError.queriesUsed && scanError.queriesUsed.length > 0 && (
										<div className="mt-2 flex flex-col gap-1">
											<p className="font-normal text-xs leading-normal text-text-secondary">
												Queries used:
											</p>
											{scanError.queriesUsed.map((q, idx) => (
												<div key={idx} className="text-xs text-text-secondary pl-2">
													- {q.query}: {q.messagesFound} messages ({q.success ? 'success' : 'failed'})
													{q.error && (
														<span className="text-text-danger"> - {q.error}</span>
													)}
												</div>
											))}
										</div>
									)}
								</div>
							</div>
						</div>
					)}

					{/* Stats Display (when 0 subscriptions found) */}
					{scanStats && scanStats.subscriptionsFound === 0 && !scanError && (
						<div className="w-full p-4 bg-neutral-800 border border-neutral-700 rounded-lg flex flex-col gap-2">
							<p className="font-medium text-sm leading-normal text-text-primary">
								Scan completed: No subscriptions found
							</p>
							<p className="font-normal text-xs leading-normal text-text-secondary">
								Messages searched: {scanStats.messagesSearched}
							</p>
							{scanStats.queriesUsed.length > 0 && (
								<div className="flex flex-col gap-1 mt-1">
									<p className="font-normal text-xs leading-normal text-text-secondary">
										Queries used:
									</p>
									{scanStats.queriesUsed.map((q, idx) => (
										<div key={idx} className="text-xs text-text-secondary pl-2">
											- {q.query}: {q.messagesFound} messages
										</div>
									))}
								</div>
							)}
						</div>
					)}

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
