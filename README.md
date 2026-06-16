"# 🎮 Chinna Gaming — Demo Entertainment Platform

> A premium mobile-first gaming UI built with **HTML5 + CSS3 + Vanilla JavaScript + Firebase**, designed for deployment to **GitHub Pages**.
>
> ⚠️ **THIS IS A DEMO ENTERTAINMENT PLATFORM ONLY.**
> No real money transactions, no gambling, no payment gateway integration.
> All balances, deposits, withdrawals, and game outcomes use **virtual demo coins** for UI/UX demonstration purposes.

---

## ✨ Features

- 🔐 Email/Password Auth (Login, Register, Forgot Password) via Firebase Authentication
- 💎 Glassmorphism · dark theme · purple → neon-blue accents · Apple-style animations
- 💰 Virtual wallet with balance, bonus, reward & total coins
- 📥 Demo deposit (quick amounts + QR + countdown + success animation)
- 📤 Demo withdrawal with UPI ID setup & validation
- 🪙 Coin Toss game (animated 3D coin)
- 🎲 Double Coin Toss game (predict HH / HT / TH / TT)
- 👑 5-tier VIP system (Bronze / Silver / Gold / Platinum / Diamond) with XP progress + daily bonus
- 👤 Profile with stats (coins, wins, games)
- 🤝 Referral system (code + share link + reward tracking)
- 🔔 Notifications, 🧾 transaction history with filters, ⚙️ settings
- 🛠️ Admin panel: users, wallet adjustments, deposit/withdrawal requests, game stats, leaderboard
- 📱 Fully mobile-first responsive (Android, iPhone, desktop)
- ⚡ Page load < 2 seconds (no build step, no bundler, no framework overhead)

---

## 📂 Project Structure

```
chinna-gaming/
├── index.html              ← Login page
├── register.html           ← Sign up
├── forgot-password.html    ← Password reset
├── home.html               ← Dashboard / Home
├── wallet.html             ← Wallet & balances
├── deposit.html            ← Deposit amount picker
├── deposit-qr.html         ← QR + UPI + countdown
├── withdraw.html           ← Withdraw + UPI setup
├── games.html              ← Games catalog
├── coin-toss.html          ← Game 1
├── double-coin-toss.html   ← Game 2
├── vip.html                ← VIP tiers & daily bonus
├── profile.html            ← User profile & stats
├── history.html            ← Transaction history + filters
├── settings.html           ← Settings (dark mode, lang, etc.)
├── referral.html           ← Refer & earn
├── notifications.html      ← Notifications list
├── admin.html              ← Admin dashboard
├── style.css               ← All UI styles
├── script.js               ← Shared UI helpers
└── firebase.js             ← Firebase config + helpers
```

---

## 🚀 Quick Start (Local Preview)

Because all pages use ES-Modules and Firebase via CDN, you just need a static file server:

```bash
# Inside this folder
python3 -m http.server 8080
# Open http://localhost:8080
```

Or simply double-click `index.html` after configuring Firebase (some browsers block modules from `file://`, so the http server is recommended).

---

## 🔥 Firebase Setup (Required)

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/) → **Add Project**
2. Name it (e.g. `chinna-gaming`)
3. Disable Google Analytics if you don't need it

### 2. Enable Authentication

1. In your project → **Build → Authentication → Get started**
2. **Sign-in method** tab → enable **Email/Password**

### 3. Enable Firestore Database

1. **Build → Firestore Database → Create database**
2. Start in **production** mode (paste rules below)
3. Choose a region close to your users

### 4. Add a Web App

