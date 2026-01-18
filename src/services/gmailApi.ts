/**
 * Gmail API service
 * Handles fetching and parsing emails for subscription detection
 */

import { getEmailConnectionByProvider, updateEmailConnectionScan } from './emailConnectionsStorage';
import { createSubscription, getSubscriptions, updateSubscription } from './subscriptionsStorage';

/**
 * Fetch message details for multiple message IDs
 * Returns parsed data: fromDomain, subject, date
 */
export async function fetchMessageDetails(
	accessToken: string,
	messageIds: string[],
	limit: number = 10
): Promise<{
	success: boolean;
	messages?: Array<{
		id: string;
		fromEmail?: string;
		fromDomain?: string;
		subject?: string;
		date?: string;
		snippet?: string;
	}>;
	error?: string;
}> {
	try {
		const limitedIds = messageIds.slice(0, limit);
		const messages = [];

		// Fetch messages in parallel (with a small delay to avoid rate limits)
		for (let i = 0; i < limitedIds.length; i++) {
			const messageId = limitedIds[i];

			// Small delay between requests to avoid rate limits
			if (i > 0) {
				await new Promise(resolve => setTimeout(resolve, 100));
			}

			const result = await getGmailMessageMetadata(accessToken, messageId);
			if (result.success && result.data) {
				messages.push(result.data);
			}
		}

		return {
			success: true,
			messages,
		};
	} catch (error) {
		console.error('Error fetching message details:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Failed to fetch message details',
		};
	}
}

/**
 * Fetch candidate subscription emails using Gmail search queries
 * Runs multiple queries and merges unique message IDs
 */
export async function fetchCandidateSubscriptionEmails(
	accessToken: string,
	maxResults: number = 200
): Promise<{
	success: boolean;
	messageIds?: string[];
	count?: number;
	queriesUsed?: Array<{ query: string; messagesFound: number; success: boolean; error?: string; httpStatus?: number }>;
	error?: string;
	errorDetails?: {
		status: number;
		response: any;
		likelyCause: string;
	};
}> {
	try {
		// Define search queries for subscription-related emails
		const queries = [
			'subject:(receipt OR invoice OR renewal OR "trial" OR "payment")',
			'newer_than:365d (receipt OR invoice OR renewal OR "trial" OR "payment")',
		];

		// Set to store unique message IDs
		const uniqueMessageIds = new Set<string>();
		const queriesUsed: Array<{ query: string; messagesFound: number; success: boolean; error?: string; httpStatus?: number }> = [];

		// Run each query and collect message IDs
		for (const query of queries) {
			try {
				const response = await fetch(
					`https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(query)}&maxResults=${maxResults}`,
					{
						headers: {
							Authorization: `Bearer ${accessToken}`,
							'Content-Type': 'application/json',
						},
					}
				);

				if (!response.ok) {
					const errorData = await response.json().catch(() => ({ error: 'Failed to parse error' }));
					const likelyCause = analyzeErrorCause(response.status, errorData);
					console.error(`Gmail API error for query "${query}":`, errorData);
					queriesUsed.push({
						query,
						messagesFound: 0,
						success: false,
						error: JSON.stringify(errorData),
						httpStatus: response.status,
					});
					// Continue with other queries even if one fails
					continue;
				}

				const data = await response.json();
				const messages = data.messages || [];

				// Add message IDs to the set (automatically handles duplicates)
				messages.forEach((msg: { id: string }) => {
					if (msg.id) {
						uniqueMessageIds.add(msg.id);
					}
				});

				queriesUsed.push({
					query,
					messagesFound: messages.length,
					success: true,
				});
			} catch (error) {
				console.error(`Error fetching messages for query "${query}":`, error);
				queriesUsed.push({
					query,
					messagesFound: 0,
					success: false,
					error: error instanceof Error ? error.message : 'Network error',
				});
				// Continue with other queries
			}
		}

		const messageIds = Array.from(uniqueMessageIds);

		// If all queries failed, return error
		if (queriesUsed.every(q => !q.success)) {
			const firstError = queriesUsed.find(q => !q.success);
			return {
				success: false,
				error: `All queries failed. Last error: ${firstError?.error || 'Unknown error'}`,
				queriesUsed,
				errorDetails: firstError?.httpStatus ? {
					status: firstError.httpStatus,
					response: { error: firstError.error },
					likelyCause: analyzeErrorCause(firstError.httpStatus, { error: { message: firstError.error } }),
				} : undefined,
			};
		}

		return {
			success: true,
			messageIds,
			count: messageIds.length,
			queriesUsed,
		};
	} catch (error) {
		console.error('Error fetching candidate subscription emails:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Failed to fetch candidate emails',
			errorDetails: {
				status: 0,
				response: { error: error instanceof Error ? error.message : 'Network error' },
				likelyCause: 'Network error or request timeout. Please check your connection.',
			},
		};
	}
}

