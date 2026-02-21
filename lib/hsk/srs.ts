/**
 * Spaced Repetition (SM-2 / FSRS) via ts-fsrs
 * scheduleReview(cardId, rating), getDueCards(userId), createFlashcard(word, userId)
 */

import { fsrs, createEmptyCard, Rating } from "ts-fsrs";
import type { Card } from "ts-fsrs";
import { prisma } from "@/lib/db/prisma";

const scheduler = fsrs();

/** Serialize Card for DB (Date -> ISO string) */
function cardToState(card: Card): Record<string, unknown> {
  return {
    due: card.due.toISOString(),
    stability: card.stability,
    difficulty: card.difficulty,
    elapsed_days: card.elapsed_days,
    scheduled_days: card.scheduled_days,
    learning_steps: card.learning_steps,
    reps: card.reps,
    lapses: card.lapses,
    state: card.state,
    last_review: card.last_review?.toISOString() ?? null,
  };
}

/** Deserialize Card from DB */
function stateToCard(state: unknown): Card {
  const s = state as Record<string, unknown>;
  return {
    due: new Date(s.due as string),
    stability: Number(s.stability),
    difficulty: Number(s.difficulty),
    elapsed_days: Number(s.elapsed_days ?? 0),
    scheduled_days: Number(s.scheduled_days ?? 0),
    learning_steps: Number(s.learning_steps ?? 0),
    reps: Number(s.reps ?? 0),
    lapses: Number(s.lapses ?? 0),
    state: Number(s.state ?? 0),
    last_review: s.last_review ? new Date(s.last_review as string) : undefined,
  };
}

/** Rating from client: 1=Again, 2=Hard, 3=Good, 4=Easy */
const RATING_MAP = {
  1: Rating.Again,
  2: Rating.Hard,
  3: Rating.Good,
  4: Rating.Easy,
} as const;

/**
 * Schedule a review: apply rating and persist new card state
 */
export async function scheduleReview(
  cardId: string,
  rating: 1 | 2 | 3 | 4
): Promise<{ due: Date; scheduled_days: number } | null> {
  const flashcard = await prisma.flashcard.findUnique({
    where: { id: cardId },
  });
  if (!flashcard) return null;

  const card = stateToCard(flashcard.fsrsState);
  const grade = RATING_MAP[rating];
  const now = new Date();
  const result = scheduler.next(card, now, grade);

  await prisma.flashcard.update({
    where: { id: cardId },
    data: {
      fsrsState: cardToState(result.card) as object,
      due: result.card.due,
      updatedAt: now,
    },
  });

  return {
    due: result.card.due,
    scheduled_days: result.card.scheduled_days,
  };
}

/**
 * Get cards due for review for a user (due <= now)
 */
export async function getDueCards(userId: string) {
  const now = new Date();
  return prisma.flashcard.findMany({
    where: { userId, due: { lte: now } },
    orderBy: { due: "asc" },
  });
}

/**
 * Create a new flashcard for a word (empty FSRS card, due now)
 */
export async function createFlashcard(
  word: string,
  userId: string,
  hskLevel: number
) {
  const now = new Date();
  const card = createEmptyCard(now);
  const state = cardToState(card);

  return prisma.flashcard.upsert({
    where: {
      userId_word: { userId, word },
    },
    create: {
      userId,
      word,
      hskLevel,
      fsrsState: state as object,
      due: now,
    },
    update: {
      fsrsState: state as object,
      due: now,
      updatedAt: now,
    },
  });
}
