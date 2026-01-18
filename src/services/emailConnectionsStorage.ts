/**
 * Mock email connections storage service
 * In production, this would be handled by the backend API
 */

export type EmailProvider = 'gmail' | 'outlook' | 'icloud' | 'imap';

export interface EmailConnectionData {
  id: string;
  userId: string;
  provider: EmailProvider;
  email: string;
  accessToken: string;
  refreshToken: string | null;
  tokenExpiresAt: string | null; // ISO 8601 date string
  connected: boolean;
  lastScannedAt: string | null; // ISO 8601 date string
  lastScanStatus: 'success' | 'error' | null;
  lastScanError: string | null;
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
}

const STORAGE_KEY = 'subloop_email_connections';

/**
 * Get storage key for current user
 */
function getStorageKey(): string {
  const userId = sessionStorage.getItem('subloop_current_user');
  return userId ? `${STORAGE_KEY}_${userId}` : STORAGE_KEY;
}

/**
 * Get all email connections for current user
 */
export function getEmailConnections(): EmailConnectionData[] {
  try {
    const stored = localStorage.getItem(getStorageKey());
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading email connections:', error);
  }
  return [];
}

/**
 * Get email connection by ID
 */
export function getEmailConnection(id: string): EmailConnectionData | null {
  const connections = getEmailConnections();
  return connections.find(conn => conn.id === id) || null;
}

/**
 * Get email connection by provider
 */
export function getEmailConnectionByProvider(provider: EmailProvider): EmailConnectionData | null {
  const connections = getEmailConnections();
  return connections.find(conn => conn.provider === provider && conn.connected) || null;
}

/**
 * Create a new email connection
 */
export function createEmailConnection(
  provider: EmailProvider,
  email: string,
  accessToken: string,
  refreshToken: string | null = null,
  tokenExpiresAt: string | null = null
): EmailConnectionData {
  const userId = sessionStorage.getItem('subloop_current_user') || 'anonymous';
  const now = new Date().toISOString();

  const connection: EmailConnectionData = {
    id: `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    provider,
    email,
    accessToken,
    refreshToken,
    tokenExpiresAt,
    connected: true,
    lastScannedAt: null,
    lastScanStatus: null,
    lastScanError: null,
    createdAt: now,
    updatedAt: now,
  };

  const connections = getEmailConnections();
  // Check if connection already exists for this provider
  const existingIndex = connections.findIndex(
    conn => conn.provider === provider && conn.userId === userId
  );

  if (existingIndex >= 0) {
    // Update existing connection
    connections[existingIndex] = {
      ...connections[existingIndex],
      email,
      accessToken,
      refreshToken,
      tokenExpiresAt,
      connected: true,
      updatedAt: now,
    };
  } else {
    // Add new connection
    connections.push(connection);
  }

  saveEmailConnections(connections);
  return connection;
}

/**
 * Update an email connection
 */
export function updateEmailConnection(
  id: string,
  updates: Partial<EmailConnectionData>
): EmailConnectionData | null {
  const connections = getEmailConnections();
  const index = connections.findIndex(conn => conn.id === id);

  if (index < 0) {
    return null;
  }

  connections[index] = {
    ...connections[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  saveEmailConnections(connections);
  return connections[index];
}

/**
 * Delete an email connection
 */
export function deleteEmailConnection(id: string): boolean {
  const connections = getEmailConnections();
  const filtered = connections.filter(conn => conn.id !== id);

  if (filtered.length === connections.length) {
    return false; // Connection not found
  }

  saveEmailConnections(filtered);
  return true;
}

/**
 * Toggle connection status (connect/disconnect)
 */
export function toggleEmailConnection(id: string, connected: boolean): EmailConnectionData | null {
  return updateEmailConnection(id, { connected });
}

/**
 * Update scan results
 */
export function updateEmailConnectionScan(
  id: string,
  status: 'success' | 'error',
  error: string | null = null
): EmailConnectionData | null {
  return updateEmailConnection(id, {
    lastScannedAt: new Date().toISOString(),
    lastScanStatus: status,
    lastScanError: error,
  });
}

/**
 * Save email connections to localStorage
 */
function saveEmailConnections(connections: EmailConnectionData[]): void {
  try {
    localStorage.setItem(getStorageKey(), JSON.stringify(connections));
  } catch (error) {
    console.error('Error saving email connections:', error);
  }
}

/**
 * Clear all connections (for testing/logout)
 */
export function clearEmailConnections(): void {
  try {
    localStorage.removeItem(getStorageKey());
  } catch (error) {
    console.error('Error clearing email connections:', error);
  }
}
