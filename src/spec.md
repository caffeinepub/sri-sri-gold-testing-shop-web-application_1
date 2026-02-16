# Specification

## Summary
**Goal:** Build a web app for Sri Sri Gold Testing Shop that supports owner/customer authentication, shop info, appointments, test result management and lookup by serial number, feedback, password reset via owner-issued passcode (with 5-minute activation delay), PWA installability, QR/link sharing, and an owner dashboard to manage all data.

**Planned changes:**
- Add custom authentication with two roles: fixed Owner login (Username: Bhanuchand, Password: Prataap) and Customer registration/login (username + mobile number + password), plus a post-login welcome area and route protection.
- Create a Shop Info page available pre-login and post-login showing address, contact numbers, and timings.
- Implement owner-editable content blocks (e.g., welcome message and shop info text) editable from the Owner Dashboard and visible to customers.
- Add Feedback module: customers submit feedback after login; owner views feedback list in dashboard (with submitter identifier and timestamp).
- Add Appointments module: customers request appointments (date/time + note/purpose); owner views/manages appointments in dashboard.
- Add Test Results module: owner creates/edits daily test results (including serial number); customers search/view results by serial number and see a history of prior results per the chosen in-app approach.
- Add Owner Dashboard “Users update” section showing newly registered customers (username, mobile number, and password as requested), plus total customer count and how many can log in.
- Implement Forgot Password flow without SMS/email: customer submits request; owner issues a 4-digit passcode; customer resets password by entering mobile number + passcode; enforce a configurable 5-minute delay before an owner-reset password becomes active with a visible countdown/message.
- Add PWA support (manifest + service worker) with an in-app install prompt/help and proper app name/icon.
- Add a share screen/card that shows a copyable app URL link and an on-screen QR code for that URL.
- Add optional biometric/fingerprint lock via WebAuthn/Passkeys where supported, with settings to enable/disable and clear unsupported-state messaging.
- Enhance Owner Dashboard with explicit Edit actions for applicable records and an “Add column” capability for Test Results (custom field stored and shown to owner and customers).
- Apply a consistent simple modern theme (not blue/purple primary) and add the provided image as a responsive global background with readability overlays.

**User-visible outcome:** Users can view shop details, register/log in as customers or log in as the owner, book appointments, submit feedback, and look up gold test results by serial number; the owner can manage users, appointments, feedback, test results (including custom columns), edit page content, handle password resets with passcodes and a 5-minute activation delay, and share the app via link/QR while customers can install it as a PWA and optionally enable biometric lock on supported devices.
