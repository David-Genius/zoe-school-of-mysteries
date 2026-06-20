// src/firebase.js
// ─────────────────────────────────────────────────────
// STEP 1: Go to https://console.firebase.google.com
// STEP 2: Create a new project called "zoe-school"
// STEP 3: Click "Web" app icon (</>), register app
// STEP 4: Copy your config values below
// STEP 5: In Firebase Console:
//   → Authentication → Get Started → Enable Email/Password
//   → Firestore Database → Create Database → Start in test mode
// ─────────────────────────────────────────────────────
// import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { onSnapshot } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// import { db } from "./firebase";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  deleteUser,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  collection,
  query,
  orderBy,
  serverTimestamp,
  where,
  limit,
  addDoc,
} from "firebase/firestore";

// ── PASTE YOUR FIREBASE CONFIG HERE ──
const firebaseConfig = {
  apiKey: "AIzaSyAcP5U2iLoHBzo_41SeR2CUMOc07gJ4LBE",
  authDomain: "zoe-school.firebaseapp.com",
  projectId: "zoe-school",
  storageBucket: "zoe-school.firebasestorage.app",
  messagingSenderId: "242221979084",
  appId: "1:242221979084:web:cc51d0fb2b50f3e0a7b969",
  measurementId: "G-VXMYZ5CE5Z"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);
export const storage = getStorage(app);

// ─────────────────────────────────────────────────────
// AUTH FUNCTIONS
// ─────────────────────────────────────────────────────

/** Register new user */
export async function registerUser({ name, email, password }) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: name });

  // Save user profile to Firestore
  await setDoc(doc(db, "users", cred.user.uid), {
    uid:       cred.user.uid,
    name,
    email,
    role:      "member",          // "member" | "admin"
    status:    "active",          // "active" | "banned"
    createdAt: serverTimestamp(),
    lastSeen:  serverTimestamp(),
    givingTotal: 0,
    avatar:    name.charAt(0).toUpperCase(),
  });

  // Log activity
  await logActivity(cred.user.uid, "account_created", "New account created");

  return cred.user;
}

/** Sign in existing user */
// export async function loginUser({ email, password }) {
//   const cred = await signInWithEmailAndPassword(auth, email, password);

//   // Update last seen
//   await updateDoc(doc(db, "users", cred.user.uid), {
//     lastSeen: serverTimestamp(),
//   });

//   await logActivity(cred.user.uid, "login", "User signed in");
//   return cred.user;
// }


export async function loginUser({ email, password }) {
  const cred = await signInWithEmailAndPassword(auth, email, password);

  // SAFE: wrap Firestore calls so they don't break login
  try {
    const userRef = doc(db, "users", cred.user.uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      await updateDoc(userRef, {
        lastSeen: serverTimestamp(),
      });
    } else {
      await setDoc(userRef, {
        uid: cred.user.uid,
        email: cred.user.email,
        role: "member",
        status: "active",
        createdAt: serverTimestamp(),
        lastSeen: serverTimestamp(),
        givingTotal: 0,
        avatar: cred.user.email?.charAt(0).toUpperCase(),
      });
    }

    await addDoc(collection(db, "activity"), {
      uid: cred.user.uid,
      type: "login",
      description: "User signed in",
      timestamp: serverTimestamp(),
    });

  } catch (err) {
    console.log("Firestore failed but login still works:", err);
  }

  return cred.user;
}


/** Sign out */
export async function logoutUser() {
  if (auth.currentUser) {
    await logActivity(auth.currentUser.uid, "logout", "User signed out");
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      lastSeen: serverTimestamp(),
    });
  }
  await signOut(auth);
}

/** Get current user profile from Firestore */
export const getUserProfile = async (uid) => {
  const docSnap = await getDoc(doc(db, "users", uid));
  return docSnap.exists() ? docSnap.data() : null;
};

/** Send password reset email */
export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email);
}

/** Listen to auth state changes */
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

// ─────────────────────────────────────────────────────
// ACTIVITY LOG
// ─────────────────────────────────────────────────────

export async function logActivity(uid, type, description) {
  await addDoc(collection(db, "activity"), {
    uid,
    type,
    description,
    timestamp: serverTimestamp(),
  });
}

