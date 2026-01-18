import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleButton, Input, Divider, Button } from '@/components/Auth';
import { mockLogin } from '@/services/auth';
import { getPostAuthRedirect } from '@/services/onboarding';

/**
 * Login page
 * Matches Figma design exactly with proper spacing, typography, and colors
 */
export default function Login() {
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
		return undefined;
	};

	const handleGoogleAuth = () => {
		// Mock Google OAuth - will be implemented later
		console.log('Google OAuth clicked');
	};

	const handleForgotPassword = () => {
		// Mock forgot password - will be implemented later
		console.log('Forgot password clicked');
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
			const result = await mockLogin(email, password);

			if (result.success) {
				// Redirect based on onboarding state
				setIsSubmitting(false);
				const redirectPath = getPostAuthRedirect();
				navigate(redirectPath);
			} else {
				setErrors({ general: result.error || 'Invalid email or password' });
				setIsSubmitting(false);
			}
		} catch (error) {
			setErrors({ general: 'An error occurred. Please try again.' });
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen bg-neutral-900 flex items-center justify-center px-10 py-20">
			{/* Container matching Figma: 439px width, centered */}
			<div className="w-full max-w-[439px] flex flex-col gap-8 items-center">
				{/* Title */}
				<h1 className="font-semibold h-[39px] leading-9 text-[30px] text-center text-white tracking-tight whitespace-pre-wrap w-full">
					Login
				</h1>

				{/* Google OAuth Button */}
				<GoogleButton onClick={handleGoogleAuth}>
					Login with Google
				</GoogleButton>

				{/* Divider */}
				<Divider />

				{/* Form */}
				<form
					onSubmit={handleSubmit}
					className="w-full flex flex-col gap-6 items-center"
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

					{/* Password Input with Forgot Password */}
					<div className="w-full flex flex-col gap-2 items-start">
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

						{/* Forgot Password Link */}
						<button
							type="button"
							onClick={handleForgotPassword}
							className="w-full h-4 leading-[22px] text-neutral-700 text-base text-right tracking-tight hover:text-brand-primary-500 transition-colors"
						>
							Forgot password?
						</button>
					</div>

					{/* General Error Message */}
					{errors.general && (
						<div className="w-full p-4 bg-danger-500/10 border border-danger-500 rounded-lg" role="alert" aria-live="polite">
							<p className="text-sm text-danger-500 leading-[22px]">
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
							Login
						</Button>

						{/* Link to Sign Up */}
						<div className="flex items-center">
							<p className="font-normal leading-[22px] text-base text-white tracking-tight">
								Don't have an account?{' '}
								<Link
									to="/auth/signup"
									className="text-brand-primary-500 hover:text-brand-primary-400 transition-colors"
								>
									Create account
								</Link>
							</p>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
