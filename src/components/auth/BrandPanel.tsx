"use client";

import React from "react";

export function BrandPanel() {
  return (
    <div className="jj-login-panel jj-login-panel--brand">
      <div className="jj-login-panel__grid" />
      <div className="jj-login-panel__content">
        <h1 className="jj-login-panel__title">
          Reset your PIN <br />
          <span>securely & quickly.</span>
        </h1>
        <p className="jj-login-panel__sub">
          Enter your registered phone number to verify your identity and restore access to your
          account instantly.
        </p>
        <div className="jj-login-panel__ussd">
          <span className="jj-login-panel__ussd-code">*7098#</span>
          <span className="jj-login-panel__ussd-label">
            Works on any phone line or network
          </span>
        </div>
      </div>
    </div>
  );
}