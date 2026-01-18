import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { GoogleButton, Input, Divider, Button } from '@/components/Auth';
import { Logo } from '@/components/Layout';
import { mockSignup } from '@/services/auth';
import { getPostAuthRedirect, markEmailConnected, markScanStarted } from '@/services/onboarding';
import { handleGoogleAuthError } from '@/services/googleOAuthHelpers';
import { setAuthProvider } from '@/services/auth';

/**
 * Create Account page
 * Matches Figma design exactly with proper spacing, typography, and colors
 */
export default function SignUp() {
	const navigate = useNavigate();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isGoogleLoading, setIsGoogleLoading] = useState(false);

	const validateEmail = (value: string): string | undefined => {
		if (!value) {
			return 'Email address is required';
		}
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(value)) {
			return 'Please enter a valid email address';
		}
		return undefined;
	};

	const validatePassword = (value: string): string | undefined => {
		if (!value) {
			return 'Password is required';
		}
		if (value.length < 8) {
			return 'Password must be at least 8 characters';
		}
		return undefined;
	};

	// TOKEN FLOW (not code flow) - gets access token directly in popup
	const googleLogin = useGoogleLogin({
		onSuccess: async (tokenResponse) => {
			setIsGoogleLoading(true);
			setErrors({});

			try {
				// tokenResponse contains access_token directly (token flow)
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

				// Store token info (in production, this would go to backend)
				const { createEmailConnection } = await import('@/services/emailConnectionsStorage');
				createEmailConnection(
					'gmail',
					email,
					tokenResponse.access_token,
					null, // No refresh token in token flow (would need code flow for that)
					new Date(Date.now() + (tokenResponse.expires_in || 3600) * 1000).toISOString()
				);

				markEmailConnected(1);
				markScanStarted();
				navigate('/onboarding/scanning');
			} catch (error) {
				console.error('OAuth success handler error:', error);
				setErrors({
					general: error instanceof Error ? error.message : 'Failed to process authentication',
				});
				setIsGoogleLoading(false);
			}
		},
		onError: (error) => {
			setIsGoogleLoading(false);
			const errorMsg = handleGoogleAuthError(error);

			// Check for specific errors with detailed instructions
			let displayError = errorMsg;
			if (errorMsg === 'ACCESS_DENIED_TEST_USER' || errorMsg.includes('access_denied') || errorMsg.includes('not completed the Google verification')) {
				displayError = `Access Blocked: Test User Not Added

Your app is in "Testing" mode. Add your email as a test user:

1. Go to: https://console.cloud.google.com/apis/credentials/consent
2. Scroll to "Test users" section
3. Click "ADD USERS"
4. Add your email: JGuimaraes000@gmail.com (or the email you're signing in with)
5. Click "ADD"
6. Wait 1-2 minutes for changes to propagate
7. Try again

Make sure:
- You're signing in with the SAME email added as test user
- You're in the CORRECT Google Cloud project
- Changes have been saved`;
			} else if (errorMsg.includes('invalid_client') || errorMsg.includes('401')) {
				displayError = `Invalid Google OAuth Client ID.

Please verify in Google Cloud Console:
1. OAuth Client Type is "Web application"
2. Authorized JavaScript origins includes: ${window.location.origin}
3. Authorized redirect URIs includes: ${window.location.origin}
4. Client ID matches exactly (check for typos, wrong project, deleted client)

Console: https://console.cloud.google.com/apis/credentials
Debug panel shows exact values being used.`;
			}

			setErrors({
				general: displayError,
			});
		},
		// TOKEN FLOW - no redirect, gets token directly
		scope: 'openid email profile https://www.googleapis.com/auth/gmail.readonly',
	});

	const handleGoogleAuth = () => {
		setIsGoogleLoading(true);
		setErrors({});

		// Set a timeout to reset loading state if popup is closed or errors occur
		const timeoutId = setTimeout(() => {
			setIsGoogleLoading(false);
		}, 30000); // 30 second timeout

		// Listen for window focus (popup closed)
		const handleFocus = () => {
			clearTimeout(timeoutId);
			setIsGoogleLoading(false);
			window.removeEventListener('focus', handleFocus);
		};
		window.addEventListener('focus', handleFocus);

		googleLogin();
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const emailError = validateEmail(email);
		const passwordError = validatePassword(password);

		if (emailError || passwordError) {
			setErrors({
				email: emailError,
				password: passwordError,
			});
			return;
		}

		setErrors({});
		setIsSubmitting(true);

		try {
			const result = await mockSignup(email, password);

			if (result.success) {
				// Set auth provider to email
				if (typeof window !== 'undefined') {
					sessionStorage.setItem('subloop_auth_provider', 'email');
				}
				// Redirect based on onboarding state
				setIsSubmitting(false);
				const redirectPath = getPostAuthRedirect();
				navigate(redirectPath);
			} else {
				setErrors({ general: result.error || 'Failed to create account' });
				setIsSubmitting(false);
			}
		} catch (error) {
			setErrors({ general: 'An error occurred. Please try again.' });
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen bg-neutral-800 flex flex-col items-center px-10 py-20">
			{/* Logo - top aligned with 32px padding */}
			<div className="w-full flex justify-center pt-8 mb-auto">
				<Link to="/" className="flex items-center justify-center">
					<Logo className="h-9 w-auto" showText={true} />
				</Link>
			</div>

			{/* Container matching Figma: 438px width, centered */}
			<div className="w-full max-w-[438px] flex flex-col gap-8 items-center">
				{/* Title */}
				<h1 className="font-semibold h-[39px] leading-9 text-[30px] text-center text-text-primary tracking-tight whitespace-pre-wrap w-full">
					Create your account
				</h1>

				{/* Primary: Google OAuth Button (Gmail signup) */}
				<GoogleButton onClick={handleGoogleAuth} disabled={isGoogleLoading || isSubmitting}>
					{isGoogleLoading ? 'Connecting...' : 'Sign up with Gmail'}
				</GoogleButton>

				{/* Divider */}
				<Divider />

				{/* Form */}
				<form
					onSubmit={handleSubmit}
					className="w-full flex flex-col gap-6 items-start"
				>
					{/* Email Input */}
					<Input
						label="Email address"
						type="email"
						placeholder="Enter your email address"
						value={email}
						onChange={(e) => {
							setEmail(e.target.value);
							if (errors.email) {
								setErrors({ ...errors, email: undefined });
							}
						}}
						error={errors.email}
					/>

					{/* Password Input */}
					<Input
						label="Password"
						type="password"
						placeholder="Enter your password"
						value={password}
						onChange={(e) => {
							setPassword(e.target.value);
							if (errors.password) {
								setErrors({ ...errors, password: undefined });
							}
						}}
						showPasswordToggle
						error={errors.password}
					/>

					{/* General Error Message */}
					{errors.general && (
						<div className="w-full p-4 bg-danger-500/10 border border-danger-500 rounded-lg" role="alert" aria-live="polite">
							<p className="text-sm text-text-danger leading-normal">
								{errors.general}
							</p>
						</div>
					)}

					{/* Submit Button */}
					<div className="w-full flex flex-col gap-8 items-center">
						<Button
							type="submit"
							showArrow
							disabled={isSubmitting}
						>
							Create account
						</Button>

						{/* Link to Login */}
						<div className="flex items-center">
							<p className="font-normal leading-normal text-base text-text-primary tracking-tight">
								Already have an account?{' '}
								<Link
									to="/auth/login"
									className="text-text-brand hover:text-brand-primary-400 transition-colors"
								>
									Login
								</Link>
							</p>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
