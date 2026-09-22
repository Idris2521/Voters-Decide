import React, { useState } from 'react';
import { X, UserPlus, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface ContestantRegisterModalProps {
  contestSlug: string;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export const ContestantRegisterModal: React.FC<ContestantRegisterModalProps> = ({
  contestSlug,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [bio, setBio] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || name.trim().length < 2) {
      setError('Candidate full name is required.');
      return;
    }

    if (!whatsappNumber.trim()) {
      setError('A valid WhatsApp contact number is required for contestant verification.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/contests/${contestSlug}/register-contestant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          whatsappNumber: whatsappNumber.trim(),
          bio: bio.trim(),
          photoUrl: photoUrl.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || data.message || 'Registration failed.');
      }

      onSuccess(data.message || 'Application submitted for admin review.');
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div 
        id="contestant-register-modal"
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
      >
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold">Apply as Contestant</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
            <strong>Candidate Verification:</strong> All submitted entries are reviewed by contest administrators. Approved candidates are assigned an official contestant number and listed on the voting page.
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Full Legal Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              disabled={isSubmitting}
              placeholder="e.g. Samuel Adekunle"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              WhatsApp Contact <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              required
              disabled={isSubmitting}
              placeholder="e.g. 08012345678 or +234..."
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <span className="text-[11px] text-slate-500">Kept private; only used by contest admins for communication.</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Short Bio / Platform Initiative
            </label>
            <textarea
              rows={3}
              disabled={isSubmitting}
              placeholder="Briefly describe your project, community initiative, or talent..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Photo URL (Optional)
            </label>
            <input
              type="url"
              disabled={isSubmitting}
              placeholder="https://..."
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <span className="text-[11px] text-slate-500">Provide a direct portrait image link, or leave blank to use default avatar.</span>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-xs flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Submit Application</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
