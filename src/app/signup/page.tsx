"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiPhone, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

export default function SignUpPage() {
  const router = useRouter();
//   const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // if (!name.trim()) {
    //   setError("Enter your full name.");
    //   return;
    // }

    if (!/^\d{4}$/.test(pin)) {
      setError("PIN must be exactly 4 digits.");
      return;
    }
    if (pin !== confirmPin) {
      setError("PINs do not match.");
      return;
    }


    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, countryCode: "+234", pin, confirmPin }),
      });
      const data = await res.json();
      setLoading(false);

      if (!data.ok) {
        setError(data.error ?? "Could not create account.");
        return;
      }
      router.push("/login");
    } catch {
      setLoading(false);
      setError("Network error. Please try again.");
    }
  }

  return (
    <div className="jj-jobs-page">
      {/* Hero */}
      <div className="jj-jobs-hero">
        <div className="container-xl">
          <h1 className="jj-jobs-hero__title">Create your account</h1>
          <p className="jj-jobs-hero__sub">
            Already subscribed via *7098#? Sign up here to manage your profile on the web.
          </p>
        </div>
      </div>

      <div className="container-xl" style={{ padding: "3rem 0 5rem", display: "flex", justifyContent: "center" }}>
        <div className="jj-card" style={{ maxWidth: 440, width: "100%", padding: "2.5rem" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* <div className="jj-jobs-search">
              <FiUser size={16} style={{ color: "var(--gold-hover)", flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: "0.9375rem",
                  color: "var(--text)",
                  padding: "12px 0",
                }}
              />
            </div> */}

            <div className="jj-jobs-search">
              <FiPhone size={16} style={{ color: "var(--gold-hover)", flexShrink: 0 }} />
              <input
                type="tel"
                placeholder="Phone number (e.g. 0803...)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                autoComplete="tel"
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: "0.9375rem",
                  color: "var(--text)",
                  padding: "12px 0",
                }}
              />
            </div>

            <div className="jj-jobs-search">
              <FiLock size={16} style={{ color: "var(--gold-hover)", flexShrink: 0 }} />
              <input
                type={showPin ? "text" : "password"}
                inputMode="numeric"
                maxLength={4}
                placeholder="4-digit PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                required
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: "0.9375rem",
                  color: "var(--text)",
                  padding: "12px 0",
                  letterSpacing: "0.2em",
                }}
              />
              <button
                type="button"
                title={showPin ? "Hide PIN" : "Show PIN"}
                onClick={() => setShowPin((s) => !s)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-faint)" }}
              >
                {showPin ? <FiEyeOff size={15} /> : <FiEye size={15} />}
              </button>
            </div>

            <div className="jj-jobs-search">
              <FiLock size={16} style={{ color: "var(--gold-hover)", flexShrink: 0 }} />
              <input
                type={showPin ? "text" : "password"}
                inputMode="numeric"
                maxLength={4}
                placeholder="Confirm PIN"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ""))}
                required
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: "0.9375rem",
                  color: "var(--text)",
                  padding: "12px 0",
                  letterSpacing: "0.2em",
                }}
              />
            </div>

            {error && (
              <p style={{ color: "#ef4444", fontSize: "0.875rem", margin: 0 }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="jj-btn jj-btn--gold"
              style={{ padding: "13px", marginTop: 8, opacity: loading ? 0.7 : 1, fontWeight: 700 }}
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p style={{ marginTop: 20, fontSize: "0.875rem", textAlign: "center", color: "var(--text-muted)" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "var(--gold-hover)", fontWeight: 700 }}>
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}