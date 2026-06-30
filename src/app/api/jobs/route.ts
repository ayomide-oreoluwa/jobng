import { NextResponse } from "next/server";
import { getJobs } from "@/lib/justjobApi";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") ?? undefined;
    const category = searchParams.get("category") ?? undefined;
    
    const pageVal = Number(searchParams.get("page"));
    const page = !isNaN(pageVal) && pageVal > 0 ? pageVal : 1;
    
    const pageSizeVal = Number(searchParams.get("page_size"));
    const page_size = !isNaN(pageSizeVal) && pageSizeVal > 0 ? pageSizeVal : 20;

    const authHeader = req.headers.get("authorization") ?? undefined;
    const token = authHeader?.replace(/^Bearer\s+/i, "");

    const result = await getJobs({ search, category, page, page_size }, token);

    if (result.status === 401) {
      return NextResponse.json(
        { ok: false, requiresAuth: true, error: "Sign in to browse jobs." },
        { status: 401 }
      );
    }

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: "Could not load jobs." },
        { status: result.status || 500 }
      );
    }

    return NextResponse.json({ ok: true, ...result.data });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "An unexpected route error occurred." },
      { status: 500 }
    );
  }
}