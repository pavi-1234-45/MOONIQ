"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "@/lib/firebase";

/* ──────────────────────────────────────────────────────────────────────────── */

export default function AuthPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");

  // Register fields
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPass, setRegPass] = useState("");
  const [regConfirm, setRegConfirm] = useState("");

  const goToDashboard = () => router.push("/dashboard");

  /* ─── Handlers ────────────────────────────────────────────────────────── */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPass);
      goToDashboard();
    } catch (err: any) {
      setError(err.message?.replace("Firebase: ", "") || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (regPass !== regConfirm) {
      setError("Passwords do not match");
      return;
    }
    if (regPass.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, regEmail, regPass);
      await updateProfile(cred.user, { displayName: regName });
      goToDashboard();
    } catch (err: any) {
      setError(err.message?.replace("Firebase: ", "") || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      goToDashboard();
    } catch (err: any) {
      setError(err.message?.replace("Firebase: ", "") || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  /* ─── Shared input class ──────────────────────────────────────────────── */
  const inputClass =
    "w-full px-4 py-3 rounded-lg bg-[#0d1321] border border-[#1f2937] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00D1FF]/50 focus:border-[#00D1FF] transition-all duration-300";

  /* ─── Render ──────────────────────────────────────────────────────────── */
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0B0F1A]">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {mounted && Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 3 + 1 + "px",
              height: Math.random() * 3 + 1 + "px",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              background: `rgba(${
                i % 3 === 0 ? "0,209,255" : i % 3 === 1 ? "155,92,255" : "0,255,179"
              }, ${Math.random() * 0.5 + 0.2})`,
              animation: `particle-float ${Math.random() * 15 + 10}s linear ${
                Math.random() * 5
              }s infinite`,
            }}
          />
        ))}
      </div>

      {/* Radial gradient overlays */}
      <div
        className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full opacity-20 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #00D1FF 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] rounded-full opacity-15 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #9B5CFF 0%, transparent 70%)",
        }}
      />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div
          className="rounded-2xl p-[1px]"
          style={{
            background:
              "linear-gradient(135deg, rgba(0,209,255,0.4), rgba(155,92,255,0.4), rgba(0,255,179,0.2))",
          }}
        >
          <div className="rounded-2xl bg-[#111827]/90 backdrop-blur-2xl p-8">
            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
              <img
                src="https://image2url.com/r2/default/images/1774258386636-e58b3cf4-24f1-466d-b82f-3f8a2624d165.png"
                alt="MOONIQ"
                className="w-16 h-16 mb-3 object-contain"
                style={{ filter: "drop-shadow(0 0 12px rgba(255,215,0,0.5))" }}
              />
              <h1
                className="text-3xl font-bold tracking-wider"
                style={{
                  fontFamily: "var(--font-orbitron), Orbitron, sans-serif",
                  background: "linear-gradient(135deg, #00D1FF, #9B5CFF)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                MOONIQ
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                AI-Powered Crypto Analytics
              </p>
            </div>

            {/* Tab switcher */}
            <div className="flex mb-6 rounded-lg overflow-hidden bg-[#0d1321] p-1">
              <button
                onClick={() => { setIsRegister(false); setError(""); }}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-md transition-all duration-300 ${
                  !isRegister
                    ? "bg-gradient-to-r from-[#00D1FF] to-[#9B5CFF] text-white shadow-lg shadow-[#00D1FF]/20"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setIsRegister(true); setError(""); }}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-md transition-all duration-300 ${
                  isRegister
                    ? "bg-gradient-to-r from-[#9B5CFF] to-[#00FFB3] text-white shadow-lg shadow-[#9B5CFF]/20"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Register
              </button>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Forms */}
            <AnimatePresence mode="wait">
              {!isRegister ? (
                /* ─── LOGIN ──────────────────────────────────────────── */
                <motion.form
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleLogin}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      value={loginPass}
                      onChange={(e) => setLoginPass(e.target.value)}
                      placeholder="••••••••"
                      className={inputClass}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all duration-300 disabled:opacity-50"
                    style={{
                      background: "linear-gradient(135deg, #00D1FF, #9B5CFF)",
                      boxShadow: "0 0 20px rgba(0,209,255,0.3)",
                    }}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                        </svg>
                        Signing in…
                      </span>
                    ) : "Sign In"}
                  </button>
                </motion.form>
              ) : (
                /* ─── REGISTER ───────────────────────────────────────── */
                <motion.form
                  key="register"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleRegister}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="John Doe"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5">
                      Create Password
                    </label>
                    <input
                      type="password"
                      required
                      value={regPass}
                      onChange={(e) => setRegPass(e.target.value)}
                      placeholder="Min 6 characters"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      required
                      value={regConfirm}
                      onChange={(e) => setRegConfirm(e.target.value)}
                      placeholder="••••••••"
                      className={inputClass}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all duration-300 disabled:opacity-50"
                    style={{
                      background: "linear-gradient(135deg, #9B5CFF, #00FFB3)",
                      boxShadow: "0 0 20px rgba(155,92,255,0.3)",
                    }}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                        </svg>
                        Creating account…
                      </span>
                    ) : "Create Account"}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
              <span className="px-4 text-xs text-gray-500 uppercase tracking-widest">
                or
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
            </div>

            {/* Google button */}
            <button
              onClick={handleGoogle}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-lg bg-[#0d1321] border border-[#1f2937] text-white hover:border-[#00D1FF]/50 hover:bg-[#0d1321]/80 transition-all duration-300 disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span className="font-medium text-sm">Continue with Google</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
