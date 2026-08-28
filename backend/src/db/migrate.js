import 'dotenv/config';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db } from './client.js';

async function run() {
  await migrate(db, { migrationsFolder: './drizzle' });
  console.log('Migrations applied.');
  process.exit(0);
}

run().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
