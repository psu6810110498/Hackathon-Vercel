/**
 * BullMQ Background Job Queue
 * Handles long-running AI analysis jobs with priority + retry
 */

import { Queue, Worker, Job } from 'bullmq';
import { getRedis } from '../../lib/redis';
import { analyzeWriting, analyzeReading, generateExercises } from '../ai/analyzer';
import { getCachedResult, setCachedResult } from '../cache/aiCache';

// ============================================
// Queue setup
// ============================================

const QUEUE_NAME = 'ai-analysis';

let queue: Queue | null = null;

export function getQueue(): Queue {
  if (!queue) {
    queue = new Queue(QUEUE_NAME, {
      connection: getRedis().duplicate(),
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 },
        removeOnComplete: { count: 100 },
        removeOnFail: { count: 50 },
      },
    });
  }
  return queue;
}

// ============================================
// Job types
// ============================================

interface WritingJobData {
  type: 'analysis:writing';
  userId: string;
  text: string;
  hskLevel: number;
}

interface ReadingJobData {
  type: 'analysis:reading';
  userId: string;
  passage: string;
  hskLevel: number;
}

interface ExerciseJobData {
  type: 'exercise:generate';
  userId: string;
  weakPatterns: string;
  hskTarget: number;
}

export type AIJobData = WritingJobData | ReadingJobData | ExerciseJobData;

// ============================================
// Enqueue jobs
// ============================================

export async function enqueueJob(
  data: AIJobData,
  isPremium: boolean = false
): Promise<string> {
  const q = getQueue();
  const job = await q.add(data.type, data, {
    priority: isPremium ? 1 : 5, // Lower = higher priority
  });
  return job.id!;
}

/**
 * Get job status by ID
 */
export async function getJobStatus(jobId: string) {
  const q = getQueue();
  const job = await q.getJob(jobId);
  if (!job) return null;

  const state = await job.getState();
  return {
    id: job.id,
    state,
    progress: job.progress,
    result: state === 'completed' ? job.returnvalue : null,
    error: state === 'failed' ? job.failedReason : null,
    attempts: job.attemptsMade,
  };
}

// ============================================
// Worker (processes jobs)
// ============================================

export function startWorker() {
  const worker = new Worker(
    QUEUE_NAME,
    async (job: Job<AIJobData>) => {
      console.log(`[Worker] Processing job ${job.id}: ${job.data.type}`);

      switch (job.data.type) {
        case 'analysis:writing': {
          const { text, hskLevel, userId } = job.data;
          await job.updateProgress(10);

          // Check cache first
          const cached = await getCachedResult('writing', text, hskLevel, userId);
          if (cached) {
            await job.updateProgress(100);
            return cached;
          }

          await job.updateProgress(30);
          const result = await analyzeWriting(text, hskLevel as 3 | 4 | 5 | 6);
          if (!result) throw new Error('AI analysis failed');

          await setCachedResult('writing', text, hskLevel, result, userId);
          await job.updateProgress(100);
          return result;
        }

        case 'analysis:reading': {
          const { passage, hskLevel, userId } = job.data;
          await job.updateProgress(10);

          const cached = await getCachedResult('reading', passage, hskLevel, userId);
          if (cached) {
            await job.updateProgress(100);
            return cached;
          }

          await job.updateProgress(30);
          const result = await analyzeReading(passage, hskLevel as 1 | 2 | 3 | 4 | 5 | 6);
          if (!result) throw new Error('AI analysis failed');

          await setCachedResult('reading', passage, hskLevel, result, userId);
          await job.updateProgress(100);
          return result;
        }

        case 'exercise:generate': {
          const { weakPatterns, hskTarget } = job.data;
          await job.updateProgress(30);
          const result = await generateExercises(weakPatterns, hskTarget);
          if (!result) throw new Error('Exercise generation failed');
          await job.updateProgress(100);
          return result;
        }

        default:
          throw new Error(`Unknown job type: ${(job.data as any).type}`);
      }
    },
    {
      connection: getRedis().duplicate(),
      concurrency: 3,
    }
  );

  worker.on('completed', (job) => {
    console.log(`[Worker] Job ${job.id} completed`);
  });

  worker.on('failed', (job, err) => {
    console.error(`[Worker] Job ${job?.id} failed:`, err.message);
  });

  return worker;
}
