# OOXii Screen

Rapid vision-screening app for OOXii field campaigns. Replicates a
WHOEyes-style tumbling-E logMAR test (distance + near) so volunteers can
quickly identify people with good vision who can skip the full OOXii test,
and dispense reading glasses via the paddle workflow.

Built with Expo (React Native + TypeScript). Fully offline — all data is
stored on-device in SQLite and exported as CSV for the reporting pipeline.

## Screening flow

1. **Intake** — year of birth, gender, cataract surgery (R/L/both/neither)
2. **Distance test** (per eye, other eye covered, default 3 m)
   GOOD = reads the 0.2 logMAR tumbling-E line (≥3 of 5 correct), after one
   unscored practice optotype. Patient points; tester enters the answer.
3. **Near test** (both eyes, default 40 cm) — full descending staircase
   1.0 → 0.0 logMAR in 0.1 steps, ≥3/5 per line; score = best line passed.
4. **Decision**
   - Distance BAD (either eye) → **refer for full OOXii test**
   - Distance GOOD + near BAD → **paddle test**: client picks preferred
     power (+1.0…+3.0), readers dispensed, near test repeated with glasses
   - Distance GOOD + near GOOD → **pass**, no further testing

> **⚠ Confirm with Sarah:** her email says near vision "0.2 or less … BAD",
> which contradicts the distance rule and the logMAR scale (lower = better).
> The app implements the internally consistent version: **≤0.2 = GOOD**.
> One-line change in `src/engine/decision.ts` if she meant otherwise.

## Physical accuracy — read before field use

Optotype sizes are physically calibrated, not pixel-guessed:

- **Screen calibration** (required, once per device): match the on-screen
  bar to any bank/ID card (85.60 mm). This gives true px/mm.
- **Testing distance**: v1 assumes a fixed, measured distance — carry a
  3 m rope and a 40 cm string. Camera-based automatic distance detection
  (like WHOEyes ADC) is the headline v2 feature; the engine already takes
  distance as a parameter so it drops in cleanly.
- **Validation**: WHOEyes is clinically validated; this reimplementation is
  not. Before campaigns, sanity-check side-by-side against WHOEyes on a
  handful of people.

## CSV schema (handoff to Arya)

`id, date_time_utc, year_of_birth, gender, cataract_surgery,
distance_vision_right, distance_vision_left, near_vision,
near_logmar_no_glasses, paddle_power, near_logmar_with_glasses, outcome`

- vision fields: `good` / `bad`; logMAR fields: `0.0`–`1.0` or `>1.0`
- `outcome`: `PASS` / `PADDLE` / `REFER_FULL_TEST`

## Run locally

```bash
npm install
npx expo start        # scan QR with Expo Go
```

Note: Expo Go is fine for UI development, but calibration/testing accuracy
should always be checked on a real device build.

## Field distribution

**Android (APK via link):**
```bash
npm i -g eas-cli && eas login
eas build --profile field-android --platform android
```
EAS gives you an install link — share it directly with volunteers
(they enable "install unknown apps" once).

**iOS (TestFlight public link):**
Requires an Apple Developer account (US$99/yr).
```bash
eas build --profile field-ios --platform ios
eas submit --profile field-ios --platform ios
```
In App Store Connect → TestFlight, enable a **public link** and share it.
Up to 10,000 testers; builds expire after 90 days, so rebuild ~quarterly.

## Code map

```
src/engine/logmar.ts      physical optotype sizing (the maths)
src/engine/staircase.ts   ThresholdScreen + AcuityStaircase state machines
src/engine/decision.ts    Sarah's good/bad → outcome rules, paddle powers
src/components/           TumblingE, SwipePad, TestRunner, UI kit
src/db/database.ts        SQLite (expo-sqlite), one row per screening
src/export/csv.ts         CSV build + native share sheet
src/store/calibration.ts  px/mm + test distances (AsyncStorage)
app/                      expo-router screens (intake → tests → results)
```

The engine (`src/engine/`) is pure TypeScript with zero React Native
imports — unit-testable and portable straight into the main ooxii.app
later, which is Sarah's stated end goal.
