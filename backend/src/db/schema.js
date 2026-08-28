import { pgTable, serial, text, integer, timestamp, index } from 'drizzle-orm/pg-core';

export const gifts = pgTable(
  'gifts',
  {
    id: serial('id').primaryKey(),
    slug: text('slug').notNull().unique(), // e.g. rahul-to-priya-x7K92m — the token suffix is the real key
    token: text('token').notNull(), // random suffix alone, kept for reference/rotation
    role: text('role').notNull(), // 'brother' | 'sister' — who is sending
    senderName: text('sender_name').notNull(),
    recipientName: text('recipient_name').notNull(),
    giftType: text('gift_type'), // 'photo' | 'amount' | 'rakhi' | null
    giftAmount: integer('gift_amount'),
    giftImageUrl: text('gift_image_url'),
    memoryImageUrl: text('memory_image_url'),
    parentId: integer('parent_id'), // self-reference to the gift this is a reply to
    status: text('status').notNull().default('sent'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    slugIdx: index('gifts_slug_idx').on(table.slug),
  })
);
