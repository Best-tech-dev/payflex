# Local Storage Data

This document provides a quick reference for all the items saved to local storage in the app.

| Key                  | Purpose                                   | File(s)                  | When Saved/Removed                     |
|----------------------|-------------------------------------------|--------------------------|----------------------------------------|
| `access_token`       | Stores the authentication token.         | `AuthContext.tsx`        | Saved during login, removed during logout. |
| `hasLaunched`        | Tracks first-time app launch.            | `index.tsx`              | Saved during the first launch check.   |
| `has_seen_onboarding`| Tracks onboarding completion.            | Not explicitly shown, but inferred. | Removed during app data clearing (if applicable). |
| `app_pin`            | Stores the user's app PIN.               | Not explicitly shown, but inferred. | Removed during app data clearing (if applicable). |

---

### **Details**

1. **`access_token`**
   - **Purpose:** Used for authenticating API requests.
   - **File:** `AuthContext.tsx`
   - **Saved:** When the user logs in successfully.
   - **Removed:** When the user logs out.

2. **`hasLaunched`**
   - **Purpose:** Determines if the app is being launched for the first time.
   - **File:** `index.tsx`
   - **Saved:** During the first launch check.
   - **Removed:** Not removed (persists across app launches).

3. **`has_seen_onboarding`**
   - **Purpose:** Tracks whether the user has completed the onboarding process.
   - **File:** Not explicitly shown in the codebase but inferred.
   - **Saved/Removed:** Likely managed during onboarding or app data clearing.

4. **`app_pin`**
   - **Purpose:** Stores the user's app PIN for authentication purposes.
   - **File:** Not explicitly shown in the codebase but inferred.
   - **Saved/Removed:** Likely managed during PIN setup or app data clearing.

---

### **Notes**
- Ensure that sensitive data like `access_token` is securely handled and cleared when no longer needed.
- If additional keys are added to local storage in the future, update this document accordingly.