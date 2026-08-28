import { customAlphabet } from 'nanoid';

// Unambiguous alphabet (no 0/O/1/l/I) for tokens that a human might see or type.
const nanoid = customAlphabet('23456789abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ', 8);

export function slugifyName(name) {
  return (
    (name || '')
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 24) || 'friend'
  );
}

export function makeSlug(senderName, recipientName) {
  const token = nanoid();
  const slug = `${slugifyName(senderName)}-to-${slugifyName(recipientName)}-${token}`;
  return { slug, token };
}
