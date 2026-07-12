# Vesture Setup

## Firebase

1. Go to https://console.firebase.google.com
2. Create a new project: "Vesture"
3. Enable Authentication → Sign-in method → Email/Password → Enable
4. Create Firestore Database → Start in test mode → Region: asia-south1 (or nearest to you)
5. Apply the security rules from `firestore.rules` before going live
6. Add a Web app under Project Settings → copy the config object into `firebase/config.ts`

## Making a user an Admin

There is no admin sign-up screen. To promote an account:
1. Register normally through the app (creates role: 'customer')
2. In the Firestore console, open /users/{uid}
3. Change the `role` field from "customer" to "admin"
4. Sign out and back in on the device — the app will route to the admin tabs

## Cloudinary

1. Go to https://cloudinary.com and create a free account
2. Note your Cloud Name from the dashboard
3. Go to Settings → Upload → Upload presets → Add upload preset
   - Signing Mode: **Unsigned**
   - Folder: leave blank (the app sets `vesture/items` or `vesture/avatars` per upload)
4. Copy the Cloud Name and preset name into `services/cloudinaryService.ts`

## Install & Run

  npm install
  npx expo start
