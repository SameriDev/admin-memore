import "server-only";

import { cookies } from "next/headers";

const BE_BASE_URL = process.env.MEMORE_BE_BASE_URL ?? "http://localhost:8080";

type BeFetchInit = RequestInit & {
  skipAuth?: boolean;
};

async function loginWithAdminCredentials(): Promise<string> {
  const email = process.env.MEMORE_ADMIN_EMAIL;
  const password = process.env.MEMORE_ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("Missing MEMORE_ADMIN_EMAIL or MEMORE_ADMIN_PASSWORD");
  }

  const response = await fetch(`${BE_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok || !data?.accessToken) {
    throw new Error(data?.message ?? "Admin login failed");
  }

  return data.accessToken as string;
}

async function getToken(): Promise<string> {
  const token = cookies().get("memore_admin_token")?.value;
  if (token) {
    return token;
  }
  return loginWithAdminCredentials();
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

  if (response.status === 401 && !init.skipAuth) {
    const token = await loginWithAdminCredentials();
    headers.set("Authorization", `Bearer ${token}`);
    return fetch(url, { ...init, headers, cache: "no-store" });
  }

  return response;
}
