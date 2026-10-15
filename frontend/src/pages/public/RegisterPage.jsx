import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, User, Mail, Lock, Stethoscope, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('PATIENT');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Doctor specific fields
  const [specialization, setSpecialization] = useState('Cardiology');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [hospitalAffiliation, setHospitalAffiliation] = useState('');

  // Patient specific fields
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [gender, setGender] = useState('Other');
  const [emergencyContact, setEmergencyContact] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = {
      fullName,
      email,
      password,
      role,
      ...(role === 'DOCTOR' ? {
        specialization,
        licenseNumber,
        hospitalAffiliation,
      } : {
        bloodGroup,
        gender,
        emergencyContact,
      })
    };

    try {
      await register(payload);
      setSuccess(true);
      setTimeout(() => {
        navigate(`/login?email=${encodeURIComponent(email)}`);
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        'Registration failed. Please verify your details or use another email.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-teal-500 selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center text-slate-900 shadow-md shadow-teal-500/20">
            <Shield className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-white">CareChain</span>
        </Link>
        <h2 className="text-2xl font-bold text-white tracking-tight">Create CareChain Account</h2>
        <p className="mt-1 text-xs text-slate-400">
          Select your clinical role to initiate cryptographic registration.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg px-4">
        <div className="bg-slate-950/80 border border-slate-800 py-8 px-6 sm:px-10 rounded-2xl shadow-2xl backdrop-blur-md">
          {/* Role Selector Tabs */}
          <div className="grid grid-cols-2 gap-3 mb-6 p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              type="button"
              onClick={() => setRole('PATIENT')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition ${
                role === 'PATIENT'
                  ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Patient Account</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('DOCTOR')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition ${
                role === 'DOCTOR'
                  ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              <span>Doctor / Physician</span>
            </button>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-950/50 border border-red-800/80 text-red-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-5 p-3 rounded-xl bg-emerald-950/50 border border-emerald-800/80 text-emerald-300 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Account successfully registered! Redirecting to login...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Dr. Jane Doe or John Smith"
                className="block w-full rounded-xl border border-slate-700 bg-slate-900 py-2.5 px-3.5 text-white placeholder-slate-500 text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="doctor.doe@hospital.test"
                className="block w-full rounded-xl border border-slate-700 bg-slate-900 py-2.5 px-3.5 text-white placeholder-slate-500 text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="block w-full rounded-xl border border-slate-700 bg-slate-900 py-2.5 px-3.5 text-white placeholder-slate-500 text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            {/* Dynamic Role Fields */}
            {role === 'DOCTOR' ? (
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <span className="text-[11px] font-semibold text-indigo-400 block uppercase tracking-wider">
                  Physician Credentials
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Specialization</label>
                    <input
                      type="text"
                      required
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      placeholder="Cardiology, Neurology..."
                      className="block w-full rounded-xl border border-slate-700 bg-slate-900 py-2.5 px-3 text-white text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Medical License</label>
                    <input
                      type="text"
                      required
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      placeholder="e.g. MED-89214"
                      className="block w-full rounded-xl border border-slate-700 bg-slate-900 py-2.5 px-3 text-white text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Hospital Affiliation</label>
                  <input
                    type="text"
                    required
                    value={hospitalAffiliation}
                    onChange={(e) => setHospitalAffiliation(e.target.value)}
                    placeholder="e.g. Metro General Hospital"
                    className="block w-full rounded-xl border border-slate-700 bg-slate-900 py-2.5 px-3 text-white text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <span className="text-[11px] font-semibold text-teal-400 block uppercase tracking-wider">
                  Patient Health Details
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Blood Group</label>
                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="block w-full rounded-xl border border-slate-700 bg-slate-900 py-2.5 px-3 text-white text-xs focus:border-teal-500 focus:outline-none"
                    >
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="block w-full rounded-xl border border-slate-700 bg-slate-900 py-2.5 px-3 text-white text-xs focus:border-teal-500 focus:outline-none"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Emergency Contact</label>
                  <input
                    type="text"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    placeholder="Name and Phone (e.g. Sarah +1-555-0199)"
                    className="block w-full rounded-xl border border-slate-700 bg-slate-900 py-2.5 px-3 text-white text-xs focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || success}
              className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-xs bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-md shadow-teal-500/20 disabled:opacity-50 transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <span>Complete Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-400">
              Already registered on CareChain?{' '}
              <Link to="/login" className="font-semibold text-teal-400 hover:text-teal-300">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
