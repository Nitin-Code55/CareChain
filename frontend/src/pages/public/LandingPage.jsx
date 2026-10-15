import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  FileCheck,
  UserCheck,
  Lock,
  ArrowRight,
  Database,
  Blocks,
  KeyRound,
  CheckCircle2,
  Stethoscope,
  Users,
  ShieldAlert,
} from 'lucide-react';

export const LandingPage = () => {
  const demoAccounts = [
    {
      role: 'Patient Account',
      email: 'patient@carechain.test',
      pass: 'Patient123!',
      badge: 'PATIENT',
      badgeColor: 'bg-teal-100 text-teal-800',
      description: 'Upload records, grant & revoke doctor permissions, verify SHA-256 byte integrity.',
    },
    {
      role: 'Doctor Account',
      email: 'doctor@carechain.test',
      pass: 'Doctor123!',
      badge: 'DOCTOR',
      badgeColor: 'bg-indigo-100 text-indigo-800',
      description: 'View authorized patient medical histories, download verified records, audit access.',
    },
    {
      role: 'System Administrator',
      email: 'admin@carechain.test',
      pass: 'Admin123!',
      badge: 'ADMIN',
      badgeColor: 'bg-rose-100 text-rose-800',
      description: 'Audit trails, inspect blockchain ledger blocks, monitor user & system stats (zero medical record access).',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-teal-500 selection:text-white">
      {/* Top Banner Navigation */}
      <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center text-slate-900 shadow-md shadow-teal-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-white">CareChain</span>
              <span className="text-xs text-teal-400 font-mono block -mt-1">EHR • B.Tech CSE Prototype</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-md shadow-teal-500/20 transition flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-6">
          <Blocks className="w-4 h-4 text-teal-400" />
          <span>7th-Semester Academic Prototype • Spring Boot 3 & React</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight sm:leading-tight">
          Patient-Centric Electronic Health Records with{' '}
          <span className="bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
            Cryptographic Integrity
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          CareChain eliminates centralized data tampering by anchoring byte-level SHA-256 hashes of off-chain clinical documents directly into a deterministic blockchain ledger.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/login"
            className="px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 hover:from-teal-400 hover:to-cyan-400 shadow-lg shadow-teal-500/25 transition transform active:scale-95 flex items-center gap-2"
          >
            <span>Launch EHR Portal</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#demo-credentials"
            className="px-6 py-3.5 rounded-xl font-semibold text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            Explore Test Accounts
          </a>
        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section className="py-16 bg-slate-950/60 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Academic System Design & Security Pillars
            </h2>
            <p className="mt-3 text-slate-400 text-sm">
              Engineered to resolve real-world clinical security, consent management, and audit requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-5">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white mb-2">Off-Chain Storage Security</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Sensitive patient medical records (PDFs, scans, lab results) remain strictly off-chain with UUID virtualization, ensuring zero health information leaks onto the ledger.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-5">
                <Blocks className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white mb-2">SHA-256 Ledger Anchoring</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Byte-level SHA-256 hashes are calculated on document upload and anchored inside chained blocks with proof nonces. Any bit manipulation flags instant invalidation.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-5">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white mb-2">Patient-Driven Consent</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Doctors have zero visibility into medical files until a patient grants active consent. Patients can revoke doctor access at any second with immediate backend enforcement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Credentials Section */}
      <section id="demo-credentials" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold text-teal-400 tracking-wider">College Evaluation Quick Access</span>
          <h2 className="text-2xl sm:text-3xl font-bold mt-1">Pre-Seeded Demo Test Accounts</h2>
          <p className="text-slate-400 text-sm mt-2">
            The system is pre-populated with realistic patients, doctors, medical records, and block transactions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {demoAccounts.map((acc, i) => (
            <div key={i} className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold text-white text-base">{acc.role}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${acc.badgeColor}`}>
                    {acc.badge}
                  </span>
                </div>
                <p className="text-slate-400 text-xs mb-5 leading-relaxed">
                  {acc.description}
                </p>

                <div className="space-y-2 p-3 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs">
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="text-slate-500">Email:</span>
                    <span className="font-semibold text-teal-300">{acc.email}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="text-slate-500">Password:</span>
                    <span className="font-semibold text-amber-300">{acc.pass}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  to={`/login?email=${encodeURIComponent(acc.email)}`}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center gap-1.5 transition"
                >
                  <span>Use This Account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-10 bg-slate-950 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-medium text-slate-400">
            CareChain — B.Tech 7th Semester Computer Science and Engineering Capstone Prototype
          </p>
          <p className="mt-2 text-slate-600">
            Engineered with Spring Boot 3, Java 21 LTS, React 18, Tailwind CSS, and Cryptographic SHA-256 Blockchain Simulation.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
