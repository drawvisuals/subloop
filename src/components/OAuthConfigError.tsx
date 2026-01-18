/**
 * OAuth Configuration Error Page
 * Shown when Google OAuth Client ID is invalid or missing
 */

interface OAuthConfigErrorProps {
  origin: string;
  clientId: string | undefined;
  error: string;
}

export function OAuthConfigError({ origin, clientId, error }: OAuthConfigErrorProps) {
  const isValidFormat = clientId && /.+\.apps\.googleusercontent\.com$/.test(clientId);
  const clientIdPrefix = clientId?.split('-')[0] || '';

  return (
    <div className="min-h-screen bg-neutral-800 flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full bg-neutral-900 border border-danger-500 rounded-lg p-8">
        <h1 className="text-2xl font-bold text-text-danger mb-4">⚠️ Google OAuth Configuration Error</h1>

        <div className="space-y-4 text-text-primary">
          <div className="bg-neutral-800 rounded p-4">
            <p className="font-semibold mb-2">Error:</p>
            <p className="text-text-secondary">{error}</p>
          </div>

          <div className="bg-neutral-800 rounded p-4">
            <p className="font-semibold mb-2">Current Configuration:</p>
            <div className="space-y-2 font-mono text-sm">
              <div>
                <span className="text-text-secondary">Origin:</span>{' '}
                <span className="text-text-primary">{origin}</span>
              </div>
              <div>
                <span className="text-text-secondary">Client ID:</span>{' '}
                <span className={clientId ? 'text-text-primary' : 'text-danger-500'}>
                  {clientId || 'undefined'}
                </span>
              </div>
              {clientId && (
                <div>
                  <span className="text-text-secondary">Client ID Prefix:</span>{' '}
                  <span className="text-text-primary">{clientIdPrefix}</span>
                </div>
              )}
              <div>
                <span className="text-text-secondary">Format Valid:</span>{' '}
                <span className={isValidFormat ? 'text-success-500' : 'text-danger-500'}>
                  {isValidFormat ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-neutral-800 rounded p-4">
            <p className="font-semibold mb-3">How to Fix:</p>
            <ol className="list-decimal list-inside space-y-2 text-text-secondary">
              <li>Open your <code className="bg-neutral-700 px-1 rounded">.env</code> file in the project root</li>
              <li>Add or update: <code className="bg-neutral-700 px-1 rounded">VITE_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com</code></li>
              <li>Get your Client ID from: <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-brand-primary-500 hover:underline">Google Cloud Console</a></li>
              <li><strong className="text-text-primary">Stop the dev server (Ctrl+C) and restart it</strong></li>
              <li>Refresh this page</li>
            </ol>
          </div>

          <div className="bg-blue-900/20 border border-blue-500 rounded p-4">
            <p className="font-semibold mb-2 text-text-primary">Google Cloud Console Settings Required:</p>
            <div className="space-y-2 font-mono text-sm text-text-secondary">
              <div>
                <span className="text-text-primary">OAuth Client Type:</span> Web application
              </div>
              <div>
                <span className="text-text-primary">Authorized JavaScript origins:</span>
                <div className="mt-1 ml-4 text-brand-primary-500">{origin}</div>
              </div>
              <div>
                <span className="text-text-primary">Authorized redirect URIs:</span>
                <div className="mt-1 ml-4 text-brand-primary-500">{origin}</div>
                <div className="mt-1 ml-4 text-xs text-text-secondary italic">(Token flow still requires redirect URI - library redirects back)</div>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-brand-primary-500 text-text-inverse rounded-lg hover:bg-brand-primary-400 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
