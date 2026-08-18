/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getJobs, extractError, Apijustjob } from "@/lib/jobApi";

interface CacheEntry {
  items: Apijustjob[];
  totalCount: number;
  isFullyBuffered: boolean;
  timestamp: number;
}

const BUFFER_SIZE = 50;
const DEFAULT_PAGE_SIZE = 10;
const CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutes cache expiration
const jobBufferCache = new Map<string, CacheEntry>();

function cleanStaleCache() {
  const now = Date.now();
  for (const [key, entry] of jobBufferCache.entries()) {
    if (now - entry.timestamp > CACHE_TTL_MS) {
      jobBufferCache.delete(key);
    }
  }
}

function filterJobs(
  items: Apijustjob[],
  search?: string,
  category?: string
): Apijustjob[] {
  let filtered = items;

  if (category) {
    const catTerm = category.toLowerCase();
    filtered = filtered.filter((j) => {
      const jCat = j.category?.toLowerCase() || "";
      const jTitle = j.job_title?.toLowerCase() || "";
      const jDesc = j.description?.toLowerCase() || "";
      return jCat.includes(catTerm) || jTitle.includes(catTerm) || jDesc.includes(catTerm);
    });
  }

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

  return filtered;
}

function extractItems(data: any): Apijustjob[] {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.items)) return data.items;
  if (data && Array.isArray(data.data)) return data.data;
  if (data && Array.isArray(data.results)) return data.results;
  return [];
}

async function bufferRemainingJobsInBackground(
  cacheKey: string,
  search?: string,
  category?: string,
  token?: string
) {
  try {
    let currentPage = 2;
    let hasMore = true;

    while (hasMore) {
      const cacheEntry = jobBufferCache.get(cacheKey);
      if (!cacheEntry) break;

      const result = await getJobs(
        {
          category,
          search,
          page: currentPage,
          page_size: BUFFER_SIZE,
        },
        token
      );

      if (!result.ok) break;

      const rawData = result.data as any;
      const fetchedItems = extractItems(rawData);

      if (fetchedItems.length === 0) {
        hasMore = false;
        break;
      }

      const filteredChunk = filterJobs(fetchedItems, search, category);

      // Append new unique jobs by job_id
      const existingIds = new Set(cacheEntry.items.map((j) => j.job_id));
      const newUniqueItems = filteredChunk.filter((j) => !existingIds.has(j.job_id));

      cacheEntry.items.push(...newUniqueItems);
      cacheEntry.timestamp = Date.now();

      if (fetchedItems.length < BUFFER_SIZE) {
        hasMore = false;
      } else {
        currentPage++;
      }
    }

    const finalEntry = jobBufferCache.get(cacheKey);
    if (finalEntry) {
      finalEntry.isFullyBuffered = true;
      finalEntry.totalCount = finalEntry.items.length;
    }
  } catch (err) {
    console.error("Background buffering error:", err);
  }
}

export async function GET(req: Request) {
  try {
    cleanStaleCache();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() || undefined;
    const category = searchParams.get("category")?.trim() || undefined;

    const pageVal = Number(searchParams.get("page"));
    const page = !isNaN(pageVal) && pageVal > 0 ? pageVal : 1;

    const pageSizeVal = Number(searchParams.get("page_size"));
    const page_size = !isNaN(pageSizeVal) && pageSizeVal > 0 ? pageSizeVal : DEFAULT_PAGE_SIZE;

    const authHeader = req.headers.get("authorization") ?? undefined;
    const token = authHeader?.replace(/^Bearer\s+/i, "");

    const isFiltering = Boolean(search || category);

    // When NOT filtering, fetch directly from backend API 10 at a time
    if (!isFiltering) {
      const result = await getJobs(
        {
          page,
          page_size,
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

      const rawData = result.data as any;
      const allItems = extractItems(rawData);
      const totalCount =
        result.datalength ?? rawData?.count ?? rawData?.total ?? allItems.length;

      return NextResponse.json({
        ok: true,
        items: allItems,
        count: totalCount,
      });
    }

    // --- FILTERING ACTIVE: Buffered 50-chunk fetch strategy ---
    const cacheKey = `${token ?? "anon"}:${search ?? ""}:${category ?? ""}`;
    let cacheEntry = jobBufferCache.get(cacheKey);

    const startIdx = (page - 1) * page_size;
    const endIdx = startIdx + page_size;

    if (!cacheEntry) {
      // Fetch initial chunk of 50 items
      const result = await getJobs(
        {
          category,
          search,
          page: 1,
          page_size: BUFFER_SIZE,
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

      const rawData = result.data as any;
      const initialItems = extractItems(rawData);
      const filteredChunk = filterJobs(initialItems, search, category);
      const upstreamTotal = result.datalength ?? rawData?.count ?? rawData?.total ?? initialItems.length;

      cacheEntry = {
        items: filteredChunk,
        totalCount: upstreamTotal,
        isFullyBuffered: initialItems.length < BUFFER_SIZE,
        timestamp: Date.now(),
      };

      jobBufferCache.set(cacheKey, cacheEntry);

      // Trigger background buffering asynchronously for remaining pages if available
      if (!cacheEntry.isFullyBuffered) {
        bufferRemainingJobsInBackground(cacheKey, search, category, token);
      }
    }

    // Slice 10 items for current page request
    const pagedItems = cacheEntry.items.slice(startIdx, endIdx);
    const totalCount = cacheEntry.isFullyBuffered
      ? cacheEntry.items.length
      : Math.max(cacheEntry.items.length, cacheEntry.totalCount);

    return NextResponse.json({
      ok: true,
      items: pagedItems,
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
