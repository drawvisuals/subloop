import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { ScanText } from 'lucide-react';
import { EmailProviderRow } from '@/components/Onboarding';
import { Button } from '@/components/Auth';
import { markEmailConnected, markScanStarted } from '@/services/onboarding';
import { connectOutlook } from '@/services/oauth';
import { getEmailConnectionByProvider } from '@/services/emailConnectionsStorage';
import { getAuthProvider } from '@/services/auth';
import { handleGoogleAuthError } from '@/services/googleOAuthHelpers';
import { setAuthProvider } from '@/services/auth';

/**
 * Connect and scan emails page
 * Matches Figma design exactly with proper spacing, typography, and colors
 */
export default function EmailScan() {
	const navigate = useNavigate();
	const [gmailEnabled, setGmailEnabled] = useState(false);
	const [outlookEnabled, setOutlookEnabled] = useState(false);
	const [isConnecting, setIsConnecting] = useState<string | null>(null);
	const [connectionErrors, setConnectionErrors] = useState<{ gmail?: string; outlook?: string }>({});

	// TOKEN FLOW - gets access token directly in popup
	const googleLogin = useGoogleLogin({
		onSuccess: async (tokenResponse) => {
			try {
				console.log('Google OAuth token received:', { access_token: tokenResponse.access_token?.substring(0, 20) + '...' });

				// Store access token in localStorage
				if (tokenResponse.access_token) {
					localStorage.setItem('google_access_token', tokenResponse.access_token);
					// Store expiration timestamp (current time + expires_in seconds)
					if (tokenResponse.expires_in) {
						const expiresAt = Date.now() + (tokenResponse.expires_in * 1000);
						localStorage.setItem('google_access_token_expires_at', expiresAt.toString());
					}
				}

				// Get user info using the access token
				const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
					headers: {
						Authorization: `Bearer ${tokenResponse.access_token}`,
					},
				});

				if (!userInfoResponse.ok) {
					throw new Error('Failed to get user info from Google');
				}

				const userInfo = await userInfoResponse.json();
				const email = userInfo.email;

				if (!email) {
					throw new Error('Email not found in Google user info');
				}

				sessionStorage.setItem('subloop_current_user', email);
				setAuthProvider('google');

				const { createEmailConnection } = await import('@/services/emailConnectionsStorage');
				createEmailConnection(
					'gmail',
					email,
					tokenResponse.access_token,
					null, // No refresh token in token flow
					new Date(Date.now() + (tokenResponse.expires_in || 3600) * 1000).toISOString()
				);

				setGmailEnabled(true);
				setIsConnecting(null);
				markEmailConnected(1);
				markScanStarted();
				navigate('/onboarding/scanning');
			} catch (error) {
				console.error('OAuth error:', error);
				setConnectionErrors(prev => ({
					...prev,
					gmail: error instanceof Error ? error.message : 'Failed to connect Gmail',
				}));
				setIsConnecting(null);
			}
		},
		onError: (error) => {
			const errorMsg = handleGoogleAuthError(error);
			let displayMsg = errorMsg;

			if (errorMsg.includes('invalid_client') || errorMsg.includes('401')) {
				displayMsg = `Invalid Client ID. Verify in Google Cloud Console:
- Authorized JavaScript origins: ${window.location.origin}
- Authorized redirect URIs: ${window.location.origin}
- Client ID matches exactly`;
			}

			setConnectionErrors(prev => ({
				...prev,
				gmail: displayMsg,
			}));
			setIsConnecting(null);
		},
		// TOKEN FLOW - no redirect, gets token directly
		scope: 'openid email profile https://www.googleapis.com/auth/gmail.readonly',
	});

	// Check if connections already exist on mount
	useEffect(() => {
		const gmailConn = getEmailConnectionByProvider('gmail');
		const outlookConn = getEmailConnectionByProvider('outlook');

		setGmailEnabled(!!gmailConn);
		setOutlookEnabled(!!outlookConn);

		// Auto-connect if user logged in with Google/Microsoft
		const authProvider = getAuthProvider();
		if (authProvider === 'google' && !gmailConn) {
			handleProviderToggle('gmail', true);
		} else if (authProvider === 'microsoft' && !outlookConn) {
			handleProviderToggle('outlook', true);
		}
	}, []);

	const handleProviderToggle = async (provider: 'gmail' | 'outlook', checked: boolean) => {
		if (!checked) {
			// Disconnect (just uncheck locally, actual disconnect handled in Settings)
			if (provider === 'gmail') {
				setGmailEnabled(false);
			} else {
				setOutlookEnabled(false);
			}
			return;
		}

		// Gmail uses Google OAuth hook
		if (provider === 'gmail') {
			setIsConnecting('gmail');
			setConnectionErrors(prev => ({ ...prev, gmail: undefined }));
			googleLogin(); // Call the hook's function
			return;
		}

		// Outlook connection (mock for now)
		setIsConnecting(provider);
		setConnectionErrors(prev => ({ ...prev, [provider]: undefined }));

		try {
			const result = await connectOutlook();

			if (result.success) {
				setOutlookEnabled(true);
			} else {
				setConnectionErrors(prev => ({
					...prev,
					[provider]: result.error || 'Failed to connect',
				}));
			}
		} catch (error) {
			setConnectionErrors(prev => ({
				...prev,
				[provider]: 'An error occurred. Please try again.',
			}));
		} finally {
			setIsConnecting(null);
		}
	};

	const handleScanEmails = () => {
		// Update onboarding state based on actual connections
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
					<div className="w-full flex flex-col gap-2">
						<EmailProviderRow
							provider="gmail"
							checked={gmailEnabled}
							onChange={(checked) => handleProviderToggle('gmail', checked)}
							disabled={isConnecting === 'gmail'}
						/>
						{connectionErrors.gmail && (
							<p className="text-xs text-text-danger ml-6">{connectionErrors.gmail}</p>
						)}
						{isConnecting === 'gmail' && (
							<p className="text-xs text-text-secondary ml-6">Connecting...</p>
						)}
					</div>

					<div className="w-full flex flex-col gap-2">
						<EmailProviderRow
							provider="outlook"
							checked={outlookEnabled}
							onChange={(checked) => handleProviderToggle('outlook', checked)}
							disabled={isConnecting === 'outlook'}
						/>
						{connectionErrors.outlook && (
							<p className="text-xs text-text-danger ml-6">{connectionErrors.outlook}</p>
						)}
						{isConnecting === 'outlook' && (
							<p className="text-xs text-text-secondary ml-6">Connecting...</p>
						)}
					</div>

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
