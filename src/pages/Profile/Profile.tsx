import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppLayout } from '@/components/Layout';
import { Button, Input } from '@/components/Auth';
import { mockLogout, getCurrentUser } from '@/services/auth';
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

const PROFILE_STORAGE_KEY = 'subloop_profile_data';

interface ProfileData {
  name: string;
  photoUrl?: string;
  email: string;
  lastLogin: Date;
  plan: string;
  connectedEmails: number;
  activeSubscriptions: number;
  inactiveSubscriptions: number;
}

export default function Profile() {
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', photoUrl: '' });
  const [errors, setErrors] = useState<{ name?: string; photoUrl?: string }>({});
  const [photoError, setPhotoError] = useState(false);
  const [previewPhotoError, setPreviewPhotoError] = useState(false);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);

  // Load profile data from localStorage or use defaults
  const loadProfileData = (): ProfileData => {
    // Get authenticated user's email (cannot be changed)
    const authEmail = getCurrentUser() || '';

    try {
      const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...parsed,
          email: authEmail, // Always use authenticated email
          lastLogin: new Date(parsed.lastLogin),
        };
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
    }
    // Default data - always use authenticated email
    return {
      name: 'Ivan Rubyo',
      photoUrl: undefined,
      email: authEmail, // Use authenticated email, not hardcoded
      lastLogin: new Date('2026-01-16'),
      plan: 'Free',
      connectedEmails: 1,
      activeSubscriptions: 5,
      inactiveSubscriptions: 2,
    };
  };

  const [profileData, setProfileData] = useState<ProfileData>(loadProfileData);

  // Update email from auth when component mounts or auth changes
  useEffect(() => {
    const authEmail = getCurrentUser();
    if (authEmail && authEmail !== profileData.email) {
      setProfileData(prev => ({
        ...prev,
        email: authEmail,
      }));
    }
  }, []);

  // Initialize form data when entering edit mode
  useEffect(() => {
    if (isEditing) {
      setFormData({
        name: profileData.name,
        photoUrl: profileData.photoUrl || '',
      });
      setErrors({});
      setPreviewPhotoError(false);
      setUploadedPhoto(null); // Reset uploaded photo when entering edit mode
    }
  }, [isEditing, profileData]);

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, photoUrl: 'Please select an image file' }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, photoUrl: 'Image size must be less than 5MB' }));
        return;
      }

      // Clear any previous errors
      if (errors.photoUrl) {
        setErrors(prev => ({ ...prev, photoUrl: undefined }));
      }

      // Convert file to data URL for preview and storage
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setUploadedPhoto(dataUrl);
        setFormData(prev => ({ ...prev, photoUrl: dataUrl }));
        setPreviewPhotoError(false);
      };
      reader.onerror = () => {
        setErrors(prev => ({ ...prev, photoUrl: 'Failed to read file' }));
      };
      reader.readAsDataURL(file);
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { name?: string; photoUrl?: string } = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }
    // Always use authenticated email - never save it from form
    const authEmail = getCurrentUser() || profileData.email;

    const updatedData: ProfileData = {
      ...profileData,
      name: formData.name.trim(),
      email: authEmail, // Always use authenticated email - cannot be changed
      // Use uploaded photo if available, otherwise use existing photoUrl
      photoUrl: uploadedPhoto || formData.photoUrl.trim() || undefined,
    };
    setProfileData(updatedData);
    setPhotoError(false); // Reset error state when saving new photo
    // Save to localStorage
    try {
      localStorage.setItem(
        PROFILE_STORAGE_KEY,
        JSON.stringify({
          ...updatedData,
          lastLogin: updatedData.lastLogin.toISOString(),
        })
      );
    } catch (error) {
      console.error('Error saving profile data:', error);
    }
    setIsEditing(false);
    setUploadedPhoto(null); // Clear uploaded photo after saving

    // Dispatch event to notify AppLayout to update profile photo
    window.dispatchEvent(new Event('profileUpdated'));
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({ name: profileData.name, photoUrl: profileData.photoUrl || '' });
    setErrors({});
    setPhotoError(false);
    setPreviewPhotoError(false);
    setUploadedPhoto(null); // Clear uploaded photo on cancel
  };

  const handleLogout = () => {
    // Log out user
    mockLogout();
    // Redirect to landing page
    navigate('/');
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
			<div className="pt-6 sm:pt-8 md:pt-12 pb-6 sm:pb-8 flex justify-center">
				<div className="w-full max-w-[438px] flex flex-col gap-6 sm:gap-8">
          {/* Page Title */}
          <h1 className="font-semibold text-xl sm:text-2xl leading-[28px] sm:leading-[30px] text-text-primary tracking-tight">
            Manage your account
          </h1>

          {/* Profile Information Section */}
          <div className="w-full flex flex-col gap-6">
            <div className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-5 flex flex-col gap-6">
              {/* Header with Edit Icon */}
              <div className="w-full flex items-center justify-between">
                <h2 className="font-normal text-xl leading-[26px] text-text-primary">
                  Profile information
                </h2>
                {!isEditing && (
                  <button
                    type="button"
                    onClick={handleEditProfile}
                    className="p-0 border-0 bg-transparent cursor-pointer"
                    aria-label="Edit profile"
                  >
                    <PenLine className="w-4 h-4 text-text-secondary hover:text-text-primary transition-colors min-w-[20px] min-h-[20px]" />
                  </button>
                )}
              </div>

              {isEditing ? (
                /* Edit Mode - Form Fields */
                <div className="w-full flex flex-col gap-6">
                  {/* Name Input */}
                  <div className="w-full">
                    <Input
                      label="Name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your name"
                      error={errors.name}
                    />
                  </div>

                  {/* Email Display (Read-only) */}
                  <div className="w-full">
                    <div className="flex flex-col gap-2 items-start w-full">
                      <label className="h-4 leading-normal text-text-secondary text-base tracking-tight whitespace-pre-wrap">
                        Email address
                      </label>
                      <div className="w-full h-[62px] px-4 py-5 bg-neutral-900 border-2 border-neutral-700 rounded-lg flex items-center text-text-secondary text-base leading-normal tracking-tight">
                        {profileData.email}
                      </div>
                      <p className="text-xs text-text-secondary leading-normal">
                        Email cannot be changed as it's connected to your account and email scanning
                      </p>
                    </div>
                  </div>

                  {/* Photo Upload Input */}
                  <div className="w-full">
                    <div className="flex flex-col gap-2 items-start w-full">
                      {/* Label */}
                      <label htmlFor="photo-upload" className="h-4 leading-normal text-text-secondary text-base tracking-tight whitespace-pre-wrap">
                        Change photo
                      </label>

                      {/* File Input Container */}
                      <div className={`relative w-full bg-neutral-900 border-2 rounded-lg overflow-hidden ${errors.photoUrl
                          ? 'border-danger-500'
                          : 'border-neutral-700 focus-within:border-brand-primary-500'
                        }`}>
                        <input
                          id="photo-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          aria-invalid={errors.photoUrl ? 'true' : undefined}
                        />
                        <div className="w-full h-[62px] px-4 py-5 flex items-center text-text-primary text-base leading-normal tracking-tight">
                          <span className={uploadedPhoto || formData.photoUrl ? 'text-text-primary' : 'text-text-secondary'}>
                            {uploadedPhoto || formData.photoUrl ? 'Photo selected' : 'Choose an image file'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Error Message */}
                    {errors.photoUrl && (
                      <p className="text-sm text-text-danger leading-normal mt-2" role="alert">
                        {errors.photoUrl}
                      </p>
                    )}

                    {/* Preview */}
                    {(uploadedPhoto || formData.photoUrl) && (
                      <div className="mt-3 flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full overflow-hidden relative border-2 border-neutral-700 shrink-0">
                          {!previewPhotoError ? (
                            <img
                              src={uploadedPhoto || formData.photoUrl}
                              alt="Profile preview"
                              className="w-full h-full object-cover"
                              onError={() => setPreviewPhotoError(true)}
                            />
                          ) : (
                            <>
                              <div className="w-full h-full bg-gradient-to-br from-brand-primary-400 to-brand-secondary-400" />
                              <div className="absolute inset-0 bg-neutral-200/30" />
                            </>
                          )}
                        </div>
                        <p className="text-xs text-text-secondary">Preview</p>
                      </div>
                    )}
                  </div>

                  {/* Save and Cancel Buttons */}
                  <div className="w-full flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="min-h-[44px] sm:h-[54px] px-4 sm:px-6 py-3 sm:py-4 bg-neutral-700 border border-neutral-900 rounded-lg flex gap-2 items-center justify-center hover:bg-neutral-600 transition-colors shrink-0 active:opacity-75 font-semibold text-sm sm:text-base leading-5 sm:leading-normal text-text-primary"
                    >
                      Cancel
                    </button>
                    <Button type="button" onClick={handleSave} className="flex-1 min-h-[44px] sm:h-[54px]">
                      Save changes
                    </Button>
                  </div>
                </div>
              ) : (
                /* View Mode - Display Profile */
                <>
                  {/* Profile Photo + Name + Email */}
                  <div className="w-full flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                    <div className="flex gap-3 items-center">
                      {/* Profile Photo */}
                      <div className="w-11 h-11 rounded-full overflow-hidden relative border-2 border-neutral-700 shrink-0">
                        {profileData.photoUrl && !photoError ? (
                          <img
                            src={profileData.photoUrl}
                            alt={profileData.name}
                            className="w-full h-full object-cover"
                            onError={() => setPhotoError(true)}
                          />
                        ) : (
                          <>
                            <div className="w-full h-full bg-gradient-to-br from-brand-primary-400 to-brand-secondary-400" />
                            <div className="absolute inset-0 bg-neutral-200/30" />
                          </>
                        )}
                      </div>
                      {/* Name + Email */}
                      <div className="flex flex-col gap-1">
                        <span className="font-normal text-base leading-normal text-text-primary tracking-tight">
                          {profileData.name}
                        </span>
                        <span className="font-light text-sm leading-5 text-text-secondary tracking-tight">
                          {profileData.email}
                        </span>
                      </div>
                    </div>
                    {/* Log Out Button */}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex items-center gap-1 text-sm font-semibold text-text-danger hover:text-danger-500 transition-colors min-h-[44px] sm:min-h-0 active:opacity-75"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log out</span>
                    </button>
                  </div>
                </>
              )}

              {/* Connected Email Account */}
              <div className="flex flex-col gap-2 pl-3.5">
                <div className="flex items-center gap-2">
                  {/* Gmail Icon placeholder */}
                  <div className="w-5 h-4 shrink-0 bg-neutral-500 rounded" />
                  <span className="font-normal text-base leading-normal text-text-primary tracking-tight">
                    {profileData.email}
                  </span>
                </div>
                <span className="font-light text-sm leading-5 text-text-secondary tracking-tight">
                  Last login: {formatDate(profileData.lastLogin)}
                </span>
              </div>
            </div>
          </div>

          {/* Plan and Usage Section */}
          <div className="w-full flex flex-col gap-6">
            <div className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-5 flex flex-col gap-6">
              <h2 className="font-normal text-xl leading-[26px] text-text-primary">
                Plan and usage
              </h2>

              {/* Current Plan */}
              <div className="w-full pb-5 border-b border-neutral-700 flex flex-col sm:flex-row gap-3 sm:gap-0 items-start sm:items-center justify-between">
                <div className="flex-1 flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Snail className="w-4 h-4 text-text-secondary shrink-0" />
                    <span className="font-mono font-normal text-sm leading-5 text-text-secondary">
                      Current plan
                    </span>
                  </div>
                  <span className="font-normal text-base leading-normal text-text-primary tracking-tight">
                    {profileData.plan}
                  </span>
                </div>
                <Link
                  to="/#pricing"
                  className="h-[34px] px-4 py-1.5 rounded-lg flex items-center justify-center font-semibold text-sm leading-5 text-text-primary overflow-hidden bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500 hover:from-brand-secondary-500 hover:to-brand-primary-500 transition-all relative"
                >
                  <span className="relative z-10">Get Pro</span>
                  <div className="absolute inset-0 rounded-[inherit] pointer-events-none shadow-[inset_0px_1px_2px_0px_rgba(146,231,255,0.5)]" />
                </Link>
              </div>

              {/* Connected Emails */}
              <div className="w-full pb-5 border-b border-neutral-700 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <MailCheck className="w-4 h-4 text-text-secondary shrink-0" />
                  <span className="font-mono font-normal text-sm leading-5 text-text-secondary">
                    Connected emails
                  </span>
                </div>
                <span className="font-normal text-base leading-normal text-text-primary tracking-tight">
                  {profileData.connectedEmails} inbox connected
                </span>
              </div>

              {/* Subscriptions Tracked */}
              <div className="w-full flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <TableProperties className="w-4 h-4 text-text-secondary shrink-0" />
                  <span className="font-mono font-normal text-sm leading-5 text-text-secondary">
                    Subscriptions tracked
                  </span>
                </div>
                <span className="font-normal text-base leading-normal text-text-primary tracking-tight">
                  {profileData.activeSubscriptions} active subscriptions and {profileData.inactiveSubscriptions} inactive
                </span>
              </div>
            </div>
          </div>

          {/* Privacy and Data Section */}
          <div className="w-full flex flex-col gap-6">
            <div className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-5 flex flex-col gap-6">
              <h2 className="font-normal text-xl leading-[26px] text-text-primary">
                Privacy and data
              </h2>

              {/* Email Access */}
              <div className="w-full pb-5 border-b border-neutral-700 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <MailCheck className="w-4 h-4 text-text-secondary shrink-0" />
                  <span className="font-mono font-normal text-sm leading-5 text-text-secondary">
                    Email access
                  </span>
                </div>
                <span className="font-normal text-base leading-normal text-text-primary tracking-tight">
                  Read-only access to billing emails
                </span>
              </div>

              {/* Data Storage */}
              <div className="w-full pb-5 border-b border-neutral-700 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <DatabaseZap className="w-4 h-4 text-text-secondary shrink-0" />
                  <span className="font-mono font-normal text-sm leading-5 text-text-secondary">
                    Data storage
                  </span>
                </div>
                <span className="font-normal text-base leading-normal text-text-primary tracking-tight">
                  We store only subscription metadata
                </span>
              </div>

              {/* Privacy Policy Button */}
              <button
                type="button"
                onClick={handlePrivacyPolicy}
                className="w-auto px-6 py-2.5 bg-neutral-700 rounded-lg flex items-center justify-center font-semibold text-base leading-normal text-text-primary hover:bg-neutral-600 transition-colors"
              >
                Privacy Policy
              </button>
            </div>
          </div>

          {/* Delete Account Section */}
          <div className="w-full flex flex-col gap-6">
            <div className="w-full bg-neutral-900 border border-danger-500 rounded-lg p-5 flex flex-col gap-6">
              <h2 className="font-normal text-xl leading-[26px] text-text-primary">
                Delete account
              </h2>

              {/* Delete Account Info */}
              <div className="w-full pb-5 border-b border-neutral-700 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Skull className="w-4 h-4 text-text-secondary shrink-0" />
                  <span className="font-mono font-normal text-sm leading-5 text-text-secondary">
                    Delete account
                  </span>
                </div>
                <p className="font-normal text-base leading-normal text-text-primary tracking-tight">
                  This will permanently delete your account and all associated data.{' '}
                  <span className="text-danger-400">This action can't be undone.</span>
                </p>
              </div>

              {/* Delete Account Button */}
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="w-auto px-6 py-2.5 bg-danger-500 rounded-lg flex items-center justify-center font-semibold text-base leading-normal text-text-primary hover:bg-danger-600 transition-colors"
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
                  <AlertTriangle className="w-5 h-5 text-text-danger shrink-0 mt-0.5" />
                  <div className="flex-1 flex flex-col gap-2">
                    <h3 className="font-semibold text-lg leading-6 text-text-primary">
                      Delete account?
                    </h3>
                    <p className="font-normal text-sm leading-5 text-text-secondary">
                      This action will permanently delete your account and all associated data. This cannot be undone.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 mt-2">
                  <button
                    type="button"
                    onClick={handleCancelDelete}
                    className="flex-1 px-4 py-2.5 bg-neutral-700 border border-neutral-700 text-text-primary text-sm font-medium rounded-lg hover:bg-neutral-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmDelete}
                    className="flex-1 px-4 py-2.5 bg-danger-500 text-text-primary text-sm font-medium rounded-lg hover:bg-danger-600 transition-colors"
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
