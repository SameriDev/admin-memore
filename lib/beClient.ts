import "server-only";

import { cookies } from "next/headers";

const BE_BASE_URL = "https://api.memore.vn";

type BeFetchInit = RequestInit & {
  skipAuth?: boolean;
};

async function getToken(): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get("memore_admin_token")?.value;
  if (token) {
    return token;
  }
  throw new Error("Missing admin session token");
}

export async function beFetch(path: string, init: BeFetchInit = {}) {
  const url = `${BE_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const headers = new Headers(init.headers);

  if (!init.skipAuth) {
    const token = await getToken();
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...init,
    headers,
    cache: "no-store",
  });

  return response;
}
