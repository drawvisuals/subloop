import { useParams, useNavigate } from 'react-router-dom';
import { SubscriptionForm } from './SubscriptionForm';
import { getSubscription, updateSubscription } from '@/services/subscriptionsStorage';

interface SubscriptionFormData {
  name: string;
  price: string;
  currency: string;
  cycle: 'Monthly' | 'Annually';
  paymentMethod: string;
  startedOn: string;
  renewalDate: string;
  reminder: boolean;
  status: 'Active' | 'Inactive' | 'Review';
  notes: string;
}

function formatDateForInput(date: Date | string | undefined): string {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  return d.toISOString().split('T')[0];
}

export default function EditSubscription() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const subscription = id ? getSubscription(id) : null;

  if (!subscription || !id) {
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

  const handleSubmit = (formData: SubscriptionFormData) => {
    // Update subscription in storage
    updateSubscription(id, {
      name: formData.name,
      price: parseFloat(formData.price),
      currency: formData.currency,
      cycle: formData.cycle,
      paymentMethod: formData.paymentMethod,
      startedOn: formData.startedOn ? new Date(formData.startedOn) : new Date(),
      renewalDate: formData.renewalDate ? new Date(formData.renewalDate) : new Date(),
      status: formData.status,
      notes: formData.notes || '',
      reminder: formData.reminder,
    });

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
