import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MarketingLayout } from '@/components/Layout';
import { Button } from '@/components/Auth';
import { CheckCircle2 } from 'lucide-react';

export default function CheckoutSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // In production, you would verify the session with your backend
    // and update the user's plan in your database
    if (sessionId) {
      // Mock: Store successful checkout in localStorage for testing
      // In production, this would be handled by your backend
      console.log('Checkout session confirmed:', sessionId);
    }
  }, [sessionId]);

  return (
    <MarketingLayout>
      <div className="pt-16 pb-20">
        <div className="max-w-2xl mx-auto flex flex-col gap-8 items-center text-center">
          <div className="w-16 h-16 rounded-full bg-success-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-text-success" />
          </div>

          <div className="flex flex-col gap-4">
            <h1 className="font-semibold text-3xl leading-9 text-text-primary">
              Payment successful!
            </h1>
            <p className="font-normal text-base leading-[22px] text-text-secondary max-w-lg">
              Thank you for subscribing to Pro. Your account has been upgraded and you now have access to all Pro features.
            </p>
          </div>

          <div className="flex gap-4 mt-4">
            <Button onClick={() => navigate('/app/subscriptions')}>
              Go to app
            </Button>
            <button
              type="button"
              onClick={() => navigate('/app/profile')}
              className="px-6 py-4 text-base font-medium text-text-primary hover:text-text-primary/80 transition-colors"
            >
              View account
            </button>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
