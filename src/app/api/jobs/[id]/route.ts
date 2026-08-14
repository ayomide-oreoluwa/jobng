import { NextResponse } from "next/server";
import { getSingleJob, extractError } from "@/lib/jobApi";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "Job ID is required." },
        { status: 400 }
      );
    }

    const authHeader = req.headers.get("authorization") ?? undefined;
    const token = authHeader?.replace(/^Bearer\s+/i, "");

    const result = await getSingleJob(id, token);

    if (result.status === 401) {
      return NextResponse.json(
        { ok: false, requiresAuth: true, error: "Sign in to view this job." },
        { status: 401 }
      );
    }

    if (!result.ok || !result.data) {
      const errorMsg = extractError(
        (result.data as unknown as Record<string, unknown>) || {},
        "Job not found."
      );
      return NextResponse.json(
        { ok: false, error: errorMsg },
        { status: result.status === 404 ? 404 : result.status || 400 }
      );
    }

    return NextResponse.json({ ok: true, job: result.data });
  } catch (error) {
    console.error("GET /api/jobs/[id] error:", error);
    return NextResponse.json(
      { ok: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}