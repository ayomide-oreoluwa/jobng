import { getTotalJobs } from "@/lib/jobApi";
import { NextResponse } from "next/server";

export async function GET() {
  const result = await getTotalJobs();

  return NextResponse.json(result, { status: result.status });
}