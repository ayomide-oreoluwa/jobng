/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_BASE_URL } from "./config";

export interface Apijustjob {
  job_id: string;
  job_title: string | null;
  job_url: string | null;
  created_at: string;
  company_name: string;
  company_website: string | null;
  category: string | null;
  description: string | null;
  is_active?: boolean;
  status?: string; 
}

export interface PagedJobsResponse {
  items: Apijustjob[];
  count: number;
}

export interface ApiResult<T = Record<string, unknown>> {
  ok: boolean;
  status: number;
  data: T;
  datalength?: number;
}

export interface UpdateApiResult {
  ok: boolean;
  status: number;
  message: string;
}

export function extractError(
  data: Record<string, unknown>,
  fallback = "Something went wrong. Please try again."
): string {
  if (!data) return fallback;
  if (typeof data.detail === "string") return data.detail;
  if (typeof data.error === "string") return data.error;
  if (typeof data.message === "string") return data.message;
  
  const first = Object.values(data)[0];
  if (Array.isArray(first) && typeof first[0] === "string") return first[0];
  if (typeof first === "string") return first;
  
  return fallback;
}

export function extractToken(data: Record<string, unknown>): string | null {
  const token =
    data.access ??
    data.token ??
    data.access_token ??
    (typeof data.data === "object" &&
      data.data &&
      ((data.data as Record<string, unknown>).access ??
        (data.data as Record<string, unknown>).token));
  return typeof token === "string" ? token : null;
}

async function parseJson(res: Response): Promise<Record<string, unknown>> {
  const text = await res.text();
  try {
    const data = JSON.parse(text);
    if (typeof data === "string") {
      return { message: data };
    }
    return data as Record<string, unknown>;
  } catch {
    return { message: text || res.statusText || "An unexpected error occurred" };
  }
}

export async function registerUser(body: {
  number: string;
  pin: string;
  confirm_pin: string;
}): Promise<ApiResult> {
  const res = await fetch(`${API_BASE_URL}/api/justjob/create/user/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return { ok: res.ok, status: res.status, data: await parseJson(res) };
}

export async function loginUser(body: {
  number: string;
  pin: string;
}): Promise<ApiResult> {
  const res = await fetch(`${API_BASE_URL}/api/justjob/login/user/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return { ok: res.ok, status: res.status, data: await parseJson(res) };
}

export async function forgotPassword(body: {
  phone_number: string;
}): Promise<ApiResult> {
  const res = await fetch(`${API_BASE_URL}/api/justjob/forgot/password/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return { ok: res.ok, status: res.status, data: await parseJson(res) };
}

export async function verifyOtp(body: {
  phone_number: string;
  otp: string;
}): Promise<ApiResult> {
  const res = await fetch(`${API_BASE_URL}/api/justjob/verify/password/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return { ok: res.ok, status: res.status, data: await parseJson(res) };
}

export async function changePassword(
  body: { new_pin: string; old_pin: string },
  token?: string
): Promise<ApiResult> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}/api/justjob/change/password/`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  return { ok: res.ok, status: res.status, data: await parseJson(res) };
}

export async function updatePassword({
  number,
  pin,
  confirm_pin,
}: {
  number: string;
  pin: string;
  confirm_pin: string;
}): Promise<UpdateApiResult> {
  const res = await fetch(`${API_BASE_URL}/api/justjob/update/password/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ number, pin, confirm_pin }),
  });

  const data = await parseJson(res);
  return {
    ok: res.ok,
    status: res.status,
    message: extractError(data),
  };
}

export async function resetPassword(body: {
  phone_number: string;
  pin: string;
}): Promise<ApiResult> {
  const res = await fetch(`${API_BASE_URL}/api/justjob/reset/password/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return { ok: res.ok, status: res.status, data: await parseJson(res) };
}

export async function getJobs(
  params: { search?: string; category?: string; page?: number; page_size?: number },
  token?: string
): Promise<ApiResult<PagedJobsResponse>> {
  const qs = new URLSearchParams();
  if (params.search) qs.set("search", params.search);
  if (params.category) qs.set("category", params.category.toLowerCase());
  if (params.page) qs.set("page", String(params.page));
  if (params.page_size) qs.set("page_size", String(params.page_size));

  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const res = await fetch(
      `${API_BASE_URL}/api/justjob/jobs/${qs.toString() ? `?${qs.toString()}` : ""}`,
      { headers, cache: "no-store" }
    );

    const data = (await parseJson(res)) as any;
    const datalength =
      data?.count ??
      data?.total ??
      (Array.isArray(data?.items) ? data.items.length : Array.isArray(data) ? data.length : 0);

    return { ok: res.ok, status: res.status, data, datalength };
  } catch (error) {
    console.error("getJobs error:", error);
    return {
      ok: false,
      status: 500,
      data: { message: "Failed to reach backend job API" } as any,
      datalength: 0,
    };
  }
}

export async function getSingleJob(
  justjobId: string,
  token?: string
): Promise<ApiResult<Apijustjob>> {
  if (!justjobId) {
    return { ok: false, status: 400, data: null as unknown as Apijustjob };
  }

  const qs = new URLSearchParams();
  qs.set("job_id", justjobId);

  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const res = await fetch(
      `${API_BASE_URL}/api/justjob/single/job/?${qs.toString()}`,
      { headers, cache: "no-store" }
    );

    const rawData = await parseJson(res);

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        data: rawData as unknown as Apijustjob,
      };
    }

    let unwrappedJob = rawData;
    if (rawData && typeof rawData === "object") {
      if ("data" in rawData && rawData.data && typeof rawData.data === "object") {
        unwrappedJob = rawData.data as Record<string, unknown>;
      } else if ("job" in rawData && rawData.job && typeof rawData.job === "object") {
        unwrappedJob = rawData.job as Record<string, unknown>;
      } else if ("items" in rawData && Array.isArray(rawData.items) && rawData.items.length > 0) {
        unwrappedJob = rawData.items[0];
      }
    }

    return {
      ok: true,
      status: res.status,
      data: unwrappedJob as unknown as Apijustjob,
    };
  } catch (error) {
    console.error("getSingleJob error:", error);
    return {
      ok: false,
      status: 500,
      data: null as unknown as Apijustjob,
    };
  }
}