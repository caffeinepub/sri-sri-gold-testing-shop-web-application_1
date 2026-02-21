# Specification

## Summary
**Goal:** Restore working authenticated flows across all feature pages, ensure registrations persist and appear in the Owner dashboard, and remove Serial Number from appointment booking and Owner appointment views.

**Planned changes:**
- Fix authentication/authorization so logged-in Customers and Owners can use all feature pages without “Unauthorized” / “Actor not available” runtime errors, and show clear English auth errors when calls are rejected.
- Add backend role/session handshake APIs in `backend/main.mo` so the current caller principal can be registered as Customer or Owner after username/password login.
- Update `frontend/src/pages/LoginPage.tsx` to call the appropriate backend handshake after local credential validation and only navigate after handshake success (otherwise show an English error and remain on login).
- Persist customer registrations in the canister and render the Owner “Users Update” list from canister data (including username, mobile number, registration date).
- Remove the Serial Number field from the customer appointment booking form, keep submission working by sending an empty/placeholder `serialNumber`, and remove Serial Number from the Owner Dashboard appointments table display.
- Improve frontend error reporting for Appointments, Feedback, and Customer registration to surface actual canister error details in English when available.

**User-visible outcome:** After logging in, Customers can look up test results, submit feedback, book appointments (without entering a serial number), and view Daily Gold Updates without runtime errors; Owners can open all dashboard tabs and see newly registered users and appointments without serial numbers, with clearer English error messages when something fails.
