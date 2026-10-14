import React, { useState } from "react";

export type AuthMode = "signin" | "register";

export interface LoginFormProps {
  authMode: AuthMode;
  onAuthModeChange: (mode: AuthMode) => void;
  email: string;
  onEmailChange: (val: string) => void;
  password: string;
  onPasswordChange: (val: string) => void;
  fullName: string;
  onFullNameChange: (val: string) => void;
  phone: string;
  onPhoneChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  errorMsg: string;
  onOpenErrorModal: () => void;
  easterEgg: boolean;
  easterLine: string;
}

export function LoginForm({
  authMode,
  onAuthModeChange,
  email,
  onEmailChange,
  password,
  onPasswordChange,
  fullName,
  onFullNameChange,
  phone,
  onPhoneChange,
  onSubmit,
  isSubmitting,
  errorMsg,
  onOpenErrorModal,
  easterEgg,
  easterLine,
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative z-10 flex-1 px-5 flex flex-col gap-4 max-w-md mx-auto w-full">
      {/* Auth Mode Toggle Tabs */}
      <div
        className="grid grid-cols-2 border-2 border-navy p-1 bg-cream-100"
        style={{ boxShadow: "3px 3px 0 #17232B" }}
      >
        <button
          type="button"
          onClick={() => onAuthModeChange("signin")}
          className={`py-2 text-xs font-impact tracking-wider uppercase transition-all duration-100 ${
            authMode === "signin"
              ? "bg-navy text-cream shadow-sm"
              : "text-navy/60 hover:text-navy hover:bg-cream/60"
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => onAuthModeChange("register")}
          className={`py-2 text-xs font-impact tracking-wider uppercase transition-all duration-100 ${
            authMode === "register"
              ? "bg-raspberry text-cream shadow-sm"
              : "text-navy/60 hover:text-navy hover:bg-cream/60"
          }`}
        >
          Create Account
        </button>
      </div>

      {/* Main Email & Password Form */}
      <form
        onSubmit={onSubmit}
        className="bg-cream border-2 border-navy p-5 flex flex-col gap-3.5 transition-all"
        style={{ boxShadow: "4px 4px 0 #17232B" }}
      >
        <div className="flex items-center justify-between border-b-2 border-navy/10 pb-2">
          <span className="text-[11px] font-bold text-navy/50 uppercase tracking-widest">
            {authMode === "signin" ? "Customer Access" : "New Customer Onboarding"}
          </span>
          <span className="text-[10px] font-bold text-raspberry uppercase tracking-widest">
            {authMode === "signin" ? "Returning" : "Welcome"}
          </span>
        </div>

        {/* Full Name & Phone (Register only) */}
        {authMode === "register" && (
          <>
            <div>
              <label className="text-[10px] font-bold text-navy/60 uppercase tracking-widest block mb-1">
                Full Name <span className="text-raspberry">*</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => onFullNameChange(e.target.value)}
                placeholder="e.g. Alex Johnson"
                className="w-full bg-white border-2 border-navy px-3.5 py-2.5 text-sm font-semibold text-navy placeholder:text-navy/30 focus:outline-none focus:border-raspberry transition-colors"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-navy/60 uppercase tracking-widest block mb-1">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => onPhoneChange(e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full bg-white border-2 border-navy px-3.5 py-2.5 text-sm font-semibold text-navy placeholder:text-navy/30 focus:outline-none focus:border-raspberry transition-colors"
              />
            </div>
          </>
        )}

        {/* Email Address */}
        <div>
          <label className="text-[10px] font-bold text-navy/60 uppercase tracking-widest block mb-1">
            Email Address <span className="text-raspberry">*</span>
          </label>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="you@example.com"
            className="w-full bg-white border-2 border-navy px-3.5 py-2.5 text-sm font-semibold text-navy placeholder:text-navy/30 focus:outline-none focus:border-raspberry transition-colors"
          />
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[10px] font-bold text-navy/60 uppercase tracking-widest block">
              Password <span className="text-raspberry">*</span>
            </label>
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="text-[10px] font-bold text-navy/50 hover:text-navy uppercase tracking-wider"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <input
            type={showPassword ? "text" : "password"}
            required
            minLength={8}
            autoComplete={authMode === "signin" ? "current-password" : "new-password"}
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder={authMode === "register" ? "Minimum 8 characters" : "Enter your password"}
            className="w-full bg-white border-2 border-navy px-3.5 py-2.5 text-sm font-semibold text-navy placeholder:text-navy/30 focus:outline-none focus:border-raspberry transition-colors"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="group mt-2 w-full flex items-center justify-center gap-3 bg-cream border-2 border-navy px-5 py-3.5 transition-all duration-75 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ boxShadow: "4px 4px 0 #BCFF4F" }}
        >
          <span className="font-impact text-lg text-navy uppercase tracking-wider">
            {isSubmitting
              ? "Processing..."
              : authMode === "signin"
                ? "Sign In to Order"
                : "Complete Registration"}
          </span>
          <span className="text-navy font-bold text-lg transition-transform group-hover:translate-x-1">
            →
          </span>
        </button>
      </form>

      {/* Error alert trigger button */}
      {errorMsg && (
        <button
          type="button"
          onClick={onOpenErrorModal}
          className="w-full text-left border-l-4 border-raspberry pl-3 py-2.5 bg-raspberry/10 mt-1 mb-1 animate-fade-up hover:bg-raspberry/15 transition-colors group cursor-pointer flex items-center justify-between"
        >
          <p className="text-[12px] text-raspberry font-bold">{errorMsg}</p>
          <span className="text-[10px] text-raspberry font-bold uppercase tracking-wider underline opacity-80 group-hover:opacity-100">
            View alert →
          </span>
        </button>
      )}

      {easterEgg && (
        <p className="text-[11px] text-raspberry font-bold italic text-center animate-fade-up">
          {easterLine}
        </p>
      )}

      {/* Quick Switch Hint */}
      <div className="flex items-center justify-center gap-1.5 text-xs text-navy/70">
        <span>{authMode === "signin" ? "Need a new account?" : "Already registered?"}</span>
        <button
          type="button"
          onClick={() => onAuthModeChange(authMode === "signin" ? "register" : "signin")}
          className="font-bold text-raspberry underline hover:text-navy transition-colors"
        >
          {authMode === "signin" ? "Register here" : "Sign in here"}
        </button>
      </div>

      {/* Decorative badges */}
      <div
        className="grid grid-cols-3 gap-0 border-2 border-navy overflow-hidden mt-1"
        style={{ boxShadow: "3px 3px 0 #17232B" }}
      >
        {[
          { val: "ZERO", label: "Queues", bg: "#D92D57" },
          { val: "HOT", label: "On Demand", bg: "#4F8B68" },
          { val: "100%", label: "Vibes Only", bg: "#E8B84A" },
        ].map(({ val, label, bg }, i) => (
          <div
            key={label}
            className={`flex flex-col items-center py-3.5 ${i < 2 ? "border-r-2 border-navy" : ""}`}
            style={{ background: `${bg}22` }}
          >
            <span className="font-impact text-xl sm:text-2xl leading-none" style={{ color: bg }}>
              {val}
            </span>
            <span className="text-[10px] font-bold text-navy/50 uppercase tracking-widest mt-0.5">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
