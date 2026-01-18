import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/Layout';
import { SearchInput } from '@/components/Subscriptions/SearchInput';
import { FilterDropdown } from '@/components/Subscriptions/FilterDropdown';
import { EmptyState } from '@/components/Subscriptions/EmptyState';
import { StatusBadge } from '@/components/Subscriptions/StatusBadge';
import { BrandLogo } from '@/components/BrandLogo';
import { Plus, ArrowUpToLine, ArrowUpDown, Eye, EyeOff, Copy, PenLine, Trash2 } from 'lucide-react';
import { shouldBeInReviewState } from '@/utils/subscriptionHelpers';
import { getSubscriptions, deleteSubscription, duplicateSubscription, updateSubscription } from '@/services/subscriptionsStorage';

interface Subscription {
	id: string;
	name: string;
	price: number;
	cycle: 'Monthly' | 'Annually';
	paymentMethod: string;
	renewalDate: Date;
	status: 'Active' | 'Inactive' | 'Review';
	isVisible?: boolean;
	imageUrl?: string;
}


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

function calculateTotals(subscriptions: Subscription[]) {
	let monthlyTotal = 0;
	let annuallyTotal = 0;

	subscriptions.forEach(sub => {
		// Only include visible subscriptions in totals
		if (sub.status === 'Active' && sub.isVisible !== false) {
			if (sub.cycle === 'Monthly') {
				monthlyTotal += sub.price;
				annuallyTotal += sub.price * 12;
			} else {
				annuallyTotal += sub.price;
				monthlyTotal += sub.price / 12;
			}
		}
	});

	return { monthlyTotal, annuallyTotal };
}