/**
 * Fetch emails from Gmail API
 * Gets messages from the last 12 months
 */
export async function fetchGmailMessages(
	accessToken: string,
	maxResults: number = 500
): Promise<{
	success: boolean;
	messages?: Array<{ id: string; threadId: string }>;
	error?: string;
}> {
	try {
		// Calculate date 12 months ago
		const twelveMonthsAgo = new Date();
		twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
		const query = `after:${Math.floor(twelveMonthsAgo.getTime() / 1000)}`;

		// TODO: In production, use real Gmail API:
		// const response = await fetch(
		//   `https://www.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(query)}&maxResults=${maxResults}`,
		//   {
		//     headers: {
		//       Authorization: `Bearer ${accessToken}`,
		//     },
		//   }
		// );
		//
		// if (!response.ok) {
		//   throw new Error(`Gmail API error: ${response.status}`);
		// }
		//
		// const data = await response.json();
		// return { success: true, messages: data.messages || [] };

		// Mock implementation for now
		await new Promise(resolve => setTimeout(resolve, 1000));

		// Mock messages
		return {
			success: true,
			messages: [],
		};
	} catch (error) {
		console.error('Error fetching Gmail messages:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Failed to fetch messages',
		};
	}
}

/**
 * Analyze error response to determine likely cause
 */
function analyzeErrorCause(status: number, errorData: any): string {
	if (status === 401) {
		return 'Token expired or invalid. Please reconnect your email account.';
	}
	if (status === 403) {
		if (errorData?.error?.message?.includes('insufficient authentication scopes')) {
			return 'Missing Gmail read permission. Please reconnect and grant Gmail access.';
		}
		if (errorData?.error?.message?.includes('quota') || errorData?.error?.message?.includes('rateLimitExceeded')) {
			return 'API quota exceeded. Please try again later.';
		}
		return 'Access forbidden. Missing Gmail permissions or quota exceeded.';
	}
	if (status === 429) {
		return 'Rate limit exceeded. Please try again in a few minutes.';
	}
	if (status >= 500) {
		return 'Gmail API server error. Please try again later.';
	}
	return 'Unknown error occurred.';
}

/**
 * Fetch message details (metadata only) for parsing
 * Gets From, Subject, and Date headers
 */
export async function getGmailMessageMetadata(
	accessToken: string,
	messageId: string
): Promise<{
	success: boolean;
	data?: {
		id: string;
		fromEmail?: string;
		fromDomain?: string;
		subject?: string;
		date?: string;
		snippet?: string;
	};
	error?: string;
	httpStatus?: number;
	errorDetails?: {
		status: number;
		response: any;
		likelyCause: string;
	};
}> {
	try {
		const response = await fetch(
			`https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date`,
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json',
				},
			}
		);

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ error: 'Failed to parse error' }));
			const likelyCause = analyzeErrorCause(response.status, errorData);
			return {
				success: false,
				error: JSON.stringify(errorData),
				httpStatus: response.status,
				errorDetails: {
					status: response.status,
					response: errorData,
					likelyCause,
				},
			};
		}

		const data = await response.json();
		const payload = data.payload || {};
		const headers = payload.headers || [];

		// Extract headers
		const fromHeader = headers.find((h: { name: string; value: string }) => h.name.toLowerCase() === 'from')?.value || '';
		const subjectHeader = headers.find((h: { name: string; value: string }) => h.name.toLowerCase() === 'subject')?.value || '';
		const dateHeader = headers.find((h: { name: string; value: string }) => h.name.toLowerCase() === 'date')?.value || '';

		// Parse From email and domain
		let fromEmail = '';
		let fromDomain = '';
		if (fromHeader) {
			// Extract email from "Name <email@domain.com>" or just "email@domain.com"
			const emailMatch = fromHeader.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
			if (emailMatch) {
				fromEmail = emailMatch[1];
				fromDomain = fromEmail.split('@')[1] || '';
			}
		}

		return {
			success: true,
			data: {
				id: messageId,
				fromEmail,
				fromDomain,
				subject: subjectHeader,
				date: dateHeader,
				snippet: data.snippet || '',
			},
		};
	} catch (error) {
		console.error(`Error fetching message metadata for ${messageId}:`, error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Failed to fetch message metadata',
			httpStatus: undefined,
			errorDetails: {
				status: 0,
				response: { error: error instanceof Error ? error.message : 'Network error' },
				likelyCause: 'Network error or request timeout. Please check your connection.',
			},
		};
	}
}

