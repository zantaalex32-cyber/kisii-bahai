import React, { useState } from 'react';
import { z } from 'zod';
import { User, Mail, Phone, MapPin, FileQuestion, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { StorageDB } from '../lib/storage';

const accessRequestSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(8, 'Phone number must be at least 8 digits'),
  localityId: z.string().min(1, 'Please select your locality'),
  reason: z.string().min(10, 'Please provide at least a brief sentence explaining your request reason'),
});

interface RequestAccessViewProps {
  onNavigate: (path: string) => void;
}

export const RequestAccessView: React.FC<RequestAccessViewProps> = ({ onNavigate }) => {
  const localities = StorageDB.getLocalities();
  const cluster = StorageDB.getCluster();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [localityId, setLocalityId] = useState(localities[0]?.id || 'loc-01');
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = accessRequestSchema.safeParse({
      fullName,
      email,
      phone,
      localityId,
      reason,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    const loc = localities.find((l) => l.id === localityId);

    // Save into access_requests table
    StorageDB.addAccessRequest({
      full_name: fullName,
      email,
      phone,
      locality_id: localityId,
      locality_name: loc?.name,
      cluster_id: cluster.id,
      reason,
    });

    // Notify administrators
    StorageDB.addNotification({
      user_id: 'user-admin-01',
      title: 'New Access Request Submitted',
      message: `${fullName} submitted an access request for ${loc?.name || 'Kisii Cluster'}.`,
      type: 'action_required',
      link_url: '/admin/access-requests',
    });

    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 text-center space-y-5 animate-in fade-in">
        <div className="w-16 h-16 rounded-3xl bg-teal-100 text-teal-700 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900">
          Request Received
        </h2>
        <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl text-xs sm:text-sm text-teal-900 leading-relaxed font-medium">
          “Your access request has been submitted and is awaiting approval.”
        </div>
        <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
          An authorized administrator from <strong>{cluster.name}</strong> will review your details. Once approved, you will be assigned an appropriate role and granted access to internal cluster schedules, documents, and resources.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <button
            onClick={() => onNavigate('/')}
            className="px-5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition"
          >
            Back to Public Portal
          </button>
          <button
            onClick={() => onNavigate('/login')}
            className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition"
          >
            Sign In with Test Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto py-6 sm:py-10 space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          <span>Authorized Membership Verification</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Request Access to Kisii Cluster Portal
        </h1>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Internal cluster resources, tutor materials, and participant activities require verified authorization.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Full Name</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Jared Omwamba"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-hidden transition ${
                errors.fullName ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:border-teal-500'
              }`}
            />
            {errors.fullName && <p className="text-[11px] text-rose-600">{errors.fullName}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. jared.omwamba@example.com"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-hidden transition ${
                errors.email ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:border-teal-500'
              }`}
            />
            {errors.email && <p className="text-[11px] text-rose-600">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>Phone Number</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+254 712 345 678"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-hidden transition ${
                errors.phone ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:border-teal-500'
              }`}
            />
            {errors.phone && <p className="text-[11px] text-rose-600">{errors.phone}</p>}
          </div>

          {/* Locality */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Locality in Kisii Cluster</span>
            </label>
            <select
              value={localityId}
              onChange={(e) => setLocalityId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-teal-500 bg-white"
            >
              {localities.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Reason */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <FileQuestion className="w-3.5 h-3.5 text-slate-400" />
              <span>Reason for Requesting Access</span>
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. I participate in a weekly study circle in Kisii Central and would like to access internal materials and reflection dates."
              className={`w-full px-3.5 py-2 rounded-xl border text-sm focus:outline-hidden transition ${
                errors.reason ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:border-teal-500'
              }`}
            />
            {errors.reason && <p className="text-[11px] text-rose-600">{errors.reason}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm transition shadow-xs flex items-center justify-center gap-2 mt-2"
          >
            <span>Submit Access Request</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-[11px] text-slate-400 text-center pt-2">
          Your contact information will only be visible to authorized cluster coordinators and administrators.
        </p>
      </div>
    </div>
  );
};
