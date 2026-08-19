"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  FiPhone,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiChevronDown,
  FiArrowRight,
  FiArrowLeft,
  FiLock,
  FiAlertCircle,
  FiRefreshCw,
  FiEdit3,
} from "react-icons/fi";

const PIN_LENGTH = 4;
const OTP_LENGTH = 6;

const countryCodes = [
  { code: "+234", flag: "🇳🇬", name: "Nigeria" },
  { code: "+1", flag: "🇺🇸", name: "United States" },
  { code: "+44", flag: "🇬🇧", name: "United Kingdom" },
  { code: "+27", flag: "🇿🇦", name: "South Africa" },
  { code: "+254", flag: "🇰🇪", name: "Kenya" },
];

function PhoneInput({
  value,
  onChange,
  countryCode,
  onCountryChange,
  disabled = false,
}: {
  value: string;
  onChange: (v: string) => void;
  countryCode: string;
  onCountryChange: (v: string) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selected = countryCodes.find((c) => c.code === countryCode) ?? countryCodes[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="jj-login-field relative" ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label="Select country code"
        className="jj-login-field__cc"
      >
        <span>{selected.flag}</span>
        <span>{selected.code}</span>
        <FiChevronDown
          size={12}
          className={`transition-transform duration-200 ${
            open ? "jj-login-field__chev--open" : ""
          }`}
        />
      </button>

      {open && (
        <div className="jj-login-field__dropdown animate-fade-in-up">
          {countryCodes.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => {
                onCountryChange(c.code);
                setOpen(false);
              }}
              className={`jj-login-field__option ${
                countryCode === c.code ? "jj-login-field__option--active" : ""
              }`}
            >
              <span>{c.flag}</span>
              <span className="font-semibold">{c.code}</span>
              <span className="jj-login-field__option-name">{c.name}</span>
            </button>
          ))}
        </div>
      )}

      <div className="jj-login-field__input-wrap">
        <FiPhone size={16} className="jj-login-field__icon" />
        <input
          type="tel"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
          placeholder="806 000 0000"
          maxLength={11}
          className="jj-login-field__input font-mono"
        />
      </div>
    </div>
  );
}

