/**
 * Google OAuth service for Gmail authorization
 * Handles OAuth flow, token management, and Gmail API integration
 */

import { createEmailConnection, updateEmailConnection, getEmailConnectionByProvider } from './emailConnectionsStorage';
import { getCurrentUser, setAuthProvider } from './auth';

// Google OAuth Configuration
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const GOOGLE_REDIRECT_URI = `${window.location.origin}/auth/google/callback`;

// Required OAuth scopes
export const GOOGLE_OAUTH_SCOPES = [
	'openid',
	'email',
	'profile',
	'https://www.googleapis.com/auth/gmail.readonly'
].join(' ');

// OAuth state for CSRF protection
const OAUTH_STATE_KEY = 'subloop_google_oauth_state';

/**
 * DEPRECATED: Redirect-based OAuth flow
 * This function is NO LONGER USED - we use @react-oauth/google token flow instead
 * Keeping for reference only - will be removed in future cleanup
 *
 * @deprecated Use useGoogleLogin() hook with token flow instead
 */
export function getGoogleAuthUrl(promptConsent: boolean = false): string {
	console.warn('getGoogleAuthUrl() is deprecated - using token flow via useGoogleLogin() hook');
	throw new Error(
		'Redirect-based OAuth is disabled. Use @react-oauth/google useGoogleLogin() hook with token flow instead.'
	);
}

/**
 * Handle OAuth callback
 * Exchanges authorization code for tokens
 */
export async function handleGoogleCallback(
	code: string,
	state: string
): Promise<{ success: boolean; email?: string; error?: string }> {
	try {
		// Verify state
		const storedState = sessionStorage.getItem(OAUTH_STATE_KEY);
		if (!storedState || storedState !== state) {
			return { success: false, error: 'Invalid OAuth state' };
		}
		sessionStorage.removeItem(OAUTH_STATE_KEY);

		// Exchange code for tokens
		// In production, this should be done on the backend for security
		// For now, we'll use a mock implementation that simulates the flow
		const tokenResponse = await exchangeCodeForTokens(code);

		if (!tokenResponse.success || !tokenResponse.tokens) {
			return { success: false, error: tokenResponse.error || 'Failed to get tokens' };
		}

		const { access_token, refresh_token, expires_in } = tokenResponse.tokens;

		// If no refresh token, this is a problem - user needs to reconnect with consent
		if (!refresh_token) {
			return {
				success: false,
				error: 'REFRESH_TOKEN_MISSING', // Special error code for UI handling
			};
		}

		// Get user info from Google (email, name, etc.)
		const userInfo = await getUserInfo(access_token);
		if (!userInfo.success || !userInfo.email) {
			return { success: false, error: 'Failed to get user information' };
		}

		const googleEmail = userInfo.email;

		// Set session with Google email
		if (typeof window !== 'undefined') {
			sessionStorage.setItem('subloop_current_user', googleEmail);
			setAuthProvider('google');
		}

		// Calculate token expiration
		const expiresAt = new Date(Date.now() + (expires_in * 1000)).toISOString();

		// Create or update email connection
		const connection = createEmailConnection(
			'gmail',
			googleEmail,
			access_token,
			refresh_token,
			expiresAt
		);

		return { success: true, email: googleEmail };
	} catch (error) {
		console.error('Error handling Google OAuth callback:', error);
		return { success: false, error: 'An error occurred during authentication' };
	}
}

/**
 * Exchange authorization code for access/refresh tokens
 * In production, this MUST be done on the backend for security
 */
