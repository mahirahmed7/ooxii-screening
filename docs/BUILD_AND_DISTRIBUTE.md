# Building & distributing OOXii Screen (maintainer guide)

This is for whoever produces the builds and sends them to volunteers. The
volunteer-facing steps are in [INSTALL.md](./INSTALL.md).

Builds are produced with **EAS** (Expo Application Services). Profiles live in
`eas.json`.

## One-time setup

```bash
npm install
npm i -g eas-cli
eas login            # free Expo account
```

---

## Android — APK via link (free, recommended)

```bash
eas build --profile field-android --platform android
```

- EAS runs the build in the cloud and gives you a **download page / link**.
- Send that link to volunteers, or download the `.apk` and share the file.
- Nothing expires. Rebuild only when you ship changes.

This uses the `field-android` profile (`distribution: internal`,
`buildType: apk`) — a directly installable APK, not an AAB.

---

## iOS — Option A: TestFlight (recommended, needs $99/yr account)

Requires an **Apple Developer account** (US$99/yr). Volunteers do **not** need
one — see the explanation in [INSTALL.md](./INSTALL.md).

```bash
eas build  --profile field-ios --platform ios
eas submit --profile field-ios --platform ios
```

Then in **App Store Connect → TestFlight**:

1. Wait for the build to finish processing.
2. Create a **public link** (External Testing → enable public link).
3. Share that link with volunteers.

- Up to **10,000 testers**.
- Builds expire after **90 days** — rebuild ~quarterly and testers just tap
  **Update** in TestFlight.

---

## iOS — Option B: Free sideload IPA (no paid account, stopgap)

If the $99/yr account isn't available, produce an `.ipa` volunteers can
sideload with AltStore/Sideloadly using a free Apple ID (7-day expiry — see
[INSTALL.md](./INSTALL.md) for the trade-offs).

The simplest free route is a **local build** signed with a free personal team:

```bash
# Generate the native iOS project, then build/run from Xcode
npx expo prebuild -p ios
npx expo run:ios --device      # deploy straight to a connected iPhone
```

In Xcode, under **Signing & Capabilities**, select your **personal team**
(free Apple ID). To hand an `.ipa` to a volunteer instead of deploying over
USB, Archive in Xcode and export an **ad-hoc / development** build, or use a
tool like AltStore's build flow. Volunteers then follow
[INSTALL.md → Option B](./INSTALL.md).

> This path is intentionally the fallback. Prefer TestFlight for any real
> campaign — the 7-day re-signing cycle does not scale to volunteers in the
> field.

---

## Recommendation

- **Android:** APK link — free and easy, use it.
- **iOS:** TestFlight if you can spend the $99/yr (best volunteer experience);
  free sideload only as a short-term stopgap for a few devices near a computer.
