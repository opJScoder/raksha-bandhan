import { useState } from "react";

const ENV_URL = import.meta.env.VITE_API_BASE_URL;

// CLEAN BASE PATH: If an environment URL exists, make sure it ends with /api
// If it does not exist, use your standard local development route.
const API_BASE = ENV_URL
  ? ENV_URL.replace(/\/$/, "").endsWith("/api")
    ? ENV_URL.replace(/\/$/, "")
    : `${ENV_URL.replace(/\/$/, "")}/api`
  : "http://localhost:8787/api";

async function handle(res) {
  if (!res.ok) {
    let message = "Something went wrong. Please try again.";
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      /* non-JSON error body */
    }
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

export async function uploadImage(file) {
  const form = new FormData();
  form.append("image", file);
  const res = await fetch(`${API_BASE}/upload`, { method: "POST", body: form });
  return handle(res);
}

export async function createGift(payload) {
  const res = await fetch(`${API_BASE}/gifts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handle(res);
}

export async function fetchGift(slug) {
  const res = await fetch(`${API_BASE}/gifts/${encodeURIComponent(slug)}`);
  return handle(res);
}
