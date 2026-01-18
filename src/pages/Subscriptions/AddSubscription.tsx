import { useNavigate } from 'react-router-dom';
import { SubscriptionForm } from './SubscriptionForm';
import { createSubscription } from '@/services/subscriptionsStorage';

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

export default function AddSubscription() {
  const navigate = useNavigate();

  const handleSubmit = (formData: SubscriptionFormData) => {
    // Create subscription in storage
    const newSubscription = createSubscription({
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

    // Redirect to detail view
    navigate(`/app/subscription/${newSubscription.id}`);
  };

  const handleCancel = () => {
    navigate('/app/subscriptions');
  };

  return (
    <SubscriptionForm
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      submitLabel="Add subscription"
      title="Add new"
    />
  );
}