1. Project Settings (gear icon) → **General**
2. Scroll to **Your apps** → click `</>` (web)
3. Register app (no hosting needed if you'll use GitHub Pages)
4. Copy the `firebaseConfig` object

### 5. Paste the Config

Open `firebase.js` and replace the placeholder:

```js
export const firebaseConfig = {
  apiKey: \"YOUR_API_KEY\",
  authDomain: \"YOUR_PROJECT.firebaseapp.com\",
  projectId: \"YOUR_PROJECT_ID\",
  storageBucket: \"YOUR_PROJECT.appspot.com\",
  messagingSenderId: \"YOUR_SENDER_ID\",
  appId: \"YOUR_APP_ID\"
};
```

### 6. Suggested Firestore Security Rules

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function signedIn() { return request.auth != null; }
    function isOwner(uid) { return signedIn() && request.auth.uid == uid; }
    function isAdmin() { return signedIn() && request.auth.token.email == \"admin@chinnagaming.com\"; }

    match /users/{uid}     { allow read, write: if isOwner(uid) || isAdmin(); }
    match /wallets/{uid}   { allow read, write: if isOwner(uid) || isAdmin(); }
    match /settings/{uid}  { allow read, write: if isOwner(uid) || isAdmin(); }
    match /transactions/{id} { allow read: if signedIn(); allow create: if signedIn(); }
    match /gameHistory/{id}  { allow read, create: if signedIn(); }
    match /withdrawals/{id}  { allow read, create: if signedIn(); allow update: if isAdmin(); }
    match /deposits/{id}     { allow read, create: if signedIn(); }
    match /referrals/{id}    { allow read, create: if signedIn(); }
  }
}
```

### 7. Create the Admin Account

1. Go to **Authentication → Users → Add user**
2. Email: `admin@chinnagaming.com`
3. Password: `Admin@123`

Now log in via `/admin.html`.

---

## 🌐 Deploy to GitHub Pages

```bash
# 1. Push this folder to GitHub as a new repo
git init
git add .
git commit -m \"Chinna Gaming · initial demo\"
git branch -M main
git remote add origin https://github.com/<your-user>/chinna-gaming.git
git push -u origin main

# 2. In GitHub → Settings → Pages
#    Source: Deploy from a branch
#    Branch: main · /(root)
#    Save

# 3. Add your Pages URL to Firebase Authorized Domains:
#    Firebase Console → Authentication → Settings → Authorized domains
#    Add: <your-user>.github.io
```

Your app will be live at:
```
https://<your-user>.github.io/chinna-gaming/
```

---

## 🗄️ Firestore Collections

| Collection      | Purpose                                                                |
|-----------------|------------------------------------------------------------------------|
| `users`         | Profile data (username, email, UID, referral code, UPI, member since)  |
| `wallets`       | `balance`, `bonus`, `reward`, `xp`                                     |
| `transactions`  | All credit/debit ledger entries                                        |
| `gameHistory`   | Every game played (game, pick, result, bet, win, reward)               |
| `withdrawals`   | Withdrawal requests (pending / approved / rejected)                    |
| `deposits`      | Deposit ledger (also mirrored in `transactions`)                       |
| `referrals`     | `{ referrer, referred, reward, createdAt }`                            |
| `settings`      | `darkMode`, `notifications`, `language`                                |
| `notifications` | (Optional) per-user notification feed                                  |

---

## 🎨 Design

| Element        | Value                                                       |
|----------------|-------------------------------------------------------------|
| Theme          | Dark, deep-purple gradients, neon-blue accents              |
| Font           | Space Grotesk (Google Fonts)                                |
| Icons          | Font Awesome 6 (CDN)                                        |
| Style          | Glassmorphism (`backdrop-filter: blur(18px) saturate(140%)`)|
| Motion         | CSS-only animations (3D coin flip, ripple, float, shine)    |
| Layout         | Mobile-first, max-width 480px, bottom nav                   |

---

## 📜 Disclaimer

This project is for **educational and entertainment demonstration only**.
- No real money is transacted.
- All deposits / withdrawals / game outcomes use virtual coins.
- No payment gateways are integrated.
- This is **not gambling software**.

---

## 📝 License

MIT — Free to use, modify, and learn from.
"
