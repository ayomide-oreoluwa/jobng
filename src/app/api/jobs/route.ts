import { NextResponse } from "next/server";
import { getJobs, extractError } from "@/lib/jobApi";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() || undefined;
    const category = searchParams.get("category")?.trim() || undefined;

    const pageVal = Number(searchParams.get("page"));
    const page = !isNaN(pageVal) && pageVal > 0 ? pageVal : 1;

    const pageSizeVal = Number(searchParams.get("page_size"));
    const page_size = !isNaN(pageSizeVal) && pageSizeVal > 0 ? pageSizeVal : 20;

    const authHeader = req.headers.get("authorization") ?? undefined;
    const token = authHeader?.replace(/^Bearer\s+/i, "");

    // When search or category is active, fetch a broader set to perform accurate multi-field client-side filtering
    const isFiltering = Boolean(search || category);
    const fetchPageSize = isFiltering ? 500 : page_size;
    const fetchPage = isFiltering ? 1 : page;

    const result = await getJobs(
      {
        category: isFiltering ? undefined : category,
        search: isFiltering ? undefined : search,
        page: fetchPage,
        page_size: fetchPageSize,
      },
      token
    );

    if (result.status === 401) {
      return NextResponse.json(
        { ok: false, requiresAuth: true, error: "Sign in to browse jobs." },
        { status: 401 }
      );
    }

    if (!result.ok) {
      const rawErrorData = ((result.data ?? {}) as unknown) as Record<string, unknown>;
      const errorMessage = extractError(rawErrorData, "Could not load jobs from server.");
      return NextResponse.json(
        { ok: false, error: errorMessage },
        { status: result.status || 500 }
      );
    }

    // Safely extract all items into a uniform array
    const rawData = result.data as any;
    let allItems: any[] = [];

    if (Array.isArray(rawData)) {
      allItems = rawData;
    } else if (rawData && Array.isArray(rawData.items)) {
      allItems = rawData.items;
    } else if (rawData && Array.isArray(rawData.data)) {
      allItems = rawData.data;
    } else if (rawData && Array.isArray(rawData.results)) {
      allItems = rawData.results;
    }

    let filtered = allItems;

    // Filter by Category
    if (category) {
      const catTerm = category.toLowerCase();
      filtered = filtered.filter((j) => {
        const jCat = j.category?.toLowerCase() || "";
        const jTitle = j.job_title?.toLowerCase() || "";
        const jDesc = j.description?.toLowerCase() || "";
        return jCat.includes(catTerm) || jTitle.includes(catTerm) || jDesc.includes(catTerm);
      });
    }

    // Filter by Search Query across multiple fields
    if (search) {
      const searchTerm = search.toLowerCase();
      filtered = filtered.filter((j) => {
        const titleMatch = j.job_title?.toLowerCase().includes(searchTerm);
        const companyMatch = j.company_name?.toLowerCase().includes(searchTerm);
        const categoryMatch = j.category?.toLowerCase().includes(searchTerm);
        const descMatch = j.description?.toLowerCase().includes(searchTerm);
        return titleMatch || companyMatch || categoryMatch || descMatch;
      });
    }

    if (isFiltering) {
      const start = (page - 1) * page_size;
      const paged = filtered.slice(start, start + page_size);
      return NextResponse.json({
        ok: true,
        items: paged,
        count: filtered.length,
      });
    }

    const totalCount =
      result.datalength ??
      rawData?.count ??
      rawData?.total ??
      allItems.length;

    return NextResponse.json({
      ok: true,
      items: allItems,
      count: totalCount,
    });
  } catch (error) {
    console.error("GET /api/jobs error:", error);
    return NextResponse.json(
      { ok: false, error: "An unexpected route error occurred." },
      { status: 500 }
    );
  }
}