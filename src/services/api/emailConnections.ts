/**
 * Email Connection API service
 * Defines the contract for email connection-related API endpoints
 */

import {
  EmailConnection,
  CreateEmailConnectionInput,
  UpdateEmailConnectionInput,
} from '@/types/models';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Get all email connections for current user
 */
export async function getEmailConnections(): Promise<EmailConnection[]> {
  const response = await fetch(`${API_BASE_URL}/email-connections`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to get email connections');
  }

  return response.json();
}

/**
 * Get a single email connection by ID
 */
export async function getEmailConnection(id: string): Promise<EmailConnection> {
  const response = await fetch(`${API_BASE_URL}/email-connections/${id}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to get email connection');
  }

  return response.json();
}

/**
 * Create a new email connection
 */
export async function createEmailConnection(
  input: CreateEmailConnectionInput
): Promise<EmailConnection> {
  const response = await fetch(`${API_BASE_URL}/email-connections`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create email connection');
  }

  return response.json();
}

/**
 * Update an existing email connection
 */
export async function updateEmailConnection(
  id: string,
  input: UpdateEmailConnectionInput
): Promise<EmailConnection> {
  const response = await fetch(`${API_BASE_URL}/email-connections/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update email connection');
  }

  return response.json();
}

/**
 * Delete an email connection
 */
export async function deleteEmailConnection(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/email-connections/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete email connection');
  }
}

/**
 * Trigger a scan for a specific email connection
 */
export async function scanEmailConnection(id: string): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/email-connections/${id}/scan`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to scan email connection');
  }

  return response.json();
}

/**
 * Trigger a scan for all email connections
 */
export async function scanAllEmailConnections(): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/email-connections/scan-all`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to scan email connections');
  }

  return response.json();
}
