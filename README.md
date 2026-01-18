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

Create a `.env` file in the root directory:

```env
# Stripe Publishable Key (Test Mode)
# Get your test key from: https://dashboard.stripe.com/test/apikeys
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_test_key_here
```

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
