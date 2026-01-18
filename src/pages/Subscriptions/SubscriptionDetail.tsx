import { useParams, Link, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/Layout';
import { Copy, PenLine, Trash2, Bell, TriangleAlert } from 'lucide-react';
import { shouldBeInReviewState, getReviewReasons } from '@/utils/subscriptionHelpers';
import { getSubscription, duplicateSubscription, deleteSubscription } from '@/services/subscriptionsStorage';
import { useState } from 'react';

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
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

	const subscription = id ? getSubscription(id) : null;

	if (!subscription || !id) {
		return (
			<AppLayout>
				<div className="pt-6 sm:pt-8 md:pt-12 pb-6 sm:pb-8">
					<p className="text-white">Subscription not found</p>
					<Link to="/app/subscriptions" className="text-brand-primary-500 hover:text-brand-primary-400">
						Back to subscriptions
					</Link>
				</div>
			</AppLayout>
		);
	}

	const renewalDate = subscription.renewalDate instanceof Date ? subscription.renewalDate : new Date(subscription.renewalDate);
	const startedOn = subscription.startedOn instanceof Date ? subscription.startedOn : new Date(subscription.startedOn);
	const daysUntilRenewal = getDaysUntilRenewal(renewalDate);
	const showRenewalWarning = daysUntilRenewal <= 7 && daysUntilRenewal > 0 && subscription.status === 'Active';
	const hasUnknownPaymentMethod = subscription.paymentMethod === 'Unknown';

	// Calculate review state dynamically
	const subscriptionForReview = {
		paymentMethod: subscription.paymentMethod,
		name: subscription.name,
		price: subscription.price,
		cycle: subscription.cycle,
		renewalDate: renewalDate,
	};
	const isInReview = shouldBeInReviewState(subscriptionForReview);
	const reviewReasons = getReviewReasons(subscriptionForReview);
	const displayStatus = isInReview ? 'Review' : subscription.status;

	const handleCopy = () => {
		if (!id) return;
		// Duplicate subscription
		duplicateSubscription(id);
		// Navigate to subscriptions list to see the new one
		navigate('/app/subscriptions');
	};

	const handleEdit = () => {
		if (!id) return;
		navigate(`/app/subscription/${id}/edit`);
	};

	const handleDelete = () => {
		setShowDeleteConfirm(true);
	};

	const handleConfirmDelete = () => {
		if (!id) return;
		deleteSubscription(id);
		navigate('/app/subscriptions');
	};

	const handleGoToCancellation = () => {
		// Open cancellation link if available, otherwise do nothing
		const cancellationLink = (subscription as any)?.cancellationLink;
		if (cancellationLink) {
			window.open(cancellationLink, '_blank', 'noopener,noreferrer');
		}
	};

	return (
		<AppLayout>
			<div className="pt-6 sm:pt-8 md:pt-12 pb-6 sm:pb-8">
				<div className="w-full max-w-[438px] flex flex-col gap-4 sm:gap-6 items-start">
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
						<div className="w-full flex flex-col gap-4 sm:gap-6 pb-6 border-b border-neutral-200">
							<div className="w-full flex flex-col sm:flex-row gap-4 sm:gap-1 items-stretch sm:items-start">
								<div className="flex-1 flex flex-col gap-1">
									<span className="font-light text-sm leading-5 text-neutral-700 tracking-tight">
										Started on
									</span>
									<span className="font-normal text-lg leading-6 text-white">
										{formatDate(startedOn)}
									</span>
								</div>
								<div className="flex-1 flex flex-col gap-1">
									<span className="font-light text-sm leading-5 text-neutral-700 tracking-tight">
										Renewal date
									</span>
									<span className={`font-normal text-lg leading-6 ${showRenewalWarning ? 'text-warning-500' : 'text-white'
										}`}>
										{formatDate(renewalDate)}
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
							{(subscription as any)?.cancellationLink ? (
								<button
									type="button"
									onClick={handleGoToCancellation}
									className="w-full min-h-[44px] sm:h-[42px] px-6 py-2.5 bg-neutral-200 border border-neutral-50 rounded-lg flex items-center justify-center font-semibold text-sm sm:text-base leading-5 sm:leading-[22px] text-white hover:bg-neutral-300 transition-colors active:opacity-75"
								>
									Go to cancelation page
								</button>
							) : (
								<p className="font-normal text-sm leading-5 text-neutral-700 italic">
									Cancellation link not available
								</p>
							)}
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

				{/* Delete Confirmation Modal */}
				{showDeleteConfirm && (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
						<div className="bg-neutral-900 border border-neutral-700 rounded-lg p-6 max-w-md w-full flex flex-col gap-4">
							<h3 className="font-semibold text-lg leading-6 text-white">
								Delete subscription?
							</h3>
							<p className="font-normal text-sm leading-5 text-neutral-700">
								This action cannot be undone. The subscription will be permanently deleted.
							</p>
							<div className="flex gap-3 mt-2">
								<button
									type="button"
									onClick={() => setShowDeleteConfirm(false)}
									className="flex-1 px-4 py-2.5 bg-neutral-700 border border-neutral-600 text-white text-sm font-medium rounded-lg hover:bg-neutral-600 transition-colors"
								>
									Cancel
								</button>
								<button
									type="button"
									onClick={handleConfirmDelete}
									className="flex-1 px-4 py-2.5 bg-danger-500 text-white text-sm font-medium rounded-lg hover:bg-danger-600 transition-colors"
								>
									Delete
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</AppLayout>
	);
}
