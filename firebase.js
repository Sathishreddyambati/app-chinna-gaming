"// =============================================================
// Chinna Gaming - Firebase Configuration & Helpers
// DEMO ENTERTAINMENT PLATFORM ONLY. No real money / no gambling.
// All balances are virtual demo coins.
// =============================================================

// 1. Replace this config object with your own Firebase project config
//    Get it from: Firebase Console -> Project Settings -> General -> Your apps
import { initializeApp } from \"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js\";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut,
  updateProfile
} from \"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js\";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  addDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
  increment,
  onSnapshot,
  deleteDoc
} from \"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js\";

export const firebaseConfig = {
  apiKey: \"YOUR_API_KEY\",
  authDomain: \"YOUR_PROJECT.firebaseapp.com\",
  projectId: \"YOUR_PROJECT_ID\",
  storageBucket: \"YOUR_PROJECT.appspot.com\",
  messagingSenderId: \"YOUR_SENDER_ID\",
  appId: \"YOUR_APP_ID\"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Re-export everything so other modules can import via firebase.js
export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut,
  updateProfile,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  addDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
  increment,
  onSnapshot,
  deleteDoc
};

// =============================================================
// Admin credentials (demo)
// =============================================================
export const ADMIN_EMAIL = \"admin@chinnagaming.com\";
export const ADMIN_PASSWORD = \"Admin@123\"; // For demo display only

// =============================================================
// VIP tier definitions
// =============================================================
export const VIP_TIERS = [
  { name: \"Bronze\",   minXp: 0,     dailyBonus: 50,  color: \"#cd7f32\" },
  { name: \"Silver\",   minXp: 500,   dailyBonus: 100, color: \"#c0c0c0\" },
  { name: \"Gold\",     minXp: 2000,  dailyBonus: 200, color: \"#ffd700\" },
  { name: \"Platinum\", minXp: 5000,  dailyBonus: 400, color: \"#e5e4e2\" },
  { name: \"Diamond\",  minXp: 10000, dailyBonus: 800, color: \"#b9f2ff\" }
];

export function getVipTier(xp) {
  let tier = VIP_TIERS[0];
  for (const t of VIP_TIERS) if (xp >= t.minXp) tier = t;
  const idx = VIP_TIERS.indexOf(tier);
  const next = VIP_TIERS[idx + 1] || null;
  const progress = next
    ? Math.min(100, ((xp - tier.minXp) / (next.minXp - tier.minXp)) * 100)
    : 100;
  return { tier, next, progress, index: idx };
}

// =============================================================
// User helpers
// =============================================================
export async function createUserDocument(user, extra = {}) {
  const uid = user.uid;
  const referralCode = \"CG\" + uid.substring(0, 6).toUpperCase();
  const userRef = doc(db, \"users\", uid);
  await setDoc(userRef, {
    uid,
    email: user.email,
    username: extra.username || user.email.split(\"@\")[0],
    avatar: extra.username ? extra.username[0].toUpperCase() : \"U\",
    memberSince: serverTimestamp(),
    referralCode,
    referredBy: extra.referredBy || null,
    upiId: null
  });

  await setDoc(doc(db, \"wallets\", uid), {
    balance: 1000,     // signup bonus virtual coins
    bonus: 500,
    reward: 0,
    xp: 0
  });

  await setDoc(doc(db, \"settings\", uid), {
    darkMode: true,
    notifications: true,
    language: \"English\"
  });

  await addDoc(collection(db, \"transactions\"), {
    uid,
    type: \"bonus\",
    amount: 1000,
    note: \"Welcome signup bonus\",
    createdAt: serverTimestamp()
  });

  // referral handling
  if (extra.referredBy) {
    try {
      const q = query(collection(db, \"users\"), where(\"referralCode\", \"==\", extra.referredBy));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const refUser = snap.docs[0];
        const refUid = refUser.data().uid;
        await updateDoc(doc(db, \"wallets\", refUid), { reward: increment(100) });
        await addDoc(collection(db, \"referrals\"), {
          referrer: refUid,
          referred: uid,
          reward: 100,
          createdAt: serverTimestamp()
        });
        await addDoc(collection(db, \"transactions\"), {
          uid: refUid,
          type: \"reward\",
          amount: 100,
          note: \"Referral reward\",
          createdAt: serverTimestamp()
        });
      }
    } catch (e) { console.warn(\"Referral linking failed\", e); }
  }
  return referralCode;
}

export async function getUserData(uid) {
  const u = await getDoc(doc(db, \"users\", uid));
  const w = await getDoc(doc(db, \"wallets\", uid));
  return {
    user: u.exists() ? u.data() : null,
    wallet: w.exists() ? w.data() : null
  };
}

export async function logTransaction(uid, type, amount, note = \"\") {
  await addDoc(collection(db, \"transactions\"), {
    uid, type, amount, note,
    createdAt: serverTimestamp()
  });
}

export async function addCoins(uid, field, amount) {
  await updateDoc(doc(db, \"wallets\", uid), { [field]: increment(amount) });
}

// Guard - redirect to login if not authenticated
export function requireAuth(callback) {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = \"index.html\";
    } else {
      callback(user);
    }
  });
}
"
