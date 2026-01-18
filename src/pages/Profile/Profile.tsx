import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/Layout';
import { Button } from '@/components/Auth';
import { redirectToCheckout } from '@/services/stripe';
import {
  PenLine,
  LogOut,
  Snail,
  MailCheck,
  TableProperties,
  DatabaseZap,
  Skull,
  AlertTriangle,
} from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Mock data
  const profileData = {
    name: 'Ivan Rubyo',
    email: 'ivan.rubyo@gmail.com',
    lastLogin: new Date('2026-01-16'),
    plan: 'Free',
    connectedEmails: 1,
    activeSubscriptions: 5,
    inactiveSubscriptions: 2,
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleEditProfile = () => {
    // Mock edit profile logic
    console.log('Edit profile');
  };

  const handleLogout = () => {
    // Mock logout logic
    console.log('Log out');
    // In production: clear session and redirect to login
    // navigate('/auth/login');
  };

  const handleGetPro = () => {
    // Redirect to Stripe checkout for Pro monthly plan
    redirectToCheckout('pro-monthly');
  };

  const handlePrivacyPolicy = () => {
    // Open privacy policy
    console.log('Open privacy policy');
  };

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    // Mock delete account logic
    console.log('Delete account confirmed');
    setShowDeleteConfirm(false);
    // In production: delete account and redirect to login
    // navigate('/auth/login');
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <AppLayout>
      <div className="pt-12 pb-8">
        <div className="w-full max-w-[438px] flex flex-col gap-8">
          {/* Page Title */}
          <h1 className="font-semibold text-2xl leading-[30px] text-white tracking-tight">
            Manage your account
          </h1>

          {/* Profile Information Section */}
          <div className="w-full flex flex-col gap-6">
            <div className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-5 flex flex-col gap-6">
              {/* Header with Edit Icon */}
              <div className="w-full flex items-center justify-between">
                <h2 className="font-normal text-xl leading-[26px] text-white">
                  Profile information
                </h2>
                <button
                  type="button"
                  onClick={handleEditProfile}
                  className="w-4 h-4 text-white hover:text-brand-primary-500 transition-colors"
                  aria-label="Edit profile"
                >
                  <PenLine className="w-4 h-4" />
                </button>
              </div>

              {/* Profile Photo + Name + Email */}
              <div className="w-full flex items-center justify-between">
                <div className="flex gap-3 items-center">
                  {/* Profile Photo */}
                  <div className="w-11 h-11 rounded-full overflow-hidden relative border-2 border-neutral-400 shrink-0">
                    <div className="w-full h-full bg-gradient-to-br from-brand-primary-400 to-brand-secondary-400" />
                    <div className="absolute inset-0 bg-neutral-200/30" />
                  </div>
                  {/* Name + Email */}
                  <div className="flex flex-col gap-1">
                    <span className="font-normal text-base leading-[22px] text-white tracking-tight">
                      {profileData.name}
                    </span>
                    <span className="font-light text-sm leading-5 text-neutral-700 tracking-tight">
                      {profileData.email}
                    </span>
                  </div>
                </div>
                {/* Log Out Button */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-sm font-semibold text-danger-400 hover:text-danger-500 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log out</span>
                </button>
              </div>

              {/* Connected Email Account */}
              <div className="flex flex-col gap-2 pl-3.5">
                <div className="flex items-center gap-2">
                  {/* Gmail Icon placeholder */}
                  <div className="w-5 h-4 shrink-0 bg-neutral-500 rounded" />
                  <span className="font-normal text-base leading-[22px] text-white tracking-tight">
                    {profileData.email}
                  </span>
                </div>
                <span className="font-light text-sm leading-5 text-neutral-700 tracking-tight">
                  Last login: {formatDate(profileData.lastLogin)}
                </span>
              </div>
            </div>
          </div>

          {/* Plan and Usage Section */}
          <div className="w-full flex flex-col gap-6">
            <div className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-5 flex flex-col gap-6">
              <h2 className="font-normal text-xl leading-[26px] text-white">
                Plan and usage
              </h2>

              {/* Current Plan */}
              <div className="w-full pb-5 border-b border-neutral-700 flex items-start justify-between">
                <div className="flex-1 flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Snail className="w-4 h-4 text-neutral-700 shrink-0" />
                    <span className="font-mono font-normal text-sm leading-5 text-neutral-700">
                      Current plan
                    </span>
                  </div>
                  <span className="font-normal text-base leading-[22px] text-white tracking-tight">
                    {profileData.plan}
                  </span>
                </div>
                <Button
                  onClick={handleGetPro}
                  className="h-[34px] px-4 py-1.5 text-sm"
                >
                  Get Pro
                </Button>
              </div>

              {/* Connected Emails */}
              <div className="w-full pb-5 border-b border-neutral-700 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <MailCheck className="w-4 h-4 text-neutral-700 shrink-0" />
                  <span className="font-mono font-normal text-sm leading-5 text-neutral-700">
                    Connected emails
                  </span>
                </div>
                <span className="font-normal text-base leading-[22px] text-white tracking-tight">
                  {profileData.connectedEmails} inbox connected
                </span>
              </div>

              {/* Subscriptions Tracked */}
              <div className="w-full flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <TableProperties className="w-4 h-4 text-neutral-700 shrink-0" />
                  <span className="font-mono font-normal text-sm leading-5 text-neutral-700">
                    Subscriptions tracked
                  </span>
                </div>
                <span className="font-normal text-base leading-[22px] text-white tracking-tight">
                  {profileData.activeSubscriptions} active subscriptions and {profileData.inactiveSubscriptions} inactive
                </span>
              </div>
            </div>
          </div>

          {/* Privacy and Data Section */}
          <div className="w-full flex flex-col gap-6">
            <div className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-5 flex flex-col gap-6">
              <h2 className="font-normal text-xl leading-[26px] text-white">
                Privacy and data
              </h2>

              {/* Email Access */}
              <div className="w-full pb-5 border-b border-neutral-700 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <MailCheck className="w-4 h-4 text-neutral-700 shrink-0" />
                  <span className="font-mono font-normal text-sm leading-5 text-neutral-700">
                    Email access
                  </span>
                </div>
                <span className="font-normal text-base leading-[22px] text-white tracking-tight">
                  Read-only access to billing emails
                </span>
              </div>

              {/* Data Storage */}
              <div className="w-full pb-5 border-b border-neutral-700 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <DatabaseZap className="w-4 h-4 text-neutral-700 shrink-0" />
                  <span className="font-mono font-normal text-sm leading-5 text-neutral-700">
                    Data storage
                  </span>
                </div>
                <span className="font-normal text-base leading-[22px] text-white tracking-tight">
                  We store only subscription metadata
                </span>
              </div>

              {/* Privacy Policy Button */}
              <button
                type="button"
                onClick={handlePrivacyPolicy}
                className="w-auto px-6 py-2.5 bg-neutral-700 rounded-lg flex items-center justify-center font-semibold text-base leading-[22px] text-white hover:bg-neutral-600 transition-colors"
              >
                Privacy Policy
              </button>
            </div>
          </div>

          {/* Delete Account Section */}
          <div className="w-full flex flex-col gap-6">
            <div className="w-full bg-neutral-900 border border-danger-500 rounded-lg p-5 flex flex-col gap-6">
              <h2 className="font-normal text-xl leading-[26px] text-white">
                Delete account
              </h2>

              {/* Delete Account Info */}
              <div className="w-full pb-5 border-b border-neutral-700 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Skull className="w-4 h-4 text-neutral-700 shrink-0" />
                  <span className="font-mono font-normal text-sm leading-5 text-neutral-700">
                    Delete account
                  </span>
                </div>
                <p className="font-normal text-base leading-[22px] text-white tracking-tight">
                  This will permanently delete your account and all associated data.{' '}
                  <span className="text-danger-400">This action can't be undone.</span>
                </p>
              </div>

              {/* Delete Account Button */}
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="w-auto px-6 py-2.5 bg-danger-500 rounded-lg flex items-center justify-center font-semibold text-base leading-[22px] text-white hover:bg-danger-600 transition-colors"
              >
                Delete account
              </button>
            </div>
          </div>

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-6 max-w-md w-full flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-danger-500 shrink-0 mt-0.5" />
                  <div className="flex-1 flex flex-col gap-2">
                    <h3 className="font-semibold text-lg leading-6 text-white">
                      Delete account?
                    </h3>
                    <p className="font-normal text-sm leading-5 text-neutral-700">
                      This action will permanently delete your account and all associated data. This cannot be undone.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 mt-2">
                  <button
                    type="button"
                    onClick={handleCancelDelete}
                    className="flex-1 px-4 py-2.5 bg-neutral-700 border border-neutral-600 text-white text-sm font-medium rounded-lg hover:bg-neutral-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmDelete}
                    className="flex-1 px-4 py-2.5 bg-danger-500 text-white text-sm font-medium rounded-lg hover:bg-danger-600 transition-colors"
                  >
                    Delete account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
