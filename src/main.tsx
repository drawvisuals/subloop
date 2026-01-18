import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App.tsx';
import { OAuthConfigError } from './components/OAuthConfigError.tsx';
import './index.css';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const ORIGIN = typeof window !== 'undefined' ? window.location.origin : 'unknown';

// Runtime validation with regex
const CLIENT_ID_REGEX = /.+\.apps\.googleusercontent\.com$/;

// Log for debugging - CRITICAL: Check console for these values
console.log(`=== GOOGLE OAUTH DEBUG ===`);
console.log(`OAUTH_ORIGIN=${ORIGIN}`);
console.log(`CLIENT_ID=${GOOGLE_CLIENT_ID || 'undefined'}`);
console.log(`CLIENT_ID_FORMAT_VALID=${GOOGLE_CLIENT_ID ? CLIENT_ID_REGEX.test(GOOGLE_CLIENT_ID) : false}`);
if (GOOGLE_CLIENT_ID) {
	const prefix = GOOGLE_CLIENT_ID.split('-')[0];
	console.log(`CLIENT_ID_PREFIX=${prefix}`);
}
console.log(`========================`);

// Validate and show error page if invalid
let validationError: string | null = null;
if (!GOOGLE_CLIENT_ID) {
	validationError = 'VITE_GOOGLE_CLIENT_ID is not set in .env file';
} else if (!CLIENT_ID_REGEX.test(GOOGLE_CLIENT_ID)) {
	validationError = `Invalid Client ID format. Must end with .apps.googleusercontent.com. Current: ${GOOGLE_CLIENT_ID}`;
} else if (GOOGLE_CLIENT_ID.split('.apps.googleusercontent.com').length > 2) {
	validationError = 'Duplicate .apps.googleusercontent.com detected in Client ID';
}

// Render error page if invalid, otherwise render app
if (validationError) {
	const root = document.getElementById('root');
	if (root) {
		createRoot(root).render(
			<StrictMode>
				<OAuthConfigError
					origin={ORIGIN}
					clientId={GOOGLE_CLIENT_ID || undefined}
					error={validationError}
				/>
			</StrictMode>
		);
	}
} else {
	// Valid Client ID - render app with provider
	createRoot(document.getElementById('root')!).render(
		<StrictMode>
			<GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
				<App />
			</GoogleOAuthProvider>
		</StrictMode>
	);
}
