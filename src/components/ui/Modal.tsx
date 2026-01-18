import { Fragment, ReactNode } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	children: ReactNode;
	showCloseButton?: boolean;
	size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const sizeClasses = {
	sm: 'max-w-md',
	md: 'max-w-lg',
	lg: 'max-w-2xl',
	xl: 'max-w-4xl',
	full: 'max-w-full mx-4',
};

/**
 * Reusable Modal component using Headless UI Dialog + Transition
 * Features:
 * - Fade + scale animation using Tailwind classes
 * - Full accessibility (focus trap, keyboard navigation, ARIA attributes)
 * - Backdrop overlay with fade transition
 * - Responsive sizing
 * - Matches existing design tokens
 */
export function Modal({
	isOpen,
	onClose,
	title,
	children,
	showCloseButton = true,
	size = 'md',
}: ModalProps) {
	return (
		<Transition appear show={isOpen} as={Fragment}>
			<Dialog as="div" className="relative z-50" onClose={onClose}>
				{/* Backdrop overlay with fade transition */}
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-200"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-150"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-black/50" aria-hidden="true" />
				</Transition.Child>

				{/* Modal container - centered */}
				<div className="fixed inset-0 overflow-y-auto">
					<div className="flex min-h-full items-center justify-center p-4">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-200"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-150"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<Dialog.Panel
								className={`
									w-full ${sizeClasses[size]} transform overflow-hidden rounded-lg
									bg-neutral-900 border border-neutral-700 shadow-lg
									transition-all
								`}
							>
								{/* Header */}
								{(title || showCloseButton) && (
									<div className="flex items-center justify-between px-6 py-4 border-b border-neutral-700">
										{title && (
											<Dialog.Title
												as="h3"
												className="font-semibold text-lg leading-6 text-text-primary"
											>
												{title}
											</Dialog.Title>
										)}
										{showCloseButton && (
											<button
												type="button"
												onClick={onClose}
												className="rounded-lg p-1.5 text-text-secondary hover:text-text-primary hover:bg-neutral-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
												aria-label="Close"
											>
												<X className="w-5 h-5" />
											</button>
										)}
									</div>
								)}

								{/* Content */}
								<div className="px-6 py-4">{children}</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
}
