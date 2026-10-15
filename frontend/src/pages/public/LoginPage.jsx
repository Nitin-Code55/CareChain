import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, Lock, Mail, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export const LoginPage = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, navigate to dashboard
  useEffect(() => {
    if (user) {
      if (user.role === 'PATIENT') navigate('/patient/dashboard');
      else if (user.role === 'DOCTOR') navigate('/doctor/dashboard');
      else if (user.role === 'ADMIN') navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  // Read URL params if email is prefilled
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get('email');
    if (emailParam) {
      setEmail(emailParam);
      if (emailParam.includes('admin')) setPassword('Admin123!');
      else if (emailParam.includes('doctor')) setPassword('Doctor123!');
      else if (emailParam.includes('patient')) setPassword('Patient123!');
    }
    if (params.get('sessionExpired')) {
      setError('Your session has expired. Please log in again.');
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userData = await login(email, password);
      if (userData.role === 'PATIENT') navigate('/patient/dashboard');
      else if (userData.role === 'DOCTOR') navigate('/doctor/dashboard');
      else if (userData.role === 'ADMIN') navigate('/admin/dashboard');
      else navigate('/');
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        'Authentication failed. Please verify your email and password.'
      );
    } finally {
      setLoading(false);
    }
  };

  const fillQuick = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
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
        <h2 className="text-2xl font-bold text-white tracking-tight">Sign in to your EHR portal</h2>
        <p className="mt-1 text-xs text-slate-400">
          Enter credentials or click any quick-demo badge below.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-slate-950/80 border border-slate-800 py-8 px-6 sm:px-10 rounded-2xl shadow-2xl backdrop-blur-md">
          {/* Quick Demo Fillers */}
          <div className="mb-6 p-3 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 block mb-2 uppercase tracking-wider">
              Quick Academic Test Accounts:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillQuick('patient@carechain.test', 'Patient123!')}
                className="py-1.5 px-2 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-semibold transition"
              >
                Patient
              </button>
              <button
                type="button"
                onClick={() => fillQuick('doctor@carechain.test', 'Doctor123!')}
                className="py-1.5 px-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold transition"
              >
                Doctor
              </button>
              <button
                type="button"
                onClick={() => fillQuick('admin@carechain.test', 'Admin123!')}
                className="py-1.5 px-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold transition"
              >
                Admin
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-950/50 border border-red-800/80 text-red-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
              <div className="relative rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@carechain.test"
                  className="block w-full rounded-xl border border-slate-700 bg-slate-900 py-2.5 pl-10 pr-3 text-white placeholder-slate-500 text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
              <div className="relative rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full rounded-xl border border-slate-700 bg-slate-900 py-2.5 pl-10 pr-3 text-white placeholder-slate-500 text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-xs bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-md shadow-teal-500/20 disabled:opacity-50 transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-400">
              New patient or physician?{' '}
              <Link to="/register" className="font-semibold text-teal-400 hover:text-teal-300">
                Register Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