/**
 * Get email message details
 */
export async function getGmailMessage(
	accessToken: string,
	messageId: string
): Promise<{
	success: boolean;
	message?: {
		id: string;
		threadId: string;
		snippet: string;
		payload: {
			headers: Array<{ name: string; value: string }>;
			parts?: Array<{ body: { data?: string } }>;
		};
	};
	error?: string;
}> {
	try {
		// TODO: In production, use real Gmail API:
		// const response = await fetch(
		//   `https://www.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=full`,
		//   {
		//     headers: {
		//       Authorization: `Bearer ${accessToken}`,
		//     },
		//   }
		// );
		//
		// if (!response.ok) {
		//   throw new Error(`Gmail API error: ${response.status}`);
		// }
		//
		// const data = await response.json();
		// return { success: true, message: data };

		// Mock implementation
		await new Promise(resolve => setTimeout(resolve, 200));

		return {
			success: true,
			message: {
				id: messageId,
				threadId: 'thread_123',
				snippet: 'Mock email snippet',
				payload: {
					headers: [
						{ name: 'From', value: 'billing@example.com' },
						{ name: 'Subject', value: 'Subscription receipt' },
					],
				},
			},
		};
	} catch (error) {
		console.error('Error getting Gmail message:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Failed to get message',
		};
	}
}

/**
 * Domain to subscription name mapping
 */
const DOMAIN_TO_SUBSCRIPTION_NAME: Record<string, string> = {
	'netflix.com': 'Netflix',
	'spotify.com': 'Spotify',
	'adobe.com': 'Adobe',
	'amazon.com': 'Amazon Prime',
	'apple.com': 'Apple',
	'dropbox.com': 'Dropbox',
	'figma.com': 'Figma',
	'github.com': 'GitHub',
	'google.com': 'Google',
	'microsoft.com': 'Microsoft',
	'notion.so': 'Notion',
	'openai.com': 'OpenAI',
	'slack.com': 'Slack',
	'youtube.com': 'YouTube Premium',
};

/**
 * Subscription detection keywords
 */
const SUBSCRIPTION_KEYWORDS = [
	'renewal',
	'trial',
	'invoice',
	'receipt',
	'payment',
	'your plan',
];

/**
 * Detect subscription from email metadata
 */
function detectSubscriptionFromEmail(
	fromDomain: string,
	subject: string,
	emailDate: string
): {
	detected: boolean;
	name?: string;
	providerDomain?: string;
	lastSeenEmailDate?: string;
} {
	// Normalize domain (remove www., handle subdomains)
	const normalizedDomain = fromDomain.toLowerCase().replace(/^www\./, '').split('.').slice(-2).join('.');

	// Check if domain is in known subscriptions mapping
	const subscriptionName = DOMAIN_TO_SUBSCRIPTION_NAME[normalizedDomain];

	// Check if subject contains subscription keywords
	const subjectLower = subject.toLowerCase();
	const hasSubscriptionKeyword = SUBSCRIPTION_KEYWORDS.some(keyword =>
		subjectLower.includes(keyword.toLowerCase())
	);

	// Detect if this is a subscription email
	if (subscriptionName || hasSubscriptionKeyword) {
		// Use mapped name if available, otherwise derive from domain
		const name = subscriptionName || normalizedDomain.split('.')[0]
			.split('-')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');

		return {
			detected: true,
			name,
			providerDomain: normalizedDomain,
			lastSeenEmailDate: emailDate,
		};
	}

	return { detected: false };
}

/**
 * Extract subscription signals from email
 */
