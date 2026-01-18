import { useState } from 'react';
import { Modal } from './Modal';

/**
 * Example component demonstrating Modal usage with Tailwind animations
 * This file is for reference/demo purposes
 */
export function ModalExample() {
	const [isOpen, setIsOpen] = useState(false);
	const [secondModalOpen, setSecondModalOpen] = useState(false);

	return (
		<div className="p-8 space-y-4">
			{/* Example 1: Basic Modal */}
			<div>
				<button
					onClick={() => setIsOpen(true)}
					className="
						px-4 py-2 bg-brand-primary-500 text-text-primary rounded-lg
						font-semibold transition-all duration-200
						hover:scale-105 hover:bg-brand-primary-400
						active:scale-95
						focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:ring-offset-2
					"
				>
					Open Basic Modal
				</button>

				<Modal
					isOpen={isOpen}
					onClose={() => setIsOpen(false)}
					title="Example Modal"
					size="md"
				>
					<div className="space-y-4">
						<p className="text-text-primary">
							This is a basic modal example with fade and scale animations.
						</p>
						<p className="text-text-secondary">
							Press ESC to close or click the X button.
						</p>
						<button
							onClick={() => setIsOpen(false)}
							className="
								px-4 py-2 bg-neutral-700 text-text-primary rounded-lg
								font-medium transition-all duration-200
								hover:bg-neutral-600 hover:scale-105
								active:scale-95
							"
						>
							Close Modal
						</button>
					</div>
				</Modal>
			</div>

			{/* Example 2: Modal with Actions */}
			<div>
				<button
					onClick={() => setSecondModalOpen(true)}
					className="
						px-4 py-2 bg-danger-500 text-text-primary rounded-lg
						font-semibold transition-all duration-200
						hover:scale-105 hover:bg-danger-600
						active:scale-95
						focus:outline-none focus:ring-2 focus:ring-danger-500 focus:ring-offset-2
					"
				>
					Open Confirmation Modal
				</button>

				<Modal
					isOpen={secondModalOpen}
					onClose={() => setSecondModalOpen(false)}
					title="Confirm Action"
					size="sm"
				>
					<div className="space-y-4">
						<p className="text-text-secondary">
							Are you sure you want to perform this action? This cannot be undone.
						</p>
						<div className="flex gap-3">
							<button
								onClick={() => setSecondModalOpen(false)}
								className="
									flex-1 px-4 py-2.5 bg-neutral-700 border border-neutral-700
									text-text-primary text-sm font-medium rounded-lg
									transition-all duration-200
									hover:bg-neutral-600 hover:scale-[1.02]
									active:scale-95
								"
							>
								Cancel
							</button>
							<button
								onClick={() => {
									// Action here
									setSecondModalOpen(false);
								}}
								className="
									flex-1 px-4 py-2.5 bg-danger-500 text-text-primary text-sm
									font-medium rounded-lg
									transition-all duration-200
									hover:bg-danger-600 hover:scale-[1.02]
									active:scale-95
								"
							>
								Confirm
							</button>
						</div>
					</div>
				</Modal>
			</div>
		</div>
	);
}
