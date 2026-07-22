# Installing OOXii Screen on a volunteer's phone

This is the **volunteer-facing** install guide. Whoever maintains the app
produces the build files first — see
[BUILD_AND_DISTRIBUTE.md](./BUILD_AND_DISTRIBUTE.md).

There is no App Store / Play Store listing. You install the app directly.

---

## Which method should we use?

| Platform | Recommended | Free-only stopgap |
|----------|-------------|-------------------|
| **Android** | Install the APK from a link (easy, free) | — same thing, already free |
| **iOS** | **TestFlight** (easiest for volunteers) | AltStore sideload (free, but fiddly + expires every 7 days) |

### The TestFlight question, answered

> *Do volunteers need a developer account or special software for TestFlight?*

- **No developer account** is ever needed by a volunteer.
- Volunteers only install the free **TestFlight** app from the App Store once,
  then tap an invite link. No Mac, no cable, no re-signing.
- The **$99/yr Apple Developer account is only needed by the org** to publish
  the build — not by the people installing it.

So on iOS, **TestFlight is the least friction by far**. The only reason to use
free sideloading is to avoid the $99/yr entirely, and it comes at a real cost:
the app **stops working after 7 days** until it is re-signed from a computer.
For a field campaign, TestFlight is strongly recommended if the $99/yr is
acceptable; use sideloading only as a temporary, small-scale stopgap.

---

## Android — install the APK (easy, free)

1. The maintainer sends you a **download link** (from EAS) or an `.apk` file.
2. Open the link on the phone and download the APK.
3. Tap the downloaded file. Android will ask to allow installing from this
   source — tap **Settings → Allow from this source** (you only do this once),
   then go back and tap **Install**.
4. Open **OOXii Screen** and do the one-time [calibration](./USER_GUIDE.md).

That's the whole process. Nothing expires; the app keeps working until you
uninstall it.

---

## iOS — Option A: TestFlight (recommended)

1. Install **TestFlight** from the App Store (free, made by Apple).
2. The maintainer sends you a **public invite link**. Open it on the iPhone.
3. TestFlight opens → tap **Accept**, then **Install**.
4. Open **OOXii Screen** and do the one-time [calibration](./USER_GUIDE.md).

Notes for volunteers:
- The app may show an "expires in N days" banner. When a new build is pushed,
  just open TestFlight and tap **Update**. No reinstalling from scratch.
- Builds expire after 90 days, so the maintainer rebuilds roughly quarterly.

---

## iOS — Option B: Free sideload with AltStore (stopgap only)

Use this **only** if the $99/yr Apple Developer account is not available. Be
aware of the trade-offs before choosing it:

- **Needs a computer** (Mac or Windows) running **AltServer** to set up.
- Uses a **free Apple ID**, which means the app **stops working after 7 days**
  and must be **re-signed** by reconnecting to that computer. AltStore can do
  this automatically over Wi-Fi *if the computer is on the same network*, but
  in the field that usually isn't the case.
- A free Apple ID can only sideload **3 apps at a time**.

This makes it workable for a **handful of phones near a computer**, but poor
for a spread-out volunteer campaign. Steps:

1. On a computer, install **AltStore / AltServer** from
   <https://altstore.io> and follow its setup (it installs AltStore onto the
   iPhone over a USB cable using a free Apple ID).
2. Get the **`.ipa`** build file from the maintainer and copy it to the phone
   (AirDrop, Files, or a download link).
3. On the iPhone, open **AltStore → My Apps → +**, pick the `.ipa`, and enter
   the free Apple ID when prompted.
4. On the iPhone: **Settings → General → VPN & Device Management** → trust the
   developer profile.
5. Open **OOXii Screen** and do the one-time [calibration](./USER_GUIDE.md).
6. **Every 7 days**, reconnect to the AltServer computer to refresh the app
   (AltStore → My Apps → refresh), or it will stop launching.

> **Sideloadly** (<https://sideloadly.io>) is an alternative to AltStore with
> the same free-Apple-ID limitations (7-day expiry). Pick whichever you find
> easier; the trade-offs are identical.

### Why not an AltStore "source"?

AltStore lets developers publish a *source* (a hosted JSON list of apps) so an
app shows up and auto-updates inside AltStore. It sounds like an app store, but
it **does not remove any of the constraints above** for AltStore Classic
(worldwide): each volunteer still needs a **computer + AltServer** to install,
a **free Apple ID**, and the app still **expires every 7 days**. The only
version without those limits is **AltStore PAL**, which is **EU-only** and still
requires a paid Apple Developer account plus Apple's Core Technology Fee — at
which point TestFlight is simpler and works everywhere. So a source doesn't
make sideloading viable for a spread-out, non-technical volunteer team.

---

## After installing (all platforms)

Every phone must be **calibrated once** before screening, and each volunteer
should read the [User Guide](./USER_GUIDE.md). Calibration is per-device, so
do it on each phone you deploy.
