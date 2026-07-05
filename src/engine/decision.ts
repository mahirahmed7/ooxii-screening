import { SCREEN_PASS_LEVEL } from './logmar';

/**
 * Screening decision logic, from Sarah's brief:
 *  - Distance vision per eye: GOOD if that eye reads the 0.2 logMAR line.
 *    Overall distance GOOD only if BOTH eyes are good.
 *  - Near vision (both eyes together): GOOD if measured logMAR <= 0.2.
 *    NOTE: Sarah's email literally says "0.2 or less ... BAD", which
 *    contradicts her own distance rule and the logMAR scale (lower =
 *    better). We implement the internally consistent version
 *    (<= 0.2 = GOOD) — CONFIRM WITH SARAH before field use.
 *  - Distance GOOD + near BAD  -> paddle test (dispense readers).
 *  - Distance BAD (either eye) -> refer for the full OOXii test.
 *  - Distance GOOD + near GOOD -> pass, no further action.
 */

export type Outcome = 'PASS' | 'PADDLE' | 'REFER_FULL_TEST';

export function nearIsGood(nearLogmar: number | null): boolean {
  return nearLogmar !== null && nearLogmar <= SCREEN_PASS_LEVEL + 1e-9;
}

export function decide(
  distanceRightGood: boolean,
  distanceLeftGood: boolean,
  nearGood: boolean
): Outcome {
  const distanceGood = distanceRightGood && distanceLeftGood;
  if (!distanceGood) return 'REFER_FULL_TEST';
  if (!nearGood) return 'PADDLE';
  return 'PASS';
}

export const OUTCOME_LABELS: Record<Outcome, string> = {
  PASS: 'Good distance and near vision — no further testing needed',
  PADDLE: 'Reading glasses needed — paddle test',
  REFER_FULL_TEST: 'Refer for full OOXii vision test',
};

export const PADDLE_POWERS = [1.0, 1.5, 2.0, 2.5, 3.0] as const;
