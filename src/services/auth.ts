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
  }

  return { success: true };
}

/**
 * Mock logout function
 */
export function mockLogout(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('subloop_current_user');
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
