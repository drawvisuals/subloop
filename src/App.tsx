import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
// GoogleCallback removed - using token flow (no redirect needed)
import EmailScan from "./pages/Onboarding/EmailScan";
import Scanning from "./pages/Onboarding/Scanning";
import BrowserExtension from "./pages/Onboarding/BrowserExtension";
import SubscriptionsList from "./pages/Subscriptions/SubscriptionsList";
import SubscriptionDetail from "./pages/Subscriptions/SubscriptionDetail";
import AddSubscription from "./pages/Subscriptions/AddSubscription";
import EditSubscription from "./pages/Subscriptions/EditSubscription";
import Settings from "./pages/Settings/Settings";
import Profile from "./pages/Profile/Profile";
import Landing from "./pages/Marketing/Landing";
import CheckoutSuccess from "./pages/Checkout/Success";
import CheckoutCancel from "./pages/Checkout/Cancel";
import { ProtectedRoute } from "./components/ProtectedRoute";

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Landing />} />
				<Route path="/checkout/success" element={<CheckoutSuccess />} />
				<Route path="/checkout/cancel" element={<CheckoutCancel />} />
				<Route path="/auth/login" element={<Login />} />
				<Route path="/auth/signup" element={<SignUp />} />
				{/* /auth/google/callback route removed - using token flow (no redirect needed) */}
				<Route path="/onboarding/email-scan" element={<EmailScan />} />
				<Route path="/onboarding/scanning" element={<Scanning />} />
				<Route path="/onboarding/browser-extension" element={<BrowserExtension />} />
				<Route path="/app/subscriptions" element={<ProtectedRoute><SubscriptionsList /></ProtectedRoute>} />
				<Route path="/app/subscriptions/new" element={<ProtectedRoute><AddSubscription /></ProtectedRoute>} />
				<Route path="/app/subscription/:id/edit" element={<ProtectedRoute><EditSubscription /></ProtectedRoute>} />
				<Route path="/app/subscription/:id" element={<ProtectedRoute><SubscriptionDetail /></ProtectedRoute>} />
				<Route path="/app/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
				<Route path="/app/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
			</Routes>
		</BrowserRouter>
	);
}