function extractSubscriptionFromEmail(
	message: {
		snippet: string;
		payload: {
			headers: Array<{ name: string; value: string }>;
		};
	}
): {
	detected: boolean;
	name?: string;
	price?: number;
	currency?: string;
	cycle?: 'Monthly' | 'Annually';
	renewalDate?: Date;
	paymentMethod?: string;
} {
	// Extract headers
	const headers = message.payload.headers;
	const from = headers.find(h => h.name.toLowerCase() === 'from')?.value || '';
	const subject = headers.find(h => h.name.toLowerCase() === 'subject')?.value || '';
	const snippet = message.snippet;

	// Simple pattern matching for subscription signals
	// In production, use more sophisticated NLP/ML models

	const subscriptionKeywords = [
		'subscription',
		'renewal',
		'billing',
		'invoice',
		'payment',
		'receipt',
		'charge',
		'auto-renew',
	];

	const text = `${subject} ${snippet}`.toLowerCase();
	const hasSubscriptionSignal = subscriptionKeywords.some(keyword => text.includes(keyword));

	if (!hasSubscriptionSignal) {
		return { detected: false };
	}

	// Extract price
	const priceMatch = text.match(/\$?(\d+\.?\d*)/);
	const price = priceMatch ? parseFloat(priceMatch[1]) : undefined;

	// Extract currency
	const currencyMatch = text.match(/\$|usd|eur|gbp/i);
	let currency = 'USD';
	if (currencyMatch) {
		const curr = currencyMatch[0].toUpperCase();
		if (curr.includes('EUR')) currency = 'EUR';
		else if (curr.includes('GBP')) currency = 'GBP';
		else if (curr.includes('$')) currency = 'USD';
	}

	// Detect cycle
	let cycle: 'Monthly' | 'Annually' = 'Monthly';
	if (text.includes('year') || text.includes('annual')) {
		cycle = 'Annually';
	}

	// Extract company/service name from "From" header
	const nameMatch = from.match(/<(.+)@(.+?)\./);
	const name = nameMatch ? nameMatch[2] : from.split('@')[1]?.split('.')[0] || 'Unknown';

	// Extract renewal date (simple patterns)
	const datePatterns = [
		/renew.*?(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
		/renew.*?(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2})/i,
	];

	let renewalDate: Date | undefined;
	for (const pattern of datePatterns) {
		const match = text.match(pattern);
		if (match) {
			// Simple date parsing (in production, use proper date library)
			try {
				renewalDate = new Date(match[1] || match[0]);
				if (isNaN(renewalDate.getTime())) renewalDate = undefined;
			} catch {
				// Invalid date
			}
			break;
		}
	}

	return {
		detected: true,
		name: name.charAt(0).toUpperCase() + name.slice(1),
		price,
		currency,
		cycle,
		renewalDate,
		paymentMethod: 'Unknown',
	};
}

/**
 * Scan Gmail for subscriptions using MVP detector
 */
