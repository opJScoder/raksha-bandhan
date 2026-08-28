const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

async function handle(res) {
  if (!res.ok) {
    let message = 'Something went wrong. Please try again.';
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
  form.append('image', file);
  const res = await fetch(`${API_BASE}/upload`, { method: 'POST', body: form });
  return handle(res); // { url }
}

export async function createGift(payload) {
  const res = await fetch(`${API_BASE}/gifts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handle(res); // { slug, token, url }
}

export async function fetchGift(slug) {
  const res = await fetch(`${API_BASE}/gifts/${encodeURIComponent(slug)}`);
  return handle(res); // full gift record
}