export default function SubscriptionsList() {
	const navigate = useNavigate();
	const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState<string>('');
	const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('');
	const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
	const [sortBy, setSortBy] = useState<'price' | 'cycle' | 'renewalDate' | null>(null);
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

	// Load subscriptions from storage
	const loadSubscriptions = () => {
		const stored = getSubscriptions();
		// Convert to component format
		const formatted: Subscription[] = stored.map(sub => ({
			id: sub.id,
			name: sub.name,
			price: sub.price,
			cycle: sub.cycle,
			paymentMethod: sub.paymentMethod,
			renewalDate: sub.renewalDate instanceof Date ? sub.renewalDate : new Date(sub.renewalDate),
			status: sub.status,
			isVisible: sub.isVisible !== undefined ? sub.isVisible : true,
			imageUrl: sub.imageUrl,
		}));
		setSubscriptions(formatted);
	};

	useEffect(() => {
		loadSubscriptions();
		// Listen for storage changes (from other tabs/components)
		const handleStorageChange = () => loadSubscriptions();
		window.addEventListener('storage', handleStorageChange);
		// Listen for custom events (same-tab updates)
		const handleSubscriptionUpdate = () => loadSubscriptions();
		window.addEventListener('subscriptionUpdated', handleSubscriptionUpdate);
		return () => {
			window.removeEventListener('storage', handleStorageChange);
			window.removeEventListener('subscriptionUpdated', handleSubscriptionUpdate);
		};
	}, []);

	const statusOptions = [
		{ value: '', label: 'State: All' },
		{ value: 'Active', label: 'Active' },
		{ value: 'Inactive', label: 'Inactive' },
		{ value: 'Review', label: 'Review' },
	];

	const paymentMethodOptions = [
		{ value: '', label: 'Payment: All' },
		{ value: 'Visa', label: 'Visa' },
		{ value: 'PayPal', label: 'PayPal' },
		{ value: 'Apple Pay', label: 'Apple Pay' },
		{ value: 'Google Pay', label: 'Google Pay' },
		{ value: 'Unknown', label: 'Unknown' },
	];

	const { monthlyTotal, annuallyTotal } = calculateTotals(subscriptions);

	// Calculate review state for all subscriptions and create enhanced list
	const subscriptionsWithReviewState = useMemo(() => {
		return subscriptions.map(sub => ({
			...sub,
			computedStatus: shouldBeInReviewState(sub) ? 'Review' : sub.status,
		}));
	}, [subscriptions]);

	const filteredSubscriptions = subscriptionsWithReviewState.filter(sub => {
		const matchesSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase());
		// Use computedStatus for filtering
		const statusToMatch = sub.computedStatus;
		const matchesStatus = !statusFilter || statusToMatch === statusFilter;
		const matchesPayment = !paymentMethodFilter || sub.paymentMethod.includes(paymentMethodFilter);
		return matchesSearch && matchesStatus && matchesPayment;
	});

	// Sort subscriptions
	const sortedSubscriptions = useMemo(() => {
		if (!sortBy) return filteredSubscriptions;

		const sorted = [...filteredSubscriptions].sort((a, b) => {
			let comparison = 0;

			switch (sortBy) {
				case 'price':
					comparison = a.price - b.price;
					break;
				case 'cycle':
					// Monthly comes before Annually alphabetically, but we can also sort by value
					const cycleOrder = { 'Monthly': 0, 'Annually': 1 };
					comparison = cycleOrder[a.cycle] - cycleOrder[b.cycle];
					break;
				case 'renewalDate':
					comparison = a.renewalDate.getTime() - b.renewalDate.getTime();
					break;
			}

			return sortOrder === 'asc' ? comparison : -comparison;
		});

		return sorted;
	}, [filteredSubscriptions, sortBy, sortOrder]);

	const handleSort = (column: 'price' | 'cycle' | 'renewalDate') => {
		if (sortBy === column) {
			// Toggle sort order if clicking the same column
			setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
		} else {
			// Set new column and default to ascending
			setSortBy(column);
			setSortOrder('asc');
		}
	};

	const hasSubscriptions = sortedSubscriptions.length > 0;

	const handleConfirmDelete = () => {
		if (deleteConfirmId) {
			deleteSubscription(deleteConfirmId);
			setDeleteConfirmId(null);
			// Reload will happen via event listener
		}
	};

	return (
		<AppLayout>
			<div className="pt-6 sm:pt-8 md:pt-12 pb-6 sm:pb-8">
				{/* Search + Filters + Actions */}
				<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 items-stretch sm:items-center mb-6 sm:mb-8">
					{/* Search + Filters */}
					<div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center flex-1">
						<SearchInput
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Search"
							className="flex-1"
						/>
						<FilterDropdown
							label="Status"
							options={statusOptions}
							value={statusFilter}
							onChange={setStatusFilter}
							className="w-full sm:w-[120px]"
						/>
						<FilterDropdown
							label="Payment method"
							options={paymentMethodOptions}
							value={paymentMethodFilter}
							onChange={setPaymentMethodFilter}
							className="w-full sm:w-[186px]"
						/>
					</div>

					{/* Export + Add New */}
					<div className="flex gap-2 sm:gap-3 items-center sm:ml-auto">
						<button
							type="button"
							className="min-h-[44px] sm:h-[52px] px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 bg-transparent border border-neutral-600 rounded-lg flex gap-2 items-center justify-center hover:border-neutral-600 transition-colors shrink-0 active:opacity-75"
							aria-label="Export subscriptions"
						>
							<span className="font-light text-xs sm:text-sm leading-4 sm:leading-5 text-text-success hidden sm:inline">Export</span>
							<ArrowUpToLine className="w-4 h-4 text-text-success shrink-0" />
						</button>
						<button
							type="button"
							onClick={() => navigate('/app/subscriptions/new')}
							className="min-h-[44px] sm:h-[54px] px-4 sm:px-6 py-3 sm:py-4 bg-neutral-700 border border-neutral-900 rounded-lg flex gap-2 items-center justify-center hover:bg-neutral-600 transition-colors shrink-0 active:opacity-75"
							aria-label="Add new subscription"
						>
							<Plus className="w-4 h-4 text-text-primary shrink-0" />
							<span className="font-semibold text-sm sm:text-base leading-5 sm:leading-normal text-text-primary hidden sm:inline">Add new</span>
							<span className="font-semibold text-sm leading-5 text-text-primary sm:hidden">Add</span>
						</button>
					</div>
				</div>

				{/* Empty State or Table */}
				{!hasSubscriptions ? (
					<EmptyState />
				) : (
					<div className="border border-neutral-900 rounded-lg overflow-hidden overflow-x-auto -mx-3 sm:mx-0">
						{/* Table Header */}
						<div className="px-3 sm:px-4 py-2 pl-[52px] sm:pl-[72px] flex items-center min-w-[800px] sm:min-w-[1000px]">
							<div className="w-[160px]">
								<span className="font-normal text-[13px] leading-4 text-text-secondary">Subscription</span>
							</div>
							<button
								type="button"
								onClick={() => handleSort('price')}
								className="group w-[160px] flex gap-2 items-center cursor-pointer transition-colors"
							>
								<span className={`font-normal text-[13px] leading-4 transition-colors ${sortBy === 'price' ? 'text-text-primary' : 'text-text-secondary group-hover:text-text-primary'}`}>Price</span>
								<ArrowUpDown className={`w-4 h-4 transition-colors ${sortBy === 'price' ? 'text-text-primary' : 'text-text-secondary group-hover:text-text-primary'}`} />
							</button>
							<button
								type="button"
								onClick={() => handleSort('cycle')}
								className="group w-[160px] flex gap-2 items-center cursor-pointer transition-colors"
							>
								<span className={`font-normal text-[13px] leading-4 transition-colors ${sortBy === 'cycle' ? 'text-text-primary' : 'text-text-secondary group-hover:text-text-primary'}`}>Cycle</span>
								<ArrowUpDown className={`w-4 h-4 transition-colors ${sortBy === 'cycle' ? 'text-text-primary' : 'text-text-secondary group-hover:text-text-primary'}`} />
							</button>
							<div className="w-[160px]">
								<span className="font-normal text-[13px] leading-4 text-text-secondary">Payment method</span>
							</div>
							<button
								type="button"
								onClick={() => handleSort('renewalDate')}
								className="group w-[160px] flex gap-2 items-center cursor-pointer transition-colors"
							>
								<span className={`font-normal text-[13px] leading-4 transition-colors ${sortBy === 'renewalDate' ? 'text-text-primary' : 'text-text-secondary group-hover:text-text-primary'}`}>Renewal date</span>
								<ArrowUpDown className={`w-4 h-4 transition-colors ${sortBy === 'renewalDate' ? 'text-text-primary' : 'text-text-secondary group-hover:text-text-primary'}`} />
							</button>
							<div className="w-[130px]">
								<span className="font-normal text-[13px] leading-4 text-text-secondary">Status</span>
							</div>
						</div>

						{/* Table Rows */}
						<div className="bg-transparent">
							{sortedSubscriptions.map((sub) => {
								const daysUntilRenewal = getDaysUntilRenewal(sub.renewalDate);
								const showRenewalWarning = daysUntilRenewal <= 7 && daysUntilRenewal > 0 && sub.computedStatus === 'Active';
								const isInactive = sub.computedStatus === 'Inactive';
								const textColor = isInactive ? 'text-text-secondary' : 'text-text-primary';

								const handleRowClick = (e: React.MouseEvent) => {
									// Don't navigate if clicking on action buttons
									const target = e.target as HTMLElement;
									if (target.closest('button') || target.closest('[role="button"]')) {
										return;
									}
									navigate(`/app/subscription/${sub.id}`);
								};

								const handleCopy = (e: React.MouseEvent) => {
									e.stopPropagation();
									duplicateSubscription(sub.id);
									// Reload will happen via event listener
								};

								const handleEdit = (e: React.MouseEvent) => {
									e.stopPropagation();
									navigate(`/app/subscription/${sub.id}/edit`);
								};

								const handleDelete = (e: React.MouseEvent) => {
									e.stopPropagation();
									setDeleteConfirmId(sub.id);
								};

								const handleToggleVisibility = (e: React.MouseEvent) => {
									e.stopPropagation();
									updateSubscription(sub.id, {
										isVisible: !sub.isVisible,
									});
									// Reload will happen via event listener
								};

								return (
									<div
										key={sub.id}
										onClick={handleRowClick}
										className="border-b border-neutral-900 p-3 sm:p-4 flex gap-2 sm:gap-4 items-center cursor-pointer hover:bg-neutral-700 transition-colors min-w-[800px] sm:min-w-[1000px]"
									>
										{/* Logo */}
										<BrandLogo name={sub.name} imageUrl={sub.imageUrl} size="sm" />

										{/* Data Columns */}
										<div className="flex items-center flex-1">
											<div className="w-[160px]">
												<div className="flex flex-col gap-1">
													<span className={`font-semibold text-base leading-normal ${textColor}`}>
														{sub.name || 'Untitled subscription'}
													</span>
													{sub.computedStatus === 'Review' && sub.paymentMethod === 'Unknown' && (
														<span className="text-xs text-text-secondary leading-4">
															Payment method unknown
														</span>
													)}
												</div>
											</div>
											<div className="w-[160px]">
												<span className={`font-normal text-base leading-normal tracking-tight ${textColor}`}>
													${sub.price.toFixed(2)}
												</span>
											</div>
											<div className="w-[160px]">
												<span className={`font-normal text-base leading-normal tracking-tight ${textColor}`}>
													{sub.cycle}
												</span>
											</div>
											<div className="w-[160px]">
												<span className={`font-normal text-base leading-normal tracking-tight ${textColor}`}>
													{sub.paymentMethod}
												</span>
											</div>
											<div className="w-[160px]">
												<div className="flex flex-col gap-1.5">
													<span className={`font-normal text-base leading-normal tracking-tight ${textColor}`}>
														{formatDate(sub.renewalDate)}
													</span>
													{showRenewalWarning && (
														<span className="font-normal text-[13px] leading-4 text-text-secondary">
															Renews in {daysUntilRenewal} {daysUntilRenewal === 1 ? 'day' : 'days'}
														</span>
													)}
												</div>
											</div>
											<div className="w-[130px]">
												<StatusBadge status={sub.computedStatus as 'Active' | 'Inactive' | 'Review'} />
											</div>
										</div>

										{/* Actions - hide some on mobile */}
										<div className="flex gap-2 sm:gap-4 items-center">
											<button
												type="button"
												onClick={handleToggleVisibility}
												className="p-0 border-0 bg-transparent cursor-pointer"
												aria-label={sub.isVisible !== false ? 'Hide subscription' : 'Show subscription'}
											>
												{sub.isVisible !== false ? (
													<Eye className="w-4 h-4 text-text-secondary hover:text-text-primary transition-colors min-w-[20px] min-h-[20px]" />
												) : (
													<EyeOff className="w-4 h-4 text-text-secondary hover:text-text-primary transition-colors min-w-[20px] min-h-[20px]" />
												)}
											</button>
											<button
												type="button"
												onClick={handleCopy}
												className="p-0 border-0 bg-transparent cursor-pointer hidden sm:block"
												aria-label="Duplicate subscription"
											>
												<Copy className="w-4 h-4 text-text-secondary hover:text-text-primary transition-colors min-w-[20px] min-h-[20px]" />
											</button>
											<button
												type="button"
												onClick={handleEdit}
												className="p-0 border-0 bg-transparent cursor-pointer"
												aria-label="Edit subscription"
											>
												<PenLine className="w-4 h-4 text-text-secondary hover:text-text-primary transition-colors min-w-[20px] min-h-[20px]" />
											</button>
											<button
												type="button"
												onClick={handleDelete}
												className="p-0 border-0 bg-transparent cursor-pointer"
												aria-label="Delete subscription"
											>
												<Trash2 className="w-4 h-4 text-text-secondary hover:text-text-danger transition-colors min-w-[20px] min-h-[20px]" />
											</button>
										</div>
									</div>
								);
							})}
						</div>

						{/* Totals */}
						<div className="px-3 sm:px-4 py-4 sm:py-6 border-t border-neutral-900">
							<div className="flex flex-col gap-3 sm:gap-4">
								<div className="flex flex-col sm:flex-row gap-1 sm:gap-3 items-start sm:items-center pb-3 sm:pb-4 border-b border-neutral-900">
									<span className="font-mono font-normal text-xs sm:text-sm leading-4 sm:leading-5 text-text-secondary sm:w-[135px] shrink-0">
										Total monthly
									</span>
									<span className="font-normal text-lg sm:text-xl leading-6 sm:leading-[26px] text-text-primary">
										${monthlyTotal.toFixed(2)} USD
									</span>
								</div>
								<div className="flex flex-col sm:flex-row gap-1 sm:gap-3 items-start sm:items-center">
									<span className="font-mono font-normal text-xs sm:text-sm leading-4 sm:leading-5 text-text-secondary sm:w-[135px] shrink-0">
										Total annually
									</span>
									<span className="font-normal text-lg sm:text-xl leading-6 sm:leading-[26px] text-text-primary">
										${annuallyTotal.toFixed(2)} USD
									</span>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Delete Confirmation Modal */}
				{deleteConfirmId && (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
						<div className="bg-neutral-900 border border-neutral-700 rounded-lg p-6 max-w-md w-full flex flex-col gap-4">
							<h3 className="font-semibold text-lg leading-6 text-text-primary">
								Delete subscription?
							</h3>
							<p className="font-normal text-sm leading-5 text-text-secondary">
								This action cannot be undone. The subscription will be permanently deleted.
							</p>
							<div className="flex gap-3 mt-2">
								<button
									type="button"
									onClick={() => setDeleteConfirmId(null)}
									className="flex-1 px-4 py-2.5 bg-neutral-700 border border-neutral-700 text-text-primary text-sm font-medium rounded-lg hover:bg-neutral-600 transition-colors"
								>
									Cancel
								</button>
								<button
									type="button"
									onClick={handleConfirmDelete}
									className="flex-1 px-4 py-2.5 bg-danger-500 text-text-primary text-sm font-medium rounded-lg hover:bg-danger-600 transition-colors"
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
