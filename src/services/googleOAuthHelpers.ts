/**
 * Helper functions for Google OAuth token management
 * Works with @react-oauth/google library
 */

import { createEmailConnection, updateEmailConnection, getEmailConnectionByProvider } from './emailConnectionsStorage';
import { setAuthProvider } from './auth';

/**
 * Handle successful OAuth response with credential (ID token)
 * In production, send this to your backend to exchange for access/refresh tokens
 */
export async function handleGoogleAuthSuccess(credential: string): Promise<{
  success: boolean;
  email?: string;
  error?: string;
}> {
  try {
    // Decode ID token to get user info (JWT)
    // In production, send credential to backend to verify and exchange for access/refresh tokens
    const payload = JSON.parse(atob(credential.split('.')[1]));
    const email = payload.email;

    if (!email) {
      return { success: false, error: 'Failed to get user email from Google' };
    }

    // Set session
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('subloop_current_user', email);
      setAuthProvider('google');
    }

    // In production, backend would:
    // 1. Verify the ID token
    // 2. Exchange for access/refresh tokens using authorization code flow
    // 3. Store tokens securely
    // For now, we'll create a mock connection
    // TODO: Replace with real backend call

    // Mock tokens - in production these come from backend
    const mockAccessToken = `google_access_token_${Date.now()}`;
    const mockRefreshToken = `google_refresh_token_${Date.now()}`;
    const expiresAt = new Date(Date.now() + 3600 * 1000).toISOString();

    // Create email connection
    createEmailConnection(
      'gmail',
      email,
      mockAccessToken,
      mockRefreshToken,
      expiresAt
    );

    return { success: true, email };
  } catch (error) {
    console.error('Error handling Google auth success:', error);
    return { success: false, error: 'Failed to process Google authentication' };
  }
}

/**
 * Handle OAuth error
 */
export function handleGoogleAuthError(error: unknown): string {
  console.error('Google OAuth error:', error);

  if (typeof error === 'object' && error !== null) {
    if ('error' in error) {
      const errorObj = error as { error: string; error_description?: string };
      if (errorObj.error === 'popup_closed_by_user') {
        return 'Authentication was cancelled';
      }
      if (errorObj.error === 'invalid_client' || errorObj.error_description?.includes('invalid_client')) {
        return 'Invalid OAuth Client ID. The Client ID in your .env file may be incorrect, deleted, or belong to a different project.';
      }
      // Handle access_denied (403) - test user issue
      if (errorObj.error === 'access_denied' || errorObj.error === '403' || errorObj.error_description?.includes('access_denied')) {
        return 'ACCESS_DENIED_TEST_USER'; // Special marker for UI to show detailed help
      }
      return errorObj.error_description || errorObj.error || 'Authentication failed';
    }

    // Handle error objects with message property
    if ('message' in error) {
      const errorMsg = (error as { message: string }).message;
      if (errorMsg.includes('invalid_client') || errorMsg.includes('401')) {
        return 'Invalid OAuth Client ID. Please verify your Client ID in Google Cloud Console.';
      }
      if (errorMsg.includes('access_denied') || errorMsg.includes('403') || errorMsg.includes('not completed the Google verification')) {
        return 'ACCESS_DENIED_TEST_USER'; // Special marker
      }
      return errorMsg;
    }
  }

  // Handle string errors
  if (typeof error === 'string') {
    if (error.includes('invalid_client') || error.includes('401')) {
      return 'Invalid OAuth Client ID. Please verify your Client ID in Google Cloud Console.';
    }
    if (error.includes('access_denied') || error.includes('403') || error.includes('not completed the Google verification')) {
      return 'ACCESS_DENIED_TEST_USER'; // Special marker
    }
    return error;
  }

  return 'An unexpected error occurred during authentication';
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

    // TODO: In production, call backend to refresh token
    // For now, return existing token (backend should handle refresh)
    console.warn('Token expired but refresh not implemented in frontend - backend should handle this');
    return connection.accessToken;
  }

  return connection.accessToken;
}
