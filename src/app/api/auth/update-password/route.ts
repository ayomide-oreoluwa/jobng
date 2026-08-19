import { NextResponse } from "next/server";
import { updatePassword } from "@/lib/jobApi";
import { normalizeNigerianPhone } from "@/lib/phone";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      phone?: string;
      countryCode?: string;
      pin?: string;
      confirm_pin?: string;
    };

    const number = normalizeNigerianPhone(body.phone ?? "", body.countryCode ?? "+234");
    const pin = (body.pin ?? "").trim();
    const confirm_pin = (body.confirm_pin ?? "").trim();

    if (!/^234\d{10}$/.test(number)) {
      return NextResponse.json(
        { ok: false, error: "Invalid phone number." },
        { status: 400 }
      );
    }

    if (!/^\d{4}$/.test(pin)) {
      return NextResponse.json(
        { ok: false, error: "PIN must be exactly 4 digits." },
        { status: 400 }
      );
    }

    if (pin !== confirm_pin) {
      return NextResponse.json(
        { ok: false, error: "PINs do not match." },
        { status: 400 }
      );
    }

    const result = await updatePassword({
      number,
      pin,
      confirm_pin,
    });

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.message },
        { status: result.status }
      );
    }

    return NextResponse.json({ ok: true, message: "Password updated successfully." });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Network error. Please try again." },
      { status: 500 }
    );
  }
}