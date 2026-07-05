/**
 * Test engines.
 *
 * Two modes, both using tumbling-E optotypes in 0.1 logMAR steps and a
 * ">= 3 of 5 correct" line-pass criterion (standard ETDRS-style rule,
 * same family of logic used by WHOEyes-style smartphone tests):
 *
 * 1. ThresholdScreen — used for the DISTANCE test. Sarah only needs
 *    good/bad at 0.2 logMAR per eye, so we test the 0.2 line directly
 *    (after one large unscored practice optotype). Fast by design.
 *
 * 2. AcuityStaircase — used for the NEAR tests. The paddle workflow needs
 *    an actual logMAR value, so we descend from 1.0 toward 0.0 and score
 *    the lowest (best) line passed. Failing the first line scores null,
 *    reported as "> 1.0".
 *
 * Early termination within a line: 3 correct -> pass, 3 wrong -> fail.
 */

export type Direction = 'up' | 'down' | 'left' | 'right';
export const DIRECTIONS: Direction[] = ['up', 'down', 'left', 'right'];

export interface Trial {
  level: number;
  direction: Direction;
  practice: boolean;
}

function randomDirection(prev?: Direction): Direction {
  let d: Direction;
  do {
    d = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
  } while (d === prev && Math.random() < 0.7); // discourage streaks, don't ban
  return d;
}

const TRIALS_PER_LINE = 5;
const PASS_COUNT = 3;
const FAIL_COUNT = 3;

abstract class BaseTest {
  protected correct = 0;
  protected wrong = 0;
  protected prevDir?: Direction;
  current: Trial;

  constructor(startLevel: number, practice: boolean) {
    this.current = this.makeTrial(startLevel, practice);
  }

  protected makeTrial(level: number, practice = false): Trial {
    const direction = randomDirection(this.prevDir);
    this.prevDir = direction;
    return { level, direction, practice };
  }

  /** Feed the patient's response. Returns true while the test is running. */
  abstract respond(answer: Direction): boolean;
  abstract get finished(): boolean;
}

/** Single-line good/bad check at a fixed logMAR level (distance screening). */
export class ThresholdScreen extends BaseTest {
  private passed: boolean | null = null;

  constructor(
    readonly level: number = 0.2,
    readonly practiceLevel: number = 0.8
  ) {
    super(practiceLevel, true);
  }

  respond(answer: Direction): boolean {
    if (this.finished) return false;
    if (this.current.practice) {
      // Practice optotype is never scored; move to the real line.
      this.current = this.makeTrial(this.level);
      return true;
    }
    if (answer === this.current.direction) this.correct++;
    else this.wrong++;

    if (this.correct >= PASS_COUNT) this.passed = true;
    else if (this.wrong >= FAIL_COUNT) this.passed = false;

    if (this.finished) return false;
    this.current = this.makeTrial(this.level);
    return true;
  }

  get finished(): boolean {
    return this.passed !== null;
  }

  /** true = GOOD (>= 3/5 at threshold line), false = BAD. */
  get result(): boolean {
    if (this.passed === null) throw new Error('test not finished');
    return this.passed;
  }
}

/** Descending staircase measuring best line passed (near acuity). */
export class AcuityStaircase extends BaseTest {
  private lastPassed: number | null = null;
  private done = false;

  constructor(
    readonly startLevel: number = 1.0,
    readonly floorLevel: number = 0.0,
    readonly step: number = 0.1
  ) {
    super(startLevel, false);
  }

  respond(answer: Direction): boolean {
    if (this.done) return false;
    if (answer === this.current.direction) this.correct++;
    else this.wrong++;

    const level = this.current.level;

    if (this.correct >= PASS_COUNT) {
      this.lastPassed = level;
      const next = Math.round((level - this.step) * 10) / 10;
      if (next < this.floorLevel - 1e-9) {
        this.done = true; // passed the smallest line we show
      } else {
        this.correct = 0;
        this.wrong = 0;
        this.current = this.makeTrial(next);
      }
    } else if (this.wrong >= FAIL_COUNT) {
      this.done = true; // score = last passed line (or null)
    } else {
      this.current = this.makeTrial(level);
    }
    return !this.done;
  }

  get finished(): boolean {
    return this.done;
  }

  /** Best logMAR line passed; null means worse than startLevel. */
  get resultLogmar(): number | null {
    if (!this.done) throw new Error('test not finished');
    return this.lastPassed;
  }
}
