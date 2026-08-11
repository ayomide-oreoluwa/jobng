import { NextResponse } from "next/server";
import { registerUser, extractError, extractToken } from "@/lib/jobApi";
import { normalizeNigerianPhone } from "@/lib/phone";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
    //   name?: string;
      phone?: string;
      countryCode?: string;
      pin?: string;
      confirmPin?: string;
    };

    // const name = (body.name ?? "").trim();
    const number = normalizeNigerianPhone(body.phone ?? "", body.countryCode ?? "+234");
    const pin = (body.pin ?? "").trim();
    const confirmPin = (body.confirmPin ?? "").trim();

    // if (!name) {
    //   return NextResponse.json({ ok: false, error: "Enter your full name." }, { status: 400 });
    // }
    if (!/^234\d{10}$/.test(number)) {
      return NextResponse.json({ ok: false, error: "Enter a valid Nigerian phone number." }, { status: 400 });
    }
    if (!/^\d{4}$/.test(pin)) {
      return NextResponse.json({ ok: false, error: "PIN must be exactly 4 digits." }, { status: 400 });
    }
    if (pin !== confirmPin) {
      return NextResponse.json({ ok: false, error: "PINs do not match." }, { status: 400 });
    }

    const result = await registerUser({ number, pin, confirm_pin: confirmPin });

    if (!result.ok) {
      return NextResponse.json({ ok: false, error: extractError(result.data) }, { status: result.status });
    }

    const token = extractToken(result.data);
    if (!token) {
      // Some signup flows don't auto-login (no token) — that's not necessarily an error.
      // Treat it as success but let the client redirect to login instead of dashboard.
      return NextResponse.json({ ok: true, token: null, phone: number });
    }

    return NextResponse.json({ ok: true, token, phone: number });
  } catch {
    return NextResponse.json({ ok: false, error: "Network error. Please try again." }, { status: 500 });
  }
}
