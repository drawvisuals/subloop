import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/Layout';
import { SearchInput } from '@/components/Subscriptions/SearchInput';
import { FilterDropdown } from '@/components/Subscriptions/FilterDropdown';
import { EmptyState } from '@/components/Subscriptions/EmptyState';
import { Plus, ArrowUpToLine, ArrowUpDown, Eye, EyeOff, Copy, PenLine, Trash2 } from 'lucide-react';
import { shouldBeInReviewState } from '@/utils/subscriptionHelpers';

interface Subscription {
	id: string;
	name: string;
	price: number;
	cycle: 'Monthly' | 'Annually';
	paymentMethod: string;
	renewalDate: Date;
	status: 'Active' | 'Inactive' | 'Review';
	isVisible?: boolean;
}

// Mock data
const mockSubscriptions: Subscription[] = [
	{
		id: '1',
		name: 'Netflix',
		price: 24.99,
		cycle: 'Monthly',
		paymentMethod: 'Visa ****4567',
		renewalDate: new Date('2026-01-16'),
		status: 'Active',
		isVisible: true,
	},
	{
		id: '2',
		name: 'Spotify',
		price: 143.88,
		cycle: 'Annually',
		paymentMethod: 'PayPal',
		renewalDate: new Date('2025-10-04'),
		status: 'Inactive',
		isVisible: false,
	},
	{
		id: '3',
		name: 'YouTube',
		price: 13.99,
		cycle: 'Monthly',
		paymentMethod: 'Visa ****4567',
		renewalDate: new Date('2026-03-07'),
		status: 'Active',
		isVisible: true,
	},
	{
		id: '4',
		name: 'Apple Music',
		price: 10.99,
		cycle: 'Monthly',
		paymentMethod: 'Apple Pay',
		renewalDate: new Date('2026-03-12'),
		status: 'Active',
		isVisible: true,
	},
	{
		id: '5',
		name: 'Google One',
		price: 29.99,
		cycle: 'Annually',
		paymentMethod: 'Google Pay',
		renewalDate: new Date('2026-12-23'),
		status: 'Active',
		isVisible: true,
	},
	{
		id: '6',
		name: 'Adobe CC',
		price: 69.99,
		cycle: 'Monthly',
		paymentMethod: 'Visa ****4567',
		renewalDate: new Date('2025-12-14'),
		status: 'Inactive',
		isVisible: true,
	},
	{
		id: '7',
		name: 'Dropbox',
		price: 119.88,
		cycle: 'Annually',
		paymentMethod: 'Unknown',
		renewalDate: new Date('2027-01-18'),
		status: 'Review',
		isVisible: true,
	},
];

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
		if (sub.status === 'Active') {
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
	const [subscriptions] = useState<Subscription[]>(mockSubscriptions);
	const [searchQuery, setSearchQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState<string>('');
	const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('');

	const statusOptions = [
		{ value: '', label: 'Status' },
		{ value: 'Active', label: 'Active' },
		{ value: 'Inactive', label: 'Inactive' },
		{ value: 'Review', label: 'Review' },
	];

	const paymentMethodOptions = [
		{ value: '', label: 'Payment method' },
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

	const hasSubscriptions = filteredSubscriptions.length > 0;

	return (
		<AppLayout>
			<div className="pt-12 pb-8">
				{/* Search + Filters + Actions */}
				<div className="flex gap-6 items-center mb-8">
					{/* Search + Filters */}
					<div className="flex gap-3 items-center">
						<SearchInput
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Search"
						/>
						<FilterDropdown
							label="Status"
							options={statusOptions}
							value={statusFilter}
							onChange={setStatusFilter}
							className="w-[120px]"
						/>
						<FilterDropdown
							label="Payment method"
							options={paymentMethodOptions}
							value={paymentMethodFilter}
							onChange={setPaymentMethodFilter}
							className="w-[186px]"
						/>
					</div>

					{/* Export + Add New */}
					<div className="flex gap-3 items-center ml-auto">
						<button
							type="button"
							className="h-[52px] px-6 py-2.5 bg-transparent border border-neutral-200 rounded-lg flex gap-2 items-center justify-center hover:border-neutral-300 transition-colors"
						>
							<span className="font-light text-sm leading-5 text-success-500">Export</span>
							<ArrowUpToLine className="w-4 h-4 text-success-500" />
						</button>
						<button
							type="button"
							onClick={() => navigate('/app/subscription/add')}
							className="h-[54px] px-6 py-4 bg-neutral-200 border border-neutral-50 rounded-lg flex gap-2 items-center justify-center hover:bg-neutral-300 transition-colors"
						>
							<Plus className="w-4 h-4 text-white" />
							<span className="font-semibold text-base leading-[22px] text-white">Add new</span>
						</button>
					</div>
				</div>

				{/* Empty State or Table */}
				{!hasSubscriptions ? (
					<EmptyState />
				) : (
					<div className="border border-neutral-50 rounded-lg overflow-hidden">
						{/* Table Header */}
						<div className="bg-transparent border-b border-neutral-50 px-4 py-2 pl-[72px] flex items-center">
							<div className="w-[160px]">
								<span className="font-normal text-[13px] leading-4 text-neutral-700">Subscription</span>
							</div>
							<div className="w-[160px] flex gap-2 items-center">
								<span className="font-normal text-[13px] leading-4 text-neutral-700">Price</span>
								<ArrowUpDown className="w-4 h-4 text-neutral-700" />
							</div>
							<div className="w-[160px] flex gap-2 items-center">
								<span className="font-normal text-[13px] leading-4 text-neutral-700">Cycle</span>
								<ArrowUpDown className="w-4 h-4 text-neutral-700" />
							</div>
							<div className="w-[160px]">
								<span className="font-normal text-[13px] leading-4 text-neutral-700">Payment method</span>
							</div>
							<div className="w-[160px] flex gap-2 items-center">
								<span className="font-normal text-[13px] leading-4 text-neutral-700">Renewal date</span>
								<ArrowUpDown className="w-4 h-4 text-neutral-700" />
							</div>
							<div className="w-[130px]">
								<span className="font-normal text-[13px] leading-4 text-neutral-700">Status</span>
							</div>
						</div>

						{/* Table Rows */}
						<div className="bg-transparent">
							{filteredSubscriptions.map((sub, index) => {
								const daysUntilRenewal = getDaysUntilRenewal(sub.renewalDate);
								const showRenewalWarning = daysUntilRenewal <= 7 && daysUntilRenewal > 0 && sub.computedStatus === 'Active';
								const isInactive = sub.computedStatus === 'Inactive';
								const textColor = isInactive ? 'text-neutral-400' : 'text-white';

								return (
									<div
										key={sub.id}
										onClick={() => navigate(`/app/subscription/${sub.id}`)}
										className={`border-b border-neutral-50 p-4 flex gap-4 items-center cursor-pointer hover:bg-neutral-200/50 transition-colors ${index % 2 === 1 ? 'bg-neutral-200' : 'bg-transparent'
											}`}
									>
										{/* Logo */}
										<div className="w-10 h-10 bg-neutral-50 border border-neutral-200 rounded-lg flex items-center justify-center shrink-0">
											<div className="w-4 h-4 bg-neutral-700 rounded" />
										</div>

										{/* Data Columns */}
										<div className="flex items-center flex-1">
											<div className="w-[160px]">
												<div className="flex flex-col gap-1">
													<span className={`font-semibold text-base leading-[22px] ${textColor}`}>
														{sub.name || 'Untitled subscription'}
													</span>
													{sub.computedStatus === 'Review' && sub.paymentMethod === 'Unknown' && (
														<span className="text-xs text-neutral-700 leading-4">
															Payment method unknown
														</span>
													)}
												</div>
											</div>
											<div className="w-[160px]">
												<span className={`font-normal text-base leading-[22px] tracking-tight ${textColor}`}>
													${sub.price.toFixed(2)}
												</span>
											</div>
											<div className="w-[160px]">
												<span className={`font-normal text-base leading-[22px] tracking-tight ${textColor}`}>
													{sub.cycle}
												</span>
											</div>
											<div className="w-[160px]">
												<span className={`font-normal text-base leading-[22px] tracking-tight ${textColor}`}>
													{sub.paymentMethod}
												</span>
											</div>
											<div className="w-[160px]">
												<div className="flex flex-col gap-1.5">
													<span className={`font-normal text-base leading-[22px] tracking-tight ${textColor}`}>
														{formatDate(sub.renewalDate)}
													</span>
													{showRenewalWarning && (
														<span className="font-normal text-[13px] leading-4 text-neutral-700">
															Renews in {daysUntilRenewal} {daysUntilRenewal === 1 ? 'day' : 'days'}
														</span>
													)}
												</div>
											</div>
											<div className="w-[130px]">
												{sub.computedStatus === 'Active' && (
													<span className="inline-block bg-success-500 px-3 py-1.5 rounded text-[12px] font-mono font-medium leading-3 text-neutral-50">
														Active
													</span>
												)}
												{sub.computedStatus === 'Inactive' && (
													<span className="inline-block bg-danger-500 px-3 py-1.5 rounded text-[12px] font-mono font-medium leading-3 text-white">
														Inactive
													</span>
												)}
												{sub.computedStatus === 'Review' && (
													<span className="inline-block border border-dashed border-neutral-700 px-3 py-1.5 rounded text-[12px] font-mono font-medium leading-3 text-neutral-700">
														Review
													</span>
												)}
											</div>
										</div>

										{/* Actions */}
										<div className="flex gap-4 items-center">
											{sub.isVisible ? (
												<Eye className="w-4 h-4 text-white cursor-pointer hover:text-brand-primary-500 transition-colors" />
											) : (
												<EyeOff className="w-4 h-4 text-white cursor-pointer hover:text-brand-primary-500 transition-colors" />
											)}
											<Copy className="w-4 h-4 text-white cursor-pointer hover:text-brand-primary-500 transition-colors" />
											<PenLine className="w-4 h-4 text-white cursor-pointer hover:text-brand-primary-500 transition-colors" />
											<Trash2 className="w-4 h-4 text-white cursor-pointer hover:text-danger-500 transition-colors" />
										</div>
									</div>
								);
							})}
						</div>

						{/* Totals */}
						<div className="px-4 py-6 border-t border-neutral-50">
							<div className="flex flex-col gap-4">
								<div className="flex gap-3 items-center pb-4 border-b border-neutral-50">
									<span className="font-mono font-normal text-sm leading-5 text-neutral-700 w-[135px]">
										Total monthly
									</span>
									<span className="font-normal text-xl leading-[26px] text-white">
										${monthlyTotal.toFixed(2)} USD
									</span>
								</div>
								<div className="flex gap-3 items-center">
									<span className="font-mono font-normal text-sm leading-5 text-neutral-700 w-[135px]">
										Total annually
									</span>
									<span className="font-normal text-xl leading-[26px] text-white">
										${annuallyTotal.toFixed(2)} USD
									</span>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</AppLayout>
	);
}
