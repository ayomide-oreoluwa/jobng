"use client";
import React, { useState } from "react";
import { authHeaders } from "@/lib/auth-client";

export default function ChangePassword() {
  const [formData, setFormData] = useState({
    old_pin: "",
    pin: "",
    confirm_pin: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.old_pin || !formData.pin || !formData.confirm_pin) {
      setError("Please fill out all fields.");
      return;
    }
    if (!/^\d{4}$/.test(formData.old_pin)) {
      setError("Enter your current 4-digit PIN.");
      return;
    }
    if (!/^\d{4}$/.test(formData.pin)) {
      setError("New PIN must be exactly 4 digits.");
      return;
    }
    if (formData.pin !== formData.confirm_pin) {
      setError("PINs do not match. Please try again.");
      return;
    }
    if (formData.pin === formData.old_pin) {
      setError("New PIN must be different from your current PIN.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(), // attaches the Bearer token so the backend knows which user this is
        },
        body: JSON.stringify({
          old_pin: formData.old_pin,
          pin: formData.pin,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        setSuccess(true);
        setFormData({ old_pin: "", pin: "", confirm_pin: "" });
      } else {
        setError(data.error || data.message || "Failed to change password. Please check your details.");
      }
    } catch (err) {
      console.log(err);
      setError("A network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="jj-login-card--success animate-fade-in-up">
        <div className="jj-login-success-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="jj-login-success-title">PIN Changed!</h2>
        <p className="jj-login-success-sub">
          Your PIN has been successfully updated. You can now use it to log in.
        </p>
        <button
          type="button"
          onClick={() => (window.location.href = "/login")}
          className="jj-btn jj-btn--gold jj-login-submit"
        >
          Return to Login
        </button>
      </div>
    );
  }

  return (
    <div className="jj-login-form-wrap mx-auto animate-fade-in-up">
      <div className="jj-login-form-head">
        <h2>Change PIN</h2>
        <p>Update the access PIN for your jobNG account.</p>
      </div>
      {error && <div className="jj-login-error animate-fade-in-up">{error}</div>}
      <form onSubmit={handleSubmit} className="jj-login-form">
        <div className="jj-login-form-group">
          <label htmlFor="old_pin" className="jj-login-label">Current PIN</label>
          <div className="jj-login-field jj-login-field--pin">
            <div className="jj-login-field__input-wrap">
              <input
                id="old_pin"
                name="old_pin"
                type="password"
                placeholder="••••"
                maxLength={4}
                value={formData.old_pin}
                onChange={handleChange}
                className="jj-login-field__input jj-login-field__input--pin tracking-widest"
                disabled={loading}
                autoComplete="current-password"
              />
            </div>
          </div>
        </div>

        <div className="jj-login-form-group">
          <label htmlFor="pin" className="jj-login-label">New PIN</label>
          <div className="jj-login-field jj-login-field--pin">
            <div className="jj-login-field__input-wrap">
              <input
                id="pin"
                name="pin"
                type="password"
                placeholder="••••"
                maxLength={4}
                value={formData.pin}
                onChange={handleChange}
                className="jj-login-field__input jj-login-field__input--pin tracking-widest"
                disabled={loading}
                autoComplete="new-password"
              />
            </div>
          </div>
        </div>

        <div className="jj-login-form-group">
          <label htmlFor="confirm_pin" className="jj-login-label">Confirm New PIN</label>
          <div className="jj-login-field jj-login-field--pin">
            <div className="jj-login-field__input-wrap">
              <input
                id="confirm_pin"
                name="confirm_pin"
                type="password"
                placeholder="••••"
                maxLength={4}
                value={formData.confirm_pin}
                onChange={handleChange}
                className="jj-login-field__input jj-login-field__input--pin tracking-widest"
                disabled={loading}
                autoComplete="new-password"
              />
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading} className="jj-btn jj-btn--gold jj-login-submit mt-4">
          {loading ? <span className="jj-login-spinner"></span> : "Update PIN"}
        </button>
      </form>
    </div>
  );
}