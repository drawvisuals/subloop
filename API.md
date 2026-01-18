# Subloop API Documentation

This document describes the backend API endpoints and data models for Subloop.

## Base URL

All API endpoints are prefixed with `/api` (or configured via `VITE_API_BASE_URL`).

Authentication is handled via cookies/session (credentials: 'include').

## Data Models

### User

```typescript
interface User {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  auth_provider: 'google' | 'email';
  plan: 'free' | 'pro-monthly' | 'pro-yearly' | 'lifetime';
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
  last_login: string | null; // ISO 8601
}
```

### Subscription

```typescript
interface Subscription {
  id: string;
  user_id: string;
  name: string;
  price: number;
  currency: string; // ISO 4217 (e.g., 'USD')
  cycle: 'monthly' | 'yearly' | 'weekly' | 'quarterly' | 'one-time';
  payment_method: string | null;
  started_on: string | null; // ISO 8601
  renewal_date: string | null; // ISO 8601
  status: 'active' | 'review' | 'inactive';
  notes: string | null;
  source: 'email' | 'browser' | 'manual';
  reminder_enabled: boolean;
  cancellation_link: string | null;
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}
```

### Email Connection

```typescript
interface EmailConnection {
  id: string;
  user_id: string;
  provider: 'gmail' | 'outlook' | 'icloud' | 'imap';
  email: string;
  connected: boolean;
  access_token: string | null; // Not exposed in API responses
  refresh_token: string | null; // Not exposed in API responses
  token_expires_at: string | null; // ISO 8601
  last_scan_date: string | null; // ISO 8601
  last_scan_status: 'success' | 'error' | null;
  last_scan_error: string | null;
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}
```

### Plan

```typescript
interface Plan {
  id: string;
  name: string;
  plan_type: 'free' | 'pro-monthly' | 'pro-yearly' | 'lifetime';
  price_monthly: number | null;
  price_yearly: number | null;
  price_lifetime: number | null;
  currency: string;
  features: string[];
  is_active: boolean;
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}
```

## API Endpoints

### Users

#### `GET /api/users/me`
Get current authenticated user.

**Response:** `User`

#### `POST /api/users`
Create a new user account.

**Request Body:**
```typescript
{
  email: string;
  password?: string;
  name?: string;
  auth_provider: 'google' | 'email';
  google_id?: string;
}
```

**Response:** `User`

#### `PATCH /api/users/me`
Update current user.

**Request Body:**
```typescript
{
  name?: string;
  avatar_url?: string;
}
```

**Response:** `User`

#### `DELETE /api/users/me`
Delete current user account.

**Response:** `204 No Content`

---

### Subscriptions

#### `GET /api/subscriptions`
Get all subscriptions for current user.

**Query Parameters:**
- `page?: number` - Page number (default: 1)
- `limit?: number` - Items per page (default: 50)
- `status?: string` - Filter by status
- `search?: string` - Search by name

**Response:**
```typescript
{
  data: Subscription[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}
```

#### `GET /api/subscriptions/:id`
Get a single subscription by ID.

**Response:** `Subscription`

#### `POST /api/subscriptions`
Create a new subscription.

**Request Body:**
```typescript
{
  name: string;
  price: number;
  currency: string;
  cycle: 'monthly' | 'yearly' | 'weekly' | 'quarterly' | 'one-time';
  payment_method?: string | null;
  started_on?: string | null;
  renewal_date?: string | null;
  status?: 'active' | 'review' | 'inactive';
  notes?: string | null;
  reminder_enabled?: boolean;
  cancellation_link?: string | null;
}
```

**Response:** `Subscription`

#### `PATCH /api/subscriptions/:id`
Update an existing subscription.

**Request Body:** Same as POST (all fields optional)

**Response:** `Subscription`

#### `DELETE /api/subscriptions/:id`
Delete a subscription.

**Response:** `204 No Content`

#### `GET /api/subscriptions/export?format=csv|xls|pdf`
Export subscriptions.

**Response:** `Blob` (file download)

---

### Email Connections

#### `GET /api/email-connections`
Get all email connections for current user.

**Response:** `EmailConnection[]`

#### `GET /api/email-connections/:id`
Get a single email connection by ID.

**Response:** `EmailConnection`

#### `POST /api/email-connections`
Create a new email connection.

**Request Body:**
```typescript
{
  provider: 'gmail' | 'outlook' | 'icloud' | 'imap';
  email: string;
  access_token: string;
  refresh_token?: string;
  token_expires_at?: string | null;
}
```

**Response:** `EmailConnection`

#### `PATCH /api/email-connections/:id`
Update an email connection.

**Request Body:**
```typescript
{
  connected?: boolean;
  access_token?: string;
  refresh_token?: string;
  token_expires_at?: string | null;
}
```

**Response:** `EmailConnection`

#### `DELETE /api/email-connections/:id`
Delete an email connection.

**Response:** `204 No Content`

#### `POST /api/email-connections/:id/scan`
Trigger a scan for a specific email connection.

**Response:**
```typescript
{
  message: string;
}
```

#### `POST /api/email-connections/scan-all`
Trigger a scan for all email connections.

**Response:**
```typescript
{
  message: string;
}
```

---

### Plans

#### `GET /api/plans`
Get all available plans.

**Response:** `Plan[]`

#### `GET /api/plans/:id`
Get a single plan by ID.

**Response:** `Plan`

#### `GET /api/plans/current`
Get current user's plan details.

**Response:** `Plan`

---

## Error Responses

All error responses follow this format:

```typescript
{
  message: string;
  code?: string;
  errors?: Record<string, string[]>; // Field-level validation errors
}
```

**HTTP Status Codes:**
- `200 OK` - Success
- `201 Created` - Resource created
- `204 No Content` - Success (no content)
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Permission denied
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Implementation Notes

- All dates are ISO 8601 strings
- Currency codes follow ISO 4217 standard
- Pagination defaults to page 1, limit 50
- Authentication is handled via session cookies
- All endpoints require authentication except public routes (e.g., user signup)
