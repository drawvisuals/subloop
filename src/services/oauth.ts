/**
 * OAuth service for connecting email providers
 * In production, this would handle full OAuth flows with redirects
 */

import { EmailProvider } from './emailConnectionsStorage';
import { createEmailConnection, getEmailConnectionByProvider } from './emailConnectionsStorage';
import { getAuthProvider } from './auth';

/**
 * Connect Gmail via OAuth
 * In production, this would redirect to Google OAuth, then handle callback
 */
export async function connectGmail(): Promise<{ success: boolean; email?: string; error?: string }> {
  // Simulate OAuth flow delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  try {
    // Check if already connected
    const existing = getEmailConnectionByProvider('gmail');
    if (existing && existing.connected) {
      return { success: true, email: existing.email };
    }

    // Mock: Get current user email and derive Gmail if using Google login
    const authProvider = getAuthProvider();
    const userEmail = sessionStorage.getItem('subloop_current_user');

    let gmailEmail: string;
    if (authProvider === 'google' && userEmail) {
      // If logged in with Google, use that email
      gmailEmail = userEmail;
    } else {
      // Otherwise, prompt for Gmail (in production, OAuth would get this)
      // For now, use a mock Gmail address based on current user
      gmailEmail = userEmail?.replace(/@.*$/, '@gmail.com') || 'user@gmail.com';
    }

    // Mock tokens - in production these come from OAuth flow
    const mockAccessToken = `gmail_access_token_${Date.now()}`;
    const mockRefreshToken = `gmail_refresh_token_${Date.now()}`;
    const expiresAt = new Date(Date.now() + 3600 * 1000).toISOString(); // 1 hour from now

    createEmailConnection(
      'gmail',
      gmailEmail,
      mockAccessToken,
      mockRefreshToken,
      expiresAt
    );

    return { success: true, email: gmailEmail };
  } catch (error) {
    console.error('Error connecting Gmail:', error);
    return { success: false, error: 'Failed to connect Gmail' };
  }
}

/**
 * Connect Outlook via OAuth
 * In production, this would redirect to Microsoft OAuth, then handle callback
 */
export async function connectOutlook(): Promise<{ success: boolean; email?: string; error?: string }> {
  // Simulate OAuth flow delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  try {
    // Check if already connected
    const existing = getEmailConnectionByProvider('outlook');
    if (existing && existing.connected) {
      return { success: true, email: existing.email };
    }

    // Mock: Get current user email and derive Outlook if using Microsoft login
    const authProvider = getAuthProvider();
    const userEmail = sessionStorage.getItem('subloop_current_user');

    let outlookEmail: string;
    if (authProvider === 'microsoft' && userEmail) {
      // If logged in with Microsoft, use that email
      outlookEmail = userEmail;
    } else {
      // Otherwise, prompt for Outlook (in production, OAuth would get this)
      // For now, use a mock Outlook address based on current user
      outlookEmail = userEmail?.replace(/@.*$/, '@outlook.com') || 'user@outlook.com';
    }

    // Mock tokens - in production these come from OAuth flow
    const mockAccessToken = `outlook_access_token_${Date.now()}`;
    const mockRefreshToken = `outlook_refresh_token_${Date.now()}`;
    const expiresAt = new Date(Date.now() + 3600 * 1000).toISOString(); // 1 hour from now

    createEmailConnection(
      'outlook',
      outlookEmail,
      mockAccessToken,
      mockRefreshToken,
      expiresAt
    );

    return { success: true, email: outlookEmail };
  } catch (error) {
    console.error('Error connecting Outlook:', error);
    return { success: false, error: 'Failed to connect Outlook' };
  }
}
