# Vesture 👗

**Vesture** is a mobile clothing rental application built with React Native (Expo) and Firebase. Customers can browse a clothing catalog, book rental dates, and manage their orders, while admins manage inventory through a dedicated admin role — all wrapped in a dark-mode, luxury-styled UI.

> Built as a group/individual project for the Advanced Mobile Development (AMD) module.

---

## ✨ Features

- **Authentication** — Email/password sign-up and login via Firebase Auth, with role-based routing (`customer` / `admin`)
- **Catalog browsing** — Browse and search rentable clothing items with image galleries
- **Rental booking** — Calendar-based date selection for rentals (`react-native-calendars` + `dayjs`)
- **Cart & orders** — Add items to cart, checkout, and track rental/order history
- **Profile management** — Edit profile and upload avatar images
- **Image uploads** — Item photos and avatars uploaded and served via Cloudinary
- **Admin tools** — Promote-to-admin workflow and inventory management, secured with Firestore rules
- **Dark-mode UI** — Custom luxury-themed design system across the app

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native `0.81.5` + Expo `~54.0.33` (Expo Router `~6.0.23`) |
| Language | TypeScript |
| Navigation | Expo Router (file-based routing) + React Navigation |
| Backend / Auth / DB | Firebase (Auth + Firestore) `^11.10.0` |
| Media storage | Cloudinary (unsigned uploads) |
| State | React Context + custom hooks |
| UI / UX | `expo-linear-gradient`, `react-native-reanimated`, `react-native-gesture-handler`, `react-native-calendars` |
| Other | `expo-image-picker`, `expo-image-manipulator`, `@react-native-async-storage/async-storage`, `dayjs` |

---

## 📂 Project Structure

```
vesture/
├── app/              # Screens & file-based routes (Expo Router)
├── components/        # Reusable UI components
├── context/            # React Context providers (auth, cart, etc.)
├── hooks/               # Custom hooks
├── services/            # Firebase & Cloudinary service layers
├── firebase/            # Firebase config & initialization
├── constants/            # Theme, colors, static config
├── types/                # TypeScript types/interfaces
├── styles/                # Shared styling
├── assets/images/          # App images & icons
├── scripts/                 # Utility scripts (e.g. reset-project)
├── firestore.rules           # Firestore security rules
├── SETUP.md                    # Firebase/Cloudinary setup guide
└── app.json                     # Expo app config
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- npm
- [Expo Go](https://expo.dev/go) app on your phone **or** an Android/iOS emulator
- A free [Firebase](https://console.firebase.google.com) account
- A free [Cloudinary](https://cloudinary.com) account

### 1. Clone the repository

```bash
git clone https://github.com/Himeshika/vesture.git
cd vesture
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Firebase

1. Go to the [Firebase Console](https://console.firebase.google.com) and create a new project (e.g. "Vesture").
2. **Authentication** → Sign-in method → enable **Email/Password**.
3. **Firestore Database** → Create database → start in test mode → pick the region nearest you.
4. Before going to production, apply the rules in [`firestore.rules`](./firestore.rules) to your Firestore instance.
5. Under **Project Settings → General**, add a Web app and copy the Firebase config object into `firebase/config.ts`.

### 4. Configure Cloudinary

1. Create a free account at [cloudinary.com](https://cloudinary.com).
2. Note your **Cloud Name** from the dashboard.
3. Go to **Settings → Upload → Upload presets → Add upload preset**:
   - Signing Mode: **Unsigned**
   - Folder: leave blank (the app automatically uses `vesture/items` and `vesture/avatars`)
4. Copy the Cloud Name and preset name into `services/cloudinaryService.ts`.

### 5. Run the app

```bash
npx expo start
```

Then choose how to open it from the terminal output:
- Scan the QR code with **Expo Go** (fastest way to test on a physical device)
- Press `a` for an **Android emulator**
- Press `i` for an **iOS simulator**
- Press `w` to run in a **browser**

### Making a user an Admin

There's no admin sign-up screen by design. To promote an account:
1. Register normally through the app (this creates the account with `role: "customer"`).
2. In the Firestore console, open `/users/{uid}`.
3. Change the `role` field from `"customer"` to `"admin"`.
4. Sign out and back in on the device — the app will route to the admin tabs.

---

## 📱 Building an APK

This project uses [EAS Build](https://docs.expo.dev/build/introduction/) to produce an installable APK:

```bash
npm install -g eas-cli
eas login
eas build:configure
```

In the generated `eas.json`, make sure the `preview` profile builds an APK (not an AAB):

```json
"preview": {
  "android": {
    "buildType": "apk"
  }
}
```

Then run:

```bash
eas build --platform android --profile preview
```

Once the build finishes, download the `.apk` from the link EAS provides.

📦 **Download the latest build:** *[add your APK link here — GitHub Release asset or cloud storage link]*

---

## 🎥 Demo Video

*[Add your YouTube demo link here]*

---

## 🔒 Security Notes

- Firestore access is restricted via [`firestore.rules`](./firestore.rules) — review and tighten these before any production use.
- Cloudinary uploads use an **unsigned** preset for simplicity; for production, switch to signed uploads via a backend/Cloud Function.

---

## 👩‍💻 Author

Developed by [Himeshika](https://github.com/Himeshika)
