"use client";

import React from "react";
import Link from "next/link";
import { FiCheckCircle, FiArrowRight } from "react-icons/fi";

export function ResetSuccess() {
  return (
    <main className="jj-login-page flex items-center justify-center p-4">
      <div className="jj-login-card--success animate-fade-in-up">
        <div className="jj-login-success-icon">
          <FiCheckCircle size={32} />
        </div>
        <h2 className="jj-login-success-title">PIN Reset Successfully!</h2>
        <p className="jj-login-success-sub">
          Your 4-digit security PIN has been updated. You can now access your account using your
          new credentials.
        </p>
        <Link href="/login" className="jj-btn jj-btn--gold w-full py-3.5">
          <span>Return to Login</span>
          <FiArrowRight size={16} />
        </Link>
      </div>
    </main>
  );
}