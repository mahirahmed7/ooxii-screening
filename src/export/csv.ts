import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Screening } from '../db/database';
import { loadProfile } from '../store/profile';

/**
 * CSV export — the handoff interface to Arya's reporting pipeline.
 * One row per screening; open directly in Excel.
 */

const HEADERS = [
  'id',
  'date_time_utc',
  'year_of_birth',
  'gender',
  'cataract_surgery',
  'distance_vision_right',
  'distance_vision_left',
  'near_vision',
  'near_logmar_no_glasses',
  'paddle_power',
  'near_logmar_with_glasses',
  'outcome',
  'screened_by',
  'staff_id',
];

function logmarCell(v: number | null, worseThanMax: number): string {
  if (worseThanMax) return '>1.0';
  return v === null || v === undefined ? '' : v.toFixed(1);
}

/** Quote a free-text field so commas/quotes/newlines can't break the CSV. */
function esc(v: string): string {
  return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

export function buildCsv(
  rows: Screening[],
  screenedBy = '',
  staffId = ''
): string {
  const lines = [HEADERS.join(',')];
  for (const r of rows) {
    lines.push(
      [
        r.id,
        r.created_at,
        r.year_of_birth,
        r.gender,
        r.cataract_surgery,
        r.distance_right ?? '',
        r.distance_left ?? '',
        r.near_result ?? '',
        logmarCell(r.near_logmar, r.near_worse_than_max),
        r.paddle_power ?? '',
        logmarCell(
          r.near_logmar_with_glasses,
          r.near_with_glasses_worse_than_max
        ),
        r.outcome ?? '',
        esc(screenedBy),
        esc(staffId),
      ].join(',')
    );
  }
  return lines.join('\n');
}

export async function exportAndShare(rows: Screening[]): Promise<void> {
  const profile = await loadProfile();
  const csv = buildCsv(rows, profile.name, profile.staffId);
  const stamp = new Date().toISOString().slice(0, 10);
  const uri = `${FileSystem.cacheDirectory}ooxii-screenings-${stamp}.csv`;
  await FileSystem.writeAsStringAsync(uri, csv, {
    encoding: FileSystem.EncodingType.UTF8,
  });
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, {
      mimeType: 'text/csv',
      dialogTitle: 'Export OOXii screenings',
    });
  }
}
