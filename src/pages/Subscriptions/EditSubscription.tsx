import { useParams, useNavigate } from 'react-router-dom';
import { SubscriptionForm } from './SubscriptionForm';

// Mock subscription data - in production this would come from an API
const mockSubscriptionData: Record<string, any> = {
  '1': {
    id: '1',
    name: 'Netflix',
    price: 24.99,
    cycle: 'Monthly',
    paymentMethod: 'Visa ****4567',
    startedOn: new Date('2025-12-16'),
    renewalDate: new Date('2026-01-16'),
    status: 'Active',
    notes: 'I want to see Stranger Things last season. Should cancel the subscription after finishing watching it.',
    reminder: true,
  },
  '2': {
    id: '2',
    name: 'Spotify',
    price: 143.88,
    cycle: 'Annually',
    paymentMethod: 'PayPal',
    startedOn: new Date('2025-10-04'),
    renewalDate: new Date('2026-10-04'),
    status: 'Inactive',
    notes: '',
    reminder: true,
  },
  '7': {
    id: '7',
    name: 'Dropbox',
    price: 119.88,
    cycle: 'Annually',
    paymentMethod: 'Unknown',
    startedOn: new Date('2026-01-18'),
    renewalDate: new Date('2027-01-18'),
    status: 'Review',
    notes: '',
    reminder: true,
  },
};

function formatDateForInput(date: Date | string | undefined): string {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  return d.toISOString().split('T')[0];
}

export default function EditSubscription() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const subscription = id ? mockSubscriptionData[id] : null;

  if (!subscription) {
    return (
      <div className="pt-12 pb-8">
        <p className="text-white">Subscription not found</p>
        <button
          onClick={() => navigate('/app/subscriptions')}
          className="text-brand-primary-500 hover:text-brand-primary-400"
        >
          Back to subscriptions
        </button>
      </div>
    );
  }

  // Prepare initial form data from subscription
  const initialData = {
    name: subscription.name || '',
    price: subscription.price?.toString() || '',
    currency: subscription.currency || 'USD',
    cycle: subscription.cycle || 'Monthly',
    paymentMethod: subscription.paymentMethod || '',
    startedOn: formatDateForInput(subscription.startedOn),
    renewalDate: formatDateForInput(subscription.renewalDate),
    reminder: subscription.reminder !== undefined ? subscription.reminder : true,
    status: subscription.status || 'Active',
    notes: subscription.notes || '',
  };

  const handleSubmit = (formData: any) => {
    // Mock save logic - will be replaced with API call
    console.log('Save subscription changes:', { id, ...formData });
    navigate(`/app/subscription/${id}`);
  };

  const handleCancel = () => {
    navigate(`/app/subscription/${id}`);
  };

  return (
    <SubscriptionForm
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      submitLabel="Save changes"
      title={subscription.name}
    />
  );
}
