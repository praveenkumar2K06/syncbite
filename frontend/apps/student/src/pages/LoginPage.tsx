import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext, type AuthUser } from "@/context/AppContext";
import {
  loginApi,
  registerApi,
  updateCustomerProfileApi,
  getCustomerProfileApi,
  setTokens,
} from "@/api";
import {
  LOADING_QUIPS,
  EASTER_LINES,
  TAGLINES,
  randomFrom,
  ScatterBlocks,
  LoginHeader,
  LoginHero,
  LoginForm,
  type AuthMode,
  LoginFooterTicker,
  LoginLoadingScreen,
  LoginErrorModal,
} from "@/components/login";

export default function LoginPage() {
  const navigate = useNavigate();
  const ctx = useAppContext();

  const [authMode, setAuthMode] = useState<AuthMode>("signin");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [attemptedEmail, setAttemptedEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [barWidth, setBarWidth] = useState(0);
  const [quip] = useState(() => randomFrom(LOADING_QUIPS));
  const easterEgg = false;
  const [tagline] = useState(() => randomFrom(TAGLINES));
  const [easterLine] = useState(() => randomFrom(EASTER_LINES));

  function triggerLoginError(message: string, email = "") {
    setErrorMsg(message);
    setAttemptedEmail(email);
    setErrorModalOpen(true);
  }

  // Close error modal on Escape key press
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setErrorModalOpen(false);
      }
    }
    if (errorModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [errorModalOpen]);

  useEffect(() => {
    if (!loading) return;
    const targets = [25, 55, 80, 100];
    const timers: ReturnType<typeof setTimeout>[] = [];
    targets.forEach((w, i) => {
      timers.push(
        setTimeout(
          () => {
            setBarWidth(w);
            setLoadingStep(i);
          },
          120 + i * 400,
        ),
      );
    });
    return () => timers.forEach(clearTimeout);
  }, [loading]);

  function completeSignIn(email: string, name: string) {
    setLoading(true);
    setTimeout(() => {
      const userPayload: AuthUser = {
        name: name || email.split("@")[0],
        email,
      };
      ctx.handleLogin(userPayload);
      navigate("/home", { replace: true });
    }, 1800);
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cleanEmail = emailInput.trim().toLowerCase();
    const cleanPassword = passwordInput.trim();

    if (!cleanEmail || !cleanPassword) {
      triggerLoginError("Please enter both email and password.", cleanEmail);
      return;
    }

    if (cleanPassword.length < 8) {
      triggerLoginError("Password must be at least 8 characters long.", cleanEmail);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      if (authMode === "signin") {
        // Sign in with email and password
        const res = await loginApi(cleanEmail, cleanPassword);
        setTokens(res.access_token, res.refresh_token);

        let displayName = cleanEmail.split("@")[0];
        try {
          const profile = await getCustomerProfileApi();
          if (profile?.full_name) {
            displayName = profile.full_name;
          }
        } catch {
          // Fall back to email prefix
        }

        setIsSubmitting(false);
        completeSignIn(cleanEmail, displayName);
      } else {
        // Register new account
        const cleanName = nameInput.trim() || cleanEmail.split("@")[0];
        const res = await registerApi(cleanEmail, cleanPassword, "Customer");
        setTokens(res.access_token, res.refresh_token);

        if (cleanName || phoneInput.trim()) {
          try {
            await updateCustomerProfileApi({
              full_name: cleanName,
              phone_number: phoneInput.trim() || undefined,
            });
          } catch (profileErr) {
            console.warn("[Register] Profile update warning:", profileErr);
          }
        }

        setIsSubmitting(false);
        completeSignIn(cleanEmail, cleanName);
      }
    } catch (err: any) {
      setIsSubmitting(false);
      const detail =
        err?.message ||
        (authMode === "signin"
          ? "Invalid email or password. Please try again."
          : "Registration failed. An account with this email may already exist.");
      triggerLoginError(detail, cleanEmail);
    }
  }

  // ── LOADING SCREEN ────────────────────────────────────────
  if (loading) {
    return (
      <LoginLoadingScreen
        barWidth={barWidth}
        loadingStep={loadingStep}
        email={emailInput}
        quip={quip}
      />
    );
  }

  // ── MAIN LOGIN PAGE ───────────────────────────────────────
  return (
    <div className="min-h-screen bg-cream relative flex flex-col overflow-hidden pb-12">
      <ScatterBlocks />
      <LoginHeader />
      <LoginHero tagline={tagline} />

      {/* ── DIVIDER ── */}
      <div className="relative z-10 mx-5 border-t-2 border-navy/15 mb-5" />

      {/* ── CTA / FORM AREA ── */}
      <LoginForm
        authMode={authMode}
        onAuthModeChange={(mode) => {
          setAuthMode(mode);
          setErrorMsg("");
        }}
        email={emailInput}
        onEmailChange={setEmailInput}
        password={passwordInput}
        onPasswordChange={setPasswordInput}
        fullName={nameInput}
        onFullNameChange={setNameInput}
        phone={phoneInput}
        onPhoneChange={setPhoneInput}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        errorMsg={errorMsg}
        onOpenErrorModal={() => setErrorModalOpen(true)}
        easterEgg={easterEgg}
        easterLine={easterLine}
      />

      {/* ── FOOTER TICKER ── */}
      <LoginFooterTicker />

      {/* ── ERROR POPUP MODAL ── */}
      <LoginErrorModal
        isOpen={errorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        errorMsg={errorMsg}
        attemptedEmail={attemptedEmail}
        onRetry={() => {
          setErrorModalOpen(false);
        }}
      />
    </div>
  );
}
