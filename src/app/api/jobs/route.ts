import { NextResponse } from "next/server";
import { getJobs } from "@/lib/jobApi";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() || undefined;
    const category = searchParams.get("category") ?? undefined;

    const pageVal = Number(searchParams.get("page"));
    const page = !isNaN(pageVal) && pageVal > 0 ? pageVal : 1;

    const pageSizeVal = Number(searchParams.get("page_size"));
    const page_size = !isNaN(pageSizeVal) && pageSizeVal > 0 ? pageSizeVal : 20;

    const authHeader = req.headers.get("authorization") ?? undefined;
    const token = authHeader?.replace(/^Bearer\s+/i, "");

    if (search) {
      const broad = await getJobs(
        { category, page: 1, page_size: 500 }, 
        token
      );

      if (broad.status === 401) {
        return NextResponse.json(
          { ok: false, requiresAuth: true, error: "Sign in to browse jobs." },
          { status: 401 }
        );
      }
      if (!broad.ok) {
        return NextResponse.json(
          { ok: false, error: "Could not load jobs." },
          { status: broad.status || 500 }
        );
      }

      const term = search.toLowerCase();
      
      // SAFELY access items. If the backend returned an array directly, handle that too.
      const allItems = broad.data?.items ?? (Array.isArray(broad.data) ? broad.data : []); 
      
      const filtered = allItems.filter((j: any) => {
        const titleMatch = j.job_title?.toLowerCase().includes(term);
        const companyMatch = j.company_name?.toLowerCase().includes(term);
        return titleMatch || companyMatch;
      });

      const start = (page - 1) * page_size;
      const paged = filtered.slice(start, start + page_size);

      return NextResponse.json({ ok: true, items: paged, count: filtered.length });
    }

    // No search term: normal backend-paginated path
    const result = await getJobs({ category, page, page_size }, token);

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
    
    // SAFELY spread data and calculate count
    return NextResponse.json({ 
      ok: true, 
      ...(result.data || {}), 
      count: result.datalength ?? result.data?.items?.length ?? 0 
    });
  } catch (error) {
    console.error("GET /jobs error:", error);
    return NextResponse.json(
      { ok: false, error: "An unexpected route error occurred." },
      { status: 500 }
    );
  }
}