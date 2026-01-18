/**
 * Brand logo mapping and normalization utilities
 */

// Brand logo file mapping - maps normalized brand names to SVG file names
export const BRAND_LOGOS: Record<string, string> = {
	netflix: 'netflix.svg',
	spotify: 'spotify.svg',
	adobe: 'adobe.svg',
	notion: 'notion.svg',
	figma: 'figma.svg',
	slack: 'slack.svg',
	github: 'github.svg',
	google: 'google.svg',
	youtube: 'youtube.svg',
	apple: 'apple.svg',
	dropbox: 'dropbox.svg',
	microsoft: 'microsoft.svg',
	openai: 'openai.svg',
	amazon: 'amazon.svg',
	'prime video': 'amazon.svg',
	'prime': 'amazon.svg',
	discord: 'discord.svg',
	twitch: 'twitch.svg',
	twitter: 'twitter.svg',
	x: 'twitter.svg',
	linkedin: 'linkedin.svg',
	instagram: 'instagram.svg',
	facebook: 'facebook.svg',
	zoom: 'zoom.svg',
	skype: 'skype.svg',
	atlassian: 'atlassian.svg',
	jira: 'atlassian.svg',
	confluence: 'atlassian.svg',
	airbnb: 'airbnb.svg',
	uber: 'uber.svg',
	tesla: 'tesla.svg',
	stripe: 'stripe.svg',
	paypal: 'paypal.svg',
	shopify: 'shopify.svg',
	salesforce: 'salesforce.svg',
	hubspot: 'hubspot.svg',
	mailchimp: 'mailchimp.svg',
	canva: 'canva.svg',
	linear: 'linear.svg',
	vercel: 'vercel.svg',
	cloudflare: 'cloudflare.svg',
	aws: 'aws.svg',
	'aws amazon': 'aws.svg',
	azure: 'azure.svg',
	'azure microsoft': 'azure.svg',
	gcp: 'google.svg',
	'google cloud': 'google.svg',
};

/**
 * Normalize subscription name for brand matching
 * - lowercase, trim, remove punctuation, collapse spaces
 */
export function normalizeBrandName(name: string): string {
	return name
		.toLowerCase()
		.trim()
		.replace(/[^\w\s]/g, '') // Remove punctuation
		.replace(/\s+/g, ' ') // Collapse multiple spaces
		.trim();
}

/**
 * Handle common aliases for brand names
 */
export function resolveBrandAlias(normalized: string): string {
	const aliases: Record<string, string> = {
		'prime video': 'amazon',
		'prime': 'amazon',
		'adobe cc': 'adobe',
		'adobe creative cloud': 'adobe',
		'cc': 'adobe',
		'amazon prime': 'amazon',
		'amazon prime video': 'amazon',
		'microsoft office': 'microsoft',
		'office 365': 'microsoft',
		'o365': 'microsoft',
		'ms office': 'microsoft',
		'google drive': 'google',
		'gmail': 'google',
		'google workspace': 'google',
		'g suite': 'google',
		'aws': 'amazon',
		'azure': 'microsoft',
		'gcp': 'google',
		'google cloud': 'google',
		'x twitter': 'twitter',
		'x.com': 'twitter',
	};

	return aliases[normalized] || normalized;
}

/**
 * Get brand logo key from subscription name
 * Returns the brand key if found, null otherwise
 */
export function getBrandLogoKey(subscriptionName: string): string | null {
	const normalized = normalizeBrandName(subscriptionName);
	const resolved = resolveBrandAlias(normalized);

	// Check direct match
	if (BRAND_LOGOS[resolved]) {
		return resolved;
	}

	// Check if normalized name contains any brand key
	for (const [key] of Object.entries(BRAND_LOGOS)) {
		if (resolved.includes(key) || key.includes(resolved)) {
			return key;
		}
	}

	return null;
}