// ─────────────────────────────────────────────────────
// GIVING FUNCTIONS
// ─────────────────────────────────────────────────────
// export async function saveGiving({
//   uid,
//   name,
//   email,
//   amount,
//   fund,
//   frequency,
//   method,
//   reference = null,
//   status = "success"
// }) {
//   const docRef = await addDoc(collection(db, "giving"), {
//     uid: uid || "guest",
//     name,
//     email,
//     amount: Number(amount),
//     fund,
//     frequency,
//     method,
//     reference,
//     status,
//     createdAt: serverTimestamp(),
//   });

//   // Update user giving total if logged in
//   if (uid) {
//     const userRef = doc(db, "users", uid);
//     const userSnap = await getDoc(userRef);

//     if (userSnap.exists()) {
//       const current = userSnap.data().givingTotal || 0;

//       await updateDoc(userRef, {
//         givingTotal: current + Number(amount),
//       });
//     }

//     await logActivity(
//       uid,
//       "giving",
//       `Gave ₦${Number(amount).toLocaleString()} to ${fund}`
//     );
//   }

//   return docRef.id;
// }


export async function saveGiving({
  uid,
  name,
  email,
  amount,
  fund,
  frequency,
  method,
  reference = null,
  status = "success"
}) {
  const docRef = await addDoc(collection(db, "giving"), {
    uid: uid || "guest",
    name,
    email,
    amount: Number(amount),
    fund,
    frequency,
    method,
    reference,
    status,
    createdAt: serverTimestamp(),
  });

  if (uid) {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const current = userSnap.data().givingTotal || 0;

      await updateDoc(userRef, {
        givingTotal: current + Number(amount),
      });
    }

    await logActivity(
      uid,
      "giving",
      `Gave ₦${Number(amount).toLocaleString()} to ${fund}`
    );
  }

  return docRef.id;
}



export async function getUserGiving(uid) {
  const q = query(
    collection(db, "giving"),
    where("uid", "==", uid),
    orderBy("createdAt", "desc"),
    limit(20)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ─────────────────────────────────────────────────────
// ADMIN FUNCTIONS
// ─────────────────────────────────────────────────────

/** Get all users (admin only) */
export async function getAllUsers() {
  const snap = await getDocs(query(collection(db, "users"), orderBy("createdAt", "desc")));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/** Get all giving records (admin only) */


export function listenToGiving(callback) {
  const q = query(collection(db, "giving"), orderBy("createdAt", "desc"));

  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    callback(data);
  });
}

/** Get recent activity (admin only) */
export async function getRecentActivity(limitNum = 50) {
  const snap = await getDocs(query(collection(db, "activity"), orderBy("timestamp", "desc"), limit(limitNum)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/** Ban a user */
export async function banUser(uid) {
  await updateDoc(doc(db, "users", uid), { status: "banned" });
  await logActivity("admin", "ban_user", `User ${uid} was banned`);
}

/** Unban a user */
export async function unbanUser(uid) {
  await updateDoc(doc(db, "users", uid), { status: "active" });
  await logActivity("admin", "unban_user", `User ${uid} was unbanned`);
}

/** Delete a user from Firestore (auth deletion requires admin SDK) */
export async function deleteUserRecord(uid) {
  await deleteDoc(doc(db, "users", uid));
  await logActivity("admin", "delete_user", `User ${uid} was deleted`);
}

/** Promote user to admin */
export async function promoteToAdmin(uid) {
  await updateDoc(doc(db, "users", uid), { role: "admin" });
  await logActivity("admin", "promote", `User ${uid} promoted to admin`);
}

/** Get dashboard stats */
export async function getDashboardStats() {
  const [usersSnap, givingSnap] = await Promise.all([
    getDocs(collection(db, "users")),
    getDocs(collection(db, "giving")),
  ]);

  const users   = usersSnap.docs.map(d => d.data());
  const givings = givingSnap.docs.map(d => d.data());

  const totalGiving  = givings.reduce((s, g) => s + (g.amount || 0), 0);
  const activeUsers  = users.filter(u => u.status === "active").length;
  const bannedUsers  = users.filter(u => u.status === "banned").length;
  const adminCount   = users.filter(u => u.role === "admin").length;

  // Giving by fund
  const byFund = {};
  givings.forEach(g => {
    byFund[g.fund] = (byFund[g.fund] || 0) + (g.amount || 0);
  });

  return {
    totalUsers:   users.length,
    activeUsers,
    bannedUsers,
    adminCount,
    totalGiving,
    totalGivingTx: givings.length,
    byFund,
  };
}

// ─────────────────────────────────────────────────────
// PRAYER FUNCTIONS
// ─────────────────────────────────────────────────────

export async function getPrayerStats() {
  const snap = await getDocs(query(
    collection(db, "prayer_requests"),
    orderBy("createdAt", "desc")
  ));
  const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));

  return {
    total:      all.length,
    pending:    all.filter(r => r.status === "pending").length,
    praying:    all.filter(r => r.status === "praying").length,
    answered:   all.filter(r => r.status === "answered").length,
    urgent:     all.filter(r => r.urgent === true).length,
    recent:     all.slice(0, 30),
    byCategory: all.reduce((acc, r) => {
      if (r.category) acc[r.category] = (acc[r.category] || 0) + 1;
      return acc;
    }, {}),
  };
}

export async function updatePrayerStatus(id, status) {
  await updateDoc(doc(db, "prayer_requests", id), { status });
}



export async function getAllGiving() {
  const snap = await getDocs(
    query(collection(db, "giving"), orderBy("createdAt", "desc"))
  );

  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}


export const updateUserProfile = async (uid, data) => {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, data);
};

// ─────────────────────────────────────────
// SERMON FUNCTIONS 🎧
// ─────────────────────────────────────────


/** Upload sermon metadata */
export async function addSermon(data) {
  return await addDoc(collection(db, "sermons"), {
    ...data,
    createdAt: Date.now(),
  });
}

/** Get all sermons */
export async function getAllSermons() {
  const snap = await getDocs(collection(db, "sermons"));

  const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));

  // sort safely in JS (instead of Firestore orderBy)
  return data.sort((a, b) => {
    const aTime = a.createdAt?.seconds || 0;
    const bTime = b.createdAt?.seconds || 0;
    return bTime - aTime;
  });
}

