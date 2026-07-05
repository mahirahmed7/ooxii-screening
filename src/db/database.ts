import * as SQLite from 'expo-sqlite';

export interface Screening {
  id: number;
  created_at: string;
  year_of_birth: number;
  gender: string;
  cataract_surgery: string; // right | left | both | neither
  distance_right: string | null; // good | bad
  distance_left: string | null;
  near_result: string | null; // good | bad
  near_logmar: number | null; // null once tested can mean "> 1.0" (see near_worse_than_max)
  near_worse_than_max: number; // 1 if failed the largest near line
  paddle_power: number | null;
  near_logmar_with_glasses: number | null;
  near_with_glasses_worse_than_max: number;
  outcome: string | null; // PASS | PADDLE | REFER_FULL_TEST
}

let db: SQLite.SQLiteDatabase | null = null;

export function getDb(): SQLite.SQLiteDatabase {
  if (!db) {
    db = SQLite.openDatabaseSync('ooxii.db');
    db.execSync(`
      CREATE TABLE IF NOT EXISTS screenings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        created_at TEXT NOT NULL,
        year_of_birth INTEGER NOT NULL,
        gender TEXT NOT NULL,
        cataract_surgery TEXT NOT NULL,
        distance_right TEXT,
        distance_left TEXT,
        near_result TEXT,
        near_logmar REAL,
        near_worse_than_max INTEGER NOT NULL DEFAULT 0,
        paddle_power REAL,
        near_logmar_with_glasses REAL,
        near_with_glasses_worse_than_max INTEGER NOT NULL DEFAULT 0,
        outcome TEXT
      );
    `);
  }
  return db;
}

export function createScreening(
  yearOfBirth: number,
  gender: string,
  cataractSurgery: string
): number {
  const res = getDb().runSync(
    `INSERT INTO screenings (created_at, year_of_birth, gender, cataract_surgery)
     VALUES (?, ?, ?, ?)`,
    [new Date().toISOString(), yearOfBirth, gender, cataractSurgery]
  );
  return Number(res.lastInsertRowId);
}

export function updateScreening(
  id: number,
  fields: Partial<Omit<Screening, 'id'>>
): void {
  const keys = Object.keys(fields);
  if (!keys.length) return;
  const sets = keys.map((k) => `${k} = ?`).join(', ');
  const values = keys.map((k) => (fields as Record<string, unknown>)[k]);
  getDb().runSync(`UPDATE screenings SET ${sets} WHERE id = ?`, [
    ...(values as (string | number | null)[]),
    id,
  ]);
}

export function getScreening(id: number): Screening | null {
  return (
    getDb().getFirstSync<Screening>(
      'SELECT * FROM screenings WHERE id = ?',
      [id]
    ) ?? null
  );
}

export function listScreenings(): Screening[] {
  return getDb().getAllSync<Screening>(
    'SELECT * FROM screenings ORDER BY id DESC'
  );
}

export function deleteScreening(id: number): void {
  getDb().runSync('DELETE FROM screenings WHERE id = ?', [id]);
}
