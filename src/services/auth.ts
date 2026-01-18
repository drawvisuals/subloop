/**
 * Mock authentication service for development/testing
 * In production, this would connect to a real backend API
 */

interface User {
  email: string;
  password: string;
}

// Mock user storage - in production this would be handled by the backend
const MOCK_USERS_KEY = 'subloop_mock_users';

// Initialize with the test user if localStorage is available
function initializeMockUsers(): User[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(MOCK_USERS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }

    // Create initial test user
    const initialUsers: User[] = [
      { email: 'ze_casal@hotmail.com', password: '1234' },
    ];
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(initialUsers));
    return initialUsers;
  } catch (error) {
    console.error('Failed to initialize mock users:', error);
    return [{ email: 'ze_casal@hotmail.com', password: '1234' }];
  }
}

function getMockUsers(): User[] {
  if (typeof window === 'undefined') return initializeMockUsers();

  try {
    const stored = localStorage.getItem(MOCK_USERS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return initializeMockUsers();
  } catch (error) {
    console.error('Failed to get mock users:', error);
    return initializeMockUsers();
  }
}

function saveMockUsers(users: User[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Failed to save mock users:', error);
  }
}

/**
 * Mock signup function
 */
export async function mockSignup(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const users = getMockUsers();

  // Check if user already exists
  if (users.find(u => u.email === email)) {
    return { success: false, error: 'An account with this email already exists' };
  }

  // Add new user
  users.push({ email, password });
  saveMockUsers(users);

  // Store current session
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('subloop_current_user', email);
    setAuthProvider('email');
  }

  return { success: true };
}

/**
 * Mock login function
 */
export async function mockLogin(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const users = getMockUsers();

  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return { success: false, error: 'Invalid email or password' };
  }

  // Store current session
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('subloop_current_user', email);
    setAuthProvider('email');
  }

  return { success: true };
}

/**
 * Mock logout function
 */
export function mockLogout(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('subloop_current_user');
    sessionStorage.removeItem('subloop_auth_provider');
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return !!sessionStorage.getItem('subloop_current_user');
}

/**
 * Get current user email
 */
export function getCurrentUser(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('subloop_current_user');
}

/**
 * Get current user's auth provider
 */
export function getAuthProvider(): 'google' | 'microsoft' | 'email' | null {
  if (typeof window === 'undefined') return null;
  return (sessionStorage.getItem('subloop_auth_provider') as 'google' | 'microsoft' | 'email') || null;
}

/**
 * Set auth provider for current session
 */
export function setAuthProvider(provider: 'google' | 'microsoft' | 'email'): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('subloop_auth_provider', provider);
  }
}

/**
 * Mock Google OAuth login
 * In production, this would use Google OAuth flow
 */
export async function mockGoogleLogin(): Promise<{ success: boolean; email?: string; error?: string }> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock: For demo purposes
  // In production, this would:
  // 1. Redirect to Google OAuth
  // 2. Get authorization code
  // 3. Exchange for access/refresh tokens
  // 4. Get user email from Google API

  if (typeof window === 'undefined') {
    return { success: false, error: 'Not available' };
  }

  // Get existing user email if already logged in (preserve account identity)
  let accountEmail = sessionStorage.getItem('subloop_current_user');

  // If no existing session, check if there's a mock user we should use
  // (e.g., if they previously logged in with email/password)
  if (!accountEmail) {
    const mockUsers = getMockUsers();
    // Use the default test user email if available
    if (mockUsers.length > 0) {
      accountEmail = mockUsers[0].email;
    } else {
      accountEmail = 'ze_casal@hotmail.com';
    }
  }

  // Mock Gmail email for the Google account (for scanning)
  // In production, this would come from Google OAuth user info
  // The Gmail email can be different from the account email
  const gmailEmail = accountEmail.includes('@')
    ? accountEmail.replace(/@.*$/, '@gmail.com')
    : `${accountEmail}@gmail.com`;

  // Store session with account email (not Gmail email)
  sessionStorage.setItem('subloop_current_user', accountEmail);
  setAuthProvider('google');

  // Import here to avoid circular dependency
  const { createEmailConnection } = await import('./emailConnectionsStorage');

  // Automatically create Gmail connection with Gmail email and mock tokens
  const mockAccessToken = `google_access_token_${Date.now()}`;
  const mockRefreshToken = `google_refresh_token_${Date.now()}`;
  const expiresAt = new Date(Date.now() + 3600 * 1000).toISOString(); // 1 hour from now

  createEmailConnection(
    'gmail',
    gmailEmail, // Gmail email for scanning
    mockAccessToken,
    mockRefreshToken,
    expiresAt
  );

  return { success: true, email: accountEmail };
}

/**
 * Mock Microsoft OAuth login
 * In production, this would use Microsoft OAuth flow
 */
export async function mockMicrosoftLogin(): Promise<{ success: boolean; email?: string; error?: string }> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock: For demo purposes, use a default Outlook account
  // In production, this would:
  // 1. Redirect to Microsoft OAuth
  // 2. Get authorization code
  // 3. Exchange for access/refresh tokens
  // 4. Get user email from Microsoft Graph API

  const mockEmail = 'ze_casal@outlook.com'; // Mock Outlook address

  // Store session
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('subloop_current_user', mockEmail);
    setAuthProvider('microsoft');

    // Import here to avoid circular dependency
    const { createEmailConnection } = await import('./emailConnectionsStorage');

    // Automatically create Outlook connection with mock tokens
    const mockAccessToken = `microsoft_access_token_${Date.now()}`;
    const mockRefreshToken = `microsoft_refresh_token_${Date.now()}`;
    const expiresAt = new Date(Date.now() + 3600 * 1000).toISOString(); // 1 hour from now

    createEmailConnection(
      'outlook',
      mockEmail,
      mockAccessToken,
      mockRefreshToken,
      expiresAt
    );
  }

  return { success: true, email: mockEmail };
}
