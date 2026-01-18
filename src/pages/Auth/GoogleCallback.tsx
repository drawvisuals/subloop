import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handleGoogleCallback } from '@/services/googleOAuth';
import { getPostAuthRedirect } from '@/services/onboarding';
import { markEmailConnected, markScanStarted } from '@/services/onboarding';

/**
 * Google OAuth callback handler
 * Processes the OAuth callback and redirects appropriately
 */
export default function GoogleCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');

  useEffect(() => {
    const processCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const errorParam = searchParams.get('error');

      // Handle OAuth error
      if (errorParam) {
        setError(`OAuth error: ${errorParam}`);
        setStatus('error');
        setTimeout(() => {
          navigate('/auth/signup');
        }, 3000);
        return;
      }

      // Missing code
      if (!code || !state) {
        setError('Missing authorization code. Please try again.');
        setStatus('error');
        setTimeout(() => {
          navigate('/auth/signup');
        }, 3000);
        return;
      }

      try {
        // Handle the OAuth callback
        const result = await handleGoogleCallback(code, state);

        if (!result.success) {
          // Check for refresh token missing error
          if (result.error === 'REFRESH_TOKEN_MISSING') {
            setError(
              'Gmail connection requires explicit consent. Please try again and make sure to grant all requested permissions.'
            );
          } else {
            setError(result.error || 'Failed to complete authentication');
          }
          setStatus('error');
          setTimeout(() => {
            navigate('/auth/signup');
          }, 5000);
          return;
        }

        // Success - mark email as connected and start scan
        setStatus('success');
        markEmailConnected(1);
        markScanStarted();

        // Redirect to scanning page
        setTimeout(() => {
          navigate('/onboarding/scanning');
        }, 1000);
      } catch (err) {
        console.error('Error processing Google OAuth callback:', err);
        setError('An unexpected error occurred. Please try again.');
        setStatus('error');
        setTimeout(() => {
          navigate('/auth/signup');
        }, 3000);
      }
    };

    processCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-neutral-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        {status === 'processing' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary-500 mx-auto mb-4"></div>
            <p className="text-text-primary text-lg">Completing Gmail authorization...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-success-500 text-4xl mb-4">✓</div>
            <p className="text-text-primary text-lg mb-2">Gmail connected successfully!</p>
            <p className="text-text-secondary">Redirecting to start scanning...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-danger-500 text-4xl mb-4">✕</div>
            <p className="text-text-primary text-lg mb-2">Authorization failed</p>
            <p className="text-text-secondary mb-4">{error}</p>
            <p className="text-text-secondary text-sm">Redirecting back to sign up...</p>
          </>
        )}
      </div>
    </div>
  );
}
