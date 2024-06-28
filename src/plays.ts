import { orderBy, pick } from "lodash";

export type Clear = "PUC" | "UC" | "EXC" | "C" | "P";

export interface PlayData {
  id?: string;
  name?: string;
  level?: number;
  score?: number;
  clear?: Clear;
}

export class Play {
  id: string;
  name: string;
  level: number;
  score: number;
  clear: Clear;

  constructor({ id, name, level, score, clear }: PlayData = {}) {
    this.id = id ?? crypto.randomUUID();
    this.name = name ?? "";
    this.level = level ?? 17;
    this.score = score ?? 0;
    this.clear = clear ?? "C";
  }

  toJSON() {
    return pick(this, ["name", "level", "score", "clear"]);
  }

  get fracScore() {
    let score = this.score;
    while (score > 1) {
      score /= 10;
    }
    return score;
  }

  get longScore() {
    let score = this.score;
    if (score > 0) {
      while (score * 10 <= 10_000_000) {
        score *= 10;
      }
    }
    return score;
  }

  get shortScore() {
    let score = this.score;
    if (score > 0) {
      while (score % 10 === 0) {
        score /= 10;
      }
    }
    return score;
  }

  get clearCoef() {
    return {
      PUC: 1.1,
      UC: 1.05,
      EXC: 1.02,
      C: 1.0,
      P: 0.5,
    }[this.clear];
  }

  get gradeCoef() {
    const score = this.fracScore;
    if (score >= 0.99) return 1.05;
    if (score >= 0.98) return 1.02;
    if (score >= 0.97) return 1.0;
    if (score >= 0.95) return 0.97;
    if (score >= 0.93) return 0.94;
    if (score >= 0.9) return 0.91;
    if (score >= 0.87) return 0.88;
    if (score >= 0.75) return 0.85;
    if (score >= 0.65) return 0.82;
    return 0.8;
  }

  get grade() {
    const score = this.fracScore;
    if (score >= 0.99) return "S";
    if (score >= 0.98) return "AAA+";
    if (score >= 0.97) return "AAA";
    if (score >= 0.95) return "AA+";
    if (score >= 0.93) return "AA";
    if (score >= 0.9) return "A+";
    if (score >= 0.87) return "A";
    if (score >= 0.75) return "B";
    if (score >= 0.65) return "C";
    return "D";
  }

  get force() {
    return Math.floor(
      this.level * this.fracScore * this.gradeCoef * this.clearCoef * 20,
    );
  }
}

export interface PlaysAction {
  type: "add" | "change" | "delete" | "sort" | "replace";
  index?: number;
  play?: PlayData;
  plays?: PlayData[];
}

export function sortedPlays(plays: Play[]) {
  return orderBy(
    plays,
    ["force", "level", "longScore", (p: Play) => p.name?.toLowerCase() ?? ""],
    ["desc", "desc", "desc", "asc"],
  );
}
