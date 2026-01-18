import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/Layout';
import { Input } from '@/components/Auth';
import { Button } from '@/components/Auth';
import { ChevronDown } from 'lucide-react';

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

interface SubscriptionFormProps {
  initialData?: Partial<SubscriptionFormData>;
  onSubmit: (data: SubscriptionFormData) => void;
  onCancel: () => void;
  submitLabel?: string;
  title?: string;
}

export function SubscriptionForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'Add subscription',
  title = 'Add new',
}: SubscriptionFormProps) {
  const [formData, setFormData] = useState<SubscriptionFormData>({
    name: '',
    price: '',
    currency: 'USD',
    cycle: 'Monthly',
    paymentMethod: '',
    startedOn: '',
    renewalDate: '',
    reminder: true,
    status: 'Active',
    notes: '',
    ...initialData,
  });

  // Update form data when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showCycleDropdown, setShowCycleDropdown] = useState(false);
  const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

  const paymentMethods = ['Visa', 'Mastercard', 'PayPal', 'Apple Pay', 'Google Pay', 'Unknown'];
  const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];
  const cycles: ('Monthly' | 'Annually')[] = ['Monthly', 'Annually'];
  const statuses: ('Active' | 'Inactive' | 'Review')[] = ['Active', 'Inactive', 'Review'];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatDateForInput = (date: Date | string | undefined): string => {
    if (!date) return '';
    const d = date instanceof Date ? date : new Date(date);
    return d.toISOString().split('T')[0];
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }

    if (!formData.cycle) {
      newErrors.cycle = 'Cycle is required';
    }

    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Payment method is required';
    }

    if (!formData.startedOn) {
      newErrors.startedOn = 'Started date is required';
    }

    if (!formData.renewalDate) {
      newErrors.renewalDate = 'Renewal date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  return (
    <AppLayout>
      <div className="pt-12 pb-8">
        <div className="w-full max-w-[438px] flex flex-col gap-6 items-start">
          {/* Breadcrumb */}
          <p className="font-mono font-normal text-sm leading-5 text-neutral-700">
            Subscriptions / <span className="text-white">{title}</span>
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-8 items-center">
            {/* Name */}
            <Input
              label="Name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter subscription name"
              error={errors.name}
            />

            {/* Price + Currency */}
            <div className="w-full flex gap-1 items-start">
              <div className="flex-1">
                <Input
                  label="Price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="0.00"
                  error={errors.price}
                />
              </div>
              <div className="flex-1">
                <div className="flex flex-col gap-2 items-start w-full">
                  <label className="h-4 leading-[22px] text-neutral-700 text-base tracking-tight whitespace-pre-wrap">
                    Currency
                  </label>
                  <div className="relative w-full">
                    <button
                      type="button"
                      onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                      className="w-full h-[62px] px-4 py-5 bg-neutral-50 border-2 border-neutral-200 rounded-lg flex items-center justify-between text-white text-base leading-[22px] tracking-tight hover:border-brand-primary-500 transition-colors"
                    >
                      <span>{formData.currency}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    {showCurrencyDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-neutral-50 border border-neutral-200 rounded-lg overflow-hidden">
                        {currencies.map((currency) => (
                          <button
                            key={currency}
                            type="button"
                            onClick={() => {
                              handleInputChange('currency', currency);
                              setShowCurrencyDropdown(false);
                            }}
                            className="w-full px-4 py-3 text-left text-white text-base hover:bg-neutral-200 transition-colors"
                          >
                            {currency}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Cycle */}
            <div className="w-full flex gap-1 items-start">
              <div className="flex-1">
                <div className="flex flex-col gap-2 items-start w-full">
                  <label className="h-4 leading-[22px] text-neutral-700 text-base tracking-tight whitespace-pre-wrap">
                    Cycle
                  </label>
                  <div className="relative w-full">
                    <button
                      type="button"
                      onClick={() => setShowCycleDropdown(!showCycleDropdown)}
                      className="w-full h-[62px] px-4 py-5 bg-neutral-50 border-2 border-neutral-200 rounded-lg flex items-center justify-between text-white text-base leading-[22px] tracking-tight hover:border-brand-primary-500 transition-colors"
                    >
                      <span>{formData.cycle}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    {showCycleDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-neutral-50 border border-neutral-200 rounded-lg overflow-hidden">
                        {cycles.map((cycle) => (
                          <button
                            key={cycle}
                            type="button"
                            onClick={() => {
                              handleInputChange('cycle', cycle);
                              setShowCycleDropdown(false);
                            }}
                            className="w-full px-4 py-3 text-left text-white text-base hover:bg-neutral-200 transition-colors"
                          >
                            {cycle}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.cycle && (
                    <p className="text-sm text-danger-500 leading-[22px]">{errors.cycle}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="w-full">
              <div className="flex flex-col gap-2 items-start w-full">
                <label className="h-4 leading-[22px] text-neutral-700 text-base tracking-tight whitespace-pre-wrap">
                  Payment method
                </label>
                <div className="relative w-full">
                  <button
                    type="button"
                    onClick={() => setShowPaymentDropdown(!showPaymentDropdown)}
                    className="w-full h-[62px] px-4 py-5 bg-neutral-50 border-2 border-neutral-200 rounded-lg flex items-center justify-between text-white text-base leading-[22px] tracking-tight hover:border-brand-primary-500 transition-colors"
                  >
                    <span>{formData.paymentMethod || 'Select payment method'}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {showPaymentDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-neutral-50 border border-neutral-200 rounded-lg overflow-hidden">
                      {paymentMethods.map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => {
                            handleInputChange('paymentMethod', method);
                            setShowPaymentDropdown(false);
                          }}
                          className="w-full px-4 py-3 text-left text-white text-base hover:bg-neutral-200 transition-colors"
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {errors.paymentMethod && (
                  <p className="text-sm text-danger-500 leading-[22px]">{errors.paymentMethod}</p>
                )}
              </div>
            </div>

            {/* Started On + Renewal Date */}
            <div className="w-full flex gap-1 items-start">
              <div className="flex-1">
                <Input
                  label="Started on"
                  type="date"
                  value={formData.startedOn}
                  onChange={(e) => handleInputChange('startedOn', e.target.value)}
                  error={errors.startedOn}
                />
              </div>
              <div className="flex-1">
                <Input
                  label="Renewal date"
                  type="date"
                  value={formData.renewalDate}
                  onChange={(e) => handleInputChange('renewalDate', e.target.value)}
                  error={errors.renewalDate}
                />
              </div>
            </div>

            {/* Reminder Checkbox */}
            <div className="w-full">
              <label className="flex gap-3 items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.reminder}
                  onChange={(e) => handleInputChange('reminder', e.target.checked)}
                  className="w-5 h-5 rounded border-neutral-200 text-brand-primary-500 focus:ring-brand-primary-500 cursor-pointer"
                />
                <span className="font-normal text-base leading-[22px] text-white tracking-tight">
                  Reminder
                </span>
              </label>
            </div>

            {/* Status */}
            <div className="w-full">
              <div className="flex flex-col gap-2 items-start w-full">
                <label className="h-4 leading-[22px] text-neutral-700 text-base tracking-tight whitespace-pre-wrap">
                  Status
                </label>
                <div className="relative w-full">
                  <button
                    type="button"
                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                    className="w-full h-[62px] px-4 py-5 bg-neutral-50 border-2 border-neutral-200 rounded-lg flex items-center justify-between text-white text-base leading-[22px] tracking-tight hover:border-brand-primary-500 transition-colors"
                  >
                    <span>{formData.status}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {showStatusDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-neutral-50 border border-neutral-200 rounded-lg overflow-hidden">
                      {statuses.map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => {
                            handleInputChange('status', status);
                            setShowStatusDropdown(false);
                          }}
                          className="w-full px-4 py-3 text-left text-white text-base hover:bg-neutral-200 transition-colors"
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="w-full">
              <div className="flex flex-col gap-2 items-start w-full">
                <label className="h-4 leading-[22px] text-neutral-700 text-base tracking-tight whitespace-pre-wrap">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Add notes..."
                  rows={4}
                  className="w-full px-4 py-5 bg-neutral-50 border-2 border-neutral-200 rounded-lg text-white text-base leading-[22px] tracking-tight placeholder:text-neutral-700 focus:outline-none focus:border-brand-primary-500 resize-none"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="w-full flex gap-3 items-center">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 h-[54px] px-6 py-4 bg-neutral-200 border border-neutral-50 rounded-lg flex items-center justify-center font-semibold text-base leading-[22px] text-white hover:bg-neutral-300 transition-colors"
              >
                Cancel
              </button>
              <Button type="submit" className="flex-1">
                {submitLabel}
              </Button>
            </div>
          </form>

          {/* Click outside to close dropdowns */}
          {(showCycleDropdown || showPaymentDropdown || showStatusDropdown || showCurrencyDropdown) && (
            <div
              className="fixed inset-0 z-0"
              onClick={() => {
                setShowCycleDropdown(false);
                setShowPaymentDropdown(false);
                setShowStatusDropdown(false);
                setShowCurrencyDropdown(false);
              }}
              aria-hidden="true"
            />
          )}
        </div>
      </div>
    </AppLayout>
  );
}
