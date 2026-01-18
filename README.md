# Subloop

A minimal subscription manager that helps users track their subscriptions.

## Tech Stack

- **React 18** with **TypeScript**
- **Vite** for build tooling
- **Tailwind CSS** for styling (mapped to Figma tokens)
- **React Router** for routing
- **Stripe** for payments

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Stripe account (for payment integration)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory (copy from `.env.example`):

```env
# Stripe Publishable Key (Test Mode)
# Get your test key from: https://dashboard.stripe.com/test/apikeys
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_test_key_here

# Google OAuth Client ID (Required for Gmail signup/connection)
# Get your client ID from: https://console.cloud.google.com/apis/credentials
# See setup instructions below
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
```

#### Google OAuth Setup (Required for Gmail Signup)

1. **Create a Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Enable Gmail API**
   - Navigate to [APIs & Services > Library](https://console.cloud.google.com/apis/library)
   - Search for "Gmail API" and enable it

3. **Create OAuth Credentials**
   - Go to [APIs & Services > Credentials](https://console.cloud.google.com/apis/credentials)
   - Click "Create Credentials" > "OAuth client ID"
   - If prompted, configure the OAuth consent screen first:
     - User Type: External (for testing)
     - App name: "Subloop"
     - User support email: Your email
     - Add scopes: `openid`, `email`, `profile`, `https://www.googleapis.com/auth/gmail.readonly`
     - Add test users: Your email address
   - Application type: **Web application**
   - Name: "Subloop Web Client"
   - Authorized redirect URIs:
     - `http://localhost:3000/auth/google/callback` (for development)
     - `https://yourdomain.com/auth/google/callback` (for production)
   - Click "Create"
   - Copy the **Client ID** (not the Client Secret - we don't need it in frontend)

4. **Add to .env file**
   - Open `.env` file in the project root
   - Set `VITE_GOOGLE_CLIENT_ID` to your Client ID

5. **Restart dev server**
   - Stop the dev server (Ctrl+C)
   - Run `npm run dev` again to load the new environment variable

**Note:** The Stripe integration requires a backend API endpoint at `/api/create-checkout-session` to create checkout sessions securely. See "Stripe Integration" section below.

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build

```bash
npm run build
```

### Type Checking

```bash
npm run type-check
```

## Project Structure

```
src/
├── components/     # Reusable UI components
│   └── Layout/    # Layout components (AppLayout, etc.)
├── config/        # Configuration files
│   └── tokens.ts  # Figma design tokens
├── pages/         # Page components
├── services/      # Service modules (auth, stripe)
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

## Stripe Integration

The app uses Stripe Checkout for payment processing. To complete the integration:

1. **Backend API Endpoint Required**: Create a backend API endpoint at `/api/create-checkout-session` that:
   - Accepts POST requests with `planType` (`pro-monthly`, `pro-yearly`, `lifetime`)
   - Uses your Stripe secret key to create a Checkout Session
   - Returns `{ sessionId: string, url: string }` where `url` is the Stripe Checkout URL

2. **Example Backend Implementation** (Node.js/Express):
   ```javascript
   const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

   app.post('/api/create-checkout-session', async (req, res) => {
     const { planType, successUrl, cancelUrl } = req.body;

     const session = await stripe.checkout.sessions.create({
       payment_method_types: ['card'],
       line_items: [{
         price_data: {
           currency: 'usd',
           product_data: { name: 'Subloop Pro' },
           unit_amount: planType === 'lifetime' ? 19900 : planType === 'pro-yearly' ? 9000 : 900,
           recurring: planType !== 'lifetime' ? {
             interval: planType === 'pro-yearly' ? 'year' : 'month',
           } : undefined,
         },
         quantity: 1,
       }],
       mode: planType === 'lifetime' ? 'payment' : 'subscription',
       success_url: successUrl,
       cancel_url: cancelUrl,
     });

     res.json({ sessionId: session.id, url: session.url });
   });
   ```

3. **Test Cards**: Use Stripe test cards like `4242 4242 4242 4242` with any future expiry date and CVC.

## Design Tokens

All UI styling uses Figma design tokens from `src/config/tokens.ts`. The UI must match Figma spacing, typography, colors, and hierarchy exactly (per PRD Section 3).

## Development Guidelines

- Use semantic HTML elements
- Ensure all components are accessible (ARIA labels, keyboard navigation)
- Mobile-responsive design required
- No placeholder colors, fonts, or spacing — all must come from Figma tokens
- Keep architecture simple and readable

## Documentation

See [PRD.md](./PRD.md) for complete product requirements and specifications.
