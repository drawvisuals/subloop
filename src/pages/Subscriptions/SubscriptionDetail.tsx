import { useParams, Link, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/Layout';
import { Copy, PenLine, Trash2, Bell, TriangleAlert } from 'lucide-react';
import { shouldBeInReviewState, getReviewReasons } from '@/utils/subscriptionHelpers';

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
	},
};

function formatDate(date: Date): string {
	return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getDaysUntilRenewal(date: Date): number {
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const renewal = new Date(date);
	renewal.setHours(0, 0, 0, 0);
	const diffTime = renewal.getTime() - today.getTime();
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	return diffDays;
}

export default function SubscriptionDetail() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();

	const subscription = id ? mockSubscriptionData[id] : null;

	if (!subscription) {
		return (
			<AppLayout>
				<div className="pt-12 pb-8">
					<p className="text-white">Subscription not found</p>
					<Link to="/app/subscriptions" className="text-brand-primary-500 hover:text-brand-primary-400">
						Back to subscriptions
					</Link>
				</div>
			</AppLayout>
		);
	}

	const daysUntilRenewal = getDaysUntilRenewal(subscription.renewalDate);
	const showRenewalWarning = daysUntilRenewal <= 7 && daysUntilRenewal > 0 && subscription.status === 'Active';
	const hasUnknownPaymentMethod = subscription.paymentMethod === 'Unknown';

	// Calculate review state dynamically
	const isInReview = shouldBeInReviewState(subscription);
	const reviewReasons = getReviewReasons(subscription);
	const displayStatus = isInReview ? 'Review' : subscription.status;

	const handleCopy = () => {
		// Mock copy logic
		console.log('Copy subscription details');
	};

	const handleEdit = () => {
		navigate(`/app/subscription/${id}/edit`);
	};

	const handleDelete = () => {
		// Mock delete logic
		console.log('Delete subscription');
	};

	const handleGoToCancellation = () => {
		// Mock cancellation logic
		console.log('Go to cancellation page');
	};

	return (
		<AppLayout>
			<div className="pt-12 pb-8">
				<div className="w-full max-w-[438px] flex flex-col gap-6 items-start">
					{/* Breadcrumb */}
					<p className="font-mono font-normal text-sm leading-5 text-neutral-700">
						Subscriptions / <span className="text-white">{subscription.name}</span>
					</p>

					{/* Main Content */}
					<div className="w-full flex flex-col gap-8 items-center">
						{/* Action Buttons */}
						<div className="w-full flex gap-4 items-center justify-end">
							<button
								type="button"
								onClick={handleCopy}
								className="w-4 h-4 text-white hover:text-brand-primary-500 transition-colors"
								aria-label="Copy"
							>
								<Copy className="w-4 h-4" />
							</button>
							<button
								type="button"
								onClick={handleEdit}
								className="w-4 h-4 text-white hover:text-brand-primary-500 transition-colors"
								aria-label="Edit"
							>
								<PenLine className="w-4 h-4" />
							</button>
							<button
								type="button"
								onClick={handleDelete}
								className="w-4 h-4 text-white hover:text-danger-500 transition-colors"
								aria-label="Delete"
							>
								<Trash2 className="w-4 h-4" />
							</button>
						</div>

						{/* Logo + Name + Status */}
						<div className="w-full flex gap-3 items-center pb-6 border-b border-neutral-200">
							<div className="flex-1 flex gap-3 items-center">
								{/* Logo */}
								<div className="w-10 h-10 bg-neutral-50 border border-neutral-200 rounded-lg flex items-center justify-center shrink-0">
									<div className="w-4 h-4 bg-neutral-700 rounded" />
								</div>
								{/* Name */}
								<span className="font-semibold text-base leading-[22px] text-white">
									{subscription.name}
								</span>
							</div>
							{/* Status Badge */}
							{displayStatus === 'Active' && (
								<span className="inline-block bg-success-500 px-3 py-1.5 rounded text-[12px] font-mono font-medium leading-3 text-neutral-50">
									Active
								</span>
							)}
							{displayStatus === 'Inactive' && (
								<span className="inline-block bg-danger-500 px-3 py-1.5 rounded text-[12px] font-mono font-medium leading-3 text-white">
									Inactive
								</span>
							)}
							{displayStatus === 'Review' && (
								<span className="inline-block border border-dashed border-neutral-700 px-3 py-1.5 rounded text-[12px] font-mono font-medium leading-3 text-neutral-700">
									Review
								</span>
							)}
						</div>

						{/* Price + Cycle */}
						<div className="w-full flex gap-1 items-start pb-6 border-b border-neutral-200">
							<div className="flex-1 flex flex-col gap-1">
								<span className="font-light text-sm leading-5 text-neutral-700 tracking-tight">
									Price
								</span>
								<span className="font-normal text-lg leading-6 text-white">
									${subscription.price.toFixed(2)}
								</span>
							</div>
							<div className="flex-1 flex flex-col gap-1">
								<span className="font-light text-sm leading-5 text-neutral-700 tracking-tight">
									Cycle
								</span>
								<span className="font-normal text-lg leading-6 text-white">
									{subscription.cycle}
								</span>
							</div>
						</div>

						{/* Payment Method */}
						<div className="w-full pb-6 border-b border-neutral-200">
							<div className="flex flex-col gap-6">
								<div className="flex flex-col gap-1">
									<span className="font-light text-sm leading-5 text-neutral-700 tracking-tight">
										Payment method
									</span>
									<span className={`font-normal text-lg leading-6 ${hasUnknownPaymentMethod ? 'text-warning-500' : 'text-white'
										}`}>
										{subscription.paymentMethod}
									</span>
								</div>
								{(hasUnknownPaymentMethod || isInReview) && (
									<div className="flex gap-2 items-center">
										<TriangleAlert className="w-4 h-4 text-neutral-700 shrink-0" />
										<span className="font-normal text-base leading-[22px] text-neutral-700 tracking-tight">
											{hasUnknownPaymentMethod
												? 'Edit to add payment method'
												: reviewReasons.length > 0
													? `Review needed: ${reviewReasons.join(', ')}`
													: 'Review needed: Missing required information'}
										</span>
									</div>
								)}
							</div>
						</div>

						{/* Started On + Renewal Date */}
						<div className="w-full flex flex-col gap-6 pb-6 border-b border-neutral-200">
							<div className="w-full flex gap-1 items-start">
								<div className="flex-1 flex flex-col gap-1">
									<span className="font-light text-sm leading-5 text-neutral-700 tracking-tight">
										Started on
									</span>
									<span className="font-normal text-lg leading-6 text-white">
										{formatDate(subscription.startedOn)}
									</span>
								</div>
								<div className="flex-1 flex flex-col gap-1">
									<span className="font-light text-sm leading-5 text-neutral-700 tracking-tight">
										Renewal date
									</span>
									<span className={`font-normal text-lg leading-6 ${showRenewalWarning ? 'text-warning-500' : 'text-white'
										}`}>
										{formatDate(subscription.renewalDate)}
									</span>
								</div>
							</div>

							{/* Renewal Warning */}
							{showRenewalWarning && (
								<div className="flex gap-2 items-center">
									<Bell className="w-4 h-4 text-neutral-700 shrink-0" />
									<span className="font-normal text-base leading-[22px] text-neutral-700 tracking-tight">
										Renews in {daysUntilRenewal} {daysUntilRenewal === 1 ? 'day' : 'days'}
									</span>
								</div>
							)}

							{/* Cancellation Link */}
							<button
								type="button"
								onClick={handleGoToCancellation}
								className="w-full h-[42px] px-6 py-2.5 bg-neutral-200 border border-neutral-50 rounded-lg flex items-center justify-center font-semibold text-base leading-[22px] text-white hover:bg-neutral-300 transition-colors"
							>
								Go to cancelation page
							</button>
						</div>

						{/* Notes */}
						<div className="w-full flex flex-col gap-3">
							<span className="font-normal text-base leading-[22px] text-neutral-700 tracking-tight">
								Notes
							</span>
							{subscription.notes ? (
								<p className="font-normal text-base leading-[22px] text-white tracking-tight">
									{subscription.notes}
								</p>
							) : (
								<p className="font-normal text-base leading-[22px] text-neutral-700 tracking-tight italic">
									No notes
								</p>
							)}
						</div>
					</div>
				</div>
			</div>
		</AppLayout>
	);
}
