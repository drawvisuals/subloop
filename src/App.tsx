import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import EmailScan from "./pages/Onboarding/EmailScan";
import Scanning from "./pages/Onboarding/Scanning";
import BrowserExtension from "./pages/Onboarding/BrowserExtension";
import SubscriptionsList from "./pages/Subscriptions/SubscriptionsList";
import SubscriptionDetail from "./pages/Subscriptions/SubscriptionDetail";
import AddSubscription from "./pages/Subscriptions/AddSubscription";
import EditSubscription from "./pages/Subscriptions/EditSubscription";

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Navigate to="/auth/login" replace />} />
				<Route path="/auth/login" element={<Login />} />
				<Route path="/auth/signup" element={<SignUp />} />
				<Route path="/onboarding/email-scan" element={<EmailScan />} />
				<Route path="/onboarding/scanning" element={<Scanning />} />
				<Route path="/onboarding/browser-extension" element={<BrowserExtension />} />
				<Route path="/app/subscriptions" element={<SubscriptionsList />} />
				<Route path="/app/subscription/add" element={<AddSubscription />} />
				<Route path="/app/subscription/:id/edit" element={<EditSubscription />} />
				<Route path="/app/subscription/:id" element={<SubscriptionDetail />} />
			</Routes>
		</BrowserRouter>
	);
}

