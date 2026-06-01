import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { login, register } from "../services/authServices";

const TABS = ["login", "register"];

const ROLES = ["Cashier", "Admin", "Buyer"];

export default function LoginPage() {
  const { signIn } = useAuth();
  const [tab, setTab] = useState("login");

  // Login form state
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  // Register form state
  const [regForm, setRegForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "Cashier",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleTabSwitch = (t) => {
    setTab(t);
    setErrors({});
  };

  // ── Login ──
  const validateLogin = () => {
    const e = {};
    if (!loginForm.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(loginForm.email))
      e.email = "Invalid email format";
    if (!loginForm.password) e.password = "Password is required";
    return e;
  };

  const handleLogin = async () => {
    const e = validateLogin();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setSubmitting(true);
    setErrors({});
    try {
      const data = await login(loginForm.email, loginForm.password);
      signIn(data.token);
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  // ── Register ──
  const validateRegister = () => {
    const e = {};
    if (!regForm.username.trim()) e.username = "Username is required";
    if (!regForm.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(regForm.email))
      e.email = "Invalid email format";
    if (!regForm.password) e.password = "Password is required";
    else if (regForm.password.length < 6) e.password = "Minimum 6 characters";
    return e;
  };

  const handleRegister = async () => {
    const e = validateRegister();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setSubmitting(true);
    setErrors({});
    try {
      await register(regForm);
      // After register, auto switch to login tab
      setTab("login");
      setLoginForm({ email: regForm.email, password: "" });
      setErrors({ success: "Account created! Please log in." });
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (field) =>
    `w-full px-4 py-2.5 text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-colors ${
      errors[field] ? "border-red-400 bg-red-50" : "border-gray-200"
    }`;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex flex-col justify-between w-96 bg-gray-900 text-white p-10 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🏪</span>
          <span className="font-bold tracking-widest uppercase text-sm">
            KasirApp
          </span>
        </div>
        <div>
          <h2 className="text-3xl font-bold leading-snug mb-3">
            Manage your store, <br />
            <span className="text-indigo-400">smarter.</span>
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Track products, process transactions, and monitor revenue — all in
            one dashboard.
          </p>
        </div>
        <p className="text-xs text-gray-600">© 2025 KasirApp</p>
      </div>

      {/* Right panel - form */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-sm">
          {/* Logo for mobile */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <span className="text-2xl">🏪</span>
            <span className="font-bold tracking-widest uppercase text-sm text-gray-800">
              KasirApp
            </span>
          </div>

          <h1 className="text-xl font-bold text-gray-800 mb-1">
            {tab === "login" ? "Welcome back" : "Create an account"}
          </h1>
          <p className="text-sm text-gray-400 mb-6">
            {tab === "login"
              ? "Sign in to your account to continue."
              : "Fill in your details to get started."}
          </p>

          {/* Tabs */}
          <div className="flex rounded-lg border border-gray-200 overflow-hidden mb-6 bg-gray-100 p-1 gap-1">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => handleTabSwitch(t)}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer capitalize ${
                  tab === t
                    ? "bg-white text-gray-800 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Success message */}
          {errors.success && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-4">
              <span className="text-green-600 text-base">✓</span>
              <p className="text-sm text-green-700">{errors.success}</p>
            </div>
          )}

          {/* Submit error */}
          {errors.submit && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
              <span className="text-red-500 text-base">✕</span>
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          {/* ── LOGIN FORM ── */}
          {tab === "login" && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={loginForm.email}
                  onChange={(e) =>
                    setLoginForm((p) => ({ ...p, email: e.target.value }))
                  }
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  className={inputClass("email")}
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    value={loginForm.password}
                    onChange={(e) =>
                      setLoginForm((p) => ({ ...p, password: e.target.value }))
                    }
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    className={inputClass("password") + " pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer text-sm"
                  >
                    {showPass ? "🙈" : "👁"}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500">{errors.password}</p>
                )}
              </div>

              <button
                onClick={handleLogin}
                disabled={submitting}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 mt-1"
              >
                {submitting && (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                Sign In
              </button>
            </div>
          )}

          {/* ── REGISTER FORM ── */}
          {tab === "register" && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="e.g. budi123"
                  value={regForm.username}
                  onChange={(e) =>
                    setRegForm((p) => ({ ...p, username: e.target.value }))
                  }
                  className={inputClass("username")}
                />
                {errors.username && (
                  <p className="text-xs text-red-500">{errors.username}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={regForm.email}
                  onChange={(e) =>
                    setRegForm((p) => ({ ...p, email: e.target.value }))
                  }
                  className={inputClass("email")}
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Min. 6 characters"
                    value={regForm.password}
                    onChange={(e) =>
                      setRegForm((p) => ({ ...p, password: e.target.value }))
                    }
                    className={inputClass("password") + " pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer text-sm"
                  >
                    {showPass ? "🙈" : "👁"}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500">{errors.password}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Role
                </label>
                <select
                  value={regForm.role}
                  onChange={(e) =>
                    setRegForm((p) => ({ ...p, role: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleRegister}
                disabled={submitting}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 mt-1"
              >
                {submitting && (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                Create Account
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