/** Delete sermon (admin) */
export async function deleteSermon(id) {
  await deleteDoc(doc(db, "sermons", id));
}



// import { collection, getDocs } from "firebase/firestore";
// import { db } from "./firebaseConfig";

// export const getAllEvents = async () => {
//   const snap = await getDocs(collection(db, "events"));

//   return snap.docs.map((doc) => ({
//     id: doc.id,
//     ...doc.data(),
//   }));
// };



export const addEvent = async (data) => {
  return await addDoc(collection(db, "events"), {
    ...data,
    createdAt: serverTimestamp()
  });
};

export const getAllEvents = async () => {
  const snap = await getDocs(collection(db, "events"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const deleteEvent = async (id) => {
  await deleteDoc(doc(db, "events", id));
};

export const updateEvent = async (id, data) => {
  await updateDoc(doc(db, "events", id), data);
};

export const getUpcomingEvents = async () => {
  const q = query(
    collection(db, "events"),
    where("type", "==", "upcoming")
  );

  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};


export const getPastEvents = async () => {
  const q = query(
    collection(db, "events"),
    where("type", "==", "past")
  );

  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};


export const getDailyEvent = async () => {
  const q = query(
    collection(db, "events"),
    where("type", "==", "daily"),
    limit(1)
  );

  const snap = await getDocs(q);
  return snap.docs.docs.map(d => ({ id: d.id, ...d.data() }));
};


export const demoteAdmin = async (uid) => {
  await updateDoc(doc(db, "users", uid), { role: "member" });
  await logActivity(uid, "demote", `Admin role removed from user`);
};


// ─────────────────────────────────────────────────────
// BLOG FUNCTIONS
// ─────────────────────────────────────────────────────

export async function addBlog(data) {
  return await addDoc(collection(db, "blogs"), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

export async function getAllBlogs() {
  const snap = await getDocs(
    query(collection(db, "blogs"), orderBy("createdAt", "desc"))
  );
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getPublishedBlogs() {
  const snap = await getDocs(
    query(
      collection(db, "blogs"),
      where("published", "==", true),
      orderBy("createdAt", "desc")
    )
  );
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function updateBlog(id, data) {
  await updateDoc(doc(db, "blogs", id), data);
}

export async function deleteBlog(id) {
  await deleteDoc(doc(db, "blogs", id));
}