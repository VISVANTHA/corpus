export class FixedClock {
  constructor(instant) {
    this.instant = instant;
  }
  now() {
    return this.instant;
  }
}

export const DATASET_CLOCK = new FixedClock(new Date("2026-03-15T12:00:00.000Z"));
