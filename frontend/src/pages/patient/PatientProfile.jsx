import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import userService from '../../services/userService';
import {
  User,
  Mail,
  Heart,
  Phone,
  AlertCircle,
  CheckCircle2,
  Save,
  ShieldCheck,
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export const PatientProfile = () => {
  const { user, refreshUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const [bloodGroup, setBloodGroup] = useState('O+');
  const [gender, setGender] = useState('Male');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [allergies, setAllergies] = useState('');
  const [chronicConditions, setChronicConditions] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await userService.getProfile();
        if (data.patientProfile) {
          setBloodGroup(data.patientProfile.bloodGroup || 'O+');
          setGender(data.patientProfile.gender || 'Other');
          setEmergencyContact(data.patientProfile.emergencyContact || '');
          setAllergies(data.patientProfile.allergies || '');
          setChronicConditions(data.patientProfile.chronicConditions || '');
        }
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback({ type: '', message: '' });

    try {
      await userService.updatePatientProfile({
        bloodGroup,
        gender,
        emergencyContact,
        allergies,
        chronicConditions,
      });
      await refreshUser();
      setFeedback({
        type: 'success',
        message: 'Patient profile and medical parameters updated successfully.',
      });
    } catch (err) {
      console.error('Update failed', err);
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to update patient profile.',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" message="Loading patient health profile..." />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Patient Health Profile
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage clinical baseline demographics and emergency health data.
        </p>
      </div>

      {feedback.message && (
        <div className={`p-4 rounded-xl text-xs flex items-center gap-2.5 ${
          feedback.type === 'success'
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Account Info Card (Read only) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
        <h2 className="text-xs uppercase font-bold text-slate-400 mb-3 tracking-wider">
          Identity Credentials
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-500 block mb-0.5">Full Name</span>
            <div className="font-semibold text-slate-900">{user?.fullName}</div>
          </div>
          <div>
            <span className="text-slate-500 block mb-0.5">Registered Email</span>
            <div className="font-semibold text-slate-900">{user?.email}</div>
          </div>
        </div>
      </div>

      {/* Health Parameters Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900">Clinical Demographics</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Blood Group</label>
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-teal-500"
            >
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-teal-500"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Emergency Contact</label>
          <input
            type="text"
            value={emergencyContact}
            onChange={(e) => setEmergencyContact(e.target.value)}
            placeholder="e.g. Spouse: Sarah (555-0192)"
            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Allergies</label>
          <input
            type="text"
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
            placeholder="e.g. Penicillin, Peanuts, Latex"
            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Chronic Conditions</label>
          <textarea
            rows={3}
            value={chronicConditions}
            onChange={(e) => setChronicConditions(e.target.value)}
            placeholder="e.g. Hypertension, Type 2 Diabetes..."
            className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-sm disabled:opacity-50 transition flex items-center gap-2"
          >
            {saving ? <LoadingSpinner size="sm" /> : <Save className="w-4 h-4" />}
            <span>Save Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientProfile;