export async function scanGmailForSubscriptions(
	onProgress?: (stage: string) => void
): Promise<{
	success: boolean;
	subscriptionsFound: number;
	messagesSearched?: number;
	queriesUsed?: Array<{ query: string; messagesFound: number; success: boolean; error?: string; httpStatus?: number }>;
	error?: string;
	errorDetails?: {
		status: number;
		response: any;
		likelyCause: string;
	};
}> {
	try {
		onProgress?.('Connecting…');

		// Get access token from localStorage (prefer this over connection storage)
		const accessToken = localStorage.getItem('google_access_token');
		if (!accessToken) {
			return {
				success: false,
				subscriptionsFound: 0,
				error: 'No access token found. Please login with Google first.',
			};
		}

		onProgress?.('Searching messages…');

		// Fetch candidate subscription emails
		const candidateResult = await fetchCandidateSubscriptionEmails(accessToken, 200);
		if (!candidateResult.success) {
			return {
				success: false,
				subscriptionsFound: 0,
				messagesSearched: 0,
				queriesUsed: candidateResult.queriesUsed,
				error: candidateResult.error || 'Failed to search messages',
				errorDetails: candidateResult.errorDetails,
			};
		}

		if (!candidateResult.messageIds || candidateResult.messageIds.length === 0) {
			return {
				success: true,
				subscriptionsFound: 0,
				messagesSearched: 0,
				queriesUsed: candidateResult.queriesUsed || [],
				error: 'No candidate emails found',
			};
		}

		const messageIds = candidateResult.messageIds;
		onProgress?.('Fetching metadata…');

		let subscriptionsFound = 0;
		const detectedSubscriptions = new Map<string, {
			name: string;
			providerDomain: string;
			lastSeenEmailDate: string;
		}>();

		// Process messages in batches
		const batchSize = 10;
		let messagesProcessed = 0;

		// Process messages in batches to avoid rate limits
		for (let i = 0; i < messageIds.length; i += batchSize) {
			const batch = messageIds.slice(i, i + batchSize);

			for (const messageId of batch) {
				// Get message metadata (efficient - only headers)
				const messageResult = await getGmailMessageMetadata(accessToken, messageId);
				if (!messageResult.success || !messageResult.data) {
					messagesProcessed++;
					// If we hit an auth error, return early
					if (messageResult.errorDetails && (messageResult.errorDetails.status === 401 || messageResult.errorDetails.status === 403)) {
						return {
							success: false,
							subscriptionsFound: 0,
							messagesSearched: messagesProcessed,
							queriesUsed: candidateResult.queriesUsed,
							error: messageResult.error,
							errorDetails: messageResult.errorDetails,
						};
					}
					continue;
				}

				messagesProcessed++;
				const { fromDomain, subject, date } = messageResult.data;

				if (!fromDomain) {
					continue;
				}

				// Detect subscription using MVP detector
				const detection = detectSubscriptionFromEmail(fromDomain, subject || '', date || '');

				if (detection.detected && detection.name && detection.providerDomain) {
					// Store or update detection (keeps the most recent email date)
					const existing = detectedSubscriptions.get(detection.providerDomain);
					if (!existing || (detection.lastSeenEmailDate && (!existing.lastSeenEmailDate || new Date(detection.lastSeenEmailDate) > new Date(existing.lastSeenEmailDate)))) {
						detectedSubscriptions.set(detection.providerDomain, {
							name: detection.name,
							providerDomain: detection.providerDomain,
							lastSeenEmailDate: detection.lastSeenEmailDate || new Date().toISOString(),
						});
					}
				}
			}

			// Small delay between batches to respect rate limits
			if (i + batchSize < messageIds.length) {
				await new Promise(resolve => setTimeout(resolve, 100));
			}
		}

		onProgress?.('Detecting subscriptions…');

		// Create or update subscription records
		for (const [, detection] of detectedSubscriptions) {
			try {
				// Check if subscription with same name already exists
				const existingSubscriptions = getSubscriptions();
				const existing = existingSubscriptions.find(sub =>
					sub.name.toLowerCase() === detection.name.toLowerCase() ||
					sub.notes?.includes(detection.providerDomain)
				);

				if (existing) {
					// Update existing subscription - update last seen date in notes
					const notesParts = (existing.notes || '').split('\n').filter(p => !p.includes('Provider domain:') && !p.includes('Last seen:'));
					const updatedNotes = [
						...notesParts,
						`Provider domain: ${detection.providerDomain}`,
						`Last seen: ${detection.lastSeenEmailDate}`,
					].join('\n').trim();

					updateSubscription(existing.id, {
						notes: updatedNotes,
						status: 'Active', // Reactivate if it was inactive
					});
				} else {
					// Create new subscription
					const emailDate = detection.lastSeenEmailDate ? new Date(detection.lastSeenEmailDate) : new Date();

					createSubscription({
						name: detection.name,
						price: 0, // Unknown initially
						currency: 'USD',
						cycle: 'Monthly', // Default, will be updated later
						paymentMethod: 'Unknown',
						startedOn: emailDate,
						renewalDate: new Date(emailDate.getTime() + 30 * 24 * 60 * 60 * 1000), // Default to 30 days from email date
						status: 'Active',
						notes: `Detected from email scan\nProvider domain: ${detection.providerDomain}\nLast seen: ${detection.lastSeenEmailDate}`,
						reminder: true,
						isVisible: true,
					});

					subscriptionsFound++;
				}
			} catch (error) {
				console.error('Error creating/updating subscription:', error);
				// Continue processing other subscriptions
			}
		}

		// Update connection scan results
		const connection = getEmailConnectionByProvider('gmail');
		if (connection) {
			updateEmailConnectionScan(connection.id, 'success', null);
		}

		onProgress?.('Done');

		return {
			success: true,
			subscriptionsFound,
			messagesSearched: messagesProcessed,
			queriesUsed: candidateResult.queriesUsed,
		};
	} catch (error) {
		console.error('Error scanning Gmail:', error);

		// Update connection scan results with error
		const connection = getEmailConnectionByProvider('gmail');
		if (connection) {
			updateEmailConnectionScan(
				connection.id,
				'error',
				error instanceof Error ? error.message : 'Unknown error'
			);
		}

		return {
			success: false,
			error: error instanceof Error ? error.message : 'Failed to scan emails',
			subscriptionsFound: 0,
			messagesSearched: 0,
			errorDetails: {
				status: 0,
				response: { error: error instanceof Error ? error.message : 'Unknown error' },
				likelyCause: 'Unexpected error occurred during scan. Please try again.',
			},
		};
	}
}
