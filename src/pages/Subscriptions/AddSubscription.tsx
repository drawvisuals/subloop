import { useNavigate } from 'react-router-dom';
import { SubscriptionForm } from './SubscriptionForm';

export default function AddSubscription() {
  const navigate = useNavigate();

  const handleSubmit = (formData: any) => {
    // Mock save logic - will be replaced with API call
    console.log('Add subscription:', formData);
    navigate('/app/subscriptions');
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