function PinInput({
  value,
  onChange,
  placeholder = "••••",
  disabled = false,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <div className="jj-login-field jj-login-field--pin">
        <FiLock size={16} className="jj-login-field__icon" />
        <input
          required
          disabled={disabled}
          type={show ? "text" : "password"}
          inputMode="numeric"
          pattern="[0-9]*"
          value={value}
          onChange={(e) =>
            onChange(e.target.value.replace(/\D/g, "").slice(0, PIN_LENGTH))
          }
          placeholder={placeholder}
          maxLength={PIN_LENGTH}
          autoComplete="new-password"
          className="jj-login-field__input jj-login-field__input--pin"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          aria-label={show ? "Hide PIN" : "Show PIN"}
          className="jj-login-field__toggle"
        >
          {show ? <FiEyeOff size={16} /> : <FiEye size={16} />}
        </button>
      </div>

      <div className="jj-login-pin-dots">
        {Array.from({ length: PIN_LENGTH }).map((_, idx) => (
          <div
            key={idx}
            className={`jj-login-pin-dot ${
              idx < value.length ? "jj-login-pin-dot--filled" : ""
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function OtpInputField({
  value,
  onChange,
  disabled = false,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="jj-login-field">
      <input
        required
        disabled={disabled}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={value}
        onChange={(e) =>
          onChange(e.target.value.replace(/\D/g, "").slice(0, OTP_LENGTH))
        }
        placeholder="Enter 6-digit code"
        maxLength={OTP_LENGTH}
        className="jj-login-field__input tracking-[0.3em] font-mono font-bold text-center text-lg py-3"
      />
    </div>
  );
}

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");

  // Step 1 state
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+234");

  // Step 2 state
  const [otp, setOtp] = useState("");

  // Step 3 state
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 7) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, countryCode }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.error || "Failed to request reset. Please check your phone number.");
        return;
      }

      setStep(2);
    } catch {
      setError("Network connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== OTP_LENGTH) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/otp-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, countryCode, otp }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.error || "Invalid or expired verification code.");
        return;
      }

      setStep(3);
    } catch {
      setError("Network connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResending(true);
    setError("");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, countryCode }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.error || "Failed to resend verification code.");
      }
    } catch {
      setError("Network connection error. Please try again.");
    } finally {
      setResending(false);
    }
  };

  const handleResetPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== PIN_LENGTH) {
      setError("Please enter a complete 4-digit PIN.");
      return;
    }
    if (pin !== confirmPin) {
      setError("PINs do not match. Please verify and try again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, countryCode, pin }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.error || "Failed to reset PIN. Please try again.");
        return;
      }

      setStep(4);
    } catch {
      setError("Network connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (step === 4) {
    return (
      <main className="jj-login-page flex items-center justify-center p-4">
        <div className="jj-login-card--success animate-fade-in-up">
          <div className="jj-login-success-icon">
            <FiCheckCircle size={32} />
          </div>

          <h2 className="jj-login-success-title">PIN Reset Successfully!</h2>
          <p className="jj-login-success-sub">
            Your 4-digit security PIN has been updated. You can now access your account
            using your new credentials.
          </p>

          <Link href="/login" className="jj-btn jj-btn--gold w-full py-3.5">
            <span>Return to Login</span>
            <FiArrowRight size={16} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="jj-login-page">
      <div className="jj-login-split">
        {/* Left Brand Panel */}
        <div className="jj-login-panel jj-login-panel--brand">
          <div className="jj-login-panel__grid" />

          <div className="jj-login-panel__content">
            <h1 className="jj-login-panel__title">
              Reset your PIN <br />
              <span>securely & quickly.</span>
            </h1>

            <p className="jj-login-panel__sub">
              Enter your registered phone number to verify your identity and restore access
              to your account instantly.
            </p>

            <div className="jj-login-panel__ussd">
              <span className="jj-login-panel__ussd-code">*7098#</span>
              <span className="jj-login-panel__ussd-label">
                Works on any phone line or network
              </span>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="jj-login-panel jj-login-panel--form">
          <div className="jj-login-form-wrap">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--ink)] uppercase tracking-wider mb-6 transition-colors"
            >
              <FiArrowLeft size={16} />
              <span>Back to Login</span>
            </Link>

            <div className="flex items-center gap-2 mb-6">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    s === step
                      ? "w-8 bg-[var(--gold)]"
                      : s < step
                      ? "w-4 bg-[var(--gold-hover)]"
                      : "w-4 bg-[var(--border-strong)]"
                  }`}
                />
              ))}
              <span className="ml-auto text-[11px] font-mono font-semibold text-[var(--text-faint)] uppercase tracking-wider">
                Step {step} of 3
              </span>
            </div>

            <div className="jj-login-form-head">
              <h2>
                {step === 1
                  ? "Forgot your PIN?"
                  : step === 2
                  ? "Verify your identity"
                  : "Set new 4-digit PIN"}
              </h2>
              <p>
                {step === 1
                  ? "Enter your registered phone number to receive an SMS verification code."
                  : step === 2
                  ? `We've sent a 6-digit verification code to ${countryCode} ${phone}.`
                  : "Choose a new 4-digit security PIN for your account."}
              </p>
            </div>

            {error && (
              <div className="jj-login-error flex items-start gap-2.5">
                <FiAlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* STEP 1: Request Verification */}
            {step === 1 && (
              <form onSubmit={handleResetRequest} className="jj-login-form">
                <div className="jj-login-form-group">
                  <label className="jj-login-label">Phone Number</label>
                  <PhoneInput
                    value={phone}
                    onChange={setPhone}
                    countryCode={countryCode}
                    onCountryChange={setCountryCode}
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={phone.length < 7 || loading}
                  className="jj-btn jj-btn--gold jj-login-submit"
                >
                  {loading ? (
                    <>
                      <span className="jj-login-spinner" />
                      <span>Sending Code…</span>
                    </>
                  ) : (
                    <>
                      <span>Send Verification Code</span>
                      <FiArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* STEP 2: Verify OTP */}
            {step === 2 && (
              <form onSubmit={handleVerifyOtp} className="jj-login-form">
                <div className="flex items-center justify-between p-3 bg-[var(--surface)] border border-[var(--border-strong)] rounded-[var(--radius-sm)] text-xs">
                  <span className="font-mono text-[var(--ink)] font-semibold">
                    {countryCode} {phone}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setOtp("");
                      setError("");
                    }}
                    className="text-[var(--gold-hover)] hover:underline flex items-center gap-1 font-bold"
                  >
                    <FiEdit3 size={12} /> Edit
                  </button>
                </div>

                <div className="jj-login-form-group">
                  <label className="jj-login-label">Verification Code</label>
                  <OtpInputField value={otp} onChange={setOtp} disabled={loading} />
                </div>

                <button
                  type="submit"
                  disabled={otp.length !== OTP_LENGTH || loading}
                  className="jj-btn jj-btn--gold jj-login-submit"
                >
                  {loading ? (
                    <>
                      <span className="jj-login-spinner" />
                      <span>Verifying Code…</span>
                    </>
                  ) : (
                    <>
                      <span>Verify Code</span>
                      <FiArrowRight size={16} />
                    </>
                  )}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resending}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--ink)] transition-colors disabled:opacity-50"
                  >
                    <FiRefreshCw
                      size={13}
                      className={resending ? "animate-spin" : ""}
                    />
                    <span>{resending ? "Resending code…" : "Didn't receive code? Resend"}</span>
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: Set New PIN */}
            {step === 3 && (
              <form onSubmit={handleResetPin} className="jj-login-form">
                <div className="jj-login-form-group">
                  <label className="jj-login-label">New 4-Digit PIN</label>
                  <PinInput
                    value={pin}
                    onChange={setPin}
                    placeholder="Enter new PIN"
                    disabled={loading}
                  />
                </div>

                <div className="jj-login-form-group">
                  <label className="jj-login-label">Confirm New PIN</label>
                  <PinInput
                    value={confirmPin}
                    onChange={setConfirmPin}
                    placeholder="Confirm new PIN"
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={
                    pin.length !== PIN_LENGTH ||
                    confirmPin.length !== PIN_LENGTH ||
                    loading
                  }
                  className="jj-btn jj-btn--gold jj-login-submit mt-2"
                >
                  {loading ? (
                    <>
                      <span className="jj-login-spinner" />
                      <span>Resetting PIN…</span>
                    </>
                  ) : (
                    <>
                      <span>Reset Security PIN</span>
                      <FiArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}