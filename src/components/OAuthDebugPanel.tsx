/**
 * OAuth Debug Panel (DEV only)
 * Shows runtime OAuth configuration for debugging
 */

interface OAuthDebugPanelProps {
  origin: string;
  clientId: string;
  scopes: string;
}

export function OAuthDebugPanel({ origin, clientId, scopes }: OAuthDebugPanelProps) {
  const clientIdPrefix = clientId.split('-')[0];
  const isValidFormat = /.+\.apps\.googleusercontent\.com$/.test(clientId);

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 max-w-md bg-neutral-900 border border-neutral-700 rounded-lg p-4 shadow-xl z-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-text-primary">🔍 OAuth Debug (DEV)</h3>
        <button
          onClick={() => {
            const panel = document.getElementById('oauth-debug-panel');
            if (panel) panel.style.display = 'none';
          }}
          className="text-text-secondary hover:text-text-primary text-sm"
        >
          ✕
        </button>
      </div>

      <div className="space-y-2 text-xs font-mono">
        <div>
          <span className="text-text-secondary">Origin:</span>{' '}
          <span className="text-text-primary break-all">{origin}</span>
        </div>
        <div>
          <span className="text-text-secondary">Client ID:</span>{' '}
          <span className={`break-all ${isValidFormat ? 'text-success-500' : 'text-danger-500'}`}>
            {clientId}
          </span>
        </div>
        <div>
          <span className="text-text-secondary">Prefix:</span>{' '}
          <span className="text-text-primary">{clientIdPrefix}</span>
        </div>
        <div>
          <span className="text-text-secondary">Flow:</span>{' '}
          <span className="text-text-primary">Token Flow (Popup)</span>
        </div>
        <div>
          <span className="text-text-secondary">Library:</span>{' '}
          <span className="text-text-primary">@react-oauth/google</span>
        </div>
        <div className="pt-2 border-t border-neutral-700">
          <span className="text-text-secondary">Scopes:</span>
          <div className="mt-1 text-text-primary break-all">{scopes}</div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-neutral-700">
        <p className="text-xs font-semibold text-text-primary mb-2">Google Cloud Console Checklist:</p>
        <div className="space-y-1 text-xs text-text-secondary">
          <div>✅ OAuth Client Type: <span className="text-text-primary">Web application</span></div>
          <div>✅ Authorized JavaScript origins: <span className="text-brand-primary-500">{origin}</span></div>
          <div>✅ Authorized redirect URIs: <span className="text-brand-primary-500">{origin}</span></div>
          <div className="mt-2 pt-2 border-t border-neutral-800">
            <p className="text-xs text-text-secondary italic">Note: Token flow still uses redirect URIs (the library redirects back to your origin)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