async function exchangeCodeForTokens(code: string): Promise<{
	success: boolean;
	tokens?: { access_token: string; refresh_token?: string; expires_in: number };
	error?: string;
}> {
	// TODO: In production, call your backend API endpoint:
	// POST /api/oauth/google/exchange
	// Backend exchanges code securely using CLIENT_SECRET

	// For now, mock implementation:
	// In a real app, you'd call your backend which uses Google's token endpoint:
	// POST https://oauth2.googleapis.com/token
	// {
	//   code,
	//   client_id: GOOGLE_CLIENT_ID,
	//   client_secret: GOOGLE_CLIENT_SECRET, // NEVER expose in frontend
	//   redirect_uri: GOOGLE_REDIRECT_URI,
	//   grant_type: 'authorization_code'
	// }

	// Mock response for development
	await new Promise(resolve => setTimeout(resolve, 500));

	// Simulate successful token exchange
	return {
		success: true,
		tokens: {
			access_token: `mock_access_token_${Date.now()}`,
			refresh_token: `mock_refresh_token_${Date.now()}`,
			expires_in: 3600, // 1 hour
		},
	};
}

/**
 * Get user information from Google
 */
async function getUserInfo(accessToken: string): Promise<{
	success: boolean;
	email?: string;
	name?: string;
	picture?: string;
	error?: string;
}> {
	// In production, call Google's userinfo endpoint
	// For now, mock implementation

	try {
		// TODO: In production, use real Google API:
		// const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
		//   headers: {
		//     Authorization: `Bearer ${accessToken}`,
		//   },
		// });
		// const data = await response.json();
		// return { success: true, email: data.email, name: data.name, picture: data.picture };

		// Mock response
		await new Promise(resolve => setTimeout(resolve, 300));

		// Get email from current user or use a mock
		const currentUser = getCurrentUser();
		const mockEmail = currentUser || 'ze_casal@hotmail.com';

		return {
			success: true,
			email: mockEmail,
			name: 'User Name',
		};
	} catch (error) {
		console.error('Error getting user info:', error);
		return { success: false, error: 'Failed to get user information' };
	}
}

/**
 * Refresh access token using refresh token
 */
export async function refreshGoogleAccessToken(
	refreshToken: string
): Promise<{
	success: boolean;
	access_token?: string;
	expires_in?: number;
	error?: string;
}> {
	// TODO: In production, call your backend API endpoint:
	// POST /api/oauth/google/refresh
	// Backend refreshes token securely using CLIENT_SECRET

	// For now, mock implementation:
	// In a real app, your backend would call:
	// POST https://oauth2.googleapis.com/token
	// {
	//   refresh_token,
	//   client_id: GOOGLE_CLIENT_ID,
	//   client_secret: GOOGLE_CLIENT_SECRET,
	//   grant_type: 'refresh_token'
	// }

	try {
		await new Promise(resolve => setTimeout(resolve, 300));

		// Mock response
		return {
			success: true,
			access_token: `refreshed_access_token_${Date.now()}`,
			expires_in: 3600,
		};
	} catch (error) {
		console.error('Error refreshing token:', error);
		return { success: false, error: 'Failed to refresh token' };
	}
}

/**
 * Get valid access token for Gmail connection
 * Automatically refreshes if expired
 */
export async function getValidAccessToken(): Promise<string | null> {
	const connection = getEmailConnectionByProvider('gmail');
	if (!connection || !connection.connected) {
		return null;
	}

	// Check if token is expired or about to expire (within 5 minutes)
	const expiresAt = connection.tokenExpiresAt ? new Date(connection.tokenExpiresAt) : null;
	const now = new Date();
	const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);

	if (!expiresAt || expiresAt <= fiveMinutesFromNow) {
		// Token expired or about to expire, refresh it
		if (!connection.refreshToken) {
			console.error('Refresh token missing - connection needs to be re-authorized');
			return null;
		}

		const refreshResult = await refreshGoogleAccessToken(connection.refreshToken);
		if (!refreshResult.success || !refreshResult.access_token) {
			console.error('Failed to refresh access token:', refreshResult.error);
			return null;
		}

		// Update connection with new token
		const newExpiresAt = refreshResult.expires_in
			? new Date(now.getTime() + refreshResult.expires_in * 1000).toISOString()
			: null;

		updateEmailConnection(connection.id, {
			accessToken: refreshResult.access_token,
			tokenExpiresAt: newExpiresAt,
		});

		return refreshResult.access_token;
	}

	return connection.accessToken;
}
