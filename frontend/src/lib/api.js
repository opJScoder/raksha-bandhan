import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api"; 

async function handle(res) {
  if (!res.ok) {
    let message = "Something went wrong. Please try again.";
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      /* non-JSON error body, keep default message */
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
  // Resolves to: http://localhost:8787/api/upload
  const res = await fetch(`${API_BASE}/upload`, { method: "POST", body: form });
  return handle(res);
}

export async function createGift(payload) {
  // Resolves to: http://localhost:8787/api/gifts
  const res = await fetch(`${API_BASE}/gifts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handle(res);
}

export async function fetchGift(slug) {
  // Resolves to: http://localhost:8787/api/gifts/...
  const res = await fetch(`${API_BASE}/gifts/${encodeURIComponent(slug)}`);
  return handle(res);
}
