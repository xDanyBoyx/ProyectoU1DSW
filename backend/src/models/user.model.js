import { db } from "../db/firebase.js";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where
} from "firebase/firestore";

const userCollection = collection(db, "users");

const User = {
  async addUser(userData) {
    const docRef = await addDoc(userCollection, userData);
    const newDoc = await getDoc(docRef);
    return { id: docRef.id, ...newDoc.data() };
  },

  async findByEmail(email) {
    try {
      const q = query(userCollection, where("mail", "==", email));
      const snapshot = await getDocs(q);

      if (snapshot.empty) return null;

      const userData = snapshot.docs[0].data();
      return { id: snapshot.docs[0].id, ...userData };
    } catch (error) {
      console.error("Error al buscar usuario por email:", error.message);
      throw error;
    }
  },

  async findAll() {
    const snapshot = await getDocs(userCollection);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  async findById(id) {
    const docRef = doc(db, "users", id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
  },

  async updateUser(id, data) {
    const docRef = doc(db, "users", id);
    await updateDoc(docRef, data);
    const updatedSnap = await getDoc(docRef);
    return { id, ...updatedSnap.data() };
  },

  async deleteUser(id) {
    const docRef = doc(db, "users", id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return false;
    await deleteDoc(docRef);
    return true;
  }
};

export default User;