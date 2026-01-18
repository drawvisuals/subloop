import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/Layout';
import { Toggle } from '@/components/Onboarding/Toggle';
import { Button } from '@/components/Auth';
import { ScanText, AlertTriangle, CheckCircle2, Globe } from 'lucide-react';
import { getOnboardingState, updateOnboardingState, markScanStarted } from '@/services/onboarding';
import { getCurrentUser } from '@/services/auth';
import { getEmailConnections, toggleEmailConnection } from '@/services/emailConnectionsStorage';
import { scanGmailForSubscriptions, fetchCandidateSubscriptionEmails, fetchMessageDetails } from '@/services/gmailApi';
import type { EmailConnectionData } from '@/services/emailConnectionsStorage';

export default function Settings() {
	const navigate = useNavigate();
	const onboardingState = getOnboardingState();
	const [connectedInboxes, setConnectedInboxes] = useState<EmailConnectionData[]>([]);
	const [browserExtensionConnected, setBrowserExtensionConnected] = useState(
		onboardingState.browserExtensionStatus === 'connected'
	);
	const [disconnectingInbox, setDisconnectingInbox] = useState<string | null>(null);
	const [isScanning, setIsScanning] = useState(false);
	const [testGmailResult, setTestGmailResult] = useState<{
		success: boolean;
		data?: { emailAddress: string; messagesTotal: number };
		error?: string;
	} | null>(null);
	const [isTestingGmail, setIsTestingGmail] = useState(false);
	const [candidateEmailsResult, setCandidateEmailsResult] = useState<{
		success: boolean;
		count?: number;
		messageIds?: string[];
		error?: string;
	} | null>(null);
	const [isFetchingCandidates, setIsFetchingCandidates] = useState(false);
	const [messageDetails, setMessageDetails] = useState<Array<{
		id: string;
		fromEmail?: string;
		fromDomain?: string;
		subject?: string;
		date?: string;
		snippet?: string;
	}>>([]);
	const [isLoadingDetails, setIsLoadingDetails] = useState(false);

	// Load connected inboxes from storage
	useEffect(() => {
		loadEmailConnections();
	}, []);

	const loadEmailConnections = () => {
		const connections = getEmailConnections();
		setConnectedInboxes(connections);

		// Update onboarding state count
		const connectedCount = connections.filter(c => c.connected).length;
		if (connectedCount !== onboardingState.emailConnectedCount) {
			updateOnboardingState({ emailConnectedCount: connectedCount });
		}
	};

	const handleRescan = async () => {
		setIsScanning(true);
		markScanStarted();

		try {
			// Scan Gmail if connected
			const gmailConnection = connectedInboxes.find(i => i.connected && i.provider === 'gmail');
			if (gmailConnection) {
				const scanResult = await scanGmailForSubscriptions();
				if (!scanResult.success) {
					console.error('Gmail scan failed:', scanResult.error);
				}
			}

			// Reload connections to get updated scan times
			loadEmailConnections();

			// Navigate to scanning page to show progress
			navigate('/onboarding/scanning');
		} catch (error) {
			console.error('Error during scan:', error);
		} finally {
			setIsScanning(false);
		}
	};

	const handleToggleInbox = (connectionId: string, checked: boolean) => {
		const connection = connectedInboxes.find(c => c.id === connectionId);
		if (!connection) return;

		if (!checked) {
			// Show disconnect warning when turning off
			setDisconnectingInbox(connection.email);
		} else {
			// Reconnect inbox
			const updated = toggleEmailConnection(connectionId, true);
			if (updated) {
				loadEmailConnections();
			}
		}
	};

	const handleConfirmDisconnect = () => {
		if (disconnectingInbox) {
			const connection = connectedInboxes.find(c => c.email === disconnectingInbox);
			if (connection) {
				toggleEmailConnection(connection.id, false);
				loadEmailConnections();
			}
			setDisconnectingInbox(null);
		}
	};

	const handleConnectExtension = () => {
		// Navigate to browser extension onboarding
		navigate('/onboarding/browser-extension');
	};

	const handleTestGmailApi = async () => {
		setIsTestingGmail(true);
		setTestGmailResult(null);

		try {
			// Get access token from localStorage
			const accessToken = localStorage.getItem('google_access_token');

			if (!accessToken) {
				setTestGmailResult({
					success: false,
					error: JSON.stringify({ error: 'No access token found. Please login with Google first.' }, null, 2),
				});
				setIsTestingGmail(false);
				return;
			}

			// Call Gmail API profile endpoint
			const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${accessToken}`,
					'Content-Type': 'application/json',
				},
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
				setTestGmailResult({
					success: false,
					error: JSON.stringify(errorData, null, 2),
				});
				setIsTestingGmail(false);
				return;
			}

			const data = await response.json();

			setTestGmailResult({
				success: true,
				data: {
					emailAddress: data.emailAddress || 'N/A',
					messagesTotal: data.messagesTotal || 0,
				},
			});
		} catch (error) {
			setTestGmailResult({
				success: false,
				error: JSON.stringify(
					error instanceof Error ? { error: error.message, stack: error.stack } : error,
					null,
					2
				),
			});
		} finally {
			setIsTestingGmail(false);
		}
	};

	const handleFetchCandidateEmails = async () => {
		setIsFetchingCandidates(true);
		setCandidateEmailsResult(null);

		try {
			// Get access token from localStorage
			const accessToken = localStorage.getItem('google_access_token');

			if (!accessToken) {
				setCandidateEmailsResult({
					success: false,
					error: 'No access token found. Please login with Google first.',
				});
				setIsFetchingCandidates(false);
				return;
			}

			// Fetch candidate subscription emails
			const result = await fetchCandidateSubscriptionEmails(accessToken, 200);

			if (!result.success) {
				setCandidateEmailsResult({
					success: false,
					error: result.error || 'Failed to fetch candidate emails',
				});
				setMessageDetails([]);
				setIsFetchingCandidates(false);
				return;
			}

			setCandidateEmailsResult({
				success: true,
				count: result.count || 0,
				messageIds: result.messageIds || [],
			});

			// Automatically fetch message details for first 10 if we have message IDs
			if (result.messageIds && result.messageIds.length > 0) {
				setIsLoadingDetails(true);
				try {
					const detailsResult = await fetchMessageDetails(accessToken, result.messageIds, 10);
					if (detailsResult.success && detailsResult.messages) {
						setMessageDetails(detailsResult.messages);
					}
				} catch (error) {
					console.error('Error loading message details:', error);
				} finally {
					setIsLoadingDetails(false);
				}
			}
		} catch (error) {
			setCandidateEmailsResult({
				success: false,
				error: error instanceof Error ? error.message : 'An unexpected error occurred',
			});
		} finally {
			setIsFetchingCandidates(false);
		}
	};

	const formatDate = (date: Date): string => {
		return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
	};

	const getLastScannedText = (date: Date): string => {
		return formatDate(date);
	};

	return (
		<AppLayout>
			<div className="pt-6 sm:pt-8 md:pt-12 pb-6 sm:pb-8 flex justify-center">
				<div className="w-full max-w-[438px] flex flex-col gap-6 sm:gap-8">
					{/* Email Scanning Section */}
					<div className="w-full flex flex-col gap-6">
						{/* Title + Description */}
						<div className="w-full flex flex-col gap-2">
							<h2 className="font-semibold text-xl leading-7 text-text-primary tracking-tight">
								Email scanning
							</h2>
							<p className="font-normal text-base leading-normal text-text-secondary tracking-tight">
								Connected email accounts are scanned for billing and subscription emails to keep your list up to date.
							</p>
						</div>

						{/* Connected Inboxes */}
						<div className="w-full flex flex-col gap-4">
							{connectedInboxes.length === 0 ? (
								<div className="w-full p-4 bg-neutral-900 border border-neutral-700 rounded-lg">
									<p className="font-normal text-base leading-normal text-text-secondary">
										No email accounts connected. Connect your email to start scanning for subscriptions.
									</p>
								</div>
							) : (
								connectedInboxes.map((inbox) => {
									const isDisconnecting = disconnectingInbox === inbox.email;
									const isConnected = inbox.connected;

									return (
										<div key={inbox.id} className="w-full flex flex-col gap-4">
											{/* Inbox Row with Toggle */}
											<div className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-5 flex items-center justify-between">
												<div className="flex items-center gap-3">
													{/* Provider icon placeholder */}
													<div className="w-5 h-5 shrink-0 bg-neutral-500 rounded" />
													<span className="font-normal text-base leading-normal text-text-primary tracking-tight">
														{inbox.email}
													</span>
												</div>

												<div className="flex items-center gap-3">
													{/* Status indicator */}
													<div className="flex items-center gap-2">
														<div
															className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-success-500' : 'bg-neutral-700'
																}`}
														/>
														<span className={`font-light text-sm leading-5 tracking-tight ${isConnected ? 'text-text-success' : 'text-text-secondary'
															}`}>
															{isConnected ? 'Connected' : 'Disconnected'}
														</span>
													</div>
													{/* Toggle */}
													<Toggle
														checked={isConnected}
														onChange={(checked) => handleToggleInbox(inbox.id, checked)}
													/>
												</div>
											</div>

											{/* Last Scanned */}
											{inbox.lastScannedAt && (
												<div className="px-4">
													<span className="font-normal text-sm leading-5 text-text-secondary tracking-tight">
														Last scanned: {getLastScannedText(new Date(inbox.lastScannedAt))}
													</span>
												</div>
											)}
											{!inbox.lastScannedAt && (
												<div className="px-4">
													<span className="font-normal text-sm leading-5 text-text-secondary tracking-tight">
														Never scanned
													</span>
												</div>
											)}

											{/* Disconnect Warning */}
											{isDisconnecting && (
												<div className="px-4 py-3 bg-warning-500/10 border border-warning-500 rounded-lg flex flex-col sm:flex-row gap-3">
													<div className="flex gap-3 flex-1">
														<AlertTriangle className="w-4 h-4 text-text-secondary shrink-0 mt-0.5" />
														<p className="font-normal text-base leading-normal text-text-secondary tracking-tight">
															We'll stop scanning this inbox. Your subscriptions won't change.
														</p>
													</div>
													<div className="flex gap-2 sm:ml-auto">
														<button
															type="button"
															onClick={() => setDisconnectingInbox(null)}
															className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
														>
															Cancel
														</button>
														<button
															type="button"
															onClick={handleConfirmDisconnect}
															className="px-4 py-2 text-sm font-medium text-text-inverse bg-neutral-200 rounded-lg hover:bg-neutral-300 transition-colors"
														>
															Disconnect
														</button>
													</div>
												</div>
											)}
										</div>
									);
								})
							)}
						</div>

						{/* Rescan Button */}
						<button
							type="button"
							onClick={handleRescan}
							disabled={isScanning || connectedInboxes.filter(i => i.connected).length === 0}
							className="w-full min-h-[44px] sm:h-[52px] px-4 py-2.5 bg-brand-primary-500 border border-neutral-700 rounded-lg flex items-center justify-center gap-2 font-medium text-sm sm:text-base leading-5 sm:leading-normal text-neutral-800 hover:bg-brand-primary-400 transition-colors active:opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<span>{isScanning ? 'Scanning...' : 'Rescan'}</span>
							<ScanText className="w-4 h-4 text-neutral-800" />
						</button>

						{/* Test Gmail API Button - only show if Gmail is connected */}
						{connectedInboxes.some(i => i.connected && i.provider === 'gmail') && (
							<div className="w-full flex flex-col gap-4">
								<button
									type="button"
									onClick={handleTestGmailApi}
									disabled={isTestingGmail}
									className="w-full min-h-[44px] sm:h-[52px] px-4 py-2.5 bg-neutral-700 border border-neutral-600 rounded-lg flex items-center justify-center gap-2 font-medium text-sm sm:text-base leading-5 sm:leading-normal text-text-primary hover:bg-neutral-600 transition-colors active:opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									<span>{isTestingGmail ? 'Testing...' : 'Test Gmail access'}</span>
								</button>

								{/* Test Results */}
								{testGmailResult && (
									<div className={`w-full p-4 rounded-lg border ${testGmailResult.success
										? 'bg-success-500/10 border-success-500'
										: 'bg-danger-500/10 border-danger-500'
										}`}>
										{testGmailResult.success && testGmailResult.data ? (
											<div className="flex flex-col gap-2">
												<p className="font-medium text-base leading-normal text-text-primary">
													Gmail API Test Successful
												</p>
												<div className="flex flex-col gap-1 text-sm">
													<p className="text-text-secondary">
														<span className="font-medium">Email:</span> {testGmailResult.data.emailAddress}
													</p>
													<p className="text-text-secondary">
														<span className="font-medium">Total Messages:</span> {testGmailResult.data.messagesTotal.toLocaleString()}
													</p>
												</div>
											</div>
										) : (
											<div className="flex flex-col gap-2">
												<p className="font-medium text-base leading-normal text-text-danger">
													Gmail API Test Failed
												</p>
												<pre className="text-xs text-text-danger bg-neutral-900 p-3 rounded overflow-auto max-h-64">
													{testGmailResult.error}
												</pre>
											</div>
										)}
									</div>
								)}

								{/* Fetch Candidate Emails Button */}
								<button
									type="button"
									onClick={handleFetchCandidateEmails}
									disabled={isFetchingCandidates}
									className="w-full min-h-[44px] sm:h-[52px] px-4 py-2.5 bg-neutral-700 border border-neutral-600 rounded-lg flex items-center justify-center gap-2 font-medium text-sm sm:text-base leading-5 sm:leading-normal text-text-primary hover:bg-neutral-600 transition-colors active:opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									<span>{isFetchingCandidates ? 'Fetching...' : 'Find candidate emails'}</span>
								</button>

								{/* Candidate Emails Results */}
								{candidateEmailsResult && (
									<div className={`w-full p-4 rounded-lg border ${candidateEmailsResult.success
										? 'bg-success-500/10 border-success-500'
										: 'bg-danger-500/10 border-danger-500'
										}`}>
										{candidateEmailsResult.success ? (
											<div className="flex flex-col gap-4">
												<div className="flex flex-col gap-2">
													<p className="font-medium text-base leading-normal text-text-primary">
														Found {candidateEmailsResult.count?.toLocaleString() || 0} candidate emails
													</p>
													<p className="text-sm text-text-secondary">
														These emails match subscription-related keywords (receipt, invoice, renewal, trial, payment) from the last 365 days.
													</p>
												</div>

												{/* Loading message details */}
												{isLoadingDetails && (
													<p className="text-sm text-text-secondary">Loading message details...</p>
												)}

												{/* Message Details List - First 10 */}
												{messageDetails.length > 0 && (
													<div className="flex flex-col gap-3 mt-2">
														<p className="font-medium text-sm leading-normal text-text-primary">
															First 10 messages:
														</p>
														<div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
															{messageDetails.map((msg) => (
																<div
																	key={msg.id}
																	className="p-3 bg-neutral-800 border border-neutral-700 rounded-lg flex flex-col gap-1"
																>
																	<div className="flex items-start justify-between gap-2">
																		<div className="flex-1 min-w-0">
																			<p className="font-medium text-sm text-text-primary truncate">
																				{msg.fromDomain || msg.fromEmail || 'Unknown sender'}
																			</p>
																			<p className="text-sm text-text-secondary line-clamp-2 mt-1">
																				{msg.subject || '(No subject)'}
																			</p>
																		</div>
																		{msg.date && (
																			<span className="text-xs text-text-secondary whitespace-nowrap shrink-0">
																				{new Date(msg.date).toLocaleDateString('en-US', {
																					month: 'short',
																					day: 'numeric',
																					year: 'numeric',
																				})}
																			</span>
																		)}
																	</div>
																	{msg.snippet && (
																		<p className="text-xs text-text-secondary line-clamp-1 mt-1">
																			{msg.snippet}
																		</p>
																	)}
																</div>
															))}
														</div>
													</div>
												)}
											</div>
										) : (
											<div className="flex flex-col gap-2">
												<p className="font-medium text-base leading-normal text-text-danger">
													Failed to fetch candidate emails
												</p>
												<p className="text-sm text-text-danger">
													{candidateEmailsResult.error}
												</p>
											</div>
										)}
									</div>
								)}
							</div>
						)}
					</div>

					{/* Browser Extension Section */}
					<div className="w-full flex flex-col gap-6 pt-6 border-t border-neutral-700">
						<div className="flex items-center gap-3">
							<Globe className="w-6 h-6 text-text-primary shrink-0" />
							<h2 className="font-semibold text-xl leading-7 text-text-primary tracking-tight">
								Browser extension
							</h2>
						</div>

						{browserExtensionConnected ? (
							<div className="w-full flex flex-col gap-3">
								<div className="w-full p-4 bg-neutral-900 border border-neutral-700 rounded-lg flex items-center gap-3">
									<CheckCircle2 className="w-5 h-5 text-text-success shrink-0" />
									<div className="flex-1">
										<p className="font-medium text-base leading-normal text-text-primary">
											Chrome extension connected
										</p>
										<p className="font-normal text-sm leading-5 text-text-secondary mt-1">
											New subscriptions will be detected automatically
										</p>
									</div>
								</div>
							</div>
						) : (
							<div className="w-full flex flex-col gap-4">
								<div className="w-full p-4 bg-neutral-900 border border-neutral-700 rounded-lg">
									<p className="font-normal text-base leading-normal text-text-primary">
										Connect the browser extension to automatically detect new subscriptions when you sign up online.
									</p>
								</div>
								<Button
									onClick={handleConnectExtension}
									className="w-auto"
									showArrow
								>
									Add Chrome extension
								</Button>
							</div>
						)}
					</div>
				</div>
			</div>
		</AppLayout>
	);
}
