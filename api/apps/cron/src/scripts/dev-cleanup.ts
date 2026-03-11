/**
 * Development cleanup script
 * Wipes all AI-match data from Redis and deletes OpenAI threads
 *
 * Usage: yarn ai:cleanup
 *
 * Make sure your environment variables are set (REDIS_HOST, OPENAI_API_KEY)
 * or run with: source .env && yarn ai:cleanup
 */

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import Redis from 'ioredis';
import OpenAI from 'openai';

// Simple .env loader
function loadEnv() {
  const envPath = resolve(__dirname, '../../../../.env');
  if (existsSync(envPath)) {
    const content = readFileSync(envPath, 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        const value = valueParts.join('=').replace(/^["']|["']$/g, '');
        if (key && !process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  }
}

loadEnv();

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379', 10);
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function main() {
  console.log('\n🧹 AI-Match Development Cleanup\n');
  console.log('================================\n');

  const redis = new Redis({ host: REDIS_HOST, port: REDIS_PORT });
  const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

  try {
    // 1. Get all AI-match sessions to find thread IDs
    console.log('📋 Finding sessions and threads...\n');

    const sessionKeys = await redis.keys('ai-match:session:*');
    const threadIds: string[] = [];

    for (const key of sessionKeys) {
      const data = await redis.get(key);
      if (data) {
        try {
          const session = JSON.parse(data);
          if (session.threadId) {
            threadIds.push(session.threadId);
          }
        } catch {
          // Ignore parse errors
        }
      }
    }

    // Also check thread tracking keys
    const threadKeys = await redis.keys('ai-match:thread:*');
    for (const key of threadKeys) {
      const data = await redis.get(key);
      if (data) {
        try {
          const { threadId } = JSON.parse(data);
          if (threadId && !threadIds.includes(threadId)) {
            threadIds.push(threadId);
          }
        } catch {
          // Ignore parse errors
        }
      }
    }

    console.log(`   Found ${threadIds.length} OpenAI threads to delete`);

    // 2. Delete OpenAI threads
    if (threadIds.length > 0 && OPENAI_API_KEY) {
      console.log('\n🤖 Deleting OpenAI threads...\n');

      let deleted = 0;
      let failed = 0;

      for (const threadId of threadIds) {
        try {
          await openai.beta.threads.delete(threadId);
          deleted++;
          console.log(`   ✓ Deleted thread: ${threadId}`);
        } catch (error: unknown) {
          failed++;
          const message = error instanceof Error ? error.message : 'Unknown error';
          console.log(`   ✗ Failed to delete ${threadId}: ${message}`);
        }
      }

      console.log(`\n   Summary: ${deleted} deleted, ${failed} failed`);
    } else if (!OPENAI_API_KEY) {
      console.log('\n⚠️  OPENAI_API_KEY not set, skipping thread deletion');
    }

    // 3. Delete all AI-match Redis keys
    console.log('\n🗄️  Cleaning Redis...\n');

    const patterns = [
      'ai-match:session:*',
      'ai-match:user-session:*',
      'ai-match:thread:*',
      'ai-match:queue:*',
      'ai-match:rate-limit:*',
      'ai-match:run:*',
      'ai-match:events:*',
      'ai-match:health-status',
    ];

    let totalDeleted = 0;

    for (const pattern of patterns) {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
        totalDeleted += keys.length;
        console.log(`   ✓ Deleted ${keys.length} keys matching: ${pattern}`);
      }
    }

    console.log(`\n   Total Redis keys deleted: ${totalDeleted}`);

    // 4. Summary
    console.log('\n================================');
    console.log('✅ Cleanup complete!\n');

  } catch (error) {
    console.error('\n❌ Cleanup failed:', error);
    process.exit(1);
  } finally {
    await redis.quit();
  }
}

main();
