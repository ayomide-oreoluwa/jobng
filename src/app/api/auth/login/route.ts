import { NextResponse } from "next/server";
import { loginUser, extractError, extractToken } from "@/lib/jobApi";
import { normalizeNigerianPhone } from "@/lib/phone";

export async function POST(req: Request) {
  let body: { phone?: string; pin?: string; countryCode?: string };

  // Handle malformed/empty JSON payloads gracefully
  try {
    body = (await req.json()) ?? {};
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON request payload." },
      { status: 400 }
    );
  }

  try {
    const number = normalizeNigerianPhone(body.phone ?? "", body.countryCode ?? "+234");
    const pin = (body.pin ?? "").trim();

    if (!/^234\d{10}$/.test(number)) {
      return NextResponse.json(
        { ok: false, error: "Enter a valid Nigerian phone number." },
        { status: 400 }
      );
    }
    if (!/^\d{4}$/.test(pin)) {
      return NextResponse.json(
        { ok: false, error: "PIN must be exactly 4 digits." },
        { status: 400 }
      );
    }

    const result = await loginUser({ number, pin });
    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: extractError(result.data) },
        { status: result.status }
      );
    }

    const token = extractToken(result?.data);
    if (!token) {
      return NextResponse.json(
        { ok: false, error: "Login succeeded but no token was returned." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true, token, phone: number });
  } catch (err) {
    console.error("[LOGIN_ROUTE_ERROR]:", err);
    return NextResponse.json(
      { ok: false, error: "Network error. Please try again." },
      { status: 500 }
    );
  }
}