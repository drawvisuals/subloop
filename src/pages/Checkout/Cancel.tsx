import { useNavigate } from 'react-router-dom';
import { MarketingLayout } from '@/components/Layout';
import { Button } from '@/components/Auth';
import { XCircle } from 'lucide-react';

export default function CheckoutCancel() {
  const navigate = useNavigate();

  return (
    <MarketingLayout>
      <div className="pt-16 pb-20">
        <div className="max-w-2xl mx-auto flex flex-col gap-8 items-center text-center">
          <div className="w-16 h-16 rounded-full bg-neutral-700/20 flex items-center justify-center">
            <XCircle className="w-8 h-8 text-neutral-700" />
          </div>

          <div className="flex flex-col gap-4">
            <h1 className="font-semibold text-3xl leading-9 text-white">
              Checkout cancelled
            </h1>
            <p className="font-normal text-base leading-[22px] text-neutral-700 max-w-lg">
              Your checkout was cancelled. No charges were made. You can continue using Subloop with the Free plan.
            </p>
          </div>

          <div className="flex gap-4 mt-4">
            <Button onClick={() => navigate('/pricing')}>
              Back to pricing
            </Button>
            <button
              type="button"
              onClick={() => navigate('/app/subscriptions')}
              className="px-6 py-4 text-base font-medium text-white hover:text-white/80 transition-colors"
            >
              Continue with Free
            </button>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
