import { NextResponse } from "next/server";
import { changePassword, extractError } from "@/lib/jobApi";

export interface ChangePasswordBody {
  old_pin: string;
  pin: string;
  confirm_pin: string;

}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization") ?? undefined;
    const token = authHeader?.replace(/^Bearer\s+/i, "");

    if (!token) {
      return NextResponse.json(
        { error: "You must be signed in to change your PIN." },
        { status: 401 }
      );
    }

    const body = (await request.json()) as ChangePasswordBody;

    const old_pin = body.old_pin?.trim();
    const pin = body.pin?.trim();
    const confirm_pin = body.confirm_pin?.trim();

    if (!old_pin || !pin) {
      return NextResponse.json(
        { error: "Missing required fields: old_pin or pin." },
        { status: 400 }
      );
    }

    // Match the exact 4-digit rule used everywhere else (login, signup)
    if (!/^\d{4}$/.test(old_pin)) {
      return NextResponse.json(
        { error: "Enter your current 4-digit PIN." },
        { status: 400 }
      );
    }
    if (!/^\d{4}$/.test(pin)) {
      return NextResponse.json(
        { error: "New PIN must be exactly 4 digits." },
        { status: 400 }
      );
    }
    if (pin === old_pin) {
      return NextResponse.json(
        { error: "New PIN must be different from your current PIN." },
        { status: 400 }
      );
    }

    const result = await changePassword({
      new_pin: pin, 
      old_pin,
    },
      token
    );

    if (!result.ok) {
      return NextResponse.json(
        { error: extractError(result.data) },
        { status: result.status || 400 }
      );
    }

    return NextResponse.json(
      { message: "PIN successfully updated." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Change Password Proxy Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while communicating with the server." },
      { status: 500 }
    );
  }
}