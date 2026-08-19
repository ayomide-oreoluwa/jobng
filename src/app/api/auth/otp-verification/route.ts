import { NextResponse } from "next/server";
import { verifyOtp, extractError } from "@/lib/jobApi";
import { normalizeNigerianPhone } from "@/lib/phone";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      phone?: string;
      countryCode?: string;
      otp?: string;
    };

    const number = normalizeNigerianPhone(body.phone ?? "", body.countryCode ?? "+234");

    if (!/^234\d{10}$/.test(number)) {
      return NextResponse.json(
        { ok: false, error: "Enter a valid Nigerian phone number." },
        { status: 400 }
      );
    }

    const otp = (body.otp ?? "").trim();
    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { ok: false, error: "Enter the 6-digit code sent to your phone." },
        { status: 400 }
      );
    }

    // Call verifyOtp using normalized phone_number & otp expected by jobApi
    const result = await verifyOtp({
      phone_number: number,
      otp,
    });

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: extractError(result.data) },
        { status: result.status }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Code verified successfully.",
      data: result.data,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Network error. Please try again." },
      { status: 500 }
    );
  }
}