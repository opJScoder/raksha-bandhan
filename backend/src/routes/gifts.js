import { Router } from 'express';
import multer from 'multer';
import { eq } from 'drizzle-orm';
import { db } from '../db/client.js';
import { gifts } from '../db/schema.js';
import { makeSlug, slugifyName } from '../lib/slug.js';
import { uploadBuffer, isCloudinaryConfigured } from '../lib/cloudinary.js';

export const router = Router();

const ACCEPTED_MIME = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/heic', 'image/heif']);
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!ACCEPTED_MIME.has(file.mimetype)) {
      cb(new Error('Unsupported file type. Please upload a JPG, PNG, WEBP, or HEIC image.'));
      return;
    }
    cb(null, true);
  },
});

function isValidName(name) {
  return typeof name === 'string' && name.trim().length >= 1 && name.trim().length <= 40;
}

// ---- POST /api/upload ------------------------------------------------
router.post('/upload', (req, res) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message || 'Upload failed.' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No image was provided.' });
    }
    if (!isCloudinaryConfigured) {
      return res.status(503).json({ error: 'Image uploads are not configured on this server yet.' });
    }
    try {
      const result = await uploadBuffer(req.file.buffer);
      res.json({ url: result.secure_url });
    } catch (uploadErr) {
      console.error('Cloudinary upload failed:', uploadErr);
      res.status(502).json({ error: 'The photo could not be uploaded. Please try again.' });
    }
  });
});

// ---- POST /api/gifts ---------------------------------------------------
router.post('/gifts', async (req, res) => {
  try {
    const {
      role,
      senderName,
      recipientName,
      giftType = null,
      giftAmount = null,
      giftImageUrl = null,
      memoryImageUrl = null,
      parentSlug = null,
    } = req.body || {};

    if (role !== 'brother' && role !== 'sister') {
      return res.status(400).json({ error: 'Role must be "brother" or "sister".' });
    }
    if (!isValidName(senderName) || !isValidName(recipientName)) {
      return res.status(400).json({ error: 'Please provide valid names for both people.' });
    }
    if (giftAmount !== null && giftAmount !== undefined) {
      const n = Number(giftAmount);
      if (!Number.isFinite(n) || n < 0 || n > 10_000_000) {
        return res.status(400).json({ error: 'That amount does not look valid.' });
      }
    }

    let parentId = null;
    if (parentSlug) {
      const [parent] = await db.select({ id: gifts.id }).from(gifts).where(eq(gifts.slug, parentSlug)).limit(1);
      parentId = parent?.id ?? null;
    }

    const { slug, token } = makeSlug(senderName, recipientName);

    const [created] = await db
      .insert(gifts)
      .values({
        slug,
        token,
        role,
        senderName: senderName.trim(),
        recipientName: recipientName.trim(),
        giftType,
        giftAmount: giftAmount === null || giftAmount === undefined || giftAmount === '' ? null : Math.round(Number(giftAmount)),
        giftImageUrl,
        memoryImageUrl,
        parentId,
      })
      .returning({ id: gifts.id, slug: gifts.slug });

    const origin = process.env.PUBLIC_APP_URL || req.headers.origin || '';
    res.status(201).json({
      slug: created.slug,
      url: origin ? `${origin.replace(/\/$/, '')}/gift/${created.slug}` : `/gift/${created.slug}`,
    });
  } catch (err) {
    console.error('Failed to create gift:', err);
    res.status(500).json({ error: 'Could not send the letter right now. Please try again.' });
  }
});

// ---- GET /api/gifts/:slug ----------------------------------------------
router.get('/gifts/:slug', async (req, res) => {
  try {
    const [gift] = await db.select().from(gifts).where(eq(gifts.slug, req.params.slug)).limit(1);
    if (!gift) {
      return res.status(404).json({ error: 'This letter could not be found.' });
    }
    res.json({
      slug: gift.slug,
      role: gift.role,
      senderName: gift.senderName,
      recipientName: gift.recipientName,
      giftType: gift.giftType,
      giftAmount: gift.giftAmount,
      giftImageUrl: gift.giftImageUrl,
      memoryImageUrl: gift.memoryImageUrl,
      createdAt: gift.createdAt,
    });
  } catch (err) {
    console.error('Failed to fetch gift:', err);
    res.status(500).json({ error: 'Could not load this letter right now.' });
  }
});

// Re-export slugify in case other routes need consistent slugs later.
export { slugifyName };
