"use client";

import React, { useState } from "react";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";

const PIN_LENGTH = 4;

export function PinInput({
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
          onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, PIN_LENGTH))}
          placeholder={placeholder}
          maxLength={PIN_LENGTH}
          autoComplete="new-password"
          className="jj-login-field__input jj-login-field__input--pin"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
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
