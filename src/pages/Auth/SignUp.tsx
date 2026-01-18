import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleButton, Input, Divider, Button } from '@/components/Auth';
import { mockSignup } from '@/services/auth';
import { getPostAuthRedirect } from '@/services/onboarding';

/**
 * Create Account page
 * Matches Figma design exactly with proper spacing, typography, and colors
 */
export default function SignUp() {
	const navigate = useNavigate();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const validateEmail = (value: string): string | undefined => {
		if (!value) {
			return 'Email address is required';
		}
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(value)) {
			return 'Please enter a valid email address';
		}
		return undefined;
	};

	const validatePassword = (value: string): string | undefined => {
		if (!value) {
			return 'Password is required';
		}
		if (value.length < 8) {
			return 'Password must be at least 8 characters';
		}
		return undefined;
	};

	const handleGoogleAuth = () => {
		// Mock Google OAuth - will be implemented later
		console.log('Google OAuth clicked');
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const emailError = validateEmail(email);
		const passwordError = validatePassword(password);

		if (emailError || passwordError) {
			setErrors({
				email: emailError,
				password: passwordError,
			});
			return;
		}

		setErrors({});
		setIsSubmitting(true);

		try {
			const result = await mockSignup(email, password);

			if (result.success) {
				// Redirect based on onboarding state
				setIsSubmitting(false);
				const redirectPath = getPostAuthRedirect();
				navigate(redirectPath);
			} else {
				setErrors({ general: result.error || 'Failed to create account' });
				setIsSubmitting(false);
			}
		} catch (error) {
			setErrors({ general: 'An error occurred. Please try again.' });
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen bg-neutral-800 flex items-center justify-center px-10 py-20">
			{/* Container matching Figma: 438px width, centered */}
			<div className="w-full max-w-[438px] flex flex-col gap-8 items-center">
				{/* Title */}
				<h1 className="font-semibold h-[39px] leading-9 text-[30px] text-center text-text-primary tracking-tight whitespace-pre-wrap w-full">
					Create your account
				</h1>

				{/* Google OAuth Button */}
				<GoogleButton onClick={handleGoogleAuth}>
					Sign up with Google
				</GoogleButton>

				{/* Divider */}
				<Divider />

				{/* Form */}
				<form
					onSubmit={handleSubmit}
					className="w-full flex flex-col gap-6 items-start"
				>
					{/* Email Input */}
					<Input
						label="Email address"
						type="email"
						placeholder="Enter your email address"
						value={email}
						onChange={(e) => {
							setEmail(e.target.value);
							if (errors.email) {
								setErrors({ ...errors, email: undefined });
							}
						}}
						error={errors.email}
					/>

					{/* Password Input */}
					<Input
						label="Password"
						type="password"
						placeholder="Enter your password"
						value={password}
						onChange={(e) => {
							setPassword(e.target.value);
							if (errors.password) {
								setErrors({ ...errors, password: undefined });
							}
						}}
						showPasswordToggle
						error={errors.password}
					/>

					{/* General Error Message */}
					{errors.general && (
						<div className="w-full p-4 bg-danger-500/10 border border-danger-500 rounded-lg" role="alert" aria-live="polite">
							<p className="text-sm text-text-danger leading-normal">
								{errors.general}
							</p>
						</div>
					)}

					{/* Submit Button */}
					<div className="w-full flex flex-col gap-8 items-center">
						<Button
							type="submit"
							showArrow
							disabled={isSubmitting}
						>
							Create account
						</Button>

						{/* Link to Login */}
						<div className="flex items-center">
							<p className="font-normal leading-normal text-base text-text-primary tracking-tight">
								Already have an account?{' '}
								<Link
									to="/auth/login"
									className="text-text-brand hover:text-brand-primary-400 transition-colors"
								>
									Login
								</Link>
							</p>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
